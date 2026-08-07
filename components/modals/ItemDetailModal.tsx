'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { usePlayerStore } from '@/stores/playerStore';
import { getItem } from '@/lib/gameData/items';
import { ITEM_TYPE_LABEL, RARITY_META } from '@/types/item';

export const ItemDetailModal = () => {
  const { itemDetail, closeItemDetail } = useUiStore();
  const player = usePlayerStore((s) => s.player);

  if (!itemDetail) return null;
  const item = getItem(itemDetail.itemId);
  if (!item) return null;

  const inv = useInventoryStore.getState();
  const rarity = RARITY_META[item.rarity];
  const isEquipped = !!player?.equipment && Object.values(player.equipment).includes(item.id);
  const isInBackpack = !!player?.inventory.includes(item.id);
  const isEquipable = !!item.equipSlot;

  const handlePrimary = () => {
    if (isEquipped) {
      inv.unequipItem(item.equipSlot!);
    } else if (isEquipable) {
      inv.equipItem(item.id);
    } else {
      inv.useItem(item.id);
    }
    closeItemDetail();
  };

  const handleSell = () => {
    inv.sellItem(item.id);
    closeItemDetail();
  };

  return (
    <motion.div
      className="glass-panel border-antique-thick rounded-2xl p-6 text-[#F0E8D8] relative max-w-sm mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <button
        onClick={closeItemDetail}
        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#1A1410] border border-[#C9A04E]/40 flex items-center justify-center hover:bg-[#C94E4E]/30 transition-colors"
      >
        <X className="w-4 h-4 text-[#C9A04E]" />
      </button>

      <div className="flex items-center justify-between mb-1">
        <h4 className={`text-lg font-bold ${rarity.color}`}>{item.name}</h4>
        {isEquipped && (
          <span className="text-xs px-2 py-0.5 rounded bg-[#4EC9C9]/10 text-[#4EC9C9] border border-[#4EC9C9]/20">
            已装备
          </span>
        )}
      </div>
      <div className="text-xs text-[#8B7A5E] mb-3">
        {rarity.label} · {ITEM_TYPE_LABEL[item.type]}
        {item.price > 0 && ` · 价值 ${item.price} 灵石`}
      </div>
      <div className="divider-antique mb-3" />

      <p className="text-xs text-[#C9BFA0] leading-relaxed mb-4">{item.description}</p>

      {item.effect && (
        <div className="text-xs text-[#4EC9C9] border border-[#4EC9C9]/15 bg-[#4EC9C9]/5 rounded-lg p-2.5 mb-4">
          {item.effect.desc ?? `效果：${item.effect.type}`}
        </div>
      )}

      <div className="flex gap-2">
        {isInBackpack && (
          <button onClick={handlePrimary} className="btn-antique btn-antique-primary flex-1 py-2 text-sm">
            {isEquipped ? '卸下' : isEquipable ? '装备' : '使用'}
          </button>
        )}
        {isInBackpack && (
          <button onClick={handleSell} className="btn-antique flex-1 py-2 text-sm">
            出售（{item.sellPrice ?? Math.floor(item.price / 2)} 灵石）
          </button>
        )}
        {!isInBackpack && (
          <button onClick={closeItemDetail} className="btn-antique flex-1 py-2 text-sm">
            关闭
          </button>
        )}
      </div>
    </motion.div>
  );
};
