// 见闻录（Lore）类型定义

export type LoreCategory =
  | 'world' // 世界
  | 'region' // 地域
  | 'faction' // 势力
  | 'figure' // 人物志
  | 'artifact' // 器物
  | 'secret'; // 秘闻

export interface LoreEntry {
  id: string;
  category: LoreCategory;
  title: string;
  content: string;
  /** 未解锁时展示的线索提示 */
  unlockHint: string;
}

export const LORE_CATEGORY_LABEL: Record<LoreCategory, string> = {
  world: '世界',
  region: '地域',
  faction: '势力',
  figure: '人物志',
  artifact: '器物',
  secret: '秘闻',
};

export const LORE_CATEGORY_ORDER: LoreCategory[] = [
  'world',
  'region',
  'faction',
  'figure',
  'artifact',
  'secret',
];
