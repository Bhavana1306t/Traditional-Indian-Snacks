import React from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { BUSINESS_CONFIG } from '../../lib/constants';
import {
  Settings,
  ShieldCheck,
  Smartphone,
  Database,
  Cloud,
  DollarSign,
  AlertTriangle,
  Key,
  ExternalLink,
  CheckCircle,
  Copy
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [copied, setCopied] = React.useState(false);

  const adminSqlGrant = `INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'Admin@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;`;

  const copySql = () => {
    navigator.clipboard.writeText(adminSqlGrant);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-[#C69A45]/30">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#7B211F]">
          System Settings, Security & Provider Setup
        </h1>
        <p className="text-xs sm:text-sm text-[#553322]/80 mt-1">
          Supabase database status, SMS OTP provider configuration, and budget guide
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="bg-[#FFF3DD] rounded-3xl border-2 border-[#C69A45]/40 p-6 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#C69A45]/20">
          <h3 className="font-serif font-bold text-base text-[#7B211F] flex items-center gap-2">
            <Database className="w-5 h-5 text-[#C69A45]" />
            <span>Supabase Database Connection Status</span>
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
              isSupabaseConfigured
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-600' : 'bg-amber-600'}`} />
            <span>{isSupabaseConfigured ? 'Connected to Live Supabase' : 'Running in Local Dev Sandbox'}</span>
          </span>
        </div>

        <p className="text-xs text-[#553322]/80 leading-relaxed">
          {isSupabaseConfigured ? (
            <>
              Your project is connected to your live Supabase project URL and anon public key defined in <code className="bg-[#F8E7CB] px-1.5 py-0.5 rounded font-mono">.env</code>. Customer registrations, SMS OTP verification, orders, and RLS policies execute in PostgreSQL.
            </>
          ) : (
            <>
              The application is currently running in zero-friction <strong>Local Development Sandbox Mode</strong> using local storage. To connect to your Supabase project, copy <code className="bg-[#F8E7CB] px-1.5 py-0.5 rounded font-mono">.env.example</code> to <code className="bg-[#F8E7CB] px-1.5 py-0.5 rounded font-mono">.env</code> and add your <code className="font-mono">VITE_SUPABASE_URL</code> and <code className="font-mono">VITE_SUPABASE_ANON_KEY</code>.
            </>
          )}
        </p>
      </div>

      {/* COST REQUIREMENT & FREE BUDGET CLARIFICATION */}
      <div className="bg-[#F8E7CB] rounded-3xl border-2 border-[#C69A45] p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-[#7B211F]">
          <DollarSign className="w-6 h-6 text-[#C69A45]" />
          <h3 className="text-xl font-serif font-bold">Important Cost & Free Budget Advisory</h3>
        </div>

        <div className="text-xs sm:text-sm text-[#553322]/90 space-y-3 leading-relaxed">
          <p>
            You requested to start with a <strong>free budget</strong> and avoid unnecessary paid subscriptions. Here is the exact, honest breakdown of all components:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Free Hosting */}
            <div className="bg-white/80 p-4 rounded-2xl border border-emerald-400">
              <span className="font-bold text-emerald-800 block text-sm">1. Frontend Web Hosting</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block my-1">
                100% Free Tier Available
              </span>
              <p className="text-xs text-[#553322]/80 mt-1">
                Host this Vite React app on <strong>Vercel, Netlify, or Cloudflare Pages</strong> at zero monthly cost within standard free allowances.
              </p>
            </div>

            {/* Supabase Free Tier */}
            <div className="bg-white/80 p-4 rounded-2xl border border-emerald-400">
              <span className="font-bold text-emerald-800 block text-sm">2. Supabase PostgreSQL</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block my-1">
                100% Free Tier Available
              </span>
              <p className="text-xs text-[#553322]/80 mt-1">
                Supabase offers 2 free active projects with 500MB PostgreSQL database, Auth, and 50,000 monthly active users at <strong>₹0 cost</strong>.
              </p>
            </div>

            {/* Real SMS OTP Cost Notice */}
            <div className="bg-white/80 p-4 rounded-2xl border border-amber-400">
              <span className="font-bold text-amber-900 block text-sm">3. Real SMS OTP Delivery</span>
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block my-1">
                Pay-Per-SMS Usage / Trial
              </span>
              <p className="text-xs text-[#553322]/80 mt-1">
                Telecom carriers charge for SMS delivery. <strong>No provider offers permanent free unlimited SMS</strong>. Twilio provides ~$15 initial free trial credits; in India, SMS gateways (e.g. Fast2SMS, MSG91) cost ~₹0.15 - ₹0.25 per SMS.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SMS Provider Setup Guide */}
      <div className="bg-[#FFF3DD] rounded-3xl border-2 border-[#C69A45]/40 p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-[#7B211F]">
          <Smartphone className="w-5 h-5 text-[#C69A45]" />
          <h3 className="text-lg font-serif font-bold">How to Configure Supabase SMS OTP Provider</h3>
        </div>

        <ol className="list-decimal pl-5 text-xs sm:text-sm text-[#553322]/85 space-y-2.5 leading-relaxed">
          <li>
            Go to your <strong>Supabase Dashboard</strong> at <a href="https://app.supabase.com" target="_blank" rel="noreferrer" className="text-[#7B211F] underline font-semibold">app.supabase.com</a>.
          </li>
          <li>
            Navigate to <strong>Authentication</strong> → <strong>Providers</strong> → <strong>Phone</strong>.
          </li>
          <li>
            Toggle <strong>Enable Phone Provider</strong> ON.
          </li>
          <li>
            Choose your SMS Provider:
            <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
              <li><strong>Twilio:</strong> Enter Account SID, Auth Token, and Twilio Message Service SID (includes free trial credits).</li>
              <li><strong>MessageBird / Vonage:</strong> Enter your API Key and sender ID.</li>
              <li><strong>Twilio Verify:</strong> Dedicated OTP verification with anti-fraud filtering.</li>
            </ul>
          </li>
          <li>
            Click <strong>Save</strong>. Supabase will now automatically deliver real 6-digit SMS OTPs to Indian mobile numbers upon request.
          </li>
        </ol>
      </div>

      {/* Admin Account Security & Role Assignment Guide */}
      <div className="bg-[#FFF3DD] rounded-3xl border-2 border-[#C69A45]/40 p-6 sm:p-8 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-[#7B211F]">
          <ShieldCheck className="w-5 h-5 text-[#C69A45]" />
          <h3 className="text-lg font-serif font-bold">Admin Account Setup & Role Grant</h3>
        </div>

        <p className="text-xs sm:text-sm text-[#553322]/85 leading-relaxed">
          To configure your live admin account securely in Supabase without hardcoding credentials in source code:
        </p>

        <ol className="list-decimal pl-5 text-xs sm:text-sm text-[#553322]/85 space-y-2.5 leading-relaxed">
          <li>
            In Supabase Dashboard, go to <strong>Authentication</strong> → <strong>Users</strong> → <strong>Add User</strong>.
          </li>
          <li>
            Enter Email: <code className="bg-[#F8E7CB] px-1.5 py-0.5 rounded font-mono font-bold text-[#7B211F]">Admin@gmail.com</code> and choose a strong private password.
          </li>
          <li>
            Open <strong>SQL Editor</strong> in Supabase and run this script to assign the admin role in the <code className="font-mono">user_roles</code> table:
          </li>
        </ol>

        <div className="relative bg-[#3D0D0B] text-[#FFF3DD] p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-[#C69A45]/40">
          <pre>{adminSqlGrant}</pre>
          <button
            onClick={copySql}
            className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-[#C69A45] text-[#3D0D0B] font-sans font-bold text-xs hover:bg-[#FFE082] transition flex items-center gap-1"
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
