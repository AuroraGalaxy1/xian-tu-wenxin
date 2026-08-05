'use client';

import { useSceneStore } from '@/stores/sceneStore';
import { useLogStore } from '@/stores/logStore';
import { usePlayerStore } from '@/stores/playerStore';
import { SceneButtons } from '@/components/game/SceneButtons';
import { CompassMap } from '@/components/game/CompassMap';
import { SceneAction } from '@/types/scene';

export const CenterPanel = () => {
  const currentScene = useSceneStore((state) => state.currentScene);
  const { addLog } = useLogStore();
  const player = usePlayerStore((state) => state.player);
  const changeScene = usePlayerStore((state) => state.changeScene);

  const handleAction = (action: SceneAction) => {
    if (action.condition && !action.condition()) {
      addLog('条件不足，无法执行此操作。', 'normal');
      return;
    }

    switch (action.id) {
      case 'view_detail':
        addLog('你仔细观察四周，发现神像底座似乎有字...', 'normal');
        break;
      case 'explore':
        if (player && player.stats.shenshi >= 5) {
          addLog('你凝神探查，发现庙外草丛中有三只低阶妖兽徘徊。', 'special');
          const updateStats = usePlayerStore.getState().updateStats;
          updateStats({ shenshi: player.stats.shenshi - 2 });
        } else {
          addLog('你的神识不足，无法探查。', 'normal');
        }
        break;
      case 'meditate':
        addLog('你盘膝坐下，尝试感应天地灵气...', 'normal');
        const gainXiuwei = usePlayerStore.getState().gainXiuwei;
        gainXiuwei(10);
        addLog('修为 +10', 'stat');
        break;
      case 'leave':
        addLog('你握紧玉简碎片，心中忽然多了一个方向感——东南方。', 'special');
        addLog('你决定前往「灵脉交汇之眼」...', 'normal');
        changeScene('shan_gu');
        const setScene = useSceneStore.getState().setCurrentScene;
        setScene('shan_gu');
        break;
      default:
        addLog(`执行操作：${action.label}`, 'normal');
    }
  };

  if (!currentScene || !player) {
    return (
      <main className="flex-1 p-8 overflow-y-auto bg-[#0A0806] flex items-center justify-center">
        <div className="text-[#8B7A5E] animate-breathe">加载中...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-[#0D0A08]/40 relative">
      {/* 场景标题 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-[#C9A04E]/40 rounded-full" />
        <h2 className="text-xl font-bold text-[#E8DCC8] tracking-wide">
          {currentScene.name}
        </h2>
        <span className="ml-auto text-[10px] text-[#8B7A5E]/50 tracking-wider">
          {currentScene.location?.region || '未知'} · 第{currentScene.id === 'po_miao' ? '一' : '二'}境
        </span>
      </div>
      
      <div className="divider-antique mb-4" />

      {/* 场景描述 - 增加古风边框 */}
      <div className="border-antique rounded-3xl p-6 bg-[#0A0806]/60 glass-panel">
        <div className="text-sm text-[#D9CCB2] leading-relaxed space-y-2">
          <p>{currentScene.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-4 text-xs text-[#8B7A5E] pt-3 mt-3 border-t border-[#8B7A5E]/10">
          <span>🧭 方位：{currentScene.location?.region || '未知'}</span>
          <span>⚡ 灵气：{currentScene.atmosphere?.lingqi || '未知'}</span>
          <span>⏰ 时辰：{currentScene.atmosphere?.time || '未知'}</span>
          <span className="text-[#8B7A5E]/50">·</span>
          <span className="text-[#8B7A5E]/50">危险：{currentScene.atmosphere?.danger || '低'}</span>
        </div>
      </div>

      {/* 场景按钮 */}
      <div className="mt-6">
        <SceneButtons 
          actions={currentScene.actions} 
          sceneId={currentScene.id}
          onAction={handleAction}
        />
      </div>

      {/* 动态提示 */}
      <div className="mt-5 p-3 rounded-lg border border-[#C9A04E]/15 bg-[#C9A04E]/5">
        <p className="text-xs text-[#C9A04E]/80 flex items-center gap-2">
          <span className="text-[#C9A04E]">✦</span>
          提示：探查四周可发现隐藏线索，打坐调息可获得修为
        </p>
      </div>

      {/* 罗盘 */}
      <div className="absolute bottom-5 right-5 z-10">
        <CompassMap />
      </div>
    </main>
  );
};