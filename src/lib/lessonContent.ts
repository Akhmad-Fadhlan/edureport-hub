// ============================================================
// LESSON CONTENT LIBRARY — Circuit Builder
// Konten materi lengkap untuk semua pelajaran
// ============================================================

export type ContentBlock =
  | { type: "text"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "info"; title: string; body: string }
  | { type: "warning"; body: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "code"; lang: string; label?: string; code: string }
  | { type: "steps"; items: string[] }
  | { type: "cards"; items: { label: string; title: string; body: string }[] }
  | { type: "checklist"; items: string[] }
  | { type: "youtube"; id: string; title: string }
  | { type: "makecode" }
  | { type: "refs"; items: { label: string; url: string }[] };

export type LessonContent = {
  intro: string;
  objectives: string[];
  blocks: ContentBlock[];
};

// ────────────────────────────────────────────────────────────
// SMART TRASHBIN
// ────────────────────────────────────────────────────────────

const smartTrashbin: Record<string, LessonContent> = {
  "penjelasan-microbit": {
    intro:
      "BBC Micro:bit adalah komputer mini seukuran kartu nama yang dibuat khusus untuk mengajarkan coding dan elektronika kepada pelajar.",
    objectives: [
      "Mengenal BBC Micro:bit dan fitur-fiturnya",
      "Membedakan Micro:bit V1 dan V2",
      "Memahami cara memprogram Micro:bit via Makecode",
    ],
    blocks: [
      {
        type: "info",
        title: "Apa itu BBC Micro:bit?",
        body: "BBC Micro:bit adalah microcontroller edukasi seukuran kartu nama, buatan BBC Inggris. Meski kecil, ia punya LED matrix, akselerometer, kompas, Bluetooth, dan banyak sensor bawaan — sempurna untuk belajar coding dan IoT.",
      },
      {
        type: "heading",
        level: 2,
        text: "Fitur Utama Micro:bit V2",
      },
      {
        type: "cards",
        items: [
          { label: "Display", title: "25 LED Matrix (5×5)", body: "Tampilkan teks, angka, ikon, atau animasi." },
          { label: "Input", title: "2 Tombol A & B", body: "Tombol fisik untuk interaksi dan kontrol program." },
          { label: "Sensor", title: "Akselerometer & Kompas", body: "Deteksi gerakan, goyangan, dan arah mata angin." },
          { label: "Wireless", title: "Bluetooth 5.0", body: "Komunikasi nirkabel dengan HP dan perangkat lain." },
          { label: "Audio", title: "Mikrofon & Speaker (V2)", body: "Rekam suara dan mainkan nada langsung dari board." },
          { label: "I/O", title: "25 Pin Konektor", body: "Hubungkan sensor, servo, LED, dan komponen lainnya." },
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Perbandingan Micro:bit V1 vs V2",
      },
      {
        type: "table",
        headers: ["Spesifikasi", "V1", "V2"],
        rows: [
          ["Prosesor", "ARM Cortex-M0 32-bit", "ARM Cortex-M4F 32-bit"],
          ["RAM", "16 KB", "512 KB"],
          ["Flash", "256 KB", "2 MB"],
          ["Bluetooth", "4.0", "5.0"],
          ["Speaker", "❌", "✅"],
          ["Mikrofon", "❌", "✅"],
          ["Sensor Sentuh", "❌", "✅ (logo)"],
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Cara Memprogram Micro:bit",
      },
      {
        type: "steps",
        items: [
          "Buka browser → https://makecode.microbit.org",
          "Klik \"New Project\" dan beri nama project-mu",
          "Drag & drop blok kode dari panel kiri",
          "Klik tombol Download untuk menghasilkan file .hex",
          "Colokkan Micro:bit via USB → salin file .hex ke drive MICROBIT",
          "Tunggu LED kuning berkedip → program selesai terinstal!",
        ],
      },
      {
        type: "info",
        title: "💡 Fun Fact",
        body: "Micro:bit telah didistribusikan ke lebih dari 60 negara dan digunakan oleh lebih dari 30 juta pelajar di seluruh dunia!",
      },
      {
        type: "youtube",
        id: "u2u7UJSRuko",
        title: "Pengenalan BBC Micro:bit",
      },
      {
        type: "refs",
        items: [
          { label: "Micro:bit Official Docs", url: "https://microbit.org/get-started/" },
          { label: "Makecode Reference", url: "https://makecode.microbit.org/reference" },
          { label: "Robobrick — Belajar Micro:bit (ID)", url: "https://robobrick.co.id/belajar-coding-jadi-mudah-mengenal-bbc-microbit-untuk-pemula/" },
        ],
      },
    ],
  },

  "pengenalan-sensor": {
    intro:
      "Sensor adalah \"panca indera\" dari sebuah sistem elektronik — mereka mendeteksi kondisi nyata di dunia dan mengubahnya menjadi sinyal yang bisa dibaca microcontroller.",
    objectives: [
      "Memahami fungsi dan jenis sensor",
      "Membedakan sensor analog dan digital",
      "Mengetahui sensor yang digunakan dalam proyek Smart Trashbin",
    ],
    blocks: [
      {
        type: "cards",
        items: [
          { label: "🔊", title: "Sensor Ultrasonik", body: "Mengukur jarak dengan gelombang suara. Jangkauan 2–400 cm." },
          { label: "💡", title: "Sensor Infrared (IR)", body: "Mendeteksi objek atau garis hitam/putih menggunakan cahaya IR." },
          { label: "🌱", title: "Soil Moisture", body: "Mengukur kadar air dalam tanah. Output analog 0–1023." },
          { label: "🌡️", title: "DHT11/22", body: "Mengukur suhu dan kelembaban udara secara bersamaan." },
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Sensor Analog vs Digital",
      },
      {
        type: "table",
        headers: ["Aspek", "Sensor Digital", "Sensor Analog"],
        rows: [
          ["Output", "0 atau 1 (HIGH/LOW)", "Nilai kontinu (0–1023)"],
          ["Contoh", "Tombol, IR sensor", "Sensor cahaya, soil moisture"],
          ["Ketelitian", "Rendah (2 state)", "Tinggi (banyak nilai)"],
          ["Pin Micro:bit", "Pin digital P0–P16", "Pin analog P0, P1, P2"],
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Cara Kerja Sensor Ultrasonik HC-SR04",
      },
      {
        type: "steps",
        items: [
          "Micro:bit kirim sinyal HIGH 10µs ke pin TRIG",
          "Sensor pancarkan 8 pulsa ultrasonik frekuensi 40 kHz",
          "Gelombang suara merambat di udara (~343 m/s)",
          "Gelombang memantul dari objek di depannya",
          "Pin ECHO menjadi HIGH selama waktu tempuh bolak-balik",
          "Micro:bit hitung jarak: Jarak (cm) = Waktu Echo (µs) ÷ 58",
        ],
      },
      {
        type: "info",
        title: "Mengapa dibagi 58?",
        body: "Kecepatan suara ≈ 0.034 cm/µs. Gelombang menempuh jarak 2× (pergi + balik). Jadi: Jarak = (t × 0.034) ÷ 2 = t ÷ 58.8 ≈ t ÷ 58.",
      },
      {
        type: "warning",
        body: "HC-SR04 bekerja pada 5V, sedangkan pin Micro:bit maksimal 3.3V! Wajib pasang voltage divider (resistor 1kΩ & 2kΩ) di pin ECHO agar Micro:bit tidak rusak.",
      },
    ],
  },

  "input-output": {
    intro:
      "Semua sistem elektronik bekerja dengan pola sederhana: Input → Proses → Output. Memahami konsep ini adalah kunci untuk merancang proyek apapun.",
    objectives: [
      "Memahami model IPO (Input–Proses–Output)",
      "Mengenal pin I/O pada Micro:bit",
      "Menulis kode dasar untuk membaca input dan menghasilkan output",
    ],
    blocks: [
      {
        type: "cards",
        items: [
          { label: "Tahap 1", title: "INPUT", body: "Sensor membaca kondisi lingkungan: jarak, cahaya, suhu, tekanan tombol." },
          { label: "Tahap 2", title: "PROSES", body: "Micro:bit menjalankan logika: membandingkan nilai, menghitung, dan mengambil keputusan." },
          { label: "Tahap 3", title: "OUTPUT", body: "Aktuator bereaksi: servo bergerak, LED menyala, buzzer berbunyi." },
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Pin I/O pada Micro:bit",
      },
      {
        type: "table",
        headers: ["Tipe Pin", "Deskripsi", "Contoh Penggunaan"],
        rows: [
          ["Digital Output", "Keluarkan HIGH (3.3V) atau LOW (0V)", "Menyalakan LED"],
          ["Digital Input", "Baca nilai HIGH atau LOW", "Membaca sensor digital, tombol"],
          ["Analog Output (PWM)", "Sinyal variabel untuk aktuator", "Kontrol servo, kecepatan motor"],
          ["Analog Input", "Baca nilai 0–1023", "Sensor cahaya, soil moisture"],
          ["3V & GND", "Sumber tegangan dan ground", "Power untuk semua komponen"],
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Kode Dasar I/O di Makecode",
      },
      {
        type: "code",
        lang: "javascript",
        label: "pin-io.js",
        code: `// Digital Output — nyalakan LED
pins.digitalWritePin(DigitalPin.P3, 1)  // HIGH = ON
pins.digitalWritePin(DigitalPin.P3, 0)  // LOW = OFF

// Digital Input — baca tombol eksternal
let statusTombol = pins.digitalReadPin(DigitalPin.P1)

// Analog Output (PWM) — kontrol servo
pins.servoWritePin(AnalogPin.P0, 90)  // Putar ke 90°

// Analog Input — baca sensor cahaya/soil
let nilaiSensor = pins.analogReadPin(AnalogPin.P0)  // 0–1023

// Tampilkan nilai ke LED matrix
basic.showNumber(nilaiSensor)`,
      },
      {
        type: "info",
        title: "Tips Wiring",
        body: "Selalu hubungkan GND sebelum VCC. Gunakan resistor 330Ω untuk LED. Sensor HC-SR04 butuh voltage divider karena beroperasi pada 5V.",
      },
    ],
  },

  "komponen-trashbin": {
    intro:
      "Sebelum mulai merakit, penting untuk mengenal setiap komponen: fungsinya, cara kerjanya, dan bagaimana mereka bekerja sama membentuk Smart Trashbin.",
    objectives: [
      "Mengenali komponen Smart Trashbin beserta fungsinya",
      "Memahami peran setiap komponen dalam sistem",
      "Menyiapkan Bill of Materials (BOM) proyek",
    ],
    blocks: [
      {
        type: "table",
        headers: ["No", "Komponen", "Fungsi", "Qty"],
        rows: [
          ["1", "BBC Micro:bit V2", "Controller/otak utama sistem", "1"],
          ["2", "Sensor Ultrasonik HC-SR04", "Mendeteksi tangan/objek di depan trashbin", "1"],
          ["3", "Servo Motor SG90", "Membuka dan menutup tutup trashbin", "1"],
          ["4", "LED Hijau", "Indikator: tangan terdeteksi / siap", "1"],
          ["5", "LED Merah", "Indikator: trashbin penuh", "1"],
          ["6", "Buzzer Pasif", "Notifikasi suara saat buka/penuh", "1"],
          ["7", "Resistor 330Ω", "Pelindung LED dari arus berlebih", "2"],
          ["8", "Resistor 1kΩ & 2kΩ", "Voltage divider untuk pin ECHO HC-SR04", "1 each"],
          ["9", "Breadboard", "Papan rangkaian tanpa solder", "1"],
          ["10", "Kabel Jumper", "Menghubungkan semua komponen", "15+"],
          ["11", "Baterai / Power Bank", "Sumber daya sistem", "1"],
          ["12", "Wadah/Kotak", "Body tempat sampah", "1"],
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Peran Setiap Komponen",
      },
      {
        type: "cards",
        items: [
          { label: "🧠", title: "Micro:bit (Controller)", body: "Membaca sensor, menjalankan logika program, mengontrol semua output. Diibaratkan sebagai 'otak' trashbin." },
          { label: "👁️", title: "HC-SR04 (Mata)", body: "Ditempatkan di depan tutup. Saat tangan mendekat (<20 cm), sensor mengirim sinyal ke Micro:bit." },
          { label: "💪", title: "Servo SG90 (Tangan)", body: "Berputar 0°→90° untuk membuka tutup, dan kembali ke 0° untuk menutup. Torsi 1.8 kg/cm." },
          { label: "🚦", title: "LED + Buzzer (Indikator)", body: "LED hijau = siap digunakan. LED merah + buzzer = trashbin penuh, perlu dikosongkan." },
        ],
      },
      {
        type: "info",
        title: "💰 Estimasi Biaya",
        body: "Total komponen diperkirakan sekitar Rp 150.000 – Rp 250.000 tergantung toko dan kualitas komponen. Micro:bit bisa dibeli di toko elektronik online maupun ELECFREAKS dan Robobrick.",
      },
    ],
  },

  // FLOWCHART
  "flowchart": {
    intro:
      "Flowchart adalah peta jalan program kita. Sebelum menulis satu baris kode pun, membuat flowchart membantu kita berpikir sistematis dan menghindari bug.",
    objectives: [
      "Memahami simbol-simbol standar flowchart",
      "Membuat flowchart sistem Smart Trashbin",
      "Menggunakan flowchart sebagai panduan penulisan kode",
    ],
    blocks: [
      {
        type: "table",
        headers: ["Simbol", "Nama", "Fungsi"],
        rows: [
          ["⬭ Oval", "Terminal", "Titik Mulai dan Selesai program"],
          ["▭ Persegi", "Proses", "Aksi atau operasi (mis. buka servo)"],
          ["◇ Wajik", "Keputusan", "Kondisi if/else — percabangan"],
          ["▱ Jajaran genjang", "I/O", "Membaca input atau menampilkan output"],
          ["→ Panah", "Alur", "Arah jalannya program"],
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Flowchart Smart Trashbin",
      },
      {
        type: "code",
        lang: "text",
        label: "flowchart.txt",
        code: `           [MULAI]
               ↓
   [Inisialisasi: Servo = 0°, LED mati]
               ↓
      [Baca Sensor Ultrasonik]
               ↓
      ◇ Jarak < 20 cm? ◇
       YA ↙         ↘ TIDAK
          ↓               ↓
 [Nyalakan LED Hijau]  [Matikan LED]
          ↓               ↓
 [Buka Tutup: 90°]    [Servo = 0°]
          ↓               ↑
  [Tunggu 3 detik]        │
          ↓               │
 [Tutup: Servo = 0°]      │
          ↓               │
  [Matikan LED Hijau] ────┘
          ↓
    [Kembali ke Baca Sensor]`,
      },
      {
        type: "steps",
        items: [
          "Mulai dari terminal 'MULAI'",
          "Identifikasi semua kondisi input yang mungkin terjadi",
          "Gambar proses langkah per langkah secara berurutan",
          "Tambahkan wajik keputusan di setiap percabangan logika",
          "Pastikan semua jalur memiliki akhir atau kembali ke loop",
          "Review: apakah ada skenario yang belum ditangani?",
        ],
      },
    ],
  },

  "cara-kerja-sensor": {
    intro:
      "Memahami cara kerja sensor ultrasonik secara mendalam membantu kita men-debug masalah dan mengoptimalkan performa Smart Trashbin.",
    objectives: [
      "Menjelaskan prinsip kerja sonar pada HC-SR04",
      "Menghitung jarak menggunakan rumus waktu tempuh",
      "Memahami cara wiring sensor aman ke Micro:bit",
    ],
    blocks: [
      {
        type: "steps",
        items: [
          "Micro:bit kirim sinyal HIGH 10 µs ke pin TRIG sensor",
          "Sensor memancarkan 8 pulsa ultrasonik pada frekuensi 40 kHz",
          "Gelombang suara merambat di udara dengan kecepatan ~343 m/s",
          "Gelombang memantul dari objek (tangan, sampah, dinding)",
          "Sensor menerima pantulan → pin ECHO menjadi HIGH",
          "Micro:bit ukur durasi ECHO → hitung jarak dengan rumus",
        ],
      },
      {
        type: "info",
        title: "Rumus Jarak",
        body: "Jarak (cm) = Waktu Echo (µs) ÷ 58\n\nContoh: Waktu echo = 1160 µs → Jarak = 1160 ÷ 58 = 20 cm",
      },
      {
        type: "heading",
        level: 2,
        text: "Wiring Aman HC-SR04 ke Micro:bit",
      },
      {
        type: "code",
        lang: "text",
        label: "wiring.txt",
        code: `HC-SR04          Micro:bit
  VCC    ──────►  3V
  TRIG   ──────►  P1
  ECHO   ──┐
           ├── 1kΩ ──► P2 (Micro:bit)
           │
          2kΩ
           │
          GND (semua)

Voltage divider di ECHO:
V_P2 = 5V × (2kΩ / (1kΩ+2kΩ)) = 3.3V ✅`,
      },
      {
        type: "warning",
        body: "Tanpa voltage divider, tegangan 5V dari ECHO akan merusak pin Micro:bit yang hanya tahan 3.3V. Selalu pasang resistor 1kΩ dan 2kΩ!",
      },
      {
        type: "table",
        headers: ["Masalah", "Penyebab", "Solusi"],
        rows: [
          ["Nilai selalu 0", "Pin TRIG/ECHO terbalik", "Cek wiring: TRIG→P1, ECHO→P2"],
          ["Nilai sangat besar (999+)", "Tidak ada objek terdeteksi", "Normal jika tidak ada benda di depan"],
          ["Nilai tidak stabil", "Permukaan tidak rata / interferensi", "Ambil rata-rata 5 sampel"],
          ["Micro:bit panas / crash", "Tegangan berlebih tanpa divider", "Pasang voltage divider!"],
        ],
      },
    ],
  },

  "logika-buka-tutup": {
    intro:
      "Logika buka–tutup otomatis adalah jantung dari Smart Trashbin. Di sini kita menggabungkan pembacaan sensor dengan aksi servo menggunakan percabangan if-else.",
    objectives: [
      "Memahami logika boolean dalam pemrograman",
      "Menulis kondisi buka-tutup yang tepat",
      "Mengimplementasikan multi-kondisi (termasuk sensor penuh)",
    ],
    blocks: [
      {
        type: "code",
        lang: "javascript",
        label: "logika-dasar.js",
        code: `// Pseudocode: Logika Smart Trashbin
basic.forever(function () {
    let jarak = sensor.bacaUltrasonic()

    // Kondisi 1: Tangan mendekat
    if (jarak < 20) {
        bukaTutup()        // servo → 90°
        nyalakanLED("hijau")
        basic.pause(3000)  // tunggu 3 detik
        tutupKembali()     // servo → 0°
        matikanLED()
    }

    // Kondisi 2: Sampah hampir penuh (sensor dalam)
    if (jarakDalam < 5) {
        nyalakanLED("merah")
        bunyikanBuzzer()
    }

    basic.pause(200)  // sampling 5x/detik
})`,
      },
      {
        type: "table",
        headers: ["Kondisi Sensor", "Aksi Sistem"],
        rows: [
          ["Jarak luar < 20 cm (tangan dekat)", "Servo buka (90°) + LED hijau ON"],
          ["Jarak luar ≥ 20 cm", "Servo tutup (0°) + LED hijau OFF"],
          ["Jarak dalam < 5 cm (penuh)", "LED merah + buzzer peringatan"],
          ["Jarak dalam ≥ 5 cm", "Normal, tidak ada aksi khusus"],
        ],
      },
      {
        type: "info",
        title: "Operator Logika",
        body: "< lebih kecil | > lebih besar | <= kurang dari/sama | >= lebih dari/sama | == sama | != tidak sama | && DAN | || ATAU",
      },
      {
        type: "code",
        lang: "javascript",
        label: "multi-kondisi.js",
        code: `// Buka HANYA jika tangan dekat DAN tempat sampah tidak penuh
if (jarakLuar < 20 && jarakDalam > 10) {
    bukaServo()
}

// Peringatan jika penuh ATAU hampir penuh
if (jarakDalam < 3 || statusPenuh == true) {
    peringatan()
}`,
      },
    ],
  },

  "simulasi-algoritma": {
    intro:
      "Simulasi memungkinkan kita menguji logika program tanpa hardware fisik — menghemat waktu, mengurangi risiko, dan memudahkan debugging.",
    objectives: [
      "Menggunakan Makecode Simulator untuk menguji program",
      "Melakukan debugging dengan menampilkan nilai variabel",
      "Memvalidasi semua skenario sebelum implementasi hardware",
    ],
    blocks: [
      {
        type: "cards",
        items: [
          { label: "1", title: "Makecode Simulator", body: "Bawaan Makecode — simulasi Micro:bit langsung di browser. Gratis, tanpa install." },
          { label: "2", title: "Wokwi", body: "Simulasi circuit lengkap dengan komponen virtual: LED, sensor, servo. Buka di wokwi.com." },
          { label: "3", title: "Tinkercad", body: "Simulasi Arduino dengan visualisasi wiring yang bagus. Cocok untuk perencanaan rangkaian." },
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Langkah Simulasi di Makecode",
      },
      {
        type: "steps",
        items: [
          "Buka https://makecode.microbit.org → New Project",
          "Tulis program menggunakan blok atau JavaScript",
          "Klik tombol ▶️ di panel simulator kiri",
          "Geser slider sensor untuk mensimulasikan nilai",
          "Amati perilaku LED matrix dan output lainnya",
          "Debug: tambahkan blok 'show number' untuk melihat nilai variabel",
        ],
      },
      {
        type: "code",
        lang: "javascript",
        label: "debug-tips.js",
        code: `// Tips debugging: tampilkan nilai variabel
basic.forever(function () {
    let jarak = sonar.ping(DigitalPin.P1, DigitalPin.P2, PingUnit.Centimeters)

    // DEBUG: tampilkan nilai jarak di LED matrix
    basic.showNumber(jarak)

    if (jarak < 20) {
        basic.showString("BUKA")
        // ... logika buka tutup
    } else {
        basic.showString("TUTUP")
    }

    basic.pause(500)
})`,
      },
      {
        type: "makecode",
      },
    ],
  },

  // MAKECODE BASIC
  "variable": {
    intro:
      "Variabel adalah 'kotak penyimpanan' di memori yang menyimpan data sementara. Memahami variabel adalah fondasi dari semua pemrograman.",
    objectives: [
      "Memahami konsep dan fungsi variabel",
      "Membuat dan menggunakan variabel di Makecode",
      "Menerapkan aturan penamaan variabel yang baik",
    ],
    blocks: [
      {
        type: "info",
        title: "Analogi Variabel",
        body: "Bayangkan variabel seperti loker sekolah. Setiap loker punya nomor unik (nama variabel) dan bisa diisi barang berbeda-beda (nilai/value) kapanpun kamu mau.",
      },
      {
        type: "table",
        headers: ["Tipe Data", "Contoh Nilai", "Contoh Deklarasi"],
        rows: [
          ["Number (angka)", "0, 20, -5, 3.14", "let jarak = 0"],
          ["String (teks)", "'Halo', 'BUKA'", "let pesan = \"Siap\""],
          ["Boolean (benar/salah)", "true, false", "let tutupTerbuka = false"],
        ],
      },
      {
        type: "code",
        lang: "javascript",
        label: "variabel.js",
        code: `// Deklarasi variabel
let jarak = 0
let tutupTerbuka = false
let hitunganBuka = 0
let pesanStatus = "Siap"

// Ubah nilai variabel
jarak = 15              // langsung
hitunganBuka += 1       // tambahkan 1
hitunganBuka = hitunganBuka + 1  // sama saja

// Gunakan dalam kondisi
if (jarak < 20) {
    tutupTerbuka = true
    hitunganBuka += 1
    basic.showNumber(hitunganBuka)
}`,
      },
      {
        type: "checklist",
        items: [
          "Gunakan nama deskriptif: jarakSensor bukan x atau a",
          "Mulai dengan huruf kecil: jarakSensor bukan JarakSensor",
          "Gunakan camelCase: statusPintu bukan status_pintu",
          "Tidak boleh ada spasi: jarakSensor bukan 'jarak sensor'",
          "Tidak boleh mulai dengan angka: bukan 1sensor",
        ],
      },
    ],
  },

  "percabangan": {
    intro:
      "Percabangan memungkinkan program mengambil keputusan yang berbeda berdasarkan kondisi. Tanpa percabangan, program hanya bisa menjalankan instruksi secara lurus.",
    objectives: [
      "Memahami struktur if, if-else, dan if-else if",
      "Menerapkan percabangan pada logika Smart Trashbin",
      "Menggabungkan beberapa kondisi dengan operator logika",
    ],
    blocks: [
      {
        type: "code",
        lang: "javascript",
        label: "percabangan.js",
        code: `// Bentuk 1: if tunggal
if (jarak < 20) {
    bukaTutup()
}

// Bentuk 2: if-else
if (jarak < 20) {
    bukaTutup()
} else {
    tutupKembali()
}

// Bentuk 3: if-else if-else (multi kondisi)
if (jarak < 10) {
    basic.showString("SANGAT DEKAT!")
} else if (jarak < 20) {
    basic.showString("DEKAT")
} else if (jarak < 50) {
    basic.showString("SEDANG")
} else {
    basic.showString("JAUH")
}`,
      },
      {
        type: "code",
        lang: "javascript",
        label: "contoh-trashbin.js",
        code: `basic.forever(function () {
    let jarak = sonar.ping(DigitalPin.P1, DigitalPin.P2, PingUnit.Centimeters)

    if (jarak < 20) {
        // Buka tutup
        pins.servoWritePin(AnalogPin.P0, 90)
        pins.digitalWritePin(DigitalPin.P3, 1)  // LED hijau ON
        basic.pause(3000)                        // tunggu 3 detik
        pins.servoWritePin(AnalogPin.P0, 0)
        pins.digitalWritePin(DigitalPin.P3, 0)  // LED hijau OFF
    }

    basic.pause(200)
})`,
      },
    ],
  },

  "looping": {
    intro:
      "Looping (pengulangan) memungkinkan program menjalankan blok kode berulang kali — dasar dari hampir semua program yang terus berjalan seperti sistem sensor.",
    objectives: [
      "Memahami jenis-jenis loop: forever, for, while",
      "Memilih jenis loop yang tepat untuk setiap situasi",
      "Membuat animasi dan efek berulang menggunakan loop",
    ],
    blocks: [
      {
        type: "cards",
        items: [
          { label: "forever", title: "Loop Selamanya", body: "Berjalan terus-menerus. Cocok untuk membaca sensor dan monitoring berkelanjutan." },
          { label: "for", title: "Loop N Kali", body: "Ulangi tepat N kali. Cocok untuk animasi, blink LED, atau tugas yang sudah diketahui jumlahnya." },
          { label: "while", title: "Loop Bersyarat", body: "Terus berjalan selama kondisi terpenuhi. Cocok untuk menunggu suatu kejadian." },
        ],
      },
      {
        type: "code",
        lang: "javascript",
        label: "jenis-loop.js",
        code: `// forever — baca sensor terus-menerus
basic.forever(function () {
    let jarak = bacaSensor()
    proses(jarak)
    basic.pause(200)
})

// for — LED berkedip 3x saat penuh
for (let i = 0; i < 3; i++) {
    pins.digitalWritePin(DigitalPin.P4, 1)  // LED merah ON
    basic.pause(300)
    pins.digitalWritePin(DigitalPin.P4, 0)  // LED merah OFF
    basic.pause(300)
}

// while — tunggu sampai tutup benar-benar terbuka
let sudut = 0
while (sudut < 90) {
    pins.servoWritePin(AnalogPin.P0, sudut)
    sudut += 5
    basic.pause(20)
}`,
      },
      {
        type: "info",
        title: "Kapan pakai mana?",
        body: "forever → tugas terus-menerus (baca sensor) | for → ulangi N kali yang sudah diketahui | while → ulangi sampai kondisi terpenuhi",
      },
    ],
  },

  "pins": {
    intro:
      "Pin adalah jembatan antara Micro:bit dan dunia nyata. Memahami cara kerja dan keterbatasan setiap pin sangat penting untuk wiring yang benar dan aman.",
    objectives: [
      "Mengenal layout pin pada Micro:bit",
      "Menggunakan kode untuk membaca dan menulis pin",
      "Menerapkan prinsip keamanan dalam penggunaan pin",
    ],
    blocks: [
      {
        type: "table",
        headers: ["Pin", "Fungsi", "Keterangan"],
        rows: [
          ["P0, P1, P2", "Analog & Digital, PWM", "Pin 'besar' dengan ring — mudah pakai krokodil clip"],
          ["P3–P16", "Digital I/O", "Pin tambahan via edge connector"],
          ["3V", "Sumber tegangan 3.3V", "Maks 90mA — jangan untuk motor besar"],
          ["GND", "Ground (0V)", "Referensi negatif untuk semua komponen"],
          ["USB", "Power & programming", "5V dari komputer, jangan hubungkan langsung"],
        ],
      },
      {
        type: "code",
        lang: "javascript",
        label: "kontrol-pin.js",
        code: `// ── Digital Output ──────────────────
pins.digitalWritePin(DigitalPin.P3, 1)  // Nyalakan LED (HIGH)
pins.digitalWritePin(DigitalPin.P3, 0)  // Matikan LED (LOW)

// ── Digital Input ────────────────────
let nilaiTombol = pins.digitalReadPin(DigitalPin.P1)
// nilaiTombol = 0 atau 1

// ── Servo Control (PWM) ─────────────
pins.servoWritePin(AnalogPin.P0, 0)    // 0° tertutup
pins.servoWritePin(AnalogPin.P0, 90)   // 90° terbuka
pins.servoWritePin(AnalogPin.P0, 180)  // 180° penuh

// ── Analog Input ─────────────────────
let nilai = pins.analogReadPin(AnalogPin.P0)  // 0–1023
basic.showNumber(nilai)`,
      },
      {
        type: "warning",
        body: "Pin Micro:bit maksimal toleransi 3.3V dan 5mA per pin. Selalu gunakan resistor untuk LED dan voltage divider untuk sensor 5V. Short circuit dapat merusak Micro:bit secara permanen!",
      },
    ],
  },

  // TRASHBIN CODING
  "coding-lengkap": {
    intro:
      "Inilah momen yang ditunggu-tunggu! Kita akan menulis program Smart Trashbin secara lengkap dan menyeluruh, menggabungkan semua konsep yang telah dipelajari.",
    objectives: [
      "Menulis program Smart Trashbin secara lengkap",
      "Memahami struktur kode yang baik dengan fungsi dan komentar",
      "Men-download dan mengujikan program ke Micro:bit",
    ],
    blocks: [
      {
        type: "code",
        lang: "javascript",
        label: "smart-trashbin-full.js",
        code: `// ══════════════════════════════════════════
// SMART TRASHBIN — Micro:bit + HC-SR04
// Referensi: microbit.org & elecfreaks.com
// ══════════════════════════════════════════

// ── Konfigurasi ──────────────────────────
const JARAK_BUKA = 20      // cm: jarak tangan untuk buka
const SUDUT_BUKA = 90      // derajat: servo saat terbuka
const SUDUT_TUTUP = 0      // derajat: servo saat tertutup
const DELAY_TUTUP = 3000   // ms: jeda sebelum menutup

// ── Variabel Global ───────────────────────
let tutupTerbuka = false
let hitunganBuka = 0

// ── Fungsi: Baca Sensor ───────────────────
function bacaSensor(): number {
    return sonar.ping(
        DigitalPin.P1,
        DigitalPin.P2,
        PingUnit.Centimeters
    )
}

// ── Fungsi: Buka Tutup ────────────────────
function bukaTutup() {
    if (!tutupTerbuka) {
        pins.servoWritePin(AnalogPin.P0, SUDUT_BUKA)
        pins.digitalWritePin(DigitalPin.P3, 1)  // LED hijau
        music.playTone(523, 100)
        tutupTerbuka = true
        hitunganBuka += 1
    }
}

// ── Fungsi: Tutup Kembali ─────────────────
function tutupKembali() {
    pins.servoWritePin(AnalogPin.P0, SUDUT_TUTUP)
    pins.digitalWritePin(DigitalPin.P3, 0)
    tutupTerbuka = false
}

// ── Fungsi: Peringatan Penuh ──────────────
function peringatanPenuh() {
    for (let i = 0; i < 3; i++) {
        pins.digitalWritePin(DigitalPin.P4, 1)  // LED merah
        music.playTone(262, 300)
        basic.pause(100)
        pins.digitalWritePin(DigitalPin.P4, 0)
        basic.pause(200)
    }
}

// ── Inisialisasi ──────────────────────────
pins.servoWritePin(AnalogPin.P0, SUDUT_TUTUP)
led.enable(false)

// ── Tombol A: lihat statistik ─────────────
input.onButtonPressed(Button.A, function () {
    basic.showString("N:" + hitunganBuka)
})

// ── Program Utama ─────────────────────────
basic.forever(function () {
    let jarak = bacaSensor()

    if (jarak > 0 && jarak < JARAK_BUKA) {
        bukaTutup()
        basic.pause(DELAY_TUTUP)
        tutupKembali()
    }

    basic.pause(200)
})`,
      },
      {
        type: "steps",
        items: [
          "Buka Makecode → New Project → beri nama 'SmartTrashbin'",
          "Klik Extensions → cari 'Sonar' → tambahkan ekstensi",
          "Beralih ke mode JavaScript → paste kode di atas",
          "Klik tombol Download → simpan file .hex",
          "Colokkan Micro:bit ke komputer → salin file ke drive MICROBIT",
          "Tunggu LED kuning selesai berkedip → uji coba!",
        ],
      },
      {
        type: "makecode",
      },
    ],
  },

  "ultrasonic": {
    intro:
      "Integrasi sensor ultrasonik yang baik membutuhkan kalibrasi dan filter yang tepat agar pembacaan stabil dan akurat dalam berbagai kondisi.",
    objectives: [
      "Menerapkan filter rata-rata untuk pembacaan sensor yang stabil",
      "Melakukan kalibrasi sensor ultrasonik",
      "Menangani nilai error dari sensor",
    ],
    blocks: [
      {
        type: "code",
        lang: "javascript",
        label: "sensor-filter.js",
        code: `// Fungsi baca sensor dengan filter rata-rata (5 sampel)
function bacaSensorStabil(): number {
    let total = 0
    let valid = 0

    for (let i = 0; i < 5; i++) {
        let nilai = sonar.ping(
            DigitalPin.P1,
            DigitalPin.P2,
            PingUnit.Centimeters
        )
        // Filter nilai tidak valid (0 atau > 400)
        if (nilai > 0 && nilai <= 400) {
            total += nilai
            valid++
        }
        basic.pause(20)  // 20ms antar sampel
    }

    if (valid > 0) {
        return Math.round(total / valid)  // Rata-rata
    }
    return 999  // Error: tidak ada objek terdeteksi
}`,
      },
      {
        type: "table",
        headers: ["Masalah", "Penyebab", "Solusi"],
        rows: [
          ["Nilai 0 terus", "TRIG/ECHO terbalik", "Cek wiring, TRIG→P1 ECHO→P2"],
          ["Nilai melompat-lompat", "Getaran / pantulan ganda", "Gunakan filter rata-rata"],
          ["Nilai 999", "Tidak ada objek di depan", "Normal — cek jangkauan sensor"],
          ["Nilai selalu sama", "Sensor rusak / kabel putus", "Ganti kabel atau sensor"],
        ],
      },
      {
        type: "refs",
        items: [
          { label: "HC-SR04 Datasheet", url: "https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf" },
          { label: "Kitronik: Distance Sensing with Micro:bit", url: "https://kitronik.co.uk/blogs/resources/distance-sensing-microbit-hc-sr04-module" },
        ],
      },
    ],
  },

  "servo": {
    intro:
      "Servo motor adalah aktuator presisi yang bisa berputar ke sudut tertentu. Memahami cara kerjanya membantu kita membuat gerakan tutup trashbin yang mulus dan andal.",
    objectives: [
      "Memahami cara kerja servo motor dan sinyal PWM",
      "Mengontrol servo dengan Makecode",
      "Membuat animasi gerakan servo yang halus",
    ],
    blocks: [
      {
        type: "table",
        headers: ["Kabel", "Warna", "Fungsi"],
        rows: [
          ["Signal", "Oranye / Kuning", "Sinyal PWM kontrol sudut"],
          ["VCC", "Merah", "Tegangan (4.8–6V)"],
          ["GND", "Coklat / Hitam", "Ground"],
        ],
      },
      {
        type: "info",
        title: "Cara Kerja PWM pada Servo",
        body: "Servo dikendalikan sinyal PWM 20ms (50Hz). Lebar pulsa menentukan sudut: 1ms→0°, 1.5ms→90°, 2ms→180°. Makecode menyederhanakan ini dengan pins.servoWritePin(pin, sudut).",
      },
      {
        type: "code",
        lang: "javascript",
        label: "servo-control.js",
        code: `// Kontrol servo dasar
pins.servoWritePin(AnalogPin.P0, 0)    // Tutup (0°)
basic.pause(1000)
pins.servoWritePin(AnalogPin.P0, 90)   // Buka (90°)
basic.pause(1000)
pins.servoWritePin(AnalogPin.P0, 180)  // Penuh (180°)

// Gerakan halus (smooth sweep)
function bukaHalus() {
    for (let sudut = 0; sudut <= 90; sudut += 3) {
        pins.servoWritePin(AnalogPin.P0, sudut)
        basic.pause(15)  // 15ms per derajat
    }
}

function tutupHalus() {
    for (let sudut = 90; sudut >= 0; sudut -= 3) {
        pins.servoWritePin(AnalogPin.P0, sudut)
        basic.pause(15)
    }
}`,
      },
      {
        type: "refs",
        items: [
          { label: "Micro:bit + Servo Tutorial (Official)", url: "https://support.microbit.org/support/solutions/articles/19000101864-using-a-servo-with-the-micro-bit" },
          { label: "ELECFREAKS Servo Lesson", url: "https://www.elecfreaks.com/learn-en/microbitKit/Starter_Kit/starter_kit_case_08.html" },
        ],
      },
    ],
  },

  "led-buzzer": {
    intro:
      "LED dan buzzer adalah komponen output paling dasar dan paling sering digunakan. Bersama, mereka memberikan feedback visual dan audio yang jelas kepada pengguna.",
    objectives: [
      "Memahami cara kerja LED dan cara menghitung resistor",
      "Membedakan buzzer aktif dan pasif",
      "Membuat pola LED dan melodi buzzer untuk indikator Smart Trashbin",
    ],
    blocks: [
      {
        type: "info",
        title: "Rumus Resistor LED",
        body: "R = (VCC − V_LED) ÷ I_LED = (3.3V − 2V) ÷ 0.02A = 65Ω → gunakan 100Ω atau 330Ω (nilai terdekat yang tersedia).",
      },
      {
        type: "table",
        headers: ["Aspek", "Buzzer Aktif", "Buzzer Pasif"],
        rows: [
          ["Osilator", "Built-in (internal)", "Tidak ada — butuh PWM"],
          ["Cara pakai", "digitalWritePin (HIGH/LOW)", "music.playTone()"],
          ["Nada", "Hanya satu frekuensi", "Bisa berbagai nada"],
          ["Fleksibilitas", "Rendah", "Tinggi"],
        ],
      },
      {
        type: "code",
        lang: "javascript",
        label: "led-buzzer.js",
        code: `// ── LED Control ──────────────────────
pins.digitalWritePin(DigitalPin.P3, 1)  // Hijau ON
pins.digitalWritePin(DigitalPin.P4, 1)  // Merah ON
pins.digitalWritePin(DigitalPin.P3, 0)  // Hijau OFF

// ── Buzzer Nada ───────────────────────
music.playTone(523, 100)   // Do (C5)
music.playTone(659, 100)   // Mi (E5)
music.playTone(784, 200)   // Sol (G5)

// ── Indikator buka tutup ──────────────
function indikatorBuka() {
    pins.digitalWritePin(DigitalPin.P3, 1)
    music.playTone(523, 80)
    basic.pause(40)
    music.playTone(659, 80)
}

// ── Peringatan penuh (3x kedip + bunyi) ─
function peringatanPenuh() {
    for (let n = 0; n < 3; n++) {
        pins.digitalWritePin(DigitalPin.P4, 1)
        music.playTone(262, 250)
        basic.pause(100)
        pins.digitalWritePin(DigitalPin.P4, 0)
        basic.pause(150)
    }
}`,
      },
    ],
  },

  // K3
  "keselamatan": {
    intro:
      "Keselamatan Kerja bukan hanya aturan — ini adalah kebiasaan yang melindungi dirimu, teman, dan peralatan lab. Setiap insiden bisa dicegah dengan persiapan yang baik.",
    objectives: [
      "Mengidentifikasi bahaya umum dalam proyek elektronik",
      "Menerapkan prosedur keselamatan dasar",
      "Mengetahui cara merespons insiden di lab",
    ],
    blocks: [
      {
        type: "cards",
        items: [
          { label: "⚡", title: "Sengatan Listrik", body: "Bahkan tegangan rendah bisa berbahaya jika ada luka terbuka. Selalu matikan daya saat modifikasi wiring." },
          { label: "🔥", title: "Panas Berlebih", body: "Komponen salah pasang bisa sangat panas. Short circuit bisa membakar komponen atau bahkan menyebabkan kebakaran kecil." },
          { label: "💨", title: "Asap Solder", body: "Asap solder mengandung zat berbahaya. Selalu solder di tempat berventilasi baik atau gunakan fume extractor." },
          { label: "🔌", title: "Short Circuit", body: "Koneksi VCC langsung ke GND menyebabkan arus tak terhingga. Selalu periksa wiring sebelum menghidupkan daya." },
        ],
      },
      {
        type: "checklist",
        items: [
          "Periksa wiring sebelum menyalakan daya",
          "Gunakan tegangan sesuai spesifikasi komponen",
          "Pasang resistor pada LED dan komponen sensitif",
          "Matikan daya saat memodifikasi rangkaian",
          "Cuci tangan setelah bekerja dengan komponen elektronik",
          "Jangan menyentuh komponen yang sedang beroperasi",
          "Jangan memaksakan konektor yang tidak pas",
          "Laporkan segera jika ada komponen yang panas berlebih",
        ],
      },
    ],
  },

  "solder": {
    intro:
      "Solder adalah teknik menyambungkan komponen elektronik menggunakan timah yang dilelehkan. Dikerjakan dengan benar, hasil solder sangat kuat dan andal.",
    objectives: [
      "Mengenal alat-alat solder dan fungsinya",
      "Melakukan teknik solder yang benar",
      "Membedakan solder yang baik dan buruk",
    ],
    blocks: [
      {
        type: "steps",
        items: [
          "Panaskan solder iron hingga 300–370°C (tunggu 2–3 menit)",
          "Bersihkan ujung solder iron dengan spons basah atau brass cleaner",
          "Panaskan titik sambungan (bukan timah) selama 2–3 detik",
          "Sentuhkan timah ke titik sambungan (bukan ke ujung iron)",
          "Biarkan timah mengalir sendiri mengisi sambungan",
          "Angkat timah dulu, lalu angkat solder iron",
          "Biarkan sambungan dingin 10 detik sebelum disentuh",
        ],
      },
      {
        type: "table",
        headers: ["Hasil Solder", "Ciri-ciri", "Status"],
        rows: [
          ["Baik", "Mengkilap, berbentuk gunung kecil, melekat sempurna", "✅ OK"],
          ["Cold joint", "Permukaan kusam/abu-abu, tidak mengkilap", "❌ Ulangi"],
          ["Solder bridge", "Timah menghubungkan 2 titik yang seharusnya terpisah", "❌ Bersihkan"],
          ["Terlalu banyak timah", "Gundukan besar, bisa menyentuh pin tetangga", "❌ Kurangi"],
        ],
      },
      {
        type: "warning",
        body: "Selalu taruh solder iron di dudukan saat tidak digunakan. Ujung iron bisa mencapai 400°C — cukup panas untuk membakar kulit dan plastik dalam sepersekian detik.",
      },
    ],
  },

  "tegangan": {
    intro:
      "Memahami konsep dasar listrik — tegangan, arus, dan hambatan — adalah fondasi yang wajib dikuasai sebelum bekerja dengan komponen elektronik apapun.",
    objectives: [
      "Memahami Hukum Ohm (V = I × R)",
      "Mengenal level tegangan yang digunakan dalam proyek",
      "Menerapkan konsep voltage divider untuk keamanan Micro:bit",
    ],
    blocks: [
      {
        type: "info",
        title: "Hukum Ohm: V = I × R",
        body: "V (Volt) = Tegangan — tekanan yang mendorong elektron | I (Ampere) = Arus — banyaknya elektron yang mengalir | R (Ohm) = Hambatan — perlawanan terhadap aliran arus",
      },
      {
        type: "table",
        headers: ["Sumber", "Tegangan", "Penggunaan"],
        rows: [
          ["Micro:bit (USB)", "5V → diregulasi 3.3V", "Power seluruh sistem"],
          ["Pin I/O Micro:bit", "Maks 3.3V, 5mA", "Sensor digital/analog, LED"],
          ["Servo SG90", "4.8–6V", "Butuh sumber eksternal atau regulator"],
          ["HC-SR04", "5V", "Butuh voltage divider ke Micro:bit"],
          ["Listrik Rumah (AC)", "220V", "SANGAT BERBAHAYA — jangan sentuh!"],
        ],
      },
      {
        type: "code",
        lang: "text",
        label: "voltage-divider.txt",
        code: `Voltage Divider untuk ECHO HC-SR04:

  ECHO (5V) ──── 1kΩ ──── Node A ──── 2kΩ ──── GND
                              │
                           P2 Micro:bit

  V_A = 5V × (2kΩ / (1kΩ + 2kΩ))
      = 5V × (2/3)
      = 3.33V ✅ (aman untuk Micro:bit)`,
      },
    ],
  },

  "sop-lab": {
    intro:
      "SOP (Standard Operating Procedure) adalah panduan resmi yang wajib diikuti di laboratorium untuk menjaga keselamatan, ketertiban, dan kelestarian alat.",
    objectives: [
      "Memahami aturan masuk dan bekerja di laboratorium",
      "Mengetahui cara merespons situasi darurat",
      "Mempraktikkan etika dan tanggung jawab di lab",
    ],
    blocks: [
      {
        type: "checklist",
        items: [
          "[Sebelum Masuk] Kenakan alas kaki tertutup",
          "[Sebelum Masuk] Amankan rambut panjang",
          "[Sebelum Masuk] Lepas perhiasan logam",
          "[Sebelum Masuk] Cuci tangan",
          "[Saat Bekerja] Minta izin sebelum menyalakan peralatan",
          "[Saat Bekerja] Catat semua perubahan wiring di lembar kerja",
          "[Saat Bekerja] Laporkan kerusakan alat ke instruktur",
          "[Saat Bekerja] Jangan makan atau minum di area kerja",
          "[Setelah Selesai] Bersihkan dan rapikan meja kerja",
          "[Setelah Selesai] Kembalikan alat ke tempat semula",
        ],
      },
      {
        type: "cards",
        items: [
          { label: "⚡", title: "Tersengat Listrik Ringan", body: "Segera putus aliran listrik. Jika ada luka bakar, siram air mengalir 10 menit. Lapor ke instruktur." },
          { label: "🔥", title: "Kebakaran Kecil", body: "Gunakan APAR (Alat Pemadam Api Ringan). Hubungi instruktur. Jangan pakai air untuk api listrik!" },
          { label: "🤕", title: "Luka Bakar", body: "Siram dengan air dingin mengalir 10–20 menit. Segera ke UKS. Jangan balut dengan mentega atau pasta gigi." },
        ],
      },
    ],
  },

  // INTEGRASI
  "wiring": {
    intro:
      "Wiring diagram adalah panduan koneksi fisik antara semua komponen. Wiring yang salah bisa merusak komponen, jadi selalu verifikasi sebelum menghidupkan daya.",
    objectives: [
      "Membaca dan membuat wiring diagram",
      "Merakit rangkaian Smart Trashbin secara lengkap",
      "Melakukan verifikasi wiring sebelum power-on",
    ],
    blocks: [
      {
        type: "code",
        lang: "text",
        label: "wiring-diagram.txt",
        code: `══════ WIRING DIAGRAM SMART TRASHBIN ══════

[HC-SR04]              [Micro:bit]
  VCC  ──────────────►  3V
  TRIG ──────────────►  P1
  ECHO ──┬── 1kΩ ──►  P2
         └── 2kΩ ──►  GND
  GND  ──────────────►  GND

[Servo SG90]
  Signal (Oranye) ──►  P0
  VCC    (Merah)  ──►  3V (atau sumber eksternal)
  GND    (Coklat) ──►  GND

[LED Hijau]
  P3 ── 330Ω ── LED+ ── LED- ── GND

[LED Merah]
  P4 ── 330Ω ── LED+ ── LED- ── GND

[Buzzer Pasif]
  P5 ── Buzzer+ ── Buzzer- ── GND`,
      },
      {
        type: "checklist",
        items: [
          "HC-SR04 VCC → 3V Micro:bit",
          "HC-SR04 TRIG → P1",
          "HC-SR04 ECHO → voltage divider (1kΩ+2kΩ) → P2",
          "HC-SR04 GND → GND Micro:bit",
          "Servo signal (oranye) → P0",
          "Servo VCC (merah) → 3V",
          "Servo GND (coklat) → GND",
          "LED hijau → 330Ω → P3, GND",
          "LED merah → 330Ω → P4, GND",
          "Buzzer → P5, GND",
        ],
      },
      {
        type: "warning",
        body: "Sebelum menghidupkan daya: periksa ulang semua koneksi GND (harus terhubung ke GND Micro:bit). Pastikan tidak ada kabel VCC dan GND yang terhubung langsung (short circuit)!",
      },
    ],
  },

  "simulasi": {
    intro:
      "Simulasi software adalah tahap wajib sebelum merakit hardware. Ini memastikan logika program benar dan semua skenario telah diuji tanpa risiko kerusakan komponen.",
    objectives: [
      "Menguji semua skenario program di simulator",
      "Memvalidasi nilai threshold dan timing",
      "Mendokumentasikan hasil simulasi",
    ],
    blocks: [
      {
        type: "table",
        headers: ["Skenario", "Input Sensor", "Output yang Diharapkan"],
        rows: [
          ["Tidak ada objek", "Jarak > 20 cm", "Servo 0°, LED mati, buzzer diam"],
          ["Tangan mendekat", "Jarak < 20 cm", "Servo 90°, LED hijau ON, bunyi 1x"],
          ["Tangan terus ada", "Jarak < 20 cm (3 detik)", "Servo tetap 90° sampai 3 detik"],
          ["Tangan menjauh", "Jarak > 20 cm setelah 3 detik", "Servo kembali ke 0°, LED mati"],
          ["Sampah penuh", "Jarak dalam < 5 cm", "LED merah + buzzer 3x"],
        ],
      },
      {
        type: "makecode",
      },
    ],
  },

  "pengujian": {
    intro:
      "Pengujian sistematis memastikan setiap komponen dan sistem secara keseluruhan bekerja sesuai desain sebelum proyek dinyatakan selesai.",
    objectives: [
      "Melakukan pengujian per komponen",
      "Melakukan pengujian integrasi",
      "Mendokumentasikan hasil pengujian dalam tabel",
    ],
    blocks: [
      {
        type: "heading",
        level: 2,
        text: "Tahap 1: Pengujian Komponen",
      },
      {
        type: "checklist",
        items: [
          "LED hijau menyala saat pin P3 = HIGH",
          "LED merah menyala saat pin P4 = HIGH",
          "Buzzer berbunyi saat music.playTone() dipanggil",
          "Servo bergerak dari 0° ke 90° dan kembali",
          "Sensor menunjukkan nilai berubah saat ada objek",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Tahap 2: Pengujian Integrasi",
      },
      {
        type: "checklist",
        items: [
          "Dekatkan tangan → tutup terbuka dalam < 1 detik",
          "Tangan terus ada → tutup tetap terbuka 3 detik",
          "Jauhkan tangan → tutup menutup dalam < 4 detik",
          "Tutup trashbin penuh → LED merah + buzzer aktif",
          "Uji 20 siklus berturut-turut tanpa error",
        ],
      },
      {
        type: "table",
        headers: ["Test", "Hasil Diharapkan", "Status"],
        rows: [
          ["LED hijau", "ON saat P3=1", "□"],
          ["Servo buka", "90° tercapai", "□"],
          ["Sensor 15cm", "Tutup terbuka", "□"],
          ["Tangan jauh", "Tutup menutup 3 detik", "□"],
          ["Sensor penuh", "LED merah + buzzer", "□"],
        ],
      },
    ],
  },

  "troubleshoot": {
    intro:
      "Troubleshooting adalah kemampuan sistematis untuk menemukan dan memperbaiki masalah. Ini adalah skill yang sangat berharga — bahkan insinyur profesional menghabiskan banyak waktu di sini.",
    objectives: [
      "Menggunakan pendekatan sistematis dalam debugging",
      "Mengatasi 5 masalah umum Smart Trashbin",
      "Membangun kemampuan problem-solving untuk proyek mendatang",
    ],
    blocks: [
      {
        type: "table",
        headers: ["Masalah", "Kemungkinan Penyebab", "Solusi"],
        rows: [
          ["Sensor nilai selalu 0", "TRIG/ECHO terbalik / kabel lepas / ekstensi Sonar belum install", "Cek wiring, install ekstensi Sonar di Makecode"],
          ["Servo bergetar tidak berhenti", "Arus tidak cukup dari Micro:bit / pin salah", "Gunakan sumber daya eksternal untuk servo"],
          ["LED tidak menyala", "Polaritas terbalik (kaki panjang=+) / resistor salah", "Balik LED, cek resistor 330Ω"],
          ["Buzzer tidak bunyi", "Buzzer aktif dihubungkan ke PWM / polaritas terbalik", "Gunakan buzzer pasif untuk music.playTone()"],
          ["Program tidak ter-upload", "Kabel USB hanya charging / browser bukan Chrome", "Ganti kabel, gunakan Chrome, coba port USB lain"],
        ],
      },
      {
        type: "steps",
        items: [
          "Isolasi masalah: uji satu komponen dalam satu waktu",
          "Gunakan serial monitor atau LED matrix untuk debug nilai",
          "Periksa wiring secara visual dari ujung ke ujung",
          "Coba reset Micro:bit (tekan tombol di belakang board)",
          "Bandingkan dengan kode referensi yang diketahui benar",
          "Minta bantuan: jelaskan masalah secara detail ke teman/instruktur",
        ],
      },
    ],
  },
};

// ────────────────────────────────────────────────────────────
// TINYBIT BLUETOOTH
// ────────────────────────────────────────────────────────────
const tinybiBluetooth: Record<string, LessonContent> = {
  "konsep-bt": {
    intro: "Bluetooth adalah teknologi komunikasi nirkabel jarak dekat yang memungkinkan Micro:bit berkomunikasi dengan smartphone untuk mengontrol robot Tinybit.",
    objectives: ["Memahami konsep dan sejarah Bluetooth", "Mengenal BLE (Bluetooth Low Energy)", "Memahami arsitektur peripheral–central Bluetooth"],
    blocks: [
      { type: "table", headers: ["Versi", "Kecepatan", "Jangkauan", "Keunggulan"], rows: [["BT 1.0", "1 Mbps", "10 m", "Pertama kali hadir"], ["BT 4.0", "1 Mbps", "50 m", "BLE — hemat baterai"], ["BT 5.0", "2 Mbps", "200 m", "Micro:bit V2, lebih jauh & hemat"]] },
      { type: "cards", items: [{ label: "📡", title: "Peripheral (Slave)", body: "Micro:bit berperan sebagai server yang menyediakan layanan Bluetooth untuk diakses." }, { label: "📱", title: "Central (Master)", body: "Smartphone berperan sebagai client yang scan, connect, dan berinteraksi dengan Micro:bit." }] },
      { type: "code", lang: "javascript", label: "bluetooth-init.js", code: `// Aktifkan layanan Bluetooth UART di Micro:bit\nbluetooth.startUartService()\n\n// Event: saat smartphone terhubung\nbluetooth.onBluetoothConnected(function () {\n    basic.showIcon(IconNames.Happy)\n})\n\n// Event: saat koneksi terputus\nbluetooth.onBluetoothDisconnected(function () {\n    basic.showIcon(IconNames.Sad)\n    tinybit.motorStop(tinybit.Motors.All)\n})` },
    ],
  },
  "pairing": {
    intro: "Pairing adalah proses pertama kali dua perangkat Bluetooth saling mengenal dan menyimpan informasi autentikasi — seperti berjabat tangan untuk pertama kali.",
    objectives: ["Memahami proses pairing Bluetooth", "Melakukan pairing Micro:bit dengan Android dan iOS", "Mengatasi masalah pairing yang umum"],
    blocks: [
      { type: "steps", items: ["Pastikan Bluetooth aktif di HP kamu", "Upload kode bluetooth ke Micro:bit", "Buka app micro:bit di Play Store / App Store atau buka controller web di Chrome", "Scan perangkat → pilih 'BBC micro:bit [XXXXX]'", "Masukkan PIN pairing yang tampil di LED Micro:bit", "Terhubung! Ikon senyum tampil di Micro:bit"] },
      { type: "info", title: "Penting!", body: "Setiap kali kamu memflash program baru ke Micro:bit, mungkin perlu pairing ulang. Hapus perangkat dari daftar Bluetooth HP terlebih dahulu, lalu ulangi proses pairing." },
    ],
  },
  "kirim-data": {
    intro: "Komunikasi data via Bluetooth UART memungkinkan smartphone mengirim perintah ke robot dan menerima data sensor secara realtime.",
    objectives: ["Mengirim perintah teks dari HP ke Micro:bit via Bluetooth", "Menerima dan memparse data perintah di Micro:bit", "Mengirim data sensor dari Micro:bit ke HP"],
    blocks: [
      { type: "code", lang: "javascript", label: "bt-receive.js", code: `let perintah = ""\n\nbluetooth.onUartDataReceived(\n    serial.delimiters(Delimiters.NewLine),\n    function () {\n        perintah = bluetooth.uartReadUntil(\n            serial.delimiters(Delimiters.NewLine)\n        )\n\n        if (perintah == "MAJU") {\n            tinybit.motorRun(tinybit.Motors.Motor1, tinybit.Dir.CW, 80)\n            tinybit.motorRun(tinybit.Motors.Motor2, tinybit.Dir.CW, 80)\n        } else if (perintah == "MUNDUR") {\n            tinybit.motorRun(tinybit.Motors.Motor1, tinybit.Dir.CCW, 80)\n            tinybit.motorRun(tinybit.Motors.Motor2, tinybit.Dir.CCW, 80)\n        } else if (perintah == "STOP") {\n            tinybit.motorStop(tinybit.Motors.All)\n        }\n    }\n)` },
      { type: "code", lang: "javascript", label: "bt-send.js", code: `// Kirim data sensor ke HP tiap 0.5 detik\nbasic.forever(function () {\n    let suhu = input.temperature()\n    bluetooth.uartWriteString("SUHU:" + suhu + "\\n")\n    basic.pause(500)\n})` },
    ],
  },
  "motor-dc": {
    intro: "Motor DC adalah penggerak utama robot Tinybit. Memahami cara kerjanya membantu kita mengontrol kecepatan dan arah pergerakan robot dengan tepat.",
    objectives: ["Memahami cara kerja motor DC", "Mengenal konsep H-Bridge untuk kontrol arah", "Menggunakan PWM untuk kontrol kecepatan"],
    blocks: [
      { type: "info", title: "Cara Kerja Motor DC", body: "Motor DC mengubah energi listrik menjadi putaran. Arah putaran dibalik dengan membalik polaritas (+ dan −). Kecepatan dikontrol dengan PWM — semakin besar duty cycle, semakin cepat putaran." },
      { type: "cards", items: [{ label: "↑", title: "H-Bridge", body: "Rangkaian 4 transistor yang memungkinkan pembalikan arah arus ke motor — robot bisa maju dan mundur." }, { label: "~", title: "PWM Speed Control", body: "Duty cycle 25% = 25% kecepatan max. Duty cycle 100% = kecepatan penuh." }] },
    ],
  },
  "driver": {
    intro: "Driver motor adalah jembatan elektronik antara pin Micro:bit (3.3V, 5mA) dan motor DC yang membutuhkan arus jauh lebih besar untuk berputar.",
    objectives: ["Memahami mengapa driver motor diperlukan", "Mengenal chip driver motor yang umum", "Menggunakan ekstensi Tinybit di Makecode"],
    blocks: [
      { type: "table", headers: ["Driver", "Arus Maks", "Tegangan", "Cocok untuk"], rows: [["L293D", "600mA", "4.5–36V", "Motor kecil"], ["L298N", "2A", "5–35V", "Motor sedang"], ["Tinybit built-in", "800mA", "3.7–5V", "Robot Tinybit"]] },
      { type: "code", lang: "javascript", label: "tinybit-motor.js", code: `// Ekstensi Tinybit: Extensions → cari "Tinybit" atau "Yahboom"\n\n// Jalankan motor\ntinybit.motorRun(tinybit.Motors.Motor1, tinybit.Dir.CW, 80)   // Kiri maju 80%\ntinybit.motorRun(tinybit.Motors.Motor2, tinybit.Dir.CW, 80)   // Kanan maju 80%\n\n// Atur kecepatan dua motor sekaligus\ntinybit.setMotorSpeed(80, 80)   // Maju\ntinybit.setMotorSpeed(-80, -80) // Mundur\ntinybit.setMotorSpeed(80, -80)  // Putar kiri\n\n// Hentikan semua motor\ntinybit.motorStop(tinybit.Motors.All)` },
    ],
  },
  "sensor-tb": {
    intro: "Tinybit dilengkapi sensor IR line follower built-in dan slot untuk sensor ultrasonik, memberikan kemampuan navigasi dan deteksi lingkungan.",
    objectives: ["Membaca sensor IR line follower Tinybit", "Memahami output sensor dan kondisi penggunaannya", "Menggabungkan data sensor dengan kontrol motor"],
    blocks: [
      { type: "table", headers: ["Sensor Kiri", "Sensor Kanan", "Posisi Robot", "Aksi"], rows: [["0 (hitam)", "0 (hitam)", "Di atas garis", "Maju lurus"], ["1 (putih)", "0 (hitam)", "Menyimpang kiri", "Belok kanan"], ["0 (hitam)", "1 (putih)", "Menyimpang kanan", "Belok kiri"], ["1 (putih)", "1 (putih)", "Keluar jalur", "Stop / cari garis"]] },
      { type: "code", lang: "javascript", label: "ir-sensor.js", code: `basic.forever(function () {\n    let irKiri = tinybit.readLineTracker(tinybit.LineTrackerSensor.SensorLeft)\n    let irKanan = tinybit.readLineTracker(tinybit.LineTrackerSensor.SensorRight)\n    \n    // 0 = garis hitam terdeteksi, 1 = tidak ada garis\n    serial.writeLine("L:" + irKiri + " R:" + irKanan)\n})` },
    ],
  },
  "struktur": {
    intro: "Memahami struktur fisik dan elektronik Tinybit membantu kita merancang program yang lebih efektif dan melakukan perbaikan dengan lebih mudah.",
    objectives: ["Mengenal anatomi dan layout Tinybit", "Memahami spesifikasi teknis robot", "Menghafal pola gerakan dasar (maju, mundur, belok)"],
    blocks: [
      { type: "table", headers: ["Kondisi Motor", "Gerakan Robot"], rows: [["Kiri CW + Kanan CW", "Maju lurus"], ["Kiri CCW + Kanan CCW", "Mundur"], ["Kiri CW + Kanan STOP", "Belok kiri halus"], ["Kiri CW + Kanan CCW", "Putar di tempat kiri"], ["Kiri STOP + Kanan CW", "Belok kanan halus"]] },
      { type: "info", title: "Spesifikasi Tinybit", body: "Dimensi: 87×75×37mm | Motor: N20 DC (2 buah) | Kecepatan maks: ~1.5 m/s | Kompatibel: Micro:bit V1 dan V2 | Baterai: 18650 Li-Ion 3.7V" },
    ],
  },
  "custom-controller": {
    intro: "Kita bisa membuat controller web sendiri menggunakan HTML dan Web Bluetooth API yang berjalan langsung di browser Chrome smartphone.",
    objectives: ["Memahami Web Bluetooth API", "Membuat halaman HTML controller dasar", "Menghubungkan controller ke Tinybit via Bluetooth"],
    blocks: [
      { type: "code", lang: "html", label: "controller.html", code: `<!DOCTYPE html>\n<html>\n<head>\n  <title>Tinybit Controller</title>\n  <style>\n    body { font-family: sans-serif; text-align: center; background: #0f172a; color: white; }\n    .btn { width: 80px; height: 80px; font-size: 28px; margin: 6px;\n           border: none; border-radius: 16px; background: #22c55e;\n           cursor: pointer; color: white; }\n    .grid { display: grid; grid-template-columns: repeat(3, 80px);\n            gap: 6px; justify-content: center; margin-top: 20px; }\n  </style>\n</head>\n<body>\n  <h2>🤖 Tinybit Controller</h2>\n  <button id="connect" style="padding:10px 24px;border-radius:8px;background:#3b82f6;color:white;border:none;cursor:pointer;">\n    🔵 Connect Bluetooth\n  </button>\n  <div class="grid" style="margin-top:24px">\n    <div></div>\n    <button class="btn" onclick="send('MAJU')">⬆️</button>\n    <div></div>\n    <button class="btn" onclick="send('KIRI')">⬅️</button>\n    <button class="btn" style="background:#ef4444" onclick="send('STOP')">⏹</button>\n    <button class="btn" onclick="send('KANAN')">➡️</button>\n    <div></div>\n    <button class="btn" onclick="send('MUNDUR')">⬇️</button>\n    <div></div>\n  </div>\n  <script>\n    let ch;\n    document.getElementById('connect').onclick = async () => {\n      const dev = await navigator.bluetooth.requestDevice({\n        filters: [{ namePrefix: 'BBC micro:bit' }],\n        optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']\n      });\n      const srv = await dev.gatt.connect();\n      const svc = await srv.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');\n      ch = await svc.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');\n      document.getElementById('connect').textContent = '✅ Connected!';\n    };\n    async function send(cmd) {\n      if (!ch) return;\n      await ch.writeValue(new TextEncoder().encode(cmd + '\\n'));\n    }\n  </script>\n</body>\n</html>` },
      { type: "warning", body: "Web Bluetooth API hanya bekerja di Google Chrome (bukan Firefox atau Safari). Halaman harus diakses via HTTPS atau localhost." },
    ],
  },
  "joystick": {
    intro: "Virtual joystick memberikan kontrol yang lebih intuitif dan presisi dibandingkan tombol arah biasa — kamu bisa mengatur kecepatan dan arah secara bersamaan.",
    objectives: ["Memahami matematika diferensial drive", "Mengimplementasikan virtual joystick dengan touch events", "Mengkonversi koordinat joystick ke kecepatan motor"],
    blocks: [
      { type: "info", title: "Rumus Diferensial Drive", body: "motorKiri = y + x | motorKanan = y - x\ny: -100 (mundur) s/d +100 (maju) | x: -100 (kiri) s/d +100 (kanan)" },
      { type: "code", lang: "javascript", label: "joystick-math.js", code: `// Konversi posisi joystick → kecepatan motor\nfunction hitungMotor(x, y) {\n    let kiri  = Math.max(-100, Math.min(100, y + x))\n    let kanan = Math.max(-100, Math.min(100, y - x))\n    return { kiri, kanan }\n}\n\n// Contoh:\n// Maju (x=0, y=100):      kiri=100, kanan=100 → lurus\n// Kiri penuh (x=-100, y=0): kiri=-100, kanan=100 → putar\n// Serong kiri (x=-50, y=80): kiri=30,  kanan=100 → belok kiri` },
    ],
  },
  "monitoring": {
    intro: "Dashboard monitoring realtime memungkinkan kita memantau status robot dari HP tanpa harus melihat Micro:bit secara langsung.",
    objectives: ["Mengirim data sensor dari Micro:bit ke HP", "Menampilkan data realtime di dashboard web", "Membuat format data JSON untuk komunikasi"],
    blocks: [
      { type: "code", lang: "javascript", label: "monitoring.js", code: `// Micro:bit: kirim data tiap 500ms\nbasic.forever(function () {\n    let irL = tinybit.readLineTracker(tinybit.LineTrackerSensor.SensorLeft)\n    let irR = tinybit.readLineTracker(tinybit.LineTrackerSensor.SensorRight)\n    let suhu = input.temperature()\n    bluetooth.uartWriteString(\n        '{"irL":' + irL + ',"irR":' + irR + ',"suhu":' + suhu + '}\\n'\n    )\n    basic.pause(500)\n})` },
    ],
  },
};

// ────────────────────────────────────────────────────────────
// HAND GESTURE AI
// ────────────────────────────────────────────────────────────
const handGestureAI: Record<string, LessonContent> = {
  "ml": {
    intro: "Machine Learning adalah cabang AI di mana komputer belajar dari data — bukan dari instruksi eksplisit — untuk mengenali pola dan membuat keputusan.",
    objectives: ["Memahami sejarah AI dan Machine Learning", "Membedakan 3 jenis Machine Learning", "Mengenal aplikasi ML di kehidupan nyata"],
    blocks: [
      { type: "cards", items: [{ label: "1950", title: "Turing Test", body: "Alan Turing mengusulkan tes apakah mesin bisa berpikir seperti manusia." }, { label: "1997", title: "Deep Blue", body: "IBM Deep Blue mengalahkan juara catur dunia Garry Kasparov." }, { label: "2016", title: "AlphaGo", body: "Google DeepMind AlphaGo mengalahkan juara dunia permainan Go." }, { label: "2022", title: "ChatGPT", body: "OpenAI ChatGPT diluncurkan, AI menjadi mainstream untuk semua orang." }] },
      { type: "table", headers: ["Jenis ML", "Cara Belajar", "Contoh"], rows: [["Supervised Learning", "Dari data berlabel (contoh + jawaban)", "Deteksi spam, pengenalan wajah, Teachable Machine"], ["Unsupervised Learning", "Temukan pola sendiri tanpa label", "Segmentasi pelanggan, deteksi anomali"], ["Reinforcement Learning", "Dari reward dan punishment", "AlphaGo, robot belajar berjalan"]] },
      { type: "info", title: "Teachable Machine menggunakan Supervised Learning", body: "Kamu memberi contoh gesture + labelnya → model belajar mengenali pola visual dari setiap gesture." },
    ],
  },
  "cv": {
    intro: "Computer Vision adalah bidang AI yang mengajarkan komputer untuk 'melihat' dan memahami isi gambar dan video seperti yang dilakukan mata dan otak manusia.",
    objectives: ["Memahami cara kerja Computer Vision", "Mengenal arsitektur CNN (Convolutional Neural Network)", "Melihat aplikasi CV di kehidupan nyata"],
    blocks: [
      { type: "cards", items: [{ label: "📱", title: "Face ID", body: "iPhone mengenali wajah pemilik dalam hitungan milidetik menggunakan 3D face mapping." }, { label: "🚗", title: "Self-Driving Car", body: "Kamera + CV mendeteksi jalan, rambu, pejalan kaki, dan kendaraan lain secara realtime." }, { label: "🏥", title: "Diagnosa Medis", body: "AI mendeteksi kanker, retinopati, dan penyakit lain dari foto X-ray atau retina." }, { label: "📦", title: "Amazon Go", body: "Kamera + CV mendeteksi produk yang diambil dari rak — belanja tanpa kasir." }] },
      { type: "info", title: "Cara Kerja CNN", body: "Gambar → Konvolusi (temukan tepi & pola) → Pooling (reduksi ukuran) → Fully Connected (klasifikasi) → Output label. Seperti cara otak manusia melihat dari detail ke keseluruhan." },
    ],
  },
  "dataset": {
    intro: "Dataset adalah 'makanan' untuk AI. Kualitas dan kuantitas dataset menentukan seberapa akurat model yang kita latih.",
    objectives: ["Memahami prinsip dataset yang baik", "Merencanakan jumlah dan variasi foto untuk setiap gesture", "Mengambil foto dataset berkualitas tinggi"],
    blocks: [
      { type: "table", headers: ["Kelas/Label", "Gesture", "Jumlah Foto Ideal"], rows: [["MAJU", "Tangan menunjuk ke atas ↑", "150–200 foto"], ["MUNDUR", "Tangan menunjuk ke bawah ↓", "150–200 foto"], ["KIRI", "Tangan menunjuk ke kiri ←", "150–200 foto"], ["KANAN", "Tangan menunjuk ke kanan →", "150–200 foto"], ["STOP", "Telapak menghadap kamera 🖐️", "150–200 foto"]] },
      { type: "checklist", items: ["Foto dari berbagai sudut (depan, sedikit miring kiri/kanan)", "Variasikan jarak tangan dari kamera", "Foto dengan background berbeda (terang, gelap, ramai)", "Ambil dengan tangan dalam posisi sedikit bergerak (natural)", "Pastikan setiap kelas gesturnya berbeda secara visual"] },
    ],
  },
  "training": {
    intro: "Training adalah proses di mana algoritma AI belajar dari dataset, menyesuaikan ribuan parameter hingga bisa mengenali pola dengan akurat.",
    objectives: ["Melakukan training model di Teachable Machine", "Memahami hyperparameter: epochs, batch size, learning rate", "Mengevaluasi hasil training"],
    blocks: [
      { type: "steps", items: ["Buka https://teachablemachine.withgoogle.com → Get Started", "Pilih 'Image Project' → 'Standard Image Model'", "Buat kelas: MAJU, MUNDUR, KIRI, KANAN, STOP", "Untuk tiap kelas: klik Webcam → tahan 'Hold to Record' 10–15 detik", "Klik 'Train Model' dan tunggu (bisa 1–5 menit)", "Uji model di panel Preview — target accuracy > 90%"] },
      { type: "info", title: "Hyperparameter Default Teachable Machine", body: "Epochs: 50 (berapa kali model melihat seluruh dataset) | Batch size: 16 (foto diproses per iterasi) | Learning rate: 0.001 (kecepatan belajar). Untuk gesture sederhana, nilai default sudah cukup." },
    ],
  },
  "model": {
    intro: "Model AI adalah 'otak' hasil training — kumpulan parameter matematis yang menentukan cara input (gambar) diubah menjadi output (prediksi gesture).",
    objectives: ["Memahami format output model (probabilitas per kelas)", "Mengeksport model ke format TensorFlow.js", "Mengintegrasikan model ke halaman web"],
    blocks: [
      { type: "code", lang: "javascript", label: "model-output.js", code: `// Contoh output model Teachable Machine:\n// {\n//   "MAJU":   0.02,  // 2%\n//   "MUNDUR": 0.01,  // 1%\n//   "KIRI":   0.94,  // 94% ← prediksi\n//   "KANAN":  0.02,  // 2%\n//   "STOP":   0.01   // 1%\n// }\n// → "KIRI" dengan confidence 94%\n\n// Gunakan prediksi dengan confidence terbaik\nasync function predict() {\n    const preds = await model.predict(webcam.canvas)\n    let best = preds.reduce((a, b) =>\n        a.probability > b.probability ? a : b\n    )\n    if (best.probability > 0.85) {  // Threshold 85%\n        kirimKeRobot(best.className)\n    }\n}` },
      { type: "refs", items: [{ label: "Teachable Machine Docs", url: "https://teachablemachine.withgoogle.com/faq" }, { label: "TensorFlow.js", url: "https://www.tensorflow.org/js" }] },
    ],
  },
  "prediksi": {
    intro: "Prediksi yang andal membutuhkan threshold yang tepat dan teknik smoothing untuk menghindari reaksi berlebihan terhadap fluktuasi sesaat.",
    objectives: ["Mengatur confidence threshold yang optimal", "Menerapkan majority vote smoothing", "Mengoptimalkan response time sistem gesture"],
    blocks: [
      { type: "code", lang: "javascript", label: "smoothing.js", code: `// Majority vote: ambil gesture paling sering dari 5 frame terakhir\nconst WINDOW = 5\nlet riwayat = []\n\nfunction smoothedPrediction(gesture) {\n    riwayat.push(gesture)\n    if (riwayat.length > WINDOW) riwayat.shift()\n    \n    const freq = {}\n    riwayat.forEach(g => freq[g] = (freq[g] || 0) + 1)\n    return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]\n}` },
      { type: "table", headers: ["Threshold", "Efek", "Rekomendasi"], rows: [["< 0.5", "Terlalu banyak false positive", "❌ Terlalu rendah"], ["0.7–0.85", "Keseimbangan responsif & akurat", "✅ Optimal"], ["> 0.95", "Jarang bereaksi, kaku", "❌ Terlalu tinggi"]] },
    ],
  },
  "training-gesture": {
    intro: "Panduan lengkap step-by-step untuk mengumpulkan data dan melatih model gesture di Teachable Machine dengan hasil terbaik.",
    objectives: ["Mengumpulkan dataset gesture yang berkualitas", "Melakukan training dan evaluasi model", "Mengidentifikasi kelas yang perlu data lebih banyak"],
    blocks: [
      { type: "steps", items: ["Buka https://teachablemachine.withgoogle.com → Get Started → Image Project", "Buat 5 kelas: MAJU, MUNDUR, KIRI, KANAN, STOP", "Pastikan pencahayaan cukup dan background kontras dari tangan", "Kelas MAJU: arahkan tangan ke atas, tahan 'Hold to Record' sambil gerakkan sedikit selama 10 detik", "Ulangi untuk semua kelas — pastikan tiap kelas ≥ 100 foto", "Klik 'Train Model' dan tunggu. Evaluasi di panel Preview."] },
      { type: "warning", body: "Jangan tutup tab browser selama training! Model hilang jika tab ditutup sebelum di-export atau disimpan ke Google Drive." },
    ],
  },
  "export-model": {
    intro: "Setelah training selesai, model perlu diekspor ke format yang bisa digunakan di halaman web atau aplikasi untuk mengontrol robot secara realtime.",
    objectives: ["Mengeksport model ke format TensorFlow.js", "Mendapatkan URL model yang bisa digunakan di web", "Mengintegrasikan model ke controller web"],
    blocks: [
      { type: "steps", items: ["Klik 'Export Model' setelah training selesai", "Pilih tab 'Tensorflow.js'", "Pilih 'Upload (Shareable link)'", "Klik 'Upload my model' dan tunggu upload selesai", "Salin URL: https://teachablemachine.withgoogle.com/models/XXXXX/", "Gunakan URL ini di kode JavaScript controller-mu"] },
      { type: "code", lang: "html", label: "load-model.html", code: `<!-- Tambahkan library ini di <head> -->\n<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js"></script>\n<script src="https://cdn.jsdelivr.net/npm/@teachablemachine/image/dist/teachablemachine-image.min.js"></script>\n\n<script>\nconst MODEL_URL = "https://teachablemachine.withgoogle.com/models/XXXXX/";\n\nasync function loadModel() {\n    const model = await tmImage.load(\n        MODEL_URL + "model.json",\n        MODEL_URL + "metadata.json"\n    );\n    console.log("Model loaded! Classes:", model.getTotalClasses());\n    return model;\n}\n</script>` },
    ],
  },
  "testing-ai": {
    intro: "Pengujian model AI memastikan sistem gesture berjalan akurat di berbagai kondisi sebelum diintegrasikan dengan robot secara penuh.",
    objectives: ["Menguji model di berbagai kondisi pencahayaan dan background", "Mengukur akurasi dan response time", "Mengidentifikasi dan memperbaiki kelemahan model"],
    blocks: [
      { type: "table", headers: ["Skenario Pengujian", "Target Akurasi"], rows: [["Pencahayaan normal, background putih", "> 95%"], ["Pencahayaan redup", "> 80%"], ["Background berbeda (kayu, tembok warna)", "> 85%"], ["Digunakan orang lain (bukan yang melatih)", "> 75%"], ["Gerakan tangan cepat", "> 70%"]] },
      { type: "steps", items: ["Uji setiap gesture 20× dan hitung berapa yang benar (akurasi per kelas)", "Uji di ruangan dengan pencahayaan berbeda", "Minta teman yang tidak melatih model untuk mencoba", "Jika ada kelas yang lemah: tambah foto dan retrain", "Ukur response time: dari gesture → robot bergerak (<500ms ideal)"] },
    ],
  },
};

// ────────────────────────────────────────────────────────────
// SMART WATERING PLANT
// ────────────────────────────────────────────────────────────
const smartWatering: Record<string, LessonContent> = {
  "soil": {
    intro: "Sensor soil moisture membaca kadar air dalam tanah berdasarkan konduktivitas listrik — tanah basah mengalirkan listrik lebih baik daripada tanah kering.",
    objectives: ["Memahami cara kerja sensor soil moisture", "Menginterpretasikan nilai analog sensor", "Menulis kode pembacaan sensor"],
    blocks: [
      { type: "table", headers: ["Nilai Analog", "Kondisi Tanah", "Aksi"], rows: [["0–300", "Sangat basah / terendam", "Jangan siram, bisa busuk"], ["300–600", "Kelembaban optimal", "Normal, tidak perlu siram"], ["600–800", "Mulai kering", "Siapkan untuk siram"], ["> 800", "Sangat kering", "Siram sekarang!"]] },
      { type: "code", lang: "javascript", label: "soil-sensor.js", code: `const THRESHOLD_KERING = 600\n\nbasic.forever(function () {\n    let kelembaban = pins.analogReadPin(AnalogPin.P0)  // 0–1023\n    basic.showNumber(kelembaban)\n    \n    if (kelembaban > THRESHOLD_KERING) {\n        // Tanah kering → aktifkan pompa\n        pins.digitalWritePin(DigitalPin.P1, 1)  // Relay ON\n        basic.showIcon(IconNames.Watering)\n        basic.pause(5000)  // Siram 5 detik\n        pins.digitalWritePin(DigitalPin.P1, 0)  // Relay OFF\n    }\n    \n    basic.pause(30000)  // Cek tiap 30 detik\n})` },
    ],
  },
  "relay": {
    intro: "Relay adalah saklar elektronik yang dikendalikan sinyal kecil dari Micro:bit untuk menghidupkan perangkat berdaya lebih besar seperti pompa air.",
    objectives: ["Memahami cara kerja relay", "Wiring relay yang benar dan aman", "Mengontrol relay dari Micro:bit"],
    blocks: [
      { type: "info", title: "Cara Kerja Relay", body: "Relay menggunakan elektromagnet untuk menggerakkan saklar mekanis. Sinyal kecil dari Micro:bit (3.3V) mengaktifkan kumparan yang menarik kontak saklar, menghidupkan pompa." },
      { type: "code", lang: "text", label: "wiring-relay.txt", code: `Wiring Relay ke Micro:bit:\n  Micro:bit P1 → IN relay\n  Micro:bit 3V → VCC relay\n  Micro:bit GND → GND relay\n\nWiring pompa ke relay:\n  Power Bank (+) → COM relay\n  NO relay → (+) pompa\n  (-) pompa → Power Bank (−)\n\nPastikan kabel pompa tidak menyentuh air!` },
      { type: "warning", body: "Gunakan terminal NO (Normally Open) untuk pompa. Pastikan rating arus relay cukup untuk pompa yang digunakan. Jauhkan kabel listrik dari air!" },
    ],
  },
  "otomatis": {
    intro: "Program penyiraman otomatis yang cerdas mempertimbangkan kelembaban, durasi siram, dan interval pengecekan untuk menjaga tanaman tetap optimal.",
    objectives: ["Menulis program penyiraman otomatis lengkap", "Menambahkan fitur statistik dan monitoring", "Mengimplementasikan safety checks"],
    blocks: [
      { type: "code", lang: "javascript", label: "auto-watering.js", code: `// Smart Watering Plant — Program Lengkap\nconst KERING = 600\nconst DURASI_SIRAM = 5000   // 5 detik\nconst INTERVAL_CEK = 60000  // Cek tiap 60 detik\nlet totalSiram = 0\n\nfunction siram() {\n    basic.showIcon(IconNames.Watering)\n    pins.digitalWritePin(DigitalPin.P1, 1)  // Pompa ON\n    basic.pause(DURASI_SIRAM)\n    pins.digitalWritePin(DigitalPin.P1, 0)  // Pompa OFF\n    totalSiram++\n    basic.showNumber(totalSiram)\n    basic.pause(1000)\n    basic.clearScreen()\n}\n\n// Tombol A: tampilkan statistik\ninput.onButtonPressed(Button.A, function () {\n    let k = pins.analogReadPin(AnalogPin.P0)\n    basic.showString("K:" + k + " N:" + totalSiram)\n})\n\nbasic.forever(function () {\n    let kelembaban = pins.analogReadPin(AnalogPin.P0)\n    if (kelembaban > KERING) {\n        siram()\n    } else {\n        basic.showIcon(IconNames.Yes)\n        basic.pause(500)\n        basic.clearScreen()\n    }\n    basic.pause(INTERVAL_CEK)\n})` },
    ],
  },
  "dashboard": {
    intro: "Dashboard monitoring memungkinkan pemantauan kondisi tanaman dari jarak jauh tanpa harus mendekati perangkat secara fisik.",
    objectives: ["Memahami konsep IoT dashboard", "Mengirim data sensor via Bluetooth atau Serial", "Merencanakan tampilan dashboard untuk Smart Watering"],
    blocks: [
      { type: "cards", items: [{ label: "1", title: "Serial Monitor Makecode", body: "Tampilkan data langsung di browser saat Micro:bit terhubung USB. Paling mudah untuk debug." }, { label: "2", title: "Bluetooth ke Smartphone", body: "Kirim data kelembaban via Bluetooth. Tampilkan di web controller yang dibuat sendiri." }, { label: "3", title: "Platform IoT Cloud", body: "Gunakan ESP8266/ESP32 tambahan untuk WiFi dan upload ke Thingspeak atau Adafruit IO." }] },
    ],
  },
};

// ────────────────────────────────────────────────────────────
// LINE FOLLOWER
// ────────────────────────────────────────────────────────────
const lineFollower: Record<string, LessonContent> = {
  "ir": {
    intro: "Sensor infrared TCRT5000 adalah mata robot line follower — mendeteksi kontras antara garis hitam dan background putih dengan sangat cepat.",
    objectives: ["Memahami cara kerja sensor IR reflektif", "Membaca output sensor di Tinybit", "Menginterpretasikan kombinasi sensor untuk navigasi"],
    blocks: [
      { type: "info", title: "Prinsip Kerja Sensor IR", body: "LED IR memancarkan cahaya. Permukaan PUTIH memantulkan banyak cahaya → fotodioda menerima → output HIGH (1). Permukaan HITAM menyerap cahaya → sedikit pantulan → output LOW (0)." },
      { type: "table", headers: ["IR Kiri", "IR Kanan", "Kondisi", "Aksi"], rows: [["0", "0", "Keduanya di atas garis", "Maju lurus"], ["1", "0", "Robot geser ke kiri", "Belok kanan"], ["0", "1", "Robot geser ke kanan", "Belok kiri"], ["1", "1", "Keluar jalur / pertigaan", "Stop dan cari garis"]] },
      { type: "refs", items: [{ label: "Line Follower Robot Tutorial", url: "https://www.robotique.site/tutorial/microbit-line-follower-robot/" }, { label: "Yahboom Tinybit Study", url: "http://www.yahboom.net/study/Tiny:bit" }] },
    ],
  },
  "algoritma": {
    intro: "Algoritma line follower dasar menggunakan logika if-else sederhana, namun bisa dikembangkan ke PID untuk pergerakan yang lebih halus dan presisi.",
    objectives: ["Mengimplementasikan algoritma line follower dasar", "Memahami keterbatasan algoritma on-off", "Melihat kebutuhan algoritma PID"],
    blocks: [
      { type: "code", lang: "javascript", label: "line-follower-basic.js", code: `basic.forever(function () {\n    let irKiri = tinybit.readLineTracker(tinybit.LineTrackerSensor.SensorLeft)\n    let irKanan = tinybit.readLineTracker(tinybit.LineTrackerSensor.SensorRight)\n    \n    if (irKiri == 0 && irKanan == 0) {\n        // Keduanya di garis → maju lurus\n        tinybit.setMotorSpeed(60, 60)\n    } else if (irKiri == 1 && irKanan == 0) {\n        // Geser kiri → belok kanan\n        tinybit.setMotorSpeed(80, 20)\n    } else if (irKiri == 0 && irKanan == 1) {\n        // Geser kanan → belok kiri\n        tinybit.setMotorSpeed(20, 80)\n    } else {\n        // Keluar jalur → berhenti\n        tinybit.motorStop(tinybit.Motors.All)\n    }\n})` },
    ],
  },
  "pid": {
    intro: "PID (Proportional-Integral-Derivative) adalah algoritma kontrol yang menghasilkan gerakan line follower jauh lebih halus dan akurat dibanding on-off sederhana.",
    objectives: ["Memahami konsep P, I, dan D secara intuitif", "Mengimplementasikan PID dasar untuk line follower", "Melakukan tuning nilai Kp, Ki, Kd"],
    blocks: [
      { type: "cards", items: [{ label: "P", title: "Proportional", body: "Koreksi proporsional dengan error saat ini. Error besar → koreksi besar. Respons cepat tapi bisa overshoot." }, { label: "I", title: "Integral", body: "Akumulasi error dari waktu ke waktu. Mengoreksi error kecil persisten yang P tidak bisa tangani." }, { label: "D", title: "Derivative", body: "Laju perubahan error. Memprediksi tren dan mencegah overshoot. Meredam osilasi." }] },
      { type: "code", lang: "javascript", label: "pid-line.js", code: `let Kp = 30, Ki = 0, Kd = 5\nlet errorSebelumnya = 0, integral = 0\nconst BASE_SPEED = 70\n\nbasic.forever(function () {\n    // Baca sensor analog (lebih presisi dari digital)\n    let nilaiKiri  = pins.analogReadPin(AnalogPin.P1)  // 0–1023\n    let nilaiKanan = pins.analogReadPin(AnalogPin.P2)\n    \n    let error = nilaiKiri - nilaiKanan\n    integral += error\n    let derivatif = error - errorSebelumnya\n    let koreksi = Kp * error + Ki * integral + Kd * derivatif\n    \n    let mKiri  = Math.constrain(BASE_SPEED + koreksi, -100, 100)\n    let mKanan = Math.constrain(BASE_SPEED - koreksi, -100, 100)\n    \n    tinybit.setMotorSpeed(mKiri, mKanan)\n    errorSebelumnya = error\n    basic.pause(10)\n})` },
      { type: "steps", items: ["Mulai Kp=10, Ki=0, Kd=0 (kontrol P saja)", "Naikkan Kp perlahan hingga robot mulai berosilasi (goyang)", "Turunkan Kp ke 70% dari nilai osilasi", "Naikkan Kd perlahan untuk mengurangi osilasi", "Kp dan Kd yang baik sudah cukup untuk line follower dasar"] },
    ],
  },
};

// ────────────────────────────────────────────────────────────
// MASTER CONTENT MAP
// ────────────────────────────────────────────────────────────
const contentMap: Record<string, Record<string, LessonContent>> = {
  "smart-trashbin": smartTrashbin,
  "tinybit-bluetooth": tinybiBluetooth,
  "tinybit-gesture": handGestureAI,
  "smart-watering": smartWatering,
  "tinybit-line": lineFollower,
};

export function getLessonContent(courseSlug: string, lessonSlug: string): LessonContent | null {
  return contentMap[courseSlug]?.[lessonSlug] ?? null;
}
