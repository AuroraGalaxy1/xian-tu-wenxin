import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, generateSessionToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: '请输入用户名和密码' }, { status: 400 });
    }

    const trimmed = username.trim();
    const user = await prisma.user.findUnique({ where: { username: trimmed } });
    if (!user) {
      return NextResponse.json({ error: '道号或法诀有误' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: '道号或法诀有误' }, { status: 401 });
    }

    // 生成新会话令牌
    const sessionToken = generateSessionToken();
    await prisma.user.update({
      where: { id: user.id },
      data: { sessionToken },
    });

    return NextResponse.json({
      user: { id: user.id, username: user.username },
      token: sessionToken,
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: '登录失败，请稍后重试' }, { status: 500 });
  }
}