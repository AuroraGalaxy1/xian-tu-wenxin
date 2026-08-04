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
      '“说起来，老夫年轻时也在青阳宗当过外门丹师——那是些陈年旧事了。”',
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
      '“俺听人说，那黑风妖是吸收了古星残力才成精的——难怪这么难缠。”',
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

  /* ===== 百草园 ===== */
  yao_nong: {
    id: 'yao_nong',
    name: '药农老周',
    title: '百草园园丁',
    realm: '凡胎',
    sceneId: 'bai_cao_yuan',
    dialogue: [
      '“这片园子是苍梧药老的产业，老夫替他照看。你若要采药，别动那些成了精的百年灵药。”',
      '“药灵这玩意儿，说难缠也难缠，说不难缠……它要是喜欢你，还会赠你一株灵药呢。”',
    ],
    questId: 's3',
  },

  /* ===== 溪风坊市 ===== */
  fang_shi_shang_ren: {
    id: 'fang_shi_shang_ren',
    name: '吴掌柜',
    title: '坊市商人',
    realm: '开脉',
    sceneId: 'fang_shi',
    dialogue: [
      '“客官，看看货？俺这儿的东西，虽不敢说有多稀罕，但童叟无欺。”',
      '“你要找什么稀罕物，跟俺说一声。坊市这地方，路子广着呢。”',
    ],
    shop: [
      { itemId: 'hui_ling_dan', price: 60 },
      { itemId: 'zhu_ji_dan', price: 200 },
      { itemId: 'bai_cao_ji', price: 250 },
      { itemId: 'qing_yang_jian', price: 300 },
      { itemId: 'heiyu', price: 35 },
    ],
    questId: 's4',
  },
  shuo_shu_ren: {
    id: 'shuo_shu_ren',
    name: '说书人',
    title: '坊市说书人',
    realm: '凡胎',
    sceneId: 'fang_shi',
    dialogue: [
      '“列位看官，今儿个咱们讲一讲这落星坡的来历——话说上古年间，一颗古星自天外坠落……”',
      '“古星陨落之地，便是如今的落星坡。那星骸之力渗入地脉，灵气时浓时淡，妖兽也格外凶悍。”',
      '“再讲那青阳宗，山门外的剑修大宗，规矩森严，收徒极严。分坛的弟子，个个都傲气得很。”',
      '“末道纪元啊，灵气一年比一年稀薄。老夫说书半辈子，亲眼见着天上的月亮，红过一次……”',
    ],
    questId: 's7',
  },

  /* ===== 青阳宗分坛 ===== */
  jie_yin_di_zi: {
    id: 'jie_yin_di_zi',
    name: '柳青',
    title: '青阳宗接引弟子',
    realm: '筑基',
    sceneId: 'qing_yang_fen_tan',
    dialogue: [
      '“此乃青阳宗分坛。道友若无要事，请勿擅入。”',
      '“我宗以剑道立派，除妖卫道乃分内之事。你若想入宗，先过护坛傀儡一试。”',
      '“落星坡的秘境入口，我宗已设禁制多年。非金丹境，进去只是送死。”',
    ],
    questId: 's5',
  },
};
