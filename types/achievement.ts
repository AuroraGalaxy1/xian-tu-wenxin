// 成就系统类型定义

export type AchievementType =
  | 'breakthrough' // 达到某境界
  | 'kill_enemy' // 击杀某敌人
  | 'collect_item' // 获得某物品
  | 'scene_visit' // 到达某场景
  | 'xiuwei' // 修为达到
  | 'quest_complete' // 完成某任务
  | 'combat_win' // 击败过 N 种敌人
  | 'visit_all' // 到访落星坡全部地点
  | 'lingShi' // 灵石达到
  | 'inventory_kind'; // 背包物品种类数

export interface AchievementReward {
  xiuwei?: number;
  lingShi?: number;
  items?: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  /** 目标（境界 id / 敌人 id / 物品 id / 任务 id / 场景 id / 数量） */
  target: string;
  /** 数量型条件的目标值 */
  amount?: number;
  reward?: AchievementReward;
}
