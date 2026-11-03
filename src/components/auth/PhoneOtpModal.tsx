
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DecorativeLotus } from '../common/DecorativeLotus';
import {
  User,
  Mail,
  Lock,
  MapPin,
  ArrowRight,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface PhoneOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PhoneOtpModal: React.FC<PhoneOtpModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { registerCustomer, loginCustomer } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ----------------------------------------------------
  // CLEAR ALL FORM DETAILS
  // ----------------------------------------------------

  const clearForm = () => {
    setMode('login');
    setFullName('');
    setEmail('');
    setPassword('');
    setAddress('');
    setError(null);
    setSuccessMessage(null);
    setIsLoading(false);
  };

  // Clear form whenever the modal closes.
  useEffect(() => {
    if (!isOpen) {
      clearForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ----------------------------------------------------
  // CUSTOMER LOGIN / REGISTRATION
  // ----------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccessMessage(null);

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    if (mode === 'register' && !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsLoading(true);

    try {
      let result;

      if (mode === 'register') {
        result = await registerCustomer(
          email,
          password,
          fullName,
          address
        );
      } else {
        result = await loginCustomer(email, password);
      }

      if (!result.success) {
        setError(
          result.error || 'Something went wrong. Please try again.'
        );
        return;
      }

      // Clear previous customer details after successful authentication.
      clearForm();

      // Close popup.
      onClose();

      // Continue pending action, such as opening the order form.
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error('Authentication error:', err);

      setError(
        err.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------
  // CLOSE MODAL
  // ----------------------------------------------------

  const resetModal = () => {
    clearForm();
    onClose();
  };

  // ----------------------------------------------------
  // SWITCH LOGIN / REGISTER
  // ----------------------------------------------------

  const switchMode = () => {
    setMode((prev) =>
      prev === 'login' ? 'register' : 'login'
    );

    setFullName('');
    setEmail('');
    setPassword('');
    setAddress('');
    setError(null);
    setSuccessMessage(null);
  };

  // ----------------------------------------------------
  // UI
  // ----------------------------------------------------

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">

      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-[#FFF3DD] border-2 border-[#C69A45] shadow-2xl p-6 sm:p-8 text-[#553322]">

        {/* Close Button */}

        <button
          onClick={resetModal}
          className="absolute top-4 right-4 p-2 text-[#7B211F] hover:bg-[#F8E7CB] rounded-full transition-colors"
          aria-label="Close modal"
          type="button"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}

        <div className="text-center mb-6">

          <div className="inline-flex p-3 rounded-full bg-[#7B211F]/10 border border-[#C69A45]/40 mb-3">
            <DecorativeLotus size={32} color="#7B211F" />
          </div>

          <h3 className="text-2xl font-serif font-bold text-[#7B211F]">
            {mode === 'login'
              ? 'Customer Login'
              : 'Create Your Account'}
          </h3>

          <p className="text-xs sm:text-sm text-[#553322]/80 mt-1">
            {mode === 'login'
              ? 'Login using your registered email and password.'
              : 'Register to order your favourite traditional Indian snacks.'}
          </p>

        </div>

        {/* Error Alert */}

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs sm:text-sm text-rose-900 flex items-start gap-2 animate-shake">

            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />

            <div className="flex-1">
              {error}
            </div>

          </div>
        )}

        {/* Success Alert */}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs sm:text-sm text-emerald-900 flex items-center gap-2">

            <CheckCircle className="w-4 h-4 text-emerald-600" />

            {successMessage}

          </div>
        )}

        {/* Login / Registration Form */}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name - Registration Only */}

          {mode === 'register' && (
            <div>

              <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
                Full Name *
              </label>

              <div className="relative">

                <User className="absolute left-3 top-3 w-4 h-4 text-[#C69A45]" />

                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#C69A45]/50 bg-white/90 text-[#553322] placeholder:text-[#553322]/40 focus:outline-none focus:ring-2 focus:ring-[#7B211F] text-sm"
                />

              </div>
            </div>
          )}

          {/* Email */}

          <div>

            <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
              Email Address *
            </label>

            <div className="relative">

              <Mail className="absolute left-3 top-3 w-4 h-4 text-[#C69A45]" />

              <input
                type="email"
                required
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#C69A45]/50 bg-white/90 text-[#553322] placeholder:text-[#553322]/40 focus:outline-none focus:ring-2 focus:ring-[#7B211F] text-sm"
              />

            </div>
          </div>

          {/* Password */}

          <div>

            <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
              Password *
            </label>

            <div className="relative">

              <Lock className="absolute left-3 top-3 w-4 h-4 text-[#C69A45]" />

              <input
                type="password"
                required
                minLength={6}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  mode === 'login'
                    ? 'current-password'
                    : 'new-password'
                }
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#C69A45]/50 bg-white/90 text-[#553322] placeholder:text-[#553322]/40 focus:outline-none focus:ring-2 focus:ring-[#7B211F] text-sm"
              />

            </div>

            <p className="text-[11px] text-[#553322]/70 mt-1">
              Minimum 6 characters.
            </p>

          </div>

          {/* Delivery Address - Registration Only */}

          {mode === 'register' && (
            <div>

              <label className="block text-xs font-semibold text-[#7B211F] mb-1 uppercase tracking-wider">
                Delivery Address (Optional)
              </label>

              <div className="relative">

                <MapPin className="absolute left-3 top-3 w-4 h-4 text-[#C69A45]" />

                <input
                  type="text"
                  placeholder="House No, Colony, City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="street-address"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#C69A45]/50 bg-white/90 text-[#553322] placeholder:text-[#553322]/40 focus:outline-none focus:ring-2 focus:ring-[#7B211F] text-sm"
                />

              </div>
            </div>
          )}

          {/* Submit Button */}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#7B211F] to-[#9B302A] text-[#FFF3DD] font-serif font-bold text-sm tracking-wide shadow-md hover:shadow-lg hover:from-[#5A1715] hover:to-[#7B211F] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >

            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />

                <span>
                  {mode === 'login'
                    ? 'Logging In...'
                    : 'Creating Account...'}
                </span>
              </>
            ) : (
              <>
                <span>
                  {mode === 'login'
                    ? 'Login'
                    : 'Create Account'}
                </span>

                <ArrowRight className="w-4 h-4" />
              </>
            )}

          </button>

        </form>

        {/* Switch Login / Register */}

        <div className="text-center mt-6 pt-4 border-t border-[#C69A45]/40">

          <p className="text-sm text-[#553322]">
            {mode === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}
          </p>

          <button
            type="button"
            onClick={switchMode}
            className="mt-1 text-sm font-bold text-[#7B211F] hover:underline"
          >
            {mode === 'login'
              ? 'Create a new account'
              : 'Login instead'}
          </button>

        </div>

      </div>
    </div>
  );
};
