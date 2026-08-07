import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MapLocation } from '@/types/map';

// 兼容旧引用：re-export 类型，CompassMap 等组件仍可从本 store 导入
export type { MapLocation } from '@/types/map';

export interface MapState {
  // 当前位置
  currentLocation: MapLocation | null;
  // 已解锁的地点列表
  unlockedLocations: string[];
  // 已探索的地点列表
  exploredLocations: string[];
  // 所有地点数据
  locations: MapLocation[];
  
  // Actions
  setCurrentLocation: (locationId: string) => void;
  unlockLocation: (locationId: string) => void;
  exploreLocation: (locationId: string) => void;
  getLocation: (locationId: string) => MapLocation | undefined;
  getLocationsByRegion: (region: string) => MapLocation[];
}

// 初始地图数据
const defaultLocations: MapLocation[] = [
  {
    id: 'po_miao',
    name: '破败山神庙',
    x: 120,
    y: 80,
    region: '落星坡',
    isUnlocked: true,
    isExplored: false,
    type: 'scene',
  },
  {
    id: 'shan_gu',
    name: '灵脉交汇之眼',
    x: 320,
    y: 150,
    region: '落星坡',
    isUnlocked: true,
    isExplored: false,
    type: 'scene',
  },
  {
    id: 'qing_mu_ling',
    name: '青木岭',
    x: 80,
    y: 200,
    region: '落星坡',
    isUnlocked: true,
    isExplored: false,
    type: 'resource',
  },
  {
    id: 'xi_feng_zhen',
    name: '溪风镇',
    x: 480,
    y: 180,
    region: '落星坡',
    isUnlocked: true,
    isExplored: false,
    type: 'town',
  },
  {
    id: 'duan_hun_ya',
    name: '断魂崖',
    x: 200,
    y: 320,
    region: '落星坡',
    isUnlocked: false,
    isExplored: false,
    type: 'danger',
  },
  {
    id: 'bai_cao_yuan',
    name: '百草园',
    x: 560,
    y: 120,
    region: '落星坡',
    isUnlocked: true,
    isExplored: false,
    type: 'resource',
  },
  {
    id: 'fang_shi',
    name: '溪风坊市',
    x: 540,
    y: 240,
    region: '落星坡',
    isUnlocked: true,
    isExplored: false,
    type: 'town',
  },
  {
    id: 'qing_yang_fen_tan',
    name: '青阳宗分坛',
    x: 360,
    y: 280,
    region: '落星坡',
    isUnlocked: true,
    isExplored: false,
    type: 'scene',
  },
  {
    id: 'fei_zhai',
    name: '废宅',
    x: 40,
    y: 330,
    region: '落星坡',
    isUnlocked: true,
    isExplored: false,
    type: 'scene',
  },
  {
    id: 'mi_jing_ru_kou',
    name: '秘境入口',
    x: 620,
    y: 60,
    region: '落星坡',
    isUnlocked: false,
    isExplored: false,
    type: 'secret',
  },
];

export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      currentLocation: defaultLocations[0],
      unlockedLocations: [
        'po_miao',
        'shan_gu',
        'qing_mu_ling',
        'xi_feng_zhen',
        'bai_cao_yuan',
        'fang_shi',
        'qing_yang_fen_tan',
        'fei_zhai',
      ],
      exploredLocations: [],
      locations: defaultLocations,

      setCurrentLocation: (locationId) => {
        const location = get().locations.find(l => l.id === locationId);
        if (location) {
          set({ currentLocation: location });
          // 同时解锁该地点
          get().unlockLocation(locationId);
        }
      },

      unlockLocation: (locationId) => {
        set((state) => {
          if (state.unlockedLocations.includes(locationId)) return state;
          return {
            unlockedLocations: [...state.unlockedLocations, locationId],
            locations: state.locations.map(loc =>
              loc.id === locationId ? { ...loc, isUnlocked: true } : loc
            ),
          };
        });
      },

      exploreLocation: (locationId) => {
        set((state) => {
          if (state.exploredLocations.includes(locationId)) return state;
          return {
            exploredLocations: [...state.exploredLocations, locationId],
            locations: state.locations.map(loc =>
              loc.id === locationId ? { ...loc, isExplored: true } : loc
            ),
          };
        });
      },

      getLocation: (locationId) => {
        return get().locations.find(l => l.id === locationId);
      },

      getLocationsByRegion: (region) => {
        return get().locations.filter(l => l.region === region);
      },
    }),
    {
      name: 'map-storage', // localStorage key
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<MapState>;
        if (!p.locations || p.locations.length === 0) return current;
        // 以旧档地点为基础，合并新增地点，保证老玩家也能看到新地点
        const existingIds = new Set(p.locations.map((l) => l.id));
        const locations = [
          ...p.locations,
          ...current.locations.filter((l) => !existingIds.has(l.id)),
        ];
        return {
          ...current,
          ...p,
          locations,
          unlockedLocations:
            p.unlockedLocations ?? current.unlockedLocations,
          exploredLocations:
            p.exploredLocations ?? current.exploredLocations,
          currentLocation:
            p.currentLocation ??
            locations.find((l) => l.id === 'po_miao') ??
            current.currentLocation,
        };
      },
    }
  )
);