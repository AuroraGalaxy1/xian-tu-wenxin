'use client';

import { motion } from 'framer-motion';
import { CalendarDays, Gift, X } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { useCheckinStore, CHECKIN_REWARDS } from '@/stores/checkinStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useLogStore } from '@/stores/logStore';
import { itemsData } from '@/lib/gameData/items';

export const CheckinModal = () => {
  const { closeCheckin, setCheckinOpen } = useUiStore();
  const { checkin, hasCheckedInToday, consecutiveDays, getTodayReward } = useCheckinStore();
  const reward = getTodayReward();

  const handleCheckin = () => {
    const result = checkin();
    if (!result) return;

    const ps = usePlayerStore.getState();
    const ls = useLogStore.getState();
    const parts: string[] = [];

    if (result.xiuwei > 0) {
      ps.gainXiuwei(result.xiuwei);
      parts.push(`修为+${result.xiuwei}`);
    }
    if (result.lingShi > 0) {
      ps.gainLingShi(result.lingShi);
      parts.push(`灵石+${result.lingShi}`);
    }
    if (result.daoxin > 0) {
      const p = ps.player;
      if (p) {
        ps.updateStats({
          daoxin: Math.min(p.stats.maxDaoxin, p.stats.daoxin + result.daoxin),
        });
      }
      parts.push(`道心+${result.daoxin}`);
    }
    if (result.lingyun > 0) {
      const p = ps.player;
      if (p) {
        ps.updateStats({
          lingyun: Math.min(p.stats.maxLingyun, p.stats.lingyun + result.lingyun),
        });
      }
      parts.push(`灵蕴+${result.lingyun}`);
    }
    if (result.tipo > 0) {
      ps.updateStats({ tipo: (ps.player?.stats.tipo ?? 0) + result.tipo });
      parts.push(`体魄+${result.tipo}`);
    }
    if (result.items.length > 0) {
      result.items.forEach((it) => {
        for (let i = 0; i < it.count; i++) ps.addItem(it.itemId);
      });
      parts.push(result.items.map((it) => `${itemsData[it.itemId]?.name ?? it.itemId}×${it.count}`).join('、'));
    }

    ls.addLog(`📅 签到成功！${parts.join('，')}`, 'special');

    // 关闭弹窗
    closeCheckin();
  };

  const isCheckedIn = hasCheckedInToday();

  return (
    <motion.div
      className="glass-panel border-antique-thick rounded-2xl p-6 text-[#F0E8D8] relative max-w-lg mx-auto"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
    >
      {/* 关闭按钮 */}
      <button
        onClick={closeCheckin}
        className="absolute top-4 right-4 text-[#8B7A5E] hover:text-[#D4C9B8] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      {/* 标题 */}
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="w-5 h-5 text-[#C9A04E]" />
        <h3 className="text-lg font-bold tracking-wider">☯ 每日签到</h3>
      </div>
      <div className="divider-antique mb-4" />

      <p className="text-sm text-[#8B7A5E] mb-4">
        每日签到获取奖励，连续签到天数越多，奖励越丰厚！
      </p>

      {/* 连续签到天数 */}
      <div className="text-center mb-4">
        <span className="text-[#C9A04E] text-2xl font-bold">{consecutiveDays}</span>
        <span className="text-[#8B7A5E] text-sm ml-1">/ 7 天连续签到</span>
      </div>

      {/* 奖励列表 */}
      <div className="space-y-1.5 mb-5">
        {CHECKIN_REWARDS.map((r, i) => {
          const isToday = r.day === reward.day;
          const isPast = r.day < (isCheckedIn ? consecutiveDays : reward.day);
          const isFuture = !isToday && !isPast;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                isToday
                  ? 'bg-[#C9A04E]/10 border border-[#C9A04E]/30'
                  : isPast
                  ? 'bg-[#0A0806]/30 border border-[#8B7A5E]/10'
                  : 'bg-[#0A0806]/20 border border-[#8B7A5E]/5 opacity-40'
              }`}
            >
              {/* 天数标记 */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isToday
                    ? 'bg-[#C9A04E] text-[#0A0806]'
                    : isPast
                    ? 'bg-[#8B7A5E]/30 text-[#8B7A5E]'
                    : 'bg-[#0A0806]/50 text-[#8B7A5E]/50'
                }`}
              >
                {isPast ? '✓' : `第${r.day}日`}
              </div>

              {/* 奖励内容 */}
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-medium ${isToday ? 'text-[#C9A04E]' : 'text-[#D4C9B8]'}`}>
                  {r.label}
                </div>
                <div className="text-xs text-[#8B7A5E] truncate">
                  {[
                    r.xiuwei > 0 && `修为+${r.xiuwei}`,
                    r.lingShi > 0 && `灵石+${r.lingShi}`,
                    r.daoxin > 0 && `道心+${r.daoxin}`,
                    r.lingyun > 0 && `灵蕴+${r.lingyun}`,
                    r.tipo > 0 && `体魄+${r.tipo}`,
                    r.items.length > 0 && r.items.map((it) => `${itemsData[it.itemId]?.name ?? it.itemId}×${it.count}`).join('、'),
                  ]
                    .filter(Boolean)
                    .join(' | ')}
                </div>
              </div>

              {/* 今日标记 */}
              {isToday && (
                <span className="text-xs text-[#C9A04E] font-medium shrink-0">
                  👈 今日
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* 签到按钮 */}
      <button
        onClick={handleCheckin}
        disabled={isCheckedIn}
        className={`w-full py-2.5 text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${
          isCheckedIn
            ? 'bg-[#8B7A5E]/20 text-[#8B7A5E] cursor-not-allowed'
            : 'btn-antique btn-antique-primary'
        }`}
      >
        <Gift className="w-4 h-4" />
        {isCheckedIn ? '今日已签到' : '✦ 领取今日奖励'}
      </button>
    </motion.div>
  );
};