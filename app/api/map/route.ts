import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const MAP_ID = 'default';

export async function GET() {
  const map = await prisma.mapState.findUnique({ where: { id: MAP_ID } });
  return NextResponse.json(map);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const map = await prisma.mapState.upsert({
    where: { id: MAP_ID },
    update: body,
    create: { ...body, id: MAP_ID },
  });
  return NextResponse.json(map);
}