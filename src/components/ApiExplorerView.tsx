import React, { useState } from 'react';
import { ApiEndpoint, LanguageMode } from '../types';
import { API_ENDPOINTS } from '../data/apiEndpoints';
import { Network, Search, Lock, Unlock, ShieldCheck, Copy, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface ApiExplorerViewProps {
  langMode: LanguageMode;
}

export const ApiExplorerView: React.FC<ApiExplorerViewProps> = ({ langMode }) => {
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('auth-phone-verify');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const modules = [
    { id: 'all', label: 'Semua Modul' },
    { id: 'auth', label: 'Auth (OTP & Google)' },
    { id: 'merchants', label: 'Merchants & Menu' },
    { id: 'orders', label: 'Orders & Payments' },
    { id: 'riders', label: 'Riders & GPS' },
    { id: 'admin', label: 'Admin & Audit' }
  ];

  const filteredEndpoints = API_ENDPOINTS.filter(ep => {
    const matchesModule = selectedModule === 'all' || ep.module === selectedModule;
    const matchesSearch = ep.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ep.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesModule && matchesSearch;
  });

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-blue-500 text-white';
      case 'POST': return 'bg-emerald-500 text-white';
      case 'PATCH': return 'bg-amber-500 text-white';
      case 'PUT': return 'bg-orange-500 text-white';
      case 'DELETE': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div id="api-explorer-view" className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#FF7A1A] border-2 border-[#1A1A1A] rounded-3xl p-6 text-white shadow-[8px_8px_0px_0px_#1A1A1A] space-y-3">
        <div className="flex items-center gap-2">
          <span className="bg-[#1A1A1A] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
            RESTful API v1
          </span>
          <span className="bg-emerald-500 text-white border border-[#1A1A1A] text-xs font-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_#1A1A1A]">
            JSON Standard Format
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter text-white">
          {langMode === 'bm' ? 'Struktur Endpoint API REST BeruangMakan' : 'ستروکتور ايندڤوياءينت API REST برواڠ ماکن'}
        </h2>
        <p className="text-white/90 text-sm max-w-3xl font-medium">
          Senarai laluan API teras berasaskan peranan (RBAC) bagi membolehkan 4 aplikasi pengguna berinteraksi secara selamat dengan backend Node.js Express.
        </p>
      </div>

      {/* Module Filters & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Modules Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {modules.map(mod => (
            <button
              key={mod.id}
              id={`api-mod-filter-${mod.id}`}
              onClick={() => setSelectedModule(mod.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all border-2 ${
                selectedModule === mod.id
                  ? 'bg-[#FF7A1A] text-white border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A]'
                  : 'bg-white text-[#1A1A1A] border-[#1A1A1A]/20 hover:border-[#1A1A1A] hover:bg-[#FFF5EB]'
              }`}
            >
              {mod.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#1A1A1A]" />
          <input
            id="api-search-input"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={langMode === 'bm' ? 'Cari endpoint API...' : 'چاري ايندڤوياءينت API...'}
            className="w-full pl-9 pr-4 py-2 bg-white border-2 border-[#1A1A1A] rounded-2xl text-xs font-bold text-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Endpoints Accordion List */}
      <div className="space-y-3">
        {filteredEndpoints.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-gray-500 font-bold text-xs border-2 border-[#1A1A1A]">
            Tiada endpoint ditemui sepadan dengan carian.
          </div>
        ) : (
          filteredEndpoints.map(ep => {
            const isExpanded = expandedId === ep.id;
            return (
              <div
                key={ep.id}
                className="bg-white rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <div
                  id={`api-endpoint-header-${ep.id}`}
                  onClick={() => setExpandedId(isExpanded ? null : ep.id)}
                  className="p-4 cursor-pointer hover:bg-[#FFF5EB] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-black border border-[#1A1A1A] ${getMethodBadgeClass(ep.method)}`}>
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs md:text-sm font-black text-[#1A1A1A] truncate">
                      {ep.path}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border border-[#1A1A1A] flex items-center gap-1 ${
                      ep.authRequired ? 'bg-amber-100 text-amber-950' : 'bg-emerald-100 text-emerald-950'
                    }`}>
                      {ep.authRequired ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      <span>{ep.authType}</span>
                    </span>

                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[#1A1A1A]" /> : <ChevronDown className="w-4 h-4 text-[#1A1A1A]" />}
                  </div>
                </div>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-4 bg-[#FFF5EB]/60 border-t-2 border-[#1A1A1A] space-y-4 text-xs font-medium">
                    <div>
                      <h4 className="font-black text-[#1A1A1A] text-sm mb-1">{ep.title}</h4>
                      <p className="text-gray-800 font-medium leading-relaxed">{ep.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Request Body Example */}
                      {ep.requestBody && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-black text-[#1A1A1A] uppercase">
                            <span>Request Body (JSON)</span>
                            <button
                              onClick={() => handleCopy(ep.requestBody!, `${ep.id}-req`)}
                              className="text-[#FF7A1A] hover:underline flex items-center gap-1 font-bold"
                            >
                              {copiedId === `${ep.id}-req` ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === `${ep.id}-req` ? 'Disalin' : 'Salin'}</span>
                            </button>
                          </div>
                          <pre className="p-3 bg-[#1A1A1A] text-emerald-300 rounded-2xl font-mono text-[11px] overflow-x-auto border-2 border-[#1A1A1A]">
                            {ep.requestBody}
                          </pre>
                        </div>
                      )}

                      {/* Response Example */}
                      {ep.responseExample && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-black text-[#1A1A1A] uppercase">
                            <span>Response Example (200 OK)</span>
                            <button
                              onClick={() => handleCopy(ep.responseExample!, `${ep.id}-res`)}
                              className="text-[#FF7A1A] hover:underline flex items-center gap-1 font-bold"
                            >
                              {copiedId === `${ep.id}-res` ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === `${ep.id}-res` ? 'Disalin' : 'Salin'}</span>
                            </button>
                          </div>
                          <pre className="p-3 bg-[#1A1A1A] text-sky-300 rounded-2xl font-mono text-[11px] overflow-x-auto border-2 border-[#1A1A1A]">
                            {ep.responseExample}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
