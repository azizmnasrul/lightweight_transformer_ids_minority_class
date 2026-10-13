// Deck penjelas proses penelitian IDS Transformer (bahasa Indonesia).
const pptxgen = require("pptxgenjs");
const { applyTheme } = require("/root/.claude/skills/synced/0acd0ed9-cc4a-4388-aa79-e0873aa8f73b_9d6374b3-dc1c-46ca-b0e7-c97c1726e45b/pptx/scripts/apply_theme.js");

const RES = "/home/claude/lightweight_transformer_ids_minority_class/results/";
const OUT = "/mnt/user-data/outputs/Penjelasan_Riset_IDS_Transformer.pptx";

const THEME = {
  name: "IDS Transformer",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "14223A", lt1: "FFFFFF",
    dk2: "1B3B66", lt2: "EDF2F8",
    accent1: "2060B0", accent2: "C0601F", accent3: "4C7FBF",
    accent4: "8FB4DD", accent5: "5F7086", accent6: "1C7293",
    hlink: "2060B0", folHlink: "5F7086",
  },
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";            // 13.3 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.author = "Aziz Mnasrul";
pres.title = "Penanganan Ketidakseimbangan Kelas pada IDS berbasis Transformer";
const C = pres.SchemeColor;
const W = 13.3, H = 7.5;

// ---------------------------------------------------------------- layouts
pres.defineSlideMaster({
  title: "JUDUL", background: { color: C.text1 },
  objects: [
    { placeholder: { options: { name: "kicker", type: "body", x: 0.9, y: 1.5, w: 11.5, h: 0.4,
        fontSize: 15, bold: true, charSpacing: 2, color: C.accent4 }, text: " " } },
    { placeholder: { options: { name: "title", type: "title", x: 0.9, y: 2.0, w: 11.5, h: 2.1,
        fontSize: 42, bold: true, color: C.background1, valign: "top", align: "left" }, text: " " } },
    { placeholder: { options: { name: "body", type: "body", x: 0.9, y: 4.3, w: 10.5, h: 1.9,
        fontSize: 16, color: C.accent4, valign: "top" }, text: " " } },
  ],
});

pres.defineSlideMaster({
  title: "PEMBATAS", background: { color: C.text2 },
  objects: [
    { placeholder: { options: { name: "kicker", type: "body", x: 1.0, y: 2.7, w: 11.3, h: 0.4,
        fontSize: 15, bold: true, charSpacing: 2, color: C.accent4 }, text: " " } },
    { placeholder: { options: { name: "title", type: "title", x: 1.0, y: 3.1, w: 11.3, h: 1.2,
        fontSize: 38, bold: true, color: C.background1, valign: "top", align: "left" }, text: " " } },
    { placeholder: { options: { name: "body", type: "body", x: 1.0, y: 4.35, w: 10.0, h: 1.0,
        fontSize: 16, color: C.accent4, valign: "top" }, text: " " } },
  ],
});

pres.defineSlideMaster({
  title: "ISI", background: { color: C.background1 },
  slideNumber: { x: 12.55, y: 6.95, fontSize: 11, color: C.accent5 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.7, y: 0.45, w: 11.9, h: 0.75,
        fontSize: 32, bold: true, color: C.text1, valign: "top", align: "left" }, text: " " } },
    { placeholder: { options: { name: "body", type: "body", x: 0.7, y: 1.3, w: 11.9, h: 5.4,
        fontSize: 16, color: C.text1, valign: "top" }, text: " " } },
    { text: { text: "IDS berbasis Transformer | penanganan ketidakseimbangan kelas",
        options: { x: 0.7, y: 6.95, w: 8.0, h: 0.3, fontSize: 10, color: C.accent5, isTextBox: true, margin: 0 } } },
  ],
});

pres.defineSlideMaster({
  title: "ISI_KOSONG", background: { color: C.background1 },
  slideNumber: { x: 12.55, y: 6.95, fontSize: 11, color: C.accent5 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.7, y: 0.45, w: 11.9, h: 0.75,
        fontSize: 32, bold: true, color: C.text1, valign: "top", align: "left" }, text: " " } },
    { text: { text: "IDS berbasis Transformer | penanganan ketidakseimbangan kelas",
        options: { x: 0.7, y: 6.95, w: 8.0, h: 0.3, fontSize: 10, color: C.accent5, isTextBox: true, margin: 0 } } },
  ],
});

pres.defineSlideMaster({
  title: "PENUTUP", background: { color: C.text1 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.9, y: 0.6, w: 11.5, h: 0.9,
        fontSize: 34, bold: true, color: C.background1, valign: "top", align: "left" }, text: " " } },
  ],
});

// ---------------------------------------------------------------- utilitas
let S = null;
const nw = (m, sec) => (S = pres.addSlide({ masterName: m, sectionTitle: sec }));

function bullets(items, opt = {}) {
  const runs = items.map((t, i) => ({
    text: t, options: { bullet: true, breakLine: i < items.length - 1, paraSpaceAfter: 10 },
  }));
  S.addText(runs, Object.assign({ placeholder: "body" }, opt));
}

// kartu: judul + teks, latar tipis
function card(x, y, w, h, judul, isi, warna, nomor) {
  S.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.1, fill: { color: C.background2 },
    line: { color: C.background2 }, objectName: `kartu-${judul}`,
    shadow: { type: "outer", angle: 90, offset: 2, blur: 6, color: "9AA7B5", opacity: 0.25 },
  });
  let ty = y + 0.3;
  if (nomor !== undefined) {
    S.addShape(pres.ShapeType.ellipse, {
      x: x + 0.3, y: ty, w: 0.42, h: 0.42, fill: { color: warna }, line: { color: warna },
    });
    S.addText(String(nomor), { x: x + 0.3, y: ty, w: 0.42, h: 0.42, align: "center",
      valign: "middle", fontSize: 14, bold: true, color: "FFFFFF", isTextBox: true, margin: 0 });
  }
  S.addText(judul, { x: x + (nomor !== undefined ? 0.85 : 0.3), y: ty, w: w - (nomor !== undefined ? 1.15 : 0.6),
    h: 0.42, fontSize: 17, bold: true, color: warna, valign: "middle", isTextBox: true, margin: 0 });
  S.addText(isi, { x: x + 0.3, y: ty + 0.55, w: w - 0.6, h: h - (ty - y) - 0.8,
    fontSize: 14, color: C.text1, valign: "top", isTextBox: true, margin: 0, lineSpacingMultiple: 1.15 });
}

// angka besar + label
function stat(x, y, w, angka, label, warna) {
  S.addText(angka, { x, y, w, h: 0.95, fontSize: 48, bold: true, color: warna,
    align: "center", isTextBox: true, margin: 0 });
  S.addText(label, { x, y: y + 1.0, w, h: 0.8, fontSize: 13, color: C.text1,
    align: "center", valign: "top", isTextBox: true, margin: 0 });
}

const HEAD = { fill: "1B3B66", color: "FFFFFF", bold: true };
function tabel(rows, opt = {}) {
  S.addTable(rows, Object.assign({
    x: 0.7, y: 1.5, w: 11.9, fontSize: 13, fontFace: "Calibri", color: "14223A",
    border: { type: "solid", pt: 0.5, color: "D3DCE6" }, align: "center", valign: "middle",
    rowH: 0.34, margin: 5,
  }, opt));
}

// ================================================================ 1. judul
pres.addSection({ title: "Pembuka" });
nw("JUDUL", "Pembuka");
S.addText("PENJELASAN PROSES PENELITIAN", { placeholder: "kicker" });
S.addText("Tiga Tataran Penanganan Ketidakseimbangan Kelas pada IDS berbasis Transformer",
  { placeholder: "title" });
