'use client';

import { useLogStore } from '@/stores/logStore';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const LogPanel = () => {
  const { logs } = useLogStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const displayLogs = isExpanded ? logs : logs.slice(-5);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'item': return 'text-[#C9A04E]';
      case 'stat': return 'text-[#4EC9C9]';
      case 'danger': return 'text-[#C94E4E]';
      case 'special': return 'text-[#9B6EC9]';
      case 'combat': return 'text-[#E8A84E]';
      default: return 'text-[#8B7A5E]';
    }
  };

  return (
    <div className="glass-panel-light rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-[#8B7A5E] tracking-widest uppercase">
          ◈ 日志记录
        </span>
        <span className="text-[8px] text-[#8B7A5E]/50">{logs.length}条</span>
      </div>
      <div className="divider-antique" />
      <div className="max-h-40 overflow-y-auto mt-2 space-y-0.5">
        {displayLogs.length === 0 ? (
          <div className="text-xs text-[#8B7A5E]/30 text-center py-4">
            暂无日志
          </div>
        ) : (
          displayLogs.map((log) => (
            <div 
              key={log.id} 
              className={`text-xs ${getLogColor(log.type)} py-1 px-1.5 rounded hover:bg-[#1A1410]/30 transition-colors`}
            >
              <span className="text-[#8B7A5E]/30 mr-2 text-[10px]">{log.timestamp}</span>
              {log.content}
            </div>
          ))
        )}
      </div>
      {logs.length > 5 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-1 text-[10px] text-[#8B7A5E] hover:text-[#D4C9B8] transition-colors flex items-center gap-1"
        >
          {isExpanded ? '收起' : `展开 (${logs.length - 5}条)`}
          <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
};