// Membangun Bab IV (Hasil dan Pembahasan) sebagai dokumen Word tersendiri.
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, ShadingType, HeadingLevel,
} = require("docx");

const FONT = "Times New Roman";
const W = 9360;                      // lebar kolom teks (DXA) pada kertas Letter, margin 1 inci

const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const LINE = { style: BorderStyle.SINGLE, size: 6, color: "000000" };

function p(text, opt = {}) {
  const { bold = false, italics = false, size = 22, align = AlignmentType.JUSTIFIED,
          before = 0, after = 120, indent = 0 } = opt;
  return new Paragraph({
    alignment: align,
    spacing: { before, after, line: 276 },
    indent: indent ? { firstLine: indent } : undefined,
    children: [new TextRun({ text, bold, italics, size, font: FONT })],
  });
}

// Paragraf dengan penggalan tebal, mis. rich([["Δ = ", false], ["+0,0988", true]])
function rich(parts, opt = {}) {
  const { size = 22, align = AlignmentType.JUSTIFIED, after = 120, indent = 0 } = opt;
  return new Paragraph({
    alignment: align,
    spacing: { after, line: 276 },
    indent: indent ? { firstLine: indent } : undefined,
    children: parts.map(([t, b, i]) =>
      new TextRun({ text: t, bold: !!b, italics: !!i, size, font: FONT })),
  });
}

function h1(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 360, after: 200 },
    children: [new TextRun({ text, bold: true, size: 24, font: FONT })],
  });
}

function h2(text) {
  return new Paragraph({
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, bold: true, italics: true, size: 22, font: FONT })],
  });
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, size: 18, font: FONT })],
  });
}

function note(text) {
  return new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { before: 80, after: 200 },
    children: [new TextRun({ text, size: 18, italics: true, font: FONT })],
  });
}

function cell(text, width, { bold = false, align = AlignmentType.CENTER, shade = null,
                             top = NONE, bottom = NONE } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    borders: { top, bottom, left: NONE, right: NONE },
    shading: shade ? { type: ShadingType.CLEAR, fill: shade, color: "auto" } : undefined,
    children: [new Paragraph({
      alignment: align,
      spacing: { after: 0, line: 240 },
      children: [new TextRun({ text, bold, size: 18, font: FONT })],
    })],
  });
}

// rows: array of {cells:[...], head:bool, first:bool, last:bool}
function table(widths, rows) {
  return new Table({
    columnWidths: widths,
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    rows: rows.map((r) => new TableRow({
      tableHeader: !!r.head,
      children: r.cells.map((c, i) => {
        const txt = Array.isArray(c) ? c[0] : c;
        const al = Array.isArray(c) && c[1] ? c[1] : (i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER);
        return cell(txt, widths[i], {
          bold: !!r.head,
          align: al,
          top: r.first ? LINE : (r.head ? NONE : NONE),
          bottom: r.head || r.last ? LINE : NONE,
        });
      }),
    })),
  });
}

// ---------------------------------------------------------------- isi bab
const body = [];

body.push(h1("IV. HASIL DAN PEMBAHASAN"));

// ---- A
body.push(h2("A. Protokol Eksperimen"));
body.push(p(
  "Seluruh hasil pada bagian ini diperoleh dari sepuluh seed acak (42 sampai 51) " +
  "dengan protokol yang identik pada kedua dataset: lima belas epoch tetap, " +
  "d_model 64, empat attention head, dan dua lapis encoder. Tidak ada seleksi model " +
  "yang dilakukan di atas data uji. Setiap model dilatih sejumlah epoch tetap dan " +
  "dievaluasi satu kali pada akhir pelatihan, sehingga bobot yang dilaporkan bukan " +
  "bobot terbaik yang dipilih berdasarkan performa uji. Pemilihan epoch terbaik " +
  "berdasarkan metrik uji merupakan bentuk kebocoran data uji yang membuat seluruh " +
  "angka bias optimistis, dan karena itu sengaja dihindari."));
