// 见闻录（Lore）数据 —— 世界观背景承载
import { LoreEntry } from '@/types/lore';

export const loreData: Record<string, LoreEntry> = {
  /* ================= 世界 ================= */
  world_jiu_zhou: {
    id: 'world_jiu_zhou',
    category: 'world',
    title: '九洲',
    content:
      '此方天地广袤无垠，共分九块大洲，以灵脉相连，故称「九洲」。九洲之上，宗门林立，凡人仰仙，仙亦向天。相传在九洲之外更有遗落之境，只是无人得见。',
    unlockHint: '传闻，此方天地本有九洲。',
  },
  world_mo_dao: {
    id: 'world_mo_dao',
    category: 'world',
    title: '末道纪元',
    content:
      '天地灵气不知自何时起日渐衰败，上古修士举手可摘星辰，如今连筑基都已艰难。修士们称此世为「末道纪元」——大道将绝，而众生仍在天光将熄处逆风执灯。',
    unlockHint: '大道将绝，这是被称作「末道」的时代。',
  },
  world_xiu_xing: {
    id: 'world_xiu_xing',
    category: 'world',
    title: '灵气与修行',
    content:
      '修行，即是以己身契合天地灵气。凡胎引气入体为开脉，开脉凝液为筑基，此后金丹、元婴、化神，直至合体、大乘、渡劫、飞升，步步皆与天争。道心定内，灵蕴养外，体魄为基，神识为眼，因果为绳，执念为障。',
    unlockHint: '修行一途，境界森严，一步一重天。',
  },
  world_yin_guo: {
    id: 'world_yin_guo',
    category: 'world',
    title: '因果与执念',
    content:
      '因果是修行路上结下的业力，有善因便有善果，杀伐过重则因果缠身。执念则是心底未了的心事，是心魔的种子。执念越深，境界越高时心魔越盛——多少天骄，皆陨于一个「放不下」。',
    unlockHint: '有人说，修士最难的关，是心里的那道坎。',
  },
  world_tian_jie: {
    id: 'world_tian_jie',
    category: 'world',
    title: '天劫',
    content:
      '修士夺天地造化，修行至深必引天妒。天劫降世，雷火交加，渡得过则脱胎换骨，渡不过则灰飞烟灭。渡劫一境，是无数修士一生仰望又畏惧的终点——而再往上，便是飞升。',
    unlockHint: '传说，九天之上有雷。',
  },

  /* ================= 地域 ================= */
  region_luo_xing: {
    id: 'region_luo_xing',
    category: 'region',
    title: '落星坡',
    content:
      '相传上古年间，一颗古星自天外坠落于此，轰然化作千里丘陵，故得名「落星坡」。古星残存之力渗入地脉，使得此地灵气时浓时淡，妖兽也因此格外躁动，是散修与凡人的交界之地。',
    unlockHint: '你脚下的这片丘陵，似乎有段古老的来历。',
  },
  region_duan_hun: {
    id: 'region_duan_hun',
    category: 'region',
    title: '断魂崖',
    content:
      '断魂崖是落星坡最凶险的所在。孤崖深不见底，黑风自崖底呼啸而上，裹挟腥臭妖气。百年前黑风妖占据此崖，败尽来犯修士，崖边白骨累累，令方圆百里修士谈之色变。',
    unlockHint: '崖边的风里，总带着血腥味。',
  },
  region_qing_mu: {
    id: 'region_qing_mu',
    category: 'region',
    title: '青木岭',
    content:
      '青木岭漫山遍野皆是灵草，是落星坡少有的灵药产地。然灵草招妖兽，林深处獠牙遍布。采药人常说：青木岭的草，是用命换的。',
    unlockHint: '那片绿得发亮的山岭，藏着不少好东西，也藏着凶险。',
  },
  region_xi_feng: {
    id: 'region_xi_feng',
    category: 'region',
    title: '溪风镇',
    content:
      '溪风镇是落星坡唯一的集镇，溪水穿镇而过，两岸灯火点点。散修、凡人、行商在此落脚歇脚，丹药铺、铁匠铺、客栈沿街而立。镇口贴着讨伐妖兽的悬赏告示，来来往往都是讨生活的人。',
    unlockHint: '落星坡的修士们，大多会去一个叫溪风镇的地方。',
  },
  region_bai_cao: {
    id: 'region_bai_cao',
    category: 'region',
    title: '百草园',
    content:
      '百草园是苍梧药老在溪风镇东侧开辟的药田，灵药成畦，常年药香袅袅。园中有一株成了精的百年灵药，化作药灵四处蹦跳，寻常人靠近不得。',
    unlockHint: '镇东那片药田，听说长着一株会跑的灵药。',
  },
  region_fang_shi: {
    id: 'region_fang_shi',
    category: 'region',
    title: '溪风坊市',
    content:
      '溪风镇南边的露天坊市，是落星坡散修互通有无的地方。丹药法宝、奇珍异材，皆在此流转，偶尔也有来路不明的黑市货。鱼龙混杂，买东西全凭眼力。',
    unlockHint: '镇南的坊市里，什么都有得卖。',
  },
  region_qing_yang: {
    id: 'region_qing_yang',
    category: 'region',
    title: '青阳宗分坛',
    content:
      '青阳宗分坛坐镇落星坡半山，青石阶直通山门，剑光昼夜不息。明面上除妖护民，暗中却也在搜罗古星遗物——落星坡的秘境，正是青阳宗第一个发现并封锁的。',
    unlockHint: '半山那座剑光森然的宗门，来头不小。',
  },
  region_fei_zhai: {
    id: 'region_fei_zhai',
    category: 'region',
    title: '废宅',
    content:
      '荒僻处的半塌宅院，是落星坡一位陨落修士的旧居。那人陨落前曾守着秘境一角，死后执念不散，化作怨灵盘踞于此。幽蓝鬼火，至今未熄。',
    unlockHint: '荒僻处那座闹鬼的宅子，藏着段旧事。',
  },

  /* ================= 势力 ================= */
  faction_qing_yang: {
    id: 'faction_qing_yang',
    category: 'faction',
    title: '青阳宗',
    content:
      '青阳宗是落星坡外山中的正道大宗，以剑修闻名，收徒极严。其分坛常年驻守落星坡，明面上除妖护民，暗地里也在搜罗古星遗物。宗门规矩森严，入宗需过试炼。',
    unlockHint: '听说山外有个剑修大宗，叫青阳宗。',
  },
  faction_san_xiu: {
    id: 'faction_san_xiu',
    category: 'faction',
    title: '散修盟',
    content:
      '散修盟不是宗门，而是无门无派的散修自发结成的松散同盟，只在溪风镇这等地方互相照应、交换情报。没有宗门庇护的修士，大多在此抱团取暖。',
    unlockHint: '没有靠山的修士，总会找个地方相互依靠。',
  },
  faction_yao_shou: {
    id: 'faction_yao_shou',
    category: 'faction',
    title: '妖兽之祸',
    content:
      '末道纪元灵气紊乱，妖兽修炼反比人快，落星坡一带妖兽日益猖獗。寻常妖兽尚可应付，但若让它们结成巢穴、炼出内丹，便是方圆千里的一场大祸。',
    unlockHint: '人祸可防，兽祸难料。',
  },

  /* ================= 人物志 ================= */
  figure_xu_bai: {
    id: 'figure_xu_bai',
    category: 'figure',
    title: '须白老道',
    content:
      '破庙中守了百年的神秘老者，自称在等一个有缘人。他对山神庙的旧事讳莫如深，只言「残玉认主」。他究竟是何境界，无人知晓，只知那双浑浊的眼里，藏着太多旧事。',
    unlockHint: '庙里的那位老道，似乎知道很多往事。',
  },
  figure_cang_wu: {
    id: 'figure_cang_wu',
    category: 'figure',
    title: '苍梧药老',
    content:
      '溪风镇丹药铺的掌柜，筑基修士。早年曾是青阳宗外门丹师，因触犯门规被逐出宗门，便在此开了一间药铺。炼丹之术颇精，只是从不提当年旧事。',
    unlockHint: '药铺的掌柜，炼丹是真好，就是话里有旧事。',
  },
  figure_mo_tie: {
    id: 'figure_mo_tie',
    category: 'figure',
    title: '墨铁匠',
    content:
      '溪风镇铁匠铺的掌柜，开脉修士，一手锻造功夫在落星坡数一数二。两个徒弟前些年被断魂崖的黑风妖所伤，至今卧床不起。他对黑风妖恨之入骨，悬赏从未撤下。',
    unlockHint: '铁匠铺的汉子，心里压着对黑风妖的恨。',
  },
  figure_lin: {
    id: 'figure_lin',
    category: 'figure',
    title: '林清修',
    content:
      '落星坡一带有名的散修，为人热忱，常替初入修行的年轻人指点迷津。境界虽只有开脉，但在散修盟里颇有声望，是溪风镇的消息通。',
    unlockHint: '那位热心的散修，似乎什么都知道一点。',
  },

  /* ================= 器物 ================= */
  artifact_can_yu: {
    id: 'artifact_can_yu',
    category: 'artifact',
    title: '残玉',
    content:
      '那枚让你眉心发烫的残玉碎片，一直收在你身上。它似乎与破庙供奉的山神有关，须白老道说这是「认主」之兆——残玉认主，则与它相关的一桩旧事，便落在了你的肩上。',
    unlockHint: '你眉心的温热，似乎与一枚残玉有关。',
  },
  artifact_fu_lu: {
    id: 'artifact_fu_lu',
    category: 'artifact',
    title: '山神符箓',
    content:
      '从破庙神像底座下拾得的残破符箓，边缘焦黑，仿佛被雷火灼过。符上朱砂字迹已模糊不清，隐约可辨一个「镇」字——有人曾以此符镇住过什么。',
    unlockHint: '神像底座下那张焦黑的符，像是镇过什么东西。',
  },
  artifact_yu_jian: {
    id: 'artifact_yu_jian',
    category: 'artifact',
    title: '玉简碎片',
    content:
      '一枚碎裂的玉简残片，握在掌心微微发烫，似在指引着某个方向。须白老道说它指向东南灵脉交汇之处，是残玉认主后为你指的路。',
    unlockHint: '掌心里的玉简碎片，似乎在发热。',
  },
  artifact_yao_he: {
    id: 'artifact_yao_he',
    category: 'artifact',
    title: '黑风妖内丹',
    content:
      '断魂崖霸主黑风妖百年苦修凝成的内丹，蕴含庞大而暴戾的妖力。寻常修士不敢直接炼化，却能作为极珍贵的炼器炼丹材料。',
    unlockHint: '崖上那妖物，似乎结了一枚了不得的内丹。',
  },

  /* ================= 秘闻 ================= */
  secret_bei_wen: {
    id: 'secret_bei_wen',
    category: 'secret',
    title: '残碑碑文',
    content:
      '庙外半截古碑上的字迹被岁月磨去大半，只余几行残句：「……星陨于坡，神镇于此……百载血月，封印将溃……有缘人至，当继此责。」——这破庙里镇着的，恐怕不是寻常之物。',
    unlockHint: '古碑上的残句，隐约提到了「封印」。',
  },
  secret_shen_miao: {
    id: 'secret_shen_miao',
    category: 'secret',
    title: '山神陨落之谜',
    content:
      '破庙供奉的山神，传闻曾是落星坡的守护者，以自身镇压坡中古星遗祸。然百年前一夜之间，山神像眉心开裂，庙中灵气尽散，山神自此陨落。有老人说，那是末道纪元里，又一位神明的谢幕。',
    unlockHint: '这庙里的山神，为何会陨落？',
  },
  secret_xue_yue: {
    id: 'secret_xue_yue',
    category: 'secret',
    title: '落星坡血月',
    content:
      '每逢血月当空，落星坡的灵气便会紊乱到极点，妖兽成群躁动，古星残力也会在坡下隐隐回应。残碑上那句「百载血月，封印将溃」，说的正是此时——只是真正的血月，已近百年未现。',
    unlockHint: '有人提起，天上的月亮曾红过一次。',
  },
  secret_mi_jing: {
    id: 'secret_mi_jing',
    category: 'secret',
    title: '秘境入口',
    content:
      '落星坡东北的山崖裂口，是古星陨落时遗下的秘境入口。崖壁刻满古老禁制，灵气自裂隙中如雾涌出。青阳宗封锁此地多年，传言秘境深处藏有古星的核心遗物，非金丹境不可入。',
    unlockHint: '那道涌出灵气的山崖裂口，似乎通向什么地方。',
  },
};

