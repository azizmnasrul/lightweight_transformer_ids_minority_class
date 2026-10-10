#!/usr/bin/env python3
"""Bangun Gambar 2 (peta panas attention) dan Gambar 3 (trade-off) untuk naskah IEEE Access."""
import json, os
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.lines import Line2D

HERE = os.path.dirname(os.path.abspath(__file__))

# --- Tipografi IEEE: Times, 8 pt badan gambar ---
plt.rcParams.update({
    "font.family": "serif",
    "font.serif": ["Nimbus Roman", "Times New Roman", "DejaVu Serif"],
    "font.size": 8,
    "axes.labelsize": 8,
    "axes.titlesize": 8,
    "xtick.labelsize": 7,
    "ytick.labelsize": 7,
    "legend.fontsize": 7,
    "axes.linewidth": 0.6,
    "xtick.major.width": 0.6,
    "ytick.major.width": 0.6,
    "savefig.dpi": 600,
    "figure.dpi": 150,
})

INK        = "#1a1a1a"
INK_MUTED  = "#5c5c5c"
GRID       = "#d9d9d6"
SURFACE    = "#fcfcfb"

# Palet kategorikal lolos validator (lightness, chroma, CVD, kontras)
CAT = {
    "Loss":          "#2060b0",
    "Arsitektur":    "#c0601f",
    "Data":          "#8a3d9e",
    "Tree ensemble": "#009e8f",
}
NEUTRAL = "#8a8a86"   # untuk baseline tanpa penanganan imbalance


