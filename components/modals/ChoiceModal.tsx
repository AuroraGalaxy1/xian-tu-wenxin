'use client';

import { motion } from 'framer-motion';
import { X, Shield } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useLogStore } from '@/stores/logStore';
import { choicesData } from '@/lib/gameData/choices';

export const ChoiceModal = () => {
  const choiceId = useUiStore((s) => s.choiceId);
  if (!choiceId) return null;

  const choice = choicesData[choiceId];
  if (!choice) return null;

  const close = () => useUiStore.getState().closeChoice();

  const handleChoice = (index: number) => {
    const option = choice.options[index];
    if (!option) return;

    const ps = usePlayerStore.getState();
    const ls = useLogStore.getState();
    const ui = useUiStore.getState();
    const player = ps.player;

    if (player) {
      const updates: Record<string, number> = {};
      for (const [key, val] of Object.entries(option.effects)) {
        const current = (player.stats as Record<string, number>)[key];
        if (current !== undefined) {
          updates[key] = current + (val as number);
        }
      }
      ps.updateStats(updates as Partial<typeof player.stats>);
    }

    ls.addLog(option.logMessage ?? '你做出了选择。', 'special');
    close();
  };

  return (
    <motion.div
      className="glass-panel border-antique-thick rounded-2xl p-6 text-[#F0E8D8] relative max-w-xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <button
        onClick={close}
        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#1A1410] border border-[#C9A04E]/40 flex items-center justify-center hover:bg-[#C94E4E]/30 transition-colors"
      >
        <X className="w-4 h-4 text-[#C9A04E]" />
      </button>

      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-[#1A1410] border border-[#C9A04E]/30 flex items-center justify-center">
          <Shield className="w-5 h-5 text-[#C9A04E]" />
        </div>
        <div>
          <div className="font-medium text-[#E8DCC8]">{choice.title}</div>
          <div className="text-xs text-[#8B7A5E]">心性抉择 · 一念之间</div>
        </div>
      </div>
      <div className="divider-antique mb-4" />

      {/* 事件描述 */}
      <div className="border-antique rounded-lg p-4 bg-[#0A0806]/50 mb-4">
        <p className="text-sm text-[#D9CCB2] leading-relaxed whitespace-pre-line">{choice.description}</p>
      </div>

      {/* 选项 */}
      <div className="space-y-3">
        {choice.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleChoice(index)}
            className="w-full text-left border-antique rounded-lg p-4 bg-[#0A0806]/40 hover:bg-[#C9A04E]/10 transition-colors group"
          >
            <div className="text-sm font-medium text-[#E8DCC8] group-hover:text-[#C9A04E] transition-colors">
              {option.label}
            </div>
            <div className="text-xs text-[#8B7A5E] mt-1 leading-relaxed">{option.description}</div>
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries(option.effects).map(([key, val]) => {
                const value = val as number;
                const labelMap: Record<string, string> = {
                  daoxin: '道心',
                  lingyun: '灵蕴',
                  tipo: '体魄',
                  shenshi: '神识',
                  yinguo: '因果',
                  zhinian: '执念',
                  xiuwei: '修为',
                };
                const sign = value >= 0 ? '+' : '';
                const color = value >= 0 ? 'text-[#4EC9C9]' : 'text-[#C94E4E]';
                return (
                  <span key={key} className={`text-xs ${color} border border-current/20 rounded px-1.5 py-0.5`}>
                    {labelMap[key] || key} {sign}{value}
                  </span>
                );
              })}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};