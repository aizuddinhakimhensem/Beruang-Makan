-- ============================================================================
-- MIGRATION SCRIPT 001: BERUANGMAKAN POSTGRESQL 16 + POSTGIS INITIAL SCHEMA
-- Description: Complete production-ready database schema with geospatial PostGIS,
--              account linking (Google OAuth + Phone OTP), Halal certification auditing,
--              Role-Based Access Control (RBAC), and Admin Audit Trail.
-- ============================================================================

-- Enable PostGIS Extension for Geospatial Operations
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'rider', 'merchant', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE auth_provider_type AS ENUM ('phone_otp', 'google', 'email_password');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status_type AS ENUM (
        'pending', 
        'accepted', 
        'preparing', 
        'picked_up', 
        'delivered', 
        'completed', 
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE halal_cert_status AS ENUM ('verified_jakim', 'self_declared', 'non_halal');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method_type AS ENUM ('tng_ewallet', 'fpx', 'card_token', 'cash_on_delivery');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_type AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. USERS TABLE (Central Auth Entity)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255), -- Null for Phone/Google-only users
    auth_provider auth_provider_type NOT NULL DEFAULT 'phone_otp',
    google_id VARCHAR(255) UNIQUE,
    role user_role NOT NULL DEFAULT 'customer',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CUSTOMER PROFILES TABLE
CREATE TABLE IF NOT EXISTS customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    preferred_language VARCHAR(10) DEFAULT 'bm',
    saved_address TEXT,
    saved_location GEOGRAPHY(POINT, 4326), -- PostGIS Geography Point (Long, Lat)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. RIDER PROFILES TABLE
CREATE TABLE IF NOT EXISTS rider_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    ic_number VARCHAR(20) NOT NULL,
    vehicle_type VARCHAR(50) DEFAULT 'motorcycle',
    vehicle_plate VARCHAR(20) NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    current_location GEOGRAPHY(POINT, 4326), -- Live Rider PostGIS Coordinates
    rating NUMERIC(3,2) DEFAULT 5.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. MERCHANT PROFILES TABLE
CREATE TABLE IF NOT EXISTS merchant_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restaurant_name VARCHAR(200) NOT NULL,
    cuisine_category VARCHAR(100) NOT NULL, -- e.g. Nasi Lemak, Satay, Roti Canai
    halal_status halal_cert_status NOT NULL DEFAULT 'verified_jakim',
    jakim_cert_no VARCHAR(100),
    is_open BOOLEAN DEFAULT TRUE,
    address TEXT NOT NULL,
    location GEOGRAPHY(POINT, 4326) NOT NULL, -- PostGIS Restaurant Coordinates
    avg_rating NUMERIC(3,2) DEFAULT 4.80,
    avg_prep_time_mins INT DEFAULT 20,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchant_profiles(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    stock_quantity INT DEFAULT 100,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES customer_profiles(id),
    merchant_id UUID NOT NULL REFERENCES merchant_profiles(id),
    rider_id UUID REFERENCES rider_profiles(id),
    status order_status_type NOT NULL DEFAULT 'pending',
    subtotal NUMERIC(10,2) NOT NULL,
    delivery_fee NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0.00,
    total_amount NUMERIC(10,2) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_location GEOGRAPHY(POINT, 4326) NOT NULL,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id),
    quantity INT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    subtotal NUMERIC(10,2) NOT NULL
);

-- 9. PAYMENTS TABLE (Tokenized - No Raw CC Data Stored)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_method payment_method_type NOT NULL,
    payment_gateway_reference VARCHAR(255) UNIQUE NOT NULL,
    tokenized_card_id VARCHAR(255), -- Secure Gateway Token (No raw card digits)
    amount NUMERIC(10,2) NOT NULL,
    status payment_status_type NOT NULL DEFAULT 'pending',
    paid_at TIMESTAMP WITH TIME ZONE
);

-- 10. ADMIN AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_resource VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR GEOSPATIAL & HIGH PERFORMANCE QUERIES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_merchant_location_postgis ON merchant_profiles USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_rider_location_postgis ON rider_profiles USING GIST(current_location);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_merchant ON orders(merchant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
