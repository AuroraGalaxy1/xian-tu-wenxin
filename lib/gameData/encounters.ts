// 随机奇遇事件数据
import { Encounter } from '@/types/encounter';

export const encountersData: Record<string, Encounter> = {
  e1: {
    id: 'e1',
    title: '高人传功',
    text: '你正行路间，忽见一位邋遢老道倚树假寐。他睁眼瞥了你一下，随手在你眉心一点——你只觉灵台清明，一股暖流涌遍全身。',
    result: { type: 'xiuwei', amount: 80 },
  },
  e2: {
    id: 'e2',
    title: '路拾遗物',
    text: '你在路边石缝中瞥见一点微光，拨开枯草，竟拾得一只玉瓶，瓶身还封着完好的蜡印。',
    result: { type: 'item', itemId: 'ju_qi_dan' },
  },
  e3: {
    id: 'e3',
    title: '灵狐引路',
    text: '一只通体雪白的灵狐从灌木中探出头，见你不走，竟衔着一株草药放在你脚边，随即窜入林中消失不见。',
    result: { type: 'item', itemId: 'ling_cao' },
  },
  e4: {
    id: 'e4',
    title: '横遭劫修',
    text: '一道黑影拦住去路，那人眼神阴鸷，短刀泛着寒光：“识相的，把值钱的留下。”',
    result: { type: 'combat', enemyId: 'jie_xiu' },
  },
  e5: {
    id: 'e5',
    title: '血月异象',
    text: '天边忽现一抹血色残影，转瞬即逝。你心头一凛，似有什么古老的东西在坡下苏醒了一瞬。',
    result: { type: 'xiuwei', amount: 60 },
  },
  e6: {
    id: 'e6',
    title: '采药偶得',
    text: '你蹲身歇息时，发现脚边的草丛里竟长着一株通体流转灵光的百年灵药，正好奇地晃着叶子。',
    result: { type: 'item', itemId: 'bai_cao_zhi' },
  },
  e7: {
    id: 'e7',
    title: '灵玉原石',
    text: '你被脚下石头绊了一跤，正要恼怒，却发现绊你的竟是一块泛着灵光的原石。',
    result: { type: 'lingShi', amount: 50 },
  },
  e8: {
    id: 'e8',
    title: '前辈赠丹',
    text: '一位路过的老修士见你修行辛苦，从袖中摸出一枚丹药塞到你手里：“年轻人，补补身子。”',
    result: { type: 'item', itemId: 'liao_shang_dan' },
  },
};

/** 随机获取一个奇遇 */
export const getRandomEncounterEvent = (): Encounter | null => {
  const list = Object.values(encountersData);
  if (list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
};

/** 按 id 获取奇遇 */
export const getEncounter = (id: string): Encounter | undefined =>
  encountersData[id];
