import React, { useState } from 'react';
import { Calendar, Info, Snowflake } from 'lucide-react';
import { DayActivity } from '../types/habit';
import { formatDateToIndonesian } from '../lib/storage';

interface HeatmapGridProps {
  data: DayActivity[];
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({ data }) => {
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);

  // Group data into weeks (columns of 7 days: Sun, Mon, Tue, Wed, Thu, Fri, Sat)
  const weeks: DayActivity[][] = [];
  let currentWeek: DayActivity[] = [];

  data.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === data.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const getIntensityColor = (day: DayActivity) => {
    if (day.isFrozen) {
      return 'bg-cyan-500/80 text-white border-cyan-400/80 shadow-xs shadow-cyan-500/20';
    }
    switch (day.intensity) {
      case 0:
        return 'bg-secondary/70 border-border/40 hover:border-border';
      case 1:
        return 'bg-emerald-950/60 dark:bg-emerald-950/70 text-emerald-300 border-emerald-800/40';
      case 2:
        return 'bg-emerald-700/80 text-white border-emerald-600/60';
      case 3:
        return 'bg-emerald-600 text-white border-emerald-500/70';
      case 4:
        return 'bg-emerald-500 text-white border-emerald-400/90 shadow-sm shadow-emerald-500/30';
      default:
        return 'bg-secondary';
    }
  };

  const totalCompletionsInGrid = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="p-5 sm:p-6 rounded-3xl border border-border bg-card/90 backdrop-blur-sm shadow-sm hover:border-border/80 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-foreground">
                Peta Konsistensi Aktivitas (90 Hari Terakhir)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {totalCompletionsInGrid} Checklist
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Visualisasi frekuensi kebiasaan terselesaikan ala GitHub
            </p>
          </div>
        </div>

        {/* Live Hover Info */}
        <div className="h-7 flex items-center">
          {hoveredDay ? (
            <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-secondary border border-border text-foreground animate-fadeIn shadow-xs flex items-center gap-1.5">
              {hoveredDay.isFrozen && <Snowflake className="h-3 w-3 text-cyan-400" />}
              <span>📅 {formatDateToIndonesian(hoveredDay.date)}:</span>
              <strong className="text-emerald-400">{hoveredDay.count}</strong>
              <span className="text-muted-foreground">dari {hoveredDay.totalHabits} selesai</span>
            </span>
          ) : (
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
              <Info className="h-3.5 w-3.5" /> Arahkan kursor ke kotak untuk detail
            </span>
          )}
        </div>
      </div>

      {/* Grid Container */}
      <div className="mt-5 overflow-x-auto pb-2">
        <div className="min-w-[680px] flex gap-2">
          {/* Day Name Labels */}
          <div className="flex flex-col gap-1.5 justify-between py-1 pr-2 text-[10px] text-muted-foreground font-semibold">
            <span>Sen</span>
            <span>Rab</span>
            <span>Jum</span>
          </div>

          {/* Weeks Columns */}
          <div className="flex gap-1.5 flex-1">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day) => (
                  <button
                    key={day.date}
                    type="button"
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    aria-label={`${day.date}: ${day.count} kebiasaan selesai`}
                    className={`w-3.5 h-3.5 rounded-sm border transition-all duration-150 transform hover:scale-130 hover:z-10 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${getIntensityColor(
                      day
                    )}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend Footer */}
      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span>Aktivitas harian</span>
        <div className="flex items-center gap-1.5 font-semibold text-[11px]">
          <span>Sedikit</span>
          <div className="w-3 h-3 rounded-sm bg-secondary border border-border/50" />
          <div className="w-3 h-3 rounded-sm bg-emerald-950/60 border border-emerald-800/40" />
          <div className="w-3 h-3 rounded-sm bg-emerald-700/80 border border-emerald-600/60" />
          <div className="w-3 h-3 rounded-sm bg-emerald-600 border border-emerald-500/70" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500 border border-emerald-400/90" />
          <span>Banyak</span>
        </div>
      </div>
    </div>
  );
};
