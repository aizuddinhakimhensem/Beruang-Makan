import { WireframeScreen } from '../types';

export const WIREFRAME_SCREENS: WireframeScreen[] = [
  {
    id: 'onboarding',
    titleBM: '1. Skrin Onboarding & Autentikasi',
    titleJawi: '١. سکرين اونبورديڠ د ن اوتنتيکاسي',
    purpose: 'Membenarkan pelanggan melog masuk atau mendaftar akaun baharu dengan dua pilihan fleksibel: Google Sign-In atau Nombor Telefon + OTP.',
    uiHighlights: {
      orangeBg: ['Butang Utama "Log Masuk dengan Telefon (+60)" (#FF7A1A)', 'Logo Maskot BeruangMakan dengan bulatan oren berseri'],
      whiteBg: ['Latar belakang skrin keseluruhan (#FFFFFF) untuk impak bersih & mesra pengguna', 'Kad dialog pengesahan OTP'],
      orangeTextOrAccents: ['Teks pautan "Terma & Syarat"', 'Ikon Google G-Sign-In dalam bingkai bersinar oren']
    },
    keyComponents: [
      'Header Mascot BeruangMakan (Visual Beruang Oren)',
      'Pengumuman "Makan Sedap, Halal & Pantas di Malaysia"',
      'Pilihan Auth 1: Butang Google Sign-In (Satu-klik dengan akaun Google sedia ada)',
      'Pilihan Auth 2: Butang Telefon + OTP (Input nombor telefon Malaysia +60...)',
      'Toggle Bahasa (Bahasa Melayu / Jawi)',
      'Nota Keutamaan Keselamatan Akaun & Privasi'
    ]
  },
  {
    id: 'home',
    titleBM: '2. Skrin Utama (Home & Search)',
    titleJawi: '٢. سکرين اولاما (رومه د ن چارين)',
    purpose: 'Hab utama pencarian makanan mengikut lokasi geospatial, filter status Halal JAKIM, dan kategori kegemaran.',
    uiHighlights: {
      orangeBg: ['Header Bar Lokasi Utama (Penerima)', 'Badge Promosi Diskaun "PERCUMA HANTAR"', 'Indicator Kategori Aktif'],
      whiteBg: ['Latar Skrin Utama', 'Kad Restoran dengan Bayang Lembut (Shadow-Sm)', 'Bar Carian (Search Bar) dengan sempadan kelabu'],
      orangeTextOrAccents: ['Penilaian Rating Bintang (4.8 ★)', 'Harga Ringgit Malaysia (RM)', 'Teks Tajuk Kategori']
    },
    keyComponents: [
      'Top Navigation Bar: Pin Lokasi GPS ("Kuala Lumpur, 50250") + Butang Troli (Badge Kuantiti Oren)',
      'Bar Carian Pintar: Input carian dengan ikon kanta pembesar + butang filter',
      'Filter Halal JAKIM Quick Toggle: Pill button "Pasti Halal JAKIM"',
      'Carousel Banner Promosi: Slider promosi mingguan (Cth: Diskaun RM8 Kod BERUANGPADU)',
      'Grid Kategori Makanan: Nasi Lemak, Roti Canai, Mie/Bihun, Ayam Goreng, Minuman',
      'Senarai Restoran Berdekatan (Disusun mengikut jarak PostGIS geospatial km)'
    ]
  },
  {
    id: 'restaurant_detail',
    titleBM: '3. Skrin Perincian Restoran & Menu',
    titleJawi: '٣. سکرين ڤرينچين ريستورن د ن مينو',
    purpose: 'Menampilkan maklumat kedai, sijil pengesahan Halal, senarai menu mengikut kategori, dan pilihan variasi.',
    uiHighlights: {
      orangeBg: ['Bar Terapung "Lihat Bakul (2 Item) - RM 27.50" di bahagian bawah', 'Badge Pengesahan "Halal Certified JAKIM"'],
      whiteBg: ['Latar belakang kad item menu', 'Ruang kandungan perincian makanan'],
      orangeTextOrAccents: ['Harga setiap item makanan', 'Ikon Popular 🔥', 'Butang Tambah (+)']
    },
    keyComponents: [
      'Header Image Restoran + Gambar Banner',
      'Kad Maklumat Restoran: Nama, Status Halal JAKIM, Masa Penghantaran (20-30 min), Jarak (1.2 km)',
      'Kategori Menu Tab: Makanan Utama, Set Combo, Minuman, Pencuci Mulut',
      'Senarai Card Item Menu: Gambar, Nama, Penerangan, Harga, Stock Availability (Available / Sold Out)',
      'Modal Pilihan Item: Pilihan Pedas/Kurang Manis, Tambahan Topping',
      'Bar Bawah (Sticky Bottom Bar) Akses Bakul Makanan'
    ]
  },
  {
    id: 'cart_checkout',
    titleBM: '4. Skrin Troli & Pembayaran (Checkout)',
    titleJawi: '٤. سکرين ترولي د ن ڤمبايرن',
    purpose: 'Mengesahkan senarai barangan, alamat penghantaran, perincian harga, serta memilih kaedah pembayaran tempatan.',
    uiHighlights: {
      orangeBg: ['Butang Utama "Sahkan & Bayar RM 31.50" (#FF7A1A)', 'Ikon Pilihan Kaedah Bayaran Terpilih'],
      whiteBg: ['Kad Alamat Penghantaran', 'Kad Ringgasan Bayaran', 'Input Baucar Diskaun'],
      orangeTextOrAccents: ['Jumlah Keseluruhan (Total Amount)', 'Teks Baucar "BERUANGPADU Diskaun RM5.00"']
    },
    keyComponents: [
      'Header: "Troli Makanan Anda"',
      'Kad Alamat Penghantaran: Pilihan alamat tersimpan + Nota untuk Rider',
      'Senarai Item Dipesan: Nama item, Kuantiti (+/-), Harga seunit',
      'Section Baucar Promosi: Input kod kupon',
      'Pilihan Kaedah Pembayaran Malaysia: FPX (Perbankan Internet), Touch \'n Go eWallet, GrabPay, Kad Kredit/Debit, Tunai (COD)',
      'Ringkasan Caj: Subtotal Makanan + Caj Penghantaran + Potongan Baucar = Jumlah Bersih',
      'Butang Pembayaran Oren Lebar'
    ]
  },
  {
    id: 'order_tracking',
    titleBM: '5. Skrin Penjejakan Pesanan (Order Tracking)',
    titleJawi: '٥. سکرين ڤڽجقن ڤسينن',
    purpose: 'Memberikan maklum balas status pesanan secara real-time dari dapur restoran hingga lokasi rider tiba di rumah.',
    uiHighlights: {
      orangeBg: ['Garis Stepper Status Aktif', 'Pin Peta Lokasi Rider Beruang Live', 'Butang "Hubungi Rider"'],
      whiteBg: ['Kad Utama Penjejakan', 'Latar Belakang Peta GPS'],
      orangeTextOrAccents: ['Anggaran Masa Ketibaan (ETA: 12 Min)', 'Nombor Pesanan (BM-20260805-9921)']
    },
    keyComponents: [
      'Peta Live GPS Tracking: Menunjukkan pergerakan rider dari restoran ke rumah pelanggan',
      'Anggaran Masa Sampai (ETA Display): "Makanan Dijangka Tiba dalam 12 Minit"',
      'Stepper Status Timeline 5 Peringkat:',
      '  1. Pesanan Diterima Restoran ✓',
      '  2. Makanan Sedang Disediakan ✓',
      '  3. Rider Mengambil Makanan (Picked Up) ✓',
      '  4. Rider Dalam Perjalanan (On the Way) 🚴‍♂️',
      '  5. Makanan Selamat Sampai (Delivered)',
      'Kad Profil Rider: Nama, Plat Motor (VCE 8821), Rating, Butang Panggilan / Mesej',
      'Ringkasan Pesanan Ringkas'
    ]
  }
];
