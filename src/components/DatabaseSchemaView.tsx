import React, { useState } from 'react';
import { TableDef, LanguageMode } from '../types';
import { DB_SCHEMA, SQL_DDL_FULL } from '../data/dbSchema';
import { Database, Key, MapPin, CheckCircle, Copy, Code, Search, Sparkles } from 'lucide-react';

interface DatabaseSchemaViewProps {
  langMode: LanguageMode;
}

export const DatabaseSchemaView: React.FC<DatabaseSchemaViewProps> = ({ langMode }) => {
  const [selectedTableId, setSelectedTableId] = useState<string>('users');
  const [viewMode, setViewMode] = useState<'interactive' | 'ddl'>('interactive');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const selectedTable = DB_SCHEMA.find(t => t.id === selectedTableId) || DB_SCHEMA[0];

  const filteredTables = DB_SCHEMA.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.columns.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopyDDL = () => {
    navigator.clipboard.writeText(SQL_DDL_FULL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="db-schema-view" className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#FF7A1A] border-2 border-[#1A1A1A] rounded-3xl p-6 text-white shadow-[8px_8px_0px_0px_#1A1A1A]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#1A1A1A] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                PostgreSQL 16 + PostGIS
              </span>
              <span className="bg-emerald-500 text-white border border-[#1A1A1A] text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-[2px_2px_0px_0px_#1A1A1A]">
                <MapPin className="w-3 h-3" /> Geospatial Ready
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter">
              {langMode === 'bm' ? 'Skema Database PostgreSQL BeruangMakan' : 'سکيما داتابيس ڤوستݢريسقول برواڠ ماکن'}
            </h2>
            <p className="text-white/90 text-sm mt-1 max-w-2xl font-medium">
              10 entiti database lengkap berorientasikan pengesahan Halal, carian lokasi PostGIS ST_DWithin, transaksi pembayaran multi-kaedah, dan jejak audit pentadbir.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="view-mode-interactive-btn"
              onClick={() => setViewMode('interactive')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs transition-all border-2 border-[#1A1A1A] ${
                viewMode === 'interactive'
                  ? 'bg-white text-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]'
                  : 'bg-[#1A1A1A]/20 text-white hover:bg-[#1A1A1A]/40'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>{langMode === 'bm' ? 'Paparan Interaktif' : 'ڤاڤرن اينتيراکتيف'}</span>
            </button>
            <button
              id="view-mode-ddl-btn"
              onClick={() => setViewMode('ddl')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs transition-all border-2 border-[#1A1A1A] ${
                viewMode === 'ddl'
                  ? 'bg-white text-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A]'
                  : 'bg-[#1A1A1A]/20 text-white hover:bg-[#1A1A1A]/40'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>{langMode === 'bm' ? 'Skrip SQL DDL' : 'سکريڤ SQL DDL'}</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'interactive' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Table List Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3.5 text-[#1A1A1A]" />
              <input
                id="db-search-input"
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={langMode === 'bm' ? 'Cari jadual atau kolum...' : 'چاري جادوال اتو کولوم...'}
                className="w-full pl-9 pr-4 py-2.5 bg-white border-2 border-[#1A1A1A] rounded-2xl text-xs font-bold text-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] focus:outline-hidden"
              />
            </div>

            <div className="bg-white rounded-3xl p-3 border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] space-y-1.5 max-h-[600px] overflow-y-auto">
              <div className="text-[11px] font-black text-[#1A1A1A] uppercase tracking-wider px-3 py-1">
                Senarai Jadual ({filteredTables.length})
              </div>
              {filteredTables.map(table => {
                const isSelected = table.id === selectedTable.id;
                const hasPostGis = table.columns.some(c => c.type.includes('GEOGRAPHY'));
                return (
                  <button
                    key={table.id}
                    id={`table-select-btn-${table.id}`}
                    onClick={() => setSelectedTableId(table.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between border-2 ${
                      isSelected
                        ? 'bg-[#FF7A1A] text-white border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] font-black'
                        : 'border-transparent hover:border-[#1A1A1A] hover:bg-[#FFF5EB] text-[#1A1A1A]'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-black flex items-center gap-1.5">
                        <span>{table.name}</span>
                        {hasPostGis && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full border border-[#1A1A1A] ${isSelected ? 'bg-white text-[#1A1A1A]' : 'bg-emerald-100 text-emerald-800'}`}>
                            PostGIS
                          </span>
                        )}
                      </div>
                      <div className={`text-xs font-bold truncate max-w-[200px] ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                        {table.columns.length} Kolum • {table.indexes.length} Indeks
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Table Detail Card */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b-2 border-[#1A1A1A] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-[#1A1A1A] font-mono">
                      {selectedTable.name}
                    </h3>
                    <span className="bg-[#FFF5EB] text-[#FF7A1A] border-2 border-[#1A1A1A] text-xs font-black px-2.5 py-1 rounded-xl">
                      {selectedTable.columns.length} Kolum
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium mt-1">
                    {selectedTable.description}
                  </p>
                </div>
              </div>

              {/* Columns Table */}
              <div className="overflow-x-auto rounded-2xl border-2 border-[#1A1A1A]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FFF5EB] text-[#1A1A1A] font-black uppercase tracking-wider border-b-2 border-[#1A1A1A]">
                      <th className="p-3">Kolum</th>
                      <th className="p-3">Jenis Data</th>
                      <th className="p-3">Atribut / Kunci</th>
                      <th className="p-3">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1A1A1A]/20 font-bold text-[#1A1A1A]">
                    {selectedTable.columns.map((col, idx) => (
                      <tr key={idx} className="hover:bg-[#FFF5EB]/60 transition-colors">
                        <td className="p-3 font-mono font-black text-[#1A1A1A]">
                          {col.name}
                        </td>
                        <td className="p-3 font-mono">
                          <span className={`px-2 py-0.5 rounded-lg border border-[#1A1A1A] font-bold ${
                            col.type.includes('GEOGRAPHY') 
                              ? 'bg-emerald-100 text-emerald-900'
                              : col.type.includes('ENUM')
                              ? 'bg-purple-100 text-purple-900'
                              : 'bg-gray-100 text-[#1A1A1A]'
                          }`}>
                            {col.type}
                          </span>
                        </td>
                        <td className="p-3 space-x-1 space-y-1">
                          {col.isPk && (
                            <span className="inline-flex items-center gap-0.5 bg-amber-200 text-amber-950 border border-[#1A1A1A] text-[10px] font-black px-2 py-0.5 rounded-lg">
                              <Key className="w-2.5 h-2.5" /> PK
                            </span>
                          )}
                          {col.isFk && (
                            <span className="inline-flex items-center gap-0.5 bg-blue-100 text-blue-900 border border-[#1A1A1A] text-[10px] font-black px-2 py-0.5 rounded-lg">
                              FK ({col.fkRef})
                            </span>
                          )}
                          {col.unique && (
                            <span className="bg-indigo-100 text-indigo-900 border border-[#1A1A1A] text-[10px] font-black px-2 py-0.5 rounded-lg">
                              UNIQUE
                            </span>
                          )}
                          {col.nullable === false && !col.isPk && (
                            <span className="bg-red-100 text-red-900 border border-[#1A1A1A] text-[10px] font-black px-2 py-0.5 rounded-lg">
                              NOT NULL
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-gray-700 max-w-xs font-medium">
                          {col.description}
                          {col.defaultValue && (
                            <div className="text-[10px] font-mono text-gray-500 font-bold mt-0.5">
                              Default: {col.defaultValue}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Indexes Section */}
              <div className="bg-[#FFF5EB] rounded-2xl p-4 border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#FF7A1A] space-y-2">
                <h4 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF7A1A]" />
                  Indeks Disyorkan untuk Prestasi Optimum
                </h4>
                <div className="space-y-1.5 font-mono text-xs">
                  {selectedTable.indexes.map((idxSql, i) => (
                    <div key={i} className="bg-white p-2.5 rounded-xl border border-[#1A1A1A] text-[#1A1A1A] font-bold shadow-2xs">
                      {idxSql}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* DDL View */
        <div className="bg-[#1A1A1A] rounded-3xl p-6 text-gray-100 space-y-4 shadow-[8px_8px_0px_0px_#FF7A1A] border-2 border-[#1A1A1A]">
          <div className="flex items-center justify-between border-b-2 border-gray-700 pb-4">
            <div>
              <h3 className="text-lg font-black font-mono text-[#FF7A1A]">
                skema_beruangmakan_postgis.sql
              </h3>
              <p className="text-xs text-gray-300 font-medium mt-1">
                Skrip DDL PostgreSQL lengkap bersedia untuk dijalankan di psql / Cloud SQL
              </p>
            </div>
            <button
              id="copy-sql-ddl-btn"
              onClick={handleCopyDDL}
              className="flex items-center gap-2 bg-[#FF7A1A] hover:bg-[#FF7A1A]/90 text-white border-2 border-[#1A1A1A] px-4 py-2.5 rounded-2xl text-xs font-black transition-all shadow-[3px_3px_0px_0px_#1A1A1A]"
            >
              {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Telah Disalin!' : 'Salin Skrip DDL SQL'}</span>
            </button>
          </div>

          <pre className="font-mono text-xs text-emerald-300 overflow-x-auto p-4 bg-black rounded-2xl max-h-[600px] leading-relaxed border border-gray-800">
            {SQL_DDL_FULL}
          </pre>
        </div>
      )}
    </div>
  );
};
