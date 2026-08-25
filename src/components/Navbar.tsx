import React, { useState } from 'react';
import { 
  Activity, Plus, Moon, Sun, Flame, Trophy, Volume2, VolumeX, 
  Database, Bell, BellOff, Check, User, Cloud 
} from 'lucide-react';
import { formatDateToIndonesian, getTodayString } from '../lib/storage';
import { requestNotificationPermission, sendHabitReminder } from '../lib/notifications';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenAddModal: () => void;
  onOpenBadgesModal: () => void;
  onOpenBackupModal: () => void;
  onOpenAuthModal: () => void;
  userEmail?: string | null;
  isMuted: boolean;
  onToggleSound: () => void;
  streakCount: number;
  unlockedBadgesCount: number;
  pendingHabits: string[];
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenAddModal,
  onOpenBadgesModal,
  onOpenBackupModal,
  onOpenAuthModal,
  userEmail,
  isMuted,
  onToggleSound,
  streakCount,
  unlockedBadgesCount,
  pendingHabits,
}) => {
  const todayStr = getTodayString();
  const formattedDate = formatDateToIndonesian(todayStr);
  const [notificationEnabled, setNotificationEnabled] = useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const handleToggleNotification = async () => {
    const granted = await requestNotificationPermission();
    setNotificationEnabled(granted);
    if (granted) {
      sendHabitReminder(pendingHabits.length > 0 ? pendingHabits : ['Semua kebiasaan']);
      setShowNotificationToast(true);
      setTimeout(() => setShowNotificationToast(false), 3000);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                HabitFlow
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                PWA
              </span>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              {formattedDate}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Top Streak Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold">
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{streakCount} Hari Streak</span>
          </div>

          {/* Badges Button */}
          <button
            type="button"
            onClick={onOpenBadgesModal}
            aria-label="Buka Lencana Pencapaian"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Trophy className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Lencana</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-bold">
              {unlockedBadgesCount}
            </span>
          </button>

          {/* Notification Reminder Toggle */}
          <button
            type="button"
            onClick={handleToggleNotification}
            aria-label={notificationEnabled ? 'Pengingat Aktif' : 'Aktifkan Pengingat Browser'}
            title={notificationEnabled ? 'Pengingat aktif (Klik untuk tes)' : 'Aktifkan pengingat notifikasi'}
            className={`p-2.5 rounded-xl border transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring ${
              notificationEnabled
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500'
                : 'border-border bg-card hover:bg-secondary text-muted-foreground'
            }`}
          >
            {notificationEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={isMuted ? 'Aktifkan Suara' : 'Bisukan Suara'}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Volume2 className="h-4 w-4 text-primary" />
            )}
          </button>

          {/* Backup Data Button */}
          <button
            type="button"
            onClick={onOpenBackupModal}
            aria-label="Backup dan Impor Data"
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none hidden sm:block"
          >
            <Database className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>

          {/* User Auth / Cloud Sync Button */}
          <button
            type="button"
            onClick={onOpenAuthModal}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-ring ${
              userEmail
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                : 'border-border bg-card hover:bg-secondary text-foreground'
            }`}
          >
            {userEmail ? <Cloud className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline max-w-[90px] truncate">
              {userEmail ? userEmail.split('@')[0] : 'Masuk'}
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Ganti Tema"
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" />
            )}
          </button>

          {/* Add Habit CTA */}
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm shadow-md shadow-emerald-500/25 hover:opacity-90 active:scale-[0.98] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Tambah Kebiasaan</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>
      </div>

      {/* Notification Toast Alert */}
      {showNotificationToast && (
        <div className="fixed bottom-5 right-5 z-50 p-3 px-4 rounded-2xl bg-card border border-emerald-500/40 text-emerald-500 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="h-4 w-4" /> Pengingat Notifikasi Berhasil Diaktifkan!
        </div>
      )}
    </header>
  );
};
