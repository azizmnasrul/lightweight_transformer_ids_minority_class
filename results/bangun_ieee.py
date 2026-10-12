#!/usr/bin/env python3
"""Susun naskah ke dalam template resmi IEEE Access.

Pendekatannya menyuntikkan isi ke berkas template aslinya, bukan meniru
tampilannya. Dengan begitu styles.xml, numbering.xml, header, footer, dan
geometri halaman tetap milik IEEE, sehingga hasilnya benar-benar sesuai
template dan bukan sekadar mirip.

Pemakaian:
    python3 bangun_ieee.py <dir_scratch> <template.docx> <keluaran.docx>
"""
import json, os, re, shutil, struct, subprocess, sys, zipfile

SP, TPL, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
HERE = os.path.dirname(os.path.abspath(__file__))
EQ_DIR = "/mnt/user-data/outputs/gambar_persamaan"
WORK = os.path.join(SP, "ieee_build")

# ---------------------------------------------------------------- geometri
PG = 'w:w="11520" w:h="15660" w:code="1"'
MAR = ('w:top="1300" w:right="740" w:bottom="1040" w:left="740" '
       'w:header="360" w:footer="640" w:gutter="0"')
COL1 = 10040          # lebar satu kolom penuh (twips)
COL2 = 4820           # lebar satu kolom dari dua kolom
EMU = 914400

