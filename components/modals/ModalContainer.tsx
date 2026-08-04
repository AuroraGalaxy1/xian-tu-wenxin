'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useUiStore } from '@/stores/uiStore';
import { useCombatStore } from '@/stores/combatStore';
import { BackpackModal } from './BackpackModal';
import { CultivateModal } from './CultivateModal';
import { CombatModal } from './CombatModal';
import { ItemDetailModal } from './ItemDetailModal';
import { NpcTalkModal } from './NpcTalkModal';
import { ShopModal } from './ShopModal';
import { LoreModal } from './LoreModal';
import { EncounterModal } from './EncounterModal';

export const ModalContainer = () => {
  const {
    backpackOpen,
    cultivateOpen,
    loreOpen,
    encounterId,
    shopNpcId,
    talkNpcId,
    itemDetail,
    closeAll,
  } = useUiStore();
  const combatOpen = useCombatStore((s) => s.isOpen);

  const hasAny =
    backpackOpen ||
    cultivateOpen ||
    loreOpen ||
    combatOpen ||
    !!encounterId ||
    !!shopNpcId ||
    !!talkNpcId ||
    !!itemDetail;

  return (
    <AnimatePresence>
      {hasAny && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAll}
        >
          <div
            className="w-full max-w-3xl max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {cultivateOpen && <CultivateModal />}
            {combatOpen && <CombatModal />}
            {backpackOpen && <BackpackModal />}
            {loreOpen && <LoreModal />}
            {encounterId && <EncounterModal />}
            {itemDetail && <ItemDetailModal />}
            {talkNpcId && <NpcTalkModal npcId={talkNpcId} />}
            {shopNpcId && <ShopModal npcId={shopNpcId} />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
