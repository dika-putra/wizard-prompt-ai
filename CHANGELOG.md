# Changelog

## [Unreleased]

### Ditambahkan
- Gaya **🖼️ Ikuti gambar asli** untuk menghidupkan gambar milik sendiri tanpa mengubah gayanya. Gaya ini hanya membuat prompt Image → Video, tidak bisa digabung dengan gaya lain, dan menambahkan larangan perubahan gaya di negative prompt video.
- Parameter `keepStyle` pada tugas `polish` di `/api/generate`.
- Dokumentasi: bagian "Menghidupkan gambar sendiri" di `docs/PANDUAN.md`, dan `CHANGELOG.md`.

### Diperbaiki
- Melompat langsung ke langkah Hasil lewat stepper sebelum membuka langkah Adegan gagal dengan pesan "Isi minimal satu adegan". Adegan sekarang dibuat otomatis dari tema saat validasi.
