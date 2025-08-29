// Oracle user dashboard service - user dashboard customization and management

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  position: WidgetPosition;
  size: WidgetSize;
  configuration: WidgetConfiguration;
  permissions: WidgetPermissions;
  data: WidgetData;
  metadata: WidgetMetadata;
  status: WidgetStatus;
}

export type WidgetType = 
  | 'player_performance'
  | 'team_standings'
  | 'matchup_preview'
  | 'injury_report'
  | 'weather_forecast'
  | 'trade_analyzer'
  | 'waiver_wire'
  | 'scoring_trends'
  | 'news_feed'
  | 'prediction_accuracy'
  | 'custom_chart'
  | 'quick_actions';

export interface WidgetPosition {
  x: number;
  y: number;
  zIndex: number;
  anchor: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

export interface WidgetSize {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;
  resizable: boolean;
  aspectRatio?: number;
}

export interface WidgetConfiguration {
  refreshInterval: number; // milliseconds
  autoRefresh: boolean;
  cacheEnabled: boolean;
  showHeader: boolean;
  showBorder: boolean;
  theme: WidgetTheme;
  interactions: WidgetInteractions;
  dataFilters: DataFilter[];
  customSettings: Record<string, unknown>;
}

export interface WidgetTheme {
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  headerColor: string;
  accentColor: string;
  fontSize: number;
  fontFamily: string;
  transparency: number; // 0-1
}

export interface WidgetInteractions {
  clickable: boolean;
  hoverable: boolean;
  selectable: boolean;
  draggable: boolean;
  contextMenu: boolean;
  doubleClickAction?: string;
  rightClickAction?: string;
}

export interface DataFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains' | 'between';
  value: unknown;
  label: string;
  active: boolean;
}

export interface WidgetPermissions {
  view: boolean;
  edit: boolean;
  delete: boolean;
  share: boolean;
  export: boolean;
  roles: string[];
  users: string[];
}

export interface WidgetData {
  source: DataSource;
  lastUpdated: number;
  updateFrequency: number;
  dataPoints: number;
  size: number; // bytes
  cached: boolean;
  error?: DataError;
}

export interface DataSource {
  type: 'api' | 'database' | 'cache' | 'computed' | 'external';
  endpoint?: string;
  query?: string;
  parameters: Record<string, unknown>;
  authentication?: AuthenticationConfig;
}

export interface AuthenticationConfig {
  type: 'none' | 'api_key' | 'oauth' | 'basic';
  credentials: Record<string, string>;
}

export interface DataError {
  code: string;
  message: string;
  timestamp: number;
  recoverable: boolean;
  retryCount: number;
}

export interface WidgetMetadata {
  createdAt: number;
  createdBy: string;
  updatedAt: number;
  updatedBy: string;
  version: string;
  tags: string[];
  category: string;
  popularity: number;
  usage: WidgetUsage;
}

export interface WidgetUsage {
  views: number;
  interactions: number;
  lastAccessed: number;
  averageViewTime: number; // milliseconds
  bounceRate: number; // percentage
}

export type WidgetStatus = 'active' | 'inactive' | 'loading' | 'error' | 'updating';

export interface DashboardLayout {
  id: string;
  name: string;
  description?: string;
  userId: string;
  isDefault: boolean;
  isPublic: boolean;
  widgets: string[]; // widget IDs
  grid: GridConfiguration;
  styling: LayoutStyling;
  breakpoints: BreakpointConfiguration[];
  metadata: LayoutMetadata;
}

export interface GridConfiguration {
  columns: number;
  rows: number;
  cellWidth: number;
  cellHeight: number;
  gap: number;
  padding: number;
  responsive: boolean;
  autoFlow: 'row' | 'column' | 'dense';
}

export interface LayoutStyling {
  backgroundColor: string;
  backgroundImage?: string;
  borderRadius: number;
  shadow: boolean;
  animation: boolean;
  transitions: boolean;
  customCSS?: string;
}

export interface BreakpointConfiguration {
  name: string;
  minWidth: number;
  maxWidth?: number;
  columns: number;
  gap: number;
  padding: number;
}

export interface LayoutMetadata {
  createdAt: number;
  updatedAt: number;
  sharedWith: string[];
  tags: string[];
  category: string;
  rating: number;
  usage: LayoutUsage;
}

export interface LayoutUsage {
  views: number;
  activeUsers: number;
  lastUsed: number;
  averageSessionTime: number;
  retentionRate: number;
}

