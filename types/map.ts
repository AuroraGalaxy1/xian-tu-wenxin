// 地图类型定义

export type MapLocationType = 'scene' | 'town' | 'danger' | 'resource' | 'secret';

export interface MapLocation {
  id: string;
  name: string;
  x: number;
  y: number;
  region: string;
  isUnlocked: boolean;
  isExplored: boolean;
  type: MapLocationType;
}
