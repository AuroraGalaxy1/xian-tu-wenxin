'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Package } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { useInventory } from '@/stores/inventoryStore';
import { ITEM_TYPE_LABEL, RARITY_META } from '@/types/item';

const TABS: { key: string; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'dan', label: '丹药' },
  { key: 'fabao', label: '法宝' },
  { key: 'cailiao', label: '材料' },
  { key: 'gongfa', label: '功法' },
  { key: 'za_wu', label: '杂物' },
];

const TYPE_EMOJI: Record<string, string> = {
  dan: '⚗️',
  fabao: '🗡️',
  cailiao: '🌿',
  gongfa: '📜',
  za_wu: '📦',
};

export const BackpackModal = () => {
  const [tab, setTab] = useState('all');
  const { entries, totalCount, getItem } = useInventory(tab === 'all' ? undefined : tab);
  const close = () => useUiStore.getState().setBackpackOpen(false);
  const openItem = (itemId: string) => useUiStore.getState().openItemDetail(itemId, 'backpack');

  return (
    <motion.div
      className="glass-panel border-antique-thick rounded-2xl p-5 text-[#E5D8B5] relative"
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

      <div className="flex items-center gap-2 mb-3">
        <Package className="w-4 h-4 text-[#4EC9C9]" />
        <h3 className="text-lg font-bold tracking-wider">乾坤袋 · 背包</h3>
        <span className="ml-auto text-xs text-[#8B7A5E]">共 {totalCount} 件</span>
      </div>

      {/* 分类页签 */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              tab === t.key
                ? 'bg-[#C9A04E]/15 text-[#C9A04E] border border-[#C9A04E]/30'
                : 'text-[#8B7A5E] hover:text-[#D4C9B8] border border-transparent'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 物品列表 */}
      {entries.length === 0 ? (
        <div className="text-center text-xs text-[#8B7A5E]/40 py-8 border border-dashed border-[#8B7A5E]/15 rounded-lg">
          空空如也
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {entries.map((e) => {
            const item = getItem(e.itemId);
            if (!item) return null;
            const rarity = RARITY_META[item.rarity];
            return (
              <button
                key={e.itemId}
                onClick={() => openItem(e.itemId)}
                className="text-left p-2.5 rounded-lg border border-[#8B7A5E]/10 bg-[#0A0806]/40 hover:border-[#C9A04E]/30 hover:bg-[#1A1410]/60 transition-all group"
              >
                <div className="flex items-start justify-between">
                  <span className="text-lg leading-none">{TYPE_EMOJI[item.type] ?? '📦'}</span>
                  {e.count > 1 && (
                    <span className="text-[10px] text-[#8B7A5E] bg-[#0A0806]/60 rounded px-1">×{e.count}</span>
                  )}
                </div>
                <div className="text-xs mt-1.5 text-[#D4C9B8] group-hover:text-[#C9A04E] transition-colors">
                  {item.name}
                </div>
                <div className={`text-[10px] ${rarity.color}`}>{rarity.label} · {ITEM_TYPE_LABEL[item.type]}</div>
              </button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