export interface DashboardTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  widgets: TemplateWidget[];
  layout: TemplateLayout;
  preview: TemplatePreview;
  metadata: TemplateMetadata;
  requirements: TemplateRequirements;
}

export type TemplateCategory = 
  | 'fantasy_football'
  | 'player_analysis'
  | 'team_management'
  | 'league_overview'
  | 'trade_analysis'
  | 'injury_tracking'
  | 'custom';

export interface TemplateWidget {
  type: WidgetType;
  position: WidgetPosition;
  size: WidgetSize;
  configuration: Partial<WidgetConfiguration>;
  required: boolean;
  customizable: boolean;
}

export interface TemplateLayout {
  grid: GridConfiguration;
  styling: LayoutStyling;
  breakpoints: BreakpointConfiguration[];
}

export interface TemplatePreview {
  thumbnail: string;
  screenshots: string[];
  demoUrl?: string;
  videoUrl?: string;
}

export interface TemplateMetadata {
  author: string;
  version: string;
  createdAt: number;
  updatedAt: number;
  downloads: number;
  rating: number;
  reviews: TemplateReview[];
  tags: string[];
}

export interface TemplateReview {
  userId: string;
  rating: number;
  comment: string;
  timestamp: number;
  helpful: number;
}

export interface TemplateRequirements {
  minUserLevel: number;
  permissions: string[];
  features: string[];
  dataAccess: string[];
}

export interface UserPreferences {
  userId: string;
  defaultLayout: string;
  theme: UserTheme;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  accessibility: AccessibilitySettings;
  performance: PerformanceSettings;
  customizations: UserCustomizations;
}

export interface UserTheme {
  mode: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  animations: boolean;
  transitions: boolean;
}

export interface NotificationPreferences {
  enabled: boolean;
  types: NotificationType[];
  frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
  quiet_hours: QuietHours;
  delivery: DeliveryMethod[];
}

export type NotificationType = 
  | 'trade_offers'
  | 'waivers'
  | 'injuries'
  | 'score_updates'
  | 'player_news'
  | 'weekly_recap'
  | 'predictions';

export interface QuietHours {
  enabled: boolean;
  start: string; // HH:MM format
  end: string; // HH:MM format
  timezone: string;
}

export type DeliveryMethod = 'in_app' | 'email' | 'push' | 'sms';

export interface PrivacySettings {
  profileVisible: boolean;
  statsVisible: boolean;
  tradesVisible: boolean;
  allowMessages: boolean;
  allowFriendRequests: boolean;
  dataSharing: DataSharingSettings;
}

export interface DataSharingSettings {
  analytics: boolean;
  research: boolean;
  marketing: boolean;
  thirdParty: boolean;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  colorBlindFriendly: boolean;
  animations: boolean;
  soundEffects: boolean;
}

export interface PerformanceSettings {
  autoRefresh: boolean;
  backgroundUpdates: boolean;
  imageLoading: 'immediate' | 'lazy' | 'disabled';
  caching: boolean;
  compression: boolean;
  prefetch: boolean;
}

export interface UserCustomizations {
  shortcuts: Shortcut[];
  bookmarks: Bookmark[];
  pinnedWidgets: string[];
  hiddenFeatures: string[];
  customFields: CustomField[];
}

export interface Shortcut {
  id: string;
  name: string;
  action: string;
  keys: string[];
  enabled: boolean;
}

export interface Bookmark {
  id: string;
  name: string;
  url: string;
  category: string;
  createdAt: number;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  value: unknown;
  options?: string[];
}

export interface DashboardAnalytics {
  userId: string;
  period: AnalyticsPeriod;
  metrics: AnalyticsMetrics;
  widgetPerformance: WidgetPerformance[];
  userBehavior: UserBehavior;
  insights: AnalyticsInsight[];
}

export interface AnalyticsPeriod {
  start: number;
  end: number;
  duration: number; // milliseconds
  granularity: 'hour' | 'day' | 'week' | 'month';
}

export interface AnalyticsMetrics {
  totalSessions: number;
  totalDuration: number; // milliseconds
  averageSessionDuration: number;
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number; // percentage
  retentionRate: number; // percentage
}

export interface WidgetPerformance {
  widgetId: string;
  widgetType: WidgetType;
  views: number;
  interactions: number;
  averageViewTime: number;
  clickThroughRate: number;
  errorRate: number;
  loadTime: number;
  popularActions: PopularAction[];
}

export interface PopularAction {
  action: string;
  count: number;
  percentage: number;
}

