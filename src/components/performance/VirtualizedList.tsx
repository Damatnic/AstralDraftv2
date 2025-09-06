/**
 * Virtualized List Component - High-Performance List Rendering
 * Implements windowing technique for rendering large datasets efficiently
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number | ((item: T, index: number) => number);
  containerHeight: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  renderPlaceholder?: () => React.ReactNode;
  overscan?: number;
  scrollToIndex?: number;
  scrollToAlignment?: 'start' | 'center' | 'end' | 'auto';
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
  className?: string;
  itemKey?: (item: T, index: number) => string | number;
  enableHorizontalScrolling?: boolean;
  width?: number;
  itemWidth?: number | ((item: T, index: number) => number);
  direction?: 'vertical' | 'horizontal';
  sticky?: {
    indices: number[];
    renderSticky: (item: T, index: number) => React.ReactNode;
  };

interface VirtualizedItem {
  index: number;
  offset: number;
  size: number;}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  renderPlaceholder,
  overscan = 5,
  scrollToIndex,
  scrollToAlignment = 'auto',
  onScroll,
  className = '',
  itemKey,
  enableHorizontalScrolling = false,
  width,
  itemWidth,
  direction = 'vertical',
//   sticky
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  
  const isVertical = direction === 'vertical';
  const scrollProperty = isVertical ? 'scrollTop' : 'scrollLeft';
  const sizeProperty = isVertical ? 'height' : 'width';
  const offsetProperty = isVertical ? 'top' : 'left';

  // Memoized item size calculator
  const getItemSize = useCallback((index: number): number => {
    if (typeof itemHeight === 'function') {
      return itemHeight(items[index], index);
    }
    return itemHeight as number;
  }, [itemHeight, items]);

  // Memoized item width calculator (for horizontal)
  const getItemWidth = useCallback((index: number): number => {
    if (!itemWidth) return width || 200;
    if (typeof itemWidth === 'function') {
      return itemWidth(items[index], index);
    }
    return itemWidth;
  }, [itemWidth, items, width]);

  // Calculate total size and item positions
  const { totalSize, itemPositions } = useMemo(() => {
    const positions: VirtualizedItem[] = [];
    let currentOffset = 0;

    for (let i = 0; i < items.length; i++) {
      const size = isVertical ? getItemSize(i) : getItemWidth(i);
      positions.push({
        index: i,
        offset: currentOffset,
//         size
      });
      currentOffset += size;
    }

    return {
      totalSize: currentOffset,
      itemPositions: positions
    };
  }, [items.length, getItemSize, getItemWidth, isVertical]);

  // Binary search to find start index
  const getStartIndex = useCallback((scrollOffset: number): number => {
    let low = 0;
    let high = itemPositions.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const position = itemPositions[mid];

      if (position.offset <= scrollOffset && scrollOffset < position.offset + position.size) {
        return mid;
      } else if (position.offset > scrollOffset) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    return Math.max(0, high);
  }, [itemPositions]);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const scrollOffset = isVertical ? scrollTop : scrollLeft;
    const containerSize = isVertical ? containerHeight : (width || 0);

    if (items.length === 0) {
      return { startIndex: 0, endIndex: 0, visibleItems: [] };
    }

    const startIndex = getStartIndex(scrollOffset);
    let endIndex = startIndex;
    let currentOffset = itemPositions[startIndex]?.offset || 0;

    // Find end index
    while (endIndex < items.length - 1 && currentOffset < scrollOffset + containerSize) {
      endIndex++;
      currentOffset = itemPositions[endIndex].offset + itemPositions[endIndex].size;
    }

    // Apply overscan
    const overscanStartIndex = Math.max(0, startIndex - overscan);
    const overscanEndIndex = Math.min(items.length - 1, endIndex + overscan);

    const visibleItems: VirtualizedItem[] = [];
    for (let i = overscanStartIndex; i <= overscanEndIndex; i++) {
      visibleItems.push(itemPositions[i]);
    }

    return {
      startIndex: overscanStartIndex,
      endIndex: overscanEndIndex,
//       visibleItems
    };
  }, [isVertical ? scrollTop : scrollLeft, items.length, getStartIndex, itemPositions, overscan, containerHeight, width]);

  // Handle scroll events
  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const newScrollTop = element.scrollTop;
    const newScrollLeft = element.scrollLeft;

    setScrollTop(newScrollTop);
    setScrollLeft(newScrollLeft);

    onScroll?.(newScrollTop, newScrollLeft);
  }, [onScroll]);

  // Scroll to specific index
  useEffect(() => {
    if (scrollToIndex !== undefined && scrollElementRef.current && itemPositions[scrollToIndex]) {
      const item = itemPositions[scrollToIndex];
      const element = scrollElementRef.current;
      
      let scrollOffset = item.offset;

      // Apply alignment
      if (scrollToAlignment === 'center') {
        scrollOffset = item.offset - (containerHeight / 2) + (item.size / 2);
      } else if (scrollToAlignment === 'end') {
        scrollOffset = item.offset - containerHeight + item.size;
      } else if (scrollToAlignment === 'auto') {
        const currentScrollOffset = isVertical ? scrollTop : scrollLeft;
        const containerSize = isVertical ? containerHeight : (width || 0);

        if (item.offset < currentScrollOffset) {
          scrollOffset = item.offset;
        } else if (item.offset + item.size > currentScrollOffset + containerSize) {
          scrollOffset = item.offset - containerSize + item.size;
        } else {
          return; // Item already visible
        }
      }

      element[scrollProperty] = Math.max(0, Math.min(scrollOffset, totalSize - (isVertical ? containerHeight : width || 0)));
    }
  }, [scrollToIndex, scrollToAlignment, itemPositions, containerHeight, width, isVertical, scrollProperty, totalSize, scrollTop, scrollLeft]);

  // Render item with optimizations
  const renderVirtualizedItem = useCallback((virtualItem: VirtualizedItem) => {
    const { index, offset, size } = virtualItem;
    const item = items[index];

    if (!item) return null;

    const style: React.CSSProperties = {
      position: 'absolute',
      [offsetProperty]: offset,
      [sizeProperty]: size,
      ...(isVertical ? { width: '100%' } : { height: '100%' })
    };

    const key = itemKey ? itemKey(item, index) : index;

    return (
      <div key={key} style={style} data-index={index}>
        {renderItem(item, index, style)}
      </div>
    );
  }, [items, renderItem, itemKey, offsetProperty, sizeProperty, isVertical]);

  // Render sticky items
  const renderStickyItems = useCallback(() => {
    if (!sticky) return null;

    return sticky.indices.map((index: any) => {
      const item = items[index];
      if (!item) return null;

      const key = itemKey ? itemKey(item, index) : `sticky-${index}`;
      
      return (
        <div 
          key={key}
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: 'white'
          }}
          data-sticky-index={index}
        >
          {sticky.renderSticky(item, index)}
        </div>
      );
    });
  }, [sticky, items, itemKey]);

  // Loading placeholder
  if (items.length === 0 && renderPlaceholder) {
    return (
      <div 
        ref={containerRef}
        className={`virtualized-list-container ${className}`}
        style={{ height: containerHeight, width }}
      >
        {renderPlaceholder()}
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`virtualized-list-container ${className}`}
      style={{ 
        position: 'relative',
        height: containerHeight, 
        width,
        overflow: 'hidden'
      }}
    >
      {/* Sticky items */}
      {renderStickyItems()}
      
      {/* Scrollable content */}
      <div
        ref={scrollElementRef}
        className="virtualized-list-scroll"
        style={{
          height: '100%',
          width: '100%',
          overflow: 'auto',
          position: 'relative'
        }}
        onScroll={handleScroll}
      >
        {/* Total space container */}
        <div
          className="virtualized-list-spacer"
          style={{
            position: 'relative',
            [sizeProperty]: totalSize,
            ...(isVertical ? { width: '100%' } : { height: '100%' })
          }}
        >
          {/* Rendered items */}
          {visibleRange.visibleItems.map(renderVirtualizedItem)}
        </div>
      </div>

      {/* Debug info in development */}
      {import.meta.env.DEV && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: 'rgba(0,0,0,0.8)',
            color: 'white',
            padding: '4px 8px',
            fontSize: '10px',
            pointerEvents: 'none',
            zIndex: 1000
          }}
        >
          Visible: {visibleRange.startIndex}-{visibleRange.endIndex} / {items.length}
        </div>
      )}
    </div>
  );

