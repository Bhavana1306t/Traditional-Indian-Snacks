import React, { useState } from 'react';
import { BUSINESS_CONFIG } from '../lib/constants';
import { TraditionalDivider } from '../components/common/TraditionalDivider';
import { DecorativeLotus } from '../components/common/DecorativeLotus';
import { openWhatsAppChat, openDirectWhatsApp } from '../lib/whatsapp';
import { Phone, MessageCircle, MapPin, Clock, Mail, Send, Award } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = `*INQUIRY - TRADITIONAL INDIAN SNACKS* 🪔
===============================
*Name:* ${name || 'Customer'}
*Phone:* ${phone || 'Not provided'}
*Inquiry / Message:*
${message}
===============================
Lakshmipathi Raju - Taste • Tradition • Together`;
    const url = openWhatsAppChat(formatted);
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-[#FFF3DD] text-[#553322]">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F8E7CB] border border-[#C69A45]/40 text-xs font-serif font-bold text-[#7B211F]">
          <DecorativeLotus size={16} color="#7B211F" />
          <span>Get in Touch Directly</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-[#7B211F]">
          Contact Traditional Indian Snacks
        </h1>
        <p className="text-sm sm:text-base text-[#553322]/80 leading-relaxed font-sans">
          Connect directly with Lakshmipathi Raju for custom orders, festive bulk bookings, and traditional Andhra Poornalu inquiries.
        </p>
      </div>

      <TraditionalDivider />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Contact Info Cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Owner Profile Card */}
          <div className="bg-[#7B211F] text-[#FFF3DD] p-6 sm:p-8 rounded-3xl border-2 border-[#C69A45] shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#5A1715] border border-[#C69A45]/50">
                <DecorativeLotus size={28} color="#C69A45" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#FFF3DD]">
                  {BUSINESS_CONFIG.owner}
                </h3>
                <span className="text-xs text-[#C69A45] uppercase tracking-wider font-semibold">
                  Founder & Master Sweets Chef
                </span>
              </div>
            </div>

            <p className="text-xs text-[#F8E7CB]/90 leading-relaxed">
              "We consider it our personal honor to serve your family and celebrations with authentic, unadulterated Andhra Poornam Boorelu."
            </p>

            <div className="pt-2 border-t border-[#C69A45]/30 space-y-3 text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C69A45] flex-shrink-0" />
                <div>
                  <span className="text-[11px] text-[#F8E7CB]/70 block">Primary Business Phone:</span>
                  <a href={`tel:${BUSINESS_CONFIG.phone}`} className="font-bold text-[#FFF3DD] hover:underline">
                    {BUSINESS_CONFIG.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-[#25D366] flex-shrink-0" />
                <div>
                  <span className="text-[11px] text-[#F8E7CB]/70 block">WhatsApp Number:</span>
                  <a href={openDirectWhatsApp()} target="_blank" rel="noopener noreferrer" className="font-bold text-[#25D366] hover:underline">
                    {BUSINESS_CONFIG.whatsappNumber}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#C69A45] flex-shrink-0" />
                <div>
                  <span className="text-[11px] text-[#F8E7CB]/70 block">Preparation & Dispatch Hours:</span>
                  <span className="text-[#FFF3DD]">{BUSINESS_CONFIG.operatingHours}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#C69A45] flex-shrink-0" />
                <div>
                  <span className="text-[11px] text-[#F8E7CB]/70 block">Kitchen Location:</span>
                  <span className="text-[#FFF3DD]">Andhra Pradesh, India</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Inquiry Form (Directly opens WhatsApp) */}
        <div className="lg:col-span-7 bg-[#F8E7CB]/80 p-6 sm:p-8 rounded-3xl border-2 border-[#C69A45]/50 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#7B211F] mb-1">
            Send an Inquiry to Lakshmipathi Raju
          </h3>
          <p className="text-xs text-[#553322]/80 mb-6">
            Fill in your details to immediately begin a WhatsApp chat with the owner.
          </p>

          <form onSubmit={handleSendInquiry} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
                Your Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sitaram Raju"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#C69A45]/50 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B211F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
                Your Contact Number
              </label>
              <input
                type="tel"
                required
                placeholder="+91 9948016716"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#C69A45]/50 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B211F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
                Message / Order Query
              </label>
              <textarea
                required
                rows={4}
                placeholder="Tell us about your upcoming occasion, required quantity of Poornalu, or questions regarding pricing..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#C69A45]/50 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B211F]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-serif font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Message to WhatsApp (+91 9948016716)</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

