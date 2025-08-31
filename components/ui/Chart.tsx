import React, { useMemo } from 'react';

interface ChartProps {
  data: { label: string; value: number; color?: string }[];
  type?: 'bar' | 'line' | 'pie';
  height?: number;
  loading?: boolean;

export const Chart: React.FC<ChartProps> = ({ 
  data, 
  type = 'bar', 
  height = 200,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="glass-pane p-4 animate-pulse sm:px-4 md:px-6 lg:px-8" style={{ height }}>
        <div className="h-4 bg-white/20 rounded mb-4 w-1/3 sm:px-4 md:px-6 lg:px-8"></div>
        <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 bg-white/10 rounded sm:px-4 md:px-6 lg:px-8" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
          ))}
        </div>
      </div>
    );

  const maxValue = Math.max(...data.map((d: any) => d.value));

  return (
    <div className="glass-pane p-4 sm:px-4 md:px-6 lg:px-8" style={{ height }}>
      <div className="h-full flex items-end gap-2 sm:px-4 md:px-6 lg:px-8">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center sm:px-4 md:px-6 lg:px-8">
            <div
              className="w-full rounded-t transition-all duration-300 hover:opacity-80 sm:px-4 md:px-6 lg:px-8"
              style={{
                height: `${(item.value / maxValue) * 80}%`,
                backgroundColor: item.color || 'var(--color-primary)',
                minHeight: '4px'
              }}
            />
            <span className="text-xs mt-2 text-center text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};