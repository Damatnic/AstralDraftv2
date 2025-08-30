

import React from 'react';
import { motion } from 'framer-motion';
import type { Player } from '../../types';
import { NewsIcon } from '../icons/NewsIcon';
import { InjuryIcon } from '../icons/InjuryIcon';
import { QueueIcon } from '../icons/QueueIcon';
import { CompareIcon } from '../icons/CompareIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { StarIcon } from '../icons/StarIcon';
import { StarFilledIcon } from '../icons/StarFilledIcon';
import { useAppState } from '../../contexts/AppContext';
import { GemIcon } from '../icons/GemIcon';

interface PlayerCardProps {
  player: Player;
  onSelect: () => void;
  onAddToQueue: () => void;
  onDraft: () => void;
  onNominate: () => void;
  onAddNote: () => void;
  isMyTurn: boolean;
  isNominationTurn: boolean;
  onToggleCompare: () => void;
  isSelectedForCompare: boolean;
  isInQueue: boolean;
}

const positionStyles: Record<string, { border: string; bg: string; glow: string; badge: string }> = {
    QB: {
        border: 'border-l-4 border-red-500',
        bg: 'bg-gradient-to-r from-red-500/10 via-transparent to-transparent',
        glow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]',
        badge: 'bg-gradient-to-r from-red-500 to-red-600'
    },
    RB: {
        border: 'border-l-4 border-emerald-500',
        bg: 'bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent',
        glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]',
        badge: 'bg-gradient-to-r from-emerald-500 to-emerald-600'
    },
    WR: {
        border: 'border-l-4 border-blue-500',
        bg: 'bg-gradient-to-r from-blue-500/10 via-transparent to-transparent',
        glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]',
        badge: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    TE: {
        border: 'border-l-4 border-amber-500',
        bg: 'bg-gradient-to-r from-amber-500/10 via-transparent to-transparent',
        glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]',
        badge: 'bg-gradient-to-r from-amber-500 to-amber-600'
    },
    DST: {
        border: 'border-l-4 border-purple-500',
        bg: 'bg-gradient-to-r from-purple-500/10 via-transparent to-transparent',
        glow: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.3)]',
        badge: 'bg-gradient-to-r from-purple-500 to-purple-600'
    },
    K: {
        border: 'border-l-4 border-pink-500',
        bg: 'bg-gradient-to-r from-pink-500/10 via-transparent to-transparent',
        glow: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]',
        badge: 'bg-gradient-to-r from-pink-500 to-pink-600'
    }
};

