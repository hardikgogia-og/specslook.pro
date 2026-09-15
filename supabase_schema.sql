-- ============================================================================
-- SPECSLOOK LUXURY EYEWEAR DATABASE SCHEMA
-- Compatible with PostgreSQL 15+ / Supabase
-- Optimized for Vercel Deployment & Next.js Full-Stack
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  password_salt VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  role VARCHAR(30) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(150) NOT NULL UNIQUE,
  sku VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  brand VARCHAR(100) DEFAULT 'SPECSLOOK',
  price NUMERIC(10, 2) NOT NULL,
  sale_price NUMERIC(10, 2) NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  category_name VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  featured BOOLEAN DEFAULT false,
  best_seller BOOLEAN DEFAULT false,
  new_arrival BOOLEAN DEFAULT false,
  stock INT NOT NULL DEFAULT 0,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Specifications (JSONB or dedicated columns)
  frame_material VARCHAR(150),
  lens_material VARCHAR(150),
  lens_width_mm INT,
  bridge_mm INT,
  temple_length_mm INT,
  uv_protection VARCHAR(100) DEFAULT '100% UV400',
  is_polarized BOOLEAN DEFAULT false,
  frame_shape VARCHAR(50),
  gender VARCHAR(30) DEFAULT 'Unisex',
  weight_grams NUMERIC(6, 2),
  
  rating NUMERIC(3, 2) DEFAULT 5.0,
  reviews_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT VARIANTS TABLE
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color_name VARCHAR(100) NOT NULL,
  color_hex VARCHAR(20),
  frame_color VARCHAR(100),
  lens_color VARCHAR(100),
  size VARCHAR(50) DEFAULT 'Standard (50mm)',
  sku VARCHAR(100) NOT NULL UNIQUE,
  stock INT NOT NULL DEFAULT 0,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COUPONS / DISCOUNTS TABLE
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'flat')),
  discount_value NUMERIC(10, 2) NOT NULL,
  min_order_value NUMERIC(10, 2) DEFAULT 0,
  max_discount NUMERIC(10, 2),
  is_active BOOLEAN DEFAULT true,
  expiry_date DATE,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) NOT NULL UNIQUE,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(150) NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  pin_code VARCHAR(20) NOT NULL,
  country VARCHAR(50) DEFAULT 'India',
  
  subtotal NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) DEFAULT 0,
  coupon_code VARCHAR(50),
  shipping_fee NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  
  payment_method VARCHAR(30) NOT NULL CHECK (payment_method IN ('cashfree', 'cod')),
  payment_status VARCHAR(30) DEFAULT 'Pending' CHECK (payment_status IN ('Paid', 'Pending', 'Failed', 'Refunded')),
  payment_transaction_id VARCHAR(150),
  
  order_status VARCHAR(30) DEFAULT 'Pending' CHECK (order_status IN ('Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  courier_name VARCHAR(100),
  tracking_number VARCHAR(100),
  tracking_url TEXT,
  estimated_delivery_date DATE,
  timeline JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(200) NOT NULL,
  sku VARCHAR(100) NOT NULL,
  variant_name VARCHAR(100),
  image TEXT,
  price NUMERIC(10, 2) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  total NUMERIC(10, 2) NOT NULL
);

-- 8. PRODUCT REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_name VARCHAR(100) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  comment TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. STORES TABLE
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(150),
  timings VARCHAR(150),
  features JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(200) NOT NULL UNIQUE,
  title VARCHAR(250) NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(100) NOT NULL,
  author_role VARCHAR(100),
  image_url TEXT,
  category VARCHAR(100),
  tags JSONB DEFAULT '[]'::jsonb,
  read_time VARCHAR(50),
  published_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. BANNERS TABLE
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  subtitle TEXT,
  badge VARCHAR(100),
  cta_text VARCHAR(50),
  cta_link TEXT,
  image_url TEXT NOT NULL,
  alignment VARCHAR(20) DEFAULT 'left',
  priority INT DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDICES FOR ULTRA FAST QUERIES
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_name);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
