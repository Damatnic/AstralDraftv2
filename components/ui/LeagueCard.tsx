
import React from 'react';
import type { League } from '../../types';

interface LeagueCardProps {
    league: League;
    onJoin: () => void;
}

export const LeagueCard: React.FC<LeagueCardProps> = ({ league, onJoin }: LeagueCardProps) => {
    const isPreDraft = league?.status === 'PRE_DRAFT';
    return (
        <div className="p-4 bg-white/5 rounded-lg flex items-center justify-between hover:bg-white/10 transition-colors sm:px-4 md:px-6 lg:px-8" data-testid="leaguecard">
            <div>
                <p className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{league.name}</p>
                <p className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                    {league.settings.teamCount} Teams • {league.settings.draftFormat} • {league.status.replace('_', ' ')}
                </p>
            </div>
            <button onClick={onJoin} className="px-4 py-2 bg-cyan-500 text-black font-bold text-sm rounded-md hover:bg-cyan-400 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                {isPreDraft ? 'Join Lobby' : 'View'}
            </button>
        </div>
    );
};

export default LeagueCard;
