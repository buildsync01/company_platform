🎯 Tujuan Proyek
Bangun aplikasi web direktori B2B full-stack dengan UX dan tampilan mirip Alibaba bernama Hi-Fella, namun dengan tema gelap profesional (base color #1a1a1a).
 Website ini menampilkan daftar perusahaan dan produk mereka langsung di homepage, agar buyer bisa eksplor tanpa harus membuka halaman detail perusahaan terlebih dahulu.

⚙️ Tech Stack & Tools
Framework: Next.js 14+ (App Router + Server Actions)

ORM: Drizzle ORM
Database & Auth: Supabase 
Styling: Tailwind CSS (custom dark theme)
Login / Register SSO : Menggunakan Clerk
UI Components: shadcn/ui (Button, Card, Input, Select, DropdownMenu, Dialog, Tabs)
Animation: framer-motion (smooth transitions & fade-in effects)
Font: Inter



🧩 Konsep Visual & Warna
Background utama: #1a1a1a


Card: #222222 (rounded-2xl, shadow-[0_0_15px_#F01457]/10)


Text utama: #f5f5f5


Secondary text: #b0b0b0


Accent gradient: from-[#F01457] to-[#F01457]/80


Border: #2d2d2d


Hover accent: hover:shadow-[#F01457]/20 transition-all



🏠 Homepage ("/")
🧭 1. Navbar
Fixed top, semi-transparan (bg-[#1a1a1a]/80 backdrop-blur-md border-b border-[#2d2d2d]).


Isi:


Logo minimalis (warna orange gradient)


Menu: “Explore Companies”, “Products”, “For Suppliers”


Tombol “Sign In” & “Join Free” (Button variant="outline" & variant="gradient")



🦾 2. Hero Section
Heading:
 "Find Verified Suppliers & Products You Can Trust"
 → gunakan text-transparent bg-clip-text bg-gradient-to-r from-[#F01457] to-[#F01457]/80


Subtext:
 "Discover top companies and their best-selling products from various industries."


Search Bar (inline filter):

 [Input: "Search for products or companies..."] [Select: Industry] [Button: Search]
 Gunakan Card dengan padding besar (p-4 md:p-6 rounded-2xl shadow-lg bg-[#222222]).



🧱 3. Category Tabs / Filter Section
Gunakan komponen Tabs dari shadcn/ui:
Tab: “All”, “Construction”, “Electronics”, “Fashion”, dll.


Saat tab di-klik → update daftar produk & perusahaan di bawah via React Query.



🏭 4. Combined Listing: Perusahaan + Produk
Gunakan layout dinamis yang menampilkan produk utama dari setiap perusahaan.
Grid Layout:
 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
Card Struktur:
Header: Logo perusahaan kecil + nama perusahaan (text-[#F01457])


Body:


Carousel mini (produk unggulan max 3)


Setiap produk ditampilkan dalam Card kecil:


Gambar produk (next/image, aspect-ratio square)


Nama produk (truncate)


Harga / MOQ


Tombol kecil “View Company” → /company/[id]


Hover effect: hover:scale-[1.02] transition-all hover:shadow-[#F01457]/10


Contoh Layout:
| PT Besi Kuat [Construction] |
| Product: Baja Ringan A | Rp 20.000/kg |
| Product: Hollow Galvanis | Rp 15.000/kg |
[ View Company ]


🧲 5. Featured Products Section
Tambahkan bagian “🔥 Popular Products” di bawah listing utama.
Gunakan horizontal scroll (ScrollArea) menampilkan produk terpopuler lintas perusahaan.


Masing-masing produk card menampilkan:


Gambar produk


Nama produk


Nama perusahaan (klikable → /company/[id])


Tombol “View Product” (accent orange)



🪪 6. CTA Section
Background gradient from-[#F01457]/20 to-[#F01457]/10
Heading: “Grow Your Business with Us”


Subtext: “Join thousands of verified suppliers connecting with buyers worldwide.”


Button besar: “Register Your Company” → /register



👤 Halaman Tambahan
/company/[id]
Profil lengkap perusahaan + daftar produk.


Tombol kontak (“Send Message”) → Auth Wall (login modal jika belum login).


/product/[id]
Detail produk, foto, deskripsi, MOQ, harga, supplier info, dan tombol “Contact Supplier”.


/profile
Seller dashboard (CRUD profil & produk).



🔒 User Flow Ringkas
Alur Pengguna A: "Buyer" (Flow Lead-Gen)
Ini adalah alur untuk pengunjung publik yang ingin mencari supplier.

Kunjungan: Pengunjung (Buyer) membuka Homepage (/). Semuanya terlihat dan dapat diakses publik.

Penemuan: Buyer menggunakan Search Bar (misal: "Baja Ringan") dan Filter (misal: Industri "Konstruksi"). Daftar di homepage ter-update.

Eksplorasi: Buyer mengklik "PT Besi Kuat" dan diarahkan ke /company/[id]. Semua info detail dan daftar produk perusahaan itu terlihat.

Menemukan Produk: Buyer mengklik "Produk Baja X" dan diarahkan ke /product/[id]. Dia melihat MOQ, Harga, dan Video produk.

"Auth Wall" (Momen Kritis): Buyer tertarik. Dia kembali ke halaman /company/[id] "PT Besi Kuat" dan mengklik tombol "Send Email" atau "Request Call".

Aksi -> Modal: Karena Buyer belum login, sebuah Modal (pop-up) dari shadcn/ui harus muncul.

Judul: "Login atau Register untuk Melanjutkan"

Isi: "Untuk melindungi anggota kami dari spam, Anda harus login untuk menghubungi perusahaan."

Tombol: "Login" / "Register" (mengarahkan ke halaman auth).

Konversi: Buyer mendaftar (hanya email/password), otomatis login, dan diarahkan kembali ke halaman "PT Besi Kuat".

Sukses: Buyer mengklik "Request Call" lagi. Kali ini, karena dia sudah login, fungsinya berjalan (misalnya, mailto: terbuka atau form kontak muncul).

4. 🏢 Alur Pengguna B: "Seller" (Flow Onboarding)
Ini adalah alur untuk perusahaan yang ingin terdaftar di direktori Anda.

Registrasi: "Seller" (Pemilik PT Sinar Jaya) mengklik "Register" di header utama.

Registrasi Minimalis: Dia mendaftar hanya dengan email dan password. Ini adalah kunci untuk mengurangi friksi.

Login Otomatis: Setelah sukses, dia otomatis login dan diarahkan ke Homepage (atau /profile).

Navigasi ke Profil: Seller mengklik "Profil Saya" (/profile). Rute ini harus dilindungi (hanya untuk yang sudah login).

Logika Kondisional Kritis (di /profile):

Backend (Next.js server component atau API route) harus mengecek: Apakah user.id ini sudah memiliki data di tabel companyProfiles?

KASUS A (BARU): Jawabannya "Tidak".

Halaman /profile HANYA me-render satu komponen: sebuah form "Tambah Informasi Perusahaan Anda" (menggunakan shadcn Input, Textarea, Select untuk industry).

Tidak ada tombol "Tambah Produk" yang terlihat.

KASUS B (SUDAH ADA): Jawabannya "Ya".

Halaman /profile me-render dashboard penuh:

Info perusahaan yang sudah ada (dengan tombol "Edit").

Sebuah bagian (area) untuk "Mengelola Produk Anda".

Tombol "Tambah Produk Baru".

Aktivasi Profil: Seller (dari Kasus A) mengisi form "Tambah Informasi Perusahaan" dan klik "Simpan". Ini akan membuat entri baru di tabel companyProfiles yang terhubung ke users.id miliknya.

Refresh Halaman: Halaman /profile me-refresh.

Menjadi "Kreator": Logika kondisional (langkah #5) berjalan lagi. Kali ini, jawabannya "Ya" (Kasus B). Halaman sekarang menampilkan dashboard penuh, dan tombol "Tambah Produk" dan "Tambah Video" akhirnya muncul.

Selesai: Seller kini bisa menambahkan produk-produknya, dan perusahaannya (PT Sinar Jaya) sekarang muncul di Homepage untuk ditemukan oleh "Buyer" (Alur A).


🗃️ Draf Skema Database (Drizzle: db/schema.ts)
Tolong buat skema ini. Pastikan menggunakan relasi drizzle-orm dan onDelete: 'cascade' di tempat yang tepat.

TypeScript


// 🗃️ db/schema.ts
import { pgTable, text, timestamp, boolean, integer, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

// ======================================================
// 1️⃣ USERS TABLE
// ======================================================
export const users = pgTable('users', {
  idUser: text('id_user').$defaultFn(() => createId()).primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
  deletedAt: timestamp('deleted_at'),
});

// 🔗 RELATIONS
export const usersRelations = relations(users, ({ one }) => ({
  company: one(companies, {
    fields: [users.idUser],
    references: [companies.userId],
  }),
}));

// ======================================================
// 2️⃣ COMPANY PROFILES TABLE
// ======================================================
export const companies = pgTable('companies', {
  idCompany: text('id_company').$defaultFn(() => createId()).primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull(),

  userId: text('user_id')
    .notNull()
    .references(() => users.idUser, { onDelete: 'cascade' })
    .unique(),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
  deletedAt: timestamp('deleted_at'),

  companyVerifiedAt: timestamp('company_verified_at'),
  username: text('username'),
  companyName: text('company_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  phoneCode: text('phone_code'),
  slogan: text('slogan'),
  imageProfile: text('image_profile'),
  imageBanner: text('image_banner'),
  cityId: text('city_id'),
  companySize: text('company_size'),
  about: text('about'),
  website: text('website'),
  companyType: text('company_type'),
  establishedYear: text('established_year'),
  category: text('category'),
  status: text('status'),
  temporaryName: text('temporary_name'),
  pronunciation: text('pronunciation'),
  tradeRole: text('trade_role'),
  manufacturePicture: text('manufacture_picture'),
  isManufacture: boolean('is_manufacture').default(false),
  companyProfileFile: text('company_profile_file'),
  productCatalog: text('product_catalog'),
});

// 🔗 RELATIONS
export const companiesRelations = relations(companies, ({ one, many }) => ({
  user: one(users, {
    fields: [companies.userId],
    references: [users.idUser],
  }),
  products: many(products),
}));

// ======================================================
// 3️⃣ PRODUCTS TABLE
// ======================================================
export const products = pgTable('products', {
  idProduct: text('id_product').$defaultFn(() => createId()).primaryKey(),
  uuid: uuid('uuid').defaultRandom().notNull(),

  companyId: text('company_id')
    .notNull()
    .references(() => companies.idCompany, { onDelete: 'cascade' }),

  name: text('name').notNull(),
  description: text('description'),
  imageMain: text('image_main'),
  imageDetail: text('image_detail'),

  moq: text('moq'), // e.g. "100 units"
  priceMin: text('price_min'), // e.g. "Rp 10.000"
  priceMax: text('price_max'),
  unitName: text('unit_name'), // e.g. "pcs", "kg"

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
  deletedAt: timestamp('deleted_at'),
});

// 🔗 RELATIONS
export const productsRelations = relations(products, ({ one, many }) => ({
  company: one(companies, {
    fields: [products.companyId],
    references: [companies.idCompany],
  }),
  images: many(productImages),
  videos: many(productVideos),
}));

// ======================================================
// 4️⃣ PRODUCT IMAGES TABLE
// ======================================================
export const productImages = pgTable('product_images', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => products.idProduct, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  caption: text('caption'),

  createdAt: timestamp('created_at').defaultNow(),
});

// 🔗 RELATIONS
export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.idProduct],
  }),
}));

// ======================================================
// 5️⃣ PRODUCT VIDEOS TABLE
// ======================================================
export const productVideos = pgTable('product_videos', {
  id: text('id').$defaultFn(() => createId()).primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => products.idProduct, { onDelete: 'cascade' }),
  videoUrl: text('video_url').notNull(),
  title: text('title'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 🔗 RELATIONS
export const productVideosRelations = relations(productVideos, ({ one }) => ({
  product: one(products, {
    fields: [productVideos.productId],
    references: [products.idProduct],
  }),
}));

