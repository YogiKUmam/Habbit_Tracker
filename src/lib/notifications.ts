// Web Notifications API Helper

export interface NotificationSettings {
  enabled: boolean;
  time: string; // HH:mm format, e.g. "20:00"
}

const NOTIFICATION_KEY = 'habitflow_notifications_v1';

export function getNotificationSettings(): NotificationSettings {
  try {
    const stored = localStorage.getItem(NOTIFICATION_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return { enabled: false, time: '20:00' };
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(settings));
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    alert('Browser Anda tidak mendukung Web Notifications.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendHabitReminder(pendingHabitTitles: string[]): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const count = pendingHabitTitles.length;
  if (count === 0) return;

  const title = '🌟 HabitFlow: Waktunya Menyelesaikan Kebiasaan!';
  const body = count === 1
    ? `Jangan lupa selesaikan "${pendingHabitTitles[0]}" hari ini untuk menjaga streak Anda!`
    : `Masih ada ${count} kebiasaan belum selesai (${pendingHabitTitles.slice(0, 2).join(', ')}${count > 2 ? '...' : ''}). Tetap konsisten!`;

  try {
    new Notification(title, {
      body,
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%2310b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>',
    });
  } catch (e) {
    console.error('Failed to trigger notification:', e);
  }
}
