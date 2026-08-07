'use client';

import { motion } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { usePlayerStore } from '@/stores/playerStore';
import { npcsData } from '@/lib/gameData/npcs';
import { getItem } from '@/lib/gameData/items';
import { RARITY_META, ITEM_TYPE_LABEL } from '@/types/item';

export const ShopModal = ({ npcId }: { npcId: string }) => {
  const npc = npcsData[npcId];
  const player = usePlayerStore((s) => s.player);
  const lingShi = player?.lingShi ?? 0;
  const closeShop = () => useUiStore.getState().closeShop();
  const buy = useInventoryStore.getState().buyItem;

  if (!npc?.shop || !player) return null;

  return (
    <motion.div
      className="glass-panel border-antique-thick rounded-2xl p-5 text-[#F0E8D8] relative"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
    >
      <button
        onClick={closeShop}
        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#1A1410] border border-[#C9A04E]/40 flex items-center justify-center hover:bg-[#C94E4E]/30 transition-colors"
      >
        <X className="w-4 h-4 text-[#C9A04E]" />
      </button>

      <div className="flex items-center gap-2 mb-1">
        <ShoppingBag className="w-4 h-4 text-[#C9A04E]" />
        <h3 className="text-lg font-bold tracking-wider">{npc.name} · {npc.title}</h3>
        <span className="ml-auto text-xs text-[#C9A04E]">💎 {lingShi} 灵石</span>
      </div>
      <div className="divider-antique mb-4" />

      <div className="space-y-2">
        {npc.shop.map((entry) => {
          const item = getItem(entry.itemId);
          if (!item) return null;
          const rarity = RARITY_META[item.rarity];
          const afford = lingShi >= entry.price;
          return (
            <div
              key={entry.itemId}
              className="flex items-center justify-between p-3 rounded-lg border border-[#8B7A5E]/10 bg-[#0A0806]/40"
            >
              <div>
                <div className="text-sm text-[#D4C9B8]">
                  {item.name} <span className={`text-xs ml-1 ${rarity.color}`}>{rarity.label}</span>
                </div>
                <div className="text-xs text-[#8B7A5E]">
                  {ITEM_TYPE_LABEL[item.type]}
                  {item.effect?.desc ? ` · ${item.effect.desc}` : ''}
                </div>
              </div>
              <button
                onClick={() => buy(item.id, entry.price)}
                disabled={!afford}
                className={`${afford ? 'btn-antique-primary' : ''} btn-antique px-4 py-1.5 text-xs`}
              >
                {entry.price} 灵石
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
