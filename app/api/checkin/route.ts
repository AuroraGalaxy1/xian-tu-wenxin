import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const CHECKIN_ID = 'default';

export async function GET() {
  const checkin = await prisma.checkin.findUnique({ where: { id: CHECKIN_ID } });
  return NextResponse.json(checkin);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const checkin = await prisma.checkin.upsert({
    where: { id: CHECKIN_ID },
    update: body,
    create: { ...body, id: CHECKIN_ID },
  });
  return NextResponse.json(checkin);
}