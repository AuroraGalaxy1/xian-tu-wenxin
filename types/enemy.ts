// 敌人（妖兽/对手）类型定义

export interface EnemySkill {
  id: string;
  name: string;
  /** 伤害系数（乘敌人攻击） */
  power: number;
  desc: string;
}

export interface DropEntry {
  itemId: string;
  /** 掉落概率 0~1 */
  rate: number;
  min?: number;
  max?: number;
}

export interface Enemy {
  id: string;
  name: string;
  realm: string; // 对应境界名（仅展示）
  description: string;
  hp: number;
  atk: number;
  def: number;
  skills: EnemySkill[];
  /** 击杀获得的修为 */
  xiuweiReward: number;
  /** 掉落表 */
  drops: DropEntry[];
  /** 出现场景 */
  sceneId: string;
}
