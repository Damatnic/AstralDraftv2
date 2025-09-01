import { useAppState } from &apos;../contexts/AppContext&apos;;
import { Widget } from &apos;../components/ui/Widget&apos;;
import VisualRoster from &apos;../components/team/VisualRoster&apos;;
import type { League, Team, TradeSuggestion } from &apos;../types&apos;;
import { TradeCenterWidget } from &apos;../components/team/TradeCenterWidget&apos;;
import { LeagueTeamsList } from &apos;../components/team/LeagueTeamsList&apos;;
import { DailyBriefingWidget } from &apos;../components/team/DailyBriefingWidget&apos;;
import CurrentMatchupWidget from &apos;../components/team/CurrentMatchupWidget&apos;;
import TeamChemistryWidget from &apos;../components/team/TeamChemistryWidget&apos;;
import SeasonOutlookWidget from &apos;../components/team/SeasonOutlookWidget&apos;;
import { AnimatePresence } from &apos;framer-motion&apos;;
import EditHeaderModal from &apos;../components/team/EditHeaderModal&apos;;
import { ImageIcon } from &apos;../components/icons/ImageIcon&apos;;
import TrophyCaseWidget from &apos;../components/team/TrophyCaseWidget&apos;;
import { useLeague } from &apos;../hooks/useLeague&apos;;
import InjuryReportWidget from &apos;../components/team/InjuryReportWidget&apos;;
import AiCoManagerWidget from &apos;../components/team/AiCoManagerWidget&apos;;
import ChampionshipOddsWidget from &apos;../components/team/ChampionshipOddsWidget&apos;;
import EditTeamBrandingModal from &apos;../components/modals/EditTeamBrandingModal&apos;;
import { MusicIcon } from &apos;../components/icons/MusicIcon&apos;;
import FuturePicksWidget from &apos;../components/team/FuturePicksWidget&apos;;
import { TvIcon } from &apos;../components/icons/TvIcon&apos;;
import { Share2Icon } from &apos;../components/icons/Share2Icon&apos;;
import ShareTeamCardModal from &apos;../components/modals/ShareTeamCardModal&apos;;
import { MascotWidget } from &apos;../components/team/MascotWidget&apos;;
import TradeWhispererWidget from &apos;../components/team/TradeWhispererWidget&apos;;
import { AwardIcon } from &apos;../components/icons/AwardIcon&apos;;
import AssignAwardsModal from &apos;../components/modals/AssignAwardsModal&apos;;
import { UsersIcon } from &apos;../components/icons/UsersIcon&apos;;
import ProposeTradeModal from &apos;../components/team/ProposeTradeModal&apos;;
import { useResponsiveBreakpoint } from &apos;../utils/mobileOptimizationUtils&apos;;

