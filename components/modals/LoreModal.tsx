'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BookOpen, Trophy } from 'lucide-react';
import { useLoreStore } from '@/stores/loreStore';
import { useUiStore } from '@/stores/uiStore';
import { loreData, getLoresByCategory } from '@/lib/gameData/lore';
import {
  LORE_CATEGORY_LABEL,
  LORE_CATEGORY_ORDER,
  LoreCategory,
} from '@/types/lore';
import { AchievementPanel } from './AchievementPanel';

export const LoreModal = () => {
  const [tab, setTab] = useState<'lore' | 'achievement'>('lore');
  const [category, setCategory] = useState<LoreCategory | 'all'>('all');
  const unlockedIds = useLoreStore((s) => s.unlockedIds);
  const close = () => useUiStore.getState().setLoreOpen(false);

  const allEntries = Object.values(loreData);
  const entries =
    category === 'all' ? allEntries : getLoresByCategory(category);
  const unlockedCount = allEntries.filter((l) =>
    unlockedIds.includes(l.id)
  ).length;

  return (
    <motion.div
      className="glass-panel border-antique-thick rounded-2xl p-5 text-[#E5D8B5] relative w-full max-w-xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
    >
      <button
        onClick={close}
        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#1A1410] border border-[#C9A04E]/40 flex items-center justify-center hover:bg-[#C94E4E]/30 transition-colors"
      >
        <X className="w-4 h-4 text-[#C9A04E]" />
      </button>

      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-4 h-4 text-[#C9A04E]" />
        <h3 className="text-lg font-bold tracking-wider">见闻录 · 图鉴</h3>
        <span className="ml-auto text-xs text-[#8B7A5E]">
          已收录 {unlockedCount} / {allEntries.length}
        </span>
      </div>

      {/* 主页签：见闻 / 成就 */}
      <div className="flex gap-1.5 mb-3">
        <button
          onClick={() => setTab('lore')}
          className={`px-4 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${
            tab === 'lore'
              ? 'bg-[#C9A04E]/15 text-[#C9A04E] border border-[#C9A04E]/30'
              : 'text-[#8B7A5E] hover:text-[#D4C9B8] border border-transparent'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> 见闻
        </button>
        <button
          onClick={() => setTab('achievement')}
          className={`px-4 py-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${
            tab === 'achievement'
              ? 'bg-[#4EC9C9]/15 text-[#4EC9C9] border border-[#4EC9C9]/30'
              : 'text-[#8B7A5E] hover:text-[#D4C9B8] border border-transparent'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" /> 成就
        </button>
      </div>

      {tab === 'lore' ? (
        <>
          <div className="divider-antique mb-3" />
          {/* 分类页签 */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        <button
          onClick={() => setCategory('all')}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            category === 'all'
              ? 'bg-[#C9A04E]/15 text-[#C9A04E] border border-[#C9A04E]/30'
              : 'text-[#8B7A5E] hover:text-[#D4C9B8] border border-transparent'
          }`}
        >
          全部
        </button>
        {LORE_CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              category === cat
                ? 'bg-[#C9A04E]/15 text-[#C9A04E] border border-[#C9A04E]/30'
                : 'text-[#8B7A5E] hover:text-[#D4C9B8] border border-transparent'
            }`}
          >
            {LORE_CATEGORY_LABEL[cat]}
          </button>
        ))}
      </div>

      {/* 见闻列表 */}
      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
        {entries.length === 0 && (
          <div className="text-xs text-[#8B7A5E]/40 text-center py-6">空空如也</div>
        )}
        {entries.map((entry) => {
          const unlocked = unlockedIds.includes(entry.id);
          return (
            <div
              key={entry.id}
              className={`p-3 rounded-lg border transition-colors ${
                unlocked
                  ? 'border-[#C9A04E]/20 bg-[#0A0806]/40'
                  : 'border-[#8B7A5E]/10 bg-[#0A0806]/20 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-medium ${unlocked ? 'text-[#D4C9B8]' : 'text-[#8B7A5E]/60'}`}>
                  {unlocked ? entry.title : '？？？'}
                </span>
                <span className="text-[9px] text-[#8B7A5E]/60 px-1.5 py-0.5 rounded bg-[#0A0806]/60">
                  {LORE_CATEGORY_LABEL[entry.category]}
                </span>
              </div>
              <p className={`text-[11px] leading-relaxed ${unlocked ? 'text-[#C9BFA0]' : 'text-[#8B7A5E]/70 italic'}`}>
                {unlocked ? entry.content : entry.unlockHint}
              </p>
            </div>
          );
        })}
      </div>
        </>
      ) : (
        <AchievementPanel />
      )}
    </motion.div>
  );
};
