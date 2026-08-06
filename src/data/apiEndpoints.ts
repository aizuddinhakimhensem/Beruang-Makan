import { ApiEndpoint } from '../types';

export const API_ENDPOINTS: ApiEndpoint[] = [
  // MODUL AUTH
  {
    id: 'auth-phone-request',
    module: 'auth',
    method: 'POST',
    path: '/api/v1/auth/phone/request-otp',
    title: 'Hantar OTP Telefon (Customer & Rider)',
    description: 'Menghantar 6-digit kod OTP SMS/WhatsApp ke nombor telefon pengguna Malaysia (+60...).',
    authRequired: false,
    authType: 'Public',
    requestBody: JSON.stringify({ phone_number: '+60123456789', role: 'customer' }, null, 2),
    responseExample: JSON.stringify({ success: true, message: 'Kod OTP telah dihantar', expires_in_seconds: 300 }, null, 2)
  },
  {
    id: 'auth-phone-verify',
    module: 'auth',
    method: 'POST',
    path: '/api/v1/auth/phone/verify-otp',
    title: 'Pengesahan OTP Telefon & Login',
    description: 'Mengesahkan kod OTP dan mengembalikan pasangan Access Token (JWT) & Refresh Token.',
    authRequired: false,
    authType: 'Public',
    requestBody: JSON.stringify({ phone_number: '+60123456789', otp_code: '882194', role: 'customer' }, null, 2),
    responseExample: JSON.stringify({
      success: true,
      data: {
        access_token: 'eyJhbGciOiJIUzI1Ni...',
        refresh_token: 'd9a8f3...',
        user: { id: 'u-101', full_name: 'Ahmad Faiz', phone_number: '+60123456789', role: 'customer', auth_provider: 'phone' }
      }
    }, null, 2)
  },
  {
    id: 'auth-google',
    module: 'auth',
    method: 'POST',
    path: '/api/v1/auth/google',
    title: 'Login / Daftar Google OAuth (Customer sahaja)',
    description: 'Mengesahkan idToken dari Google SDK Flutter/Web, mendaftarkan akaun baru atau melog masuk akaun sedia ada.',
    authRequired: false,
    authType: 'Public',
    requestBody: JSON.stringify({ id_token: 'eyJhbGciOiJSUzI1Ni...' }, null, 2),
    responseExample: JSON.stringify({
      success: true,
      data: {
        access_token: 'eyJhbGciOiJIUzI1Ni...',
        user: { id: 'u-102', full_name: 'Siti Aminah', email: 'siti@gmail.com', google_id: 'g-99120', role: 'customer', auth_provider: 'google' }
      }
    }, null, 2)
  },
  {
    id: 'auth-merchant-login',
    module: 'auth',
    method: 'POST',
    path: '/api/v1/auth/merchant/login',
    title: 'Login Email & Kata Laluan (Merchant & Admin)',
    description: 'Log masuk khusus untuk pengusaha restoran dan pegawai pentadbir sistem.',
    authRequired: false,
    authType: 'Public',
    requestBody: JSON.stringify({ email: 'nasi.lemak.papan@gmail.com', password: 'SecretPassword123!' }, null, 2),
    responseExample: JSON.stringify({
      success: true,
      data: {
        access_token: 'eyJhbGciOiJIUzI1Ni...',
        merchant: { restaurant_id: 'r-301', restaurant_name: 'Nasi Lemak Daun Pisang' }
      }
    }, null, 2)
  },

  // MODUL MERCHANTS
  {
    id: 'merchants-nearby',
    module: 'merchants',
    method: 'GET',
    path: '/api/v1/merchants/nearby?lat=3.1390&lng=101.6869&radius_km=5&halal=certified_jakim',
    title: 'Cari Restoran Berdekatan (Geospatial PostGIS)',
    description: 'Mengembalikan senarai restoran dalam radius tertentu menggunakan fungsi PostGIS ST_DWithin berorientasikan koordinat pelanggan.',
    authRequired: true,
    authType: 'Customer',
    responseExample: JSON.stringify({
      success: true,
      count: 2,
      data: [
        {
          id: 'r-301',
          name: 'Nasi Lemak Daun Pisang Abang Beruang',
          halal_status: 'certified_jakim',
          distance_km: 1.2,
          rating_avg: 4.8,
          is_open: true,
          cuisine_types: ['Nasi Lemak', 'Melayu', 'Sarapan']
        }
      ]
    }, null, 2)
  },
  {
    id: 'merchants-detail',
    module: 'merchants',
    method: 'GET',
    path: '/api/v1/merchants/:restaurant_id',
    title: 'Maklumat Restoran & Menu',
    description: 'Mendapatkan profil penuh restoran bersama menu teratur mengikut kategori dan status ketersediaan stok.',
    authRequired: false,
    authType: 'Public',
    responseExample: JSON.stringify({
      success: true,
      data: {
        id: 'r-301',
        name: 'Nasi Lemak Daun Pisang Abang Beruang',
        halal_status: 'certified_jakim',
        address: 'No 12, Jalan Sultan Ismail, KL',
        categories: [
          {
            name: 'Makanan Utama',
            items: [
              { id: 'm-1', name: 'Nasi Lemak Ayam Goreng Berempah', price: 12.50, is_available: true, is_popular: true }
            ]
          }
        ]
      }
    }, null, 2)
  },

  // MODUL ORDERS
  {
    id: 'orders-create',
    module: 'orders',
    method: 'POST',
    path: '/api/v1/orders',
    title: 'Cipta Pesanan Makanan Baru',
    description: 'Mengepos barang dalam bakul, mengira harga & caj penghantaran, serta mengunci stok menu.',
    authRequired: true,
    authType: 'Customer',
    requestBody: JSON.stringify({
      restaurant_id: 'r-301',
      delivery_address_text: 'Level 5, Menara Maybank, KL',
      delivery_lat: 3.1466,
      delivery_lng: 101.6998,
      payment_method: 'tng_ewallet',
      promo_code: 'BERUANGPADU',
      items: [
        { menu_item_id: 'm-1', quantity: 2, special_instructions: 'Kurang manis' }
      ]
    }, null, 2),
    responseExample: JSON.stringify({
      success: true,
      data: {
        order_id: 'o-9921',
        order_number: 'BM-20260805-9921',
        total_amount: 27.00,
        status: 'pending',
        payment_url: 'https://gateway.beruangmakan.my/pay/o-9921'
      }
    }, null, 2)
  },
  {
    id: 'orders-track',
    module: 'orders',
    method: 'GET',
    path: '/api/v1/orders/:order_id/track',
    title: 'Jejak Status & Lokasi Live Rider',
    description: 'Mendapatkan perjalanan status real-time pesanan dan koordinat GPS rider.',
    authRequired: true,
    authType: 'Customer',
    responseExample: JSON.stringify({
      success: true,
      data: {
        order_id: 'o-9921',
        status: 'on_the_way',
        estimated_delivery_minutes: 14,
        rider: {
          name: 'Sufian (Rider Beruang)',
          phone: '+60178829911',
          vehicle_plate: 'VCE 8821',
          current_lat: 3.1410,
          current_lng: 101.6912
        }
      }
    }, null, 2)
  },

  // MODUL RIDERS
  {
    id: 'riders-toggle-status',
    module: 'riders',
    method: 'PATCH',
    path: '/api/v1/riders/toggle-online',
    title: 'Tukar Status Online/Offline Rider',
    description: 'Mengarahkan sistem sama ada rider sedia menerima pesanan penghantaran baru.',
    authRequired: true,
    authType: 'Rider',
    requestBody: JSON.stringify({ is_online: true }, null, 2),
    responseExample: JSON.stringify({ success: true, is_online: true }, null, 2)
  },
  {
    id: 'riders-ping-location',
    module: 'riders',
    method: 'POST',
    path: '/api/v1/riders/ping-location',
    title: 'Hantar Lokasi Live GPS Rider',
    description: 'Mengemaskini koordinat PostGIS rider setiap 10 saat semasa bertugas.',
    authRequired: true,
    authType: 'Rider',
    requestBody: JSON.stringify({ lat: 3.1412, lng: 101.6915 }, null, 2),
    responseExample: JSON.stringify({ success: true, timestamp: '2026-08-05T18:45:00Z' }, null, 2)
  },

  // MODUL ADMIN
  {
    id: 'admin-verify-halal',
    module: 'admin',
    method: 'PATCH',
    path: '/api/v1/admin/restaurants/:restaurant_id/halal-verification',
    title: 'Sahkan Status Halal Restoran',
    description: 'Tindakan pegawai pentadbir untuk meluluskan status pensijilan Halal JAKIM sesebuah premis.',
    authRequired: true,
    authType: 'Admin',
    requestBody: JSON.stringify({ halal_status: 'certified_jakim', halal_cert_number: 'JAKIM.700-2/3/1 029-04/2026' }, null, 2),
    responseExample: JSON.stringify({ success: true, message: 'Status Halal telah disahkan dan dicatat ke audit_logs' }, null, 2)
  },
  {
    id: 'admin-audit-logs',
    module: 'admin',
    method: 'GET',
    path: '/api/v1/admin/audit-logs?limit=50',
    title: 'Lihat Audit Log Pentadbir',
    description: 'Mendapatkan senarai jejak keselamatan tindakan perubahan status sensitif sistem.',
    authRequired: true,
    authType: 'Admin',
    responseExample: JSON.stringify({
      success: true,
      data: [
        { id: 'log-1', actor: 'SuperAdmin Rozman', action: 'HALAL_VERIFIED', target: 'restaurants/r-301', created_at: '2026-08-05T18:30:00Z' }
      ]
    }, null, 2)
  }
];
