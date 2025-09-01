/**
 * Enhanced Dashboard System - Customizable Widget Layout with Drag & Drop
 * Professional dashboard with customizable widgets, layout persistence, and advanced features
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useState, useRef, useCallback, useMemo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  Active,
  Over
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import {
  useSortable,
  CSS
} from '@dnd-kit/sortable';

// =========================================
// TYPES & INTERFACES
// =========================================

export type WidgetSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type WidgetType = 
  | 'stat' 
  | 'chart' 
  | 'table' 
  | 'feed' 
  | 'player' 
  | 'standings' 
  | 'schedule' 
  | 'trades'
  | 'news'
  | 'weather'
  | 'calendar'
  | 'analytics';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: WidgetSize;
  position: { row: number; col: number };
  props?: Record<string, any>;
  isVisible?: boolean;
  isLocked?: boolean;
  refreshInterval?: number;
  lastUpdated?: Date;
  priority?: number;

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: Widget[];
  columns: number;
  created: Date;
  modified: Date;
  isDefault?: boolean;

}

export interface DashboardContextType {
  layouts: DashboardLayout[];
  currentLayout: DashboardLayout | null;
  isEditing: boolean;
  availableWidgets: WidgetType[];
  createLayout: (name: string) => void;
  updateLayout: (layout: DashboardLayout) => void;
  deleteLayout: (layoutId: string) => void;
  setCurrentLayout: (layoutId: string) => void;
  addWidget: (widget: Omit<Widget, 'id'>) => void;
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  removeWidget: (widgetId: string) => void;
  toggleEditMode: () => void;
  exportLayout: () => string;
  importLayout: (data: string) => void;
  resetLayout: () => void;

// =========================================
// DASHBOARD CONTEXT
// =========================================}

const DashboardContext = React.createContext<DashboardContextType | null>(null);

}

export const useDashboard = (): DashboardContextType => {
  const context = React.useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');

  return context;
};

// =========================================
// WIDGET SIZE CONFIGURATIONS
// =========================================

const widgetSizeConfig: Record<WidgetSize, { 
  gridColumns: string; 
  gridRows: string; 
  minHeight: string;
  maxHeight?: string;
}> = {
  sm: { 
    gridColumns: 'col-span-1 md:col-span-2', 
    gridRows: 'row-span-1', 
    minHeight: 'min-h-[200px]' 
  },
  md: { 
    gridColumns: 'col-span-1 md:col-span-3', 
    gridRows: 'row-span-2', 
    minHeight: 'min-h-[300px]' 
  },
  lg: { 
    gridColumns: 'col-span-1 md:col-span-4', 
    gridRows: 'row-span-3', 
    minHeight: 'min-h-[400px]' 
  },
  xl: { 
    gridColumns: 'col-span-1 md:col-span-6', 
    gridRows: 'row-span-4', 
    minHeight: 'min-h-[500px]' 
  },
  full: { 
    gridColumns: 'col-span-full', 
    gridRows: 'row-span-6', 
    minHeight: 'min-h-[600px]' 

};

// =========================================
// SORTABLE WIDGET COMPONENT
// =========================================

interface SortableWidgetProps {
  widget: Widget;
  children: ReactNode;
  isEditing: boolean;
  onEdit?: (widget: Widget) => void;
  onRemove?: (widgetId: string) => void;
  onResize?: (widgetId: string, size: WidgetSize) => void;

}

const SortableWidget: React.FC<SortableWidgetProps> = ({
  widget,
  children,
  isEditing,
  onEdit,
  onRemove,
  onResize
}: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: widget.id,
    disabled: !isEditing || widget.isLocked
  });

  const [showControls, setShowControls] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto',
    opacity: isDragging ? 0.5 : 1
  };

  const sizeConfig = widgetSizeConfig[widget.size];

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`
        relative group
        ${sizeConfig.gridColumns}
        ${sizeConfig.minHeight}
        ${isEditing ? 'cursor-move' : ''}
      `}
      whileHover={{ scale: isEditing ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => isEditing && setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Widget Controls - Edit Mode Only */}
      <AnimatePresence>
        {isEditing && showControls && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-2 -right-2 z-10 flex gap-1 sm:px-4 md:px-6 lg:px-8"
          >
            {/* Drag Handle */}
            <motion.button
              {...attributes}
              {...listeners}
              className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-700 transition-colors sm:px-4 md:px-6 lg:px-8"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Drag to reorder"
            >
              <svg className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </motion.button>

            {/* Edit Button */}
            <motion.button
              onClick={() => onEdit?.(widget)}
              className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors sm:px-4 md:px-6 lg:px-8"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Edit widget"
            >
              <svg className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </motion.button>

            {/* Remove Button */}
            {!widget.isLocked && (
              <motion.button
                onClick={() => onRemove?.(widget.id)}
                className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors sm:px-4 md:px-6 lg:px-8"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Remove widget"
              >
                <svg className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Content */}
      <div className="h-full sm:px-4 md:px-6 lg:px-8">
        {children}
      </div>

      {/* Editing Overlay */}
      {isEditing && (
        <div className="absolute inset-0 border-2 border-dashed border-primary-400 rounded-lg pointer-events-none opacity-50 sm:px-4 md:px-6 lg:px-8" />
      )}
    </motion.div>
  );
};