export interface UserBehavior {
  mostUsedWidgets: string[];
  commonPatterns: BehaviorPattern[];
  peakUsageHours: number[];
  preferredLayouts: string[];
  featureAdoption: FeatureAdoption[];
}

export interface BehaviorPattern {
  pattern: string;
  frequency: number;
  confidence: number; // 0-1
  description: string;
}

export interface FeatureAdoption {
  feature: string;
  adoptionRate: number; // percentage
  timeToAdoption: number; // days
  usageFrequency: number;
}

export interface AnalyticsInsight {
  type: 'recommendation' | 'warning' | 'optimization' | 'trend';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-1
  actionable: boolean;
  actions?: InsightAction[];
}

export interface InsightAction {
  id: string;
  title: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  category: string;
}

export interface DashboardExport {
  format: ExportFormat;
  options: ExportOptions;
  data: ExportData;
  metadata: ExportMetadata;
}

export type ExportFormat = 'json' | 'csv' | 'pdf' | 'png' | 'svg' | 'html';

export interface ExportOptions {
  includeData: boolean;
  includeConfiguration: boolean;
  includeMetadata: boolean;
  includeAnalytics: boolean;
  timeRange?: TimeRange;
  filters?: ExportFilter[];
  quality?: 'low' | 'medium' | 'high';
  compression?: boolean;
}

export interface TimeRange {
  start: number;
  end: number;
}

export interface ExportFilter {
  field: string;
  value: unknown;
  operator: string;
}

export interface ExportData {
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  preferences: UserPreferences;
  analytics?: DashboardAnalytics;
}

export interface ExportMetadata {
  exportedAt: number;
  exportedBy: string;
  version: string;
  size: number; // bytes
  checksum: string;
}

export interface DashboardShare {
  id: string;
  dashboardId: string;
  sharedBy: string;
  sharedWith: ShareTarget[];
  permissions: SharePermissions;
  expiresAt?: number;
  accessCount: number;
  metadata: ShareMetadata;
}

export interface ShareTarget {
  type: 'user' | 'group' | 'public' | 'link';
  id?: string;
  email?: string;
  role?: string;
}

export interface SharePermissions {
  view: boolean;
  edit: boolean;
  share: boolean;
  export: boolean;
  comment: boolean;
}

export interface ShareMetadata {
  createdAt: number;
  lastAccessed: number;
  accessLog: AccessLog[];
  comments: ShareComment[];
}

export interface AccessLog {
  userId: string;
  timestamp: number;
  action: 'view' | 'edit' | 'export' | 'share';
  ipAddress: string;
  userAgent: string;
}

export interface ShareComment {
  id: string;
  userId: string;
  comment: string;
  timestamp: number;
  replies: ShareComment[];
}

export interface UserDashboardService {
  // Widget management
  createWidget(widget: Omit<DashboardWidget, 'id' | 'metadata' | 'status'>): Promise<string>;
  updateWidget(widgetId: string, updates: Partial<DashboardWidget>): Promise<boolean>;
  deleteWidget(widgetId: string): Promise<boolean>;
  getWidget(widgetId: string): Promise<DashboardWidget | null>;
  getUserWidgets(_userId: string): Promise<DashboardWidget[]>;
  duplicateWidget(widgetId: string): Promise<string>;
  
  // Layout management
  createLayout(layout: Omit<DashboardLayout, 'id' | 'metadata'>): Promise<string>;
  updateLayout(layoutId: string, updates: Partial<DashboardLayout>): Promise<boolean>;
  deleteLayout(layoutId: string): Promise<boolean>;
  getLayout(layoutId: string): Promise<DashboardLayout | null>;
  getUserLayouts(_userId: string): Promise<DashboardLayout[]>;
  setDefaultLayout(_userId: string, layoutId: string): Promise<boolean>;
  
  // Template management
  getTemplates(category?: TemplateCategory): Promise<DashboardTemplate[]>;
  getTemplate(templateId: string): Promise<DashboardTemplate | null>;
  applyTemplate(templateId: string, _userId: string): Promise<string>;
  createTemplate(template: Omit<DashboardTemplate, 'id' | 'metadata'>): Promise<string>;
  rateTemplate(templateId: string, _userId: string, rating: number, comment?: string): Promise<boolean>;
  
  // User preferences
  getUserPreferences(_userId: string): Promise<UserPreferences>;
  updateUserPreferences(_userId: string, preferences: Partial<UserPreferences>): Promise<boolean>;
  resetUserPreferences(_userId: string): Promise<boolean>;
  