S.addText([
  { text: "Dua dataset (NSL-KDD dan CICIDS2017) · sepuluh seed · protokol identik · koreksi Holm-Bonferroni",
    options: { breakLine: true } },
  { text: "Deck ini menelusuri alurnya langkah demi langkah, bukan merangkum hasilnya saja.", options: { italic: true } },
], { placeholder: "body" });
S.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.22, fill: { color: C.accent2 }, line: { color: C.accent2 } });
S.addNotes("Pesan utamanya: artikel ini bukan mengusulkan model baru, melainkan menguji secara adil tiga cara menangani kelas minoritas di atas satu arsitektur yang sama. Nilai tambahnya ada pada protokol dan pada penjelasan mekanistik di akhir.");

// ================================================================ 2. pertanyaan
nw("ISI", "Pembuka");
S.addText("Tiga pertanyaan yang dijawab", { placeholder: "title" });
card(0.7, 1.5, 3.75, 2.75, "Mana yang berhasil", "Dari tiga tataran intervensi, mana yang benar-benar menaikkan performa kelas minoritas, bukan sekadar terlihat naik?", "2060B0", 1);
card(4.78, 1.5, 3.75, 2.75, "Apakah konsisten", "Apakah kesimpulan pada satu dataset tetap berlaku pada dataset lain dengan protokol yang persis sama?", "1C7293", 2);
card(8.85, 1.5, 3.75, 2.75, "Mengapa begitu", "Apa mekanisme yang membuat sebuah strategi menolong pada satu dataset tetapi tidak pada dataset lain?", "C0601F", 3);
S.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 4.6, w: 11.9, h: 1.5, rectRadius: 0.1,
  fill: { color: "14223A" }, line: { color: "14223A" } });
S.addText([
  { text: "Jawaban singkat: ", options: { bold: true, color: "8FB4DD" } },
  { text: "hanya penanganan pada tataran loss yang konsisten lintas dataset. Tataran arsitektur berbalik arah, dan justru pembalikan itulah temuan utamanya." },
], { x: 1.05, y: 4.8, w: 11.2, h: 1.1, fontSize: 16, color: "FFFFFF", isTextBox: true, margin: 0, valign: "middle" });
S.addText("Pertanyaan 3 adalah yang membedakan artikel ini dari laporan benchmark biasa.",
  { x: 0.7, y: 6.35, w: 11.9, h: 0.4, fontSize: 13, italic: true, color: C.accent5, isTextBox: true, margin: 0 });
S.addNotes("Kalau hanya menjawab pertanyaan 1 dan 2, ini sekadar benchmark. Pertanyaan 3 yang mengubahnya menjadi kontribusi ilmiah: kita tidak berhenti pada 'metode A kalah', tapi menjelaskan syarat kapan metode A bekerja.");

// ================================================================ 3. masalah
nw("ISI", "Pembuka");
S.addText("Masalahnya: kelas paling berbahaya justru paling langka", { placeholder: "title" });
stat(0.7, 1.7, 3.6, "0,04%", "porsi U2R pada data latih NSL-KDD — serangan eskalasi hak akses", "C0601F");
stat(4.85, 1.7, 3.6, "190.000:1", "rasio kelas terbanyak terhadap terlangka pada CICIDS2017 sebelum pembatasan", "2060B0");
stat(9.0, 1.7, 3.6, "99%+", "akurasi yang tetap tercapai meski kelas langka tidak terdeteksi sama sekali", "1C7293");
S.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 4.4, w: 11.9, h: 1.7, rectRadius: 0.1,
  fill: { color: C.background2 }, line: { color: C.background2 } });
S.addText([
  { text: "Konsekuensi metodologis. ", options: { bold: true, color: "C0601F" } },
  { text: "Akurasi tidak dapat dipakai. Model yang mengabaikan seluruh kelas langka tetap mencetak akurasi tinggi. Karena itu seluruh evaluasi memakai macro-F1 dan G-mean, serta melaporkan F1 per kelas minoritas secara terpisah." },
], { x: 1.05, y: 4.65, w: 11.2, h: 1.2, fontSize: 15, color: C.text1, isTextBox: true, margin: 0, valign: "middle" });
S.addText("Praktis: alarm yang gagal berbunyi jauh lebih mahal daripada alarm palsu.",
  { x: 0.7, y: 6.35, w: 11.9, h: 0.4, fontSize: 14, italic: true, color: C.accent5, isTextBox: true, margin: 0 });
S.addNotes("Poin yang sering ditanya penguji: kenapa tidak pakai akurasi? Jawabannya di slide ini. U2R hanya 0,04 persen, jadi model yang selalu menebak 'Normal' sudah hampir benar secara akurasi, tapi gagal total pada tugas sebenarnya.");

// ================================================================ 4. pembatas kerangka
pres.addSection({ title: "Kerangka" });
nw("PEMBATAS", "Kerangka");
S.addText("BAGIAN 1", { placeholder: "kicker" });
S.addText("Kerangka berpikir: tiga tataran intervensi", { placeholder: "title" });
S.addText("Setiap cara menangani ketimpangan bekerja pada lapisan yang berbeda dari pipeline yang sama.", { placeholder: "body" });
S.addNotes("Transisi: sebelum masuk eksperimen, jelaskan dulu peta konsepnya. Ini yang membuat perbandingan bisa disebut terkendali.");

// ================================================================ 5. tiga tataran
nw("ISI", "Kerangka");
S.addText("Tiga tataran, satu pipeline", { placeholder: "title" });
const TT = [
  ["Tataran data", "Mengubah data latih sebelum model melihatnya. SMOTE membangkitkan sampel minoritas sintetis lewat interpolasi.", "Biaya: data latih membesar, waktu latih bertambah.", "1C7293", 1],
  ["Tataran loss", "Mengubah cara kesalahan dihitung. Adaptive focal loss mengecilkan bobot sampel mudah dan menimbang kelas memakai effective number.", "Biaya: nyaris nol, hanya mengganti fungsi loss.", "2060B0", 2],
  ["Tataran arsitektur", "Mengubah cara representasi dibentuk. Class-query attention pooling memberi tiap kelas query sendiri untuk memilih fitur.", "Biaya: parameter dan latensi bertambah.", "C0601F", 3],
];
TT.forEach(([j, isi, biaya, w, n], i) => {
  const x = 0.7 + i * 4.07;
  card(x, 1.5, 3.75, 4.0, j, isi, w, n);
  S.addText(biaya, { x: x + 0.3, y: 4.5, w: 3.15, h: 0.75, fontSize: 12, italic: true,
    color: C.accent5, isTextBox: true, margin: 0 });
});
S.addText([
  { text: "Logika perbandingannya: ", options: { bold: true } },
  { text: "karena ketiganya menumpang pada encoder yang sama, selisih performa dapat diatribusikan pada tataran intervensinya, bukan pada arsitektur yang kebetulan berbeda." },
], { x: 0.7, y: 5.85, w: 11.9, h: 0.8, fontSize: 15, color: C.text1, isTextBox: true, margin: 0 });
S.addNotes("Kalimat kunci untuk presentasi: kebanyakan paper membandingkan metode A pada arsitektur A dengan metode B pada arsitektur B, lalu menyimpulkan metode A lebih baik. Itu tidak sah. Di sini encoder-nya satu dan sama.");

// ================================================================ 6. pembatas alur
pres.addSection({ title: "Alur eksperimen" });
nw("PEMBATAS", "Alur eksperimen");
S.addText("BAGIAN 2", { placeholder: "kicker" });
S.addText("Alur eksperimen, langkah demi langkah", { placeholder: "title" });
S.addText("Enam langkah, dari data mentah sampai keputusan statistik.", { placeholder: "body" });
S.addNotes("Bagian inti untuk memahami proses. Setiap langkah berikutnya punya satu slide.");

