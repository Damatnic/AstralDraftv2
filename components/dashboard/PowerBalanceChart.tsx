
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React from 'react';
import type { League } from '../../types';
import { Widget } from '../ui/Widget';
import { ChartBarIcon } from '../icons/ChartBarIcon';
import { Tooltip } from '../ui/Tooltip';

interface PowerBalanceChartProps {
    leagues: League[];

}

const PowerBalanceChart: React.FC<PowerBalanceChartProps> = ({ leagues }) => {
    const chartData = React.useMemo(() => {
        return leagues.filter((l: any) => !l.isMock).map((league: any) => {
            const myTeam = league.teams.find((t: any) => t.owner.id === 'user_1');
            if (!myTeam) return null;
            
            const totalGames = myTeam.record.wins + myTeam.record.losses + myTeam.record.ties;
            const winPct = totalGames > 0 ? (myTeam.record.wins + myTeam.record.ties * 0.5) / totalGames * 100 : 50;

            return {
                leagueName: league.name,
                winPct,
            };
        }).filter(Boolean) as { leagueName: string, winPct: number }[];
    }, [leagues]);

    return (
        <Widget title="League Power Balance" icon={<ChartBarIcon />}>
            <div className="p-4 h-full flex flex-col justify-center sm:px-4 md:px-6 lg:px-8">
                {chartData.length === 0 ? (
                    <p className="text-center text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Join a league to see your power balance.</p>
                ) : (
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        {chartData.map(({ leagueName, winPct }) => (
                            <div key={leagueName}>
                                <p className="text-xs font-semibold text-gray-300 mb-1 sm:px-4 md:px-6 lg:px-8">{leagueName}</p>
                                <div className="relative w-full h-5 bg-black/20 rounded-full sm:px-4 md:px-6 lg:px-8">
                                    {/* League Average Line */}
                                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-red-500/50 sm:px-4 md:px-6 lg:px-8"></div>
                                    <Tooltip content={`League Average: 50%`}>
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] text-red-400 sm:px-4 md:px-6 lg:px-8">AVG</div>
                                    </Tooltip>
                                    
                                    {/* My Team Bar */}
                                    <Tooltip content={`Your Win Pct: ${winPct.toFixed(0)}%`}>
                                        <div 
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full sm:px-4 md:px-6 lg:px-8"
                                            style={{ width: `${winPct}%`}}
                                        ></div>
                                    </Tooltip>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Widget>
    );
};

const PowerBalanceChartWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <PowerBalanceChart {...props} />
  </ErrorBoundary>
);

export default React.memo(PowerBalanceChartWithErrorBoundary);
