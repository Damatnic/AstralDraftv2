

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Player } from '../../types';
import { players } from '../../data/players';
import { findSimilarPlayers } from '../../services/geminiService';
import LoadingSpinner from '../ui/LoadingSpinner';
import { CloseIcon } from '../icons/CloseIcon';
import { Avatar } from '../ui/Avatar';
import { useAppState } from '../../contexts/AppContext';

interface SimilarPlayersPopupProps {
    playerToCompare: Player;
    onClose: () => void;

}

const SimilarPlayersPopup: React.FC<SimilarPlayersPopupProps> = ({ playerToCompare, onClose }) => {
    const [similarPlayerNames, setSimilarPlayerNames] = React.useState<string[] | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const { dispatch } = useAppState();

    React.useEffect(() => {
        const fetchSimilar = async () => {
    try {

            setIsLoading(true);
            const names = await findSimilarPlayers(playerToCompare);
            setSimilarPlayerNames(names);
            setIsLoading(false);

    } catch (error) {
      console.error('Error in fetchSimilar:', error);

  };
        fetchSimilar();
    }, [playerToCompare]);

    const similarPlayers = React.useMemo(() => {
        if (!similarPlayerNames) return [];
        return similarPlayerNames.map((name: any) => players.find((p: any) => p.name === name)).filter(Boolean) as Player[];
    }, [similarPlayerNames]);

    const handlePlayerClick = (player: Player) => {
        dispatch({ type: 'SET_PLAYER_DETAIL', payload: { player } });
        onClose();
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 sm:px-4 md:px-6 lg:px-8"
            onClick={onClose},
                animate: { opacity: 1 },
                exit: { opacity: 0 },
            }}
        >
            <motion.div
                className="glass-pane rounded-xl shadow-2xl w-full max-w-md sm:px-4 md:px-6 lg:px-8"
                onClick={(e: any) => e.stopPropagation()},
                    animate: { opacity: 1, scale: 1 },
                    exit: { opacity: 0, scale: 0.95 },
                }}
            >
                <header className="p-4 border-b border-[var(--panel-border)] flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-lg font-bold font-display sm:px-4 md:px-6 lg:px-8">
                        Players Similar to <span className="text-cyan-300 sm:px-4 md:px-6 lg:px-8">{playerToCompare.name}</span>
                    </h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                        <CloseIcon />
                    </button>
                </header>
                <main className="p-4 min-h-[10rem] sm:px-4 md:px-6 lg:px-8">
                    {isLoading ? <LoadingSpinner text="Consulting the Oracle..." size="sm" /> :
                     similarPlayers.length > 0 ? (
                        <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                            {similarPlayers.map((player: any) => (
                                <button 
                                    key={player.id} 
                                    onClick={() => handlePlayerClick(player)}
                                >
                                    <Avatar avatar={player.astralIntelligence?.spiritAnimal?.split(',')[0] || '🏈'} className="w-10 h-10 text-2xl rounded-md flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />
                                    <div>
                                        <p className="font-bold text-sm text-left sm:px-4 md:px-6 lg:px-8">{player.name}</p>
                                        <p className="text-xs text-gray-400 text-left sm:px-4 md:px-6 lg:px-8">{player.position} - {player.team} | Rank: {player.rank}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                     ) : (
                        <p className="text-center text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Could not find similar players.</p>
                     )

                </main>
            </motion.div>
        </motion.div>
    );
};

const SimilarPlayersPopupWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <SimilarPlayersPopup {...props} />
  </ErrorBoundary>
);

export default React.memo(SimilarPlayersPopupWithErrorBoundary);