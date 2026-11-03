import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, MapPin, CheckCircle, AlertCircle, Save, ShieldCheck } from 'lucide-react';

export const ProfileEditor: React.FC = () => {
  const { profile, updateUserProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [address, setAddress] = useState(profile?.address || '');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!fullName.trim()) {
      setError('Full name cannot be blank.');
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile({
        full_name: fullName.trim(),
        address: address.trim(),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#FFF3DD] rounded-3xl border-2 border-[#C69A45]/40 p-6 md:p-8 shadow-lg text-[#553322]">
      <div className="flex items-center justify-between pb-4 border-b border-[#C69A45]/30 mb-6">
        <div>
          <h3 className="text-xl font-serif font-bold text-[#7B211F]">Customer Profile</h3>
          <p className="text-xs text-[#553322]/70">Manage your verified credentials and delivery address.</p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Phone Verified</span>
        </div>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs sm:text-sm text-emerald-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs sm:text-sm text-rose-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 w-4 h-4 text-[#C69A45]" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#C69A45]/50 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B211F]"
            />
          </div>
        </div>

        {/* Verified Mobile Number (Read-only for security) */}
        <div>
          <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
            Verified Mobile Number (Primary OTP Account)
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-emerald-600" />
            <input
              type="text"
              disabled
              value={profile?.phone || ''}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-300 bg-gray-100 text-gray-700 text-sm font-medium cursor-not-allowed"
            />
          </div>
          <p className="text-[11px] text-[#553322]/60 mt-0.5">
            Phone number is secured by Supabase Phone OTP and cannot be modified directly.
          </p>
        </div>

        {/* Default Delivery Address */}
        <div>
          <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
            Default Delivery Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#C69A45]" />
            <textarea
              rows={3}
              placeholder="Enter your house number, colony, landmark and city..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#C69A45]/50 bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-[#7B211F]"
            />
          </div>
        </div>

        {/* Registration Date Info */}
        <div className="text-[11px] text-[#553322]/70 pt-1">
          Registered on: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="py-2.5 px-6 rounded-xl bg-[#7B211F] hover:bg-[#5A1715] text-[#FFF3DD] font-serif font-bold text-xs tracking-wider uppercase shadow-md disabled:opacity-50 transition flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
        </button>
      </form>
    </div>
  );
};

