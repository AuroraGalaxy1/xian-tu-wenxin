export interface Scene {
  id: string;
  name: string;
  description: string;
  location: {
    region: string;        // 区域名（如"落星坡"）
    x: number;             // 地图坐标X
    y: number;             // 地图坐标Y
  };
  atmosphere: {
    lingqi: '稀薄' | '普通' | '充裕' | '浓郁' | '暴走';
    danger: '低' | '中' | '高' | '极危';
    time: string;          // 游戏内时间
  };
  actions: SceneAction[];
  exits: SceneExit[];
  npcs: string[];          // NPC ID列表
  items: string[];         // 可拾取物品ID列表
  isUnlocked: boolean;
  isExplored: boolean;
}

export type SceneActionType =
  | 'explore'
  | 'meditate'
  | 'combat'
  | 'talk'
  | 'shop'
  | 'rest'
  | 'gather'
  | 'backpack'
  | 'leave'
  | 'info'
  | 'normal'
  | 'danger'
  | 'special'
  | 'new';

export interface SceneActionPayload {
  npcId?: string;
  enemyId?: string;
  itemId?: string;
}

export interface SceneAction {
  id: string;
  label: string;
  icon: string;            // Lucide图标名
  description: string;
  action: () => void;      // 或使用事件系统
  condition?: () => boolean;
  type?: SceneActionType;
  payload?: SceneActionPayload;
}

export interface SceneExit {
  sceneId: string;
  direction: string;
  label: string;
  isLocked: boolean;
  condition?: () => boolean;
}

/* ================= 心性抉择 ================= */

/** 抉择可影响的属性 */
export type ChoiceStatKey =
  | 'daoxin'
  | 'lingyun'
  | 'tipo'
  | 'shenshi'
  | 'yinguo'
  | 'zhinian'
  | 'xiuwei';

/** 心性抉择选项 */
export interface ChoiceOption {
  label: string;            // 选项文案
  description: string;      // 选项说明（展示给玩家）
  effects: Partial<Record<ChoiceStatKey, number>>; // 属性增减
  logMessage?: string;      // 选择后的日志
}

/** 心性抉择事件 */
export interface ChoiceEvent {
  id: string;
  title: string;
  description: string;
  options: ChoiceOption[];
}