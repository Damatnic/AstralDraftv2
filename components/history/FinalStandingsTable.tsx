
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo } from 'react';
import type { LeagueHistoryEntry, Team } from '../../types';
import { Avatar } from '../ui/Avatar';

interface FinalStandingsTableProps {
    standings: LeagueHistoryEntry['finalStandings'];
    teams: Team[];

}

const FinalStandingsTable: React.FC<FinalStandingsTableProps> = ({ standings, teams }) => {
    return (
        <div className="p-2 sm:px-4 md:px-6 lg:px-8">
            <table className="w-full text-sm text-left sm:px-4 md:px-6 lg:px-8">
                <thead className="bg-black/10 sm:px-4 md:px-6 lg:px-8">
                    <tr>
                        <th className="p-3 sm:px-4 md:px-6 lg:px-8">Rank</th>
                        <th className="p-3 sm:px-4 md:px-6 lg:px-8">Team</th>
                        <th className="p-3 text-center sm:px-4 md:px-6 lg:px-8">Record</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((entry: any) => {
                        const team = teams.find((t: any) => t.id === entry.teamId);
                        if (!team) return null;

                        return (
                            <tr key={entry.teamId} className="border-t border-white/5 sm:px-4 md:px-6 lg:px-8">
                                <td className="p-3 font-bold text-cyan-400 sm:px-4 md:px-6 lg:px-8">{entry.rank}</td>
                                <td className="p-3 sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                        <Avatar avatar={team.avatar} className="w-8 h-8 text-xl rounded-md sm:px-4 md:px-6 lg:px-8" />
                                        <div>
                                            <p className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">{team.name}</p>
                                            <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{team.owner.name}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 font-mono text-center sm:px-4 md:px-6 lg:px-8">
                                    {entry.record.wins}-{entry.record.losses}-{entry.record.ties}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

const FinalStandingsTableWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <FinalStandingsTable {...props} />
  </ErrorBoundary>
);

export default React.memo(FinalStandingsTableWithErrorBoundary);