// ================================================================ 7. peta alur
nw("ISI", "Alur eksperimen");
S.addText("Peta alur keseluruhan", { placeholder: "title" });
const LANGKAH = [
  ["1", "Praproses", "encoding, scaling,\nsplit stratifikasi", "1C7293"],
  ["2", "Encoder bersama", "feature tokenizer\n+ Transformer", "2060B0"],
  ["3", "Enam konfigurasi", "varian loss, pooling,\nSMOTE, tree ensemble", "4C7FBF"],
  ["4", "Sepuluh seed", "42 sampai 51,\nseed disamakan", "5F7086"],
  ["5", "Metrik", "macro-F1, G-mean,\nF1 per kelas", "C0601F"],
  ["6", "Uji statistik", "Wilcoxon +\nHolm-Bonferroni", "14223A"],
];
LANGKAH.forEach(([n, j, d, w], i) => {
  const x = 0.7 + i * 2.05;
  S.addShape(pres.ShapeType.roundRect, { x, y: 1.9, w: 1.75, h: 2.1, rectRadius: 0.1,
    fill: { color: C.background2 }, line: { color: C.background2 }, objectName: `langkah${n}` });
  S.addShape(pres.ShapeType.ellipse, { x: x + 0.63, y: 2.1, w: 0.5, h: 0.5, fill: { color: w }, line: { color: w } });
  S.addText(n, { x: x + 0.63, y: 2.1, w: 0.5, h: 0.5, align: "center", valign: "middle",
    fontSize: 15, bold: true, color: "FFFFFF", isTextBox: true, margin: 0 });
  S.addText(j, { x: x + 0.1, y: 2.72, w: 1.55, h: 0.4, align: "center", fontSize: 14, bold: true,
    color: w, isTextBox: true, margin: 0 });
  S.addText(d, { x: x + 0.1, y: 3.12, w: 1.55, h: 0.8, align: "center", fontSize: 11,
    color: C.text1, isTextBox: true, margin: 0 });
  if (i < 5) S.addShape(pres.ShapeType.rightArrow, { x: x + 1.79, y: 2.85, w: 0.21, h: 0.2,
    fill: { color: C.accent4 }, line: { color: C.accent4 } });
});
S.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 4.4, w: 11.9, h: 1.0, rectRadius: 0.1,
  fill: { color: "14223A" }, line: { color: "14223A" } });
S.addText([
  { text: "Yang dikunci: " , options: { bold: true, color: "8FB4DD" } },
  { text: "praproses dihitung satu kali di luar loop, seed disamakan antar konfigurasi, dan kriteria pemilihan bobot terbaik identik. Satu-satunya yang berbeda adalah strategi penanganan ketimpangannya." },
], { x: 1.05, y: 4.55, w: 11.2, h: 0.7, fontSize: 15, color: "FFFFFF", isTextBox: true, margin: 0, valign: "middle" });
S.addText("Seluruh alur ini diformalkan sebagai Algoritma 1 pada naskah — bukan metode baru, melainkan protokol evaluasi.",
  { x: 0.7, y: 5.65, w: 11.9, h: 0.4, fontSize: 13, italic: true, color: C.accent5, isTextBox: true, margin: 0 });
S.addNotes("Pakai slide ini sebagai peta. Saat menjawab pertanyaan 'bagaimana Anda memastikan perbandingannya adil', tunjuk kotak biru di bawah.");

// ================================================================ 8. dataset
nw("ISI", "Alur eksperimen");
S.addText("Langkah 1 — Dua dataset dengan karakter berbeda", { placeholder: "title" });
tabel([
  [{ text: "", options: HEAD }, { text: "NSL-KDD", options: HEAD }, { text: "CICIDS2017", options: HEAD }],
  [{ text: "Jumlah kelas", options: { align: "left", bold: true } }, "5 kategori", "9 kategori"],
  [{ text: "Jumlah fitur", options: { align: "left", bold: true } }, "42 token fitur", "79 token fitur"],
  [{ text: "Kelas terlangka", options: { align: "left", bold: true } }, "U2R — 0,04% data latih", "Heartbleed — 11 baris"],
  [{ text: "Kelas minoritas yang dianalisis", options: { align: "left", bold: true } }, "U2R dan R2L", "Bot dan WebAttack"],
  [{ text: "Sifat fitur", options: { align: "left", bold: true } }, "fitur koneksi dan konten, banyak kategorikal", "statistik aliran paket, hampir seluruhnya numerik"],
  [{ text: "Tantangan khusus", options: { align: "left", bold: true } }, "kelas langka sangat kecil secara absolut", "volume besar, perlu pembatasan per kelas"],
], { y: 1.45, rowH: 0.46, colW: [3.5, 4.2, 4.2] });
S.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 4.75, w: 5.85, h: 1.55, rectRadius: 0.1,
  fill: { color: C.background2 }, line: { color: C.background2 } });
S.addText([
  { text: "Keputusan sampling\n", options: { bold: true, color: "2060B0" } },
  { text: "Pembatasan 50.000 baris per kelas, bukan sampling proporsional. Sampling proporsional akan menghapus kelas terlangka. Rasio ketimpangan turun dari 190.000:1 menjadi 4.545:1 dan hal ini diungkapkan di naskah." },
], { x: 1.0, y: 4.95, w: 5.25, h: 1.2, fontSize: 13, color: C.text1, isTextBox: true, margin: 0, valign: "top" });
S.addShape(pres.ShapeType.roundRect, { x: 6.75, y: 4.75, w: 5.85, h: 1.55, rectRadius: 0.1,
  fill: { color: C.background2 }, line: { color: C.background2 } });
S.addText([
  { text: "Ambang 50 sampel uji\n", options: { bold: true, color: "C0601F" } },
  { text: "Kelas minoritas yang dianalisis harus punya minimal 50 sampel uji. Tanpa ambang ini, F1 dihitung atas 3 sampai 9 sampel dan angkanya tidak bermakna. Inilah alasan Bot dan WebAttack yang dipilih." },
], { x: 7.05, y: 4.95, w: 5.25, h: 1.2, fontSize: 13, color: C.text1, isTextBox: true, margin: 0, valign: "top" });
S.addNotes("Dua keputusan di bawah adalah yang paling mungkin ditanya reviewer. Keduanya diambil karena alternatifnya merusak validitas, bukan demi kemudahan.");

// ================================================================ 9. encoder
nw("ISI", "Alur eksperimen");
S.addText("Langkah 2 — Encoder bersama semua konfigurasi", { placeholder: "title" });
const PIPE = [
  ["Feature tokenizer", "Tiap fitur numerik diproyeksikan jadi satu token berdimensi d; fitur kategorikal lewat embedding lookup. Mengikuti FT-Transformer.", "1C7293"],
  ["Transformer encoder", "L lapisan encoder standar atas barisan token. Tanpa positional encoding, karena fitur tabular tidak punya urutan intrinsik.", "2060B0"],
  ["Agregasi (pooling)", "Barisan token diringkas jadi satu vektor. Di sinilah letak perbedaan antar konfigurasi arsitektur.", "C0601F"],
  ["Classifier", "Satu lapisan linear menuju C kelas, dengan softmax bersama untuk seluruh kelas.", "5F7086"],
];
PIPE.forEach(([j, d, w], i) => {
  const y = 1.45 + i * 1.22;
  S.addShape(pres.ShapeType.roundRect, { x: 0.7, y, w: 11.9, h: 1.05, rectRadius: 0.08,
    fill: { color: C.background2 }, line: { color: C.background2 }, objectName: `pipe${i}` });
  S.addShape(pres.ShapeType.ellipse, { x: 1.0, y: y + 0.28, w: 0.5, h: 0.5, fill: { color: w }, line: { color: w } });
  S.addText(String(i + 1), { x: 1.0, y: y + 0.28, w: 0.5, h: 0.5, align: "center", valign: "middle",
    fontSize: 15, bold: true, color: "FFFFFF", isTextBox: true, margin: 0 });
  S.addText(j, { x: 1.7, y: y + 0.17, w: 2.9, h: 0.7, fontSize: 16, bold: true, color: w,
    valign: "middle", isTextBox: true, margin: 0 });
  S.addText(d, { x: 4.7, y: y + 0.15, w: 7.6, h: 0.75, fontSize: 13, color: C.text1,
    valign: "middle", isTextBox: true, margin: 0 });
});
S.addText("Titik intervensi tataran arsitektur ada pada kotak 3; tataran loss bekerja setelah kotak 4; tataran data bekerja sebelum kotak 1.",
  { x: 0.7, y: 6.4, w: 11.9, h: 0.4, fontSize: 13, italic: true, color: C.accent5, isTextBox: true, margin: 0 });
