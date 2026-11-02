import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { Menu, X, ShieldCheck } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF3DD] text-[#553322] flex flex-col lg:flex-row">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-[#5A1715] text-[#FFF3DD] p-4 flex items-center justify-between border-b border-[#C69A45]/40 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#C69A45]" />
          <span className="font-serif font-bold text-sm tracking-wide">TIS Admin Console</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-[#3D0D0B] text-[#FFF3DD] hover:bg-[#7B211F]"
          aria-label="Toggle navigation"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
