import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Team, League, PlayerAwardType, Player } from '../../types';
import { Modal } from '../ui/Modal';
import { AwardIcon } from '../icons/AwardIcon';

interface AssignAwardsModalProps {
    team: Team;
    league: League;
    dispatch: React.Dispatch<any>;
    onClose: () => void;

}

const awardTypes: { type: PlayerAwardType, label: string, description: string }[] = [
    { type: 'MVP', label: 'Team MVP', description: 'The most valuable player on your squad.' },
    { type: 'DRAFT_GEM', label: 'Draft Gem', description: 'The player who provided the most value relative to their draft position.' },
    { type: 'WAIVER_HERO', label: 'Waiver Wire Hero', description: 'The best player you picked up from the waiver wire.' },
    { type: 'BIGGEST_BUST', label: 'Biggest Bust', description: 'The player who most disappointed relative to their expectations.' },
];

const AssignAwardsModal: React.FC<AssignAwardsModalProps> = ({ team, league, dispatch, onClose }) => {
    const [selectedAwards, setSelectedAwards] = React.useState<Record<PlayerAwardType, number | null>>(() => {
        const initialState: Record<PlayerAwardType, number | null> = {
            MVP: null, DRAFT_GEM: null, WAIVER_HERO: null, BIGGEST_BUST: null
        };
        const currentSeason = new Date().getFullYear();
        (league.playerAwards || []).forEach((award: any) => {
            if (award.awardedByTeamId === team.id && award.season === currentSeason && award.awardType in initialState) {
                initialState[award.awardType as PlayerAwardType] = award.playerId;
            }
        });
        return initialState;
    });

    const handleSelect = (awardType: PlayerAwardType, playerId: string) => {
        setSelectedAwards(prev => ({
            ...prev,
            [awardType]: playerId ? Number(playerId) : null
        }));
    };

    const handleSave = () => {
        const awardsPayload = Object.entries(selectedAwards).map(([awardType, playerId]) => ({
            awardType: awardType as PlayerAwardType,
            playerId,
        }));
        
        dispatch({
            type: 'ASSIGN_PLAYER_AWARDS',
            payload: { leagueId: league.id, teamId: team.id, awards: awardsPayload }
        });
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'Player awards have been saved!', type: 'SYSTEM' } });
        onClose();
    };

    const labelClasses = "block text-sm font-medium text-cyan-300";
    const selectClasses = "w-full bg-black/20 p-2 rounded-md border border-white/10";

    return (
        <Modal isOpen={true} onClose={onClose}>
            <motion.div
                className="glass-pane rounded-xl shadow-2xl w-full max-w-lg sm:px-4 md:px-6 lg:px-8"
                onClick={e => e.stopPropagation()}
                animate={{ opacity: 1, scale: 1 }}
            >
                <header className="p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold font-display flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <AwardIcon /> Assign End of Season Awards
                    </h2>
                </header>
                <main className="p-4 space-y-4 max-h-[60vh] overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                    {awardTypes.map(({ type, label, description }) => (
                        <div key={type}>
                            <label htmlFor={`award-${type}`} className={labelClasses}>{label}</label>
                            <p className="text-xs text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">{description}</p>
                            <select
                                id={`award-${type}`}
                                value={selectedAwards[type] || ''}
                                onChange={e => handleSelect(type, e.target.value)}
                            >
                                <option value="">-- Select a Player --</option>
                                {team.roster.map((player: any) => (
                                    <option key={player.id} value={player.id}>
                                        {player.name} ({player.position})
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </main>
                <footer className="p-4 flex justify-end gap-2 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold bg-transparent border border-transparent hover:border-[var(--panel-border)] rounded-md sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-bold bg-cyan-500 text-black rounded-md sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Save Awards</button>
                </footer>
            </motion.div>
        </Modal>
    );
};

const AssignAwardsModalWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <AssignAwardsModal {...props} />
  </ErrorBoundary>
);

export default React.memo(AssignAwardsModalWithErrorBoundary);