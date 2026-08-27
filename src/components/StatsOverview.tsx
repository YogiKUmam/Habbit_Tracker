import React from 'react';
import { Flame, Trophy, Sparkles, Zap, Award } from 'lucide-react';
import { HabitStats } from '../types/habit';

interface StatsOverviewProps {
  stats: HabitStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  // SVG Ring Calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (stats.todayPercentage / 100) * circumference;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
      
      {/* 1. HERO BENTO: Apple Health-Inspired Activity Ring (7 Cols) */}
      <div className="md:col-span-7 apple-glass apple-card-hover rounded-[28px] sm:rounded-[32px] p-5 sm:p-7 flex items-center justify-between relative overflow-hidden group">
        {/* Ambient Glow */}
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none" />

        <div className="space-y-3 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Zap className="w-3.5 h-3.5" />
            Progres Hari Ini
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground font-mono">
                {stats.todayPercentage}%
              </span>
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                ({stats.todayCompleted}/{stats.todayTotal} Selesai)
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              {stats.todayPercentage === 100
                ? '🎉 Sempurna! Semua target hari ini tuntas.'
                : stats.todayPercentage > 0
                ? `⚡ Sisa ${stats.todayTotal - stats.todayCompleted} kebiasaan lagi untuk target 100%!`
                : '✨ Awali hari dengan menyelesaikan kebiasaan pertama Anda.'}
            </p>
          </div>

          {/* Quick Progress Bar for mobile/fallback */}
          <div className="w-full max-w-[200px] bg-secondary/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${stats.todayPercentage}%` }}
            />
          </div>
        </div>

        {/* Apple-Style SVG Circular Activity Ring */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              className="text-secondary/70"
              fill="transparent"
            />
            {/* Dynamic Animated Ring */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#appleRingGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="appleRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
          </div>
        </div>
      </div>

      {/* 2. RIGHT BENTO SUB-GRID (5 Cols) */}
      <div className="md:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
        
        {/* Streak Flame Card (Full width of right column) */}
        <div className="col-span-2 apple-glass apple-card-hover rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 relative overflow-hidden flex items-center justify-between">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/15 dark:bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Streak Aktif
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-mono">
                {stats.currentStreak}
              </h3>
              <span className="text-xs font-bold text-muted-foreground">Hari Berturut</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium mt-1">
              Rekor terbaik Anda: <strong className="text-foreground">{stats.bestStreak} Hari</strong>
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center shadow-[0_6px_20px_rgba(245,158,11,0.35)] shrink-0">
            <Flame className="w-6 h-6 fill-white animate-pulse" />
          </div>
        </div>

        {/* Mini Stat Card: Rekor Tertinggi */}
        <div className="apple-glass apple-card-hover rounded-[24px] sm:rounded-[26px] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              Rekor
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground">Best Streak</span>
            <p className="text-base sm:text-lg font-bold text-foreground font-mono">
              {stats.bestStreak} <span className="text-xs font-normal text-muted-foreground">Hari</span>
            </p>
          </div>
        </div>

        {/* Mini Stat Card: Total Checklist Selesai */}
        <div className="apple-glass apple-card-hover rounded-[24px] sm:rounded-[26px] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              Total
            </span>
          </div>
          <div className="mt-3">
            <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground">Checklist</span>
            <p className="text-base sm:text-lg font-bold text-foreground font-mono">
              {stats.totalCompletions} <span className="text-xs font-normal text-muted-foreground">Done</span>
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

