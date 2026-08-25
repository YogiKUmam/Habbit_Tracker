import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Droplets, BookOpen, Dumbbell, Code2, 
  Heart, Brain, Coffee, Smile, Trophy, Timer, Calendar 
} from 'lucide-react';
import { Habit, Category, ColorTheme } from '../types/habit';

interface HabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: Partial<Habit>) => void;
  editingHabit?: Habit | null;
}

const CATEGORIES: Category[] = ['Health', 'Productivity', 'Mindfulness', 'Fitness', 'Learning', 'Creative'];
const COLORS: { value: ColorTheme; label: string; class: string }[] = [
  { value: 'emerald', label: 'Emerald', class: 'bg-emerald-500' },
  { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { value: 'violet', label: 'Violet', class: 'bg-violet-500' },
  { value: 'amber', label: 'Amber', class: 'bg-amber-500' },
  { value: 'rose', label: 'Rose', class: 'bg-rose-500' },
  { value: 'cyan', label: 'Cyan', class: 'bg-cyan-500' },
];

const ICONS = [
  { name: 'Droplets', label: 'Air' },
  { name: 'BookOpen', label: 'Buku' },
  { name: 'Dumbbell', label: 'Olahraga' },
  { name: 'Code2', label: 'Coding' },
  { name: 'Heart', label: 'Kesehatan' },
  { name: 'Brain', label: 'Mind' },
  { name: 'Coffee', label: 'Istirahat' },
  { name: 'Smile', label: 'Mood' },
  { name: 'Trophy', label: 'Pencapaian' },
  { name: 'Sparkles', label: 'Lainnya' },
];

const DURATION_PRESETS = [5, 10, 15, 25, 45, 60];

const DAYS_OF_WEEK = [
  { id: 1, label: 'Sen' },
  { id: 2, label: 'Sel' },
  { id: 3, label: 'Rab' },
  { id: 4, label: 'Kam' },
  { id: 5, label: 'Jum' },
  { id: 6, label: 'Sab' },
  { id: 0, label: 'Min' },
];

export const HabitModal: React.FC<HabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingHabit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Health');
  const [color, setColor] = useState<ColorTheme>('emerald');
  const [icon, setIcon] = useState('Droplets');
  const [targetDays, setTargetDays] = useState(7);
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [activeDays, setActiveDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingHabit) {
      setTitle(editingHabit.title);
      setDescription(editingHabit.description || '');
      setCategory(editingHabit.category);
      setColor((editingHabit.color as ColorTheme) || 'emerald');
      setIcon(editingHabit.icon);
      setTargetDays(editingHabit.targetDaysPerWeek);
      setDurationMinutes(editingHabit.durationMinutes || 15);
      setActiveDays(editingHabit.activeDays && editingHabit.activeDays.length > 0 ? editingHabit.activeDays : [0, 1, 2, 3, 4, 5, 6]);
    } else {
      setTitle('');
      setDescription('');
      setCategory('Health');
      setColor('emerald');
      setIcon('Droplets');
      setTargetDays(7);
      setDurationMinutes(15);
      setActiveDays([0, 1, 2, 3, 4, 5, 6]);
    }
    setError(null);
  }, [editingHabit, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleDay = (dayId: number) => {
    if (activeDays.includes(dayId)) {
      if (activeDays.length === 1) return; // Must have at least 1 active day
      const updated = activeDays.filter((d) => d !== dayId);
      setActiveDays(updated);
      setTargetDays(updated.length);
    } else {
      const updated = [...activeDays, dayId];
      setActiveDays(updated);
      setTargetDays(updated.length);
    }
  };

  const applySchedulePreset = (preset: 'all' | 'weekdays' | 'weekends') => {
    if (preset === 'all') {
      setActiveDays([0, 1, 2, 3, 4, 5, 6]);
      setTargetDays(7);
    } else if (preset === 'weekdays') {
      setActiveDays([1, 2, 3, 4, 5]);
      setTargetDays(5);
    } else if (preset === 'weekends') {
      setActiveDays([0, 6]);
      setTargetDays(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.length < 2) {
      setError('Judul kebiasaan minimal 2 karakter.');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      color,
      icon,
      targetDaysPerWeek: activeDays.length,
      durationMinutes: durationMinutes > 0 ? durationMinutes : 15,
      timerEnabled: true,
      activeDays,
    });
    onClose();
  };

  const renderIconComponent = (name: string) => {
    const props = { className: 'h-4 w-4' };
    switch (name) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {editingHabit ? 'Edit Kebiasaan' : 'Tambah Kebiasaan Baru'}
            </h2>
            <p className="text-xs text-muted-foreground">
              Tentukan target konsistensi dan durasi fokus Anda
            </p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {error && (
            <div className="p-3 text-xs font-semibold text-destructive bg-destructive/10 border border-destructive/20 rounded-xl">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Nama Kebiasaan <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Membaca 15 Menit, Minum Air..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Catatan / Pengingat (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Segelas setelah bangun tidur"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-secondary/40 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Kategori
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    category === cat
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Modul 2: Custom Active Days Schedule */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" /> Jadwal Hari Aktif
              </label>
              <span className="text-xs font-bold text-primary">
                {activeDays.length} Hari / Minggu
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 mb-2">
              <button
                type="button"
                onClick={() => applySchedulePreset('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                  activeDays.length === 7
                    ? 'bg-primary/20 text-primary border-primary/40'
                    : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                Setiap Hari
              </button>
              <button
                type="button"
                onClick={() => applySchedulePreset('weekdays')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                  activeDays.length === 5 && !activeDays.includes(0) && !activeDays.includes(6)
                    ? 'bg-primary/20 text-primary border-primary/40'
                    : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                Hari Kerja (Sen-Jum)
              </button>
              <button
                type="button"
                onClick={() => applySchedulePreset('weekends')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                  activeDays.length === 2 && activeDays.includes(0) && activeDays.includes(6)
                    ? 'bg-primary/20 text-primary border-primary/40'
                    : 'bg-secondary/40 border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                Akhir Pekan
              </button>
            </div>

            {/* Day Pills */}
            <div className="grid grid-cols-7 gap-1.5">
              {DAYS_OF_WEEK.map((d) => {
                const isSelected = activeDays.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDay(d.id)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                        : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Focus Timer Duration Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Timer className="h-3.5 w-3.5 text-emerald-500" /> Durasi Timer Fokus
              </label>
              <span className="text-xs font-bold text-emerald-500">
                {durationMinutes} Menit
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {DURATION_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDurationMinutes(preset)}
                  className={`flex-1 py-1.5 px-2.5 rounded-xl border text-xs font-bold transition-all ${
                    durationMinutes === preset
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
                      : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {preset}m
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Pilih Ikon
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {ICONS.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setIcon(item.name)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 min-w-[52px] transition-all ${
                    icon === item.name
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {renderIconComponent(item.name)}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Warna Tema
            </label>
            <div className="flex items-center gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-7 h-7 rounded-full ${c.class} flex items-center justify-center transition-all ${
                    color === c.value ? 'ring-4 ring-offset-2 ring-primary scale-110' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-primary-foreground bg-primary hover:opacity-90 active:scale-95 rounded-xl shadow-md shadow-primary/20 transition-all"
            >
              {editingHabit ? 'Simpan Perubahan' : 'Buat Kebiasaan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
