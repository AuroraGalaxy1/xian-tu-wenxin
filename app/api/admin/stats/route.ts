import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';
import { achievementsData } from '@/lib/gameData/achievements';
import { loreData } from '@/lib/gameData/lore';
import { scenesData } from '@/lib/gameData/scenes';

export async function GET(request: Request) {
  // 所有已登录用户可访问（暂时不设管理员权限）
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  // 1. 用户/玩家统计
  const userCount = await prisma.user.count();
  const playerCount = await prisma.player.count();

  // 2. 活跃用户（有 sessionToken 的用户数）
  const activeUsers = await prisma.user.count({
    where: { sessionToken: { not: null } },
  });

  // 3. 灵石统计
  const lingShiAgg = await prisma.player.aggregate({
    _sum: { lingShi: true },
  });
  const totalLingShi = lingShiAgg._sum.lingShi ?? 0;
  const avgLingShi = playerCount > 0 ? Math.round(totalLingShi / playerCount) : 0;

  // 4. 境界分布（groupBy 按 realm 分组）
  const realmGroup = await prisma.player.groupBy({
    by: ['realm'],
    _count: { id: true },
  });
  const realmDistribution = realmGroup
    .map((r) => ({ realm: r.realm, count: r._count.id }))
    .sort((a, b) => b.count - a.count);

  // 5. JSON 字段聚合（遍历所有玩家，解析 JSON 后统计）
  const allPlayers = await prisma.player.findMany({
    select: {
      quests: true,
      killedEnemies: true,
      visitedScenes: true,
      inventory: true,
    },
  });

  let totalQuestsCompleted = 0;
  let totalKillCount = 0;

  for (const p of allPlayers) {
    try {
      // 任务完成数
      const quests = JSON.parse(p.quests);
      if (Array.isArray(quests)) {
        totalQuestsCompleted += quests.filter((q: any) => q.status === 'completed').length;
      }
    } catch {}

    try {
      // 击杀数
      const kills = JSON.parse(p.killedEnemies);
      if (Array.isArray(kills)) {
        totalKillCount += kills.length;
      }
    } catch {}
  }

  // 6. 签到统计
  const checkinCount = await prisma.checkin.count();
  const checkinAgg = await prisma.checkin.aggregate({
    _sum: { consecutiveDays: true },
  });
  const totalCheckins = checkinCount;
  const avgConsecutiveDays =
    checkinCount > 0
      ? Math.round((checkinAgg._sum.consecutiveDays ?? 0) / checkinCount)
      : 0;

  // 7. 成就/见闻录/场景 静态数据统计
  const totalAchievements = Object.keys(achievementsData).length;
  const totalLore = Object.keys(loreData).length;
  const totalScenes = Object.keys(scenesData).length;

  // 8. 所有玩家解锁成就/见闻录总数
  const achievements = await prisma.achievement.findMany({
    select: { unlockedIds: true },
  });
  let unlockedAchievements = 0;
  for (const a of achievements) {
    try {
      const ids = JSON.parse(a.unlockedIds);
      if (Array.isArray(ids)) unlockedAchievements += ids.length;
    } catch {}
  }

  const lores = await prisma.lore.findMany({
    select: { unlockedIds: true },
  });
  let unlockedLore = 0;
  for (const l of lores) {
    try {
      const ids = JSON.parse(l.unlockedIds);
      if (Array.isArray(ids)) unlockedLore += ids.length;
    } catch {}
  }

  return NextResponse.json({
    userCount,
    playerCount,
    activeUsers,
    totalLingShi,
    avgLingShi,
    realmDistribution,
    totalAchievements,
    unlockedAchievements,
    totalLore,
    unlockedLore,
    totalScenes,
    totalCheckins,
    avgConsecutiveDays,
    totalQuestsCompleted,
    totalKillCount,
  });
}