'use client';

import { usePlayerStore } from '@/stores/playerStore';
import { npcsData } from '@/lib/gameData/npcs';
import { Heart } from 'lucide-react';

/** 好感度等级划分 */
function favorLabel(val: number): { label: string; color: string } {
  if (val >= 80) return { label: '莫逆', color: 'text-[#C9A04E]' };
  if (val >= 60) return { label: '知己', color: 'text-[#4EC9C9]' };
  if (val >= 40) return { label: '熟识', color: 'text-[#7DDDDD]' };
  if (val >= 20) return { label: '相识', color: 'text-[#A99A80]' };
  return { label: '素昧', color: 'text-[#8B7A5E]' };
}

export const RelationshipOverview = () => {
  const relationships = usePlayerStore((state) => state.player?.relationships);

  const known = relationships
    ? Object.entries(relationships)
        .map(([npcId, val]) => ({ npc: npcsData[npcId], val }))
        .filter((r) => r.npc)
        .slice(0, 5)
    : [];

  if (known.length === 0) return null;

  return (
    <div className="glass-panel-light rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#A99A80] tracking-widest uppercase">
          ◈ 羁绊
        </span>
        <span className="text-xs text-[#A99A80]/70">{known.length} 位故人</span>
      </div>
      <div className="divider-antique" />
      <div className="mt-2 space-y-1.5">
        {known.map(({ npc, val }) => {
          const meta = favorLabel(val);
          return (
            <div key={npc.id} className="flex items-center justify-between text-xs p-1.5 rounded bg-[#0A0806]/30">
              <div className="flex items-center gap-1.5">
                <Heart className="w-3 h-3 text-[#C94E4E]" />
                <span className="text-[#D4C9B8]">{npc.name}</span>
                <span className="text-[#A99A80]/50 text-[10px]">· {npc.title}</span>
              </div>
              <span className={`${meta.color} flex items-center gap-1`}>
                {meta.label}
                <span className="text-[#A99A80]/60">{val}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};