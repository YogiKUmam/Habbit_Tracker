import React from 'react';
import { 
  Check, Flame, MoreVertical, Trash2, Edit3, Droplets, BookOpen, 
  Dumbbell, Code2, Heart, Sparkles, Brain, Coffee, Smile, Trophy, BarChart2, MessageSquare, Timer 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Habit, ColorTheme } from '../types/habit';

interface HabitCardProps {
  habit: Habit;
  isCompletedToday: boolean;
  streak: { current: number; best: number };
  past7Days: { date: string; dayLabel: string; completed: boolean }[];
  todayNote?: string;
  onToggleToday: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: string) => void;
  onViewDetail: (habit: Habit) => void;
  onOpenNote: (habit: Habit) => void;
  onStartTimer: (habit: Habit) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  isCompletedToday,
  streak,
  past7Days,
  todayNote,
  onToggleToday,
  onEdit,
  onDelete,
  onViewDetail,
  onOpenNote,
  onStartTimer,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  // Icon Resolver
  const getIcon = (iconName: string) => {
    const props = { className: 'h-5 w-5' };
    switch (iconName) {
      case 'Droplets': return <Droplets {...props} />;
      case 'BookOpen': return <BookOpen {...props} />;
      case 'Dumbbell': return <Dumbbell {...props} />;
      case 'Code2': return <Code2 {...props} />;
      case 'Heart': return <Heart {...props} />;
      case 'Brain': return <Brain {...props} />;
      case 'Coffee': return <Coffee {...props} />;
      case 'Smile': return <Smile {...props} />;
      case 'Trophy': return <Trophy {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  // Color Theme Resolver
  const getColorStyles = (color: ColorTheme) => {
    switch (color) {
      case 'emerald':
        return {
          badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
          iconBg: 'bg-emerald-500/15 text-emerald-500',
          btnActive: 'bg-emerald-500 text-white shadow-emerald-500/25',
          borderActive: 'border-emerald-500/40',
        };
      case 'blue':
        return {
          badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
          iconBg: 'bg-blue-500/15 text-blue-500',
          btnActive: 'bg-blue-500 text-white shadow-blue-500/25',
          borderActive: 'border-blue-500/40',
        };
      case 'violet':
        return {
          badge: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
          iconBg: 'bg-violet-500/15 text-violet-500',
          btnActive: 'bg-violet-500 text-white shadow-violet-500/25',
          borderActive: 'border-violet-500/40',
        };
      case 'amber':
        return {
          badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
          iconBg: 'bg-amber-500/15 text-amber-500',
          btnActive: 'bg-amber-500 text-white shadow-amber-500/25',
          borderActive: 'border-amber-500/40',
        };
      case 'rose':
        return {
          badge: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
          iconBg: 'bg-rose-500/15 text-rose-500',
          btnActive: 'bg-rose-500 text-white shadow-rose-500/25',
          borderActive: 'border-rose-500/40',
        };
      case 'cyan':
        return {
          badge: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
          iconBg: 'bg-cyan-500/15 text-cyan-500',
          btnActive: 'bg-cyan-500 text-white shadow-cyan-500/25',
          borderActive: 'border-cyan-500/40',
        };
      default:
        return {
          badge: 'bg-primary/10 text-primary border-primary/20',
          iconBg: 'bg-primary/15 text-primary',
          btnActive: 'bg-primary text-primary-foreground shadow-primary/25',
          borderActive: 'border-primary/40',
        };
    }
  };

  const themeStyles = getColorStyles(habit.color as ColorTheme);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group relative p-4 sm:p-5 rounded-3xl border bg-card transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 ${
        isCompletedToday ? themeStyles.borderActive : 'border-border hover:border-border/80'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Icon & Info */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className={`p-3 rounded-2xl ${themeStyles.iconBg} transition-transform duration-300 group-hover:scale-105 flex-shrink-0`}>
            {getIcon(habit.icon)}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${themeStyles.badge}`}>
                {habit.category}
              </span>
              <span className="text-[11px] text-muted-foreground">
                Target: {habit.targetDaysPerWeek}x/minggu
              </span>
              {habit.activeDays && habit.activeDays.length < 7 && !habit.activeDays.includes(new Date().getDay()) && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border flex items-center gap-1">
                  ☕ Hari Istirahat
                </span>
              )}
              {habit.durationMinutes && (
                <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
                  <Timer className="h-3 w-3" /> {habit.durationMinutes}m
                </span>
              )}
            </div>

            <h3
              onClick={() => onViewDetail(habit)}
              className={`font-bold text-base tracking-tight truncate cursor-pointer transition-colors hover:text-primary ${
                isCompletedToday ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}
            >
              {habit.title}
            </h3>

            {habit.description && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {habit.description}
              </p>
            )}

            {/* Today Note Badge */}
            {todayNote && (
              <div 
                onClick={() => onOpenNote(habit)}
                className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-secondary/80 border border-border/80 text-[11px] text-foreground cursor-pointer hover:bg-secondary transition-colors max-w-full"
              >
                <MessageSquare className="h-3 w-3 text-emerald-500 flex-shrink-0" />
                <span className="truncate italic">"{todayNote}"</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Timer Launcher Button (if habit has duration or timer enabled) */}
          <button
            type="button"
            onClick={() => onStartTimer(habit)}
            title={`Mulai Timer Fokus (${habit.durationMinutes || 15} Menit)`}
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-emerald-500 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <Timer className="h-4 w-4" />
            <span className="hidden xl:inline">{habit.durationMinutes || 15}m</span>
          </button>

          {/* Daily Note Button */}
          <button
            type="button"
            onClick={() => onOpenNote(habit)}
            aria-label="Catatan Refleksi Harian"
            title={todayNote ? 'Edit catatan hari ini' : 'Tambah catatan refleksi hari ini'}
            className={`p-2.5 rounded-xl border transition-colors ${
              todayNote
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
                : 'border-border bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </button>

          {/* Options Dropdown Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              aria-label="Opsi kebiasaan"
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 5 }}
                  className="absolute right-0 mt-1 w-36 py-1 bg-card border border-border rounded-xl shadow-xl z-20"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onStartTimer(habit);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-left flex items-center gap-2 hover:bg-secondary text-foreground"
                  >
                    <Timer className="h-3.5 w-3.5 text-emerald-500" /> Mulai Timer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onViewDetail(habit);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-left flex items-center gap-2 hover:bg-secondary text-foreground"
                  >
                    <BarChart2 className="h-3.5 w-3.5" /> Lihat Analitik
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onOpenNote(habit);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-left flex items-center gap-2 hover:bg-secondary text-foreground"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Catatan Refleksi
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(habit);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-left flex items-center gap-2 hover:bg-secondary text-foreground"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Edit Habit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(habit.id);
                    }}
                    className="w-full px-3 py-1.5 text-xs text-left flex items-center gap-2 hover:bg-destructive/10 text-rose-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main Tactile Toggle Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={() => onToggleToday(habit.id)}
            aria-label={isCompletedToday ? 'Tandai belum selesai hari ini' : 'Tandai selesai hari ini'}
            className={`h-11 w-11 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring ${
              isCompletedToday
                ? `${themeStyles.btnActive} border-transparent shadow-lg`
                : 'border-border bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground'
            }`}
          >
            {isCompletedToday ? (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Check className="h-5 w-5 stroke-[3]" />
              </motion.div>
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Footer: 7-Day Mini Dots & Streak Indicator */}
      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
        {/* Past 7 days history */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-bold text-muted-foreground mr-1">7 Hari:</span>
          {past7Days.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-0.5">
              <div
                title={`${day.date}: ${day.completed ? 'Selesai' : 'Belum'}`}
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                  day.completed
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-secondary border border-border/70'
                }`}
              >
                {day.completed && <Check className="h-2 w-2 stroke-[3]" />}
              </div>
              <span className="text-[9px] text-muted-foreground/80">{day.dayLabel}</span>
            </div>
          ))}
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-1 text-amber-500 font-bold px-2 py-1 rounded-lg bg-amber-500/10">
          <Flame className="h-3.5 w-3.5 fill-amber-500" />
          <span>{streak.current}d streak</span>
        </div>
      </div>
    </motion.div>
  );
};
