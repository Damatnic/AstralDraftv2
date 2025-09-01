

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import type { PowerRanking, Team } from &apos;../../types&apos;;
import { motion } from &apos;framer-motion&apos;;
import { ArrowUpIcon } from &apos;../icons/ArrowUpIcon&apos;;
import { ArrowDownIcon } from &apos;../icons/ArrowDownIcon&apos;;
import { MinusIcon } from &apos;../icons/MinusIcon&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;

interface PowerRankingCardProps {
}
    ranking: PowerRanking;
    team?: Team;
    isMyTeam?: boolean;

}

const TrendIcon: React.FC<{ trend: PowerRanking[&apos;trend&apos;] }> = ({ trend }: any) => {
}
    switch (trend) {
}
        case &apos;up&apos;: return <ArrowUpIcon className="h-5 w-5 text-green-400 sm:px-4 md:px-6 lg:px-8" />;
        case &apos;down&apos;: return <ArrowDownIcon className="h-5 w-5 text-red-400 sm:px-4 md:px-6 lg:px-8" />;
        case &apos;same&apos;: return <MinusIcon className="h-5 w-5 text-gray-500 sm:px-4 md:px-6 lg:px-8" />;
        default: return null;
    }
};

const PowerRankingCard: React.FC<PowerRankingCardProps> = ({ ranking, team, isMyTeam }: any) => {
}
    if (!team) return null;

    return (
        <motion.div
            className={`p-4 bg-white/5 rounded-lg flex gap-4 transition-all ${isMyTeam ? &apos;ring-2 ring-cyan-400 bg-cyan-500/10&apos; : &apos;&apos;}`}
            {...{
}
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
                           ({team.record.wins}-{team.record.losses}{team.record.ties > 0 ? `-${team.record.ties}`: &apos;&apos;})
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