'use client';

import { usePlayerStore } from '@/stores/playerStore';

export const TaskPanel = () => {
  const player = usePlayerStore((state) => state.player);

  const defaultTasks = [
    { id: 'task_1', name: '探查破庙的秘密', desc: '神像底座似乎有字', status: 'pending' },
    { id: 'task_2', name: '寻找离开的方法', desc: '夜路难行，需找到指引', status: 'active' },
    { id: 'task_3', name: '了解自身身世', desc: '眉心温热之谜', status: 'locked' },
  ];

  const tasks = player?.quests?.length ? player.quests : defaultTasks;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'active': return '⟳';
      case 'pending': return '○';
      case 'locked': return '🔒';
      default: return '○';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-[#4EC9C9]';
      case 'active': return 'text-[#C9A04E]';
      case 'pending': return 'text-[#8B7A5E]';
      case 'locked': return 'text-[#8B7A5E]/30';
      default: return 'text-[#8B7A5E]';
    }
  };

  return (
    <div className="glass-panel-light rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-[#8B7A5E] tracking-widest uppercase">
          ◈ 任务指引
        </span>
        <span className="text-[8px] text-[#8B7A5E]/50">
          {tasks.filter((t: any) => t.status === 'active').length} 进行中
        </span>
      </div>
      <div className="divider-antique" />
      <div className="mt-2 space-y-1.5">
        {tasks.map((task: any) => (
          <div key={task.id} className="flex items-start gap-2 text-xs p-1.5 rounded hover:bg-[#1A1410]/30 transition-colors">
            <span className={`${getStatusColor(task.status)} mt-0.5`}>
              {getStatusIcon(task.status)}
            </span>
            <div>
              <div className={`${getStatusColor(task.status)}`}>
                {task.name}
              </div>
              {task.desc && (
                <div className="text-[#8B7A5E]/50 text-[10px]">
                  {task.desc}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="mt-1 text-[10px] text-[#8B7A5E] hover:text-[#D4C9B8] transition-colors">
        查看全部 →
      </button>
    </div>
  );
};