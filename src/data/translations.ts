export interface DictItem {
  bm: string;
  jawi: string;
}

export const DICTIONARY: Record<string, DictItem> = {
  appName: { bm: 'BeruangMakan', jawi: 'برواڠ ماکن' },
  tagline: { bm: 'Penghantaran Makanan Halal & Pantas Malaysia', jawi: 'ڤڠهنترن ماکنن حلال د ن ڤنتس مليسيا' },
  welcome: { bm: 'Selamat Datang ke BeruangMakan!', jawi: 'سلامت داتڠ ک برواڠ ماکن!' },
  loginGoogle: { bm: 'Log Masuk dengan Google', jawi: 'لوݢ ماسوق دڠن ݢوݢل' },
  loginPhone: { bm: 'Log Masuk dengan Nombor Telefon (OTP)', jawi: 'لوݢ ماسوق دڠن نومبور تليفون (OTP)' },
  selectRole: { bm: 'Pilih Peranan Pengguna', jawi: 'ڤيليه ڤرانن ڤڠݢونا' },
  searchPlaceholder: { bm: 'Cari Nasi Lemak, Roti Canai, Teh Tarik...', jawi: 'چاري ناسي لمق، روتي چاناي، تيه تاريق...' },
  halalOnly: { bm: 'Halal JAKIM Sahaja', jawi: 'حلال جاکيم سهاج' },
  nearbyRestaurants: { bm: 'Restoran Berdekatan Anda', jawi: 'ريستورن بردکاتن اندا' },
  popularItems: { bm: 'Menu Terlaris & Cadangan', jawi: 'مينو ترلاريس د ن چادڠن' },
  addToCart: { bm: 'Tambah ke Bakul', jawi: 'تمبه ک باکول' },
  checkout: { bm: 'Bayar Sekarang', jawi: 'باير سکارڠ' },
  orderStatus: { bm: 'Status Pesanan Makanan', jawi: 'ستاتوس ڤسينن ماکنن' },
  preparing: { bm: 'Dapur sedang menyediakan makanan anda...', jawi: 'داڤور سدڠ مڽدياکن ماکنن اندا...' },
  onTheWay: { bm: 'Rider Beruang sedang dalam perjalanan!', jawi: 'رايدر برواڠ سدڠ دالم ڤرجلنن!' },
  delivered: { bm: 'Pesanan Telah Selamat Sampai!', jawi: 'ڤسينن تله سلامت سمڤاي!' },
  paymentMethods: { bm: 'Kaedah Pembayaran (FPX / TNG / Tunai)', jawi: 'قاعدة ڤمبايرن (FPX / TNG / توناي)' }
};
