export interface Player {
  id: string;
  name: string;
  realm: string;           // 境界
  realmStage: string;      // 悟/破/立
  stats: {
    daoxin: number;        // 道心
    maxDaoxin: number;
    lingyun: number;       // 灵蕴
    maxLingyun: number;
    tipo: number;          // 体魄
    shenshi: number;       // 神识
    yinguo: number;        // 因果 (-100 ~ +100)
    zhinian: number;       // 执念 (0 ~ 100)
    xiuwei: number;        // 修为
  };
  hp: number;              // 当前气血
  maxHp: number;           // 气血上限
  lingShi: number;         // 灵石（货币）
  currentScene: string;    // 当前场景ID
  inventory: string[];     // 物品ID列表
  skills: string[];        // 技能/功法ID列表
  quests: {
    id: string;
    status: 'pending' | 'active' | 'completed' | 'locked';
  }[];
  relationships: {
    [npcId: string]: number; // 好感度
  };
  equipment: {             // 已装备法宝
    weapon?: string;
    armor?: string;
    accessory?: string;
  };
  /** 已访问过的场景 */
  visitedScenes: string[];
  /** 已击杀的敌人 */
  killedEnemies: string[];
}

export type QuestEntryStatus = Player['quests'][0]['status'];
