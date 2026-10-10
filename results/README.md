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

---

# Hasil eksperimen — CICIDS2017

Run terpisah, `DATASET_CHOICE = "CICIDS2017"`, sumber data mirror Kaggle
`mdalamintalukder/cicids2017` (folder MachineLearningCVE, delapan CSV harian
berukuran identik dengan rilis resmi CIC). Protokol sama: 10 seed (42–51),
`EPOCHS = 15`, tanpa seleksi model pada test set.

Praproses: 2.520.798 baris → cap 50.000 per kelas → **213.288 baris, 9 kelas**,
rasio imbalance **4.545:1**. Train 159.966 × 79 fitur, test 53.322.
Rasio aslinya ~190.000:1; pelonggaran akibat cap wajib disebut di Metodologi.

Kelas fokus: **Bot** dan **WebAttack** (ambang `MIN_TEST_SUPPORT = 50`).
Heartbleed (3 sampel uji) dan Infiltration (9) dikecualikan dari metrik utama.

| Berkas | Isi |
|---|---|
| `tabel3_multiseed_cicids2017.csv` | Perbandingan 8 model + biaya komputasi |
| `uji_holm_cicids2017.csv` | Wilcoxon + Holm-Bonferroni, 12 uji |
| `fig3_tradeoff_cicids2017.png` / `.pdf` | Trade-off performa vs latensi |

## Temuan utama

1. **Tree ensemble mendominasi.** XGBoost 0,9750 macro-F1 dan 0,9853 G-mean,
   mengungguli seluruh varian Transformer pada setiap metrik, dengan latensi
   7,1 ms (22× lebih cepat dari varian Transformer terbaik).
2. **Arah efek focal loss berbalik dari NSL-KDD.** Di sini focal loss
   menurunkan macro-F1 (0,7391 vs 0,8071 baseline) dan menurunkan F1 Bot
   secara signifikan (Δ −0,1852, p-Holm 0,0234), tetapi tetap menaikkan G-mean
   secara dramatis (Δ +0,5591, p-Holm 0,0234).
3. **Class-specific attention berhasil di sini, gagal di NSL-KDD.** Attn-only
   mengungguli baseline pada macro-F1 (Δ +0,0988, p-Holm 0,0234) dan G-mean
   (Δ +0,4928, p-Holm 0,0234). Pada NSL-KDD kedua perbandingan ini p-Holm 1,0000.
4. **Cross-entropy polos sangat tidak stabil.** Baseline: G-mean 0,3856 ± 0,3610
   dan F1 WebAttack 0,8564 ± 0,2368 — simpangan baku sebanding reratanya.
   Varian ber-focal maupun ber-attention jauh lebih stabil (std ≤ 0,03).
5. **Penambahan attention di atas focal loss tetap nihil.** Full vs Focal-only:
   p-Holm 0,3418–1,0000 pada keempat metrik. Konsisten dengan NSL-KDD.

Signifikan sebelum koreksi: 7 dari 12 uji. Setelah Holm: **4 dari 12**.

## Catatan untuk naskah

Klaim "class-query attention tidak mentransfer ke IDS tabular" TIDAK dapat
dibuat secara umum — klaim itu hanya berlaku untuk NSL-KDD. Temuan lintas
dataset yang sebenarnya: efektivitas tiap tingkat intervensi bergantung pada
dataset, dan tidak ada satu pun konfigurasi Transformer yang mengalahkan
XGBoost pada CICIDS2017.

## Peta panas attention — pembanding lintas dataset

`attn_mean_cicids2017.json` (9 × 79, lengkap dengan nama fitur) dan
`fig2_attention_heatmap_cicids2017.png` / `.pdf`.

Entropi ternormalisasi attention per kelas, diurutkan dari paling terkonsentrasi:

| CICIDS2017 | H/H_maks | puncak | | NSL-KDD | H/H_maks | puncak |
|---|---|---|---|---|---|---|
| Bot | **0,678** | 20,8× | | R2L | 0,808 | 12,4× |
| Infiltration | **0,803** | 14,2× | | Probe | 0,958 | 5,0× |
| BruteForce | 0,882 | 11,4× | | DoS | 0,981 | 2,4× |
| PortScan | 0,892 | 11,6× | | **U2R** | **0,987** | **2,1×** |
| WebAttack | 0,925 | 8,8× | | Normal | 0,990 | 2,2× |
| DoS | 0,914 | 5,2× | | | | |
| Heartbleed | 0,939 | 6,0× | | | | |
| DDoS | 0,955 | 7,0× | | | | |
| Normal | 0,958 | 6,6× | | | | |
| **rerata 0,883** | | | | **rerata 0,945** | | |

Inilah penjelasan mekanistik atas pembalikan hasil itu, dan arahnya persis
berlawanan:

- **NSL-KDD** — kelas paling langka, U2R, justru yang attention-nya **paling
  seragam** (0,987; puncak hanya 2,1× seragam). Query khusus kelas tersedia
  tetapi praktis menganggur tepat di tempat ia dirancang untuk bekerja.
  Konsisten dengan Attn-only yang tidak berbeda dari baseline (p-Holm 1,0000).
- **CICIDS2017** — dua kelas minoritas, Bot dan Infiltration, justru yang
  attention-nya **paling terkonsentrasi** (0,678 dan 0,803; puncak 20,8× dan
  14,2×). Mekanismenya aktif, dan Attn-only memang mengungguli baseline secara
  signifikan.

Dengan kata lain: class-query attention menolong bila — dan hanya bila — ada
fitur yang benar-benar diskriminatif untuk dipilih. NSL-KDD tidak menyediakannya
untuk U2R; CICIDS2017 menyediakannya untuk Bot.

Peringatan yang perlu ditulis di naskah: `min_seg_size_forward` menjadi puncak
bagi 7 dari 9 query kelas. Fitur ini sudah lama dicurigai sebagai artefak
CICIDS2017; bila ia yang dipakai model, sebagian keunggulan Attn-only bisa jadi
shortcut learning, bukan deteksi serangan yang sesungguhnya. Uji ulang tanpa
fitur tersebut adalah pekerjaan lanjutan yang layak disebut sebagai limitation.
