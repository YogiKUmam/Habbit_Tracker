import React, { useMemo } from 'react';
import { 
  X, Bot, Sparkles, AlertCircle, CheckCircle2, 
  Calendar, Layers, Plus, MessageSquare, ArrowRight 
} from 'lucide-react';
import { Habit, HabitLog, HabitStats } from '../types/habit';
import { generateHabitInsights, RecommendedHabit } from '../lib/aiCoach';

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  logs: HabitLog[];
  stats: HabitStats;
  onAddRecommendedHabit: (habit: RecommendedHabit) => void;
}

export const AICoachModal: React.FC<AICoachModalProps> = ({
  isOpen,
  onClose,
  habits,
  logs,
  stats,
  onAddRecommendedHabit,
}) => {
  const insights = useMemo(() => {
    return generateHabitInsights(habits, logs, stats);
  }, [habits, logs, stats]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] p-6 sm:p-8 bg-card border border-purple-500/30 rounded-3xl shadow-2xl overflow-y-auto space-y-6">
        
        {/* Glow Ambient Lights */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-500/25">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <span>AI Habit Coach</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Personal Insights
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Diagnosis performa konsistensi & rekomendasi psikologi kebiasaan
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 1. Habit Strength Index Meter */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-indigo-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-semibold text-purple-300">
              Skor Kekuatan Kebiasaan (Habit Strength Index)
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
              {insights.strengthLabel}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Dihitung berdasarkan rasio penyelesaian 30 hari terakhir dan momentum streak Anda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <span className="text-4xl sm:text-5xl font-mono font-extrabold bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                {insights.strengthScore}%
              </span>
            </div>
          </div>
        </div>

        {/* 2. Diagnosis Grid: Star Habit vs Needs Attention */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Star Habit */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="h-4 w-4" />
              <span>Habit Paling Solid (Pilar Utama)</span>
            </div>
            {insights.starHabit ? (
              <div>
                <h4 className="text-sm font-bold text-foreground">{insights.starHabit.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tingkat konsistensi <strong>{insights.starHabit.completionRate}%</strong> bulan ini. Ini adalah jangkar terbaik Anda!
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Mulai centang kebiasaan untuk membaca pilar utama.</p>
            )}
          </div>

          {/* Needs Attention */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <AlertCircle className="h-4 w-4" />
              <span>Butuh Perhatian Khusus</span>
            </div>
            {insights.needsAttentionHabit ? (
              <div>
                <h4 className="text-sm font-bold text-foreground">{insights.needsAttentionHabit.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Terlewat {insights.needsAttentionHabit.missedDays} hari bulan ini ({insights.needsAttentionHabit.completionRate}% selesai).
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Semua kebiasaan Anda berjalan dengan sangat seimbang!</p>
            )}
          </div>
        </div>

        {/* 3. Day of Week Pattern Analysis */}
        <div className="p-4 rounded-2xl bg-secondary/40 border border-border flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Calendar className="h-4 w-4 text-primary" />
            <div>
              <span className="text-muted-foreground">Hari Paling Produktif: </span>
              <strong className="text-emerald-400">{insights.bestDay.name} ({insights.bestDay.percentage}%)</strong>
            </div>
          </div>

          <div className="text-right">
            <span className="text-muted-foreground">Hari Paling Rentan: </span>
            <strong className="text-amber-400">{insights.vulnerableDay.name} ({insights.vulnerableDay.percentage}%)</strong>
          </div>
        </div>

        {/* 4. Habit Stacking Strategy (Atomic Habits Formula) */}
        {insights.habitStackingFormula && (
          <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/50 border border-indigo-500/30 space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
              <Layers className="h-4 w-4" />
              <span>Taktik "Habit Stacking" (Atomic Habits)</span>
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              {insights.habitStackingFormula.advice}
            </p>
            <div className="p-2.5 rounded-xl bg-card/60 border border-border/80 text-[11px] text-muted-foreground flex items-center gap-2">
              <span className="font-semibold text-emerald-400">Anchor: {insights.habitStackingFormula.anchorHabit}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-semibold text-amber-400">Target: {insights.habitStackingFormula.newHabit}</span>
            </div>
          </div>
        )}

        {/* 5. Reflection Notes Feedback */}
        {insights.notesInsight.totalNotes > 0 && (
          <div className="p-4 rounded-2xl bg-secondary/30 border border-border text-xs flex items-start gap-3">
            <MessageSquare className="h-4 w-4 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-0.5">
              <span className="font-bold text-foreground">Evaluasi Refleksi Harian</span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {insights.notesInsight.summary}
              </p>
            </div>
          </div>
        )}

        {/* 6. Smart Recommended Micro-Habits */}
        {insights.recommendedHabits.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Rekomendasi Kebiasaan Pelengkap Cerdas:</span>
            </h4>

            <div className="space-y-2.5">
              {insights.recommendedHabits.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-secondary/40 border border-border hover:border-purple-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{item.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-bold border border-purple-500/20">
                        {item.category} • {item.durationMinutes}m
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                    <p className="text-[11px] text-purple-300/80 italic">💡 {item.reason}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onAddRecommendedHabit(item);
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all active:scale-95 flex items-center justify-center gap-1.5 flex-shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tambahkan</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs transition-all"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
