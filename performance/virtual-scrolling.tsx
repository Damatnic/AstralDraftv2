/**
 * Virtual Scrolling Components
 * High-performance scrolling for large datasets
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from &apos;react&apos;;
import { useResizeObserver, useIntersectionObserver } from &apos;./memory-optimization&apos;;

interface VirtualScrollProps {
}
  items: any[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export const VirtualScroll: React.FC<VirtualScrollProps> = ({
}
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = &apos;&apos;
}) => {
}
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
}
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );

    return {
}
      start: Math.max(0, startIndex - overscan),
      end: Math.min(items.length - 1, endIndex + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
}
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange.start, visibleRange.end]);

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
}
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Calculate spacer heights
  const topSpacerHeight = visibleRange.start * itemHeight;
  const bottomSpacerHeight = (items.length - visibleRange.end - 1) * itemHeight;

  return (
    <div
      ref={scrollElementRef}
      className={`virtual-scroll-container ${className}`}
      style={{ height: containerHeight, overflow: &apos;auto&apos; }}
      onScroll={handleScroll}
    >
      {/* Top spacer */}
      <div style={{ height: topSpacerHeight }} />
      
      {/* Visible items */}
      {visibleItems.map((item, index) => (
}
        <div
          key={visibleRange.start + index}
          style={{ height: itemHeight }}
          className="virtual-scroll-item"
        >
          {renderItem(item, visibleRange.start + index)}
        </div>
      ))}
      
      {/* Bottom spacer */}
      <div style={{ height: bottomSpacerHeight }} />
    </div>
  );
};

interface VariableHeightVirtualScrollProps {
}
  items: any[];
  estimatedItemHeight: number;
  containerHeight: number;
  renderItem: (item: any, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export const VariableHeightVirtualScroll: React.FC<VariableHeightVirtualScrollProps> = ({
}
  items,
  estimatedItemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = &apos;&apos;
}) => {
}
  const [scrollTop, setScrollTop] = useState(0);
  const [itemHeights, setItemHeights] = useState<number[]>([]);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Initialize item heights with estimates
  useEffect(() => {
}
    setItemHeights(new Array(items.length).fill(estimatedItemHeight));
  }, [items.length, estimatedItemHeight]);

  // Calculate cumulative heights for efficient lookups
  const cumulativeHeights = useMemo(() => {
}
    const heights = [0];
    for (let i = 0; i < itemHeights.length; i++) {
}
      heights.push(heights[i] + (itemHeights[i] || estimatedItemHeight));
    }
    return heights;
  }, [itemHeights, estimatedItemHeight]);

  // Find visible range using binary search
  const visibleRange = useMemo(() => {
}
    if (cumulativeHeights.length === 0) return { start: 0, end: 0 };

    const findIndex = (targetOffset: number) => {
}
      let low = 0;
      let high = cumulativeHeights.length - 1;
      
      while (low < high) {
}
        const mid = Math.floor((low + high) / 2);
        if (cumulativeHeights[mid] < targetOffset) {
}
          low = mid + 1;
        } else {
}
          high = mid;
        }
      }
      
      return Math.max(0, low - 1);
    };

    const start = findIndex(scrollTop);
    const end = findIndex(scrollTop + containerHeight);

    return {
}
      start: Math.max(0, start - overscan),
      end: Math.min(items.length - 1, end + overscan)
    };
  }, [scrollTop, containerHeight, cumulativeHeights, items.length, overscan]);

  // Update item heights when they change
  const updateItemHeight = useCallback((index: number, height: number) => {
}
    setItemHeights(prev => {
}
      if (prev[index] !== height) {
}
        const newHeights = [...prev];
        newHeights[index] = height;
        return newHeights;
      }
      return prev;
    });
  }, []);

  // ResizeObserver for measuring item heights
  const { observe } = useResizeObserver();

  useEffect(() => {
}
    itemRefs.current.forEach((ref, index) => {
}
      if (ref && index >= visibleRange.start && index <= visibleRange.end) {
}
        const cleanup = observe(ref);
        const resizeObserver = new ResizeObserver((entries) => {
}
          for (const entry of entries) {
}
            const height = entry.contentRect.height;
            updateItemHeight(index, height);
          }
        });
        
        resizeObserver.observe(ref);
        
        return () => {
}
          cleanup();
          resizeObserver.disconnect();
        };
      }
    });
  }, [visibleRange, observe, updateItemHeight]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
}
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const visibleItems = items.slice(visibleRange.start, visibleRange.end + 1);
  const topOffset = cumulativeHeights[visibleRange.start] || 0;
  const totalHeight = cumulativeHeights[cumulativeHeights.length - 1] || 0;

  return (
    <div
      ref={scrollElementRef}
      className={`variable-virtual-scroll-container ${className}`}
      style={{ height: containerHeight, overflow: &apos;auto&apos; }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: &apos;relative&apos; }}>
        {visibleItems.map((item, index) => {
}
          const actualIndex = visibleRange.start + index;
          return (
            <div
              key={actualIndex}
              ref={(el) => { itemRefs.current[actualIndex] = el; }}
              style={{
}
                position: &apos;absolute&apos;,
                top: topOffset + (index > 0 ? 
                  itemHeights.slice(visibleRange.start, visibleRange.start + index)
                    .reduce((sum, height) => sum + height, 0) : 0),
                width: &apos;100%&apos;
              }}
              className="variable-virtual-scroll-item"
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface InfiniteScrollProps {
}
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
  className?: string;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
}
  items,
  renderItem,
  loadMore,
  hasMore,
  loading,
  threshold = 200,
  className = &apos;&apos;
}) => {
}
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { entries, observe } = useIntersectionObserver({
}
    rootMargin: `${threshold}px`
  });

  // Trigger element for infinite scroll
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
}
    if (triggerRef.current && hasMore && !loading) {
}
      return observe(triggerRef.current);
    }
  }, [observe, hasMore, loading]);

  // Handle infinite scroll trigger
  useEffect(() => {
}
    const triggerEntry = entries.find(entry => entry.target === triggerRef.current);
    
    if (triggerEntry?.isIntersecting && hasMore && !loading && !isLoadingMore) {
}
      setIsLoadingMore(true);
      loadMore().finally(() => setIsLoadingMore(false));
    }
  }, [entries, hasMore, loading, isLoadingMore, loadMore]);

  return (
    <div ref={containerRef} className={`infinite-scroll-container ${className}`}>
      {items.map((item, index) => (
}
        <div key={index} className="infinite-scroll-item">
          {renderItem(item, index)}
        </div>
      ))}
      
      {hasMore && (
}
        <div
          ref={triggerRef}
          className="infinite-scroll-trigger"
          style={{ height: 20, opacity: 0 }}
        />
      )}
      
      {(loading || isLoadingMore) && (
}
        <div className="infinite-scroll-loading">
          Loading more items...
        </div>
      )}
      
      {!hasMore && items.length > 0 && (
}
        <div className="infinite-scroll-end">
          No more items to load
        </div>
      )}
    </div>
  );
};

