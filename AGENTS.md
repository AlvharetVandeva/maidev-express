# AGENTS.md — Maidev Express

Dokumen ini adalah instruksi kerja untuk AI coding agent / vibe coding agent dalam membangun aplikasi **Maidev Express**, yaitu sistem informasi pengiriman/trucking darat untuk UMKM menggunakan **Next.js App Router**, **shadcn/ui**, **Tailwind CSS**, **PostgreSQL Neon/Vercel**, dan koneksi database langsung menggunakan package `postgres` tanpa ORM.

> **Catatan untuk Codex:** letakkan file ini di root repository dengan nama **`AGENTS.md`** agar Codex membacanya otomatis. Jika masih ada salinan bernama `AGENT.md`, gunakan hanya sebagai backup/catatan, bukan file utama Codex.

Aplikasi harus mengikuti pola:

```txt
Feature-Based Clean Architecture for Next.js App Router
src/
├─ app/                  # routing
├─ features/             # modul fitur
│  └─ users/
│     ├─ components/     # UI khusus users
│     ├─ actions.ts      # server actions
│     ├─ service.ts      # business logic
│     ├─ repository.ts   # query database/API
│     ├─ schema.ts       # validation
│     └─ types.ts
├─ components/ui/        # reusable UI dari shadcn
└─ lib/                  # db, auth, utils
```

---

## 1. Tujuan Produk

Bangun aplikasi web responsif untuk **Maidev Express**, sebuah layanan pengiriman darat skala UMKM.

Aplikasi harus mendukung:

1. Login berbasis role.
2. Dashboard responsif untuk web dan mobile.
3. Tracking paket berdasarkan nomor resi.
4. Profile perusahaan dan profile user.
5. Halaman khusus untuk setiap role:
   - Admin
   - Kurir
   - Customer
6. Database PostgreSQL dari Neon/Vercel.
7. Query database menggunakan `postgres` package, **tanpa ORM**.
8. UI menggunakan shadcn/ui dan mengikuti desain mockup Maidev Express yang sudah dibuat sebelumnya.

---

## 2. Referensi Desain UI

Gunakan gambar mockup UI terakhir pada file Referensi-UI.png (root folder) dari percakapan sebagai acuan utama desain.

Karakter visual yang harus diikuti:

- Style modern, clean, soft, friendly.
- Mobile-first, tetapi tetap memiliki versi desktop/web yang responsif.
- Tema warna utama hijau mint dan emerald.
- Background soft mint / hijau sangat muda.
- Banyak rounded corner besar.
- Card putih dengan border halus dan shadow lembut.
- Sidebar desktop di kiri.
- Topbar desktop dengan title halaman, notifikasi, avatar, dan dropdown user.
- Mobile menggunakan hamburger menu dan drawer dari samping.
- Mobile dapat menggunakan bottom navigation untuk Dashboard, Tracking, dan Profile.
- Gunakan icon dari `lucide-react`.
- Gunakan font `Poppins` atau fallback `Inter` jika Poppins belum dikonfigurasi.

### Palet Warna

Gunakan token Tailwind berikut sebagai acuan:

```txt
Primary Green     : emerald-500 / #10B981
Dark Green        : emerald-700 / #047857
Soft Mint BG      : emerald-50 / #ECFDF5
Card Background   : white / #FFFFFF
Text Primary      : slate-900
Text Secondary    : slate-500
Success           : green-500
Warning           : amber-500
Danger            : red-500
Info              : sky-500
Border Soft       : emerald-100 / slate-200
```

### Komponen Visual yang Wajib Tampak

Desktop:

- Sidebar kiri dengan logo Maidev Express.
- Menu Dashboard, Tracking, Profile.
- Jika role Admin: tambahan menu Kelola Pengiriman dan Kelola User.
- Jika role Kurir: tambahan menu Tugas Pengiriman.
- Jika role Customer: tambahan menu Paket Saya.
- Main content dengan card statistik.
- Halaman tracking berbentuk tabel di desktop.
- Halaman profile menggunakan card besar.

Mobile:

- Topbar dengan hamburger.
- Drawer / sheet menu dari kiri.
- Card statistik tersusun vertikal.
- Tracking list berbentuk card agar nyaman dibaca.
- Bottom navigation untuk Dashboard, Tracking, Profile.

---

## 3. Tech Stack Wajib

Gunakan stack berikut:

```txt
Next.js App Router
TypeScript
Tailwind CSS
shadcn/ui
lucide-react
PostgreSQL Neon / Vercel Postgres compatible
postgres package: import postgres from 'postgres'
zod untuk validasi
bcryptjs untuk password hashing
jose untuk JWT session cookie
```

