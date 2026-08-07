'use client';

import { usePlayerStore } from '@/stores/playerStore';
import { getRealmIndex } from '@/lib/gameData/realms';
import { getNextRealmRequirement } from '@/lib/utils/gameUtils';

/** 玩家气血/修为/灵石状态条（挂于中央面板顶部） */
export const ResourceBar = () => {
  const player = usePlayerStore((s) => s.player);
  if (!player) return null;

  const hpPct = Math.min(100, (player.hp / player.maxHp) * 100);
  const req = getNextRealmRequirement(player);
  const xiuPct = req ? Math.min(100, (player.stats.xiuwei / req) * 100) : 100;
  const realmIdx = getRealmIndex(player.realm);

  return (
    <div className="flex items-center gap-5 mb-4 px-1 flex-wrap">
      {/* 气血 */}
      <div className="flex items-center gap-2 min-w-[180px] flex-1 max-w-xs">
        <span className="text-sm text-[#E8A84E] whitespace-nowrap">气血</span>
        <div className="progress-bar-track flex-1">
          <div
            className="progress-bar-fill"
            style={{
              width: `${hpPct}%`,
              background: 'linear-gradient(90deg,#66D9D1,#2E9E9E)',
            }}
          />
        </div>
        <span className="text-sm text-[#8B7A5E] whitespace-nowrap">
          {player.hp}/{player.maxHp}
        </span>
      </div>

      {/* 修为 */}
      <div className="flex items-center gap-2 min-w-[180px] flex-1 max-w-xs">
        <span className="text-sm text-[#C9A04E] whitespace-nowrap">修为</span>
        <div className="progress-bar-track flex-1">
          <div className="progress-bar-fill gold" style={{ width: `${xiuPct}%` }} />
        </div>
        <span className="text-sm text-[#8B7A5E] whitespace-nowrap">
          {player.stats.xiuwei}
          {req !== null ? `/${req}` : '/MAX'}
        </span>
      </div>

      {/* 灵石 */}
      <div className="flex items-center gap-1.5 text-sm text-[#4EC9C9]">
        <span>💎</span>
        <span>{player.lingShi}</span>
      </div>

      <div className="text-sm text-[#A99A80]/80">
        {player.realm} · {realmIdx} 境
      </div>
    </div>
  );
};
