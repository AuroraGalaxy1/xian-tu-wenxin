'use client';

import { useMemo, useState } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { useSceneStore } from '@/stores/sceneStore';
import { useUiStore } from '@/stores/uiStore';
import { useCombatStore } from '@/stores/combatStore';
import { useLogStore } from '@/stores/logStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { getRandomEncounter } from '@/lib/utils/gameUtils';
import { getRandomEncounterEvent } from '@/lib/gameData/encounters';
import { itemsData } from '@/lib/gameData/items';
import {
  BookOpen, Sword, Backpack, Map, Users, Home, Sparkles, Building2, ScrollText, MoreHorizontal, Trophy, Heart, Shield, Zap, Star, ChevronDown, ChevronUp, Scroll, Gem, Compass, Hand, Gift
} from 'lucide-react';

export const LeftPanel = () => {
  const realm = usePlayerStore((state) => state.player?.realm);
  const playerSceneId = usePlayerStore((state) => state.player?.currentScene);
  const stats = usePlayerStore((state) => state.player?.stats);
  const currentSceneId = useSceneStore((state) => state.currentScene?.id);
  const equipment = usePlayerStore((state) => state.player?.equipment);
  const inventory = usePlayerStore((state) => state.player?.inventory);
  const skills = usePlayerStore((state) => state.player?.skills);
  const relationships = usePlayerStore((state) => state.player?.relationships);
  const achievementCount = useAchievementStore((state) => state.unlockedIds.length);
  const [moreOpen, setMoreOpen] = useState(false);
  if (!realm || !stats) return null;

  const openCultivate = () => useUiStore.getState().setCultivateOpen(true);
  const openBackpack = () => useUiStore.getState().setBackpackOpen(true);
  const openLore = () => useUiStore.getState().setLoreOpen(true);
  const comingSoon = (name: string) =>
    useLogStore.getState().addLog(`「${name}」尚未开启，敬请期待。`, 'normal');

  // 随机遭遇战斗（以当前场景可能出现的敌人）
  const startRandomCombat = () => {
    const sceneId = currentSceneId ?? playerSceneId ?? 'po_miao';
    const enemy = getRandomEncounter(sceneId);
    if (enemy) {
      useLogStore.getState().addLog(`你主动出击，遭遇了「${enemy.name}」！`, 'danger');
      useCombatStore.getState().startCombat(enemy);
    } else {
      useLogStore.getState().addLog('此地安宁，并无妖兽可寻。', 'normal');
    }
  };

  // 随机触发奇遇
  const triggerEncounter = () => {
    const enc = getRandomEncounterEvent();
    if (enc) {
      useUiStore.getState().openEncounter(enc.id);
    } else {
      useLogStore.getState().addLog('你四下张望，今日并无机缘。', 'normal');
    }
  };

  const navItems = [
    { icon: BookOpen, label: '修炼', color: 'text-[#C9A04E]', onClick: openCultivate },
    { icon: Sword, label: '战斗', color: 'text-[#C94E4E]', onClick: startRandomCombat },
    { icon: Backpack, label: '背包', color: 'text-[#4EC9C9]', onClick: openBackpack },
    { icon: ScrollText, label: '见闻录', color: 'text-[#7DDDDD]', onClick: openLore },
    { icon: Sparkles, label: '奇遇', color: 'text-[#C9A04E]', onClick: triggerEncounter },
    { icon: Map, label: '地图', color: 'text-[#9B6EC9]', onClick: () => useLogStore.getState().addLog('点击右下角的罗盘即可展开地图，选择目的地。', 'special') },
    { icon: Users, label: '社交', color: 'text-[#8B7A5E]', onClick: () => comingSoon('社交') },
    { icon: Home, label: '洞府', color: 'text-[#E8DCC8]', onClick: () => comingSoon('洞府') },
    { icon: Building2, label: '宗门', color: 'text-[#8B7A5E]', onClick: () => comingSoon('宗门') },
  ];

  // 更多功能展开的隐藏入口
  const moreItems = [
    { icon: Scroll, label: '功法', color: 'text-[#C9A04E]', onClick: () => comingSoon('功法') },
    { icon: Gem, label: '法宝', color: 'text-[#9B6EC9]', onClick: () => comingSoon('法宝') },
    { icon: Compass, label: '历练', color: 'text-[#4EC9C9]', onClick: () => comingSoon('历练') },
    { icon: Hand, label: '结缘', color: 'text-[#C94E4E]', onClick: () => comingSoon('结缘') },
    { icon: Gift, label: '礼包', color: 'text-[#7DDDDD]', onClick: () => comingSoon('礼包') },
  ];

  return (
    <aside className="w-64 border-r border-[#8B7A5E]/15 p-4 bg-[#0A0806] flex flex-col gap-4 overflow-y-auto">
      {/* 修行状态 */}
      <div className="glass-panel-light rounded-lg p-4 space-y-3 corner-decoration">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#A99A80] tracking-widest uppercase">
            ◈ 修行状态
          </span>
          <span className="text-xs text-[#A99A80]/80">境界·{realm}</span>
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
            <span className="text-[#A99A80]">体魄</span>
            <span className="text-[#D4C9B8] font-medium">{stats.tipo}</span>
          </div>
          <div className="flex justify-between text-xs border-b border-[#8B7A5E]/5 pb-0.5">
            <span className="text-[#A99A80]">神识</span>
            <span className="text-[#D4C9B8] font-medium">{stats.shenshi}</span>
          </div>
          <div className="flex justify-between text-xs pt-0.5">
            <span className="text-[#A99A80]">因果</span>
            <span className={`font-medium ${stats.yinguo >= 0 ? 'text-[#4EC9C9]' : 'text-[#C94E4E]'}`}>
              {stats.yinguo >= 0 ? '+' : ''}{stats.yinguo}
            </span>
          </div>
          <div className="flex justify-between text-xs pt-0.5">
            <span className="text-[#A99A80]">执念</span>
            <span className="text-[#D4C9B8] font-medium">{stats.zhinian}</span>
          </div>
        </div>

        {/* 成就徽章 */}
        <div className="flex items-center gap-1.5 pt-1">
          <Trophy className="w-3.5 h-3.5 text-[#C9A04E]" />
          <span className="text-xs text-[#A99A80]">成就</span>
          <span className="text-xs text-[#C9A04E] font-medium">{achievementCount}</span>
        </div>

        {/* 装备简览 */}
        {equipment && (equipment.weapon || equipment.armor || equipment.accessory) && (
          <div className="pt-1 space-y-1">
            <div className="divider-antique" />
            <span className="text-[10px] text-[#A99A80]/70 tracking-wider">◈ 已装备</span>
            {equipment.weapon && (
              <div className="flex items-center gap-1.5 text-xs">
                <Sword className="w-3 h-3 text-[#C94E4E]" />
                <span className="text-[#D4C9B8]">{itemsData[equipment.weapon]?.name ?? equipment.weapon}</span>
              </div>
            )}
            {equipment.armor && (
              <div className="flex items-center gap-1.5 text-xs">
                <Shield className="w-3 h-3 text-[#4EC9C9]" />
                <span className="text-[#D4C9B8]">{itemsData[equipment.armor]?.name ?? equipment.armor}</span>
              </div>
            )}
            {equipment.accessory && (
              <div className="flex items-center gap-1.5 text-xs">
                <Star className="w-3 h-3 text-[#9B6EC9]" />
                <span className="text-[#D4C9B8]">{itemsData[equipment.accessory]?.name ?? equipment.accessory}</span>
              </div>
            )}
          </div>
        )}

        {/* 功法/技能展示 */}
        {skills && skills.length > 0 && (
          <div className="pt-1 space-y-1">
            <div className="divider-antique" />
            <span className="text-[10px] text-[#A99A80]/70 tracking-wider">◈ 功法技能</span>
            {skills.map((skillId) => {
              const skill = itemsData[skillId];
              return (
                <div key={skillId} className="flex items-center gap-1.5 text-xs">
                  <Zap className="w-3 h-3 text-[#C9A04E]" />
                  <span className="text-[#D4C9B8]">{skill?.name ?? skillId}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 快捷功能 */}
      <div className="glass-panel-light rounded-lg p-4 space-y-2">
        <span className="text-xs text-[#A99A80] tracking-widest uppercase">
          ◈ 快捷功能
        </span>
        <div className="divider-antique" />
        <div className="grid grid-cols-2 gap-1.5">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              {...(item.label === '修炼' ? { 'data-tutorial': 'cultivate' } : item.label === '背包' ? { 'data-tutorial': 'backpack' } : {})}
              className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#0A0806]/50 hover:bg-[#1A1410] transition-all duration-200 group"
            >
              <item.icon className={`w-3.5 h-3.5 ${item.color} group-hover:scale-110 transition-transform`} />
              <span className="text-xs text-[#D4C9B8] group-hover:text-[#C9A04E] transition-colors">
                {item.label}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className="w-full flex items-center justify-center gap-1 px-2 py-1 rounded bg-[#0A0806]/30 hover:bg-[#1A1410] transition-all duration-200 text-xs text-[#8B7A5E] hover:text-[#D4C9B8]"
        >
          {moreOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <MoreHorizontal className="w-3.5 h-3.5" />}
          {moreOpen ? '收起' : '更多功能'}
        </button>
        {moreOpen && (
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            {moreItems.map((item, index) => (
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
        )}
      </div>

      {/* 快捷道具 */}
      <div className="glass-panel-light rounded-lg p-4 space-y-2">
        <span className="text-xs text-[#A99A80] tracking-widest uppercase">
          ◈ 快捷道具
        </span>
        <div className="divider-antique" />
        {(() => {
          const danItems = (inventory ?? [])
            .map((id) => itemsData[id])
            .filter((item): item is NonNullable<typeof item> => item != null && item.type === 'dan')
            .slice(0, 5);
          if (danItems.length === 0) {
            return (
              <div className="text-xs text-[#8B7A5E]/50 text-center py-3 border border-dashed border-[#8B7A5E]/10 rounded">
                暂无快捷道具
              </div>
            );
          }
          return (
            <div className="grid grid-cols-2 gap-1.5">
              {danItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    useUiStore.getState().openItemDetail(item.id, 'backpack');
                  }}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded bg-[#0A0806]/50 hover:bg-[#1A1410] transition-all duration-200 group text-xs"
                >
                  <span className="text-[#4EC9C9]">●</span>
                  <span className="text-[#D4C9B8] group-hover:text-[#C9A04E] truncate">{item.name}</span>
                </button>
              ))}
            </div>
          );
        })()}
      </div>
    </aside>
  );
};