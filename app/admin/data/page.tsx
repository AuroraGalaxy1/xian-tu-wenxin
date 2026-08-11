'use client';

import { itemsData } from '@/lib/gameData/items';
import { scenesData } from '@/lib/gameData/scenes';
import { enemiesData } from '@/lib/gameData/enemies';
import { npcsData } from '@/lib/gameData/npcs';
import { questsData } from '@/lib/gameData/quests';
import { achievementsData } from '@/lib/gameData/achievements';
import { loreData } from '@/lib/gameData/lore';
import { realmsData } from '@/lib/gameData/realms';
import { Map, Swords, Package, Users, ScrollText, Trophy, BookOpen, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface GameDataCategory {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  color: string;
  items: { id: string; name: string; subtitle?: string }[];
}

export default function AdminDataPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const categories: GameDataCategory[] = [
    {
      key: 'scenes',
      label: '场景',
      icon: Map,
      count: Object.keys(scenesData).length,
      color: 'text-[#9B6EC9]',
      items: Object.values(scenesData).map((s) => ({
        id: s.id,
        name: s.name,
        subtitle: s.location.region,
      })),
    },
    {
      key: 'enemies',
      label: '敌人',
      icon: Swords,
      count: Object.keys(enemiesData).length,
      color: 'text-[#C94E4E]',
      items: Object.values(enemiesData).map((e) => ({
        id: e.id,
        name: e.name,
        subtitle: `${e.realm} · HP ${e.hp}`,
      })),
    },
    {
      key: 'items',
      label: '物品',
      icon: Package,
      count: Object.keys(itemsData).length,
      color: 'text-[#4EC9C9]',
      items: Object.values(itemsData).map((i) => ({
        id: i.id,
        name: i.name,
        subtitle: `${i.type} · ${i.rarity}`,
      })),
    },
    {
      key: 'npcs',
      label: 'NPC',
      icon: Users,
      count: Object.keys(npcsData).length,
      color: 'text-[#C9A04E]',
      items: Object.values(npcsData).map((n) => ({
        id: n.id,
        name: n.name,
        subtitle: n.title,
      })),
    },
    {
      key: 'quests',
      label: '任务',
      icon: ScrollText,
      count: Object.keys(questsData).length,
      color: 'text-[#D4C9B8]',
      items: Object.values(questsData).map((q) => ({
        id: q.id,
        name: q.name,
        subtitle: q.type === 'main' ? '主线' : '支线',
      })),
    },
    {
      key: 'achievements',
      label: '成就',
      icon: Trophy,
      count: Object.keys(achievementsData).length,
      color: 'text-[#C9A04E]',
      items: Object.values(achievementsData).map((a) => ({
        id: a.id,
        name: a.name,
        subtitle: a.type,
      })),
    },
    {
      key: 'lore',
      label: '见闻录',
      icon: BookOpen,
      count: Object.keys(loreData).length,
      color: 'text-[#4EC9C9]',
      items: Object.values(loreData).map((l) => ({
        id: l.id,
        name: l.title,
        subtitle: l.category,
      })),
    },
    {
      key: 'realms',
      label: '境界',
      icon: Star,
      count: Object.keys(realmsData).length,
      color: 'text-[#C9A04E]',
      items: Object.values(realmsData).map((r) => ({
        id: r.id,
        name: r.name,
        subtitle: `修为 ${r.xiuweiRequired.toLocaleString()}`,
      })),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#E8DCC8]">📦 游戏数据概览</h1>
        <p className="text-xs text-[#8B7A5E] mt-1">所有游戏静态数据一览</p>
      </div>

      {/* 统计卡片网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setExpanded(expanded === cat.key ? null : cat.key)}
            className="glass-panel-light rounded-lg p-4 text-left transition-all duration-200 hover:shadow-lg hover:border-[#C9A04E]/30"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-[#0A0806]/50 border border-[#8B7A5E]/15`}>
                <cat.icon className={`w-5 h-5 ${cat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#E8DCC8]">{cat.count}</div>
                <div className="text-xs text-[#8B7A5E]">{cat.label}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 展开详情 */}
      {categories
        .filter((cat) => cat.key === expanded)
        .map((cat) => (
          <div key={cat.key} className="glass-panel-light rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-[#C9A04E] flex items-center gap-2">
                <cat.icon className={`w-4 h-4 ${cat.color}`} />
                {cat.label} 列表 ({cat.count})
              </h3>
              <button
                onClick={() => setExpanded(null)}
                className="text-[#8B7A5E] hover:text-[#C9A04E] transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
            </div>
            <div className="divider-antique" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto">
              {cat.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 px-3 rounded hover:bg-[#C9A04E]/5 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[#D4C9B8] truncate">{item.name}</span>
                    <span className="text-[#8B7A5E] text-[10px] shrink-0">({item.id})</span>
                  </div>
                  {item.subtitle && (
                    <span className="text-[#8B7A5E] text-[10px] shrink-0 ml-2">{item.subtitle}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}