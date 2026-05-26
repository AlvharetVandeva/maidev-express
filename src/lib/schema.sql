CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone VARCHAR(30),
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'courier', 'customer')),
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shipments (
  id SERIAL PRIMARY KEY,
  tracking_number VARCHAR(50) UNIQUE NOT NULL,
  sender_name VARCHAR(100) NOT NULL,
  sender_phone VARCHAR(30),
  receiver_name VARCHAR(100) NOT NULL,
  receiver_phone VARCHAR(30),
  pickup_address TEXT NOT NULL,
  destination_address TEXT NOT NULL,
  origin_city VARCHAR(100),
  destination_city VARCHAR(100),
  status VARCHAR(50) NOT NULL CHECK (
    status IN (
      'menunggu_pickup',
      'diambil_kurir',
      'dalam_perjalanan',
      'selesai',
      'gagal'
    )
  ) DEFAULT 'menunggu_pickup',
  courier_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  customer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shipment_logs (
  id SERIAL PRIMARY KEY,
  shipment_id INTEGER NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL CHECK (
    status IN (
      'menunggu_pickup',
      'diambil_kurir',
      'dalam_perjalanan',
      'selesai',
      'gagal'
    )
  ),
  note TEXT,
  location VARCHAR(150),
  updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_courier_id ON shipments(courier_id);
CREATE INDEX IF NOT EXISTS idx_shipments_customer_id ON shipments(customer_id);
CREATE INDEX IF NOT EXISTS idx_shipment_logs_shipment_id ON shipment_logs(shipment_id);

CREATE TABLE IF NOT EXISTS kota (
  id SERIAL PRIMARY KEY,
  kode_kota VARCHAR(30) UNIQUE NOT NULL,
  nama_kota VARCHAR(100) NOT NULL,
  provinsi VARCHAR(100) NOT NULL,
  kode_pos VARCHAR(20),
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  dibuat_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pelanggan (
  id SERIAL PRIMARY KEY,
  pengguna_id INTEGER UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  kota_id INTEGER REFERENCES kota(id) ON DELETE SET NULL,
  kode_pelanggan VARCHAR(30) UNIQUE NOT NULL,
  nama_perusahaan VARCHAR(120),
  nama_kontak VARCHAR(100) NOT NULL,
  telepon VARCHAR(30),
  email VARCHAR(150),
  alamat TEXT,
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  dibuat_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kurir (
  id SERIAL PRIMARY KEY,
  pengguna_id INTEGER UNIQUE REFERENCES users(id) ON DELETE SET NULL,
  kode_kurir VARCHAR(30) UNIQUE NOT NULL,
  nama_kurir VARCHAR(100) NOT NULL,
  telepon VARCHAR(30),
  no_sim VARCHAR(50),
  alamat TEXT,
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  dibuat_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kendaraan (
  id SERIAL PRIMARY KEY,
  kode_kendaraan VARCHAR(30) UNIQUE NOT NULL,
  no_polisi VARCHAR(30) UNIQUE NOT NULL,
  jenis_kendaraan VARCHAR(80) NOT NULL,
  merek VARCHAR(80),
  model VARCHAR(80),
  kapasitas_kg NUMERIC(12, 2),
  kapasitas_volume NUMERIC(12, 2),
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  dibuat_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS jenis_pengiriman (
  id SERIAL PRIMARY KEY,
  kode_jenis VARCHAR(30) UNIQUE NOT NULL,
  nama_jenis VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  estimasi_hari INTEGER,
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  dibuat_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tarif_pengiriman (
  id SERIAL PRIMARY KEY,
  kota_asal_id INTEGER NOT NULL REFERENCES kota(id) ON DELETE RESTRICT,
  kota_tujuan_id INTEGER NOT NULL REFERENCES kota(id) ON DELETE RESTRICT,
  jenis_pengiriman_id INTEGER NOT NULL REFERENCES jenis_pengiriman(id) ON DELETE RESTRICT,
  harga_dasar NUMERIC(14, 2) NOT NULL DEFAULT 0,
  harga_per_kg NUMERIC(14, 2) NOT NULL DEFAULT 0,
  berat_minimum_kg NUMERIC(10, 2) NOT NULL DEFAULT 1,
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  dibuat_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (kota_asal_id, kota_tujuan_id, jenis_pengiriman_id)
);

CREATE TABLE IF NOT EXISTS barang (
  id SERIAL PRIMARY KEY,
  kode_barang VARCHAR(30) UNIQUE NOT NULL,
  nama_barang VARCHAR(120) NOT NULL,
  kategori VARCHAR(80),
  deskripsi TEXT,
  berat_default_kg NUMERIC(10, 2),
  mudah_pecah BOOLEAN NOT NULL DEFAULT FALSE,
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  dibuat_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pengiriman (
  id SERIAL PRIMARY KEY,
  nomor_resi VARCHAR(50) UNIQUE NOT NULL,
  pelanggan_id INTEGER REFERENCES pelanggan(id) ON DELETE SET NULL,
  kurir_id INTEGER REFERENCES kurir(id) ON DELETE SET NULL,
  kendaraan_id INTEGER REFERENCES kendaraan(id) ON DELETE SET NULL,
  jenis_pengiriman_id INTEGER NOT NULL REFERENCES jenis_pengiriman(id) ON DELETE RESTRICT,
  kota_asal_id INTEGER NOT NULL REFERENCES kota(id) ON DELETE RESTRICT,
  kota_tujuan_id INTEGER NOT NULL REFERENCES kota(id) ON DELETE RESTRICT,
  nama_pengirim VARCHAR(100) NOT NULL,
  telepon_pengirim VARCHAR(30),
  nama_penerima VARCHAR(100) NOT NULL,
  telepon_penerima VARCHAR(30),
  alamat_pickup TEXT NOT NULL,
  alamat_tujuan TEXT NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (
    status IN (
      'menunggu_pickup',
      'diambil_kurir',
      'dalam_perjalanan',
      'selesai',
      'gagal'
    )
  ) DEFAULT 'menunggu_pickup',
  dibuat_oleh INTEGER REFERENCES users(id) ON DELETE SET NULL,
  dibuat_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS detail_pengiriman (
  id SERIAL PRIMARY KEY,
  pengiriman_id INTEGER UNIQUE NOT NULL REFERENCES pengiriman(id) ON DELETE CASCADE,
  total_berat_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_volume NUMERIC(12, 2),
  jarak_km NUMERIC(10, 2),
  biaya_pengiriman NUMERIC(14, 2) NOT NULL DEFAULT 0,
  biaya_asuransi NUMERIC(14, 2) NOT NULL DEFAULT 0,
  total_biaya NUMERIC(14, 2) NOT NULL DEFAULT 0,
  tanggal_pickup DATE,
  estimasi_tiba DATE,
  status_pembayaran VARCHAR(30) NOT NULL DEFAULT 'belum_dibayar',
  dibuat_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pengiriman_barang (
  id SERIAL PRIMARY KEY,
  pengiriman_id INTEGER NOT NULL REFERENCES pengiriman(id) ON DELETE CASCADE,
  barang_id INTEGER NOT NULL REFERENCES barang(id) ON DELETE RESTRICT,
  jumlah INTEGER NOT NULL DEFAULT 1,
  berat_kg NUMERIC(10, 2),
  status_barang VARCHAR(50) NOT NULL DEFAULT 'diproses' CHECK (
    status_barang IN (
      'diproses',
      'dalam_pengiriman',
      'sampai_tujuan',
      'pending',
      'selesai'
    )
  ),
  panjang_cm NUMERIC(10, 2),
  lebar_cm NUMERIC(10, 2),
  tinggi_cm NUMERIC(10, 2),
  catatan TEXT,
  dibuat_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (pengiriman_id, barang_id)
);

ALTER TABLE pengiriman_barang
  ADD COLUMN IF NOT EXISTS status_barang VARCHAR(50) NOT NULL DEFAULT 'diproses';

ALTER TABLE pengiriman
  ALTER COLUMN pelanggan_id DROP NOT NULL;

CREATE TABLE IF NOT EXISTS log_pengiriman (
  id SERIAL PRIMARY KEY,
  pengiriman_id INTEGER NOT NULL REFERENCES pengiriman(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL CHECK (
    status IN (
      'menunggu_pickup',
      'diambil_kurir',
      'dalam_perjalanan',
      'selesai',
      'gagal'
    )
  ),
  catatan TEXT,
  lokasi VARCHAR(150),
  diperbarui_oleh INTEGER REFERENCES users(id) ON DELETE SET NULL,
  dibuat_pada TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pelanggan_pengguna_id ON pelanggan(pengguna_id);
CREATE INDEX IF NOT EXISTS idx_pelanggan_kota_id ON pelanggan(kota_id);
CREATE INDEX IF NOT EXISTS idx_kurir_pengguna_id ON kurir(pengguna_id);
CREATE INDEX IF NOT EXISTS idx_tarif_pengiriman_rute ON tarif_pengiriman(kota_asal_id, kota_tujuan_id);
CREATE INDEX IF NOT EXISTS idx_pengiriman_pelanggan_id ON pengiriman(pelanggan_id);
CREATE INDEX IF NOT EXISTS idx_pengiriman_kurir_id ON pengiriman(kurir_id);
CREATE INDEX IF NOT EXISTS idx_pengiriman_kendaraan_id ON pengiriman(kendaraan_id);
CREATE INDEX IF NOT EXISTS idx_pengiriman_nomor_resi ON pengiriman(nomor_resi);
CREATE INDEX IF NOT EXISTS idx_pengiriman_barang_pengiriman_id ON pengiriman_barang(pengiriman_id);
CREATE INDEX IF NOT EXISTS idx_pengiriman_barang_barang_id ON pengiriman_barang(barang_id);
CREATE INDEX IF NOT EXISTS idx_log_pengiriman_pengiriman_id ON log_pengiriman(pengiriman_id);
