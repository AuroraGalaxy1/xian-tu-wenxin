import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ACHIEVEMENT_ID = 'default';

export async function GET() {
  const achievement = await prisma.achievement.findUnique({ where: { id: ACHIEVEMENT_ID } });
  return NextResponse.json(achievement);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const achievement = await prisma.achievement.upsert({
    where: { id: ACHIEVEMENT_ID },
    update: body,
    create: { ...body, id: ACHIEVEMENT_ID },
  });
  return NextResponse.json(achievement);
}