// Optimized list item wrapper with React.memo
interface ListItemProps<T> {
  item: T;
  index: number;
  style: React.CSSProperties;
  children: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;

const ListItemWrapper = React.memo(<T,>({ 
  item, 
  index, 
  style, 
//   children 
}: ListItemProps<T>) => {
  return (
    <div style={style}>
      {children(item, index, style)}
    </div>
  );
});

ListItemWrapper.displayName = 'ListItemWrapper';

// Hook for virtualized list state management
export const useVirtualizedList = <T,>(
  items: T[],
  containerHeight: number
) => {
  const [scrollToIndex, setScrollToIndex] = useState<number | undefined>();
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollTo = useCallback((index: number, alignment?: 'start' | 'center' | 'end' | 'auto') => {
    setScrollToIndex(index);
  }, []);

  const handleScroll = useCallback((scrollTop: number, scrollLeft: number) => {
    setIsScrolling(true);
    
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    scrollToIndex,
    isScrolling,
    scrollTo,
//     handleScroll
  };
};

// Optimized player list component
export const VirtualizedPlayerList: React.FC<{
  players: any[];
  containerHeight: number;
  onPlayerClick?: (player: any, index: number) => void;
  selectedPlayers?: Set<string>;
}> = ({ 
  players, 
  containerHeight, 
  onPlayerClick,
  selectedPlayers = new Set()
}: any) => {
  const { scrollToIndex, isScrolling, scrollTo, handleScroll } = useVirtualizedList(
    players,
//     containerHeight
  );

  const renderPlayer = useCallback((player: any, index: number, style: React.CSSProperties) => {
    const isSelected = selectedPlayers.has(player.id);
    
    return (
      <div
        style={style}
        className={`
          flex items-center p-4 border-b border-gray-200 dark:border-gray-700 
          cursor-pointer transition-colors duration-200
          ${isSelected ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}
          ${isScrolling ? 'pointer-events-none' : ''}
        `}
        onClick={() => onPlayerClick?.(player, index)}
      >
        <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          {player.image ? (
            <img 
              src={player.image} 
              alt={player.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              {player.name?.[0]?.toUpperCase() || '?'}
            </div>
          )}
        </div>
        
        <div className="ml-4 flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {player.name}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {player.position}
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {player.team}
            </p>
            {player.projection && (
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                {player.projection} pts
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }, [onPlayerClick, selectedPlayers, isScrolling]);

  return (
    <VirtualizedList
      items={players}
      itemHeight={80}
      containerHeight={containerHeight}
      renderItem={renderPlayer}
      scrollToIndex={scrollToIndex}
      onScroll={handleScroll}
      overscan={10}
      itemKey={(player, index) => player.id || index}
      className="virtualized-player-list"
    />
  );
};

export default VirtualizedList;