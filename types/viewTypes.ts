// View Types for Astral Draft
export type AnalyticsViewType = 
  | 'overview'
  | 'performance'
  | 'trends'
  | 'comparisons'
  | 'projections'
  | 'advanced';

export type DashboardViewType =
  | 'main'
  | 'team'
  | 'league'
  | 'player'
  | 'draft';

export type ReportViewType =
  | 'weekly'
  | 'season'
  | 'custom'
  | 'export';

export interface ViewTypeConfig {
  id: string;
  label: string;
  description?: string;
  icon?: string;
}
