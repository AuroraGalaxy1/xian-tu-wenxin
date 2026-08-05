import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface MapLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  region: string;
  isUnlocked: boolean;
  isExplored: boolean;
  type: 'scene' | 'town' | 'danger' | 'resource' | 'secret';
}

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
    isUnlocked: false,
    isExplored: false,
    type: 'scene',
  },
  {
    id: 'qing_mu_ling',
    name: '青木岭',
    x: 80,
    y: 200,
    region: '落星坡',
    isUnlocked: false,
    isExplored: false,
    type: 'resource',
  },
  {
    id: 'xi_feng_zhen',
    name: '溪风镇',
    x: 480,
    y: 180,
    region: '落星坡',
    isUnlocked: false,
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
];

export const useMapStore = create<MapState>()(
  persist(
    (set, get) => ({
      currentLocation: defaultLocations[0],
      unlockedLocations: ['po_miao'],
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
    }
  )
);