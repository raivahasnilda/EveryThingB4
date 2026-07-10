// =========================================================================
// APP.JS — LOGIKA HALAMAN CUSTOMER (KATALOG + KERANJANG)
// -------------------------------------------------------------------------
// Data produk sekarang diambil dari EB4Store (js/store.js), yang membaca
// localStorage "eb4_products". Ini membuat perubahan yang dilakukan admin
// di Admin/admin_produk.html langsung tampak di halaman ini juga.
// =========================================================================

let products = EB4Store.getProducts();

// STATE GLOBAL KERANJANG
let cart = JSON.parse(localStorage.getItem("eb4_cart")) || [];

// JALANKAN SAAT HALAMAN SELESAI DIMUAT
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderBestsellerSection();
  renderCartVisual();
  renderStoreRating();
});

// Kalau admin mengubah produk di tab lain, refresh katalog otomatis (live)
EB4Store.onExternalChange((e) => {
  if (e.key === EB4Store.KEYS.PRODUCTS) {
    products = EB4Store.getProducts();
    renderProducts();
    renderBestsellerSection();
  }
});

// 2. FUNGSI UTAMA RENDER PRODUK KE GRID KATALOG
function renderProducts(itemsToRender = products) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  if (itemsToRender.length === 0) {
    grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px; font-weight:600; color:#8A8A8A;">Pakaian tidak ditemukan.</p>`;
    return;
  }

  grid.innerHTML = itemsToRender
    .map(
      (p) => `
        <div class="product-card">
            ${p.bestseller ? '<span class="bestseller-badge">🔥 Best Seller</span>' : ""}
            <img src="${p.img}" alt="${p.name}" onclick="openProductModal(${p.id})" style="cursor: pointer;" title="Klik untuk lihat detail baju">
            <h3 onclick="openProductModal(${p.id})" style="cursor: pointer; color: #4A4A4A; font-size:16px; margin-top:10px;">${p.name}</h3>
            <p style="color:#DB7A91; font-weight:bold; margin: 5px 0 15px;">Rp ${p.price.toLocaleString("id-ID")}</p>
            <button onclick="addToCart(${p.id})" style="width:100%; padding:10px; background:#ffd6e0; border:none; border-radius:12px; font-weight:600; cursor:pointer;">🛒 Tambah ke Keranjang</button>
        </div>
    `,
    )
    .join("");
}

// 2b. SECTION BEST SELLER DI ATAS HALAMAN (highlight produk terlaris)
function renderBestsellerSection() {
  const grid = document.getElementById("bestseller-grid");
  const section = document.getElementById("bestseller-section");
  if (!grid || !section) return;

  const bestsellers = products.filter((p) => p.bestseller);

  if (bestsellers.length === 0) {
    section.style.display = "none";
    return;
  }
  section.style.display = "block";

  grid.innerHTML = bestsellers
    .map(
      (p) => `
        <div class="product-card">
            <span class="bestseller-badge">🔥 Best Seller</span>
            <img src="${p.img}" alt="${p.name}" onclick="openProductModal(${p.id})" style="cursor: pointer;" title="Klik untuk lihat detail baju">
            <h3 onclick="openProductModal(${p.id})" style="cursor: pointer; color: #4A4A4A; font-size:16px; margin-top:10px;">${p.name}</h3>
            <p style="color:#DB7A91; font-weight:bold; margin: 5px 0 15px;">Rp ${p.price.toLocaleString("id-ID")}</p>
            <button onclick="addToCart(${p.id})" style="width:100%; padding:10px; background:#ffd6e0; border:none; border-radius:12px; font-weight:600; cursor:pointer;">🛒 Tambah ke Keranjang</button>
        </div>
    `,
    )
    .join("");
}

// 3b. FILTER KHUSUS PRODUK BEST SELLER (dari tombol "🔥 Best Seller" di katalog)
function filterBestseller(buttonElement) {
  document
    .querySelectorAll(".btn-filter")
    .forEach((btn) => btn.classList.remove("active"));
  if (buttonElement) buttonElement.classList.add("active");

  const filtered = products.filter((p) => p.bestseller);
  renderProducts(filtered);
}

// RATING TOKO — dihitung otomatis dari kartu ulasan (data-rating) di section #ulasan,
// supaya angkanya selalu jujur/sesuai dengan ulasan yang benar-benar ditampilkan.
function renderStoreRating() {
  const cards = document.querySelectorAll("#ulasan .testimonial-card[data-rating]");
  if (cards.length === 0) return;

  let total = 0;
  cards.forEach((c) => (total += parseFloat(c.dataset.rating) || 0));
  const average = total / cards.length;
  const rounded = Math.round(average * 10) / 10;

  const heroBadge = document.getElementById("store-rating-badge");
  if (heroBadge) {
    heroBadge.innerHTML = `⭐ <strong>${rounded}</strong>/5 &nbsp;•&nbsp; ${cards.length} Ulasan Pelanggan`;
  }

  const ulasanSummary = document.getElementById("ulasan-rating-summary");
  if (ulasanSummary) {
    ulasanSummary.innerHTML = `⭐ ${rounded} / 5 — berdasarkan ${cards.length} ulasan pelanggan`;
  }
}


function searchProduct() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const filtered = products.filter((p) => p.name.toLowerCase().includes(query));
  renderProducts(filtered);
}

