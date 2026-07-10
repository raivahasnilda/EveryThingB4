# 🛍️ EVERYTHINGSBYFOUR
> Proyek Pengembangan Platform E-Commerce Fashion Terintegrasi

---

### 👤 IDENTITAS MAHASISWA
* **Nama:** Raiva Hasnilda Fatimah
* **NIM:** 209250149
* **Mata Kuliah:** Komputer Aplikasi IT II
* **Program Studi:** Administrasi Bisnis (ABI 6)
* **Semester:** Genap 2025/2026

---

## 🔗 LINK AKSES UTAMA
* **Link Live Website (Customer):** https://raivahasnilda.github.io/EveryThingB4/#katalog
* **Link Halaman Admin:** https://raivahasnilda.github.io/EveryThingB4/Admin/admin_dashboard.html
* **Link Repository GitHub:** [Isi link repository GitHub kamu di sini] untuk melihat *source code* repositori.

---

## 📝 DESKRIPSI & STRATEGI BISNIS

### 1. Judul Proyek
“Membangun Website E-Commerce Fungsional dengan Integrasi Strategi Bisnis Modern”

### 2. Business Overview & Analisis Manajemen Strategis

*   **Visi, Nama, & Konsep Bisnis:**
    **EverythingsByFour** didirikan sebagai platform *smart e-commerce* yang mengurasi produk fashion kasual mencakup kategori *atasan, bawahan,* hingga *dress* dari pilihan desain yang nyaman dipakai sehari-hari dan mudah dipadupadankan. Bisnis ini tidak sekadar bertindak sebagai toko pakaian daring biasa, melainkan sebuah wadah kurasi (*curated marketplace*) yang membantu konsumen menemukan outfit yang benar-benar sesuai dengan gaya personal mereka tanpa perlu mengorbankan kenyamanan.

*   **Proposisi Nilai Keunggulan (*Value Proposition*):**
    Kami mengusung tiga pilar nilai utama: *Comfort First, Price Transparency,* dan *Seamless Shopping Experience*. Seluruh produk yang tersedia dipilih dengan memperhatikan kualitas bahan dan kenyamanan pemakaian jangka panjang. Di tengah maraknya toko daring yang penuh sesak dan sulit dinavigasi, EverythingsByFour menjamin pengalaman belanja yang ringkas — mulai dari eksplorasi katalog, live chat dengan admin, hingga pelacakan pesanan — semuanya dalam satu alur yang intuitif dan bebas gangguan iklan pihak ketiga.

*   **Segmentasi & Analisis Pasar Sasaran (*Target Market*):**
    Segmentasi pasar difokuskan pada demografi remaja hingga dewasa muda berusia 16–28 tahun, yang didominasi oleh pelajar, mahasiswa, dan pekerja muda (*early jobbers*). Berdasarkan analisis perilaku konsumen, segmen ini memiliki karakteristik yang sangat aktif di media sosial, mencari outfit kasual estetik dengan harga terjangkau, dan sangat mengandalkan chat langsung untuk memastikan detail produk sebelum membeli. Mereka adalah kelompok yang memprioritaskan kepraktisan transaksi dan kecepatan respons penjual.

*   **Analisis Lanskap Kompetitif (*Competitor Analysis*):**
    Di tengah ketatnya persaingan dengan *marketplace* besar dan toko *thrift* daring, EverythingsByFour mengambil ceruk pasar (*niche market*) melalui strategi diferensiasi fokus pada koleksi pastel yang konsisten dan layanan pelanggan yang personal lewat fitur live chat internal. Kelemahan utama kompetitor massal adalah respons chat yang lambat dan tampilan katalog yang generik. Kami mengantisipasi hal tersebut dengan menghadirkan *live chat* bawaan situs (bukan hanya tautan ke WhatsApp eksternal) sehingga admin dapat membalas satu per satu pelanggan secara terstruktur, membangun kedekatan emosional (*brand intimacy*) layaknya berbelanja di toko butik kecil yang responsif.

