/**
 * Analytics tracking hook for elite insights
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page views
    const trackPageView = () => {
      // In a real app, this would send to analytics service
      const event = {
        type: 'page_view',
        path: location.pathname,
        timestamp: Date.now(),
        user_agent: navigator.userAgent,
      };
      
      // Store locally for now
      const analytics = JSON.parse(localStorage.getItem('astral_analytics') || '[]');
      analytics.push(event);
      localStorage.setItem('astral_analytics', JSON.stringify(analytics.slice(-100))); // Keep last 100 events
    };

    trackPageView();
  }, [location]);

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    const event = {
      type: 'custom_event',
      name: eventName,
      properties: properties || {},
      timestamp: Date.now(),
      path: location.pathname,
    };
    
    const analytics = JSON.parse(localStorage.getItem('astral_analytics') || '[]');
    analytics.push(event);
    localStorage.setItem('astral_analytics', JSON.stringify(analytics.slice(-100)));
  };

  return { trackEvent };
};
