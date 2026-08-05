import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, QuestEntryStatus } from '@/types/player';
import { getRealmIndex, getNextRealm } from '@/lib/gameData/realms';
import {
  canBreakthrough,
  getBreakthroughHints,
  getPlayerCombatStats,
  isXiuweiEnough,
} from '@/lib/utils/gameUtils';
import { questsData } from '@/lib/gameData/quests';
import { useLogStore } from '@/stores/logStore';
import { useMapStore } from '@/stores/mapStore';

interface PlayerState {
  player: Player | null;
  setPlayer: (player: Player) => void;
  updateStats: (stats: Partial<Player['stats']>) => void;
  addItem: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  addQuest: (questId: string) => void;
  updateQuestStatus: (questId: string, status: QuestEntryStatus) => void;
  gainXiuwei: (amount: number) => void;
  gainLingShi: (amount: number) => void;
  spendLingShi: (amount: number) => boolean;
  setHp: (hp: number) => void;
  heal: (amount: number) => void;
  damage: (amount: number) => void;
  changeScene: (sceneId: string) => void;
  recordKill: (enemyId: string) => void;
  tryBreakthrough: () => { success: boolean; message: string };
  evaluateQuests: () => void;
}

const initialState: Player = {
  id: 'player_001',
  name: '无名修士',
  realm: '凡胎',
  realmStage: '悟',
  stats: {
    daoxin: 67,
    maxDaoxin: 100,
    lingyun: 12,
    maxLingyun: 50,
    tipo: 22,
    shenshi: 15,
    yinguo: 5,
    zhinian: 12,
    xiuwei: 1240,
  },
  hp: 160,
  maxHp: 160,
  lingShi: 100,
  currentScene: 'po_miao',
  inventory: ['yu_jian_sui_pian'],
  skills: [],
  quests: [],
  relationships: {},
  equipment: {},
  visitedScenes: ['po_miao'],
  killedEnemies: [],
};

