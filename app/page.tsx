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

export default function Home() {
  const { player, setPlayer } = usePlayerStore();
  const { addLog } = useLogStore();
  const { setCurrentScene } = useSceneStore();
  const { setCurrentLocation } = useMapStore();

  useEffect(() => {
    if (!player) {
      setPlayer({
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
      });
      
      setCurrentScene('po_miao');
      setCurrentLocation('po_miao');
      
      addLog('你从昏迷中醒来，发现自己身处一座破败的山神庙中...', 'special');
      addLog('眉心隐隐发烫，似有什么在呼唤你。', 'normal');
    }
  }, [player, setPlayer, setCurrentScene, setCurrentLocation, addLog]);

  if (!player) {
    return (
      <div className="min-h-screen bg-[#0A0806] flex items-center justify-center">
        <div className="text-[#C9A04E] animate-breathe">✦ 加载中 ...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-parchment text-[#E5D8B5] font-serif">
      <TopBar />
      <div className="flex h-[calc(100vh-88px)]">
        <LeftPanel />
        <CenterPanel />
        <RightPanel />
      </div>
      <BottomBar />
    </div>
  );
}