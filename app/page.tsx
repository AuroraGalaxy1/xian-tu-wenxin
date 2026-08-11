'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { LeftPanel } from '@/components/layout/LeftPanel';
import { CenterPanel } from '@/components/layout/CenterPanel';
import { RightPanel } from '@/components/layout/RightPanel';
import { BottomBar } from '@/components/layout/BottomBar';
import { usePlayerStore } from '@/stores/playerStore';
import { useLogStore } from '@/stores/logStore';
import { useSceneStore } from '@/stores/sceneStore';
import { useMapStore } from '@/stores/mapStore';
import { useCheckinStore } from '@/stores/checkinStore';
import { useUiStore } from '@/stores/uiStore';
import { useTutorialStore } from '@/stores/tutorialStore';
import { useLoreStore } from '@/stores/loreStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { useAuthStore } from '@/stores/authStore';
import { ModalContainer } from '@/components/modals/ModalContainer';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { api } from '@/lib/api';
import type { Player } from '@/types/player';

/** 默认角色（首次创建时使用） */
const DEFAULT_PLAYER: Player = {
  id: 'player_001',
  name: '无名修士',
  realm: '感气',
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

/** 一次性迁移旧 localStorage 数据到数据库 */
async function migrateFromLocalStorage() {
  if (typeof window === 'undefined') return false;
  const KEYS = [
    'player-storage',
    'map-storage',
    'checkin-storage',
    'achievement-storage',
    'lore-storage',
    'log-storage',
    'tutorial-storage',
  ];
  const payload: Record<string, unknown> = {};
  let found = false;
  for (const key of KEYS) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        payload[key] = JSON.parse(raw);
        found = true;
      } catch {
        // 忽略损坏数据
      }
    }
  }
  if (!found) return false;
  const res = await api.post('/migrate', payload);
  if (res) {
    // 迁移成功后清除旧数据
    for (const key of KEYS) {
      localStorage.removeItem(key);
    }
    return true;
  }
  return false;
}

export default function Home() {
  const router = useRouter();
  const player = usePlayerStore((s) => s.player);
  const currentScene = useSceneStore((state) => state.currentScene);
  const { addLog } = useLogStore();
  const { setCurrentScene } = useSceneStore();
  const { setCurrentLocation } = useMapStore();
  const { hasCheckedInToday } = useCheckinStore();
  const { setCheckinOpen, setTutorialOpen, tutorialOpen } = useUiStore();
  const { tutorialCompleted, tutorialPhase, startTutorial } = useTutorialStore();
  const { isAuthenticated, isLoading: authLoading, checkAuth } = useAuthStore();

  // 标记是否已完成初始化，防止重复执行
  const initRef = useRef(false);

  // 初始化：检查认证 + 从 API 加载所有持久化数据（仅执行一次）
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    let cancelled = false;
    (async () => {
      // 1. 检查登录状态
      await checkAuth();

      if (cancelled) return;

      // 2. 未登录 → 跳转登录页
      if (!useAuthStore.getState().isAuthenticated) {
        router.push('/login');
        return;
      }

      // 3. 数据迁移（旧 localStorage 数据）
      await migrateFromLocalStorage();

      // 并行加载所有 store
      await Promise.all([
        usePlayerStore.getState().loadPlayer(),
        useMapStore.getState().loadMap(),
        useCheckinStore.getState().loadCheckin(),
        useTutorialStore.getState().loadTutorial(),
        useLoreStore.getState().loadLore(),
        useAchievementStore.getState().loadAchievement(),
        useLogStore.getState().loadLogs(),
      ]);

      if (cancelled) return;

      // 无玩家数据 → 创建默认角色
      if (!usePlayerStore.getState().player) {
        usePlayerStore.getState().setPlayer(DEFAULT_PLAYER);
        useLogStore.getState().addLog('你从昏迷中醒来，发现自己身处一座破败的山神庙中...', 'special');
        useLogStore.getState().addLog('眉心隐隐发烫，似有什么在呼唤你。', 'normal');
      }

      // 同步场景显示：用玩家存档中的 currentScene 更新 sceneStore
      const loadedPlayer = usePlayerStore.getState().player;
      if (loadedPlayer) {
        setCurrentScene(loadedPlayer.currentScene);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (authLoading || !player) {
    return (
      <div className="min-h-screen bg-[#0A0806] flex items-center justify-center">
        <div className="text-[#C9A04E] animate-breathe">✦ 加载中 ...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment text-[#F0E8D8] font-serif">
      <TopBar />
      <div className="flex h-[calc(100vh-88px)]">
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
      </div>
      <BottomBar />
      <ModalContainer />
      {tutorialPhase === 'tour' && <TutorialOverlay />}
    </div>
  );
}