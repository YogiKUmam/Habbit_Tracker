import React, { useState, useMemo } from 'react';
import { Calendar, Flame, TrendingUp, CheckCircle2, Zap, Snowflake } from 'lucide-react';
import { DayActivity } from '../types/habit';
import { formatDateToIndonesian } from '../lib/storage';

interface HeatmapGridProps {
  data: DayActivity[];
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({ data }) => {
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);
  const [timeframe, setTimeframe] = useState<'4w' | '12w' | 'all'>('12w');

  // Determine number of days to display
  const daysToShow = timeframe === '4w' ? 28 : timeframe === '12w' ? 84 : data.length;
  const displayData = useMemo(() => data.slice(-daysToShow), [data, daysToShow]);

  // Group data into weeks (columns of 7 days)
  const weeks: DayActivity[][] = useMemo(() => {
    const result: DayActivity[][] = [];
    let currentWeek: DayActivity[] = [];

    displayData.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || index === displayData.length - 1) {
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    return result;
  }, [displayData]);

  // Calculate rich statistics for the right-side bento cards
  const stats = useMemo(() => {
    const totalCompletions = displayData.reduce((acc, curr) => acc + curr.count, 0);
    const activeDays = displayData.filter((d) => d.count > 0).length;
    const consistencyRate = displayData.length > 0 ? Math.round((activeDays / displayData.length) * 100) : 0;

    // Calculate best day of week
    const dayTotals = [0, 0, 0, 0, 0, 0, 0];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];
    displayData.forEach((d) => {
      const dayOfWeek = new Date(d.date).getDay();
      dayTotals[dayOfWeek] += d.count;
      dayCounts[dayOfWeek] += 1;
    });

    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    let bestDayIdx = 1;
    let maxAvg = -1;
    dayTotals.forEach((tot, idx) => {
      const avg = dayCounts[idx] > 0 ? tot / dayCounts[idx] : 0;
      if (avg > maxAvg) {
        maxAvg = avg;
        bestDayIdx = idx;
      }
    });

    return {
      totalCompletions,
      activeDays,
      consistencyRate,
      bestDay: dayNames[bestDayIdx],
    };
  }, [displayData]);

  const getIntensityColor = (day: DayActivity) => {
    if (day.isFrozen) {
      return 'bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)] border-cyan-400';
    }
    switch (day.intensity) {
      case 0:
        return 'bg-secondary/70 hover:bg-secondary border-transparent';
      case 1:
        return 'bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border-emerald-500/20';
      case 2:
        return 'bg-emerald-500/55 text-white border-emerald-500/30';
      case 3:
        return 'bg-emerald-500/80 text-white border-emerald-500/40 shadow-[0_0_8px_rgba(34,197,94,0.2)]';
      case 4:
        return 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.4)]';
      default:
        return 'bg-secondary/70';
    }
  };

  const getDayLetter = (dayIndex: number) => {
    const letters = ['M', 'S', 'S', 'R', 'K', 'J', 'S'];
    return letters[dayIndex] || '';
  };

  return (
    <div className="rounded-[28px] sm:rounded-[32px] apple-glass apple-card-hover p-5 sm:p-7 relative overflow-hidden transition-all">
      {/* Top Header & Range Pill Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs flex items-center justify-center">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base sm:text-lg text-foreground tracking-tight">
                Peta Konsistensi & Aktivitas
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {stats.totalCompletions} Selesai
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Matriks visual riwayat konsistensi kebiasaan harian Anda
            </p>
          </div>
        </div>

        {/* Timeframe Filter Pill Navigation */}
        <div className="flex items-center p-1 bg-secondary/70 rounded-full border border-border/50 text-xs font-semibold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTimeframe('4w')}
            className={`tactile-btn px-3.5 py-1.5 rounded-full transition-all ${
              timeframe === '4w'
                ? 'bg-card text-foreground font-bold shadow-xs border border-border/70'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            4 Minggu
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('12w')}
            className={`tactile-btn px-3.5 py-1.5 rounded-full transition-all ${
              timeframe === '12w'
                ? 'bg-card text-foreground font-bold shadow-xs border border-border/70'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            12 Minggu
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('all')}
            className={`tactile-btn px-3.5 py-1.5 rounded-full transition-all ${
              timeframe === 'all'
                ? 'bg-card text-foreground font-bold shadow-xs border border-border/70'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Semua (90 Hari)
          </button>
        </div>
      </div>

      {/* Main Bento Layout: Heatmap Grid (Left) + Stats & Day Detail Cards (Right) */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / CENTER: The Dynamic Contribution Heatmap Matrix (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="overflow-x-auto pb-3 pt-1">
            <div className="flex gap-2 items-start min-w-max">
              {/* Day Name Indicator Column */}
              <div className="flex flex-col gap-1.5 pt-0.5 pr-2 text-[10px] text-muted-foreground/70 font-semibold select-none">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={i} className="h-4 w-4 flex items-center justify-center">
                    {getDayLetter(i)}
                  </span>
                ))}
              </div>

              {/* Weeks Heatmap Columns */}
              <div className="flex gap-1.5 sm:gap-2">
                {weeks.map((week, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1.5">
                    {week.map((day) => {
                      const isHovered = hoveredDay?.date === day.date;
                      return (
                        <button
                          key={day.date}
                          type="button"
                          onMouseEnter={() => setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          onClick={() => setHoveredDay(day)}
                          aria-label={`${day.date}: ${day.count} kebiasaan selesai`}
                          className={`w-4 h-4 sm:w-5 sm:h-5 rounded-[5px] border transition-all duration-200 cursor-pointer ${
                            isHovered
                              ? 'scale-125 z-20 ring-2 ring-emerald-400 shadow-md'
                              : 'hover:scale-110 hover:z-10'
                          } ${getIntensityColor(day)}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Heatmap Legend & Summary Callout */}
          <div className="pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium">Intensitas:</span>
              <div className="flex items-center gap-1 font-semibold text-[10px]">
                <span className="text-muted-foreground/80">0</span>
                <div className="w-3 h-3 rounded-[3px] bg-secondary/70 border border-border/40" />
                <div className="w-3 h-3 rounded-[3px] bg-emerald-500/25 border border-emerald-500/20" />
                <div className="w-3 h-3 rounded-[3px] bg-emerald-500/55 border border-emerald-500/30" />
                <div className="w-3 h-3 rounded-[3px] bg-emerald-500/80 border border-emerald-500/40" />
                <div className="w-3 h-3 rounded-[3px] bg-emerald-500 border border-emerald-400" />
                <span className="text-emerald-500 font-bold">Maks</span>
              </div>
            </div>

            <span className="text-[11px] font-medium text-muted-foreground/80">
              💡 Klik atau arahkan kursor ke kotak untuk melihat rincian
            </span>
          </div>
        </div>

        {/* RIGHT: Bento Quick Metrics & Live Hover Inspector (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          
          {/* Dynamic Day Inspector Card on Hover */}
          <div className={`p-4 rounded-2xl border transition-all duration-300 ${
            hoveredDay 
              ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_4px_16px_rgba(16,185,129,0.08)]' 
              : 'bg-secondary/40 border-border/50'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {hoveredDay ? 'Detail Hari Dipilih' : 'Status Inspeksi'}
              </span>
              {hoveredDay?.isFrozen && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  <Snowflake className="w-3 h-3" /> Streak Freeze Aktif
                </span>
              )}
            </div>

            {hoveredDay ? (
              <div className="mt-2 space-y-1">
                <div className="text-sm font-bold text-foreground">
                  📅 {formatDateToIndonesian(hoveredDay.date)}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                    {hoveredDay.count}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    dari {hoveredDay.totalHabits} kebiasaan terselesaikan
                  </span>
                </div>
                <div className="w-full bg-secondary/80 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.round((hoveredDay.count / (hoveredDay.totalHabits || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-2 flex items-center gap-2.5 text-xs text-muted-foreground">
                <Zap className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Arahkan kursor ke kotak di heatmap untuk melihat detail checklist harian.</span>
              </div>
            )}
          </div>

          {/* 3 Balanced Metric Micro-Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            
            {/* Metric 1: Consistency Rate */}
            <div className="p-3 rounded-2xl bg-secondary/30 border border-border/40 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-emerald-500 mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Konsistensi</span>
              </div>
              <div className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground font-mono">
                {stats.consistencyRate}%
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5">{stats.activeDays} Hari Aktif</span>
            </div>

            {/* Metric 2: Best Day */}
            <div className="p-3 rounded-2xl bg-secondary/30 border border-border/40 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-amber-500 mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Hari Terbaik</span>
              </div>
              <div className="text-sm sm:text-base font-extrabold tracking-tight text-foreground truncate">
                {stats.bestDay}
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5">Paling Produktif</span>
            </div>

            {/* Metric 3: Total Completed */}
            <div className="p-3 rounded-2xl bg-secondary/30 border border-border/40 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-blue-500 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Total Log</span>
              </div>
              <div className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground font-mono">
                {stats.totalCompletions}
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5">Checklist</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
