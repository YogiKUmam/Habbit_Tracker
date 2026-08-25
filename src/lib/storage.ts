import { Habit, HabitLog, HabitSchema, HabitLogSchema, HabitStats, DayActivity } from '../types/habit';

const HABITS_KEY = 'habitflow_habits_v1';
const LOGS_KEY = 'habitflow_logs_v1';
const THEME_KEY = 'habitflow_theme_v1';

export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateToIndonesian(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

// Initial seed habits
const INITIAL_HABITS: Habit[] = [
  {
    id: 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    title: 'Minum 2L Air Putih',
    description: 'Menjaga hidrasi tubuh sepanjang hari',
    category: 'Health',
    color: 'cyan',
    icon: 'Droplets',
    targetDaysPerWeek: 7,
    archived: false,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'b2c3d4e5-f6a7-4b6c-9d0e-1f2a3b4c5d6e',
    title: 'Membaca Buku 15 Menit',
    description: 'Pengembangan diri atau buku non-fiksi',
    category: 'Learning',
    color: 'violet',
    icon: 'BookOpen',
    targetDaysPerWeek: 5,
    archived: false,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'c3d4e5f6-a7b8-4c7d-0e1f-2a3b4c5d6e7f',
    title: 'Olahraga / Stretching Ringan',
    description: 'Peregangan tubuh dan push-up/plank',
    category: 'Fitness',
    color: 'emerald',
    icon: 'Dumbbell',
    targetDaysPerWeek: 6,
    archived: false,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'd4e5f6a7-b8c9-4d8e-1f2a-3b4c5d6e7f8a',
    title: 'Deep Work Coding 1 Jam',
    description: 'Fokus coding tanpa distraksi media sosial',
    category: 'Productivity',
    color: 'blue',
    icon: 'Code2',
    targetDaysPerWeek: 5,
    archived: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Generate synthetic logs for the past 60 days
function generateSeedLogs(habits: Habit[]): HabitLog[] {
  const logs: HabitLog[] = [];
  const today = new Date();

  for (let i = 0; i < 60; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    habits.forEach((habit, habitIdx) => {
      // Simulate realistic consistency pattern (higher probability for older days)
      const dayOfWeek = d.getDay(); // 0 is Sunday
      let probability = 0.75;
      if (dayOfWeek === 0 || dayOfWeek === 6) probability = 0.55;
      if (habitIdx === 0) probability = 0.85; // Water drink habit is very consistent

      if (Math.random() < probability) {
        logs.push({
          id: crypto.randomUUID ? crypto.randomUUID() : `${habit.id}-${dateStr}`,
          habitId: habit.id,
          date: dateStr,
          completed: true,
          timestamp: d.toISOString(),
        });
      }
    });
  }

  return logs;
}

export function loadHabits(): Habit[] {
  try {
    const stored = localStorage.getItem(HABITS_KEY);
    if (!stored) {
      saveHabits(INITIAL_HABITS);
      return INITIAL_HABITS;
    }
    const parsed = JSON.parse(stored);
    const valid = Array.isArray(parsed) ? parsed.filter((item) => HabitSchema.safeParse(item).success) : [];
    if (valid.length === 0) {
      saveHabits(INITIAL_HABITS);
      return INITIAL_HABITS;
    }
    return valid;
  } catch {
    saveHabits(INITIAL_HABITS);
    return INITIAL_HABITS;
  }
}

export function saveHabits(habits: Habit[]): void {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

export function loadLogs(habits: Habit[]): HabitLog[] {
  try {
    const stored = localStorage.getItem(LOGS_KEY);
    if (!stored) {
      const seed = generateSeedLogs(habits);
      saveLogs(seed);
      return seed;
    }
    const parsed = JSON.parse(stored);
    const valid = Array.isArray(parsed) ? parsed.filter((item) => HabitLogSchema.safeParse(item).success) : [];
    if (valid.length === 0) {
      const seed = generateSeedLogs(habits);
      saveLogs(seed);
      return seed;
    }
    return valid;
  } catch {
    const seed = generateSeedLogs(habits);
    saveLogs(seed);
    return seed;
  }
}

export function saveLogs(logs: HabitLog[]): void {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

export function calculateHabitStreak(habitId: string, logs: HabitLog[]): { current: number; best: number } {
  const habitLogs = logs
    .filter((l) => l.habitId === habitId && l.completed)
    .map((l) => l.date)
    .sort()
    .reverse();

  if (habitLogs.length === 0) return { current: 0, best: 0 };

  const logSet = new Set(habitLogs);
  const today = getTodayString();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let current = 0;
  let cursor = logSet.has(today) ? new Date(today) : logSet.has(yesterday) ? new Date(yesterday) : null;

  if (cursor) {
    while (true) {
      const dateStr = cursor.toISOString().split('T')[0];
      if (logSet.has(dateStr)) {
        current++;
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate best historical streak
  const sortedAsc = Array.from(logSet).sort();
  let best = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dStr of sortedAsc) {
    const currDate = new Date(dStr);
    if (prevDate) {
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    if (tempStreak > best) best = tempStreak;
    prevDate = currDate;
  }

  return { current, best: Math.max(best, current) };
}

export function calculateGlobalStats(habits: Habit[], logs: HabitLog[]): HabitStats {
  const activeHabits = habits.filter((h) => !h.archived);
  const today = getTodayString();
  
  const todayCompletedCount = logs.filter(
    (l) => l.date === today && l.completed && activeHabits.some((h) => h.id === l.habitId)
  ).length;

  const totalCompletions = logs.filter((l) => l.completed).length;

  let maxCurrentStreak = 0;
  let maxBestStreak = 0;

  activeHabits.forEach((habit) => {
    const { current, best } = calculateHabitStreak(habit.id, logs);
    if (current > maxCurrentStreak) maxCurrentStreak = current;
    if (best > maxBestStreak) maxBestStreak = best;
  });

  const percentage = activeHabits.length > 0 
    ? Math.round((todayCompletedCount / activeHabits.length) * 100) 
    : 0;

  return {
    totalHabits: activeHabits.length,
    todayCompleted: todayCompletedCount,
    todayTotal: activeHabits.length,
    todayPercentage: percentage,
    currentStreak: maxCurrentStreak,
    bestStreak: maxBestStreak,
    totalCompletions,
  };
}

export function generateHeatmapData(habits: Habit[], logs: HabitLog[], totalDays: number = 90): DayActivity[] {
  const activeHabits = habits.filter((h) => !h.archived);
  const totalCount = activeHabits.length || 1;
  const result: DayActivity[] = [];
  const today = new Date();

  // Create lookup map of completed count per date
  const completedByDate = new Map<string, number>();
  logs.forEach((log) => {
    if (log.completed) {
      completedByDate.set(log.date, (completedByDate.get(log.date) || 0) + 1);
    }
  });

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = completedByDate.get(dateStr) || 0;
    const ratio = count / totalCount;

    let intensity: 0 | 1 | 2 | 3 | 4 = 0;
    if (count > 0) {
      if (ratio <= 0.25) intensity = 1;
      else if (ratio <= 0.5) intensity = 2;
      else if (ratio <= 0.75) intensity = 3;
      else intensity = 4;
    }

    result.push({
      date: dateStr,
      count,
      totalHabits: totalCount,
      intensity,
    });
  }

  return result;
}

export function getTheme(): 'dark' | 'light' {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return 'dark';
}

export function saveTheme(theme: 'dark' | 'light'): void {
  localStorage.setItem(THEME_KEY, theme);
}
