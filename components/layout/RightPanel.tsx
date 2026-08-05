'use client';

import { useLogStore } from '@/stores/logStore';
import { LogPanel } from '@/components/game/LogPanel';
import { TaskPanel } from '@/components/game/TaskPanel';
import { PlayerList } from '@/components/game/PlayerList';

export const RightPanel = () => {
  return (
    <aside className="w-72 border-l border-[#C9A04E]/15 p-4 bg-[#0D0A08]/75 backdrop-blur-sm flex flex-col gap-4 overflow-y-auto">
      <LogPanel />
      <div className="divider-antique" />
      <TaskPanel />
      <div className="divider-antique" />
      <PlayerList />
    </aside>
  );
};