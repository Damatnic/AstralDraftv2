/**
 * Phase 3 Feature Documentation - Comprehensive Help & Onboarding
 * Interactive documentation and tutorials for all Phase 3 enhanced features
 */

import React, { useState, useMemo } from 'react';

// Mock context for documentation
const useAppState = () => ({
  dispatch: (_action: { type: string; payload?: string }) => {
    // Mock dispatch function
  }
});

// Documentation interfaces
interface FeatureDocumentationProps {
  className?: string;
}

interface Feature {
  id: string;
  name: string;
  category: 'dashboard' | 'analytics' | 'tools' | 'admin' | 'core';
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  prerequisites: string[];
  keyFeatures: string[];
  useCases: string[];
  tutorials: Tutorial[];
  lastUpdated: string;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  action?: string;
  screenshot?: string;
  code?: string;
  tips: string[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
}

/**
 * Phase 3 Feature Documentation Component
 */
const Phase3FeatureDocumentation: React.FC<FeatureDocumentationProps> = ({ className = '' }) => {
  const { dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'tutorials' | 'faq' | 'changelog'>('overview');
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedTutorial, setSelectedTutorial] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'dashboard' | 'analytics' | 'tools' | 'admin' | 'core'>('all');

  // Mock feature data
  const features: Feature[] = useMemo(() => [
    {
      id: 'advanced-dashboard',
      name: 'Advanced Dashboard',
      category: 'dashboard',
      description: 'Comprehensive command center with AI-powered insights, real-time analytics, and customizable widgets for fantasy football management.',
      icon: '🚀',
      difficulty: 'intermediate',
      estimatedTime: '15-20 minutes',
      prerequisites: ['Basic navigation', 'League setup'],
      keyFeatures: [
        'AI-powered player recommendations',
        'Real-time injury tracking',
        'Custom widget arrangement',
        'Performance analytics',
        'Trade opportunity alerts'
      ],
      useCases: [
        'Daily league management',
        'Pre-game preparation',
        'Trade analysis',
        'Performance tracking'
      ],
      tutorials: [
        {
          id: 'dashboard-setup',
          title: 'Setting Up Your Advanced Dashboard',
          description: 'Learn how to configure and customize your dashboard for optimal fantasy football management.',
          duration: '10 minutes',
          difficulty: 'beginner',
          steps: [
            {
              id: 'step1',
              title: 'Access the Dashboard',
              description: 'Navigate to the Advanced Dashboard from the main menu.',
              action: 'Click on "Advanced Dashboard" in the navigation',
              tips: ['Use keyboard shortcut Ctrl+D for quick access']
            },
            {
              id: 'step2',
              title: 'Customize Widget Layout',
              description: 'Drag and drop widgets to arrange your preferred layout.',
              action: 'Click and hold on any widget header to drag',
              tips: ['Start with essential widgets like player stats and injury reports']
            }
          ]
        }
      ],
      lastUpdated: '2025-09-03T15:00:00Z'
    },
    {
      id: 'player-analytics',
      name: 'Enhanced Player Analytics',
      category: 'analytics',
      description: 'Deep-dive analytics platform with ML-powered projections, trend analysis, and comprehensive player insights.',
      icon: '📊',
      difficulty: 'advanced',
      estimatedTime: '25-30 minutes',
      prerequisites: ['Advanced Dashboard', 'Data interpretation skills'],
      keyFeatures: [
        'ML-powered projections',
        'Advanced statistical analysis',
        'Trend identification',
        'Comparative analytics',
        'Performance predictions'
      ],
      useCases: [
        'Draft preparation',
        'Waiver wire analysis',
        'Trade evaluation',
        'Season-long planning'
      ],
      tutorials: [
        {
          id: 'analytics-basics',
          title: 'Player Analytics Fundamentals',
          description: 'Master the core concepts of advanced player analytics.',
          duration: '15 minutes',
          difficulty: 'intermediate',
          steps: [
            {
              id: 'analytics-step1',
              title: 'Understanding ML Projections',
              description: 'Learn how to interpret machine learning powered player projections.',
              tips: ['Focus on confidence intervals, not just point estimates']
            }
          ]
        }
      ],
      lastUpdated: '2025-09-03T14:45:00Z'
    },
    {
      id: 'trade-analysis',
      name: 'Trade Analysis Center',
      category: 'analytics',
      description: 'Sophisticated trade evaluation system with fairness analysis, impact assessment, and negotiation tools.',
      icon: '🔄',
      difficulty: 'intermediate',
      estimatedTime: '20-25 minutes',
      prerequisites: ['Player Analytics', 'League settings'],
      keyFeatures: [
        'Trade fairness evaluation',
        'Impact analysis',
        'Multi-scenario modeling',
        'Negotiation assistant',
        'Historical trade data'
      ],
      useCases: [
        'Trade proposal evaluation',
        'Negotiation strategy',
        'League balance assessment',
        'Historical analysis'
      ],
      tutorials: [
        {
          id: 'trade-evaluation',
          title: 'Evaluating Trade Proposals',
          description: 'Learn to analyze trade proposals for fairness and impact.',
          duration: '12 minutes',
          difficulty: 'intermediate',
          steps: [
            {
              id: 'trade-step1',
              title: 'Input Trade Details',
              description: 'Enter the players and picks involved in the proposed trade.',
              tips: ['Include all aspects: players, picks, and conditions']
            }
          ]
        }
      ],
      lastUpdated: '2025-09-03T14:30:00Z'
    },
    {
      id: 'integration-hub',
      name: 'Enhanced Integration Hub',
      category: 'core',
      description: 'Central command center providing unified access to all Phase 3 features with advanced navigation and search.',
      icon: '🌐',
      difficulty: 'beginner',
      estimatedTime: '10-15 minutes',
      prerequisites: ['Basic app familiarity'],
      keyFeatures: [
        'Unified feature access',
        'Quick action shortcuts',
        'Advanced search',
        'Feature discovery',
        'Personalized recommendations'
      ],
      useCases: [
        'Feature discovery',
        'Quick navigation',
        'Workflow optimization',
        'New user onboarding'
      ],
      tutorials: [
        {
          id: 'hub-navigation',
          title: 'Mastering the Integration Hub',
          description: 'Efficiently navigate and utilize the central command center.',
          duration: '8 minutes',
          difficulty: 'beginner',
          steps: [
            {
              id: 'hub-step1',
              title: 'Explore the Feature Catalog',
              description: 'Browse available features organized by category.',
              tips: ['Use filters to find specific types of features quickly']
            }
          ]
        }
      ],
      lastUpdated: '2025-09-03T15:00:00Z'
    },
    {
      id: 'performance-monitoring',
      name: 'Performance Monitoring',
      category: 'tools',
      description: 'Real-time monitoring dashboard for system performance, component health, and user analytics.',
      icon: '📈',
      difficulty: 'advanced',
      estimatedTime: '30-35 minutes',
      prerequisites: ['System administration', 'Performance concepts'],
      keyFeatures: [
        'Real-time metrics',
        'Component health tracking',
        'Performance alerts',
        'User analytics',
        'System optimization'
      ],
      useCases: [
        'System monitoring',
        'Performance optimization',
        'Issue diagnosis',
        'Capacity planning'
      ],
      tutorials: [
        {
          id: 'monitoring-setup',
          title: 'Setting Up Performance Monitoring',
          description: 'Configure monitoring for optimal system visibility.',
          duration: '20 minutes',
          difficulty: 'advanced',
          steps: [
            {
              id: 'monitor-step1',
              title: 'Configure Metrics Collection',
              description: 'Set up data collection for comprehensive monitoring.',
              tips: ['Start with essential metrics before adding custom ones']
            }
          ]
        }
      ],
      lastUpdated: '2025-09-03T15:15:00Z'
    },
    {
      id: 'developer-tools',
      name: 'Developer Tools Dashboard',
      category: 'tools',
      description: 'Advanced debugging and development tools for code analysis, performance profiling, and system diagnostics.',
      icon: '🛠️',
      difficulty: 'advanced',
      estimatedTime: '40-45 minutes',
      prerequisites: ['Development experience', 'Debugging concepts'],
      keyFeatures: [
        'Code analysis',
        'Performance profiling',
        'Debug sessions',
        'Component inspector',
        'Automated testing'
      ],
      useCases: [
        'Bug investigation',
        'Performance optimization',
        'Code quality analysis',
        'Development workflow'
      ],
      tutorials: [
        {
          id: 'dev-tools-intro',
          title: 'Introduction to Developer Tools',
          description: 'Get started with the comprehensive development toolkit.',
          duration: '25 minutes',
          difficulty: 'advanced',
          steps: [
            {
              id: 'dev-step1',
              title: 'Component Analysis',
              description: 'Learn to analyze component performance and health.',
              tips: ['Focus on render times and memory usage patterns']
            }
          ]
        }
      ],
      lastUpdated: '2025-09-03T15:20:00Z'
    },
    {
      id: 'system-admin',
      name: 'System Administration',
      category: 'admin',
      description: 'Comprehensive administrative panel for user management, system configuration, and security oversight.',
      icon: '🔐',
      difficulty: 'advanced',
      estimatedTime: '35-40 minutes',
      prerequisites: ['Admin privileges', 'System administration knowledge'],
      keyFeatures: [
        'User management',
        'System configuration',
        'Audit logging',
        'Backup management',
        'Security controls'
      ],
      useCases: [
        'User administration',
        'System configuration',
        'Security management',
        'Compliance monitoring'
      ],
      tutorials: [
        {
          id: 'admin-basics',
          title: 'System Administration Basics',
          description: 'Essential administrative tasks and best practices.',
          duration: '30 minutes',
          difficulty: 'advanced',
          steps: [
            {
              id: 'admin-step1',
              title: 'User Management',
              description: 'Learn to effectively manage user accounts and permissions.',
              tips: ['Follow principle of least privilege for security']
            }
          ]
        }
      ],
      lastUpdated: '2025-09-03T15:25:00Z'
    }
  ], []);

  const faqs: FAQ[] = useMemo(() => [
    {
      id: 'faq1',
      question: 'What are the system requirements for Phase 3 features?',
      answer: 'Phase 3 features require a modern web browser with JavaScript enabled. Recommended: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. For optimal performance, we recommend 8GB RAM and a stable internet connection.',
      category: 'technical',
      tags: ['requirements', 'browser', 'performance'],
      helpful: 45
    },
    {
      id: 'faq2',
      question: 'How do I access the Advanced Dashboard?',
      answer: 'The Advanced Dashboard can be accessed from the main navigation menu or through the Integration Hub. Look for the rocket icon (🚀) or use the keyboard shortcut Ctrl+D for quick access.',
      category: 'navigation',
      tags: ['dashboard', 'access', 'shortcuts'],
      helpful: 38
    },
    {
      id: 'faq3',
      question: 'What makes the ML projections different from standard projections?',
      answer: 'Our ML projections use advanced machine learning algorithms that analyze historical performance, current trends, matchup data, weather conditions, and dozens of other factors to provide more accurate predictions with confidence intervals.',
      category: 'analytics',
      tags: ['ml', 'projections', 'accuracy'],
      helpful: 52
    },
    {
      id: 'faq4',
      question: 'Can I customize the widgets in the Advanced Dashboard?',
      answer: 'Yes! All widgets are fully customizable. You can drag and drop to rearrange, resize widgets, hide/show specific widgets, and configure their settings to match your preferences and workflow.',
      category: 'customization',
      tags: ['widgets', 'customization', 'layout'],
      helpful: 41
    },
    {
      id: 'faq5',
      question: 'How accurate are the trade fairness evaluations?',
      answer: 'Trade fairness evaluations use sophisticated algorithms considering player values, positional scarcity, team needs, and league context. While highly accurate, they should be used as guidance alongside your own analysis.',
      category: 'trades',
      tags: ['trade-analysis', 'fairness', 'accuracy'],
      helpful: 33
    }
  ], []);

  const getDifficultyColor = (difficulty: Feature['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-500/20';
      case 'advanced': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getCategoryColor = (category: Feature['category']) => {
    switch (category) {
      case 'dashboard': return 'text-blue-400 bg-blue-500/20';
      case 'analytics': return 'text-purple-400 bg-purple-500/20';
      case 'tools': return 'text-green-400 bg-green-500/20';
      case 'admin': return 'text-red-400 bg-red-500/20';
      case 'core': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || feature.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Phase 3 Documentation
          </h1>
          <p className="text-gray-400 mt-2">
            Comprehensive guides and tutorials for all advanced features
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800/50 border border-gray-600/50 rounded-lg px-4 py-2 pr-10 text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
          </div>
          
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
          { key: 'overview', label: 'Overview', icon: '📖' },
          { key: 'features', label: 'Features', icon: '🚀', count: filteredFeatures.length },
          { key: 'tutorials', label: 'Tutorials', icon: '🎓' },
          { key: 'faq', label: 'FAQ', icon: '❓', count: filteredFAQs.length },
          { key: 'changelog', label: 'Changelog', icon: '📝' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'overview' | 'features' | 'tutorials' | 'faq' | 'changelog')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            {tab.count && (
              <span className="bg-blue-500/30 text-blue-200 text-xs rounded-full px-2 py-0.5">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab features={features} />
      )}

      {activeTab === 'features' && (
        <FeaturesTab
          features={filteredFeatures}
          selectedFeature={selectedFeature}
          setSelectedFeature={setSelectedFeature}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          getDifficultyColor={getDifficultyColor}
          getCategoryColor={getCategoryColor}
          dispatch={dispatch}
        />
      )}

      {activeTab === 'tutorials' && (
        <TutorialsTab
          features={features}
          selectedTutorial={selectedTutorial}
          setSelectedTutorial={setSelectedTutorial}
          getDifficultyColor={getDifficultyColor}
        />
      )}

      {activeTab === 'faq' && (
        <FAQTab
          faqs={filteredFAQs}
        />
      )}

      {activeTab === 'changelog' && (
        <ChangelogTab />
      )}
    </div>
  );
};

// Tab Components
interface OverviewTabProps {
  features: Feature[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ features }) => (
  <div className="space-y-6">
    {/* Welcome Section */}
    <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome to Phase 3 Features</h2>
      <p className="text-gray-300 mb-4">
        Phase 3 introduces advanced capabilities that transform your fantasy football experience with 
        AI-powered insights, sophisticated analytics, and professional-grade tools.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">{features.length}</div>
          <div className="text-sm text-gray-400">Advanced Features</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400">
            {features.reduce((sum, f) => sum + f.tutorials.length, 0)}
          </div>
          <div className="text-sm text-gray-400">Interactive Tutorials</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-pink-400">100+</div>
          <div className="text-sm text-gray-400">New Capabilities</div>
        </div>
      </div>
    </div>

    {/* Getting Started Guide */}
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">🚀 Getting Started</h3>
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">1</div>
          <div>
            <h4 className="font-medium">Explore the Integration Hub</h4>
            <p className="text-sm text-gray-400">Start with the Integration Hub to discover all available features and get personalized recommendations.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">2</div>
          <div>
            <h4 className="font-medium">Set Up Your Advanced Dashboard</h4>
            <p className="text-sm text-gray-400">Customize your dashboard with AI-powered widgets for daily fantasy football management.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">3</div>
          <div>
            <h4 className="font-medium">Dive into Analytics</h4>
            <p className="text-sm text-gray-400">Use Enhanced Player Analytics for deep insights and ML-powered projections.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 font-bold">4</div>
          <div>
            <h4 className="font-medium">Master Trade Analysis</h4>
            <p className="text-sm text-gray-400">Leverage the Trade Analysis Center for sophisticated trade evaluation and negotiation.</p>
          </div>
        </div>
      </div>
    </div>

    {/* Feature Categories */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        { category: 'dashboard', icon: '🚀', title: 'Dashboard Features', description: 'AI-powered command centers' },
        { category: 'analytics', icon: '📊', title: 'Advanced Analytics', description: 'ML-driven insights and projections' },
        { category: 'tools', icon: '🛠️', title: 'Professional Tools', description: 'Development and monitoring utilities' },
        { category: 'admin', icon: '🔐', title: 'Administration', description: 'System management and security' },
        { category: 'core', icon: '🌐', title: 'Core Features', description: 'Essential navigation and integration' }
      ].map(cat => {
        const categoryFeatures = features.filter(f => f.category === cat.category);
        return (
          <div key={cat.category} className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <h4 className="font-medium">{cat.title}</h4>
                <p className="text-sm text-gray-400">{cat.description}</p>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {categoryFeatures.length} feature{categoryFeatures.length !== 1 ? 's' : ''} available
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

interface FeaturesTabProps {
  features: Feature[];
  selectedFeature: string | null;
  setSelectedFeature: (id: string | null) => void;
  filterCategory: 'all' | 'dashboard' | 'analytics' | 'tools' | 'admin' | 'core';
  setFilterCategory: (category: 'all' | 'dashboard' | 'analytics' | 'tools' | 'admin' | 'core') => void;
  getDifficultyColor: (difficulty: Feature['difficulty']) => string;
  getCategoryColor: (category: Feature['category']) => string;
  dispatch: (action: { type: string; payload?: string }) => void;
}

const FeaturesTab: React.FC<FeaturesTabProps> = ({ 
  features, 
  selectedFeature, 
  setSelectedFeature, 
  filterCategory, 
  setFilterCategory, 
  getDifficultyColor, 
  getCategoryColor, 
  dispatch 
}) => (
  <div className="space-y-6">
    {/* Feature Filters */}
    <div className="flex flex-wrap gap-2">
      {(['all', 'dashboard', 'analytics', 'tools', 'admin', 'core'] as const).map(category => (
        <button
          key={category}
          onClick={() => setFilterCategory(category)}
          className={`px-3 py-1 rounded text-sm transition-colors capitalize ${
            filterCategory === category
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              : 'bg-gray-700/50 text-gray-400 hover:text-gray-300'
          }`}
        >
          {category}
        </button>
      ))}
    </div>

    {/* Feature Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features.map(feature => (
        <div key={feature.id} className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <h3 className="text-lg font-semibold">{feature.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(feature.category)}`}>
                    {feature.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(feature.difficulty)}`}>
                    {feature.difficulty}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 mb-4">{feature.description}</p>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Key Features:</h4>
              <div className="flex flex-wrap gap-1">
                {feature.keyFeatures.slice(0, 3).map(keyFeature => (
                  <span key={keyFeature} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                    {keyFeature}
                  </span>
                ))}
                {feature.keyFeatures.length > 3 && (
                  <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs">
                    +{feature.keyFeatures.length - 3} more
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
              <div className="text-sm text-gray-400">
                ⏱️ {feature.estimatedTime}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedFeature(selectedFeature === feature.id ? null : feature.id)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  {selectedFeature === feature.id ? 'Hide Details' : 'Learn More'}
                </button>
                <button
                  onClick={() => dispatch({ type: 'LAUNCH_FEATURE', payload: feature.id })}
                  className="bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded px-3 py-1 hover:bg-blue-500/30 transition-colors text-sm"
                >
                  Launch
                </button>
              </div>
            </div>
          </div>
          
          {selectedFeature === feature.id && (
            <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Prerequisites:</h4>
                <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                  {feature.prerequisites.map(prereq => (
                    <li key={prereq}>{prereq}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Common Use Cases:</h4>
                <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                  {feature.useCases.map(useCase => (
                    <li key={useCase}>{useCase}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Available Tutorials:</h4>
                <div className="space-y-2">
                  {feature.tutorials.map(tutorial => (
                    <div key={tutorial.id} className="bg-gray-700/30 rounded p-3">
                      <div className="font-medium">{tutorial.title}</div>
                      <div className="text-sm text-gray-400">{tutorial.description}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">⏱️ {tutorial.duration}</span>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">
                          Start Tutorial
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

interface TutorialsTabProps {
  features: Feature[];
  selectedTutorial: string | null;
  setSelectedTutorial: (id: string | null) => void;
  getDifficultyColor: (difficulty: Feature['difficulty']) => string;
}

const TutorialsTab: React.FC<TutorialsTabProps> = ({ 
  features, 
  selectedTutorial, 
  setSelectedTutorial, 
  getDifficultyColor 
}) => {
  const allTutorials = features.flatMap(feature => 
    feature.tutorials.map(tutorial => ({ ...tutorial, featureName: feature.name, featureIcon: feature.icon }))
  );

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">📚 Interactive Tutorials</h3>
        <p className="text-gray-400">
          Step-by-step guides to master Phase 3 features. Each tutorial includes interactive elements and practical examples.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allTutorials.map(tutorial => (
          <div key={tutorial.id} className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <div className="flex items-start gap-3 mb-4">
              <span className="text-2xl">{tutorial.featureIcon}</span>
              <div className="flex-1">
                <h4 className="font-semibold">{tutorial.title}</h4>
                <div className="text-sm text-gray-400">{tutorial.featureName}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(tutorial.difficulty)}`}>
                    {tutorial.difficulty}
                  </span>
                  <span className="text-xs text-gray-400">⏱️ {tutorial.duration}</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4">{tutorial.description}</p>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {tutorial.steps.length} step{tutorial.steps.length !== 1 ? 's' : ''}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedTutorial(selectedTutorial === tutorial.id ? null : tutorial.id)}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  {selectedTutorial === tutorial.id ? 'Hide Steps' : 'View Steps'}
                </button>
                <button className="bg-green-500/20 text-green-300 border border-green-500/30 rounded px-3 py-1 hover:bg-green-500/30 transition-colors text-sm">
                  Start Tutorial
                </button>
              </div>
            </div>
            
            {selectedTutorial === tutorial.id && (
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <h5 className="font-medium mb-3">Tutorial Steps:</h5>
                <div className="space-y-3">
                  {tutorial.steps.map((step, index) => (
                    <div key={step.id} className="flex gap-3">
                      <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h6 className="font-medium">{step.title}</h6>
                        <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                        {step.action && (
                          <div className="text-xs bg-gray-700/50 rounded p-2 mt-2">
                            <strong>Action:</strong> {step.action}
                          </div>
                        )}
                        {step.tips.length > 0 && (
                          <div className="mt-2">
                            <div className="text-xs text-yellow-400 font-medium">💡 Tips:</div>
                            <ul className="text-xs text-gray-400 list-disc list-inside ml-2">
                              {step.tips.map((tip, tipIndex) => (
                                <li key={tipIndex}>{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface FAQTabProps {
  faqs: FAQ[];
}

const FAQTab: React.FC<FAQTabProps> = ({ faqs }) => (
  <div className="space-y-6">
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">❓ Frequently Asked Questions</h3>
      <p className="text-gray-400">
        Find answers to common questions about Phase 3 features and functionality.
      </p>
    </div>

    <div className="space-y-4">
      {faqs.map(faq => (
        <div key={faq.id} className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <div className="flex items-start justify-between mb-3">
            <h4 className="font-semibold text-lg pr-4">{faq.question}</h4>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>👍 {faq.helpful}</span>
            </div>
          </div>
          
          <p className="text-gray-300 mb-4">{faq.answer}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1">
              {faq.tags.map(tag => (
                <span key={tag} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <button className="text-green-400 hover:text-green-300 text-sm">
                👍 Helpful
              </button>
              <button className="text-red-400 hover:text-red-300 text-sm">
                👎 Not Helpful
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ChangelogTab: React.FC = () => (
  <div className="space-y-6">
    <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">📝 Version History</h3>
      <p className="text-gray-400">
        Track the evolution of Phase 3 features with detailed release notes and updates.
      </p>
    </div>

    <div className="space-y-6">
      {[
        {
          version: '3.0.0',
          date: '2025-09-03',
          type: 'major',
          title: 'Phase 3 Launch',
          description: 'Complete Phase 3 feature set with advanced analytics, AI integration, and professional tools.',
          features: [
            'Advanced Dashboard with AI-powered insights',
            'Enhanced Player Analytics with ML projections',
            'Trade Analysis Center with fairness evaluation',
            'Integration Hub for unified feature access',
            'Performance Monitoring dashboard',
            'Developer Tools for debugging and analysis',
            'System Administration panel'
          ]
        },
        {
          version: '2.9.5',
          date: '2025-08-28',
          type: 'minor',
          title: 'Pre-Phase 3 Preparations',
          description: 'Infrastructure improvements and foundation enhancements for Phase 3 features.',
          features: [
            'Enhanced data pipeline architecture',
            'Improved API response times',
            'Updated UI component library',
            'Performance optimizations'
          ]
        },
        {
          version: '2.9.0',
          date: '2025-08-15',
          type: 'minor',
          title: 'Advanced Analytics Preview',
          description: 'Beta release of analytics features and enhanced data visualization.',
          features: [
            'Beta analytics dashboard',
            'Enhanced charting capabilities',
            'Improved data export options',
            'User feedback collection system'
          ]
        }
      ].map(release => (
        <div key={release.version} className="bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded ${
                release.type === 'major' ? 'bg-red-500/20 text-red-300' :
                release.type === 'minor' ? 'bg-blue-500/20 text-blue-300' :
                'bg-green-500/20 text-green-300'
              }`}>
                v{release.version}
              </span>
              <h4 className="text-lg font-semibold">{release.title}</h4>
            </div>
            <div className="text-sm text-gray-400">{release.date}</div>
          </div>
          
          <p className="text-gray-300 mb-4">{release.description}</p>
          
          <div>
            <h5 className="font-medium mb-2">What&apos;s New:</h5>
            <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
              {release.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Phase3FeatureDocumentation;
