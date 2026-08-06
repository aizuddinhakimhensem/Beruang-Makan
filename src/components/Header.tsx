import React from 'react';
import { Database, FolderTree, Network, Smartphone, FileText, Globe, Play } from 'lucide-react';
import { LanguageMode } from '../types';
import { DICTIONARY } from '../data/translations';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  langMode: LanguageMode;
  setLangMode: (lang: LanguageMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  langMode,
  setLangMode
}) => {
  const dict = (key: keyof typeof DICTIONARY) => DICTIONARY[key][langMode];

  const tabs = [
    { id: 'db', labelBM: '1. Skema Database', labelJawi: '١. سکيما داتابيس', icon: Database },
    { id: 'backend', labelBM: '2. Struktur Backend', labelJawi: '٢.ستروکتور بيک-ايند', icon: FolderTree },
    { id: 'api', labelBM: '3. Endpoints API', labelJawi: '٣. ايندڤوياءينت API', icon: Network },
    { id: 'live_api', labelBM: '4. Live API Tester', labelJawi: '٤. اوجيان لا؞يف API', icon: Play },
    { id: 'wireframe', labelBM: '5. Wireframe Customer App', labelJawi: '٥. وايرفرَيم کستومر اَيڤ', icon: Smartphone },
    { id: 'doc', labelBM: '6. Ringkasan Dokumen', labelJawi: '٦. ريڠکسن دوکومن', icon: FileText }
  ];

  return (
    <header id="app-header" className="bg-white border-b-2 border-[#FF7A1A] sticky top-0 z-50 shadow-sm">
      {/* Top Banner Accent */}
      <div className="h-2 bg-gradient-to-r from-[#FF7A1A] via-[#FF9D5C] to-[#1A1A1A]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-[#FF7A1A] border-2 border-[#1A1A1A] rounded-2xl flex items-center justify-center text-white text-2xl shadow-[3px_3px_0px_0px_#1A1A1A] rotate-3 transform hover:rotate-0 transition-transform">
              🐻
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black italic tracking-tighter text-[#1A1A1A] leading-none">
                  {dict('appName')}
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-[#FFF5EB] text-[#FF7A1A] border border-[#FF7A1A]/30 rounded-full">
                  Malaysia 🇲🇾
                </span>
              </div>
              <p className="text-[11px] font-bold text-[#FF7A1A] opacity-90 uppercase tracking-wider mt-0.5">
                {dict('tagline')}
              </p>
            </div>
          </div>

          {/* Controls: Language Switcher */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            {/* Language Toggle in Artistic Pill style */}
            <div className="flex items-center bg-[#FFF5EB] border-2 border-[#1A1A1A] p-1 rounded-full shadow-[3px_3px_0px_0px_#FF7A1A]">
              <button
                id="lang-btn-bm"
                onClick={() => setLangMode('bm')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-full transition-all ${
                  langMode === 'bm'
                    ? 'bg-[#FF7A1A] text-white border border-[#1A1A1A] shadow-xs'
                    : 'text-[#1A1A1A] hover:text-[#FF7A1A]'
                }`}
              >
                <span>BM</span>
                <span className="text-[10px] opacity-80">Bahasa</span>
              </button>
              <div className="w-[1px] h-4 bg-[#FF7A1A]/30 mx-1" />
              <button
                id="lang-btn-jawi"
                onClick={() => setLangMode('jawi')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black rounded-full transition-all ${
                  langMode === 'jawi'
                    ? 'bg-[#FF7A1A] text-white border border-[#1A1A1A] shadow-xs'
                    : 'text-[#1A1A1A] hover:text-[#FF7A1A]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="font-serif text-sm">جاوي</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-2 overflow-x-auto pb-3 pt-1 border-t border-gray-100 scrollbar-none">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs md:text-sm font-black rounded-2xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#FF7A1A] text-white border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]'
                    : 'bg-white text-[#1A1A1A] border-2 border-transparent hover:border-[#1A1A1A] hover:bg-[#FFF5EB]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#FF7A1A]'}`} />
                <span>{langMode === 'bm' ? tab.labelBM : tab.labelJawi}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
