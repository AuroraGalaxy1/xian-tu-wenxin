// 任务系统类型定义

export type QuestStatus = 'locked' | 'pending' | 'active' | 'completed';
export type QuestType = 'main' | 'side';

export interface QuestObjective {
  type: 'scene_visit' | 'realm' | 'kill_enemy' | 'collect_item' | 'xiuwei';
  target: string;
  amount?: number;
  /** 当前进度（运行时更新，不持久化到数据文件） */
  progress?: number;
  /** 目标描述文字 */
  desc: string;
}

export interface QuestReward {
  xiuwei?: number;
  lingShi?: number;
  items?: { itemId: string; count: number }[];
}

export interface Quest {
  id: string;
  name: string;
  type: QuestType;
  description: string;
  objectives: QuestObjective[];
  rewards: QuestReward;
}
