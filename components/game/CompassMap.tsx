'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  X,
  MapPin,
  Navigation,
  Mountain,
  Building2,
  Skull,
  Leaf,
  Sparkles
} from 'lucide-react';
import { useMapStore } from '@/stores/mapStore';
import { useSceneStore } from '@/stores/sceneStore';
import { cn } from '@/lib/utils/cn';

// 地点类型图标映射
const typeIconMap: Record<string, any> = {
  scene: MapPin,
  town: Building2,
  danger: Skull,
  resource: Leaf,
  secret: Sparkles,
};

export const CompassMap = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoom, setZoom] = useState(75);
  const [isVisible, setIsVisible] = useState(true);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const mapRef = useRef<HTMLDivElement>(null);
  
  const currentScene = useSceneStore((state) => state.currentScene);
  const { 
    locations, 
    currentLocation, 
    unlockedLocations,
    setCurrentLocation,
    exploreLocation 
  } = useMapStore();

  // 同步场景和地图
  useEffect(() => {
    if (currentScene && currentLocation?.id !== currentScene.id) {
      const sceneLocation = locations.find(l => l.id === currentScene.id);
      if (sceneLocation) {
        setCurrentLocation(sceneLocation.id);
      }
    }
  }, [currentScene, locations, currentLocation, setCurrentLocation]);

  const handleZoomIn = () => setZoom(prev => Math.min(200, prev + 25));
  const handleZoomOut = () => setZoom(prev => Math.max(25, prev - 25));
  const handleReset = () => { setZoom(75); setDragOffset({ x: 0, y: 0 }); };
  const handleClose = () => setIsVisible(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isExpanded) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !isExpanded) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    const maxOffset = 100;
    setDragOffset({
      x: Math.max(-maxOffset, Math.min(maxOffset, newX)),
      y: Math.max(-maxOffset, Math.min(maxOffset, newY)),
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleLocationClick = (locationId: string) => {
    const location = locations.find(l => l.id === locationId);
    if (!location || !location.isUnlocked) return;
    setCurrentLocation(locationId);
    exploreLocation(locationId);
    // 切换场景
    const setScene = useSceneStore.getState().setCurrentScene;
    setScene(locationId);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className={cn(
        'bg-[#0D0A08]/95 backdrop-blur-md',
        'border-2 border-[#8B7A5E] rounded-xl',
        'shadow-2xl shadow-black/50',
        'select-none'
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        width: isExpanded ? 280 : 160,
        height: isExpanded ? 340 : 160,
      }}
    >
      {/* 标题栏 */}
      <div 
        className={cn(
          'flex items-center justify-between px-3 py-2',
          'border-b border-[#8B7A5E]/30',
          'cursor-pointer hover:bg-[#8B7A5E]/10',
          'transition-colors'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-[#C9A04E]" />
          <span className="text-sm font-medium text-[#E8DCC8]">
            罗盘·{currentLocation?.region || '未知'}
          </span>
        </div>
        
        {isExpanded && (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button onClick={handleZoomIn} className="p-1 hover:bg-[#8B7A5E]/20 rounded">
              <Plus className="w-4 h-4 text-[#E8DCC8]" />
            </button>
            <button onClick={handleZoomOut} className="p-1 hover:bg-[#8B7A5E]/20 rounded">
              <Minus className="w-4 h-4 text-[#E8DCC8]" />
            </button>
            <button onClick={handleReset} className="p-1 hover:bg-[#8B7A5E]/20 rounded">
              <RotateCcw className="w-4 h-4 text-[#E8DCC8]" />
            </button>
            <button onClick={handleClose} className="p-1 hover:bg-red-500/20 rounded">
              <X className="w-4 h-4 text-[#E8DCC8]" />
            </button>
          </div>
        )}
      </div>

      {/* 地图内容 */}
      <div 
        ref={mapRef}
        className={cn(
          'relative overflow-hidden',
          isExpanded ? 'h-[calc(100%-44px)]' : 'h-[calc(100%-44px)]'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute inset-0 transition-transform duration-300"
          style={{
            transform: `scale(${zoom / 75}) translate(${dragOffset.x}px, ${dragOffset.y}px)`,
            transformOrigin: 'center',
          }}
        >
          <div className="w-full h-full p-3">
            <div className="w-full h-full rounded bg-[#1A1410] relative overflow-hidden">
              {/* 网格 */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle, #8B7A5E 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }} />
              
              {/* 方向指示 */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-[#C9A04E] font-bold">
                ⬆ 北
              </div>
              
              {/* 地点标记 */}
              {locations.map((location) => {
                const isCurrent = location.id === currentLocation?.id;
                const isUnlocked = location.isUnlocked || unlockedLocations.includes(location.id);
                const IconComponent = typeIconMap[location.type] || MapPin;
                
                const mapX = (location.x / 500) * 100;
                const mapY = (location.y / 400) * 100;
                
                return (
                  <div
                    key={location.id}
                    className={cn(
                      'absolute transition-all duration-300 cursor-pointer',
                      isUnlocked ? 'opacity-100' : 'opacity-30',
                      isCurrent ? 'z-20' : 'z-10'
                    )}
                    style={{
                      left: `${mapX}%`,
                      top: `${mapY}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={() => handleLocationClick(location.id)}
                    title={location.name}
                  >
                    {isCurrent && (
                      <div className="absolute inset-0 -m-3">
                        <div className="w-8 h-8 rounded-full border-2 border-[#C9A04E] animate-pulse-ring" />
                      </div>
                    )}
                    
                    <div className={cn(
                      'relative flex items-center justify-center',
                      isCurrent ? 'scale-110' : 'scale-100'
                    )}>
                      <div className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center',
                        isCurrent 
                          ? 'bg-[#C9A04E] shadow-lg shadow-[#C9A04E]/30' 
                          : isUnlocked 
                            ? 'bg-[#2A1F18] border border-[#8B7A5E]' 
                            : 'bg-[#1A1410] border border-[#8B7A5E]/30'
                      )}>
                        <IconComponent className={cn(
                          'w-3 h-3',
                          isCurrent ? 'text-[#0D0A08]' : isUnlocked ? 'text-[#E8DCC8]' : 'text-[#8B7A5E]/50'
                        )} />
                      </div>
                      
                      {isExpanded && isUnlocked && (
                        <span className={cn(
                          'absolute -bottom-5 text-[10px] whitespace-nowrap',
                          isCurrent ? 'text-[#C9A04E] font-medium' : 'text-[#8B7A5E]'
                        )}>
                          {location.name}
                        </span>
                      )}
                      
                      {!isUnlocked && isExpanded && (
                        <span className="absolute -bottom-5 text-[10px] text-[#8B7A5E]/50">
                          🔒 未解锁
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {/* 底部信息 */}
              {isExpanded && (
                <div className="absolute bottom-1 left-2 right-2 flex justify-between text-[10px] text-[#8B7A5E]">
                  <span>缩放: {zoom}%</span>
                  <span>已探索: {locations.filter(l => l.isExplored).length}/{locations.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 折叠提示 */}
      {!isExpanded && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-[#8B7A5E]">
          点击展开
        </div>
      )}
    </motion.div>
  );
};