S.addNotes("Cara menjelaskan paling mudah: tunjuk kotak nomor 3. Semua perdebatan arsitektur di paper ini terjadi persis di satu kotak itu, sisanya identik.");

// ================================================================ 10. pooling
nw("ISI", "Alur eksperimen");
S.addText("Langkah 3a — Mean-pooling versus class-query attention", { placeholder: "title" });
S.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 1.5, w: 5.85, h: 3.9, rectRadius: 0.1,
  fill: { color: C.background2 }, line: { color: C.background2 } });
S.addText("Mean-pooling (dasar)", { x: 1.0, y: 1.75, w: 5.25, h: 0.4, fontSize: 18, bold: true, color: "5F7086", isTextBox: true, margin: 0 });
S.addText([
  { text: "Seluruh token dirata-ratakan menjadi satu vektor.", options: { breakLine: true, paraSpaceAfter: 8 } },
  { text: "Satu representasi dipakai bersama oleh semua kelas.", options: { breakLine: true, paraSpaceAfter: 8 } },
  { text: "Kelas langka harus berbagi ruang representasi dengan kelas dominan.", options: { breakLine: true, paraSpaceAfter: 8 } },
  { text: "Tidak ada tambahan parameter.", options: { italic: true } },
], { x: 1.0, y: 2.3, w: 5.25, h: 2.9, fontSize: 14, color: C.text1, isTextBox: true, margin: 0, valign: "top" });
S.addShape(pres.ShapeType.roundRect, { x: 6.75, y: 1.5, w: 5.85, h: 3.9, rectRadius: 0.1,
  fill: { color: "14223A" }, line: { color: "14223A" } });
S.addText("Class-query attention pooling", { x: 7.05, y: 1.75, w: 5.25, h: 0.4, fontSize: 18, bold: true, color: "8FB4DD", isTextBox: true, margin: 0 });
S.addText([
  { text: "Tiap kelas punya vektor query sendiri yang dipelajari.", options: { breakLine: true, paraSpaceAfter: 8 } },
  { text: "Query itu memilih token fitur mana yang relevan bagi kelasnya.", options: { breakLine: true, paraSpaceAfter: 8 } },
  { text: "Hasilnya C representasi, satu per kelas — kelas langka tidak lagi berbagi.", options: { breakLine: true, paraSpaceAfter: 8 } },
  { text: "Diadopsi dari Query2Label dan ML-Decoder di computer vision multi-label.", options: { italic: true } },
], { x: 7.05, y: 2.3, w: 5.25, h: 2.9, fontSize: 14, color: "FFFFFF", isTextBox: true, margin: 0, valign: "top" });
S.addText([
  { text: "Hipotesis awal yang diuji: ", options: { bold: true } },
  { text: "memberi kelas langka ruang representasi sendiri akan menolongnya. Hasil eksperimen menunjukkan hipotesis ini hanya benar bersyarat — dan syaratnya baru terungkap pada analisis entropi di Bagian 3." },
], { x: 0.7, y: 5.75, w: 11.9, h: 0.9, fontSize: 15, color: C.text1, isTextBox: true, margin: 0 });
S.addNotes("Ini inti kebaruan arsitektural yang diuji. Intuisinya kuat dan terbukti di computer vision, karena itu layak diuji di data tabular. Hasilnya ternyata tidak otomatis berpindah domain.");

// ================================================================ 11. focal loss
nw("ISI", "Alur eksperimen");
S.addText("Langkah 3b — Adaptive focal loss pada tataran loss", { placeholder: "title" });
card(0.7, 1.45, 3.75, 2.75, "Faktor modulasi", "Sampel yang sudah mudah diklasifikasikan diberi bobot kecil, sehingga pembelajaran terpusat pada sampel sulit — yang umumnya berasal dari kelas langka.", "2060B0", 1);
card(4.78, 1.45, 3.75, 2.75, "Effective number", "Bobot kelas tidak sekadar berbanding terbalik dengan frekuensi, melainkan memakai effective number sehingga tidak berlebihan pada kelas yang sangat kecil.", "1C7293", 2);
card(8.85, 1.45, 3.75, 2.75, "Biaya nol", "Tidak ada parameter tambahan, tidak ada data tambahan, tidak ada tahap praproses baru. Hanya fungsi loss yang diganti.", "C0601F", 3);
S.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 4.5, w: 11.9, h: 1.6, rectRadius: 0.1,
  fill: { color: C.background2 }, line: { color: C.background2 } });
S.addText([
  { text: "Mengapa ini yang akhirnya menang. ", options: { bold: true, color: "2060B0" } },
  { text: "Intervensi loss mengubah arah gradien pada setiap langkah pelatihan untuk seluruh kelas sekaligus, tanpa bergantung pada apakah ada fitur tertentu yang bisa dipilih. Karena tidak bersyarat pada struktur data, efeknya bertahan di kedua dataset." },
], { x: 1.05, y: 4.75, w: 11.2, h: 1.1, fontSize: 15, color: C.text1, isTextBox: true, margin: 0, valign: "middle" });
S.addNotes("Kalimat untuk ditanamkan: intervensi loss itu tanpa syarat, intervensi arsitektur itu bersyarat. Perbedaan ini yang menjelaskan seluruh pola hasil.");

// ================================================================ 12. SMOTE + baseline
nw("ISI", "Alur eksperimen");
S.addText("Langkah 3c — Pembanding data dan non-deep-learning", { placeholder: "title" });
card(0.7, 1.45, 5.85, 2.5, "SMOTE — tataran data", "Membangkitkan sampel minoritas sintetis dengan interpolasi ke tetangga terdekat, diterapkan hanya pada data latih agar tidak bocor ke data uji. Mewakili pendekatan yang paling banyak dipakai di literatur IDS.", "1C7293");
card(6.75, 1.45, 5.85, 2.5, "Tree ensemble — pembanding wajib", "Random Forest, XGBoost, dan soft-voting keduanya. Disertakan karena literatur mencatat tree ensemble yang kuat masih sering mengungguli deep learning pada data tabular.", "C0601F");
S.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 4.25, w: 11.9, h: 1.9, rectRadius: 0.1,
  fill: { color: "14223A" }, line: { color: "14223A" } });
S.addText([
  { text: "Kejujuran yang disengaja.\n", options: { bold: true, color: "8FB4DD" } },
  { text: "Menyertakan XGBoost berisiko membuat usulan sendiri terlihat kalah — dan pada CICIDS2017 memang itu yang terjadi. Pembanding ini tetap dipertahankan dan dilaporkan apa adanya. Tanpa pembanding ini, klaim keunggulan Transformer tidak dapat diverifikasi dan reviewer akan menanyakannya." },
], { x: 1.05, y: 4.45, w: 11.2, h: 1.5, fontSize: 15, color: "FFFFFF", isTextBox: true, margin: 0, valign: "middle" });
S.addNotes("Kalau ditanya 'kenapa menampilkan hasil yang merugikan metode Anda sendiri' — jawabannya: karena tanpa itu, perbandingannya tidak bisa dipercaya. Ini justru memperkuat kredibilitas paper.");

