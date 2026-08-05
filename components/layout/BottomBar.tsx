'use client';

import { useState, useEffect } from 'react';

export const BottomBar = () => {
  const [onlineCount, setOnlineCount] = useState(12384);
  const [delay, setDelay] = useState(23);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => Math.max(10000, prev + Math.floor(Math.random() * 10 - 5)));
      setDelay(prev => Math.max(10, Math.min(100, prev + Math.floor(Math.random() * 6 - 3))));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="h-10 px-6 flex items-center justify-between border-t border-[#C9A04E]/15 bg-[#0D0A08]/90 text-[10px] text-[#9B8B6C]/70 glass-panel-light">
      <div className="flex items-center gap-6">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4EC9C9] animate-pulse" />
          {onlineCount.toLocaleString()} 人在线
        </span>
        <span className="text-[#8B7A5E]/30">|</span>
        <span>服务器 · 九洲·落星坡</span>
        <span className="text-[#8B7A5E]/30">|</span>
        <span className={delay < 30 ? 'text-[#4EC9C9]' : delay < 60 ? 'text-[#C9A04E]' : 'text-[#C94E4E]'}>
          {delay}ms
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="tracking-wider">v0.1.0</span>
        <span className="text-[#8B7A5E]/20">·</span>
        <span className="tracking-widest">末道纪元 · 第9轮回</span>
      </div>
    </footer>
  );
};