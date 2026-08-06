/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LanguageMode } from './types';
import { Header } from './components/Header';
import { DatabaseSchemaView } from './components/DatabaseSchemaView';
import { BackendStructureView } from './components/BackendStructureView';
import { ApiExplorerView } from './components/ApiExplorerView';
import { LiveApiTesterView } from './components/LiveApiTesterView';
import { CustomerWireframeView } from './components/CustomerWireframeView';
import { MarkdownOutputView } from './components/MarkdownOutputView';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('db');
  const [langMode, setLangMode] = useState<LanguageMode>('bm');

  return (
    <div className={`min-h-screen bg-[#FFF9F2] text-[#1A1A1A] font-sans antialiased flex flex-col ${langMode === 'jawi' ? 'dir-rtl' : ''}`}>
      {/* Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        langMode={langMode}
        setLangMode={setLangMode}
      />

      {/* Main Content Viewport */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'db' && <DatabaseSchemaView langMode={langMode} />}
            {activeTab === 'backend' && <BackendStructureView langMode={langMode} />}
            {activeTab === 'api' && <ApiExplorerView langMode={langMode} />}
            {activeTab === 'live_api' && <LiveApiTesterView langMode={langMode} />}
            {activeTab === 'wireframe' && <CustomerWireframeView langMode={langMode} />}
            {activeTab === 'doc' && <MarkdownOutputView langMode={langMode} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer id="app-footer" className="bg-white border-t-2 border-[#1A1A1A] py-6 text-center text-xs text-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-black text-[#1A1A1A]">
            <span className="text-base">🐻🍊</span>
            <span>BeruangMakan Platform Architecture • Malaysia</span>
          </div>
          <p className="text-gray-600 font-bold">
            PostgreSQL + PostGIS • Node.js Express Monorepo • REST API • Flutter & React
          </p>
        </div>
      </footer>
    </div>
  );
}
