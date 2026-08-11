import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateSessionToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // 验证输入
    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: '请输入用户名' }, { status: 400 });
    }
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: '请输入密码' }, { status: 400 });
    }
    const trimmed = username.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      return NextResponse.json({ error: '用户名长度需在 2-20 个字符之间' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: '密码长度至少 6 个字符' }, { status: 400 });
    }

    // 检查用户名是否已存在
    const existing = await prisma.user.findUnique({ where: { username: trimmed } });
    if (existing) {
      return NextResponse.json({ error: '该道号已被占用' }, { status: 409 });
    }

    // 创建用户
    const passwordHash = await hashPassword(password);
    const sessionToken = generateSessionToken();
    const user = await prisma.user.create({
      data: {
        username: trimmed,
        passwordHash,
        sessionToken,
      },
    });

    // 清理旧数据（硬编码 ID 的旧单例记录）
    await prisma.player.deleteMany({ where: { id: { in: ['player_001'] } } });
    await prisma.mapState.deleteMany({ where: { id: 'default' } });
    await prisma.checkin.deleteMany({ where: { id: 'default' } });
    await prisma.achievement.deleteMany({ where: { id: 'default' } });
    await prisma.lore.deleteMany({ where: { id: 'default' } });
    await prisma.tutorial.deleteMany({ where: { id: 'default' } });
    // 旧版本遗留的无主日志（userId 字段在旧数据中不存在，此处用空字符串标记）
    await prisma.gameLog.deleteMany({ where: { userId: '' } });

    return NextResponse.json({
      user: { id: user.id, username: user.username },
      token: sessionToken,
    });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: '注册失败，请稍后重试' }, { status: 500 });
  }
}