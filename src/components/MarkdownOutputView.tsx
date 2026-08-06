import React, { useState } from 'react';
import { LanguageMode } from '../types';
import { Copy, CheckCircle, FileText, Download } from 'lucide-react';

interface MarkdownOutputViewProps {
  langMode: LanguageMode;
}

export const GENERATED_MARKDOWN_FULL = `# DOKUMEN SPESIFIKASI SENI BINA & DESIGN SYSTEM PLATFORM "BERUANGMAKAN"

## 1. SKEMA DATABASE POSTGRESQL LENGKAP (POSTGIS GEOSPATIAL)

Sistem database BeruangMakan dibina di atas **PostgreSQL 16** dengan ekstensi **PostGIS** untuk sokongan lokasi geospatial real-time.

### Jenis Enum Sistem:
- \`user_role\`: \`'customer'\`, \`'rider'\`, \`'merchant'\`, \`'admin'\`
- \`auth_provider_type\`: \`'phone'\`, \`'google'\`, \`'both'\`
- \`halal_status_type\`: \`'certified_jakim'\`, \`'muslim_owned'\`, \`'non_halal'\`
- \`order_status_type\`: \`'pending'\`, \`'accepted'\`, \`'preparing'\`, \`'ready_for_pickup'\`, \`'picked_up'\`, \`'on_the_way'\`, \`'delivered'\`, \`'cancelled'\`
- \`payment_method_type\`: \`'fpx'\`, \`'tng_ewallet'\`, \`'grabpay'\`, \`'credit_card'\`, \`'cash_on_delivery'\`
- \`payment_status_type\`: \`'pending'\`, \`'successful'\`, \`'failed'\`, \`'refunded'\`

---

### Jadual 1: \`users\`
Jadual utama pengguna berkongsi authentication berasaskan role.
- \`id\`: UUID (PK, DEFAULT gen_random_uuid())
- \`phone_number\`: VARCHAR(20) (UNIQUE, NULLABLE - Format +60...)
- \`email\`: VARCHAR(255) (UNIQUE, NULLABLE - Wajib untuk Merchant/Admin)
- \`password_hash\`: VARCHAR(255) (NULLABLE - Wajib untuk Merchant/Admin)
- \`role\`: user_role (NOT NULL, DEFAULT 'customer')
- \`auth_provider\`: auth_provider_type (NOT NULL, DEFAULT 'phone')
- \`google_id\`: VARCHAR(255) (UNIQUE, NULLABLE)
- \`full_name\`: VARCHAR(150) (NOT NULL)
- \`avatar_url\`: TEXT (NULLABLE)
- \`is_active\`: BOOLEAN (DEFAULT TRUE)
- \`created_at\`: TIMESTAMPTZ (DEFAULT CURRENT_TIMESTAMP)
**Indeks Disyorkan:**
- \`CREATE UNIQUE INDEX idx_users_phone ON users(phone_number) WHERE phone_number IS NOT NULL;\`
- \`CREATE UNIQUE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;\`
- \`CREATE UNIQUE INDEX idx_users_google ON users(google_id) WHERE google_id IS NOT NULL;\`
- \`CREATE INDEX idx_users_role ON users(role);\`

---

### Jadual 2: \`restaurants\`
Profil kedai/restoran merchant termasuk status pengesahan Halal JAKIM dan koordinat geospatial PostGIS.
- \`id\`: UUID (PK)
- \`merchant_user_id\`: UUID (FK -> users.id)
- \`name\`: VARCHAR(200) (NOT NULL)
- \`slug\`: VARCHAR(250) (UNIQUE, NOT NULL)
- \`logo_url\`: TEXT (NULLABLE)
- \`banner_url\`: TEXT (NULLABLE)
- \`halal_status\`: halal_status_type (DEFAULT 'muslim_owned')
- \`halal_cert_number\`: VARCHAR(100) (NULLABLE)
- \`address_text\`: TEXT (NOT NULL)
- \`location\`: GEOGRAPHY(Point, 4326) (NOT NULL - PostGIS)
- \`cuisine_types\`: TEXT[] (NULLABLE)
- \`is_open\`: BOOLEAN (DEFAULT TRUE)
- \`rating_avg\`: NUMERIC(3,2) (DEFAULT 0.00)
- \`rating_count\`: INTEGER (DEFAULT 0)
**Indeks Disyorkan:**
- \`CREATE INDEX idx_restaurants_location ON restaurants USING GIST (location);\`: Spatial Index PostGIS untuk radius km
- \`CREATE INDEX idx_restaurants_halal ON restaurants(halal_status);\`: Carian pantas Halal JAKIM

---

### Jadual 3: \`menu_items\`
Senarai makanan/minuman mengikut restoran dengan status stok real-time.
- \`id\`: UUID (PK)
- \`restaurant_id\`: UUID (FK -> restaurants.id)
- \`name\`: VARCHAR(200) (NOT NULL)
- \`description\`: TEXT (NULLABLE)
- \`price\`: NUMERIC(10,2) (NOT NULL - MYR)
- \`image_url\`: TEXT (NULLABLE)
- \`category\`: VARCHAR(100) (NOT NULL)
- \`is_available\`: BOOLEAN (DEFAULT TRUE)
- \`stock_quantity\`: INTEGER (NULLABLE)
- \`is_popular\`: BOOLEAN (DEFAULT FALSE)
**Indeks Disyorkan:**
- \`CREATE INDEX idx_menu_restaurant ON menu_items(restaurant_id, category);\`: Carian menu mengikut kategori
- \`CREATE INDEX idx_menu_available ON menu_items(is_available);\`: Filter item sold-out

---

### Jadual 4: \`orders\` & \`order_items\`
- **orders**: \`id\` (PK), \`order_number\` (UNIQUE), \`customer_id\` (FK), \`restaurant_id\` (FK), \`rider_id\` (FK), \`status\` (order_status_type), \`subtotal\` (NUMERIC), \`delivery_fee\` (NUMERIC), \`discount_amount\` (NUMERIC), \`total_amount\` (NUMERIC), \`delivery_address_text\` (TEXT), \`delivery_location\` (GEOGRAPHY Point), \`created_at\` (TIMESTAMPTZ)
- **order_items**: \`id\` (PK), \`order_id\` (FK -> orders.id), \`menu_item_id\` (FK), \`item_name\`, \`unit_price\`, \`quantity\`, \`total_price\`, \`special_instructions\`

---

### Jadual 5: \`payments\`
Rekod transaksi kewangan multi-kaedah (FPX, Touch 'n Go eWallet, GrabPay, Card, Cash).
- \`id\`: UUID (PK), \`order_id\` (FK UNIQUE), \`payment_method\`, \`transaction_reference\`, \`amount\`, \`status\`, \`paid_at\`, \`raw_response\` (JSONB)

---

### Jadual 6: \`riders\`
Profil status online/offline dan lokasi live GPS.
- \`id\`: UUID (PK), \`user_id\` (FK UNIQUE), \`vehicle_type\`, \`license_plate\`, \`is_online\`, \`is_busy\`, \`current_location\` (GEOGRAPHY Point), \`last_ping_at\`

---

### Jadual 7: \`reviews\`, \`promotions\`, \`translations\`, \`audit_logs\`
- **reviews**: \`id\`, \`order_id\` (FK UNIQUE), \`customer_id\` (FK), \`restaurant_id\` (FK), \`rider_id\` (FK), \`restaurant_rating\`, \`comment\`
- **promotions**: \`id\`, \`code\` (UNIQUE), \`discount_type\`, \`discount_value\`, \`min_spend\`, \`valid_from\`, \`valid_until\`
- **translations**: \`id\`, \`entity_type\`, \`entity_id\`, \`translation_key\`, \`lang_code\` ('bm'/'jawi'/'en'), \`translated_text\`
- **audit_logs**: \`id\`, \`actor_id\` (FK), \`action\`, \`target_entity\`, \`target_id\`, \`ip_address\`, \`details\` (JSONB)

---

## 2. STRUKTUR FOLDER BACKEND (MONOREPO Pnpm + Turborepo)

**Mengapa Monorepo Ditentukan untuk Projek 4-Komponen ini?**
1. **Single Source of Truth**: 4 frontend apps (Customer Flutter, Rider Flutter, Merchant Flutter, Admin React CMS) berkongsi 1 API Node.js Express & PostgreSQL yang sama.
2. **Kongsian Jenis Data (Shared Types)**: DTOs, Enums, dan skema validation Zod dikongsi dalam \`packages/shared-types\` tanpa perlu disalin manual.
3. **Modul Jawi Versatil**: Penukar skrip Rumi ke Jawi dikemas dalam \`packages/jawi-converter\` untuk kegunaan CMS dan Backend API.

### Pokok Direktori Projek Backend:
\`\`\`text
beruangmakan-monorepo/
├── apps/
│   ├── api-backend/               # Node.js + Express Backend Service
│   │   └── src/
│   │       ├── config/            # Env, Database PostGIS Pool, Passport Google OAuth
│   │       ├── controllers/       # Auth, Orders, Merchants, Riders, Admin
│   │       ├── services/          # Business logic, PostGIS ST_DWithin query, Payment Gateway
│   │       ├── routes/v1/         # Laluan API REST Express (/api/v1/...)
│   │       ├── middlewares/       # JWT Auth, Role RBAC, Rate Limiter OTP
│   │       ├── jobs/              # Background Cron (Order timeout, Rider assigner)
│   │       └── server.ts          # Entry point Express
│   ├── cms-admin-web/             # Admin Web Panel (React / Next.js)
│   ├── mobile-customer/           # Customer App (Flutter)
│   ├── mobile-rider/              # Rider App (Flutter)
│   └── mobile-merchant/           # Merchant App (Flutter)
├── packages/
│   ├── shared-types/              # DTOs, Interfaces & Enums (TypeScript)
│   └── jawi-converter/            # Modul Kamus & Terjemahan Jawi
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
\`\`\`

---

## 3. STRUKTUR ENDPOINT API RESTFUL ASAS

| Modul | Kaedah HTTP | Endpoint API Path | Tujuan & Penerangan |
|---|---|---|---|
| **Auth** | \`POST\` | \`/api/v1/auth/phone/request-otp\` | Hantar kod 6-digit OTP SMS/WhatsApp (+60) |
| **Auth** | \`POST\` | \`/api/v1/auth/phone/verify-otp\` | Pengesahan OTP & pengeluaran JWT Token |
| **Auth** | \`POST\` | \`/api/v1/auth/google\` | Verification id_token Google OAuth (Customer) |
| **Auth** | \`POST\` | \`/api/v1/auth/merchant/login\` | Login Email & Kata Laluan (Merchant & Admin) |
| **Merchants** | \`GET\` | \`/api/v1/merchants/nearby\` | Carian restoran radius PostGIS (\`ST_DWithin\`) |
| **Merchants** | \`GET\` | \`/api/v1/merchants/:id\` | Profil restoran, status Halal JAKIM & senarai menu |
| **Orders** | \`POST\` | \`/api/v1/orders\` | Cipta pesanan baru, kunci stok & caj penghantaran |
| **Orders** | \`GET\` | \`/api/v1/orders/:id/track\` | Jejak status real-time & lokasi live GPS rider |
| **Riders** | \`PATCH\`| \`/api/v1/riders/toggle-online\` | Tukar status online/offline sedia bertugas |
| **Riders** | \`POST\` | \`/api/v1/riders/ping-location\` | Kemaskini koordinat GPS PostGIS rider |
| **Admin** | \`PATCH\`| \`/api/v1/admin/restaurants/:id/halal\` | Pengesahan Sijil Halal JAKIM restoran |
| **Admin** | \`GET\` | \`/api/v1/admin/audit-logs\` | Senarai rekod audit log keselamatan admin |

---

## 4. WIREFRAME TEKS & UI BLUEPRINT (CUSTOMER APP)

### Prinsip Reka Bentuk UI/UX (Oren #FF7A1A & Putih)
- **Oren (#FF7A1A)**: Digunakan khusus untuk **Tindakan Utama (Primary CTA)** (Cth: Butang Bayar, Bakul, Status Aktif, Badge Halal, Marker Peta Live Rider).
- **Putih (#FFFFFF)**: Digunakan sebagai **Latar Belakang Skrin Utama & Kad** untuk memberikan ruang visual yang bersih, moden, dan mesra pengguna.

### Perincian Layout 5 Skrin Utama Customer App:
1. **Onboarding / Auth Screen**:
   - Header Mascot Beruang Oren bersinar.
   - 2 Pilihan Login Utama: Butang Google Sign-In (1-Klik) & Butang Telefon + OTP (+60...).
   - Toggle Bahasa (BM / Jawi).
2. **Home / Search Screen**:
   - Top Bar Lokasi Oren: Pin GPS ("Kuala Lumpur, 50250").
   - Bar Carian & Filter Toggle "Pasti Halal JAKIM".
   - Carousel Promosi Diskaun & Grid Kategori Makanan.
   - Senarai Restoran Berdekatan berasaskan koordinat PostGIS.
3. **Restaurant Detail Screen**:
   - Header Banner & Badge Sijil Halal JAKIM.
   - Menu mengikut kategori dengan status stok (Available / Sold Out).
   - Bar Bawah Terapung (Sticky Bottom Bar) Oren "Lihat Bakul".
4. **Cart / Checkout Screen**:
   - Kad Alamat Penghantaran & Nota Rider.
   - Pilihan Kaedah Pembayaran Malaysia: FPX Perbankan, Touch 'n Go eWallet, Tunai.
   - Ringkasan Harga & Butang Oren Lebar "Sahkan & Bayar".
5. **Order Tracking Screen**:
   - Peta Live GPS penjejakan kedudukan rider.
   - Stepper timeline 5 peringkat (Diterima -> Disediakan -> Picked Up -> On the Way -> Delivered).
   - Kad Profil Rider & Butang Hubungi Rider.
`;

