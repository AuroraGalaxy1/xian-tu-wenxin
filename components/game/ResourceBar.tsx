'use client';

import { usePlayerStore } from '@/stores/playerStore';
import { getRealmIndex } from '@/lib/gameData/realms';
import { getNextRealmRequirement } from '@/lib/utils/gameUtils';

/** 玩家气血/修为/灵石状态条（挂于中央面板顶部） */
export const ResourceBar = () => {
  const hp = usePlayerStore((s) => s.player?.hp);
  const maxHp = usePlayerStore((s) => s.player?.maxHp);
  const realm = usePlayerStore((s) => s.player?.realm);
  const lingShi = usePlayerStore((s) => s.player?.lingShi);
  const xiuwei = usePlayerStore((s) => s.player?.stats.xiuwei);
  if (hp === undefined || !realm) return null;

  const hpPct = Math.min(100, (hp / (maxHp ?? 1)) * 100);
  const req = getNextRealmRequirement({ realm } as any);
  const xiuPct = req ? Math.min(100, ((xiuwei ?? 0) / req) * 100) : 100;
  const realmIdx = getRealmIndex(realm);

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
          {hp}/{maxHp}
        </span>
      </div>

      {/* 修为 */}
      <div className="flex items-center gap-2 min-w-[180px] flex-1 max-w-xs">
        <span className="text-sm text-[#C9A04E] whitespace-nowrap">修为</span>
        <div className="progress-bar-track flex-1">
          <div className="progress-bar-fill gold" style={{ width: `${xiuPct}%` }} />
        </div>
        <span className="text-sm text-[#8B7A5E] whitespace-nowrap">
          {xiuwei ?? 0}
          {req !== null ? `/${req}` : '/MAX'}
        </span>
      </div>

      {/* 灵石 */}
      <div className="flex items-center gap-1.5 text-sm text-[#4EC9C9]">
        <span>💎</span>
        <span>{lingShi}</span>
      </div>

      <div className="text-sm text-[#A99A80]/80">
        {realm} · {realmIdx} 境
      </div>
    </div>
  );
};
