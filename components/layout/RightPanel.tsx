'use client';

import { TaskPanel } from '@/components/game/TaskPanel';
import { PlayerList } from '@/components/game/PlayerList';
import { RelationshipOverview } from '@/components/game/RelationshipOverview';

export const RightPanel = () => {
  return (
    <aside className="w-80 border-l border-[#C9A04E]/15 p-4 bg-[#0D0A08]/85 flex flex-col gap-4 overflow-y-auto">
      <TaskPanel />
      <div className="divider-antique" />
      <RelationshipOverview />
      <div className="divider-antique" />
      <PlayerList />
    </aside>
  );
};