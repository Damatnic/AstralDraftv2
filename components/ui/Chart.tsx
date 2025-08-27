import React from 'react';

interface ChartProps {
  data: { label: string; value: number; color?: string }[];
  type?: 'bar' | 'line' | 'pie';
  height?: number;
  loading?: boolean;
}

export const Chart: React.FC<ChartProps> = ({ 
  data, 
  type = 'bar', 
  height = 200,
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="glass-pane p-4 animate-pulse" style={{ height }}>
        <div className="h-4 bg-white/20 rounded mb-4 w-1/3"></div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-6 bg-white/10 rounded" style={{ width: `${Math.random() * 60 + 40}%` }}></div>
          ))}
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="glass-pane p-4" style={{ height }}>
      <div className="h-full flex items-end gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full rounded-t transition-all duration-300 hover:opacity-80"
              style={{
                height: `${(item.value / maxValue) * 80}%`,
                backgroundColor: item.color || 'var(--color-primary)',
                minHeight: '4px'
              }}
            />
            <span className="text-xs mt-2 text-center text-[var(--text-secondary)]">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};