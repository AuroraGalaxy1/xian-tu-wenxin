'use client';

export const PlayerList = () => {
  const nearbyPlayers = [
    { id: 'npc_1', name: '闲云子', realm: '开脉', status: 'online', distance: '500m' },
    { id: 'npc_2', name: '月下客', realm: '凡胎', status: 'offline', distance: '1.2km' },
    { id: 'npc_3', name: '无名枯骨', realm: '已逝', status: 'dead', distance: '--' },
  ];

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'online': return '🟢';
      case 'offline': return '🟡';
      case 'dead': return '⚫';
      default: return '⚪';
    }
  };

  return (
    <div className="glass-panel-light rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-[#8B7A5E] tracking-widest uppercase">
          ◈ 附近道友
        </span>
        <span className="text-[8px] text-[#8B7A5E]/50">{nearbyPlayers.filter(p => p.status === 'online').length} 在线</span>
      </div>
      <div className="divider-antique" />
      <div className="mt-2 space-y-1.5">
        {nearbyPlayers.map((player) => (
          <div key={player.id} className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-[#1A1410]/30 transition-colors">
            <div className="flex items-center gap-2">
              <span>{getStatusDot(player.status)}</span>
              <span className="text-[#D4C9B8]">{player.name}</span>
              <span className="text-[#8B7A5E]/50 text-[10px]">· {player.realm}</span>
            </div>
            <span className="text-[#8B7A5E]/50 text-[10px]">{player.distance}</span>
          </div>
        ))}
      </div>
      <button className="mt-1 text-[10px] text-[#8B7A5E] hover:text-[#D4C9B8] transition-colors">
        查看全部 →
      </button>
    </div>
  );
};