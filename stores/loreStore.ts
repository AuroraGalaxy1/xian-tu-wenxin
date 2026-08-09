// 见闻录（Lore）状态管理
import { create } from 'zustand';
import { api } from '@/lib/api';
import { debounce } from '@/lib/debounce';

interface LoreState {
  unlockedIds: string[];
  isLoading: boolean;

  unlock: (loreId: string) => void;
  unlockMany: (loreIds: string[]) => void;
  isUnlocked: (loreId: string) => boolean;
  loadLore: () => Promise<void>;
  _save: () => void;
}

export const useLoreStore = create<LoreState>()((set, get) => ({
  unlockedIds: [],
  isLoading: true,

  loadLore: async () => {
    set({ isLoading: true });
    const data = await api.get<{ unlockedIds: string }>('/lore');
    if (data) {
      const ids = JSON.parse(data.unlockedIds || '[]');
      set({ unlockedIds: ids, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  _save: debounce(async () => {
    const { unlockedIds } = get();
    await api.put('/lore', { unlockedIds: JSON.stringify(unlockedIds) });
  }, 500),

  unlock: (loreId) => {
    if (get().unlockedIds.includes(loreId)) return;
    set((s) => ({ unlockedIds: [...s.unlockedIds, loreId] }));
    get()._save();
  },

  unlockMany: (loreIds) => {
    set((s) => {
      const next = [...s.unlockedIds];
      let changed = false;
      for (const id of loreIds) {
        if (id && !next.includes(id)) {
          next.push(id);
          changed = true;
        }
      }
      return changed ? { unlockedIds: next } : s;
    });
    get()._save();
  },

  isUnlocked: (loreId) => get().unlockedIds.includes(loreId),
}));