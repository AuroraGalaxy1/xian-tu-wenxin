// 全局 UI 弹窗状态管理
import { create } from 'zustand';

export type ItemDetailContext = 'backpack' | 'shop';

interface UiState {
  backpackOpen: boolean;
  cultivateOpen: boolean;
<<<<<<< HEAD
  loreOpen: boolean;
  /** 当前打开的奇遇 id */
  encounterId: string | null;
=======
>>>>>>> 6da646e4e58e870374996db04b7b20524f5ca952
  /** 当前打开商铺的 NPC id */
  shopNpcId: string | null;
  /** 当前对话的 NPC id */
  talkNpcId: string | null;
  /** 物品详情 */
  itemDetail: { itemId: string; context: ItemDetailContext } | null;
  setBackpackOpen: (v: boolean) => void;
  setCultivateOpen: (v: boolean) => void;
<<<<<<< HEAD
  setLoreOpen: (v: boolean) => void;
  openEncounter: (id: string) => void;
  closeEncounter: () => void;
=======
>>>>>>> 6da646e4e58e870374996db04b7b20524f5ca952
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
<<<<<<< HEAD
  loreOpen: false,
  encounterId: null,
=======
>>>>>>> 6da646e4e58e870374996db04b7b20524f5ca952
  shopNpcId: null,
  talkNpcId: null,
  itemDetail: null,

  setBackpackOpen: (v) => set({ backpackOpen: v }),
  setCultivateOpen: (v) => set({ cultivateOpen: v }),
<<<<<<< HEAD
  setLoreOpen: (v) => set({ loreOpen: v }),
  openEncounter: (id) => set({ encounterId: id }),
  closeEncounter: () => set({ encounterId: null }),
=======
>>>>>>> 6da646e4e58e870374996db04b7b20524f5ca952
  openShop: (npcId) => set({ shopNpcId: npcId, talkNpcId: null }),
  closeShop: () => set({ shopNpcId: null }),
  openTalk: (npcId) => set({ talkNpcId: npcId, shopNpcId: null }),
  closeTalk: () => set({ talkNpcId: null }),
  openItemDetail: (itemId, context = 'backpack') => set({ itemDetail: { itemId, context } }),
  closeItemDetail: () => set({ itemDetail: null }),
  closeAll: () =>
<<<<<<< HEAD
    set({
      backpackOpen: false,
      cultivateOpen: false,
      loreOpen: false,
      encounterId: null,
      shopNpcId: null,
      talkNpcId: null,
      itemDetail: null,
    }),
=======
    set({ backpackOpen: false, cultivateOpen: false, shopNpcId: null, talkNpcId: null, itemDetail: null }),
>>>>>>> 6da646e4e58e870374996db04b7b20524f5ca952
}));
