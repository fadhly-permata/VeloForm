# Laporan: Hapus Login Email dari R-030 (Auth Google Saja)

**Tanggal:** 12 Agustus 2026 · 11:29
**Task:** Finalisasi keputusan user — login **email dihapus** dari rencana auth (R-030); login **Google saja**

---

## Konteks

User menyampaikan: *"waduh gak gua punya domain sendiri maupun smtp server. kita hapus dulu login via email deh."*

Karena user **tidak punya domain maupun SMTP server sendiri**, provider auth email
(dengan konfirmasi email) tidak bisa diandalkan → login email **dibatalkan**.

## Yang Diubah

1. `.agents/revisions.md`:
   - **R-030** — deskripsi dikoreksi: login **Google saja** (login email dihapus karena user **tidak** punya domain/SMTP sendiri — 11:27). K-005 ditandai dibatalkan.
   - **K-005** (Email confirmation / SMTP) → **❌ Dibatalkan** — tidak diperlukan lagi.
2. `.agents/PLAN.md` — baris R-030 (WP-22) disinkronkan dengan alasan yang benar.

> ⚠️ Catatan: teks sebelumnya sempat tertulis "karena user punya domain sendiri" (terbalik) — sudah dikoreksi menjadi "**tidak** punya domain/SMTP".

## Efek ke Kode

Belum ada kode auth (R-030 belum dieksekusi), jadi tidak ada kode yang dihapus.
Keputusan ini **memperkecil scope R-030**: implementasi nanti hanya Google OAuth
+ role user, tanpa form email/password dan tanpa kebutuhan SMTP.

## Status

- ✅ Keputusan tercatat di tracker (R-030 & K-005)
- 🔲 Eksekusi R-030 (Google auth) menunggu K-004 (Google OAuth credentials) & dimulai setelah R-029
