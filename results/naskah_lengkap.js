// Membangun naskah lengkap: judul, abstrak, Bab I sampai V, dan daftar pustaka.
//
// Bab I sampai III diambil dari naskah lama hasil parse (blok_bab123.json) lalu
// disunting pada titik-titik yang memang berubah, sehingga tidak ada paragraf
// yang hilang akibat pengetikan ulang. Bab IV dan V ditulis ulang sepenuhnya.
const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, AlignmentType } = require("docx");
const H = require("./helpers_docx");
const babIV = require("./konten_bab4");
const { p, h1, h2, caption, note, equation, figure, algoBox, table } = H;

const SP = process.argv[2];
const OUT = process.argv[3];
const blocks = JSON.parse(fs.readFileSync(`${SP}/blok_bab123.json`, "utf8"));
const refs = JSON.parse(fs.readFileSync(`${SP}/refs.json`, "utf8"));

// ---------------------------------------------------------------- penyuntingan
function setP(i, text) {
  if (blocks[i].t !== "p") throw new Error(`blok ${i} bukan paragraf`);
  blocks[i] = { t: "p", s: text };
}

// --- Bab I: kontribusi dan paragraf penutup
setP(8,
  "2) Bukti empiris bahwa efektivitas penanganan pada tataran arsitektur bergantung " +
  "pada dataset. Class-query attention pooling tidak memberikan perbaikan apa pun pada " +
  "NSL-KDD, dengan p terkoreksi tepat 1,0000 pada keempat metrik, namun mengungguli " +
  "baseline secara signifikan pada CICIDS2017. Klaim umum bahwa mekanisme ini tidak " +
  "berpindah dari domain visual ke IDS tabular karena itu tidak dapat dipertahankan, " +
  "dan digantikan oleh rumusan yang lebih tepat beserta penjelasan mekanismenya.");
setP(9,
  "3) Penjelasan mekanistik atas kebergantungan tersebut melalui entropi bobot atensi. " +
  "Pada NSL-KDD, kelas paling langka justru memiliki atensi paling seragam, sehingga " +
  "query khusus kelas praktis menganggur tepat pada kelas yang menjadi alasan mekanisme " +
  "itu dirancang. Pada CICIDS2017 keadaannya berkebalikan. Rumusan yang dihasilkan " +
  "bersifat dapat diuji: manfaat mekanisme ini berbanding terbalik dengan entropi " +
  "atensi pada kelas minoritasnya.");
blocks.splice(10, 0, { t: "p", s:
  "4) Pelaporan yang disertai uji signifikansi pada sepuluh seed dengan koreksi " +
  "Holm-Bonferroni atas dua puluh empat uji, analisis stabilitas antar seed, serta " +
  "pengukuran biaya komputasi berupa jumlah parameter, FLOPs, ukuran model, dan " +
  "latensi, sehingga efektivitas tiap strategi dapat dinilai bersama harganya." });
setP(11,
  "Temuan yang berlawanan arah antar dataset dilaporkan apa adanya, termasuk kenyataan " +
  "bahwa pada CICIDS2017 tidak satu pun konfigurasi Transformer yang mengungguli " +
  "XGBoost. Publikasi yang hanya memuat hasil yang menguntungkan hipotesis awal membuat " +
  "peneliti lain mengulang jalur yang sudah terbukti buntu, dan pada bidang dengan " +
  "banyak mekanisme yang dipindahkan antar domain, informasi mengenai batas keberlakuan " +
  "suatu mekanisme memiliki nilai praktis yang setara dengan bukti keberhasilannya.");

// --- Bab III-A: catatan setelah Algoritma 1 (menghapus klaim seleksi bobot terbaik)
const iAlgo1 = blocks.findIndex((b) => b.t === "algo" && b.lines[0].startsWith("Algoritma 1"));
blocks[iAlgo1].lines = blocks[iAlgo1].lines.map((l) => {
  if (l.startsWith("13:")) return "13: f* ← Latih(f, D_s, ℓ, E) ▷ E epoch tetap; tanpa seleksi pada D_uji";
  if (l.startsWith("18:")) return "18: T[s_a, s_b] ← WilcoxonBerpasangan(M[s_a], M[s_b]) ▷ Pers. (18)";
  if (l.trim() === "(18)") return null;
  if (l.startsWith("19:")) return "19: end for";
  if (l.startsWith("20:")) return "20: T ← KoreksiHolmBonferroni(T) ▷ family-wise error rate";
  return l;
}).filter(Boolean).concat(["21: return M, T"]);

