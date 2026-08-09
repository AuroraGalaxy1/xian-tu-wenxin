// 新手指引状态管理
import { create } from 'zustand';
import { api } from '@/lib/api';
import { debounce } from '@/lib/debounce';

interface TutorialState {
  tutorialCompleted: boolean;
  tutorialPhase: 'modal' | 'tour' | null;
  tourStep: number;
  isLoading: boolean;

  startTutorial: () => void;
  closeModal: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  resetTutorial: () => void;
  loadTutorial: () => Promise<void>;
  _save: () => void;
}

export const useTutorialStore = create<TutorialState>()((set, get) => ({
  tutorialCompleted: false,
  tutorialPhase: null,
  tourStep: 0,
  isLoading: true,

  loadTutorial: async () => {
    set({ isLoading: true });
    const data = await api.get<{ tutorialCompleted: boolean }>('/tutorial');
    if (data) {
      set({ tutorialCompleted: data.tutorialCompleted, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  _save: debounce(async () => {
    const { tutorialCompleted } = get();
    await api.put('/tutorial', { tutorialCompleted });
  }, 500),

  startTutorial: () => {
    set({ tutorialPhase: 'modal', tourStep: 0 });
  },

  closeModal: () => {
    set({ tutorialPhase: 'tour', tourStep: 0 });
  },

  skipTutorial: () => {
    set({ tutorialCompleted: true, tutorialPhase: null, tourStep: 0 });
    get()._save();
  },

  completeTutorial: () => {
    set({ tutorialCompleted: true, tutorialPhase: null, tourStep: 0 });
    get()._save();
  },

  nextTourStep: () => {
    const next = get().tourStep + 1;
    if (next >= 5) {
      get().completeTutorial();
    } else {
      set({ tourStep: next });
    }
  },

  prevTourStep: () => {
    const prev = get().tourStep - 1;
    if (prev >= 0) {
      set({ tourStep: prev });
    }
  },

  resetTutorial: () => {
    set({ tutorialCompleted: false, tutorialPhase: null, tourStep: 0 });
    get()._save();
  },
}));