Tidak boleh menggunakan ORM seperti Prisma, Drizzle, Sequelize, TypeORM, atau Knex.

---

## 4. Package Manager dan Package yang Perlu Diinstall

Project ini **wajib menggunakan pnpm**.

Aturan package manager:

- Gunakan `pnpm add` untuk install dependency.
- Gunakan `pnpm dlx` untuk menjalankan CLI sekali jalan.
- Gunakan `pnpm dev`, `pnpm lint`, dan `pnpm build` untuk script project.
- Jangan menggunakan `npm` atau `yarn`.
- Jangan membuat `package-lock.json` atau `yarn.lock`.
- Lockfile yang benar hanya `pnpm-lock.yaml`.

Buat project Next.js dengan pnpm:

```bash
pnpm create next-app cargoku-lite \
  --ts \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

Install dependency utama:

```bash
pnpm add postgres zod bcryptjs jose lucide-react recharts
```

Inisialisasi shadcn/ui:

```bash
pnpm dlx shadcn@latest init
```

Tambahkan komponen shadcn/ui:

```bash
pnpm dlx shadcn@latest add button card input label badge table sheet dropdown-menu avatar separator sonner textarea select tabs skeleton alert dialog
```

Jika ingin menggunakan chart dari shadcn:

```bash
pnpm dlx shadcn@latest add chart
```

---

## 5. Struktur Folder Target

Buat struktur folder seperti ini:

```txt
src/
├─ app/
│  ├─ layout.tsx
│  ├─ globals.css
│  ├─ page.tsx
│  ├─ login/
│  │  └─ page.tsx
│  ├─ tracking/
│  │  └─ page.tsx
│  ├─ dashboard/
│  │  └─ page.tsx
│  ├─ profile/
│  │  └─ page.tsx
│  ├─ admin/
│  │  ├─ layout.tsx
│  │  ├─ dashboard/
│  │  │  └─ page.tsx
│  │  ├─ shipments/
│  │  │  └─ page.tsx
│  │  ├─ users/
│  │  │  └─ page.tsx
│  │  └─ profile/
│  │     └─ page.tsx
│  ├─ courier/
│  │  ├─ layout.tsx
│  │  ├─ dashboard/
│  │  │  └─ page.tsx
│  │  ├─ tasks/
│  │  │  └─ page.tsx
│  │  └─ profile/
│  │     └─ page.tsx
│  └─ customer/
│     ├─ layout.tsx
│     ├─ dashboard/
│     │  └─ page.tsx
│     ├─ tracking/
│     │  └─ page.tsx
│     ├─ shipments/
│     │  └─ page.tsx
│     └─ profile/
│        └─ page.tsx
│
├─ components/
│  ├─ layout/
│  │  ├─ app-shell.tsx
│  │  ├─ desktop-sidebar.tsx
│  │  ├─ mobile-header.tsx
│  │  ├─ mobile-drawer.tsx
│  │  ├─ bottom-nav.tsx
│  │  └─ page-header.tsx
│  ├─ shared/
│  │  ├─ logo.tsx
│  │  ├─ empty-state.tsx
│  │  ├─ status-badge.tsx
│  │  └─ loading-card.tsx
│  └─ ui/
│     └─ ...generated shadcn components
│
├─ features/
│  ├─ auth/
│  │  ├─ components/
│  │  │  └─ login-form.tsx
│  │  ├─ actions.ts
│  │  ├─ service.ts
│  │  ├─ repository.ts
│  │  ├─ schema.ts
│  │  └─ types.ts
│  ├─ users/
│  │  ├─ components/
│  │  │  ├─ user-table.tsx
│  │  │  ├─ user-form.tsx
│  │  │  └─ user-profile-card.tsx
│  │  ├─ actions.ts
│  │  ├─ service.ts
│  │  ├─ repository.ts
│  │  ├─ schema.ts
│  │  └─ types.ts
│  ├─ shipments/
│  │  ├─ components/
│  │  │  ├─ shipment-table.tsx
│  │  │  ├─ shipment-card-list.tsx
│  │  │  ├─ shipment-form.tsx
│  │  │  ├─ tracking-form.tsx
│  │  │  └─ shipment-status-timeline.tsx
│  │  ├─ actions.ts
│  │  ├─ service.ts
│  │  ├─ repository.ts
│  │  ├─ schema.ts
│  │  └─ types.ts
│  ├─ dashboard/
│  │  ├─ components/
│  │  │  ├─ stat-card.tsx
│  │  │  ├─ shipment-chart.tsx
│  │  │  └─ recent-activity-card.tsx
│  │  ├─ service.ts
│  │  ├─ repository.ts
│  │  └─ types.ts
│  └─ company-profile/
│     ├─ components/
│     │  ├─ company-profile-card.tsx
│     │  └─ company-contact-card.tsx
│     ├─ service.ts
│     └─ types.ts
│
└─ lib/
   ├─ db.ts
   ├─ auth.ts
   ├─ session.ts
   ├─ password.ts
   ├─ roles.ts
   ├─ navigation.ts
   └─ utils.ts