# ---------------------------------------------------------------- utilitas
def esc(t):
    return (str(t).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"))

def run(text, b=False, i=False, sz=None):
    rpr = ""
    if b or i or sz:
        rpr = "<w:rPr>" + ("<w:b/>" if b else "") + ("<w:i/>" if i else "") + \
              (f'<w:sz w:val="{sz}"/><w:szCs w:val="{sz}"/>' if sz else "") + "</w:rPr>"
    return f'<w:r>{rpr}<w:t xml:space="preserve">{esc(text)}</w:t></w:r>'

def para(style=None, runs="", extra_ppr="", jc=None):
    ppr = ""
    if style or extra_ppr or jc:
        ppr = "<w:pPr>" + (f'<w:pStyle w:val="{style}"/>' if style else "") + \
              extra_ppr + (f'<w:jc w:val="{jc}"/>' if jc else "") + "</w:pPr>"
    return f"<w:p>{ppr}{runs}</w:p>"

NONUM = '<w:numPr><w:ilvl w:val="0"/><w:numId w:val="0"/></w:numPr>'

def text_para(style, text, **kw):
    return para(style, run(text), **kw)

def head2(text):
    """Subbab dengan huruf yang kita tulis sendiri; penomoran bawaan style
    dimatikan agar tidak muncul dua penanda seperti "G.  B. Dataset"."""
    return para("H2ContNoSpace", run(text), extra_ppr=NONUM)

def sect(ncols, final=False):
    cols = '<w:cols w:space="720"/>' if ncols == 1 else '<w:cols w:num="2" w:space="400"/>'
    inner = ('<w:type w:val="continuous"/>'
             f'<w:pgSz {PG}/><w:pgMar {MAR}/>{cols}'
             '<w:docGrid w:linePitch="360"/>')
    if final:
        return f"<w:sectPr>{inner}</w:sectPr>"
    # pembatas bagian menumpang pada paragraf kosong
    return f"<w:p><w:pPr><w:sectPr>{inner}</w:sectPr></w:pPr></w:p>"

# ---------------------------------------------------------------- gambar
_rels, _media, _next = [], [], [1000]

def png_size(path):
    with open(path, "rb") as f:
        head = f.read(26)
    return struct.unpack(">II", head[16:24])

def image(path, width_in, dpi=None):
    """Sisipkan gambar inline. width_in None berarti pakai ukuran asli pada dpi."""
    if not os.path.isabs(path):
        path = os.path.join(HERE, path)
    w, h = png_size(path)
    if width_in is None:
        width_in = w / dpi
    hin = width_in * h / w
    idx = _next[0]; _next[0] += 1
    name = f"img{idx}.png"
    rid = f"rIdImg{idx}"
    _media.append((path, name))
    _rels.append((rid, name))
    cx, cy = int(width_in * EMU), int(hin * EMU)
    return (
        f'<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0">'
        f'<wp:extent cx="{cx}" cy="{cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/>'
        f'<wp:docPr id="{idx}" name="{name}"/><wp:cNvGraphicFramePr>'
        f'<a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/>'
        f'</wp:cNvGraphicFramePr>'
        f'<a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">'
        f'<a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">'
        f'<pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">'
        f'<pic:nvPicPr><pic:cNvPr id="{idx}" name="{name}"/><pic:cNvPicPr/></pic:nvPicPr>'
        f'<pic:blipFill><a:blip r:embed="{rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>'
        f'<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="{cx}" cy="{cy}"/></a:xfrm>'
        f'<a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>'
        f'</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>')

def equation(n):
    """Persamaan dan nomornya diletakkan pada satu baris tabel tanpa garis.
    Tab stop tidak dipakai karena posisinya tidak dapat diandalkan setelah
    gambar selebar beberapa inci pada kolom sempit."""
    f = os.path.join(EQ_DIR, f"eq{n:02d}.png")
    img = image(f, None, dpi=400)
    cw = [COL2 - 620, 620]
    pp = '<w:spacing w:before="60" w:after="60"/>'
    c1 = (f'<w:tc><w:tcPr><w:tcW w:w="{cw[0]}" w:type="dxa"/></w:tcPr>'
          f'{para(None, img, extra_ppr=pp, jc="center")}</w:tc>')
    c2 = (f'<w:tc><w:tcPr><w:tcW w:w="{cw[1]}" w:type="dxa"/>'
          f'<w:vAlign w:val="center"/></w:tcPr>'
          f'{para(None, run(f"({n})", sz=20), extra_ppr=pp, jc="right")}</w:tc>')
    grid = "".join(f'<w:gridCol w:w="{w}"/>' for w in cw)
    return (f'<w:tbl><w:tblPr><w:tblW w:w="{COL2}" w:type="dxa"/>'
            f'<w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>{grid}</w:tblGrid>'
            f'<w:tr><w:trPr><w:cantSplit/></w:trPr>{c1}{c2}</w:tr></w:tbl>'
            + para(None, "", extra_ppr='<w:spacing w:after="0" w:line="120" w:lineRule="auto"/>'))

# ---------------------------------------------------------------- tabel
TOP = '<w:top w:val="single" w:sz="8" w:space="0" w:color="000000"/>'
BOT = '<w:bottom w:val="single" w:sz="8" w:space="0" w:color="000000"/>'

def tbl(widths, rows, total):
    scale = total / sum(widths)
    ws = [max(400, int(w * scale)) for w in widths]
    ws[-1] = total - sum(ws[:-1])
    grid = "".join(f'<w:gridCol w:w="{w}"/>' for w in ws)
    out = [f'<w:tbl><w:tblPr><w:tblW w:w="{total}" w:type="dxa"/>'
           f'<w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid>{grid}</w:tblGrid>']
    for r in rows:
        cells = []
        for i, c in enumerate(r["cells"]):
            txt = c[0] if isinstance(c, list) else c
            align = "left" if i == 0 else "center"
            bd = ""
            if r.get("first"): bd += TOP
            if r.get("head") or r.get("last"): bd += BOT
            tcpr = (f'<w:tcPr><w:tcW w:w="{ws[i]}" w:type="dxa"/>'
                    + (f"<w:tcBorders>{bd}</w:tcBorders>" if bd else "")
                    + "<w:vAlign w:val=\"center\"/></w:tcPr>")
            p = para(None,
                     run(txt, b=bool(r.get("head")), sz=14),
                     extra_ppr='<w:spacing w:before="20" w:after="20" w:line="200" w:lineRule="auto"/>',
                     jc=align)
            cells.append(f"<w:tc>{tcpr}{p}</w:tc>")
        trpr = '<w:trPr><w:tblHeader/><w:cantSplit/></w:trPr>' if r.get("head") else '<w:trPr><w:cantSplit/></w:trPr>'
        out.append(f"<w:tr>{trpr}{''.join(cells)}</w:tr>")
    out.append("</w:tbl>")
    return "".join(out)

# ---------------------------------------------------------------- muat data
blocks  = json.load(open(f"{SP}/blok_bab123.json"))
bab4    = json.load(open(f"{SP}/bab4.json"))
refs    = json.load(open(f"{SP}/refs.json"))
depan   = json.load(open(f"{SP}/depan_bab5.json"))

body = []
A = body.append

# ---------------------------------------------------------------- halaman depan
A(text_para("DOP", "Date of publication xxxx 00, 0000, date of current version xxxx 00, 0000."))
A(text_para("DOI", "Digital Object Identifier 10.1109/ACCESS.2024.Doi Number"))
A(text_para("PaperTitle", depan["judul"]))
A(text_para("AU", "NAMA PENULIS1, NAMA PENULIS2, (Member, IEEE)"))
A(text_para("PINoSpace", "1Departemen/Fakultas, Universitas Airlangga, Surabaya 60115, Indonesia"))
A(text_para("PI", "Corresponding author: Nama Penulis (e-mail: penulis@unair.ac.id)."))
A(text_para("FootnoteText",
            "Penelitian ini didukung sebagian oleh [sumber pendanaan dan nomor hibah, "
            "atau hapus bila tidak ada]. Kode dan notebook eksperimen tersedia terbuka pada "
            "https://github.com/azizmnasrul/lightweight_transformer_ids_minority_class"))
A(para("Abstract", run("ABSTRAK ", b=True) + run(depan["abstrak"])))
A(para("IT", run("KATA KUNCI ", b=True) + run(depan["katakunci"])))
A(sect(1))        # tutup bagian satu kolom

# ---------------------------------------------------------------- Bab I sampai III
ROMAN = {"I.": "I.", "II.": "II.", "III.": "III."}
first_after_head = False
wide_pending = []

def flush_two_col(items):
    """Tulis daftar potongan XML pada aliran dua kolom."""
    body.extend(items)

for b in blocks:
    t = b["t"]
    if t == "h1":
        A(text_para("H1", b["s"].upper()))
        first_after_head = True
    elif t == "h2":
        A(head2(b["s"]))
        first_after_head = True
    elif t == "p":
        A(text_para("PARA" if first_after_head else "PARAIndent", b["s"]))
        first_after_head = False
    elif t == "eq":
        A(equation(b["n"]))
        first_after_head = False
    elif t == "caption":
        A(text_para("FigureCaption", b["s"]))
    elif t == "figplaceholder":
        A(para(None, image(os.path.join(EQ_DIR, "fig1_flowchart_v3.png"), 2.9), jc="center"))
    elif t == "algo":
        # kotak algoritma melebar dua kolom
        A(sect(2))
        A(tbl([COL1], [{"cells": [l], "first": i == 0, "last": i == len(b["lines"]) - 1}
                       for i, l in enumerate(b["lines"])], COL1))
        A(sect(1))
        first_after_head = False

# ---------------------------------------------------------------- Bab IV
# Tabel, gambar, keterangan, dan catatannya dikelompokkan menjadi satu blok
# selebar halaman. Bila keterangan dibiarkan mengalir di kolom sempit, ia akan
# terpisah dari tabelnya dan terbaca sebagai potongan teks yang menggantung.
FLOAT = {"caption", "note", "table", "figure"}
groups, i = [], 0
while i < len(bab4):
    if bab4[i]["t"] in FLOAT:
        j = i
        while j < len(bab4) and bab4[j]["t"] in FLOAT:
            j += 1
        groups.append(("float", bab4[i:j]))
        i = j
    else:
        groups.append(("flow", [bab4[i]]))
        i += 1

def render_float_item(item):
    t, a = item["t"], item["args"]
    if t == "caption":
        return text_para("TableTitle" if a[0].startswith("Tabel") else "FigureCaption", a[0])
    if t == "note":
        return text_para("FigureCaption", a[0])
    if t == "table":
        return tbl(a[0], a[1], COL1)
    if t == "figure":
        return para(None, image(a[0], 6.8), jc="center")
    raise ValueError(t)

for kind, items in groups:
    if kind == "float":
        A(sect(2))
        for it in items:
            A(render_float_item(it))
        A(sect(1))
        first_after_head = False
        continue
    item = items[0]
    t, a = item["t"], item["args"]
    if t == "h1":
        A(text_para("H1", a[0].upper())); first_after_head = True
    elif t == "h2":
        A(head2(a[0])); first_after_head = True
    elif t == "p":
        A(text_para("PARA" if first_after_head else "PARAIndent", a[0]))
        first_after_head = False

# ---------------------------------------------------------------- Bab V
A(text_para("H1", "V. KESIMPULAN"))
for i, s in enumerate(depan["babV"]):
    A(text_para("PARA" if i == 0 else "PARAIndent", s))

# ---------------------------------------------------------------- pustaka
A(text_para("H1", "REFERENSI"))
for r in refs:
    A(text_para("Ref", r))
A(text_para("FigureCaption", depan["catatan_editorial"]))

A(sect(2, final=True))

# ---------------------------------------------------------------- rakit berkas
if os.path.exists(WORK):
    shutil.rmtree(WORK)
os.makedirs(WORK)
with zipfile.ZipFile(TPL) as z:
    z.extractall(WORK)

doc = open(f"{WORK}/word/document.xml", encoding="utf8").read()
head = doc[:doc.index("<w:body>") + len("<w:body>")]
open(f"{WORK}/word/document.xml", "w", encoding="utf8").write(
    head + "".join(body) + "</w:body></w:document>")

os.makedirs(f"{WORK}/word/media", exist_ok=True)
for src, name in _media:
    shutil.copy(src, f"{WORK}/word/media/{name}")

relf = f"{WORK}/word/_rels/document.xml.rels"
rels = open(relf, encoding="utf8").read()
add = "".join(
    f'<Relationship Id="{rid}" Type="http://schemas.openxmlformats.org/officeDocument/'
    f'2006/relationships/image" Target="media/{name}"/>' for rid, name in _rels)
open(relf, "w", encoding="utf8").write(rels.replace("</Relationships>", add + "</Relationships>"))

if os.path.exists(OUT):
    os.remove(OUT)
zf = zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED)
for root, _, files in os.walk(WORK):
    for f in files:
        full = os.path.join(root, f)
        zf.write(full, os.path.relpath(full, WORK))
zf.close()
print(f"tersimpan: {OUT} ({os.path.getsize(OUT)//1024} KB) | "
      f"{len(body)} blok, {len(_media)} gambar")
