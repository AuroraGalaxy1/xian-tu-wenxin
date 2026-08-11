import { create } from 'zustand';
import { api } from '@/lib/api';
import { debounce } from '@/lib/debounce';
import type { Player, QuestEntryStatus } from '@/types/player';
import { getRealmIndex, getNextRealm } from '@/lib/gameData/realms';
import {
  canBreakthrough,
  getBreakthroughHints,
  getPlayerCombatStats,
  isXiuweiEnough,
} from '@/lib/utils/gameUtils';
import { questsData } from '@/lib/gameData/quests';
import { sceneLoreMap, itemLoreMap } from '@/lib/gameData/lore';
import { useLogStore } from '@/stores/logStore';
import { useLoreStore } from '@/stores/loreStore';
import { useMapStore } from '@/stores/mapStore';
import { useUiStore } from '@/stores/uiStore';

/** 数据库行：扁平化的 Player */
interface PlayerRow {
  id: string;
  name: string;
  realm: string;
  realmStage: string;
  daoxin: number;
  maxDaoxin: number;
  lingyun: number;
  maxLingyun: number;
  tipo: number;
  shenshi: number;
  yinguo: number;
  zhinian: number;
  xiuwei: number;
  hp: number;
  maxHp: number;
  lingShi: number;
  currentScene: string;
  inventory: string;
  skills: string;
  quests: string;
  relationships: string;
  equipment: string;
  visitedScenes: string;
  killedEnemies: string;
}

/** Player → 扁平数据库行 */
function toRow(p: Player): PlayerRow {
  return {
    id: p.id,
    name: p.name,
    realm: p.realm,
    realmStage: p.realmStage,
    daoxin: p.stats.daoxin,
    maxDaoxin: p.stats.maxDaoxin,
    lingyun: p.stats.lingyun,
    maxLingyun: p.stats.maxLingyun,
    tipo: p.stats.tipo,
    shenshi: p.stats.shenshi,
    yinguo: p.stats.yinguo,
    zhinian: p.stats.zhinian,
    xiuwei: p.stats.xiuwei,
    hp: p.hp,
    maxHp: p.maxHp,
    lingShi: p.lingShi,
    currentScene: p.currentScene,
    inventory: JSON.stringify(p.inventory),
    skills: JSON.stringify(p.skills),
    quests: JSON.stringify(p.quests),
    relationships: JSON.stringify(p.relationships),
    equipment: JSON.stringify(p.equipment),
    visitedScenes: JSON.stringify(p.visitedScenes),
    killedEnemies: JSON.stringify(p.killedEnemies),
  };
}

/** 扁平数据库行 → Player */
function toPlayer(row: PlayerRow): Player {
  return {
    id: row.id,
    name: row.name,
    realm: row.realm,
    realmStage: row.realmStage,
    stats: {
      daoxin: row.daoxin,
      maxDaoxin: row.maxDaoxin,
      lingyun: row.lingyun,
      maxLingyun: row.maxLingyun,
      tipo: row.tipo,
      shenshi: row.shenshi,
      yinguo: row.yinguo,
      zhinian: row.zhinian,
      xiuwei: row.xiuwei,
    },
    hp: row.hp,
    maxHp: row.maxHp,
    lingShi: row.lingShi,
    currentScene: row.currentScene,
    inventory: safeParse(row.inventory, []),
    skills: safeParse(row.skills, []),
    quests: safeParse(row.quests, []),
    relationships: safeParse(row.relationships, {}),
    equipment: safeParse(row.equipment, {}),
    visitedScenes: safeParse(row.visitedScenes, []),
    killedEnemies: safeParse(row.killedEnemies, []),
  };
}