```

---

## 6. Routing yang Harus Dibuat

### Public Routes

| Path | Deskripsi |
|---|---|
| `/` | Redirect ke `/dashboard` jika login, atau landing sederhana jika belum login |
| `/login` | Halaman login |
| `/tracking` | Tracking publik dengan input nomor resi |

### Shared Protected Routes

| Path | Deskripsi |
|---|---|
| `/dashboard` | Redirect otomatis ke dashboard sesuai role |
| `/profile` | Redirect otomatis ke profile sesuai role |

### Admin Routes

| Path | Deskripsi |
|---|---|
| `/admin/dashboard` | Statistik seluruh pengiriman dan aktivitas terbaru |
| `/admin/shipments` | Kelola data pengiriman |
| `/admin/users` | Kelola akun user |
| `/admin/profile` | Profile admin dan profile perusahaan |

### Courier Routes

| Path | Deskripsi |
|---|---|
| `/courier/dashboard` | Ringkasan tugas kurir |
| `/courier/tasks` | Daftar paket yang ditugaskan ke kurir |
| `/courier/profile` | Profile kurir |

### Customer Routes

| Path | Deskripsi |
|---|---|
| `/customer/dashboard` | Ringkasan paket customer |
| `/customer/tracking` | Tracking paket customer |
| `/customer/shipments` | Daftar paket milik customer |
| `/customer/profile` | Profile customer |

---

## 7. Database Schema PostgreSQL

Buat file SQL, misalnya:

```txt
src/lib/schema.sql
```

Isi schema:

```sql
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
```

---

## 8. Environment Variables

Buat file `.env.local`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/DBNAME?sslmode=require&channel_binding=require"
JWT_SECRET="change-this-secret-minimum-32-characters"
APP_URL="http://localhost:3000"
```

Jangan hardcode credential database di source code.

---

## 9. Database Connection dengan postgres Package

Buat file:

```txt
src/lib/db.ts
```

Isi:

```ts
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined");
}

export const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});
```

Aturan:

- Semua query SQL hanya boleh berada di `repository.ts`.
- Jangan query database langsung dari komponen React.
- Jangan query database langsung dari `page.tsx` kecuali melalui `service.ts`.
- Jangan menggunakan ORM.

---

## 10. Auth dan Session

Implementasikan auth sederhana berbasis:

- Email
- Password
- Role
- JWT dalam cookie HTTP-only

### Cookie Session

Gunakan nama cookie:

```txt
cargoku_session
```

Cookie harus:

- `httpOnly: true`
- `sameSite: "lax"`
- `secure: process.env.NODE_ENV === "production"`
- memiliki masa aktif, misalnya 7 hari

### File Auth

Buat:

```txt
src/lib/session.ts
src/lib/auth.ts
src/lib/password.ts
src/lib/roles.ts
```

### `src/lib/password.ts`

```ts
import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
```

### `src/lib/session.ts`

Buat fungsi:

```ts
createSession(payload)
verifySession()
destroySession()
getCurrentUser()
requireUser()
requireRole(allowedRoles)
```

Payload minimal:

```ts
export type SessionPayload = {
  userId: number;
  name: string;
  email: string;
  role: "admin" | "courier" | "customer";
};
```

### Role Redirect

Aturan redirect setelah login:

```ts
admin    -> /admin/dashboard
courier  -> /courier/dashboard
customer -> /customer/dashboard
```

Jika user membuka `/dashboard`, redirect ke dashboard sesuai role.

Jika user membuka `/profile`, redirect ke profile sesuai role.

---

## 11. Middleware Protection

Buat `src/middleware.ts` atau `middleware.ts` di root project sesuai konfigurasi Next.js.

Proteksi route:

```txt
/admin/*    hanya admin
/courier/*  hanya courier
/customer/* hanya customer
/dashboard  semua user login
/profile    semua user login
```

Public route:

```txt
/
/login
/tracking
```

Jika belum login dan membuka protected route, redirect ke `/login`.

Jika role tidak sesuai, redirect ke dashboard role miliknya.

---

## 12. Feature-Based Clean Architecture Rules

Setiap feature harus mengikuti pola ini:

```txt
features/[feature-name]/
├─ components/
├─ actions.ts
├─ service.ts
├─ repository.ts
├─ schema.ts
└─ types.ts
```

### Tanggung Jawab File

#### `repository.ts`

Berisi query database mentah menggunakan `sql` dari `src/lib/db.ts`.

Contoh:

```ts
import { sql } from "@/lib/db";

export async function findUserByEmail(email: string) {
  const rows = await sql`
    SELECT id, name, email, password_hash, phone, role, avatar_url, is_active
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `;

  return rows[0] ?? null;
}
```

#### `service.ts`

Berisi business logic.

Contoh:

```ts
export async function loginUser(input) {
  // validasi tambahan
  // ambil user dari repository
  // cek password
  // cek user aktif
  // return data user tanpa password_hash
}
```

#### `actions.ts`

Berisi Server Actions.

Aturan:

- Wajib ada `"use server"`.
- Validasi input menggunakan schema dari `schema.ts`.
- Panggil service.
- Jangan menulis query SQL di actions.
- Gunakan `redirect`, `revalidatePath`, dan return state yang jelas.

#### `schema.ts`

Berisi validasi Zod.

#### `types.ts`

Berisi TypeScript types.

#### `components/`

Berisi UI spesifik fitur.

---

## 13. Feature Auth

Buat feature:

```txt
src/features/auth/
```

### `schema.ts`

```ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

### Login Page UI

Path:

```txt
src/app/login/page.tsx
```

Desain login:

- Background soft mint.
- Card login putih di tengah.
- Logo Maidev Express di atas.
- Title: `Masuk ke Maidev Express`.
- Subtitle: `Kelola dan lacak pengiriman dengan mudah.`
- Input email.
- Input password.
- Button `Masuk` warna emerald.
- Tampilkan error jika login gagal.

### Demo Account untuk Seed

Sediakan akun demo:

```txt
Admin
email: admin@cargoku.test
password: password123

Kurir
email: kurir@cargoku.test
password: password123

Customer
email: customer@cargoku.test
password: password123
```

Password di database harus berupa hash bcrypt, bukan plain text.

---

## 14. Feature Users

Buat feature:

```txt
src/features/users/
```

### Tipe User

```ts
export type UserRole = "admin" | "courier" | "customer";

export type User = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### Admin Users Page

Path:

```txt
src/app/admin/users/page.tsx
```

Fitur minimal:

- Tampilkan tabel user.
- Kolom: nama, email, phone, role, status, created at.
- Badge role.
- Button tambah user.
- Form tambah user menggunakan dialog atau card.
- Validasi input menggunakan zod.

CRUD minimal:

- Create user.
- Read/list user.
- Update status aktif/nonaktif.

Delete boleh tidak dibuat jika tugas masih sederhana.

---

## 15. Feature Shipments

Buat feature:

```txt
src/features/shipments/
```

### Status Pengiriman

Gunakan enum string:

```txt
menunggu_pickup
ambil_kurir atau diambil_kurir
 dalam_perjalanan
selesai
gagal
```

Gunakan standar final berikut:

```ts
export type ShipmentStatus =
  | "menunggu_pickup"
  | "diambil_kurir"
  | "dalam_perjalanan"
  | "selesai"
  | "gagal";
```

Label UI:

```ts
const STATUS_LABEL = {
  menunggu_pickup: "Menunggu Pickup",
  diambil_kurir: "Diambil Kurir",
  dalam_perjalanan: "Dalam Perjalanan",
  selesai: "Selesai",
  gagal: "Gagal",
};
```

Variant badge:

```ts
const STATUS_BADGE_CLASS = {
  menunggu_pickup: "bg-slate-100 text-slate-700",
  diambil_kurir: "bg-blue-100 text-blue-700",
  dalam_perjalanan: "bg-amber-100 text-amber-700",
  selesai: "bg-emerald-100 text-emerald-700",
  gagal: "bg-red-100 text-red-700",
};
```

### Shipment Type

```ts
export type Shipment = {
  id: number;
  trackingNumber: string;
  senderName: string;
  senderPhone: string | null;
  receiverName: string;
  receiverPhone: string | null;
  pickupAddress: string;
  destinationAddress: string;
  originCity: string | null;
  destinationCity: string | null;
  status: ShipmentStatus;
  courierId: number | null;
  customerId: number | null;
  createdBy: number | null;
  createdAt: string;
  updatedAt: string;
};
```

### Admin Shipments Page

Path:

```txt
src/app/admin/shipments/page.tsx
```

Fitur:

