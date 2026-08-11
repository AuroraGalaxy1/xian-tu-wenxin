import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const logs = await prisma.gameLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json(logs.reverse());
}

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const body = await request.json();
  const log = await prisma.gameLog.create({
    data: { ...body, userId: user.id },
  });
  return NextResponse.json(log);
}

export async function PUT(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const body = await request.json();
  // 按 userId 批量替换该用户的所有日志
  await prisma.gameLog.deleteMany({ where: { userId: user.id } });
  if (body.logs && Array.isArray(body.logs) && body.logs.length > 0) {
    const logsWithUser = body.logs.map((log: any) => ({
      ...log,
      userId: user.id,
    }));
    await prisma.gameLog.createMany({ data: logsWithUser });
  }
  return NextResponse.json({ ok: true });
}