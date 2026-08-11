'use client';

import { useRouter } from 'next/navigation';
import { usePlayerStore } from '@/stores/playerStore';
import { useAuthStore } from '@/stores/authStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { Trophy, Bell, MessageCircle, Settings, LogOut } from 'lucide-react';

export const TopBar = () => {
  const router = useRouter();
  const realm = usePlayerStore((state) => state.player?.realm);
  const realmStage = usePlayerStore((state) => state.player?.realmStage);
  const playerName = usePlayerStore((state) => state.player?.name);
  const achievementCount = useAchievementStore((state) => state.unlockedIds.length);

  const handleLogout = async () => {
    await useAuthStore.getState().logout();
    router.push('/login');
  };

  return (
    <header className="h-14 px-6 flex items-center justify-between bg-[#0D0A08]/95 border-b border-[#C9A04E]/20 glass-panel-light">
      {/* 左侧：Logo + 境界 + 道号 */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="text-[#E8DCC8] text-xl font-bold tracking-wider text-glow-gold">
            ☯ 仙途·问心
          </span>
          <span className="text-[#9B8B6C] text-xs font-light tracking-widest">
            · 问心录
          </span>
        </div>

        <div className="h-5 w-px bg-[#8B7A5E]/20" />

        <div className="flex items-center gap-3">
          <span className="text-[#D4C9B8] text-sm max-w-[80px] truncate" title={playerName}>
            {playerName || '无名修士'}
          </span>
          <span className="text-[#8B7A5E]/30">·</span>
          <span className="text-[#C9A04E] text-sm font-medium">
            {realm || '感气'}
          </span>
          <span className="text-[#8B7A5E] text-xs">·</span>
          <span className="text-[#8B7A5E] text-xs">
            {realmStage || '悟'}
          </span>
          <span className="ml-2 px-2 py-0.5 text-xs text-[#4EC9C9] bg-[#4EC9C9]/10 rounded border border-[#4EC9C9]/20">
            ⚡ 灵气充裕
          </span>
        </div>
      </div>

      {/* 右侧：成就徽章 + 工具图标 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#C9A04E] bg-[#C9A04E]/5 rounded border border-[#C9A04E]/20" title="已解锁成就">
          <Trophy className="w-3.5 h-3.5" />
          <span>{achievementCount}</span>
        </div>
        <Bell className="w-4 h-4 text-[#8B7A5E] hover:text-[#C9A04E] cursor-pointer transition-colors" />
        <MessageCircle className="w-4 h-4 text-[#8B7A5E] hover:text-[#C9A04E] cursor-pointer transition-colors" />
        <Settings className="w-4 h-4 text-[#8B7A5E] hover:text-[#C9A04E] cursor-pointer transition-colors" />
        <span className="text-xs text-[#8B7A5E]/50 tracking-wider border-l border-[#8B7A5E]/20 pl-4">
          末道 · 九洲
        </span>
        <button
          onClick={handleLogout}
          title="登出"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#8B7A5E] hover:text-[#E8DCC8] border border-[#8B7A5E]/20 hover:border-[#C9A04E]/40 rounded transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          登出
        </button>
      </div>
    </header>
  );
};