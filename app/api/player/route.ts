import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const PLAYER_ID = 'player_001';

export async function GET() {
  const player = await prisma.player.findUnique({ where: { id: PLAYER_ID } });
  return NextResponse.json(player);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const player = await prisma.player.upsert({
    where: { id: PLAYER_ID },
    update: body,
    create: { ...body, id: PLAYER_ID },
  });
  return NextResponse.json(player);
}