'use client';

import { useEffect, useState, useCallback } from 'react';
import { PlayerTable, type PlayerRow } from '@/components/admin/PlayerTable';
import { useAuthStore } from '@/stores/authStore';

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<PlayerRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const token = useAuthStore.getState().token;
      if (!token) {
        setLoading(false);
        return;
      }
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      params.set('page', String(page));

      const res = await fetch(`/api/admin/players?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('获取玩家列表失败');
      const data = await res.json();
      setPlayers(data.players);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const handleSearch = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#E8DCC8]">👥 玩家列表</h1>
        <p className="text-xs text-[#8B7A5E] mt-1">查看所有注册用户及其修士信息</p>
      </div>

      <PlayerTable
        players={players}
        total={total}
        page={page}
        totalPages={totalPages}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
}