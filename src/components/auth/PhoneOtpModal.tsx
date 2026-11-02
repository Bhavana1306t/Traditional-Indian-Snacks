import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { DecorativeLotus } from '../common/DecorativeLotus';
import { Phone, User, MapPin, KeyRound, ArrowRight, RefreshCw, X, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface PhoneOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PhoneOtpModal: React.FC<PhoneOtpModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { sendPhoneOtp, verifyPhoneOtp } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('+91 ');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [otp, setOtp] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: any = null;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setDevCode(null);

    const clean = phone.replace(/\s+/g, '');
    if (clean.length < 10) {
      setError('Please enter a valid mobile number with country code (e.g. +91 9948016716)');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendPhoneOtp(clean);
      setInfoMessage(res.message);
      if (res.testOtp) {
        setDevCode(res.testOtp);
      }
      setStep('otp');
      setCooldown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please check the phone number and SMS configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp || otp.trim().length < 6) {
      setError('Please enter the 6-digit OTP code received on your phone.');
      return;
    }

    setIsLoading(true);
    try {
      const clean = phone.replace(/\s+/g, '');
      const res = await verifyPhoneOtp(clean, otp.trim(), fullName, address);
      if (!res.success) {
        setError(res.error || 'Failed to verify OTP.');
        return;
      }

      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setStep('phone');
    setOtp('');
    setError(null);
    setInfoMessage(null);
    setDevCode(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FFF3DD] border-2 border-[#C69A45] shadow-2xl p-6 sm:p-8 text-[#553322]">
        {/* Close Button */}
        <button
          onClick={resetModal}
          className="absolute top-4 right-4 p-2 text-[#7B211F] hover:bg-[#F8E7CB] rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-[#7B211F]/10 border border-[#C69A45]/40 mb-3">
            <DecorativeLotus size={32} color="#7B211F" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-[#7B211F]">
            {step === 'phone' ? 'Customer Login / Register' : 'Verify Mobile OTP'}
          </h3>
          <p className="text-xs sm:text-sm text-[#553322]/80 mt-1">
            {step === 'phone'
              ? 'Enter your mobile number to receive a secure SMS OTP.'
              : `We sent a 6-digit verification code to ${phone}.`}
          </p>
        </div>

        {/* Environment / SMS Status Banner */}
        {!isSupabaseConfigured && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Local Sandbox Development Mode</p>
              <p className="text-[11px] text-amber-800">
                Supabase credentials not configured in <code className="bg-amber-100 px-1 rounded">.env</code>. Test verification code will be generated automatically for testing.
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs sm:text-sm text-rose-900 flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Info / Dev Code Alert */}
        {devCode && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs sm:text-sm text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Dev Mode Test OTP: <strong className="text-emerald-800 font-mono text-base tracking-widest">{devCode}</strong></span>
            </div>
            <button
              type="button"
              onClick={() => setOtp(devCode)}
              className="text-xs bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-700 font-medium"
            >
              Autofill
            </button>
          </div>
        )}

        {/* STEP 1: Phone & Details Input */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
                Full Name (for new customer)
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-[#C69A45]" />
                <input
                  type="text"
                  placeholder="e.g. Ramesh Varma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#C69A45]/50 bg-white/90 text-[#553322] placeholder:text-[#553322]/40 focus:outline-none focus:ring-2 focus:ring-[#7B211F] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
                Mobile Number (with country code) *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-[#C69A45]" />
                <input
                  type="tel"
                  required
                  placeholder="+91 9948016716"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#C69A45]/50 bg-white/90 text-[#553322] placeholder:text-[#553322]/40 focus:outline-none focus:ring-2 focus:ring-[#7B211F] text-sm font-medium"
                />
              </div>
              <p className="text-[11px] text-[#553322]/70 mt-1">
                Enter your 10-digit number with +91 country prefix.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
                Delivery Address (Optional during signup)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#C69A45]" />
                <input
                  type="text"
                  placeholder="Flat/House No, Colony, City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#C69A45]/50 bg-white/90 text-[#553322] placeholder:text-[#553322]/40 focus:outline-none focus:ring-2 focus:ring-[#7B211F] text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#7B211F] to-[#9B302A] text-[#FFF3DD] font-serif font-bold text-sm tracking-wide shadow-md hover:shadow-lg hover:from-[#5A1715] hover:to-[#7B211F] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Sending Real SMS OTP...</span>
                </>
              ) : (
                <>
                  <span>Send SMS OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Enter & Verify OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider text-center">
                Enter 6-Digit SMS OTP Code
              </label>
              <div className="relative max-w-[240px] mx-auto">
                <KeyRound className="absolute left-3 top-3.5 w-4 h-4 text-[#C69A45]" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  autoFocus
                  placeholder="------"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-9 pr-3 py-3 text-center tracking-[0.5em] text-xl font-bold font-mono rounded-xl border-2 border-[#C69A45] bg-white text-[#7B211F] focus:outline-none focus:ring-2 focus:ring-[#7B211F]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#7B211F] to-[#9B302A] text-[#FFF3DD] font-serif font-bold text-sm tracking-wide shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Code...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify OTP & Proceed</span>
                </>
              )}
            </button>

            {/* Resend OTP & Change Number */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-[#7B211F] hover:underline font-medium"
              >
                ← Change Number
              </button>

              <button
                type="button"
                disabled={cooldown > 0 || isLoading}
                onClick={() => handleSendOtp()}
                className="text-[#C69A45] hover:text-[#7B211F] disabled:text-gray-400 font-semibold"
              >
                {cooldown > 0 ? `Resend OTP in ${cooldown}s` : 'Resend SMS OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
