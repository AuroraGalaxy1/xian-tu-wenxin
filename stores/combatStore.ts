// 战斗状态机：回合制指令战斗（攻击/重击/防御/物品/逃跑）
import { create } from 'zustand';
import type { Enemy } from '@/types/enemy';
import { usePlayerStore } from '@/stores/playerStore';
import { useLogStore } from '@/stores/logStore';
import { itemsData } from '@/lib/gameData/items';
import {
  calcDamage,
  calcDefendedDamage,
  getPlayerCombatStats,
  rollDrops,
} from '@/lib/utils/gameUtils';

export type CombatPhase =
  | 'idle'
  | 'player_turn'
  | 'enemy_turn'
  | 'victory'
  | 'defeat'
  | 'fled';

export interface CombatLogEntry {
  id: string;
  text: string;
  type: 'player' | 'enemy' | 'info' | 'item' | 'special';
}

interface CombatState {
  isOpen: boolean;
  phase: CombatPhase;
  enemy: Enemy | null;
  playerHp: number;
  playerMaxHp: number;
  playerAtk: number;
  playerDef: number;
  enemyHp: number;
  enemyMaxHp: number;
  defending: boolean;
  /** 重击冷却回合数 */
  heavyCooldown: number;
  log: CombatLogEntry[];
  /** 结算掉落的物品 */
  drops: string[];
  startCombat: (enemy: Enemy) => void;
  closeCombat: () => void;
  attack: () => void;
  heavyAttack: () => void;
  defend: () => void;
  useItem: (itemId: string) => void;
  flee: () => void;
  claimVictory: () => void;
  claimDefeat: () => void;
  claimFled: () => void;
  enemyTurn: () => void;
}

let logSeq = 0;
const nextLogId = () => `cbt_${Date.now()}_${logSeq++}`;