body.push(p(
  "NSL-KDD digunakan dalam bentuk aslinya: lima kelas, 125.973 baris data latih, " +
  "dan 42 token masukan yang terdiri atas 41 fitur beserta satu token [CLS]. " +
  "CICIDS2017 memuat 2.520.798 baris setelah pembersihan nilai takhingga dan duplikat. " +
  "Agar waktu komputasi tetap wajar tanpa menghilangkan kelas langka, setiap kelas " +
  "dibatasi maksimum 50.000 baris sedangkan kelas yang jumlahnya di bawah batas " +
  "dibiarkan utuh. Hasilnya adalah 213.288 baris, sembilan kelas, 159.966 baris data " +
  "latih, dan 79 token masukan. Pembatasan ini menurunkan rasio ketidakseimbangan dari " +
  "sekitar 190.000:1 menjadi 4.545:1; angka tersebut tetap jauh lebih ekstrem daripada " +
  "NSL-KDD, namun perubahannya dinyatakan di sini secara terbuka karena memengaruhi " +
  "interpretasi hasil."));
body.push(p(
  "Dua kelas minoritas yang menjadi fokus evaluasi dipilih secara otomatis sebagai dua " +
  "kelas terlangka yang memiliki sekurang-kurangnya 50 sampel uji. Pada NSL-KDD " +
  "terpilih U2R dan R2L. Pada CICIDS2017 terpilih Bot dan WebAttack, sedangkan " +
  "Heartbleed dan Infiltration dikecualikan dari metrik utama karena masing-masing " +
  "hanya menyisakan tiga dan sembilan sampel uji setelah pemisahan data. F1 yang " +
  "dihitung atas tiga sampel bersifat terkuantisasi dan berayun liar antar seed, " +
  "sehingga uji statistik atasnya akan mengukur derau alih-alih perbedaan metode. " +
  "Kedua kelas tersebut tetap dibahas secara kualitatif pada Bagian G."));

// ---- B
body.push(h2("B. Perbandingan Antar Tataran pada Dua Dataset"));
body.push(p(
  "Tabel 1 dan Tabel 2 menyajikan studi ablasi 2×2 yang memisahkan pengaruh tataran " +
  "loss dari tataran arsitektur. Empat konfigurasi dibandingkan: Baseline " +
  "(mean-pooling dengan cross-entropy), Attn-only (class-specific attention pooling " +
  "dengan cross-entropy), Focal-only (mean-pooling dengan adaptive focal loss), dan " +
  "Full (gabungan keduanya)."));

body.push(caption("Tabel 1. Studi ablasi pada NSL-KDD (rerata ± simpangan baku, 10 seed)"));
body.push(table([2200, 1790, 1790, 1790, 1790], [
  { head: true, first: true, cells: ["Konfigurasi", "Macro-F1", "G-mean", "F1 (U2R)", "F1 (R2L)"] },
  { cells: ["Focal-only", "0,6068 ± 0,0215", "0,6239 ± 0,0298", "0,1508 ± 0,0542", "0,4075 ± 0,0541"] },
  { cells: ["Full (Attn+Focal)", "0,6027 ± 0,0113", "0,6358 ± 0,0251", "0,1471 ± 0,0260", "0,4083 ± 0,0575"] },
  { cells: ["Baseline", "0,5500 ± 0,0213", "0,1554 ± 0,1466", "0,0390 ± 0,0612", "0,2654 ± 0,0819"] },
  { last: true, cells: ["Attn-only", "0,5426 ± 0,0145", "0,1669 ± 0,1315", "0,0302 ± 0,0407", "0,2502 ± 0,0564"] },
]));
body.push(note("Diurutkan menurut macro-F1."));

body.push(caption("Tabel 2. Studi ablasi pada CICIDS2017 (rerata ± simpangan baku, 10 seed)"));
body.push(table([2200, 1790, 1790, 1790, 1790], [
  { head: true, first: true, cells: ["Konfigurasi", "Macro-F1", "G-mean", "F1 (Bot)", "F1 (WebAttack)"] },
  { cells: ["Attn-only", "0,9060 ± 0,0190", "0,8783 ± 0,0276", "0,8590 ± 0,0241", "0,9344 ± 0,0024"] },
  { cells: ["Baseline", "0,8071 ± 0,0825", "0,3856 ± 0,3610", "0,8053 ± 0,0482", "0,8564 ± 0,2368"] },
  { cells: ["Full (Attn+Focal)", "0,7647 ± 0,0194", "0,9471 ± 0,0061", "0,6304 ± 0,0283", "0,7534 ± 0,0645"] },
  { last: true, cells: ["Focal-only", "0,7391 ± 0,0231", "0,9446 ± 0,0117", "0,6201 ± 0,0359", "0,7611 ± 0,0450"] },
]));
body.push(note("Diurutkan menurut macro-F1."));

