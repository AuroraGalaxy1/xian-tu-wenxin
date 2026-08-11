'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Minus,
  RotateCcw,
  X,
  MapPin,
  Navigation,
  Building2,
  Skull,
  Leaf,
  Sparkles,
  Crosshair,
  Lock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMapStore, MapLocation } from '@/stores/mapStore';
import { useSceneStore } from '@/stores/sceneStore';
import { usePlayerStore } from '@/stores/playerStore';
import { questsData } from '@/lib/gameData/quests';
import { cn } from '@/lib/utils/cn';

// 地点类型图标映射
const typeIconMap: Record<string, LucideIcon> = {
  scene: MapPin,
  town: Building2,
  danger: Skull,
  resource: Leaf,
  secret: Sparkles,
};

// 八个方位
const DIRS = ['东', '东南', '南', '西南', '西', '西北', '北', '东北'];

// 地图逻辑尺寸（容纳所有地点坐标：x 最大 620，y 最大 330）
const MAP_W = 700;
const MAP_H = 400;

// 视口尺寸（展开态地图区域实际宽高）
const VIEWPORT_W = 340;
const VIEWPORT_H = 372;

// ─── 纯工具函数（模块级，避免每次渲染重新创建） ───

/** 计算两点间的方位（八方向） */
const calcDirection = (from: MapLocation, to: MapLocation): string => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 0 && dy === 0) return '原地';
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const idx = Math.round((((angle % 360) + 360) % 360) / 45) % 8;
  return DIRS[idx];
};

/** 计算两点间距离（单位：里） */
const calcDistance = (from: MapLocation, to: MapLocation): number => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return Math.max(1, Math.round(Math.sqrt(dx * dx + dy * dy) / 8));
};

/** 最小生成树（Prim 算法）—— 计算已解锁地点之间的虚线连接 */
const calcMST = (unlockedLocs: MapLocation[]): [MapLocation, MapLocation][] => {
  if (unlockedLocs.length < 2) return [];
  const visited = new Set<string>();
  const edges: [MapLocation, MapLocation][] = [];
  visited.add(unlockedLocs[0].id);
  while (visited.size < unlockedLocs.length) {
    let minDist = Infinity;
    let minEdge: [MapLocation, MapLocation] | null = null;
    for (const vLoc of unlockedLocs) {
      if (!visited.has(vLoc.id)) continue;
      for (const uLoc of unlockedLocs) {
        if (visited.has(uLoc.id)) continue;
        const dist = Math.hypot(uLoc.x - vLoc.x, uLoc.y - vLoc.y);
        if (dist < minDist) {
          minDist = dist;
          minEdge = [vLoc, uLoc];
        }
      }
    }
    if (minEdge) {
      edges.push(minEdge);
      visited.add(minEdge[1].id);
    }
  }
  return edges;
};

/** 归一化坐标中的角度（度），用于屏幕连线旋转 */
const calcScreenAngle = (from: MapLocation, to: MapLocation): number => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return Math.atan2(dy, dx) * 180 / Math.PI;
};

/** 归一化坐标中的距离（px），用于连线宽度 */
const calcScreenWidth = (from: MapLocation, to: MapLocation): number => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  return Math.hypot(dx, dy);
};

