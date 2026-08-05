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

export interface SceneAction {
  id: string;
  label: string;
  icon: string;            // Lucide图标名
  description: string;
  action: () => void;      // 或使用事件系统
  condition?: () => boolean;
  type?: 'normal' | 'danger' | 'special' | 'new';
}

export interface SceneExit {
  sceneId: string;
  direction: string;
  label: string;
  isLocked: boolean;
  condition?: () => boolean;
}