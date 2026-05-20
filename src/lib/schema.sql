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
