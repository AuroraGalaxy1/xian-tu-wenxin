// NPC 数据
import { Npc } from '@/types/npc';

export const npcsData: Record<string, Npc> = {
  /* ===== 破败山神庙 ===== */
  xu_bai_lao: {
    id: 'xu_bai_lao',
    name: '须白老道',
    title: '神秘老者',
    realm: '？？？',
    sceneId: 'po_miao',
    dialogue: [
      '“小友，你醒了。老夫在此守了这庙百年，总算等到一个有缘人。”',
      '“眉心发烫，是残玉认主之兆。此物指向东南灵脉交汇之处，你且往那去寻一番机缘。”',
      '“凡俗之人逆天修行，前路艰险。若道心不坚，莫要强求。”',
    ],
    questId: 'q1',
  },

  /* ===== 溪风镇 ===== */
  lao_yao_shi: {
    id: 'lao_yao_shi',
    name: '苍梧药老',
    title: '丹药铺掌柜',
    realm: '筑基',
    sceneId: 'xi_feng_zhen',
    dialogue: [
      '“客官，要买些丹药么？溪风镇方圆百里，就数老夫这里的丹药最齐全。”',
      '“修炼一途，丹药为辅。切记不可贪多，根基方是根本。”',
    ],
    shop: [
      { itemId: 'liao_shang_dan', price: 30 },
      { itemId: 'ju_qi_dan', price: 40 },
      { itemId: 'ning_shen_dan', price: 50 },
      { itemId: 'ju_ling_dan', price: 70 },
      { itemId: 'duan_ti_dan', price: 80 },
    ],
  },
  tie_jiang: {
    id: 'tie_jiang',
    name: '墨铁匠',
    title: '铁匠铺掌柜',
    realm: '开脉',
    sceneId: 'xi_feng_zhen',
    dialogue: [
      '“买兵刃么？俺这儿的家伙什，都是真材实料。玄铁剑、兽皮甲，砍妖兽一砍一个准。”',
      '“哼，断魂崖那只黑风妖又伤了俺两个徒弟。谁要能除了它，俺免费给他打件好兵器。”',
    ],
    shop: [
      { itemId: 'tie_jian', price: 150 },
      { itemId: 'bu_yi', price: 60 },
      { itemId: 'hu_jia', price: 120 },
      { itemId: 'yu_pei', price: 100 },
    ],
  },
  lin_xiu_shi: {
    id: 'lin_xiu_shi',
    name: '林清修',
    title: '散修',
    realm: '开脉',
    sceneId: 'xi_feng_zhen',
    dialogue: [
      '“这位道友有礼了。我观你根基尚浅，却已能走到溪风镇，实属不易。”',
      '“断魂崖的黑风妖肆虐多年，镇上悬赏已久。你若能筑得道基，倒可去一试。”',
    ],
    questId: 'q4',
  },

  /* ===== 青木岭 ===== */
  cai_yao_ren: {
    id: 'cai_yao_ren',
    name: '采药老人',
    title: '采药人',
    realm: '凡胎',
    sceneId: 'qing_mu_ling',
    dialogue: [
      '“小娃娃，这青木岭可不好走。林子里有野猪，还有一头独眼山妖狼。”',
      '“你要采药就往深处走，但切记日落前离开。天黑之后，那是妖兽的天下。”',
    ],
  },
};
