import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Play, Pause, RotateCcw, Plus, CheckCircle2, Sparkles, 
  Volume2, VolumeX, MessageSquare, Bell 
} from 'lucide-react';
import { Habit } from '../types/habit';
import { sound } from '../lib/sound';
import { triggerStreakConfetti } from './Confetti';

interface HabitTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
  onCompleteHabit: (habitId: string) => void;
  onOpenNote?: (habit: Habit) => void;
}

export const HabitTimerModal: React.FC<HabitTimerModalProps> = ({
  isOpen,
  onClose,
  habit,
  onCompleteHabit,
  onOpenNote,
}) => {
  const initialMinutes = habit?.durationMinutes || 15;
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60);
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer state when a new habit is selected or opened
  useEffect(() => {
    if (habit) {
      const mins = habit.durationMinutes || 15;
      setTotalSeconds(mins * 60);
      setSecondsLeft(mins * 60);
      setIsActive(false);
      setIsCompleted(false);
    }
  }, [habit, isOpen]);

  // Timer countdown loop
  useEffect(() => {
    if (isActive && secondsLeft > 0) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimerFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, secondsLeft]);

  const handleTimerFinish = () => {
    setIsActive(false);
    setIsCompleted(true);
    if (soundEnabled) {
      sound.playTimerComplete();
    }
    triggerStreakConfetti();
    if (habit) {
      onCompleteHabit(habit.id);
    }
  };

  const handleTogglePlay = () => {
    if (!isActive && secondsLeft > 0) {
      if (soundEnabled) {
        sound.playTimerStart();
      }
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setIsCompleted(false);
    setSecondsLeft(totalSeconds);
  };

  const handleAddMinutes = (mins: number) => {
    const additional = mins * 60;
    setTotalSeconds((prev) => prev + additional);
    setSecondsLeft((prev) => prev + additional);
  };

  const handleTestChime = () => {
    sound.playTimerComplete();
  };

  if (!isOpen || !habit) return null;

  // Formatting calculations
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - secondsLeft) / totalSeconds) * 100 : 0;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 sm:p-8 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden text-center space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-left">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
              {habit.category}
            </span>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Suara Lonceng Aktif' : 'Bisukan Suara Lonceng'}
              className={`p-1.5 rounded-lg border transition-colors ${
                soundEnabled ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500' : 'border-border text-muted-foreground'
              }`}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={handleTestChime}
              title="Tes Bunyi Lonceng Zen"
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-[11px] flex items-center gap-1 font-semibold"
            >
              <Bell className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tes Bunyi</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Timer"
            className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Habit Title */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {habit.title}
          </h2>
          <p className="text-xs text-muted-foreground">
            {isCompleted ? 'Target Selesai! Luar Biasa!' : 'Tetap fokus dan selesaikan rutinitas Anda'}
          </p>
        </div>

        {/* Circular Countdown Display */}
        <div className="relative flex items-center justify-center py-4">
          <svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 260 260">
            {/* Background Track */}
            <circle
              cx="130"
              cy="130"
              r={radius}
              className="stroke-secondary"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Progress Stroke */}
            <circle
              cx="130"
              cy="130"
              r={radius}
              className="stroke-emerald-500 transition-all duration-1000 ease-linear"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Digital Clock */}
          <div className="absolute flex flex-col items-center justify-center">
            {isCompleted ? (
              <div className="flex flex-col items-center space-y-2 animate-bounce">
                <CheckCircle2 className="h-16 w-16 text-emerald-500 fill-emerald-500/20" />
                <span className="text-sm font-bold text-emerald-500">SELESAI!</span>
              </div>
            ) : (
              <>
                <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-foreground">
                  {formattedTime}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mt-1">
                  {isActive ? 'Sedang Berjalan' : 'Fokus Timer'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Controls */}
        {!isCompleted ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-4">
              {/* Reset */}
              <button
                type="button"
                onClick={handleReset}
                title="Reset Timer"
                className="p-3.5 rounded-2xl border border-border bg-secondary hover:bg-secondary/80 text-foreground transition-all hover:scale-105 active:scale-95"
              >
                <RotateCcw className="h-5 w-5" />
              </button>

              {/* Main Play/Pause Button */}
              <button
                type="button"
                onClick={handleTogglePlay}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-500/25 hover:opacity-95 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                {isActive ? (
                  <>
                    <Pause className="h-5 w-5 fill-white" />
                    <span>Jeda</span>
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 fill-white" />
                    <span>Mulai</span>
                  </>
                )}
              </button>

              {/* +5 Minutes Extension */}
              <button
                type="button"
                onClick={() => handleAddMinutes(5)}
                title="Tambah 5 Menit"
                className="p-3.5 rounded-2xl border border-border bg-secondary hover:bg-secondary/80 text-foreground transition-all hover:scale-105 active:scale-95"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          /* Completion State Actions */
          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" /> Kebiasaan hari ini telah otomatis dicentang selesai!
            </div>

            <div className="flex gap-2">
              {onOpenNote && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenNote(habit);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="h-4 w-4 text-emerald-500" />
                  <span>Tulis Refleksi</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 transition-all shadow-md"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
