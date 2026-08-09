'use client';

import { useEffect, useRef } from 'react';

/**
 * 底部状态栏：在线人数 / 延迟为模拟数据。
 * 用 ref 直接更新 DOM，避免每 5 秒触发一次 React 重渲染。
 */
export const BottomBar = () => {
  const onlineRef = useRef<HTMLSpanElement>(null);
  const delayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let online = 12384;
    let delay = 23;

    const updateOnline = () => {
      online = Math.max(10000, online + Math.floor(Math.random() * 10 - 5));
      if (onlineRef.current) onlineRef.current.textContent = online.toLocaleString();
    };
    const updateDelay = () => {
      delay = Math.max(10, Math.min(100, delay + Math.floor(Math.random() * 6 - 3)));
      if (delayRef.current) {
        delayRef.current.textContent = `${delay}ms`;
        delayRef.current.className =
          delay < 30 ? 'text-[#4EC9C9]' : delay < 60 ? 'text-[#C9A04E]' : 'text-[#C94E4E]';
      }
    };

    // 立即更新一次 + 每 5 秒更新
    updateOnline();
    updateDelay();
    const interval = setInterval(() => {
      updateOnline();
      updateDelay();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="h-10 px-6 flex items-center justify-between border-t border-[#C9A04E]/15 bg-[#0D0A08]/90 text-xs text-[#9B8B6C]/70 glass-panel-light">
      <div className="flex items-center gap-6">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4EC9C9] animate-pulse" />
          <span ref={onlineRef}>12,384</span> 人在线
        </span>
        <span className="text-[#8B7A5E]/30">|</span>
        <span>服务器 · 九洲·落星坡</span>
        <span className="text-[#8B7A5E]/30">|</span>
        <span ref={delayRef} className="text-[#4EC9C9]">23ms</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="tracking-wider">v0.1.0</span>
        <span className="text-[#8B7A5E]/20">·</span>
        <span className="tracking-widest">末道纪元 · 第9轮回</span>
      </div>
    </footer>
  );
};