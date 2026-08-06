/**
 * Database Layer & Geospatial PostGIS Engine Simulator
 * BeruangMakan Backend - Express + PostgreSQL Monorepo
 */

export interface UserRecord {
  id: string;
  email: string | null;
  phone_number: string | null;
  password_hash: string | null;
  auth_provider: 'phone_otp' | 'google' | 'email_password';
  google_id: string | null;
  role: 'customer' | 'rider' | 'merchant' | 'admin';
  is_active: boolean;
  is_phone_verified: boolean;
  is_email_verified: boolean;
  created_at: string;
}

export interface CustomerProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  preferred_language: 'bm' | 'jawi';
  saved_address: string;
  latitude: number;
  longitude: number;
}

export interface RiderProfile {
  id: string;
  user_id: string;
  full_name: string;
  ic_number: string;
  vehicle_type: string;
  vehicle_plate: string;
  is_online: boolean;
  is_available: boolean;
  latitude: number;
  longitude: number;
  rating: number;
}

export interface MerchantProfile {
  id: string;
  user_id: string;
  restaurant_name: string;
  cuisine_category: string;
  halal_status: 'verified_jakim' | 'self_declared' | 'non_halal';
  jakim_cert_no: string | null;
  is_open: boolean;
  address: string;
  latitude: number;
  longitude: number;
  avg_rating: number;
  avg_prep_time_mins: number;
}

export interface MenuItem {
  id: string;
  merchant_id: string;
  name: string;
  description: string;
  price: number;
  is_available: boolean;
  stock_quantity: number;
}

export interface OrderRecord {
  id: string;
  order_number: string;
  customer_id: string;
  merchant_id: string;
  rider_id: string | null;
  status: 'pending' | 'accepted' | 'preparing' | 'picked_up' | 'delivered' | 'completed' | 'cancelled';
  subtotal: number;
  delivery_fee: number;
  discount_amount: number;
  total_amount: number;
  delivery_address: string;
  delivery_latitude: number;
  delivery_longitude: number;
  cancellation_reason?: string;
  created_at: string;
  items: Array<{
    menu_item_id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    name: string;
  }>;
}

export interface AdminAuditLog {
  id: string;
  admin_user_id: string;
  action: string;
  target_resource: string;
  details: any;
  ip_address: string;
  created_at: string;
}

// ============================================================================
// IN-MEMORY DATABASE SEED STORE FOR DEVELOPMENT & DEMONSTRATION
// ============================================================================

const seedUsers: UserRecord[] = [
  {
    id: 'u-cust-001',
    email: 'customer@beruangmakan.my',
    phone_number: '+60123456789',
    password_hash: null,
    auth_provider: 'phone_otp',
    google_id: null,
    role: 'customer',
    is_active: true,
    is_phone_verified: true,
    is_email_verified: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u-rider-001',
    email: 'sufian.rider@beruangmakan.my',
    phone_number: '+60119876543',
    password_hash: null,
    auth_provider: 'phone_otp',
    google_id: null,
    role: 'rider',
    is_active: true,
    is_phone_verified: true,
    is_email_verified: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u-merch-001',
    email: 'merchant.ayam@beruangmakan.my',
    phone_number: '+60133334444',
    password_hash: 'pbkdf2_hashed_password_merchant_123',
    auth_provider: 'email_password',
    google_id: null,
    role: 'merchant',
    is_active: true,
    is_phone_verified: true,
    is_email_verified: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'u-admin-001',
    email: 'admin@beruangmakan.my',
    phone_number: '+60199998888',
    password_hash: 'pbkdf2_hashed_password_admin_123',
    auth_provider: 'email_password',
    google_id: null,
    role: 'admin',
    is_active: true,
    is_phone_verified: true,
    is_email_verified: true,
    created_at: new Date().toISOString(),
  },
];

const seedCustomerProfiles: CustomerProfile[] = [
  {
    id: 'cp-001',
    user_id: 'u-cust-001',
    full_name: 'Ahmad Faiz',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
    preferred_language: 'bm',
    saved_address: 'Bukit Bintang, 50250 Kuala Lumpur',
    latitude: 3.1466,
    longitude: 101.7115,
  },
];

const seedRiderProfiles: RiderProfile[] = [
  {
    id: 'rp-001',
    user_id: 'u-rider-001',
    full_name: 'Sufian bin Razak',
    ic_number: '950412-14-5541',
    vehicle_type: 'Yamaha Y15ZR',
    vehicle_plate: 'VCE 8821',
    is_online: true,
    is_available: true,
    latitude: 3.1480, // Near Bukit Bintang
    longitude: 101.7130,
    rating: 4.9,
  },
  {
    id: 'rp-002',
    user_id: 'u-rider-002',
    full_name: 'Muhammad Danial',
    ic_number: '980820-10-6119',
    vehicle_type: 'Honda EX5',
    vehicle_plate: 'WXX 1234',
    is_online: true,
    is_available: true,
    latitude: 3.1550, // Near KLCC
    longitude: 101.7150,
    rating: 4.75,
  },
];

