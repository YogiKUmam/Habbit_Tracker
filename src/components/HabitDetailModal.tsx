import React from 'react';
import { 
  X, Flame, Trophy, Calendar, CheckCircle2, TrendingUp, 
  Sparkles, Droplets, BookOpen, Dumbbell, Code2, Heart, 
  Brain, Coffee, Smile, Share2 
} from 'lucide-react';
import { Habit, HabitLog } from '../types/habit';
import { calculateHabitStreak, formatDateToIndonesian } from '../lib/storage';

interface HabitDetailModalProps {
  habit: Habit | null;
  logs: HabitLog[];
  isOpen: boolean;
  onClose: () => void;
  onOpenShare?: (habit: Habit) => void;
}

export const HabitDetailModal: React.FC<HabitDetailModalProps> = ({ 
  habit, 
  logs, 
  isOpen, 
  onClose,
  onOpenShare 
}) => {
  if (!isOpen || !habit) return null;

  const habitLogs = logs.filter((l) => l.habitId === habit.id && l.completed);
  const totalCompleted = habitLogs.length;
  const streak = calculateHabitStreak(habit.id, logs, habit);

  // Calculate past 4 weeks stats (28 days)
  const past4Weeks = [];
  const today = new Date();

  for (let w = 3; w >= 0; w--) {
    let completedInWeek = 0;
    for (let d = 0; d < 7; d++) {
      const dayDate = new Date(today);
      dayDate.setDate(dayDate.getDate() - (w * 7 + d));
      const dateStr = dayDate.toISOString().split('T')[0];
      if (habitLogs.some((l) => l.date === dateStr)) {
        completedInWeek++;
      }
    }
    past4Weeks.push({
      weekLabel: w === 0 ? 'Minggu Ini' : `${w} Minggu Lalu`,
      completed: completedInWeek,
      target: habit.targetDaysPerWeek,
      percentage: Math.min(100, Math.round((completedInWeek / habit.targetDaysPerWeek) * 100)),
    });
  }

  // Calculate total success rate over last 30 days
  let last30DaysCompleted = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (habitLogs.some((l) => l.date === dateStr)) {
      last30DaysCompleted++;
    }
  }
  const monthlyRate = Math.min(100, Math.round((last30DaysCompleted / 30) * 100));

  const renderIcon = (name: string) => {
    const props = { className: 'h-6 w-6' };
    switch (name) {
      case 'Droplets': return <Droplets {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Dumbbell': return <Dumbbell {...props} />;
      case 'Code2': return <Code2 {...props} />;
      case 'Heart': return <Heart {...props} />;
      case 'Brain': return <Brain {...props} />;
      case 'Coffee': return <Coffee {...props} />;
      case 'Smile': return <Smile {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20">
              {renderIcon(habit.icon)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{habit.title}</h2>
              <span className="text-xs text-muted-foreground font-medium">
                {habit.category} • Target {habit.targetDaysPerWeek}x / minggu
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5">
            {onOpenShare && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenShare(habit);
                }}
                title="Bagikan Pencapaian Kartu Ini"
                className="p-2 rounded-xl text-amber-500 hover:bg-amber-500/10 border border-amber-500/20 transition-colors flex items-center gap-1 text-xs font-semibold"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Bagikan</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 3 Main Stat Metric Highlights */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border flex flex-col items-center justify-center text-center">
            <Flame className="h-5 w-5 text-amber-500 mb-1" />
            <span className="text-lg font-bold text-foreground">{streak.current} Hari</span>
            <span className="text-[10px] text-muted-foreground font-semibold">Streak Saat Ini</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border flex flex-col items-center justify-center text-center">
            <Trophy className="h-5 w-5 text-indigo-500 mb-1" />
            <span className="text-lg font-bold text-foreground">{streak.best} Hari</span>
            <span className="text-[10px] text-muted-foreground font-semibold">Rekor Terbaik</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-secondary/50 border border-border flex flex-col items-center justify-center text-center">
            <TrendingUp className="h-5 w-5 text-emerald-500 mb-1" />
            <span className="text-lg font-bold text-foreground">{monthlyRate}%</span>
            <span className="text-[10px] text-muted-foreground font-semibold">30 Hari Terakhir</span>
          </div>
        </div>

        {/* 4-Week Breakdown Progress Bars */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            Performa 4 Minggu Terakhir
          </h4>
          <div className="space-y-2.5">
            {past4Weeks.map((week) => (
              <div key={week.weekLabel} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground">{week.weekLabel}</span>
                  <span className="font-bold text-foreground">
                    {week.completed}/{week.target} hari ({week.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${week.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Completion Logs list */}
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Catatan Aktivitas Terbaru ({totalCompleted} Total)
          </h4>
          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
            {habitLogs.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-3">Belum ada riwayat aktivitas</p>
            ) : (
              habitLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="p-2 px-3 rounded-xl bg-secondary/40 flex items-center justify-between text-xs">
                  <span className="text-foreground font-medium">{formatDateToIndonesian(log.date)}</span>
                  <span className="text-[10px] font-bold text-emerald-500 px-2 py-0.5 rounded-full bg-emerald-500/10">
                    Selesai
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
