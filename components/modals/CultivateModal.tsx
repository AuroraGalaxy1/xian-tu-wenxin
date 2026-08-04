'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Flame, Brain, Droplets, Sparkles, Lock } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useSceneStore } from '@/stores/sceneStore';
import { useLogStore } from '@/stores/logStore';
import { getRealmIndex, getNextRealm } from '@/lib/gameData/realms';
import {
  canBreakthrough,
  getBreakthroughHints,
  getCultivateGain,
  getMeditateGain,
  getNextRealmRequirement,
} from '@/lib/utils/gameUtils';

export const CultivateModal = () => {
  const player = usePlayerStore((s) => s.player);
  const lingqi = useSceneStore((s) => s.currentScene?.atmosphere?.lingqi ?? '普通');
  const [msg, setMsg] = useState<string | null>(null);

  if (!player) return null;
  const close = () => useUiStore.getState().setCultivateOpen(false);

  const idx = getRealmIndex(player.realm);
  const next = getNextRealm(idx);
  const req = getNextRealmRequirement(player);
  const medGain = getMeditateGain(lingqi, idx);
  const cultGain = getCultivateGain(idx);
  const canBreak = canBreakthrough(player);
  const hints = getBreakthroughHints(player);
  const pct = req ? Math.min(100, Math.round((player.stats.xiuwei / req) * 100)) : 100;

  const meditate = () => {
    usePlayerStore.getState().gainXiuwei(medGain);
    // 打坐调息亦温养神识
    const cur = usePlayerStore.getState().player?.stats.shenshi ?? 0;
    usePlayerStore.getState().updateStats({ shenshi: cur + 2 });
    useLogStore
      .getState()
      .addLog(`你盘膝打坐，引动${lingqi}灵气，修为 +${medGain}，神识 +2。`, 'stat');
    setMsg(`修为 +${medGain} · 神识 +2`);
  };

  const cultivateDaoxin = () => {
    const p = usePlayerStore.getState().player;
    if (!p) return;
    if (p.stats.xiuwei < 20) {
      setMsg('修为不足（需 20），无法参悟道心。');
      return;
    }
    usePlayerStore.getState().gainXiuwei(-20);
    usePlayerStore.getState().updateStats({
      daoxin: Math.min(p.stats.maxDaoxin, p.stats.daoxin + cultGain),
    });
    useLogStore.getState().addLog(`你静坐参悟，道心 +${cultGain}。`, 'stat');
    setMsg(`道心 +${cultGain}`);
  };

  const cultivateLingyun = () => {
    const p = usePlayerStore.getState().player;
    if (!p) return;
    if (p.stats.xiuwei < 25) {
      setMsg('修为不足（需 25），无法凝练灵蕴。');
      return;
    }
    usePlayerStore.getState().gainXiuwei(-25);
    usePlayerStore.getState().updateStats({
      lingyun: Math.min(p.stats.maxLingyun, p.stats.lingyun + cultGain),
    });
    useLogStore.getState().addLog(`你引灵入体，灵蕴 +${cultGain}。`, 'stat');
    setMsg(`灵蕴 +${cultGain}`);
  };

  const doBreakthrough = () => {
    const res = usePlayerStore.getState().tryBreakthrough();
    setMsg(res.message);
  };

  return (
    <motion.div
      className="glass-panel border-antique-thick rounded-2xl p-6 text-[#E5D8B5] relative"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
    >
      <button
        onClick={close}
        className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#1A1410] border border-[#C9A04E]/40 flex items-center justify-center hover:bg-[#C94E4E]/30 transition-colors"
      >
        <X className="w-4 h-4 text-[#C9A04E]" />
      </button>

      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-4 h-4 text-[#C9A04E]" />
        <h3 className="text-lg font-bold tracking-wider">修炼 · 突破</h3>
        <span className="ml-auto text-xs text-[#8B7A5E]">
          {player.realm} · {player.realmStage}
        </span>
      </div>
      <div className="divider-antique mb-4" />

      {/* 修为进度 */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#8B7A5E]">修为</span>
          <span className="text-[#C9A04E]">
            {player.stats.xiuwei}
            {req !== null && ` / ${req}`}
          </span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill gold" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-[#8B7A5E]/60 mt-1">
          <span>灵气：{lingqi}</span>
          <span>打坐 +{medGain} 修为</span>
        </div>
      </div>

      {/* 修炼操作 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <button onClick={meditate} className="btn-antique flex flex-col items-center gap-1 py-3">
          <Flame className="w-5 h-5 text-[#C9A04E]" />
          <span className="text-xs">打坐调息</span>
          <span className="text-[10px] text-[#8B7A5E]">+{medGain} 修为</span>
        </button>
        <button onClick={cultivateDaoxin} className="btn-antique flex flex-col items-center gap-1 py-3">
          <Brain className="w-5 h-5 text-[#9B6EC9]" />
          <span className="text-xs">参悟道心</span>
          <span className="text-[10px] text-[#8B7A5E]">+{cultGain} 道心 · -20 修为</span>
        </button>
        <button onClick={cultivateLingyun} className="btn-antique flex flex-col items-center gap-1 py-3">
          <Droplets className="w-5 h-5 text-[#4EC9C9]" />
          <span className="text-xs">凝练灵蕴</span>
          <span className="text-[10px] text-[#8B7A5E]">+{cultGain} 灵蕴 · -25 修为</span>
        </button>
      </div>

      {/* 突破区 */}
      <div className="border-antique rounded-xl p-4 bg-[#0A0806]/50">
        <div className="flex items-center gap-2 mb-2">
          {next ? <Lock className="w-4 h-4 text-[#C9A04E]" /> : <Sparkles className="w-4 h-4 text-[#C9A04E]" />}
          <span className="text-sm font-medium">
            {next ? `突破至「${next.name}」` : '已达修行之巅'}
          </span>
        </div>
        {next && (
          <p className="text-xs text-[#8B7A5E]/80 leading-relaxed mb-3">{next.breakthrough.desc}</p>
        )}
        <ul className="text-[11px] text-[#8B7A5E] space-y-0.5 mb-3">
          {hints.map((h) => (
            <li key={h} className="flex items-center gap-1">
              <span className={h === '万事俱备，可以突破' ? 'text-[#4EC9C9]' : ''}>{h}</span>
            </li>
          ))}
          {player.stats.zhinian >= 70 && (
            <li className="text-[#C94E4E]">⚠ 执念过高（{player.stats.zhinian}/100），心魔盘踞，无法突破</li>
          )}
        </ul>
        <button
          onClick={doBreakthrough}
          disabled={!canBreak || player.stats.zhinian >= 70}
          className={`${canBreak && player.stats.zhinian < 70 ? 'btn-antique-primary' : ''} btn-antique w-full py-2.5 text-sm font-medium`}
        >
          ✦ 开始突破
        </button>
      </div>

      {msg && (
        <div className="mt-3 text-xs text-[#C9A04E] border border-[#C9A04E]/20 bg-[#C9A04E]/5 rounded-lg p-2.5">
          {msg}
        </div>
      )}
    </motion.div>
  );
};