// ================================================================ 13. protokol
nw("ISI", "Alur eksperimen");
S.addText("Langkah 4 — Apa yang membuat perbandingan ini sah", { placeholder: "title" });
const PROT = [
  ["Sepuluh seed", "Setiap konfigurasi dijalankan pada seed 42 sampai 51, dan seed disamakan antar konfigurasi sehingga inisialisasi serta urutan batch identik."],
  ["Praproses sekali", "Encoding dan scaling dihitung satu kali di luar loop, sehingga tidak ada strategi yang diam-diam memperoleh data yang berbeda."],
  ["Tanpa kebocoran data uji", "Pemilihan epoch terbaik memakai macro-F1 validasi, bukan data uji. Versi awal eksperimen sempat memakai data uji dan itu diperbaiki."],
  ["Pelaporan variansi", "Seluruh angka dilaporkan sebagai rerata plus-minus simpangan baku, bukan estimasi titik tunggal."],
];
PROT.forEach(([j, d], i) => {
  const x = 0.7 + (i % 2) * 6.05, y = 1.55 + Math.floor(i / 2) * 2.25;
  S.addShape(pres.ShapeType.roundRect, { x, y, w: 5.85, h: 1.95, rectRadius: 0.1,
    fill: { color: C.background2 }, line: { color: C.background2 }, objectName: `prot${i}` });
  S.addText(j, { x: x + 0.3, y: y + 0.2, w: 5.25, h: 0.35, fontSize: 16, bold: true,
    color: i === 2 ? "C0601F" : "2060B0", isTextBox: true, margin: 0 });
  S.addText(d, { x: x + 0.3, y: y + 0.65, w: 5.25, h: 1.1, fontSize: 13, color: C.text1,
    isTextBox: true, margin: 0, valign: "top" });
});
S.addText([
  { text: "Butir ketiga adalah perbaikan terpenting. ", options: { bold: true } },
  { text: "Memilih epoch berdasarkan performa pada data uji akan menghasilkan angka yang terlihat bagus tetapi tidak dapat direproduksi oleh orang lain." },
], { x: 0.7, y: 6.15, w: 11.9, h: 0.8, fontSize: 15, color: C.text1, isTextBox: true, margin: 0 });
S.addNotes("Kalau hanya sempat menyebut satu hal dari slide ini, sebut yang ketiga: test-set leakage sudah dihilangkan. Itu pertanyaan reviewer yang paling mematikan kalau tidak diantisipasi.");

// ================================================================ 14. metrik
nw("ISI", "Alur eksperimen");
S.addText("Langkah 5 — Metrik yang dipilih dan alasannya", { placeholder: "title" });
tabel([
  [{ text: "Metrik", options: HEAD }, { text: "Apa yang diukur", options: HEAD }, { text: "Mengapa dipakai di sini", options: HEAD }],
  [{ text: "Macro-F1", options: { align: "left", bold: true } },
   { text: "Rerata F1 seluruh kelas dengan bobot sama", options: { align: "left" } },
   { text: "Kelas langka memperoleh suara sebesar kelas dominan", options: { align: "left" } }],
  [{ text: "G-mean", options: { align: "left", bold: true } },
   { text: "Rerata geometrik recall seluruh kelas", options: { align: "left" } },
   { text: "Jatuh drastis bila ada satu saja kelas dengan recall buruk — paling peka terhadap kegagalan kelas langka", options: { align: "left" } }],
  [{ text: "F1 per kelas minoritas", options: { align: "left", bold: true } },
   { text: "Performa pada U2R, R2L, Bot, WebAttack", options: { align: "left" } },
   { text: "Menghindari rerata yang menyembunyikan kegagalan pada satu kelas tertentu", options: { align: "left" } }],
  [{ text: "Ukuran, FLOPs, latensi", options: { align: "left", bold: true } },
   { text: "Biaya komputasi per sampel pada CPU satu thread", options: { align: "left" } },
   { text: "Efektivitas harus dinilai bersama harganya, bukan sendirian", options: { align: "left" } }],
], { y: 1.5, rowH: 0.62, colW: [2.6, 4.0, 5.3] });
S.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 4.75, w: 11.9, h: 1.45, rectRadius: 0.1,
  fill: { color: C.background2 }, line: { color: C.background2 } });
S.addText([
  { text: "Contoh konkret kekuatan G-mean. ", options: { bold: true, color: "C0601F" } },
  { text: "Baseline cross-entropy pada CICIDS2017 mencetak macro-F1 0,8071 yang terlihat wajar, tetapi G-mean-nya hanya 0,3856 dengan simpangan baku 0,3610. Artinya pada sebagian seed model benar-benar gagal total pada suatu kelas, dan macro-F1 menyamarkannya." },
], { x: 1.05, y: 4.95, w: 11.2, h: 1.05, fontSize: 14, color: C.text1, isTextBox: true, margin: 0, valign: "middle" });
S.addNotes("Angka 0,3856 plus-minus 0,3610 itu sendiri sudah bercerita: simpangan bakunya hampir sebesar reratanya, artinya hasil antar seed sangat tidak stabil.");

// ================================================================ 15. uji statistik
nw("ISI", "Alur eksperimen");
S.addText("Langkah 6 — Uji statistik dan koreksi Holm", { placeholder: "title" });
card(0.7, 1.45, 5.85, 2.3, "Wilcoxon signed-rank", "Uji nonparametrik berpasangan atas sepuluh seed. Dipilih karena tidak mengasumsikan distribusi normal dan karena pasangan seed-nya memang identik, mengikuti rekomendasi Demšar.", "2060B0", 1);
card(6.75, 1.45, 5.85, 2.3, "Koreksi Holm-Bonferroni", "Dilakukan 12 pengujian sekaligus per dataset. Tanpa koreksi, beberapa hasil akan tampak signifikan hanya karena banyaknya pengujian yang dilakukan.", "C0601F", 2);
S.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 4.05, w: 11.9, h: 2.05, rectRadius: 0.1,
  fill: { color: "14223A" }, line: { color: "14223A" } });
S.addText([
  { text: "Konsekuensinya nyata, bukan formalitas.\n", options: { bold: true, color: "8FB4DD" } },
  { text: "Pada NSL-KDD, selisih F1 kelas R2L sebesar +0,1420 memiliki p mentah 0,0059 — terlihat signifikan. Setelah koreksi Holm nilainya menjadi 0,0527 dan tidak lagi dinyatakan signifikan. Angka ini tetap dilaporkan apa adanya di naskah, termasuk kedekatannya dengan ambang 0,05." },
], { x: 1.05, y: 4.3, w: 11.2, h: 1.55, fontSize: 15, color: "FFFFFF", isTextBox: true, margin: 0, valign: "middle" });
S.addNotes("Contoh R2L ini bagus untuk menunjukkan bahwa koreksi Holm bukan hiasan. Satu klaim benar-benar gugur karenanya, dan kita tetap melaporkannya.");

// ================================================================ 16. pembatas hasil
pres.addSection({ title: "Hasil" });
nw("PEMBATAS", "Hasil");
S.addText("BAGIAN 3", { placeholder: "kicker" });
S.addText("Hasil dan mekanisme di baliknya", { placeholder: "title" });
S.addText("Dua dataset, protokol identik, dan satu kesimpulan yang berbalik arah.", { placeholder: "body" });
S.addNotes("Mulai bagian ini dengan menegaskan: protokolnya persis sama, jadi perbedaan hasil benar-benar berasal dari datasetnya.");

