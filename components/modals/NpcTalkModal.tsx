'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ShoppingBag, ScrollText, MessageCircle } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useLogStore } from '@/stores/logStore';
import { useLoreStore } from '@/stores/loreStore';
import { npcsData } from '@/lib/gameData/npcs';
import { npcLoreMap } from '@/lib/gameData/lore';
import { questsData } from '@/lib/gameData/quests';

export const NpcTalkModal = ({ npcId }: { npcId: string }) => {
  const npc = npcsData[npcId];
  const player = usePlayerStore((s) => s.player);
  const [round, setRound] = useState(0);
  const { closeTalk, openShop } = useUiStore();

  // 与 NPC 交谈解锁人物志见闻
  useEffect(() => {
    const loreId = npcLoreMap[npcId];
    if (loreId) useLoreStore.getState().unlock(loreId);
  }, [npcId]);

  if (!npc || !player) return null;

  const dialogue = npc.dialogue;
  const quest = npc.questId ? questsData[npc.questId] : undefined;
  const questEntry = npc.questId
    ? player.quests.find((q) => q.id === npc.questId)
    : undefined;
  const isQuestDone = questEntry?.status === 'completed';
  const isQuestActive = questEntry?.status === 'active';

  const acceptQuest = () => {
    if (!npc.questId || !quest) return;
    usePlayerStore.getState().addQuest(npc.questId);
    useLogStore.getState().addLog(`📜 接取任务「${quest.name}」`, 'special');
  };

  return (
    <motion.div
      className="glass-panel border-antique-thick rounded-2xl p-6 text-[#E5D8B5] relative max-w-lg mx-auto"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
    >
      <button
        onClick={closeTalk}
        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#1A1410] border border-[#C9A04E]/40 flex items-center justify-center hover:bg-[#C94E4E]/30 transition-colors"
      >
        <X className="w-4 h-4 text-[#C9A04E]" />
      </button>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#1A1410] border border-[#C9A04E]/30 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-[#C9A04E]" />
        </div>
        <div>
          <div className="font-medium">{npc.name}</div>
          <div className="text-[11px] text-[#8B7A5E]">{npc.title} · {npc.realm}</div>
        </div>
      </div>
      <div className="divider-antique mb-3" />

      {/* 对话 */}
      <div className="border-antique rounded-lg p-4 bg-[#0A0806]/50 mb-4 min-h-[88px]">
        <p className="text-sm text-[#D9CCB2] leading-relaxed">{dialogue[round % dialogue.length]}</p>
      </div>
      {dialogue.length > 1 && (
        <button
          onClick={() => setRound((r) => r + 1)}
          className="text-[11px] text-[#8B7A5E] hover:text-[#C9A04E] mb-3"
        >
          ▸ 继续听他说…
        </button>
      )}

      {/* 操作 */}
      <div className="flex gap-2 mt-3">
        {npc.shop && (
          <button onClick={() => openShop(npc.id)} className="btn-antique flex-1 py-2 text-sm flex items-center justify-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-[#C9A04E]" />
            前往商铺
          </button>
        )}
        {npc.questId && !isQuestActive && !isQuestDone && (
          <button onClick={acceptQuest} className="btn-antique btn-antique-special flex-1 py-2 text-sm flex items-center justify-center gap-1.5">
            <ScrollText className="w-4 h-4" />
            接取任务
          </button>
        )}
        {isQuestDone && (
          <div className="flex-1 py-2 text-sm text-center text-[#4EC9C9] border border-[#4EC9C9]/15 rounded-lg">
            ✓ 任务已达成
          </div>
        )}
        <button onClick={closeTalk} className="btn-antique px-5 py-2 text-sm">
          离开
        </button>
      </div>
    </motion.div>
  );
};
