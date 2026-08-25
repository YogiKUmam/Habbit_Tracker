import React from 'react';
import { 
  Activity, Plus, Flame, Settings, Sparkles, User 
} from 'lucide-react';
import { formatDateToIndonesian, getTodayString } from '../lib/storage';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenProfileModal: () => void;
  onOpenSettingsModal: () => void;
  streakCount: number;
  userLevel: number;
  userEmail?: string | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenProfileModal,
  onOpenSettingsModal,
  streakCount,
  userLevel,
  userEmail,
}) => {
  const todayStr = getTodayString();
  const formattedDate = formatDateToIndonesian(todayStr);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={onOpenProfileModal}>
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white transition-transform duration-300 group-hover:scale-105">
              <Activity className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                HabitFlow
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block font-medium">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Right: Consolidated Clean Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Profile / Streak & Level Pill */}
          <button
            type="button"
            onClick={onOpenProfileModal}
            aria-label="Lihat Profil & Level"
            title="Klik untuk membuka profil dan pencapaian"
            className="flex items-center gap-2 px-3 py-1.5 rounded-2xl border border-border bg-secondary/50 hover:bg-secondary text-foreground text-xs font-bold transition-all hover:scale-102 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <div className="flex items-center gap-1 text-amber-500">
              <Flame className="h-4 w-4 fill-amber-500 animate-pulse" />
              <span>{streakCount}d</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <div className="flex items-center gap-1 text-indigo-400">
              <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-black">
                Lv {userLevel}
              </span>
            </div>
          </button>

          {/* Settings Modal Button */}
          <button
            type="button"
            onClick={onOpenSettingsModal}
            aria-label="Buka Pengaturan"
            title="Pengaturan Tema, Suara, Notifikasi, Akun & Backup"
            className="p-2.5 rounded-2xl border border-border bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Primary CTA: + Tambah Kebiasaan */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 hover:opacity-95 hover:shadow-emerald-500/30 active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span className="hidden sm:inline">Tambah Kebiasaan</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>
      </div>
    </header>
  );
};
