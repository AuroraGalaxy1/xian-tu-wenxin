'use client';

import { useEffect, useState } from 'react';
import { Users, User, Coins, CheckCircle, Trophy, BookOpen, Map, Calendar, Swords, Star } from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { StatGrid } from '@/components/admin/StatGrid';
import { RealmDistribution } from '@/components/admin/RealmDistribution';
import { useAuthStore } from '@/stores/authStore';

interface AdminStats {
  userCount: number;
  playerCount: number;
  activeUsers: number;
  totalLingShi: number;
  avgLingShi: number;
  realmDistribution: { realm: string; count: number }[];
  totalAchievements: number;
  unlockedAchievements: number;
  totalLore: number;
  unlockedLore: number;
  totalScenes: number;
  totalCheckins: number;
  avgConsecutiveDays: number;
  totalQuestsCompleted: number;
  totalKillCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 等待鉴权完成后再请求数据
    let cancelled = false;

    const load = async () => {
      const { isAuthenticated, token } = useAuthStore.getState();
      if (!isAuthenticated) {
        if (!cancelled) {
          setError('未登录');
          setLoading(false);
        }
        return;
      }
      try {
        const res = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401) throw new Error('未登录');
          throw new Error('获取统计数据失败');
        }
        const data: AdminStats = await res.json();
        if (!cancelled) {
          setStats(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '获取统计数据失败');
          setLoading(false);
        }
      }
    };

    // 订阅鉴权状态，就绪后加载
    if (useAuthStore.getState().isLoading) {
      const unsub = useAuthStore.subscribe((state) => {
        if (!state.isLoading) {
          unsub();
          load();
        }
      });
      return () => {
        cancelled = true;
        unsub();
      };
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-[#C9A04E] animate-breathe text-lg">✦ 加载中 ...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-[#C94E4E] text-center">
          <p className="text-lg mb-2">✧ 加载失败</p>
          <p className="text-sm text-[#8B7A5E]">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#E8DCC8] flex items-center gap-2">
            ☯ 数据看板
          </h1>
          <p className="text-xs text-[#8B7A5E] mt-1">仙途·问心 运营数据概览</p>
        </div>
      </div>

      {/* 用户与玩家概览 */}
      <section>
        <h2 className="text-sm text-[#C9A04E] mb-3 tracking-wider">◈ 用户与玩家</h2>
        <StatGrid>
          <StatCard
            title="注册用户"
            value={stats.userCount}
            icon={Users}
            color="gold"
          />
          <StatCard
            title="修士总数"
            value={stats.playerCount}
            icon={User}
            color="cyan"
          />
          <StatCard
            title="活跃用户"
            value={stats.activeUsers}
            icon={Star}
            subtitle="持有有效会话令牌"
            color="green"
          />
          <StatCard
            title="灵石总量"
            value={stats.totalLingShi.toLocaleString()}
            icon={Coins}
            subtitle={`平均 ${stats.avgLingShi.toLocaleString()} / 人`}
            color="gold"
          />
        </StatGrid>
      </section>

      {/* 境界分布 */}
      <section>
        <RealmDistribution
          data={stats.realmDistribution}
          totalPlayers={stats.playerCount}
        />
      </section>

      {/* 游戏进度 */}
      <section>
        <h2 className="text-sm text-[#C9A04E] mb-3 tracking-wider">◈ 游戏进度</h2>
        <StatGrid cols={4}>
          <StatCard
            title="完成任务"
            value={stats.totalQuestsCompleted}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title="解锁成就"
            value={`${stats.unlockedAchievements} / ${stats.totalAchievements}`}
            icon={Trophy}
            subtitle={`共 ${stats.totalAchievements} 项成就`}
            color="gold"
          />
          <StatCard
            title="解锁见闻"
            value={`${stats.unlockedLore} / ${stats.totalLore}`}
            icon={BookOpen}
            subtitle={`共 ${stats.totalLore} 篇见闻`}
            color="cyan"
          />
          <StatCard
            title="探索场景"
            value={stats.totalScenes}
            icon={Map}
            subtitle="可探索场景总数"
            color="purple"
          />
        </StatGrid>
      </section>

      {/* 战斗与签到 */}
      <section>
        <h2 className="text-sm text-[#C9A04E] mb-3 tracking-wider">◈ 战斗与签到</h2>
        <StatGrid cols={4}>
          <StatCard
            title="总击杀"
            value={stats.totalKillCount}
            icon={Swords}
            color="red"
          />
          <StatCard
            title="总签到人次"
            value={stats.totalCheckins}
            icon={Calendar}
            color="cyan"
          />
          <StatCard
            title="平均连续签到"
            value={`${stats.avgConsecutiveDays} 天`}
            icon={Calendar}
            color="gold"
          />
        </StatGrid>
      </section>
    </div>
  );
}