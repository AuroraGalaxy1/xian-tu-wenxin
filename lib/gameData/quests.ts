// 任务数据（主线引导 + 支线）
import { Quest } from '@/types/quest';

export const questsData: Record<string, Quest> = {
  /* ===== 主线 ===== */
  q1: {
    id: 'q1',
    name: '残玉指引',
    type: 'main',
    description: '须白老道说，你眉心发烫是残玉认主之兆，东南方向似有机缘。循着玉简碎片的指引，前往「灵脉交汇之眼」。',
    objectives: [
      { type: 'scene_visit', target: 'shan_gu', desc: '抵达灵脉交汇之眼' },
    ],
    rewards: { xiuwei: 50, lingShi: 20 },
  },
  q2: {
    id: 'q2',
    name: '灵脉初探',
    type: 'main',
    description: '山谷灵气浓郁，附近青木岭更是灵草遍地，但也妖兽横行。前往青木岭一探。',
    objectives: [
      { type: 'scene_visit', target: 'qing_mu_ling', desc: '抵达青木岭' },
    ],
    rewards: { xiuwei: 60, items: [{ itemId: 'liao_shang_dan', count: 2 }] },
  },
  q3: {
    id: 'q3',
    name: '溪风镇',
    type: 'main',
    description: '顺着山路向东，有一座溪风镇，是落星坡修士聚集之所。前去打探消息、补充补给。',
    objectives: [
      { type: 'scene_visit', target: 'xi_feng_zhen', desc: '抵达溪风镇' },
    ],
    rewards: { xiuwei: 80, lingShi: 50 },
  },
  q4: {
    id: 'q4',
    name: '筑就道基',
    type: 'main',
    description: '林清修提醒你，断魂崖的黑风妖肆虐多年。要除妖，需先突破至筑基境界。',
    objectives: [
      { type: 'realm', target: 'zhu_ji', desc: '突破至筑基境界' },
    ],
    rewards: { xiuwei: 100, items: [{ itemId: 'ju_qi_dan', count: 3 }] },
  },
  q5: {
    id: 'q5',
    name: '斩妖除魔',
    type: 'main',
    description: '断魂崖的黑风妖是落星坡一大祸害。突破筑基后，前往断魂崖将其斩杀，为民除害。',
    objectives: [
      { type: 'kill_enemy', target: 'hei_feng_yao', desc: '斩杀黑风妖' },
    ],
    rewards: { xiuwei: 300, lingShi: 200, items: [{ itemId: 'tie_jian', count: 1 }] },
  },

  /* ===== 支线 ===== */
  s1: {
    id: 's1',
    name: '猎取皮革',
    type: 'side',
    description: '溪风镇的皮匠需要妖兽皮革。猎杀青木岭的妖兽，收集一份妖兽皮革交予皮匠。',
    objectives: [
      { type: 'collect_item', target: 'yao_shou_ge', amount: 1, desc: '收集妖兽皮革 ×1' },
    ],
    rewards: { xiuwei: 50, lingShi: 60 },
  },
  s2: {
    id: 's2',
    name: '修为精进',
    type: 'side',
    description: '潜心修炼，将修为提升至 300 点，印证修行之道。',
    objectives: [
      { type: 'xiuwei', target: '300', amount: 300, desc: '修为达到 300' },
    ],
    rewards: { xiuwei: 40, items: [{ itemId: 'ju_ling_dan', count: 1 }] },
  },
};