  // Analytics and insights
  getDashboardAnalytics(_userId: string, period: AnalyticsPeriod): Promise<DashboardAnalytics>;
  getWidgetAnalytics(widgetId: string, period: AnalyticsPeriod): Promise<WidgetPerformance>;
  getUserInsights(_userId: string): Promise<AnalyticsInsight[]>;
  trackUserAction(_userId: string, action: string, context: Record<string, unknown>): Promise<void>;
  
  // Import/Export
  exportDashboard(dashboardId: string, format: ExportFormat, options: ExportOptions): Promise<DashboardExport>;
  importDashboard(_userId: string, data: ExportData): Promise<string>;
  
  // Sharing and collaboration
  shareDashboard(dashboardId: string, share: Omit<DashboardShare, 'id' | 'accessCount' | 'metadata'>): Promise<string>;
  updateSharePermissions(shareId: string, permissions: SharePermissions): Promise<boolean>;
  revokeShare(shareId: string): Promise<boolean>;
  getSharedDashboards(_userId: string): Promise<DashboardShare[]>;
  addShareComment(shareId: string, _userId: string, comment: string): Promise<string>;
  
  // Widget data management
  refreshWidgetData(widgetId: string): Promise<boolean>;
  getWidgetData(widgetId: string): Promise<unknown>;
  updateWidgetConfiguration(widgetId: string, config: Partial<WidgetConfiguration>): Promise<boolean>;
  
  // Search and discovery
  searchWidgets(query: string, filters?: SearchFilter[]): Promise<DashboardWidget[]>;
  searchLayouts(query: string, filters?: SearchFilter[]): Promise<DashboardLayout[]>;
  getPopularWidgets(limit?: number): Promise<DashboardWidget[]>;
  getRecommendedWidgets(_userId: string): Promise<DashboardWidget[]>;
}

export interface SearchFilter {
  field: string;
  value: unknown;
  operator: string;
}

class OracleUserDashboardService implements UserDashboardService {
  private widgets: Map<string, DashboardWidget>;
  private layouts: Map<string, DashboardLayout>;
  private templates: Map<string, DashboardTemplate>;
  private preferences: Map<string, UserPreferences>;
  private shares: Map<string, DashboardShare>;
  private analytics: Map<string, DashboardAnalytics>;

  constructor() {
    this.widgets = new Map();
    this.layouts = new Map();
    this.templates = new Map();
    this.preferences = new Map();
    this.shares = new Map();
    this.analytics = new Map();
    
    this.initializeDefaultTemplates();
  }

  async createWidget(widget: Omit<DashboardWidget, 'id' | 'metadata' | 'status'>): Promise<string> {
    const widgetId = this.generateId();
    const now = Date.now();
    
    const fullWidget: DashboardWidget = {
      ...widget,
      id: widgetId,
      metadata: {
        createdAt: now,
        createdBy: 'system',
        updatedAt: now,
        updatedBy: 'system',
        version: '1.0',
        tags: [],
        category: 'custom',
        popularity: 0,
        usage: {
          views: 0,
          interactions: 0,
          lastAccessed: now,
          averageViewTime: 0,
          bounceRate: 0
        }
      },
      status: 'active'
    };

    this.widgets.set(widgetId, fullWidget);
    return widgetId;
  }

  async updateWidget(widgetId: string, updates: Partial<DashboardWidget>): Promise<boolean> {
    const widget = this.widgets.get(widgetId);
    if (!widget) return false;

    const updatedWidget = {
      ...widget,
      ...updates,
      metadata: {
        ...widget.metadata,
        updatedAt: Date.now(),
        updatedBy: 'system'
      }
    };

    this.widgets.set(widgetId, updatedWidget);
    return true;
  }

  async deleteWidget(widgetId: string): Promise<boolean> {
    return this.widgets.delete(widgetId);
  }

  async getWidget(widgetId: string): Promise<DashboardWidget | null> {
    return this.widgets.get(widgetId) || null;
  }

  async getUserWidgets(_userId: string): Promise<DashboardWidget[]> {
    return Array.from(this.widgets.values());
  }

