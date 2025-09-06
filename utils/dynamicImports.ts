/**
 * Dynamic Import Utilities for Bundle Size Optimization
 * Load heavy libraries only when needed
 */

// Chart.js dynamic loading
export const loadChartJS = async () => {
  const { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } = await import('chart.js');
  return { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend };
};

// Recharts dynamic loading
export const loadRecharts = async () => {
  const module = await import('recharts');
  return module;
};

// DOMPurify dynamic loading for HTML sanitization
export const sanitizeHTML = async (html: string) => {
  const DOMPurify = await import('isomorphic-dompurify');
  return DOMPurify.default.sanitize(html);
};

// Lodash utilities dynamic loading
export const loadLodashUtils = async () => {
  const [
    { debounce },
    { throttle },
    { groupBy },
    { sortBy }
  ] = await Promise.all([
    import('lodash/debounce'),
    import('lodash/throttle'), 
    import('lodash/groupBy'),
    import('lodash/sortBy')
  ]);
  
  return { debounce, throttle, groupBy, sortBy };
};

// Framer Motion dynamic loading for heavy animations
export const loadFramerMotion = async () => {
  const { motion, AnimatePresence } = await import('framer-motion');
  return { motion, AnimatePresence };
};

// Date utilities dynamic loading
export const loadDateUtils = async () => {
  const dateFns = await import('date-fns');
  return dateFns;
};