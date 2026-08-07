'use client';

import { useSceneStore } from '@/stores/sceneStore';
import { useLogStore } from '@/stores/logStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useCombatStore } from '@/stores/combatStore';
import { useUiStore } from '@/stores/uiStore';
import { SceneButtons } from '@/components/game/SceneButtons';
import { CompassMap } from '@/components/game/CompassMap';
import { ResourceBar } from '@/components/game/ResourceBar';
import { SceneAction } from '@/types/scene';
import { getRandomEncounter } from '@/lib/utils/gameUtils';
import { getRandomEncounterEvent } from '@/lib/gameData/encounters';
import { getEnemy } from '@/lib/gameData/enemies';
import { itemsData } from '@/lib/gameData/items';

export const CenterPanel = () => {
  const currentScene = useSceneStore((state) => state.currentScene);
  const { addLog } = useLogStore();
  const player = usePlayerStore((state) => state.player);

  /** 探查四周：消耗神识，可能遭遇妖兽 */
  const handleExplore = () => {
    if (!player || !currentScene) return;
    if (player.stats.shenshi < 5) {
      addLog('你的神识不足，无法探查。', 'normal');
      return;
    }
    usePlayerStore.getState().updateStats({ shenshi: player.stats.shenshi - 2 });
    // 25% 概率触发奇遇
    if (Math.random() < 0.25) {
      const enc = getRandomEncounterEvent();
      if (enc) {
        useUiStore.getState().openEncounter(enc.id);
        return;
      }
    }
    if (currentScene.id === 'xi_feng_zhen') {
      addLog('镇上人来人往，一片安宁，没有什么异常。', 'normal');
      return;
    }
    const enemy = getRandomEncounter(currentScene.id);
    if (enemy) {
      addLog(`你凝神探查，忽觉一股凶煞之气逼近——遭遇了「${enemy.name}」！`, 'danger');
      useCombatStore.getState().startCombat(enemy);
    } else {
      addLog('你仔细探查了四周，并没有发现异常。', 'normal');
    }
  };

  const handleAction = (action: SceneAction) => {
    if (action.condition && !action.condition()) {
      addLog('条件不足，无法执行此操作。', 'normal');
      return;
    }
    const type = action.type ?? 'info';
    const payload = action.payload ?? {};

    switch (type) {
      case 'explore':
        handleExplore();
        break;
      case 'meditate':
        useUiStore.getState().setCultivateOpen(true);
        break;
      case 'combat': {
        const enemyId = payload.enemyId;
        const enemy = enemyId
          ? getEnemy(enemyId)
          : currentScene
            ? getRandomEncounter(currentScene.id)
            : null;
        if (enemy) {
          useCombatStore.getState().startCombat(enemy);
        } else {
          addLog('这里没有可挑战的对象。', 'normal');
        }
        break;
      }
      case 'talk':
        if (payload.npcId) useUiStore.getState().openTalk(payload.npcId);
        else addLog('这里没有人可以交谈。', 'normal');
        break;
      case 'shop':
        if (payload.npcId) useUiStore.getState().openShop(payload.npcId);
        else addLog('这里没有商铺。', 'normal');
        break;
      case 'rest':
        usePlayerStore.getState().heal(9999);
        addLog('你在客栈歇了一夜，气血恢复如初。', 'item');
        break;
      case 'gather':
        if (payload.itemId) {
          usePlayerStore.getState().addItem(payload.itemId);
          const it = itemsData[payload.itemId];
          addLog(`你采集到了「${it?.name ?? '物品'}」！`, 'item');
        } else {
          addLog('你搜寻一番，这里空空如也。', 'normal');
        }
        break;
      case 'backpack':
        useUiStore.getState().setBackpackOpen(true);
        break;
      case 'leave':
        addLog('你举目四望，罗盘指向可前往的方向。点击右下角罗盘选择目的地。', 'special');
        break;
      case 'info':
      default:
        addLog(`—— ${action.label} ——`, 'normal');
        addLog(action.description, 'normal');
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
      {/* 玩家状态条 */}
      <ResourceBar />

      {/* 场景标题 */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-[#C9A04E]/40 rounded-full" />
        <h2 className="text-xl font-bold text-[#E8DCC8] tracking-wide">
          {currentScene.name}
        </h2>
        <span className="ml-auto text-xs text-[#A99A80]/70 tracking-wider">
          {currentScene.location?.region || '未知'}
        </span>
      </div>
      
      <div className="divider-antique mb-4" />

      {/* 场景描述 - 增加古风边框 */}
      <div className="border-antique rounded-3xl p-6 bg-[#0A0806]/60 glass-panel">
        <div className="text-base text-[#D9CCB2] leading-relaxed space-y-2">
          <p>{currentScene.description}</p>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm text-[#A99A80] pt-3 mt-3 border-t border-[#8B7A5E]/10">
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
          onAction={handleAction}
        />
      </div>

      {/* 动态提示 */}
      <div className="mt-5 p-3 rounded-lg border border-[#C9A04E]/15 bg-[#C9A04E]/5">
        <p className="text-sm text-[#C9A04E]/80 flex items-center gap-2">
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