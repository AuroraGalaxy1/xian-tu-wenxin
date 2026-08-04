// 物品系统类型定义

/** 物品大类 */
export type ItemType = 'dan' | 'cailiao' | 'fabao' | 'gongfa' | 'za_wu';

/** 稀有度：凡 / 灵 / 玄 / 宝 / 仙 */
export type ItemRarity = 'fan' | 'ling' | 'xuan' | 'bao' | 'xian';

/** 使用效果类型 */
export type ItemEffectType =
  | 'restore_hp' // 恢复气血
  | 'gain_xiuwei' // 增加修为
  | 'gain_daoxin' // 增加道心
  | 'gain_lingyun' // 增加灵蕴
  | 'gain_tipo' // 增加体魄
  | 'atk_buff' // 攻击增益
  | 'def_buff' // 防御增益
  | 'none';

export interface ItemEffect {
  type: ItemEffectType;
  value: number;
  desc?: string; // 效果文字描述（如 "恢复气血 50 点"）
}

/** 装备槽位 */
export type EquipSlot = 'weapon' | 'armor' | 'accessory';

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  description: string;
  /** 使用效果（丹药/功法） */
  effect?: ItemEffect;
  /** 购买价格（灵石） */
  price: number;
  /** 出售价格，缺省为 price 的一半 */
  sellPrice?: number;
  /** 是否可堆叠 */
  stackable: boolean;
  /** 装备槽位（法宝类） */
  equipSlot?: EquipSlot;
  /** 装备攻击加成 */
  atkBonus?: number;
  /** 装备防御加成 */
  defBonus?: number;
}

/** 背包条目（含数量与装备标记） */
export interface InventoryEntry {
  itemId: string;
  count: number;
  equipped?: boolean;
}

/** 稀有度显示元信息 */
export const RARITY_META: Record<ItemRarity, { label: string; color: string }> = {
  fan: { label: '凡品', color: 'text-[#8B7A5E]' },
  ling: { label: '灵品', color: 'text-[#4EC9C9]' },
  xuan: { label: '玄品', color: 'text-[#9B6EC9]' },
  bao: { label: '宝品', color: 'text-[#C9A04E]' },
  xian: { label: '仙品', color: 'text-[#E86A6A]' },
};

/** 物品大类显示名 */
export const ITEM_TYPE_LABEL: Record<ItemType, string> = {
  dan: '丹药',
  cailiao: '材料',
  fabao: '法宝',
  gongfa: '功法',
  za_wu: '杂物',
};
