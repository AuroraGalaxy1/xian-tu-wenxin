// 敌人（妖兽）数据
import { Enemy } from '@/types/enemy';

export const enemiesData: Record<string, Enemy> = {
  shan_hu: {
    id: 'shan_hu',
    name: '月影灵狐',
    realm: '凡胎',
    description: '一只通体雪白的灵狐，双目含魅，身形极快。它盘踞在灵脉交汇处，警惕地打量着你。',
    hp: 45,
    atk: 9,
    def: 4,
    skills: [
      { id: 'claw', name: '利爪', power: 1, desc: '挥爪扑击' },
      { id: 'dodge', name: '灵巧闪避', power: 0.4, desc: '灵动的一击' },
    ],
    xiuweiReward: 30,
    drops: [
      { itemId: 'ling_cao', rate: 0.6 },
      { itemId: 'ju_qi_dan', rate: 0.2 },
    ],
    sceneId: 'shan_gu',
  },

  ye_zhu: {
    id: 'ye_zhu',
    name: '黑鬃野猪',
    realm: '开脉',
    description: '一头皮糙肉厚的黑鬃野猪，獠牙如刃，在林间横冲直撞，见到生人便红着眼冲来。',
    hp: 55,
    atk: 10,
    def: 7,
    skills: [
      { id: 'ram', name: '冲撞', power: 1.1, desc: '蓄力冲撞' },
      { id: 'tusk', name: '獠牙突刺', power: 1.4, desc: '致命的突刺' },
    ],
    xiuweiReward: 35,
    drops: [
      { itemId: 'yao_shou_ge', rate: 0.5 },
      { itemId: 'qing_mu_ling_cai', rate: 0.3 },
    ],
    sceneId: 'qing_mu_ling',
  },

  shan_yao_lang: {
    id: 'shan_yao_lang',
    name: '山妖狼',
    realm: '开脉',
    description: '一只独眼的山妖狼，皮毛灰黑，眼中泛着幽绿的光。它是青木岭一带最凶悍的猎手。',
    hp: 60,
    atk: 12,
    def: 5,
    skills: [
      { id: 'bite', name: '撕咬', power: 1.2, desc: '利齿撕咬' },
      { id: 'howl', name: '狼嚎', power: 0.9, desc: '震魂狼嚎' },
    ],
    xiuweiReward: 40,
    drops: [
      { itemId: 'yao_shou_ge', rate: 0.6 },
      { itemId: 'ling_cao', rate: 0.4 },
    ],
    sceneId: 'qing_mu_ling',
  },

  gui_ying: {
    id: 'gui_ying',
    name: '鬼影蝠',
    realm: '筑基',
    description: '断魂崖下成群结队的鬼影蝠，翼展如墨，叫声凄厉，专食活人精血。',
    hp: 80,
    atk: 16,
    def: 8,
    skills: [
      { id: 'sonic', name: '音波穿刺', power: 1.3, desc: '尖锐音波' },
      { id: 'suck', name: '吸血', power: 0.8, desc: '汲取精血' },
    ],
    xiuweiReward: 80,
    drops: [
      { itemId: 'yao_he', rate: 0.3 },
      { itemId: 'ling_cao', rate: 0.4 },
    ],
    sceneId: 'duan_hun_ya',
  },

  hei_feng_yao: {
    id: 'hei_feng_yao',
    name: '黑风妖',
    realm: '筑基·巅峰',
    description: '断魂崖的霸主，一头三丈高的黑风妖，周身缠绕着肉眼可见的黑色妖气。它镇守此地已逾百年，败尽无数来犯修士。',
    hp: 200,
    atk: 24,
    def: 12,
    skills: [
      { id: 'feng_dun', name: '黑风遁', power: 1.4, desc: '裹挟黑风冲撞' },
      { id: 'yao_zhua', name: '妖爪裂空', power: 1.8, desc: '撕裂空气的妖爪' },
      { id: 'yao_qi', name: '妖气侵蚀', power: 1.1, desc: '妖气腐蚀护体灵气' },
    ],
    xiuweiReward: 200,
    drops: [
      { itemId: 'yao_he', rate: 0.8 },
      { itemId: 'ju_qi_dan', rate: 0.5 },
      { itemId: 'yu_pei', rate: 0.2 },
    ],
    sceneId: 'duan_hun_ya',
  },

  /* ===== 百草园 ===== */
  yao_ling: {
    id: 'yao_ling',
    name: '药灵',
    realm: '凡胎',
    description: '一株成了精的灵药，化作巴掌大的翠绿小人，在药田间蹦跳。它守护着百年灵药，靠近者皆被藤蔓缠住。',
    hp: 40,
    atk: 8,
    def: 3,
    skills: [
      { id: 'vine', name: '藤蔓缠绕', power: 1, desc: '以藤蔓抽打' },
      { id: 'spore', name: '药尘迷眼', power: 0.7, desc: '洒出迷魂药尘' },
    ],
    xiuweiReward: 25,
    drops: [
      { itemId: 'ling_cao', rate: 0.6 },
      { itemId: 'bai_cao_zhi', rate: 0.25 },
    ],
    sceneId: 'bai_cao_yuan',
  },

  /* ===== 坊市外围 ===== */
  jie_xiu: {
    id: 'jie_xiu',
    name: '劫修',
    realm: '开脉',
    description: '一个在坊市外围打劫落单散修的家伙，眼神阴鸷，手里攥着把染血的短刀。',
    hp: 50,
    atk: 12,
    def: 4,
    skills: [
      { id: 'stab', name: '暗刀', power: 1.3, desc: '阴险的暗刀' },
      { id: 'snatch', name: '夺宝', power: 0.9, desc: '趁乱夺物' },
    ],
    xiuweiReward: 45,
    drops: [
      { itemId: 'heiyu', rate: 0.4 },
      { itemId: 'ju_qi_dan', rate: 0.3 },
      { itemId: 'ling_cao', rate: 0.3 },
    ],
    sceneId: 'fang_shi',
  },

  /* ===== 青阳宗分坛 ===== */
  shi_lian_kui_lei: {
    id: 'shi_lian_kui_lei',
    name: '试炼傀儡',
    realm: '筑基',
    description: '青阳宗以玄铁与灵石铸成的护坛傀儡，力大无穷，不知疲倦。弟子入门，皆需在它手下走过三招。',
    hp: 90,
    atk: 18,
    def: 10,
    skills: [
      { id: 'iron_fist', name: '铁拳', power: 1.2, desc: '势大力沉的铁拳' },
      { id: 'crush', name: '碾碎', power: 1.6, desc: '以整身碾压' },
    ],
    xiuweiReward: 90,
    drops: [
      { itemId: 'qing_mu_ling_cai', rate: 0.5 },
      { itemId: 'qing_yang_jian', rate: 0.1 },
    ],
    sceneId: 'qing_yang_fen_tan',
  },

  /* ===== 废宅 ===== */
  yuan_ling: {
    id: 'yuan_ling',
    name: '怨灵',
    realm: '筑基',
    description: '废宅中盘踞的怨灵，曾是那位陨落修士未散的执念所化。幽蓝鬼火中，它发出呜咽般的低语，摄人心魄。',
    hp: 70,
    atk: 15,
    def: 6,
    skills: [
      { id: 'haunt', name: '鬼影缠绕', power: 1.2, desc: '鬼影缠身' },
      { id: 'wail', name: '夺魂哀嚎', power: 1.5, desc: '摄魂的哀嚎' },
    ],
    xiuweiReward: 75,
    drops: [
      { itemId: 'heiyu', rate: 0.5 },
      { itemId: 'yao_he', rate: 0.3 },
    ],
    sceneId: 'fei_zhai',
  },
};

/** 获取场景中的随机敌人（未指定则返回 undefined） */
export const getEnemy = (enemyId: string): Enemy | undefined => enemiesData[enemyId];

/** 获取某场景可能遭遇的敌人列表 */
export const getEnemiesByScene = (sceneId: string): Enemy[] =>
  Object.values(enemiesData).filter((e) => e.sceneId === sceneId);