const seedMerchantProfiles: MerchantProfile[] = [
  {
    id: 'mp-001',
    user_id: 'u-merch-001',
    restaurant_name: 'Ayam Bakar Madu Sado',
    cuisine_category: 'Nasi Lemak',
    halal_status: 'verified_jakim',
    jakim_cert_no: 'JAKIM.700-2/3/1 042-08/2024',
    is_open: true,
    address: 'No. 12, Jalan Sultan Ismail, Bukit Bintang, KL',
    latitude: 3.1466,
    longitude: 101.7115,
    avg_rating: 4.8,
    avg_prep_time_mins: 15,
  },
  {
    id: 'mp-002',
    user_id: 'u-merch-002',
    restaurant_name: 'Satay Legend Kajang',
    cuisine_category: 'Satay Legend',
    halal_status: 'verified_jakim',
    jakim_cert_no: 'JAKIM.700-2/3/1 088-11/2024',
    is_open: true,
    address: 'Lot 4, Food Court Avenue K, KLCC, KL',
    latitude: 3.1588,
    longitude: 101.7138,
    avg_rating: 4.7,
    avg_prep_time_mins: 20,
  },
  {
    id: 'mp-003',
    user_id: 'u-merch-003',
    restaurant_name: 'Restoran Teh Tarik Kaw-Kaw',
    cuisine_category: 'Teh Tarik',
    halal_status: 'verified_jakim',
    jakim_cert_no: 'JAKIM.700-2/3/1 012-01/2025',
    is_open: true,
    address: 'No. 88, Jalan Imbi, Kuala Lumpur',
    latitude: 3.1420,
    longitude: 101.7100,
    avg_rating: 4.6,
    avg_prep_time_mins: 10,
  },
];

const seedMenuItems: MenuItem[] = [
  {
    id: 'mi-001',
    merchant_id: 'mp-001',
    name: 'Nasi Lemak Ayam Bakar Madu Sado',
    description: 'Nasi lemak wangi bersantan, ayam bakar madu juicy, sambal pedas manis, telur rebus & kacang goreng.',
    price: 14.50,
    is_available: true,
    stock_quantity: 45,
  },
  {
    id: 'mi-002',
    merchant_id: 'mp-001',
    name: 'Teh Tarik Kaw Special',
    description: 'Teh tarik pekat berkrim menggunakan susu pekat manis tempatan.',
    price: 3.50,
    is_available: true,
    stock_quantity: 100,
  },
  {
    id: 'mi-003',
    merchant_id: 'mp-002',
    name: 'Set Satay Ayam (10 Cucuk)',
    description: 'Satay ayam bakar arang lembut disajikan bersama kuah kacang berempah & nasi himpit.',
    price: 18.00,
    is_available: true,
    stock_quantity: 30,
  },
];

const seedOrders: OrderRecord[] = [
  {
    id: 'ord-001',
    order_number: 'BM-20260805-001',
    customer_id: 'cp-001',
    merchant_id: 'mp-001',
    rider_id: 'rp-001',
    status: 'preparing',
    subtotal: 18.00,
    delivery_fee: 4.00,
    discount_amount: 2.00,
    total_amount: 20.00,
    delivery_address: 'Bukit Bintang, 50250 Kuala Lumpur',
    delivery_latitude: 3.1466,
    delivery_longitude: 101.7115,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    items: [
      {
        menu_item_id: 'mi-001',
        quantity: 1,
        unit_price: 14.50,
        subtotal: 14.50,
        name: 'Nasi Lemak Ayam Bakar Madu Sado',
      },
      {
        menu_item_id: 'mi-002',
        quantity: 1,
        unit_price: 3.50,
        subtotal: 3.50,
        name: 'Teh Tarik Kaw Special',
      },
    ],
  },
];

const seedAuditLogs: AdminAuditLog[] = [
  {
    id: 'log-001',
    admin_user_id: 'u-admin-001',
    action: 'VERIFY_MERCHANT_HALAL',
    target_resource: 'merchant_profiles:mp-001',
    details: { jakim_cert: 'JAKIM.700-2/3/1 042-08/2024', status: 'verified_jakim' },
    ip_address: '127.0.0.1',
    created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
];

// ============================================================================
// GEOSPATIAL HELPER (HAVERSINE DISTANCE SIMULATING POSTGIS ST_DWithin & ST_Distance)
// ============================================================================

export function calculateHaversineDistanceKm(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100; // Returns rounded km with 2 decimals
}

// In-Memory Database Access Object
export const db = {
  users: seedUsers,
  customerProfiles: seedCustomerProfiles,
  riderProfiles: seedRiderProfiles,
  merchantProfiles: seedMerchantProfiles,
  menuItems: seedMenuItems,
  orders: seedOrders,
  auditLogs: seedAuditLogs,
};