body.push(p(
  "Kedua tabel memperlihatkan urutan peringkat yang hampir berkebalikan. Pada NSL-KDD, " +
  "dua konfigurasi teratas adalah yang memuat focal loss, sedangkan Attn-only justru " +
  "menempati posisi terbawah, di bawah baseline. Pada CICIDS2017, Attn-only menempati " +
  "posisi teratas pada macro-F1 dengan selisih hampir 0,1 di atas baseline, sementara " +
  "kedua konfigurasi ber-focal loss justru berada di posisi terbawah."));
body.push(p(
  "Namun pembalikan tersebut tidak berlaku pada semua metrik. Pada G-mean, arah " +
  "pengaruh focal loss tetap konsisten di kedua dataset dan besarnya mencolok: dari " +
  "0,1554 menjadi 0,6239 pada NSL-KDD, dan dari 0,3856 menjadi 0,9446 pada CICIDS2017. " +
  "Dengan kata lain, focal loss secara konsisten memperbaiki keseimbangan deteksi " +
  "lintas kelas, tetapi pada CICIDS2017 perbaikan tersebut dibayar dengan penurunan " +
  "macro-F1 dan F1 kelas minoritas. Perbedaan arah antara G-mean dan macro-F1 ini " +
  "menjadi salah satu temuan utama artikel dan dibahas lebih lanjut pada Bagian F."));

// ---- C
body.push(h2("C. Uji Signifikansi dengan Koreksi Multiple Comparison"));
body.push(p(
  "Tiga perbandingan berpasangan diuji pada empat metrik, sehingga terdapat dua belas " +
  "uji per dataset. Tanpa koreksi, peluang memperoleh sekurang-kurangnya satu hasil " +
  "signifikan palsu pada dua belas uji independen mencapai sekitar 46 persen. Karena " +
  "itu koreksi Holm-Bonferroni diterapkan sejak awal dan nilai p terkoreksi inilah yang " +
  "dilaporkan. Holm-Bonferroni dipilih dibandingkan Bonferroni biasa karena menolak " +
  "lebih banyak hipotesis null yang benar-benar salah sambil tetap mengendalikan " +
  "family-wise error rate pada taraf yang sama. Uji yang digunakan adalah Wilcoxon " +
  "signed-rank berpasangan per seed; pada n = 10, nilai p terkecil yang dapat dicapai " +
  "adalah 0,002, sehingga masih tersedia ruang bagi hasil untuk bertahan setelah koreksi."));

