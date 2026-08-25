import { Habit, HabitLog } from '../types/habit';
import { loadHabits, saveHabits, loadLogs, saveLogs } from './storage';
import { supabase } from './supabase';

export interface StorageAdapter {
  getHabits(): Promise<Habit[]>;
  saveHabits(habits: Habit[]): Promise<void>;
  getLogs(): Promise<HabitLog[]>;
  saveLogs(logs: HabitLog[]): Promise<void>;
}

// 1. LocalStorage Implementation (Default & Offline)
export class LocalStorageAdapter implements StorageAdapter {
  async getHabits(): Promise<Habit[]> {
    return loadHabits();
  }

  async saveHabits(habits: Habit[]): Promise<void> {
    saveHabits(habits);
  }

  async getLogs(): Promise<HabitLog[]> {
    const habits = loadHabits();
    return loadLogs(habits);
  }

  async saveLogs(logs: HabitLog[]): Promise<void> {
    saveLogs(logs);
  }
}

// 2. Supabase PostgreSQL Cloud Sync Adapter
export class SupabaseStorageAdapter implements StorageAdapter {
  async getHabits(): Promise<Habit[]> {
    if (!supabase) return loadHabits();
    try {
      const { data, error } = await supabase.from('habits').select('*').order('created_at', { ascending: false });
      if (error || !data) {
        console.warn('Failed to fetch habits from Supabase, falling back to local storage:', error);
        return loadHabits();
      }

      // Map database snake_case to frontend camelCase
      const mapped: Habit[] = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        color: item.color,
        icon: item.icon,
        targetDaysPerWeek: item.target_days_per_week,
        archived: item.archived,
        createdAt: item.created_at,
        durationMinutes: item.duration_minutes || 15,
        timerEnabled: item.timer_enabled ?? true,
      }));

      // Cache locally for offline availability
      saveHabits(mapped);
      return mapped;
    } catch {
      return loadHabits();
    }
  }

  async saveHabits(habits: Habit[]): Promise<void> {
    saveHabits(habits); // Cache local
    if (!supabase) return;

    try {
      const payload = habits.map((h) => ({
        id: h.id,
        title: h.title,
        description: h.description,
        category: h.category,
        color: h.color,
        icon: h.icon,
        target_days_per_week: h.targetDaysPerWeek,
        archived: h.archived,
        created_at: h.createdAt,
      }));

      await supabase.from('habits').upsert(payload);
    } catch (e) {
      console.error('Supabase saveHabits error:', e);
    }
  }

  async getLogs(): Promise<HabitLog[]> {
    if (!supabase) return loadLogs(loadHabits());
    try {
      const { data, error } = await supabase.from('habit_logs').select('*');
      if (error || !data) {
        console.warn('Failed to fetch logs from Supabase, falling back to local storage:', error);
        return loadLogs(loadHabits());
      }

      const mapped: HabitLog[] = data.map((item: any) => ({
        id: item.id,
        habitId: item.habit_id,
        date: item.date,
        completed: item.completed,
        timestamp: item.timestamp,
        note: item.note,
      }));

      saveLogs(mapped);
      return mapped;
    } catch {
      return loadLogs(loadHabits());
    }
  }

  async saveLogs(logs: HabitLog[]): Promise<void> {
    saveLogs(logs); // Cache local
    if (!supabase) return;

    try {
      const payload = logs.map((l) => ({
        id: l.id,
        habit_id: l.habitId,
        date: l.date,
        completed: l.completed,
        timestamp: l.timestamp,
        note: l.note,
      }));

      await supabase.from('habit_logs').upsert(payload);
    } catch (e) {
      console.error('Supabase saveLogs error:', e);
    }
  }
}

export const localAdapter = new LocalStorageAdapter();
export const supabaseAdapter = new SupabaseStorageAdapter();
