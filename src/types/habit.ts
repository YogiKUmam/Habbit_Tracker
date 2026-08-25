import { z } from 'zod';

export const CategorySchema = z.enum([
  'Health',
  'Productivity',
  'Mindfulness',
  'Fitness',
  'Learning',
  'Creative'
]);
export type Category = z.infer<typeof CategorySchema>;

export type ColorTheme = 'emerald' | 'blue' | 'violet' | 'amber' | 'rose' | 'cyan';

export const HabitSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Nama kebiasaan wajib diisi'),
  description: z.string().optional(),
  category: CategorySchema,
  color: z.string(),
  icon: z.string(),
  targetDaysPerWeek: z.number().min(1).max(7).default(7),
  archived: z.boolean().default(false),
  createdAt: z.string(),
  // Focus / Routine Timer additions
  durationMinutes: z.number().min(1).max(180).optional(),
  timerEnabled: z.boolean().optional(),
});
export type Habit = z.infer<typeof HabitSchema>;

export const HabitLogSchema = z.object({
  id: z.string(),
  habitId: z.string(),
  date: z.string(), // YYYY-MM-DD
  completed: z.boolean(),
  timestamp: z.string(),
  note: z.string().optional(), // Reflection note
});
export type HabitLog = z.infer<typeof HabitLogSchema>;

export interface DayActivity {
  date: string; // YYYY-MM-DD
  count: number;
  totalHabits: number;
  intensity: 0 | 1 | 2 | 3 | 4; // 0 = none, 1 = 1-25%, 2 = 26-50%, 3 = 51-75%, 4 = 76-100%
}

export interface HabitStats {
  totalHabits: number;
  todayCompleted: number;
  todayTotal: number;
  todayPercentage: number;
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
}
