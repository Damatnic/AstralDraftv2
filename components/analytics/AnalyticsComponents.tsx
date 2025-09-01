/**
 * Oracle Historical Analytics - Core Components
 * Foundational UI components for historical analytics display
 */

import React, { useMemo } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;

// Simple SVG Icons
export const TrendingUpIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

export const TrendingDownIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
    </svg>
);

export const TargetIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export const BrainIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

export const ActivityIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

export const DownloadIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

export const RefreshIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);

export const AlertIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.134 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
);

export const ZapIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

export const CheckIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const BarChartIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

export const PieChartIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="m12 2a10 10 0 0 1 10 10H12V2z" />
    </svg>
);

// Stat Card Component
interface StatCardProps {
}
    title: string;
    value: string;
    change?: string;
    changeType?: &apos;positive&apos; | &apos;negative&apos; | &apos;neutral&apos;;
    icon: React.ReactNode;
    iconBgColor: string;
    delay?: number;

}

export function StatCard({ 
}
    title, 
    value, 
    change, 
    changeType = &apos;neutral&apos;, 
    icon, 
    iconBgColor, 
    delay = 0 
}: Readonly<StatCardProps>) {
}
    let changeColorClass = &apos;text-gray-600&apos;;
    if (changeType === &apos;positive&apos;) {
}
        changeColorClass = &apos;text-green-600&apos;;
    } else if (changeType === &apos;negative&apos;) {
}
        changeColorClass = &apos;text-red-600&apos;;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white rounded-lg border border-gray-200 p-6 sm:px-4 md:px-6 lg:px-8"
        >
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                <div>
                    <p className="text-sm font-medium text-gray-600 sm:px-4 md:px-6 lg:px-8">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 sm:px-4 md:px-6 lg:px-8">{value}</p>
                </div>
                <div className={`h-12 w-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
            {change && (
}
                <div className="mt-4 sm:px-4 md:px-6 lg:px-8">
                    <span className={`text-sm ${changeColorClass}`}>
                        {change}
                    </span>
                </div>
            )}
        </motion.div>
    );
}

// Simple Progress Bar
interface ProgressBarProps {
}
    value: number;
    max: number;
    color?: string;
    height?: string;

}

export function ProgressBar({ value, max, color = "bg-purple-600", height = "h-2" }: Readonly<ProgressBarProps>) {
}
    const percentage = Math.min((value / max) * 100, 100);
    
    return (
        <div className={`w-full bg-gray-200 rounded-full ${height}`}>
            <div
                className={`${height} ${color} rounded-full transition-all duration-300`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}

// Simple Trend Indicator
interface TrendIndicatorProps {
}
    value: number;
    label: string;
    showIcon?: boolean;

}

export function TrendIndicator({ value, label, showIcon = true }: Readonly<TrendIndicatorProps>) {
}
    const isPositive = value > 0;
    const isNegative = value < 0;
    
    let textColorClass = &apos;text-gray-600&apos;;
    if (isPositive) {
}
        textColorClass = &apos;text-green-600&apos;;
    } else if (isNegative) {
}
        textColorClass = &apos;text-red-600&apos;;
    }

    return (
        <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
            {showIcon && (
}
                <>
                    {isPositive && <TrendingUpIcon className="w-4 h-4 text-green-500 sm:px-4 md:px-6 lg:px-8" />}
                    {isNegative && <TrendingDownIcon className="w-4 h-4 text-red-500 sm:px-4 md:px-6 lg:px-8" />}
                    {!isPositive && !isNegative && <div className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />}
                </>
            )}
            <span className={`text-sm font-medium ${textColorClass}`}>
                {value > 0 ? &apos;+&apos; : &apos;&apos;}{(value * 100).toFixed(1)}%
            </span>
            <span className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">{label}</span>
        </div>
    );
}

// Simple Line Chart (SVG-based)
interface SimpleLineChartProps {
}
    data: { period: string; value: number }[];
    height?: number;
    color?: string;
}

export function SimpleLineChart({ data, height = 200, color = "#8B5CF6" }: Readonly<SimpleLineChartProps>) {
}
    if (!data || data.length === 0) {
}
        return (
            <div className="flex items-center justify-center h-48 text-gray-500 sm:px-4 md:px-6 lg:px-8">
                No data available
            </div>
        );
    }

    const maxValue = Math.max(...data.map((d: any) => d.value));
    const minValue = Math.min(...data.map((d: any) => d.value));
    const range = maxValue - minValue || 1;
    
    const width = 400;
    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);
    
    const points = data.map((d, i) => {
}
        const x = padding + (i / (data.length - 1)) * chartWidth;
        const y = padding + (1 - (d.value - minValue) / range) * chartHeight;
        return `${x},${y}`;
    }).join(&apos; &apos;);

    return (
        <div className="w-full sm:px-4 md:px-6 lg:px-8">
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible sm:px-4 md:px-6 lg:px-8">
                {/* Grid lines */}
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Line */}
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    points={points}
                />
                
                {/* Data points */}
                {data.map((d, i) => {
}
                    const x = padding + (i / (data.length - 1)) * chartWidth;
                    const y = padding + (1 - (d.value - minValue) / range) * chartHeight;
                    return (
                        <circle
                            key={`point-${d.period}-${i}`}
                            cx={x}
                            cy={y}
                            r="4"
                            fill={color}
                            stroke="white"
                            strokeWidth="2"
                        />
                    );
                })}
                
                {/* Labels */}
                {data.map((d, i) => {
}
                    const x = padding + (i / (data.length - 1)) * chartWidth;
                    return (
                        <text
                            key={`label-${d.period}-${i}`}
                            x={x}
                            y={height - 10}
                            textAnchor="middle"
                            className="text-xs fill-gray-600 sm:px-4 md:px-6 lg:px-8"
                        >
                            {d.period}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
}

// Simple Bar Chart
interface SimpleBarChartProps {
}
    data: { label: string; value: number; color?: string }[];
    height?: number;
}

export function SimpleBarChart({ data, height = 200 }: Readonly<SimpleBarChartProps>) {
}
    if (!data || data.length === 0) {
}
        return (
            <div className="flex items-center justify-center h-48 text-gray-500 sm:px-4 md:px-6 lg:px-8">
                No data available
            </div>
        );
    }

    const maxValue = Math.max(...data.map((d: any) => d.value));
    
    return (
        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
            {data.map((item, index) => (
}
                <div key={`bar-${item.label}-${index}`} className="flex items-center space-x-3 sm:px-4 md:px-6 lg:px-8">
                    <div className="w-24 text-sm text-gray-600 text-right sm:px-4 md:px-6 lg:px-8">
                        {item.label}
                    </div>
                    <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex-1 bg-gray-200 rounded-full h-4 sm:px-4 md:px-6 lg:px-8">
                                <div
                                    className={`h-4 rounded-full transition-all duration-500 ${
}
                                        item.color || &apos;bg-purple-600&apos;
                                    }`}
                                    style={{ width: `${(item.value / maxValue) * 100}%` }}
                                />
                            </div>
                            <div className="text-sm font-medium text-gray-900 w-16 text-right sm:px-4 md:px-6 lg:px-8">
                                {(item.value * 100).toFixed(1)}%
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Loading Spinner
export function LoadingSpinner({ size = "h-8 w-8" }: Readonly<{ size?: string }>) {
}
    return (
        <div className={`animate-spin rounded-full ${size} border-b-2 border-purple-600`} />
    );
}

// Error Display
interface ErrorDisplayProps {
}
    error: string;
    onRetry?: () => void;

}

export function ErrorDisplay({ error, onRetry }: Readonly<ErrorDisplayProps>) {
}
    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center space-x-2 text-red-800 sm:px-4 md:px-6 lg:px-8">
                <AlertIcon className="h-5 w-5 sm:px-4 md:px-6 lg:px-8" />
                <span className="font-medium sm:px-4 md:px-6 lg:px-8">Error Loading Analytics</span>
            </div>
            <p className="text-red-600 mt-1 sm:px-4 md:px-6 lg:px-8">{error}</p>
            {onRetry && (
}
                <button
                    onClick={onRetry}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
//                     Retry
                </button>
            )}
        </div>
    );
}