body.push(caption("Tabel 3. Uji Wilcoxon signed-rank berpasangan dengan koreksi Holm-Bonferroni (n = 10 seed)"));
body.push(table([2560, 1500, 1300, 1300, 1300, 1400], [
  { head: true, first: true, cells: ["Perbandingan", "Metrik", "Δ", "p mentah", "p Holm", "Signifikan"] },
  { cells: [["NSL-KDD", AlignmentType.LEFT], "", "", "", "", ""] },
  { cells: ["Focal-only vs Baseline", "Macro-F1", "+0,0568", "0,0020", "0,0234", "ya"] },
  { cells: ["Focal-only vs Baseline", "G-mean", "+0,4685", "0,0020", "0,0234", "ya"] },
  { cells: ["Focal-only vs Baseline", "F1 (U2R)", "+0,1118", "0,0039", "0,0391", "ya"] },
  { cells: ["Focal-only vs Baseline", "F1 (R2L)", "+0,1420", "0,0059", "0,0527", "tidak"] },
  { cells: ["Attn-only vs Baseline", "keempat metrik", "−0,0152 … +0,0115", "0,56 … 1,00", "1,0000", "tidak"] },
  { cells: ["Full vs Focal-only", "keempat metrik", "−0,0041 … +0,0119", "0,28 … 0,92", "1,0000", "tidak"] },
  { cells: [["CICIDS2017", AlignmentType.LEFT], "", "", "", "", ""] },
  { cells: ["Attn-only vs Baseline", "Macro-F1", "+0,0988", "0,0020", "0,0234", "ya"] },
  { cells: ["Attn-only vs Baseline", "G-mean", "+0,4928", "0,0020", "0,0234", "ya"] },
  { cells: ["Attn-only vs Baseline", "F1 (Bot)", "+0,0537", "0,0137", "0,1094", "tidak"] },
  { cells: ["Attn-only vs Baseline", "F1 (WebAttack)", "+0,0780", "0,9219", "1,0000", "tidak"] },
  { cells: ["Focal-only vs Baseline", "Macro-F1", "−0,0680", "0,0488", "0,3418", "tidak"] },
  { cells: ["Focal-only vs Baseline", "G-mean", "+0,5591", "0,0020", "0,0234", "ya"] },
  { cells: ["Focal-only vs Baseline", "F1 (Bot)", "−0,1852", "0,0020", "0,0234", "ya"] },
  { cells: ["Focal-only vs Baseline", "F1 (WebAttack)", "−0,0952", "0,0840", "0,4199", "tidak"] },
  { last: true, cells: ["Full vs Focal-only", "keempat metrik", "−0,0077 … +0,0256", "0,05 … 0,85", "0,3418 … 1,0000", "tidak"] },
]));
body.push(note(
  "Δ adalah selisih rerata; nilai negatif berarti konfigurasi pertama lebih buruk. " +
  "Baris yang diringkas memiliki kesimpulan seragam pada keempat metrik. " +
  "NSL-KDD: 4 dari 12 uji signifikan sebelum koreksi, 3 bertahan sesudahnya. " +
  "CICIDS2017: 7 dari 12 sebelum koreksi, 4 bertahan sesudahnya."));

body.push(p(
  "Tabel 3 menghasilkan empat kesimpulan. Pertama, penanganan pada tataran loss " +
  "memperbaiki G-mean secara signifikan pada kedua dataset, dengan Δ sebesar +0,4685 " +
  "dan +0,5591. Ini merupakan efek terbesar pada seluruh eksperimen dan merupakan satu-" +
  "satunya temuan yang arah maupun signifikansinya konsisten lintas dataset."));
body.push(p(
  "Kedua, penanganan pada tataran arsitektur memberikan hasil yang sepenuhnya " +
  "bergantung pada dataset. Pada NSL-KDD, Attn-only tidak berbeda dari baseline pada " +
  "keempat metrik dengan p terkoreksi tepat 1,0000 dan selisih yang berkisar antara " +
  "−0,0152 hingga +0,0115, yakni praktis nol. Pada CICIDS2017, konfigurasi yang sama " +
  "mengungguli baseline secara signifikan pada macro-F1 dan G-mean. Perbedaan ini bukan " +
  "soal kekuatan uji, melainkan soal besar efek: pada NSL-KDD efeknya memang tidak ada."));
body.push(p(
  "Ketiga, pada CICIDS2017 focal loss menurunkan F1 kelas Bot sebesar 0,1852 dan " +
  "penurunan tersebut signifikan setelah koreksi. Ini merupakan satu-satunya efek " +
  "negatif yang signifikan dalam seluruh eksperimen, dan menunjukkan bahwa focal loss " +
  "bukan intervensi yang bebas risiko. Mekanismenya dibahas pada Bagian F."));
body.push(p(
  "Keempat, penambahan class-specific attention di atas focal loss tidak memberikan " +
  "peningkatan signifikan pada metrik mana pun, di dataset mana pun. Pada NSL-KDD " +
  "seluruh p terkoreksi bernilai 1,0000; pada CICIDS2017 nilai terkecilnya 0,3418. " +
  "Temuan ini konsisten pada kedua dataset meskipun temuan lain berbalik arah, dan " +
  "merupakan kesimpulan yang paling dapat diandalkan dari keseluruhan studi: kedua " +
  "mekanisme tidak bersifat komplementer."));

