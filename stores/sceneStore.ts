import { create } from 'zustand';
import { Scene } from '@/types/scene';
import { scenesData } from '@/lib/gameData/scenes';

interface SceneState {
  currentScene: Scene | null;
  setCurrentScene: (sceneId: string) => void;
  getScene: (sceneId: string) => Scene | undefined;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  currentScene: null, // 初始为null，由页面初始化时设置
  
  setCurrentScene: (sceneId) => {
    const scene = scenesData[sceneId];
    if (scene) {
      set({ currentScene: scene });
    }
  },
  
  getScene: (sceneId) => scenesData[sceneId],
}));