

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React from 'react';
import type { PowerRanking, Team } from '../../types';
import { motion } from 'framer-motion';
import { ArrowUpIcon } from '../icons/ArrowUpIcon';
import { ArrowDownIcon } from '../icons/ArrowDownIcon';
import { MinusIcon } from '../icons/MinusIcon';
import { Avatar } from '../ui/Avatar';

interface PowerRankingCardProps {
    ranking: PowerRanking;
    team?: Team;
    isMyTeam?: boolean;

}

const TrendIcon: React.FC<{ trend: PowerRanking['trend'] }> = ({ trend }: any) => {
    switch (trend) {
        case 'up': return <ArrowUpIcon className="h-5 w-5 text-green-400 sm:px-4 md:px-6 lg:px-8" />;
        case 'down': return <ArrowDownIcon className="h-5 w-5 text-red-400 sm:px-4 md:px-6 lg:px-8" />;
        case 'same': return <MinusIcon className="h-5 w-5 text-gray-500 sm:px-4 md:px-6 lg:px-8" />;
        default: return null;
    }
};

const PowerRankingCard: React.FC<PowerRankingCardProps> = ({ ranking, team, isMyTeam }: any) => {
    if (!team) return null;

    return (
        <motion.div
            className={`p-4 bg-white/5 rounded-lg flex gap-4 transition-all ${isMyTeam ? 'ring-2 ring-cyan-400 bg-cyan-500/10' : ''}`}
            {...{
                layout: true,
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0 },
            }}
        >
            <div className="flex flex-col items-center flex-shrink-0 sm:px-4 md:px-6 lg:px-8">
                <span className="font-display font-bold text-4xl text-cyan-300 sm:px-4 md:px-6 lg:px-8">{ranking.rank}</span>
                <TrendIcon trend={ranking.trend} />
            </div>
            <div className="flex-grow sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                    <Avatar avatar={team.avatar} className="w-10 h-10 text-2xl rounded-lg sm:px-4 md:px-6 lg:px-8" />
                    <div>
                        <p className="font-bold text-white sm:px-4 md:px-6 lg:px-8">{team.name}</p>
                        <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">
                           ({team.record.wins}-{team.record.losses}{team.record.ties > 0 ? `-${team.record.ties}`: ''})
                        </p>
                    </div>
                </div>
                <p className="text-xs text-gray-300 mt-2 italic sm:px-4 md:px-6 lg:px-8">
                    "{ranking.justification}"
                </p>
            </div>
        </motion.div>
    );
};

const PowerRankingCardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <PowerRankingCard {...props} />
  </ErrorBoundary>
);

export default React.memo(PowerRankingCardWithErrorBoundary);