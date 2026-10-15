# Panduan Pemakaian

## Alur kerja yang disarankan

1. **Format**: pilih Text → Image dan Image → Video, platform Google Flow, dan rasio sesuai tujuan (16:9 untuk YouTube, 9:16 untuk Reels/TikTok/Shorts). Biarkan *Mode hemat kredit* dan *Prompt otomatis bahasa Inggris* aktif.
2. **Gaya**: pilih satu gaya, atau beberapa jika ingin membandingkan.
3. **Tema**: pilih tema siap pakai, atau buat tema baru lalu klik **Buatkan deskripsi latar dengan AI**.
4. **Karakter**: isi secukupnya dalam bahasa Indonesia, lalu klik **Rapikan & terjemahkan dengan AI** agar detail visualnya lengkap.
5. **Adegan**: pilih jumlah adegan (1 adegan ≈ 8 detik; pilih 1 untuk video pendek atau satu klip), lalu edit adegan otomatis, atau tulis ide cerita lalu klik **Buat alur adegan dengan AI**. Perbaiki adegan yang mendapat peringatan.
6. **Hasil**: salin prompt per adegan dan tempel ke platform.

## Di Google Flow

1. Generate gambar dari prompt **sheet karakter**, lalu simpan yang paling cocok sebagai acuan (ingredient).
2. Generate gambar tiap adegan dengan prompt **Text → Image**, sertakan gambar karakter sebagai referensi.
3. Hidupkan gambar dengan prompt **Image → Video** untuk adegan yang sama.
4. Susun klip di scene builder sesuai nomor adegan.

## Di Canva

1. Tempel prompt **Text → Image** ke fitur generate gambar AI dengan rasio yang sama.
2. Tempel prompt **Image → Video** atau **Text → Video** ke fitur generate video AI.
3. Susun klip di timeline, lalu tambahkan musik, teks, dan transisi.

Mode Canva menghasilkan prompt yang lebih ringkas.

## Menghidupkan gambar sendiri (tanpa ubah gaya)

Gunakan gaya ini jika kamu sudah punya gambar, misalnya foto, ilustrasi buatan sendiri, atau hasil generate sebelumnya, dan hanya ingin menambahkan gerakan.

1. Di langkah **Format**, nyalakan **Image → Video**. Text → Image dan Text → Video boleh dimatikan karena tidak dipakai.
2. Di langkah **Gaya**, pilih **🖼️ Ikuti gambar asli**. Pilihan ini tidak bisa digabung dengan gaya lain.
3. Di langkah **Karakter**, cukup isi nama. Deskripsi tidak dimasukkan ke prompt video, jadi tidak akan bertabrakan dengan gambarmu.
4. Di langkah **Adegan**, tulis gerakannya saja, misalnya "Kiko menoleh lalu tersenyum".
5. Di halaman **Hasil**, hanya prompt Image → Video yang muncul. Unggah gambarmu sebagai frame awal, lalu tempel prompt-nya.

Prompt dengan gaya ini secara tegas meminta model mempertahankan gaya, warna, pencahayaan, dan detail gambar input. Negative prompt video juga ditambah larangan perubahan gaya. Tombol **✨ Perbaiki** tidak akan menambahkan kata-kata gaya.

## Joget & dance

1. Di langkah **Tema**, pilih **💃 Joget & Dance**, lalu pilih jenis joget, tempo, dan tempat.
   - Joget lucu: kocak kartun, goyang bebek, robot kaku, goyang ulat, dan dance battle kocak (cocok untuk 2 karakter).
   - Lainnya: dangdut, poco-poco, jaipong, saman, K-pop, hip hop, joget viral, senam ceria, dan balet.
2. Centang **Tambah unsur lucu** untuk ekspresi konyol dan timing lebay. Opsi ini selalu aktif untuk joget lucu.
3. Centang **Pakai lagu sendiri nanti** jika ingin menempel lagu sendiri saat editing. Prompt akan meminta video tanpa musik.
4. Di langkah **Adegan**, setiap adegan berisi satu gerakan. Kolom **Nyanyian** bisa diisi lirik pendek buatan sendiri (maksimal ±12 kata).

Hal yang perlu diketahui:

- Flow membuat melodi nyanyiannya sendiri, jadi tidak bisa mengikuti melodi lagu yang sudah ada.
- Untuk menyamakan gerakan dengan lagu, tempel lagu di Canva atau editor video, lalu potong klip tepat di ketukan.
- Untuk gerak bibir yang sinkron dengan lagu asli, pakai aplikasi lip sync khusus yang menerima file audio, setelah klipnya jadi.
- Hindari putaran, salto, dan lompatan. Gerakan di tempat dengan kamera wide statis paling stabil.
- Lagu terkenal bisa kena klaim hak cipta di platform video. Gunakan musik bebas lisensi atau dari perpustakaan musik platform.

## Tips hemat kredit

| Lakukan | Hindari |
|---|---|
| Satu aksi per adegan (klip ±8 detik) | Merangkai aksi dengan "lalu", "kemudian" |
| Maksimal 2 karakter per adegan | Kerumunan yang bergerak |
| Dialog 8–15 kata | Dialog panjang |
| Kamera Statis, Zoom in perlahan, Pan, Ikuti karakter | Orbit, Drone, Handheld di adegan tengah |
| Ulangi gambar sampai pas, baru jadikan video | Langsung Text → Video berkali-kali |
| Uji gaya di adegan 1, lalu pilih gaya final | Generate semua adegan untuk semua gaya |
| Teks ditambahkan belakangan di editor | Tulisan atau papan nama di dalam gambar |
| Cek gerakan dengan model Fast (jika ada), render final dengan Quality | Langsung render semua dengan kualitas tertinggi |

## Bahasa

- Isian boleh bahasa Indonesia. Saat halaman Hasil dibuka, isian berbahasa Indonesia diterjemahkan ke dalam prompt bahasa Inggris. Isian asli tidak diubah.
- Isian yang sudah bahasa Inggris tidak dikirim ke AI.
- Dialog tetap bahasa Indonesia agar suara karakter berbahasa Indonesia.
- Deteksi bahasa berbasis daftar kata, jadi isian berisi kata langka kadang terlewat. Klik **Terjemahkan ulang** jika perlu.

## Pemecahan masalah

| Pesan / gejala | Penyebab & solusi |
|---|---|
| "Fitur AI baru aktif setelah di-deploy…" | File dibuka langsung dari komputer. Deploy ke Vercel atau jalankan `vercel dev`. |
| "Endpoint /api/generate tidak ditemukan" | Folder `api/` tidak ikut ter-deploy. Pastikan strukturnya sesuai README. |
| "API key untuk gemini belum diatur" | Tambahkan `GEMINI_API_KEY` di Vercel, lalu Redeploy. |
| "Kuota API gratis sedang habis" | Tunggu beberapa menit, atau pindah ke `AI_PROVIDER=groq`. |
| Diminta kode akses terus | Kode salah. Kode tersimpan di browser setelah berhasil. |
| Karakter berubah bentuk di video | Pakai kamera Statis, perpendek aksi, kurangi jumlah karakter. |
| Ingin mulai dari nol | Klik **Mulai ulang** di kanan atas. |