# ----------------------------------------------------------------------------
# Gambar 2 — peta panas bobot attention per kelas
# ----------------------------------------------------------------------------
def figure2(src="attn_mean.json", out="fig2_attention_heatmap.png",
            order=("Normal", "DoS", "Probe", "R2L", "U2R"), feat_names=None,
            tick_every=5, height=2.35):
    d = json.load(open(os.path.join(HERE, src)))
    A = np.asarray(d["a"], dtype=float)
    classes = d["c"]
    feat_names = feat_names if feat_names is not None else d.get("t")
    A = A / A.sum(axis=1, keepdims=True)          # baris = distribusi
    n_cls, n_feat = A.shape
    uniform = 1.0 / n_feat

    # Urutkan baris: kelas terbanyak di atas, paling langka di bawah
    idx = [classes.index(c) for c in order if c in classes]
    A, classes = A[idx], [classes[i] for i in idx]

    H = -(A * np.log(A + 1e-12)).sum(axis=1) / np.log(n_feat)   # entropi ternormalisasi

    # Encoding diverging: titik tengah = attention seragam (1/42).
    # Nilai yang dipetakan adalah log2(bobot / seragam), sehingga "tidak ada
    # konsentrasi" terbaca sebagai netral, bukan sebagai ujung skala.
    from matplotlib.colors import LinearSegmentedColormap, TwoSlopeNorm
    cmap = LinearSegmentedColormap.from_list(
        "cool_warm_ids",
        ["#2060b0", "#8fb4dd", "#eeeeec", "#e0a878", "#c0601f"])
    R = np.log2(A / uniform)
    norm = TwoSlopeNorm(vmin=float(R.min()), vcenter=0.0, vmax=float(R.max()))

    fig, ax = plt.subplots(figsize=(7.16, height))
    fig.patch.set_facecolor(SURFACE)
    ax.set_facecolor(SURFACE)

    im = ax.imshow(R, aspect="auto", cmap=cmap, norm=norm,
                   interpolation="nearest")

    ax.set_yticks(range(n_cls))
    ax.set_yticklabels(classes, color=INK)

    # Sumbu x: dengan 79 token, melabeli semuanya membuat gambar tidak terbaca.
    # Yang dilabeli hanya token yang menjadi puncak bagi salah satu kelas —
    # itulah yang dibaca orang dari peta panas ini.
    peaks = sorted({int(np.argmax(A[i])) for i in range(n_cls)})
    if feat_names:
        ax.set_xticks(range(n_feat), minor=True)
        ax.set_xticks(peaks)
        ax.set_xticklabels([feat_names[i] for i in peaks], color=INK,
                           rotation=38, ha="right", rotation_mode="anchor")
        ax.tick_params(axis="x", which="minor", length=2, color=GRID)
        ax.set_xlabel(f"Token fitur (ditandai: puncak attention tiap kelas, "
                      f"dari {n_feat} token)", color=INK)
    else:
        xt = list(range(0, n_feat, tick_every))
        ax.set_xticks(xt)
        ax.set_xticklabels([str(i) for i in xt], color=INK_MUTED)
        ax.set_xlabel("Indeks token fitur", color=INK)

    for sp in ax.spines.values():
        sp.set_edgecolor(GRID)

    # Dua kolom ringkasan di tepi kanan, jaraknya sebanding lebar peta
    gap = max(1.6, 0.035 * n_feat)
    c_max, c_ent = n_feat + gap, n_feat + 4.3 * gap
    for i, h in enumerate(H):
        ax.text(c_max, i, f"{A[i].max() / uniform:.1f}\u00d7", va="center",
                ha="center", fontsize=7, color=INK)
        ax.text(c_ent, i, f"{h:.3f}", va="center", ha="center",
                fontsize=7, color=INK)
    ax.text(c_max, -0.95, "puncak", va="bottom", ha="center",
            fontsize=7, color=INK)
    ax.text(c_ent, -0.95, "$H/H_{maks}$", va="bottom", ha="center",
            fontsize=7, color=INK)
    ax.set_xlim(-0.5, n_feat + 6.0 * gap)

    # Tandai bobot puncak tiap baris
    for i in range(n_cls):
        j = int(np.argmax(A[i]))
        ax.add_patch(plt.Rectangle((j - 0.5, i - 0.5), 1, 1, fill=False,
                                   edgecolor=INK, linewidth=0.9))

    ticks = [-2, -1, 0, 1, 2, 3, np.log2(A.max() / uniform)]
    ticks = [t for t in ticks if norm.vmin <= t <= norm.vmax]
    cb = fig.colorbar(im, ax=ax, pad=0.085, fraction=0.028, ticks=ticks)
    cb.ax.set_yticklabels([f"{2 ** t:.2g}×" for t in ticks])
    cb.ax.tick_params(labelsize=6, width=0.5, colors=INK_MUTED)
    cb.outline.set_edgecolor(GRID)
    cb.set_label("Bobot relatif terhadap seragam", fontsize=7, color=INK)

    fig.tight_layout()
    out = os.path.join(HERE, out)
    fig.savefig(out, bbox_inches="tight", facecolor=SURFACE)
    fig.savefig(out.replace(".png", ".pdf"), bbox_inches="tight", facecolor=SURFACE)
    plt.close(fig)

    print(f"Gambar 2 -> {out}")
    print(f"  uniform = {uniform:.4f}")
    for c, h, a in zip(classes, H, A):
        print(f"  {c:7s} H/Hmax={h:.3f}  maks={a.max():.4f} ({a.max()/uniform:.2f}x seragam)")
    return H, classes


# ----------------------------------------------------------------------------
# Gambar 3 — trade-off performa kelas minoritas vs biaya komputasi
# ----------------------------------------------------------------------------
LEVEL = {
    "Focal":             "Loss",
    "ClassAttn + Focal": "Loss",
    "ClassAttn":         "Arsitektur",
    "SMOTE":             "Data",
    "XGBoost":           "Tree ensemble",
    "Voting (RF+XGB)":   "Tree ensemble",
    "Random Forest":     "Tree ensemble",
    "Baseline":          None,
}

