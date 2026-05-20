# Dokumentasi CRUD Data Master Maidev Express

Dokumen ini menjelaskan query CRUD untuk data master pada project Maidev Express. Semua nama tabel dan kolom mengikuti schema bahasa Indonesia yang ada di `src/lib/schema.sql`.

## 1. Gambaran Database

Data master adalah data dasar yang dipakai sebagai acuan transaksi pengiriman.

Tabel master utama:

| Tabel | Fungsi |
|---|---|
| `kota` | Master kota asal, kota tujuan, dan kota pelanggan |
| `pelanggan` | Master customer atau UMKM |
| `kurir` | Master driver/kurir |
| `kendaraan` | Master kendaraan/truk |
| `jenis_pengiriman` | Master layanan pengiriman |
| `tarif_pengiriman` | Master tarif berdasarkan rute dan jenis layanan |
| `barang` | Master barang |

Tabel transaksi dan relasi:

| Tabel | Fungsi |
|---|---|
| `pengiriman` | Transaksi utama pengiriman |
| `detail_pengiriman` | Detail biaya dan estimasi pengiriman |
| `pengiriman_barang` | Junction table antara pengiriman dan barang |
| `log_pengiriman` | Riwayat status pengiriman |

## 2. Relasi Penting

### One to One

Satu user customer memiliki satu data pelanggan:

```sql
pelanggan.pengguna_id -> users.id
```

Satu user kurir memiliki satu data kurir:

```sql
kurir.pengguna_id -> users.id
```

Satu pengiriman memiliki satu detail pengiriman:

```sql
detail_pengiriman.pengiriman_id -> pengiriman.id
```

Kolom `pengiriman_id` pada `detail_pengiriman` dibuat `UNIQUE`, jadi satu pengiriman tidak bisa punya lebih dari satu detail.

### One to Many

Satu pelanggan bisa memiliki banyak transaksi pengiriman:

```sql
pengiriman.pelanggan_id -> pelanggan.id
```

Satu kurir bisa menangani banyak pengiriman:

```sql
pengiriman.kurir_id -> kurir.id
```

Satu kendaraan bisa digunakan pada banyak pengiriman:

```sql
pengiriman.kendaraan_id -> kendaraan.id
```

Satu kota bisa menjadi asal atau tujuan banyak pengiriman:

```sql
pengiriman.kota_asal_id -> kota.id
pengiriman.kota_tujuan_id -> kota.id
```

### Many to Many

Satu pengiriman bisa punya banyak barang, dan satu barang bisa muncul di banyak pengiriman.

Relasinya menggunakan junction table:

```sql
pengiriman_barang.pengiriman_id -> pengiriman.id
pengiriman_barang.barang_id -> barang.id
```

## 3. Pola CRUD Umum

CRUD terdiri dari:

| Operasi | Query |
|---|---|
| Create | `INSERT INTO ...` |
| Read | `SELECT ... FROM ...` |
| Update | `UPDATE ... SET ... WHERE ...` |
| Delete | `DELETE FROM ... WHERE ...` |

Untuk data master, lebih aman menggunakan soft delete dengan mengubah kolom `aktif = FALSE`, karena data master biasanya sudah terhubung ke transaksi.

Contoh soft delete:

```sql
UPDATE kota
SET aktif = FALSE,
    diperbarui_pada = CURRENT_TIMESTAMP
WHERE id = 1;
```

## 4. CRUD Master Kota

### Create Kota

```sql
INSERT INTO kota (
  kode_kota,
  nama_kota,
  provinsi,
  kode_pos,
  aktif
)
VALUES (
  'KT-MDN',
  'Medan',
  'Sumatera Utara',
  '20111',
  TRUE
);
```

### Read Semua Kota

```sql
SELECT
  id,
  kode_kota,
  nama_kota,
  provinsi,
  kode_pos,
  aktif,
  dibuat_pada,
  diperbarui_pada
FROM kota
ORDER BY id DESC;
```

### Search Kota

```sql
SELECT *
FROM kota
WHERE kode_kota ILIKE '%medan%'
   OR nama_kota ILIKE '%medan%'
   OR provinsi ILIKE '%medan%'
   OR kode_pos ILIKE '%medan%'
ORDER BY id DESC;
```

### Update Kota

```sql
UPDATE kota
SET nama_kota = 'Medan',
    provinsi = 'Sumatera Utara',
    kode_pos = '20111',
    aktif = TRUE,
    diperbarui_pada = CURRENT_TIMESTAMP
WHERE id = 1;
```

### Delete Kota

```sql
DELETE FROM kota
WHERE id = 1;
```

