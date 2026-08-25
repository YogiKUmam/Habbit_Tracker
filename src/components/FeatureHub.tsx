import React from 'react';
import { Bot, Trophy, Share2, Snowflake, Award, Sparkles } from 'lucide-react';

interface FeatureHubProps {
  onOpenAICoach: () => void;
  onOpenLeaderboard: () => void;
  onOpenShare: () => void;
  onOpenFreeze: () => void;
  onOpenBadges: () => void;
  freezeCount: number;
  unlockedBadgesCount: number;
  userRank?: number;
}

export const FeatureHub: React.FC<FeatureHubProps> = ({
  onOpenAICoach,
  onOpenLeaderboard,
  onOpenShare,
  onOpenFreeze,
  onOpenBadges,
  freezeCount,
  unlockedBadgesCount,
  userRank = 1,
}) => {
  const hubs = [
    {
      id: 'ai-coach',
      title: 'AI Coach',
      subtitle: 'Diagnosis & Tips',
      badge: 'Personal AI',
      badgeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      icon: <Bot className="h-5 w-5 text-purple-400" />,
      glowClass: 'hover:border-purple-500/50 hover:shadow-purple-500/10 from-purple-950/20 to-slate-900/40',
      onClick: onOpenAICoach,
    },
    {
      id: 'leaderboard',
      title: 'Peringkat',
      subtitle: 'Komunitas Global',
      badge: `Rank #${userRank}`,
      badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      icon: <Trophy className="h-5 w-5 text-amber-400" />,
      glowClass: 'hover:border-amber-500/50 hover:shadow-amber-500/10 from-amber-950/20 to-slate-900/40',
      onClick: onOpenLeaderboard,
    },
    {
      id: 'share',
      title: 'Bagikan',
      subtitle: 'Kartu Progres HD',
      badge: 'Story & Post',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      icon: <Share2 className="h-5 w-5 text-emerald-400" />,
      glowClass: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10 from-emerald-950/20 to-slate-900/40',
      onClick: onOpenShare,
    },
    {
      id: 'freeze',
      title: 'Streak Freeze',
      subtitle: 'Proteksi Rekor',
      badge: `${freezeCount} Es`,
      badgeClass: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      icon: <Snowflake className="h-5 w-5 text-cyan-400" />,
      glowClass: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10 from-cyan-950/20 to-slate-900/40',
      onClick: onOpenFreeze,
    },
    {
      id: 'badges',
      title: 'Lencana',
      subtitle: 'Pencapaian',
      badge: `${unlockedBadgesCount} Terbuka`,
      badgeClass: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      icon: <Award className="h-5 w-5 text-indigo-400" />,
      glowClass: 'hover:border-indigo-500/50 hover:shadow-indigo-500/10 from-indigo-950/20 to-slate-900/40',
      onClick: onOpenBadges,
    },
  ];

  return (
    <section aria-label="Pusat Fitur Unggulan" className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {hubs.map((hub) => (
          <button
            key={hub.id}
            type="button"
            onClick={hub.onClick}
            className={`group relative p-3.5 sm:p-4 rounded-2xl border border-border bg-gradient-to-b ${hub.glowClass} text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-xl bg-background/80 border border-border/80 shadow-xs transition-transform duration-300 group-hover:scale-110">
                {hub.icon}
              </div>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${hub.badgeClass}`}>
                {hub.badge}
              </span>
            </div>

            <div className="space-y-0.5">
              <h3 className="font-bold text-xs sm:text-sm text-foreground tracking-tight flex items-center gap-1 group-hover:text-primary transition-colors">
                <span>{hub.title}</span>
                <Sparkles className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
              </h3>
              <p className="text-[11px] text-muted-foreground line-clamp-1">
                {hub.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
