/**
 * React Performance Optimizations - Component-Level Performance Enhancements
 * Implements React.memo, useMemo, useCallback, and other React-specific optimizations
 */

import React, { memo, useMemo, useCallback, useState, useRef, useEffect } from 'react';

// HOC for performance monitoring
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string = 'Component'
) => {
  const MonitoredComponent = React.forwardRef<any, P>((props, ref) => {
    const startTime = useRef<number>(0);
    const renderCount = useRef<number>(0);

    useEffect(() => {
      startTime.current = performance.now();
      renderCount.current += 1;
    });

    useEffect(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime.current;
      
      if (import.meta.env.DEV && renderTime > 16) { // Warn if render takes longer than one frame
        console.warn(`🐌 Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms (render #${renderCount.current})`);
      }
    });

    return <WrappedComponent {...props} ref={ref} />;
  });

  MonitoredComponent.displayName = `withPerformanceMonitoring(${componentName})`;
  return MonitoredComponent;
};

// Optimized List Component
interface OptimizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string | number;
  ItemComponent?: React.ComponentType<{ item: T; index: number }>;
  EmptyComponent?: React.ComponentType;
  threshold?: number;
  className?: string;

const OptimizedListItem = memo(<T,>({ 
  item, 
  index, 
//   renderItem 
}: { 
  item: T; 
  index: number; 
  renderItem: (item: T, index: number) => React.ReactNode;
}) => {
  return <>{renderItem(item, index)}</>;
});

OptimizedListItem.displayName = 'OptimizedListItem';

export const OptimizedList = memo(<T,>({
  items,
  renderItem,
  keyExtractor = (_, index) => index,
  ItemComponent,
  EmptyComponent,
  threshold = 100,
  className = ''
}: OptimizedListProps<T>) => {
  // Memoize the rendering logic
  const memoizedRenderItem = useCallback(renderItem, [renderItem]);
  
  // Use virtual scrolling for large lists
  const shouldVirtualize = useMemo(() => items.length > threshold, [items.length, threshold]);
  
  // Memoize the list items
  const listItems = useMemo(() => {
    if (shouldVirtualize) {
      // For demonstration - in real app, use the VirtualizedList component
      return items.slice(0, threshold).map((item, index) => {
        const key = keyExtractor(item, index);
        
        if (ItemComponent) {
          return (
            <ItemComponent
              key={key} 
              item={item} 
              index={index}
            />
          );
        }
        
        return (
          <OptimizedListItem
            key={key}
            item={item}
            index={index}
            renderItem={memoizedRenderItem}
          />
        );
      });
    }
    
    return items.map((item, index) => {
      const key = keyExtractor(item, index);
      
      if (ItemComponent) {
        return (
          <ItemComponent
            key={key} 
            item={item} 
            index={index}
          />
        );
      }
      
      return (
        <OptimizedListItem
          key={key}
          item={item}
          index={index}
          renderItem={memoizedRenderItem}
        />
      );
    });
  }, [items, keyExtractor, ItemComponent, memoizedRenderItem, shouldVirtualize, threshold]);

  if (items.length === 0 && EmptyComponent) {
    return <EmptyComponent />;
  }

  return (
    <div className={className}>
      {listItems}
      {shouldVirtualize && items.length > threshold && (
        <div className="text-center p-4 text-sm text-gray-500">
          Showing {threshold} of {items.length} items
        </div>
      )}
    </div>
  );
});

OptimizedList.displayName = 'OptimizedList';

// Debounced Input Component
interface DebouncedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange: (value: string) => void;
  debounceMs?: number;

export const DebouncedInput = memo(({
  onChange,
  debounceMs = 300,
  ...props
}: any) => {
  const [value, setValue] = useState(props.value || '');
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedOnChange = useCallback((newValue: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  }, [onChange, debounceMs]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    debouncedOnChange(newValue);
  }, [debouncedOnChange]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <input
      {...props}
      value={value}
      onChange={handleChange}
    />
  );
});

DebouncedInput.displayName = 'DebouncedInput';

// Memoized Player Card Component
interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  points?: number;
  image?: string;}

interface PlayerCardProps {
  player: Player;
  selected?: boolean;
  onSelect?: (player: Player) => void;
  showDetails?: boolean;}

