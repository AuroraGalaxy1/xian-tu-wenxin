'use client';

import { useMemo } from 'react';
import { usePlayerStore } from '@/stores/playerStore';
import { questsData } from '@/lib/gameData/quests';
import { getRealmIndex } from '@/lib/gameData/realms';
import type { Player } from '@/types/player';

const STATUS_META: Record<string, { icon: string; color: string }> = {
  completed: { icon: '✅', color: 'text-[#4EC9C9]' },
  active: { icon: '⟳', color: 'text-[#C9A04E]' },
  pending: { icon: '○', color: 'text-[#8B7A5E]' },
  locked: { icon: '🔒', color: 'text-[#8B7A5E]/30' },
};

/** 目标进度展示文案 */
function objectiveText(
  obj: { type: string; target: string; amount?: number; desc: string },
  player: Player,
): { text: string; done: boolean; progress?: number } {
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
        progress: player.killedEnemies.includes(obj.target) ? 1 : 0,
      };
    case 'collect_item': {
      const count = player.inventory.filter((i) => i === obj.target).length;
      return {
        text: obj.desc,
        done: count >= (obj.amount ?? 1),
        progress: Math.min(1, count / (obj.amount ?? 1)),
      };
    }
    case 'xiuwei':
      return {
        text: obj.desc,
        done: player.stats.xiuwei >= (obj.amount ?? 0),
        progress: Math.min(1, player.stats.xiuwei / (obj.amount ?? 1)),
      };
    default:
      return { text: obj.desc, done: false };
  }
}

export const TaskPanel = () => {
  const quests = usePlayerStore((state) => state.player?.quests);
  const currentScene = usePlayerStore((state) => state.player?.currentScene);
  const visitedScenes = usePlayerStore((state) => state.player?.visitedScenes);
  const killedEnemies = usePlayerStore((state) => state.player?.killedEnemies);
  const inventory = usePlayerStore((state) => state.player?.inventory);
  const realm = usePlayerStore((state) => state.player?.realm);
  const xiuwei = usePlayerStore((state) => state.player?.stats.xiuwei);
  const getCurrentQuestHint = usePlayerStore((state) => state.getCurrentQuestHint);
  if (!quests) return null;

  const activeQuests = quests.filter((q) => q.status === 'active');
  const completedCount = quests.filter((q) => q.status === 'completed').length;
  const questHint = useMemo(() => getCurrentQuestHint(), [getCurrentQuestHint, quests, currentScene]);
  const sortedActiveQuests = useMemo(() => {
    return [...activeQuests].sort((a, b) => {
      const dataA = questsData[a.id];
      const dataB = questsData[b.id];
      if (!dataA || !dataB) return 0;
      if (dataA.type !== dataB.type) {
        return dataA.type === 'main' ? -1 : 1;
      }
      return a.id.localeCompare(b.id);
    });
  }, [activeQuests]);

  const playerView: Player = {
    id: 'player_001',
    name: '',
    realm: realm ?? '',
    realmStage: '',
    stats: {
      daoxin: 0,
      maxDaoxin: 0,
      lingyun: 0,
      maxLingyun: 0,
      tipo: 0,
      shenshi: 0,
      yinguo: 0,
      zhinian: 0,
      xiuwei: xiuwei ?? 0,
    },
    hp: 0,
    maxHp: 0,
    lingShi: 0,
    currentScene: currentScene ?? '',
    inventory: inventory ?? [],
    skills: [],
    quests,
    relationships: {},
    equipment: {},
    visitedScenes: visitedScenes ?? [],
    killedEnemies: killedEnemies ?? [],
  };

  return (
    <div className="glass-panel-light rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#A99A80] tracking-widest uppercase">
          ◈ 任务指引
        </span>
        <span className="text-xs text-[#A99A80]/70">
          {activeQuests.length} 进行中{completedCount > 0 ? ` · ${completedCount} 完成` : ''}
        </span>
      </div>
      <div className="divider-antique" />
      <div className="mt-2 space-y-2">
        {activeQuests.length === 0 ? (
          <div className="text-xs text-[#A99A80]/70 text-center py-3">
            {quests.length === 0
              ? '尚无任务。与场景中的人物交谈，或前往新的地方。'
              : '暂无进行中的任务'}
          </div>
        ) : (
          sortedActiveQuests.map((q) => {
            const data = questsData[q.id];
            if (!data) return null;
            const meta = STATUS_META[q.status];
            const isNextStep = questHint?.questId === q.id;
            return (
              <div key={q.id} className={`p-2 rounded-lg bg-[#0A0806]/30 ${isNextStep ? 'ring-1 ring-[#C9A04E]/30' : ''}`}>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className={meta.color}>{meta.icon}</span>
                  <span className={meta.color}>{data.name}</span>
                  {isNextStep && (
                    <span className="ml-auto text-[10px] text-[#C9A04E] flex items-center gap-0.5">
                      ✦ 下一步
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-0.5">
                  {data.objectives.map((obj, i) => {
                    const { text, done, progress } = objectiveText(obj, playerView);
                    return (
                      <div key={i}>
                        <div className={`text-xs pl-4 ${done ? 'text-[#4EC9C9]' : 'text-[#A99A80]/80'}`}>
                          {done ? '✓' : '·'} {text}
                        </div>
                        {(obj.type === 'kill_enemy' || obj.type === 'collect_item' || obj.type === 'xiuwei') && !done && progress !== undefined && (
                          <div className="mt-1 pl-4">
                            <div className="progress-bar-track h-1.5">
                              <div
                                className="progress-bar-fill"
                                style={{ width: `${Math.round(progress * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
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
