import { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { HeatmapGrid } from './components/HeatmapGrid';
import { HabitCard } from './components/HabitCard';
import { HabitModal } from './components/HabitModal';
import { BadgesModal } from './components/BadgesModal';
import { HabitDetailModal } from './components/HabitDetailModal';
import { DataBackupModal } from './components/DataBackupModal';
import { DailyNotesModal } from './components/DailyNotesModal';
import { AuthModal } from './components/AuthModal';
import { EmptyState } from './components/EmptyState';
import { triggerStreakConfetti, triggerAllCompletedCelebration } from './components/Confetti';
import { sound } from './lib/sound';
import { supabase } from './lib/supabase';
import { localAdapter, supabaseAdapter } from './lib/adapter';
import { evaluateBadges } from './types/badge';
import { 
  getTodayString, calculateHabitStreak, calculateGlobalStats, 
  generateHeatmapData, getTheme, saveTheme 
} from './lib/storage';
import { Habit, HabitLog, Category } from './types/habit';
import { Filter, CheckSquare } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMuted, setIsMuted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  
  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedDetailHabit, setSelectedDetailHabit] = useState<Habit | null>(null);
  const [noteTargetHabit, setNoteTargetHabit] = useState<Habit | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Active Storage Adapter
  const activeAdapter = useMemo(() => {
    return userEmail && supabase ? supabaseAdapter : localAdapter;
  }, [userEmail]);

  // Load Data
  const refreshData = useCallback(async () => {
    const loadedHabits = await activeAdapter.getHabits();
    setHabits(loadedHabits);
    const loadedLogs = await activeAdapter.getLogs();
    setLogs(loadedLogs);
  }, [activeAdapter]);

  // Initialize data and Auth on mount
  useEffect(() => {
    const initialTheme = getTheme();
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    setIsMuted(sound.getIsMuted());

    // Check existing Supabase session
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUserEmail(session?.user?.email || null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUserEmail(session?.user?.email || null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Refresh data whenever active adapter or user changes
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Sync theme changes
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    saveTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setUserEmail(null);
    }
  };

  const todayStr = getTodayString();

  // Stats & Badges calculation
  const stats = useMemo(() => calculateGlobalStats(habits, logs), [habits, logs]);
  const badges = useMemo(() => evaluateBadges(habits, logs, stats), [habits, logs, stats]);
  const unlockedBadgesCount = useMemo(() => badges.filter((b) => b.unlocked).length, [badges]);

  // List of pending habit titles for notifications
  const pendingHabitTitles = useMemo(() => {
    return habits
      .filter((h) => !h.archived && !logs.some((l) => l.habitId === h.id && l.date === todayStr && l.completed))
      .map((h) => h.title);
  }, [habits, logs, todayStr]);

  const heatmapData = useMemo(() => generateHeatmapData(habits, logs, 91), [habits, logs]);

  // Past 7 days calculation helper for each habit card
  const past7DaysMeta = useMemo(() => {
    const days = [];
    const today = new Date();
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push({
        date: dateStr,
        dayLabel: dayNames[d.getDay()],
      });
    }
    return days;
  }, []);

  // Filtered habits
  const filteredHabits = useMemo(() => {
    const active = habits.filter((h) => !h.archived);
    if (selectedCategory === 'Semua') return active;
    return active.filter((h) => h.category === selectedCategory);
  }, [habits, selectedCategory]);

  const categoriesList = ['Semua', 'Health', 'Productivity', 'Mindfulness', 'Fitness', 'Learning', 'Creative'];

  // Toggle Habit completion for today
  const handleToggleHabitToday = async (habitId: string) => {
    const existingLogIndex = logs.findIndex((l) => l.habitId === habitId && l.date === todayStr);
    let updatedLogs: HabitLog[];
    let isNowCompleted = false;

    if (existingLogIndex >= 0) {
      const existing = logs[existingLogIndex];
      isNowCompleted = !existing.completed;
      updatedLogs = [...logs];
      updatedLogs[existingLogIndex] = {
        ...existing,
        completed: isNowCompleted,
        timestamp: new Date().toISOString(),
      };
    } else {
      isNowCompleted = true;
      const newLog: HabitLog = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${habitId}-${todayStr}`,
        habitId,
        date: todayStr,
        completed: true,
        timestamp: new Date().toISOString(),
      };
      updatedLogs = [newLog, ...logs];
    }

    setLogs(updatedLogs);
    await activeAdapter.saveLogs(updatedLogs);

    if (isNowCompleted) {
      sound.playCheckPop();
      triggerStreakConfetti();

      // Check if all active habits are completed today for celebration
      const activeHabits = habits.filter((h) => !h.archived);
      const allDone = activeHabits.every((h) => {
        if (h.id === habitId) return true;
        return updatedLogs.some((l) => l.habitId === h.id && l.date === todayStr && l.completed);
      });

      if (allDone && activeHabits.length > 1) {
        sound.playCelebrationChime();
        setTimeout(() => triggerAllCompletedCelebration(), 300);
      }
    } else {
      sound.playUncheck();
    }
  };

  // Save or Update Habit
  const handleSaveHabit = async (habitData: Partial<Habit>) => {
    let updated: Habit[];
    if (editingHabit) {
      updated = habits.map((h) => (h.id === editingHabit.id ? ({ ...h, ...habitData } as Habit) : h));
    } else {
      const newHabit: Habit = {
        id: crypto.randomUUID ? crypto.randomUUID() : `habit-${Date.now()}`,
        title: habitData.title || 'Habit Baru',
        description: habitData.description,
        category: (habitData.category as Category) || 'Health',
        color: habitData.color || 'emerald',
        icon: habitData.icon || 'Droplets',
        targetDaysPerWeek: habitData.targetDaysPerWeek || 7,
        archived: false,
        createdAt: new Date().toISOString(),
      };
      updated = [newHabit, ...habits];
      sound.playUnlockBadge();
    }

    setHabits(updated);
    await activeAdapter.saveHabits(updated);
  };

  // Save Daily Reflection Note
  const handleSaveNote = async (habitId: string, noteText: string) => {
    const existingLogIndex = logs.findIndex((l) => l.habitId === habitId && l.date === todayStr);
    let updatedLogs: HabitLog[];

    if (existingLogIndex >= 0) {
      updatedLogs = [...logs];
      updatedLogs[existingLogIndex] = {
        ...updatedLogs[existingLogIndex],
        note: noteText,
      };
    } else {
      const newLog: HabitLog = {
        id: crypto.randomUUID ? crypto.randomUUID() : `${habitId}-${todayStr}`,
        habitId,
        date: todayStr,
        completed: true,
        timestamp: new Date().toISOString(),
        note: noteText,
      };
      updatedLogs = [newLog, ...logs];
    }

    setLogs(updatedLogs);
    await activeAdapter.saveLogs(updatedLogs);
  };

  // Delete Habit
  const handleDeleteHabit = async (habitId: string) => {
    const updated = habits.filter((h) => h.id !== habitId);
    setHabits(updated);
    await activeAdapter.saveHabits(updated);
  };

  // Restore or Reset Data
  const handleRestoreData = async (newHabits: Habit[], newLogs: HabitLog[]) => {
    setHabits(newHabits);
    setLogs(newLogs);
    await activeAdapter.saveHabits(newHabits);
    await activeAdapter.saveLogs(newLogs);
  };

  const handleResetData = async () => {
    localStorage.removeItem('habitflow_habits_v1');
    localStorage.removeItem('habitflow_logs_v1');
    await refreshData();
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors pb-16">
      {/* 1. Header Navigation */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAddModal={() => {
          setEditingHabit(null);
          setIsAddEditModalOpen(true);
        }}
        onOpenBadgesModal={() => setIsBadgesModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        userEmail={userEmail}
        isMuted={isMuted}
        onToggleSound={toggleSound}
        streakCount={stats.currentStreak}
        unlockedBadgesCount={unlockedBadgesCount}
        pendingHabits={pendingHabitTitles}
      />

      {/* 2. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 sm:space-y-8">
        
        {/* Section A: Statistics Cards */}
        <section aria-label="Ringkasan Statistik">
          <StatsOverview stats={stats} />
        </section>

        {/* Section B: GitHub-Style Heatmap Grid */}
        <section aria-label="Peta Konsistensi Aktivitas">
          <HeatmapGrid data={heatmapData} />
        </section>

        {/* Section C: Daily Habits List & Filters */}
        <section aria-label="Daftar Kebiasaan Harian" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                <CheckSquare className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Kebiasaan Hari Ini
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                {filteredHabits.length}
              </span>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1 flex-shrink-0" />
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                      : 'bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid / Empty State */}
          {filteredHabits.length === 0 ? (
            <EmptyState onAddClick={() => {
              setEditingHabit(null);
              setIsAddEditModalOpen(true);
            }} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {filteredHabits.map((habit) => {
                  const todayLog = logs.find(
                    (l) => l.habitId === habit.id && l.date === todayStr
                  );
                  const isDoneToday = !!todayLog?.completed;
                  const todayNote = todayLog?.note;
                  const streak = calculateHabitStreak(habit.id, logs);
                  
                  const habit7Days = past7DaysMeta.map((day) => ({
                    date: day.date,
                    dayLabel: day.dayLabel,
                    completed: logs.some(
                      (l) => l.habitId === habit.id && l.date === day.date && l.completed
                    ),
                  }));

                  return (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      isCompletedToday={isDoneToday}
                      streak={streak}
                      past7Days={habit7Days}
                      todayNote={todayNote}
                      onToggleToday={handleToggleHabitToday}
                      onEdit={(h) => {
                        setEditingHabit(h);
                        setIsAddEditModalOpen(true);
                      }}
                      onDelete={handleDeleteHabit}
                      onViewDetail={(h) => setSelectedDetailHabit(h)}
                      onOpenNote={(h) => setNoteTargetHabit(h)}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      {/* 3. Add/Edit Habit Modal */}
      <HabitModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSave={handleSaveHabit}
        editingHabit={editingHabit}
      />

      {/* 4. Badges / Achievements Modal */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        badges={badges}
      />

      {/* 5. Habit Deep Analytics Detail Modal */}
      <HabitDetailModal
        isOpen={!!selectedDetailHabit}
        onClose={() => setSelectedDetailHabit(null)}
        habit={selectedDetailHabit}
        logs={logs}
      />

      {/* 6. Backup & Restore Data Modal */}
      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        habits={habits}
        logs={logs}
        onRestoreData={handleRestoreData}
        onResetData={handleResetData}
      />

      {/* 7. Daily Reflection Note Modal */}
      <DailyNotesModal
        isOpen={!!noteTargetHabit}
        onClose={() => setNoteTargetHabit(null)}
        habit={noteTargetHabit}
        currentNote={logs.find((l) => l.habitId === noteTargetHabit?.id && l.date === todayStr)?.note}
        onSaveNote={handleSaveNote}
      />

      {/* 8. Supabase Auth / Cloud Sync Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        userEmail={userEmail}
        onSignOut={handleSignOut}
      />
    </div>
  );
}

export default App;
