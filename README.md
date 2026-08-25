# 🌟 HabitFlow — Modern Habit & Activity Tracker

> Aplikasi pelacak kebiasaan (*Habit & Activity Tracker*) modern, interaktif, dan responsif dengan visual **GitHub-style contribution heatmap**, animasi *micro-interactions* berbasis **Web Audio API & Framer Motion**, sistem gamifikasi lencana (*Badges*), dan dukungan **Progressive Web App (PWA)** offline.

---

## ✨ Fitur Utama

- 📊 **GitHub-Style Consistency Heatmap**: Visualisasi peta konsistensi 90 hari dengan 5 level intensitas warna dan tooltip interaktif.
- ⚡ **Tactile Checklist & Micro-Interactions**: Animasi centang spring rotasi + efek partikel konfeti (`canvas-confetti`) + efek suara murni browser (`Web Audio API`).
- 🏆 **Gamifikasi & Lencana Pencapaian (*Badges*)**: 7 lencana pencapaian otomatis berdasarkan rekor streak dan akumulasi checklist.
- 📈 **Deep Analytics per-Habit**: Modal detail dengan grafik performa 4 minggu dan tingkat keberhasilan (*success rate %*).
- 📝 **Catatan Refleksi Harian (*Daily Journal*)**: Menyematkan catatan pencapaian atau kendala harian pada setiap log kebiasaan.
- 🔔 **Pengingat Notifikasi Browser**: Sistem pengingat pintar untuk kebiasaan yang belum selesai hari ini.
- 📱 **Progressive Web App (PWA)**: Siap di-install langsung di HP (Android/iOS) dan Desktop (Windows/Mac) dengan dukungan offline penuh.
- 🎨 **Modern Dark & Light Theme**: Dibangun dengan Tailwind CSS dan palet warna OKLCH/HSL yang ramah aksesibilitas (*WCAG 2.1 AA compliant*).
- 💾 **1-Click Backup & Restore Data (JSON)**: Ekspor dan impor seluruh data kebiasaan dengan aman.
- 🛡️ **End-to-End Type Safety**: Validasi runtime menggunakan **Zod Schema** dan arsitektur `StorageAdapter` yang siap disambungkan ke database cloud (Supabase/PostgreSQL).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling & UI Components**: Tailwind CSS, Lucide Icons, Shadcn-style design tokens
- **Animations & Delight**: Framer Motion, Canvas Confetti
- **Audio Synthesizer**: Web Audio API
- **Type Validation**: Zod
- **Storage**: Polymorphic Storage Adapter (`LocalStorageAdapter` / `CloudSyncAdapter`)

---

## 🚀 Panduan Menjalankan Proyek

### 1. Kloning Repositori
```bash
git clone https://github.com/YogiKUmam/Habbit_Tracker.git
cd Habbit_Tracker
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka [http://localhost:5173](http://localhost:5173) di browser Anda.

### 4. Build untuk Produksi
```bash
npm run build
```

---

## 📄 Lisensi
Didistribusikan di bawah Lisensi MIT. Bebas digunakan dan dimodifikasi untuk kebutuhan pribadi maupun komersial.