export const usePlayerStore = create<PlayerState>()(
  persist<PlayerState, [], []>(
    (set, get) => ({
      player: initialState,
      
      setPlayer: (player) => set({ player }),

      gainLingShi: (amount) =>
        set((state) => ({
          player: state.player
            ? { ...state.player, lingShi: state.player.lingShi + amount }
            : null,
        })),

      spendLingShi: (amount) => {
        const p = get().player;
        if (!p || p.lingShi < amount) return false;
        set({ player: { ...p, lingShi: p.lingShi - amount } });
        return true;
      },

      setHp: (hp) =>
        set((state) => ({
          player: state.player
            ? { ...state.player, hp: Math.max(0, Math.min(state.player.maxHp, hp)) }
            : null,
        })),

      heal: (amount) =>
        set((state) => ({
          player: state.player
            ? {
                ...state.player,
                hp: Math.min(state.player.maxHp, state.player.hp + amount),
              }
            : null,
        })),

      damage: (amount) =>
        set((state) => ({
          player: state.player
            ? {
                ...state.player,
                hp: Math.max(0, state.player.hp - amount),
              }
            : null,
        })),

      updateStats: (stats) =>
        set((state) => ({
          player: state.player
            ? {
                ...state.player,
                stats: { ...state.player.stats, ...stats },
              }
            : null,
        })),
      
      addItem: (itemId) =>
        set((state) => ({
          player: state.player
            ? {
                ...state.player,
                inventory: [...state.player.inventory, itemId],
              }
            : null,
        })),
      
      removeItem: (itemId) =>
        set((state) => ({
          player: state.player
            ? {
                ...state.player,
                inventory: state.player.inventory.filter((id) => id !== itemId),
              }
            : null,
        })),
      
      addQuest: (questId) =>
        set((state) => ({
          player: state.player
            ? {
                ...state.player,
                quests: [
                  ...state.player.quests,
                  { id: questId, status: 'active' },
                ],
              }
            : null,
        })),
      
      updateQuestStatus: (questId, status) =>
        set((state) => ({
          player: state.player
            ? {
                ...state.player,
                quests: state.player.quests.map((q) =>
                  q.id === questId ? { ...q, status } : q
                ),
              }
            : null,
        })),
      
      gainXiuwei: (amount) =>
        set((state) => {
          if (!state.player) return state;
          const xiuwei = state.player.stats.xiuwei + amount;
          const stage = isXiuweiEnough({
            ...state.player,
            stats: { ...state.player.stats, xiuwei },
          })
            ? '破'
            : '悟';
          return {
            player: {
              ...state.player,
              realmStage: stage,
              stats: { ...state.player.stats, xiuwei },
            },
          };
        }),
      
      // ⭐⭐⭐ 这里修改 changeScene 方法 ⭐⭐⭐
      changeScene: (sceneId) => {
        const p = get().player;
        if (!p) return;
        const mapStore = useMapStore.getState();
        if (mapStore.setCurrentLocation) mapStore.setCurrentLocation(sceneId);

        const visitedScenes = p.visitedScenes.includes(sceneId)
          ? p.visitedScenes
          : [...p.visitedScenes, sceneId];

        set({
          player: {
            ...p,
            currentScene: sceneId,
            visitedScenes,
          },
        });

        // 首次到达新场景时检查任务
        if (!p.visitedScenes.includes(sceneId)) {
          // 自动接取目标为该场景的主线任务（保证主线可串联）
          const mainQuest = Object.values(questsData).find(
            (q) =>
              q.type === 'main' &&
              q.objectives.some((o) => o.type === 'scene_visit' && o.target === sceneId)
          );
          if (mainQuest && !p.quests.some((x) => x.id === mainQuest.id)) {
            get().addQuest(mainQuest.id);
          }
          get().evaluateQuests();
        }
      },

      recordKill: (enemyId) => {
        const p = get().player;
        if (!p || p.killedEnemies.includes(enemyId)) return;
        set({
          player: {
            ...p,
            killedEnemies: [...p.killedEnemies, enemyId],
          },
        });
        get().evaluateQuests();
      },

      tryBreakthrough: () => {
        const p = get().player;
        if (!p) return { success: false, message: '角色不存在' };
        const idx = getRealmIndex(p.realm);
        const next = getNextRealm(idx);
        if (!next) return { success: false, message: '已达修行之巅，再无前路。' };
        if (!canBreakthrough(p)) {
          return { success: false, message: getBreakthroughHints(p).join('；') };
        }
        if (p.stats.zhinian >= 70) {
          return {
            success: false,
            message: '执念缠身，心魔盘踞，难以静心突破。先去化解执念吧。',
          };
        }
        const combat = getPlayerCombatStats({ ...p, realm: next.name });
        const newPlayer: Player = {
          ...p,
          realm: next.name,
          realmStage: '立',
          stats: {
            ...p.stats,
            daoxin: Math.min(p.stats.daoxin, next.maxDaoxin),
            maxDaoxin: next.maxDaoxin,
            lingyun: Math.min(p.stats.lingyun, next.maxLingyun),
            maxLingyun: next.maxLingyun,
            xiuwei: Math.max(0, p.stats.xiuwei - next.xiuweiRequired),
          },
          maxHp: combat.maxHp,
          hp: combat.maxHp,
        };
        set({ player: newPlayer });
        useLogStore
          .getState()
          .addLog(`✨ 天光乍破，你成功突破至「${next.name}」境界！`, 'special');
        // 突破筑基后，断魂崖禁制松动解锁
        if (next.id === 'zhu_ji') {
          useMapStore.getState().unlockLocation('duan_hun_ya');
          useLogStore
            .getState()
            .addLog('🗺 你实力精进，断魂崖的禁制随之松动，地图上浮现出新的地点。', 'special');
        }
        // 结算境界类任务（如 q4 突破筑基）
        get().evaluateQuests();
        // 突破筑基且 q4 完成后，自动接取讨伐黑风妖的主线任务 q5
        const pAfter = get().player;
        if (pAfter && pAfter.realm === '筑基') {
          const q4Done = pAfter.quests.some(
            (x) => x.id === 'q4' && x.status === 'completed'
          );
          const hasQ5 = pAfter.quests.some((x) => x.id === 'q5');
          if (q4Done && !hasQ5) {
            get().addQuest('q5');
            useLogStore
              .getState()
              .addLog('📜 你想起墨铁匠的悬赏，决定前往断魂崖除妖。', 'special');
          }
        }
        return { success: true, message: `你成功突破至「${next.name}」！` };
      },

      evaluateQuests: () => {
        const p = get().player;
        if (!p) return;
        let totalXiuwei = 0;
        let totalLingShi = 0;
        const pendingItems: string[] = [];
        let changed = false;
        const newQuests: Player['quests'] = p.quests.map((q) => {
          if (q.status !== 'active') return q;
          const data = questsData[q.id];
          if (!data) return q;
          const met = data.objectives.every((obj) => {
            switch (obj.type) {
              case 'scene_visit':
                return p.visitedScenes.includes(obj.target);
              case 'realm':
                return getRealmIndex(p.realm) >= getRealmIndex(obj.target);
              case 'kill_enemy':
                return p.killedEnemies.includes(obj.target);
              case 'collect_item':
                return (
                  p.inventory.filter((i) => i === obj.target).length >=
                  (obj.amount ?? 1)
                );
              case 'xiuwei':
                return p.stats.xiuwei >= (obj.amount ?? 0);
              default:
                return false;
            }
          });
          if (!met) return q;
          changed = true;
          totalXiuwei += data.rewards.xiuwei ?? 0;
          totalLingShi += data.rewards.lingShi ?? 0;
          data.rewards.items?.forEach((it) => {
            for (let i = 0; i < it.count; i++) pendingItems.push(it.itemId);
          });
          return { ...q, status: 'completed' as const };
        });
        if (changed) {
          set((state) => ({
            player: state.player
              ? {
                  ...state.player,
                  quests: newQuests,
                  stats: {
                    ...state.player.stats,
                    xiuwei: state.player.stats.xiuwei + totalXiuwei,
                  },
                  lingShi: state.player.lingShi + totalLingShi,
                  inventory: [...state.player.inventory, ...pendingItems],
                }
              : null,
          }));
          const parts: string[] = [];
          if (totalXiuwei) parts.push(`修为+${totalXiuwei}`);
          if (totalLingShi) parts.push(`灵石+${totalLingShi}`);
          if (pendingItems.length) parts.push(`获得 ${pendingItems.length} 件物品`);
          useLogStore.getState().addLog(`🎯 任务完成！${parts.join('，')}`, 'special');
        }
      },
    }),
    {
      name: 'player-storage',
      merge: (persisted, current) => {
        const p =
          persisted && typeof persisted === 'object'
            ? (persisted as { player?: Player }).player
            : undefined;
        // 无旧存档数据时保留当前 state（含全部方法）
        if (!p) return current;
        const c = current.player;
        // 关键：spread current 保留全部方法，仅用旧存档数据合并 player 字段
        return {
          ...current,
          player: {
            ...c,
            ...p,
            stats: { ...c?.stats, ...p.stats },
            equipment: { ...(c?.equipment ?? {}), ...(p.equipment ?? {}) },
            visitedScenes: p.visitedScenes ?? c?.visitedScenes ?? [],
            killedEnemies: p.killedEnemies ?? c?.killedEnemies ?? [],
            maxHp: p.maxHp ?? c?.maxHp ?? 100,
            hp: p.hp ?? p.maxHp ?? c?.hp ?? c?.maxHp ?? 100,
            lingShi: p.lingShi ?? c?.lingShi ?? 0,
          } as Player,
        } as PlayerState;
      },
    }
  )
);