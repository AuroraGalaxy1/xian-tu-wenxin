// 数值规则层：打坐/修炼/突破/战斗/掉落 等纯函数
import { getRealmIndex, getNextRealm } from '@/lib/gameData/realms';
import { itemsData } from '@/lib/gameData/items';
import { getEnemiesByScene } from '@/lib/gameData/enemies';
import type { Player } from '@/types/player';
import type { DropEntry, Enemy } from '@/types/enemy';

/* ================= 灵气浓度系数 ================= */
export const LINGQI_MULT: Record<string, number> = {
  稀薄: 0.6,
  普通: 1,
  充裕: 1.4,
  浓郁: 2,
  暴走: 1.2,
};

/* ================= 修炼收益 ================= */
/** 打坐一次获得的修为（受灵气浓度与境界影响） */
export function getMeditateGain(lingqi: string, realmIndex: number): number {
  const base = 10 + realmIndex * 4;
  const mult = LINGQI_MULT[lingqi] ?? 1;
  return Math.round(base * mult);
}

/** 修炼一次获得的道心/灵蕴（受境界影响，越往上越难） */
export function getCultivateGain(realmIndex: number): number {
  return 1 + Math.floor(realmIndex / 2);
}

/* ================= 突破判定 ================= */
/** 下一境界修为需求；已是最高境界返回 null */
export function getNextRealmRequirement(player: Player): number | null {
  const next = getNextRealm(getRealmIndex(player.realm));
  return next ? next.xiuweiRequired : null;
}

/** 是否满足突破条件（修为 + 道心 + 灵蕴） */
export function canBreakthrough(player: Player): boolean {
  const next = getNextRealm(getRealmIndex(player.realm));
  if (!next) return false;
  return (
    player.stats.xiuwei >= next.xiuweiRequired &&
    player.stats.daoxin >= next.breakthrough.daoxinRequired &&
    player.stats.lingyun >= next.breakthrough.lingyunRequired
  );
}

/** 修为是否已达标（决定 realmStage 悟/破 切换） */
export function isXiuweiEnough(player: Player): boolean {
  const req = getNextRealmRequirement(player);
  if (req === null) return false;
  return player.stats.xiuwei >= req;
}

/** 突破还缺哪些条件（用于 UI 提示） */
export function getBreakthroughHints(player: Player): string[] {
  const next = getNextRealm(getRealmIndex(player.realm));
  if (!next) return ['已达修行之巅'];
  const hints: string[] = [];
  const req = next.xiuweiRequired;
  if (player.stats.xiuwei < req) hints.push(`修为不足（${player.stats.xiuwei}/${req}）`);
  if (player.stats.daoxin < next.breakthrough.daoxinRequired)
    hints.push(`道心不足（${player.stats.daoxin}/${next.breakthrough.daoxinRequired}）`);
  if (player.stats.lingyun < next.breakthrough.lingyunRequired)
    hints.push(`灵蕴不足（${player.stats.lingyun}/${next.breakthrough.lingyunRequired}）`);
  if (hints.length === 0) hints.push('万事俱备，可以突破');
  return hints;
}

/* ================= 战斗派生属性 ================= */
/** 由 境界 + 体魄 + 装备 派生玩家战斗属性 */
export function getPlayerCombatStats(player: Player): { maxHp: number; atk: number; def: number } {
  const idx = getRealmIndex(player.realm);
  const baseHp = 50 + player.stats.tipo * 5 + idx * 30;
  const baseAtk = 5 + player.stats.tipo * 1.5 + idx * 8;
  const baseDef = 2 + player.stats.tipo * 0.8 + idx * 5;

  // 装备加成
  let atkBonus = 0;
  let defBonus = 0;
  const slots = player.equipment ?? {};
  for (const slotId of Object.values(slots)) {
    const item = slotId ? itemsData[slotId] : undefined;
    if (item) {
      atkBonus += item.atkBonus ?? 0;
      defBonus += item.defBonus ?? 0;
    }
  }

  return {
    maxHp: Math.round(baseHp),
    atk: Math.round(baseAtk + atkBonus),
    def: Math.round(baseDef + defBonus),
  };
}

/* ================= 战斗计算 ================= */
/** 计算一次攻击伤害 */
export function calcDamage(atk: number, def: number, power: number, variance = 0.15): number {
  const raw = atk * power - def * 0.5;
  const jitter = raw * variance * (Math.random() * 2 - 1);
  return Math.max(1, Math.round(raw + jitter));
}

/** 防守时受到的伤害折减 */
export function calcDefendedDamage(atk: number, def: number, power: number): number {
  return Math.max(1, Math.round((atk * power - def * 0.5) * 0.4));
}

/* ================= 掉落与遭遇 ================= */
/** 按掉落表掷骰，返回实际掉落物品 id 列表 */
export function rollDrops(drops: DropEntry[]): string[] {
  const result: string[] = [];
  for (const d of drops) {
    if (Math.random() < d.rate) {
      const count = d.max ?? 1;
      result.push(d.itemId, ...(count > 1 ? Array(count - 1).fill(d.itemId) : []));
    }
  }
  return result;
}

/** 获取场景随机遭遇的敌人（无可遭遇则 null） */
export function getRandomEncounter(sceneId: string): Enemy | null {
  const list = getEnemiesByScene(sceneId);
  if (list.length === 0) return null;
  return list[Math.floor(Math.random() * list.length)];
}
