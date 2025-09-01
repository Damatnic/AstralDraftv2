

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Team, League, Player } from '../../types';
import { players } from '../../data/players';
import { Modal } from '../ui/Modal';
import { CloseIcon } from '../icons/CloseIcon';
import { SearchIcon } from '../icons/SearchIcon';
import { Avatar } from '../ui/Avatar';

interface AddPlayerModalProps {
    league: League;
    team: Team;
    dispatch: React.Dispatch<any>;
    onClose: () => void;
}

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ league, team, dispatch, onClose }: any) => {
    const [search, setSearch] = React.useState('');

    const rosteredPlayerIds = new Set(league.teams.flatMap(t => t.roster.map((p: any) => p.id)));
    const freeAgents = players.filter((p: any) => !rosteredPlayerIds.has(p.id));

    const filteredPlayers = freeAgents.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 100);

    const handleAddPlayer = (player: Player) => {
        dispatch({
            type: 'MANUAL_ADD_PLAYER',
            payload: { leagueId: league.id, teamId: team.id, player }
        });
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `${player.name} added to ${team.name}.`, type: 'SYSTEM' } });
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <motion.div
                className="glass-pane rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col sm:px-4 md:px-6 lg:px-8"
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            >
            >
                <header className="p-4 border-b border-[var(--panel-border)] flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold font-display sm:px-4 md:px-6 lg:px-8">Add Player to {team.name}</h2>
                    <button onClick={onClose} className="mobile-touch-target p-3 rounded-full hover:bg-white/10 sm:px-4 md:px-6 lg:px-8" aria-label="Close modal"><CloseIcon /></button>
                </header>

                <div className="p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <div className="relative sm:px-4 md:px-6 lg:px-8">
                        <input
                            type="text"
                            placeholder="Search free agents..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
//                             autoFocus
                        />
                        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 sm:px-4 md:px-6 lg:px-8" />
                    </div>
                </div>

                <main className="flex-grow p-2 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                    {filteredPlayers.map((player: any) => (
                        <button
                            key={player.id}
                            onClick={() => handleAddPlayer(player)}
                            className="w-full flex items-center justify-between p-2 hover:bg-black/20 rounded-md text-left sm:px-4 md:px-6 lg:px-8"
                        >
                            <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                <Avatar avatar={player.astralIntelligence?.spiritAnimal?.[0] || '🏈'} className="w-8 h-8 text-xl rounded-md sm:px-4 md:px-6 lg:px-8" />
                                <div>
                                    <p className="font-semibold text-sm sm:px-4 md:px-6 lg:px-8">{player.name}</p>
                                    <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{player.position} - {player.team}</p>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">ADD</span>
                        </button>
                    ))}
                </main>
            </motion.div>
        </Modal>
    );
};

const AddPlayerModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <AddPlayerModal {...props} />
  </ErrorBoundary>
);

export default React.memo(AddPlayerModalWithErrorBoundary);
