import { useAppState } from &apos;../contexts/AppContext&apos;;
import { useLeague } from &apos;../hooks/useLeague&apos;;
import { Widget } from &apos;../components/ui/Widget&apos;;
import ErrorDisplay from &apos;../components/core/ErrorDisplay&apos;;
import { AwardIcon } from &apos;../components/icons/AwardIcon&apos;;
import { Avatar } from &apos;../components/ui/Avatar&apos;;
import { motion } from &apos;framer-motion&apos;;
import { TrophyIcon } from &apos;../components/icons/TrophyIcon&apos;;
import type { LeagueHistoryEntry, LeagueAward, Team } from &apos;../types&apos;;
import { ArrowRightLeftIcon } from &apos;../components/icons/ArrowRightLeftIcon&apos;;
import { ZapIcon } from &apos;../components/icons/ZapIcon&apos;;
import { FlameIcon } from &apos;../components/icons/FlameIcon&apos;;

const awardConfig: Record<LeagueAward[&apos;type&apos;], { icon: React.ReactNode, color: string, label: string }> = {
}
    HIGHEST_SCORE: { icon: <FlameIcon />, color: &apos;text-orange-400&apos;, label: &apos;Highest Weekly Score&apos; },
    BEST_RECORD: { icon: <AwardIcon />, color: &apos;text-green-400&apos;, label: &apos;Best Regular Season Record&apos; },
    BEST_TRADE: { icon: <ArrowRightLeftIcon />, color: &apos;text-purple-400&apos;, label: &apos;Trade of the Year&apos; },
    CLOSEST_MATCHUP: { icon: <ZapIcon />, color: &apos;text-blue-400&apos;, label: &apos;Closest Matchup&apos; },
};

const AwardCard: React.FC<{ award: LeagueAward, team: Team | undefined }> = ({ award, team }: any) => {
}
    const config = awardConfig[award.type];
    if (!config) return null;

    return (
        <div className="bg-white/5 p-3 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
                <span className={config.color}>{config.icon}</span>
                <h4 className="font-bold text-sm text-white">{config.label}</h4>
            </div>
            <p className="text-xs text-gray-300">
                <span className="font-semibold text-yellow-300">{team?.name || &apos;Unknown&apos;}</span> - {award.details}
            </p>
        </div>
    );
};

const SeasonTrophies: React.FC<{ history: LeagueHistoryEntry, teams: Team[], index: number }> = ({ history, teams, index }: any) => {
}
    const champion = teams.find((t: any) => t.id === history.championTeamId);
    
    return (
        <motion.div
            {...{
}
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: index * 0.15 },
            }}
        >
            <Widget title={`${history.season} Season`}>
                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 bg-gradient-to-br from-yellow-800/30 to-yellow-900/40 rounded-lg p-4 text-center flex flex-col items-center justify-center">
                        <TrophyIcon className="w-16 h-16 text-yellow-300" />
                        <h3 className="font-display font-bold text-xl text-yellow-300 mt-2">LEAGUE CHAMPION</h3>
                        {champion && (
}
                            <>
                                <Avatar avatar={champion.avatar} className="w-20 h-20 text-5xl rounded-full my-3 ring-4 ring-yellow-400/50" />
                                <p className="font-bold text-lg">{champion.name}</p>
                            </>
                        )}
                    </div>
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(history.leagueAwards || []).map((award: any) => (
}
                            <AwardCard key={award.id} award={award} team={teams.find((t: any) => t.id === award.teamId)} />
                        ))}
                    </div>
                </div>
            </Widget>
        </motion.div>
    );
};

const TrophyRoomView: React.FC = () => {
}
    const { dispatch } = useAppState();
    const { league } = useLeague();
    
    if (!league) {
}
        return <ErrorDisplay title="Error" message="Please select a league to view the trophy room." onRetry={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; })} />;

    const pastSeasons = (league.history || []).sort((a, b) => b.season - a.season);

    return (
        <div className="w-full h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <header className="flex-shrink-0 flex justify-between items-center mb-6">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wider uppercase text-[var(--text-primary)]">
                        Trophy Room
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] tracking-widest">{league.name}</p>
                </div>
                <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;LEAGUE_HUB&apos; }) className="back-btn">
                    Back to League Hub
                </button>
            </header>
            <main className="flex-grow space-y-6">
                {pastSeasons.length > 0 ? (
}
                    pastSeasons.map((season, index) => (
                        <SeasonTrophies key={season.season} history={season} teams={league.teams} index={index} />
                    ))
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-lg text-gray-500">The trophy case is empty. A champion will be crowned soon!</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TrophyRoomView;