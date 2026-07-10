/* =========================================================================
   EB4 STORE — "Backend palsu" berbasis localStorage
   ------------------------------------------------------------------------
   File ini adalah SATU-SATUNYA tempat baca/tulis data toko (produk,
   pesanan, live chat, sesi admin). Baik halaman customer (index.html,
   checkout.html) maupun halaman admin (Admin/*.html) memanggil fungsi
   di sini, supaya datanya selalu terhubung/sinkron.

   Catatan penting untuk presentasi tugas:
   Karena proyek ini murni HTML/CSS/JS tanpa server, "database" nyata
   digantikan localStorage milik browser. Ini artinya data akan sinkron
   secara real-time selama customer & admin dibuka di BROWSER YANG SAMA
   (boleh beda tab, itu justru caranya). Ini sudah cukup untuk keperluan
   demo/tugas kuliah. Untuk produksi sungguhan, ganti seluruh fungsi di
   bawah ini dengan pemanggilan REST API / database asli.
   ========================================================================= */

const EB4Store = (function () {
  const KEYS = {
    PRODUCTS: "eb4_products",
    ORDERS: "eb4_orders",
    CHATS: "eb4_chats",
    CUSTOMER_ID: "eb4_customer_id",
    CUSTOMER_NAME: "eb4_customer_name",
    ADMIN_SESSION: "eb4_admin_session",
    USERS: "eb4_users",
    CURRENT_USER: "eb4_current_user",
  };

  const ADMIN_CREDENTIALS = {
    username: "everythingsbyfour",
    password: "1747",
  };

  // -----------------------------------------------------------------------
  // UTIL
  // -----------------------------------------------------------------------
  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed === null || parsed === undefined ? fallback : parsed;
    } catch (e) {
      console.error("EB4Store: gagal membaca", key, e);
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error("EB4Store: gagal menyimpan", key, e);
      return false;
    }
  }

  function formatRupiah(num) {
    return `Rp ${Number(num || 0).toLocaleString("id-ID")}`;
  }

  function generateId(prefix) {
    return `${prefix}${Date.now().toString().slice(-6)}${Math.floor(
      Math.random() * 900 + 100,
    )}`;
  }

  function timeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const min = Math.floor(diff / 60000);
    if (min < 1) return "Baru saja";
    if (min < 60) return `${min} menit lalu`;
    const hour = Math.floor(min / 60);
    if (hour < 24) return `${hour} jam lalu`;
    const day = Math.floor(hour / 24);
    return `${day} hari lalu`;
  }

  function formatClock(timestamp) {
    const d = new Date(timestamp);
    return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  }

  // Format lengkap & akurat: "8 Juli 2026, 17.30 WIB" — selalu dalam
  // zona waktu Jakarta (WIB) supaya waktu pesanan konsisten untuk semua
  // pembeli/admin, apapun zona waktu perangkat mereka.
  function formatDateTime(timestamp) {
    if (!timestamp) return "-";
    const formatted = new Date(timestamp).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
    return `${formatted} WIB`;
  }

  // Panggil callback setiap kali data eb4_* berubah di tab LAIN
  // (tab customer <-> tab admin). Ini yang membuat notifikasi & chat "live".
  function onExternalChange(callback) {
    window.addEventListener("storage", (e) => {
      if (e.key && e.key.startsWith("eb4_")) callback(e);
    });
  }

  // -----------------------------------------------------------------------
  // PRODUK
  // -----------------------------------------------------------------------
  function getProducts() {
    let list = readJSON(KEYS.PRODUCTS, null);
    if (!list) {
      // Seed pertama kali dari default_products.js
      const seed =
        typeof defaultProducts !== "undefined" ? defaultProducts : [];
      list = JSON.parse(JSON.stringify(seed));
      writeJSON(KEYS.PRODUCTS, list);
    }
    return list;
  }

  function saveProducts(list) {
    writeJSON(KEYS.PRODUCTS, list);
  }

  function addProduct(product) {
    const list = getProducts();
    const nextId =
      list.length > 0 ? Math.max(...list.map((p) => p.id)) + 1 : 1;
    const newProduct = { ...product, id: nextId };
    list.push(newProduct);
    saveProducts(list);
    return newProduct;
  }

  function updateProduct(id, data) {
    const list = getProducts();
    const idx = list.findIndex((p) => p.id === Number(id));
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...data, id: list[idx].id };
    saveProducts(list);
    return list[idx];
  }

  function deleteProduct(id) {
    const list = getProducts().filter((p) => p.id !== Number(id));
    saveProducts(list);
  }

  function getProductById(id) {
    return getProducts().find((p) => p.id === Number(id)) || null;
  }

  function resetProductsToDefault() {
    const seed = typeof defaultProducts !== "undefined" ? defaultProducts : [];
    saveProducts(JSON.parse(JSON.stringify(seed)));
  }

  // -----------------------------------------------------------------------
  // PESANAN
  // -----------------------------------------------------------------------
  const ORDER_STATUSES = ["Baru", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];

  function getOrders() {
    return readJSON(KEYS.ORDERS, []).sort((a, b) => b.createdAt - a.createdAt);
  }

  function addOrder(orderData) {
    const list = readJSON(KEYS.ORDERS, []);
    const now = Date.now();
    const newOrder = {
      id: generateId("EB4-ORD"),
      status: "Baru",
      unread: true,
      createdAt: now,
      statusHistory: [{ status: "Baru", time: now }],
      ...orderData,
    };
    list.push(newOrder);
    writeJSON(KEYS.ORDERS, list);
    return newOrder;
  }

  function updateOrderStatus(id, status) {
    const list = readJSON(KEYS.ORDERS, []);
    const idx = list.findIndex((o) => o.id === id);
    if (idx === -1) return null;
    list[idx].status = status;
    if (!Array.isArray(list[idx].statusHistory)) list[idx].statusHistory = [];
    list[idx].statusHistory.push({ status, time: Date.now() });
    writeJSON(KEYS.ORDERS, list);
    return list[idx];
  }

  function getOrderById(id) {
    return readJSON(KEYS.ORDERS, []).find((o) => o.id === id) || null;
  }

  function getOrdersByUser(userId) {
    return getOrders().filter((o) => o.userId === userId);
  }

  function markOrderRead(id) {
    const list = readJSON(KEYS.ORDERS, []);
    const idx = list.findIndex((o) => o.id === id);
    if (idx === -1) return;
    list[idx].unread = false;
    writeJSON(KEYS.ORDERS, list);
  }

  function markAllOrdersRead() {
    const list = readJSON(KEYS.ORDERS, []);
    list.forEach((o) => (o.unread = false));
    writeJSON(KEYS.ORDERS, list);
  }

  function getUnreadOrderCount() {
    return readJSON(KEYS.ORDERS, []).filter((o) => o.unread).length;
  }

  function deleteOrder(id) {
    const list = readJSON(KEYS.ORDERS, []).filter((o) => o.id !== id);
    writeJSON(KEYS.ORDERS, list);
  }

  // -----------------------------------------------------------------------
  // LIVE CHAT (mirip WhatsApp: daftar kontak + reply satu per satu)
  // -----------------------------------------------------------------------
  function getAllChats() {
    return readJSON(KEYS.CHATS, {});
  }

  function saveAllChats(chats) {
    writeJSON(KEYS.CHATS, chats);
  }

  // Identitas customer di browser ini (dibuat sekali, dipakai terus)
  function getCustomerIdentity() {
    let id = localStorage.getItem(KEYS.CUSTOMER_ID);
    if (!id) {
      id = generateId("cust");
      localStorage.setItem(KEYS.CUSTOMER_ID, id);
    }
    const name = localStorage.getItem(KEYS.CUSTOMER_NAME) || "";
    return { id, name };
  }

  function setCustomerName(name) {
    localStorage.setItem(KEYS.CUSTOMER_NAME, name);
  }

  function getConversations() {
    const chats = getAllChats();
    return Object.values(chats).sort((a, b) => b.updatedAt - a.updatedAt);
  }

  function getConversation(customerId) {
    const chats = getAllChats();
    return chats[customerId] || null;
  }

  function sendCustomerMessage(customerId, customerName, text) {
    const chats = getAllChats();
    if (!chats[customerId]) {
      chats[customerId] = {
        customerId,
        customerName: customerName || "Pelanggan",
        messages: [],
        unreadForAdmin: false,
        unreadForCustomer: false,
        updatedAt: Date.now(),
      };
    }
    chats[customerId].customerName = customerName || chats[customerId].customerName;
    chats[customerId].messages.push({
      sender: "customer",
      text,
      time: Date.now(),
    });
    chats[customerId].unreadForAdmin = true;
    chats[customerId].updatedAt = Date.now();
    saveAllChats(chats);
    return chats[customerId];
  }

  function sendAdminMessage(customerId, text) {
    const chats = getAllChats();
    if (!chats[customerId]) return null;
    chats[customerId].messages.push({
      sender: "admin",
      text,
      time: Date.now(),
    });
    chats[customerId].unreadForCustomer = true;
    chats[customerId].updatedAt = Date.now();
    saveAllChats(chats);
    return chats[customerId];
  }

  function markConversationReadByAdmin(customerId) {
    const chats = getAllChats();
    if (!chats[customerId]) return;
    chats[customerId].unreadForAdmin = false;
    saveAllChats(chats);
  }

  function markConversationReadByCustomer(customerId) {
    const chats = getAllChats();
    if (!chats[customerId]) return;
    chats[customerId].unreadForCustomer = false;
    saveAllChats(chats);
  }

  function getUnreadChatCountForAdmin() {
    return getConversations().filter((c) => c.unreadForAdmin).length;
  }

  function isUnreadForCustomer(customerId) {
    const conv = getConversation(customerId);
    return conv ? !!conv.unreadForCustomer : false;
  }

  // -----------------------------------------------------------------------
  // AKUN CUSTOMER (register / login / profil)
  // -----------------------------------------------------------------------
  function getUsers() {
    return readJSON(KEYS.USERS, []);
  }

  function saveUsers(list) {
    writeJSON(KEYS.USERS, list);
  }

  function findUserByEmail(email) {
    return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  function registerUser({ name, email, phone, password }) {
    const emailNorm = (email || "").trim().toLowerCase();
    if (!emailNorm) return { ok: false, message: "Email wajib diisi." };
    if (findUserByEmail(emailNorm)) {
      return { ok: false, message: "Email ini sudah terdaftar. Silakan masuk (login)." };
    }
    const users = getUsers();
    const newUser = {
      id: generateId("user"),
      name: (name || "").trim(),
      email: emailNorm,
      phone: (phone || "").trim(),
      password, // Catatan tugas kuliah: di aplikasi nyata WAJIB di-hash, jangan disimpan polos.
      createdAt: Date.now(),
    };
    users.push(newUser);
    saveUsers(users);
    localStorage.setItem(KEYS.CURRENT_USER, newUser.id);
    return { ok: true, user: newUser };
  }

  function loginUser(email, password) {
    const user = findUserByEmail(email || "");
    if (!user || user.password !== password) {
      return { ok: false, message: "Email atau kata sandi salah." };
    }
    localStorage.setItem(KEYS.CURRENT_USER, user.id);
    return { ok: true, user };
  }

  function logoutUser() {
    localStorage.removeItem(KEYS.CURRENT_USER);
  }

  function getCurrentUser() {
    const id = localStorage.getItem(KEYS.CURRENT_USER);
    if (!id) return null;
    return getUsers().find((u) => u.id === id) || null;
  }

  function updateUserProfile(id, data) {
    const users = getUsers();
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...data, id: users[idx].id, email: users[idx].email };
    saveUsers(users);
    return users[idx];
  }

  function requireCustomerAuth(loginPagePath) {
    if (!getCurrentUser()) {
      window.location.href = loginPagePath || "login.html";
    }
  }

  // -----------------------------------------------------------------------
  // SESI ADMIN
  // -----------------------------------------------------------------------
  // Sengaja pakai localStorage (bukan sessionStorage) supaya admin bisa
  // membuka Dashboard, Pesanan, dan Live Chat di beberapa tab sekaligus
  // tanpa perlu login ulang di setiap tab.
  function login(username, password) {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      writeJSON(KEYS.ADMIN_SESSION, { username, loginAt: Date.now() });
      return true;
    }
    return false;
  }

  function isLoggedIn() {
    return !!readJSON(KEYS.ADMIN_SESSION, null);
  }

  function logout() {
    localStorage.removeItem(KEYS.ADMIN_SESSION);
  }

  // Panggil di paling atas tiap halaman admin (selain admin_login.html)
  function requireAuth(loginPagePath) {
    if (!isLoggedIn()) {
      window.location.href = loginPagePath || "admin_login.html";
    }
  }

  return {
    KEYS,
    formatRupiah,
    generateId,
    timeAgo,
    formatClock,
    formatDateTime,
    onExternalChange,
    // produk
    getProducts,
    saveProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    resetProductsToDefault,
    // pesanan
    ORDER_STATUSES,
    getOrders,
    addOrder,
    updateOrderStatus,
    markOrderRead,
    markAllOrdersRead,
    getUnreadOrderCount,
    deleteOrder,
    getOrderById,
    getOrdersByUser,
    // chat
    getConversations,
    getConversation,
    getCustomerIdentity,
    setCustomerName,
    sendCustomerMessage,
    sendAdminMessage,
    markConversationReadByAdmin,
    markConversationReadByCustomer,
    getUnreadChatCountForAdmin,
    isUnreadForCustomer,
    // akun customer
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    updateUserProfile,
    requireCustomerAuth,
    // auth admin
    login,
    isLoggedIn,
    logout,
    requireAuth,
  };
})();
