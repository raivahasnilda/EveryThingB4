// =========================================================================
// CHATWIDGET.JS — WIDGET LIVE CHAT UNTUK HALAMAN CUSTOMER
// -------------------------------------------------------------------------
// Widget ini disuntikkan lewat JavaScript (bukan ditulis manual di setiap
// file HTML) supaya tampilannya selalu identik di index.html, checkout.html,
// dan order_success.html, dan supaya tidak ada markup ganda/rusak.
//
// Pesan disimpan lewat EB4Store (localStorage "eb4_chats") sehingga bisa
// dibaca & dibalas satu-persatu oleh admin di Admin/admin_livechat.html.
// =========================================================================

(function () {
  function buildWidgetHTML() {
    const wrapper = document.createElement("div");
    wrapper.id = "chat-widget-pembeli";
    wrapper.innerHTML = `
      <button id="btn-buka-chat" title="Chat dengan Admin" aria-label="Buka live chat">
        <span id="chat-bubble-icon">💬</span>
        <span id="chat-bubble-badge" class="chat-bubble-badge" style="display:none;">0</span>
      </button>

      <div id="kotak-chat-pembeli">
        <div class="chat-widget-header">
          <span>Customer Support EB4 🌸</span>
          <button id="btn-tutup-chat" aria-label="Tutup chat">✕</button>
        </div>

        <div id="chat-nama-gate" class="chat-nama-gate">
          <p>Halo! Siapa nama kamu supaya admin bisa membalas obrolan ini? ✨</p>
          <input type="text" id="input-nama-pembeli" placeholder="Nama kamu..." maxlength="40" />
          <button id="btn-mulai-chat" type="button">Mulai Chat</button>
        </div>

        <div id="isi-pesan-pembeli" class="chat-widget-messages" style="display:none;"></div>

        <form id="form-kirim-pesan" class="chat-widget-form" style="display:none;">
          <input type="text" id="input-pesan-pembeli" placeholder="Ketik pesan kamu..." autocomplete="off" required />
          <button type="submit">Kirim</button>
        </form>
      </div>
    `;
    document.body.appendChild(wrapper);
  }

  function bubble(text, sender) {
    const isAdmin = sender === "admin";
    return `
      <div class="chat-bubble ${isAdmin ? "chat-bubble-admin" : "chat-bubble-customer"}">
        ${escapeHtml(text)}
      </div>
    `;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function renderMessages(customerId) {
    const box = document.getElementById("isi-pesan-pembeli");
    if (!box) return;
    const conv = EB4Store.getConversation(customerId);
    const messages = conv ? conv.messages : [];

    if (messages.length === 0) {
      box.innerHTML = bubble(
        "Halo! Ada yang bisa kami bantu seputar koleksi pakaian hari ini? ✨",
        "admin",
      );
    } else {
      box.innerHTML = messages.map((m) => bubble(m.text, m.sender)).join("");
    }
    box.scrollTop = box.scrollHeight;
  }

  function updateBadge() {
    const { id } = EB4Store.getCustomerIdentity();
    const badge = document.getElementById("chat-bubble-badge");
    const boxOpen =
      document.getElementById("kotak-chat-pembeli")?.classList.contains("active");
    if (!badge) return;
    const unread = EB4Store.isUnreadForCustomer(id) && !boxOpen;
    if (unread) {
      badge.style.display = "flex";
      badge.textContent = "•";
    } else {
      badge.style.display = "none";
    }
  }

  function initWidget() {
    buildWidgetHTML();

    const { id, name } = EB4Store.getCustomerIdentity();
    const chatBox = document.getElementById("kotak-chat-pembeli");
    const gate = document.getElementById("chat-nama-gate");
    const messagesBox = document.getElementById("isi-pesan-pembeli");
    const form = document.getElementById("form-kirim-pesan");

    function openWidget() {
      chatBox.classList.add("active");
      if (name) {
        gate.style.display = "none";
        messagesBox.style.display = "flex";
        form.style.display = "flex";
        renderMessages(id);
        EB4Store.markConversationReadByCustomer(id);
      } else {
        gate.style.display = "block";
        messagesBox.style.display = "none";
        form.style.display = "none";
      }
      updateBadge();
    }

    function closeWidget() {
      chatBox.classList.remove("active");
      updateBadge();
    }

    document.getElementById("btn-buka-chat").addEventListener("click", () => {
      if (chatBox.classList.contains("active")) {
        closeWidget();
      } else {
        openWidget();
      }
    });

    document.getElementById("btn-tutup-chat").addEventListener("click", closeWidget);

    document.getElementById("btn-mulai-chat").addEventListener("click", () => {
      const nameInput = document.getElementById("input-nama-pembeli");
      const namaBaru = nameInput.value.trim();
      if (!namaBaru) {
        nameInput.focus();
        return;
      }
      EB4Store.setCustomerName(namaBaru);
      gate.style.display = "none";
      messagesBox.style.display = "flex";
      form.style.display = "flex";
      renderMessages(id);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("input-pesan-pembeli");
      const text = input.value.trim();
      if (!text) return;
      const identity = EB4Store.getCustomerIdentity();
      EB4Store.sendCustomerMessage(identity.id, identity.name, text);
      input.value = "";
      renderMessages(identity.id);
    });

    // Update live saat admin membalas dari tab lain
    EB4Store.onExternalChange((e) => {
      if (e.key === EB4Store.KEYS.CHATS) {
        if (chatBox.classList.contains("active") && messagesBox.style.display !== "none") {
          renderMessages(EB4Store.getCustomerIdentity().id);
          EB4Store.markConversationReadByCustomer(EB4Store.getCustomerIdentity().id);
        }
        updateBadge();
      }
    });

    updateBadge();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
