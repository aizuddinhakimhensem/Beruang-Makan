export interface FolderNode {
  name: string;
  type: 'folder' | 'file';
  description?: string;
  children?: FolderNode[];
}

export const MONOREPO_EXPLANATION = {
  recommendation: 'Cadangan Utama: Structure Monorepo Bersepadu (Turborepo / pnpm Workspaces) ATAU Modular Express Backend.',
  rationale: [
    'Satu Sumber Kebenaran (Single Source of Truth): 4 aplikasi (Customer, Rider, Merchant, Admin) berkongsi backend API yang sama, mengelakkan duplikasi jenis data (TypeScript DTOs / Schemas).',
    'Pengurusan Versi & Perubahan Teratur: Sebarang perubahan skema database atau API endpoint boleh dikemaskini serentak tanpa risiko penembusan breaking changes antara apps.',
    'Pembangunan Laju: Pakej utiliti kongsi seperti validator DTO (Zod/Yup), fungsi geometri PostGIS, perkhidmatan OTP, dan dictionary Jawi boleh dipaketkan sebagai pnpm workspace shared package.',
    'Deployment Kemas: Backend Node.js Express boleh di-deploy dengan mudah ke Google Cloud Run / AWS ECS manakala Admin CMS (Next.js) di-deploy ke Vercel/Cloud Run dari repository yang sama.'
  ]
};

export const BACKEND_FOLDER_TREE: FolderNode = {
  name: 'beruangmakan-monorepo',
  type: 'folder',
  description: 'Akar projek monorepo BeruangMakan',
  children: [
    {
      name: 'apps',
      type: 'folder',
      description: 'Aplikasi frontend dan perkhidmatan utama',
      children: [
        {
          name: 'api-backend',
          type: 'folder',
          description: 'Aplikasi Backend Node.js + Express (Menyediakan API REST untuk keempat-empat app)',
          children: [
            {
              name: 'src',
              type: 'folder',
              children: [
                {
                  name: 'config',
                  type: 'folder',
                  description: 'Konfigurasi persekitaran, database connection pool (pg/Kysely/Prisma), Firebase Admin SDK, Google OAuth, Twilio/WABA OTP',
                  children: [
                    { name: 'env.ts', type: 'file', description: 'Pengesahan pembolehubah persekitaran (dotenv + Zod)' },
                    { name: 'database.ts', type: 'file', description: 'PostgreSQL PostGIS Connection Pool & Client' },
                    { name: 'passport-google.ts', type: 'file', description: 'Strategi Google OAuth 2.0 Passport' }
                  ]
                },
                {
                  name: 'controllers',
                  type: 'folder',
                  description: 'Pengendali HTTP Request & Response mengikut modul',
                  children: [
                    { name: 'auth.controller.ts', type: 'file', description: 'Logik login Phone+OTP, Google Sign-In, Email Merchant' },
                    { name: 'order.controller.ts', type: 'file', description: 'Cipta pesanan, pengiraan tambang, kemas kini status' },
                    { name: 'merchant.controller.ts', type: 'file', description: 'Pendaftaran restoran, status Halal, pengurusan menu' },
                    { name: 'rider.controller.ts', type: 'file', description: 'Ping GPS lokasi live rider, terima pesanan' },
                    { name: 'admin.controller.ts', type: 'file', description: 'Pengesahan Halal, audit log, statistik perniagaan' }
                  ]
                },
                {
                  name: 'services',
                  type: 'folder',
                  description: 'Logik perniagaan teras (Business Logic Layer) & query database',
                  children: [
                    { name: 'auth.service.ts', type: 'file', description: 'Penjanaan JWT token, pengesahan OTP SMS/WhatsApp' },
                    { name: 'geospatial.service.ts', type: 'file', description: 'Pengiraan radius carian PostGIS ST_DWithin & ST_Distance' },
                    { name: 'order.service.ts', type: 'file', description: 'Transaksi database ACID untuk pembentukan pesanan & stok' },
                    { name: 'payment.service.ts', type: 'file', description: 'Integrasi Payment Gateway (ToyyibPay/Curlec/HitPay/TNG)' },
                    { name: 'translation.service.ts', type: 'file', description: 'Logik penukaran/pencapaian skrip Jawi dinamik' }
                  ]
                },
                {
                  name: 'routes',
                  type: 'folder',
                  description: 'Definisi laluan REST API Express',
                  children: [
                    { name: 'v1', type: 'folder', children: [
                      { name: 'auth.routes.ts', type: 'file', description: '/api/v1/auth' },
                      { name: 'orders.routes.ts', type: 'file', description: '/api/v1/orders' },
                      { name: 'merchants.routes.ts', type: 'file', description: '/api/v1/merchants' },
                      { name: 'riders.routes.ts', type: 'file', description: '/api/v1/riders' },
                      { name: 'admin.routes.ts', type: 'file', description: '/api/v1/admin' }
                    ]}
                  ]
                },
                {
                  name: 'middlewares',
                  type: 'folder',
                  description: 'Middleware keselamatan & pengesahan',
                  children: [
                    { name: 'auth.middleware.ts', type: 'file', description: 'Pengesahan JWT Bearer token' },
                    { name: 'role.middleware.ts', type: 'file', description: 'Kawalan capaian berasaskan peranan (RBAC)' },
                    { name: 'rate-limiter.middleware.ts', type: 'file', description: 'Perlindungan serangan Brute Force pada OTP' },
                    { name: 'error.middleware.ts', type: 'file', description: 'Pengendalian ralat berpusat & format respon standard' }
                  ]
                },
                {
                  name: 'jobs',
                  type: 'folder',
                  description: 'Tugasan latar belakang (Background Cron / Queue Jobs)',
                  children: [
                    { name: 'order-timeout.job.ts', type: 'file', description: 'Auto-batal pesanan jika restoran tidak terima dalam 5 minit' },
                    { name: 'rider-assigner.job.ts', type: 'file', description: 'Algoritma padanan automatik rider terdekat' }
                  ]
                },
                { name: 'server.ts', type: 'file', description: 'Titik permulaan server Express Node.js' }
              ]
            }
          ]
        },
        {
          name: 'cms-admin-web',
          type: 'folder',
          description: 'Aplikasi Admin Web Panel (React / Next.js)'
        },
        {
          name: 'mobile-customer',
          type: 'folder',
          description: 'Aplikasi Pelanggan Flutter (Android/iOS)'
        },
        {
          name: 'mobile-rider',
          type: 'folder',
          description: 'Aplikasi Rider Flutter (Android/iOS)'
        },
        {
          name: 'mobile-merchant',
          type: 'folder',
          description: 'Aplikasi Peniaga Flutter (Android/iOS)'
        }
      ]
    },
    {
      name: 'packages',
      type: 'folder',
      description: 'Pakej perkongsian kod (Shared Workspaces)',
      children: [
        {
          name: 'shared-types',
          type: 'folder',
          description: 'Definisi jenis TypeScript (DTOs, Enums, Models)'
        },
        {
          name: 'jawi-converter',
          type: 'folder',
          description: 'Modul penukar perkataan Rumi ke Jawi & Kamus Asas'
        }
      ]
    },
    { name: 'package.json', type: 'file', description: 'Spesifikasi Monorepo Workspace' },
    { name: 'pnpm-workspace.yaml', type: 'file', description: 'Definisi pakej pnpm' },
    { name: 'turbo.json', type: 'file', description: 'Konfigurasi alur kerja Turborepo' }
  ]
};
