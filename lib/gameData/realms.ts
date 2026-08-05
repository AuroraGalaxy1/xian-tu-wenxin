// 修仙境界体系（仙侣情缘风格经典序列）
import { Realm } from '@/types/realm';

export const realmsData: Realm[] = [
  {
    id: 'fan_tai',
    name: '凡胎',
    index: 0,
    xiuweiRequired: 0,
    maxDaoxin: 100,
    maxLingyun: 50,
    breakthrough: {
      daoxinRequired: 80,
      lingyunRequired: 40,
      desc: '凡躯浊骨，竟能引动天地灵气。你只觉浑身经脉如被温水冲刷，只要道心坚定、灵蕴充盈，便可冲开第一道灵脉，踏入修行之门。',
      hasMindDemon: false,
    },
  },
  {
    id: 'kai_mai',
    name: '开脉',
    index: 1,
    xiuweiRequired: 500,
    maxDaoxin: 150,
    maxLingyun: 80,
    breakthrough: {
      daoxinRequired: 120,
      lingyunRequired: 70,
      desc: '灵脉初开，灵气在四肢百骸奔涌。道心与灵蕴需更进一步，方可筑下道基，从此脱离凡俗。',
      hasMindDemon: false,
    },
  },
  {
    id: 'zhu_ji',
    name: '筑基',
    index: 2,
    xiuweiRequired: 1500,
    maxDaoxin: 220,
    maxLingyun: 120,
    breakthrough: {
      daoxinRequired: 180,
      lingyunRequired: 110,
      desc: '筑基乃修行第一道大关。丹田中灵气凝液成海，若道心稍有不坚，便会被心魔趁虚而入，功亏一篑。',
      hasMindDemon: true,
    },
  },
  {
    id: 'jin_dan',
    name: '金丹',
    index: 3,
    xiuweiRequired: 4000,
    maxDaoxin: 300,
    maxLingyun: 180,
    breakthrough: {
      daoxinRequired: 250,
      lingyunRequired: 160,
      desc: '凝气成丹，天地灵气在丹田凝成一粒金色丹丸。此为夺天地造化之举，心魔必定来犯。',
      hasMindDemon: true,
    },
  },
  {
    id: 'yuan_ying',
    name: '元婴',
    index: 4,
    xiuweiRequired: 10000,
    maxDaoxin: 400,
    maxLingyun: 250,
    breakthrough: {
      daoxinRequired: 330,
      lingyunRequired: 220,
      desc: '金丹破碎，元婴初生。从此神游太虚，寿元大增，然劫数亦随之而来。',
      hasMindDemon: true,
    },
  },
  {
    id: 'hua_shen',
    name: '化神',
    index: 5,
    xiuweiRequired: 25000,
    maxDaoxin: 520,
    maxLingyun: 340,
    breakthrough: {
      daoxinRequired: 420,
      lingyunRequired: 300,
      desc: '元神与天地合一，一念可动风云。此境需勘破生死，执念越深，心魔越强。',
      hasMindDemon: true,
    },
  },
  {
    id: 'he_ti',
    name: '合体',
    index: 6,
    xiuweiRequired: 60000,
    maxDaoxin: 650,
    maxLingyun: 450,
    breakthrough: {
      daoxinRequired: 520,
      lingyunRequired: 400,
      desc: '元神与肉身彻底相融，举手投足皆是道韵。此境之上，因果渐重。',
      hasMindDemon: true,
    },
  },
  {
    id: 'da_cheng',
    name: '大乘',
    index: 7,
    xiuweiRequired: 140000,
    maxDaoxin: 800,
    maxLingyun: 580,
    breakthrough: {
      daoxinRequired: 640,
      lingyunRequired: 520,
      desc: '道行圆满，只差最后一步。大乘修士抬手间山河变色，然天劫已在头顶酝酿。',
      hasMindDemon: true,
    },
  },
  {
    id: 'du_jie',
    name: '渡劫',
    index: 8,
    xiuweiRequired: 300000,
    maxDaoxin: 1000,
    maxLingyun: 750,
    breakthrough: {
      daoxinRequired: 780,
      lingyunRequired: 660,
      desc: '九重天雷即将落下。渡得过，便是仙；渡不过，灰飞烟灭。心魔与天劫同至，此为最后一关。',
      hasMindDemon: true,
    },
  },
  {
    id: 'fei_sheng',
    name: '飞升',
    index: 9,
    xiuweiRequired: 600000,
    maxDaoxin: 1500,
    maxLingyun: 1000,
    breakthrough: {
      daoxinRequired: 1000,
      lingyunRequired: 850,
      desc: '仙门已开，举霞飞升。历经九劫九难，终得正果。至此，凡尘种种皆为过往。',
      hasMindDemon: true,
    },
  },
];

/** 根据境界名获取境界信息 */
export const getRealm = (name: string): Realm | undefined =>
  realmsData.find((r) => r.name === name || r.id === name);

/** 获取当前境界在序列中的序号 */
export const getRealmIndex = (name: string): number =>
  realmsData.findIndex((r) => r.name === name || r.id === name);

/** 获取下一境界 */
export const getNextRealm = (currentIndex: number): Realm | null =>
  realmsData[currentIndex + 1] ?? null;
