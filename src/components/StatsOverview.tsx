import React from 'react';
import { Flame, Trophy, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';
import { HabitStats } from '../types/habit';

interface StatsOverviewProps {
  stats: HabitStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Progres Hari Ini */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Progres Hari Ini
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {stats.todayPercentage}%
          </span>
          <span className="text-xs text-muted-foreground">
            ({stats.todayCompleted}/{stats.todayTotal})
          </span>
        </div>
        {/* Progress Bar */}
        <div className="mt-3 w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${stats.todayPercentage}%` }}
          />
        </div>
      </div>

      {/* 2. Streak Aktif */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Streak Aktif
          </span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <Flame className="h-4 w-4 fill-amber-500" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-500">
            {stats.currentStreak}
          </span>
          <span className="text-xs font-medium text-muted-foreground">Hari</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-500" />
          Pertahankan konsistensi harian
        </p>
      </div>

      {/* 3. Rekor Terbaik */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Rekor Streak Terbaik
          </span>
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
            <Trophy className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-violet-500">
            {stats.bestStreak}
          </span>
          <span className="text-xs font-medium text-muted-foreground">Hari</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-violet-500" />
          Target pencapaian tertinggi
        </p>
      </div>

      {/* 4. Total Aktivitas Tercatat */}
      <div className="p-4 sm:p-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Selesai
          </span>
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-blue-500">
            {stats.totalCompletions}
          </span>
          <span className="text-xs font-medium text-muted-foreground">Checklist</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Dari {stats.totalHabits} kebiasaan aktif
        </p>
      </div>
    </div>
  );
};
