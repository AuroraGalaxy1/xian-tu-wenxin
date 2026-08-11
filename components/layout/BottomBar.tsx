'use client';

import { useEffect, useState } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { Trophy } from 'lucide-react';

export const BottomBar = () => {
  const [timeStr, setTimeStr] = useState('');
  const realm = usePlayerStore((state) => state.player?.realm);
  const realmStage = usePlayerStore((state) => state.player?.realmStage);
  const achievementCount = useAchievementStore((state) => state.unlockedIds.length);
  const quests = usePlayerStore((state) => state.player?.quests);
  const activeQuests = quests?.filter((q) => q.status === 'active').length ?? 0;
  const completedQuests = quests?.filter((q) => q.status === 'completed').length ?? 0;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`辰时 · ${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="h-10 px-6 flex items-center justify-between border-t border-[#C9A04E]/15 bg-[#0D0A08]/90 text-xs text-[#9B8B6C]/70 glass-panel-light">
      <div className="flex items-center gap-6">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4EC9C9] animate-pulse" />
          {timeStr || '辰时'}
        </span>
        <span className="text-[#8B7A5E]/30">|</span>
        <span>境界 · {realm || '感气'} · {realmStage || '悟'}</span>
        <span className="text-[#8B7A5E]/30">|</span>
        <span className="flex items-center gap-1">
          <Trophy className="w-3 h-3 text-[#C9A04E]" />
          成就 {achievementCount}
        </span>
        <span className="text-[#8B7A5E]/30">|</span>
        <span>
          任务 {activeQuests} 进行中{completedQuests > 0 ? ` · ${completedQuests} 完成` : ''}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="tracking-wider">v0.1.0</span>
        <span className="text-[#8B7A5E]/20">·</span>
        <span className="tracking-widest">末道纪元 · 第9轮回</span>
      </div>
    </footer>
  );
};