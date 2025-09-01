
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo } from 'react';
import type { Team, Player } from '../../types';
import { Widget } from '../ui/Widget';
import { InjuryIcon } from '../icons/InjuryIcon';
import { useAppState } from '../../contexts/AppContext';

interface InjuryReportWidgetProps {
    myTeam: Team;

}

const InjuryReportWidget: React.FC<InjuryReportWidgetProps> = ({ myTeam }: any) => {
    const { dispatch } = useAppState();

    const injuredPlayers = myTeam.roster.filter((p: any) => 
        p?.injuryHistory && p?.injuryHistory.length > 0 && p?.injuryHistory[0].status !== 'Active'
    );

    const handlePlayerClick = (player: Player) => {
        dispatch({ type: 'SET_PLAYER_DETAIL', payload: { player, initialTab: 'fantasy' } });
    };

    return (
        <Widget title="Injury Report" icon={<InjuryIcon />}>
            <div className="p-3 sm:px-4 md:px-6 lg:px-8">
                {injuredPlayers.length === 0 ? (
                    <p className="text-center text-xs text-gray-400 py-4 sm:px-4 md:px-6 lg:px-8">Your roster is fully healthy!</p>
                ) : (
                    <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                        {injuredPlayers.map((player: any) => (
                            <button 
                                key={player.id} 
                                onClick={() => handlePlayerClick(player)}
                            >
                                <div>
                                    <p className="font-semibold text-sm sm:px-4 md:px-6 lg:px-8">{player.name}</p>
                                    <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{player?.injuryHistory![0].injury}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                    player?.injuryHistory![0].status === 'Out' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'
                                }`}>
                                    {player?.injuryHistory![0].status}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </Widget>
    );
};

const InjuryReportWidgetWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <InjuryReportWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(InjuryReportWidgetWithErrorBoundary);