Catatan: Jika kota sudah dipakai di tabel `pelanggan`, `tarif_pengiriman`, atau `pengiriman`, delete bisa gagal karena foreign key. Gunakan soft delete:

```sql
UPDATE kota
SET aktif = FALSE
WHERE id = 1;
```

## 5. CRUD Master Pelanggan

### Create Pelanggan

```sql
INSERT INTO pelanggan (
  pengguna_id,
  kota_id,
  kode_pelanggan,
  nama_perusahaan,
  nama_kontak,
  telepon,
  email,
  alamat,
  aktif
)
VALUES (
  4,
  1,
  'PLG-003',
  'Toko Maju Jaya',
  'Andi Saputra',
  '+62 812-1111-2222',
  'andi@example.com',
  'Jl. Melati No. 10',
  TRUE
);
```

### Read Pelanggan Dengan Nama Kota

```sql
SELECT
  p.id,
  p.kode_pelanggan,
  p.nama_perusahaan,
  p.nama_kontak,
  p.telepon,
  p.email,
  p.alamat,
  k.nama_kota,
  k.provinsi,
  p.aktif
FROM pelanggan p
LEFT JOIN kota k ON k.id = p.kota_id
ORDER BY p.id DESC;
```

### Search Pelanggan

```sql
SELECT *
FROM pelanggan
WHERE kode_pelanggan ILIKE '%umkm%'
   OR nama_perusahaan ILIKE '%umkm%'
   OR nama_kontak ILIKE '%umkm%'
   OR telepon ILIKE '%umkm%'
   OR email ILIKE '%umkm%'
ORDER BY id DESC;
```

### Update Pelanggan

```sql
UPDATE pelanggan
SET kota_id = 2,
    nama_perusahaan = 'Toko Maju Jaya',
    nama_kontak = 'Andi Saputra',
    telepon = '+62 812-1111-2222',
    email = 'andi@example.com',
    alamat = 'Jl. Melati No. 10',
    aktif = TRUE,
    diperbarui_pada = CURRENT_TIMESTAMP
WHERE id = 1;
```

### Delete Pelanggan

```sql
DELETE FROM pelanggan
WHERE id = 1;
```

Jika pelanggan sudah memiliki transaksi pengiriman, gunakan:

```sql
UPDATE pelanggan
SET aktif = FALSE
WHERE id = 1;
```

## 6. CRUD Master Kurir

### Create Kurir

```sql
INSERT INTO kurir (
  pengguna_id,
  kode_kurir,
  nama_kurir,
  telepon,
  no_sim,
  alamat,
  aktif
)
VALUES (
  2,
  'KUR-003',
  'Rizky Pratama',
  '+62 812-3333-4444',
  'SIM-A-003',
  'Jakarta Timur',
  TRUE
);
```

### Read Kurir

```sql
SELECT
  id,
  kode_kurir,
  nama_kurir,
  telepon,
  no_sim,
  alamat,
  aktif
FROM kurir
ORDER BY id DESC;
```

### Search Kurir

```sql
SELECT *
FROM kurir
WHERE kode_kurir ILIKE '%rizky%'
   OR nama_kurir ILIKE '%rizky%'
   OR telepon ILIKE '%rizky%'
   OR no_sim ILIKE '%rizky%'
ORDER BY id DESC;
```

### Update Kurir

```sql
UPDATE kurir
SET nama_kurir = 'Rizky Pratama',
    telepon = '+62 812-3333-4444',
    no_sim = 'SIM-A-003',
    alamat = 'Jakarta Timur',
    aktif = TRUE,
    diperbarui_pada = CURRENT_TIMESTAMP
WHERE id = 1;
```

### Delete Kurir

```sql
DELETE FROM kurir
WHERE id = 1;
```

## 7. CRUD Master Kendaraan

### Create Kendaraan

```sql
INSERT INTO kendaraan (
  kode_kendaraan,
  no_polisi,
  jenis_kendaraan,
  merek,
  model,
  kapasitas_kg,
  kapasitas_volume,
  aktif
)
VALUES (
  'KDR-003',
  'B 9999 MEX',
  'Truk Box',
  'Mitsubishi',
  'Colt Diesel',
  2500,
  18,
  TRUE
);
```

### Read Kendaraan

```sql
SELECT *
FROM kendaraan
ORDER BY id DESC;
```

### Search Kendaraan

```sql
SELECT *
FROM kendaraan
WHERE kode_kendaraan ILIKE '%box%'
   OR no_polisi ILIKE '%box%'
   OR jenis_kendaraan ILIKE '%box%'
   OR merek ILIKE '%box%'
   OR model ILIKE '%box%'
ORDER BY id DESC;
```

### Update Kendaraan

