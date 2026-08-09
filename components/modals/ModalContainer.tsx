'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useUiStore } from '@/stores/uiStore';
import { useCombatStore } from '@/stores/combatStore';
import { BackpackModal } from './BackpackModal';
import { CultivateModal } from './CultivateModal';
import { CombatModal } from './CombatModal';
import { EncounterModal } from './EncounterModal';
import { ItemDetailModal } from './ItemDetailModal';
import { LoreModal } from './LoreModal';
import { NpcTalkModal } from './NpcTalkModal';
import { ChoiceModal } from './ChoiceModal';
import { ShopModal } from './ShopModal';
import { CheckinModal } from './CheckinModal';
import { TutorialModal } from './TutorialModal';

export const ModalContainer = () => {
  const {
    backpackOpen,
    cultivateOpen,
    loreOpen,
    checkinOpen,
    tutorialOpen,
    encounterId,
    choiceId,
    shopNpcId,
    talkNpcId,
    itemDetail,
    closeAll,
  } = useUiStore();
  const combatOpen = useCombatStore((s) => s.isOpen);

  const hasAny =
    backpackOpen ||
    cultivateOpen ||
    combatOpen ||
    checkinOpen ||
    tutorialOpen ||
    loreOpen ||
    !!encounterId ||
    !!choiceId ||
    !!shopNpcId ||
    !!talkNpcId ||
    !!itemDetail;

  return (
    <AnimatePresence>
      {hasAny && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 md:p-8"
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
            {itemDetail && <ItemDetailModal />}
            {loreOpen && <LoreModal />}
            {encounterId && <EncounterModal />}
            {choiceId && <ChoiceModal />}
            {talkNpcId && <NpcTalkModal npcId={talkNpcId} />}
            {shopNpcId && <ShopModal npcId={shopNpcId} />}
            {checkinOpen && <CheckinModal />}
            {tutorialOpen && <TutorialModal />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
