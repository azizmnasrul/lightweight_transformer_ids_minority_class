#!/usr/bin/env python3
"""Ubah hasil konversi pandoc naskah lama menjadi daftar blok terstruktur.

Keluaran JSON dipakai oleh skrip pembangun Word, sehingga Bab I sampai III
tidak perlu diketik ulang dan tidak ada paragraf yang hilang.
"""
import json, re, sys

SP = sys.argv[1]
src = open(f"{SP}/manuscript.md").read()

# Peta gambar persamaan: nama hash pada docx lama -> nomor persamaan.
# Nomor diambil dari "(N)" yang menempel tepat sesudah gambar.
EQ_RE = re.compile(r"!\[\]\(media/([0-9a-f]+)\.undefined\)\{[^}]*\}\((\d+)\)", re.S)
FIG_RE = re.compile(r"!\[\]\(media/([0-9a-f]+)\.undefined\)\{[^}]*\}")

# Ambil hanya Bab I sampai akhir Bab III (Bab IV dan V ditulis ulang).
start = src.index("**I. Pendahuluan**")
end = src.index("**IV. Hasil dan Pembahasan**")
chunk = src[start:end]

blocks = []

# Pindai baris demi baris. Kotak algoritma pandoc adalah rangkaian baris
# berurutan yang diawali '+' atau '|'; memotongnya dengan regex rentang
# membuat isi di antara dua kotak ikut tertelan.
lines = chunk.splitlines()
segments = []          # ("text", str) atau ("algo", [baris])
buf, box = [], None
for line in lines:
    if line.startswith("+") or line.startswith("|"):
        if box is None:
            if buf:
                segments.append(("text", "\n".join(buf)))
                buf = []
            box = []
        box.append(line)
    else:
        if box is not None:
            segments.append(("algo", box))
            box = None
        buf.append(line)
if box is not None:
    segments.append(("algo", box))
if buf:
    segments.append(("text", "\n".join(buf)))

def emit_text(text):
    for raw in re.split(r"\n\s*\n", text):
        para = " ".join(raw.split())
        if not para:
            continue

        m = EQ_RE.fullmatch(para)
        if m:
            blocks.append({"t": "eq", "n": int(m.group(2))})
            continue
        if FIG_RE.fullmatch(para):
            blocks.append({"t": "figplaceholder"})
            continue

        m = re.fullmatch(r"\*\*([IVX]+\.\s+[^*]+)\*\*", para)
        if m:
            blocks.append({"t": "h1", "s": m.group(1).strip()})
            continue
        m = re.fullmatch(r"\*\*\*([^*]+)\*\*\*", para)
        if m:
            blocks.append({"t": "h2", "s": m.group(1).strip()})
            continue
        if para.startswith("GAMBAR "):
            blocks.append({"t": "caption", "s": para})
            continue

        s2 = para
        s2 = re.sub(r"\*\*([^*]+)\*\*", r"\1", s2)
        s2 = re.sub(r"\*([^*]+)\*", r"\1", s2)
        s2 = s2.replace("\\[", "[").replace("\\]", "]").replace("\\*", "*")
        s2 = s2.replace("\\_", "_")
        s2 = re.sub(r"~([A-Za-z0-9]+)~", r"_\1", s2)
        s2 = s2.replace("~", "")
        s2 = re.sub(r"^(\d+)\\?\)", r"\1)", s2)
        s2 = s2.replace("--", "\u2013")
        blocks.append({"t": "p", "s": s2})

for kind, payload in segments:
    if kind == "algo":
        rows = []
        for line in payload:
            if not line.startswith("|"):
                continue
            cellv = line.strip("|").strip().lstrip("> ").strip()
            cellv = cellv.replace("\\[", "[").replace("\\]", "]").replace("\\*", "*")
            cellv = cellv.replace("\\_", "_")
            cellv = re.sub(r"\*\*([^*]+)\*\*", r"\1", cellv)
            rows.append(cellv)
        blocks.append({"t": "algo", "lines": [r for r in rows if r != ""]})
    else:
        emit_text(payload)

json.dump(blocks, open(f"{SP}/blok_bab123.json", "w"), ensure_ascii=False, indent=0)

from collections import Counter
print(Counter(b["t"] for b in blocks))
print("persamaan:", sorted(b["n"] for b in blocks if b["t"] == "eq"))
print("subbab:", [b["s"][:34] for b in blocks if b["t"] == "h2"])
