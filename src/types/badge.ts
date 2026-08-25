import { Habit, HabitLog, HabitStats } from './habit';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // Icon name
  category: 'streak' | 'completion' | 'creation';
  unlocked: boolean;
  progress: number; // 0 to 100
  progressText: string;
}

export function evaluateBadges(habits: Habit[], _logs: HabitLog[], stats: HabitStats): Badge[] {
  const activeHabits = habits.filter((h) => !h.archived);
  const totalLogs = stats.totalCompletions;
  const bestStreak = stats.bestStreak;
  const todayPercentage = stats.todayPercentage;

  return [
    {
      id: 'pioneer',
      name: 'Pioneer Habit',
      description: 'Membuat kebiasaan pertama Anda',
      icon: 'Sparkles',
      category: 'creation',
      unlocked: activeHabits.length >= 1,
      progress: Math.min(100, (activeHabits.length / 1) * 100),
      progressText: `${activeHabits.length}/1 Habit`,
    },
    {
      id: 'ignition_3',
      name: '3-Day Ignition',
      description: 'Mencapai streak 3 hari berturut-turut',
      icon: 'Flame',
      category: 'streak',
      unlocked: bestStreak >= 3,
      progress: Math.min(100, Math.round((bestStreak / 3) * 100)),
      progressText: `${bestStreak}/3 Hari`,
    },
    {
      id: 'iron_7',
      name: '7-Day Iron Streak',
      description: 'Konsisten menyelesaikan habit selama 7 hari',
      icon: 'Zap',
      category: 'streak',
      unlocked: bestStreak >= 7,
      progress: Math.min(100, Math.round((bestStreak / 7) * 100)),
      progressText: `${bestStreak}/7 Hari`,
    },
    {
      id: 'master_21',
      name: 'Consistency Master',
      description: 'Mencapai 21 hari untuk mengunci kebiasaan permanen',
      icon: 'Crown',
      category: 'streak',
      unlocked: bestStreak >= 21,
      progress: Math.min(100, Math.round((bestStreak / 21) * 100)),
      progressText: `${bestStreak}/21 Hari`,
    },
    {
      id: 'flawless_day',
      name: 'Flawless Day',
      description: 'Menyelesaikan 100% semua kebiasaan dalam satu hari',
      icon: 'CheckCircle2',
      category: 'completion',
      unlocked: todayPercentage === 100 && activeHabits.length > 0,
      progress: todayPercentage,
      progressText: `${todayPercentage}% Hari Ini`,
    },
    {
      id: 'century_100',
      name: 'Century Club',
      description: 'Menyelesaikan total 100 aktivitas habit secara kumulatif',
      icon: 'Trophy',
      category: 'completion',
      unlocked: totalLogs >= 100,
      progress: Math.min(100, Math.round((totalLogs / 100) * 100)),
      progressText: `${totalLogs}/100 Checklist`,
    },
    {
      id: 'collector_4',
      name: 'Habit Collector',
      description: 'Memiliki 4 kebiasaan aktif dalam rutinitas harian',
      icon: 'Layers',
      category: 'creation',
      unlocked: activeHabits.length >= 4,
      progress: Math.min(100, Math.round((activeHabits.length / 4) * 100)),
      progressText: `${activeHabits.length}/4 Kebiasaan`,
    },
  ];
}