- List seluruh pengiriman.
- Filter status.
- Search berdasarkan nomor resi, nama pengirim, nama penerima, kota tujuan.
- Tambah pengiriman.
- Assign kurir.
- Update status.
- Lihat timeline status.

### Courier Tasks Page

Path:

```txt
src/app/courier/tasks/page.tsx
```

Fitur:

- Tampilkan paket yang `courier_id` sama dengan user login.
- Tampilkan status, alamat pickup, alamat tujuan.
- Tombol update status:
  - Menunggu Pickup -> Diambil Kurir
  - Diambil Kurir -> Dalam Perjalanan
  - Dalam Perjalanan -> Selesai / Gagal
- Saat update status, insert juga ke `shipment_logs`.

### Customer Shipments Page

Path:

```txt
src/app/customer/shipments/page.tsx
```

Fitur:

- Tampilkan pengiriman milik customer login.
- Tidak boleh melihat paket customer lain.
- Bisa melihat timeline status.

### Public Tracking Page

Path:

```txt
src/app/tracking/page.tsx
```

Fitur:

- Input nomor resi.
- Button `Lacak`.
- Jika ditemukan, tampilkan detail pengiriman dan timeline.
- Jika tidak ditemukan, tampilkan empty state.
- Tidak perlu login.

### Customer Tracking Page

Path:

```txt
src/app/customer/tracking/page.tsx
```

Fitur:

- Sama seperti public tracking.
- Jika hasil tracking bukan milik customer login, tampilkan data umum saja atau tolak akses sesuai kebutuhan.

---

## 16. Feature Dashboard

Buat feature:

```txt
src/features/dashboard/
```

### Admin Dashboard

Path:

```txt
src/app/admin/dashboard/page.tsx
```

Tampilkan:

- Total paket.
- Sedang dikirim.
- Selesai.
- Gagal.
- Grafik pengiriman 7 hari terakhir.
- Aktivitas terbaru.
- Card CTA: `Kirim barangmu dengan aman & tepat waktu`.

### Courier Dashboard

Path:

```txt
src/app/courier/dashboard/page.tsx
```

Tampilkan:

- Total tugas hari ini.
- Tugas belum pickup.
- Dalam perjalanan.
- Selesai.
- Daftar tugas terbaru.

### Customer Dashboard

Path:

```txt
src/app/customer/dashboard/page.tsx
```

Tampilkan:

- Total paket saya.
- Paket aktif.
- Paket selesai.
- Paket bermasalah/gagal.
- Daftar paket terbaru.
- Form tracking cepat.

---

## 17. Company Profile

Buat feature:

```txt
src/features/company-profile/
```

Konten profile perusahaan:

```txt
Nama: Maidev Express
Jenis: Layanan pengiriman darat untuk UMKM
Deskripsi: Maidev Express hadir untuk membantu UMKM mengirimkan barang dengan layanan yang ringan, ramah, cepat, dan terpercaya ke berbagai wilayah Indonesia.
Telepon/WhatsApp: +62 812-3456-7890
Email: info@cargokulite.id
Alamat: Jl. Merdeka No. 123, Jakarta Pusat
Jam Operasional: Senin - Sabtu, 08.00 - 17.00 WIB
```

Halaman profile per role boleh menampilkan:

- Informasi user login.
- Informasi perusahaan.
- Contact card.
- About card.

---

## 18. Layout dan Navigation

Buat komponen layout:

```txt
src/components/layout/app-shell.tsx
src/components/layout/desktop-sidebar.tsx
src/components/layout/mobile-header.tsx
src/components/layout/mobile-drawer.tsx
src/components/layout/bottom-nav.tsx
src/components/layout/page-header.tsx
```

### App Shell

`AppShell` menerima props:

```ts
type AppShellProps = {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    role: "admin" | "courier" | "customer";
  };
};
```

Behavior:

- Desktop: sidebar kiri fixed/sticky, content kanan.
- Mobile: header atas + sheet menu + bottom nav.
- Highlight active menu berdasarkan pathname.

### Navigation Config

Buat:

```txt
src/lib/navigation.ts
```

Isi config:

```ts
import { Home, Package, Search, User, Users, ClipboardList } from "lucide-react";

export const navigationByRole = {
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: Home },
    { label: "Pengiriman", href: "/admin/shipments", icon: Package },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Tracking", href: "/tracking", icon: Search },
    { label: "Profile", href: "/admin/profile", icon: User },
  ],
  courier: [
    { label: "Dashboard", href: "/courier/dashboard", icon: Home },
    { label: "Tugas", href: "/courier/tasks", icon: ClipboardList },
    { label: "Tracking", href: "/tracking", icon: Search },
    { label: "Profile", href: "/courier/profile", icon: User },
  ],
  customer: [
    { label: "Dashboard", href: "/customer/dashboard", icon: Home },
    { label: "Paket Saya", href: "/customer/shipments", icon: Package },
    { label: "Tracking", href: "/customer/tracking", icon: Search },
    { label: "Profile", href: "/customer/profile", icon: User },
  ],
} as const;
```

