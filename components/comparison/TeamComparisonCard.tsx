
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo } from 'react';
import type { Team } from '../../types';
import { Widget } from '../ui/Widget';
import { Avatar } from '../ui/Avatar';
import { CheckIcon } from '../icons/CheckIcon';
import { XCircleIcon } from '../icons/XCircleIcon';

interface TeamComparisonCardProps {
    team: Team;
    strengths?: string[];
    weaknesses?: string[];
}

const TeamComparisonCard: React.FC<TeamComparisonCardProps> = ({ team, strengths, weaknesses }: any) => {
    return (
        <Widget title={team.name} icon={<Avatar avatar={team.avatar} className="w-6 h-6 rounded-md sm:px-4 md:px-6 lg:px-8" />}>
            <div className="p-2 space-y-4 h-full overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                <div>
                    <h4 className="font-bold text-sm text-green-400 mb-1 sm:px-4 md:px-6 lg:px-8">Strengths</h4>
                    {strengths ? (
                        <ul className="space-y-1 text-xs list-inside sm:px-4 md:px-6 lg:px-8">
                           {strengths.map((s, i) => <li key={i} className="flex items-start gap-1 sm:px-4 md:px-6 lg:px-8"><CheckIcon/> {s}</li>)}
                        </ul>
                    ) : (
                        <div className="h-10 animate-pulse bg-slate-700/50 rounded-md sm:px-4 md:px-6 lg:px-8"></div>
                    )}
                </div>
                 <div>
                    <h4 className="font-bold text-sm text-red-400 mb-1 sm:px-4 md:px-6 lg:px-8">Weaknesses</h4>
                    {weaknesses ? (
                        <ul className="space-y-1 text-xs list-inside sm:px-4 md:px-6 lg:px-8">
                            {weaknesses.map((w, i) => <li key={i} className="flex items-start gap-1 sm:px-4 md:px-6 lg:px-8"><XCircleIcon/> {w}</li>)}
                        </ul>
                    ) : (
                        <div className="h-10 animate-pulse bg-slate-700/50 rounded-md sm:px-4 md:px-6 lg:px-8"></div>
                    )}
                </div>
                 <div>
                    <h4 className="font-bold text-sm text-cyan-400 mb-1 sm:px-4 md:px-6 lg:px-8">Full Roster</h4>
                    <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                        {team.roster.map((player: any) => (
                            <div key={player.id} className="p-1.5 bg-black/20 rounded-md text-xs sm:px-4 md:px-6 lg:px-8">
                                <span className="font-semibold sm:px-4 md:px-6 lg:px-8">{player.name}</span>
                                <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8"> ({player.position})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Widget>
    );
};

const TeamComparisonCardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TeamComparisonCard {...props} />
  </ErrorBoundary>
);

export default React.memo(TeamComparisonCardWithErrorBoundary);