// ================================================================ 17. hasil NSL-KDD
nw("ISI_KOSONG", "Hasil");
S.addText("Hasil NSL-KDD — hanya focal loss yang bertahan", { placeholder: "title" });
S.addChart(pres.ChartType.bar, [
  { name: "Macro-F1", labels: ["ClassAttn", "Baseline", "XGBoost", "SMOTE", "ClassAttn + Focal", "Focal"],
    values: [0.5426, 0.5500, 0.5873, 0.5919, 0.6027, 0.6068] },
  { name: "G-mean", labels: ["ClassAttn", "Baseline", "XGBoost", "SMOTE", "ClassAttn + Focal", "Focal"],
    values: [0.1669, 0.1554, 0.4018, 0.4907, 0.6358, 0.6239] },
], {
  x: 0.7, y: 1.4, w: 7.4, h: 4.9, barDir: "bar", barGrouping: "clustered",
  chartColors: ["2060B0", "C0601F"], showTitle: false, showLegend: true, legendPos: "t",
  legendColor: "14223A", legendFontSize: 12, legendFontFace: "+mn-lt",
  showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.000",
  dataLabelFontSize: 10, dataLabelColor: "14223A", dataLabelFontFace: "+mn-lt",
  catAxisLabelColor: "14223A", catAxisLabelFontSize: 12, catAxisLabelFontFace: "+mn-lt",
  valAxisLabelColor: "5F7086", valAxisLabelFontSize: 10, valAxisLabelFontFace: "+mn-lt",
  valAxisMinVal: 0, valAxisMaxVal: 0.8, valGridLine: { color: "E4EAF1", size: 1 }, catGridLine: { style: "none" },
  barGapWidthPct: 40, objectName: "grafik-nslkdd",
});
S.addShape(pres.ShapeType.roundRect, { x: 8.35, y: 1.4, w: 4.25, h: 2.35, rectRadius: 0.1,
  fill: { color: C.background2 }, line: { color: C.background2 } });
S.addText([
  { text: "Signifikan setelah Holm (3 dari 12)\n", options: { bold: true, color: "2060B0", breakLine: true } },
  { text: "Focal vs Baseline:\n", options: { bold: true, breakLine: true } },
  { text: "macro-F1 +0,0568 · G-mean +0,4685 · F1 U2R +0,1118", options: {} },
], { x: 8.65, y: 1.6, w: 3.65, h: 1.3, fontSize: 13, color: C.text1, isTextBox: true, margin: 0, valign: "top" });
S.addText("R2L +0,1420 gugur pada p-Holm 0,0527.",
  { x: 8.65, y: 3.1, w: 3.65, h: 0.5, fontSize: 12, italic: true, color: C.accent5, isTextBox: true, margin: 0 });
S.addShape(pres.ShapeType.roundRect, { x: 8.35, y: 3.95, w: 4.25, h: 2.35, rectRadius: 0.1,
  fill: { color: "14223A" }, line: { color: "14223A" } });
S.addText([
  { text: "Yang tidak terbukti\n", options: { bold: true, color: "8FB4DD", breakLine: true } },
  { text: "ClassAttn tanpa focal loss tidak berbeda dari baseline pada keempat metrik. Menambahkan ClassAttn di atas focal loss juga tidak memberi perbaikan apa pun.", options: {} },
], { x: 8.65, y: 4.15, w: 3.65, h: 1.95, fontSize: 13, color: "FFFFFF", isTextBox: true, margin: 0, valign: "top" });
S.addNotes("Perhatikan lompatan G-mean dari 0,1554 ke 0,6239. Itu bukan perbaikan marginal — itu perbedaan antara model yang gagal total pada suatu kelas dan model yang tidak.");

// ================================================================ 18. hasil CICIDS
nw("ISI_KOSONG", "Hasil");
S.addText("Hasil CICIDS2017 — polanya berbalik", { placeholder: "title" });
S.addChart(pres.ChartType.bar, [
  { name: "Macro-F1", labels: ["Focal", "ClassAttn + Focal", "Baseline", "SMOTE", "ClassAttn", "Random Forest", "Voting RF+XGB", "XGBoost"],
    values: [0.7391, 0.7647, 0.8071, 0.8806, 0.9060, 0.9568, 0.9737, 0.9750] },
  { name: "G-mean", labels: ["Focal", "ClassAttn + Focal", "Baseline", "SMOTE", "ClassAttn", "Random Forest", "Voting RF+XGB", "XGBoost"],
    values: [0.9446, 0.9471, 0.3856, 0.9389, 0.8783, 0.9513, 0.9825, 0.9853] },
], {
  x: 0.7, y: 1.4, w: 7.4, h: 4.9, barDir: "bar", barGrouping: "clustered",
  chartColors: ["2060B0", "C0601F"], showTitle: false, showLegend: true, legendPos: "t",
  legendColor: "14223A", legendFontSize: 12, legendFontFace: "+mn-lt",
  showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.000",
  dataLabelFontSize: 9, dataLabelColor: "14223A", dataLabelFontFace: "+mn-lt",
  catAxisLabelColor: "14223A", catAxisLabelFontSize: 11, catAxisLabelFontFace: "+mn-lt",
  valAxisLabelColor: "5F7086", valAxisLabelFontSize: 10, valAxisLabelFontFace: "+mn-lt",
  valAxisMinVal: 0, valAxisMaxVal: 1.15, valGridLine: { color: "E4EAF1", size: 1 }, catGridLine: { style: "none" },
  barGapWidthPct: 40, objectName: "grafik-cicids",
});
S.addShape(pres.ShapeType.roundRect, { x: 8.35, y: 1.4, w: 4.25, h: 2.35, rectRadius: 0.1,
  fill: { color: C.background2 }, line: { color: C.background2 } });
S.addText([
  { text: "ClassAttn kini menang\n", options: { bold: true, color: "2060B0", breakLine: true } },
  { text: "ClassAttn vs Baseline signifikan pada macro-F1 (+0,0988) dan G-mean (+0,4928). Persis kebalikan dari NSL-KDD.", options: {} },
], { x: 8.65, y: 1.6, w: 3.65, h: 1.95, fontSize: 13, color: C.text1, isTextBox: true, margin: 0, valign: "top" });
S.addShape(pres.ShapeType.roundRect, { x: 8.35, y: 3.95, w: 4.25, h: 2.35, rectRadius: 0.1,
  fill: { color: "C0601F" }, line: { color: "C0601F" } });
S.addText([
  { text: "Focal loss kini merugikan\n", options: { bold: true, color: "FFF0E4", breakLine: true } },
  { text: "G-mean naik +0,5591, tetapi F1 kelas Bot justru turun 0,1852 — keduanya signifikan. Focal loss di sini menukar presisi kelas minoritas dengan recall.", options: {} },
], { x: 8.65, y: 4.15, w: 3.65, h: 1.95, fontSize: 13, color: "FFFFFF", isTextBox: true, margin: 0, valign: "top" });
S.addNotes("Dua hal yang harus disebut jujur: pertama, XGBoost menang telak di sini. Kedua, focal loss justru menurunkan F1 Bot. Keduanya dilaporkan dan dibahas, tidak disembunyikan.");