---

## 19. UI Component Guidelines

Gunakan shadcn/ui untuk elemen berikut:

| Kebutuhan | Komponen |
|---|---|
| Tombol | `Button` |
| Card statistik | `Card` |
| Form input | `Input`, `Label`, `Textarea`, `Select` |
| Tabel pengiriman | `Table` |
| Badge status | `Badge` |
| Drawer mobile | `Sheet` |
| Avatar user | `Avatar` |
| Dropdown user | `DropdownMenu` |
| Separator menu | `Separator` |
| Notifikasi | `Sonner` |
| Dialog form | `Dialog` |
| Loading | `Skeleton` |

Gunakan Tailwind untuk layout responsif:

```txt
grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4
hidden lg:block
lg:hidden
rounded-3xl
shadow-sm
border border-emerald-100
bg-emerald-50
text-emerald-700
```

---

## 20. Data Access Rules

Wajib:

- Repository hanya berisi query SQL.
- Service hanya berisi business logic.
- Actions hanya untuk menerima input form dan memanggil service.
- Page server component boleh memanggil service.
- Client component hanya untuk interaksi UI.
- Jangan bocorkan `password_hash` ke client.
- Gunakan parameterized SQL tagged template dari package `postgres`.

Dilarang:

- Query langsung di client component.
- Menggunakan ORM.
- Hardcode credential database.
- Menyimpan password plain text.
- Menampilkan data customer lain ke customer login.

---

## 21. Server Actions yang Harus Ada

### Auth

```ts
loginAction(prevState, formData)
logoutAction()
```

### Users

```ts
createUserAction(prevState, formData)
updateUserStatusAction(userId, isActive)
```

### Shipments

```ts
createShipmentAction(prevState, formData)
assignCourierAction(shipmentId, courierId)
updateShipmentStatusAction(shipmentId, status, note?, location?)
trackShipmentAction(prevState, formData)
```

---

## 22. Query Repository Minimal

### Users Repository

Buat fungsi:

```ts
findUserByEmail(email)
findUserById(id)
getUsers()
getUsersByRole(role)
createUser(data)
updateUserStatus(id, isActive)
```

### Shipments Repository

Buat fungsi:

```ts
getAllShipments(filters)
getShipmentById(id)
getShipmentByTrackingNumber(trackingNumber)
getShipmentsByCourierId(courierId)
getShipmentsByCustomerId(customerId)
createShipment(data)
assignCourier(shipmentId, courierId)
updateShipmentStatus(shipmentId, status)
createShipmentLog(data)
getShipmentLogs(shipmentId)
```

### Dashboard Repository

Buat fungsi:

```ts
getAdminStats()
getCourierStats(courierId)
getCustomerStats(customerId)
getRecentShipmentActivities(limit)
getShipmentChartData(days)
```

---

## 23. Role-Based Business Rules

### Admin

Admin boleh:

- Melihat semua pengiriman.
- Membuat pengiriman.
- Assign kurir.
- Update status pengiriman.
- Melihat semua user.
- Membuat user baru.
- Mengaktifkan/nonaktifkan user.

### Kurir

Kurir boleh:

- Melihat pengiriman yang ditugaskan kepadanya.
- Update status pengiriman miliknya.
- Melihat profile sendiri.

Kurir tidak boleh:

- Melihat daftar semua user.
- Mengubah data pengiriman yang bukan tugasnya.
- Membuat akun user.

### Customer

Customer boleh:

- Melihat paket miliknya.
- Tracking nomor resi.
- Melihat profile sendiri.

Customer tidak boleh:

- Melihat paket customer lain.
- Update status pengiriman.
- Membuat user.
- Assign kurir.

---

## 24. Seed Data

Buat script seed sederhana, misalnya:

```txt
scripts/seed.ts
```

Seed minimal:

- 1 admin
- 2 kurir
- 2 customer
- 6 shipment
- beberapa shipment_logs

Contoh data shipment:

```txt
CKL-2026-0128 | Toko Sinar Jaya | Semarang | Dalam Perjalanan
CKL-2026-0127 | UMKM Makmur | Solo | Diambil Kurir
CKL-2026-0126 | Toko Berkah | Yogyakarta | Selesai
CKL-2026-0125 | CV Maju Bersama | Klaten | Gagal
CKL-2026-0124 | Toko Utama | Magelang | Menunggu Pickup
CKL-2026-0123 | Warung Lestari | Bandung | Selesai
```

