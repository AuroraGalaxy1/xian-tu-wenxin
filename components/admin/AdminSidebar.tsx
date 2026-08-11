'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Database,
  ChevronLeft,
  ChevronRight,
  Home,
  User,
  Sword,
  Map,
  BookOpen,
  Package,
  ScrollText,
  Trophy,
  Library,
  Swords,
  Coins,
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const NAV_ITEMS: NavGroup[] = [
  {
    group: '概览',
    items: [
      { href: '/admin', label: '数据看板', icon: LayoutDashboard },
    ],
  },
  {
    group: '用户管理',
    items: [
      { href: '/admin/players', label: '玩家列表', icon: Users },
    ],
  },
  {
    group: '游戏数据',
    items: [
      { href: '/admin/data', label: '数据概览', icon: Database },
    ],
  },
];

export function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname?.startsWith(href) ?? false;
  };

  return (
    <aside
      className={`flex flex-col bg-[#0D0A08] border-r border-[#C9A04E]/20 transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Logo 区域 */}
      <div className="h-14 flex items-center px-4 border-b border-[#C9A04E]/20 shrink-0">
        {collapsed ? (
          <span className="text-[#C9A04E] text-lg mx-auto">☯</span>
        ) : (
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-[#C9A04E] text-lg">☯</span>
            <span className="text-[#E8DCC8] text-sm font-bold tracking-wider">管理后台</span>
          </Link>
        )}
      </div>

      {/* 导航区域 */}
      <nav className="flex-1 overflow-y-auto py-4">
        {NAV_ITEMS.map((group) => (
          <div key={group.group} className="mb-4">
            {!collapsed && (
              <div className="px-4 mb-1 text-[10px] text-[#8B7A5E] tracking-widest uppercase">
                {group.group}
              </div>
            )}
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 text-sm transition-colors relative
                    ${active
                      ? 'text-[#C9A04E] bg-[#C9A04E]/10 border-r-2 border-[#C9A04E]'
                      : 'text-[#D4C9B8] hover:text-[#C9A04E] hover:bg-[#C9A04E]/5'}
                    ${collapsed ? 'justify-center' : ''}
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* 底部 */}
      <div className="border-t border-[#C9A04E]/20">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full h-10 flex items-center justify-center text-[#8B7A5E] hover:text-[#C9A04E] transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        <Link
          href="/"
          className="w-full h-10 flex items-center justify-center gap-2 text-xs text-[#8B7A5E] hover:text-[#C9A04E] border-t border-[#C9A04E]/20 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          {!collapsed && <span>返回游戏</span>}
        </Link>
      </div>
    </aside>
  );
}