// 修仙境界体系类型定义

export interface Realm {
  id: string; // 'fan_tai' | 'kai_mai' | ...
  name: string; // 凡胎
  index: number; // 0 起始的序号
  /** 突破到该境界所需的累计修为 */
  xiuweiRequired: number;
  /** 该境界的道心上限 */
  maxDaoxin: number;
  /** 该境界的灵蕴上限 */
  maxLingyun: number;
  /** 突破条件 */
  breakthrough: {
    daoxinRequired: number;
    lingyunRequired: number;
    desc: string; // 突破场景描述
    /** 是否触发心魔战 */
    hasMindDemon?: boolean;
  };
}
