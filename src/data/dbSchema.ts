import { TableDef } from '../types';

export const DB_SCHEMA: TableDef[] = [
  {
    id: 'users',
    name: 'users',
    description: 'Jadual utama pengguna sistem berkongsi role-based auth (Customer, Rider, Merchant, Admin).',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, defaultValue: 'gen_random_uuid()', description: 'Kunci utama unique identifier pengguna' },
      { name: 'phone_number', type: 'VARCHAR(20)', unique: true, nullable: true, description: 'Nombor telefon untuk OTP (Format Malaysia: +60...)' },
      { name: 'email', type: 'VARCHAR(255)', unique: true, nullable: true, description: 'E-mel pengguna (Wajib untuk Merchant & Admin)' },
      { name: 'password_hash', type: 'VARCHAR(255)', nullable: true, description: 'Hash kata laluan (Wajib untuk Merchant & Admin)' },
      { name: 'role', type: "ENUM('customer','rider','merchant','admin')", nullable: false, defaultValue: "'customer'", description: 'Peranan pengguna dalam ekosistem' },
      { name: 'auth_provider', type: "ENUM('phone','google','both')", nullable: false, defaultValue: "'phone'", description: 'Kaedah autentikasi yang digunakan' },
      { name: 'google_id', type: 'VARCHAR(255)', unique: true, nullable: true, description: 'ID Pengguna Google OAuth 2.0' },
      { name: 'full_name', type: 'VARCHAR(150)', nullable: false, description: 'Nama penuh pengguna' },
      { name: 'avatar_url', type: 'TEXT', nullable: true, description: 'URL gambar profil' },
      { name: 'is_active', type: 'BOOLEAN', defaultValue: 'TRUE', description: 'Status akaun aktif / digantung' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'CURRENT_TIMESTAMP', description: 'Tarikh pendaftaran' },
      { name: 'updated_at', type: 'TIMESTAMPTZ', defaultValue: 'CURRENT_TIMESTAMP', description: 'Tarikh kemas kini terakhir' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_users_phone ON users(phone_number) WHERE phone_number IS NOT NULL;',
      'CREATE UNIQUE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;',
      'CREATE UNIQUE INDEX idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL;',
      'CREATE INDEX idx_users_role ON users(role);'
    ]
  },
  {
    id: 'restaurants',
    name: 'restaurants',
    description: 'Profil kedai/restoran merchant termasuk status pengesahan Halal JAKIM dan koordinat geospatial PostGIS.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, defaultValue: 'gen_random_uuid()', description: 'Kunci utama restoran' },
      { name: 'merchant_user_id', type: 'UUID', isFk: true, fkRef: 'users(id)', nullable: false, description: 'FK ke pengguna pemilik restoran (role merchant)' },
      { name: 'name', type: 'VARCHAR(200)', nullable: false, description: 'Nama kedai / restoran' },
      { name: 'slug', type: 'VARCHAR(250)', unique: true, nullable: false, description: 'URL slug untuk carian mudah' },
      { name: 'logo_url', type: 'TEXT', nullable: true, description: 'URL logo restoran' },
      { name: 'banner_url', type: 'TEXT', nullable: true, description: 'URL gambar banner' },
      { name: 'halal_status', type: "ENUM('certified_jakim','muslim_owned','non_halal')", nullable: false, defaultValue: "'muslim_owned'", description: 'Status pensijilan Halal JAKIM / Muslim Owned' },
      { name: 'halal_cert_number', type: 'VARCHAR(100)', nullable: true, description: 'Nombor sijil Halal JAKIM (jika ada)' },
      { name: 'address_text', type: 'TEXT', nullable: false, description: 'Alamat premis berteks' },
      { name: 'location', type: 'GEOGRAPHY(Point, 4326)', nullable: false, description: 'Lokasi koordinat geospatial (Longitude, Latitude)' },
      { name: 'cuisine_types', type: 'TEXT[]', nullable: true, description: 'Array kategori masakan (Cth: ["Nasi Lemak", "Mamak", "Minuman"])' },
      { name: 'is_open', type: 'BOOLEAN', defaultValue: 'TRUE', description: 'Status waktu operasi (Buka/Tutup)' },
      { name: 'rating_avg', type: 'NUMERIC(3,2)', defaultValue: '0.00', description: 'Purata rating keseluruhan (0.00 - 5.00)' },
      { name: 'rating_count', type: 'INTEGER', defaultValue: '0', description: 'Jumlah ulasan diterima' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'CURRENT_TIMESTAMP', description: 'Masa pendaftaran restoran' }
    ],
    indexes: [
      'CREATE INDEX idx_restaurants_location ON restaurants USING GIST (location); -- PostGIS spatial index untuk carian jarak radius',
      'CREATE INDEX idx_restaurants_halal ON restaurants(halal_status);',
      'CREATE INDEX idx_restaurants_is_open ON restaurants(is_open);',
      'CREATE INDEX idx_restaurants_merchant ON restaurants(merchant_user_id);'
    ]
  },
  {
    id: 'menu_items',
    name: 'menu_items',
    description: 'Senarai item makanan/minuman mengikut restoran dengan status stok real-time.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, defaultValue: 'gen_random_uuid()', description: 'Kunci utama menu item' },
      { name: 'restaurant_id', type: 'UUID', isFk: true, fkRef: 'restaurants(id)', nullable: false, description: 'FK ke restoran pemilik' },
      { name: 'name', type: 'VARCHAR(200)', nullable: false, description: 'Nama makanan/minuman' },
      { name: 'description', type: 'TEXT', nullable: true, description: 'Penerangan item & bahan' },
      { name: 'price', type: 'NUMERIC(10,2)', nullable: false, description: 'Harga dalam MYR (Ringgit Malaysia)' },
      { name: 'image_url', type: 'TEXT', nullable: true, description: 'Gambar makanan' },
      { name: 'category', type: 'VARCHAR(100)', nullable: false, description: 'Kategori menu (Cth: "Makanan Utama", "Minuman", "Pencuci Mulut")' },
      { name: 'is_available', type: 'BOOLEAN', defaultValue: 'TRUE', description: 'Status ketersediaan stok (Available / Sold Out)' },
      { name: 'stock_quantity', type: 'INTEGER', nullable: true, description: 'Kuantiti stok (NULL jika tidak terhad)' },
      { name: 'is_popular', type: 'BOOLEAN', defaultValue: 'FALSE', description: 'Flag item terlaris / cadangan' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'CURRENT_TIMESTAMP', description: 'Masa cipta item' }
    ],
    indexes: [
      'CREATE INDEX idx_menu_restaurant ON menu_items(restaurant_id);',
      'CREATE INDEX idx_menu_available ON menu_items(is_available);',
      'CREATE INDEX idx_menu_category ON menu_items(restaurant_id, category);'
    ]
  },
  {
    id: 'orders',
    name: 'orders',
    description: 'Rekod pesanan makanan pelanggan dari mula dipesan sehingga penghantaran selesai.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, defaultValue: 'gen_random_uuid()', description: 'Kunci utama pesanan' },
      { name: 'order_number', type: 'VARCHAR(50)', unique: true, nullable: false, description: 'Nombor Pesanan Unik mesra rujukan (Cth: BM-20260805-8821)' },
      { name: 'customer_id', type: 'UUID', isFk: true, fkRef: 'users(id)', nullable: false, description: 'FK ke pengguna pelanggan' },
      { name: 'restaurant_id', type: 'UUID', isFk: true, fkRef: 'restaurants(id)', nullable: false, description: 'FK ke restoran penyedia' },
      { name: 'rider_id', type: 'UUID', isFk: true, fkRef: 'users(id)', nullable: true, description: 'FK ke pengguna penghantar (rider)' },
      { name: 'status', type: "ENUM('pending','accepted','preparing','ready_for_pickup','picked_up','on_the_way','delivered','cancelled')", nullable: false, defaultValue: "'pending'", description: 'Status perjalanan pesanan' },
      { name: 'subtotal', type: 'NUMERIC(10,2)', nullable: false, description: 'Jumlah harga makanan' },
      { name: 'delivery_fee', type: 'NUMERIC(10,2)', nullable: false, description: 'Caj penghantaran' },
      { name: 'discount_amount', type: 'NUMERIC(10,2)', defaultValue: '0.00', description: 'Jumlah potongan baucar' },
      { name: 'total_amount', type: 'NUMERIC(10,2)', nullable: false, description: 'Jumlah bersih kena bayar (MYR)' },
      { name: 'delivery_address_text', type: 'TEXT', nullable: false, description: 'Alamat lengkap destinasi' },
      { name: 'delivery_location', type: 'GEOGRAPHY(Point, 4326)', nullable: false, description: 'Koordinat lokasi pelanggan' },
      { name: 'notes_for_rider', type: 'TEXT', nullable: true, description: 'Nota tambahan untuk penghantar' },
      { name: 'cancelled_reason', type: 'TEXT', nullable: true, description: 'Sebab pembatalan jika ada' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'CURRENT_TIMESTAMP', description: 'Masa pesanan dibuat' },
      { name: 'delivered_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Masa pesanan disahkan sampai' }
    ],
    indexes: [
      'CREATE INDEX idx_orders_customer ON orders(customer_id);',
      'CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);',
      'CREATE INDEX idx_orders_rider ON orders(rider_id);',
      'CREATE INDEX idx_orders_status ON orders(status);',
      'CREATE INDEX idx_orders_created ON orders(created_at DESC);'
    ]
  },
  {
    id: 'order_items',
    name: 'order_items',
    description: 'Perincian setiap item dalam sesuatu pesanan.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, defaultValue: 'gen_random_uuid()', description: 'Kunci utama item pesanan' },
      { name: 'order_id', type: 'UUID', isFk: true, fkRef: 'orders(id)', nullable: false, description: 'FK ke pesanan utama' },
      { name: 'menu_item_id', type: 'UUID', isFk: true, fkRef: 'menu_items(id)', nullable: false, description: 'FK ke item menu' },
      { name: 'item_name', type: 'VARCHAR(200)', nullable: false, description: 'Nama item pada masa pesanan' },
      { name: 'unit_price', type: 'NUMERIC(10,2)', nullable: false, description: 'Harga seunit semasa beli' },
      { name: 'quantity', type: 'INTEGER', nullable: false, description: 'Kuantiti yang dipesan' },
      { name: 'total_price', type: 'NUMERIC(10,2)', nullable: false, description: 'Harga keseluruhan item (unit_price * quantity)' },
      { name: 'special_instructions', type: 'TEXT', nullable: true, description: 'Arahan Khas (Cth: "Kurang manis", "Tambah sambal")' }
    ],
    indexes: [
      'CREATE INDEX idx_order_items_order ON order_items(order_id);'
    ]
  },
  {
    id: 'payments',
    name: 'payments',
    description: 'Rekod transaksi kewangan bagi setiap pesanan makanan.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, defaultValue: 'gen_random_uuid()', description: 'Kunci utama transaksi bayaran' },
      { name: 'order_id', type: 'UUID', isFk: true, fkRef: 'orders(id)', nullable: false, unique: true, description: 'FK ke pesanan berkaitan' },
      { name: 'payment_method', type: "ENUM('fpx','tng_ewallet','grabpay','credit_card','cash_on_delivery')", nullable: false, description: 'Kaedah pembayaran perbankan/e-wallet Malaysia' },
      { name: 'transaction_reference', type: 'VARCHAR(100)', unique: true, nullable: true, description: 'Nombor rujukan gateway bayaran (Cth: FPX / TNG Ref)' },
      { name: 'amount', type: 'NUMERIC(10,2)', nullable: false, description: 'Nilai amaun transaksi (MYR)' },
      { name: 'status', type: "ENUM('pending','successful','failed','refunded')", nullable: false, defaultValue: "'pending'", description: 'Status kejayaan transaksi' },
      { name: 'paid_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Tarikh & masa pembayaran berjaya' },
      { name: 'raw_response', type: 'JSONB', nullable: true, description: 'Respons mentah dari Payment Gateway untuk audit' }
    ],
    indexes: [
      'CREATE INDEX idx_payments_order ON payments(order_id);',
      'CREATE INDEX idx_payments_status ON payments(status);',
      'CREATE INDEX idx_payments_tx_ref ON payments(transaction_reference);'
    ]
  },
  {
    id: 'riders',
    name: 'riders',
    description: 'Profil dan status live penghantaran rider BeruangMakan.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, defaultValue: 'gen_random_uuid()', description: 'Kunci utama profil rider' },
      { name: 'user_id', type: 'UUID', isFk: true, fkRef: 'users(id)', nullable: false, unique: true, description: 'FK ke pengguna dengan role rider' },
      { name: 'vehicle_type', type: "ENUM('motorcycle','car','bicycle')", nullable: false, defaultValue: "'motorcycle'", description: 'Jenis kenderaan rider' },
      { name: 'license_plate', type: 'VARCHAR(20)', nullable: false, description: 'Nombor plat kenderaan' },
      { name: 'is_online', type: 'BOOLEAN', defaultValue: 'FALSE', description: 'Status ketersediaan menerima tugas' },
      { name: 'is_busy', type: 'BOOLEAN', defaultValue: 'FALSE', description: 'Status sedang mengendalikan pesanan aktif' },
      { name: 'current_location', type: 'GEOGRAPHY(Point, 4326)', nullable: true, description: 'Koordinat lokasi live terkini rider' },
      { name: 'last_ping_at', type: 'TIMESTAMPTZ', nullable: true, description: 'Masa kemas kini lokasi GPS terakhir' },
      { name: 'rating_avg', type: 'NUMERIC(3,2)', defaultValue: '5.00', description: 'Purata bintang penilaian rider' }
    ],
    indexes: [
      'CREATE INDEX idx_riders_location ON riders USING GIST (current_location); -- PostGIS spatial index untuk carian rider terdekat',
      'CREATE INDEX idx_riders_available ON riders(is_online, is_busy);'
    ]
  },
  {
    id: 'reviews',
    name: 'reviews',
    description: 'Penilaian dan ulasan daripada pelanggan kepada restoran dan rider.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, defaultValue: 'gen_random_uuid()', description: 'Kunci utama ulasan' },
      { name: 'order_id', type: 'UUID', isFk: true, fkRef: 'orders(id)', nullable: false, unique: true, description: 'FK ke pesanan (1 pesanan = 1 ulasan)' },
      { name: 'customer_id', type: 'UUID', isFk: true, fkRef: 'users(id)', nullable: false, description: 'FK ke pelanggan' },
      { name: 'restaurant_id', type: 'UUID', isFk: true, fkRef: 'restaurants(id)', nullable: false, description: 'FK ke restoran' },
      { name: 'rider_id', type: 'UUID', isFk: true, fkRef: 'users(id)', nullable: true, description: 'FK ke rider' },
      { name: 'restaurant_rating', type: 'INTEGER', nullable: false, description: 'Skala rating restoran (1 hingga 5 bintang)' },
      { name: 'rider_rating', type: 'INTEGER', nullable: true, description: 'Skala rating rider (1 hingga 5 bintang)' },
      { name: 'comment', type: 'TEXT', nullable: true, description: 'Teks ulasan pelanggan' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'CURRENT_TIMESTAMP', description: 'Tarikh ulasan dihantar' }
    ],
    indexes: [
      'CREATE INDEX idx_reviews_restaurant ON reviews(restaurant_id);',
      'CREATE INDEX idx_reviews_rider ON reviews(rider_id);'
    ]
  },
  {
    id: 'promotions',
    name: 'promotions',
    description: 'Baucar promosi dan diskaun untuk kempen pemasaran.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, defaultValue: 'gen_random_uuid()', description: 'Kunci utama promosi' },
      { name: 'code', type: 'VARCHAR(50)', unique: true, nullable: false, description: 'Kod promosi (Cth: BERUANGPADU, MAKANLEKAS)' },
      { name: 'discount_type', type: "ENUM('percentage','fixed_amount')", nullable: false, description: 'Jenis diskaun (Peratus % atau Amaun Tetap RM)' },
      { name: 'discount_value', type: 'NUMERIC(10,2)', nullable: false, description: 'Nilai potongan (Cth: 20.00 untuk 20% / RM20)' },
      { name: 'min_spend', type: 'NUMERIC(10,2)', defaultValue: '0.00', description: 'Minimum perbelanjaan layak' },
      { name: 'max_discount', type: 'NUMERIC(10,2)', nullable: true, description: 'Had maksimum potongan RM untuk peratusan' },
      { name: 'valid_from', type: 'TIMESTAMPTZ', nullable: false, description: 'Masa mula promosi' },
      { name: 'valid_until', type: 'TIMESTAMPTZ', nullable: false, description: 'Masa tamat promosi' },
      { name: 'usage_limit', type: 'INTEGER', nullable: true, description: 'Had penggunaan keseluruhan' },
      { name: 'used_count', type: 'INTEGER', defaultValue: '0', description: 'Jumlah kali telah ditebus' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_promotions_code ON promotions(code);',
      'CREATE INDEX idx_promotions_validity ON promotions(valid_from, valid_until);'
    ]
  },
  {
    id: 'translations',
    name: 'translations',
    description: 'Penyimpanan terjemahan pelbagai bahasa khusus untuk teks dinamik BM dan Jawi.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, defaultValue: 'gen_random_uuid()', description: 'Kunci utama terjemahan' },
      { name: 'entity_type', type: 'VARCHAR(50)', nullable: false, description: 'Entiti sasaran (Cth: "category", "menu_item", "system_label")' },
      { name: 'entity_id', type: 'UUID', nullable: true, description: 'ID rekod entiti berkaitan (jika dinamik)' },
      { name: 'translation_key', type: 'VARCHAR(150)', nullable: false, description: 'Kata kunci terjemahan' },
      { name: 'lang_code', type: "ENUM('bm','jawi','en')", nullable: false, description: 'Kod bahasa (BM / Jawi / EN)' },
      { name: 'translated_text', type: 'TEXT', nullable: false, description: 'Teks terjemahan dalam skrip berkaitan' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'CURRENT_TIMESTAMP', description: 'Masa dicipta' }
    ],
    indexes: [
      'CREATE UNIQUE INDEX idx_translations_lookup ON translations(entity_type, entity_id, translation_key, lang_code);',
      'CREATE INDEX idx_translations_key ON translations(translation_key, lang_code);'
    ]
  },
  {
    id: 'audit_logs',
    name: 'audit_logs',
    description: 'Jadual audit log bagi merekodkan semua tindakan sensitif oleh Admin & Merchant CMS.',
    columns: [
      { name: 'id', type: 'UUID', isPk: true, defaultValue: 'gen_random_uuid()', description: 'Kunci utama log audit' },
      { name: 'actor_id', type: 'UUID', isFk: true, fkRef: 'users(id)', nullable: false, description: 'FK pengguna yang melakukan tindakan' },
      { name: 'action', type: 'VARCHAR(100)', nullable: false, description: 'Nama tindakan (Cth: "HALAL_VERIFIED", "MERCHANT_SUSPENDED", "ORDER_REFUNDED")' },
      { name: 'target_entity', type: 'VARCHAR(50)', nullable: false, description: 'Nama jadual entiti disasarkan' },
      { name: 'target_id', type: 'UUID', nullable: true, description: 'ID rekod yang diubah' },
      { name: 'ip_address', type: 'VARCHAR(45)', nullable: true, description: 'Alamat IP pengguna' },
      { name: 'details', type: 'JSONB', nullable: true, description: 'Data perubahan (sebelum & selepas)' },
      { name: 'created_at', type: 'TIMESTAMPTZ', defaultValue: 'CURRENT_TIMESTAMP', description: 'Masa kejadian berlaku' }
    ],
    indexes: [
      'CREATE INDEX idx_audit_actor ON audit_logs(actor_id);',
      'CREATE INDEX idx_audit_action ON audit_logs(action);',
      'CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);'
    ]
  }
];

