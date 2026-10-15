# Changelog

## [Unreleased]

### Ditambahkan
- Gaya **🖼️ Ikuti gambar asli** untuk menghidupkan gambar milik sendiri tanpa mengubah gayanya. Gaya ini hanya membuat prompt Image → Video, tidak bisa digabung dengan gaya lain, dan menambahkan larangan perubahan gaya di negative prompt video.
- Tema **💃 Joget & Dance** dengan 14 jenis joget, termasuk 5 joget lucu (kocak kartun, goyang bebek, robot kaku, goyang ulat, dance battle kocak), plus dangdut, poco-poco, jaipong, saman, K-pop, hip hop, joget viral, senam ceria, dan balet. Ada pilihan tempo, tempat joget, "Tambah unsur lucu", dan "Pakai lagu sendiri nanti" (video dibuat tanpa musik).
- Kolom **Nyanyian** per adegan untuk lirik pendek buatan sendiri. Prompt meminta gerak bibir yang jelas.
- Peringatan mode hemat untuk gerakan berputar atau akrobat, shot dan kamera yang kurang cocok untuk joget, dan lirik yang terlalu panjang.
- Tips joget & lipsync di halaman Hasil.
- Parameter `dance` pada tugas `scenes` di `/api/generate`, dan field `sing` di hasilnya.
- Pilihan **jumlah adegan 1–12** di langkah Adegan, dengan perkiraan durasi (±8 detik per adegan). Jumlah adegan langsung menyesuaikan saat diubah, dan dipakai juga oleh "Isi ulang dari tema" serta "Buat alur adegan dengan AI".
- Parameter `keepStyle` pada tugas `polish` di `/api/generate`.
- Dokumentasi: bagian "Menghidupkan gambar sendiri" di `docs/PANDUAN.md`, dan `CHANGELOG.md`.

### Diperbaiki
- Melompat langsung ke langkah Hasil lewat stepper sebelum membuka langkah Adegan gagal dengan pesan "Isi minimal satu adegan". Adegan sekarang dibuat otomatis dari tema saat validasi.