// ---- D
body.push(h2("D. Stabilitas Antar Seed"));
body.push(p(
  "Selain rerata, simpangan baku antar seed sendiri merupakan temuan. Pada CICIDS2017, " +
  "baseline cross-entropy menghasilkan G-mean 0,3856 ± 0,3610 dan F1 WebAttack " +
  "0,8564 ± 0,2368. Pada kedua metrik tersebut, simpangan baku sebanding dengan " +
  "reratanya. Artinya, tanpa intervensi apa pun, apakah model berhasil mendeteksi " +
  "kelas langka sama sekali bergantung pada inisialisasi acak."));
body.push(p(
  "Sebagai pembanding, seluruh konfigurasi yang memuat focal loss maupun " +
  "class-specific attention memiliki simpangan baku G-mean tidak lebih dari 0,0276. " +
  "Pola yang sama terlihat pada NSL-KDD: simpangan baku G-mean baseline 0,1466 dan " +
  "Attn-only 0,1315, dibandingkan 0,0298 dan 0,0251 untuk kedua konfigurasi ber-focal."));
body.push(p(
  "Dengan demikian, manfaat intervensi tidak hanya terletak pada peningkatan rerata " +
  "melainkan juga pada reproduksibilitas. Hal ini memiliki implikasi praktis langsung: " +
  "paper IDS yang melaporkan satu angka tunggal dari satu seed, sebagaimana lazim " +
  "ditemui dalam literatur, berpotensi melaporkan hasil yang tidak dapat direproduksi " +
  "bahkan oleh penulisnya sendiri. Pada konfigurasi baseline CICIDS2017, dua seed yang " +
  "berbeda dapat menghasilkan macro-F1 0,9041 dan 0,6364."));

// ---- E
body.push(h2("E. Mengapa Efektivitas Mekanisme Bergantung pada Dataset"));
body.push(p(
  "Pembalikan arah pada tataran arsitektur menuntut penjelasan mekanistik, bukan " +
  "sekadar pelaporan. Untuk itu bobot attention rata-rata dari class-specific attention " +
  "pooling dianalisis pada kedua dataset. Untuk setiap kelas, distribusi bobot atas " +
  "seluruh token fitur dihitung, lalu dinyatakan sebagai entropi ternormalisasi " +
  "H/H_maks. Nilai mendekati 1 berarti attention tersebar hampir merata ke seluruh " +
  "token, sehingga mekanisme seleksi praktis tidak bekerja. Nilai yang jauh di bawah 1 " +
  "berarti query kelas benar-benar memusatkan perhatian pada sejumlah kecil fitur. " +
  "Gambar 2 menyajikan peta panasnya dan Tabel 4 merangkum nilainya."));

body.push(caption("Tabel 4. Entropi ternormalisasi bobot attention per kelas"));
body.push(table([2000, 1340, 1340, 400, 2000, 1140, 1140], [
  { head: true, first: true, cells: ["CICIDS2017", "H/H_maks", "puncak", "", "NSL-KDD", "H/H_maks", "puncak"] },
  { cells: ["Bot", "0,678", "20,8×", "", "R2L", "0,808", "12,4×"] },
  { cells: ["Infiltration", "0,803", "14,2×", "", "Probe", "0,958", "5,0×"] },
  { cells: ["BruteForce", "0,882", "11,4×", "", "DoS", "0,981", "2,4×"] },
  { cells: ["PortScan", "0,892", "11,6×", "", "U2R", "0,987", "2,1×"] },
  { cells: ["DoS", "0,914", "5,2×", "", "Normal", "0,990", "2,2×"] },
  { cells: ["WebAttack", "0,925", "8,8×", "", "", "", ""] },
  { cells: ["Heartbleed", "0,939", "6,0×", "", "", "", ""] },
  { cells: ["DDoS", "0,955", "7,0×", "", "", "", ""] },
  { cells: ["Normal", "0,958", "6,6×", "", "", "", ""] },
  { last: true, cells: ["rerata 0,883", "", "", "", "rerata 0,945", "", ""] },
]));
body.push(note(
  "Diurutkan dari yang paling terkonsentrasi. Kolom puncak menyatakan bobot attention " +
  "tertinggi sebagai kelipatan dari bobot seragam (1/42 pada NSL-KDD, 1/79 pada CICIDS2017)."));

