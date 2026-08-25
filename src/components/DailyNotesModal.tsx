import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Save, Trash2, Calendar } from 'lucide-react';
import { Habit } from '../types/habit';
import { formatDateToIndonesian, getTodayString } from '../lib/storage';

interface DailyNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit | null;
  currentNote?: string;
  onSaveNote: (habitId: string, note: string) => void;
}

export const DailyNotesModal: React.FC<DailyNotesModalProps> = ({
  isOpen,
  onClose,
  habit,
  currentNote = '',
  onSaveNote,
}) => {
  const [note, setNote] = useState('');
  const todayStr = getTodayString();

  useEffect(() => {
    setNote(currentNote || '');
  }, [currentNote, isOpen]);

  if (!isOpen || !habit) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNote(habit.id, note.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md p-6 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Catatan Refleksi Harian</h3>
              <p className="text-xs text-muted-foreground">{habit.title}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Date Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground my-3">
          <Calendar className="h-3.5 w-3.5 text-primary" />
          <span>{formatDateToIndonesian(todayStr)}</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <textarea
              rows={4}
              placeholder="Tuliskan refleksi singkat, pencapaian, atau tantangan hari ini (misal: 'Berhasil jogging 3km tanpa berhenti')..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-input bg-secondary/40 text-foreground text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              maxLength={300}
            />
            <div className="flex justify-end mt-1 text-[10px] text-muted-foreground">
              {note.length}/300 karakter
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {currentNote ? (
              <button
                type="button"
                onClick={() => {
                  onSaveNote(habit.id, '');
                  onClose();
                }}
                className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-400 font-semibold px-2 py-1"
              >
                <Trash2 className="h-3.5 w-3.5" /> Hapus Catatan
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-primary-foreground bg-primary hover:opacity-90 active:scale-95 rounded-xl shadow-md shadow-primary/20 transition-all"
              >
                <Save className="h-3.5 w-3.5" /> Simpan Catatan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
