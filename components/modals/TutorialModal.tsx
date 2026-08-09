'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Compass, BookOpen, Sword, Sparkles, ScrollText, Backpack, Map } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { useTutorialStore } from '@/stores/tutorialStore';

interface TutorialPage {
  title: string;
  icon: typeof BookOpen;
  content: string[];
  color: string;
}

const PAGES: TutorialPage[] = [
  {
    title: '仙途·问心',
    icon: Sparkles,
    color: 'text-[#C9A04E]',
    content: [
      '末道末年，天地灵气日渐稀薄，修仙之路愈发艰难。',
      '你从昏迷中醒来，发现自己身处一座破败的山神庙中。眉心隐隐发烫，似有什么在呼唤你……',
      '在这片名为「落星坡」的荒芜之地，你将踏上一段寻道问心的修行之旅。',
      '—— 或登临绝顶，或堕入凡尘，皆在一念之间。',
    ],
  },
  {
    title: '界面布局',
    icon: Compass,
    color: 'text-[#4EC9C9]',
    content: [
      '◈ 左侧面板：修行状态（道心/灵蕴/体魄/神识/因果/执念）+ 快捷功能入口',
      '◈ 中央面板：当前场景描述，以及场景内可执行的动作按钮',
      '◈ 右侧面板：日志记录、任务追踪',
      '◈ 顶部栏：境界信息、功能图标',
      '◈ 右下角：罗盘地图，指引方向，点击可查看完整地图',
    ],
  },
  {
    title: '探索与战斗',
    icon: Sword,
    color: 'text-[#C94E4E]',
    content: [
      '◈「探查四周」消耗神识扫描周围，可能发现妖兽或奇遇（25%概率触发随机事件）',
      '◈ 遭遇妖兽进入回合制战斗：攻击 / 重击（消耗气血）/ 防御（减伤）/ 使用丹药 / 逃跑',
      '◈ 击败妖兽可获得修为、灵石和材料，并完成相关任务目标',
      '◈ 注意：神识不足时无法探查，可打坐调息恢复',
    ],
  },
  {
    title: '修炼与突破',
    icon: Sparkles,
    color: 'text-[#9B6EC9]',
    content: [
      '◈「打坐调息」感应天地灵气，增长修为',
      '◈ 修为累积到一定程度，配合道心、灵蕴等属性，可尝试突破境界',
      '◈ 境界体系共十二重：感气→通脉→凝液→玉府→婴胎→神游→炼神→开界→合道→历劫→忘机→超脱',
      '◈ 注意：执念过高（≥70）会心魔缠身，无法突破，需先化解执念',
    ],
  },
  {
    title: '任务与成长',
    icon: ScrollText,
    color: 'text-[#E8A84E]',
    content: [
      '◈ 主线任务指引你的修行之路，完成任务可获得丰厚奖励',
      '◈「背包」存放丹药、法宝、材料等物品，可在背包中查看和使用',
      '◈「见闻录」记录你在这片大陆的见闻，解锁更多世界观',
      '◈ 坊市可购买丹药和装备，与 NPC 对话可获得线索',
      '◈ 每日签到有丰厚奖励，连续签到天数越多奖励越好！',
    ],
  },
];

export const TutorialModal = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const { closeTutorial } = useUiStore();
  const { skipTutorial, closeModal } = useTutorialStore();

  const page = PAGES[pageIndex];
  const isLastPage = pageIndex === PAGES.length - 1;
  const isFirstPage = pageIndex === 0;
  const totalPages = PAGES.length;

  const handleNext = () => {
    if (isLastPage) {
      // 最后一页已由「开始引导」按钮处理，此处不会执行
      closeModal();
    } else {
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstPage) {
      setPageIndex(pageIndex - 1);
    }
  };

  const handleSkip = () => {
    skipTutorial();
    closeTutorial();
  };

  const handleStartTour = () => {
    // 进入 Tour 模式（关闭 modal 阶段，开启 tour 阶段）
    closeModal();
  };

  const IconComponent = page.icon;

  return (
    <motion.div
      className="glass-panel border-antique-thick rounded-2xl p-6 text-[#F0E8D8] relative max-w-lg mx-auto"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
    >
      {/* 关闭按钮 */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 text-[#8B7A5E] hover:text-[#D4C9B8] transition-colors"
        title="跳过引导"
      >
        <X className="w-4 h-4" />
      </button>

      {/* 顶部标志 */}
      <div className="text-center mb-4">
        <span className="text-[#C9A04E] text-2xl">☯</span>
      </div>

      {/* 标题 */}
      <div className="flex items-center gap-2 mb-3">
        <IconComponent className={`w-5 h-5 ${page.color}`} />
        <h3 className="text-lg font-bold tracking-wider">{page.title}</h3>
      </div>
      <div className="divider-antique mb-4" />

      {/* 内容 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pageIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-3 min-h-[200px]"
        >
          {page.content.map((line, i) => (
            <p
              key={i}
              className={`text-sm leading-relaxed ${
                i === 0 && pageIndex === 0
                  ? 'text-[#E8DCC8] font-medium'
                  : 'text-[#D4C9B8]'
              }`}
            >
              {line}
            </p>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* 进度指示器 */}
      <div className="flex items-center justify-center gap-2 my-5">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPageIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === pageIndex
                ? 'bg-[#C9A04E] w-4'
                : 'bg-[#8B7A5E]/30 hover:bg-[#8B7A5E]/50'
            }`}
            title={`第 ${i + 1} 页`}
          />
        ))}
      </div>

      {/* 底部按钮 */}
      <div className="flex items-center justify-between gap-3">
        {/* 左：上一页 / 跳过 */}
        {isFirstPage ? (
          <button
            onClick={handleSkip}
            className="text-xs text-[#8B7A5E] hover:text-[#D4C9B8] transition-colors px-3 py-1.5"
          >
            跳过引导
          </button>
        ) : (
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 text-xs text-[#8B7A5E] hover:text-[#D4C9B8] transition-colors px-3 py-1.5"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            上一页
          </button>
        )}

        {/* 右：下一页 / 开始引导 */}
        {isLastPage ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartTour}
              className="btn-antique btn-antique-primary px-4 py-1.5 text-xs"
            >
              ✦ 开始引导
            </button>
            <button
              onClick={handleSkip}
              className="text-xs text-[#8B7A5E] hover:text-[#D4C9B8] transition-colors px-3 py-1.5"
            >
              直接开始
            </button>
          </div>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-1 text-xs text-[#C9A04E] hover:text-[#E8DCC8] transition-colors px-3 py-1.5"
          >
            下一页
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
};