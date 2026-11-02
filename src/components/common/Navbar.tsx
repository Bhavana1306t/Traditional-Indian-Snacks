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
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onOpenAuthModal: () => void;
  onOpenOrderModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuthModal, onOpenOrderModal }) => {
  const { user, profile, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/our-poornalu', label: 'Our Poornalu' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFF3DD]/95 backdrop-blur-md border-b-2 border-[#C69A45]/40 shadow-sm text-[#553322]">
      {/* Top Auspicious Micro-Bar */}
      <div className="bg-[#7B211F] text-[#FFF3DD] py-1 px-4 text-[11px] font-sans flex items-center justify-between border-b border-[#C69A45]/40">
        <div className="flex items-center gap-2">
          <span className="text-[#C69A45] text-xs">🪔</span>
          <span className="hidden sm:inline font-serif tracking-wider">
            Authentic Andhra Homemade Sweets • Prepared by Lakshmipathi Raju
          </span>
          <span className="sm:hidden font-serif">
            Traditional Andhra Sweets
          </span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${BUSINESS_CONFIG.phone}`}
            className="hover:text-[#C69A45] flex items-center gap-1 transition"
          >
            <Phone className="w-3 h-3 text-[#C69A45]" />
            <span>{BUSINESS_CONFIG.phone}</span>
          </a>

          {/* Discreet Admin Login Link in Top Bar */}
          <Link
            to="/admin/login"
            className="text-[#C69A45] hover:text-[#FFF3DD] font-medium tracking-wide flex items-center gap-1 pl-2 border-l border-[#C69A45]/40"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin</span>
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-20">
          {/* LEFT: Heading / Logo / Brand Title on Far Left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 group transition-transform duration-300">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[#7B211F] to-[#5A1715] border border-[#C69A45]/60 shadow-md group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-[#C69A45]/30 group-hover:shadow-lg transition-all duration-300">
                <DecorativeLotus size={28} color="#C69A45" />
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-serif font-black tracking-wide text-[#7B211F] group-hover:text-[#9B302A] block leading-none transition-colors duration-200">
                  {BUSINESS_CONFIG.name}
                </span>
                <span className="text-[10px] sm:text-xs font-serif font-semibold text-[#C69A45] tracking-[0.2em] uppercase block mt-1">
                  {BUSINESS_CONFIG.tagline}
                </span>
              </div>
            </Link>
          </div>

          {/* MIDDLE: Nav Links (Home, About Us, Our Poornalu, Contact, My Orders) with small words, centered and properly spaced */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-5 lg:gap-8 xl:gap-10 mx-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `relative px-3.5 py-1.5 rounded-full font-sans text-xs sm:text-[13px] font-medium tracking-normal whitespace-nowrap transition-all duration-300 transform hover:-translate-y-0.5 group/nav ${
                    isActive
                      ? 'text-[#7B211F] font-bold bg-[#F8E7CB]/90 shadow-sm'
                      : 'text-[#553322] hover:text-[#7B211F] hover:bg-[#F8E7CB]/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10 transition-transform duration-200 group-hover/nav:scale-105 inline-block">
                      {link.label}
                    </span>
                    {/* Animated Gold Bottom Underline Expanding on Hover */}
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
                  `relative px-3.5 py-1.5 rounded-full font-sans text-xs sm:text-[13px] font-medium tracking-normal whitespace-nowrap transition-all duration-300 transform hover:-translate-y-0.5 group/nav flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#7B211F] font-bold bg-[#F8E7CB]/90 shadow-sm'
                      : 'text-[#553322] hover:text-[#7B211F] hover:bg-[#F8E7CB]/60'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C69A45] group-hover/nav:scale-110 transition-transform duration-200" />
                    <span className="relative z-10 transition-transform duration-200 group-hover/nav:scale-105 inline-block">
                      My Orders
                    </span>
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
            )}
          </nav>

          {/* RIGHT: Order Button & Auth Status */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <button
              onClick={onOpenOrderModal}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7B211F] to-[#9B302A] text-[#FFF3DD] font-serif font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2 border border-[#C69A45]/40 group/btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFE082] group-hover/btn:rotate-180 transition-transform duration-500" />
              <span>Order Poornalu</span>
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#F8E7CB] hover:bg-[#EDD4AE] border border-[#C69A45]/40 text-xs font-semibold text-[#7B211F] transition"
                >
                  <User className="w-4 h-4 text-[#7B211F]" />
                  <span className="max-w-[100px] truncate">{profile?.full_name || 'Account'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#C69A45]" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#FFF3DD] border-2 border-[#C69A45]/50 shadow-xl py-2 z-50 text-xs animate-fadeIn">
                    <div className="px-4 py-2 border-b border-[#C69A45]/20">
                      <p className="font-bold text-[#7B211F] truncate">{profile?.full_name || 'Customer'}</p>
                      <p className="text-[11px] text-[#553322]/70 font-mono">{profile?.phone}</p>
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

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenOrderModal}
              className="px-3 py-1.5 rounded-full bg-[#7B211F] text-[#FFF3DD] font-serif font-bold text-xs shadow-sm"
            >
              Order Now
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#7B211F] hover:bg-[#F8E7CB] rounded-xl transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#C69A45]/30 bg-[#FFF3DD] px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block py-2 px-3 rounded-xl font-serif text-sm font-semibold ${
                  isActive ? 'bg-[#7B211F] text-[#FFF3DD]' : 'text-[#553322] hover:bg-[#F8E7CB]'
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
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 px-3 rounded-xl text-sm font-bold text-[#7B211F] bg-[#F8E7CB]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Customer Dashboard & My Orders</span>
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left flex items-center gap-2 py-2 px-3 rounded-xl text-sm text-rose-700 font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout ({profile?.full_name || 'Customer'})</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-[#C69A45]/30">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#7B211F] text-[#FFF3DD] font-serif font-bold text-xs uppercase tracking-wider"
              >
                Login / Register with Mobile OTP
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

