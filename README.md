# Maidev Express

Maidev Express adalah aplikasi Sistem Informasi Web untuk logistik/pengiriman darat UMKM. Project memakai Next.js App Router, TypeScript, Tailwind CSS, PostgreSQL Neon/Vercel compatible, dan query langsung dengan package `postgres` tanpa ORM.

## Fitur Utama

- Login role-based: admin, kurir, customer.
- Dashboard responsif untuk setiap role.
- Public tracking nomor resi.
- Admin users management.
- Admin data master: kota, pelanggan, kurir, kendaraan, jenis pengiriman, tarif, dan barang.
- Admin CRUDS cargo sesuai UGD SIWEB:
  - Create data cargo dengan no resi auto generated.
  - Read data dari database.
  - Update/edit data lama.
  - Delete data pengiriman.
  - Search berdasarkan no resi, nama pengirim, nama penerima, dan nama barang.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- PostgreSQL
- `postgres`
- `zod`
- `bcryptjs`
- `jose`
- `lucide-react`
- `recharts`
- pnpm

## Setup

Isi `.env.local`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require&channel_binding=require"
JWT_SECRET="change-this-secret-minimum-32-characters"
APP_URL="http://localhost:3000"
```

Install dependency:

```bash
pnpm install
```

Jalankan schema dan seed:

```bash
pnpm seed
```

Jalankan development server:

```bash
pnpm dev
```

Buka `http://localhost:3000`.

## Akun Demo

Password semua akun demo:

```txt
password123
```

```txt
Admin    : admin@maidev.test
Kurir    : kurir@maidev.test
Customer : customer@maidev.test
```

## Halaman Penting

- `/login`
- `/tracking`
- `/admin/dashboard`
- `/admin/shipments`
- `/admin/master-data/kendaraan`
- `/admin/master-data/barang`
- `/admin/users`
- `/courier/tasks`
- `/customer/shipments`

## Validasi

Gunakan pnpm:

```bash
pnpm lint
pnpm build
```

Project ini tidak menggunakan Prisma, Drizzle, Sequelize, TypeORM, Knex, atau ORM lain.
