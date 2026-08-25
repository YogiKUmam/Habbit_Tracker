import React, { useState } from 'react';
import { X, Download, Upload, Database, RotateCcw, AlertTriangle, Check } from 'lucide-react';
import { Habit, HabitLog } from '../types/habit';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  habits: Habit[];
  logs: HabitLog[];
  onRestoreData: (habits: Habit[], logs: HabitLog[]) => void;
  onResetData: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  habits,
  logs,
  onRestoreData,
  onResetData,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Export JSON
  const handleExportJSON = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      habits,
      logs,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `habitflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setImportStatus('Data berhasil diunduh dalam file JSON.');
    setErrorStatus(null);
  };

  // 2. Import JSON
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (Array.isArray(parsed.habits) && Array.isArray(parsed.logs)) {
          onRestoreData(parsed.habits, parsed.logs);
          setImportStatus(`Berhasil memulihkan ${parsed.habits.length} kebiasaan dan ${parsed.logs.length} riwayat log.`);
          setErrorStatus(null);
        } else {
          setErrorStatus('Format file JSON tidak valid. Pastikan file berasal dari backup HabitFlow.');
          setImportStatus(null);
        }
      } catch (err) {
        setErrorStatus('Gagal membaca file JSON. Pastikan file tidak rusak.');
        setImportStatus(null);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-inner">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Backup & Pemulihan Data</h2>
              <p className="text-xs text-muted-foreground">Kelola portabilitas dan cadangan data aktivitas Anda</p>
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

        {/* Notifications */}
        {importStatus && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold flex items-center gap-2">
            <Check className="h-4 w-4" /> {importStatus}
          </div>
        )}
        {errorStatus && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> {errorStatus}
          </div>
        )}

        {/* Actions Grid */}
        <div className="mt-5 space-y-4">
          {/* 1. Export */}
          <div className="p-4 rounded-2xl border border-border bg-secondary/30 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground">Ekspor Cadangan (JSON)</h4>
              <p className="text-xs text-muted-foreground">Unduh {habits.length} kebiasaan dan seluruh log riwayat.</p>
            </div>
            <button
              type="button"
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all"
            >
              <Download className="h-3.5 w-3.5" /> Ekspor
            </button>
          </div>

          {/* 2. Import */}
          <div className="p-4 rounded-2xl border border-border bg-secondary/30 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-foreground">Impor / Pulihkan Cadangan</h4>
              <p className="text-xs text-muted-foreground">Muat file `.json` backup dari perangkat lain.</p>
            </div>
            <label className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground text-xs font-bold cursor-pointer transition-all">
              <Upload className="h-3.5 w-3.5" /> Impor
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>
          </div>

          {/* 3. Reset Demo */}
          <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-rose-500">Reset ke Data Awal</h4>
              <p className="text-xs text-muted-foreground">Kembalikan ke habit & log demonstrasi bawaan.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Yakin ingin mereset seluruh data kembali ke setelan awal demo?')) {
                  onResetData();
                  setImportStatus('Data berhasil direset ke demonstrasi awal.');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 text-xs font-bold transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
