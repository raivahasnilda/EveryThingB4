// =========================================================================
// DATABASE AWAL / SEED PRODUK (EVERYTHINGSBYFOUR)
// -------------------------------------------------------------------------
// Array ini HANYA dipakai sekali oleh js/store.js untuk mengisi localStorage
// saat pertama kali website dibuka. Setelah itu, semua perubahan produk
// (tambah/edit/hapus lewat Admin/admin_produk.html) disimpan di
// localStorage key "eb4_products", BUKAN di file ini.
// Kalau butuh mengembalikan produk ke kondisi awal, gunakan tombol
// "Reset ke Produk Default" di halaman Admin > Produk.
// =========================================================================
const defaultProducts = [
  {
    id: 1,
    name: "Bear Blue One Set",
    price: 350000,
    category: "Dress",
    img: "images/bear-blue.jpeg.jpeg",
    bestseller: true,
    description:
      "Stay comfy without compromising your style. Sky Bear Lounge Set hadir dengan desain yang simpel, bahan yang lembut, and warna biru pastel yang menenangkan.",
  },
  {
    id: 2,
    name: "Black Jeans Classic",
    price: 145000,
    category: "Bawahan",
    img: "images/black-jeans.jpeg.jpeg",
    description:
      "Celana jeans hitam dengan potongan straight yang timeless dan mudah dipadukan dengan berbagai outfit.",
  },
  {
    id: 3,
    name: "Casual Soft Cardigan",
    price: 120000,
    category: "Atasan",
    img: "images/casual-cardigan.jpeg.jpeg",
    description:
      "Cardigan rajut dengan sentuhan puff sleeves yang memberikan kesan feminin dan elegan.",
  },
  {
    id: 4,
    name: "Hello Kitty Pink Jacket",
    price: 255000,
    category: "Atasan",
    img: "images/hello-kitty-jacket.jpeg.jpeg",
    description:
      "Bomber jacket dengan desain quilted yang memberikan kehangatan sekaligus tampilan stylish.",
  },
  {
    id: 5,
    name: "Knit Cardigan Premium",
    price: 135000,
    category: "Atasan",
    img: "images/knit-cardigan.jpeg.jpeg",
    bestseller: true,
    description:
      "Cardigan rajut klasik dengan motif cable knit yang memberikan tampilan clean dan elegan.",
  },
  {
    id: 6,
    name: "Mini Dress Red Velvet",
    price: 195000,
    category: "Dress",
    img: "images/mini-dress-red.jpeg.jpeg",
    bestseller: true,
    description:
      "Dress bergaya polo dengan desain minimalis yang memadukan kesan sporty dan feminin.",
  },
  {
    id: 7,
    name: "Navy Winter Sweater",
    price: 140000,
    category: "Atasan",
    img: "images/navy-sweater.jpeg.jpeg",
    description:
      "Sweater rajut premium dengan desain klasik yang memberikan rasa hangat sekaligus tampilan yang elegan.",
  },
  {
    id: 8,
    name: "Red Crop Cardigan",
    price: 115000,
    category: "Atasan",
    img: "images/red-cardigan.jpeg.jpeg",
    description:
      "Cardigan berwarna cherry red dengan detail cable knit yang timeless.",
  },
  {
    id: 9,
    name: "Shirt Dress Soft Pink",
    price: 165000,
    category: "Dress",
    img: "images/shirt-dress-pink.jpeg.jpeg",
    description:
      "Tampil effortless dengan Blush Shirt Dress, perpaduan sempurna antara desain klasik dan sentuhan feminin.",
  },
  {
    id: 10,
    name: "Knit Sweater Vest",
    price: 95000,
    category: "Atasan",
    img: "images/sweater-vest.jpeg.jpeg",
    description:
      "Knit vest berwarna lavender dengan desain minimalis yang cocok dipadukan bersama kemeja atau kaos.",
  },
];