function safeParse<T>(s: string | null | undefined, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

interface PlayerState {
  player: Player | null;
  isLoading: boolean;

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
  getCurrentQuestHint: () => { text: string; questId: string; questName: string } | null;
  loadPlayer: () => Promise<void>;
  _save: () => void;
}

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  player: null,
  isLoading: true,

  loadPlayer: async () => {
    set({ isLoading: true });
    const data = await api.get<PlayerRow>('/player');
    if (data) {
      set({ player: toPlayer(data), isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  _save: debounce(async () => {
    const p = get().player;
    if (!p) return;
    await api.put('/player', toRow(p));
  }, 500),

  setPlayer: (player) => {
    set({ player });
    get()._save();
  },

  gainLingShi: (amount) => {
    set((state) => ({
      player: state.player
        ? { ...state.player, lingShi: state.player.lingShi + amount }
        : null,
    }));
    get()._save();
  },

  spendLingShi: (amount) => {
    const p = get().player;
    if (!p || p.lingShi < amount) return false;
    set({ player: { ...p, lingShi: p.lingShi - amount } });
    get()._save();
    return true;
  },

  setHp: (hp) => {
    set((state) => ({
      player: state.player
        ? { ...state.player, hp: Math.max(0, Math.min(state.player.maxHp, hp)) }
        : null,
    }));
    get()._save();
  },

  heal: (amount) => {
    set((state) => ({
      player: state.player
        ? {
            ...state.player,
            hp: Math.min(state.player.maxHp, state.player.hp + amount),
          }
        : null,
    }));
    get()._save();
  },

  damage: (amount) => {
    set((state) => ({
      player: state.player
        ? {
            ...state.player,
            hp: Math.max(0, state.player.hp - amount),
          }
        : null,
    }));
    get()._save();
  },

  updateStats: (stats) => {
    set((state) => ({
      player: state.player
        ? {
            ...state.player,
            stats: { ...state.player.stats, ...stats },
          }
        : null,
    }));
    get()._save();
  },

  addItem: (itemId) => {
    const p = get().player;
    if (p && !p.inventory.includes(itemId)) {
      useLoreStore.getState().unlockMany(itemLoreMap[itemId] ?? []);
    }
    set((state) => ({
      player: state.player
        ? {
            ...state.player,
            inventory: [...state.player.inventory, itemId],
          }
        : null,
    }));
    get()._save();
  },

  removeItem: (itemId) => {
    set((state) => ({
      player: state.player
        ? {
            ...state.player,
            inventory: state.player.inventory.filter((id) => id !== itemId),
          }
        : null,
    }));
    get()._save();
  },

  addQuest: (questId) => {
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
    }));
    get()._save();
  },

  updateQuestStatus: (questId, status) => {
    set((state) => ({
      player: state.player
        ? {
            ...state.player,
            quests: state.player.quests.map((q) =>
              q.id === questId ? { ...q, status } : q
            ),
          }
        : null,
    }));
    get()._save();
  },

  gainXiuwei: (amount) => {
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
    });
    get()._save();
  },

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

    if (!p.visitedScenes.includes(sceneId)) {
      useLoreStore.getState().unlockMany(sceneLoreMap[sceneId] ?? []);
      if (sceneId === 'fei_zhai') {
        useUiStore.getState().openChoice('fei_zhai_zhinian');
      }
      if (sceneId === 'po_miao' && !p.quests.some((x) => x.id === 'q0')) {
        get().addQuest('q0');
      }
      const sceneQuest = Object.values(questsData).find(
        (q) =>
          q.objectives.some((o) => o.type === 'scene_visit' && o.target === sceneId)
      );
      if (sceneQuest && !p.quests.some((x) => x.id === sceneQuest.id)) {
        get().addQuest(sceneQuest.id);
      }
      get().evaluateQuests();
    }
    get()._save();
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
    get()._save();
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
    if (next.id === 'ning_ye') {
      useMapStore.getState().unlockLocation('duan_hun_ya');
      useLogStore
        .getState()
        .addLog('🗺 你实力精进，断魂崖的禁制随之松动，地图上浮现出新的地点。', 'special');
    }
    if (next.id === 'yu_fu') {
      useMapStore.getState().unlockLocation('mi_jing_ru_kou');
      useLogStore
        .getState()
        .addLog('🗺 玉府既成，秘境入口的古老禁制终于回应了你——落星坡的秘密在等你。', 'special');
    }
    get().evaluateQuests();
    const pAfter = get().player;
    if (pAfter && pAfter.realm === '凝液') {
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
    get()._save();
    return { success: true, message: `你成功突破至「${next.name}」！` };
  },

  getCurrentQuestHint: () => {
    const p = get().player;
    if (!p) return null;
    const currentScene = p.currentScene;

    const activeQuests = p.quests
      .filter((q) => q.status === 'active')
      .sort((a, b) => {
        const dataA = questsData[a.id];
        const dataB = questsData[b.id];
        if (!dataA || !dataB) return 0;
        if (dataA.type !== dataB.type) {
          return dataA.type === 'main' ? -1 : 1;
        }
        return a.id.localeCompare(b.id);
      });

    for (const q of activeQuests) {
      const data = questsData[q.id];
      if (!data?.hints) continue;
      const hint = data.hints.find((h) => h.sceneId === currentScene);
      if (hint) {
        return { text: hint.text, questId: q.id, questName: data.name };
      }
    }
    return null;
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
      const completedNames = newQuests
        .filter((q, i) => q.status === 'completed' && p.quests[i]?.status !== 'completed')
        .map((q) => questsData[q.id]?.name ?? q.id)
        .filter(Boolean);
      for (const name of completedNames) {
        useLogStore.getState().addLog(`✦ 任务完成：「${name}」`, 'special');
      }
      const parts: string[] = [];
      if (totalXiuwei) parts.push(`修为+${totalXiuwei}`);
      if (totalLingShi) parts.push(`灵石+${totalLingShi}`);
      if (pendingItems.length) parts.push(`获得 ${pendingItems.length} 件物品`);
      if (parts.length) {
        useLogStore.getState().addLog(`奖励：${parts.join('，')}`, 'item');
      }
      // 任务完成 → 解锁特定地点
      const questUnlockMap: Record<string, string> = {
        q0: 'shan_gu',
      };
      for (const q of newQuests) {
        const prevQ = p.quests.find((x) => x.id === q.id);
        if (
          q.status === 'completed' &&
          prevQ?.status !== 'completed' &&
          questUnlockMap[q.id]
        ) {
          const locId = questUnlockMap[q.id];
          useMapStore.getState().unlockLocation(locId);
          const loc = useMapStore.getState().locations.find((l) => l.id === locId);
          if (loc) {
            useLogStore
              .getState()
              .addLog(`🗺 残玉共鸣，${loc.name}的位置在地图上显现！`, 'special');
          }
        }
      }
      get()._save();
    }
  },
}));