export const PlayerCard = memo(({
  player,
  selected = false,
  onSelect,
  showDetails = true
}: any) => {
  const handleClick = useCallback(() => {
    onSelect?.(player);
  }, [player, onSelect]);

  const playerPoints = useMemo(() => {
    return player.points ? `${player.points.toFixed(1)} pts` : 'N/A';
  }, [player.points]);

  return (
    <div
      className={`
        p-4 rounded-lg border transition-all duration-200 cursor-pointer
        ${selected 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }
      `}
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        {player.image && (
          <img
            src={player.image}
            alt={player.name}
            className="w-12 h-12 rounded-full object-cover"
            loading="lazy"
          />
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {player.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {player.team} - {player.position}
            </p>
            
            {showDetails && (
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {playerPoints}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

PlayerCard.displayName = 'PlayerCard';

// Optimized Team Roster Component
interface TeamRosterProps {
  players: Player[];
  onPlayerSelect?: (player: Player) => void;
  selectedPlayerId?: string;
  groupByPosition?: boolean;}

export const TeamRoster = memo(({
  players,
  onPlayerSelect,
  selectedPlayerId,
  groupByPosition = false
}: any) => {
  // Memoize grouped players
  const groupedPlayers = useMemo(() => {
    if (!groupByPosition) {
      return { 'All Players': players };
    }
    
    return players.reduce((groups, player) => {
      const position = player.position;
      if (!groups[position]) {
        groups[position] = [];
      }
      groups[position].push(player);
      return groups;
    }, {} as Record<string, Player[]>);
  }, [players, groupByPosition]);

  // Memoize render functions
  const renderPlayer = useCallback((player: Player, index: number) => (
    <PlayerCard
      key={player.id}
      player={player}
      selected={player.id === selectedPlayerId}
      onSelect={onPlayerSelect}
    />
  ), [onPlayerSelect, selectedPlayerId]);

  const keyExtractor = useCallback((player: Player) => player.id, []);

  return (
    <div className="space-y-6">
      {Object.entries(groupedPlayers).map(([position, positionPlayers]) => (
        <div key={position} className="space-y-3">
          {groupByPosition && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {position} ({positionPlayers.length})
            </h3>
          )}
          
          <OptimizedList
            items={positionPlayers}
            renderItem={renderPlayer}
            keyExtractor={keyExtractor}
            className="grid gap-3 md:grid-cols-2 lg:grid-cols-3"
          />
        </div>
      ))}
    </div>
  );
});

TeamRoster.displayName = 'TeamRoster';

// Performance-optimized Modal
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';}

export const OptimizedModal = memo(({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}: any) => {
  // Memoize size classes
  const sizeClasses = useMemo(() => {
    switch (size) {
      case 'sm': return 'max-w-md';
      case 'md': return 'max-w-lg';
      case 'lg': return 'max-w-2xl';
      case 'xl': return 'max-w-4xl';
      default: return 'max-w-lg';
    }
  }, [size]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full ${sizeClasses} max-h-[90vh] overflow-hidden`}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>
      </div>
    </div>
  );
});

OptimizedModal.displayName = 'OptimizedModal';

// Hook for optimized state updates
export const useOptimizedState = <T,>(initialState: T) => {
  const [state, setState] = useState<T>(initialState);
  const stateRef = useRef<T>(state);

  // Update ref when state changes
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Optimized setter that prevents unnecessary re-renders
  const setOptimizedState = useCallback((newState: T | ((prevState: T) => T)) => {
    setState(prevState => {
      const nextState = typeof newState === 'function' 
        ? (newState as (prevState: T) => T)(prevState)
        : newState;
      
      // Shallow comparison to prevent unnecessary updates
      if (JSON.stringify(nextState) === JSON.stringify(prevState)) {
        return prevState;
      }
      
      return nextState;
    });
  }, []);

  // Get current state without causing re-render
  const getCurrentState = useCallback(() => stateRef.current, []);

  return [state, setOptimizedState, getCurrentState] as const;
};

// Component render count tracker (development only)
export const useRenderTracker = (componentName: string) => {
  const renderCount = useRef(0);
  
  if (import.meta.env.DEV) {
    renderCount.current += 1;
    console.log(`🔄 ${componentName} rendered ${renderCount.current} times`);
  }
  
  return renderCount.current;
};

// Stable reference hook
export const useStableCallback = <T extends (...args: any[]) => any>(callback: T): T => {
  const callbackRef = useRef<T>(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  return useCallback((...args: any[]) => {
    return callbackRef.current(...args);
  }, []) as T;
};