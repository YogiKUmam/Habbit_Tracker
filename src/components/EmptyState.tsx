import React from 'react';
import { Sparkles, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  onAddClick: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAddClick }) => {
  return (
    <div className="p-10 rounded-3xl border border-dashed border-border bg-card/50 text-center flex flex-col items-center justify-center max-w-md mx-auto my-6">
      <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 shadow-inner">
        <Sparkles className="h-8 w-8 animate-pulse" />
      </div>
      <h3 className="text-base font-bold text-foreground">
        Belum Ada Kebiasaan Terdaftar
      </h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
        Mulailah dari langkah kecil hari ini. Bangun rutinitas yang konsisten dan pantau perkembangannya di heatmap.
      </p>
      <button
        type="button"
        onClick={onAddClick}
        className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md shadow-emerald-500/20 hover:opacity-90 active:scale-95 transition-all"
      >
        <PlusCircle className="h-4 w-4" />
        Tambah Kebiasaan Pertama
      </button>
    </div>
  );
};
