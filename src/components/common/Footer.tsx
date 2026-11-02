import React from 'react';
import { Link } from 'react-router-dom';
import { BUSINESS_CONFIG } from '../../lib/constants';
import { DecorativeLotus } from './DecorativeLotus';
import { openDirectWhatsApp } from '../../lib/whatsapp';
import { Phone, MessageCircle, Heart, ShieldCheck, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-[#5A1715] to-[#3D0D0B] text-[#FFF3DD] border-t-4 border-[#C69A45]">
      {/* Decorative Golden Inlay Line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#C69A45] to-transparent opacity-80" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#7B211F] border border-[#C69A45]/60 shadow-md">
                <DecorativeLotus size={32} color="#C69A45" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-black tracking-wide text-[#FFF3DD]">
                  {BUSINESS_CONFIG.name}
                </h3>
                <p className="text-xs font-serif text-[#C69A45] tracking-[0.2em] uppercase font-bold">
                  {BUSINESS_CONFIG.tagline}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#F8E7CB]/80 font-sans max-w-md leading-relaxed">
              Traditional Indian Snacks is dedicated to preserving the pristine culinary legacy of Andhra homemade festival sweets. Our Andhra Poornalu (Poornam Boorelu) are made fresh to order with organic jaggery, chana dal, grated coconut, and pure cow ghee.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-[#C69A45]">
              <span>Master Sweet Chef & Proprietor:</span>
              <strong className="text-[#FFF3DD]">{BUSINESS_CONFIG.owner}</strong>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#C69A45] uppercase tracking-wider border-b border-[#C69A45]/30 pb-1.5">
              Traditional Menu
            </h4>
            <ul className="space-y-2 text-xs text-[#F8E7CB]/80">
              <li>
                <Link to="/our-poornalu" className="hover:text-[#FFF3DD] hover:underline flex items-center gap-1.5">
                  <span className="text-[#C69A45]">◆</span> Andhra Poornam Boorelu
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FFF3DD] hover:underline flex items-center gap-1.5">
                  <span className="text-[#C69A45]">◆</span> Our Traditional Heritage
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FFF3DD] hover:underline flex items-center gap-1.5">
                  <span className="text-[#C69A45]">◆</span> Kitchen & Pickup Counter
                </Link>
              </li>
              <li>
                <Link to="/customer/dashboard" className="hover:text-[#FFF3DD] hover:underline flex items-center gap-1.5">
                  <span className="text-[#C69A45]">◆</span> Track Your Sweet Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & WhatsApp */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#C69A45] uppercase tracking-wider border-b border-[#C69A45]/30 pb-1.5">
              Connect Directly
            </h4>
            <div className="space-y-2.5 text-xs text-[#F8E7CB]/80">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C69A45]" />
                <a href={`tel:${BUSINESS_CONFIG.phone}`} className="hover:text-[#FFF3DD]">
                  {BUSINESS_CONFIG.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C69A45]" />
                <span>Andhra Pradesh, India</span>
              </p>

              <div className="pt-2">
                <a
                  href={openDirectWhatsApp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-serif font-bold text-xs shadow-md transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Discreet Admin Link */}
        <div className="mt-10 pt-6 border-t border-[#C69A45]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#F8E7CB]/60">
          <p>© {new Date().getFullYear()} {BUSINESS_CONFIG.name}. All rights reserved.</p>

          <p className="flex items-center gap-1">
            <span>Prepared with traditional devotion & love</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>by Lakshmipathi Raju</span>
          </p>

          {/* Discreet Admin Login */}
          <Link
            to="/admin/login"
            className="text-[#C69A45]/70 hover:text-[#C69A45] flex items-center gap-1 font-mono transition"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};