Pastikan password user demo di-hash dengan bcrypt.

---

## 25. Halaman Login Detail

Implementasikan `/login` dengan tampilan:

Desktop:

- Dua kolom.
- Kiri: branding Maidev Express, ilustrasi truck, benefit singkat.
- Kanan: card login.

Mobile:

- Satu kolom.
- Logo di atas.
- Card login full width.

Komponen:

- `Card`
- `Input`
- `Label`
- `Button`
- `Alert`

Validasi:

- Email wajib valid.
- Password wajib minimal 6 karakter.
- Jika salah, tampilkan pesan: `Email atau password tidak sesuai`.
- Jika akun nonaktif, tampilkan pesan: `Akun Anda sedang dinonaktifkan`.

---

## 26. Halaman Dashboard Detail

### Komponen Stat Card

Buat:

```txt
src/features/dashboard/components/stat-card.tsx
```

Props:

```ts
type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "green" | "blue" | "amber" | "red";
};
```

Desain:

- Card putih.
- Icon dalam lingkaran soft color.
- Value besar dan bold.
- Description kecil.

### Chart

Gunakan Recharts.

Tampilkan grafik pengiriman 7 hari terakhir.

Jika data kosong, tampilkan empty state.

---

## 27. Halaman Tracking Detail

Desktop:

- Header `Tracking`.
- Card form input resi.
- Table pengiriman.
- Detail/timeline jika nomor resi dicari.

Mobile:

- Input resi di atas.
- Button hijau penuh.
- List shipment berbentuk card.
- Badge status di kanan.

Field tracking result:

```txt
No Resi
Nama Pengirim
Nama Penerima
Kota Asal
Kota Tujuan
Status
Tanggal Dibuat
Terakhir Diperbarui
Timeline Status
```

---

## 28. Halaman Profile Detail

Profile page harus menampilkan:

- Logo Maidev Express.
- Nama perusahaan.
- Deskripsi perusahaan.
- Alamat.
- WhatsApp.
- Email.
- Jam operasional.
- Card user login.
- Role user dalam badge.

Desain mengikuti mockup:

- Card besar di tengah.
- Icon hijau.
- Layout desktop dua kolom jika cukup lebar.
- Layout mobile satu kolom.

---

## 29. Form dan Validasi

Gunakan `zod` untuk semua form.

Schema minimal:

### Create User

```ts
name: required, min 3
email: valid email
password: min 6
phone: optional
role: admin | courier | customer
```

### Create Shipment

```ts
senderName: required
senderPhone: optional
receiverName: required
receiverPhone: optional
pickupAddress: required
destinationAddress: required
originCity: optional
destinationCity: optional
courierId: optional number
customerId: optional number
```

### Update Shipment Status

```ts
status: enum shipment status
note: optional
location: optional
```

### Tracking

```ts
trackingNumber: required min 3
```

---

## 30. Naming Convention

Gunakan:

- File dan folder: kebab-case.
- Component: PascalCase.
- Function: camelCase.
- Type: PascalCase.
- Database column: snake_case.
- TypeScript property: camelCase.

Contoh mapping:

```txt
tracking_number -> trackingNumber
created_at -> createdAt
courier_id -> courierId
```

Repository harus melakukan mapping row SQL ke TypeScript object.

---

## 31. Error Handling

Gunakan pola result object:

```ts
type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};
```

Server action harus return state jika validasi gagal.

Gunakan toast/sonner di client component jika perlu.

---

## 32. Loading dan Empty State

Buat reusable component:

```txt
src/components/shared/empty-state.tsx
src/components/shared/loading-card.tsx
```

Empty state contoh:

- Belum ada pengiriman.
- Nomor resi tidak ditemukan.
- Belum ada tugas untuk kurir.

Gunakan tone ramah, misalnya:

```txt
Belum ada paket yang perlu ditampilkan.
Coba ubah filter atau cek kembali nomor resi Anda.
```

---

## 33. Accessibility dan UX

Wajib:

- Semua input memiliki label.
- Button memiliki teks yang jelas.
- Loading state saat submit.
- Error message mudah dibaca.
- Kontras warna cukup.
- Tap target mobile cukup besar.
- Gunakan semantic HTML.
- Jangan hanya mengandalkan warna untuk status; tetap tampilkan teks status.

---

## 34. Responsive Breakpoints

Gunakan acuan:

```txt
mobile: default
md: tablet
lg: desktop sidebar aktif
xl: desktop luas
```