setP(iAlgo1 - 1,
  "Prosedur perbandingan diformalkan pada Algoritma 1. Yang perlu ditekankan, algoritma " +
  "ini bukan metode klasifikasi baru, melainkan protokol evaluasi yang memastikan " +
  "seluruh strategi memperoleh perlakuan setara. Tiga hal dijaga secara eksplisit: seed " +
  "disamakan antar strategi pada setiap pengulangan sehingga inisialisasi dan urutan " +
  "batch identik, praproses dihitung sekali di luar loop sehingga tidak ada strategi " +
  "yang memperoleh data berbeda, dan seluruh strategi dilatih dengan jumlah epoch yang " +
  "sama persis.");
setP(iAlgo1 + 1,
  "Fungsi Latih pada baris 13 melatih model sejumlah epoch tetap dan mengembalikan " +
  "bobot pada akhir pelatihan. Tidak ada pemilihan bobot terbaik berdasarkan performa " +
  "pada data uji. Pemilihan semacam itu merupakan bentuk kebocoran data uji yang " +
  "membuat seluruh angka yang dilaporkan bias optimistis, dan karena itu sengaja " +
  "dihindari meskipun lazim dijumpai pada implementasi serupa.");

// --- Bab III-B: dataset
const iDataset = blocks.findIndex((b) => b.t === "h2" && b.s.startsWith("B. Dataset"));
blocks[iDataset + 1] = { t: "p", s:
  "NSL-KDD dipetakan ke lima kategori: Normal, DoS, Probe, R2L, dan U2R. Distribusi " +
  "data latihnya sangat timpang, dengan Normal 53,46 persen, DoS 36,46 persen, Probe " +
  "9,25 persen, R2L 0,79 persen, dan U2R 0,04 persen. Dataset dipakai dalam bentuk " +
  "aslinya, yaitu 125.973 baris data latih dan 42 token masukan yang terdiri atas 41 " +
  "fitur beserta satu token CLS." };
blocks.splice(iDataset + 2, 0,
  { t: "p", s:
    "CICIDS2017 dipetakan ke sembilan kategori dan memuat 2.520.798 baris setelah " +
    "penghapusan nilai takhingga dan duplikat. Data diperoleh dari mirror publik atas " +
    "rilis resmi MachineLearningCVE dari Canadian Institute for Cybersecurity, dengan " +
    "delapan berkas harian yang ukurannya identik dengan rilis aslinya." },
  { t: "p", s:
    "Agar waktu komputasi tetap wajar tanpa menghilangkan kelas langka, setiap kelas " +
    "pada CICIDS2017 dibatasi maksimum 50.000 baris sedangkan kelas yang jumlahnya di " +
    "bawah batas dibiarkan utuh. Sampling proporsional sengaja tidak dipakai: dengan " +
    "Heartbleed hanya berjumlah 11 baris dan Infiltration 36 baris, pengambilan " +
    "sebagian kecil secara proporsional akan menyisakan satu atau dua baris saja dan " +
    "membuat pembagian stratified gagal, sehingga justru menghapus kelas yang menjadi " +
    "objek penelitian ini. Hasil pembatasan tersebut adalah 213.288 baris, 159.966 " +
    "baris data latih, 53.322 baris data uji, dan 79 token masukan. Konsekuensinya " +
    "rasio ketidakseimbangan turun dari sekitar 190.000:1 menjadi 4.545:1; angka itu " +
    "tetap jauh lebih ekstrem daripada NSL-KDD, namun perubahannya dinyatakan terbuka " +
    "karena memengaruhi interpretasi hasil." },
  { t: "p", s:
    "Dua kelas minoritas yang menjadi fokus evaluasi dipilih secara otomatis sebagai " +
    "dua kelas terlangka yang memiliki sekurang-kurangnya 50 sampel uji. Ambang ini " +
    "diperlukan karena F1 yang dihitung atas segelintir sampel bersifat terkuantisasi " +
    "dan berayun liar antar seed, sehingga uji statistik atasnya mengukur derau " +
    "alih-alih perbedaan metode. Pada NSL-KDD terpilih U2R dan R2L; pada CICIDS2017 " +
    "terpilih Bot dan WebAttack, sedangkan Heartbleed dan Infiltration dikecualikan " +
    "dari metrik utama dan dibahas secara kualitatif. Praproses selebihnya identik " +
    "pada kedua dataset: normalisasi fitur numerik, encoding fitur kategorikal, " +
    "penghapusan duplikasi dan nilai takhingga, serta pembagian stratified." });

