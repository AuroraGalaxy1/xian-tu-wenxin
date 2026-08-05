'use client';

import { useSceneStore } from '@/stores/sceneStore';
import { useUiStore } from '@/stores/uiStore';
import { npcsData } from '@/lib/gameData/npcs';
import { MessageCircle } from 'lucide-react';

export const PlayerList = () => {
  const currentScene = useSceneStore((s) => s.currentScene);
  const openTalk = (npcId: string) => useUiStore.getState().openTalk(npcId);

  const npcs = currentScene
    ? Object.values(npcsData).filter((n) => n.sceneId === currentScene.id)
    : [];

  return (
    <div className="glass-panel-light rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-[#8B7A5E] tracking-widest uppercase">
          ◈ 此处人物
        </span>
        <span className="text-[8px] text-[#8B7A5E]/50">{npcs.length} 位</span>
      </div>
      <div className="divider-antique" />
      <div className="mt-2 space-y-1.5">
        {npcs.length === 0 ? (
          <div className="text-[11px] text-[#8B7A5E]/40 text-center py-3">
            四下无人
          </div>
        ) : (
          npcs.map((npc) => (
            <button
              key={npc.id}
              onClick={() => openTalk(npc.id)}
              className="w-full flex items-center justify-between text-xs p-1.5 rounded hover:bg-[#1A1410]/40 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4EC9C9]" />
                <span className="text-[#D4C9B8] group-hover:text-[#C9A04E]">{npc.name}</span>
                <span className="text-[#8B7A5E]/50 text-[10px]">· {npc.title}</span>
              </div>
              <MessageCircle className="w-3 h-3 text-[#8B7A5E] group-hover:text-[#C9A04E]" />
            </button>
          ))
        )}
      </div>
    </div>
  );
};
