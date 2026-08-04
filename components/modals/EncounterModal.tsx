'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { usePlayerStore } from '@/stores/playerStore';
import { useMapStore } from '@/stores/mapStore';
import { useCombatStore } from '@/stores/combatStore';
import { useLogStore } from '@/stores/logStore';
import { getEncounter } from '@/lib/gameData/encounters';
import { getEnemy } from '@/lib/gameData/enemies';
import { itemsData } from '@/lib/gameData/items';

export const EncounterModal = () => {
  const encounterId = useUiStore((s) => s.encounterId);
  if (!encounterId) return null;
  const enc = getEncounter(encounterId);
  if (!enc) return null;

  const close = () => useUiStore.getState().closeEncounter();

  const apply = () => {
    const r = enc.result;
    const ps = usePlayerStore.getState();
    const ls = useLogStore.getState();
    switch (r.type) {
      case 'xiuwei':
        ps.gainXiuwei(r.amount ?? 0);
        ls.addLog(`奇遇：修为 +${r.amount}`, 'stat');
        break;
      case 'daoxin': {
        const p = ps.player;
        if (p) {
          ps.updateStats({
            daoxin: Math.min(p.stats.maxDaoxin, p.stats.daoxin + (r.amount ?? 0)),
          });
        }
        ls.addLog(`奇遇：道心 +${r.amount}`, 'stat');
        break;
      }
      case 'lingyun': {
        const p = ps.player;
        if (p) {
          ps.updateStats({
            lingyun: Math.min(p.stats.maxLingyun, p.stats.lingyun + (r.amount ?? 0)),
          });
        }
        ls.addLog(`奇遇：灵蕴 +${r.amount}`, 'stat');
        break;
      }
      case 'item':
        if (r.itemId) {
          ps.addItem(r.itemId);
          ls.addLog(
            `奇遇：获得「${itemsData[r.itemId]?.name ?? r.itemId}」`,
            'item'
          );
        }
        break;
      case 'lingShi':
        ps.gainLingShi(r.amount ?? 0);
        ls.addLog(`奇遇：灵石 +${r.amount}`, 'item');
        break;
      case 'heal':
        ps.heal(r.amount ?? 0);
        ls.addLog(`奇遇：气血恢复 ${r.amount}`, 'item');
        break;
      case 'unlock':
        if (r.locationId) {
          useMapStore.getState().unlockLocation(r.locationId);
          ls.addLog('奇遇：你发现了一处新的地点！', 'special');
        }
        break;
      case 'combat':
        if (r.enemyId) {
          const enemy = getEnemy(r.enemyId);
          if (enemy) {
            close();
            useCombatStore.getState().startCombat(enemy);
            return;
          }
        }
        break;
    }
    close();
  };

  return (
    <motion.div
      className="glass-panel border-antique-thick rounded-2xl p-6 text-[#E5D8B5] relative max-w-lg mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-[#C9A04E]" />
        <h3 className="text-lg font-bold tracking-wider">{enc.title}</h3>
      </div>
      <div className="divider-antique mb-4" />
      <p className="text-sm text-[#D9CCB2] leading-relaxed mb-5">{enc.text}</p>
      <button
        onClick={apply}
        className="btn-antique btn-antique-primary w-full py-2.5 text-sm"
      >
        ✦ 承接机缘
      </button>
    </motion.div>
  );
};