// --- Bab III-H: jumlah seed dan koreksi multiple comparison
const iGmean = blocks.findIndex((b) => b.t === "p" && b.s.startsWith("G-mean dipilih berdampingan"));
blocks[iGmean] = { t: "p", s:
  "G-mean dipilih berdampingan dengan macro-F1 karena bernilai rendah apabila terdapat " +
  "satu saja kelas dengan recall buruk, sehingga lebih peka terhadap kegagalan pada " +
  "kelas langka. Setiap konfigurasi dijalankan pada sepuluh seed acak dan perbedaannya " +
  "diuji dengan Wilcoxon signed-rank test pada Persamaan (18), mengikuti rekomendasi " +
  "Demšar [46]." };
blocks.splice(iGmean + 2, 0, { t: "p", s:
  "Jumlah seed ditetapkan sepuluh, bukan enam sebagaimana lazim dijumpai, karena " +
  "koreksi multiple comparison diterapkan. Tiga perbandingan berpasangan diuji pada " +
  "empat metrik sehingga terdapat dua belas uji per dataset; tanpa koreksi, peluang " +
  "memperoleh sekurang-kurangnya satu hasil signifikan palsu mencapai sekitar 46 " +
  "persen. Koreksi Holm-Bonferroni dipilih dibandingkan Bonferroni biasa karena " +
  "menolak lebih banyak hipotesis null yang benar-benar salah sambil tetap " +
  "mengendalikan family-wise error rate pada taraf yang sama. Pada Wilcoxon dua sisi " +
  "dengan n = 6 nilai p terkecil yang dapat dicapai adalah 0,031 sehingga hampir tidak " +
  "ada hasil yang mampu bertahan setelah koreksi, sedangkan pada n = 10 nilai itu " +
  "turun menjadi 0,002. Seluruh nilai p yang dilaporkan pada Bagian IV adalah nilai " +
  "terkoreksi." });

// --- Bab III-I: tambahkan definisi entropi atensi (Persamaan 22)
const iEq21 = blocks.findIndex((b) => b.t === "eq" && b.n === 21);
blocks.splice(iEq21 + 1, 0,
  { t: "p", s:
    "Agar pola atensi dapat dibandingkan antar kelas maupun antar dataset yang jumlah " +
    "tokennya berbeda, distribusi bobot tiap kelas diringkas sebagai entropi " +
    "ternormalisasi pada Persamaan (22), dengan N jumlah token. Nilai mendekati 1 " +
    "berarti atensi tersebar hampir merata sehingga mekanisme seleksi praktis tidak " +
    "bekerja, sedangkan nilai yang jauh di bawah 1 berarti query kelas benar-benar " +
    "memusatkan perhatian pada sejumlah kecil fitur. Besaran ini yang dipakai pada " +
    "Bagian IV-E untuk menjelaskan mengapa penanganan tataran arsitektur berhasil pada " +
    "satu dataset namun tidak pada dataset lain." },
  { t: "eq", n: 22 });

