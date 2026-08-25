import React, { useState } from 'react';
import { 
  X, Settings, Moon, Sun, Volume2, VolumeX, Bell, BellOff, 
  Database, User, Cloud, LogOut, Check, Sparkles 
} from 'lucide-react';
import { requestNotificationPermission, sendHabitReminder } from '../lib/notifications';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
  onOpenBackupModal: () => void;
  onOpenAuthModal: () => void;
  userEmail?: string | null;
  onSignOut: () => void;
  pendingHabits: string[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  theme,
  onToggleTheme,
  isMuted,
  onToggleSound,
  onOpenBackupModal,
  onOpenAuthModal,
  userEmail,
  onSignOut,
  pendingHabits,
}) => {
  const [notificationEnabled, setNotificationEnabled] = useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggleNotification = async () => {
    const granted = await requestNotificationPermission();
    setNotificationEnabled(granted);
    if (granted) {
      sendHabitReminder(pendingHabits.length > 0 ? pendingHabits : ['Semua kebiasaan']);
      setToastMsg('Pengingat Notifikasi Berhasil Diaktifkan! 🔔');
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 sm:p-7 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-secondary text-foreground border border-border">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Pengaturan & Preferensi</h2>
              <p className="text-xs text-muted-foreground">Kustomisasi sistem dan akun aplikasi</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup pengaturan"
            className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Settings List */}
        <div className="space-y-3">
          
          {/* 1. Theme Setting */}
          <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-background border border-border text-foreground">
                {theme === 'dark' ? <Moon className="h-4 w-4 text-amber-400" /> : <Sun className="h-4 w-4 text-amber-500" />}
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Tampilan Tema</p>
                <p className="text-[11px] text-muted-foreground">
                  Mode {theme === 'dark' ? 'Gelap (Dark Obsidian)' : 'Terang (Light Clean)'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleTheme}
              className="px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-bold transition-all"
            >
              Ganti ke {theme === 'dark' ? 'Terang' : 'Gelap'}
            </button>
          </div>

          {/* 2. Sound Effects Setting */}
          <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-background border border-border text-foreground">
                {isMuted ? <VolumeX className="h-4 w-4 text-muted-foreground" /> : <Volume2 className="h-4 w-4 text-emerald-500" />}
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Efek Suara Zen</p>
                <p className="text-[11px] text-muted-foreground">
                  {isMuted ? 'Suara dinonaktifkan (Mute)' : 'Harmoni 432Hz Zen Bell Aktif'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleSound}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                !isMuted 
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' 
                  : 'border-border bg-card text-muted-foreground'
              }`}
            >
              {!isMuted ? 'Aktif 🔊' : 'Mute 🔇'}
            </button>
          </div>

          {/* 3. Browser Notification Setting */}
          <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-background border border-border text-foreground">
                {notificationEnabled ? <Bell className="h-4 w-4 text-emerald-500" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Pengingat Notifikasi</p>
                <p className="text-[11px] text-muted-foreground">
                  {notificationEnabled ? 'Pengingat harian aktif' : 'Izin notifikasi belum aktif'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleNotification}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                notificationEnabled 
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' 
                  : 'border-border bg-card text-foreground'
              }`}
            >
              {notificationEnabled ? 'Aktif 🔔' : 'Aktifkan'}
            </button>
          </div>

          {/* 4. Supabase Cloud Sync / Auth */}
          <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-background border border-border text-foreground">
                {userEmail ? <Cloud className="h-4 w-4 text-emerald-500" /> : <User className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Akun Cloud Sync</p>
                <p className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                  {userEmail || 'Tersimpan lokal (Offline)'}
                </p>
              </div>
            </div>

            {userEmail ? (
              <button
                type="button"
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-bold transition-all flex items-center gap-1"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Keluar</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuthModal();
                }}
                className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all shadow-xs"
              >
                Masuk
              </button>
            )}
          </div>

          {/* 5. Backup Data */}
          <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-background border border-border text-foreground">
                <Database className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Backup & Cadangkan Data</p>
                <p className="text-[11px] text-muted-foreground">Ekspor atau impor data JSON</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenBackupModal();
              }}
              className="px-3.5 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground text-xs font-bold transition-all"
            >
              Buka Backup
            </button>
          </div>

        </div>

        {/* Toast Feedback */}
        {toastMsg && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center animate-bounce flex items-center justify-center gap-2">
            <Check className="h-4 w-4" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs transition-all"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
