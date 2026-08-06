'use client';

import { usePlayerStore } from '@/stores/playerStore';
import { Bell, MessageCircle, Settings } from 'lucide-react';

export const TopBar = () => {
  const player = usePlayerStore((state) => state.player);

  return (
<<<<<<< HEAD
    <header className="h-14 px-6 flex items-center justify-between bg-[#0D0A08]/90 border-b border-[#C9A04E]/20 backdrop-blur-md glass-panel-light">
=======
    <header className="h-14 px-6 flex items-center justify-between bg-[#0D0A08]/95 border-b border-[#C9A04E]/20 glass-panel-light">
>>>>>>> 6da646e4e58e870374996db04b7b20524f5ca952
      {/* 左侧：Logo + 境界 */}
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
          <span className="text-[#C9A04E] text-sm font-medium">
            {player?.realm || '凡胎'}
          </span>
          <span className="text-[#8B7A5E] text-xs">·</span>
          <span className="text-[#8B7A5E] text-xs">
            {player?.realmStage || '悟'}
          </span>
          <span className="ml-2 px-2 py-0.5 text-[10px] text-[#4EC9C9] bg-[#4EC9C9]/10 rounded border border-[#4EC9C9]/20">
            ⚡ 灵气充裕
          </span>
        </div>
      </div>

      {/* 右侧：工具图标 */}
      <div className="flex items-center gap-4">
        <Bell className="w-4 h-4 text-[#8B7A5E] hover:text-[#C9A04E] cursor-pointer transition-colors" />
        <MessageCircle className="w-4 h-4 text-[#8B7A5E] hover:text-[#C9A04E] cursor-pointer transition-colors" />
        <Settings className="w-4 h-4 text-[#8B7A5E] hover:text-[#C9A04E] cursor-pointer transition-colors" />
        <span className="text-[10px] text-[#8B7A5E]/50 tracking-wider border-l border-[#8B7A5E]/20 pl-4">
          末道 · 九洲
        </span>
      </div>
    </header>
  );
};