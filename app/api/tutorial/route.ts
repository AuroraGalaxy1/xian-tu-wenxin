import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const TUTORIAL_ID = 'default';

export async function GET() {
  const tutorial = await prisma.tutorial.findUnique({ where: { id: TUTORIAL_ID } });
  return NextResponse.json(tutorial);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const tutorial = await prisma.tutorial.upsert({
    where: { id: TUTORIAL_ID },
    update: body,
    create: { ...body, id: TUTORIAL_ID },
  });
  return NextResponse.json(tutorial);
}