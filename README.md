# Class Imbalance Handling Strategies in Transformer-Based IDS

Kode dan notebook eksperimen untuk artikel:

> *A Controlled Evaluation of Class Imbalance Handling Strategies in
> Transformer-Based Intrusion Detection Systems: Comparing Loss-,
> Architecture-, and Data-Level Approaches*

## Isi

| Berkas | Keterangan |
|---|---|
| `lightweight_transformer_ids_minority_class.ipynb` | Notebook tunggal: praproses, keempat strategi, evaluasi multi-seed, uji signifikansi, profiling biaya, analisis atensi |

## Menjalankan

Buka langsung di Google Colab:

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/azizmnasrul/lightweight_transformer_ids_minority_class/blob/main/lightweight_transformer_ids_minority_class.ipynb)

Jalankan sel berurutan dari sel pertama. Tidak perlu penyesuaian tambahan.

## Dataset

- **NSL-KDD** — diunduh otomatis dari mirror publik saat notebook dijalankan.
- **CICIDS2017** — melalui Kaggle API; perlu `kaggle.json`. Ubah
  `DATASET_CHOICE = "CICIDS2017"` pada sel pemilihan dataset, lalu
  *Runtime → Restart session and run all*. Gunakan `SAMPLE_FRAC = 0.3`
  untuk uji coba pertama.

## Empat strategi yang dibandingkan

| Nama | Tataran | Komposisi |
|---|---|---|
| `Focal` | loss | mean-pooling + adaptive focal loss |
| `ClassAttn` | arsitektur | class-query attention pooling + cross-entropy |
| `ClassAttn + Focal` | gabungan | class-query attention pooling + adaptive focal loss |
| `SMOTE` | data | SMOTE + mean-pooling + cross-entropy |

Pembanding: baseline tanpa penanganan, serta Random Forest, XGBoost, dan
soft-voting dengan perlakuan cost-sensitive setara.

## Catatan evaluasi

Seluruh strategi memakai praproses, arsitektur, dan protokol pelatihan yang
identik. Hasil dilaporkan sebagai rerata ± simpangan baku atas 10 seed, diuji
dengan Wilcoxon signed-rank test dan koreksi Holm-Bonferroni atas seluruh
perbandingan.