body.push(p(
  "Hasilnya berlawanan arah secara tepat, dan justru pada kelas yang paling penting. " +
  "Pada NSL-KDD, U2R yang merupakan kelas paling langka dengan proporsi 0,04 persen " +
  "justru memiliki attention paling seragam kedua, yaitu H/H_maks sebesar 0,987 dengan " +
  "bobot puncak hanya 2,1 kali bobot seragam. Query khusus untuk kelas tersebut " +
  "tersedia, tetapi praktis menganggur tepat pada kelas yang menjadi alasan mekanisme " +
  "itu dirancang. Hal ini konsisten dengan hasil statistik: Attn-only tidak berbeda " +
  "dari baseline."));
body.push(p(
  "Pada CICIDS2017, dua kelas minoritas yakni Bot dan Infiltration justru merupakan dua " +
  "kelas dengan attention paling terkonsentrasi, dengan H/H_maks sebesar 0,678 dan " +
  "0,803 serta bobot puncak 20,8 dan 14,2 kali bobot seragam. Mekanisme seleksi di sini " +
  "benar-benar aktif, dan Attn-only memang mengungguli baseline secara signifikan."));
body.push(p(
  "Penjelasan yang dapat ditarik adalah bahwa class-specific attention pooling menolong " +
  "apabila, dan hanya apabila, tersedia fitur yang benar-benar diskriminatif untuk " +
  "dipilih oleh query kelas tersebut. NSL-KDD tidak menyediakannya untuk U2R, sehingga " +
  "query hanya merata-ratakan seluruh token dan hasilnya setara dengan mean-pooling. " +
  "CICIDS2017 menyediakannya untuk Bot, sehingga query dapat memusat dan memberikan " +
  "keuntungan nyata. Rumusan ini bersifat dapat diuji: ia memprediksi bahwa pada " +
  "dataset mana pun, manfaat mekanisme ini akan berbanding terbalik dengan entropi " +
  "attention pada kelas minoritasnya."));
body.push(p(
  "Penjelasan tersebut melengkapi, bukan menggantikan, tiga argumen struktural yang " +
  "telah dikemukakan pada Bagian II. Query per kelas memang hanya menyediakan wadah " +
  "representasi tanpa memberikan insentif rebalancing; token tabular memang tidak " +
  "memiliki struktur spasial sebagaimana feature map pada domain visual; dan softmax " +
  "bersama pada klasifikasi multi-class memang membuat seluruh query saling bersaing " +
  "dalam satu normalisasi. Ketiga faktor itu menjelaskan mengapa mekanisme ini rapuh " +
  "pada data tabular. Analisis entropi menjelaskan mengapa kerapuhan tersebut terwujud " +
  "pada satu dataset namun tidak pada dataset lain."));

// ---- F
body.push(h2("F. Perbandingan dengan Tataran Data dan Tree Ensemble"));
body.push(p(
  "Tabel 5 dan Tabel 6 membandingkan seluruh strategi terhadap pembanding klasik, " +
  "disertai biaya komputasinya. Ukuran model dan latensi bersifat deterministik dan " +
  "diukur satu kali per model; latensi diukur pada CPU satu thread."));

body.push(caption("Tabel 5. Perbandingan menyeluruh pada NSL-KDD (10 seed)"));
body.push(table([2000, 1600, 1600, 1500, 1330, 1330], [
  { head: true, first: true, cells: ["Model", "Macro-F1", "G-mean", "F1 (U2R)", "Ukuran (MB)", "Latensi (ms)"] },
  { cells: ["Focal", "0,6068 ± 0,0215", "0,6239 ± 0,0298", "0,1508", "0,22", "38,4"] },
  { cells: ["ClassAttn + Focal", "0,6027 ± 0,0113", "0,6358 ± 0,0251", "0,1471", "0,29", "45,3"] },
  { cells: ["SMOTE", "0,5919 ± 0,0299", "0,4907 ± 0,0432", "0,2739", "0,22", "40,1"] },
  { cells: ["XGBoost", "0,5873 ± 0,0000", "0,4018 ± 0,0000", "0,3218", "1,44", "4,8"] },
  { cells: ["Baseline", "0,5500 ± 0,0213", "0,1554 ± 0,1466", "0,0390", "0,22", "51,7"] },
  { cells: ["ClassAttn", "0,5426 ± 0,0145", "0,1669 ± 0,1315", "0,0302", "0,29", "48,4"] },
  { cells: ["Voting (RF+XGB)", "0,5371 ± 0,0021", "0,2306 ± 0,0031", "0,2499", "14,55", "38,5"] },
  { last: true, cells: ["Random Forest", "0,4846 ± 0,0037", "0,1434 ± 0,0103", "0,0883", "13,17", "35,3"] },
]));

