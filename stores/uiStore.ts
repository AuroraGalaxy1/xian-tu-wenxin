// 全局 UI 弹窗状态管理
import { create } from 'zustand';

export type ItemDetailContext = 'backpack' | 'shop';

interface UiState {
  backpackOpen: boolean;
  cultivateOpen: boolean;
  /** 见闻录弹窗 */
  loreOpen: boolean;
  /** 当前打开的奇遇 id */
  encounterId: string | null;
  /** 当前打开的心性抉择 id */
  choiceId: string | null;
  /** 当前打开商铺的 NPC id */
  shopNpcId: string | null;
  /** 当前对话的 NPC id */
  talkNpcId: string | null;
  /** 物品详情 */
  itemDetail: { itemId: string; context: ItemDetailContext } | null;
  setBackpackOpen: (v: boolean) => void;
  setCultivateOpen: (v: boolean) => void;
  setLoreOpen: (v: boolean) => void;
  openEncounter: (id: string) => void;
  closeEncounter: () => void;
  openChoice: (id: string) => void;
  closeChoice: () => void;
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
  loreOpen: false,
  encounterId: null,
  choiceId: null,
  shopNpcId: null,
  talkNpcId: null,
  itemDetail: null,

  setBackpackOpen: (v) => set({ backpackOpen: v }),
  setCultivateOpen: (v) => set({ cultivateOpen: v }),
  setLoreOpen: (v) => set({ loreOpen: v }),
  openEncounter: (id) => set({ encounterId: id, choiceId: null, talkNpcId: null, shopNpcId: null }),
  closeEncounter: () => set({ encounterId: null }),
  openChoice: (id) => set({ choiceId: id, encounterId: null, talkNpcId: null, shopNpcId: null }),
  closeChoice: () => set({ choiceId: null }),
  openShop: (npcId) => set({ shopNpcId: npcId, talkNpcId: null }),
  closeShop: () => set({ shopNpcId: null }),
  openTalk: (npcId) => set({ talkNpcId: npcId, shopNpcId: null }),
  closeTalk: () => set({ talkNpcId: null }),
  openItemDetail: (itemId, context = 'backpack') => set({ itemDetail: { itemId, context } }),
  closeItemDetail: () => set({ itemDetail: null }),
  closeAll: () =>
    set({
      backpackOpen: false,
      cultivateOpen: false,
      loreOpen: false,
      encounterId: null,
      choiceId: null,
      shopNpcId: null,
      talkNpcId: null,
      itemDetail: null,
    }),
}));
