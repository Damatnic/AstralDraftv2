/**
 * Developer Tools Dashboard - Phase 3
 * Advanced debugging, development tools, and code analysis for Phase 3 features
 */

import React, { useState, useMemo } from 'react';

// Mock context for development tools
const useAppState = () => ({
  dispatch: (_action: { type: string; payload?: string }) => {
    // Mock dispatch function
  }
});

// Developer tools interfaces
interface DeveloperToolsProps {
  className?: string;
}

interface ComponentInfo {
  id: string;
  name: string;
  path: string;
  lineCount: number;
  complexity: number;
  dependencies: string[];
  hooks: string[];
  lastModified: string;
  author: string;
  status: 'stable' | 'development' | 'needs-review' | 'deprecated';
  testCoverage: number;
  documentation: 'complete' | 'partial' | 'missing';
}

interface DevTool {
  id: string;
  name: string;
  description: string;
  category: 'debugging' | 'analysis' | 'testing' | 'performance' | 'utilities';
  icon: string;
  action: string;
  enabled: boolean;
}

interface ConsoleMessage {
  id: string;
  type: 'log' | 'warn' | 'error' | 'debug' | 'info';
  timestamp: string;
  message: string;
  component?: string;
  stackTrace?: string[];
}

interface DebugSession {
  id: string;
  name: string;
  component: string;
  startTime: string;
  duration: number;
  status: 'active' | 'paused' | 'completed' | 'error';
  breakpoints: number;
  watchVariables: string[];
}

/**
 * Developer Tools Dashboard
 */
