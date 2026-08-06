import React, { useState } from 'react';
import { WireframeScreen, LanguageMode } from '../types';
import { WIREFRAME_SCREENS } from '../data/wireframeData';
import { DICTIONARY } from '../data/translations';
import { Smartphone, MapPin, Search, Star, Clock, CheckCircle2, ChevronRight, ShoppingBag, ShieldCheck, ArrowRight, PhoneCall, CreditCard, Sparkles } from 'lucide-react';

interface CustomerWireframeViewProps {
  langMode: LanguageMode;
}

export const CustomerWireframeView: React.FC<CustomerWireframeViewProps> = ({ langMode }) => {
  const [activeScreenId, setActiveScreenId] = useState<string>('onboarding');
  const [halalFilterActive, setHalalFilterActive] = useState<boolean>(true);
  const [cartCount, setCartCount] = useState<number>(2);
  const [selectedPayment, setSelectedPayment] = useState<string>('tng');

  const currentScreen = WIREFRAME_SCREENS.find(s => s.id === activeScreenId) || WIREFRAME_SCREENS[0];

  const dict = (key: keyof typeof DICTIONARY) => DICTIONARY[key][langMode];

  return (
    <div id="customer-wireframe-view" className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#FF7A1A] border-2 border-[#1A1A1A] rounded-3xl p-6 text-white shadow-[8px_8px_0px_0px_#1A1A1A] space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-2 relative z-10">
          <span className="bg-[#1A1A1A] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Mobile UI Wireframe Blueprint
          </span>
          <span className="bg-white text-[#FF7A1A] text-xs font-black px-3 py-1 rounded-full border border-[#1A1A1A]">
            Artistic Flair Theme: Oren (#FF7A1A) & Ink (#1A1A1A)
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter relative z-10">
          {langMode === 'bm' ? 'Wireframe Skrin Utama Customer App' : 'وايرفرَيم سکرين اولاما کستومر اَيڤ'}
        </h2>
        <p className="text-white/90 font-medium text-sm max-w-3xl relative z-10">
          Panduan reka bentuk UI/UX mesra pengguna dengan perincian artistik, garisan tebal 2px, shadow offset berani, dan pilihan warna oren (#FF7A1A) serta latar belakang putih (#FFFFFF).
        </p>
        <div className="absolute -bottom-6 -right-6 text-8xl opacity-20 rotate-12 pointer-events-none">🐻</div>
      </div>

      {/* Screen Selection Navigation */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {WIREFRAME_SCREENS.map(screen => (
          <button
            key={screen.id}
            id={`wireframe-tab-${screen.id}`}
            onClick={() => setActiveScreenId(screen.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 border-2 ${
              activeScreenId === screen.id
                ? 'bg-[#FF7A1A] text-white border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]'
                : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/20 hover:border-[#1A1A1A] hover:bg-[#FFF5EB]'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{langMode === 'bm' ? screen.titleBM : screen.titleJawi}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Phone Mockup Container */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-[380px] bg-[#1A1A1A] p-4 rounded-[44px] shadow-[12px_12px_0px_0px_#FF7A1A] border-4 border-[#1A1A1A] space-y-3 relative">
            {/* Phone Speaker Notch */}
            <div className="w-28 h-4 bg-black rounded-full mx-auto flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-800 rounded-full" />
            </div>

            {/* Phone Screen Canvas (375px responsive simulator) */}
            <div className="bg-[#FDFDFD] rounded-[32px] overflow-hidden min-h-[560px] max-h-[640px] flex flex-col justify-between border-2 border-[#1A1A1A] text-[#1A1A1A] relative font-sans">
              
              {/* STATUS BAR */}
              <div className="bg-white px-5 py-2 flex items-center justify-between text-[11px] font-black text-[#1A1A1A] border-b-2 border-[#1A1A1A]">
                <span>9:41</span>
                <div className="flex items-center gap-1 text-[10px]">
                  <span>5G</span>
                  <span>🇲🇾</span>
                  <span>100%</span>
                </div>
              </div>

              {/* DYNAMIC SCREEN CONTENT */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* 1. ONBOARDING SCREEN MOCKUP */}
                {activeScreenId === 'onboarding' && (
                  <div className="space-y-6 text-center py-6">
                    <div className="w-20 h-20 bg-[#FF7A1A] border-2 border-[#1A1A1A] rounded-3xl mx-auto flex items-center justify-center text-4xl text-white shadow-[4px_4px_0px_0px_#1A1A1A] rotate-3">
                      🐻
                    </div>
                    <div>
                      <h3 className="text-2xl font-black italic tracking-tighter text-[#1A1A1A]">
                        {dict('appName')}
                      </h3>
                      <p className="text-xs text-gray-600 font-bold mt-1 px-4">
                        {dict('tagline')}
                      </p>
                    </div>

                    <div className="space-y-3 pt-4">
                      {/* Choice 1: Google Sign In */}
                      <button className="w-full py-3 px-4 bg-white border-2 border-[#1A1A1A] rounded-2xl flex items-center justify-center gap-3 text-xs font-black text-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:bg-gray-50 transition-all">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>{dict('loginGoogle')}</span>
                      </button>

                      <div className="flex items-center gap-2 my-2">
                        <div className="h-0.5 bg-[#1A1A1A]/20 flex-1" />
                        <span className="text-[10px] text-[#1A1A1A] font-black uppercase">ATAU</span>
                        <div className="h-0.5 bg-[#1A1A1A]/20 flex-1" />
                      </div>

                      {/* Choice 2: Phone + OTP (Orange Highlighted) */}
                      <button className="w-full py-3 px-4 bg-[#FF7A1A] hover:bg-[#FF7A1A]/90 text-white border-2 border-[#1A1A1A] rounded-2xl flex items-center justify-center gap-2 text-xs font-black shadow-[3px_3px_0px_0px_#1A1A1A] transition-all">
                        <Smartphone className="w-4 h-4" />
                        <span>{dict('loginPhone')}</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-gray-500 font-medium">
                      Dengan melog masuk, anda bersetuju dengan Terma & Syarat BeruangMakan Malaysia.
                    </p>
                  </div>
                )}

                {/* 2. HOME SCREEN MOCKUP */}
                {activeScreenId === 'home' && (
                  <div className="space-y-3">
                    {/* Top Location Bar */}
                    <div className="bg-[#FF7A1A] -mx-4 -mt-4 p-4 text-white space-y-2 rounded-b-3xl border-b-2 border-[#1A1A1A] shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-black">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>Bukit Bintang, KL</span>
                        </div>
                        <div className="w-8 h-8 bg-white border border-[#1A1A1A] text-[#1A1A1A] rounded-full flex items-center justify-center text-xs font-black shadow-[2px_2px_0px_0px_#1A1A1A]">
                          🛒
                        </div>
                      </div>
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#1A1A1A]" />
                        <input
                          type="text"
                          readOnly
                          placeholder={dict('searchPlaceholder')}
                          className="w-full pl-8 pr-3 py-1.5 bg-white text-[#1A1A1A] border-2 border-[#1A1A1A] rounded-xl text-[11px] font-bold shadow-[2px_2px_0px_0px_#1A1A1A]"
                        />
                      </div>
                    </div>

                    {/* Halal Filter */}
                    <div className="flex items-center justify-between bg-[#FFF5EB] p-3 rounded-2xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#FF7A1A]">
                      <div className="flex items-center gap-1.5 text-xs font-black text-[#1A1A1A]">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>{dict('halalOnly')}</span>
                      </div>
                      <button
                        onClick={() => setHalalFilterActive(!halalFilterActive)}
                        className={`w-10 h-6 rounded-full border-2 border-[#1A1A1A] transition-colors relative ${halalFilterActive ? 'bg-[#FF7A1A]' : 'bg-gray-200'}`}
                      >
                        <div className={`w-4 h-4 bg-white border border-[#1A1A1A] rounded-full absolute top-0.5 transition-transform ${halalFilterActive ? 'right-0.5' : 'left-0.5'}`} />
                      </button>
                    </div>

                    {/* Categories */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-black text-[#1A1A1A] uppercase tracking-wider">Kategori Hangat</span>
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-black">
                        <div className="p-2 bg-[#FFF5EB] text-[#FF7A1A] rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
                          🍛 Nasi Lemak
                        </div>
                        <div className="p-2 bg-white text-[#1A1A1A] rounded-2xl border-2 border-[#1A1A1A]">
                          🍢 Satay
                        </div>
                        <div className="p-2 bg-white text-[#1A1A1A] rounded-2xl border-2 border-[#1A1A1A]">
                          🍜 Mee Goreng
                        </div>
                        <div className="p-2 bg-white text-[#1A1A1A] rounded-2xl border-2 border-[#1A1A1A]">
                          🥤 Teh Tarik
                        </div>
                      </div>
                    </div>

                    {/* Restaurant List */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-black text-[#1A1A1A] uppercase tracking-wider">{dict('nearbyRestaurants')}</span>
                      
                      {/* Card 1 */}
                      <div className="bg-white p-3 rounded-3xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#FF7A1A] space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-black text-[#1A1A1A]">Ayam Bakar Madu Sado</h4>
                          <span className="bg-green-100 text-green-700 border border-green-300 text-[9px] font-black px-2 py-0.5 rounded-full">
                            HALAL
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                          <span className="text-[#FF7A1A] font-black flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-[#FF7A1A] text-[#FF7A1A]" /> 4.8
                          </span>
                          <span>• 2.4 km</span>
                          <span>• 15-20 min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. RESTAURANT DETAIL SCREEN MOCKUP */}
                {activeScreenId === 'restaurant_detail' && (
                  <div className="space-y-3">
                    <div className="h-24 bg-[#FF7A1A] border-2 border-[#1A1A1A] rounded-3xl flex items-center justify-center text-white font-black text-xs p-3 text-center shadow-[4px_4px_0px_0px_#1A1A1A]">
                      Restoran Nasi Lemak Abang Beruang (JAKIM Halal Certified)
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-2">
                        <span className="text-xs font-black text-[#FF7A1A]">Nasi Lemak Special</span>
                        <span className="text-[10px] text-[#1A1A1A] font-black font-mono">RM 12.50</span>
                      </div>
                      <div className="p-3 bg-[#FFF5EB] rounded-2xl border-2 border-[#1A1A1A] flex items-center justify-between text-xs shadow-[3px_3px_0px_0px_#1A1A1A]">
                        <div>
                          <div className="font-black text-[#1A1A1A]">Nasi Lemak Ayam Goreng Berempah</div>
                          <div className="text-[10px] text-gray-600 font-medium">Telur rebus, timun, sambal pedas</div>
                          <div className="text-[#FF7A1A] font-mono font-black mt-1">RM 12.50</div>
                        </div>
                        <button
                          onClick={() => setCartCount(cartCount + 1)}
                          className="bg-[#1A1A1A] text-white w-8 h-8 rounded-xl font-black border border-[#1A1A1A] flex items-center justify-center text-sm shadow-[2px_2px_0px_0px_#FF7A1A] hover:bg-[#FF7A1A]"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. CART & CHECKOUT SCREEN MOCKUP */}
                {activeScreenId === 'cart_checkout' && (
                  <div className="space-y-3">
                    <div className="bg-[#FFF5EB] p-3 rounded-2xl border-2 border-[#1A1A1A] space-y-1 shadow-[3px_3px_0px_0px_#1A1A1A]">
                      <span className="text-[10px] font-black text-[#FF7A1A] uppercase tracking-wider">Alamat Penghantaran</span>
                      <div className="text-xs font-black text-[#1A1A1A] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#FF7A1A]" />
                        <span>Menara Maybank, Level 5, KL</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-wider">Kaedah Pembayaran</span>
                      <div className="space-y-1.5 text-xs font-bold">
                        <div
                          onClick={() => setSelectedPayment('tng')}
                          className={`p-3 rounded-2xl border-2 border-[#1A1A1A] flex items-center justify-between cursor-pointer ${
                            selectedPayment === 'tng' ? 'bg-[#FFF5EB] shadow-[3px_3px_0px_0px_#FF7A1A]' : 'bg-white'
                          }`}
                        >
                          <span>Touch 'n Go eWallet</span>
                          {selectedPayment === 'tng' && <CheckCircle2 className="w-4 h-4 text-[#FF7A1A]" />}
                        </div>
                        <div
                          onClick={() => setSelectedPayment('fpx')}
                          className={`p-3 rounded-2xl border-2 border-[#1A1A1A] flex items-center justify-between cursor-pointer ${
                            selectedPayment === 'fpx' ? 'bg-[#FFF5EB] shadow-[3px_3px_0px_0px_#FF7A1A]' : 'bg-white'
                          }`}
                        >
                          <span>FPX Perbankan Internet</span>
                          {selectedPayment === 'fpx' && <CheckCircle2 className="w-4 h-4 text-[#FF7A1A]" />}
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3 rounded-2xl border-2 border-[#1A1A1A] space-y-1 text-xs">
                      <div className="flex justify-between text-gray-600 font-bold">
                        <span>Subtotal Makanan</span>
                        <span className="font-mono">RM 25.00</span>
                      </div>
                      <div className="flex justify-between text-gray-600 font-bold">
                        <span>Caj Penghantaran</span>
                        <span className="font-mono">RM 4.00</span>
                      </div>
                      <div className="flex justify-between text-[#FF7A1A] font-black">
                        <span>Diskaun Baucar</span>
                        <span className="font-mono">-RM 2.00</span>
                      </div>
                      <div className="border-t-2 border-[#1A1A1A] pt-1 flex justify-between font-black text-[#1A1A1A]">
                        <span>Jumlah Kena Bayar</span>
                        <span className="font-mono text-[#FF7A1A]">RM 27.00</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. ORDER TRACKING SCREEN MOCKUP */}
                {activeScreenId === 'order_tracking' && (
                  <div className="space-y-3">
                    <div className="bg-[#FF7A1A] border-2 border-[#1A1A1A] text-white p-3 rounded-2xl text-center space-y-1 shadow-[3px_3px_0px_0px_#1A1A1A]">
                      <div className="text-[10px] font-black uppercase tracking-wider text-white/90">Penjejakan Live GPS</div>
                      <div className="text-sm font-black">Rider Beruang Dalam Perjalanan!</div>
                      <div className="text-[11px] bg-[#1A1A1A] text-white rounded-full py-0.5 px-2 inline-block font-mono font-bold">
                        ETA: 12 Minit
                      </div>
                    </div>

                    <div className="p-3 bg-white border-2 border-[#1A1A1A] rounded-2xl space-y-2">
                      <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-wider">Status Pesanan</span>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 text-emerald-600 font-black">
                          <CheckCircle2 className="w-4 h-4" /> Dapur Menyediakan Makanan
                        </div>
                        <div className="flex items-center gap-2 text-[#FF7A1A] font-black">
                          <Sparkles className="w-4 h-4" /> Rider Mengambil Makanan (Picked Up)
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 font-bold">
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300" /> Pesanan Sampai
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FFF5EB] border-2 border-[#1A1A1A] rounded-2xl flex items-center justify-between text-xs shadow-[3px_3px_0px_0px_#1A1A1A]">
                      <div>
                        <div className="font-black text-[#1A1A1A]">Sufian (Rider Beruang)</div>
                        <div className="text-[10px] text-gray-600 font-mono font-bold">Motor • VCE 8821</div>
                      </div>
                      <button className="bg-[#1A1A1A] text-white p-2 rounded-xl border border-[#1A1A1A] flex items-center gap-1 font-black text-[11px] shadow-[2px_2px_0px_0px_#FF7A1A]">
                        <PhoneCall className="w-3.5 h-3.5 text-[#FF7A1A]" />
                        <span>Telefon</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* STICKY BOTTOM ACTION BAR */}
              {activeScreenId === 'restaurant_detail' && (
                <div className="p-3 bg-white border-t-2 border-[#1A1A1A]">
                  <button className="w-full py-2.5 bg-[#FF7A1A] text-white rounded-xl border-2 border-[#1A1A1A] text-xs font-black flex items-center justify-between px-4 shadow-[3px_3px_0px_0px_#1A1A1A]">
                    <span>Lihat Bakul ({cartCount} Item)</span>
                    <span className="font-mono">RM 27.50 →</span>
                  </button>
                </div>
              )}

              {activeScreenId === 'cart_checkout' && (
                <div className="p-3 bg-white border-t-2 border-[#1A1A1A]">
                  <button className="w-full py-2.5 bg-[#FF7A1A] text-white rounded-xl border-2 border-[#1A1A1A] text-xs font-black flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_#1A1A1A]">
                    <CreditCard className="w-4 h-4" />
                    <span>Sahkan & Bayar RM 27.00</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Wireframe Text Specifications Panel */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] space-y-5">
            <div>
              <span className="bg-[#FF7A1A] text-white text-xs font-black px-3 py-1 rounded-full uppercase border border-[#1A1A1A]">
                Spesifikasi Layout UI
              </span>
              <h3 className="text-2xl font-black italic text-[#1A1A1A] mt-2">
                {langMode === 'bm' ? currentScreen.titleBM : currentScreen.titleJawi}
              </h3>
              <p className="text-sm text-gray-700 mt-1 leading-relaxed font-medium">
                {currentScreen.purpose}
              </p>
            </div>

            {/* UI Color Application Guidelines */}
            <div className="bg-[#FFF5EB] p-4 rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#FF7A1A] space-y-3">
              <h4 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#FF7A1A]" />
                Penekanan Warna UI (Oren #FF7A1A & Ink #1A1A1A)
              </h4>
              
              <div className="space-y-2 text-xs font-medium">
                <div>
                  <span className="font-black text-[#FF7A1A] block">🟠 Elemen Latar / Akses Oren (#FF7A1A):</span>
                  <ul className="list-disc list-inside text-gray-800 pl-1 space-y-0.5">
                    {currentScreen.uiHighlights.orangeBg.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-black text-[#1A1A1A] block">⚪ Elemen Latar Putih (#FFFFFF):</span>
                  <ul className="list-disc list-inside text-gray-800 pl-1 space-y-0.5">
                    {currentScreen.uiHighlights.whiteBg.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-black text-[#FF7A1A] block">🔸 Teks & Accent Oren:</span>
                  <ul className="list-disc list-inside text-gray-800 pl-1 space-y-0.5">
                    {currentScreen.uiHighlights.orangeTextOrAccents.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Key Components List */}
            <div className="space-y-2">
              <h4 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider">
                Elemen Utama Skrin ({currentScreen.keyComponents.length})
              </h4>
              <div className="space-y-2 text-xs text-[#1A1A1A] font-bold">
                {currentScreen.keyComponents.map((comp, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-2xl flex items-center gap-2 border-2 border-[#1A1A1A]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
