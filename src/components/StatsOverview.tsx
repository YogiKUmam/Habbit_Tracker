import React from 'react';
import { Flame, Trophy, CheckCircle2, TrendingUp, Sparkles, Zap } from 'lucide-react';
import { HabitStats } from '../types/habit';

interface StatsOverviewProps {
  stats: HabitStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      
      {/* 1. Progres Hari Ini */}
      <div className="relative p-4 sm:p-5 rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 via-card/80 to-card shadow-sm hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Progres Hari Ini
          </span>
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-mono">
            {stats.todayPercentage}%
          </span>
          <span className="text-xs font-semibold text-muted-foreground">
            ({stats.todayCompleted}/{stats.todayTotal})
          </span>
        </div>

        {/* Progress Bar with Gradient Glow */}
        <div className="mt-3 w-full bg-secondary/80 rounded-full h-2 overflow-hidden border border-white/5">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 ease-out shadow-xs"
            style={{ width: `${stats.todayPercentage}%` }}
          />
        </div>
      </div>

      {/* 2. Streak Aktif */}
      <div className="relative p-4 sm:p-5 rounded-3xl border border-amber-500/20 bg-gradient-to-b from-amber-950/20 via-card/80 to-card shadow-sm hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300 overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Streak Aktif
          </span>
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-xs">
            <Flame className="h-4 w-4 fill-amber-400 animate-pulse" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-amber-500 font-mono">
            {stats.currentStreak}
          </span>
          <span className="text-xs font-bold text-muted-foreground">Hari Berturut</span>
        </div>

        <p className="mt-2.5 text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
          <Zap className="h-3 w-3 text-amber-400" />
          <span>Pertahankan momentum harian</span>
        </p>
      </div>

      {/* 3. Rekor Terbaik */}
      <div className="relative p-4 sm:p-5 rounded-3xl border border-violet-500/20 bg-gradient-to-b from-violet-950/20 via-card/80 to-card shadow-sm hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300 overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Rekor Terbaik
          </span>
          <div className="p-2.5 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-xs">
            <Trophy className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-violet-400 font-mono">
            {stats.bestStreak}
          </span>
          <span className="text-xs font-bold text-muted-foreground">Hari Rekor</span>
        </div>

        <p className="mt-2.5 text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
          <TrendingUp className="h-3 w-3 text-violet-400" />
          <span>Pencapaian tertinggi Anda</span>
        </p>
      </div>

      {/* 4. Total Selesai */}
      <div className="relative p-4 sm:p-5 rounded-3xl border border-cyan-500/20 bg-gradient-to-b from-cyan-950/20 via-card/80 to-card shadow-sm hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Total Selesai
          </span>
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-black tracking-tight text-cyan-400 font-mono">
            {stats.totalCompletions}
          </span>
          <span className="text-xs font-bold text-muted-foreground">Checklist</span>
        </div>

        <p className="mt-2.5 text-[11px] text-muted-foreground font-medium">
          Dari {stats.totalHabits} kebiasaan aktif
        </p>
      </div>

    </div>
  );
};
