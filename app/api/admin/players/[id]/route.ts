import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // 所有已登录用户可访问
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const { id } = await context.params;

  // 查询用户
  const userData = await prisma.user.findUnique({
    where: { id },
  });

  if (!userData) {
    return NextResponse.json({ error: '用户不存在' }, { status: 404 });
  }

  // 查询玩家数据（无 Prisma relation，单独查询）
  const player = await prisma.player.findUnique({
    where: { userId: id },
  });

  // 查询关联数据
  const mapState = await prisma.mapState.findUnique({
    where: { userId: id },
  });

  const checkin = await prisma.checkin.findUnique({
    where: { userId: id },
  });

  const achievement = await prisma.achievement.findUnique({
    where: { userId: id },
  });

  const lore = await prisma.lore.findUnique({
    where: { userId: id },
  });

  const tutorial = await prisma.tutorial.findUnique({
    where: { userId: id },
  });

  // 最近50条日志
  const logs = await prisma.gameLog.findMany({
    where: { userId: id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json({
    user: {
      id: userData.id,
      username: userData.username,
      createdAt: userData.createdAt,
    },
    player,
    mapState,
    checkin,
    achievement: achievement
      ? { unlockedIds: safeParseJSON(achievement.unlockedIds, []) }
      : null,
    lore: lore
      ? { unlockedIds: safeParseJSON(lore.unlockedIds, []) }
      : null,
    tutorial,
    logs: logs.reverse(), // 正序显示
  });
}

function safeParseJSON<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}