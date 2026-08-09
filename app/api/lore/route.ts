import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const LORE_ID = 'default';

export async function GET() {
  const lore = await prisma.lore.findUnique({ where: { id: LORE_ID } });
  return NextResponse.json(lore);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const lore = await prisma.lore.upsert({
    where: { id: LORE_ID },
    update: body,
    create: { ...body, id: LORE_ID },
  });
  return NextResponse.json(lore);
}