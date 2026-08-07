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
    name: '凝液化府',
    type: 'main',
    description: '林清修提醒你，断魂崖的黑风妖肆虐多年。要除妖，需先凝液化府，突破至凝液境界。',
    objectives: [
      { type: 'realm', target: 'ning_ye', desc: '突破至凝液境界' },
    ],
    rewards: { xiuwei: 100, items: [{ itemId: 'ju_qi_dan', count: 3 }] },
  },
  q5: {
    id: 'q5',
    name: '斩妖除魔',
    type: 'main',
    description: '断魂崖的黑风妖是落星坡一大祸害。凝液化府后，前往断魂崖将其斩杀，为民除害。',
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
  s3: {
    id: 's3',
    name: '百草园采药',
    type: 'side',
    description: '药农老周请你采一株百年灵药，说园子深处的那株药灵一直守着它。',
    objectives: [
      { type: 'collect_item', target: 'bai_cao_zhi', amount: 1, desc: '收集百年灵药 ×1' },
    ],
    rewards: { xiuwei: 80, lingShi: 50 },
  },
  s4: {
    id: 's4',
    name: '坊市寻玉',
    type: 'side',
    description: '吴掌柜托你寻一块黑玉，说是坊市近来走俏的稀罕物。',
    objectives: [
      { type: 'collect_item', target: 'heiyu', amount: 1, desc: '收集黑玉 ×1' },
    ],
    rewards: { xiuwei: 60, lingShi: 70 },
  },
  s5: {
    id: 's5',
    name: '青阳宗试炼',
    type: 'side',
    description: '接引弟子柳青说，击败护坛傀儡便有资格与青阳宗做交易。',
    objectives: [
      { type: 'kill_enemy', target: 'shi_lian_kui_lei', desc: '击败试炼傀儡' },
    ],
    rewards: { xiuwei: 120, lingShi: 100 },
  },
  s6: {
    id: 's6',
    name: '废宅探秘',
    type: 'side',
    description: '传闻落星坡陨落修士的旧居藏着不为人知的秘密。前往废宅一探。',
    objectives: [
      { type: 'scene_visit', target: 'fei_zhai', desc: '抵达废宅' },
    ],
    rewards: { xiuwei: 90, lingShi: 40 },
  },
  s7: {
    id: 's7',
    name: '除怨安魂',
    type: 'side',
    description: '说书人叹道，废宅的怨灵是那位陨落修士未散的执念。替他除去怨灵，还亡者一个安宁。',
    objectives: [
      { type: 'kill_enemy', target: 'yuan_ling', desc: '击败废宅怨灵' },
    ],
    rewards: {
      xiuwei: 150,
      lingShi: 120,
      items: [{ itemId: 'bai_cao_ji', count: 1 }],
    },
  },
};