// ================================================================ 19. pembalikan
nw("ISI", "Hasil");
S.addText("Pembalikan arah antar dataset", { placeholder: "title" });
tabel([
  [{ text: "Perbandingan", options: HEAD }, { text: "Metrik", options: HEAD },
   { text: "NSL-KDD", options: HEAD }, { text: "CICIDS2017", options: HEAD }],
  [{ text: "ClassAttn vs Baseline", options: { align: "left", bold: true } }, "macro-F1",
   { text: "−0,0073  tidak signifikan", options: { color: "5F7086" } },
   { text: "+0,0988  signifikan", options: { color: "2060B0", bold: true } }],
  [{ text: "ClassAttn vs Baseline", options: { align: "left", bold: true } }, "G-mean",
   { text: "+0,0115  tidak signifikan", options: { color: "5F7086" } },
   { text: "+0,4928  signifikan", options: { color: "2060B0", bold: true } }],
  [{ text: "Focal vs Baseline", options: { align: "left", bold: true } }, "macro-F1",
   { text: "+0,0568  signifikan", options: { color: "2060B0", bold: true } },
   { text: "−0,0680  tidak signifikan", options: { color: "5F7086" } }],
  [{ text: "Focal vs Baseline", options: { align: "left", bold: true } }, "G-mean",
   { text: "+0,4685  signifikan", options: { color: "2060B0", bold: true } },
   { text: "+0,5591  signifikan", options: { color: "2060B0", bold: true } }],
  [{ text: "Focal vs Baseline", options: { align: "left", bold: true } }, "F1 kelas minoritas",
   { text: "+0,1118 (U2R)  signifikan", options: { color: "2060B0", bold: true } },
   { text: "−0,1852 (Bot)  signifikan", options: { color: "C0601F", bold: true } }],
], { y: 1.45, rowH: 0.5, colW: [3.5, 2.4, 3.0, 3.0] });
S.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 4.75, w: 11.9, h: 1.55, rectRadius: 0.1,
  fill: { color: "14223A" }, line: { color: "14223A" } });
S.addText([
  { text: "Klaim yang tidak lagi dapat dipertahankan. ", options: { bold: true, color: "8FB4DD" } },
  { text: "Versi awal artikel ini menyimpulkan bahwa class-query attention tidak berpindah ke IDS tabular. CICIDS2017 membantahnya. Klaim umum itu dicabut dan diganti dengan aturan bersyarat yang dapat diuji." },
], { x: 1.05, y: 5.0, w: 11.2, h: 1.05, fontSize: 15, color: "FFFFFF", isTextBox: true, margin: 0, valign: "middle" });
S.addNotes("Ini momen paling penting dalam presentasi. Kalau ditanya 'apa kontribusi barunya', jawabannya di slide ini dan slide berikutnya: kami menemukan kesimpulan kami sendiri salah, lalu menjelaskan kenapa.");

// ================================================================ 20. entropi
nw("ISI_KOSONG", "Hasil");
S.addText("Mekanismenya: entropi bobot attention", { placeholder: "title" });
S.addImage({ path: RES + "fig2_attention_heatmap.png", x: 0.7, y: 1.3, w: 7.5, h: 2.41 });
S.addText("(a) NSL-KDD — attention nyaris merata", { x: 0.7, y: 3.72, w: 7.5, h: 0.3,
  fontSize: 11, italic: true, color: C.accent5, isTextBox: true, margin: 0 });
S.addImage({ path: RES + "fig2_attention_heatmap_cicids2017.png", x: 0.7, y: 4.05, w: 7.5, h: 3.63 * 0.0 + 2.1 });
S.addText("(b) CICIDS2017 — attention memusat tajam", { x: 0.7, y: 6.18, w: 7.5, h: 0.3,
  fontSize: 11, italic: true, color: C.accent5, isTextBox: true, margin: 0 });
S.addText("Entropi ternormalisasi H/H maks. Mendekati 1 berarti attention tersebar merata, sehingga mekanisme seleksi praktis tidak bekerja.",
  { x: 8.4, y: 1.3, w: 4.2, h: 0.9, fontSize: 13, color: C.text1, isTextBox: true, margin: 0 });
S.addShape(pres.ShapeType.roundRect, { x: 8.4, y: 2.3, w: 4.2, h: 1.85, rectRadius: 0.1,
  fill: { color: C.background2 }, line: { color: C.background2 } });
S.addText([
  { text: "NSL-KDD · U2R\n", options: { bold: true, color: "5F7086", breakLine: true } },
  { text: "H/H maks 0,987\n", options: { fontSize: 22, bold: true, color: "5F7086", breakLine: true } },
  { text: "puncak hanya 2,1× bobot seragam — query menganggur tepat pada kelas yang menjadi alasan mekanisme ini dirancang", options: { fontSize: 12 } },
], { x: 8.7, y: 2.45, w: 3.6, h: 1.6, fontSize: 13, color: C.text1, isTextBox: true, margin: 0, valign: "top" });
S.addShape(pres.ShapeType.roundRect, { x: 8.4, y: 4.3, w: 4.2, h: 1.85, rectRadius: 0.1,
  fill: { color: "C0601F" }, line: { color: "C0601F" } });
S.addText([
  { text: "CICIDS2017 · Bot\n", options: { bold: true, color: "FFE6D2", breakLine: true } },
  { text: "H/H maks 0,678\n", options: { fontSize: 22, bold: true, color: "FFFFFF", breakLine: true } },
  { text: "puncak 20,8× bobot seragam — query benar-benar memusat, dan di sinilah ClassAttn menang", options: { fontSize: 12 } },
], { x: 8.7, y: 4.45, w: 3.6, h: 1.6, fontSize: 13, color: "FFFFFF", isTextBox: true, margin: 0, valign: "top" });
S.addText("Oranye = di atas bobot seragam, biru = di bawahnya. Baris diurutkan dari kelas terbanyak ke paling langka.",
  { x: 8.4, y: 6.3, w: 4.2, h: 0.5, fontSize: 11, italic: true, color: C.accent5, isTextBox: true, margin: 0 });
S.addNotes("Inilah bukti mekanistiknya, bukan sekadar spekulasi. Pada NSL-KDD query untuk U2R menyebar hampir merata ke 42 token, jadi hasilnya setara mean-pooling. Pada CICIDS2017 query untuk Bot memusat 20,8 kali, jadi mekanismenya benar-benar bekerja.");

// ================================================================ 21. aturan
nw("ISI", "Hasil");
S.addText("Aturan yang menggantikan klaim lama", { placeholder: "title" });
S.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 1.45, w: 11.9, h: 1.85, rectRadius: 0.12,
  fill: { color: "14223A" }, line: { color: "14223A" } });
S.addText([
  { text: "Class-query attention pooling menolong apabila, dan hanya apabila, tersedia fitur yang benar-benar diskriminatif untuk dipilih oleh query kelas tersebut.",
    options: { fontSize: 21, bold: true, color: "FFFFFF", breakLine: true, paraSpaceAfter: 8 } },
  { text: "Konsekuensi yang dapat diuji: pada dataset mana pun, manfaat mekanisme ini berbanding terbalik dengan entropi attention pada kelas minoritasnya.",
    options: { fontSize: 15, color: "8FB4DD", italic: true } },
], { x: 1.1, y: 1.65, w: 11.1, h: 1.45, isTextBox: true, margin: 0, valign: "middle" });
card(0.7, 3.6, 3.75, 2.4, "Mengapa ini lebih kuat", "Aturan bersyarat dapat diuji pada dataset ketiga oleh siapa pun. Klaim umum hanya dapat dibantah, tidak dapat dipakai.", "2060B0");
card(4.78, 3.6, 3.75, 2.4, "Melengkapi, bukan mengganti", "Tiga argumen struktural sebelumnya tetap berlaku: query tanpa insentif rebalancing, token tabular tanpa struktur spasial, dan softmax bersama.", "1C7293");
card(8.85, 3.6, 3.75, 2.4, "Keterbatasan yang diakui", "Dua dataset belum cukup untuk menggeneralisasi. Aturan ini diajukan sebagai hipotesis yang dapat diuji, bukan sebagai hukum.", "C0601F");
S.addNotes("Kalimat di kotak gelap adalah kalimat yang perlu dihafal. Kalau hanya satu kalimat yang boleh diingat audiens dari seluruh presentasi, itu kalimatnya.");