  async duplicateWidget(widgetId: string): Promise<string> {
    const widget = this.widgets.get(widgetId);
    if (!widget) throw new Error('Widget not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, metadata, ...widgetData } = widget;
    return this.createWidget({
      ...widgetData,
      title: `${widget.title} (Copy)`
    });
  }

  async createLayout(layout: Omit<DashboardLayout, 'id' | 'metadata'>): Promise<string> {
    const layoutId = this.generateId();
    const now = Date.now();

    const fullLayout: DashboardLayout = {
      ...layout,
      id: layoutId,
      metadata: {
        createdAt: now,
        updatedAt: now,
        sharedWith: [],
        tags: [],
        category: 'custom',
        rating: 0,
        usage: {
          views: 0,
          activeUsers: 0,
          lastUsed: now,
          averageSessionTime: 0,
          retentionRate: 0
        }
      }
    };

    this.layouts.set(layoutId, fullLayout);
    return layoutId;
  }

  async updateLayout(layoutId: string, updates: Partial<DashboardLayout>): Promise<boolean> {
    const layout = this.layouts.get(layoutId);
    if (!layout) return false;

    const updatedLayout = {
      ...layout,
      ...updates,
      metadata: {
        ...layout.metadata,
        updatedAt: Date.now()
      }
    };

    this.layouts.set(layoutId, updatedLayout);
    return true;
  }

  async deleteLayout(layoutId: string): Promise<boolean> {
    return this.layouts.delete(layoutId);
  }

  async getLayout(layoutId: string): Promise<DashboardLayout | null> {
    return this.layouts.get(layoutId) || null;
  }

  async getUserLayouts(_userId: string): Promise<DashboardLayout[]> {
    return Array.from(this.layouts.values())
      .filter(layout => layout.userId === _userId);
  }

  async setDefaultLayout(_userId: string, layoutId: string): Promise<boolean> {
    const preferences = await this.getUserPreferences(_userId);
    preferences.defaultLayout = layoutId;
    return this.updateUserPreferences(_userId, preferences);
  }

  async getTemplates(category?: TemplateCategory): Promise<DashboardTemplate[]> {
    let templates = Array.from(this.templates.values());
    
    if (category) {
      templates = templates.filter(template => template.category === category);
    }
    
    return templates.sort((a, b) => b.metadata.rating - a.metadata.rating);
  }

  async getTemplate(templateId: string): Promise<DashboardTemplate | null> {
    return this.templates.get(templateId) || null;
  }

  async applyTemplate(templateId: string, _userId: string): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) throw new Error('Template not found');

    // Create layout from template
    const layoutId = await this.createLayout({
      name: template.name,
      description: template.description,
      userId: _userId,
      isDefault: false,
      isPublic: false,
      widgets: [],
      grid: template.layout.grid,
      styling: template.layout.styling,
      breakpoints: template.layout.breakpoints
    });

    // Create widgets from template
    const widgetIds: string[] = [];
    for (const templateWidget of template.widgets) {
      const widgetId = await this.createWidget({
        type: templateWidget.type,
        title: `${templateWidget.type.replace('_', ' ')} Widget`,
        position: templateWidget.position,
        size: templateWidget.size,
        configuration: {
          refreshInterval: 30000,
          autoRefresh: true,
          cacheEnabled: true,
          showHeader: true,
          showBorder: true,
          theme: {
            backgroundColor: '#ffffff',
            textColor: '#000000',
            borderColor: '#cccccc',
            headerColor: '#f5f5f5',
            accentColor: '#007bff',
            fontSize: 14,
            fontFamily: 'Arial, sans-serif',
            transparency: 1
          },
          interactions: {
            clickable: true,
            hoverable: true,
            selectable: false,
            draggable: true,
            contextMenu: true
          },
          dataFilters: [],
          customSettings: {},
          ...templateWidget.configuration
        },
        permissions: {
          view: true,
          edit: true,
          delete: true,
          share: true,
          export: true,
          roles: [],
          users: []
        },
        data: {
          source: {
            type: 'api',
            parameters: {}
          },
          lastUpdated: Date.now(),
          updateFrequency: 30000,
          dataPoints: 0,
          size: 0,
          cached: false
        }
      });
      
      widgetIds.push(widgetId);
    }

    // Update layout with widget IDs
    await this.updateLayout(layoutId, { widgets: widgetIds });

    // Update template download count
    const templateData = this.templates.get(templateId)!;
    templateData.metadata.downloads++;
    this.templates.set(templateId, templateData);

