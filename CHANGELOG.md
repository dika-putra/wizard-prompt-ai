# Changelog

## [Unreleased]

### Ditambahkan
- **Kostum per karakter**: tombol "+ Tambah kostum" di langkah Karakter, dan pilihan kostum per karakter di setiap adegan (default: Utama). Untuk setiap kostum yang dipakai, halaman Hasil menambahkan **sheet kostum turunan** di bagian "Sebelum adegan". Prompt-nya memakai sheet-karakter asli sebagai source image, mempertahankan wajah, rambut, dan proporsi, dan hanya mengganti pakaian. File disimpan sebagai `sheet-nama-kostum`. Deskripsi karakter, baris `Reference:`, catatan lampiran, dan ciri pembicara di dialog otomatis memakai kostum yang dipilih untuk adegan itu.
- **Penanda karakter**. Setiap karakter punya nomor dan warna tetap ("Karakter 1", titik berwarna) yang dipakai di seluruh wizard.
- **Dialog per pembicara**: setiap adegan punya maksimal 2 baris dialog, masing-masing dengan pilihan pembicara (karakter, Narator, atau Suara POV). Nyanyian juga punya pilihan penyanyi. Di prompt video, pembicara disebut lengkap dengan ciri visualnya, misalnya `Kiko (the young boy in yellow t-shirt) says: "..."`, ditambah urutan bicara dan instruksi "only the speaking character's lips move".
- **Baris di sheet karakter**: sheet gabungan menyusun karakter per baris dari atas (`Row 1: Kiko`, `Row 2: Mira`). Prompt Text → Image menyebut baris tiap karakter (`Kiko is in row 1`), dan catatan di halaman Hasil menampilkan chip "Baris 1: Kiko".
- Dialog lama (format `Nama: "kalimat"`) dan dialog dari AI otomatis dipecah menjadi baris per pembicara. Saat karakter dihapus, baris dialognya dialihkan ke Narator.
- **Alur referensi** di halaman Hasil. Sebelum adegan ada satu prompt **sheet karakter gabungan**: satu gambar berisi semua karakter, masing-masing dengan turnaround, berbagai pose, dan ekspresi. Setiap adegan lalu berisi ① Text → Image dengan baris `Reference:` (lampirkan `sheet-karakter`) dan ② Image → Video dengan baris `Starting frame:` dari gambar `adegan-N`. Setiap langkah punya catatan nama file dan apa yang harus dilampirkan.
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

### Diubah
- Sheet karakter yang sebelumnya terpisah per karakter kini digabung menjadi satu prompt, satu gambar, dan diletakkan sebelum semua adegan. Hanya karakter yang muncul di adegan yang dimasukkan.
- Tombol **✨ Perbaiki** mempertahankan baris `Reference:` dan `Starting frame:`.

### Diperbaiki
- Memilih hanya Image → Video tidak lagi menyembunyikan sheet karakter dan Text → Image. Sekarang keduanya ikut tampil di atas prompt video, karena video dibuat dari gambar adegan. Gaya Ikuti gambar asli tetap hanya Image → Video.
- Melompat langsung ke langkah Hasil lewat stepper sebelum membuka langkah Adegan gagal dengan pesan "Isi minimal satu adegan". Adegan sekarang dibuat otomatis dari tema saat validasi.
