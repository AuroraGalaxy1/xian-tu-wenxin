// 成就系统：自动评估 + 奖励
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usePlayerStore } from '@/stores/playerStore';
import { useMapStore } from '@/stores/mapStore';
import { useLogStore } from '@/stores/logStore';
import { achievementsData } from '@/lib/gameData/achievements';
import { getRealmIndex } from '@/lib/gameData/realms';
import type { Achievement } from '@/types/achievement';
import type { Player } from '@/types/player';

/** 判断单个成就是否达成（纯函数） */
export function isAchievementMet(ach: Achievement, player: Player): boolean {
  switch (ach.type) {
    case 'breakthrough':
      return getRealmIndex(player.realm) >= getRealmIndex(ach.target);
    case 'kill_enemy':
      return player.killedEnemies.includes(ach.target);
    case 'collect_item':
      return player.inventory.includes(ach.target);
    case 'scene_visit':
      return player.visitedScenes.includes(ach.target);
    case 'xiuwei':
      return player.stats.xiuwei >= (ach.amount ?? 0);
    case 'quest_complete':
      return player.quests.some(
        (q) => q.id === ach.target && q.status === 'completed'
      );
    case 'combat_win':
      return player.killedEnemies.length >= (ach.amount ?? 1);
    case 'visit_all': {
      const all = useMapStore.getState().locations.map((l) => l.id);
      return all.every((id) => player.visitedScenes.includes(id));
    }
    case 'lingShi':
      return player.lingShi >= (ach.amount ?? 0);
    case 'inventory_kind':
      return new Set(player.inventory).size >= (ach.amount ?? 1);
    default:
      return false;
  }
}

interface AchievementState {
  unlockedIds: string[];
  evaluate: () => void;
  isUnlocked: (id: string) => boolean;
}

export const useAchievementStore = create<AchievementState>()(
  persist<AchievementState, [], []>(
    (set, get) => ({
      unlockedIds: [],
      isUnlocked: (id) => get().unlockedIds.includes(id),
      evaluate: () => {
        const p = usePlayerStore.getState().player;
        if (!p) return;
        const newly: Achievement[] = [];
        // 逐个原子解锁，防止重入/并发导致重复发放奖励
        for (const ach of Object.values(achievementsData)) {
          if (get().isUnlocked(ach.id)) continue;
          if (isAchievementMet(ach, p)) {
            newly.push(ach);
            set((s) => ({ unlockedIds: [...s.unlockedIds, ach.id] }));
          }
        }
        if (newly.length === 0) return;
        // 发放奖励 + 日志
        const ps = usePlayerStore.getState();
        for (const ach of newly) {
          if (ach.reward) {
            if (ach.reward.xiuwei) ps.gainXiuwei(ach.reward.xiuwei);
            if (ach.reward.lingShi) ps.gainLingShi(ach.reward.lingShi);
            ach.reward.items?.forEach((i) => ps.addItem(i));
          }
          useLogStore
            .getState()
            .addLog(`🏆 达成成就「${ach.name}」！`, 'special');
        }
      },
    }),
    {
      name: 'achievement-storage',
    }
  )
);

// ===== 安全初始化：只在 playerStore 首次初始化完成后评估一次 =====
// 避免在模块级 subscribe 导致循环触发
let initialized = false;
usePlayerStore.subscribe((state) => {
  // 只在 player 首次从 null 变为有效值时评估一次
  if (!initialized && state.player) {
    initialized = true;
    // 使用微任务延迟到当前同步链完成后执行
    queueMicrotask(() => {
      useAchievementStore.getState().evaluate();
    });
  }
});