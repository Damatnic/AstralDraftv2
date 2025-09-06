
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo } from 'react';
import type { DraftPick, Team } from '../../types';
import { players } from '../../data/players';

interface LiveDraftLogProps {
  draftPicks: DraftPick[];
  teams: Team[];
}

const LiveDraftLog: React.FC<LiveDraftLogProps> = ({ draftPicks, teams }: any) => {
    const completedPicks = draftPicks.filter((p: any) => p.playerId).sort((a, b) => b.overall - a.overall);

    return (
        <div className="h-full flex flex-col text-[var(--text-primary)] p-2 sm:px-4 md:px-6 lg:px-8">
             <div className="flex-shrink-0 p-3 text-center border-b border-[var(--panel-border)] mb-2 sm:px-4 md:px-6 lg:px-8">
                <h3 className="font-display text-lg font-bold sm:px-4 md:px-6 lg:px-8">DRAFT LOG</h3>
            </div>
            <div className="flex-grow space-y-2 overflow-y-auto text-xs p-1 sm:px-4 md:px-6 lg:px-8">
                {completedPicks.length === 0 && (
                    <p className="text-center text-sm text-[var(--text-secondary)] p-4 sm:px-4 md:px-6 lg:px-8">The draft is about to begin...</p>
                )}
                {completedPicks.map((pick: any) => {
                    const team = teams.find((t: any) => t.id === pick.teamId);
                    const player = players.find((p: any) => p.id === pick.playerId);

                    return (
                        <div key={pick.overall} className="p-2 bg-white/5 rounded-md sm:px-4 md:px-6 lg:px-8">
                            <span className="text-gray-500 mr-2 sm:px-4 md:px-6 lg:px-8">
                                {pick.round}.{pick.pickInRound.toString().padStart(2, '0')}
                            </span>
                            <span>
                                <span className="font-semibold text-cyan-400 sm:px-4 md:px-6 lg:px-8">{team?.name || 'Unknown Team'}</span> selected <span className="font-bold text-white sm:px-4 md:px-6 lg:px-8">{player?.name || 'Unknown Player'}</span> ({player?.position})
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const LiveDraftLogWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <LiveDraftLog {...props} />
  </ErrorBoundary>
);

export default React.memo(LiveDraftLogWithErrorBoundary);