body.push(caption("Tabel 6. Perbandingan menyeluruh pada CICIDS2017 (10 seed)"));
body.push(table([2000, 1600, 1600, 1500, 1330, 1330], [
  { head: true, first: true, cells: ["Model", "Macro-F1", "G-mean", "F1 (Bot)", "Ukuran (MB)", "Latensi (ms)"] },
  { cells: ["XGBoost", "0,9750 ± 0,0000", "0,9853 ± 0,0000", "0,9888", "2,13", "7,1"] },
  { cells: ["Voting (RF+XGB)", "0,9737 ± 0,0029", "0,9825 ± 0,0058", "0,9897", "20,68", "48,7"] },
  { cells: ["Random Forest", "0,9568 ± 0,0003", "0,9513 ± 0,0005", "0,9742", "18,51", "33,5"] },
  { cells: ["ClassAttn", "0,9060 ± 0,0190", "0,8783 ± 0,0276", "0,8590", "0,28", "156,1"] },
  { cells: ["SMOTE", "0,8806 ± 0,0121", "0,9389 ± 0,0144", "0,8321", "0,21", "100,6"] },
  { cells: ["Baseline", "0,8071 ± 0,0825", "0,3856 ± 0,3610", "0,8053", "0,21", "143,3"] },
  { cells: ["ClassAttn + Focal", "0,7647 ± 0,0194", "0,9471 ± 0,0061", "0,6304", "0,28", "167,3"] },
  { last: true, cells: ["Focal", "0,7391 ± 0,0231", "0,9446 ± 0,0117", "0,6201", "0,21", "134,2"] },
]));

body.push(p(
  "Hasil pada CICIDS2017 harus dinyatakan terus terang: tidak ada satu pun konfigurasi " +
  "Transformer yang mengungguli XGBoost. XGBoost mencapai macro-F1 0,9750 dan G-mean " +
  "0,9853, melampaui seluruh varian Transformer pada setiap metrik sekaligus, dengan " +
  "latensi inferensi 7,1 milidetik atau sekitar 22 kali lebih cepat daripada varian " +
  "Transformer terbaik. Ia juga sepenuhnya deterministik, dengan simpangan baku nol " +
  "pada seluruh metrik."));
body.push(p(
  "Pada NSL-KDD gambarannya berbeda. Konfigurasi ber-focal loss mengungguli XGBoost " +
  "pada macro-F1 dan G-mean dengan ukuran model enam kali lebih kecil, namun XGBoost " +
  "tetap unggul telak pada F1 kelas U2R, yaitu 0,3218 berbanding 0,1508, dan tetap " +
  "delapan kali lebih cepat. Pola yang berlawanan arah ini, yakni Transformer lebih " +
  "kuat pada R2L sementara tree ensemble lebih kuat pada U2R, menunjukkan bahwa " +
  "keunggulan tidak bersifat menyeluruh melainkan spesifik per kelas."));
body.push(p(
  "Tataran data berada di posisi menengah pada kedua dataset. SMOTE mencapai macro-F1 " +
  "yang mendekati tataran loss pada NSL-KDD dan melampauinya pada CICIDS2017, namun " +
  "memerlukan tahap resampling tersendiri beserta pembengkakan data latih, sedangkan " +
  "intervensi pada tataran loss tidak menambah biaya komputasi sama sekali."));