const TeamHubContent: React.FC<{ league: League; team: Team; dispatch: React.Dispatch<any> }> = ({ league, team, dispatch }: any) => {
}
    const { isMobile } = useResponsiveBreakpoint();
    const isWaiversActive = league.status === &apos;DRAFT_COMPLETE&apos; || league.status === &apos;IN_SEASON&apos; || league.status === &apos;PLAYOFFS&apos;;
    const isSeasonStarted = league.status === &apos;IN_SEASON&apos; || league.status === &apos;PLAYOFFS&apos; || league.status === &apos;COMPLETE&apos;;
    const isDraftComplete = league.status !== &apos;PRE_DRAFT&apos; && league.status !== &apos;DRAFTING&apos;;
    const isPlayoffs = league.status === &apos;PLAYOFFS&apos; || league.status === &apos;COMPLETE&apos;;
    const isInSeason = league.status === &apos;IN_SEASON&apos; || league.status === &apos;PLAYOFFS&apos;;
    const isSeasonComplete = league.status === &apos;COMPLETE&apos;;
    const isKeeperLeague = (league.settings.keeperCount || 0) > 0;
    const isPreDraft = league.status === &apos;PRE_DRAFT&apos;;
    const isFullAiEnabled = league.settings.aiAssistanceLevel === &apos;FULL&apos;;

    const [isEditHeaderModalOpen, setIsEditHeaderModalOpen] = React.useState(false);
    const [isBrandingModalOpen, setIsBrandingModalOpen] = React.useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
    const [isAwardsModalOpen, setIsAwardsModalOpen] = React.useState(false);
    const [isProposeTradeModalOpen, setIsProposeTradeModalOpen] = React.useState(false);
    const [tradeSuggestion, setTradeSuggestion] = React.useState<TradeSuggestion | null>(null);
    const [tradeOpponent, setTradeOpponent] = React.useState<Team | null>(null);
    const audioRef = React.useRef<HTMLAudioElement>(null);
    
    const headerStyle = team.headerImage ? { backgroundImage: `url(${team.headerImage})` } : {};
    
    const playThemeSong = () => {
}
        if (audioRef.current) {
}

    };
    
    const handleProposeFromWhisperer = (suggestion: TradeSuggestion) => {
}
        const opponent = league.teams.find((t: any) => t.id === suggestion.toTeamId);
        if (opponent) {
}
            setTradeSuggestion(suggestion);
            setTradeOpponent(opponent);
            setIsProposeTradeModalOpen(true);

    };

    return (
        <div className="w-full h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <header 
                className={`flex-shrink-0 flex flex-col justify-between mb-6 p-4 rounded-xl relative bg-cover bg-center bg-no-repeat bg-gradient-to-t from-black/50 to-transparent`}
                style={headerStyle}
            >
                <div className="bg-black/40 p-2 rounded-lg mb-4">
                    <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-wider uppercase text-[var(--text-primary)]">
                        {team.name}
                    </h1>
                     {team.motto && <p className="text-sm italic text-cyan-200/80 mt-1">&quot;{team.motto}&quot;</p>}
                    <p className="text-sm text-[var(--text-secondary)] tracking-widest">TEAM HUB • WEEK {league.currentWeek > 16 ? &apos;Post-Season&apos; : league.currentWeek}</p>
                </div>
                 <button onClick={() => setIsEditHeaderModalOpen(true)}
                    <ImageIcon /> {!isMobile && &apos;Edit Header&apos;}
                </button>
                <div className={`${isMobile ? &apos;grid grid-cols-2 sm:grid-cols-3 gap-2&apos; : &apos;flex gap-2 flex-wrap justify-end&apos;}`}>
                    {isKeeperLeague && isPreDraft && (
}
                         <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;KEEPER_SELECTION&apos; }) 
                                 className="px-4 py-2 bg-yellow-500/80 text-white rounded-lg text-sm hover:bg-yellow-500 backdrop-blur-sm flex items-center gap-2 min-h-[44px] justify-center">
                            <UsersIcon /> {!isMobile && &apos;Select Keepers&apos;}
                        </button>
                    )}
                    <button onClick={() => setIsBrandingModalOpen(true)}
                    </button>
                    <button onClick={() => setIsShareModalOpen(true)}
                        <Share2Icon /> {!isMobile && &apos;Share Team Card&apos;}
                    </button>
                     {team.themeSongUrl && 
}
                        <button onClick={playThemeSong}
                            <MusicIcon /> {!isMobile && &apos;Play Anthem&apos;}
                        </button>

                     {isInSeason && (
}
                        <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;GAMEDAY_HOST&apos; }) 
                                className="px-4 py-2 bg-red-500/80 text-white rounded-lg text-sm hover:bg-red-500 backdrop-blur-sm flex items-center gap-2 min-h-[44px] justify-center">
                           <TvIcon /> {!isMobile && &apos;Gameday Host&apos;}
                        </button>
                     )}
                     {isSeasonComplete && (
}
                         <button onClick={() => setIsAwardsModalOpen(true)}
                            <AwardIcon /> {!isMobile && &apos;Assign Season Awards&apos;}
                        </button>
                     )}
                     {league.status === &apos;COMPLETE&apos; && (
}
                         <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;SEASON_STORY&apos; }) 
                                 className="px-4 py-2 bg-purple-500/80 text-white rounded-lg text-sm hover:bg-purple-500 backdrop-blur-sm min-h-[44px]">
                            {isMobile ? &apos;Story&apos; : &apos;View My Season Story&apos;}
                        </button>
                     )}
                     {isWaiversActive && (
}
                         <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;WAIVER_WIRE&apos; }) 
                                 className="px-4 py-2 bg-black/50 rounded-lg text-sm hover:bg-black/70 backdrop-blur-sm min-h-[44px]">
                            {isMobile ? &apos;Waivers&apos; : &apos;Waiver Wire&apos;}
                        </button>
                    )}
                    {isSeasonStarted && (
}
                        <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;WEEKLY_REPORT&apos; }) 
                                className="px-4 py-2 bg-black/50 rounded-lg text-sm hover:bg-black/70 backdrop-blur-sm min-h-[44px]">
                            {isMobile ? &apos;Report&apos; : &apos;Weekly Report&apos;}
                        </button>
                    )}
                     {isSeasonStarted && (
}
                        <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;PERFORMANCE_TRENDS&apos; }) 
                                className="px-4 py-2 bg-black/50 rounded-lg text-sm hover:bg-black/70 backdrop-blur-sm min-h-[44px]">
//                             Performance
                        </button>
                     )}
                    {isSeasonStarted && (
}
                        <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;POWER_RANKINGS&apos; }) 
                                className="px-4 py-2 bg-black/50 rounded-lg text-sm hover:bg-black/70 backdrop-blur-sm min-h-[44px]">
                            {isMobile ? &apos;Rankings&apos; : &apos;Power Rankings&apos;}
                        </button>
                    )}
                    {isPlayoffs && (
}
                         <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;PLAYOFF_BRACKET&apos; }) 
                                 className="px-4 py-2 bg-black/50 rounded-lg text-sm hover:bg-black/70 backdrop-blur-sm min-h-[44px]">
                            {isMobile ? &apos;Playoffs&apos; : &apos;Playoff Bracket&apos;}
                        </button>
                    )}
                    <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;ANALYTICS_HUB&apos; }) 
                            className="px-4 py-2 bg-black/50 rounded-lg text-sm hover:bg-black/70 backdrop-blur-sm min-h-[44px]">
