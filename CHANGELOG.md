# Changelog

## [Unreleased]

### Ditambahkan
- **Proteksi password seluruh situs** lewat environment variable `SITE_PASSWORD`. Pengecekan dilakukan di `middleware.js` sebelum halaman atau API dikirim, dengan halaman login, sesi cookie `HttpOnly` (lama sesi diatur lewat `SESSION_DAYS`), pembatasan percobaan login, tombol **Keluar**, dan reload otomatis saat sesi berakhir.
- File baru: `middleware.js`, `api/auth.js`, `lib/token.js`.
- Gaya **🖼️ Ikuti gambar asli** untuk menghidupkan gambar milik sendiri tanpa mengubah gayanya. Gaya ini hanya membuat prompt Image → Video, tidak bisa digabung dengan gaya lain, dan menambahkan larangan perubahan gaya di negative prompt video.
- Tema **👷 POV Profesi** dengan 16 profesi siap pakai (pemadam kebakaran, polisi, dokter, pilot, astronot, koki, guru, petani, nelayan, montir, tukang bangunan, masinis, kurir paket, dokter hewan, barista, ilmuwan) plus profesi lain buatan sendiri. Ada dua sudut pandang: **POV orang pertama** (kamera dari mata si profesi, tangan dan seragam terlihat, wajah tidak ditampilkan) dan **karakter jadi profesi** (pakaian karakter otomatis diganti seragam). Setiap profesi punya seragam, tempat kerja, efek suara, dan 5 adegan bawaan.
- Parameter `pov` pada tugas `scenes` di `/api/generate`.
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