Pola layout:

```txt
Dashboard cards:
grid-cols-1 md:grid-cols-2 xl:grid-cols-4

Main layout:
lg:grid lg:grid-cols-[280px_1fr]

Mobile sidebar:
lg:hidden + Sheet

Desktop sidebar:
hidden lg:block
```

---

## 35. Minimal Acceptance Criteria

Implementasi dianggap selesai jika:

1. Aplikasi bisa dijalankan dengan `pnpm dev`.
2. Login berhasil untuk admin, kurir, dan customer.
3. Setelah login, user diarahkan ke dashboard sesuai role.
4. Admin bisa melihat dashboard, shipments, users, profile.
5. Kurir bisa melihat dashboard, tasks, profile.
6. Customer bisa melihat dashboard, tracking, shipments, profile.
7. Public tracking `/tracking` bisa mencari nomor resi tanpa login.
8. Database Neon terhubung menggunakan `postgres` package.
9. Tidak ada ORM.
10. UI menggunakan shadcn/ui.
11. Layout desktop dan mobile responsif.
12. Mobile memiliki hamburger drawer.
13. Active state menu terlihat jelas.
14. Status pengiriman tampil sebagai badge.
15. Password di database di-hash.
16. Customer tidak bisa melihat data customer lain.
17. Kurir tidak bisa update shipment yang bukan tugasnya.
18. Admin memiliki akses penuh.
19. Project menggunakan pnpm dan menghasilkan `pnpm-lock.yaml`, bukan `package-lock.json`.

---

## 36. Prioritas Implementasi

Kerjakan berurutan:

1. Setup Next.js, Tailwind, shadcn/ui.
2. Setup folder architecture.
3. Setup database connection `src/lib/db.ts`.
4. Buat schema SQL dan seed data.
5. Implement auth: login, logout, session, middleware.
6. Implement layout responsif: sidebar desktop, drawer mobile, bottom nav.
7. Implement dashboard admin.
8. Implement tracking public.
9. Implement shipments feature.
10. Implement courier tasks.
11. Implement customer shipments.
12. Implement users management admin.
13. Implement profile pages.
14. Rapikan desain sesuai mockup.
15. Test semua role.

---

## 37. Perintah Validasi Wajib

Setelah setiap fase implementasi, jalankan perintah berikut menggunakan pnpm:

```bash
pnpm lint
pnpm build
```

Untuk development lokal:

```bash
pnpm dev
```

Jika ada error TypeScript, ESLint, import path, atau build, perbaiki sampai `pnpm lint` dan `pnpm build` berhasil.

Jika Codex perlu menambahkan dependency baru, gunakan:

```bash
pnpm add nama-package
```

Jangan gunakan `npm install`, `npx`, `yarn add`, atau command lain yang menghasilkan lockfile selain `pnpm-lock.yaml`.

---

## 38. Jangan Lakukan Ini

- Jangan menggunakan Prisma, Drizzle, Sequelize, TypeORM, Knex, atau ORM lain.
- Jangan menggunakan npm atau yarn; gunakan pnpm.
- Jangan membuat `package-lock.json` atau `yarn.lock`.
- Jangan membuat semua logic di `page.tsx`.
- Jangan query database dari client component.
- Jangan menyimpan password plain text.
- Jangan membuat desain desktop-only.
- Jangan menghapus kebutuhan hamburger drawer mobile.
- Jangan membuat route role tanpa proteksi.
- Jangan menampilkan data seluruh shipment ke customer.
- Jangan mengabaikan active state menu.

---

## 39. Output Akhir yang Diharapkan

Saat selesai, project harus memiliki:

```txt
- UI responsive web dan mobile
- Login role-based
- Admin dashboard
- Courier dashboard
- Customer dashboard
- Public tracking
- Shipment management
- Courier task update status
- Customer shipment view
- User management admin
- Company/user profile page
- PostgreSQL Neon connection via postgres package
- Clean feature-based architecture
```

---

## 40. Catatan Desain Akhir

Pastikan hasil akhir terlihat seperti aplikasi Maidev Express pada mockup:

- Hijau mint sebagai identitas utama.
- Dashboard web dengan sidebar kiri.
- Dashboard mobile dengan card vertikal.
- Drawer hamburger dari kiri.
- Tracking page clean dan mudah dipakai.
- Profile page ramah dengan informasi perusahaan.
- UI terasa cocok untuk pengguna UMKM dan kurir yang sering memakai HP.

Fokus utama bukan hanya fitur berjalan, tetapi juga pengalaman pengguna yang ringan, ramah, dan mudah dipahami.
