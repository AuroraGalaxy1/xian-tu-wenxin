'use client';

import { usePlayerStore } from '@/stores/playerStore';
import { useUiStore } from '@/stores/uiStore';
import { useLogStore } from '@/stores/logStore';
import { 
  BookOpen, Sword, Backpack, Map, Users, Home, Sparkles, Building2, MoreHorizontal
} from 'lucide-react';

export const LeftPanel = () => {
  const player = usePlayerStore((state) => state.player);
  if (!player) return null;

  const { stats } = player;

  const openCultivate = () => useUiStore.getState().setCultivateOpen(true);
  const openBackpack = () => useUiStore.getState().setBackpackOpen(true);
  const comingSoon = (name: string) =>
    useLogStore.getState().addLog(`「${name}」尚未开启，敬请期待。`, 'normal');

  const navItems = [
    { icon: BookOpen, label: '修炼', color: 'text-[#C9A04E]', onClick: openCultivate },
    { icon: Sword, label: '战斗', color: 'text-[#C94E4E]', onClick: () => comingSoon('战斗') },
    { icon: Backpack, label: '背包', color: 'text-[#4EC9C9]', onClick: openBackpack },
    { icon: Map, label: '地图', color: 'text-[#7DDDDD]', onClick: () => comingSoon('地图') },
    { icon: Users, label: '社交', color: 'text-[#9B6EC9]', onClick: () => comingSoon('社交') },
    { icon: Home, label: '洞府', color: 'text-[#E8DCC8]', onClick: () => comingSoon('洞府') },
    { icon: Sparkles, label: '奇遇', color: 'text-[#C9A04E]', onClick: () => comingSoon('奇遇') },
    { icon: Building2, label: '宗门', color: 'text-[#8B7A5E]', onClick: () => comingSoon('宗门') },
  ];

  return (
    <aside className="w-56 border-r border-[#8B7A5E]/15 p-4 bg-[#0A0806] flex flex-col gap-4 overflow-y-auto">
      {/* 修行状态 */}
      <div className="glass-panel-light rounded-lg p-4 space-y-3 corner-decoration">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-[#8B7A5E] tracking-widest uppercase">
            ◈ 修行状态
          </span>
          <span className="text-[8px] text-[#8B7A5E]/50">境界·{player.realm}</span>
        </div>
        
        <div className="divider-antique" />

        {/* 道心 */}
        <div>
          <div className="flex justify-between text-xs">
            <span className="text-[#D4C9B8]">道心</span>
            <span className="text-[#C9A04E] font-medium">
              {stats.daoxin}/{stats.maxDaoxin}
            </span>
          </div>
          <div className="progress-bar-track mt-1">
            <div 
              className="progress-bar-fill gold"
              style={{ width: `${(stats.daoxin / stats.maxDaoxin) * 100}%` }}
            />
          </div>
        </div>

        {/* 灵蕴 */}
        <div>
          <div className="flex justify-between text-xs">
            <span className="text-[#D4C9B8]">灵蕴</span>
            <span className="text-[#4EC9C9] font-medium">
              {stats.lingyun}/{stats.maxLingyun}
            </span>
          </div>
          <div className="progress-bar-track mt-1">
            <div 
              className="progress-bar-fill cyan"
              style={{ width: `${(stats.lingyun / stats.maxLingyun) * 100}%` }}
            />
          </div>
        </div>

        {/* 四维属性 */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1">
          <div className="flex justify-between text-xs border-b border-[#8B7A5E]/5 pb-0.5">
            <span className="text-[#8B7A5E]">体魄</span>
            <span className="text-[#D4C9B8] font-medium">{stats.tipo}</span>
          </div>
          <div className="flex justify-between text-xs border-b border-[#8B7A5E]/5 pb-0.5">
            <span className="text-[#8B7A5E]">神识</span>
            <span className="text-[#D4C9B8] font-medium">{stats.shenshi}</span>
          </div>
          <div className="flex justify-between text-xs pt-0.5">
            <span className="text-[#8B7A5E]">因果</span>
            <span className={`font-medium ${stats.yinguo >= 0 ? 'text-[#4EC9C9]' : 'text-[#C94E4E]'}`}>
              {stats.yinguo >= 0 ? '+' : ''}{stats.yinguo}
            </span>
          </div>
          <div className="flex justify-between text-xs pt-0.5">
            <span className="text-[#8B7A5E]">执念</span>
            <span className="text-[#D4C9B8] font-medium">{stats.zhinian}</span>
          </div>
        </div>
      </div>

      {/* 快捷功能 */}
      <div className="glass-panel-light rounded-lg p-4 space-y-2">
        <span className="text-[10px] text-[#8B7A5E] tracking-widest uppercase">
          ◈ 快捷功能
        </span>
        <div className="divider-antique" />
        <div className="grid grid-cols-2 gap-1.5">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#0A0806]/50 hover:bg-[#1A1410] transition-all duration-200 group"
            >
              <item.icon className={`w-3.5 h-3.5 ${item.color} group-hover:scale-110 transition-transform`} />
              <span className="text-xs text-[#D4C9B8] group-hover:text-[#C9A04E] transition-colors">
                {item.label}
              </span>
            </button>
          ))}
        </div>
        <button className="w-full flex items-center justify-center gap-1 px-2 py-1 rounded bg-[#0A0806]/30 hover:bg-[#1A1410] transition-all duration-200 text-xs text-[#8B7A5E] hover:text-[#D4C9B8]">
          <MoreHorizontal className="w-3.5 h-3.5" />
          更多功能
        </button>
      </div>

      {/* 快捷道具 */}
      <div className="glass-panel-light rounded-lg p-4 space-y-2">
        <span className="text-[10px] text-[#8B7A5E] tracking-widest uppercase">
          ◈ 快捷道具
        </span>
        <div className="divider-antique" />
        <div className="text-xs text-[#8B7A5E]/50 text-center py-3 border border-dashed border-[#8B7A5E]/10 rounded">
          暂无快捷道具
        </div>
      </div>
    </aside>
  );
};