import React, { useState, useMemo } from 'react';
import { 
  X, Trophy, Flame, CheckCircle2, Award, Crown, 
  Users, ArrowUp 
} from 'lucide-react';
import { HabitStats } from '../types/habit';
import { Badge } from '../types/badge';
import { UserProfile, getCommunityLeaderboard } from '../lib/leaderboard';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  stats: HabitStats;
  badges: Badge[];
}

type SortFilter = 'streak' | 'completions' | 'badges';

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  stats,
  badges,
}) => {
  const [filter, setFilter] = useState<SortFilter>('streak');

  const leaderboard = useMemo(() => {
    return getCommunityLeaderboard(userProfile, stats, badges, filter);
  }, [userProfile, stats, badges, filter]);

  const top3 = leaderboard.slice(0, 3);
  const currentUserRank = leaderboard.findIndex((m) => m.isCurrentUser) + 1;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] p-6 sm:p-8 bg-card border border-amber-500/30 rounded-3xl shadow-2xl overflow-y-auto space-y-6">
        
        {/* Glow Halo Effect */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/25">
              <Trophy className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <span>Community Leaderboard</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 flex items-center gap-1">
                  <Crown className="h-3 w-3" /> Musim Ini
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Papan peringkat konsistensi global antar sesama pejuang kebiasaan
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

        {/* Current User Rank Spotlight Banner */}
        <div className="p-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-teal-950/40 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs">
              #{currentUserRank}
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">
                Posisi Peringkat Anda: #{currentUserRank} dari {leaderboard.length} Anggota
              </p>
              <p className="text-[11px] text-muted-foreground">
                Streak: {stats.currentStreak} Hari • Level {leaderboard.find((m) => m.isCurrentUser)?.level} ({leaderboard.find((m) => m.isCurrentUser)?.levelTitle})
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <ArrowUp className="h-3.5 w-3.5" />
            <span>Aktif Bersaing</span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-secondary/50 border border-border">
          <button
            type="button"
            onClick={() => setFilter('streak')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              filter === 'streak'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Top Streak</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('completions')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              filter === 'completions'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Total Checklist</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('badges')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              filter === 'badges'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>Lencana</span>
          </button>
        </div>

        {/* Top 3 Podium Visual */}
        {top3.length >= 3 && (
          <div className="pt-6 pb-2">
            <div className="flex items-end justify-center gap-2 sm:gap-4 max-w-md mx-auto">
              
              {/* 2nd Place (Silver) */}
              <div className="flex-1 flex flex-col items-center">
                <span className="text-2xl mb-1">{top3[1].avatar}</span>
                <span className="text-xs font-bold text-foreground truncate max-w-[90px]">
                  {top3[1].name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-muted-foreground mb-1.5">
                  {filter === 'streak' ? `${top3[1].streak} Hari 🔥` : filter === 'completions' ? `${top3[1].totalCompletions}x 🎯` : `${top3[1].badgesCount} 🏆`}
                </span>
                <div className="w-full h-20 rounded-t-2xl bg-gradient-to-t from-slate-800 to-slate-700 border-t-2 border-slate-400 flex flex-col items-center justify-center shadow-lg">
                  <span className="text-lg font-extrabold text-slate-300">2</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">Perak</span>
                </div>
              </div>

              {/* 1st Place (Gold) */}
              <div className="flex-1 flex flex-col items-center">
                <Crown className="h-6 w-6 text-amber-400 animate-bounce mb-1" />
                <span className="text-3xl mb-1">{top3[0].avatar}</span>
                <span className="text-xs font-extrabold text-amber-400 truncate max-w-[100px]">
                  {top3[0].name.split(' ')[0]}
                </span>
                <span className="text-[11px] font-bold text-amber-300 mb-1.5">
                  {filter === 'streak' ? `${top3[0].streak} Hari 🔥` : filter === 'completions' ? `${top3[0].totalCompletions}x 🎯` : `${top3[0].badgesCount} 🏆`}
                </span>
                <div className="w-full h-28 rounded-t-2xl bg-gradient-to-t from-amber-600 to-yellow-500 border-t-2 border-yellow-300 flex flex-col items-center justify-center shadow-xl shadow-amber-500/20 text-slate-950">
                  <span className="text-2xl font-black">1</span>
                  <span className="text-[10px] font-black uppercase tracking-wider">Emas</span>
                </div>
              </div>

              {/* 3rd Place (Bronze) */}
              <div className="flex-1 flex flex-col items-center">
                <span className="text-2xl mb-1">{top3[2].avatar}</span>
                <span className="text-xs font-bold text-foreground truncate max-w-[90px]">
                  {top3[2].name.split(' ')[0]}
                </span>
                <span className="text-[10px] text-muted-foreground mb-1.5">
                  {filter === 'streak' ? `${top3[2].streak} Hari 🔥` : filter === 'completions' ? `${top3[2].totalCompletions}x 🎯` : `${top3[2].badgesCount} 🏆`}
                </span>
                <div className="w-full h-16 rounded-t-2xl bg-gradient-to-t from-amber-900 to-amber-800 border-t-2 border-amber-600 flex flex-col items-center justify-center shadow-lg">
                  <span className="text-base font-extrabold text-amber-200">3</span>
                  <span className="text-[9px] font-bold text-amber-400 uppercase">Perunggu</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Full Rankings List */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>Peringkat Keseluruhan ({leaderboard.length} Pejuang):</span>
          </h4>

          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {leaderboard.map((member, index) => {
              const rank = index + 1;
              return (
                <div
                  key={member.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-all ${
                    member.isCurrentUser
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-foreground ring-1 ring-emerald-500/30'
                      : 'bg-secondary/30 border-border text-foreground hover:bg-secondary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-center font-bold font-mono ${
                      rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-slate-300' : rank === 3 ? 'text-amber-600' : 'text-muted-foreground'
                    }`}>
                      #{rank}
                    </span>
                    <span className="text-lg">{member.avatar}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">{member.name}</span>
                        {member.isCurrentUser && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                            Anda
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        Level {member.level} • {member.levelTitle}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {filter === 'streak' && (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-500 font-bold border border-amber-500/20 flex items-center gap-1">
                        <Flame className="h-3.5 w-3.5" />
                        {member.streak} Hari
                      </span>
                    )}

                    {filter === 'completions' && (
                      <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {member.totalCompletions}x
                      </span>
                    )}

                    {filter === 'badges' && (
                      <span className="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 flex items-center gap-1">
                        <Award className="h-3.5 w-3.5" />
                        {member.badgesCount} Lencana
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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
