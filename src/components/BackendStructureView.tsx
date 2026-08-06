import React, { useState } from 'react';
import { LanguageMode } from '../types';
import { BACKEND_FOLDER_TREE, MONOREPO_EXPLANATION, FolderNode } from '../data/backendStructure';
import { Folder, FileText, CheckCircle2, ChevronRight, ChevronDown, Layers, Server, ShieldCheck, Cpu } from 'lucide-react';

interface BackendStructureViewProps {
  langMode: LanguageMode;
}

export const BackendStructureView: React.FC<BackendStructureViewProps> = ({ langMode }) => {
  const [selectedNode, setSelectedNode] = useState<FolderNode>(BACKEND_FOLDER_TREE);

  const TreeNode: React.FC<{ node: FolderNode; depth?: number }> = ({ node, depth = 0 }) => {
    const [isOpen, setIsOpen] = useState<boolean>(depth < 3);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode.name === node.name;

    return (
      <div className="select-none">
        <div
          onClick={(e) => {
            e.stopPropagation();
            setSelectedNode(node);
            if (hasChildren) setIsOpen(!isOpen);
          }}
          style={{ paddingLeft: `${depth * 1.25}rem` }}
          className={`flex items-center justify-between py-1.5 px-2.5 rounded-xl cursor-pointer text-xs transition-all ${
            isSelected
              ? 'bg-orange-500 text-white font-bold shadow-xs'
              : 'hover:bg-orange-50 text-gray-700'
          }`}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            {hasChildren ? (
              isOpen ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <span className="w-3.5 h-3.5 shrink-0" />
            )}

            {node.type === 'folder' ? (
              <Folder className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-amber-500'}`} />
            ) : (
              <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
            )}

            <span className="font-mono truncate">{node.name}</span>
          </div>

          {node.description && (
            <span className={`text-[10px] hidden sm:inline truncate max-w-[150px] ${isSelected ? 'text-orange-100' : 'text-gray-400'}`}>
              {node.description}
            </span>
          )}
        </div>

        {hasChildren && isOpen && (
          <div className="mt-0.5 space-y-0.5 border-l border-gray-100 ml-3">
            {node.children!.map((child, i) => (
              <TreeNode key={i} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div id="backend-structure-view" className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-[#1A1A1A] border-2 border-[#1A1A1A] rounded-3xl p-6 text-white shadow-[8px_8px_0px_0px_#FF7A1A] space-y-3">
        <div className="flex items-center gap-2">
          <span className="bg-[#FF7A1A] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border border-white/20">
            Seni Bina Monorepo (pnpm + Turborepo)
          </span>
          <span className="bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full border border-white/20 flex items-center gap-1 shadow-[2px_2px_0px_0px_#FF7A1A]">
            <Server className="w-3 h-3" /> Node.js + Express
          </span>
        </div>
        <h2 className="text-2xl md:text-4xl font-black italic tracking-tighter text-[#FF7A1A]">
          {langMode === 'bm' ? 'Struktur Projek Backend & Monorepo' : 'ستروکتور ڤروجَيک بيک-ايند د ن مونوريڤو'}
        </h2>
        <p className="text-gray-300 text-sm max-w-3xl font-medium">
          Sebab Utama Pemilihan Monorepo: 4 komponen (Customer Flutter, Rider Flutter, Merchant Flutter, Admin React CMS) berkongsi 1 backend Node.js Express & PostgreSQL yang sama.
        </p>
      </div>

      {/* Rationale Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-5 border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] space-y-3">
          <div className="flex items-center gap-2 text-[#FF7A1A] font-black text-sm uppercase">
            <Layers className="w-4 h-4 text-[#FF7A1A]" />
            <span>{MONOREPO_EXPLANATION.recommendation}</span>
          </div>
          <ul className="space-y-2 text-xs text-[#1A1A1A] font-bold leading-relaxed">
            {MONOREPO_EXPLANATION.rationale.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-[#FFF5EB] rounded-3xl p-5 border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#FF7A1A] space-y-3">
          <div className="flex items-center gap-2 text-[#1A1A1A] font-black text-sm uppercase">
            <Cpu className="w-4 h-4 text-[#FF7A1A]" />
            <span>Alur Lapisan Seni Bina Express (Layered Pattern)</span>
          </div>
          <div className="space-y-2 text-xs text-[#1A1A1A] font-bold">
            <div className="bg-white p-3 rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] space-y-1">
              <span className="font-black text-[#FF7A1A]">1. Client Request → Express Routes</span>
              <p className="text-gray-700 text-[11px] font-medium">Memetakan endpoint REST API ke controller yang berkaitan.</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] space-y-1">
              <span className="font-black text-[#FF7A1A]">2. Middlewares (Auth JWT + RBAC + Rate Limit)</span>
              <p className="text-gray-700 text-[11px] font-medium">Mengesahkan token pengguna, role (Customer/Rider/Merchant/Admin), dan keselamatan OTP.</p>
            </div>
            <div className="bg-white p-3 rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] space-y-1">
              <span className="font-black text-[#FF7A1A]">3. Controller → Services → PostGIS DB Pool</span>
              <p className="text-gray-700 text-[11px] font-medium">Logik perniagaan transaksi ACID, query radius lokasi, dan penukaran teks Jawi.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Folder Tree Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] space-y-3">
          <h3 className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider flex items-center justify-between">
            <span>Struktur Pokok Folder (Interactive Tree)</span>
            <span className="text-[#FF7A1A] font-mono">Monorepo Workspace</span>
          </h3>
          <div className="bg-gray-50 p-3 rounded-2xl border-2 border-[#1A1A1A] max-h-[500px] overflow-y-auto">
            <TreeNode node={BACKEND_FOLDER_TREE} />
          </div>
        </div>

        {/* Selected Node Details */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-3xl p-6 border-2 border-[#1A1A1A] shadow-[6px_6px_0px_0px_#1A1A1A] space-y-4">
            <div className="flex items-center gap-3 border-b-2 border-[#1A1A1A] pb-3">
              <div className="w-10 h-10 bg-[#FFF5EB] border-2 border-[#1A1A1A] rounded-2xl flex items-center justify-center text-[#FF7A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
                {selectedNode.type === 'folder' ? <Folder className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-base font-mono font-black text-[#1A1A1A]">
                  {selectedNode.name}
                </h4>
                <span className="text-xs text-[#FF7A1A] font-black uppercase">
                  {selectedNode.type === 'folder' ? 'Folder / Direktori' : 'Fail Sumber'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider">Tujuan & Fungsi</label>
                <p className="text-sm text-[#1A1A1A] font-medium mt-1 leading-relaxed bg-[#FFF5EB] p-3 rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#FF7A1A]">
                  {selectedNode.description || 'Tiada keterangan tambahan.'}
                </p>
              </div>

              {selectedNode.children && selectedNode.children.length > 0 && (
                <div>
                  <label className="text-xs font-black text-[#1A1A1A] uppercase tracking-wider">Kandungan Dalam ({selectedNode.children.length})</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {selectedNode.children.map((child, idx) => (
                      <div key={idx} className="p-2.5 bg-gray-50 rounded-xl text-xs font-mono font-bold text-[#1A1A1A] flex items-center gap-2 border border-[#1A1A1A]">
                        {child.type === 'folder' ? <Folder className="w-3.5 h-3.5 text-amber-500" /> : <FileText className="w-3.5 h-3.5 text-blue-500" />}
                        <span className="truncate">{child.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
