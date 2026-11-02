import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BUSINESS_CONFIG } from '../../lib/constants';
import { DecorativeLotus } from '../common/DecorativeLotus';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Tag,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Flame
} from 'lucide-react';

export const AdminSidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = true,
  onClose,
}) => {
  const { logout, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/orders', label: 'Orders Management', icon: ShoppingBag },
    { to: '/admin/customers', label: 'Customers', icon: Users },
    { to: '/admin/products', label: 'Products & Pricing', icon: Tag },
    { to: '/admin/settings', label: 'Settings & Security', icon: Settings },
  ];

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#5A1715] text-[#FFF3DD] border-r-2 border-[#C69A45]/40 flex flex-col justify-between transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div>
        {/* Brand Banner */}
        <div className="p-6 border-b border-[#C69A45]/30 bg-[#3D0D0B]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#7B211F] border border-[#C69A45]/50">
              <DecorativeLotus size={24} color="#C69A45" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm tracking-wide text-[#FFF3DD]">
                {BUSINESS_CONFIG.name}
              </h2>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#C69A45] flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#C69A45]" />
                Admin Portal
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#C69A45]/20 text-xs text-[#F8E7CB]/80">
            <p className="font-medium truncate">{profile?.full_name || 'Lakshmipathi Raju'}</p>
            <p className="text-[10px] text-[#C69A45]">{BUSINESS_CONFIG.email}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#C69A45] text-[#553322] shadow-md'
                      : 'text-[#F8E7CB]/80 hover:bg-[#7B211F] hover:text-[#FFF3DD]'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-[#C69A45]/30 bg-[#3D0D0B] space-y-2">
        <NavLink
          to="/"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#F8E7CB]/70 hover:text-[#FFF3DD] hover:bg-[#7B211F]/60 transition"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#C69A45]" />
            <span>View Public Store</span>
          </span>
          <span className="text-[10px] text-[#C69A45]">↗</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/60 hover:text-rose-200 transition border border-rose-900/40"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Admin</span>
        </button>
      </div>
    </aside>
  );
};