/** 获取单条见闻 */
export const getLore = (loreId: string): LoreEntry | undefined => loreData[loreId];

/** 某分类下的全部见闻 */
export const getLoresByCategory = (category: LoreEntry['category']): LoreEntry[] =>
  Object.values(loreData).filter((l) => l.category === category);

/* ================= 解锁映射（场景/对话/物品 → 见闻） ================= */

/** 首次进入某场景解锁的地域见闻 */
export const sceneLoreMap: Record<string, string> = {
  po_miao: 'region_luo_xing',
  shan_gu: 'region_luo_xing',
  qing_mu_ling: 'region_qing_mu',
  xi_feng_zhen: 'region_xi_feng',
  duan_hun_ya: 'region_duan_hun',
  bai_cao_yuan: 'region_bai_cao',
  fang_shi: 'region_fang_shi',
  qing_yang_fen_tan: 'region_qing_yang',
  fei_zhai: 'region_fei_zhai',
  mi_jing_ru_kou: 'secret_mi_jing',
};

/** 与某 NPC 对话解锁的见闻 */
export const npcLoreMap: Record<string, string> = {
  xu_bai_lao: 'figure_xu_bai',
  lao_yao_shi: 'figure_cang_wu',
  tie_jiang: 'figure_mo_tie',
  lin_xiu_shi: 'figure_lin',
  yao_nong: 'region_bai_cao',
  shuo_shu_ren: 'secret_xue_yue',
  jie_yin_di_zi: 'faction_qing_yang',
};

/** 首次获得某物品解锁的器物见闻 */
export const itemLoreMap: Record<string, string> = {
  yu_jian_sui_pian: 'artifact_yu_jian',
  po_miao_fu: 'artifact_fu_lu',
  yao_he: 'artifact_yao_he',
};
