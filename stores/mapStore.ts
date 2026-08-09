import { create } from 'zustand';
import { api } from '@/lib/api';
import { debounce } from '@/lib/debounce';
import type { MapLocation } from '@/types/map';

export type { MapLocation } from '@/types/map';

// 初始地图数据（静态，不进数据库）
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

/** 将静态 locations 与追踪标志合并 */
function buildLocations(
  unlocked: string[],
  explored: string[],
  currentId: string | null,
): { locations: MapLocation[]; currentLocation: MapLocation | null } {
  const locations = defaultLocations.map((loc) => ({
    ...loc,
    isUnlocked: unlocked.includes(loc.id),
    isExplored: explored.includes(loc.id),
  }));
  const currentLocation =
    locations.find((l) => l.id === currentId) ?? locations[0];
  return { locations, currentLocation };
}

interface MapState {
  currentLocation: MapLocation | null;
  unlockedLocations: string[];
  exploredLocations: string[];
  locations: MapLocation[];
  isLoading: boolean;

  setCurrentLocation: (locationId: string) => void;
  unlockLocation: (locationId: string) => void;
  exploreLocation: (locationId: string) => void;
  getLocation: (locationId: string) => MapLocation | undefined;
  getLocationsByRegion: (region: string) => MapLocation[];
  loadMap: () => Promise<void>;
  _save: () => void;
}

export const useMapStore = create<MapState>()((set, get) => ({
  currentLocation: defaultLocations[0],
  unlockedLocations: [
    'po_miao', 'shan_gu', 'qing_mu_ling', 'xi_feng_zhen',
    'bai_cao_yuan', 'fang_shi', 'qing_yang_fen_tan', 'fei_zhai',
  ],
  exploredLocations: [],
  locations: defaultLocations,
  isLoading: true,

  loadMap: async () => {
    set({ isLoading: true });
    const data = await api.get<{
      currentLocationId: string;
      unlockedLocations: string;
      exploredLocations: string;
    }>('/map');
    if (data) {
      const unlocked = JSON.parse(data.unlockedLocations || '[]');
      const explored = JSON.parse(data.exploredLocations || '[]');
      const { locations, currentLocation } = buildLocations(
        unlocked,
        explored,
        data.currentLocationId,
      );
      set({
        unlockedLocations: unlocked,
        exploredLocations: explored,
        locations,
        currentLocation,
        isLoading: false,
      });
    } else {
      // 首次加载，写入默认数据
      set({ isLoading: false });
      get()._save();
    }
  },

  _save: debounce(async () => {
    const { unlockedLocations, exploredLocations, currentLocation } = get();
    await api.put('/map', {
      currentLocationId: currentLocation?.id ?? 'po_miao',
      unlockedLocations: JSON.stringify(unlockedLocations),
      exploredLocations: JSON.stringify(exploredLocations),
    });
  }, 500),

  setCurrentLocation: (locationId) => {
    const location = get().locations.find((l) => l.id === locationId);
    if (location) {
      set({ currentLocation: location });
      get().unlockLocation(locationId);
    }
  },

  unlockLocation: (locationId) => {
    set((state) => {
      if (state.unlockedLocations.includes(locationId)) return state;
      return {
        unlockedLocations: [...state.unlockedLocations, locationId],
        locations: state.locations.map((loc) =>
          loc.id === locationId ? { ...loc, isUnlocked: true } : loc,
        ),
      };
    });
    get()._save();
  },

  exploreLocation: (locationId) => {
    set((state) => {
      if (state.exploredLocations.includes(locationId)) return state;
      return {
        exploredLocations: [...state.exploredLocations, locationId],
        locations: state.locations.map((loc) =>
          loc.id === locationId ? { ...loc, isExplored: true } : loc,
        ),
      };
    });
    get()._save();
  },

  getLocation: (locationId) => {
    return get().locations.find((l) => l.id === locationId);
  },

  getLocationsByRegion: (region) => {
    return get().locations.filter((l) => l.region === region);
  },
}));