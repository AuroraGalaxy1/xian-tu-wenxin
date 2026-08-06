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
<<<<<<< HEAD
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
    type: 'secret',
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
=======
>>>>>>> 6da646e4e58e870374996db04b7b20524f5ca952
];

export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      currentLocation: defaultLocations[0],
<<<<<<< HEAD
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
=======
      unlockedLocations: ['po_miao', 'shan_gu', 'qing_mu_ling', 'xi_feng_zhen'],
>>>>>>> 6da646e4e58e870374996db04b7b20524f5ca952
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
<<<<<<< HEAD
      // 用最新 defaultLocations 合并旧存档解锁/探索状态，保证新增地点对旧存档生效
      merge: (persisted, current) => {
        if (!persisted || typeof persisted !== 'object') return current;
        const p = persisted as Partial<MapState>;
        const unlocked = p.unlockedLocations ?? current.unlockedLocations;
        const explored = p.exploredLocations ?? current.exploredLocations;
        const locations = current.locations.map((loc) => ({
          ...loc,
          isUnlocked: unlocked.includes(loc.id) || loc.isUnlocked,
          isExplored: explored.includes(loc.id),
        }));
        const currentLoc =
          locations.find((l) => l.id === p.currentLocation?.id) ?? locations[0];
        return {
          ...current,
          unlockedLocations: unlocked,
          exploredLocations: explored,
          locations,
          currentLocation: currentLoc,
        } as MapState;
      },
=======
>>>>>>> 6da646e4e58e870374996db04b7b20524f5ca952
    }
  )
);