body.push(p(
  "Perbandingan ini juga memperjelas mengapa macro-F1 tidak layak menjadi metrik " +
  "tunggal pada CICIDS2017. Focal loss menurunkan macro-F1 namun menaikkan G-mean " +
  "secara dramatis, dan keduanya signifikan. Penjelasannya terletak pada pertukaran " +
  "antara recall dan presisi: focal loss memaksa model memprediksi kelas langka secara " +
  "agresif, sehingga recall kelas-kelas tersebut naik dari nol dan G-mean melonjak, " +
  "tetapi presisinya runtuh sehingga F1 per kelas justru turun. Keduanya merupakan " +
  "gambaran yang benar mengenai perilaku model, namun menjawab pertanyaan yang berbeda. " +
  "Pada konteks IDS, ketika serangan yang tidak terdeteksi sama sekali jauh lebih mahal " +
  "daripada alarm palsu, G-mean merupakan metrik yang lebih relevan. Gambar 3 " +
  "memvisualisasikan pertukaran antara performa dan biaya komputasi pada kedua dataset."));

// ---- G
body.push(h2("G. Keterbatasan"));
body.push(p(
  "Pertama, dan yang paling penting untuk dinyatakan: pada CICIDS2017, token " +
  "min_seg_size_forward menjadi bobot puncak bagi tujuh dari sembilan query kelas. " +
  "Fitur ini telah lama dicurigai sebagai artefak dalam cara CICIDS2017 dibangkitkan, " +
  "dan bukan sebagai sifat intrinsik serangan jaringan. Apabila model memang bersandar " +
  "pada fitur tersebut, sebagian keunggulan Attn-only pada dataset ini dapat merupakan " +
  "shortcut learning alih-alih deteksi serangan yang sesungguhnya. Pengujian ulang " +
  "tanpa fitur tersebut merupakan pekerjaan lanjutan yang diperlukan sebelum klaim " +
  "mengenai keberhasilan tataran arsitektur dapat dianggap mapan."));
body.push(p(
  "Kedua, pembatasan 50.000 baris per kelas pada CICIDS2017 menurunkan rasio " +
  "ketidakseimbangan dari sekitar 190.000:1 menjadi 4.545:1. Hasil pada dataset ini " +
  "karena itu berlaku untuk rezim ketidakseimbangan yang lebih ringan daripada data " +
  "aslinya, meskipun masih jauh lebih ekstrem daripada NSL-KDD."));
body.push(p(
  "Ketiga, Heartbleed dan Infiltration pada CICIDS2017 masing-masing hanya memiliki " +
  "tiga dan sembilan sampel uji, sehingga F1 keduanya tidak dapat ditafsirkan secara " +
  "kuantitatif. Yang dapat dinyatakan secara kualitatif adalah bahwa baseline " +
  "cross-entropy menghasilkan F1 tepat nol pada kedua kelas tersebut, sementara " +
  "konfigurasi ber-focal loss tidak. Inilah penyebab runtuhnya G-mean baseline, dan " +
  "temuan tersebut sejalan dengan arah hasil pada kelas minoritas yang dapat diukur."));
body.push(p(
  "Keempat, implementasi SMOTE memperlakukan fitur kategorikal sebagai numerik " +
  "terenkode lalu dibulatkan; penggunaan SMOTE-NC akan lebih tepat secara metodologis. " +
  "Kelima, pengukuran efisiensi dilakukan pada lingkungan CPU tersimulasi dengan satu " +
  "thread, bukan pada perangkat edge fisik, sehingga istilah yang digunakan dalam " +
  "artikel ini adalah computational efficiency dan bukan edge deployment. Keenam, " +
  "tree ensemble dilatih pada CPU multi-core sementara Transformer dilatih pada GPU, " +
  "sehingga waktu latih keduanya tidak sebanding dan yang dibandingkan hanyalah ukuran " +
  "model serta latensi inferensi."));

// ---------------------------------------------------------------- bangun berkas
const doc = new Document({
  styles: { default: { document: { run: { font: FONT, size: 22 } } } },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children: body,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(process.argv[2] || "bab4.docx", buf);
  console.log("tersimpan:", process.argv[2] || "bab4.docx", buf.length, "bytes");
});
