// NPC 类型定义

export interface NpcShopItem {
  itemId: string;
  price: number;
}

export interface Npc {
  id: string;
  name: string;
  /** 身份/称号 */
  title: string;
  realm: string;
  /** 所在场景 */
  sceneId: string;
  /** 对话轮次（轮流展示） */
  dialogue: string[];
  /** 商店出售列表 */
  shop?: NpcShopItem[];
  /** 提供的任务 ID */
  questId?: string;
}