// --- Bab III-J: paragraf penutup reproduktibilitas
const iRepro = blocks.findIndex((b) => b.t === "p" && b.s.startsWith("Repositori tersebut berisi"));
blocks[iRepro] = { t: "p", s:
  "Repositori tersebut berisi notebook tunggal yang dapat langsung dibuka pada Google " +
  "Colaboratory dan dijalankan berurutan dari sel pertama. Dataset NSL-KDD diunduh " +
  "otomatis dari mirror publik saat notebook dijalankan, sementara CICIDS2017 diunduh " +
  "melalui Kaggle API sehingga pengguna perlu menyediakan berkas kredensial Kaggle " +
  "miliknya sendiri. Pemilihan dataset dikendalikan satu variabel pada sel pertama, dan " +
  "berkas keluaran diberi akhiran nama dataset agar hasil kedua eksperimen tidak saling " +
  "menimpa. Seed acak, hyperparameter, dan urutan eksekusi ditetapkan di dalam notebook " +
  "sebagaimana dilaporkan pada artikel ini, sehingga seluruh angka, tabel, dan gambar " +
  "pada Bagian IV dapat diproduksi ulang. Penyediaan kode secara terbuka ini penting " +
  "mengingat sebagian temuan artikel ini berlawanan arah antar dataset; klaim semacam " +
  "itu hanya dapat diperiksa apabila implementasinya dapat ditelaah langsung oleh " +
  "pembaca." };

// ---------------------------------------------------------------- render blok
function renderBlocks(bs) {
  const out = [];
  for (const b of bs) {
    if (b.t === "h1") out.push(h1(b.s.toUpperCase()));
    else if (b.t === "h2") out.push(h2(b.s));
    else if (b.t === "p") out.push(p(b.s));
    else if (b.t === "caption") out.push(caption(b.s));
    else if (b.t === "eq") out.push(equation(b.n));
    else if (b.t === "algo") out.push(algoBox(b.lines), p("", { after: 120 }));
    else if (b.t === "figplaceholder")
      out.push(figure("/mnt/user-data/outputs/gambar_persamaan/fig1_flowchart_v3.png", 2.375));
  }
  return out;
}

// ---------------------------------------------------------------- bagian depan
const front = [];
front.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200, line: 276 },
  children: [new TextRun({
    text: "A Controlled Evaluation of Class Imbalance Handling Strategies in " +
          "Transformer-Based Intrusion Detection Systems: Comparing Loss-, " +
          "Architecture-, and Data-Level Approaches Across Two Benchmark Datasets",
    bold: true, size: 30, font: H.FONT })],
}));
front.push(p("NAMA PENULIS1, NAMA PENULIS2, (Member, IEEE)",
             { align: AlignmentType.CENTER, bold: true, after: 60 }));
front.push(p("1Departemen/Fakultas, Universitas Airlangga, Surabaya 60115, Indonesia",
             { align: AlignmentType.CENTER, size: 18, after: 60 }));
front.push(p("Corresponding author: Nama Penulis (e-mail: penulis@unair.ac.id).",
             { align: AlignmentType.CENTER, size: 18, after: 60 }));
front.push(p("Penelitian ini didukung sebagian oleh [sumber pendanaan dan nomor hibah, " +
             "atau hapus bila tidak ada].", { align: AlignmentType.CENTER, size: 18, after: 60 }));
front.push(p("Kode dan notebook eksperimen tersedia terbuka pada " +
             "https://github.com/azizmnasrul/lightweight_transformer_ids_minority_class",
             { align: AlignmentType.CENTER, size: 18, after: 240 }));

