'use client';

import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  color?: 'gold' | 'cyan' | 'purple' | 'red' | 'green';
}

const colorMap = {
  gold: { icon: 'text-[#C9A04E]', border: 'border-[#C9A04E]/20' },
  cyan: { icon: 'text-[#4EC9C9]', border: 'border-[#4EC9C9]/20' },
  purple: { icon: 'text-[#9B6EC9]', border: 'border-[#9B6EC9]/20' },
  red: { icon: 'text-[#C94E4E]', border: 'border-[#C94E4E]/20' },
  green: { icon: 'text-[#4EC9A0]', border: 'border-[#4EC9A0]/20' },
};

export function StatCard({ title, value, icon: Icon, subtitle, color = 'gold' }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div className={`glass-panel-light rounded-lg p-4 ${colors.border} transition-all duration-200 hover:shadow-lg`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs text-[#8B7A5E] tracking-wider">{title}</span>
          <div className="text-2xl font-bold text-[#E8DCC8]">{value}</div>
          {subtitle && (
            <span className="text-xs text-[#8B7A5E]/80">{subtitle}</span>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-[#0A0806]/50 ${colors.border} border`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
}