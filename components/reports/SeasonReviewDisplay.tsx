
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo } from 'react';
import type { SeasonReviewData, Team } from '../../types';
import { SparklesIcon } from '../icons/SparklesIcon';
import { ChartBarIcon } from '../icons/ChartBarIcon';

interface SeasonReviewDisplayProps {
    review: SeasonReviewData;
    teams: Team[];


const SuperlativeCard: React.FC<{ superlative: SeasonReviewData['superlatives'][0], team?: Team }> = ({ superlative, team }: any) => (
    <div className="bg-white/5 p-4 rounded-lg sm:px-4 md:px-6 lg:px-8">
        <h4 className="font-bold text-white sm:px-4 md:px-6 lg:px-8">{superlative.title}</h4>
        <p className="text-sm text-yellow-300 font-semibold sm:px-4 md:px-6 lg:px-8">{superlative.teamName}</p>
        <p className="text-xs text-gray-400 mt-1 italic sm:px-4 md:px-6 lg:px-8">"{superlative.rationale}"</p>
    </div>
);

const SeasonReviewDisplay: React.FC<SeasonReviewDisplayProps> = ({ review, teams }: any) => {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-cyan-300 to-indigo-400 sm:px-4 md:px-6 lg:px-8">
                    {review.title}
                </span>
            </h2>

             <div className="max-w-4xl mx-auto space-y-8 sm:px-4 md:px-6 lg:px-8">
                 <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap text-center italic sm:px-4 md:px-6 lg:px-8">
                    "{review.summary}"
                </p>

                <div>
                    <h3 className="font-bold text-lg text-cyan-300 mb-3 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8"><SparklesIcon /> Season Superlatives</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {review.superlatives.map((sup, i) => (
                            <SuperlativeCard key={i} superlative={sup} team={teams.find((t: any) => t.name === sup.teamName)} />
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-lg text-cyan-300 mb-3 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8"><ChartBarIcon /> Final Power Rankings</h3>
                    <div className="bg-black/10 rounded-lg p-2 space-y-1 sm:px-4 md:px-6 lg:px-8">
                        {review.finalPowerRanking.map((ranking: any) => {
                             const team = teams.find((t: any) => t.name === ranking.teamName);
                             return (
                                <div key={ranking.rank} className="flex items-center gap-4 p-1.5 rounded-md sm:px-4 md:px-6 lg:px-8">
                                    <span className="font-display font-bold text-xl w-8 text-center text-cyan-400 sm:px-4 md:px-6 lg:px-8">{ranking.rank}</span>
                                    <span className="text-2xl sm:px-4 md:px-6 lg:px-8">{team?.avatar}</span>
                                    <span className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">{ranking.teamName}</span>
                                </div>
                             )
                        })}
                    </div>
                </div>
             </div>
        </div>
    );
};

const SeasonReviewDisplayWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <SeasonReviewDisplay {...props} />
  </ErrorBoundary>
);

export default React.memo(SeasonReviewDisplayWithErrorBoundary);