front.push(new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 160, line: 276 },
  children: [
    new TextRun({ text: "ABSTRAK  ", bold: true, size: 22, font: H.FONT }),
    new TextRun({ size: 22, font: H.FONT, text:
      "Ketidakseimbangan kelas pada intrusion detection system (IDS) dapat ditangani " +
      "pada tiga tataran: fungsi loss, arsitektur model, atau distribusi data. " +
      "Literatur mengembangkan ketiganya secara terpisah, sehingga belum jelas tataran " +
      "mana yang paling efektif dan berapa biaya komputasi yang menyertainya. Artikel " +
      "ini membandingkan keempat strategi tersebut di bawah protokol identik di atas " +
      "encoder Transformer yang sama, pada NSL-KDD dan CICIDS2017, dengan sepuluh seed " +
      "acak, uji Wilcoxon signed-rank, dan koreksi Holm-Bonferroni atas dua puluh empat " +
      "uji. Penanganan pada tataran loss merupakan satu-satunya yang arah dan " +
      "signifikansinya konsisten lintas dataset, menaikkan G-mean sebesar 0,4685 pada " +
      "NSL-KDD dan 0,5591 pada CICIDS2017. Sebaliknya, penanganan pada tataran " +
      "arsitektur terbukti bergantung pada dataset: class-query attention pooling tidak " +
      "memberikan perbaikan apa pun pada NSL-KDD, namun mengungguli baseline secara " +
      "signifikan pada CICIDS2017. Analisis entropi bobot atensi menjelaskan sebabnya. " +
      "Pada NSL-KDD, kelas paling langka justru memiliki atensi paling seragam, sehingga " +
      "query khusus kelas menganggur tepat pada kelas yang menjadi alasan mekanisme itu " +
      "dirancang; pada CICIDS2017 keadaannya berkebalikan. Penambahan atensi di atas " +
      "focal loss tidak memberikan peningkatan signifikan pada dataset mana pun. " +
      "Dilaporkan pula bahwa pada CICIDS2017 tidak satu pun konfigurasi Transformer " +
      "mengungguli XGBoost, dan bahwa cross-entropy tanpa penanganan menghasilkan " +
      "variansi antar seed yang sebanding dengan reratanya." }),
  ],
}));
front.push(new Paragraph({
  alignment: AlignmentType.JUSTIFIED,
  spacing: { after: 240, line: 276 },
  children: [
    new TextRun({ text: "KATA KUNCI  ", bold: true, size: 22, font: H.FONT }),
    new TextRun({ size: 22, font: H.FONT, text:
      "Attention mechanism, class imbalance, cost-sensitive learning, focal loss, " +
      "intrusion detection, network security, transformer." }),
  ],
}));

// ---------------------------------------------------------------- Bab V
const babV = [];
babV.push(h1("V. KESIMPULAN"));
babV.push(p(
  "Artikel ini membandingkan tiga tataran penanganan ketidakseimbangan kelas pada IDS " +
  "berbasis Transformer di bawah protokol identik, pada dua dataset, dengan sepuluh " +
  "seed dan koreksi Holm-Bonferroni."));
babV.push(p(
  "Penanganan pada tataran loss merupakan satu-satunya intervensi yang arah maupun " +
  "signifikansinya konsisten lintas dataset. Adaptive focal loss menaikkan G-mean " +
  "sebesar 0,4685 pada NSL-KDD dan 0,5591 pada CICIDS2017, keduanya bertahan setelah " +
  "koreksi, tanpa menambah biaya komputasi sama sekali. Namun konsistensi itu hanya " +
  "berlaku pada G-mean: pada CICIDS2017 focal loss justru menurunkan macro-F1 dan " +
  "menurunkan F1 kelas Bot sebesar 0,1852 secara signifikan. Intervensi ini karena itu " +
  "bukan tanpa risiko, melainkan menukar presisi kelas minoritas dengan recall-nya."));
babV.push(p(
  "Penanganan pada tataran arsitektur terbukti bergantung pada dataset. Class-query " +
  "attention pooling tidak memberikan perbaikan apa pun pada NSL-KDD, dengan p " +
  "terkoreksi tepat 1,0000 pada keempat metrik dan selisih yang praktis nol, namun " +
  "mengungguli baseline secara signifikan pada CICIDS2017. Klaim umum bahwa mekanisme " +
  "ini tidak berpindah dari domain multi-label visual ke IDS tabular karena itu tidak " +
  "dapat dipertahankan."));
