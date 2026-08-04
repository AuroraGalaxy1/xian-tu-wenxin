'use client';

import { usePlayerStore } from '@/stores/playerStore';
import { questsData } from '@/lib/gameData/quests';
import { getRealmIndex } from '@/lib/gameData/realms';

const STATUS_META: Record<string, { icon: string; color: string }> = {
  completed: { icon: '✅', color: 'text-[#4EC9C9]' },
  active: { icon: '⟳', color: 'text-[#C9A04E]' },
  pending: { icon: '○', color: 'text-[#8B7A5E]' },
  locked: { icon: '🔒', color: 'text-[#8B7A5E]/30' },
};

/** 目标进度展示文案 */
function objectiveText(
  obj: { type: string; target: string; amount?: number; desc: string },
  player: ReturnType<typeof usePlayerStore.getState>['player'],
): { text: string; done: boolean } {
  if (!player) return { text: obj.desc, done: false };
  switch (obj.type) {
    case 'scene_visit':
      return {
        text: obj.desc,
        done: player.visitedScenes.includes(obj.target),
      };
    case 'realm':
      return {
        text: obj.desc,
        done: getRealmIndex(player.realm) >= getRealmIndex(obj.target),
      };
    case 'kill_enemy':
      return {
        text: obj.desc,
        done: player.killedEnemies.includes(obj.target),
      };
    case 'collect_item':
      return {
        text: obj.desc,
        done: player.inventory.filter((i) => i === obj.target).length >= (obj.amount ?? 1),
      };
    case 'xiuwei':
      return {
        text: obj.desc,
        done: player.stats.xiuwei >= (obj.amount ?? 0),
      };
    default:
      return { text: obj.desc, done: false };
  }
}

export const TaskPanel = () => {
  const player = usePlayerStore((state) => state.player);
  if (!player) return null;

  const activeQuests = player.quests.filter((q) => q.status === 'active');
  const completedCount = player.quests.filter((q) => q.status === 'completed').length;

  return (
    <div className="glass-panel-light rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-[#8B7A5E] tracking-widest uppercase">
          ◈ 任务指引
        </span>
        <span className="text-[8px] text-[#8B7A5E]/50">
          {activeQuests.length} 进行中{completedCount > 0 ? ` · ${completedCount} 完成` : ''}
        </span>
      </div>
      <div className="divider-antique" />
      <div className="mt-2 space-y-2">
        {activeQuests.length === 0 ? (
          <div className="text-[11px] text-[#8B7A5E]/50 text-center py-3">
            {player.quests.length === 0
              ? '尚无任务。与场景中的人物交谈，或前往新的地方。'
              : '暂无进行中的任务'}
          </div>
        ) : (
          activeQuests.map((q) => {
            const data = questsData[q.id];
            if (!data) return null;
            const meta = STATUS_META[q.status];
            return (
              <div key={q.id} className="p-2 rounded-lg bg-[#0A0806]/30">
                <div className="flex items-center gap-1.5 text-xs">
                  <span className={meta.color}>{meta.icon}</span>
                  <span className={meta.color}>{data.name}</span>
                </div>
                <div className="mt-1 space-y-0.5">
                  {data.objectives.map((obj, i) => {
                    const { text, done } = objectiveText(obj, player);
                    return (
                      <div key={i} className={`text-[10px] pl-4 ${done ? 'text-[#4EC9C9]' : 'text-[#8B7A5E]/70'}`}>
                        {done ? '✓' : '·'} {text}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