```sql
UPDATE kendaraan
SET no_polisi = 'B 9999 MEX',
    jenis_kendaraan = 'Truk Box',
    merek = 'Mitsubishi',
    model = 'Colt Diesel',
    kapasitas_kg = 2500,
    kapasitas_volume = 18,
    aktif = TRUE,
    diperbarui_pada = CURRENT_TIMESTAMP
WHERE id = 1;
```

### Delete Kendaraan

```sql
DELETE FROM kendaraan
WHERE id = 1;
```

## 8. CRUD Master Jenis Pengiriman

### Create Jenis Pengiriman

```sql
INSERT INTO jenis_pengiriman (
  kode_jenis,
  nama_jenis,
  deskripsi,
  estimasi_hari,
  aktif
)
VALUES (
  'JNS-SDS',
  'Same Day',
  'Pengiriman selesai di hari yang sama',
  1,
  TRUE
);
```

### Read Jenis Pengiriman

```sql
SELECT *
FROM jenis_pengiriman
ORDER BY id DESC;
```

### Search Jenis Pengiriman

```sql
SELECT *
FROM jenis_pengiriman
WHERE kode_jenis ILIKE '%express%'
   OR nama_jenis ILIKE '%express%'
   OR deskripsi ILIKE '%express%'
ORDER BY id DESC;
```

### Update Jenis Pengiriman

```sql
UPDATE jenis_pengiriman
SET nama_jenis = 'Same Day',
    deskripsi = 'Pengiriman selesai di hari yang sama',
    estimasi_hari = 1,
    aktif = TRUE,
    diperbarui_pada = CURRENT_TIMESTAMP
WHERE id = 1;
```

### Delete Jenis Pengiriman

```sql
DELETE FROM jenis_pengiriman
WHERE id = 1;
```

## 9. CRUD Master Tarif Pengiriman

### Create Tarif Pengiriman

```sql
INSERT INTO tarif_pengiriman (
  kota_asal_id,
  kota_tujuan_id,
  jenis_pengiriman_id,
  harga_dasar,
  harga_per_kg,
  berat_minimum_kg,
  aktif
)
VALUES (
  1,
  2,
  1,
  25000,
  3500,
  1,
  TRUE
);
```

### Read Tarif Dengan Relasi

```sql
SELECT
  t.id,
  asal.nama_kota AS kota_asal,
  tujuan.nama_kota AS kota_tujuan,
  jp.nama_jenis AS jenis_pengiriman,
  t.harga_dasar,
  t.harga_per_kg,
  t.berat_minimum_kg,
  t.aktif
FROM tarif_pengiriman t
JOIN kota asal ON asal.id = t.kota_asal_id
JOIN kota tujuan ON tujuan.id = t.kota_tujuan_id
JOIN jenis_pengiriman jp ON jp.id = t.jenis_pengiriman_id
ORDER BY t.id DESC;
```

### Search Tarif

```sql
SELECT
  t.*,
  asal.nama_kota AS kota_asal,
  tujuan.nama_kota AS kota_tujuan,
  jp.nama_jenis
FROM tarif_pengiriman t
JOIN kota asal ON asal.id = t.kota_asal_id
JOIN kota tujuan ON tujuan.id = t.kota_tujuan_id
JOIN jenis_pengiriman jp ON jp.id = t.jenis_pengiriman_id
WHERE asal.nama_kota ILIKE '%semarang%'
   OR tujuan.nama_kota ILIKE '%semarang%'
   OR jp.nama_jenis ILIKE '%semarang%';
```

### Update Tarif

```sql
UPDATE tarif_pengiriman
SET harga_dasar = 30000,
    harga_per_kg = 4000,
    berat_minimum_kg = 1,
    aktif = TRUE,
    diperbarui_pada = CURRENT_TIMESTAMP
WHERE id = 1;
```

### Delete Tarif

```sql
DELETE FROM tarif_pengiriman
WHERE id = 1;
```

## 10. CRUD Master Barang

### Create Barang

```sql
INSERT INTO barang (
  kode_barang,
  nama_barang,
  kategori,
  deskripsi,
  berat_default_kg,
  mudah_pecah,
  aktif
)
VALUES (
  'BRG-004',
  'Elektronik',
  'Elektronik',
  'Barang elektronik UMKM',
  3,
  TRUE,
  TRUE
);
```

### Read Barang

```sql
SELECT *
FROM barang
ORDER BY id DESC;
```

### Search Barang

```sql
SELECT *
FROM barang
WHERE kode_barang ILIKE '%elektronik%'
   OR nama_barang ILIKE '%elektronik%'
   OR kategori ILIKE '%elektronik%'
   OR deskripsi ILIKE '%elektronik%'
ORDER BY id DESC;
```

