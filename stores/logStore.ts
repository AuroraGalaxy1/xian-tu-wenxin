import { create } from 'zustand';
import { api } from '@/lib/api';
import { debounce } from '@/lib/debounce';

export interface LogEntry {
  id: string;
  timestamp: string;
  content: string;
  type: 'normal' | 'item' | 'stat' | 'danger' | 'special' | 'combat';
}

interface LogState {
  logs: LogEntry[];
  isLoading: boolean;

  addLog: (content: string, type?: LogEntry['type']) => void;
  clearLogs: () => void;
  loadLogs: () => Promise<void>;
  _save: () => void;
}

export const useLogStore = create<LogState>()((set, get) => ({
  logs: [],
  isLoading: true,

  loadLogs: async () => {
    set({ isLoading: true });
    const data = await api.get<LogEntry[]>('/log');
    if (data) {
      set({ logs: data, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  _save: debounce(async () => {
    const { logs } = get();
    await api.put('/log', { logs });
  }, 500),

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
      logs: [...state.logs, newLog].slice(-50),
    }));
    get()._save();
  },

  clearLogs: () => {
    set({ logs: [] });
    get()._save();
  },
}));