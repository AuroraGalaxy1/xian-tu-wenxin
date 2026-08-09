import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const logs = await prisma.gameLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json(logs.reverse());
}

export async function POST(req: Request) {
  const body = await req.json();
  const log = await prisma.gameLog.create({ data: body });
  return NextResponse.json(log);
}

export async function PUT(req: Request) {
  const body = await req.json();
  // Batch replace all logs
  await prisma.gameLog.deleteMany();
  if (body.logs && Array.isArray(body.logs) && body.logs.length > 0) {
    await prisma.gameLog.createMany({ data: body.logs });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await prisma.gameLog.deleteMany();
  return NextResponse.json({ ok: true });
}