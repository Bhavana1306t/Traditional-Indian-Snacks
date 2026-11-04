
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BUSINESS_CONFIG } from '../../lib/constants';
import { DecorativeLotus } from './DecorativeLotus';
import {
  Menu,
  X,
  Phone,
  User,
  ShoppingBag,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuthModal: () => void;
  onOpenOrderModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuthModal,
  onOpenOrderModal,
}) => {
  const { user, profile, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/our-poornalu', label: 'Our Poornalu' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full max-w-full overflow-x-clip bg-[#FFF3DD]/95 backdrop-blur-md border-b-2 border-[#C69A45]/40 shadow-sm text-[#553322]">

      {/* Top Contact Bar */}
      <div className="w-full bg-[#7B211F] text-[#FFF3DD] px-3 sm:px-5 py-2 border-b border-[#C69A45]/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[#C69A45] text-xs shrink-0">🪔</span>

            <span className="hidden sm:block font-serif text-[11px] tracking-wider truncate">
              Authentic Andhra Homemade Sweets • Prepared by Lakshmipathi Raju
            </span>

            <span className="sm:hidden font-serif !text-[9px] min-[380px]:!text-[10px] tracking-wide truncate">
              Traditional Andhra Sweets
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a
              href={`tel:${BUSINESS_CONFIG.phone}`}
              className="hover:text-[#C69A45] flex items-center gap-1 !text-[10px] sm:!text-[11px] transition whitespace-nowrap"
            >
              <Phone className="w-3 h-3 text-[#C69A45] shrink-0" />
              <span className="hidden min-[380px]:inline">
                {BUSINESS_CONFIG.phone}
              </span>
              <span className="min-[380px]:hidden">Call</span>
            </a>

            <Link
              to="/admin/login"
              className="text-[#C69A45] hover:text-[#FFF3DD] font-medium flex items-center gap-1 pl-2 border-l border-[#C69A45]/40 !text-[10px] sm:!text-[11px] whitespace-nowrap"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">

        <div className="flex items-center justify-between min-h-[64px] sm:h-20 gap-2">

          {/* Brand */}
          <div className="flex-1 min-w-0 md:flex-none">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-2 sm:gap-3 group min-w-0"
            >
              <div className="shrink-0 p-1.5 sm:p-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#7B211F] to-[#5A1715] border border-[#C69A45]/60 shadow-md group-hover:scale-105 transition-all">
                <DecorativeLotus size={26} color="#C69A45" />
              </div>

              <div className="min-w-0">
                <span className="block max-w-[145px] min-[380px]:max-w-[175px] sm:max-w-none !text-[12px] min-[380px]:!text-[14px] sm:!text-2xl font-serif font-black tracking-tight sm:tracking-wide text-[#7B211F] leading-[1.15] whitespace-normal break-words">
                  <span className="sm:hidden">
                    Traditional Indian Snacks
                  </span>
                  <span className="hidden sm:inline">
                    {BUSINESS_CONFIG.name}
                  </span>
                </span>

                <span className="block !text-[7px] min-[380px]:!text-[8px] sm:!text-xs font-serif font-semibold text-[#C69A45] tracking-[0.06em] sm:tracking-[0.2em] uppercase mt-1 truncate max-w-[145px] min-[380px]:max-w-[175px] sm:max-w-none">
                  {BUSINESS_CONFIG.tagline}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-2 lg:gap-4 xl:gap-6 mx-2 lg:mx-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative px-3 py-2 rounded-full font-sans text-xs lg:text-[13px] font-medium whitespace-nowrap transition-all group/nav ${
                    isActive
                      ? 'text-[#7B211F] font-bold bg-[#F8E7CB]/90 shadow-sm'
                      : 'text-[#553322] hover:text-[#7B211F] hover:bg-[#F8E7CB]/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{link.label}</span>
                    <span
                      className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-[#C69A45] via-[#7B211F] to-[#C69A45] rounded-full transition-all duration-300 ${
                        isActive
                          ? 'w-3/4 opacity-100'
                          : 'w-0 opacity-0 group-hover/nav:w-3/4 group-hover/nav:opacity-100'
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}

            {user && (
              <NavLink
                to="/customer/dashboard"
                className={({ isActive }) =>
                  `relative px-3 py-2 rounded-full font-sans text-xs lg:text-[13px] font-medium whitespace-nowrap transition-all flex items-center gap-1.5 group/nav ${
                    isActive
                      ? 'text-[#7B211F] font-bold bg-[#F8E7CB]/90 shadow-sm'
                      : 'text-[#553322] hover:text-[#7B211F] hover:bg-[#F8E7CB]/60'
                  }`
                }
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#C69A45]" />
                <span>My Orders</span>
              </NavLink>
            )}
          </nav>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenOrderModal}
              className="px-4 lg:px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7B211F] to-[#9B302A] text-[#FFF3DD] font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-[#C69A45]/40"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFE082]" />
              <span>Order Poornalu</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F8E7CB] hover:bg-[#EDD4AE] border border-[#C69A45]/40 text-xs font-semibold text-[#7B211F] transition"
                >
                  <User className="w-4 h-4 text-[#7B211F]" />
                  <span className="max-w-[100px] truncate">
                    {profile?.full_name || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#C69A45]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#FFF3DD] border-2 border-[#C69A45]/50 shadow-xl py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-[#C69A45]/20">
                      <p className="font-bold text-[#7B211F] truncate">
                        {profile?.full_name || 'Customer'}
                      </p>
                      <p className="text-[11px] text-[#553322]/70 font-mono">
                        {profile?.phone}
                      </p>
                    </div>

                    <Link
                      to="/customer/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-[#F8E7CB] text-[#553322] font-medium"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#C69A45]" />
                      <span>Customer Dashboard</span>
                    </Link>

                    {role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-[#F8E7CB] text-[#7B211F] font-bold"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#7B211F]" />
                        <span>Go to Admin Portal</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-rose-700 hover:bg-rose-50 font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-4 py-2 rounded-full border border-[#7B211F] text-[#7B211F] hover:bg-[#7B211F] hover:text-[#FFF3DD] font-serif font-semibold text-xs tracking-wider transition-all"
              >
                Login / Register
              </button>
            )}
          </div>

          {/* Mobile Order Button and Menu */}
          <div className="md:hidden flex items-center gap-1.5 shrink-0">
            <button
              onClick={onOpenOrderModal}
              className="px-2 min-[380px]:px-3 py-2 rounded-full bg-gradient-to-r from-[#7B211F] to-[#9B302A] text-[#FFF3DD] font-serif font-bold !text-[10px] min-[380px]:!text-xs shadow-sm whitespace-nowrap border border-[#C69A45]/40 active:scale-95 transition"
            >
              Order Now
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#7B211F] hover:bg-[#F8E7CB] rounded-xl transition shrink-0"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#C69A45]/30 bg-[#FFF3DD] px-4 pt-3 pb-5 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `block py-3 px-3 rounded-xl font-serif text-sm font-semibold ${
                  isActive
                    ? 'bg-[#7B211F] text-[#FFF3DD]'
                    : 'text-[#553322] hover:bg-[#F8E7CB]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <div className="pt-2 border-t border-[#C69A45]/30 space-y-2">
              <NavLink
                to="/customer/dashboard"
                onClick={closeMobileMenu}
                className="flex items-center gap-2 py-3 px-3 rounded-xl text-sm font-bold text-[#7B211F] bg-[#F8E7CB]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Customer Dashboard & My Orders</span>
              </NavLink>

              {role === 'admin' && (
                <NavLink
                  to="/admin/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 py-3 px-3 rounded-xl text-sm font-bold text-[#7B211F]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Portal</span>
                </NavLink>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 py-3 px-3 rounded-xl text-sm text-rose-700 font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout ({profile?.full_name || 'Customer'})</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-[#C69A45]/30">
              <button
                onClick={() => {
                  closeMobileMenu();
                  onOpenAuthModal();
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#7B211F] text-[#FFF3DD] font-serif font-bold text-xs uppercase tracking-wider"
              >
                Login / Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
