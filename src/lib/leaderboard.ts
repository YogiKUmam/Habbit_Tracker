import { HabitStats } from '../types/habit';
import { Badge } from '../types/badge';

export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl?: string;
  favoriteHabit?: string;
}

export interface UserLevelInfo {
  level: number;
  levelTitle: string;
  currentXP: number;
  nextLevelXP: number;
  progressPercent: number;
}

export interface LeaderboardMember {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  totalCompletions: number;
  badgesCount: number;
  level: number;
  levelTitle: string;
  isCurrentUser?: boolean;
}

const PROFILE_KEY = 'habitflow_profile_v1';

export function loadUserProfile(userEmail?: string | null): UserProfile {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // fallback
  }

  const defaultName = userEmail ? userEmail.split('@')[0] : 'Habit Champion';
  return {
    name: defaultName,
    bio: 'Membangun kebiasaan positif satu hari demi satu hari 🚀',
    favoriteHabit: 'Minum 2L Air Putih',
  };
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// Calculate User XP and Level
export function calculateUserLevel(stats: HabitStats, badges: Badge[]): UserLevelInfo {
  const unlockedBadges = badges.filter((b) => b.unlocked).length;

  // XP Formula:
  // - 25 XP per completion
  // - 50 XP per streak day
  // - 150 XP per badge unlocked
  const currentXP = (stats.totalCompletions * 25) + (stats.currentStreak * 50) + (unlockedBadges * 150);

  // Level formula: Level = Math.floor(Math.sqrt(currentXP / 100)) + 1
  const level = Math.max(1, Math.floor(Math.sqrt(currentXP / 120)) + 1);
  const nextLevelXP = Math.pow(level, 2) * 120;
  const currentLevelBaseXP = Math.pow(level - 1, 2) * 120;

  const progressPercent = Math.min(
    100,
    Math.round(((currentXP - currentLevelBaseXP) / (nextLevelXP - currentLevelBaseXP)) * 100)
  );

  let levelTitle = 'Pemula Berkomitmen 🌱';
  if (level >= 10) levelTitle = 'Legenda HabitFlow 🌟';
  else if (level >= 7) levelTitle = 'Master Kebiasaan 👑';
  else if (level >= 5) levelTitle = 'Pejuang Konsistensi 🔥';
  else if (level >= 3) levelTitle = 'Pembangun Rutinitas ⚡';

  return {
    level,
    levelTitle,
    currentXP,
    nextLevelXP,
    progressPercent: isNaN(progressPercent) ? 0 : progressPercent,
  };
}

// Community Roster Mock Data
const COMMUNITY_ROSTER: Omit<LeaderboardMember, 'isCurrentUser'>[] = [
  {
    id: 'comm-1',
    name: 'Sarah Kautsar',
    avatar: '👩‍💻',
    streak: 42,
    totalCompletions: 184,
    badgesCount: 8,
    level: 8,
    levelTitle: 'Master Kebiasaan 👑',
  },
  {
    id: 'comm-2',
    name: 'Dimas Prasetyo',
    avatar: '🏃‍♂️',
    streak: 28,
    totalCompletions: 142,
    badgesCount: 6,
    level: 6,
    levelTitle: 'Pejuang Konsistensi 🔥',
  },
  {
    id: 'comm-3',
    name: 'Alya Rahma',
    avatar: '🧘‍♀️',
    streak: 21,
    totalCompletions: 110,
    badgesCount: 5,
    level: 5,
    levelTitle: 'Pejuang Konsistensi 🔥',
  },
  {
    id: 'comm-4',
    name: 'Budi Santoso',
    avatar: '👨‍🎨',
    streak: 15,
    totalCompletions: 88,
    badgesCount: 4,
    level: 4,
    levelTitle: 'Pembangun Rutinitas ⚡',
  },
  {
    id: 'comm-5',
    name: 'Nadia Talitha',
    avatar: '📚',
    streak: 12,
    totalCompletions: 74,
    badgesCount: 4,
    level: 3,
    levelTitle: 'Pembangun Rutinitas ⚡',
  },
  {
    id: 'comm-6',
    name: 'Rizky Maulana',
    avatar: '🧗',
    streak: 9,
    totalCompletions: 52,
    badgesCount: 3,
    level: 3,
    levelTitle: 'Pembangun Rutinitas ⚡',
  },
];

export function getCommunityLeaderboard(
  currentUserProfile: UserProfile,
  stats: HabitStats,
  badges: Badge[],
  sortBy: 'streak' | 'completions' | 'badges' = 'streak'
): LeaderboardMember[] {
  const userLevel = calculateUserLevel(stats, badges);
  const unlockedBadges = badges.filter((b) => b.unlocked).length;

  const currentMember: LeaderboardMember = {
    id: 'current-user',
    name: `${currentUserProfile.name} (Anda)`,
    avatar: '⭐',
    streak: stats.currentStreak,
    totalCompletions: stats.totalCompletions,
    badgesCount: unlockedBadges,
    level: userLevel.level,
    levelTitle: userLevel.levelTitle,
    isCurrentUser: true,
  };

  const allMembers = [currentMember, ...COMMUNITY_ROSTER.map((m) => ({ ...m, isCurrentUser: false }))];

  if (sortBy === 'streak') {
    allMembers.sort((a, b) => b.streak - a.streak);
  } else if (sortBy === 'completions') {
    allMembers.sort((a, b) => b.totalCompletions - a.totalCompletions);
  } else {
    allMembers.sort((a, b) => b.badgesCount - a.badgesCount);
  }

  return allMembers;
}