// 4. FITUR FILTER KATEGORI (PILIH TOMBOL)
function filterCategory(category, buttonElement) {
  document
    .querySelectorAll(".btn-filter")
    .forEach((btn) => btn.classList.remove("active"));

  if (buttonElement) buttonElement.classList.add("active");

  if (category === "all") {
    renderProducts(products);
  } else {
    const filtered = products.filter((p) => p.category === category);
    renderProducts(filtered);
  }
}

// 5. MANAJEMEN SIDEBAR KERANJANG
function toggleCart() {
  const sidebar = document.getElementById("cart-sidebar");
  if (sidebar) sidebar.classList.toggle("active");
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;
  const cartItem = cart.find((item) => item.id === id);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();

  const sidebar = document.getElementById("cart-sidebar");
  if (sidebar) sidebar.classList.add("active");
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
}

function ubahKuantitas(id, perubahan) {
  const item = cart.find((item) => item.id === id);
  if (item) {
    item.quantity += perubahan;
    if (item.quantity <= 0) {
      cart = cart.filter((item) => item.id !== id);
    }
  }
  updateCart();
}

function updateCart() {
  localStorage.setItem("eb4_cart", JSON.stringify(cart));
  renderCartVisual();
}

function renderCartVisual() {
  const cartItemsDiv = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total-price");

  if (!cartItemsDiv) return;

  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = `<p style="text-align:center; color:#8A8A8A; font-size:13px; padding:20px 0;">Keranjang belanja masih kosong.</p>`;
    if (cartCount) cartCount.innerText = "0";
    if (cartTotal) cartTotal.innerText = "Rp 0";
    return;
  }

  cartItemsDiv.innerHTML = cart
    .map((item) => {
      total += item.price * item.quantity;
      count += item.quantity;
      return `
            <div class="cart-item" style="display: flex; gap: 10px; margin-bottom: 15px; border-bottom: 1px dashed #ffd6e0; padding-bottom: 10px; align-items: center;">
                <img src="${item.img}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 6px;">
                <div style="flex: 1;">
                    <h4 style="font-size: 13px; margin: 0; color: #4A4A4A;">${item.name}</h4>
                    <small style="color:#6B6B6B;">${item.quantity} x Rp ${item.price.toLocaleString("id-ID")}</small>
                </div>
                <div style="display: flex; align-items: center; gap: 5px;">
                    <button onclick="ubahKuantitas(${item.id}, -1)" style="padding: 2px 6px; cursor: pointer; border:1px solid #ffd6e0; background:white;">-</button>
                    <span style="font-size: 13px; font-weight: bold;">${item.quantity}</span>
                    <button onclick="ubahKuantitas(${item.id}, 1)" style="padding: 2px 6px; cursor: pointer; border:1px solid #ffd6e0; background:white;">+</button>
                </div>
                <button onclick="removeFromCart(${item.id})" style="background:none; border:none; color:#DB7A91; cursor:pointer; font-weight:bold; font-size:11px;">Hapus</button>
            </div>
        `;
    })
    .join("");

  if (cartCount) cartCount.innerText = count;
  if (cartTotal) cartTotal.innerText = `Rp ${total.toLocaleString("id-ID")}`;
  localStorage.setItem("eb4_total_sementara", total);
}

// 6. POP-UP MODAL DETAIL PRODUK
function openProductModal(id) {
  const product = products.find((p) => p.id === id);
  if (!product) return;

  const modal = document.getElementById("product-modal");
  const modalImg = document.getElementById("modal-product-img");
  const modalName = document.getElementById("modal-product-name");
  const modalPrice = document.getElementById("modal-product-price");
  const modalDesc = document.querySelector("#product-modal .modal-info-box p");

  if (modalImg) modalImg.src = product.img;
  if (modalName) modalName.textContent = product.name;
  if (modalPrice)
    modalPrice.textContent = `Rp ${product.price.toLocaleString("id-ID")}`;
  if (modalDesc) modalDesc.textContent = product.description;

  let actionBox = document.getElementById("modal-action-box");
  if (!actionBox) {
    actionBox = document.createElement("div");
    actionBox.id = "modal-action-box";
    actionBox.style.marginTop = "20px";
    document
      .querySelector("#product-modal .modal-info-box")
      .appendChild(actionBox);
  }
  actionBox.innerHTML = `
    <button onclick="addToCart(${product.id}); closeProductModalDirect();" style="width:100%; padding:12px; background:#DB7A91; color:white; border:none; border-radius:20px; font-weight:600; cursor:pointer;">
        🛒 Masukkan ke Keranjang Pakaian
    </button>
  `;

  if (modal) modal.style.display = "flex";
}

function closeProductModalDirect() {
  const modal = document.getElementById("product-modal");
  if (modal) modal.style.display = "none";
}

function closeProductModal(event) {
  const modal = document.getElementById("product-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

// FUNGSI UNTUK MERESET KERANJANG DAN PINDAH KE HALAMAN SUKSES
function prosesSelesaiBelanja() {
  alert(
    "Terima kasih! Pembayaran Anda sedang diverifikasi oleh sistem EverythingsByFour. ✨",
  );
  localStorage.removeItem("eb4_cart");
  window.location.href = "order_success.html";
}
