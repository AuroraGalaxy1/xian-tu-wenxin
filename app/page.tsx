'use client';

import { useEffect } from 'react';
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
import { ModalContainer } from '@/components/modals/ModalContainer';

export default function Home() {
  const { player, setPlayer } = usePlayerStore();
  const currentScene = useSceneStore((state) => state.currentScene);
  const { addLog } = useLogStore();
  const { setCurrentScene } = useSceneStore();
  const { setCurrentLocation } = useMapStore();
  const { hasCheckedInToday } = useCheckinStore();
  const { setCheckinOpen } = useUiStore();

  useEffect(() => {
    // 全新存档（本地无持久化数据）时创建角色并写入开场日志；
    // 本地已有存档时等待 persist 恢复，避免覆盖已有进度
    if (!player && typeof window !== 'undefined' && !localStorage.getItem('player-storage')) {
      setPlayer({
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
      });
      // 仅在首次创建角色时写入开场日志
      addLog('你从昏迷中醒来，发现自己身处一座破败的山神庙中...', 'special');
      addLog('眉心隐隐发烫，似有什么在呼唤你。', 'normal');
    }

    // 确保当前场景与地图位置已初始化（持久化恢复后 player 可能已存在）
    if (!currentScene) {
      setCurrentScene('po_miao');
      setCurrentLocation('po_miao');
    }

    // 每日签到检测：玩家已加载且今日未签到时弹出
    if (player && !hasCheckedInToday()) {
      setCheckinOpen(true);
    }
  }, [player, currentScene, setPlayer, setCurrentScene, setCurrentLocation, addLog, hasCheckedInToday, setCheckinOpen]);

  if (!player) {
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
    </div>
  );
}