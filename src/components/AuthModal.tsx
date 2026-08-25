import React, { useState } from 'react';
import { X, Cloud, Mail, Check, AlertCircle, Copy, ExternalLink, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string | null;
  onSignOut: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  onSignOut,
}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const isConfigured = isSupabaseConfigured();

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    if (!supabase) return;
    try {
      setLoading(true);
      setError(null);
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (authError) throw authError;
    } catch (err: any) {
      setError(err.message || `Gagal masuk dengan ${provider}`);
      setLoading(false);
    }
  };

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !email) return;

    try {
      setLoading(true);
      setError(null);
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (authError) throw authError;
      setMessage('Tautan login telah dikirim ke email Anda! Silakan periksa kotak masuk.');
    } catch (err: any) {
      setError(err.message || 'Gagal mengirim tautan email.');
    } finally {
      setLoading(false);
    }
  };

  const copySqlSchema = () => {
    const sql = `-- Supabase Schema
create table if not exists public.habits (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  title text not null,
  description text,
  category text not null default 'Health',
  color text not null default 'emerald',
  icon text not null default 'Droplets',
  target_days_per_week int not null default 7,
  archived boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null default auth.uid(),
  habit_id text not null,
  date text not null,
  completed boolean not null default true,
  note text,
  timestamp timestamptz not null default now()
);

alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;

create policy "Users can manage their own habits" on public.habits for all using (auth.uid() = user_id);
create policy "Users can manage their own habit logs" on public.habit_logs for all using (auth.uid() = user_id);`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md p-6 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-inner">
              <Cloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {userEmail ? 'Akun Supabase Cloud' : 'Masuk / Cloud Sync'}
              </h2>
              <p className="text-xs text-muted-foreground">
                {userEmail ? 'Data Anda tersinkronisasi otomatis' : 'Simpan dan sinkronkan data kebiasaan Anda'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* State 1: User Already Logged In */}
        {userEmail ? (
          <div className="py-6 space-y-4 text-center">
            <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
              <Check className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Sedang Masuk</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{userEmail}</p>
            </div>
            <div className="p-3 rounded-2xl bg-secondary/40 text-xs text-muted-foreground border border-border">
              🔄 Sinkronisasi cloud aktif. Setiap perubahan data otomatis disimpan ke database PostgreSQL Supabase Anda.
            </div>
            <button
              type="button"
              onClick={() => {
                onSignOut();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs font-bold transition-all"
            >
              Keluar dari Akun (Logout)
            </button>
          </div>
        ) : !isConfigured ? (
          /* State 2: Supabase Credentials Not Configured yet */
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>Supabase Belum Dikonfigurasi</span>
              </div>
              <p className="leading-relaxed text-muted-foreground">
                Aplikasi saat ini berjalan dalam <strong>Mode Tamu (LocalStorage Offline)</strong>. Untuk mengaktifkan sinkronisasi cloud:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground text-[11px]">
                <li>Buka <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline text-amber-500">supabase.com</a> dan buat project baru.</li>
                <li>Jalankan script SQL tabel di SQL Editor Supabase.</li>
                <li>Salin <strong>Project URL</strong> & <strong>Anon Key</strong> ke file <code>.env</code> atau Settings Vercel.</li>
              </ol>
            </div>

            <button
              type="button"
              onClick={copySqlSchema}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-bold transition-all"
            >
              {copiedSql ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              <span>{copiedSql ? 'Script SQL Berhasil Disalin!' : 'Salin Script SQL Schema (1-Click)'}</span>
            </button>

            <a
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-90 transition-all"
            >
              <ExternalLink className="h-4 w-4" /> Buka Supabase Dashboard
            </a>
          </div>
        ) : (
          /* State 3: Supabase Configured, Ready to Login */
          <div className="mt-4 space-y-4">
            {message && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2">
                <Check className="h-4 w-4" /> {message}
              </div>
            )}
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> {error}
              </div>
            )}

            {/* Social OAuth Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleOAuthLogin('google')}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-foreground text-xs font-bold flex items-center justify-center gap-2.5 transition-all focus-visible:ring-2 focus-visible:ring-primary"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Masuk dengan Google
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin('github')}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl border border-border bg-secondary/50 hover:bg-secondary text-foreground text-xs font-bold flex items-center justify-center gap-2.5 transition-all focus-visible:ring-2 focus-visible:ring-primary"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Masuk dengan GitHub
              </button>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground text-[10px] font-semibold">Atau via Email</span>
              </div>
            </div>

            {/* Magic Link Form */}
            <form onSubmit={handleMagicLinkLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Email Anda
                </label>
                <div className="relative">
                  <Mail className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-input bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? 'Mengirim tautan...' : 'Kirim Tautan Magic Link'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
