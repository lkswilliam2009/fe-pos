Aplikasi Manajemen Diskon berbasis Vue 3 (Composition API) yang memungkinkan pengguna untuk menambah, melihat, mengubah, dan menghapus diskon.
Dibuat mengikuti desain Figma utama dengan fokus pada UX, state handling, dan clean code.

## ✨ Fitur Utama

✅ CRUD Diskon (Create, Read, Update, Delete)

✅ Pilih outlet melalui dropdown

✅ Custom API URL (show / hide)

✅ Edit & hapus dengan modal konfirmasi

✅ Toast notifikasi di setiap proses

✅ Loading state (simpan, hapus, load)

✅ Empty state (data kosong)

✅ Format angka (Rp / %)

✅ UI konsisten dengan Figma

✅ Responsive & build-ready

## 🛠️ Teknologi

Vue 3 (Composition API)

Vite

Axios

CSS custom (tanpa UI library)

## 📦 Instalasi & Menjalankan Project
```bash
  git clone https://github.com/lkswilliam2009/fe-pos.git
```
```bash
npm install
npm run build
npm run dev
```

Aplikasi akan berjalan di:

http://localhost:5173

## 🔌 Konfigurasi API
Default Outlet

Secara default aplikasi menggunakan CRUDCRUD:
```bash
  https://crudcrud.com/api/{API_KEY}/discounts
```


## ⚠️ Catatan Penting tentang CRUDCRUD

Batas ±100 request per API key

PATCH tidak didukung (CORS)

PUT sering diblok preflight

Cocok hanya untuk demo frontend

## ✏️ Mekanisme Update Data (Penting)

Karena keterbatasan CORS CRUDCRUD:

❌ PATCH → diblok CORS

⚠️ PUT → tidak konsisten

✅ UPDATE dilakukan dengan pendekatan:

DELETE data lama

POST data baru

Pendekatan ini aman untuk demo frontend dan umum digunakan pada test UI.

## 🧠 Alur Aplikasi

Pilih outlet (default: Kopi Anak Bangsa)

Data otomatis dimuat

Tambah diskon melalui modal

Edit diskon → simpan perubahan

Hapus diskon → konfirmasi modal

Toast muncul untuk setiap aksi

Empty state ditampilkan jika data kosong

## 🧪 Error Handling

Network / CORS error → pesan ramah ke user

API error → toast error

Request ganda dicegah dengan loading state

ERR_NETWORK ditangani dengan fallback message

## 📁 Struktur Singkat
```bash
src/
├─ App.vue
├─ assets/
├─ styles.css
└─ main.js
```

## 🎨 UI & UX Notes

UI mengikuti Figma utama

Dropdown & input custom URL dipisah

Icon shop untuk outlet

Tombol disabled saat loading

Tidak ada alert native browser

## 🚀 Build Production
```bash
npm run build
```


Output akan berada di folder:

dist/

dapat diakses di 
```bash
https://fe-diskon.netlify.app/
```
## 📌 Catatan Reviewer

Project ini fokus pada frontend

Backend eksternal (CRUDCRUD) digunakan hanya sebagai mock API

Kode dibuat clean, readable, dan scalable

State & UX menjadi prioritas utama

## 👨‍💻 Author

Lokius William Tanikwele