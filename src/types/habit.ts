import { z } from 'zod';

export const CategoryEnum = z.enum([
  'Health',
  'Productivity',
  'Mindfulness',
  'Fitness',
  'Learning',
  'Creative',
]);
export type Category = z.infer<typeof CategoryEnum>;

export const ColorThemeEnum = z.enum([
  'emerald',
  'blue',
  'violet',
  'amber',
  'rose',
  'cyan',
]);
export type ColorTheme = z.infer<typeof ColorThemeEnum>;

export const HabitSchema = z.object({
  id: z.string(),
  title: z.string().min(2, 'Judul minimal 2 karakter').max(50, 'Judul maksimal 50 karakter'),
  description: z.string().max(150, 'Deskripsi maksimal 150 karakter').optional(),
  category: CategoryEnum,
  color: ColorThemeEnum,
  icon: z.string().min(1),
  targetDaysPerWeek: z.number().int().min(1).max(7).default(7),
  archived: z.boolean().default(false),
  createdAt: z.string(), // ISO String
});

export type Habit = z.infer<typeof HabitSchema>;

export const HabitLogSchema = z.object({
  id: z.string(),
  habitId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal YYYY-MM-DD'),
  completed: z.boolean(),
  timestamp: z.string(),
  note: z.string().max(300, 'Catatan maksimal 300 karakter').optional(),
});

export type HabitLog = z.infer<typeof HabitLogSchema>;

export interface DayActivity {
  date: string; // YYYY-MM-DD
  count: number;
  totalHabits: number;
  intensity: 0 | 1 | 2 | 3 | 4; // 0: none, 1: low, 2: med, 3: high, 4: max
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
