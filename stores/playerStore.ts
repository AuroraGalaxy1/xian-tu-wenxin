import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 注意：这里导入 mapStore，但为了避免循环依赖，在方法内部动态导入
// 或者直接使用 useMapStore.getState()

export interface Player {
  id: string;
  name: string;
  realm: string;           // 境界
  realmStage: string;      // 悟/破/立
  stats: {
    daoxin: number;        // 道心
    maxDaoxin: number;
    lingyun: number;       // 灵蕴
    maxLingyun: number;
    tipo: number;          // 体魄
    shenshi: number;       // 神识
    yinguo: number;        // 因果 (-100 ~ +100)
    zhinian: number;       // 执念 (0 ~ 100)
    xiuwei: number;        // 修为
  };
  currentScene: string;    // 当前场景ID
  inventory: string[];     // 物品ID列表
  skills: string[];        // 技能/功法ID列表
  quests: {
    id: string;
    status: 'pending' | 'active' | 'completed' | 'locked';
  }[];
  relationships: {
    [npcId: string]: number; // 好感度
  };
}

interface PlayerState {
  player: Player | null;
  setPlayer: (player: Player) => void;
  updateStats: (stats: Partial<Player['stats']>) => void;
  addItem: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  addQuest: (questId: string) => void;
  updateQuestStatus: (questId: string, status: Player['quests'][0]['status']) => void;
  gainXiuwei: (amount: number) => void;
  changeScene: (sceneId: string) => void;  // ← 这个方法已存在，需要修改实现
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
  currentScene: 'po_miao',
  inventory: [],
  skills: [],
  quests: [],
  relationships: {},
};

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      player: initialState,
      
      setPlayer: (player) => set({ player }),
      
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
        set((state) => ({
          player: state.player
            ? {
                ...state.player,
                stats: {
                  ...state.player.stats,
                  xiuwei: state.player.stats.xiuwei + amount,
                },
              }
            : null,
        })),
      
      // ⭐⭐⭐ 这里修改 changeScene 方法 ⭐⭐⭐
      changeScene: (sceneId) =>
        set((state) => {
          if (!state.player) return state;
          
          // 🔥 在这里同步更新地图位置
          // 动态导入 mapStore 避免循环依赖
          const { useMapStore } = require('@/stores/mapStore');
          const mapStore = useMapStore.getState();
          if (mapStore.setCurrentLocation) {
            mapStore.setCurrentLocation(sceneId);
          }
          
          return {
            player: {
              ...state.player,
              currentScene: sceneId,
            },
          };
        }),
    }),
    {
      name: 'player-storage',
    }
  )
);