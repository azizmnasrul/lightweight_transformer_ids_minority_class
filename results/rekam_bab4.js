// Merekam isi Bab IV sebagai data polos, bukan objek docx, sehingga teks yang
// sama dapat dirender ke template IEEE Access tanpa perlu diketik ulang.
const B = [];
const rec = (t) => (...args) => { B.push({ t, args }); return { __rec: true }; };
const helpers = {
  p: rec("p"), h1: rec("h1"), h2: rec("h2"), caption: rec("caption"),
  note: rec("note"), table: rec("table"), figure: rec("figure"),
  equation: rec("equation"), algoBox: rec("algo"),
  AlignmentType: new Proxy({}, { get: (_, k) => String(k) }),
};
require("./konten_bab4")(helpers);
process.stdout.write(JSON.stringify(B, null, 0));
