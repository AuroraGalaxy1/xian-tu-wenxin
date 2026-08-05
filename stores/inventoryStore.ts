// 背包操作门面：基于 playerStore 的 inventory，提供使用/装备/买卖操作
import { create } from 'zustand';
import { itemsData } from '@/lib/gameData/items';
import { usePlayerStore } from '@/stores/playerStore';
import { useLogStore } from '@/stores/logStore';
import type { Player } from '@/types/player';
import type { EquipSlot, InventoryEntry, ItemEffectType } from '@/types/item';

interface InventoryState {
  useItem: (itemId: string) => void;
  equipItem: (itemId: string) => void;
  unequipItem: (slot: EquipSlot) => void;
  buyItem: (itemId: string, price: number) => boolean;
  sellItem: (itemId: string) => boolean;
}

/** 应用单次使用效果（返回描述文字） */
function applyEffect(player: Player, effType: ItemEffectType, value: number, ps: ReturnType<typeof usePlayerStore.getState>): string {
  switch (effType) {
    case 'restore_hp':
      ps.heal(value);
      return `恢复气血 ${value} 点`;
    case 'gain_xiuwei':
      ps.gainXiuwei(value);
      return `修为 +${value}`;
    case 'gain_daoxin':
      ps.updateStats({ daoxin: Math.min(player.stats.maxDaoxin, player.stats.daoxin + value) });
      return `道心 +${value}`;
    case 'gain_lingyun':
      ps.updateStats({ lingyun: Math.min(player.stats.maxLingyun, player.stats.lingyun + value) });
      return `灵蕴 +${value}`;
    case 'gain_tipo':
      ps.updateStats({ tipo: player.stats.tipo + value });
      return `体魄 +${value}`;
    default:
      return '';
  }
}

export const useInventoryStore = create<InventoryState>()(() => ({
  useItem: (itemId) => {
    const ps = usePlayerStore.getState();
    const p = ps.player;
    const item = itemsData[itemId];
    if (!p || !item) return;
    if (!p.inventory.includes(itemId)) {
      useLogStore.getState().addLog('背包中没有此物。', 'normal');
      return;
    }
    const eff = item.effect;
    if (!eff) {
      useLogStore.getState().addLog(`「${item.name}」不可直接使用。`, 'normal');
      return;
    }
    const desc = applyEffect(p, eff.type, eff.value, ps);
    useLogStore
      .getState()
      .addLog(`使用「${item.name}」——${desc || '无效果'}。`, eff.type === 'gain_xiuwei' ? 'stat' : 'item');
    ps.removeItem(itemId);
  },

  equipItem: (itemId) => {
    const ps = usePlayerStore.getState();
    const p = ps.player;
    const item = itemsData[itemId];
    if (!p || !item || !item.equipSlot) {
      useLogStore.getState().addLog('该物品无法装备。', 'normal');
      return;
    }
    if (!p.inventory.includes(itemId)) return;
    const slot = item.equipSlot;
    const oldEquipped = p.equipment[slot];
    const inventory = p.inventory.filter((id) => id !== itemId);
    const equipment = { ...p.equipment, [slot]: itemId };
    ps.setPlayer({ ...p, inventory, equipment });
    useLogStore.getState().addLog(`装备「${item.name}」。`, 'item');
    if (oldEquipped) {
      ps.addItem(oldEquipped);
      useLogStore.getState().addLog(`卸下的「${itemsData[oldEquipped]?.name ?? oldEquipped}」放入背包。`, 'item');
    }
  },

  unequipItem: (slot) => {
    const ps = usePlayerStore.getState();
    const p = ps.player;
    if (!p) return;
    const itemId = p.equipment[slot];
    if (!itemId) return;
    const equipment = { ...p.equipment, [slot]: undefined };
    ps.setPlayer({ ...p, inventory: [...p.inventory, itemId], equipment });
    useLogStore.getState().addLog(`卸下「${itemsData[itemId]?.name ?? itemId}」。`, 'item');
  },

  buyItem: (itemId, price) => {
    const ps = usePlayerStore.getState();
    const item = itemsData[itemId];
    if (!item) return false;
    if (!ps.spendLingShi(price)) {
      useLogStore.getState().addLog('灵石不足，无法购买。', 'danger');
      return false;
    }
    ps.addItem(itemId);
    useLogStore.getState().addLog(`购入「${item.name}」，花费 ${price} 灵石。`, 'item');
    return true;
  },

  sellItem: (itemId) => {
    const ps = usePlayerStore.getState();
    const p = ps.player;
    const item = itemsData[itemId];
    if (!p || !item) return false;
    if (!p.inventory.includes(itemId)) return false;
    const price = item.sellPrice ?? Math.floor(item.price / 2);
    ps.removeItem(itemId);
    ps.gainLingShi(price);
    useLogStore.getState().addLog(`售出「${item.name}」，获得 ${price} 灵石。`, 'item');
    return true;
  },
}));

/** React Hook：聚合背包条目（去重 + 数量 + 分类过滤） */
export const useInventory = (filterType?: string) => {
  const inventory = usePlayerStore((s) => s.player?.inventory ?? []);

  const entries: InventoryEntry[] = inventory.reduce<InventoryEntry[]>((acc, id) => {
    const found = acc.find((e) => e.itemId === id);
    if (found) {
      found.count += 1;
    } else {
      acc.push({ itemId: id, count: 1 });
    }
    return acc;
  }, []);

  const filtered = filterType
    ? entries.filter((e) => itemsData[e.itemId]?.type === filterType)
    : entries;

  const store = useInventoryStore.getState;
  return {
    entries: filtered,
    totalCount: inventory.length,
    getItem: (id: string) => itemsData[id],
    useItem: store().useItem,
    equipItem: store().equipItem,
    unequipItem: store().unequipItem,
    buyItem: store().buyItem,
    sellItem: store().sellItem,
  };
};
