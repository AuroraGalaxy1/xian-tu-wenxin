'use client';

import { SceneAction } from '@/types/scene';
import { BookOpen, Search, Coffee, DoorOpen, FileText, User, MapPin } from 'lucide-react';

interface SceneButtonsProps {
  actions: SceneAction[];
  sceneId: string;
  onAction: (action: SceneAction) => void;
}

const iconMap: Record<string, any> = {
  BookOpen,
  Search,
  Coffee: Coffee,
  DoorOpen,
  FileText,
  User,
  MapPin,
};

export const SceneButtons = ({ actions, sceneId, onAction }: SceneButtonsProps) => {
  const defaultActions: SceneAction[] = [
    { id: 'view_detail', label: '查看详情', icon: 'BookOpen', description: '仔细观察当前场景', action: () => {} },
    { id: 'explore', label: '探查四周', icon: 'Search', description: '消耗神识扫描周围', action: () => {} },
    { id: 'meditate', label: '打坐调息', icon: 'Coffee', description: '尝试感应灵气', action: () => {} },
    { id: 'enter_temple', label: '探索庙内', icon: 'DoorOpen', description: '进入破庙内部', action: () => {} },
    { id: 'check_stele', label: '翻阅残碑', icon: 'FileText', description: '查看庙外断碑', action: () => {} },
    { id: 'check_self', label: '检查自身', icon: 'User', description: '查看自身状态', action: () => {} },
    { id: 'leave', label: '尝试离开', icon: 'MapPin', description: '离开当前场景', action: () => {} },
  ];

  const displayActions = actions.length > 0 ? actions : defaultActions;

  // 特殊按钮样式映射
  const getButtonStyle = (id: string) => {
    if (id === 'leave') return 'btn-antique-primary';
    if (id === 'explore') return 'btn-antique-special';
    if (id === 'meditate') return 'btn-antique';
    return 'btn-antique';
  };

  return (
    <div className="grid grid-cols-3 gap-3">
      {displayActions.map((action) => {
        const IconComponent = iconMap[action.icon] || BookOpen;
        const isDisabled = action.condition && !action.condition();
        const btnClass = getButtonStyle(action.id);

        return (
          <button
            key={action.id}
            onClick={() => onAction(action)}
            disabled={isDisabled}
            className={`
              ${btnClass}
              flex flex-col items-center gap-1.5 p-4 rounded-lg
              transition-all duration-200
              ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}
              hover:scale-[1.02]
            `}
          >
            <IconComponent className={`
              w-5 h-5 
              ${isDisabled ? 'text-[#8B7A5E]/50' : 'text-[#D4C9B8]'}
              ${action.id === 'leave' && !isDisabled ? 'text-[#C9A04E]' : ''}
              ${action.id === 'explore' && !isDisabled ? 'text-[#9B6EC9]' : ''}
            `} />
            <span className="text-xs text-[#D4C9B8]">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};