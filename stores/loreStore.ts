// 见闻录（Lore）状态管理
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LoreState {
  /** 已解锁的见闻 id 集合 */
  unlockedIds: string[];
  unlock: (loreId: string) => void;
  unlockMany: (loreIds: string[]) => void;
  isUnlocked: (loreId: string) => boolean;
}

export const useLoreStore = create<LoreState>()(
  persist<LoreState, [], []>(
    (set, get) => ({
      unlockedIds: [],
      unlock: (loreId) => {
        if (get().unlockedIds.includes(loreId)) return;
        set((s) => ({ unlockedIds: [...s.unlockedIds, loreId] }));
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
      },
      isUnlocked: (loreId) => get().unlockedIds.includes(loreId),
    }),
    {
      name: 'lore-storage',
    }
  )
);
