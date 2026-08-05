// 全局 UI 弹窗状态管理
import { create } from 'zustand';

export type ItemDetailContext = 'backpack' | 'shop';

interface UiState {
  backpackOpen: boolean;
  cultivateOpen: boolean;
  /** 当前打开商铺的 NPC id */
  shopNpcId: string | null;
  /** 当前对话的 NPC id */
  talkNpcId: string | null;
  /** 物品详情 */
  itemDetail: { itemId: string; context: ItemDetailContext } | null;
  setBackpackOpen: (v: boolean) => void;
  setCultivateOpen: (v: boolean) => void;
  openShop: (npcId: string) => void;
  closeShop: () => void;
  openTalk: (npcId: string) => void;
  closeTalk: () => void;
  openItemDetail: (itemId: string, context?: ItemDetailContext) => void;
  closeItemDetail: () => void;
  closeAll: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  backpackOpen: false,
  cultivateOpen: false,
  shopNpcId: null,
  talkNpcId: null,
  itemDetail: null,

  setBackpackOpen: (v) => set({ backpackOpen: v }),
  setCultivateOpen: (v) => set({ cultivateOpen: v }),
  openShop: (npcId) => set({ shopNpcId: npcId, talkNpcId: null }),
  closeShop: () => set({ shopNpcId: null }),
  openTalk: (npcId) => set({ talkNpcId: npcId, shopNpcId: null }),
  closeTalk: () => set({ talkNpcId: null }),
  openItemDetail: (itemId, context = 'backpack') => set({ itemDetail: { itemId, context } }),
  closeItemDetail: () => set({ itemDetail: null }),
  closeAll: () =>
    set({ backpackOpen: false, cultivateOpen: false, shopNpcId: null, talkNpcId: null, itemDetail: null }),
}));
