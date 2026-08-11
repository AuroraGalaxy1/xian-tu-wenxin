'use client';

interface RealmData {
  realm: string;
  count: number;
}

interface RealmDistributionProps {
  data: RealmData[];
  totalPlayers: number;
}

export function RealmDistribution({ data, totalPlayers }: RealmDistributionProps) {
  if (data.length === 0) {
    return (
      <div className="glass-panel-light rounded-lg p-4">
        <h3 className="text-sm text-[#C9A04E] mb-3">◈ 境界分布</h3>
        <div className="text-xs text-[#8B7A5E]/50 text-center py-6">
          暂无玩家数据
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel-light rounded-lg p-4">
      <h3 className="text-sm text-[#C9A04E] mb-3">◈ 境界分布</h3>
      <div className="space-y-2.5">
        {data.map((item) => {
          const percentage = totalPlayers > 0 ? (item.count / totalPlayers) * 100 : 0;
          return (
            <div key={item.realm} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-[#D4C9B8]">{item.realm}</span>
                <span className="text-[#C9A04E] font-medium">
                  {item.count} 人
                  <span className="text-[#8B7A5E] font-normal ml-1">
                    ({percentage.toFixed(1)}%)
                  </span>
                </span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill gold"
                  style={{ width: `${Math.max(percentage, 0.5)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}