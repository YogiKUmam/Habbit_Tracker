import React, { useState } from 'react';
import { 
  X, User, Sparkles, Award, Flame, CheckCircle2, 
  Share2, Save, Check, Star, Shield 
} from 'lucide-react';
import { HabitStats } from '../types/habit';
import { Badge } from '../types/badge';
import { UserProfile, calculateUserLevel, saveUserProfile } from '../lib/leaderboard';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  stats: HabitStats;
  badges: Badge[];
  onSaveProfile: (profile: UserProfile) => void;
  userEmail?: string | null;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  stats,
  badges,
  onSaveProfile,
  userEmail,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [bio, setBio] = useState(userProfile.bio);
  const [favoriteHabit, setFavoriteHabit] = useState(userProfile.favoriteHabit || 'Minum 2L Air Putih');
  const [savedToast, setSavedToast] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const userLevel = calculateUserLevel(stats, badges);
  const unlockedBadges = badges.filter((b) => b.unlocked);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      name: name.trim() || 'Habit Champion',
      bio: bio.trim(),
      favoriteHabit: favoriteHabit.trim(),
    };
    saveUserProfile(updated);
    onSaveProfile(updated);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleCopyProfileLink = () => {
    const url = `${window.location.origin}/#profile-${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[90vh] p-6 sm:p-8 bg-card border border-border rounded-3xl shadow-2xl overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                Profil & Tingkat Pengguna
              </h2>
              <p className="text-xs text-muted-foreground">
                {userEmail || 'Mode Lokal / Offline'}
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

        {/* Level & XP Progression Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-purple-950/30 to-slate-900 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-md">
                Lv {userLevel.level}
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">{userLevel.levelTitle}</h3>
                <span className="text-[11px] text-purple-300 font-mono">
                  {userLevel.currentXP} XP Terkumpul
                </span>
              </div>
            </div>

            <span className="text-xs font-bold text-emerald-400">
              {userLevel.progressPercent}% menuju Lv {userLevel.level + 1}
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full bg-secondary/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/10">
            <div
              className="bg-gradient-to-r from-purple-500 via-indigo-400 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${userLevel.progressPercent}%` }}
            />
          </div>

          <p className="text-[10px] text-muted-foreground text-right">
            Perlu {userLevel.nextLevelXP - userLevel.currentXP} XP lagi untuk naik level berikutnya
          </p>
        </div>

        {/* Edit Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              Nama Tampilan (Display Name)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              Bio / Motto Konsistensi
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Contoh: Fokus 1% lebih baik setiap hari..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-foreground">
              Kebiasaan Favorit Anda
            </label>
            <input
              type="text"
              value={favoriteHabit}
              onChange={(e) => setFavoriteHabit(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <Save className="h-4 w-4" />
              <span>Simpan Profil</span>
            </button>

            <button
              type="button"
              onClick={handleCopyProfileLink}
              className="py-3 px-4 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              {copiedLink ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-500">Tautan Disalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span>Salin Link Profil</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Showcase Badges Grid */}
        <div className="space-y-2.5 pt-2 border-t border-border">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Award className="h-4 w-4 text-amber-400" />
            <span>Koleksi Lencana ({unlockedBadges.length} Terbuka):</span>
          </h4>

          {unlockedBadges.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4 bg-secondary/20 rounded-2xl border border-border">
              Belum ada lencana yang terbuka. Terus bangun streak harian Anda!
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {unlockedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-2.5 rounded-xl bg-secondary/40 border border-border flex items-center gap-2"
                >
                  <span className="text-xl">{badge.icon}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-[11px] text-foreground truncate">{badge.title}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{badge.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toast Save Feedback */}
        {savedToast && (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center animate-bounce">
            ✓ Profil Berhasil Diperbarui!
          </div>
        )}
      </div>
    </div>
  );
};
