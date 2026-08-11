'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Brain, Heart, Zap, Sword, Package, ScrollText, Map, Swords, HeartHandshake, BookOpen, Trophy, Calendar, MessageCircle } from 'lucide-react';
import { itemsData } from '@/lib/gameData/items';
import { scenesData } from '@/lib/gameData/scenes';
import { enemiesData } from '@/lib/gameData/enemies';
import { questsData } from '@/lib/gameData/quests';
import { npcsData } from '@/lib/gameData/npcs';
import { loreData } from '@/lib/gameData/lore';
import { achievementsData } from '@/lib/gameData/achievements';
import { useAuthStore } from '@/stores/authStore';

interface PlayerDetailData {
  user: { id: string; username: string; createdAt: string };
  player: {
    id: string; name: string; realm: string; realmStage: string;
    daoxin: number; maxDaoxin: number; lingyun: number; maxLingyun: number;
    tipo: number; shenshi: number; yinguo: number; zhinian: number;
    xiuwei: number; hp: number; maxHp: number; lingShi: number;
    currentScene: string; inventory: string; skills: string;
    quests: string; relationships: string; equipment: string;
    visitedScenes: string; killedEnemies: string;
    createdAt: string; updatedAt: string;
  };
  mapState: { currentLocationId: string; unlockedLocations: string; exploredLocations: string } | null;
  checkin: { lastCheckinDate: string | null; consecutiveDays: number } | null;
  achievement: { unlockedIds: string[] } | null;
  lore: { unlockedIds: string[] } | null;
  tutorial: { tutorialCompleted: boolean } | null;
  logs: { id: string; timestamp: string; content: string; type: string }[];
}

function safeParseJSON<T>(str: string, fallback: T): T {
  try { return JSON.parse(str); } catch { return fallback; }
}

function getItemName(id: string): string {
  return itemsData[id]?.name ?? id;
}

function getItemRarity(id: string): string {
  return itemsData[id]?.rarity ?? 'ling';
}

function getSceneName(id: string): string {
  return scenesData[id]?.name ?? id;
}

function getEnemyName(id: string): string {
  return enemiesData[id]?.name ?? id;
}

function getQuestName(id: string): string {
  return questsData[id]?.name ?? id;
}

function getNpcName(id: string): string {
  return npcsData[id]?.name ?? id;
}

function getRarityColor(rarity: string): string {
  const map: Record<string, string> = {
    fan: 'text-[#D4C9B8]',      // 凡
    ling: 'text-[#4EC9C9]',      // 灵
    xuan: 'text-[#9B6EC9]',      // 玄
    di: 'text-[#C9A04E]',        // 地
    tian: 'text-[#C94E4E]',      // 天
  };
  return map[rarity] ?? 'text-[#D4C9B8]';
}

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    completed: 'text-[#4EC9C9]',
    active: 'text-[#C9A04E]',
    pending: 'text-[#8B7A5E]',
    locked: 'text-[#5A4A3A]',
  };
  return map[status] ?? 'text-[#8B7A5E]';
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    completed: '已完成',
    active: '进行中',
    pending: '待接取',
    locked: '未解锁',
  };
  return map[status] ?? status;
}

function getLogTypeColor(type: string): string {
  const map: Record<string, string> = {
    normal: 'text-[#D4C9B8]',
    special: 'text-[#C9A04E]',
    danger: 'text-[#C94E4E]',
    combat: 'text-[#C94E4E]',
    success: 'text-[#4EC9C9]',
  };
  return map[type] ?? 'text-[#D4C9B8]';
}

