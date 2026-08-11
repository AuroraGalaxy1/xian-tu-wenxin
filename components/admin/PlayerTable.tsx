'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export interface PlayerRow {
  userId: string;
  username: string;
  createdAt: string;
  player: {
    id: string;
    name: string;
    realm: string;
    realmStage: string;
    xiuwei: number;
    lingShi: number;
    hp: number;
    maxHp: number;
    currentScene: string;
  } | null;
}

interface PlayerTableProps {
  players: PlayerRow[];
  total: number;
  page: number;
  totalPages: number;
  onSearch: (search: string) => void;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function PlayerTable({
  players,
  total,
  page,
  totalPages,
  onSearch,
  onPageChange,
  loading,
}: PlayerTableProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className="space-y-4">
      {/* 搜索栏 */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8B7A5E] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSearch(searchInput);
            }}
            placeholder="搜索用户名 / 道号..."
            className="w-64 pl-9 pr-3 py-2 text-sm text-[#D4C9B8] bg-[#0A0806]/60 border border-[#8B7A5E]/20 rounded focus:border-[#C9A04E]/40 focus:outline-none placeholder:text-[#8B7A5E]/40 transition-colors"
          />
        </div>
        <span className="text-xs text-[#8B7A5E]">共 {total} 位玩家</span>
      </div>

      {/* 表格 */}
      <div className="glass-panel-light rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#C9A04E]/15 text-left">
              <th className="px-4 py-3 text-xs text-[#C9A04E] font-medium tracking-wider">用户名</th>
              <th className="px-4 py-3 text-xs text-[#C9A04E] font-medium tracking-wider">道号</th>
              <th className="px-4 py-3 text-xs text-[#C9A04E] font-medium tracking-wider">境界</th>
              <th className="px-4 py-3 text-xs text-[#C9A04E] font-medium tracking-wider text-right">修为</th>
              <th className="px-4 py-3 text-xs text-[#C9A04E] font-medium tracking-wider text-right">灵石</th>
              <th className="px-4 py-3 text-xs text-[#C9A04E] font-medium tracking-wider text-right">气血</th>
              <th className="px-4 py-3 text-xs text-[#C9A04E] font-medium tracking-wider">注册时间</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#8B7A5E]">
                  <span className="animate-breathe">✦ 加载中 ...</span>
                </td>
              </tr>
            ) : players.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#8B7A5E]/60">
                  暂无匹配的玩家
                </td>
              </tr>
            ) : (
              players.map((row) => (
                <tr
                  key={row.userId}
                  onClick={() => router.push(`/admin/players/${row.userId}`)}
                  className="border-b border-[#8B7A5E]/10 cursor-pointer transition-colors hover:bg-[#C9A04E]/5"
                >
                  <td className="px-4 py-3 text-[#D4C9B8]">{row.username}</td>
                  <td className="px-4 py-3 text-[#E8DCC8]">{row.player?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    {row.player ? (
                      <span className="text-[#C9A04E]">
                        {row.player.realm} · {row.player.realmStage}
                      </span>
                    ) : (
                      <span className="text-[#8B7A5E]">未创建</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-[#D4C9B8]">
                    {row.player?.xiuwei.toLocaleString() ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-[#C9A04E]">
                    {row.player?.lingShi.toLocaleString() ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-right text-[#D4C9B8]">
                    {row.player ? `${row.player.hp} / ${row.player.maxHp}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-[#8B7A5E]">
                    {new Date(row.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-1.5 rounded border border-[#8B7A5E]/20 text-[#8B7A5E] hover:text-[#C9A04E] hover:border-[#C9A04E]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-[#8B7A5E]">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-1.5 rounded border border-[#8B7A5E]/20 text-[#8B7A5E] hover:text-[#C9A04E] hover:border-[#C9A04E]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}