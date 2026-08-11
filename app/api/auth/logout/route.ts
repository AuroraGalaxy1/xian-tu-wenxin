import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { sessionToken: null },
  });

  return NextResponse.json({ ok: true });
}