// ================================================================ 22. biaya
nw("ISI", "Hasil");
S.addText("Harga yang dibayar: biaya komputasi", { placeholder: "title" });
tabel([
  [{ text: "Model", options: HEAD }, { text: "Macro-F1 CICIDS2017", options: HEAD },
   { text: "Ukuran (MB)", options: HEAD }, { text: "Latensi (ms)", options: HEAD }],
  [{ text: "XGBoost", options: { align: "left", bold: true } },
   { text: "0,9750", options: { bold: true, color: "2060B0" } }, "2,13",
   { text: "7,10", options: { bold: true, color: "2060B0" } }],
  [{ text: "Random Forest", options: { align: "left" } }, "0,9568", "18,51", "33,50"],
  [{ text: "ClassAttn (Transformer)", options: { align: "left" } }, "0,9060",
   { text: "0,28", options: { bold: true, color: "2060B0" } }, "156,07"],
  [{ text: "Baseline (Transformer)", options: { align: "left" } }, "0,8071", "0,21",
   { text: "143,34", options: { color: "C0601F" } }],
], { y: 1.5, rowH: 0.5, colW: [4.4, 3.0, 2.25, 2.25] });
S.addShape(pres.ShapeType.roundRect, { x: 0.7, y: 4.3, w: 5.85, h: 1.9, rectRadius: 0.1,
  fill: { color: C.background2 }, line: { color: C.background2 } });
S.addText([
  { text: "Transformer menang pada ukuran\n", options: { bold: true, color: "2060B0" } },
  { text: "0,28 MB berbanding 18,51 MB untuk Random Forest — sekitar 66 kali lebih kecil. Relevan untuk deployment pada perangkat terbatas." },
], { x: 1.0, y: 4.5, w: 5.25, h: 1.5, fontSize: 14, color: C.text1, isTextBox: true, margin: 0, valign: "top" });
S.addShape(pres.ShapeType.roundRect, { x: 6.75, y: 4.3, w: 5.85, h: 1.9, rectRadius: 0.1,
  fill: { color: C.background2 }, line: { color: C.background2 } });
S.addText([
  { text: "Tetapi kalah telak pada latensi\n", options: { bold: true, color: "C0601F" } },
  { text: "XGBoost 22 kali lebih cepat dan sekaligus lebih akurat. Catatan jujur: tree ensemble dilatih pada CPU multi-core, Transformer pada GPU, sehingga waktu latihnya tidak sebanding." },
], { x: 7.05, y: 4.5, w: 5.25, h: 1.5, fontSize: 14, color: C.text1, isTextBox: true, margin: 0, valign: "top" });
S.addNotes("Jangan hindari pertanyaan ini. Posisi yang dipertahankan paper: keunggulan Transformer di sini adalah efisiensi ukuran, bukan kecepatan inferensi. Untuk deployment edge yang terbatas memori, itu tetap relevan.");

// ================================================================ 23. kesimpulan
pres.addSection({ title: "Penutup" });
nw("PENUTUP", "Penutup");
S.addText("Empat hal yang dibawa pulang", { placeholder: "title" });
const BAWA = [
  ["Loss menang, arsitektur bergantung dataset", "Adaptive focal loss satu-satunya intervensi yang arah dan signifikansinya konsisten lintas dataset, dengan biaya komputasi nyaris nol."],
  ["Satu dataset tidak cukup", "Kesimpulan yang tampak kokoh pada NSL-KDD berbalik pada CICIDS2017 dengan protokol yang persis sama."],
  ["Mekanisme menjelaskan kapan, bukan sekadar apakah", "Entropi attention memberi kriteria terukur untuk memprediksi kapan class-query attention akan menolong."],
  ["Tree ensemble belum terkalahkan di tabular", "XGBoost mengungguli seluruh konfigurasi Transformer pada CICIDS2017, dan ini dilaporkan apa adanya."],
];
BAWA.forEach(([j, d], i) => {
  const x = 0.9 + (i % 2) * 5.9, y = 1.75 + Math.floor(i / 2) * 2.3;
  S.addShape(pres.ShapeType.ellipse, { x, y, w: 0.5, h: 0.5, fill: { color: "C0601F" }, line: { color: "C0601F" } });
  S.addText(String(i + 1), { x, y, w: 0.5, h: 0.5, align: "center", valign: "middle",
    fontSize: 15, bold: true, color: "FFFFFF", isTextBox: true, margin: 0 });
  S.addText(j, { x: x + 0.7, y: y + 0.02, w: 4.7, h: 0.75, fontSize: 17, bold: true,
    color: "FFFFFF", isTextBox: true, margin: 0, valign: "top" });
  S.addText(d, { x: x + 0.7, y: y + 0.85, w: 4.7, h: 1.2, fontSize: 13, color: "8FB4DD",
    isTextBox: true, margin: 0, valign: "top" });
});
S.addText("Keterbatasan utama: dua dataset, satu konfigurasi hiperparameter, dan protokol offline — bukan deployment nyata.",
  { x: 0.9, y: 6.5, w: 11.5, h: 0.4, fontSize: 13, italic: true, color: "8FB4DD", isTextBox: true, margin: 0 });
S.addNotes("Tutup dengan butir 3. Itu kontribusi yang paling tahan terhadap kritik, karena berupa kriteria terukur yang bisa diuji orang lain.");

// ================================================================ 24. skrip 60 detik
nw("ISI", "Penutup");
S.addText("Versi 60 detik, bila hanya ada sedikit waktu", { placeholder: "title" });
const SKRIP = [
  ["0:00 – 0:15", "Masalah", "Pada dataset IDS, kelas serangan yang paling berbahaya justru paling langka — U2R hanya 0,04 persen. Akurasi tidak berguna di situasi ini."],
  ["0:15 – 0:30", "Yang dilakukan", "Kami menguji tiga cara menanganinya — data, loss, dan arsitektur — di atas satu encoder Transformer yang sama, pada dua dataset, sepuluh seed, dengan koreksi Holm."],
  ["0:30 – 0:45", "Temuan", "Hanya intervensi loss yang konsisten. Intervensi arsitektur berbalik arah: gagal di NSL-KDD, berhasil di CICIDS2017."],
  ["0:45 – 1:00", "Mengapa", "Entropi attention menjelaskannya. Mekanisme itu hanya bekerja bila kelas minoritasnya punya fitur yang benar-benar diskriminatif untuk dipilih. Itu aturan yang bisa diuji orang lain."],
];
SKRIP.forEach(([t, j, d], i) => {
  const y = 1.45 + i * 1.28;
  S.addShape(pres.ShapeType.roundRect, { x: 0.7, y, w: 11.9, h: 1.1, rectRadius: 0.08,
    fill: { color: i % 2 ? C.background1 : C.background2 },
    line: { color: C.background2 }, objectName: `skrip${i}` });
  S.addText(t, { x: 1.0, y: y + 0.15, w: 1.3, h: 0.35, fontSize: 12, bold: true,
    color: "C0601F", isTextBox: true, margin: 0 });
  S.addText(j, { x: 1.0, y: y + 0.52, w: 1.6, h: 0.35, fontSize: 14, bold: true,
    color: "2060B0", isTextBox: true, margin: 0 });
  S.addText(d, { x: 2.75, y: y + 0.17, w: 9.55, h: 0.8, fontSize: 14, color: C.text1,
    valign: "middle", isTextBox: true, margin: 0 });
});
S.addText("Catatan presenter lengkap tersedia pada setiap slide deck ini.",
  { x: 0.7, y: 6.45, w: 11.9, h: 0.35, fontSize: 12, italic: true, color: C.accent5, isTextBox: true, margin: 0 });
S.addNotes("Latih versi ini sampai lancar. Dalam sesi tanya jawab atau perkenalan singkat, biasanya hanya ini yang sempat disampaikan.");

(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log("tersimpan:", OUT);
})();