export const SQL_DDL_FULL = `-- ==========================================
-- SKEMA DATABASE POSTGRESQL + POSTGIS: BERUANGMAKAN
-- ==========================================

-- 1. Aktifkan Ekstensi PostGIS untuk Sokongan Geospatial Lokasi
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Jenis Enum Sistem
CREATE TYPE user_role AS ENUM ('customer', 'rider', 'merchant', 'admin');
CREATE TYPE auth_provider_type AS ENUM ('phone', 'google', 'both');
CREATE TYPE halal_status_type AS ENUM ('certified_jakim', 'muslim_owned', 'non_halal');
CREATE TYPE order_status_type AS ENUM ('pending', 'accepted', 'preparing', 'ready_for_pickup', 'picked_up', 'on_the_way', 'delivered', 'cancelled');
CREATE TYPE payment_method_type AS ENUM ('fpx', 'tng_ewallet', 'grabpay', 'credit_card', 'cash_on_delivery');
CREATE TYPE payment_status_type AS ENUM ('pending', 'successful', 'failed', 'refunded');
CREATE TYPE vehicle_type_enum AS ENUM ('motorcycle', 'car', 'bicycle');
CREATE TYPE discount_type_enum AS ENUM ('percentage', 'fixed_amount');
CREATE TYPE lang_code_type AS ENUM ('bm', 'jawi', 'en');

-- 3. Jadual Penuh
${DB_SCHEMA.map(table => {
  const colsStr = table.columns.map(c => {
    let line = `  ${c.name} ${c.type}`;
    if (c.isPk) line += ' PRIMARY KEY';
    if (c.nullable === false && !c.isPk) line += ' NOT NULL';
    if (c.unique) line += ' UNIQUE';
    if (c.defaultValue) line += ` DEFAULT ${c.defaultValue}`;
    if (c.isFk && c.fkRef) line += ` REFERENCES ${c.fkRef}`;
    return line;
  }).join(',\n');
  
  const idxStr = table.indexes.join('\n');
  return `-- Jadual: ${table.name}\nCREATE TABLE ${table.name} (\n${colsStr}\n);\n${idxStr}\n`;
}).join('\n')}
`;