export default function PlayerDetailPage({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();
  const [data, setData] = useState<PlayerDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory' | 'quests' | 'logs' | 'combat'>('overview');

  useEffect(() => {
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
        const res = await fetch(`/api/admin/players/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401) throw new Error('未登录');
          throw new Error('获取玩家详情失败');
        }
        const json: PlayerDetailData = await res.json();
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '获取玩家详情失败');
          setLoading(false);
        }
      }
    };

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
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-[#C9A04E] animate-breathe text-lg">✦ 加载中 ...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-[#C94E4E] text-center">
          <p className="text-lg mb-2">✧ 加载失败</p>
          <p className="text-sm text-[#8B7A5E]">{error}</p>
        </div>
      </div>
    );
  }

  const { user, player, mapState, checkin, achievement, lore, tutorial, logs } = data;
  const inventory = safeParseJSON<string[]>(player.inventory, []);
  const skills = safeParseJSON<string[]>(player.skills, []);
  const quests = safeParseJSON<{ id: string; status: string }[]>(player.quests, []);
  const relationships = safeParseJSON<Record<string, number>>(player.relationships, {});
  const equipment = safeParseJSON<{ weapon?: string; armor?: string; accessory?: string }>(player.equipment, {});
  const visitedScenes = safeParseJSON<string[]>(player.visitedScenes, []);
  const killedEnemies = safeParseJSON<string[]>(player.killedEnemies, []);

  const tabs = [
    { key: 'overview' as const, label: '概览', icon: Shield },
    { key: 'inventory' as const, label: '背包', icon: Package },
    { key: 'quests' as const, label: '任务', icon: ScrollText },
    { key: 'combat' as const, label: '战斗', icon: Swords },
    { key: 'logs' as const, label: '日志', icon: MessageCircle },
  ];

  return (
    <div className="space-y-6">
      {/* 返回按钮 + 标题 */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/players')}
          className="p-1.5 rounded border border-[#8B7A5E]/20 text-[#8B7A5E] hover:text-[#C9A04E] hover:border-[#C9A04E]/40 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-[#E8DCC8]">{player.name}</h1>
          <p className="text-xs text-[#8B7A5E]">{user.username} · {user.id}</p>
        </div>
      </div>

      {/* Tab 导航 */}
      <div className="flex gap-1 border-b border-[#C9A04E]/15">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-1.5 px-4 py-2.5 text-xs transition-colors border-b-2 -mb-[1px]
                ${isActive
                  ? 'text-[#C9A04E] border-[#C9A04E]'
                  : 'text-[#8B7A5E] border-transparent hover:text-[#D4C9B8]'}
              `}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 概览 Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* 基本信息 */}
          <div className="glass-panel-light rounded-lg p-4 space-y-3 lg:col-span-1">
            <h3 className="text-sm text-[#C9A04E]">◈ 基本信息</h3>
            <div className="divider-antique" />
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8B7A5E]">道号</span>
                <span className="text-[#D4C9B8]">{player.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7A5E]">境界</span>
                <span className="text-[#C9A04E]">{player.realm} · {player.realmStage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7A5E]">修为</span>
                <span className="text-[#D4C9B8]">{player.xiuwei.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7A5E]">灵石</span>
                <span className="text-[#C9A04E]">{player.lingShi.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7A5E]">气血</span>
                <span className="text-[#D4C9B8]">{player.hp} / {player.maxHp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7A5E]">当前场景</span>
                <span className="text-[#D4C9B8] truncate max-w-[140px]" title={player.currentScene}>
                  {getSceneName(player.currentScene)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7A5E]">创建时间</span>
                <span className="text-[#D4C9B8]">{new Date(player.createdAt).toLocaleString('zh-CN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7A5E]">更新时间</span>
                <span className="text-[#D4C9B8]">{new Date(player.updatedAt).toLocaleString('zh-CN')}</span>
              </div>
            </div>
          </div>

          {/* 四维属性 + 修行 */}
          <div className="glass-panel-light rounded-lg p-4 space-y-3 lg:col-span-1">
            <h3 className="text-sm text-[#C9A04E]">◈ 修行状态</h3>
            <div className="divider-antique" />
            {/* 道心 */}
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-[#D4C9B8]">道心</span>
                <span className="text-[#C9A04E]">{player.daoxin}/{player.maxDaoxin}</span>
              </div>
              <div className="progress-bar-track mt-1">
                <div className="progress-bar-fill gold" style={{ width: `${(player.daoxin / player.maxDaoxin) * 100}%` }} />
              </div>
            </div>
            {/* 灵蕴 */}
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-[#D4C9B8]">灵蕴</span>
                <span className="text-[#4EC9C9]">{player.lingyun}/{player.maxLingyun}</span>
              </div>
              <div className="progress-bar-track mt-1">
                <div className="progress-bar-fill cyan" style={{ width: `${(player.lingyun / player.maxLingyun) * 100}%` }} />
              </div>
            </div>
            <div className="divider-antique" />
            {/* 四维 */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-[#C94E4E]" />
                <span className="text-[#8B7A5E]">体魄</span>
                <span className="text-[#D4C9B8]">{player.tipo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-[#4EC9C9]" />
                <span className="text-[#8B7A5E]">神识</span>
                <span className="text-[#D4C9B8]">{player.shenshi}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className={`w-3.5 h-3.5 ${player.yinguo >= 0 ? 'text-[#4EC9C9]' : 'text-[#C94E4E]'}`} />
                <span className="text-[#8B7A5E]">因果</span>
                <span className="text-[#D4C9B8]">{player.yinguo >= 0 ? '+' : ''}{player.yinguo}</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#9B6EC9]" />
                <span className="text-[#8B7A5E]">执念</span>
                <span className="text-[#D4C9B8]">{player.zhinian}</span>
              </div>
            </div>
          </div>

          {/* 关联数据 */}
          <div className="glass-panel-light rounded-lg p-4 space-y-3 lg:col-span-1">
            <h3 className="text-sm text-[#C9A04E]">◈ 关联数据</h3>
            <div className="divider-antique" />
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8B7A5E] flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#C9A04E]" /> 成就
                </span>
                <span className="text-[#D4C9B8]">{achievement?.unlockedIds.length ?? 0} 个</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7A5E] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#4EC9C9]" /> 见闻录
                </span>
                <span className="text-[#D4C9B8]">{lore?.unlockedIds.length ?? 0} 篇</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7A5E] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C9A04E]" /> 签到
                </span>
                <span className="text-[#D4C9B8]">
                  {checkin ? `${checkin.consecutiveDays} 天连续` : '未签到'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7A5E] flex items-center gap-1.5">
                  <Map className="w-3.5 h-3.5 text-[#9B6EC9]" /> 新手指引
                </span>
                <span className={tutorial?.tutorialCompleted ? 'text-[#4EC9C9]' : 'text-[#C9A04E]'}>
                  {tutorial?.tutorialCompleted ? '已完成' : '进行中'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7A5E]">已探索场景</span>
                <span className="text-[#D4C9B8]">{visitedScenes.length} 个</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7A5E]">已击杀敌人</span>
                <span className="text-[#D4C9B8]">{killedEnemies.length} 种</span>
              </div>
            </div>
          </div>

          {/* 装备栏 */}
          <div className="glass-panel-light rounded-lg p-4 space-y-3 lg:col-span-3">
            <h3 className="text-sm text-[#C9A04E]">◈ 已装备</h3>
            <div className="divider-antique" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['weapon', 'armor', 'accessory'] as const).map((slot) => {
                const itemId = equipment[slot];
                const slotLabels: Record<string, string> = { weapon: '武器', armor: '护甲', accessory: '饰品' };
                const slotIcons: Record<string, React.ReactNode> = {
                  weapon: <Sword className="w-4 h-4 text-[#C94E4E]" />,
                  armor: <Shield className="w-4 h-4 text-[#4EC9C9]" />,
                  accessory: <Zap className="w-4 h-4 text-[#9B6EC9]" />,
                };
                return (
                  <div key={slot} className="border border-[#8B7A5E]/15 rounded p-3">
                    <div className="flex items-center gap-2 mb-2">
                      {slotIcons[slot]}
                      <span className="text-xs text-[#8B7A5E]">{slotLabels[slot]}</span>
                    </div>
                    {itemId ? (
                      <div>
                        <span className={`text-sm ${getRarityColor(getItemRarity(itemId))}`}>
                          {getItemName(itemId)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-[#8B7A5E]/40">空</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 背包 Tab */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 物品列表 */}
          <div className="glass-panel-light rounded-lg p-4 space-y-3">
            <h3 className="text-sm text-[#C9A04E]">◈ 背包物品 ({inventory.length})</h3>
            <div className="divider-antique" />
            {inventory.length === 0 ? (
              <div className="text-xs text-[#8B7A5E]/50 text-center py-6">背包为空</div>
            ) : (
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {inventory.map((itemId, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#C9A04E]/5 text-xs">
                    <span className={`${getRarityColor(getItemRarity(itemId))} truncate`}>
                      {getItemName(itemId)}
                    </span>
                    <span className="text-[#8B7A5E] text-[10px]">({itemId})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 功法技能 */}
          <div className="glass-panel-light rounded-lg p-4 space-y-3">
            <h3 className="text-sm text-[#C9A04E]">◈ 功法技能 ({skills.length})</h3>
            <div className="divider-antique" />
            {skills.length === 0 ? (
              <div className="text-xs text-[#8B7A5E]/50 text-center py-6">无功法</div>
            ) : (
              <div className="space-y-1">
                {skills.map((skillId, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#C9A04E]/5 text-xs">
                    <span className="text-[#D4C9B8] truncate">{getItemName(skillId)}</span>
                    <span className="text-[#8B7A5E] text-[10px]">({skillId})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 好感度 */}
          <div className="glass-panel-light rounded-lg p-4 space-y-3">
            <h3 className="text-sm text-[#C9A04E]">◈ 好感度</h3>
            <div className="divider-antique" />
            {Object.keys(relationships).length === 0 ? (
              <div className="text-xs text-[#8B7A5E]/50 text-center py-6">暂无好感度数据</div>
            ) : (
              <div className="space-y-1">
                {Object.entries(relationships).map(([npcId, value]) => (
                  <div key={npcId} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#C9A04E]/5 text-xs">
                    <span className="text-[#D4C9B8]">{getNpcName(npcId)}</span>
                    <span className="text-[#C9A04E]">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 成就在此 Tab 显示 */}
          <div className="glass-panel-light rounded-lg p-4 space-y-3">
            <h3 className="text-sm text-[#C9A04E]">◈ 成就解锁</h3>
            <div className="divider-antique" />
            {!achievement || achievement.unlockedIds.length === 0 ? (
              <div className="text-xs text-[#8B7A5E]/50 text-center py-6">未解锁成就</div>
            ) : (
              <div className="space-y-1">
                {achievement.unlockedIds.map((id) => (
                  <div key={id} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-[#C9A04E]/5 text-xs">
                    <Trophy className="w-3.5 h-3.5 text-[#C9A04E]" />
                    <span className="text-[#D4C9B8]">{achievementsData[id]?.name ?? id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 任务 Tab */}
      {activeTab === 'quests' && (
        <div className="glass-panel-light rounded-lg p-4 space-y-3">
          <h3 className="text-sm text-[#C9A04E]">◈ 任务列表 ({quests.length})</h3>
          <div className="divider-antique" />
          {quests.length === 0 ? (
            <div className="text-xs text-[#8B7A5E]/50 text-center py-6">无任务数据</div>
          ) : (
            <div className="space-y-1">
              {quests.map((q) => (
                <div key={q.id} className="flex items-center justify-between py-2 px-3 rounded hover:bg-[#C9A04E]/5">
                  <div className="flex items-center gap-2">
                    <ScrollText className="w-4 h-4 text-[#8B7A5E]" />
                    <span className="text-sm text-[#D4C9B8]">{getQuestName(q.id)}</span>
                    <span className="text-[10px] text-[#8B7A5E]">({q.id})</span>
                  </div>
                  <span className={`text-xs ${getStatusColor(q.status)}`}>
                    {getStatusLabel(q.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 战斗 Tab */}
      {activeTab === 'combat' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-panel-light rounded-lg p-4 space-y-3">
            <h3 className="text-sm text-[#C9A04E]">◈ 已击杀敌人 ({killedEnemies.length})</h3>
            <div className="divider-antique" />
            {killedEnemies.length === 0 ? (
              <div className="text-xs text-[#8B7A5E]/50 text-center py-6">未击杀任何敌人</div>
            ) : (
              <div className="space-y-1">
                {killedEnemies.map((enemyId, idx) => (
                  <div key={idx} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-[#C9A04E]/5 text-xs">
                    <Swords className="w-3.5 h-3.5 text-[#C94E4E]" />
                    <span className="text-[#D4C9B8]">{getEnemyName(enemyId)}</span>
                    <span className="text-[#8B7A5E] text-[10px]">({enemyId})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-panel-light rounded-lg p-4 space-y-3">
            <h3 className="text-sm text-[#C9A04E]">◈ 已探索场景 ({visitedScenes.length})</h3>
            <div className="divider-antique" />
            {visitedScenes.length === 0 ? (
              <div className="text-xs text-[#8B7A5E]/50 text-center py-6">未探索场景</div>
            ) : (
              <div className="space-y-1">
                {visitedScenes.map((sceneId, idx) => (
                  <div key={idx} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-[#C9A04E]/5 text-xs">
                    <Map className="w-3.5 h-3.5 text-[#9B6EC9]" />
                    <span className="text-[#D4C9B8]">{getSceneName(sceneId)}</span>
                    <span className="text-[#8B7A5E] text-[10px]">({sceneId})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 日志 Tab */}
      {activeTab === 'logs' && (
        <div className="glass-panel-light rounded-lg p-4 space-y-3">
          <h3 className="text-sm text-[#C9A04E]">◈ 游戏日志 (最近 {logs.length} 条)</h3>
          <div className="divider-antique" />
          {logs.length === 0 ? (
            <div className="text-xs text-[#8B7A5E]/50 text-center py-6">无日志记录</div>
          ) : (
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 py-1.5 px-2 rounded hover:bg-[#C9A04E]/5 text-xs">
                  <span className="text-[#8B7A5E] shrink-0 w-10">{log.timestamp}</span>
                  <span className={`${getLogTypeColor(log.type)}`}>{log.content}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}