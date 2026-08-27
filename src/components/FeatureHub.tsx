import React from 'react';
import { Bot, Trophy, Share2, Snowflake, Award } from 'lucide-react';

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
      mobileLabel: 'AI Coach',
      subtitle: 'Diagnosis & Tips',
      badge: 'AI',
      desktopBadge: 'Personal AI',
      badgeClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      iconBoxClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/15',
      glowClass: 'hover:border-purple-500/30 hover:shadow-[0_8px_24px_rgba(168,85,247,0.12)]',
      icon: <Bot className="h-4 w-4 sm:h-5 sm:w-5" />,
      onClick: onOpenAICoach,
    },
    {
      id: 'leaderboard',
      title: 'Peringkat',
      mobileLabel: 'Peringkat',
      subtitle: 'Komunitas Global',
      badge: `#${userRank}`,
      desktopBadge: `Rank #${userRank}`,
      badgeClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      iconBoxClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/15',
      glowClass: 'hover:border-amber-500/30 hover:shadow-[0_8px_24px_rgba(245,158,11,0.12)]',
      icon: <Trophy className="h-4 w-4 sm:h-5 sm:w-5" />,
      onClick: onOpenLeaderboard,
    },
    {
      id: 'share',
      title: 'Bagikan',
      mobileLabel: 'Bagikan',
      subtitle: 'Kartu Progres HD',
      badge: 'HD',
      desktopBadge: 'Story & Post',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      iconBoxClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/15',
      glowClass: 'hover:border-emerald-500/30 hover:shadow-[0_8px_24px_rgba(34,197,94,0.12)]',
      icon: <Share2 className="h-4 w-4 sm:h-5 sm:w-5" />,
      onClick: onOpenShare,
    },
    {
      id: 'freeze',
      title: 'Streak Freeze',
      mobileLabel: 'Freeze',
      subtitle: 'Proteksi Rekor',
      badge: `${freezeCount}`,
      desktopBadge: `${freezeCount} Es`,
      badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      iconBoxClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/15',
      glowClass: 'hover:border-cyan-500/30 hover:shadow-[0_8px_24px_rgba(6,182,212,0.12)]',
      icon: <Snowflake className="h-4 w-4 sm:h-5 sm:w-5" />,
      onClick: onOpenFreeze,
    },
    {
      id: 'badges',
      title: 'Lencana',
      mobileLabel: 'Lencana',
      subtitle: 'Pencapaian',
      badge: `${unlockedBadgesCount}`,
      desktopBadge: `${unlockedBadgesCount} Terbuka`,
      badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      iconBoxClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/15',
      glowClass: 'hover:border-indigo-500/30 hover:shadow-[0_8px_24px_rgba(99,102,241,0.12)]',
      icon: <Award className="h-4 w-4 sm:h-5 sm:w-5" />,
      onClick: onOpenBadges,
    },
  ];

  return (
    <section aria-label="Pusat Fitur Unggulan" className="w-full">
      {/* Symmetrical 5-Column Grid with Apple Glass & Squircle Radii */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4 w-full">
        {hubs.map((hub) => (
          <button
            key={hub.id}
            type="button"
            onClick={hub.onClick}
            className={`group relative p-2.5 sm:p-4 rounded-2xl sm:rounded-[26px] apple-glass apple-card-hover ${hub.glowClass} flex flex-col items-center sm:items-start text-center sm:text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none`}
          >
            {/* Top row on Desktop / Centered Icon on Mobile */}
            <div className="relative flex items-center justify-between w-full mb-1 sm:mb-2.5">
              <div className={`p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border ${hub.iconBoxClass} shadow-xs mx-auto sm:mx-0 transition-transform duration-300 group-hover:scale-110 group-active:scale-95`}>
                {hub.icon}
              </div>

              {/* Desktop Full Badge */}
              <span className={`hidden sm:inline text-[10px] font-bold px-2 py-0.5 rounded-full border ${hub.badgeClass}`}>
                {hub.desktopBadge}
              </span>

              {/* Mobile Micro Badge (Floating on icon) */}
              <span className={`sm:hidden absolute -top-1 -right-0.5 text-[8px] font-black px-1.5 py-0.2 rounded-full border ${hub.badgeClass}`}>
                {hub.badge}
              </span>
            </div>

            {/* Labels */}
            <div className="w-full space-y-0.5">
              <h3 className="font-bold text-[10px] sm:text-xs text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                <span className="sm:hidden">{hub.mobileLabel}</span>
                <span className="hidden sm:inline">{hub.title}</span>
              </h3>
              <p className="text-[11px] text-muted-foreground line-clamp-1 font-medium hidden sm:block">
                {hub.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