babV.push(p(
  "Analisis entropi bobot atensi menjelaskan kebergantungan tersebut. Mekanisme ini " +
  "menolong apabila, dan hanya apabila, tersedia fitur yang benar-benar diskriminatif " +
  "bagi kelas minoritas untuk dipilih. NSL-KDD tidak menyediakannya untuk U2R sehingga " +
  "query hanya merata-ratakan seluruh token dan hasilnya setara mean-pooling; " +
  "CICIDS2017 menyediakannya untuk Bot sehingga query dapat memusat. Rumusan ini " +
  "bersifat dapat diuji pada dataset lain."));
babV.push(p(
  "Dua temuan tambahan perlu dicatat. Pertama, pada CICIDS2017 tidak satu pun " +
  "konfigurasi Transformer mengungguli XGBoost, yang mencapai macro-F1 0,9750 dan " +
  "G-mean 0,9853 dengan latensi 22 kali lebih cepat. Kedua, cross-entropy tanpa " +
  "penanganan menghasilkan variansi antar seed yang sebanding dengan reratanya, " +
  "sehingga manfaat intervensi tidak hanya terletak pada peningkatan rerata melainkan " +
  "juga pada reproduksibilitas."));
babV.push(p(
  "Implikasi praktisnya, upaya perancangan pada IDS dengan data timpang sebaiknya " +
  "diprioritaskan pada fungsi objektif, dengan metrik yang dipilih sesuai biaya " +
  "kesalahan yang sebenarnya; G-mean lebih relevan apabila serangan yang lolos jauh " +
  "lebih mahal daripada alarm palsu. Mekanisme atensi berbasis query kelas hanya layak " +
  "dipertimbangkan setelah dipastikan bahwa kelas minoritas pada dataset yang " +
  "bersangkutan memang memiliki fitur penciri yang kuat."));
babV.push(p(
  "Pengembangan lanjutan mencakup pengujian ulang CICIDS2017 tanpa fitur " +
  "min_seg_size_forward untuk memastikan keunggulan tataran arsitektur bukan hasil " +
  "shortcut learning, verifikasi pada rasio ketidakseimbangan penuh tanpa pembatasan " +
  "jumlah baris per kelas, pengujian pada perangkat keras fisik, serta penerapan " +
  "kerangka entropi atensi ini pada dataset IDS yang lebih mutakhir."));
babV.push(p(
  "Seluruh kode dan notebook eksperimen tersedia terbuka pada repositori yang " +
  "disebutkan pada Bagian III-J, sehingga seluruh temuan pada artikel ini, termasuk " +
  "yang berlawanan arah antar dataset, dapat diperiksa dan direplikasi secara langsung."));

// ---------------------------------------------------------------- daftar pustaka
const bib = [h1("REFERENSI")];
for (const r of refs) {
  bib.push(new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 60, line: 240 },
    children: [new TextRun({ text: r, size: 18, font: H.FONT })],
  }));
}
bib.push(p("", { after: 200 }));
bib.push(note(
  "CATATAN EDITORIAL (hapus sebelum submit). 1) Naskah berbahasa Indonesia sebagai " +
  "kerangka penulisan; IEEE Access mensyaratkan bahasa Inggris. 2) Salin konten ke " +
  "template Word resmi IEEE Access dari IEEE Author Center. 3) Foto dan biografi " +
  "penulis wajib dan belum disertakan. 4) Verifikasi nomor volume, halaman, dan DOI " +
  "seluruh referensi ke halaman penerbit. 5) Referensi [32] sangat dekat dengan " +
  "penelitian ini pada sisi protokol; pembedaannya sudah dinyatakan pada Bagian II-C5 " +
  "dan sebaiknya diulang singkat pada pembahasan. 6) Tambahkan rujukan untuk kecurigaan " +
  "terhadap fitur min_seg_size_forward sebagai artefak CICIDS2017 pada Bagian IV-G."));

// ---------------------------------------------------------------- rakit dokumen
const children = [
  ...front,
  ...renderBlocks(blocks),
  ...babIV(H),
  ...babV,
  ...bib,
];

const doc = new Document({
  styles: { default: { document: { run: { font: H.FONT, size: 22 } } } },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  console.log("tersimpan:", OUT, (buf.length / 1024).toFixed(0), "KB |", children.length, "blok");
});
