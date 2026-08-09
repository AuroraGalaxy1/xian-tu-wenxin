import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const results: Record<string, boolean> = {};

    // player-storage
    if (body['player-storage']) {
      const state = body['player-storage'].state || body['player-storage'];
      await prisma.player.upsert({
        where: { id: 'player_001' },
        update: state,
        create: { ...state, id: 'player_001' },
      });
      results['player-storage'] = true;
    }

    // map-storage
    if (body['map-storage']) {
      const state = body['map-storage'].state || body['map-storage'];
      await prisma.mapState.upsert({
        where: { id: 'default' },
        update: state,
        create: { ...state, id: 'default' },
      });
      results['map-storage'] = true;
    }

    // checkin-storage
    if (body['checkin-storage']) {
      const state = body['checkin-storage'].state || body['checkin-storage'];
      await prisma.checkin.upsert({
        where: { id: 'default' },
        update: state,
        create: { ...state, id: 'default' },
      });
      results['checkin-storage'] = true;
    }

    // achievement-storage
    if (body['achievement-storage']) {
      const state = body['achievement-storage'].state || body['achievement-storage'];
      await prisma.achievement.upsert({
        where: { id: 'default' },
        update: state,
        create: { ...state, id: 'default' },
      });
      results['achievement-storage'] = true;
    }

    // lore-storage
    if (body['lore-storage']) {
      const state = body['lore-storage'].state || body['lore-storage'];
      await prisma.lore.upsert({
        where: { id: 'default' },
        update: state,
        create: { ...state, id: 'default' },
      });
      results['lore-storage'] = true;
    }

    // log-storage
    if (body['log-storage']) {
      const state = body['log-storage'].state || body['log-storage'];
      if (state.logs && Array.isArray(state.logs)) {
        for (const log of state.logs) {
          await prisma.gameLog.create({ data: log });
        }
      }
      results['log-storage'] = true;
    }

    // tutorial-storage
    if (body['tutorial-storage']) {
      const state = body['tutorial-storage'].state || body['tutorial-storage'];
      await prisma.tutorial.upsert({
        where: { id: 'default' },
        update: state,
        create: { ...state, id: 'default' },
      });
      results['tutorial-storage'] = true;
    }

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error('Migration error:', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}