*   **Arsitektur Model Bisnis & Aliran Pendapatan (*Revenue Stream*):**
    Bisnis ini beroperasi dengan model **B2C (Business-to-Consumer) Online Retailer** murni, mengadopsi rantai pasok langsung dari penjahit/produsen mitra guna memotong margin perantara yang tidak perlu. Aliran pendapatan utama (*primary revenue stream*) diperoleh secara langsung melalui selisih harga jual produk (*direct retail margin*) kepada konsumen akhir. Di masa mendatang, model ini dirancang untuk dapat berkembang ke arah program keanggotaan (*membership*) dengan akses lebih awal ke koleksi baru.

*   **Strategi Penetapan Harga & Manajemen Promosi (*Pricing & Promotion*):**
    Penetapan harga menggunakan pendekatan campuran antara *value-based pricing* (menyelaraskan harga dengan persepsi nilai bahan & desain premium) dan *competitive pricing* untuk item-item dasar (*basic pieces*) yang populer. Untuk memicu keputusan pembelian, strategi promosi dirancang secara berkala menggunakan stimulus psikologis:
    *   **Aktivasi Kupon Diskon Tematik:** Promosi berbasis momentum kalender atau *event-driven marketing* untuk meningkatkan volume transaksi pada hari-hari besar.
    *   **Strategi Bundling:** Mengombinasikan beberapa produk pelengkap (misal: *cardigan + dress*) dalam satu paket harga khusus demi mengoptimalkan nilai rata-rata transaksi per konsumen (*Average Order Value*).

*   **Alur Checkout & Simulasi Arsitektur Transaksi (*Payment Workflow*):**
    Guna meminimalkan hambatan psikologis saat memproses pembayaran, alur transaksi dirancang seringkas mungkin (maksimal 3 langkah dari keranjang belanja hingga halaman sukses). Pengguna diarahkan untuk mengisi form pengiriman yang ringkas pada `checkout.html` — otomatis terisi dari profil akun bila sudah login — diikuti dengan simulasi integrasi gerbang pembayaran otomatis (*dummy payment gateway payment loop*) untuk metode QRIS, Transfer Bank, maupun COD. Arsitektur ini mengadopsi standardisasi industri global seperti sistem API Midtrans atau Xendit, memastikan alur validasi data dan pencatatan status pesanan berjalan presisi dari sisi pengguna maupun panel admin.

*   **Rencana Optimasi Mesin Pencari & Analisis Metrik (*SEO & Analytics Plan*):**
    Implementasi teknis pada kode sumber menyertakan optimasi komponen *On-Page SEO*, seperti penggunaan struktur tag semantik (`<nav>`, `<header>`, `<main>`, `<footer>`), meta viewport untuk responsivitas, serta optimasi atribut `alt` pada seluruh aset gambar produk agar mudah diindeks oleh Google. Dari sisi operasional bisnis, keberhasilan performa digital web diukur menggunakan tiga metrik utama:
    1.  *Conversion Rate* (mengukur persentase pengunjung yang sukses melakukan *checkout*).
    2.  *Bounce Rate* (menganalisis relevansi konten halaman terhadap ekspektasi pengunjung).
    3.  *Cart Abandonment Rate* (memantau persentase pengguna yang meninggalkan keranjang belanja untuk kemudian dioptimalkan melalui perbaikan alur JavaScript).

---

## 🛠️ FITUR TEKNIS & DOKUMENTASI

