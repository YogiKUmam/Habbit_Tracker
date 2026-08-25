import { Habit, HabitLog } from '../types/habit';
import { loadHabits, saveHabits, loadLogs, saveLogs } from './storage';

export interface StorageAdapter {
  getHabits(): Promise<Habit[]>;
  saveHabits(habits: Habit[]): Promise<void>;
  getLogs(): Promise<HabitLog[]>;
  saveLogs(logs: HabitLog[]): Promise<void>;
}

// 1. LocalStorage Implementation
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

// 2. Cloud Sync Adapter (Blueprint for Supabase / REST API)
export class CloudSyncAdapter implements StorageAdapter {
  private apiUrl: string;
  private token: string;

  constructor(apiUrl: string, token: string) {
    this.apiUrl = apiUrl;
    this.token = token;
  }

  async getHabits(): Promise<Habit[]> {
    // Blueprint for fetching from remote endpoint
    const response = await fetch(`${this.apiUrl}/habits`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    if (!response.ok) return loadHabits();
    return response.json();
  }

  async saveHabits(habits: Habit[]): Promise<void> {
    saveHabits(habits); // Keep local cache
    await fetch(`${this.apiUrl}/habits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(habits),
    });
  }

  async getLogs(): Promise<HabitLog[]> {
    const response = await fetch(`${this.apiUrl}/logs`, {
      headers: { Authorization: `Bearer ${this.token}` },
    });
    if (!response.ok) return loadLogs(loadHabits());
    return response.json();
  }

  async saveLogs(logs: HabitLog[]): Promise<void> {
    saveLogs(logs); // Keep local cache
    await fetch(`${this.apiUrl}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(logs),
    });
  }
}

export const defaultStorage = new LocalStorageAdapter();
