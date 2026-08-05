'use client';

import Link from 'next/link';

export default function GamePage() {
  return (
    <div className="min-h-screen bg-[#0A0806] text-[#E5D8B5] flex items-center justify-center">
      <div className="glass-panel-light border-antique rounded-3xl p-8 text-center max-w-lg">
        <h1 className="text-2xl font-bold text-[#E8DCC8] mb-3">☯ 仙途·问心</h1>
        <p className="text-sm text-[#C9BFA0] mb-6">
          修仙之旅，从山神庙开始。
        </p>
        <Link
          href="/"
          className="inline-block btn-antique btn-antique-primary px-8 py-2.5"
        >
          ✦ 踏入修行路
        </Link>
      </div>
    </div>
  );
}
