'use client';

import { LogPanel } from '@/components/game/LogPanel';
import { TaskPanel } from '@/components/game/TaskPanel';
import { PlayerList } from '@/components/game/PlayerList';

export const RightPanel = () => {
  return (
<<<<<<< HEAD
    <aside className="w-72 border-l border-[#C9A04E]/15 p-4 bg-[#0D0A08]/75 backdrop-blur-sm flex flex-col gap-4 overflow-y-auto">
=======
    <aside className="w-72 border-l border-[#C9A04E]/15 p-4 bg-[#0D0A08]/85 flex flex-col gap-4 overflow-y-auto">
>>>>>>> 6da646e4e58e870374996db04b7b20524f5ca952
      <LogPanel />
      <div className="divider-antique" />
      <TaskPanel />
      <div className="divider-antique" />
      <PlayerList />
    </aside>
  );
};