export const CompassMap = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoom, setZoom] = useState(75);
  const [isVisible, setIsVisible] = useState(true);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  // 罗盘锁定的目标地点
  const [targetId, setTargetId] = useState<string | null>(null);
  // 未解锁地点点击提示
  const [lockedHint, setLockedHint] = useState<{ id: string; name: string; hint: string } | null>(null);

  const currentScene = useSceneStore((state) => state.currentScene);
  const player = usePlayerStore((state) => state.player);
  const {
    locations,
    currentLocation,
    unlockedLocations,
    setCurrentLocation,
    exploreLocation,
  } = useMapStore();

  // 同步场景和地图（使用 ref 防止循环）
  const syncingRef = useRef(false);
  useEffect(() => {
    if (syncingRef.current) return;
    if (currentScene && currentLocation?.id !== currentScene.id) {
      syncingRef.current = true;
      const sceneLocation = locations.find((l) => l.id === currentScene.id);
      if (sceneLocation) setCurrentLocation(sceneLocation.id);
      // 下一帧释放锁，避免同一轮同步循环
      requestAnimationFrame(() => { syncingRef.current = false; });
    }
  }, [currentScene, currentLocation, setCurrentLocation]);

  // 用 Set 加速 isUnlocked 查找
  const unlockedSet = useMemo(
    () => new Set(unlockedLocations),
    [unlockedLocations]
  );
  const isUnlocked = useCallback((id: string) =>
    locations.find((l) => l.id === id)?.isUnlocked || unlockedSet.has(id),
  [locations, unlockedSet]);

  // 任务目标地点：从活跃任务中找第一个未完成的 scene_visit 目标
  const questTargetLocation = useMemo(() => {
    if (!player) return null;
    const activeQuests = player.quests.filter((q) => q.status === 'active');
    for (const q of activeQuests) {
      const data = questsData[q.id];
      if (!data) continue;
      for (const obj of data.objectives) {
        if (obj.type === 'scene_visit' && !player.visitedScenes.includes(obj.target)) {
          const loc = locations.find((l) => l.id === obj.target);
          if (loc && isUnlocked(loc.id)) return loc;
        }
      }
    }
    return null;
  }, [player?.quests, player?.visitedScenes, locations, isUnlocked]);

  // 使用 useMemo 缓存罗盘目标计算（手动选中 targetId 优先，其次任务目标，最后最近距离）
  const targetLocation = useMemo(() => {
    if (targetId) return locations.find((l) => l.id === targetId) ?? null;
    if (questTargetLocation) return questTargetLocation;
    if (!currentLocation) return null;
    const candidates = locations
      .filter((l) => isUnlocked(l.id) && l.id !== currentLocation.id);
    if (candidates.length === 0) return null;
    return [...candidates].sort((a, b) => calcDistance(currentLocation, a) - calcDistance(currentLocation, b))[0];
  }, [locations, targetId, currentLocation, isUnlocked, questTargetLocation]);

  // 指针角度：数学角 0=东、顺时针为正 → CSS rotate 需 +90（指针默认朝北）
  const targetAngle = useMemo(() => {
    if (!currentLocation || !targetLocation) return 0;
    const dx = targetLocation.x - currentLocation.x;
    const dy = targetLocation.y - currentLocation.y;
    return (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  }, [currentLocation, targetLocation]);

  // 使用 useMemo 缓存 MST 边
  const mstEdges = useMemo(() => {
    const unlockedLocs = locations.filter(l => isUnlocked(l.id));
    return calcMST(unlockedLocs);
  }, [locations, isUnlocked]);

  // 控件
  const handleZoomIn = () => setZoom((prev) => Math.min(200, prev + 25));
  const handleZoomOut = () => setZoom((prev) => Math.max(25, prev - 25));
  const handleReset = () => { setZoom(75); setDragOffset({ x: 0, y: 0 }); };
  const handleClose = () => setIsVisible(false);

  const handleDragStart = (e: React.MouseEvent) => {
    if (!isExpanded) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
  };
  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging || !isExpanded) return;
    // 地图内容宽 MAP_W(700px)，视口宽 340px。缩放后内容宽 = 700*(zoom/75)。
    // 拖动范围限制为内容超出视口的量，保证始终能看到地图内容（不拖到空白）。
    const contentW = MAP_W * (zoom / 75);
    const contentH = MAP_H * (zoom / 75);
    const maxX = Math.max(0, (contentW - VIEWPORT_W) / 2);
    const maxY = Math.max(0, (contentH - VIEWPORT_H) / 2);
    setDragOffset({
      x: Math.max(-maxX, Math.min(maxX, e.clientX - dragStart.x)),
      y: Math.max(-maxY, Math.min(maxY, e.clientY - dragStart.y)),
    });
  };
  const handleDragEnd = () => setIsDragging(false);

  const handleLocationClick = (locationId: string) => {
    const location = locations.find((l) => l.id === locationId);
    if (!location) return;

    if (!isUnlocked(locationId)) {
      // 未解锁：显示解锁条件提示
      const hint = location.unlockHint || '条件未知，继续探索可解锁';
      setLockedHint({ id: locationId, name: location.name, hint });
      // 3 秒后自动消失
      setTimeout(() => setLockedHint(null), 3000);
      return;
    }

    // 锁定为罗盘目标并标记探索
    setTargetId(locationId);
    exploreLocation(locationId);
    // 仅当存在对应场景时才切换当前位置与场景
    const scene = useSceneStore.getState().getScene(locationId);
    if (scene) {
      // 统一通过 playerStore.changeScene 同步地图位置与访问记录
      usePlayerStore.getState().changeScene(locationId);
      useSceneStore.getState().setCurrentScene(locationId);
    }
  };

  if (!isVisible) {
    // 关闭后保留一个隐藏的重新打开入口（右下角小罗盘图标）
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="w-10 h-10 rounded-full bg-[#0D0A08]/95 border border-[#C9A04E]/30 shadow-xl shadow-black/50 flex items-center justify-center hover:border-[#C9A04E]/70 transition-colors"
        title="重新打开罗盘"
      >
        <Navigation className="w-4 h-4 text-[#C9A04E]" />
      </button>
    );
  }

  return (
    <motion.div
      data-tutorial="compass"
      className={cn(
        'relative select-none',
        isExpanded
          ? 'bg-[#0D0A08]/97 border border-[#C9A04E]/30 rounded-2xl shadow-2xl shadow-black/60 corner-decoration'
          : 'bg-[#0D0A08]/95 border border-[#C9A04E]/30 rounded-full shadow-xl shadow-black/50'
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ width: isExpanded ? 340 : 150, height: isExpanded ? 440 : 150 }}
    >
      {/* 关闭按钮 */}
      <button
        onClick={handleClose}
        className="absolute -top-2 -right-2 z-30 w-6 h-6 rounded-full bg-[#1A1410] border border-[#C9A04E]/40 flex items-center justify-center hover:bg-[#C94E4E]/30 transition-colors"
        title="关闭罗盘"
      >
        <X className="w-3.5 h-3.5 text-[#C9A04E]" />
      </button>

      {!isExpanded ? (
        /* ============ 折叠态：圆形罗盘 ============ */
        <div
          className="w-full h-full rounded-full relative flex items-center justify-center cursor-pointer"
          onClick={() => setIsExpanded(true)}
        >
          {/* 罗盘刻度环 */}
          <div className="absolute inset-1 rounded-full border border-[#C9A04E]/15">
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'absolute left-1/2 top-1/2 w-px',
                  i % 3 === 0 ? 'h-2.5 bg-[#C9A04E]/50' : 'h-1.5 bg-[#8B7A5E]/30'
                )}
                style={{
                  transform: `translate(-50%, -50%) rotate(${i * 15}deg) translateY(-60px)`,
                }}
              />
            ))}
          </div>

          {/* 四正方位 */}
          {['北', '东', '南', '西'].map((d, i) => (
            <span
              key={d}
              className={cn(
                'absolute text-xs font-medium',
                i === 0 ? 'text-[#C9A04E]' : 'text-[#8B7A5E]'
              )}
              style={{
                transform: `rotate(${i * 90}deg) translateY(-54px) rotate(${-i * 90}deg)`,
              }}
            >
              {d}
            </span>
          ))}

          {/* 指南针指针 */}
          <div
            className="absolute inset-0 transition-transform duration-700 ease-out"
            style={{ transform: `rotate(${targetAngle}deg)` }}
          >
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: 0,
                height: 0,
                transform: 'translate(-50%, -100%)',
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderBottom: '14px solid rgba(201,160,78,0.85)',
              }}
            />
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: 0,
                height: 0,
                transform: 'translate(-50%, 0)',
                borderLeft: '4px solid transparent',
                borderRight: '4px solid transparent',
                borderTop: '10px solid rgba(201,78,78,0.7)',
              }}
            />
          </div>

          {/* 中央信息 */}
          <div className="w-16 h-16 rounded-full bg-[#1A1410] border border-[#C9A04E]/40 flex flex-col items-center justify-center z-10 shadow-lg shadow-black/50">
            <Navigation className="w-5 h-5 text-[#C9A04E]" />
            <span className="text-xs text-[#E8DCC8] mt-1 leading-none">
              {currentLocation?.name.slice(0, 5) || '未知'}
            </span>
          </div>

          {/* 目标方位信息 */}
          {targetLocation && currentLocation && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 text-xs text-[#C9A04E] whitespace-nowrap">
              <Crosshair className="w-3 h-3" />
              {targetLocation.name} · {calcDirection(currentLocation, targetLocation)} {calcDistance(currentLocation, targetLocation)}里
            </div>
          )}

          {!targetLocation && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-xs text-[#8B7A5E]/60 whitespace-nowrap">
              点击展开罗盘
            </div>
          )}
        </div>
      ) : (
        /* ============ 展开态：完整小地图 ============ */
        <div className="flex flex-col w-full h-full">
          {/* 标题栏 */}
          <div
            className="flex items-center justify-between px-3 py-2 border-b border-[#C9A04E]/20 cursor-pointer hover:bg-[#C9A04E]/5 transition-colors rounded-t-2xl"
            onClick={() => setIsExpanded(false)}
            title="点击收起罗盘"
          >
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#C9A04E]" />
              <span className="text-sm font-medium text-[#E8DCC8]">
                罗盘·{currentLocation?.region || '未知'}
              </span>
            </div>

            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button onClick={handleZoomIn} className="p-1 hover:bg-[#C9A04E]/20 rounded" title="放大">
                <Plus className="w-4 h-4 text-[#E8DCC8]" />
              </button>
              <button onClick={handleZoomOut} className="p-1 hover:bg-[#C9A04E]/20 rounded" title="缩小">
                <Minus className="w-4 h-4 text-[#E8DCC8]" />
              </button>
              <button onClick={handleReset} className="p-1 hover:bg-[#C9A04E]/20 rounded" title="重置">
                <RotateCcw className="w-4 h-4 text-[#E8DCC8]" />
              </button>
            </div>
          </div>

          {/* 地图内容 */}
          <div
              className="relative flex-1 overflow-hidden bg-[#1A1410] rounded-b-2xl"
              onMouseDown={handleDragStart}
              onMouseMove={handleDragMove}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
            >
              <div
                className="absolute"
                style={{
                  left: `${(VIEWPORT_W - MAP_W * (zoom / 75)) / 2 + dragOffset.x}px`,
                  top: `${(VIEWPORT_H - MAP_H * (zoom / 75)) / 2 + dragOffset.y}px`,
                  width: MAP_W,
                  height: MAP_H,
                  transform: `scale(${zoom / 75})`,
                  transformOrigin: 'top left',
                }}
              >
                <div className="w-full h-full">
                  <div className="w-full h-full rounded-xl bg-[#1A1410] relative" style={{ width: MAP_W, height: MAP_H }}>
                  {/* 网格 */}
                  <div
                    className="absolute inset-0 overflow-hidden opacity-10"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #8B7A5E 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* 当前 → 目标的虚线指示 */}
                  {currentLocation && targetLocation && targetLocation.id !== currentLocation.id && (
                    <div
                      className="absolute pointer-events-none z-10"
                      style={{
                        left: currentLocation.x,
                        top: currentLocation.y,
                        width: calcScreenWidth(currentLocation, targetLocation),
                        transformOrigin: 'left center',
                        transform: `rotate(${calcScreenAngle(currentLocation, targetLocation)}deg)`,
                      }}
                    >
                      <div className="w-full h-px border-t border-dashed border-[#C9A04E]/50" />
                    </div>
                  )}

                  {/* 已解锁地点之间的 MST 虚线连接 */}
                  {mstEdges.map(([from, to]) => {
                    return (
                      <div
                        key={`mst-${from.id}-${to.id}`}
                        className="absolute pointer-events-none z-5"
                        style={{
                          left: from.x,
                          top: from.y,
                          width: calcScreenWidth(from, to),
                          transformOrigin: 'left center',
                          transform: `rotate(${calcScreenAngle(from, to)}deg)`,
                        }}
                      >
                        <div className="w-full h-px border-t border-dashed border-[#8B7A5E]/40" />
                      </div>
                    );
                  })}

                  {/* 地点标记 */}
                  {locations.map((location) => {
                    const isCurrent = location.id === currentLocation?.id;
                    const unlocked = isUnlocked(location.id);
                    const isTarget = location.id === targetLocation?.id && !isCurrent;
                    const IconComponent = typeIconMap[location.type] || MapPin;

                    return (
                      <div
                        key={location.id}
                        className={cn(
                          'absolute transition-all duration-300 cursor-pointer',
                          unlocked ? 'opacity-100' : 'opacity-100',
                          isCurrent || isTarget ? 'z-20' : 'z-10'
                        )}
                        style={{
                          left: location.x,
                          top: location.y,
                          transform: 'translate(-50%, -50%)',
                        }}
                        onClick={() => handleLocationClick(location.id)}
                        title={`${location.name}${unlocked ? '' : '（未解锁）'}`}
                      >
                        {isCurrent && (
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-8 h-8 rounded-full border-2 border-[#C9A04E] animate-pulse-ring" />
                          </div>
                        )}
                        {isTarget && (
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-8 h-8 rounded-full border border-[#9B6EC9] animate-pulse-ring" />
                          </div>
                        )}

                        {/* 固定 24×24 容器，名称绝对定位不占位，保证 left-1/2 始终=12px */}
                        <div className="relative w-6 h-6">
                          <div
                            className={cn(
                              'w-6 h-6 rounded-full flex items-center justify-center',
                              isCurrent
                                ? 'bg-[#C9A04E] shadow-lg shadow-[#C9A04E]/30 scale-110'
                                : isTarget
                                  ? 'bg-[#9B6EC9] shadow-lg shadow-[#9B6EC9]/30'
                                  : unlocked
                                    ? 'bg-[#2A1F18] border border-[#8B7A5E]'
                                    : 'bg-[#0D0A08] border-2 border-[#8B7A5E]/60'
                            )}
                          >
                            {!unlocked ? (
                              <Lock className="w-3.5 h-3.5 text-[#8B7A5E]" />
                            ) : (
                              <IconComponent
                                className={cn(
                                  'w-3 h-3',
                                  isCurrent
                                    ? 'text-[#0D0A08]'
                                    : isTarget
                                      ? 'text-white'
                                      : 'text-[#E8DCC8]'
                                )}
                              />
                            )}
                          </div>

                          {/* 名称绝对定位，相对于 24px 容器居中，不撑大容器 */}
                          <span
                            className={cn(
                              'absolute top-full left-1/2 -translate-x-1/2 pt-0.5 text-xs whitespace-nowrap pointer-events-none',
                              isCurrent ? 'text-[#C9A04E] font-medium' : isTarget ? 'text-[#9B6EC9]' : unlocked ? 'text-[#8B7A5E]' : 'text-[#8B7A5E]'
                            )}
                          >
                            {location.name}
                            {!unlocked && <span className="ml-1 text-[#8B7A5E]/60 font-normal">(未解锁)</span>}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* 未解锁提示——放在面板层（地图容器之外），居中显示，不受地图缩放/拖动影响 */}
          {lockedHint && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div
                key={lockedHint.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="pointer-events-auto max-w-[88%] px-4 py-3 rounded-lg bg-[#0D0A08]/95 border border-[#C9A04E]/40 shadow-xl shadow-black/50"
              >
                <p className="text-xs text-[#C9A04E] font-medium flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  {lockedHint.name} · 未解锁
                </p>
                <p className="text-xs text-[#E8DCC8] mt-1 leading-relaxed">
                  {lockedHint.hint}
                </p>
              </motion.div>
            </div>
          )}

          {/* 底部信息栏 */}
          <div className="px-3 py-2 border-t border-[#C9A04E]/15 bg-[#0D0A08]/90 rounded-b-2xl flex items-center justify-between text-xs text-[#8B7A5E]">
            <span>缩放 {zoom}% · 已探索 {locations.filter((l) => l.isExplored).length}/{locations.length}</span>
            {targetLocation && currentLocation ? (
              <span className="text-[#C9A04E] flex items-center gap-1">
                <Crosshair className="w-3 h-3" />
                {targetLocation.name} · {calcDirection(currentLocation, targetLocation)} {calcDistance(currentLocation, targetLocation)}里
              </span>
            ) : (
              <span>暂无目标</span>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};
