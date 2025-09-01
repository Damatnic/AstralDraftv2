// View Types for Astral Draft
export type AnalyticsViewType = 
  | &apos;overview&apos;
  | &apos;performance&apos;
  | &apos;trends&apos;
  | &apos;comparisons&apos;
  | &apos;projections&apos;
  | &apos;advanced&apos;;

export type DashboardViewType =
  | &apos;main&apos;
  | &apos;team&apos;
  | &apos;league&apos;
  | &apos;player&apos;
  | &apos;draft&apos;;

export type ReportViewType =
  | &apos;weekly&apos;
  | &apos;season&apos;
  | &apos;custom&apos;
  | &apos;export&apos;;

export interface ViewTypeConfig {
}
  id: string;
  label: string;
  description?: string;
  icon?: string;
}