// =========================================
// WIDGET COMPONENTS
// =========================================

interface BaseWidgetProps {
  widget: Widget;
  className?: string;

}

const BaseWidget: React.FC<BaseWidgetProps & { children: ReactNode }> = ({
  widget,
  children,
  className = ''
}: any) => {
  return (
    <div className={`
      h-full bg-glass-medium backdrop-blur-xl 
      border border-glass-border rounded-2xl p-6
      transition-all duration-300
      hover:bg-glass-heavy hover:border-glass-border-strong
      ${className}
    `}>
      <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
        <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">{widget.title}</h3>
        {widget.lastUpdated && (
          <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
            Updated {new Date(widget.lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>
      <div className="h-full pb-16 sm:px-4 md:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
};

export const StatWidget: React.FC<BaseWidgetProps> = ({ widget }: any) => {
  const data = widget.props || {};
  
  return (
    <BaseWidget widget={widget}>
      <div className="text-center sm:px-4 md:px-6 lg:px-8">
        <div className="text-4xl font-bold text-white mb-2 sm:px-4 md:px-6 lg:px-8">
          {data.value || '0'}
        </div>
        <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
          {data.subtitle || 'No data'}
        </div>
        {data.change && (
          <div className={`text-sm mt-2 ${
            data.change > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {data.change > 0 ? '↗' : '↘'} {Math.abs(data.change)}%
          </div>
        )}
      </div>
    </BaseWidget>
  );
};

export const ChartWidget: React.FC<BaseWidgetProps> = ({ widget }: any) => {
  return (
    <BaseWidget widget={widget}>
      <div className="flex items-center justify-center h-full text-gray-400 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center sm:px-4 md:px-6 lg:px-8">
          <div className="text-6xl mb-4 sm:px-4 md:px-6 lg:px-8">📊</div>
          <div>Chart data would go here</div>
        </div>
      </div>
    </BaseWidget>
  );
};

export const FeedWidget: React.FC<BaseWidgetProps> = ({ widget }: any) => {
  const items = widget.props?.items || [];
  
  return (
    <BaseWidget widget={widget}>
      <div className="space-y-3 max-h-full overflow-y-auto sm:px-4 md:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="text-center text-gray-400 py-8 sm:px-4 md:px-6 lg:px-8">
            No items to display
          </div>
        ) : (
          items.map((item: any, index: number) => (
            <div key={index} className="p-3 bg-glass-light rounded-lg sm:px-4 md:px-6 lg:px-8">
              <div className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{item.title}</div>
              <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{item.description}</div>
            </div>
          ))
        )}
      </div>
    </BaseWidget>
  );
};

// =========================================
// WIDGET FACTORY
// =========================================

const WidgetFactory: React.FC<{ widget: Widget }> = ({ widget }: any) => {
  const components = {
    stat: StatWidget,
    chart: ChartWidget,
    table: FeedWidget,
    feed: FeedWidget,
    player: FeedWidget,
    standings: ChartWidget,
    schedule: FeedWidget,
    trades: FeedWidget,
    news: FeedWidget,
    weather: StatWidget,
    calendar: FeedWidget,
    analytics: ChartWidget
  };

  const Component = components[widget.type] || FeedWidget;
  return <Component widget={widget} />;
};

// =========================================
// DASHBOARD GRID
// =========================================

interface DashboardGridProps {
  widgets: Widget[];
  isEditing: boolean;
  onWidgetUpdate: (widgetId: string, updates: Partial<Widget>) => void;
  onWidgetRemove: (widgetId: string) => void;
  columns?: number;

}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  widgets,
  isEditing,
  onWidgetUpdate,
  onWidgetRemove,
  columns = 6
}: any) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [items, setItems] = useState(widgets);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  React.useEffect(() => {
    setItems(widgets);
  }, [widgets]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items: any) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over?.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update positions
        newItems.forEach((item, index) => {
          const row = Math.floor(index / columns);
          const col = index % columns;
          onWidgetUpdate(item.id, { position: { row, col } });
        });

        return newItems;
      });

    setActiveId(null);
  }, [columns, onWidgetUpdate]);

  const visibleWidgets = items.filter((widget: any) => widget.isVisible !== false);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={visibleWidgets.map((w: any) => w.id)}
        strategy={rectSortingStrategy}
      >
        <motion.div 
          className={`
            grid gap-6 auto-rows-min
            grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-${columns}
          `}
          layout
        >
          <AnimatePresence>
            {visibleWidgets.map((widget: any) => (
              <SortableWidget
                key={widget.id}
                widget={widget}
                isEditing={isEditing}
                onEdit={(w: any) => console.log('Edit widget:', w)}
                onRemove={onWidgetRemove}
                onResize={(id, size) => onWidgetUpdate(id, { size })}
              >
                <WidgetFactory widget={widget} />
              </SortableWidget>
            ))}
          </AnimatePresence>
        </motion.div>
      </SortableContext>
    </DndContext>
  );
};

// =========================================
// WIDGET LIBRARY
// =========================================

interface WidgetLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (widget: Omit<Widget, 'id'>) => void;

}

export const WidgetLibrary: React.FC<WidgetLibraryProps> = ({
  isOpen,
  onClose,
  onAddWidget
}: any) => {
  const availableWidgets: { type: WidgetType; title: string; icon: string; description: string; defaultSize: WidgetSize }[] = [
    { type: 'stat', title: 'Stat Card', icon: '📊', description: 'Display key statistics', defaultSize: 'sm' },
    { type: 'chart', title: 'Chart', icon: '📈', description: 'Visual data representation', defaultSize: 'md' },
    { type: 'standings', title: 'League Standings', icon: '🏆', description: 'Current league standings', defaultSize: 'lg' },
    { type: 'player', title: 'Player Info', icon: '👤', description: 'Player details and stats', defaultSize: 'md' },
    { type: 'schedule', title: 'Schedule', icon: '📅', description: 'Upcoming games and events', defaultSize: 'md' },
    { type: 'trades', title: 'Recent Trades', icon: '🔄', description: 'Latest trade activity', defaultSize: 'md' },
    { type: 'news', title: 'News Feed', icon: '📰', description: 'Latest fantasy news', defaultSize: 'lg' },
    { type: 'analytics', title: 'Analytics', icon: '🎯', description: 'Advanced analytics and insights', defaultSize: 'xl' }
  ];

  const handleAddWidget = (widgetTemplate: typeof availableWidgets[0]) => {
    const newWidget: Omit<Widget, 'id'> = {
      type: widgetTemplate.type,
      title: widgetTemplate.title,
      size: widgetTemplate.defaultSize,
      position: { row: 0, col: 0 },
      isVisible: true,
      priority: 1
    };

    onAddWidget(newWidget);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 sm:px-4 md:px-6 lg:px-8"
            onClick={onClose}
          />

          {/* Widget Library Panel */}
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-dark-900 border-l border-gray-700 z-50 overflow-y-auto sm:px-4 md:px-6 lg:px-8"
          >
            <div className="p-6 sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Widget Library</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-glass-medium rounded-full flex items-center justify-center text-white hover:bg-glass-heavy transition-colors sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                  ✕
                </button>
              </div>

              <div className="grid gap-4 sm:px-4 md:px-6 lg:px-8">
                {availableWidgets.map((widget: any) => (
                  <motion.button
                    key={widget.type}
                    onClick={() => handleAddWidget(widget)}
                    className="p-4 bg-glass-light hover:bg-glass-medium border border-glass-border rounded-xl text-left transition-all duration-200 sm:px-4 md:px-6 lg:px-8"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
                      <div className="text-2xl sm:px-4 md:px-6 lg:px-8">{widget.icon}</div>
                      <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                        <h3 className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">{widget.title}</h3>
                        <p className="text-gray-400 text-sm mt-1 sm:px-4 md:px-6 lg:px-8">{widget.description}</p>
                        <div className="text-xs text-primary-400 mt-2 sm:px-4 md:px-6 lg:px-8">
                          Size: {widget.defaultSize.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// =========================================
// DASHBOARD PROVIDER
// =========================================

interface DashboardProviderProps {
  children: ReactNode;
  storageKey?: string;

}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
  storageKey = 'astral-draft-dashboard'
}: any) => {
  const [layouts, setLayouts] = useState<DashboardLayout[]>([]);
  const [currentLayout, setCurrentLayoutState] = useState<DashboardLayout | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Sample data for initial layout
  const defaultLayout: DashboardLayout = {
    id: 'default',
    name: 'Default Dashboard',
    columns: 6,
    created: new Date(),
    modified: new Date(),
    isDefault: true,
    widgets: [
      {
        id: 'stat-1',
        type: 'stat',
        title: 'League Rank',
        size: 'sm',
        position: { row: 0, col: 0 },
        props: { value: '#2', subtitle: 'out of 12 teams', change: 1 },
        isVisible: true
      },
      {
        id: 'stat-2',
        type: 'stat',
        title: 'Total Points',
        size: 'sm',
        position: { row: 0, col: 1 },
        props: { value: '1,247', subtitle: 'season total', change: 5 },
        isVisible: true
      },
      {
        id: 'standings-1',
        type: 'standings',
        title: 'League Standings',
        size: 'lg',
        position: { row: 0, col: 2 },
        isVisible: true
      },
      {
        id: 'news-1',
        type: 'news',
        title: 'Fantasy News',
        size: 'md',
        position: { row: 1, col: 0 },
        props: {
          items: [
            { title: 'Player Update', description: 'Latest injury report' },
            { title: 'Trade News', description: 'Big trade shakes up league' }

        },
        isVisible: true

  };

  // Initialize with default layout
  React.useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {

        const data = JSON.parse(stored);
        setLayouts(data.layouts || [defaultLayout]);
        setCurrentLayoutState(data.currentLayout || defaultLayout);
      
    `layout-${Date.now()}`,
        name,
        widgets: [],
        columns: 6,
        created: new Date(),
        modified: new Date()
      };
      setLayouts(prev => [...prev, newLayout]);
    },

    updateLayout: (layout: DashboardLayout) => {
      setLayouts(prev => prev.map((l: any) => l.id === layout.id ? { ...layout, modified: new Date() } : l));
      if (currentLayout?.id === layout.id) {
        setCurrentLayoutState({ ...layout, modified: new Date() });

    },

    deleteLayout: (layoutId: string) => {
      setLayouts(prev => prev.filter((l: any) => l.id !== layoutId));
      if (currentLayout?.id === layoutId) {
        const remaining = layouts.filter((l: any) => l.id !== layoutId);
        setCurrentLayoutState(remaining[0] || null);

    },

    setCurrentLayout: (layoutId: string) => {
      const layout = layouts.find((l: any) => l.id === layoutId);
      if (layout) {
        setCurrentLayoutState(layout);

    },

    addWidget: (widget: Omit<Widget, 'id'>) => {
      if (!currentLayout) return;

      const newWidget: Widget = {
        ...widget,
        id: `widget-${Date.now()}`
      };

      const updatedLayout = {
        ...currentLayout,
        widgets: [...currentLayout.widgets, newWidget],
        modified: new Date()
      };

      setCurrentLayoutState(updatedLayout);
      setLayouts(prev => prev.map((l: any) => l.id === updatedLayout.id ? updatedLayout : l));
    },

    updateWidget: (widgetId: string, updates: Partial<Widget>) => {
      if (!currentLayout) return;

      const updatedLayout = {
        ...currentLayout,
        widgets: currentLayout.widgets.map((w: any) => 
          w.id === widgetId ? { ...w, ...updates } : w
        ),
        modified: new Date()
      };

      setCurrentLayoutState(updatedLayout);
      setLayouts(prev => prev.map((l: any) => l.id === updatedLayout.id ? updatedLayout : l));
    },

    removeWidget: (widgetId: string) => {
      if (!currentLayout) return;

      const updatedLayout = {
        ...currentLayout,
        widgets: currentLayout.widgets.filter((w: any) => w.id !== widgetId),
        modified: new Date()
      };

      setCurrentLayoutState(updatedLayout);
      setLayouts(prev => prev.map((l: any) => l.id === updatedLayout.id ? updatedLayout : l));
    },

    toggleEditMode: () => {
      setIsEditing(prev => !prev);
    },

    exportLayout: () => {
      return JSON.stringify({ layouts, currentLayout }, null, 2);
    },

    importLayout: (data: string) => {
      try {

        const parsed = JSON.parse(data);
        if (parsed.layouts && parsed.currentLayout) {
          setLayouts(parsed.layouts);
          setCurrentLayoutState(parsed.currentLayout);

    } catch (error) {
        throw new Error('Invalid dashboard data format');

    },

    resetLayout: () => {
      setLayouts([defaultLayout]);
      setCurrentLayoutState(defaultLayout);
      setIsEditing(false);

  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};

// =========================================
// EXPORTS
// =========================================

export default {
  DashboardProvider,
  DashboardGrid,
  WidgetLibrary,
  useDashboard
};