### Update Barang

```sql
UPDATE barang
SET nama_barang = 'Elektronik',
    kategori = 'Elektronik',
    deskripsi = 'Barang elektronik UMKM',
    berat_default_kg = 3,
    mudah_pecah = TRUE,
    aktif = TRUE,
    diperbarui_pada = CURRENT_TIMESTAMP
WHERE id = 1;
```

### Delete Barang

```sql
DELETE FROM barang
WHERE id = 1;
```

## 11. Contoh Query Relasi Untuk Quiz

### One to One: User Dengan Pelanggan

```sql
SELECT
  u.id AS user_id,
  u.name AS nama_user,
  u.email,
  p.id AS pelanggan_id,
  p.kode_pelanggan,
  p.nama_perusahaan,
  p.nama_kontak
FROM users u
JOIN pelanggan p ON p.pengguna_id = u.id
WHERE u.role = 'customer';
```

### One to One: Pengiriman Dengan Detail Pengiriman

```sql
SELECT
  p.nomor_resi,
  p.nama_pengirim,
  p.nama_penerima,
  d.total_berat_kg,
  d.biaya_pengiriman,
  d.total_biaya,
  d.status_pembayaran
FROM pengiriman p
JOIN detail_pengiriman d ON d.pengiriman_id = p.id;
```

### One to Many: Pelanggan Dengan Banyak Pengiriman

```sql
SELECT
  pl.kode_pelanggan,
  pl.nama_perusahaan,
  pg.nomor_resi,
  pg.status,
  pg.dibuat_pada
FROM pelanggan pl
JOIN pengiriman pg ON pg.pelanggan_id = pl.id
ORDER BY pl.id, pg.dibuat_pada DESC;
```

### One to Many: Kurir Dengan Banyak Pengiriman

```sql
SELECT
  k.kode_kurir,
  k.nama_kurir,
  pg.nomor_resi,
  pg.status
FROM kurir k
JOIN pengiriman pg ON pg.kurir_id = k.id
ORDER BY k.id;
```

### Many to Many: Pengiriman Dengan Barang

```sql
SELECT
  pg.nomor_resi,
  b.kode_barang,
  b.nama_barang,
  pb.jumlah,
  pb.berat_kg
FROM pengiriman pg
JOIN pengiriman_barang pb ON pb.pengiriman_id = pg.id
JOIN barang b ON b.id = pb.barang_id
ORDER BY pg.nomor_resi;
```

### Hitung Jumlah Pengiriman Per Pelanggan

```sql
SELECT
  pl.kode_pelanggan,
  pl.nama_perusahaan,
  COUNT(pg.id) AS total_pengiriman
FROM pelanggan pl
LEFT JOIN pengiriman pg ON pg.pelanggan_id = pl.id
GROUP BY pl.id, pl.kode_pelanggan, pl.nama_perusahaan
ORDER BY total_pengiriman DESC;
```

### Hitung Jumlah Barang Per Pengiriman

```sql
SELECT
  pg.nomor_resi,
  COUNT(pb.barang_id) AS jumlah_jenis_barang,
  SUM(pb.jumlah) AS total_barang
FROM pengiriman pg
LEFT JOIN pengiriman_barang pb ON pb.pengiriman_id = pg.id
GROUP BY pg.id, pg.nomor_resi;
```

## 12. Tips Jawaban Saat Quiz

Jika ditanya apa itu data master:

> Data master adalah data utama yang menjadi acuan transaksi. Pada Maidev Express, contoh data master adalah kota, pelanggan, kurir, kendaraan, jenis pengiriman, tarif pengiriman, dan barang.

Jika ditanya contoh one to many:

> Satu pelanggan bisa memiliki banyak pengiriman. Relasinya adalah `pengiriman.pelanggan_id` mengarah ke `pelanggan.id`.

Jika ditanya contoh one to one:

> Satu pengiriman memiliki satu detail pengiriman. Relasinya adalah `detail_pengiriman.pengiriman_id` mengarah ke `pengiriman.id` dan kolom tersebut dibuat `UNIQUE`.

Jika ditanya contoh many to many:

> Satu pengiriman bisa berisi banyak barang, dan satu barang bisa muncul di banyak pengiriman. Relasi ini memakai junction table `pengiriman_barang`.

Jika ditanya kenapa tidak semua data langsung disimpan di tabel pengiriman:

> Karena data seperti kota, kendaraan, kurir, dan barang adalah data acuan yang bisa dipakai berkali-kali. Jika disimpan langsung sebagai teks di transaksi, data akan duplikat dan sulit dijaga konsistensinya.
