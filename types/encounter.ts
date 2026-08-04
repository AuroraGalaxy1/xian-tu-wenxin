// 奇遇事件类型定义

export type EncounterResultType =
  | 'xiuwei' // 增加修为
  | 'daoxin' // 增加道心
  | 'lingyun' // 增加灵蕴
  | 'item' // 获得物品
  | 'lingShi' // 获得灵石
  | 'heal' // 恢复气血
  | 'unlock' // 解锁地点
  | 'combat'; // 触发战斗

export interface EncounterResult {
  type: EncounterResultType;
  amount?: number;
  itemId?: string;
  locationId?: string;
  enemyId?: string;
}

export interface Encounter {
  id: string;
  title: string;
  text: string;
  result: EncounterResult;
}
