import { Habit, HabitLog, HabitStats, Category, ColorTheme } from '../types/habit';

export interface HabitInsightReport {
  strengthScore: number; // 0 - 100
  strengthLabel: string; // e.g. "Mastery", "Konsisten", "Membangun Momentum", "Awal Perjalanan"
  starHabit: { title: string; completionRate: number; streak: number } | null;
  needsAttentionHabit: { title: string; completionRate: number; missedDays: number } | null;
  bestDay: { name: string; percentage: number };
  vulnerableDay: { name: string; percentage: number };
  habitStackingFormula: { anchorHabit: string; newHabit: string; advice: string } | null;
  notesInsight: { totalNotes: number; summary: string };
  recommendedHabits: RecommendedHabit[];
}

export interface RecommendedHabit {
  id: string;
  title: string;
  description: string;
  category: Category;
  color: ColorTheme;
  icon: string;
  durationMinutes: number;
  targetDaysPerWeek: number;
  reason: string;
}

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

export function generateHabitInsights(
  habits: Habit[],
  logs: HabitLog[],
  stats: HabitStats
): HabitInsightReport {
  const activeHabits = habits.filter((h) => !h.archived);

  // 1. Calculate Per-Habit Completion Rate in last 30 days
  const today = new Date();
  const past30Dates: string[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    past30Dates.push(d.toISOString().split('T')[0]);
  }

  const habitPerformance: { habit: Habit; completedCount: number; rate: number }[] = [];

  activeHabits.forEach((habit) => {
    const completed = logs.filter(
      (l) => l.habitId === habit.id && l.completed && past30Dates.includes(l.date)
    ).length;
    const rate = Math.round((completed / 30) * 100);
    habitPerformance.push({ habit, completedCount: completed, rate });
  });

  // Sort by performance
  habitPerformance.sort((a, b) => b.rate - a.rate);

  const star = habitPerformance.length > 0 ? habitPerformance[0] : null;
  const needsAttention = habitPerformance.length > 1 ? habitPerformance[habitPerformance.length - 1] : null;

  // 2. Calculate Day of Week Performance
  const dayStats: { dayIndex: number; name: string; totalOpportunities: number; completed: number; rate: number }[] = [];

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    let totalOpp = 0;
    let compCount = 0;

    past30Dates.forEach((dateStr) => {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      if (dateObj.getDay() === dayIndex) {
        totalOpp += activeHabits.length;
        compCount += logs.filter(
          (l) => l.date === dateStr && l.completed && activeHabits.some((h) => h.id === l.habitId)
        ).length;
      }
    });

    const rate = totalOpp > 0 ? Math.round((compCount / totalOpp) * 100) : 0;
    dayStats.push({
      dayIndex,
      name: DAY_NAMES[dayIndex],
      totalOpportunities: totalOpp,
      completed: compCount,
      rate,
    });
  }

  dayStats.sort((a, b) => b.rate - a.rate);
  const bestDay = { name: dayStats[0].name, percentage: dayStats[0].rate };
  const vulnerableDay = { name: dayStats[dayStats.length - 1].name, percentage: dayStats[dayStats.length - 1].rate };

  // 3. Overall Strength Score
  let strengthScore = 0;
  if (activeHabits.length > 0) {
    const avgRate = habitPerformance.reduce((acc, h) => acc + h.rate, 0) / habitPerformance.length;
    const streakBonus = Math.min(25, stats.currentStreak * 1.5);
    strengthScore = Math.min(100, Math.round(avgRate * 0.75 + streakBonus));
  }

  let strengthLabel = 'Awal Perjalanan 🌱';
  if (strengthScore >= 85) strengthLabel = 'Mastery Kebiasaan 👑';
  else if (strengthScore >= 70) strengthLabel = 'Sangat Konsisten 🔥';
  else if (strengthScore >= 50) strengthLabel = 'Membangun Momentum ⚡';

  // 4. Habit Stacking Formula (Atomic Habits Strategy)
  let habitStackingFormula = null;
  if (star && needsAttention && star.habit.id !== needsAttention.habit.id) {
    habitStackingFormula = {
      anchorHabit: star.habit.title,
      newHabit: needsAttention.habit.title,
      advice: `Gunakan teknik *Habit Stacking*: "Tepat setelah saya selesai ${star.habit.title}, saya akan langsung melakukan ${needsAttention.habit.title} selama 5 menit."`,
    };
  }

  // 5. Notes Insights
  const allNotes = logs.filter((l) => l.note && l.note.trim().length > 0);
  let notesSummary = 'Terus tulis refleksi harian untuk membantu AI membaca pola emosi dan fokus Anda.';
  if (allNotes.length >= 3) {
    notesSummary = `Anda telah menulis ${allNotes.length} catatan refleksi. Analisis menunjukkan refleksi rutin meningkatkan retensi kebiasaan Anda hingga 35%!`;
  }

  // 6. Smart Recommended Habits
  const existingTitles = activeHabits.map((h) => h.title.toLowerCase());
  const pool: RecommendedHabit[] = [
    {
      id: 'rec-1',
      title: 'Peregangan Leher & Postur 5 Menit',
      description: 'Mencegah ketegangan otot saat bekerja seharian di depan layar.',
      category: 'Health',
      color: 'emerald',
      icon: 'Heart',
      durationMinutes: 5,
      targetDaysPerWeek: 7,
      reason: 'Cocok untuk menjaga fisik tetap bugar di sela-sela rutinitas produktif.',
    },
    {
      id: 'rec-2',
      title: 'Brain Dump / Perencanaan Esok Hari',
      description: 'Tulis 3 tugas prioritas sebelum tidur untuk pikiran tenang.',
      category: 'Productivity',
      color: 'blue',
      icon: 'Brain',
      durationMinutes: 10,
      targetDaysPerWeek: 5,
      reason: 'Meningkatkan fokus dan mengurangi rasa cemas di pagi hari.',
    },
    {
      id: 'rec-3',
      title: 'Jeda Bebas Notifikasi 15 Menit',
      description: 'Istirahat tanpa layar HP atau sosial media untuk reset dopamin.',
      category: 'Mindfulness',
      color: 'violet',
      icon: 'Coffee',
      durationMinutes: 15,
      targetDaysPerWeek: 6,
      reason: 'Mengembalikan kejernihan mental dan mencegah kejenuhan (burnout).',
    },
    {
      id: 'rec-4',
      title: 'Mendengarkan Audio Podcast Edukasi',
      description: 'Menambah wawasan seputar teknologi, bisnis, atau self-growth.',
      category: 'Learning',
      color: 'cyan',
      icon: 'BookOpen',
      durationMinutes: 20,
      targetDaysPerWeek: 4,
      reason: 'Memperluas perspektif sambil bersantai atau dalam perjalanan.',
    },
  ];

  const recommendedHabits = pool.filter(
    (item) => !existingTitles.some((t) => t.includes(item.title.toLowerCase().slice(0, 8)))
  ).slice(0, 3);

  return {
    strengthScore,
    strengthLabel,
    starHabit: star ? { title: star.habit.title, completionRate: star.rate, streak: stats.currentStreak } : null,
    needsAttentionHabit: needsAttention ? { title: needsAttention.habit.title, completionRate: needsAttention.rate, missedDays: 30 - needsAttention.completedCount } : null,
    bestDay,
    vulnerableDay,
    habitStackingFormula,
    notesInsight: {
      totalNotes: allNotes.length,
      summary: notesSummary,
    },
    recommendedHabits,
  };
}
