/**
 * Mobile Player Card Component
 * Touch-optimized player cards with swipe actions and condensed information
 */

import React from 'react';
import { motion, PanInfo } from 'framer-motion';
import { Player } from '../../types';
import { 
    StarIcon, 
    TrendingUpIcon, 
    TrendingDownIcon,
    InfoIcon,
    PlusIcon,
    XIcon,
    HeartIcon,
    AlertTriangleIcon
} from 'lucide-react';

interface MobilePlayerCardProps {
    player: Player;
    onAddToQueue?: () => void;
    onRemoveFromQueue?: () => void;
    onViewDetails?: () => void;
    onDraft?: () => void;
    isInQueue?: boolean;
    isDraftable?: boolean;
    showProjection?: boolean;
    showTrends?: boolean;
    isCompact?: boolean;
    swipeActions?: boolean;
    className?: string;
}

interface SwipeAction {
    icon: React.ReactNode;
    color: string;
    label: string;
    action: () => void;
}

const MobilePlayerCard: React.FC<MobilePlayerCardProps> = ({
    player,
    onAddToQueue,
    onRemoveFromQueue,
    onViewDetails,
    onDraft,
    isInQueue = false,
    isDraftable = false,
    showProjection = true,
    showTrends = false,
    isCompact = false,
    swipeActions = true,
    className = ''
}) => {
    const [dragOffset, setDragOffset] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);
    const [activeAction, setActiveAction] = React.useState<SwipeAction | null>(null);

    // Utility functions with proper type safety
    const getPlayerTier = (tier: number | undefined) => {
        if (!tier || typeof tier !== 'number') return { text: 'N/A', color: 'text-gray-400' };
        if (tier <= 1) return { text: 'Elite', color: 'text-yellow-400' };
        if (tier <= 3) return { text: 'Top', color: 'text-green-400' };
        if (tier <= 6) return { text: 'Mid', color: 'text-blue-400' };
        return { text: 'Deep', color: 'text-gray-400' };
    };

    const getTrendIcon = () => {
        // Mock trend data - in real app this would come from player data
        const trend = Math.random() > 0.5 ? 'up' : 'down';
        return trend === 'up' ? 
            <TrendingUpIcon className="w-3 h-3 text-green-400" /> :
            <TrendingDownIcon className="w-3 h-3 text-red-400" />;
    };

    const getInjuryStatusDisplay = (injuryHistory: string | undefined) => {
        if (!injuryHistory || typeof injuryHistory !== 'string') return null;
        
        switch (injuryHistory) {
            case 'minimal':
                return { status: 'Healthy', severity: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' };
            case 'moderate':
                return { status: 'Questionable', severity: 'text-yellow-400', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' };
            case 'extensive':
                return { status: 'Injury Prone', severity: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' };
            default:
                return null;
        }
    };

    const leftSwipeActions: SwipeAction[] = [
        {
            icon: <XIcon className="w-5 h-5" />,
            color: 'bg-red-500',
            label: 'Pass',
            action: () => onRemoveFromQueue?.()
        }
    ];

    const rightSwipeActions: SwipeAction[] = [
        {
            icon: isInQueue ? <HeartIcon className="w-5 h-5 fill-current" /> : <PlusIcon className="w-5 h-5" />,
            color: isInQueue ? 'bg-pink-500' : 'bg-green-500',
            label: isInQueue ? 'Queued' : 'Queue',
            action: () => isInQueue ? onRemoveFromQueue?.() : onAddToQueue?.()
        },
        {
            icon: <InfoIcon className="w-5 h-5" />,
            color: 'bg-blue-500',
            label: 'Details',
            action: () => onViewDetails?.()
        }
    ];

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const offset = info.offset.x;
        setDragOffset(offset);

        // Determine active action based on drag distance
        if (Math.abs(offset) > 60) {
            if (offset < 0) {
                setActiveAction(leftSwipeActions[0] || null);
            } else {
                const actionIndex = Math.min(Math.floor(Math.abs(offset) / 80), rightSwipeActions.length - 1);
                setActiveAction(rightSwipeActions[actionIndex] || null);
            }
        } else {
            setActiveAction(null);
        }
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        setIsDragging(false);
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        // Trigger action if dragged far enough or with sufficient velocity
        if ((Math.abs(offset) > 120) || (Math.abs(velocity) > 500 && Math.abs(offset) > 60)) {
            if (activeAction) {
                activeAction.action();
            }
        }

        // Reset state
        setDragOffset(0);
        setActiveAction(null);
    };

    const getPositionColor = (position: string) => {
        switch (position) {
            case 'QB': return 'text-purple-400 bg-purple-500/20';
            case 'RB': return 'text-green-400 bg-green-500/20';
            case 'WR': return 'text-blue-400 bg-blue-500/20';
            case 'TE': return 'text-orange-400 bg-orange-500/20';
            case 'K': return 'text-yellow-400 bg-yellow-500/20';
            case 'DST': return 'text-red-400 bg-red-500/20';
            default: return 'text-gray-400 bg-gray-500/20';
        }
    };

    const injuryDisplay = getInjuryStatusDisplay(player.injuryHistory);

    return (
        <motion.div
            className={`relative bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg overflow-hidden ${className}`}
            drag={swipeActions ? "x" : false}
            dragConstraints={{ left: -200, right: 200 }}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            animate={{ x: dragOffset }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
        >
            {/* Swipe Action Backgrounds */}
            {swipeActions && (
                <>
                    {/* Left Action Background */}
                    <div className="absolute left-0 top-0 h-full w-20 bg-red-500 flex items-center justify-center">
                        <XIcon className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Right Actions Background */}
                    <div className="absolute right-0 top-0 h-full flex">
                        {rightSwipeActions.map((action, index) => (
                            <div
                                key={index}
                                className={`w-20 h-full ${action.color} flex items-center justify-center ${
                                    activeAction === action ? 'opacity-100' : 'opacity-60'
                                }`}
                            >
                                <div className="text-white">{action.icon}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Main Card Content */}
            <div className="relative bg-[var(--panel-bg)] p-3 min-h-[80px]">
                <div className="flex items-start justify-between">
                    {/* Player Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPositionColor(player.position)}`}>
                                {player.position}
                            </span>
                            <span className="text-xs text-[var(--text-secondary)]">
                                {player.team}
                            </span>
                            {player.rank && (
                                <span className="text-xs text-[var(--text-secondary)]">
                                    #{player.rank}
                                </span>
                            )}
                        </div>
                        
                        <h3 className="font-semibold text-[var(--text-primary)] text-sm truncate mb-1">
                            {player.name}
                        </h3>

                        {/* Stats Row */}
                        <div className="flex items-center gap-4 text-xs">
                            {showProjection && player.stats.projection && (
                                <div>
                                    <div className="text-[var(--text-secondary)]">Proj</div>
                                    <div className="text-sm font-medium text-[var(--text-primary)]">
                                        {player.stats.projection.toFixed(1)}
                                    </div>
                                </div>
                            )}
                            
                            <div>
                                <div className="text-[var(--text-secondary)]">ADP</div>
                                <div className="text-sm font-medium text-[var(--text-primary)]">
                                    {player.adp ? player.adp.toFixed(1) : 'N/A'}
                                </div>
                            </div>
                            
                            {!isCompact && (
                                <>
                                    <div>
                                        <div className="text-[var(--text-secondary)]">VORP</div>
                                        <div className="text-sm font-medium text-[var(--text-primary)]">
                                            {player.stats.vorp.toFixed(1)}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="text-[var(--text-secondary)]">Tier</div>
                                        <div className={`text-sm font-medium ${getPlayerTier(player.tier).color}`}>
                                            {getPlayerTier(player.tier).text}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        {onViewDetails && (
                            <button
                                onClick={onViewDetails}
                                className="p-1.5 rounded-full bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                            >
                                <InfoIcon className="w-4 h-4" />
                            </button>
                        )}
                        
                        {showTrends && (
                            <div className="p-1">
                                {getTrendIcon()}
                            </div>
                        )}
                        
                        {isDraftable && onDraft && (
                            <button
                                onClick={onDraft}
                                className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-xs font-medium"
                            >
                                Draft
                            </button>
                        )}
                        
                        {isInQueue && (
                            <div className="p-1">
                                <HeartIcon className="w-4 h-4 text-pink-400 fill-current" />
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Injury/Status Alert */}
                {injuryDisplay && (
                    <div className={`mt-2 flex items-center gap-2 p-2 ${injuryDisplay.bgColor} border ${injuryDisplay.borderColor} rounded text-xs`}>
                        <AlertTriangleIcon className="w-3 h-3 flex-shrink-0" />
                        <span className={`${injuryDisplay.severity} font-medium`}>
                            {injuryDisplay.status}
                        </span>
                        <span className="text-[var(--text-secondary)]">
                            Injury History: {player.injuryHistory}
                        </span>
                    </div>
                )}
            </div>
            
            {/* Swipe Hints */}
            {swipeActions && !isDragging && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-4 opacity-20">
                    <div className="flex items-center gap-1 text-red-400">
                        <XIcon className="w-3 h-3" />
                        <span className="text-xs">Pass</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                        <span className="text-xs">Queue</span>
                        <PlusIcon className="w-3 h-3" />
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default MobilePlayerCard;