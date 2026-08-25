import React, { useState } from 'react';
import { Calendar, Info } from 'lucide-react';
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

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return 'bg-secondary border-border/50 hover:border-border';
      case 1:
        return 'bg-emerald-950/60 dark:bg-emerald-950/60 text-emerald-300 border-emerald-800/40';
      case 2:
        return 'bg-emerald-700/70 text-white border-emerald-600/50';
      case 3:
        return 'bg-emerald-600 text-white border-emerald-500/60';
      case 4:
        return 'bg-emerald-500 text-white border-emerald-400/80 shadow-sm shadow-emerald-500/30';
      default:
        return 'bg-secondary';
    }
  };


  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-foreground">
              Peta Konsistensi Aktivitas (90 Hari Terakhir)
            </h2>
            <p className="text-xs text-muted-foreground">
              Visualisasi frekuensi kebiasaan terselesaikan ala GitHub
            </p>
          </div>
        </div>

        {/* Live Hover Info */}
        <div className="h-6 flex items-center">
          {hoveredDay ? (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-secondary text-foreground animate-fadeIn">
              📅 {formatDateToIndonesian(hoveredDay.date)}: <strong className="text-emerald-500">{hoveredDay.count}</strong> dari {hoveredDay.totalHabits} selesai
            </span>
          ) : (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Info className="h-3.5 w-3.5" /> Arahkan kursor ke kotak untuk detail
            </span>
          )}
        </div>
      </div>

      {/* Grid Container */}
      <div className="mt-5 overflow-x-auto pb-2">
        <div className="min-w-[650px] flex gap-2">
          {/* Day Name Labels */}
          <div className="flex flex-col gap-1.5 justify-between py-1 pr-2 text-[10px] text-muted-foreground font-medium">
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
                    className={`w-3.5 h-3.5 rounded-sm border transition-all duration-150 transform hover:scale-125 hover:z-10 focus:outline-none focus:ring-1 focus:ring-emerald-400 ${getIntensityColor(
                      day.intensity
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
        <div className="flex items-center gap-1.5">
          <span>Sedikit</span>
          <div className="w-3 h-3 rounded-sm bg-secondary border border-border/50" />
          <div className="w-3 h-3 rounded-sm bg-emerald-950/60 border border-emerald-800/40" />
          <div className="w-3 h-3 rounded-sm bg-emerald-700/70 border border-emerald-600/50" />
          <div className="w-3 h-3 rounded-sm bg-emerald-600 border border-emerald-500/60" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500 border border-emerald-400/80" />
          <span>Banyak</span>
        </div>
      </div>
    </div>
  );
};
