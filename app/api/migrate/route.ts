import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

/** zustand persist 旧数据可能是 { state: ... } 包装，也可能是直接对象 */
function unwrap(raw: unknown): Record<string, any> {
  const obj = raw as Record<string, any>;
  if (obj && typeof obj === 'object' && 'state' in obj && obj.state) {
    return obj.state;
  }
  return obj ?? {};
}

/** 旧嵌套 Player → 新扁平 PlayerRow（与 playerStore.toRow 结构一致） */
function flattenPlayer(state: Record<string, any>) {
  const p = state.player && typeof state.player === 'object' ? state.player : state;
  const stats = p.stats && typeof p.stats === 'object' ? p.stats : {};
  return {
    name: p.name ?? '无名修士',
    realm: p.realm ?? '感气',
    realmStage: p.realmStage ?? '悟',
    daoxin: stats.daoxin ?? 0,
    maxDaoxin: stats.maxDaoxin ?? 100,
    lingyun: stats.lingyun ?? 0,
    maxLingyun: stats.maxLingyun ?? 50,
    tipo: stats.tipo ?? 0,
    shenshi: stats.shenshi ?? 0,
    yinguo: stats.yinguo ?? 0,
    zhinian: stats.zhinian ?? 0,
    xiuwei: stats.xiuwei ?? 0,
    hp: p.hp ?? 100,
    maxHp: p.maxHp ?? 100,
    lingShi: p.lingShi ?? 0,
    currentScene: p.currentScene ?? 'po_miao',
    inventory: JSON.stringify(p.inventory ?? []),
    skills: JSON.stringify(p.skills ?? []),
    quests: JSON.stringify(p.quests ?? []),
    relationships: JSON.stringify(p.relationships ?? {}),
    equipment: JSON.stringify(p.equipment ?? {}),
    visitedScenes: JSON.stringify(p.visitedScenes ?? []),
    killedEnemies: JSON.stringify(p.killedEnemies ?? []),
  };
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });

    const body = await req.json();
    const results: Record<string, boolean> = {};

    // player-storage
    if (body['player-storage']) {
      const state = unwrap(body['player-storage']);
      const row = flattenPlayer(state);
      await prisma.player.upsert({
        where: { userId: user.id },
        update: row,
        create: { ...row, userId: user.id },
      });
      results['player-storage'] = true;
    }

    // map-storage
    if (body['map-storage']) {
      const state = unwrap(body['map-storage']);
      const currentLocationId =
        state.currentLocation?.id ?? state.currentLocationId ?? 'po_miao';
      const unlocked = Array.isArray(state.unlockedLocations)
        ? state.unlockedLocations
        : Array.isArray(state.locations)
          ? state.locations.filter((l: any) => l.isUnlocked).map((l: any) => l.id)
          : [];
      const explored = Array.isArray(state.exploredLocations)
        ? state.exploredLocations
        : Array.isArray(state.locations)
          ? state.locations.filter((l: any) => l.isExplored).map((l: any) => l.id)
          : [];
      const row = {
        currentLocationId,
        unlockedLocations: JSON.stringify(unlocked),
        exploredLocations: JSON.stringify(explored),
      };
      await prisma.mapState.upsert({
        where: { userId: user.id },
        update: row,
        create: { ...row, userId: user.id },
      });
      results['map-storage'] = true;
    }

    // checkin-storage
    if (body['checkin-storage']) {
      const state = unwrap(body['checkin-storage']);
      const row = {
        lastCheckinDate: state.lastCheckinDate ?? null,
        consecutiveDays: state.consecutiveDays ?? 0,
      };
      await prisma.checkin.upsert({
        where: { userId: user.id },
        update: row,
        create: { ...row, userId: user.id },
      });
      results['checkin-storage'] = true;
    }

    // achievement-storage
    if (body['achievement-storage']) {
      const state = unwrap(body['achievement-storage']);
      const row = {
        unlockedIds: JSON.stringify(Array.isArray(state.unlockedIds) ? state.unlockedIds : []),
      };
      await prisma.achievement.upsert({
        where: { userId: user.id },
        update: row,
        create: { ...row, userId: user.id },
      });
      results['achievement-storage'] = true;
    }

    // lore-storage
    if (body['lore-storage']) {
      const state = unwrap(body['lore-storage']);
      const row = {
        unlockedIds: JSON.stringify(Array.isArray(state.unlockedIds) ? state.unlockedIds : []),
      };
      await prisma.lore.upsert({
        where: { userId: user.id },
        update: row,
        create: { ...row, userId: user.id },
      });
      results['lore-storage'] = true;
    }

    // log-storage
    if (body['log-storage']) {
      const state = unwrap(body['log-storage']);
      if (state.logs && Array.isArray(state.logs)) {
        for (const log of state.logs) {
          await prisma.gameLog.create({
            data: {
              id: log.id,
              userId: user.id,
              timestamp: log.timestamp ?? '',
              content: log.content ?? '',
              type: log.type ?? 'normal',
            },
          });
        }
      }
      results['log-storage'] = true;
    }

    // tutorial-storage
    if (body['tutorial-storage']) {
      const state = unwrap(body['tutorial-storage']);
      const row = {
        tutorialCompleted: Boolean(state.tutorialCompleted),
      };
      await prisma.tutorial.upsert({
        where: { userId: user.id },
        update: row,
        create: { ...row, userId: user.id },
      });
      results['tutorial-storage'] = true;
    }

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error('Migration error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}