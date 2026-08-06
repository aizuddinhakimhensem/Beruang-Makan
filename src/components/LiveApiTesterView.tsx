/**
 * Live Backend API Tester Component
 * Allows live interactive testing of all Node.js + Express backend endpoints:
 * 1. Google OAuth 2.0 & Account Linking (POST /api/auth/google & /confirm)
 * 2. Phone OTP Login (Customer & Rider)
 * 3. Merchant PostGIS Geospatial Radius & Halal Search (GET /api/merchants/search)
 * 4. Order Creation, Status Transitions, & Rider Assignment (POST /api/orders)
 * 5. Admin Audit Trail & Security (GET /api/admin/audit-logs)
 */

import React, { useState } from 'react';
import { Play, ShieldCheck, User, Phone, Search, ShoppingBag, Lock, MapPin, CheckCircle2, AlertTriangle, Key, ArrowRight, RefreshCw } from 'lucide-react';
import { LanguageMode } from '../types';

interface LiveApiTesterProps {
  langMode: LanguageMode;
}

export const LiveApiTesterView: React.FC<LiveApiTesterProps> = ({ langMode }) => {
  const [activeSection, setActiveSection] = useState<'auth' | 'search' | 'order' | 'admin'>('auth');

  // Auth States
  const [googleEmail, setGoogleEmail] = useState('customer@beruangmakan.my');
  const [googleName, setGoogleName] = useState('Ahmad Faiz');
  const [googleResponse, setGoogleResponse] = useState<any>(null);
  const [linkingTempToken, setLinkingTempToken] = useState<string | null>(null);

  const [phoneNo, setPhoneNo] = useState('+60123456789');
  const [otpCode, setOtpCode] = useState('123456');
  const [otpResponse, setOtpResponse] = useState<any>(null);

  // Search States
  const [searchRadius, setSearchRadius] = useState(10);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchHalal, setSearchHalal] = useState<'verified_jakim' | 'self_declared' | 'non_halal' | ''>('verified_jakim');
  const [searchResponse, setSearchResponse] = useState<any>(null);

  // Order States
  const [orderResponse, setOrderResponse] = useState<any>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>('ord-001');
  const [assignResponse, setAssignResponse] = useState<any>(null);
  const [statusUpdateResponse, setStatusUpdateResponse] = useState<any>(null);

  // Admin States
  const [adminResponse, setAdminResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 1. Google Auth Test
  const handleTestGoogleAuth = async () => {
    setLoading(true);
    setGoogleResponse(null);
    try {
      // Construct ID token carrying email for test
      const payload = {
        sub: 'g-uid-99881',
        email: googleEmail,
        name: googleName,
        picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150',
      };
      const mockIdToken = `eyJhbGciOiJSUzI1NiJ9.${btoa(JSON.stringify(payload))}.mock_signature`;

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: mockIdToken }),
      });
      const data = await res.json();
      setGoogleResponse(data);

      if (data.requiresAccountLinking && data.tempToken) {
        setLinkingTempToken(data.tempToken);
      } else {
        setLinkingTempToken(null);
      }
    } catch (err: any) {
      setGoogleResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // 1b. Confirm Account Link
  const handleConfirmAccountLink = async () => {
    if (!linkingTempToken) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/account-link/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken: linkingTempToken }),
      });
      const data = await res.json();
      setGoogleResponse(data);
      setLinkingTempToken(null);
    } catch (err: any) {
      setGoogleResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // 2. Phone OTP Test
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/customer/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phoneNo }),
      });
      const data = await res.json();
      setOtpResponse(data);
      if (data.devCode) {
        setOtpCode(data.devCode);
      }
    } catch (err: any) {
      setOtpResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/customer/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phoneNo, otpCode }),
      });
      const data = await res.json();
      setOtpResponse(data);
    } catch (err: any) {
      setOtpResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // 3. PostGIS Merchant Search Test
  const handleTestSearch = async () => {
    setLoading(true);
    try {
      let url = `/api/merchants/search?lat=3.1466&lon=101.7115&radius=${searchRadius}`;
      if (searchCategory) url += `&category=${encodeURIComponent(searchCategory)}`;
      if (searchHalal) url += `&halalStatus=${searchHalal}`;

      const res = await fetch(url);
      const data = await res.json();
      setSearchResponse(data);
    } catch (err: any) {
      setSearchResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // 4. Order Creation & Rider Assignment Test
  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': googleResponse?.tokens?.access_token ? `Bearer ${googleResponse.tokens.access_token}` : 'Bearer mock_jwt_access_token',
        },
        body: JSON.stringify({
          merchantId: 'mp-001',
          deliveryAddress: 'Changkat Bukit Bintang, Kuala Lumpur',
          deliveryLatitude: 3.1466,
          deliveryLongitude: 101.7115,
          items: [
            { menuItemId: 'mi-001', quantity: 1 },
            { menuItemId: 'mi-002', quantity: 2 },
          ],
        }),
      });
      const data = await res.json();
      setOrderResponse(data);
      if (data.order?.id) {
        setCreatedOrderId(data.order.id);
      }
    } catch (err: any) {
      setOrderResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRider = async () => {
    if (!createdOrderId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${createdOrderId}/assign-rider`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock_merchant_admin_token',
        },
      });
      const data = await res.json();
      setAssignResponse(data);
    } catch (err: any) {
      setAssignResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!createdOrderId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/${createdOrderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock_merchant_admin_token',
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      setStatusUpdateResponse(data);
    } catch (err: any) {
      setStatusUpdateResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  // 5. Admin Audit Trail Test
  const handleTestAdminLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/audit-logs', {
        headers: { 'Authorization': 'Bearer mock_admin_jwt' },
      });
      const data = await res.json();
      setAdminResponse(data);
    } catch (err: any) {
      setAdminResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="live-api-tester-view" className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#1A1A1A] border-2 border-[#1A1A1A] rounded-3xl p-6 text-white shadow-[8px_8px_0px_0px_#FF7A1A] space-y-3">
        <div className="flex items-center gap-2">
          <span className="bg-[#FF7A1A] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20 flex items-center gap-1">
            <Play className="w-3 h-3 fill-current" /> Live Express API Engine
          </span>
          <span className="bg-emerald-500 text-white border border-[#1A1A1A] text-xs font-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_#FF7A1A]">
            Node.js + PostgreSQL PostGIS
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter text-[#FF7A1A]">
          {langMode === 'bm' ? 'Makmal Ujian API Backend Live' : 'مخمل اوجيان API بيک-ايند لا؞يف'}
        </h2>
        <p className="text-gray-300 text-sm max-w-3xl font-medium">
          Uji endpoint RESTful API sebenar di server Node.js Express — termasuk pengesahan Google Sign-In, Account Linking, OTP telefon, carian radius PostGIS, dan pengagihan rider.
        </p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveSection('auth')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all border-2 ${
            activeSection === 'auth'
              ? 'bg-[#FF7A1A] text-white border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]'
              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/20 hover:border-[#1A1A1A] hover:bg-[#FFF5EB]'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>1. Auth & Account Linking</span>
        </button>

        <button
          onClick={() => setActiveSection('search')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all border-2 ${
            activeSection === 'search'
              ? 'bg-[#FF7A1A] text-white border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]'
              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/20 hover:border-[#1A1A1A] hover:bg-[#FFF5EB]'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>2. PostGIS Merchant Search</span>
        </button>

        <button
          onClick={() => setActiveSection('order')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all border-2 ${
            activeSection === 'order'
              ? 'bg-[#FF7A1A] text-white border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]'
              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/20 hover:border-[#1A1A1A] hover:bg-[#FFF5EB]'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>3. Modul Order & Rider Assign</span>
        </button>

        <button
          onClick={() => setActiveSection('admin')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all border-2 ${
            activeSection === 'admin'
              ? 'bg-[#FF7A1A] text-white border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]'
              : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/20 hover:border-[#1A1A1A] hover:bg-[#FFF5EB]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>4. Admin Audit & PDPA Security</span>
        </button>
      </div>

      {/* SECTION 1: AUTH & ACCOUNT LINKING */}
      {activeSection === 'auth' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Google Sign-In Card */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4">
            <div className="flex items-center gap-2 text-[#FF7A1A] font-black text-sm uppercase">
              <User className="w-5 h-5" />
              <span>Google Sign-In & Account Linking</span>
            </div>
            <p className="text-xs text-gray-700 font-medium">
              Uji aliran log masuk Google OAuth 2.0. Jika e-mel bertindih dengan pendaftaran nombor telefon sedia ada, sistem akan memaparkan dialog penyatuan akaun (account linking).
            </p>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="text-gray-700">E-mel Google ID Token:</label>
                <input
                  type="email"
                  value={googleEmail}
                  onChange={e => setGoogleEmail(e.target.value)}
                  className="w-full mt-1 p-2.5 border-2 border-[#1A1A1A] rounded-xl text-xs font-bold focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-gray-700">Nama Pengguna:</label>
                <input
                  type="text"
                  value={googleName}
                  onChange={e => setGoogleName(e.target.value)}
                  className="w-full mt-1 p-2.5 border-2 border-[#1A1A1A] rounded-xl text-xs font-bold focus:outline-hidden"
                />
              </div>
            </div>

            <button
              onClick={handleTestGoogleAuth}
              disabled={loading}
              className="w-full py-3 bg-[#FF7A1A] hover:bg-[#FF7A1A]/90 text-white font-black text-xs rounded-2xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              <span>Hantar POST /api/auth/google</span>
            </button>

            {/* Account Linking Modal / Confirmation Alert */}
            {googleResponse?.requiresAccountLinking && (
              <div className="bg-amber-50 rounded-2xl p-4 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#FF7A1A] space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-black text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>PENYATUAN AKAUN DIPERLUKAN</span>
                </div>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  {googleResponse.message}
                </p>
                <div className="bg-white p-2.5 rounded-xl border border-[#1A1A1A] text-[11px] font-mono text-gray-800">
                  Registered Phone: {googleResponse.existingAccount?.phoneNumber || '+60123456789'}
                </div>
                <button
                  onClick={handleConfirmAccountLink}
                  disabled={loading}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sahkan Penyatuan (POST /api/auth/account-link/confirm)</span>
                </button>
              </div>
            )}

            {/* Response Output */}
            {googleResponse && (
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-gray-500">Response Data:</span>
                <pre className="p-3 bg-[#1A1A1A] text-emerald-300 rounded-2xl font-mono text-[11px] max-h-48 overflow-y-auto border-2 border-[#1A1A1A]">
                  {JSON.stringify(googleResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Phone OTP Login Card */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4">
            <div className="flex items-center gap-2 text-[#FF7A1A] font-black text-sm uppercase">
              <Phone className="w-5 h-5" />
              <span>Customer & Rider Phone OTP Auth</span>
            </div>
            <p className="text-xs text-gray-700 font-medium">
              Uji penghantaran SMS OTP berjadual (Rate limited: Max 3 OTP per 5 minit) dan pengesahan JWT session.
            </p>

            <div className="space-y-3 text-xs font-bold">
              <div>
                <label className="text-gray-700">Nombor Telefon Malaysia:</label>
                <input
                  type="text"
                  value={phoneNo}
                  onChange={e => setPhoneNo(e.target.value)}
                  className="w-full mt-1 p-2.5 border-2 border-[#1A1A1A] rounded-xl text-xs font-bold focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-gray-700">Kod OTP (Demo default: 123456):</label>
                <input
                  type="text"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value)}
                  className="w-full mt-1 p-2.5 border-2 border-[#1A1A1A] rounded-xl text-xs font-bold focus:outline-hidden font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="py-2.5 bg-gray-900 hover:bg-black text-white font-black text-xs rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#FF7A1A] flex items-center justify-center gap-1.5"
              >
                <span>1. Send OTP</span>
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={loading}
                className="py-2.5 bg-[#FF7A1A] hover:bg-[#FF7A1A]/90 text-white font-black text-xs rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center justify-center gap-1.5"
              >
                <span>2. Verify OTP</span>
              </button>
            </div>

            {/* OTP Response */}
            {otpResponse && (
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-gray-500">Response Data:</span>
                <pre className="p-3 bg-[#1A1A1A] text-sky-300 rounded-2xl font-mono text-[11px] max-h-48 overflow-y-auto border-2 border-[#1A1A1A]">
                  {JSON.stringify(otpResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: POSTGIS MERCHANT SEARCH */}
      {activeSection === 'search' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
            <div className="flex items-center gap-2 text-[#FF7A1A] font-black text-sm uppercase">
              <MapPin className="w-5 h-5" />
              <span>Carian PostGIS ST_DWithin Radius & Penapis Halal JAKIM</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 border border-[#1A1A1A] text-[10px] font-black px-3 py-1 rounded-full">
              PostGIS Geography Query
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
            <div>
              <label className="text-gray-700">Radius Jarak (km):</label>
              <input
                type="number"
                value={searchRadius}
                onChange={e => setSearchRadius(Number(e.target.value))}
                className="w-full mt-1 p-2.5 border-2 border-[#1A1A1A] rounded-xl text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-gray-700">Kategori Makanan:</label>
              <input
                type="text"
                placeholder="Contoh: Nasi Lemak, Satay"
                value={searchCategory}
                onChange={e => setSearchCategory(e.target.value)}
                className="w-full mt-1 p-2.5 border-2 border-[#1A1A1A] rounded-xl text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-gray-700">Status Pengesahan Halal:</label>
              <select
                value={searchHalal}
                onChange={e => setSearchHalal(e.target.value as any)}
                className="w-full mt-1 p-2.5 border-2 border-[#1A1A1A] rounded-xl text-xs font-bold"
              >
                <option value="">Semua Status</option>
                <option value="verified_jakim">Verified JAKIM</option>
                <option value="self_declared">Self Declared</option>
                <option value="non_halal">Non Halal</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleTestSearch}
            disabled={loading}
            className="w-full py-3 bg-[#FF7A1A] hover:bg-[#FF7A1A]/90 text-white font-black text-xs rounded-2xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Jalankan Carian GET /api/merchants/search</span>
          </button>

          {searchResponse && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-700">
                  Hasil Carian ({searchResponse.count || 0} Restoran Ditemui dalam {searchRadius} km):
                </span>
              </div>
              <pre className="p-4 bg-[#1A1A1A] text-emerald-300 rounded-2xl font-mono text-[11px] max-h-72 overflow-y-auto border-2 border-[#1A1A1A]">
                {JSON.stringify(searchResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* SECTION 3: ORDER MODULE & RIDER ASSIGNMENT */}
      {activeSection === 'order' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
            <div className="flex items-center gap-2 text-[#FF7A1A] font-black text-sm uppercase">
              <ShoppingBag className="w-5 h-5" />
              <span>Alur Pesanan & Pengagihan Rider Terdekat</span>
            </div>
            <span className="bg-[#FFF5EB] text-[#FF7A1A] border-2 border-[#1A1A1A] text-[10px] font-black px-3 py-1 rounded-xl">
              Order State Machine
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1: Create Order */}
            <div className="bg-[#FFF5EB] p-4 rounded-2xl border-2 border-[#1A1A1A] space-y-2">
              <span className="text-xs font-black text-[#FF7A1A] uppercase">1. Cipta Pesanan Baru</span>
              <p className="text-[11px] text-gray-700 font-medium">Validasi stok item menu + pengiraan caj penghantaran jarak Haversine.</p>
              <button
                onClick={handleCreateOrder}
                disabled={loading}
                className="w-full py-2 bg-[#FF7A1A] text-white font-black text-xs rounded-xl border border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-center justify-center gap-1"
              >
                <span>POST /api/orders</span>
              </button>
            </div>

            {/* Step 2: Assign Rider */}
            <div className="bg-[#FFF5EB] p-4 rounded-2xl border-2 border-[#1A1A1A] space-y-2">
              <span className="text-xs font-black text-[#FF7A1A] uppercase">2. Assign Rider Terdekat</span>
              <p className="text-[11px] text-gray-700 font-medium">Cari rider available yang paling hampir dengan lokasi restoran.</p>
              <button
                onClick={handleAssignRider}
                disabled={loading || !createdOrderId}
                className="w-full py-2 bg-gray-900 text-white font-black text-xs rounded-xl border border-[#1A1A1A] shadow-[2px_2px_0px_0px_#FF7A1A] flex items-center justify-center gap-1"
              >
                <span>POST /api/orders/:id/assign-rider</span>
              </button>
            </div>

            {/* Step 3: Status Transition */}
            <div className="bg-[#FFF5EB] p-4 rounded-2xl border-2 border-[#1A1A1A] space-y-2">
              <span className="text-xs font-black text-[#FF7A1A] uppercase">3. Kemaskini Status</span>
              <p className="text-[11px] text-gray-700 font-medium">Tukar status mengikut aturan state machine (accepted → picked_up → delivered).</p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleUpdateStatus('accepted')}
                  className="py-1 bg-blue-600 text-white font-black text-[10px] rounded-lg border border-[#1A1A1A]"
                >
                  Accepted
                </button>
                <button
                  onClick={() => handleUpdateStatus('picked_up')}
                  className="py-1 bg-amber-600 text-white font-black text-[10px] rounded-lg border border-[#1A1A1A]"
                >
                  Picked Up
                </button>
              </div>
            </div>
          </div>

          {/* Results outputs */}
          {orderResponse && (
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-gray-500">Create Order Result:</span>
              <pre className="p-3 bg-[#1A1A1A] text-emerald-300 rounded-2xl font-mono text-[11px] max-h-40 overflow-y-auto border-2 border-[#1A1A1A]">
                {JSON.stringify(orderResponse, null, 2)}
              </pre>
            </div>
          )}

          {assignResponse && (
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-gray-500">Rider Assignment Result:</span>
              <pre className="p-3 bg-[#1A1A1A] text-sky-300 rounded-2xl font-mono text-[11px] max-h-40 overflow-y-auto border-2 border-[#1A1A1A]">
                {JSON.stringify(assignResponse, null, 2)}
              </pre>
            </div>
          )}

          {statusUpdateResponse && (
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-gray-500">Status Transition Result:</span>
              <pre className="p-3 bg-[#1A1A1A] text-amber-300 rounded-2xl font-mono text-[11px] max-h-40 overflow-y-auto border-2 border-[#1A1A1A]">
                {JSON.stringify(statusUpdateResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* SECTION 4: ADMIN AUDIT & PDPA SECURITY */}
      {activeSection === 'admin' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-3">
            <div className="flex items-center gap-2 text-[#FF7A1A] font-black text-sm uppercase">
              <ShieldCheck className="w-5 h-5" />
              <span>Admin Audit Trail & PDPA Compliance Inspection</span>
            </div>
            <span className="bg-purple-100 text-purple-900 border border-[#1A1A1A] text-[10px] font-black px-3 py-1 rounded-full">
              Audit Logger & PDPA
            </span>
          </div>

          <p className="text-xs text-gray-700 font-medium">
            Mematuhi keperluan keselamatan Fasa 0: Semua tindakan pentadbir direkodkan secara tidak boleh diubah (immutable log), dan data Google OAuth diisytiharkan mengikut akta PDPA Malaysia 2010.
          </p>

          <button
            onClick={handleTestAdminLogs}
            disabled={loading}
            className="w-full py-3 bg-[#1A1A1A] hover:bg-black text-white font-black text-xs rounded-2xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#FF7A1A] flex items-center justify-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            <span>Dapatkan Audit Trail GET /api/admin/audit-logs</span>
          </button>

          {adminResponse && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-black text-gray-700">Admin Audit Trail Logs:</span>
              <pre className="p-4 bg-[#1A1A1A] text-purple-300 rounded-2xl font-mono text-[11px] max-h-72 overflow-y-auto border-2 border-[#1A1A1A]">
                {JSON.stringify(adminResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