//                         Analytics
                    </button>
                    <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;LEAGUE_STANDINGS&apos; }) 
                            className="px-4 py-2 bg-black/50 rounded-lg text-sm hover:bg-black/70 backdrop-blur-sm min-h-[44px]">
//                         Standings
                    </button>
                    <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; }) 
                            className="px-4 py-2 bg-black/50 rounded-lg text-sm hover:bg-black/70 backdrop-blur-sm min-h-[44px]">
//                         Dashboard
                    </button>
                </div>
            </header>
            <main className={`flex-grow grid ${isMobile ? &apos;grid-cols-1 gap-4&apos; : &apos;grid-cols-1 lg:grid-cols-5&apos;} gap-6`}>
                <div className={isMobile ? &apos;&apos; : &apos;lg:col-span-3&apos;}>
                    <Widget title="My Roster">
                        <VisualRoster team={team} />
                    </Widget>
                </div>
                <div className={`${isMobile ? &apos;space-y-4&apos; : &apos;lg:col-span-2 space-y-6&apos;}`}>
                    {isInSeason && <CurrentMatchupWidget myTeam={team} league={league} dispatch={dispatch} />}
                    {isFullAiEnabled && <TradeWhispererWidget onPropose={handleProposeFromWhisperer} />}
                    {isFullAiEnabled && isInSeason && <ChampionshipOddsWidget team={team} league={league} dispatch={dispatch} />}
                    {isFullAiEnabled && isDraftComplete && <SeasonOutlookWidget league={league} myTeam={team} dispatch={dispatch} />}
                    <MascotWidget team={team} league={league} dispatch={dispatch} />
                    {isFullAiEnabled && isInSeason && <DailyBriefingWidget league={league} myTeam={team} dispatch={dispatch} />}
                    {isFullAiEnabled && isInSeason && <AiCoManagerWidget team={team} league={league} dispatch={dispatch} />}
                    {isInSeason && <InjuryReportWidget myTeam={team} />}
                    {isFullAiEnabled && <TeamChemistryWidget league={league} myTeam={team} dispatch={dispatch} />}
                    <FuturePicksWidget team={team} />
                    <TrophyCaseWidget team={team} league={league} />
                    <LeagueTeamsList league={league} myTeamId={team.id} dispatch={dispatch} />
                    <TradeCenterWidget league={league} team={team} dispatch={dispatch} />
                </div>
            </main>
            <AnimatePresence>
                {isEditHeaderModalOpen && (
}
                    <EditHeaderModal>
                        leagueId={league.id}
                        teamId={team.id}
                        currentHeader={team.headerImage}
                        dispatch={dispatch}
                        onClose={() => setIsEditHeaderModalOpen(false)}
                    />
                )}
                 {isBrandingModalOpen && (
}
                    <EditTeamBrandingModal>
                        team={team}
                        leagueId={league.id}
                        dispatch={dispatch}
                        onClose={() => setIsBrandingModalOpen(false)}
                    />
                )}
                 {isShareModalOpen && (
}
                    <ShareTeamCardModal>
                        team={team}
                        onClose={() => setIsShareModalOpen(false)}
                    />
                )}
                {isAwardsModalOpen && (
}
                    <AssignAwardsModal>
                        team={team}
                        league={league}
                        dispatch={dispatch}
                        onClose={() => setIsAwardsModalOpen(false)}
                    />
                )}
                {isProposeTradeModalOpen && tradeOpponent && (
}
                    <ProposeTradeModal>
                        myTeam={team}
                        otherTeam={tradeOpponent}
                        leagueId={league.id}
                        dispatch={dispatch}
                        onClose={() => setIsProposeTradeModalOpen(false)}
                        initialOffer={tradeSuggestion || undefined}
                    />
                )}
            </AnimatePresence>
            {team.themeSongUrl && <audio ref={audioRef} src={team.themeSongUrl} />}
        </div>
    );
};

export const TeamHubView: React.FC = () => {
}
    const { dispatch } = useAppState();
    const { league, myTeam } = useLeague();

    return (
        <div className="w-full h-full">
            {(!myTeam || !league) ? (
}
                <div className="w-full h-full flex items-center justify-center">
                    <p>Team or League not found.</p>
                    <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; }) className="btn btn-primary ml-4">
                        Back to Dashboard
                    </button>
                </div>
            ) : (
                <TeamHubContent league={league} team={myTeam} dispatch={dispatch} />
            )}
        </div>
    );
};

