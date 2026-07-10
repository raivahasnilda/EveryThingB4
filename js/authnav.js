// =========================================================================
// AUTHNAV.JS — Menampilkan status login di navbar semua halaman customer
// -------------------------------------------------------------------------
// Cukup taruh <div id="nav-auth-area"></div> di dalam navbar sebuah
// halaman, lalu include file ini (setelah js/store.js). Otomatis terisi
// dengan tombol "Masuk / Daftar" atau chip nama pengguna + tautan Profil.
// =========================================================================

(function () {
  function render() {
    const area = document.getElementById("nav-auth-area");
    if (!area) return;

    const user = EB4Store.getCurrentUser();
    if (user) {
      area.innerHTML = `
        <a href="profile.html" class="nav-user-chip" title="Lihat profil saya">
          👤 ${user.name ? user.name.split(" ")[0] : "Akun"}
        </a>
      `;
    } else {
      area.innerHTML = `
        <a href="login.html" class="nav-user-chip" title="Masuk atau daftar akun">
          👤 Masuk / Daftar
        </a>
      `;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }

  EB4Store.onExternalChange((e) => {
    if (e.key === EB4Store.KEYS.CURRENT_USER || e.key === EB4Store.KEYS.USERS) {
      render();
    }
  });
})();
