// 仙侠境界体系（内景次第·十二境，由内而外、凡人体道）
import { Realm } from '@/types/realm';

export const realmsData: Realm[] = [
  {
    id: 'gan_qi',
    name: '感气',
    index: 0,
    xiuweiRequired: 0,
    maxDaoxin: 100,
    maxLingyun: 50,
    breakthrough: {
      daoxinRequired: 80,
      lingyunRequired: 40,
      desc: '凡躯浊骨，一夜之间竟能引动天地灵气。你只觉浑身经脉如被温水冲刷，窍穴微痒——原来这世间的一切，都藏着气。只要道心坚定、灵蕴充盈，便可冲开第一道灵脉，踏入修行之门。',
      hasMindDemon: false,
    },
  },
  {
    id: 'tong_mai',
    name: '通脉',
    index: 1,
    xiuweiRequired: 600,
    maxDaoxin: 140,
    maxLingyun: 80,
    breakthrough: {
      daoxinRequired: 115,
      lingyunRequired: 70,
      desc: '浊气渐散，灵脉如溪流般在体内贯通。气血随脉而行，周而复始。道心与灵蕴需更进一步，方可凝精化液，溯流而上。',
      hasMindDemon: false,
    },
  },
  {
    id: 'ning_ye',
    name: '凝液',
    index: 2,
    xiuweiRequired: 2000,
    maxDaoxin: 200,
    maxLingyun: 110,
    breakthrough: {
      daoxinRequired: 165,
      lingyunRequired: 100,
      desc: '凝液乃修行第一道大关。精髓化液，丹田自行涌动，如潮起潮落。若道心稍有不坚，便会被心魔趁虚而入，功亏一篑。',
      hasMindDemon: true,
    },
  },
  {
    id: 'yu_fu',
    name: '玉府',
    index: 3,
    xiuweiRequired: 5000,
    maxDaoxin: 280,
    maxLingyun: 150,
    breakthrough: {
      daoxinRequired: 225,
      lingyunRequired: 135,
      desc: '内景初开，丹田化作一方玉府，温润剔透，自成天地。此为夺天地造化之举，心魔必定来犯。',
      hasMindDemon: true,
    },
  },
  {
    id: 'ying_tai',
    name: '婴胎',
    index: 4,
    xiuweiRequired: 12000,
    maxDaoxin: 370,
    maxLingyun: 200,
    breakthrough: {
      daoxinRequired: 300,
      lingyunRequired: 180,
      desc: '玉府育灵，一团元和之气在府中蕴养胎形。从此神游有依，寿元大增，然劫数亦随之而来。',
      hasMindDemon: true,
    },
  },
  {
    id: 'shen_you',
    name: '神游',
    index: 5,
    xiuweiRequired: 28000,
    maxDaoxin: 480,
    maxLingyun: 260,
    breakthrough: {
      daoxinRequired: 390,
      lingyunRequired: 235,
      desc: '婴胎脱壳，元神出窍，可神游太虚。一念可动风云，此境需勘破生死，执念越深，心魔越强。',
      hasMindDemon: true,
    },
  },
  {
    id: 'lian_shen',
    name: '炼神',
    index: 6,
    xiuweiRequired: 60000,
    maxDaoxin: 620,
    maxLingyun: 340,
    breakthrough: {
      daoxinRequired: 500,
      lingyunRequired: 305,
      desc: '凝神返虚，神与气合，念动而山川应和。举手投足皆是道韵，此境之上，因果渐重。',
      hasMindDemon: true,
    },
  },
  {
    id: 'kai_jie',
    name: '开界',
    index: 7,
    xiuweiRequired: 130000,
    maxDaoxin: 780,
    maxLingyun: 440,
    breakthrough: {
      daoxinRequired: 630,
      lingyunRequired: 395,
      desc: '紫府延展，自成一方洞天。抬手间山河变色，然天劫已在头顶酝酿。',
      hasMindDemon: true,
    },
  },
  {
    id: 'he_dao',
    name: '合道',
    index: 8,
    xiuweiRequired: 260000,
    maxDaoxin: 960,
    maxLingyun: 560,
    breakthrough: {
      daoxinRequired: 780,
      lingyunRequired: 505,
      desc: '神魂融融，道我相合。此境已近大道之巅，再进一步，便是以身为炉、与天争锋的关头。',
      hasMindDemon: true,
    },
  },
  {
    id: 'li_jie',
    name: '历劫',
    index: 9,
    xiuweiRequired: 450000,
    maxDaoxin: 1150,
    maxLingyun: 700,
    breakthrough: {
      daoxinRequired: 950,
      lingyunRequired: 630,
      desc: '九重天雷即将落下。渡得过，便是超脱；渡不过，灰飞烟灭。心魔与天劫同至，此为最后一关。',
      hasMindDemon: true,
    },
  },
  {
    id: 'wang_ji',
    name: '忘机',
    index: 10,
    xiuweiRequired: 650000,
    maxDaoxin: 1350,
    maxLingyun: 860,
    breakthrough: {
      daoxinRequired: 1100,
      lingyunRequired: 770,
      desc: '道我两忘，漏尽无碍。历经万劫，此身已与道同流，万事不萦于心，只余最后一步。',
      hasMindDemon: true,
    },
  },
  {
    id: 'chao_tuo',
    name: '超脱',
    index: 11,
    xiuweiRequired: 800000,
    maxDaoxin: 1500,
    maxLingyun: 1000,
    breakthrough: {
      daoxinRequired: 1200,
      lingyunRequired: 900,
      desc: '仙门已开，超脱凡尘。历经九劫九难，终得正果。至此，凡尘种种皆为过往，方证仙道圆满。',
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