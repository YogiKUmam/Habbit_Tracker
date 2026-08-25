import React from 'react';
import { X, Snowflake, ShieldCheck, ShieldAlert, Sparkles, Plus, Calendar } from 'lucide-react';
import { StreakFreezeState } from '../types/habit';
import { formatDateToIndonesian } from '../lib/storage';

interface StreakFreezeModalProps {
  isOpen: boolean;
  onClose: () => void;
  freezeState: StreakFreezeState;
  onToggleEquip: () => void;
  onAddFreeze: () => void;
}

export const StreakFreezeModal: React.FC<StreakFreezeModalProps> = ({
  isOpen,
  onClose,
  freezeState,
  onToggleEquip,
  onAddFreeze,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 sm:p-8 bg-card border border-cyan-500/20 rounded-3xl shadow-2xl overflow-hidden space-y-6">
        
        {/* Glow Halo Effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-inner">
              <Snowflake className="h-6 w-6 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <span>Streak Freeze</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">
                  Power-up
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Proteksi otomatis rekor konsistensi harian Anda
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

        {/* Big Inventory Counter Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-950/40 to-blue-950/30 border border-cyan-500/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-cyan-300/80">
              Stok Freeze Tersedia
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-cyan-400 font-mono">
                {freezeState.availableFreezes}
              </span>
              <span className="text-xs text-muted-foreground">kristal es</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onAddFreeze}
            className="px-3.5 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>Klaim +1</span>
          </button>
        </div>

        {/* Auto-Protection Toggle */}
        <div className="p-4 rounded-2xl bg-secondary/50 border border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {freezeState.isEquipped ? (
              <ShieldCheck className="h-5 w-5 text-cyan-400 flex-shrink-0" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            )}
            <div>
              <p className="text-xs font-bold text-foreground">
                Proteksi Otomatis
              </p>
              <p className="text-[11px] text-muted-foreground">
                {freezeState.isEquipped
                  ? 'Aktif: Rekor streak terlindungi jika Anda terlewat satu hari'
                  : 'Nonaktif: Streak akan reset ke 0 jika terlewat'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleEquip}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              freezeState.isEquipped
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'bg-secondary text-muted-foreground border border-border'
            }`}
          >
            {freezeState.isEquipped ? 'Terpasang ❄️' : 'Pasang'}
          </button>
        </div>

        {/* How It Works Explanation */}
        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 text-xs space-y-2 text-muted-foreground">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Cara Kerja Streak Freeze:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
            <li>Jika Anda sakit, bepergian, atau lupa mencentang hari ini, 1 kristal es otomatis terpakai.</li>
            <li>Rekor streak Anda tetap <strong>utuh dan tidak hangus</strong>.</li>
            <li>Pada heatmap kalender, hari tersebut akan ditandai dengan ikon salju ❄️ biru muda.</li>
          </ul>
        </div>

        {/* Used Freezes History */}
        {freezeState.usedDates.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
              <span>Riwayat Hari Terproteksi ({freezeState.usedDates.length}):</span>
            </h4>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {freezeState.usedDates.map((dateStr) => (
                <span
                  key={dateStr}
                  className="px-2.5 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-semibold flex items-center gap-1"
                >
                  <Snowflake className="h-3 w-3" />
                  {formatDateToIndonesian(dateStr)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
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
