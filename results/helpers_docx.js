// Helper bersama untuk membangun naskah Word.
const fs = require("fs");
const path = require("path");
const {
  Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
  WidthType, AlignmentType, BorderStyle, ShadingType,
} = require("docx");

const FONT = "Times New Roman";
const W = 9360;                       // lebar kolom teks (DXA), kertas Letter margin 1 inci
const EQ_DIR = "/mnt/user-data/outputs/gambar_persamaan";
const FIG_DIR = __dirname;

const NONE = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const LINE = { style: BorderStyle.SINGLE, size: 6, color: "000000" };
const BOX  = { style: BorderStyle.SINGLE, size: 6, color: "000000" };

function p(text, opt = {}) {
  const { bold = false, italics = false, size = 22, align = AlignmentType.JUSTIFIED,
          before = 0, after = 120 } = opt;
  return new Paragraph({
    alignment: align,
    spacing: { before, after, line: 276 },
    children: [new TextRun({ text, bold, italics, size, font: FONT })],
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
    keepNext: true,
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

function pngSize(file) {
  const b = fs.readFileSync(file);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20), buf: b };
}

// Gambar persamaan: dirender pada 400 dpi, ditampilkan pada ukuran aslinya.
function equation(n) {
  const file = path.join(EQ_DIR, `eq${String(n).padStart(2, "0")}.png`);
  const { w, h, buf } = pngSize(file);
  const wi = w / 400, hi = h / 400;
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 120 },
    children: [
      new ImageRun({ type: "png", data: buf,
                     transformation: { width: Math.round(wi * 96), height: Math.round(hi * 96) } }),
      new TextRun({ text: `          (${n})`, size: 22, font: FONT }),
    ],
  });
}

// Gambar biasa: lebar ditetapkan dalam inci, tinggi mengikuti rasio aslinya.
function figure(file, widthIn) {
  const full = path.isAbsolute(file) ? file : path.join(FIG_DIR, file);
  const { w, h, buf } = pngSize(full);
  const hi = widthIn * (h / w);
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    keepNext: true,
    spacing: { before: 160, after: 80 },
    children: [new ImageRun({ type: "png", data: buf,
                              transformation: { width: Math.round(widthIn * 96),
                                                height: Math.round(hi * 96) } })],
  });
}

// Kotak algoritma bergaris penuh, satu sel.
function algoBox(lines) {
  const kids = lines.map((ln, i) => new Paragraph({
    spacing: { after: 20, line: 240 },
    children: [new TextRun({
      text: ln,
      bold: i === 0,
      size: i === 0 ? 20 : 18,
      font: i === 0 ? FONT : "Consolas",
    })],
  }));
  return new Table({
    columnWidths: [W],
    width: { size: W, type: WidthType.DXA },
    rows: [new TableRow({
      cantSplit: true,
      children: [new TableCell({
        width: { size: W, type: WidthType.DXA },
        margins: { top: 100, bottom: 100, left: 140, right: 140 },
        borders: { top: BOX, bottom: BOX, left: BOX, right: BOX },
        children: kids,
      })],
    })],
  });
}

function cell(text, width, { bold = false, align = AlignmentType.CENTER,
                             top = NONE, bottom = NONE } = {}) {
  return new TableCell({
    width: { size: width, type: WidthType.DXA },
    margins: { top: 40, bottom: 40, left: 80, right: 80 },
    borders: { top, bottom, left: NONE, right: NONE },
    children: [new Paragraph({
      alignment: align,
      spacing: { after: 0, line: 240 },
      children: [new TextRun({ text, bold, size: 18, font: FONT })],
    })],
  });
}

// rows: [{cells:[...], head?, first?, last?}]
function table(widths, rows) {
  return new Table({
    columnWidths: widths,
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    rows: rows.map((r) => new TableRow({
      tableHeader: !!r.head,
      children: r.cells.map((c, i) => {
        const txt = Array.isArray(c) ? c[0] : c;
        const al = Array.isArray(c) && c[1] ? c[1]
                 : (i === 0 ? AlignmentType.LEFT : AlignmentType.CENTER);
        return cell(txt, widths[i], {
          bold: !!r.head,
          align: al,
          top: r.first ? LINE : NONE,
          bottom: (r.head || r.last) ? LINE : NONE,
        });
      }),
    })),
  });
}

module.exports = { FONT, W, p, h1, h2, caption, note, equation, figure, algoBox, table,
                   AlignmentType };