export const useCombatStore = create<CombatState>()((set, get) => ({
  isOpen: false,
  phase: 'idle',
  enemy: null,
  playerHp: 0,
  playerMaxHp: 1,
  playerAtk: 0,
  playerDef: 0,
  enemyHp: 0,
  enemyMaxHp: 1,
  defending: false,
  heavyCooldown: 0,
  log: [],
  drops: [],

  startCombat: (enemy) => {
    const p = usePlayerStore.getState().player;
    if (!p) return;
    const combat = getPlayerCombatStats(p);
    set({
      isOpen: true,
      phase: 'player_turn',
      enemy,
      playerHp: p.hp,
      playerMaxHp: combat.maxHp,
      playerAtk: combat.atk,
      playerDef: combat.def,
      enemyHp: enemy.hp,
      enemyMaxHp: enemy.hp,
      defending: false,
      heavyCooldown: 0,
      log: [
        {
          id: nextLogId(),
          text: `⚔ 遭遇了「${enemy.name}」！${enemy.description}`,
          type: 'info',
        },
      ],
      drops: [],
    });
  },

  closeCombat: () => set({ isOpen: false, phase: 'idle', enemy: null }),

  attack: () => {
    const s = get();
    if (s.phase !== 'player_turn' || !s.enemy) return;
    const dmg = calcDamage(s.playerAtk, s.enemy.def, 1);
    const enemyHp = Math.max(0, s.enemyHp - dmg);
    const text = `你挥剑斩向「${s.enemy.name}」，造成 ${dmg} 点伤害。`;
    set((st) => ({
      enemyHp,
      heavyCooldown: Math.max(0, st.heavyCooldown - 1),
      log: [...st.log, { id: nextLogId(), text, type: 'player' }],
      phase: enemyHp <= 0 ? 'victory' : 'enemy_turn',
      defending: false,
    }));
    if (enemyHp <= 0) return;
    setTimeout(() => get().enemyTurn(), 650);
  },

  heavyAttack: () => {
    const s = get();
    if (s.phase !== 'player_turn' || !s.enemy || s.heavyCooldown > 0) return;
    const dmg = calcDamage(s.playerAtk, s.enemy.def, 1.5);
    const enemyHp = Math.max(0, s.enemyHp - dmg);
    const text = `你蓄力一击，重创「${s.enemy.name}」，造成 ${dmg} 点伤害！`;
    set((st) => ({
      enemyHp,
      heavyCooldown: 2,
      log: [...st.log, { id: nextLogId(), text, type: 'player' }],
      phase: enemyHp <= 0 ? 'victory' : 'enemy_turn',
      defending: false,
    }));
    if (enemyHp <= 0) return;
    setTimeout(() => get().enemyTurn(), 650);
  },

  defend: () => {
    const s = get();
    if (s.phase !== 'player_turn') return;
    set((st) => ({
      phase: 'enemy_turn',
      defending: true,
      log: [...st.log, { id: nextLogId(), text: '你凝神防御，护体灵气流转周身。', type: 'player' }],
    }));
    setTimeout(() => get().enemyTurn(), 650);
  },

  useItem: (itemId) => {
    const s = get();
    if (s.phase !== 'player_turn') return;
    const item = itemsData[itemId];
    const ps = usePlayerStore.getState();
    const p = ps.player;
    if (!item || !p || !p.inventory.includes(itemId)) {
      set((st) => ({
        log: [...st.log, { id: nextLogId(), text: '背包中无此物。', type: 'info' }],
      }));
      return;
    }
    if (item.effect?.type !== 'restore_hp') {
      set((st) => ({
        log: [...st.log, { id: nextLogId(), text: '战斗中只能使用恢复类丹药。', type: 'info' }],
      }));
      return;
    }
    ps.removeItem(itemId);
    const heal = item.effect.value;
    const playerHp = Math.min(s.playerMaxHp, s.playerHp + heal);
    set((st) => ({
      playerHp,
      log: [...st.log, { id: nextLogId(), text: `你服下「${item.name}」，恢复气血 ${heal} 点。`, type: 'item' }],
      phase: 'enemy_turn',
      defending: false,
    }));
    setTimeout(() => get().enemyTurn(), 650);
  },

  flee: () => {
    const s = get();
    if (s.phase !== 'player_turn') return;
    if (Math.random() < 0.6) {
      set((st) => ({
        phase: 'fled',
        log: [...st.log, { id: nextLogId(), text: '你虚晃一招，转身逃离了战斗。', type: 'info' }],
      }));
      return;
    }
    set((st) => ({
      phase: 'enemy_turn',
      defending: false,
      log: [...st.log, { id: nextLogId(), text: '逃跑失败！', type: 'info' }],
    }));
    setTimeout(() => get().enemyTurn(), 650);
  },

  enemyTurn: () => {
    const s = get();
    if (s.phase !== 'enemy_turn' || !s.enemy) return;
    const enemy = s.enemy;
    const skill = enemy.skills[Math.floor(Math.random() * enemy.skills.length)];
    const dmg = s.defending
      ? calcDefendedDamage(enemy.atk, s.playerDef, skill.power)
      : calcDamage(enemy.atk, s.playerDef, skill.power);
    const playerHp = Math.max(0, s.playerHp - dmg);
    const text = `「${enemy.name}」使出「${skill.name}」，对你造成 ${dmg} 点伤害。`;
    set((st) => ({
      playerHp,
      log: [...st.log, { id: nextLogId(), text, type: 'enemy' }],
      phase: playerHp <= 0 ? 'defeat' : 'player_turn',
      defending: false,
    }));
  },

  claimVictory: () => {
    const s = get();
    if (!s.enemy) return;
    const ps = usePlayerStore.getState();
    const drops = rollDrops(s.enemy.drops);
    drops.forEach((id) => ps.addItem(id));
    ps.gainXiuwei(s.enemy.xiuweiReward);
    ps.recordKill(s.enemy.id);
    useLogStore
      .getState()
      .addLog(`⚔ 你击败了「${s.enemy.name}」！修为 +${s.enemy.xiuweiReward}`, 'combat');
    if (drops.length) {
      const names = drops.map((d) => itemsData[d]?.name ?? d).join('、');
      useLogStore.getState().addLog(`获得掉落：${names}`, 'item');
    }
    set({ drops, isOpen: false, phase: 'idle', enemy: null });
  },

  claimDefeat: () => {
    const ps = usePlayerStore.getState();
    ps.setHp(1);
    const town = ps.player?.visitedScenes.includes('xi_feng_zhen') ? 'xi_feng_zhen' : 'po_miao';
    ps.changeScene(town);
    useLogStore.getState().addLog('你身受重伤，眼前一黑昏了过去……', 'danger');
    useLogStore
      .getState()
      .addLog(`再醒来时，你已回到${town === 'xi_feng_zhen' ? '溪风镇' : '破庙'}。`, 'normal');
    set({ isOpen: false, phase: 'idle', enemy: null });
  },

  claimFled: () => {
    useLogStore.getState().addLog('你惊魂未定地逃离了战斗。', 'normal');
    set({ isOpen: false, phase: 'idle', enemy: null });
  },
}));
