import React from 'react';
import { X, Flame, Trophy, Calendar, CheckCircle2, TrendingUp, Sparkles, Droplets, BookOpen, Dumbbell, Code2, Heart, Brain, Coffee, Smile } from 'lucide-react';
import { Habit, HabitLog } from '../types/habit';
import { calculateHabitStreak, formatDateToIndonesian } from '../lib/storage';

interface HabitDetailModalProps {
  habit: Habit | null;
  logs: HabitLog[];
  isOpen: boolean;
  onClose: () => void;
}

export const HabitDetailModal: React.FC<HabitDetailModalProps> = ({ habit, logs, isOpen, onClose }) => {
  if (!isOpen || !habit) return null;

  const habitLogs = logs.filter((l) => l.habitId === habit.id && l.completed);
  const totalCompleted = habitLogs.length;
  const streak = calculateHabitStreak(habit.id, logs);

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
  const expected30Days = Math.round((habit.targetDaysPerWeek / 7) * 30);
  const successRate = Math.min(100, Math.round((last30DaysCompleted / expected30Days) * 100));

  const getIcon = (iconName: string) => {
    const props = { className: 'h-6 w-6 text-primary' };
    switch (iconName) {
      case 'Droplets': return <Droplets {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Dumbbell': return <Dumbbell {...props} />;
      case 'Code2': return <Code2 {...props} />;
      case 'Heart': return <Heart {...props} />;
      case 'Brain': return <Brain {...props} />;
      case 'Coffee': return <Coffee {...props} />;
      case 'Smile': return <Smile {...props} />;
      case 'Trophy': return <Trophy {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl p-6 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-inner">
              {getIcon(habit.icon)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                  {habit.category}
                </span>
                <span className="text-xs text-muted-foreground">Target: {habit.targetDaysPerWeek}x / minggu</span>
              </div>
              <h2 className="text-lg font-bold text-foreground mt-0.5">{habit.title}</h2>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 my-4">
          <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border text-center">
            <div className="flex items-center justify-center text-amber-500 mb-1">
              <Flame className="h-4 w-4 fill-amber-500 mr-1" />
              <span className="text-xs font-bold">Streak Aktif</span>
            </div>
            <span className="text-xl font-extrabold text-foreground">{streak.current}</span>
            <span className="text-[10px] text-muted-foreground block">Hari</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border text-center">
            <div className="flex items-center justify-center text-violet-500 mb-1">
              <Trophy className="h-4 w-4 mr-1" />
              <span className="text-xs font-bold">Rekor Terbaik</span>
            </div>
            <span className="text-xl font-extrabold text-foreground">{streak.best}</span>
            <span className="text-[10px] text-muted-foreground block">Hari</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-secondary/40 border border-border text-center">
            <div className="flex items-center justify-center text-emerald-500 mb-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-xs font-bold">Success Rate</span>
            </div>
            <span className="text-xl font-extrabold text-foreground">{successRate}%</span>
            <span className="text-[10px] text-muted-foreground block">30 Hari Terakhir</span>
          </div>
        </div>

        {/* 4 Weeks Performance Chart */}
        <div className="p-4 rounded-2xl bg-secondary/30 border border-border mt-3">
          <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-primary" />
            Performa 4 Minggu Terakhir
          </h3>
          
          <div className="space-y-3">
            {past4Weeks.map((week, idx) => (
              <div key={idx} className="space-y-1">
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