### 1. Fitur Utama Website (Pure Vanilla HTML, CSS, JS)
* **Responsive Layout:** Implementasi penuh CSS Flexbox dan Grid untuk memastikan tampilan web tetap presisi baik di layar Desktop, Tablet, maupun *Smartphone*.
* **Manajemen Keranjang Belanja:** Sistem penyimpanan keranjang belanja interaktif yang sinkron secara otomatis menggunakan fitur `localStorage` pada browser.
* **Akun Pelanggan (Register/Login/Profil):** Pelanggan dapat membuat akun, masuk, memperbarui data profil (nama, WhatsApp, alamat utama) yang otomatis mengisi form checkout berikutnya, serta melihat riwayat pesanan pribadinya.
* **Pelacakan Pesanan (Order Tracking):** Halaman pencarian nomor pesanan dengan visualisasi linimasa status (*Baru → Diproses → Dikirim → Selesai*) lengkap dengan waktu aktual setiap perubahan status.
* **Live Chat Dua Arah:** Widget chat mengambang di halaman customer yang terhubung langsung ke panel admin, memungkinkan admin membalas satu per satu pelanggan seperti aplikasi pesan instan.
* **Sistem Notifikasi Admin:** Lonceng notifikasi & badge jumlah pesanan/chat yang belum dibaca, diperbarui otomatis secara *real-time* antar tab browser.
* **Arsitektur Multi-Halaman:** Pemisahan halaman yang terstruktur antara katalog utama pelanggan, checkout, akun pelanggan, hingga panel login dan pengelolaan back-end untuk admin.
* **Sistem Pencarian & Filter:** Fitur pencarian produk secara *real-time* berbasis JavaScript untuk mempermudah navigasi konsumen dalam menemukan kategori produk spesifik.

### 2. Struktur File Proyek
```text
EverythingsByFour/
├── index.html                  # Halaman Utama Toko (Katalog, Keranjang, Widget Chat)
├── checkout.html                # Form Pengisian Data & Simulasi Pembayaran
├── order_success.html           # Halaman Konfirmasi Transaksi Berhasil
├── login.html                   # Halaman Autentikasi Pengguna/Customer
├── register.html                # Halaman Pendaftaran Akun Pelanggan Baru
├── profile.html                 # Halaman Informasi Akun & Riwayat Pesanan Customer
├── tracking.html                # Halaman Pelacakan Status Pengiriman Pesanan
│
├── Admin/
│   ├── admin_login.html          # Halaman Autentikasi Keamanan Admin
│   ├── admin_dashboard.html      # Panel Monitoring & Ringkasan Data Admin
│   ├── admin_produk.html         # Manajemen Inventori Produk (Tambah/Edit/Hapus)
│   ├── admin_pesanan.html        # Panel Pemantauan & Pengelolaan Status Transaksi Masuk
│   ├── admin_livechat.html       # Panel Live Chat Admin (Gaya WhatsApp Web)
│   ├── css/
│   │   └── admin.css              # Desain Tata Letak & Estetika Panel Admin
│   └── js/
│       └── admin.js               # Kerangka Bersama: Sidebar, Topbar, Notifikasi, Proteksi Sesi
│
├── css/
│   └── style.css                 # Desain Visual & Responsivitas Halaman Utama/Customer
│
├── js/
│   ├── default_products.js       # Berkas Data Awal/Inisialisasi Produk Fashion
│   ├── store.js                  # Pusat Logika Data: Produk, Pesanan, Live Chat, Akun, Sesi
│   ├── app.js                    # Logika Keranjang Belanja, Pencarian, & Katalog Halaman Utama
│   ├── authnav.js                # Penampil Status Login di Navbar Semua Halaman Customer
│   └── chatwidget.js             # Widget Live Chat Mengambang untuk Halaman Customer
│
├── images/                        # Direktori Aset Foto Produk
│
└── README.md                      # Dokumentasi Resmi Proyek
```

### 3. Kredensial Demo
| Peran    | Cara Akses                                                          |
|----------|----------------------------------------------------------------------|
| Customer | Buka `index.html`, lalu Daftar/Masuk lewat `register.html` / `login.html` |
| Admin    | `Admin/admin_login.html` — user `everythingsbyfour`, pass `1747`       |

### 4. Catatan Arsitektur Data
Karena proyek ini murni HTML/CSS/JS tanpa server sungguhan, seluruh "database" (produk, akun, pesanan, live chat, sesi admin) disimpan di `localStorage` browser lewat satu pusat logika di `js/store.js`. Ini membuat data selalu konsisten antara sisi customer dan admin selama diakses dari browser yang sama (boleh beda tab). Untuk kebutuhan produksi sungguhan, seluruh fungsi di `js/store.js` cukup diganti dengan pemanggilan REST API ke server & database asli — struktur fungsinya sudah mengikuti pola CRUD backend supaya migrasinya mudah.