def figure3(csv="tabel3_multiseed.csv", out="fig3_tradeoff.png", minor=("U2R","R2L"),
            xlim=(-2, 60), ylim=(0.455, 0.655), offsets=None):
    df = pd.read_csv(os.path.join(HERE, csv))
    df["f1"]  = df["Macro-F1"].str.split("±").str[0].astype(float)
    df["sd"]  = df["Macro-F1"].str.split("±").str[1].astype(float)
    df["lat"] = df["Latency (ms)"].astype(float)
    df["mb"]  = df["Size (MB)"].astype(float)

    fig, ax = plt.subplots(figsize=(7.16, 3.1))
    fig.patch.set_facecolor(SURFACE)
    ax.set_facecolor(SURFACE)
    ax.grid(True, color=GRID, linewidth=0.5, zorder=0)
    ax.set_axisbelow(True)

    for _, r in df.iterrows():
        lvl = LEVEL.get(r["Model"])
        col = CAT.get(lvl, NEUTRAL)
        # luas penanda sebanding ukuran model
        s = 28 + 190 * np.sqrt(r["mb"] / df["mb"].max())
        ax.errorbar(r["lat"], r["f1"], yerr=r["sd"], fmt="none",
                    ecolor=col, elinewidth=0.9, capsize=2, capthick=0.9,
                    alpha=0.85, zorder=2)
        ax.scatter(r["lat"], r["f1"], s=s, color=col,
                   edgecolor=SURFACE, linewidth=1.2, zorder=3)

    # Label langsung pada setiap titik — identitas tidak pernah hanya lewat warna
    offsets = offsets or {
        "Focal":             (-9,  -3, "right"),
        "ClassAttn + Focal": (10,   3, "left"),
        "SMOTE":             (10,  -3, "left"),
        "XGBoost":           (11,  -3, "left"),
        "Baseline":          (10,   2, "left"),
        "ClassAttn":         (-9, -10, "right"),
        "Voting (RF+XGB)":   (-14, -3, "right"),
        "Random Forest":     (0,  -21, "center"),
    }
    for _, r in df.iterrows():
        dx, dy, ha = offsets.get(r["Model"], (0, 12, "center"))
        ax.annotate(r["Model"], (r["lat"], r["f1"]),
                    textcoords="offset points", xytext=(dx, dy),
                    ha=ha, fontsize=7, color=INK, zorder=4)

    ax.set_xlabel("Latensi inferensi CPU single-thread (ms)", color=INK)
    ax.set_ylabel("Macro-F1 (rerata 10 seed)", color=INK)
    ax.set_xlim(*xlim)
    ax.set_ylim(*ylim)
    ax.tick_params(colors=INK_MUTED)
    for sp in ("top", "right"):
        ax.spines[sp].set_visible(False)
    for sp in ("left", "bottom"):
        ax.spines[sp].set_edgecolor(GRID)

    handles = [Line2D([], [], marker="o", linestyle="", markersize=5,
                      markerfacecolor=c, markeredgecolor=SURFACE, label=k)
               for k, c in CAT.items()]
    handles.append(Line2D([], [], marker="o", linestyle="", markersize=5,
                          markerfacecolor=NEUTRAL, markeredgecolor=SURFACE,
                          label="Tanpa penanganan"))
    leg = ax.legend(handles=handles, title="Tingkat intervensi", loc="lower left",
                    frameon=True, framealpha=1, edgecolor=GRID, borderpad=0.5)
    leg.get_frame().set_facecolor(SURFACE)
    leg.get_title().set_fontsize(7)
    leg.get_title().set_color(INK)

    ax.text(0.015, 0.945,
            f"Luas penanda sebanding ukuran model "
            f"({df['mb'].min():.2f}–{df['mb'].max():.2f} MB)".replace(".", ","),
            transform=ax.transAxes, fontsize=6.5, color=INK_MUTED)

    fig.tight_layout()
    out = os.path.join(HERE, out)
    fig.savefig(out, bbox_inches="tight", facecolor=SURFACE)
    fig.savefig(out.replace(".png", ".pdf"), bbox_inches="tight", facecolor=SURFACE)
    plt.close(fig)
    print(f"Gambar 3 -> {out}")


if __name__ == "__main__":
    figure2()
    figure2(src="attn_mean_cicids2017.json", out="fig2_attention_heatmap_cicids2017.png",
            order=("Normal", "DoS", "DDoS", "PortScan", "BruteForce",
                   "WebAttack", "Bot", "Infiltration", "Heartbleed"),
            tick_every=1, height=3.5)
    figure3()
    figure3(csv="tabel3_multiseed_cicids2017.csv", out="fig3_tradeoff_cicids2017.png",
            minor=("Bot", "WebAttack"), xlim=(-6, 190), ylim=(0.70, 1.01),
            offsets={"XGBoost": (11, -3, "left"),
                     "Voting (RF+XGB)": (13, -3, "left"),
                     "Random Forest": (-13, -4, "right"),
                     "SMOTE": (12, -3, "left"),
                     "ClassAttn": (-11, -4, "right"),
                     "Baseline": (12, -3, "left"),
                     "ClassAttn + Focal": (-13, 6, "right"),
                     "Focal": (-12, -3, "right")})
