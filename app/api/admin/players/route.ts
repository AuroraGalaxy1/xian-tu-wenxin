import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  // 所有已登录用户可访问
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  // 搜索参数
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.trim() ?? '';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(searchParams.get('pageSize') ?? '20', 10)));

  // 查询用户
  let userIds: string[] | undefined;

  if (search) {
    // 先查匹配的玩家名，获取 userId 集合
    const matchingPlayers = await prisma.player.findMany({
      where: { name: { contains: search } },
      select: { userId: true },
    });
    const playerUserIds = matchingPlayers.map((p) => p.userId);

    // 再查匹配的用户名
    const matchingUsers = await prisma.user.findMany({
      where: { username: { contains: search } },
      select: { id: true },
    });
    const usernameIds = matchingUsers.map((u) => u.id);

    // 合并去重
    userIds = [...new Set([...playerUserIds, ...usernameIds])];

    // 如果无匹配，返回空
    if (userIds.length === 0) {
      return NextResponse.json({
        players: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
      });
    }
  }

  const where = userIds ? { id: { in: userIds } } : {};

  const total = await prisma.user.count({ where });

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  // 批量查询 player
  const userIdList = users.map((u) => u.id);
  const players = await prisma.player.findMany({
    where: { userId: { in: userIdList } },
    select: {
      id: true,
      userId: true,
      name: true,
      realm: true,
      realmStage: true,
      xiuwei: true,
      lingShi: true,
      hp: true,
      maxHp: true,
      currentScene: true,
    },
  });
  const playerMap = new Map(players.map((p) => [p.userId, p]));

  const result = users.map((u) => ({
    userId: u.id,
    username: u.username,
    createdAt: u.createdAt,
    player: playerMap.get(u.id) ?? null,
  }));

  return NextResponse.json({
    players: result,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  });
}