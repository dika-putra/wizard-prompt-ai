# Wizard Prompt Animasi

Wizard berbasis web untuk menyusun prompt **Text → Image**, **Image → Video**, dan **Text → Video** adegan demi adegan, siap ditempel ke **Google Flow** atau **Canva** untuk membuat video animasi.

Isian bisa ditulis dalam bahasa Indonesia; prompt akhir otomatis keluar dalam bahasa Inggris.

## Fitur

**Wizard 6 langkah**

1. **Format**: jenis prompt (T2I, I2V, T2V), platform (Google Flow / Canva), rasio layar (16:9, 9:16, 1:1), mode hemat kredit, dan prompt otomatis bahasa Inggris.
2. **Gaya**: 12 gaya siap pakai (3D Cartoon Pixar, Anime 2D, Claymation, Chibi, Buku Cerita, Wayang & Batik, dan lainnya) atau gaya sendiri. Bisa pilih beberapa gaya sekaligus, plus suasana dan pencahayaan.
3. **Tema**: 10 tema siap pakai (hutan, Ramadan, desa, luar angkasa, fabel, dan lainnya) atau tema baru buatan sendiri.
4. **Karakter**: jumlah bebas, dengan nama, jenis, umur, ciri fisik, pakaian, dan sifat.
5. **Adegan**: terisi otomatis dari tema dan bisa diedit; jenis shot, gerak kamera, dan dialog per adegan.
6. **Hasil**: prompt per gaya dan per adegan, prompt *character sheet*, negative prompt, tombol salin, dan panduan pemakaian.

**Fitur AI** (butuh deploy dengan API key)

- Membuat deskripsi latar dari ide tema baru.
- Merapikan dan menerjemahkan deskripsi karakter.
- Menyusun alur adegan dari ide cerita.
- Menerjemahkan otomatis isian berbahasa Indonesia ke prompt bahasa Inggris. Isian yang sudah berbahasa Inggris dilewati, dan dialog tetap bahasa Indonesia.
- Memperbaiki prompt per adegan (tombol **✨ Perbaiki**).

**Mode hemat kredit** (untuk Google Flow gratis)

- Peringatan langsung untuk adegan yang rawan gagal: lebih dari 2 karakter, lebih dari satu aksi, dialog terlalu panjang, kamera rawan *morphing*, tulisan di gambar, adegan makan atau minum, dan kerumunan.
- Instruksi tambahan di prompt agar hasil lebih stabil.
- Uji gaya di adegan 1 dulu sebelum menjadikannya gaya final.
- Aturan yang sama diterapkan ke fitur AI.

Semua fitur non-AI tetap berjalan tanpa API key, bahkan saat file dibuka langsung dari komputer.

## Struktur proyek

```
.
├── index.html          # Antarmuka wizard (HTML, CSS, JS dalam satu file)
├── api/
│   └── generate.js     # Vercel Serverless Function, memanggil Gemini / Groq
├── docs/
│   ├── API.md          # Dokumentasi endpoint /api/generate
│   └── PANDUAN.md      # Panduan pemakaian & tips Google Flow
├── .env.example        # Contoh environment variables
├── package.json
└── README.md
```

Tidak ada build step dan tidak ada dependency npm.

## Mulai cepat

### 1. Ambil API key

- **Gemini (disarankan)**: buka [Google AI Studio](https://aistudio.google.com), lalu pilih *Get API key* → *Create API key*.
- **Groq (alternatif)**: buka [console.groq.com](https://console.groq.com), lalu masuk ke menu *API Keys*.

Batas kuota gratis bisa berubah sewaktu-waktu. Cek halaman rate limit masing-masing penyedia.

### 2. Deploy ke Vercel

**Lewat GitHub**

1. Push repository ini ke GitHub.
2. Di [vercel.com](https://vercel.com), pilih *Add New → Project*, lalu pilih repository ini.
3. Biarkan Framework Preset di *Other*, lalu klik *Deploy*.

**Lewat terminal**

```bash
npm i -g vercel
vercel          # preview
vercel --prod   # production
```

### 3. Atur environment variables

Buka *Project → Settings → Environment Variables* di Vercel:

| Variabel | Wajib | Default | Keterangan |
|---|---|---|---|
| `GEMINI_API_KEY` | Ya, jika memakai Gemini | | API key dari Google AI Studio |
| `AI_PROVIDER` | Tidak | `gemini` | `gemini` atau `groq` |
| `GROQ_API_KEY` | Ya, jika `AI_PROVIDER=groq` | | API key dari Groq |
| `ACCESS_CODE` | Disarankan | kosong | Kode yang harus dimasukkan pengunjung sebelum memakai fitur AI |
| `RATE_LIMIT` | Tidak | `30` | Maksimal request per IP per 10 menit |
| `GEMINI_MODEL` | Tidak | `gemini-2.5-flash` | Ganti jika ada model yang lebih baru |
| `GROQ_MODEL` | Tidak | `llama-3.3-70b-versatile` | Ganti jika ada model yang lebih baru |

Setelah mengubah variabel, lakukan **Redeploy** agar perubahan aktif.

### 4. Menjalankan di lokal

Tanpa fitur AI, cukup buka `index.html` di browser.

Dengan fitur AI:

```bash
npm i -g vercel
vercel link
vercel env pull .env.local   # atau salin .env.example menjadi .env.local lalu isi
vercel dev                   # http://localhost:3000
```

## Cara kerja singkat

- Prompt dirakit di browser dari template: pilihan gaya, tema, karakter, dan kamera dipetakan ke frasa bahasa Inggris lalu digabungkan.
- Konsistensi karakter dijaga dengan memasukkan deskripsi lengkap karakter yang disebut di setiap adegan. Jika tidak ada nama yang disebut, semua karakter dimasukkan.
- Fitur AI memanggil `POST /api/generate`. Prompt untuk model dirakit di server berdasarkan jenis tugas, sehingga endpoint tidak bisa dipakai sebagai chatbot bebas. Detailnya ada di [docs/API.md](docs/API.md).
- Terjemahan otomatis memakai deteksi bahasa sederhana di browser (kosakata umum dan imbuhan). Hasilnya di-cache, jadi hanya isian baru atau yang berubah yang diterjemahkan ulang.
- Semua isian tersimpan di `localStorage` browser dengan key `wizard-prompt-animasi-v1`. Data tidak dikirim ke server kecuali saat memakai fitur AI.

## Keamanan

- Jangan pernah menaruh API key di `index.html` atau meng-commit file `.env*`. File `.gitignore` sudah mengecualikannya.
- Aktifkan `ACCESS_CODE` jika situs dibuka untuk publik, supaya kuota API tidak dipakai orang lain.
- Rate limit bawaan tersimpan di memori tiap instance serverless, sehingga sifatnya *best effort*, bukan perlindungan penuh.
- Pada free tier, penyedia API dapat memakai data yang dikirim untuk melatih model. Jangan kirim data sensitif.

## Dokumentasi lain

- [docs/PANDUAN.md](docs/PANDUAN.md): panduan pemakaian dan tips agar hemat kredit di Google Flow.
- [docs/API.md](docs/API.md): spesifikasi endpoint dan cara menambah tugas AI baru.