export const MarkdownOutputView: React.FC<MarkdownOutputViewProps> = ({ langMode }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyDoc = () => {
    navigator.clipboard.writeText(GENERATED_MARKDOWN_FULL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="markdown-doc-view" className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#1A1A1A] border-2 border-[#1A1A1A] rounded-3xl p-6 text-white shadow-[8px_8px_0px_0px_#FF7A1A] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-[#FF7A1A] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
              Format Markdown Bersih
            </span>
            <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter text-[#FF7A1A] mt-2">
              {langMode === 'bm' ? 'Ringkasan Dokumen Penuh BeruangMakan' : 'ريڠکسن دوکومن ڤنوه برواڠ ماکن'}
            </h2>
            <p className="text-gray-300 text-sm mt-1 font-medium">
              Dokumen ini boleh disalin terus ke dalam nota rujukan projek anda (Notion, GitHub Wiki, atau AGENTS.md).
            </p>
          </div>

          <button
            id="copy-full-md-btn"
            onClick={handleCopyDoc}
            className="flex items-center gap-2 bg-[#FF7A1A] hover:bg-[#FF7A1A]/90 text-white border-2 border-[#1A1A1A] px-5 py-3 rounded-2xl text-xs font-black transition-all shadow-[4px_4px_0px_0px_#1A1A1A] shrink-0"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Telah Disalin Penuh!' : 'Salin Dokumen Markdown'}</span>
          </button>
        </div>
      </div>

      {/* Markdown Reader Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4">
        <pre className="whitespace-pre-wrap font-sans text-xs md:text-sm text-[#1A1A1A] font-medium leading-relaxed bg-[#FFF5EB] p-6 rounded-2xl border-2 border-[#1A1A1A] overflow-x-auto max-h-[700px]">
          {GENERATED_MARKDOWN_FULL}
        </pre>
      </div>
    </div>
  );
};