const DeveloperToolsDashboard: React.FC<DeveloperToolsProps> = ({ className = '' }) => {
  const { dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<'overview' | 'console' | 'debugger' | 'analyzer' | 'tools'>('overview');
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [consoleFilter, setConsoleFilter] = useState<'all' | 'error' | 'warn' | 'info'>('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Mock component data
  const componentInfo: ComponentInfo[] = useMemo(() => [
    {
      id: 'advanced-dashboard',
      name: 'AdvancedDashboardView',
      path: '/views/AdvancedDashboardView.tsx',
      lineCount: 636,
      complexity: 8.4,
      dependencies: ['react', 'use-app-state', 'widget-components'],
      hooks: ['useState', 'useMemo', 'useEffect'],
      lastModified: '2025-09-03T14:30:00Z',
      author: 'Phase 3 Enhancement',
      status: 'stable',
      testCoverage: 85,
      documentation: 'complete'
    },
    {
      id: 'player-analytics',
      name: 'EnhancedPlayerAnalysisView',
      path: '/views/EnhancedPlayerAnalysisView.tsx',
      lineCount: 542,
      complexity: 7.2,
      dependencies: ['react', 'player-data', 'chart-components'],
      hooks: ['useState', 'useMemo', 'useCallback'],
      lastModified: '2025-09-03T13:45:00Z',
      author: 'Phase 3 Enhancement',
      status: 'stable',
      testCoverage: 78,
      documentation: 'complete'
    },
    {
      id: 'integration-hub',
      name: 'EnhancedIntegrationHub',
      path: '/views/EnhancedIntegrationHub.tsx',
      lineCount: 734,
      complexity: 9.1,
      dependencies: ['react', 'navigation', 'feature-catalog'],
      hooks: ['useState', 'useMemo', 'useEffect', 'useRef'],
      lastModified: '2025-09-03T15:00:00Z',
      author: 'Phase 3 Enhancement',
      status: 'development',
      testCoverage: 65,
      documentation: 'partial'
    },
    {
      id: 'performance-monitoring',
      name: 'AdvancedPerformanceMonitoring',
      path: '/views/AdvancedPerformanceMonitoring.tsx',
      lineCount: 721,
      complexity: 8.8,
      dependencies: ['react', 'monitoring-api', 'charts'],
      hooks: ['useState', 'useMemo', 'useEffect'],
      lastModified: '2025-09-03T15:15:00Z',
      author: 'Phase 3 Enhancement',
      status: 'development',
      testCoverage: 45,
      documentation: 'partial'
    }
  ], []);

  const devTools: DevTool[] = useMemo(() => [
    {
      id: 'component-tree',
      name: 'Component Tree Inspector',
      description: 'Inspect React component hierarchy and props',
      category: 'debugging',
      icon: '🌳',
      action: 'INSPECT_COMPONENTS',
      enabled: true
    },
    {
      id: 'state-debugger',
      name: 'State Debugger',
      description: 'Monitor and debug application state changes',
      category: 'debugging',
      icon: '🐛',
      action: 'DEBUG_STATE',
      enabled: true
    },
    {
      id: 'performance-profiler',
      name: 'Performance Profiler',
      description: 'Profile component render times and performance',
      category: 'performance',
      icon: '⚡',
      action: 'PROFILE_PERFORMANCE',
      enabled: true
    },
    {
      id: 'code-analyzer',
      name: 'Code Complexity Analyzer',
      description: 'Analyze code complexity and suggest improvements',
      category: 'analysis',
      icon: '📊',
      action: 'ANALYZE_CODE',
      enabled: true
    },
    {
      id: 'dependency-tracker',
      name: 'Dependency Tracker',
      description: 'Track and visualize component dependencies',
      category: 'analysis',
      icon: '🕸️',
      action: 'TRACK_DEPENDENCIES',
      enabled: true
    },
    {
      id: 'test-runner',
      name: 'Automated Test Runner',
      description: 'Run automated tests and view coverage reports',
      category: 'testing',
      icon: '🧪',
      action: 'RUN_TESTS',
      enabled: false
    },
    {
      id: 'bundle-analyzer',
      name: 'Bundle Size Analyzer',
      description: 'Analyze bundle size and optimize imports',
      category: 'performance',
      icon: '📦',
      action: 'ANALYZE_BUNDLE',
      enabled: true
    },
    {
      id: 'accessibility-checker',
      name: 'Accessibility Checker',
      description: 'Check components for accessibility compliance',
      category: 'utilities',
      icon: '♿',
      action: 'CHECK_ACCESSIBILITY',
      enabled: true
    }
  ], []);

  const consoleMessages: ConsoleMessage[] = useMemo(() => [
    {
      id: 'msg1',
      type: 'info',
      timestamp: '2025-09-03T15:20:00Z',
      message: 'Advanced Dashboard View initialized successfully',
      component: 'AdvancedDashboardView'
    },
    {
      id: 'msg2',
      type: 'warn',
      timestamp: '2025-09-03T15:19:45Z',
      message: 'Performance monitoring detected slow render in Trade Analysis',
      component: 'EnhancedTradeAnalysisView'
    },
    {
      id: 'msg3',
      type: 'error',
      timestamp: '2025-09-03T15:19:30Z',
      message: 'Failed to load player image: network timeout',
      component: 'PlayerAnalysisHub',
      stackTrace: [
        'at loadPlayerImage (PlayerAnalysisHub.tsx:234)',
        'at PlayerCard (PlayerCard.tsx:89)',
        'at PlayerAnalysisHub (PlayerAnalysisHub.tsx:156)'
      ]
    },
    {
      id: 'msg4',
      type: 'debug',
      timestamp: '2025-09-03T15:19:15Z',
      message: 'State update: dashboard filter changed to "trade-analysis"',
      component: 'EnhancedIntegrationHub'
    },
    {
      id: 'msg5',
      type: 'log',
      timestamp: '2025-09-03T15:19:00Z',
      message: 'Component mounted: EnhancedPerformanceMonitoring',
      component: 'AdvancedPerformanceMonitoring'
    }
  ], []);

  const debugSessions: DebugSession[] = useMemo(() => [
    {
      id: 'session1',
      name: 'Dashboard Performance Debug',
      component: 'AdvancedDashboardView',
      startTime: '2025-09-03T15:15:00Z',
      duration: 5.2,
      status: 'active',
      breakpoints: 3,
      watchVariables: ['dashboardState', 'widgetData', 'renderTime']
    },
    {
      id: 'session2',
      name: 'Trade Analysis State Debug',
      component: 'EnhancedTradeAnalysisView',
      startTime: '2025-09-03T14:45:00Z',
      duration: 12.8,
      status: 'completed',
      breakpoints: 5,
      watchVariables: ['tradeData', 'analysisResults', 'userPreferences']
    }
  ], []);

  const getStatusColor = (status: ComponentInfo['status']) => {
    switch (status) {
      case 'stable': return 'text-green-400 bg-green-500/20';
      case 'development': return 'text-blue-400 bg-blue-500/20';
      case 'needs-review': return 'text-yellow-400 bg-yellow-500/20';
      case 'deprecated': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getComplexityColor = (complexity: number) => {
    if (complexity < 5) return 'text-green-400';
    if (complexity < 8) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return 'text-green-400';
    if (coverage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getMessageTypeColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error': return 'text-red-400 bg-red-500/20';
      case 'warn': return 'text-yellow-400 bg-yellow-500/20';
      case 'info': return 'text-blue-400 bg-blue-500/20';
      case 'debug': return 'text-purple-400 bg-purple-500/20';
      case 'log': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredMessages = consoleMessages.filter(msg => 
    consoleFilter === 'all' || msg.type === consoleFilter
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            Developer Tools
          </h1>
          <p className="text-gray-400 mt-2">
            Advanced debugging and development tools for Phase 3 enhancements
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              showAdvanced 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                : 'bg-gray-600/50 text-gray-400 border border-gray-600/30'
            }`}
          >
            <span>⚙️</span>
            {showAdvanced ? 'Advanced Mode' : 'Basic Mode'}
          </button>
          
          <button 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
            className="bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 hover:bg-gray-600/50 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview', icon: '📋' },
          { key: 'console', label: 'Console', icon: '💻', count: filteredMessages.filter(m => m.type === 'error').length },
          { key: 'debugger', label: 'Debugger', icon: '🐛', count: debugSessions.filter(s => s.status === 'active').length },
          { key: 'analyzer', label: 'Code Analyzer', icon: '🔍' },
          { key: 'tools', label: 'Dev Tools', icon: '🛠️' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'overview' | 'console' | 'debugger' | 'analyzer' | 'tools')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {tab.count && tab.count > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab 
          componentInfo={componentInfo}
          devTools={devTools}
          getStatusColor={getStatusColor}
          getComplexityColor={getComplexityColor}
          getCoverageColor={getCoverageColor}
        />
      )}

      {activeTab === 'console' && (
        <ConsoleTab
          messages={filteredMessages}
          consoleFilter={consoleFilter}
          setConsoleFilter={setConsoleFilter}
          getMessageTypeColor={getMessageTypeColor}
        />
      )}

      {activeTab === 'debugger' && (
        <DebuggerTab
          debugSessions={debugSessions}
          componentInfo={componentInfo}
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
        />
      )}

      {activeTab === 'analyzer' && (
        <AnalyzerTab
          componentInfo={componentInfo}
          showAdvanced={showAdvanced}
          getComplexityColor={getComplexityColor}
          getCoverageColor={getCoverageColor}
        />
      )}

      {activeTab === 'tools' && (
        <ToolsTab
          devTools={devTools}
          dispatch={dispatch}
        />
      )}
    </div>
  );
};

// Tab Components
interface OverviewTabProps {
  componentInfo: ComponentInfo[];
  devTools: DevTool[];
  getStatusColor: (status: ComponentInfo['status']) => string;
  getComplexityColor: (complexity: number) => string;
  getCoverageColor: (coverage: number) => string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  componentInfo, 
  devTools, 
  getStatusColor, 
  getComplexityColor, 
  getCoverageColor 
}) => (
  <div className="space-y-6">
    {/* Quick Stats */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
        <div className="text-2xl font-bold text-purple-400">{componentInfo.length}</div>
        <div className="text-sm text-gray-400">Components</div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
        <div className="text-2xl font-bold text-blue-400">
          {Math.round(componentInfo.reduce((sum, c) => sum + c.testCoverage, 0) / componentInfo.length)}%
        </div>
        <div className="text-sm text-gray-400">Avg Coverage</div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
        <div className="text-2xl font-bold text-green-400">
          {componentInfo.filter(c => c.status === 'stable').length}
        </div>
        <div className="text-sm text-gray-400">Stable Components</div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
        <div className="text-2xl font-bold text-yellow-400">
          {devTools.filter(t => t.enabled).length}
        </div>
        <div className="text-sm text-gray-400">Active Tools</div>
      </div>
    </div>

    {/* Component Summary */}
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Component Health Overview</h3>
      <div className="space-y-3">
        {componentInfo.map(component => (
          <div key={component.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="font-medium">{component.name}</span>
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(component.status)}`}>
                {component.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className={`${getComplexityColor(component.complexity)}`}>
                Complexity: {component.complexity}
              </span>
              <span className={`${getCoverageColor(component.testCoverage)}`}>
                Coverage: {component.testCoverage}%
              </span>
              <span className="text-gray-400">{component.lineCount} lines</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface ConsoleTabProps {
  messages: ConsoleMessage[];
  consoleFilter: 'all' | 'error' | 'warn' | 'info';
  setConsoleFilter: (filter: 'all' | 'error' | 'warn' | 'info') => void;
  getMessageTypeColor: (type: ConsoleMessage['type']) => string;
}

const ConsoleTab: React.FC<ConsoleTabProps> = ({ 
  messages, 
  consoleFilter, 
  setConsoleFilter, 
  getMessageTypeColor 
}) => (
  <div className="space-y-4">
    {/* Console Controls */}
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {(['all', 'error', 'warn', 'info'] as const).map(filter => (
          <button
            key={filter}
            onClick={() => setConsoleFilter(filter)}
            className={`px-3 py-1 rounded text-sm transition-colors ${
              consoleFilter === filter
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-gray-700/50 text-gray-400 hover:text-gray-300'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
      <button className="bg-gray-700/50 text-gray-400 hover:text-gray-300 px-3 py-1 rounded text-sm">
        Clear Console
      </button>
    </div>

    {/* Console Messages */}
    <div className="bg-gray-900/50 border border-white/10 rounded-lg p-4 max-h-96 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No console messages found for the selected filter
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map(message => (
            <div key={message.id} className="border-b border-gray-700/50 pb-2 last:border-b-0">
              <div className="flex items-start gap-3">
                <span className={`text-xs px-2 py-1 rounded ${getMessageTypeColor(message.type)}`}>
                  {message.type.toUpperCase()}
                </span>
                <div className="flex-1">
                  <div className="text-gray-300">{message.message}</div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                    {message.component && (
                      <>
                        <span>•</span>
                        <span>{message.component}</span>
                      </>
                    )}
                  </div>
                  {message.stackTrace && (
                    <div className="mt-2 bg-gray-800/50 p-2 rounded text-xs text-red-300">
                      {message.stackTrace.map((line, index) => (
                        <div key={index}>{line}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

interface DebuggerTabProps {
  debugSessions: DebugSession[];
  componentInfo: ComponentInfo[];
  selectedComponent: string | null;
  setSelectedComponent: (id: string | null) => void;
}

const DebuggerTab: React.FC<DebuggerTabProps> = ({ 
  debugSessions, 
  componentInfo, 
  selectedComponent, 
  setSelectedComponent 
}) => (
  <div className="space-y-6">
    {/* Active Debug Sessions */}
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Active Debug Sessions</h3>
      {debugSessions.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          No active debug sessions
        </div>
      ) : (
        <div className="space-y-3">
          {debugSessions.map(session => (
            <div key={session.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
              <div>
                <h4 className="font-medium">{session.name}</h4>
                <div className="text-sm text-gray-400">
                  {session.component} • {session.duration}min • {session.breakpoints} breakpoints
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  session.status === 'active' ? 'bg-green-500/20 text-green-300' :
                  session.status === 'paused' ? 'bg-yellow-500/20 text-yellow-300' :
                  session.status === 'error' ? 'bg-red-500/20 text-red-300' :
                  'bg-gray-500/20 text-gray-300'
                }`}>
                  {session.status}
                </span>
                <button className="text-blue-400 hover:text-blue-300 text-sm">
                  {session.status === 'active' ? 'Pause' : 'Resume'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Component Debugger */}
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Component Debugger</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3">Select Component</h4>
          <div className="space-y-2">
            {componentInfo.map(component => (
              <button
                key={component.id}
                onClick={() => setSelectedComponent(
                  selectedComponent === component.id ? null : component.id
                )}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedComponent === component.id
                    ? 'bg-purple-500/20 border border-purple-500/30'
                    : 'bg-gray-700/30 hover:bg-gray-700/50'
                }`}
              >
                {component.name}
              </button>
            ))}
          </div>
        </div>
        
        {selectedComponent && (
          <div>
            <h4 className="font-medium mb-3">Debug Actions</h4>
            <div className="space-y-2">
              <button className="w-full bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg p-3 hover:bg-blue-500/30 transition-colors">
                🐛 Start Debug Session
              </button>
              <button className="w-full bg-green-500/20 text-green-300 border border-green-500/30 rounded-lg p-3 hover:bg-green-500/30 transition-colors">
                📊 Profile Performance
              </button>
              <button className="w-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 rounded-lg p-3 hover:bg-yellow-500/30 transition-colors">
                🔍 Inspect Props
              </button>
              <button className="w-full bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg p-3 hover:bg-purple-500/30 transition-colors">
                ⚡ Monitor State
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

interface AnalyzerTabProps {
  componentInfo: ComponentInfo[];
  showAdvanced: boolean;
  getComplexityColor: (complexity: number) => string;
  getCoverageColor: (coverage: number) => string;
}

const AnalyzerTab: React.FC<AnalyzerTabProps> = ({ 
  componentInfo, 
  showAdvanced, 
  getComplexityColor, 
  getCoverageColor 
}) => (
  <div className="space-y-6">
    {/* Code Analysis Summary */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
        <div className="text-2xl font-bold text-blue-400">
          {componentInfo.reduce((sum, c) => sum + c.lineCount, 0).toLocaleString()}
        </div>
        <div className="text-sm text-gray-400">Total Lines of Code</div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
        <div className={`text-2xl font-bold ${getComplexityColor(
          componentInfo.reduce((sum, c) => sum + c.complexity, 0) / componentInfo.length
        )}`}>
          {(componentInfo.reduce((sum, c) => sum + c.complexity, 0) / componentInfo.length).toFixed(1)}
        </div>
        <div className="text-sm text-gray-400">Avg Complexity</div>
      </div>
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 text-center">
        <div className="text-2xl font-bold text-green-400">
          {new Set(componentInfo.flatMap(c => c.dependencies)).size}
        </div>
        <div className="text-sm text-gray-400">Unique Dependencies</div>
      </div>
    </div>

    {/* Detailed Analysis */}
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Component Analysis</h3>
      <div className="space-y-4">
        {componentInfo.map(component => (
          <div key={component.id} className="p-4 bg-gray-700/30 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">{component.name}</h4>
              <div className="flex items-center gap-3 text-sm">
                <span className={`${getComplexityColor(component.complexity)}`}>
                  Complexity: {component.complexity}
                </span>
                <span className={`${getCoverageColor(component.testCoverage)}`}>
                  Coverage: {component.testCoverage}%
                </span>
              </div>
            </div>
            
            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-400 mb-2">Dependencies:</div>
                  <div className="flex flex-wrap gap-1">
                    {component.dependencies.map(dep => (
                      <span key={dep} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 mb-2">Hooks Used:</div>
                  <div className="flex flex-wrap gap-1">
                    {component.hooks.map(hook => (
                      <span key={hook} className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                        {hook}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface ToolsTabProps {
  devTools: DevTool[];
  dispatch: (action: { type: string; payload?: string }) => void;
}

const ToolsTab: React.FC<ToolsTabProps> = ({ devTools, dispatch }) => (
  <div className="space-y-6">
    {/* Tool Categories */}
    {(['debugging', 'analysis', 'testing', 'performance', 'utilities'] as const).map(category => {
      const categoryTools = devTools.filter(tool => tool.category === category);
      if (categoryTools.length === 0) return null;
      
      return (
        <div key={category} className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 capitalize">{category} Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryTools.map(tool => (
              <div key={tool.id} className={`p-4 rounded-lg border ${
                tool.enabled 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-gray-700/30 border-gray-600/30'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{tool.icon}</span>
                    <h4 className="font-medium">{tool.name}</h4>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    tool.enabled 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {tool.enabled ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-3">{tool.description}</p>
                <button
                  onClick={() => dispatch({ type: tool.action })}
                  disabled={!tool.enabled}
                  className={`w-full py-2 px-4 rounded transition-colors ${
                    tool.enabled
                      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30'
                      : 'bg-gray-600/20 text-gray-500 border border-gray-600/30 cursor-not-allowed'
                  }`}
                >
                  {tool.enabled ? 'Run Tool' : 'Tool Disabled'}
                </button>
              </div>
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

export default DeveloperToolsDashboard;
