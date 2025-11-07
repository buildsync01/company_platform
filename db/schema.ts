// 🗃️ db/schema.ts
import { pgTable, text, timestamp, boolean, integer, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
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
  cityName: text('city_name'),
  countryName: text('country_name'),
  companySize: text('company_size'),
  about: text('about'),
  website: text('website'),
  companyType: text('company_type'), // Enum: 'private_company' | 'public_company'
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