const PlayerCard: React.FC<PlayerCardProps> = ({ 
    player, onSelect, onAddToQueue, onDraft, onNominate, onAddNote,
    isMyTurn, isNominationTurn, onToggleCompare, isSelectedForCompare, isInQueue 
}: any) => {
  const { state, dispatch } = useAppState();
  const hasNews = player.newsFeed && player.newsFeed.length > 0;
  const hasInjury = player?.injuryHistory && player?.injuryHistory.length > 0;
  const isOnWatchlist = state.watchlist.includes(player.id);
  const isValuePick = player.rank < (player?.adp ?? 999) - 10;
  
  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent onSelect from firing
    if(isOnWatchlist) {
        dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: player.id });
    } else {
        dispatch({ type: 'ADD_TO_WATCHLIST', payload: player.id });
    }
  };

  const positionStyle = positionStyles[player.position] || positionStyles.WR;
  
  return (
    <motion.div
      className={`
        group relative w-full text-left
        glass-card p-3 sm:p-4
        ${positionStyle.border} ${positionStyle.bg} ${positionStyle.glow}
        ${isSelectedForCompare ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : ''}
        transition-all duration-300 hover:scale-[1.02]
        overflow-hidden
      `}
      {...{
        layout: true,
        initial: { opacity: 0, y: 20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.95 },
        transition: { duration: 0.3, type: 'spring', stiffness: 200, damping: 25 },
      }}
    >
      {/* Premium gradient overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>
        <div className="flex flex-col gap-0.5 sm:gap-1">
            <button
                onClick={handleToggleWatchlist}
                className={`p-1 sm:p-1.5 rounded-md transition-colors mobile-touch-target ${isOnWatchlist ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}
                aria-label={isOnWatchlist ? `Remove ${player.name} from watchlist` : `Add ${player.name} to watchlist`}
            >
                {isOnWatchlist ? <StarFilledIcon className="h-3 w-3 sm:h-4 sm:w-4" /> : <StarIcon className="h-3 w-3 sm:h-4 sm:w-4" />}
            </button>
            <button
                onClick={onToggleCompare}
                className={`p-1 sm:p-1.5 rounded-md transition-colors mobile-touch-target ${isSelectedForCompare ? 'bg-cyan-400/20 text-cyan-300' : 'text-gray-500 hover:text-cyan-400'}`}
                aria-label={`Toggle comparison for ${player.name}`}
            >
                <CompareIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
            <button 
                onClick={onAddNote}
                className="p-1 sm:p-1.5 rounded-md text-gray-500 hover:text-yellow-400 transition-colors mobile-touch-target"
                aria-label={`Add note for ${player.name}`}
            >
                <PencilIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            </button>
        </div>

        <button onClick={onSelect} className="flex-grow flex items-center justify-between overflow-hidden mobile-touch-target">
            <div className="flex-grow overflow-hidden">
                <div className="flex items-center gap-2">
                    <p className="font-bold text-sm sm:text-base text-white truncate">{player.name}</p>
                    {isValuePick && (
                        <div className="flex-shrink-0 flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg shadow-emerald-500/30">
                            <GemIcon /> <span className="hidden sm:inline">VALUE</span>
                        </div>
                    )}
                    {hasNews && (
                        <div className="relative flex-shrink-0">
                            <NewsIcon className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 animate-pulse" />
                            <div className="absolute inset-0 blur-sm bg-cyan-400/50 animate-pulse" />
                        </div>
                    )}
                    {hasInjury && (
                        <div className="relative flex-shrink-0">
                            <InjuryIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 animate-pulse" />
                            <div className="absolute inset-0 blur-sm bg-red-400/50 animate-pulse" />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <span className={`px-2 py-0.5 rounded-md ${positionStyle.badge} text-white font-bold shadow-lg`}>
                        {player.position}
                    </span>
                    <span className="text-gray-400">{player.team}</span>
                </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2 sm:ml-4">
                <div className="relative">
                    <p className="font-bold text-2xl sm:text-3xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        {player.rank}
                    </p>
                    <div className="absolute inset-0 blur-md bg-gradient-to-r from-cyan-400/30 to-blue-400/30 -z-10" />
                </div>
                <div className="space-y-0.5 text-[10px] sm:text-xs">
                    <p className="text-gray-400">
                        <span className="hidden sm:inline">ADP: </span>
                        <span className="font-semibold text-gray-300">{player?.adp ?? 'N/A'}</span>
                    </p>
                    <p className="text-gray-400">
                        <span className="hidden sm:inline">Bye: </span>
                        <span className="font-semibold text-gray-300">{player.bye}</span>
                    </p>
                </div>
            </div>
        </button>

        {(() => {
            if (isNominationTurn) {
                return (
                    <button
                        onClick={onNominate}
                        className="flex-shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md bg-blue-500 text-white font-bold text-[10px] sm:text-xs uppercase shadow-lg hover:bg-blue-400 transition-colors mobile-touch-target"
                        aria-label={`Nominate ${player.name}`}
                    >
                        <span className="hidden sm:inline">Nominate</span>
                        <span className="sm:hidden">Nom</span>
                    </button>
                );
            } else if (isMyTurn) {
                return (
                    <button
                        onClick={onDraft}
                        className="flex-shrink-0 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-md bg-green-500 text-white font-bold text-[10px] sm:text-xs uppercase shadow-lg hover:bg-green-400 transition-colors mobile-touch-target"
                        aria-label={`Draft ${player.name}`}
                    >
                        <span className="hidden sm:inline">Draft</span>
                        <span className="sm:hidden">+</span>
                    </button>
                );
            } else {
                return (
                    <button 
                        onClick={onAddToQueue}
                        className={`flex-shrink-0 p-1.5 sm:p-2 rounded-md bg-transparent hover:bg-cyan-400/20 transition-all mobile-touch-target ${isInQueue ? 'text-cyan-400 opacity-100' : 'text-gray-500 opacity-0 group-hover:opacity-100'}`}
                        aria-label={isInQueue ? "Player is in queue" : "Add to queue"}
                    >
                        <QueueIcon />
                    </button>
                );
            }
        })()}
    </motion.div>
  );
};

export default PlayerCard;