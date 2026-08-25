import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, Download, Copy, Share2, Sparkles, Flame, CheckCircle, 
  Layers, Palette, Smartphone, Square, Check 
} from 'lucide-react';
import { Habit, HabitStats, DayActivity } from '../types/habit';
import { formatDateToIndonesian, getTodayString } from '../lib/storage';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: HabitStats;
  habits: Habit[];
  targetHabit?: Habit | null;
  heatmapData: DayActivity[];
  userEmail?: string | null;
}

type CardFormat = 'story' | 'square';
type CardTheme = 'emerald' | 'cosmic' | 'sunset' | 'onyx';

const THEMES: { id: CardTheme; name: string; bgClass: string; gradient: [string, string, string] }[] = [
  { 
    id: 'emerald', 
    name: 'Cyber Emerald', 
    bgClass: 'from-emerald-950 via-slate-900 to-teal-950',
    gradient: ['#022c22', '#0f172a', '#042f2e'] 
  },
  { 
    id: 'cosmic', 
    name: 'Cosmic Galaxy', 
    bgClass: 'from-purple-950 via-slate-900 to-indigo-950',
    gradient: ['#2e1065', '#0f172a', '#1e1b4b'] 
  },
  { 
    id: 'sunset', 
    name: 'Sunset Flame', 
    bgClass: 'from-amber-950 via-rose-950 to-slate-900',
    gradient: ['#451a03', '#4c0519', '#0f172a'] 
  },
  { 
    id: 'onyx', 
    name: 'Obsidian Minimal', 
    bgClass: 'from-zinc-950 via-neutral-900 to-black',
    gradient: ['#09090b', '#18181b', '#000000'] 
  },
];

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  stats,
  habits,
  targetHabit,
  heatmapData,
  userEmail,
}) => {
  const [format, setFormat] = useState<CardFormat>('square');
  const [theme, setTheme] = useState<CardTheme>('emerald');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeHabits = habits.filter((h) => !h.archived);
  const userName = userEmail ? userEmail.split('@')[0] : 'Habit Champion';
  const todayFormatted = formatDateToIndonesian(getTodayString());

  // Render Card on HTML5 Canvas in High Definition (2x resolution)
  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    const width = format === 'story' ? 1080 : 1080;
    const height = format === 'story' ? 1920 : 1080;

    canvas.width = width;
    canvas.height = height;

    // Theme Colors
    const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, currentTheme.gradient[0]);
    bgGrad.addColorStop(0.5, currentTheme.gradient[1]);
    bgGrad.addColorStop(1, currentTheme.gradient[2]);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative Glow Circles
    ctx.save();
    ctx.filter = 'blur(100px)';
    ctx.fillStyle = theme === 'emerald' ? 'rgba(16, 185, 129, 0.25)' : theme === 'cosmic' ? 'rgba(168, 85, 247, 0.25)' : theme === 'sunset' ? 'rgba(244, 63, 94, 0.25)' : 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.2, 350, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.8, 300, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Outer Decorative Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Header: App Logo & User
    const startY = format === 'story' ? 180 : 120;

    // Badge Pill
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    roundRect(ctx, 80, startY, 240, 60, 30, true, false);
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('⚡ HabitFlow PWA', 105, startY + 38);

    // User Handle
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`@${userName}`, width - 80, startY + 38);
    ctx.textAlign = 'left';

    // Title / Milestone
    const titleY = startY + 120;
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    if (targetHabit) {
      ctx.fillText(targetHabit.title, 80, titleY);
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '400 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`Kategori: ${targetHabit.category} • ${todayFormatted}`, 80, titleY + 50);
    } else {
      ctx.fillText('Konsistensi & Progres Harian', 80, titleY);
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '400 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`Laporan Kebiasaan Aktif • ${todayFormatted}`, 80, titleY + 50);
    }

    // Stats Highlight Card (Big Streak)
    const cardY = titleY + 110;
    const cardH = format === 'story' ? 420 : 340;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    roundRect(ctx, 80, cardY, width - 160, cardH, 40, true, true);

    // Streak Count
    ctx.fillStyle = '#f59e0b';
    ctx.font = '800 110px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`🔥 ${stats.currentStreak}`, 120, cardY + 140);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Hari Streak Tanpa Putus', 120, cardY + 200);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '400 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`Rekor Terbaik: ${stats.bestStreak} Hari • Total ${stats.totalCompletions}x Checklist`, 120, cardY + 245);

    // Progress Bar inside Card
    const barY = cardY + 280;
    const barW = width - 240;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    roundRect(ctx, 120, barY, barW, 20, 10, true, false);

    const progressW = Math.max(20, (barW * stats.todayPercentage) / 100);
    const pGrad = ctx.createLinearGradient(120, barY, 120 + progressW, barY);
    pGrad.addColorStop(0, '#10b981');
    pGrad.addColorStop(1, '#06b6d4');
    ctx.fillStyle = pGrad;
    roundRect(ctx, 120, barY, progressW, 20, 10, true, false);

    // Mini Heatmap Visualization
    const heatY = cardY + cardH + 50;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('📅 Aktivitas 30 Hari Terakhir', 80, heatY);

    const recent30 = heatmapData.slice(-30);
    const boxSize = Math.floor((width - 160 - 29 * 10) / 30);
    const heatGridY = heatY + 30;

    recent30.forEach((day, idx) => {
      const bx = 80 + idx * (boxSize + 10);
      if (day.count > 0) {
        ctx.fillStyle = day.intensity === 4 ? '#10b981' : day.intensity === 3 ? '#059669' : day.intensity === 2 ? '#047857' : '#065f46';
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      }
      roundRect(ctx, bx, heatGridY, boxSize, boxSize, 6, true, false);
    });

    // Story Format Extra Content: Habit Checklist Preview & Motivational Quote
    if (format === 'story') {
      const habitsY = heatGridY + boxSize + 80;
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('🎯 Rutinitas Pilihan:', 80, habitsY);

      activeHabits.slice(0, 4).forEach((h, i) => {
        const hy = habitsY + 45 + i * 80;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        roundRect(ctx, 80, hy, width - 160, 65, 20, true, false);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText('✓', 110, hy + 42);

        ctx.fillStyle = '#ffffff';
        ctx.font = '600 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(h.title, 160, hy + 42);
      });

      // Quote at Bottom
      const quoteY = height - 260;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = 'italic 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('"Kita adalah apa yang kita lakukan berulang kali.', width / 2, quoteY);
      ctx.fillText('Keunggulan bukanlah suatu tindakan, melainkan suatu kebiasaan."', width / 2, quoteY + 40);
      ctx.textAlign = 'left';
    }

    // Footer Watermark & Web Link
    const footY = height - 90;
    ctx.fillStyle = '#64748b';
    ctx.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('habbit-tracker-bice.vercel.app', 80, footY);

    ctx.textAlign = 'right';
    ctx.fillText('Dibuat dengan HabitFlow 🔥', width - 80, footY);
    ctx.textAlign = 'left';
  }, [format, theme, stats, habits, targetHabit, heatmapData, userName, todayFormatted]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => drawCard(), 50);
    }
  }, [isOpen, format, theme, drawCard]);

  // Rounded rectangle helper for canvas
  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    fill: boolean,
    stroke: boolean
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  // 1. Download PNG Image
  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `habitflow-streak-${stats.currentStreak}hari-${format}.png`;
    link.href = dataUrl;
    link.click();
  };

  // 2. Copy Image to Clipboard
  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      setIsGenerating(true);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        setCopied(true);
        setIsGenerating(false);
        setTimeout(() => setCopied(false), 2500);
      });
    } catch {
      // Fallback
      setIsGenerating(false);
    }
  };

  // 3. Web Share API (Mobile native share sheet)
  const handleNativeShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `habitflow-streak-${stats.currentStreak}hari.png`, { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `HabitFlow - ${stats.currentStreak} Hari Streak!`,
            text: `Saya sudah mempertahankan konsistensi kebiasaan selama ${stats.currentStreak} hari berturut-turut di HabitFlow! 🔥🚀`,
            files: [file],
          });
        } else {
          handleDownloadImage();
        }
      });
    } catch {
      handleDownloadImage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] p-6 sm:p-8 bg-card border border-border rounded-3xl shadow-2xl overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
              <Share2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <span>Bagikan Kartu Pencapaian</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                  HD Quality
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                Ekspor poster estetis siap upload untuk Instagram Story, WhatsApp Status, dan X
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Center: Interactive Live Canvas Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-secondary/30 rounded-3xl border border-border">
            <div className="w-full flex items-center justify-center overflow-hidden max-h-[460px] rounded-2xl shadow-2xl border border-white/10">
              <canvas
                ref={canvasRef}
                className={`w-auto max-h-[440px] rounded-xl object-contain transition-all shadow-2xl ${
                  format === 'story' ? 'aspect-[9/16]' : 'aspect-square'
                }`}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 flex items-center gap-1.5 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Gambar dirender dalam resolusi tajam 1080p Ultra-HD
            </p>
          </div>

          {/* Right: Customization Controls & Export Actions */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Format Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5 text-primary" />
                <span>Format Rasio:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormat('square')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    format === 'square'
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Square className="h-4 w-4" />
                  <span>Square 1:1 (Post/Card)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormat('story')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    format === 'story'
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'border-border bg-secondary/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Story 9:16 (IG/WA)</span>
                </button>
              </div>
            </div>

            {/* Theme Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Palette className="h-3.5 w-3.5 text-primary" />
                <span>Pilih Tema Desain:</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={`p-2.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                      theme === t.id
                        ? 'border-primary ring-2 ring-primary/40 bg-secondary'
                        : 'border-border bg-secondary/30 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span 
                      className="w-4 h-4 rounded-full border border-white/20 shadow-xs flex-shrink-0"
                      style={{ background: t.gradient[0] }}
                    />
                    <span className="truncate">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Export Actions */}
            <div className="space-y-2.5 pt-3 border-t border-border">
              {/* Download PNG */}
              <button
                type="button"
                onClick={handleDownloadImage}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Unduh Gambar PNG (HD)</span>
              </button>

              {/* Copy Image */}
              <button
                type="button"
                onClick={handleCopyImage}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-2xl border border-border bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500" />
                    <span className="text-emerald-500">Gambar Disalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Salin Gambar (Copy Image)</span>
                  </>
                )}
              </button>

              {/* Native Web Share */}
              <button
                type="button"
                onClick={handleNativeShare}
                className="w-full py-3 px-4 rounded-2xl border border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground font-semibold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Bagikan Langsung (WhatsApp / IG)</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
