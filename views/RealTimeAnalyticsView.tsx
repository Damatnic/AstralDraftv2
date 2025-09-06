/**
 * Real-Time Analytics View
 * Comprehensive real-time analytics dashboard with live metrics and predictive insights
 */

import RealTimeAnalyticsDashboard from '../components/analytics/RealTimeAnalyticsDashboard';

const RealTimeAnalyticsView: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5">
      <RealTimeAnalyticsDashboard />
    </div>
  );
};

export default RealTimeAnalyticsView;
