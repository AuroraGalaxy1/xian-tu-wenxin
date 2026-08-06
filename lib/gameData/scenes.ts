import { Scene } from '@/types/scene';

// 场景数据：actions 通过 type 字段驱动行为（explore/meditate/combat/talk/shop/rest/gather...），
// payload 携带 npcId / enemyId / itemId 等参数，由 CenterPanel 统一分发处理。

export const scenesData: Record<string, Scene> = {
  /* ================= 破败山神庙（起始） ================= */
  po_miao: {
    id: 'po_miao',
    name: '无名荒山·破败山神庙',
    description: '残月悬空，荒草没过膝。你站在一座坍塌过半的山神庙前，庙门斜挂，露出内里漆黑的空洞。檐角蛛网密布，梁上积尘半寸——此地至少荒废百年。',
    location: { region: '落星坡', x: 120, y: 80 },
    atmosphere: { lingqi: '普通', danger: '低', time: '子时' },
    actions: [
      { id: 'view_detail', label: '查看详情', icon: 'BookOpen', description: '仔细观察当前场景的细节', action: () => {}, type: 'info' },
      { id: 'explore', label: '探查四周', icon: 'Search', description: '消耗神识，扫描周围', action: () => {}, type: 'explore' },
      { id: 'meditate', label: '打坐调息', icon: 'Coffee', description: '尝试感应天地灵气', action: () => {}, type: 'meditate' },
      { id: 'talk_xu_bai', label: '与老者交谈', icon: 'Users', description: '与庙中神秘老者交谈', action: () => {}, type: 'talk', payload: { npcId: 'xu_bai_lao' } },
      { id: 'check_stele', label: '翻阅残碑', icon: 'FileText', description: '查看庙外半截古碑', action: () => {}, type: 'info' },
      { id: 'check_self', label: '检查自身', icon: 'User', description: '查看自身状态与携带之物', action: () => {}, type: 'backpack' },
      { id: 'leave', label: '尝试离开', icon: 'MapPin', description: '离开这座破庙，前往他处', action: () => {}, type: 'leave' },
    ],
    exits: [
      { sceneId: 'shan_gu', direction: '东南', label: '前往东南山谷', isLocked: false },
    ],
    npcs: ['xu_bai_lao'],
    items: ['po_miao_fu'],
    isUnlocked: true,
    isExplored: false,
  },

  /* ================= 灵脉交汇之眼 ================= */
  shan_gu: {
    id: 'shan_gu',
    name: '灵脉交汇之眼',
    description: '你穿过密林，来到一处被翠绿山峦环抱的山谷。谷中灵气浓郁得几乎凝成水雾，在月光下泛着微光。一道清泉从石缝间淌出，隐约可见一只通体雪白的灵狐身影一闪而过。',
    location: { region: '落星坡', x: 320, y: 150 },
    atmosphere: { lingqi: '浓郁', danger: '中', time: '寅时' },
    actions: [
      { id: 'view_detail', label: '查看详情', icon: 'BookOpen', description: '仔细观察这片灵脉交汇之地', action: () => {}, type: 'info' },
      { id: 'explore_valley', label: '探查山谷', icon: 'Search', description: '仔细探查，可能遭遇灵狐', action: () => {}, type: 'explore' },
      { id: 'gather_lingqi', label: '采集灵气', icon: 'Coffee', description: '尝试吸收此地的浓郁灵气', action: () => {}, type: 'meditate' },
      { id: 'leave', label: '尝试离开', icon: 'MapPin', description: '离开山谷，前往他处', action: () => {}, type: 'leave' },
    ],
    exits: [
      { sceneId: 'po_miao', direction: '西北', label: '返回破庙', isLocked: false },
      { sceneId: 'qing_mu_ling', direction: '西南', label: '前往青木岭', isLocked: false },
      { sceneId: 'xi_feng_zhen', direction: '东', label: '前往溪风镇', isLocked: false },
    ],
    npcs: [],
    items: [],
    isUnlocked: true,
    isExplored: false,
  },

  /* ================= 青木岭（资源区） ================= */
  qing_mu_ling: {
    id: 'qing_mu_ling',
    name: '青木岭',
    description: '漫山遍野的青木在月光下泛着幽光，灵草随风摇曳，空气中满是草木清香。但林深处不时传来野兽的低吼——这里灵草遍地的同时，也妖兽横行。',
    location: { region: '落星坡', x: 80, y: 200 },
    atmosphere: { lingqi: '充裕', danger: '中', time: '丑时' },
    actions: [
      { id: 'view_detail', label: '查看详情', icon: 'BookOpen', description: '仔细观察青木岭的地势', action: () => {}, type: 'info' },
      { id: 'gather_herb', label: '采集灵草', icon: 'Leaf', description: '采摘一株蕴含灵气的灵草', action: () => {}, type: 'gather', payload: { itemId: 'ling_cao' } },
      { id: 'hunt', label: '狩猎妖兽', icon: 'Sword', description: '深入林间，挑战妖兽', action: () => {}, type: 'combat' },
      { id: 'explore', label: '探查四周', icon: 'Search', description: '消耗神识，探查妖兽踪迹', action: () => {}, type: 'explore' },
      { id: 'talk_caiyao', label: '与采药人交谈', icon: 'Users', description: '与采药老人攀谈', action: () => {}, type: 'talk', payload: { npcId: 'cai_yao_ren' } },
      { id: 'leave', label: '尝试离开', icon: 'MapPin', description: '离开青木岭', action: () => {}, type: 'leave' },
    ],
    exits: [
      { sceneId: 'shan_gu', direction: '东北', label: '返回山谷', isLocked: false },
      { sceneId: 'duan_hun_ya', direction: '东南', label: '前往断魂崖', isLocked: false },
    ],
    npcs: ['cai_yao_ren'],
    items: [],
    isUnlocked: true,
    isExplored: false,
  },

  /* ================= 溪风镇（城镇） ================= */
  xi_feng_zhen: {
    id: 'xi_feng_zhen',
    name: '溪风镇',
    description: '落星坡唯一的集镇。溪水穿镇而过，两岸灯火点点。丹药铺、铁匠铺、客栈沿街而立，镇口立着一块斑驳的木牌，贴着讨伐妖兽的悬赏告示。这里是修士落脚补给之地。',
    location: { region: '落星坡', x: 480, y: 180 },
    atmosphere: { lingqi: '普通', danger: '低', time: '卯时' },
    actions: [
      { id: 'shop_yaoshi', label: '丹药铺', icon: 'FlaskConical', description: '去苍梧药老的丹药铺看看', action: () => {}, type: 'shop', payload: { npcId: 'lao_yao_shi' } },
      { id: 'shop_tiejiang', label: '铁匠铺', icon: 'Hammer', description: '去墨铁匠的铁匠铺看看', action: () => {}, type: 'shop', payload: { npcId: 'tie_jiang' } },
      { id: 'talk_linxiu', label: '与散修交谈', icon: 'Users', description: '与林清修攀谈', action: () => {}, type: 'talk', payload: { npcId: 'lin_xiu_shi' } },
      { id: 'rest', label: '客栈歇息', icon: 'BedDouble', description: '在客栈歇息一晚，恢复气血', action: () => {}, type: 'rest' },
      { id: 'inquire', label: '打听消息', icon: 'Search', description: '在镇上打听消息', action: () => {}, type: 'explore' },
      { id: 'leave', label: '离开小镇', icon: 'MapPin', description: '离开溪风镇', action: () => {}, type: 'leave' },
    ],
    exits: [
      { sceneId: 'shan_gu', direction: '西', label: '返回山谷', isLocked: false },
      { sceneId: 'duan_hun_ya', direction: '南', label: '前往断魂崖', isLocked: false },
<<<<<<< HEAD
      { sceneId: 'bai_cao_yuan', direction: '东', label: '前往百草园', isLocked: false },
      { sceneId: 'fang_shi', direction: '南', label: '前往溪风坊市', isLocked: false },
      { sceneId: 'qing_yang_fen_tan', direction: '东南', label: '前往青阳宗分坛', isLocked: false },
=======
>>>>>>> 6da646e4e58e870374996db04b7b20524f5ca952
    ],
    npcs: ['lao_yao_shi', 'tie_jiang', 'lin_xiu_shi'],
    items: [],
    isUnlocked: true,
    isExplored: false,
  },

  /* ================= 断魂崖（危险区 · 黑风妖） ================= */
  duan_hun_ya: {
    id: 'duan_hun_ya',
    name: '断魂崖',
    description: '一座孤崖突兀地立于荒野尽头，崖下深不见底，黑风从崖底呼啸而上，裹挟着腥臭的妖气。传言黑风妖便盘踞于此，百年来败尽无数修士。崖边白骨累累，令人胆寒。',
    location: { region: '落星坡', x: 200, y: 320 },
    atmosphere: { lingqi: '暴走', danger: '极危', time: '亥时' },
    actions: [
      { id: 'view_abyss', label: '俯瞰崖底', icon: 'BookOpen', description: '俯瞰深不见底的断魂崖', action: () => {}, type: 'info' },
      { id: 'explore', label: '探查四周', icon: 'Search', description: '小心探查，警惕鬼影蝠', action: () => {}, type: 'explore' },
      { id: 'challenge', label: '挑战黑风妖', icon: 'Sword', description: '直面断魂崖的霸主', action: () => {}, type: 'combat', payload: { enemyId: 'hei_feng_yao' } },
      { id: 'leave', label: '离开此地', icon: 'MapPin', description: '离开断魂崖', action: () => {}, type: 'leave' },
    ],
    exits: [
      { sceneId: 'qing_mu_ling', direction: '西北', label: '返回青木岭', isLocked: false },
      { sceneId: 'xi_feng_zhen', direction: '北', label: '返回溪风镇', isLocked: false },
    ],
    npcs: [],
    items: [],
    isUnlocked: false,
    isExplored: false,
  },
<<<<<<< HEAD

  /* ================= 百草园（资源区） ================= */
  bai_cao_yuan: {
    id: 'bai_cao_yuan',
    name: '百草园',
    description: '溪风镇东侧一片被竹篱圈起的药田，灵药成畦，药香扑鼻。一个老药农正弯腰侍弄药苗，田埂间时有巴掌大的药灵蹦跳而过。',
    location: { region: '落星坡', x: 560, y: 120 },
    atmosphere: { lingqi: '充裕', danger: '中', time: '卯时' },
    actions: [
      { id: 'view_detail', label: '查看详情', icon: 'BookOpen', description: '仔细观察这片药田', action: () => {}, type: 'info' },
      { id: 'gather_herb', label: '采摘灵草', icon: 'Leaf', description: '采摘一株灵草', action: () => {}, type: 'gather', payload: { itemId: 'ling_cao' } },
      { id: 'gather_rare', label: '搜寻珍药', icon: 'Sprout', description: '在药田深处搜寻百年灵药', action: () => {}, type: 'gather', payload: { itemId: 'bai_cao_zhi' } },
      { id: 'explore', label: '探查四周', icon: 'Search', description: '小心探查，谨防药灵惊扰', action: () => {}, type: 'explore' },
      { id: 'talk_yao_nong', label: '与药农交谈', icon: 'Users', description: '与药农攀谈', action: () => {}, type: 'talk', payload: { npcId: 'yao_nong' } },
      { id: 'leave', label: '返回镇里', icon: 'MapPin', description: '返回溪风镇', action: () => {}, type: 'leave' },
    ],
    exits: [
      { sceneId: 'xi_feng_zhen', direction: '西', label: '返回溪风镇', isLocked: false },
    ],
    npcs: ['yao_nong'],
    items: [],
    isUnlocked: true,
    isExplored: false,
  },

  /* ================= 溪风坊市（城镇） ================= */
  fang_shi: {
    id: 'fang_shi',
    name: '溪风坊市',
    description: '溪风镇南边的露天坊市，摊位鳞次栉比，叫卖声不绝。散修们在此交换丹药法宝，也偶尔流传出黑市货的消息。一位说书人坐在角落，正拍着醒木讲古。',
    location: { region: '落星坡', x: 540, y: 240 },
    atmosphere: { lingqi: '普通', danger: '低', time: '午时' },
    actions: [
      { id: 'view_detail', label: '查看详情', icon: 'BookOpen', description: '打量这座热闹的坊市', action: () => {}, type: 'info' },
      { id: 'shop_merchant', label: '坊市商人', icon: 'ShoppingBag', description: '看看坊市商人卖的货物', action: () => {}, type: 'shop', payload: { npcId: 'fang_shi_shang_ren' } },
      { id: 'talk_story', label: '听说书人讲古', icon: 'MessageCircle', description: '听人说书，长长见识', action: () => {}, type: 'talk', payload: { npcId: 'shuo_shu_ren' } },
      { id: 'inquire', label: '打听消息', icon: 'Search', description: '在坊市里打听消息', action: () => {}, type: 'explore' },
      { id: 'leave', label: '离开坊市', icon: 'MapPin', description: '离开坊市', action: () => {}, type: 'leave' },
    ],
    exits: [
      { sceneId: 'xi_feng_zhen', direction: '北', label: '返回溪风镇', isLocked: false },
    ],
    npcs: ['fang_shi_shang_ren', 'shuo_shu_ren'],
    items: [],
    isUnlocked: true,
    isExplored: false,
  },

  /* ================= 青阳宗分坛（势力） ================= */
  qing_yang_fen_tan: {
    id: 'qing_yang_fen_tan',
    name: '青阳宗分坛',
    description: '青石阶直通半山，山门巍峨，剑光森然。护山法阵隐隐流转，一名青衫弟子持剑立于门侧——这是青阳宗在落星坡的分坛，明面除妖护民，实则也搜罗古星遗物。',
    location: { region: '落星坡', x: 360, y: 280 },
    atmosphere: { lingqi: '充裕', danger: '中', time: '申时' },
    actions: [
      { id: 'view_detail', label: '查看详情', icon: 'BookOpen', description: '打量青阳宗分坛', action: () => {}, type: 'info' },
      { id: 'talk_jieyin', label: '与接引弟子交谈', icon: 'Users', description: '与青阳宗接引弟子攀谈', action: () => {}, type: 'talk', payload: { npcId: 'jie_yin_di_zi' } },
      { id: 'shilian', label: '参加宗门试炼', icon: 'Sword', description: '挑战护坛傀儡，一试身手', action: () => {}, type: 'combat', payload: { enemyId: 'shi_lian_kui_lei' } },
      { id: 'meditate', label: '借地修炼', icon: 'Coffee', description: '借分坛灵气浓郁之地修炼', action: () => {}, type: 'meditate' },
      { id: 'leave', label: '离开分坛', icon: 'MapPin', description: '离开青阳宗分坛', action: () => {}, type: 'leave' },
    ],
    exits: [
      { sceneId: 'xi_feng_zhen', direction: '西', label: '返回溪风镇', isLocked: false },
      { sceneId: 'mi_jing_ru_kou', direction: '东北', label: '前往秘境入口', isLocked: false },
    ],
    npcs: ['jie_yin_di_zi'],
    items: [],
    isUnlocked: true,
    isExplored: false,
  },

  /* ================= 废宅（探索 · 怨灵） ================= */
  fei_zhai: {
    id: 'fei_zhai',
    name: '废宅',
    description: '一座半塌的宅院立在荒僻处，匾额锈蚀难辨。庭院杂草及腰，廊下浮着幽蓝鬼火。传闻这是落星坡一位陨落修士的旧居，至今无人敢近。',
    location: { region: '落星坡', x: 40, y: 330 },
    atmosphere: { lingqi: '暴走', danger: '高', time: '亥时' },
    actions: [
      { id: 'view_detail', label: '查看详情', icon: 'BookOpen', description: '打量这座荒废的宅院', action: () => {}, type: 'info' },
      { id: 'explore', label: '探查宅院', icon: 'Search', description: '小心探查，警惕怨灵', action: () => {}, type: 'explore' },
      { id: 'search', label: '搜寻遗物', icon: 'SearchCheck', description: '在废墟中搜寻前人遗物', action: () => {}, type: 'gather', payload: { itemId: 'heiyu' } },
      { id: 'leave', label: '离开废宅', icon: 'MapPin', description: '离开这座废宅', action: () => {}, type: 'leave' },
    ],
    exits: [
      { sceneId: 'qing_mu_ling', direction: '东北', label: '前往青木岭', isLocked: false },
      { sceneId: 'po_miao', direction: '北', label: '前往破庙', isLocked: false },
    ],
    npcs: [],
    items: [],
    isUnlocked: true,
    isExplored: false,
  },

  /* ================= 秘境入口（高等级锁定） ================= */
  mi_jing_ru_kou: {
    id: 'mi_jing_ru_kou',
    name: '秘境入口',
    description: '一道山崖裂口横陈眼前，灵气如雾般自裂隙涌出，崖壁刻满古老禁制符文。传言此地通往古星陨落时遗下的秘境，非金丹境不可擅入。',
    location: { region: '落星坡', x: 620, y: 60 },
    atmosphere: { lingqi: '暴走', danger: '极危', time: '子时' },
    actions: [
      { id: 'view_detail', label: '查看详情', icon: 'BookOpen', description: '打量这处古老的禁制', action: () => {}, type: 'info' },
      { id: 'explore', label: '探查裂隙', icon: 'Search', description: '试着探查裂隙内的气息', action: () => {}, type: 'explore' },
      { id: 'leave', label: '离开此地', icon: 'MapPin', description: '离开秘境入口', action: () => {}, type: 'leave' },
    ],
    exits: [
      { sceneId: 'qing_yang_fen_tan', direction: '西南', label: '返回青阳宗分坛', isLocked: false },
    ],
    npcs: [],
    items: [],
    isUnlocked: false,
    isExplored: false,
  },
=======
>>>>>>> 6da646e4e58e870374996db04b7b20524f5ca952
};
