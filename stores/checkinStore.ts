// 每日签到系统
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CheckinReward {
  day: number;
  label: string;
  xiuwei: number;
  lingShi: number;
  daoxin: number;
  lingyun: number;
  tipo: number;
  items: { itemId: string; count: number }[];
}

export const CHECKIN_REWARDS: CheckinReward[] = [
  {
    day: 1,
    label: '初入仙途',
    xiuwei: 0,
    lingShi: 50,
    daoxin: 0,
    lingyun: 0,
    tipo: 0,
    items: [{ itemId: 'ju_qi_dan', count: 1 }],
  },
  {
    day: 2,
    label: '凝神静气',
    xiuwei: 100,
    lingShi: 0,
    daoxin: 3,
    lingyun: 0,
    tipo: 0,
    items: [],
  },
  {
    day: 3,
    label: '道心渐固',
    xiuwei: 0,
    lingShi: 80,
    daoxin: 0,
    lingyun: 3,
    tipo: 0,
    items: [{ itemId: 'ning_shen_dan', count: 1 }],
  },
  {
    day: 4,
    label: '灵蕴充盈',
    xiuwei: 150,
    lingShi: 0,
    daoxin: 0,
    lingyun: 4,
    tipo: 0,
    items: [],
  },
  {
    day: 5,
    label: '体魄淬炼',
    xiuwei: 0,
    lingShi: 100,
    daoxin: 0,
    lingyun: 0,
    tipo: 3,
    items: [{ itemId: 'ju_ling_dan', count: 1 }],
  },
  {
    day: 6,
    label: '锻体强身',
    xiuwei: 200,
    lingShi: 0,
    daoxin: 4,
    lingyun: 0,
    tipo: 0,
    items: [{ itemId: 'duan_ti_dan', count: 1 }],
  },
  {
    day: 7,
    label: '七日圆满',
    xiuwei: 500,
    lingShi: 300,
    daoxin: 5,
    lingyun: 5,
    tipo: 0,
    items: [{ itemId: 'liao_shang_dan', count: 3 }],
  },
];

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface CheckinState {
  lastCheckinDate: string | null;
  consecutiveDays: number;
  hasCheckedInToday: () => boolean;
  getTodayReward: () => CheckinReward;
  checkin: () => CheckinReward | null;
}

export const useCheckinStore = create<CheckinState>()(
  persist<CheckinState, [], []>(
    (set, get) => ({
      lastCheckinDate: null,
      consecutiveDays: 0,

      hasCheckedInToday: () => {
        return get().lastCheckinDate === getTodayStr();
      },

      getTodayReward: () => {
        const { lastCheckinDate, consecutiveDays } = get();
        const today = getTodayStr();
        const yesterday = getYesterdayStr();

        if (lastCheckinDate === today) {
          // 今天已签到，展示已获得的奖励
          return CHECKIN_REWARDS[((consecutiveDays - 1) + 7) % 7];
        }

        if (lastCheckinDate === yesterday) {
          // 连续签到
          return CHECKIN_REWARDS[consecutiveDays % 7];
        }

        // 断签或首次签到
        return CHECKIN_REWARDS[0];
      },

      checkin: () => {
        const { lastCheckinDate, consecutiveDays } = get();
        const today = getTodayStr();
        const yesterday = getYesterdayStr();

        if (lastCheckinDate === today) {
          return null; // 今天已签到
        }

        let newStreak: number;
        if (lastCheckinDate === yesterday) {
          newStreak = consecutiveDays + 1;
        } else {
          newStreak = 1;
        }

        // 7天一轮回
        if (newStreak > 7) newStreak = 1;

        const reward = CHECKIN_REWARDS[newStreak - 1];

        // 更新状态
        set({
          lastCheckinDate: today,
          consecutiveDays: newStreak,
        });

        return reward;
      },
    }),
    {
      name: 'checkin-storage',
      version: 1,
      migrate: (persisted) => persisted as CheckinState,
      merge: (persisted, current) => {
        if (persisted && typeof persisted === 'object') {
          const p = persisted as { lastCheckinDate?: string; consecutiveDays?: number };
          return {
            ...current,
            lastCheckinDate: p.lastCheckinDate ?? null,
            consecutiveDays: p.consecutiveDays ?? 0,
          };
        }
        return current;
      },
    }
  )
);