'use client';

import { useAchievementStore } from '@/stores/achievementStore';
import { achievementsData } from '@/lib/gameData/achievements';

/** 成就列表面板（供图鉴弹窗复用） */
export const AchievementPanel = () => {
  const unlockedIds = useAchievementStore((s) => s.unlockedIds);
  const entries = Object.values(achievementsData);
  const unlockedCount = entries.filter((a) => unlockedIds.includes(a.id)).length;

  return (
    <div>
      <div className="flex justify-between text-xs text-[#8B7A5E] mb-3">
        <span>已达成 {unlockedCount} / {entries.length}</span>
        <span>达成成就将获得额外奖励</span>
      </div>
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {entries.map((ach) => {
          const done = unlockedIds.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`p-3 rounded-lg border transition-colors ${
                done
                  ? 'border-[#4EC9C9]/25 bg-[#4EC9C9]/5'
                  : 'border-[#8B7A5E]/10 bg-[#0A0806]/20 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${done ? 'text-[#4EC9C9]' : 'text-[#D4C9B8]'}`}>
                  {done ? '🏆' : '○'} {ach.name}
                </span>
                {ach.reward && (
                  <span className="text-[9px] text-[#8B7A5E]/70">
                    {[
                      ach.reward.xiuwei ? `修为+${ach.reward.xiuwei}` : '',
                      ach.reward.lingShi ? `灵石+${ach.reward.lingShi}` : '',
                      ach.reward.items?.length ? `物品×${ach.reward.items.length}` : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8B7A5E] leading-relaxed">{ach.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