    return layoutId;
  }

  async createTemplate(template: Omit<DashboardTemplate, 'id' | 'metadata'>): Promise<string> {
    const templateId = this.generateId();
    const now = Date.now();

    const fullTemplate: DashboardTemplate = {
      ...template,
      id: templateId,
      metadata: {
        author: 'system',
        version: '1.0',
        createdAt: now,
        updatedAt: now,
        downloads: 0,
        rating: 0,
        reviews: [],
        tags: []
      }
    };

    this.templates.set(templateId, fullTemplate);
    return templateId;
  }

  async rateTemplate(templateId: string, _userId: string, rating: number, comment?: string): Promise<boolean> {
    const template = this.templates.get(templateId);
    if (!template) return false;

    const review: TemplateReview = {
      userId: _userId,
      rating,
      comment: comment || '',
      timestamp: Date.now(),
      helpful: 0
    };

    template.metadata.reviews.push(review);
    
    // Recalculate average rating
    const totalRating = template.metadata.reviews.reduce((sum, r) => sum + r.rating, 0);
    template.metadata.rating = totalRating / template.metadata.reviews.length;

    this.templates.set(templateId, template);
    return true;
  }

  async getUserPreferences(_userId: string): Promise<UserPreferences> {
    const existing = this.preferences.get(_userId);
    if (existing) return existing;

    // Create default preferences
    const defaultPreferences: UserPreferences = {
      userId: _userId,
      defaultLayout: '',
      theme: {
        mode: 'light',
        primaryColor: '#007bff',
        secondaryColor: '#6c757d',
        accentColor: '#28a745',
        fontFamily: 'Arial, sans-serif',
        fontSize: 'medium',
        animations: true,
        transitions: true
      },
      notifications: {
        enabled: true,
        types: ['trade_offers', 'injuries', 'score_updates'],
        frequency: 'immediate',
        quiet_hours: {
          enabled: false,
          start: '22:00',
          end: '08:00',
          timezone: 'America/New_York'
        },
        delivery: ['in_app', 'email']
      },
      privacy: {
        profileVisible: true,
        statsVisible: true,
        tradesVisible: true,
        allowMessages: true,
        allowFriendRequests: true,
        dataSharing: {
          analytics: true,
          research: false,
          marketing: false,
          thirdParty: false
        }
      },
      accessibility: {
        highContrast: false,
        largeText: false,
        screenReader: false,
        keyboardNavigation: false,
        colorBlindFriendly: false,
        animations: true,
        soundEffects: true
      },
      performance: {
        autoRefresh: true,
        backgroundUpdates: true,
        imageLoading: 'lazy',
        caching: true,
        compression: true,
        prefetch: true
      },
      customizations: {
        shortcuts: [],
        bookmarks: [],
        pinnedWidgets: [],
        hiddenFeatures: [],
        customFields: []
      }
    };

    this.preferences.set(_userId, defaultPreferences);
    return defaultPreferences;
  }

  async updateUserPreferences(_userId: string, preferences: Partial<UserPreferences>): Promise<boolean> {
    const current = await this.getUserPreferences(_userId);
    const updated = { ...current, ...preferences };
    this.preferences.set(_userId, updated);
    return true;
  }

  async resetUserPreferences(_userId: string): Promise<boolean> {
    this.preferences.delete(_userId);
    return true;
  }

  async getDashboardAnalytics(_userId: string, period: AnalyticsPeriod): Promise<DashboardAnalytics> {
    const existing = this.analytics.get(_userId);
    if (existing) return existing;

    // Create mock analytics
    const analytics: DashboardAnalytics = {
      userId: _userId,
      period,
      metrics: {
        totalSessions: 150,
        totalDuration: 18000000, // 5 hours
        averageSessionDuration: 120000, // 2 minutes
        pageViews: 450,
        uniqueVisitors: 75,
        bounceRate: 15,
        retentionRate: 85
      },
      widgetPerformance: [],
      userBehavior: {
        mostUsedWidgets: [],
        commonPatterns: [],
        peakUsageHours: [9, 12, 15, 18, 21],
        preferredLayouts: [],
        featureAdoption: []
      },
      insights: []
    };

    this.analytics.set(_userId, analytics);
    return analytics;
  }

  async getWidgetAnalytics(widgetId: string, _period: AnalyticsPeriod): Promise<WidgetPerformance> {
    const widget = this.widgets.get(widgetId);
    if (!widget) throw new Error('Widget not found');

    return {
      widgetId,
      widgetType: widget.type,
      views: widget.metadata.usage.views,
      interactions: widget.metadata.usage.interactions,
      averageViewTime: widget.metadata.usage.averageViewTime,
      clickThroughRate: 15, // percentage
      errorRate: 2, // percentage
      loadTime: 150, // milliseconds
      popularActions: [
        { action: 'click', count: 45, percentage: 60 },
        { action: 'hover', count: 30, percentage: 40 }
      ]
    };
  }

  async getUserInsights(_userId: string): Promise<AnalyticsInsight[]> {
    return [
      {
        type: 'recommendation',
        title: 'Optimize Widget Layout',
        description: 'Consider moving frequently used widgets to the top of your dashboard',
        impact: 'medium',
        confidence: 0.8,
        actionable: true,
        actions: [
          {
            id: 'move_widget_up',
            title: 'Move Popular Widgets Up',
            description: 'Automatically reorganize widgets by usage frequency',
            effort: 'low',
            impact: 'medium',
            category: 'layout'
          }
        ]
      }
    ];
  }

  async trackUserAction(_userId: string, _action: string, _context: Record<string, unknown>): Promise<void> {
    // Mock implementation - in production would log to analytics system
    const analytics = await this.getDashboardAnalytics(_userId, {
      start: Date.now() - 86400000,
      end: Date.now(),
      duration: 86400000,
      granularity: 'hour'
    });

    analytics.metrics.pageViews++;
    this.analytics.set(_userId, analytics);
  }

  async exportDashboard(dashboardId: string, format: ExportFormat, options: ExportOptions): Promise<DashboardExport> {
    const layout = this.layouts.get(dashboardId);
    if (!layout) throw new Error('Dashboard not found');

    const widgets = layout.widgets
      .map(widgetId => this.widgets.get(widgetId))
      .filter((widget): widget is DashboardWidget => widget !== undefined);

    const preferences = this.preferences.get(layout.userId);
    const analytics = options.includeAnalytics ? this.analytics.get(layout.userId) : undefined;

    const exportData: ExportData = {
      widgets: options.includeData ? widgets : [],
      layout,
      preferences: preferences || await this.getUserPreferences(layout.userId),
      analytics
    };

    const serialized = JSON.stringify(exportData);
    
    return {
      format,
      options,
      data: exportData,
      metadata: {
        exportedAt: Date.now(),
        exportedBy: layout.userId,
        version: '1.0',
        size: serialized.length,
        checksum: this.calculateChecksum(serialized)
      }
    };
  }

  async importDashboard(_userId: string, data: ExportData): Promise<string> {
    // Create new layout
    const layoutId = await this.createLayout({
      ...data.layout,
      userId: _userId,
      widgets: []
    });

    // Import widgets
    const widgetIds: string[] = [];
    for (const widget of data.widgets) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, metadata, ...widgetData } = widget;
      const widgetId = await this.createWidget(widgetData);
      widgetIds.push(widgetId);
    }

    // Update layout with new widget IDs
    await this.updateLayout(layoutId, { widgets: widgetIds });

    return layoutId;
  }

  async shareDashboard(dashboardId: string, share: Omit<DashboardShare, 'id' | 'accessCount' | 'metadata'>): Promise<string> {
    const shareId = this.generateId();
    const now = Date.now();

    const fullShare: DashboardShare = {
      ...share,
      id: shareId,
      accessCount: 0,
      metadata: {
        createdAt: now,
        lastAccessed: now,
        accessLog: [],
        comments: []
      }
    };

    this.shares.set(shareId, fullShare);
    return shareId;
  }

  async updateSharePermissions(shareId: string, permissions: SharePermissions): Promise<boolean> {
    const share = this.shares.get(shareId);
    if (!share) return false;

    share.permissions = permissions;
    this.shares.set(shareId, share);
    return true;
  }

  async revokeShare(shareId: string): Promise<boolean> {
    return this.shares.delete(shareId);
  }

  async getSharedDashboards(_userId: string): Promise<DashboardShare[]> {
    return Array.from(this.shares.values())
      .filter(share => 
        share.sharedBy === _userId || 
        share.sharedWith.some(target => target.id === _userId || target.email === _userId)
      );
  }

  async addShareComment(shareId: string, _userId: string, comment: string): Promise<string> {
    const share = this.shares.get(shareId);
    if (!share) throw new Error('Share not found');

    const commentId = this.generateId();
    const shareComment: ShareComment = {
      id: commentId,
      userId: _userId,
      comment,
      timestamp: Date.now(),
      replies: []
    };

    share.metadata.comments.push(shareComment);
    this.shares.set(shareId, share);
    
    return commentId;
  }

  async refreshWidgetData(widgetId: string): Promise<boolean> {
    const widget = this.widgets.get(widgetId);
    if (!widget) return false;

    widget.data.lastUpdated = Date.now();
    widget.status = 'loading';
    
    // Simulate data refresh
    setTimeout(() => {
      widget.status = 'active';
      this.widgets.set(widgetId, widget);
    }, 1000);

    this.widgets.set(widgetId, widget);
    return true;
  }

  async getWidgetData(widgetId: string): Promise<unknown> {
    const widget = this.widgets.get(widgetId);
    if (!widget) return null;

    // Return mock data based on widget type
    switch (widget.type) {
      case 'player_performance':
        return { playerStats: { touchdowns: 12, yards: 1200, receptions: 85 } };
      case 'team_standings':
        return { standings: [{ team: 'Team A', wins: 10, losses: 3 }] };
      default:
        return { message: 'No data available' };
    }
  }

  async updateWidgetConfiguration(widgetId: string, config: Partial<WidgetConfiguration>): Promise<boolean> {
    const widget = this.widgets.get(widgetId);
    if (!widget) return false;

    widget.configuration = { ...widget.configuration, ...config };
    widget.metadata.updatedAt = Date.now();
    
    this.widgets.set(widgetId, widget);
    return true;
  }

  async searchWidgets(query: string, _filters?: SearchFilter[]): Promise<DashboardWidget[]> {
    const widgets = Array.from(this.widgets.values());
    const lowercaseQuery = query.toLowerCase();

    return widgets.filter(widget => 
      widget.title.toLowerCase().includes(lowercaseQuery) ||
      widget.description?.toLowerCase().includes(lowercaseQuery) ||
      widget.metadata.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  async searchLayouts(query: string, _filters?: SearchFilter[]): Promise<DashboardLayout[]> {
    const layouts = Array.from(this.layouts.values());
    const lowercaseQuery = query.toLowerCase();

    return layouts.filter(layout => 
      layout.name.toLowerCase().includes(lowercaseQuery) ||
      layout.description?.toLowerCase().includes(lowercaseQuery) ||
      layout.metadata.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getPopularWidgets(limit: number = 10): Promise<DashboardWidget[]> {
    return Array.from(this.widgets.values())
      .sort((a, b) => b.metadata.popularity - a.metadata.popularity)
      .slice(0, limit);
  }

  async getRecommendedWidgets(_userId: string): Promise<DashboardWidget[]> {
    // Mock recommendation based on popular widgets
    return this.getPopularWidgets(5);
  }

  // Private helper methods
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private calculateChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  private initializeDefaultTemplates(): void {
    // Create some default templates
    const defaultTemplate: DashboardTemplate = {
      id: 'default_fantasy_template',
      name: 'Fantasy Football Essentials',
      description: 'Essential widgets for fantasy football management',
      category: 'fantasy_football',
      difficulty: 'beginner',
      widgets: [
        {
          type: 'player_performance',
          position: { x: 0, y: 0, zIndex: 1, anchor: 'top-left' },
          size: { width: 400, height: 300, minWidth: 300, minHeight: 200, resizable: true },
          configuration: {},
          required: true,
          customizable: true
        },
        {
          type: 'team_standings',
          position: { x: 400, y: 0, zIndex: 1, anchor: 'top-left' },
          size: { width: 400, height: 300, minWidth: 300, minHeight: 200, resizable: true },
          configuration: {},
          required: true,
          customizable: true
        }
      ],
      layout: {
        grid: {
          columns: 12,
          rows: 8,
          cellWidth: 100,
          cellHeight: 100,
          gap: 10,
          padding: 20,
          responsive: true,
          autoFlow: 'row'
        },
        styling: {
          backgroundColor: '#f8f9fa',
          borderRadius: 8,
          shadow: true,
          animation: true,
          transitions: true
        },
        breakpoints: [
          {
            name: 'mobile',
            minWidth: 0,
            maxWidth: 768,
            columns: 1,
            gap: 5,
            padding: 10
          },
          {
            name: 'tablet',
            minWidth: 769,
            maxWidth: 1024,
            columns: 2,
            gap: 8,
            padding: 15
          }
        ]
      },
      preview: {
        thumbnail: '/templates/fantasy-essentials-thumb.png',
        screenshots: ['/templates/fantasy-essentials-1.png'],
        demoUrl: '/demo/fantasy-essentials'
      },
      metadata: {
        author: 'Oracle Team',
        version: '1.0',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        downloads: 0,
        rating: 4.5,
        reviews: [],
        tags: ['fantasy', 'football', 'essentials', 'beginner']
      },
      requirements: {
        minUserLevel: 1,
        permissions: ['view_players', 'view_teams'],
        features: ['basic_dashboard'],
        dataAccess: ['player_stats', 'team_stats']
      }
    };

    this.templates.set(defaultTemplate.id, defaultTemplate);
  }
}

export const oracleUserDashboardService = new OracleUserDashboardService();
export default oracleUserDashboardService;
