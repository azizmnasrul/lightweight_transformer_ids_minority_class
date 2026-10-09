# Hasil eksperimen — NSL-KDD

Keluaran run lengkap notebook pada Google Colab (T4 GPU), `DATASET_CHOICE = "NSLKDD"`,
10 seed (42–51), `EPOCHS = 15`, `D_MODEL=64, N_HEADS=4, N_LAYERS=2`.

Tidak ada seleksi model pada test set: tiap model dilatih sejumlah epoch tetap dan
dievaluasi sekali di akhir.

| Berkas | Isi |
|---|---|
| `ablasi_ringkasan.csv` | Studi ablasi 2×2 (pooling × loss), mean ± std atas 10 seed |
| `uji_holm.csv` | Wilcoxon signed-rank berpasangan + koreksi Holm-Bonferroni, 12 uji |
| `tabel3_multiseed.csv` | Perbandingan lengkap 8 model termasuk biaya komputasi |
| `attn_mean.json` | Bobot attention rata-rata per kelas (5 × 42 token) |
| `fig2_attention_heatmap.png` / `.pdf` | Gambar 2 naskah |
| `fig3_tradeoff.png` / `.pdf` | Gambar 3 naskah |
| `make_figs.py` | Skrip pembangun kedua gambar dari CSV dan JSON di atas |

## Temuan utama

1. Intervensi level-loss bekerja dan signifikan setelah koreksi: focal loss menaikkan
   Macro-F1 +0,0568 (p-Holm 0,0234) dan G-mean +0,4685 (p-Holm 0,0234) atas baseline.
2. Class-query attention tidak menyumbang apa pun di atas focal loss: keempat metrik
   p-Holm = 1,0000 dengan selisih −0,0041 sampai +0,0119.
3. Attention tanpa focal loss juga tidak berbeda dari baseline (p-Holm = 1,0000).
4. Peta panas attention menjelaskan sebabnya: entropi ternormalisasi 0,98–0,99 untuk
   Normal, DoS, dan U2R — attention praktis seragam. Justru U2R, kelas paling langka
   (0,04 %) yang menjadi alasan mekanisme ini dirancang, punya attention paling seragam
   (H/H_maks = 0,987; bobot puncak hanya 2,1× seragam). Hanya R2L yang menunjukkan
   selektivitas nyata (H/H_maks = 0,808; puncak 12,4×).

Catatan: XGBoost deterministik (std = 0) karena seed tidak memengaruhi hasilnya pada
konfigurasi ini. Tree ensemble dilatih di CPU multi-core sementara Transformer di GPU,
sehingga waktu latih tidak sebanding — hanya ukuran model dan latensi inferensi yang
dibandingkan.
