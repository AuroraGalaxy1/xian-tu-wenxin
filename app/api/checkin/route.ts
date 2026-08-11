import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const checkin = await prisma.checkin.findUnique({ where: { userId: user.id } });
  return NextResponse.json(checkin);
}

export async function PUT(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: '未登录' }, { status: 401 });

  const body = await request.json();
  const { id, ...data } = body;
  const checkin = await prisma.checkin.upsert({
    where: { userId: user.id },
    update: data,
    create: { ...data, userId: user.id },
  });
  return NextResponse.json(checkin);
}