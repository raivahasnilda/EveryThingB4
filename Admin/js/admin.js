// =========================================================================
// ADMIN.JS — KERANGKA BERSAMA UNTUK SEMUA HALAMAN ADMIN
// -------------------------------------------------------------------------
// Setiap halaman Admin/*.html (kecuali admin_login.html) hanya perlu:
//   1. Punya <div id="admin-sidebar"></div> dan <div id="admin-topbar"></div>
//   2. Memanggil AdminUI.init({ page: "dashboard", title: "Dashboard" })
// supaya sidebar, notifikasi, dan proteksi login otomatis terpasang & sama
// persis di semua halaman.
// =========================================================================

const AdminUI = (function () {
  const NAV_ITEMS = [
    { key: "dashboard", label: "Dashboard", icon: "🏠", href: "admin_dashboard.html" },
    { key: "produk", label: "Produk", icon: "👗", href: "admin_produk.html" },
    { key: "pesanan", label: "Pesanan", icon: "🧾", href: "admin_pesanan.html" },
    { key: "livechat", label: "Live Chat", icon: "💬", href: "admin_livechat.html" },
  ];

  function showFatalError(message) {
    document.body.innerHTML = `
      <div style="
        font-family: 'Poppins', sans-serif;
        max-width: 640px;
        margin: 60px auto;
        background: #fff5f5;
        border: 2px solid #ffb3b3;
        border-radius: 20px;
        padding: 30px 35px;
        color: #4a4a4a;
      ">
        <h2 style="color:#d94b4b; margin-top:0;">⚠️ Halaman Admin Tidak Bisa Dimuat</h2>
        <p style="line-height:1.7; font-size:14px;">${message}</p>
        <p style="line-height:1.7; font-size:13px; color:#8a8a8a;">
          Tips: hapus folder proyek yang lama, lalu ekstrak ulang file .zip yang diberikan
          agar semua file (termasuk yang tersembunyi di dalam folder <code>js/</code> dan
          <code>Admin/js/</code>, <code>Admin/css/</code>) ikut tersalin dengan lengkap dan
          nama file/ekstensinya tidak berubah.
        </p>
      </div>
    `;
  }

  function renderSidebar(activeKey) {
    const el = document.getElementById("admin-sidebar");
    if (!el) return;
    el.innerHTML = `
      <div class="admin-brand">
        <span class="admin-brand-mark">EB4</span>
        <div>
          <div class="admin-brand-name">EverythingsByFour</div>
          <div class="admin-brand-sub">Panel Admin Toko</div>
        </div>
      </div>
      <nav class="admin-nav">
        ${NAV_ITEMS.map(
          (item) => `
          <a href="${item.href}" class="admin-nav-link ${item.key === activeKey ? "active" : ""}">
            <span class="admin-nav-icon">${item.icon}</span>
            <span>${item.label}</span>
            ${item.key === "pesanan" ? '<span id="nav-badge-pesanan" class="admin-nav-badge" style="display:none;"></span>' : ""}
            ${item.key === "livechat" ? '<span id="nav-badge-chat" class="admin-nav-badge" style="display:none;"></span>' : ""}
          </a>`,
        ).join("")}
      </nav>
      <button id="admin-logout-btn" class="admin-logout-btn">🚪 Keluar</button>
    `;

    document.getElementById("admin-logout-btn").addEventListener("click", () => {
      if (confirm("Yakin ingin keluar dari Panel Admin?")) {
        EB4Store.logout();
        window.location.href = "admin_login.html";
      }
    });
  }

  function renderTopbar(title) {
    const el = document.getElementById("admin-topbar");
    if (!el) return;
    el.innerHTML = `
      <h1 class="admin-page-title">${title}</h1>
      <div class="admin-topbar-actions">
        <div class="admin-bell-wrap">
          <button id="admin-bell-btn" class="admin-bell-btn" aria-label="Notifikasi">
            🔔
            <span id="admin-bell-badge" class="admin-nav-badge" style="display:none;"></span>
          </button>
          <div id="admin-bell-dropdown" class="admin-bell-dropdown"></div>
        </div>
      </div>
    `;

    document.getElementById("admin-bell-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      const dd = document.getElementById("admin-bell-dropdown");
      dd.classList.toggle("open");
      if (dd.classList.contains("open")) renderBellDropdown();
    });

    document.addEventListener("click", () => {
      document.getElementById("admin-bell-dropdown")?.classList.remove("open");
    });
  }

  function renderBellDropdown() {
    const dd = document.getElementById("admin-bell-dropdown");
    if (!dd) return;
    const unreadOrders = EB4Store.getOrders().filter((o) => o.unread).slice(0, 5);
    const unreadChats = EB4Store.getConversations()
      .filter((c) => c.unreadForAdmin)
      .slice(0, 5);

    if (unreadOrders.length === 0 && unreadChats.length === 0) {
      dd.innerHTML = `<div class="admin-bell-empty">Tidak ada notifikasi baru ✨</div>`;
      return;
    }

    let html = "";
    if (unreadOrders.length > 0) {
      html += `<div class="admin-bell-section-title">Pesanan Baru</div>`;
      html += unreadOrders
        .map(
          (o) => `
        <a href="admin_pesanan.html" class="admin-bell-item">
          <span class="admin-bell-item-icon">🧾</span>
          <div>
            <div class="admin-bell-item-title">${o.nama}</div>
            <div class="admin-bell-item-sub">${EB4Store.formatRupiah(o.totalHarga)} • ${EB4Store.timeAgo(o.createdAt)}</div>
          </div>
        </a>`,
        )
        .join("");
    }
    if (unreadChats.length > 0) {
      html += `<div class="admin-bell-section-title">Pesan Baru</div>`;
      html += unreadChats
        .map((c) => {
          const last = c.messages[c.messages.length - 1];
          return `
        <a href="admin_livechat.html" class="admin-bell-item">
          <span class="admin-bell-item-icon">💬</span>
          <div>
            <div class="admin-bell-item-title">${c.customerName}</div>
            <div class="admin-bell-item-sub">${last ? last.text.slice(0, 40) : ""}</div>
          </div>
        </a>`;
        })
        .join("");
    }
    dd.innerHTML = html;
  }

  function refreshBadges() {
    const orderCount = EB4Store.getUnreadOrderCount();
    const chatCount = EB4Store.getUnreadChatCountForAdmin();
    const total = orderCount + chatCount;

    const bellBadge = document.getElementById("admin-bell-badge");
    if (bellBadge) {
      bellBadge.style.display = total > 0 ? "flex" : "none";
      bellBadge.textContent = total > 9 ? "9+" : total;
    }
    const navBadgePesanan = document.getElementById("nav-badge-pesanan");
    if (navBadgePesanan) {
      navBadgePesanan.style.display = orderCount > 0 ? "flex" : "none";
      navBadgePesanan.textContent = orderCount > 9 ? "9+" : orderCount;
    }
    const navBadgeChat = document.getElementById("nav-badge-chat");
    if (navBadgeChat) {
      navBadgeChat.style.display = chatCount > 0 ? "flex" : "none";
      navBadgeChat.textContent = chatCount > 9 ? "9+" : chatCount;
    }
  }

  function playNotifSound() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
      /* abaikan browser yang memblokir audio otomatis */
    }
  }

  function init(opts) {
    EB4Store.requireAuth("admin_login.html");
    renderSidebar(opts.page);
    renderTopbar(opts.title);
    refreshBadges();

    // Live update lintas-tab: kalau ada pesanan/chat baru dari tab customer,
    // badge & bunyi notifikasi langsung update tanpa refresh manual.
    EB4Store.onExternalChange((e) => {
      if (e.key === EB4Store.KEYS.ORDERS || e.key === EB4Store.KEYS.CHATS) {
        refreshBadges();
        if (e.key === EB4Store.KEYS.ORDERS) playNotifSound();
        if (typeof window.onAdminDataChange === "function") {
          window.onAdminDataChange(e);
        }
      }
    });

    // Fallback polling ringan (berguna untuk demo di tab yang sama)
    setInterval(refreshBadges, 4000);
  }

  return { init, refreshBadges, NAV_ITEMS };
})();
