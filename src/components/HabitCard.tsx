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
    const props = { className: 'h-4 w-4 sm:h-5 sm:w-5' };
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
          badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
          iconBg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
          btnActive: 'bg-emerald-500 text-white shadow-emerald-500/25',
          borderActive: 'border-emerald-500/40 shadow-emerald-500/5',
        };
      case 'blue':
        return {
          badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
          iconBg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
          btnActive: 'bg-blue-500 text-white shadow-blue-500/25',
          borderActive: 'border-blue-500/40 shadow-blue-500/5',
        };
      case 'violet':
        return {
          badge: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
          iconBg: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
          btnActive: 'bg-violet-500 text-white shadow-violet-500/25',
          borderActive: 'border-violet-500/40 shadow-violet-500/5',
        };
      case 'amber':
        return {
          badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
          iconBg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
          btnActive: 'bg-amber-500 text-white shadow-amber-500/25',
          borderActive: 'border-amber-500/40 shadow-amber-500/5',
        };
      case 'rose':
        return {
          badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
          iconBg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
          btnActive: 'bg-rose-500 text-white shadow-rose-500/25',
          borderActive: 'border-rose-500/40 shadow-rose-500/5',
        };
      case 'cyan':
        return {
          badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
          iconBg: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
          btnActive: 'bg-cyan-500 text-white shadow-cyan-500/25',
          borderActive: 'border-cyan-500/40 shadow-cyan-500/5',
        };
      default:
        return {
          badge: 'bg-primary/10 text-primary border-primary/20',
          iconBg: 'bg-primary/15 text-primary',
          btnActive: 'bg-primary text-primary-foreground shadow-primary/25',
          borderActive: 'border-primary/40 shadow-primary/5',
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
      className={`group relative p-4 sm:p-5 rounded-2xl sm:rounded-[28px] apple-glass apple-card-hover space-y-3.5 transition-all ${
        isCompletedToday ? themeStyles.borderActive : 'border-border/60'
      }`}
    >
      {/* Top Header Row: Icon + Meta Tags + Quick Actions */}
      <div className="flex items-center justify-between gap-2">
        {/* Left: Icon + Category Badge + Tags */}
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <div className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl ${themeStyles.iconBg} shadow-xs flex-shrink-0`}>
            {getIcon(habit.icon)}
          </div>

          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${themeStyles.badge}`}>
            {habit.category}
          </span>

          <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium hidden xs:inline">
            {habit.targetDaysPerWeek}x/mgg
          </span>

          {habit.activeDays && habit.activeDays.length < 7 && !habit.activeDays.includes(new Date().getDay()) && (
            <span className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">
              ☕ Libur
            </span>
          )}
        </div>

        {/* Right: Timer + Note + Menu + Big Check Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          
          {/* Stopwatch-Styled Timer Button */}
          <button
            type="button"
            onClick={() => onStartTimer(habit)}
            title={`Mulai Timer Fokus (${habit.durationMinutes || 15} Menit)`}
            className="tactile-btn px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px] font-bold shadow-xs"
          >
            <Timer className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>{habit.durationMinutes || 15}m</span>
          </button>

          {/* Daily Note Button */}
          <button
            type="button"
            onClick={() => onOpenNote(habit)}
            aria-label="Catatan Refleksi Harian"
            title={todayNote ? 'Edit catatan hari ini' : 'Tambah catatan refleksi hari ini'}
            className={`tactile-btn p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border transition-all ${
              todayNote
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'border-border/60 bg-secondary/60 text-muted-foreground hover:text-foreground'
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
              className="tactile-btn p-1.5 sm:p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 5 }}
                  className="absolute right-0 mt-1.5 w-40 p-1.5 apple-glass rounded-2xl shadow-xl z-20 space-y-0.5 border border-border"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onStartTimer(habit);
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold text-left flex items-center gap-2 hover:bg-secondary rounded-xl text-foreground"
                  >
                    <Timer className="h-3.5 w-3.5 text-emerald-500" /> Mulai Timer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onViewDetail(habit);
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold text-left flex items-center gap-2 hover:bg-secondary rounded-xl text-foreground"
                  >
                    <BarChart2 className="h-3.5 w-3.5 text-primary" /> Lihat Analitik
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onOpenNote(habit);
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold text-left flex items-center gap-2 hover:bg-secondary rounded-xl text-foreground"
                  >
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-500" /> Catatan Refleksi
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(habit);
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold text-left flex items-center gap-2 hover:bg-secondary rounded-xl text-foreground"
                  >
                    <Edit3 className="h-3.5 w-3.5" /> Edit Habit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(habit.id);
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold text-left flex items-center gap-2 hover:bg-destructive/10 text-rose-500 rounded-xl"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Hapus
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main Tactile Check Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={() => onToggleToday(habit.id)}
            aria-label={isCompletedToday ? 'Tandai belum selesai hari ini' : 'Tandai selesai hari ini'}
            className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring ${
              isCompletedToday
                ? `${themeStyles.btnActive} border-transparent shadow-md shadow-emerald-500/25`
                : 'border-border/80 bg-secondary/70 hover:bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {isCompletedToday ? (
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 450, damping: 22 }}
              >
                <Check className="h-4 w-4 sm:h-5 sm:w-5 stroke-[3]" />
              </motion.div>
            ) : (
              <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full border-2 border-muted-foreground/40" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Middle Row: Full Width Habit Title & Description */}
      <div className="space-y-1">
        <h3
          onClick={() => onViewDetail(habit)}
          className={`font-bold text-sm sm:text-base tracking-tight cursor-pointer transition-colors hover:text-primary break-words ${
            isCompletedToday ? 'line-through text-muted-foreground' : 'text-foreground'
          }`}
        >
          {habit.title}
        </h3>

        {habit.description && (
          <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {habit.description}
          </p>
        )}

        {/* Today Reflection Note */}
        {todayNote && (
          <div 
            onClick={() => onOpenNote(habit)}
            className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-secondary/70 border border-border text-[11px] text-foreground cursor-pointer hover:bg-secondary transition-colors max-w-full"
          >
            <MessageSquare className="h-3 w-3 text-emerald-500 flex-shrink-0" />
            <span className="truncate italic font-medium">"{todayNote}"</span>
          </div>
        )}
      </div>

      {/* Bottom Row: 7-Day History Dots & Streak Counter */}
      <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs">
        {/* Past 7 days history */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-muted-foreground mr-0.5">7 Hari:</span>
          {past7Days.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-0.5">
              <div
                title={`${day.date}: ${day.completed ? 'Selesai' : 'Belum'}`}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full flex items-center justify-center transition-all ${
                  day.completed
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'bg-secondary border border-border/70'
                }`}
              >
                {day.completed && <Check className="h-1.5 w-1.5 sm:h-2 sm:w-2 stroke-[3]" />}
              </div>
              <span className="text-[8px] sm:text-[9px] text-muted-foreground font-semibold">{day.dayLabel}</span>
            </div>
          ))}
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-1 text-amber-500 font-bold px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 shadow-xs text-[11px] sm:text-xs">
          <Flame className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-amber-500" />
          <span>{streak.current}d</span>
        </div>
      </div>
    </motion.div>
  );
};
