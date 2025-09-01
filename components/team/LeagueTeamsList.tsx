

import React, { useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { League, Team } from '../../types';
import { Widget } from '../ui/Widget';
import ProposeTradeModal from './ProposeTradeModal';
import { ArrowRightLeftIcon } from '../icons/ArrowRightLeftIcon';
import { Tooltip } from '../ui/Tooltip';

interface LeagueTeamsListProps {
    league: League;
    myTeamId: number;
    dispatch: React.Dispatch<any>;


export const LeagueTeamsList: React.FC<LeagueTeamsListProps> = ({ league, myTeamId, dispatch }: any) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedOpponent, setSelectedOpponent] = React.useState<Team | null>(null);

    const myTeam = league.teams.find((t: any) => t.id === myTeamId)!;
    const opponents = league.teams.filter((t: any) => t.id !== myTeamId);

    const isTradeDeadlinePassed = league.currentWeek > league.settings.tradeDeadline;

    const handleProposeTrade = (opponent: Team) => {
        setSelectedOpponent(opponent);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedOpponent(null);
    };

    return (
        <>
            <Widget title="League Teams" icon={<ArrowRightLeftIcon />}>
                <div className="p-3 space-y-2 sm:px-4 md:px-6 lg:px-8">
                    {opponents.map((team: any) => (
                        <div key={team.id} className="flex items-center justify-between p-2 bg-black/10 rounded-md sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                                <span className="text-xl sm:px-4 md:px-6 lg:px-8">{team.avatar}</span>
                                <div>
                                    <p className="font-semibold text-sm sm:px-4 md:px-6 lg:px-8">{team.name}</p>
                                    <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{team.owner.name}</p>
                                </div>
                            </div>
                            <Tooltip content={isTradeDeadlinePassed ? `The trade deadline (Week ${league.settings.tradeDeadline}) has passed.` : `Propose trade to ${team.name}`}>
                                <button 
                                    onClick={() => handleProposeTrade(team)}
                                    className="px-2.5 py-1.5 text-xs font-bold bg-cyan-500/10 text-cyan-300 rounded-md hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed sm:px-4 md:px-6 lg:px-8"
                                >
                                    Propose Trade
                                </button>
                            </Tooltip>
                        </div>
                    ))}
                </div>
            </Widget>
            <AnimatePresence>
                {isModalOpen && selectedOpponent && (
                    <ProposeTradeModal>
                        myTeam={myTeam}
                        otherTeam={selectedOpponent}
                        leagueId={league.id}
                        dispatch={dispatch}
                        onClose={handleCloseModal}
                    />
                )}
            </AnimatePresence>
        </>
    );
};