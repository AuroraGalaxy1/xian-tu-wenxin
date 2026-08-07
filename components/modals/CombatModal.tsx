'use client';

import { motion } from 'framer-motion';
import { Sword, Shield, Zap, FlaskConical, Footprints } from 'lucide-react';
import { useCombatStore } from '@/stores/combatStore';
import { useUiStore } from '@/stores/uiStore';

export const CombatModal = () => {
  const s = useCombatStore();
  const openBackpack = () => useUiStore.getState().setBackpackOpen(true);

  if (!s.enemy) return null;

  const enemyHpPct = Math.max(0, (s.enemyHp / s.enemyMaxHp) * 100);
  const playerHpPct = Math.max(0, (s.playerHp / s.playerMaxHp) * 100);
  const isPlayerTurn = s.phase === 'player_turn';

  return (
    <motion.div
      className="glass-panel border-antique-thick rounded-2xl p-6 text-[#F0E8D8] relative"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
    >
      <h3 className="text-lg font-bold tracking-wider mb-3">⚔ 战斗</h3>
      <div className="divider-antique mb-4" />

      {/* 敌人 */}
      <div className="border-antique rounded-xl p-4 bg-[#0A0806]/50 mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#E8A84E] font-medium">{s.enemy.name}</span>
          <span className="text-xs text-[#8B7A5E]">{s.enemy.realm}</span>
        </div>
        <div className="progress-bar-track mb-2">
          <div className="progress-bar-fill" style={{ width: `${enemyHpPct}%`, background: 'linear-gradient(90deg,#E86A6A,#C94E4E)' }} />
        </div>
        <div className="flex justify-between text-xs text-[#8B7A5E]/60">
          <span>{s.enemyHp}/{s.enemyMaxHp}</span>
          <span>攻 {s.enemy.atk} · 防 {s.enemy.def}</span>
        </div>
      </div>

      {/* 玩家 */}
      <div className="border-antique rounded-xl p-4 bg-[#0A0806]/50 mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[#4EC9C9] font-medium">你 · 无名修士</span>
          <span className="text-xs text-[#8B7A5E]">攻 {s.playerAtk} · 防 {s.playerDef}</span>
        </div>
        <div className="progress-bar-track mb-1">
          <div className="progress-bar-fill" style={{ width: `${playerHpPct}%`, background: 'linear-gradient(90deg,#4EC9C9,#2E9E9E)' }} />
        </div>
        <div className="flex justify-between text-xs text-[#8B7A5E]/60">
          <span>{s.playerHp}/{s.playerMaxHp}</span>
          <span>{s.defending ? '🛡 防御中' : '气血'}</span>
        </div>
      </div>

      {/* 指令 */}
      {isPlayerTurn ? (
        <div className="grid grid-cols-5 gap-2 mb-4">
          <button onClick={s.attack} className="btn-antique btn-antique-danger flex flex-col items-center gap-1 py-2.5">
            <Sword className="w-4 h-4" />
            <span className="text-xs">攻击</span>
          </button>
          <button
            onClick={s.heavyAttack}
            disabled={s.heavyCooldown > 0}
            className="btn-antique flex flex-col items-center gap-1 py-2.5"
          >
            <Zap className="w-4 h-4 text-[#C9A04E]" />
            <span className="text-xs">重击{s.heavyCooldown > 0 ? `(${s.heavyCooldown})` : ''}</span>
          </button>
          <button onClick={s.defend} className="btn-antique flex flex-col items-center gap-1 py-2.5">
            <Shield className="w-4 h-4 text-[#4EC9C9]" />
            <span className="text-xs">防御</span>
          </button>
          <button onClick={openBackpack} className="btn-antique flex flex-col items-center gap-1 py-2.5">
            <FlaskConical className="w-4 h-4 text-[#9B6EC9]" />
            <span className="text-xs">物品</span>
          </button>
          <button onClick={s.flee} className="btn-antique flex flex-col items-center gap-1 py-2.5">
            <Footprints className="w-4 h-4 text-[#8B7A5E]" />
            <span className="text-xs">逃跑</span>
          </button>
        </div>
      ) : s.phase === 'enemy_turn' ? (
        <div className="text-center text-xs text-[#C9A04E] animate-pulse mb-4">敌人行动中…</div>
      ) : s.phase === 'victory' ? (
        <div className="text-center mb-4">
          <div className="text-[#4EC9C9] text-sm mb-2">✦ 战斗胜利！</div>
          <button onClick={s.claimVictory} className="btn-antique btn-antique-primary px-6 py-2 text-sm">
            收下战利品
          </button>
        </div>
      ) : s.phase === 'defeat' ? (
        <div className="text-center mb-4">
          <div className="text-[#C94E4E] text-sm mb-2">你倒下了…</div>
          <button onClick={s.claimDefeat} className="btn-antique px-6 py-2 text-sm">确认</button>
        </div>
      ) : s.phase === 'fled' ? (
        <div className="text-center mb-4">
          <div className="text-[#8B7A5E] text-sm mb-2">你逃出了战斗</div>
          <button onClick={s.claimFled} className="btn-antique px-6 py-2 text-sm">确认</button>
        </div>
      ) : null}

      {/* 战斗日志 */}
      <div className="border-antique rounded-lg p-3 bg-[#0A0806]/40 h-32 overflow-y-auto space-y-1">
        {s.log.map((l) => (
          <div
            key={l.id}
            className={`text-xs leading-snug ${
              l.type === 'player'
                ? 'text-[#D4C9B8]'
                : l.type === 'enemy'
                  ? 'text-[#E8A84E]'
                  : l.type === 'item'
                    ? 'text-[#9B6EC9]'
                    : 'text-[#8B7A5E]'
            }`}
          >
            {l.text}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
