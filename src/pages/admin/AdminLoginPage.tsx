import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { BUSINESS_CONFIG } from '../../lib/constants';
import { DecorativeLotus } from '../../components/common/DecorativeLotus';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, RefreshCw, KeyRound, ArrowLeft } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('Admin@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    (location.state as any)?.unauthorized ? 'Access Denied: Please sign in with an authorized Administrator account.' : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (email.trim().toLowerCase() !== 'admin@gmail.com') {
      setError('Unauthorized: Only Admin@gmail.com is authorized to access the Admin Portal.');
      return;
    }

    if (!password) {
      setError('Please enter the administrator password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginAdmin(email.trim(), password);
      if (!res.success) {
        setError(res.error || 'Authentication failed. Please verify credentials.');
        return;
      }

      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#3D0D0B] text-[#FFF3DD] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#C69A45_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Back to Store link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-serif text-[#C69A45] hover:text-[#FFF3DD] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Store</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Icon */}
        <div className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-[#7B211F] border-2 border-[#C69A45] shadow-xl mb-3">
            <DecorativeLotus size={36} color="#FFE082" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-wider text-[#FFF3DD]">
            Admin Security Portal
          </h2>
          <p className="text-xs sm:text-sm text-[#F8E7CB]/80 mt-1 font-serif tracking-widest uppercase">
            {BUSINESS_CONFIG.name}
          </p>
        </div>

        {/* Login Box */}
        <div className="mt-8 bg-[#5A1715] py-8 px-6 shadow-2xl rounded-3xl sm:px-10 border-2 border-[#C69A45]/60">
          {/* Mode Indicator Banner */}
          {!isSupabaseConfigured && (
            <div className="mb-6 p-3 bg-amber-950/80 border border-[#C69A45]/50 rounded-xl text-xs text-[#F8E7CB]">
              <p className="font-bold text-[#FFE082] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                Local Sandbox Development Mode
              </p>
              <p className="text-[11px] text-[#F8E7CB]/80 mt-0.5">
                Supabase credentials not yet entered in <code className="bg-black/30 px-1 rounded">.env</code>. You can log in with <strong className="text-[#FFF3DD]">Admin@gmail.com</strong> and any test password to test the admin features.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-3.5 bg-rose-950/90 border border-rose-500/60 rounded-xl text-xs text-rose-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-[#F8E7CB] uppercase tracking-wider mb-1">
                Authorized Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-[#C69A45]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#C69A45]/50 bg-[#3D0D0B] text-[#FFF3DD] placeholder:text-[#F8E7CB]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#C69A45]"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-[#F8E7CB] uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-[#C69A45]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#C69A45]/50 bg-[#3D0D0B] text-[#FFF3DD] placeholder:text-[#F8E7CB]/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#C69A45]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-[#C69A45] hover:text-[#FFF3DD]"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FFE082] via-[#C69A45] to-[#B88728] text-[#3D0D0B] font-serif font-bold text-sm uppercase tracking-wider shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#3D0D0B]" />
                  <span>Verifying Permissions...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#3D0D0B]" />
                  <span>Secure Admin Sign In</span>
                  <ArrowRight className="w-4 h-4 text-[#3D0D0B]" />
                </>
              )}
            </button>
          </form>

          {/* Security notice footer */}
          <div className="mt-6 pt-4 border-t border-[#C69A45]/30 text-[11px] text-[#F8E7CB]/70 text-center">
            <p>Protected by PostgreSQL Row Level Security (RLS).</p>
            <p className="mt-0.5">Admin roles are assigned strictly in the database.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