// High-performance table virtualization
interface VirtualTableProps {
}
  data: any[];
  columns: Array<{
}
    key: string;
    header: string;
    width: number;
    render?: (value: any, item: any, index: number) => React.ReactNode;
  }>;
  rowHeight: number;
  containerHeight: number;
  containerWidth: number;
  overscan?: number;
  className?: string;
}

export const VirtualTable: React.FC<VirtualTableProps> = ({
}
  data,
  columns,
  rowHeight,
  containerHeight,
  containerWidth,
  overscan = 5,
  className = &apos;&apos;
}) => {
}
  const [scrollTop, setScrollTop] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  const visibleRowRange = useMemo(() => {
}
    const startIndex = Math.floor(scrollTop / rowHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / rowHeight),
      data.length - 1
    );

    return {
}
      start: Math.max(0, startIndex - overscan),
      end: Math.min(data.length - 1, endIndex + overscan)
    };
  }, [scrollTop, rowHeight, containerHeight, data.length, overscan]);

  const visibleColumnRange = useMemo(() => {
}
    let accumulatedWidth = 0;
    let startIndex = 0;
    let endIndex = columns.length - 1;

    // Find start column
    for (let i = 0; i < columns.length; i++) {
}
      if (accumulatedWidth + columns[i].width > scrollLeft) {
}
        startIndex = i;
        break;
      }
      accumulatedWidth += columns[i].width;
    }

    // Find end column
    accumulatedWidth = 0;
    for (let i = startIndex; i < columns.length; i++) {
}
      accumulatedWidth += columns[i].width;
      if (accumulatedWidth >= containerWidth) {
}
        endIndex = i;
        break;
      }
    }

    return { start: startIndex, end: endIndex };
  }, [scrollLeft, containerWidth, columns]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
}
    setScrollTop(e.currentTarget.scrollTop);
    setScrollLeft(e.currentTarget.scrollLeft);
  }, []);

  const totalHeight = data.length * rowHeight;
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);
  
  const topSpacerHeight = visibleRowRange.start * rowHeight;
  const bottomSpacerHeight = (data.length - visibleRowRange.end - 1) * rowHeight;
  
  const leftSpacerWidth = columns
    .slice(0, visibleColumnRange.start)
    .reduce((sum, col) => sum + col.width, 0);
  const rightSpacerWidth = columns
    .slice(visibleColumnRange.end + 1)
    .reduce((sum, col) => sum + col.width, 0);

  return (
    <div
      className={`virtual-table-container ${className}`}
      style={{ 
}
        height: containerHeight, 
        width: containerWidth,
        overflow: &apos;auto&apos; 
      }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, width: totalWidth, position: &apos;relative&apos; }}>
        {/* Top spacer */}
        <div style={{ height: topSpacerHeight }} />
        
        {/* Visible rows */}
        {data.slice(visibleRowRange.start, visibleRowRange.end + 1).map((item, rowIndex) => (
}
          <div
            key={visibleRowRange.start + rowIndex}
            className="virtual-table-row"
            style={{ 
}
              height: rowHeight, 
              display: &apos;flex&apos;,
              position: &apos;relative&apos;
            }}
          >
            {/* Left spacer */}
            <div style={{ width: leftSpacerWidth }} />
            
            {/* Visible columns */}
            {columns.slice(visibleColumnRange.start, visibleColumnRange.end + 1).map((column) => (
}
              <div
                key={column.key}
                className="virtual-table-cell"
                style={{ 
}
                  width: column.width,
                  height: rowHeight,
                  display: &apos;flex&apos;,
                  alignItems: &apos;center&apos;,
                  padding: &apos;0 8px&apos;
                }}
              >
                {column.render 
}
                  ? column.render(item[column.key], item, visibleRowRange.start + rowIndex)
                  : item[column.key]
                }
              </div>
            ))}
            
            {/* Right spacer */}
            <div style={{ width: rightSpacerWidth }} />
          </div>
        ))}
        
        {/* Bottom spacer */}
        <div style={{ height: bottomSpacerHeight }} />
      </div>
    </div>
  );
};