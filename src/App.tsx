import { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { FeatureHub } from './components/FeatureHub';
import { StatsOverview } from './components/StatsOverview';
import { HeatmapGrid } from './components/HeatmapGrid';
import { HabitCard } from './components/HabitCard';
import { HabitModal } from './components/HabitModal';
import { BadgesModal } from './components/BadgesModal';
import { HabitDetailModal } from './components/HabitDetailModal';
import { DataBackupModal } from './components/DataBackupModal';
import { DailyNotesModal } from './components/DailyNotesModal';
import { HabitTimerModal } from './components/HabitTimerModal';
import { StreakFreezeModal } from './components/StreakFreezeModal';
import { ShareCardModal } from './components/ShareCardModal';
import { AICoachModal } from './components/AICoachModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';
import { EmptyState } from './components/EmptyState';
import { triggerStreakConfetti, triggerAllCompletedCelebration } from './components/Confetti';
import { sound } from './lib/sound';
import { supabase } from './lib/supabase';
import { localAdapter, supabaseAdapter } from './lib/adapter';
import { evaluateBadges } from './types/badge';
import { RecommendedHabit } from './lib/aiCoach';
import { UserProfile, loadUserProfile, calculateUserLevel, getCommunityLeaderboard } from './lib/leaderboard';
import { 
  loadHabits, loadLogs, loadFreezeState, saveFreezeState, 
  getTodayString, calculateHabitStreak, calculateGlobalStats, 
  generateHeatmapData, getTheme, saveTheme 
} from './lib/storage';
import { Habit, HabitLog, Category, StreakFreezeState } from './types/habit';
import { Filter, CheckSquare } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export function App() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());
  const [logs, setLogs] = useState<HabitLog[]>(() => loadLogs(loadHabits()));
  const [freezeState, setFreezeState] = useState<StreakFreezeState>(() => loadFreezeState());
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isMuted, setIsMuted] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadUserProfile());
  
  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAICoachModalOpen, setIsAICoachModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  const [shareTargetHabit, setShareTargetHabit] = useState<Habit | null>(null);
  const [selectedDetailHabit, setSelectedDetailHabit] = useState<Habit | null>(null);
  const [noteTargetHabit, setNoteTargetHabit] = useState<Habit | null>(null);
  const [activeTimerHabit, setActiveTimerHabit] = useState<Habit | null>(null);

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

    // Check existing Supabase session and subscribe to Realtime sync
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        const email = session?.user?.email || null;
        setUserEmail(email);
        if (email) {
          setUserProfile((prev) => ({
            ...prev,
            name: prev.name === 'Habit Champion' ? email.split('@')[0] : prev.name,
          }));
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        const email = session?.user?.email || null;
        setUserEmail(email);
        if (email) {
          setUserProfile((prev) => ({
            ...prev,
            name: prev.name === 'Habit Champion' ? email.split('@')[0] : prev.name,
          }));
        }
      });

      // Realtime multi-device sync channel
      const channel = supabase
        .channel('habitflow-realtime-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'habits' }, () => {
          refreshData();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'habit_logs' }, () => {
          refreshData();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
        supabase?.removeChannel(channel);
      };
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

  // Streak Freeze handlers
  const handleToggleFreezeEquip = () => {
    const updated: StreakFreezeState = {
      ...freezeState,
      isEquipped: !freezeState.isEquipped,
    };
    setFreezeState(updated);
    saveFreezeState(updated);
  };

  const handleAddFreeze = () => {
    const updated: StreakFreezeState = {
      ...freezeState,
      availableFreezes: freezeState.availableFreezes + 1,
    };
    setFreezeState(updated);
    saveFreezeState(updated);
    sound.playUnlockBadge();
  };

  const todayStr = getTodayString();

  // Stats & Badges calculation
  const stats = useMemo(() => calculateGlobalStats(habits, logs, freezeState), [habits, logs, freezeState]);
  const badges = useMemo(() => evaluateBadges(habits, logs, stats), [habits, logs, stats]);
  const unlockedBadgesCount = useMemo(() => badges.filter((b) => b.unlocked).length, [badges]);
  const userLevel = useMemo(() => calculateUserLevel(stats, badges), [stats, badges]);

  // Current User Rank in Leaderboard
  const userRank = useMemo(() => {
    const lb = getCommunityLeaderboard(userProfile, stats, badges, 'streak');
    const idx = lb.findIndex((m) => m.isCurrentUser);
    return idx >= 0 ? idx + 1 : 1;
  }, [userProfile, stats, badges]);

  // List of pending habit titles for notifications
  const pendingHabitTitles = useMemo(() => {
    return habits
      .filter((h) => !h.archived && !logs.some((l) => l.habitId === h.id && l.date === todayStr && l.completed))
      .map((h) => h.title);
  }, [habits, logs, todayStr]);

  const heatmapData = useMemo(() => generateHeatmapData(habits, logs, 91, freezeState), [habits, logs, freezeState]);

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

  // Auto-complete habit from Timer
  const handleCompleteHabitFromTimer = async (habitId: string) => {
    const alreadyDone = logs.some((l) => l.habitId === habitId && l.date === todayStr && l.completed);
    if (!alreadyDone) {
      await handleToggleHabitToday(habitId);
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
        durationMinutes: habitData.durationMinutes || 15,
        timerEnabled: true,
        activeDays: habitData.activeDays || [0, 1, 2, 3, 4, 5, 6],
        archived: false,
        createdAt: new Date().toISOString(),
      };
      updated = [newHabit, ...habits];
      sound.playUnlockBadge();
    }

    setHabits(updated);
    await activeAdapter.saveHabits(updated);
  };

  // Add Recommended Habit from AI Coach
  const handleAddRecommendedHabit = async (rec: RecommendedHabit) => {
    const newHabit: Habit = {
      id: crypto.randomUUID ? crypto.randomUUID() : `habit-ai-${Date.now()}`,
      title: rec.title,
      description: rec.description,
      category: rec.category,
      color: rec.color,
      icon: rec.icon,
      targetDaysPerWeek: rec.targetDaysPerWeek,
      durationMinutes: rec.durationMinutes,
      timerEnabled: true,
      activeDays: [0, 1, 2, 3, 4, 5, 6],
      archived: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newHabit, ...habits];
    setHabits(updated);
    await activeAdapter.saveHabits(updated);
    sound.playUnlockBadge();
    triggerStreakConfetti();
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
    localStorage.removeItem('habitflow_freeze_v1');
    localStorage.removeItem('habitflow_profile_v1');
    await refreshData();
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors pb-16">
      
      {/* 1. Sleek Minimalist Header */}
      <Navbar
        onOpenAddModal={() => {
          setEditingHabit(null);
          setIsAddEditModalOpen(true);
        }}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        streakCount={stats.currentStreak}
        userLevel={userLevel}
        userName={userProfile.name}
      />

      {/* 2. Main Container with Fluid Spacing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 sm:space-y-8">
        
        {/* Section A: Feature Navigation Hub (Aesthetic Dock) */}
        <FeatureHub
          onOpenAICoach={() => setIsAICoachModalOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardModalOpen(true)}
          onOpenShare={() => {
            setShareTargetHabit(null);
            setIsShareModalOpen(true);
          }}
          onOpenFreeze={() => setIsFreezeModalOpen(true)}
          onOpenBadges={() => setIsBadgesModalOpen(true)}
          freezeCount={freezeState.availableFreezes}
          unlockedBadgesCount={unlockedBadgesCount}
          userRank={userRank}
        />

        {/* Section B: Statistics Glassmorphic Cards */}
        <section aria-label="Ringkasan Statistik">
          <StatsOverview stats={stats} />
        </section>

        {/* Section C: GitHub-Style Heatmap Grid */}
        <section aria-label="Peta Konsistensi Aktivitas">
          <HeatmapGrid data={heatmapData} />
        </section>

        {/* Section D: Daily Habits List & Filters */}
        <section aria-label="Daftar Kebiasaan Harian" className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
                <CheckSquare className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                    Kebiasaan Hari Ini
                  </h2>
                  <span className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-secondary text-muted-foreground border border-border/60">
                    {filteredHabits.length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium hidden sm:block">
                  Centang untuk menyelesaikan target harian Anda
                </p>
              </div>
            </div>

            {/* Category Filter Pills Capsule */}
            <div className="flex items-center gap-1.5 p-1 bg-secondary/60 rounded-full border border-border/40 overflow-x-auto max-w-full">
              <Filter className="h-3.5 w-3.5 text-muted-foreground ml-2 mr-0.5 flex-shrink-0" />
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`tactile-btn px-3.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-card text-foreground font-bold shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-border/80'
                      : 'text-muted-foreground hover:text-foreground'
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <AnimatePresence>
                {filteredHabits.map((habit) => {
                  const todayLog = logs.find(
                    (l) => l.habitId === habit.id && l.date === todayStr
                  );
                  const isDoneToday = !!todayLog?.completed;
                  const todayNote = todayLog?.note;
                  const streak = calculateHabitStreak(habit.id, logs, habit, freezeState);
                  
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
                      onStartTimer={(h) => setActiveTimerHabit(h)}
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
        onOpenShare={(h) => {
          setShareTargetHabit(h);
          setIsShareModalOpen(true);
        }}
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

      {/* 9. Focus & Routine Timer Modal */}
      <HabitTimerModal
        isOpen={!!activeTimerHabit}
        onClose={() => setActiveTimerHabit(null)}
        habit={activeTimerHabit}
        onCompleteHabit={handleCompleteHabitFromTimer}
        onOpenNote={(h) => setNoteTargetHabit(h)}
      />

      {/* 10. Streak Freeze Modal */}
      <StreakFreezeModal
        isOpen={isFreezeModalOpen}
        onClose={() => setIsFreezeModalOpen(false)}
        freezeState={freezeState}
        onToggleEquip={handleToggleFreezeEquip}
        onAddFreeze={handleAddFreeze}
      />

      {/* 11. Shareable Progress Graphic Card Modal */}
      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => {
          setIsShareModalOpen(false);
          setShareTargetHabit(null);
        }}
        stats={stats}
        habits={habits}
        targetHabit={shareTargetHabit}
        heatmapData={heatmapData}
        userEmail={userEmail}
      />

      {/* 12. AI Habit Coach Modal */}
      <AICoachModal
        isOpen={isAICoachModalOpen}
        onClose={() => setIsAICoachModalOpen(false)}
        habits={habits}
        logs={logs}
        stats={stats}
        onAddRecommendedHabit={handleAddRecommendedHabit}
      />

      {/* 13. Community Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardModalOpen}
        onClose={() => setIsLeaderboardModalOpen(false)}
        userProfile={userProfile}
        stats={stats}
        badges={badges}
      />

      {/* 14. User Profile & Level Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        stats={stats}
        badges={badges}
        onSaveProfile={(p) => setUserProfile(p)}
        userEmail={userEmail}
      />

      {/* 15. Centralized Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        isMuted={isMuted}
        onToggleSound={toggleSound}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        userEmail={userEmail}
        onSignOut={handleSignOut}
        pendingHabits={pendingHabitTitles}
      />
    </div>
  );
}

export default App;
