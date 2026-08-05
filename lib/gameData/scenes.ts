import { Scene } from '@/types/scene';
import { usePlayerStore } from '@/stores/playerStore';

// 注意：条件函数应该作为函数定义，但实际执行在组件中
// 这里只定义条件检查函数，不直接调用 store

export const scenesData: Record<string, Scene> = {
  po_miao: {
    id: 'po_miao',
    name: '无名荒山·破败山神庙',
    description: '残月悬空，荒草没过膝。你站在一座坍塌过半的山神庙前，庙门斜挂，露出内里漆黑的空洞。檐角蛛网密布，梁上积尘半寸——此地至少荒废百年。',
    location: {
      region: '落星坡',
      x: 120,
      y: 80,
    },
    atmosphere: {
      lingqi: '普通',
      danger: '低',
      time: '子时',
    },
    actions: [
      {
        id: 'view_detail',
        label: '查看详情',
        icon: 'BookOpen',
        description: '仔细观察当前场景的细节',
        action: () => {}, // 将在组件中处理
      },
      {
        id: 'explore',
        label: '探查四周',
        icon: 'Search',
        description: '消耗神识，扫描周围',
        action: () => {},
        // 条件将在组件中判断
      },
      {
        id: 'meditate',
        label: '打坐调息',
        icon: 'Coffee',
        description: '尝试感应天地灵气',
        action: () => {},
      },
      {
        id: 'enter_temple',
        label: '探索庙内',
        icon: 'DoorOpen',
        description: '进入破庙内部查看',
        action: () => {},
      },
      {
        id: 'check_stele',
        label: '翻阅残碑',
        icon: 'FileText',
        description: '查看庙外半截古碑',
        action: () => {},
      },
      {
        id: 'check_self',
        label: '检查自身',
        icon: 'User',
        description: '查看自身状态属性',
        action: () => {},
      },
      {
        id: 'leave',
        label: '尝试离开',
        icon: 'MapPin',
        description: '离开这座破庙',
        action: () => {},
      },
    ],
    exits: [
      {
        sceneId: 'shan_gu',
        direction: '东南',
        label: '前往东南山谷',
        isLocked: false,
      },
    ],
    npcs: [],
    items: [],
    isUnlocked: true,
    isExplored: false,
  },
  shan_gu: {
    id: 'shan_gu',
    name: '灵脉交汇之眼',
    description: '你穿过密林，来到一处被翠绿山峦环抱的山谷。谷中灵气浓郁得几乎凝成水雾，在月光下泛着微光。',
    location: {
      region: '落星坡',
      x: 320,
      y: 150,
    },
    atmosphere: {
      lingqi: '浓郁',
      danger: '中',
      time: '寅时',
    },
    actions: [
      {
        id: 'explore_valley',
        label: '探查山谷',
        icon: 'Search',
        description: '仔细探查这片灵脉汇聚之地',
        action: () => {},
      },
      {
        id: 'gather_lingqi',
        label: '采集灵气',
        icon: 'Coffee',
        description: '尝试吸收此地的浓郁灵气',
        action: () => {},
      },
      {
        id: 'leave',
        label: '尝试离开',
        icon: 'MapPin',
        description: '离开这座破庙，前往灵脉交汇之眼',
        action: () => {},
      }
    ],
    exits: [
      {
        sceneId: 'po_miao',
        direction: '西北',
        label: '返回破庙',
        isLocked: false,
      },
    ],
    npcs: [],
    items: [],
    isUnlocked: false,
    isExplored: false,
  },
};