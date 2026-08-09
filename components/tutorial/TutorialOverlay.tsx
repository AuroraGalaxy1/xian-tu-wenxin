'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Search, Coffee, BookOpen, Backpack } from 'lucide-react';
import { useTutorialStore } from '@/stores/tutorialStore';

interface TourStep {
  target: string;
  title: string;
  content: string;
  icon: typeof Search;
  /** 工具提示出现的方向 */
  position: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tutorial="explore"]',
    title: '探查四周',
    icon: Search,
    position: 'bottom',
    content: '点击「探查四周」扫描周围，可能发现妖兽或奇遇！每次消耗 2 点神识，有 25% 几率触发随机事件。',
  },
  {
    target: '[data-tutorial="meditate"]',
    title: '打坐调息',
    icon: Coffee,
    position: 'bottom',
    content: '点击「打坐调息」进入修炼面板，感应天地灵气增长修为。修为是突破境界的根本！',
  },
  {
    target: '[data-tutorial="cultivate"]',
    title: '修炼面板',
    icon: BookOpen,
    position: 'right',
    content: '左侧「修炼」按钮可直接打开修炼面板，查看当前境界属性与突破条件。',
  },
  {
    target: '[data-tutorial="backpack"]',
    title: '背包系统',
    icon: Backpack,
    position: 'right',
    content: '「背包」存放丹药、法宝、材料等物品，双击可使用或装备，提升你的战力。',
  },
  {
    target: '[data-tutorial="compass"]',
    title: '罗盘导航',
    icon: Map,
    position: 'left',
    content: '右下角「罗盘」指引方向，点击展开可查看完整地图并选择目的地。',
  },
];

/** 计算目标元素在视口中的位置 */
const getTargetRect = (selector: string): DOMRect | null => {
  const el = document.querySelector(selector);
  if (!el) return null;
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  return el.getBoundingClientRect();
};

/** 根据目标位置与提示方向计算提示卡片的位置 */
const calcTooltipPos = (
  rect: DOMRect,
  position: TourStep['position']
): { left: number; top: number } => {
  const CARD_W = 288; // w-72
  const GAP = 12;
  switch (position) {
    case 'bottom':
      return { left: rect.left, top: rect.bottom + GAP };
    case 'top':
      return { left: rect.left, top: rect.top - GAP };
    case 'right':
      return { left: rect.right + GAP, top: rect.top };
    case 'left':
      return { left: rect.left - CARD_W - GAP, top: rect.top };
  }
};

export const TutorialOverlay = () => {
  const { tourStep, nextTourStep, prevTourStep, completeTutorial, skipTutorial } =
    useTutorialStore();
  const [rect, setRect] = useState<DOMRect | null>(null);

  const step = TOUR_STEPS[tourStep];
  const isLastStep = tourStep === TOUR_STEPS.length - 1;

  // 定位目标元素
  useEffect(() => {
    if (!step) return;
    // 等待滚动动画完成后再测量，确保位置准确
    const timeout = setTimeout(() => {
      setRect(getTargetRect(step.target));
    }, 350);
    return () => clearTimeout(timeout);
  }, [step]);

  // 窗口尺寸变化时重新定位（防抖）
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const onResize = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (step) setRect(getTargetRect(step.target));
      }, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (timer) clearTimeout(timer);
    };
  }, [step]);

  // Escape 键跳过
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skipTutorial();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [skipTutorial]);

  const handleNext = () => {
    if (isLastStep) {
      completeTutorial();
    } else {
      nextTourStep();
    }
  };

  if (!step) return null;

  const IconComponent = step.icon;

  // 计算提示卡片位置（基于视口，自动夹取避免溢出）
  const tooltipPos = rect
    ? (() => {
        const base = calcTooltipPos(rect, step.position);
        const CARD_H = 150;
        const CARD_W = 288;
        const margin = 80;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        return {
          left: Math.max(margin - CARD_W / 2, Math.min(vw - CARD_W - margin / 2, base.left)),
          top: Math.max(margin / 2, Math.min(vh - CARD_H - margin / 2, base.top)),
        };
      })()
    : null;

  return (
    <motion.div
      className="fixed inset-0 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 高亮聚光灯：用巨大阴影遮挡除目标外的区域 */}
      {rect && (
        <div
          className="absolute rounded-lg border-2 border-[#C9A04E] z-10"
          style={{
            left: rect.left - 8,
            top: rect.top - 8,
            width: rect.width + 16,
            height: rect.height + 16,
            boxShadow: '0 0 0 9999px rgba(10,8,6,0.85)',
            transition: 'left 0.3s ease, top 0.3s ease, width 0.3s ease, height 0.3s ease',
          }}
        />
      )}

      {/* 工具提示卡片 */}
      {rect && tooltipPos && (
        <div
          className="absolute z-20"
          style={{ left: tooltipPos.left, top: tooltipPos.top, width: 288 }}
        >
          <motion.div
            className="glass-panel border-antique-thick rounded-xl p-4 text-[#F0E8D8] w-full shadow-2xl shadow-black/60"
            initial={{ opacity: 0, scale: 0.9, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          >
            {/* 标题 */}
            <div className="flex items-center gap-2 mb-2">
              <IconComponent className="w-4 h-4 text-[#C9A04E]" />
              <h4 className="text-sm font-bold text-[#E8DCC8] tracking-wide">
                {step.title}
              </h4>
            </div>
            <p className="text-xs text-[#D4C9B8] leading-relaxed mb-3">
              {step.content}
            </p>

            {/* 步骤指示 + 按钮 */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#8B7A5E]">
                {tourStep + 1} / {TOUR_STEPS.length}
              </span>
              <div className="flex items-center gap-2">
                {tourStep > 0 && (
                  <button
                    onClick={prevTourStep}
                    className="text-xs text-[#8B7A5E] hover:text-[#D4C9B8] transition-colors px-2 py-1"
                  >
                    上一步
                  </button>
                )}
                <button
                  onClick={() => skipTutorial()}
                  className="text-xs text-[#8B7A5E] hover:text-[#D4C9B8] transition-colors px-2 py-1"
                >
                  跳过
                </button>
                <button
                  onClick={handleNext}
                  className="btn-antique btn-antique-primary px-3 py-1 text-xs"
                >
                  {isLastStep ? '✦ 完成' : '下一步'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};