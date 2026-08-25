import React, { useState } from 'react';
import { X, Trophy, Flame, Zap, Crown, CheckCircle2, Layers, Sparkles, Lock } from 'lucide-react';
import { Badge } from '../types/badge';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Badge[];
}

export const BadgesModal: React.FC<BadgesModalProps> = ({ isOpen, onClose, badges }) => {
  const [filter, setFilter] = useState<'all' | 'streak' | 'completion' | 'creation'>('all');

  if (!isOpen) return null;

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const filteredBadges = filter === 'all' ? badges : badges.filter((b) => b.category === filter);

  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const props = { className: `h-6 w-6 ${unlocked ? 'text-amber-400' : 'text-muted-foreground'}` };
    switch (iconName) {
      case 'Flame': return <Flame {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'Crown': return <Crown {...props} />;
      case 'CheckCircle2': return <CheckCircle2 {...props} />;
      case 'Trophy': return <Trophy {...props} />;
      case 'Layers': return <Layers {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl p-6 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-sm">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">Lencana Pencapaian</h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  {unlockedCount}/{badges.length} Terbuka
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Tantang diri Anda untuk membuka seluruh pencapaian konsistensi
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

        {/* Filter Pills */}
        <div className="flex items-center gap-2 my-4">
          {[
            { key: 'all', label: 'Semua Lencana' },
            { key: 'streak', label: 'Streak 🔥' },
            { key: 'completion', label: 'Checklist 🎯' },
            { key: 'creation', label: 'Habit Builder ⚡' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key as any)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                filter === tab.key
                  ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                  : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden flex items-start gap-3.5 ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-amber-500/10 via-card to-card border-amber-500/30 shadow-sm'
                  : 'bg-secondary/30 border-border/70 opacity-75'
              }`}
            >
              <div
                className={`p-3 rounded-2xl flex-shrink-0 flex items-center justify-center ${
                  badge.unlocked
                    ? 'bg-amber-500/20 shadow-inner'
                    : 'bg-secondary text-muted-foreground border border-border'
                }`}
              >
                {badge.unlocked ? getBadgeIcon(badge.icon, true) : <Lock className="h-5 w-5 text-muted-foreground" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold truncate ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {badge.name}
                  </h4>
                  {badge.unlocked && (
                    <span className="text-[10px] uppercase font-bold text-amber-500 px-1.5 py-0.5 rounded bg-amber-500/10">
                      Unlocked
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {badge.description}
                </p>

                {/* Progress Bar for Locked / Progress tracker */}
                <div className="mt-2.5">
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                    <span>Progres</span>
                    <span className="font-semibold text-foreground">{badge.progressText}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        badge.unlocked ? 'bg-amber-500' : 'bg-muted-foreground/40'
                      }`}
                      style={{ width: `${badge.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
