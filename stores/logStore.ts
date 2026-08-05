import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LogEntry {
  id: string;
  timestamp: string;
  content: string;
  type: 'normal' | 'item' | 'stat' | 'danger' | 'special' | 'combat';
}

interface LogState {
  logs: LogEntry[];
  addLog: (content: string, type?: LogEntry['type']) => void;
  clearLogs: () => void;
}

export const useLogStore = create<LogState>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (content, type = 'normal') => {
        const newLog: LogEntry = {
          id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          timestamp: new Date().toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          content,
          type,
        };
        set((state) => ({
          logs: [...state.logs, newLog].slice(-50), // 保留最近50条
        }));
      },
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: 'log-storage',
    }
  )
);