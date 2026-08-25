import React from 'react';
import { 
  Activity, Plus, Flame, Settings, User, Moon, Sun 
} from 'lucide-react';
import { formatDateToIndonesian, getTodayString } from '../lib/storage';
import { UserLevelInfo } from '../lib/leaderboard';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenProfileModal: () => void;
  onOpenSettingsModal: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  streakCount: number;
  userLevel: UserLevelInfo;
  userName: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenProfileModal,
  onOpenSettingsModal,
  theme,
  onToggleTheme,
  streakCount,
  userLevel,
  userName,
}) => {
  const todayStr = getTodayString();
  const formattedDate = formatDateToIndonesian(todayStr);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/85 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
          <div 
            onClick={onOpenProfileModal}
            className="relative group cursor-pointer"
            title="Klik untuk membuka profil"
          >
            <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 flex items-center justify-center shadow-md shadow-emerald-500/20 text-white transition-transform duration-300 group-hover:scale-105">
              <Activity className="h-5 w-5 stroke-[2.5]" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                HabitFlow
              </span>
              <span className="text-[10px] uppercase font-black tracking-widest px-1.5 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground hidden sm:block font-medium">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Center: Gamified XP & Level Progress Bar (Concept C + B Hybrid) */}
        <div 
          onClick={onOpenProfileModal}
          className="hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl border border-border/80 bg-secondary/40 hover:bg-secondary/70 transition-all cursor-pointer group flex-1 max-w-md"
          title="Klik untuk melihat detail level & lencana"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-black shadow-xs group-hover:scale-105 transition-transform flex-shrink-0">
            {userName ? userName.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-foreground truncate max-w-[120px]">
                {userName || 'Habit Champion'}
              </span>
              <span className="font-bold text-indigo-500 dark:text-indigo-400">
                Lv {userLevel.level} • <span className="font-mono text-muted-foreground">{userLevel.currentXP}/{userLevel.nextLevelXP} XP</span>
              </span>
            </div>

            {/* Smooth Animated Progress Bar */}
            <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden border border-border/30">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-xs"
                style={{ width: `${userLevel.progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          
          {/* Streak Flame Pill with Level */}
          <div 
            onClick={onOpenProfileModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl border border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-500 text-xs font-bold shadow-xs cursor-pointer hover:bg-amber-500/15 transition-all"
            title="Streak Konsistensi Harian & Level"
          >
            <Flame className="h-4 w-4 fill-amber-500 animate-pulse" />
            <span>{streakCount}d</span>
            <span className="md:hidden text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-500 font-black">
              Lv {userLevel.level}
            </span>
          </div>

          {/* Quick Theme Toggle (1-Click Switch: Dark / Warm Linen) */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Ganti ke Tema Terang Teduh' : 'Ganti ke Tema Gelap'}
            title={theme === 'dark' ? 'Ganti ke Tema Terang Teduh (Warm Linen)' : 'Ganti ke Tema Gelap (Dark Obsidian)'}
            className="p-2 sm:p-2.5 rounded-2xl border border-border/80 bg-secondary/50 hover:bg-secondary text-foreground transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-500" />
            )}
          </button>

          {/* Settings Modal Button */}
          <button
            type="button"
            onClick={onOpenSettingsModal}
            aria-label="Buka Pengaturan"
            title="Pengaturan Tema, Suara, Notifikasi, Akun & Backup"
            className="p-2 sm:p-2.5 rounded-2xl border border-border/80 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Primary CTA: + Tambah Kebiasaan */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 hover:opacity-95 hover:shadow-emerald-500/30 active:scale-95 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
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
