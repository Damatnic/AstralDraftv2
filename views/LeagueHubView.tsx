
import React from 'react';
import { useAppState } from '../contexts/AppContext';
import { Widget } from '../components/ui/Widget';
import ChatPanel from '../components/chat/ChatPanel';
import { UserIcon } from '../components/icons/UserIcon';
import { SettingsIcon } from '../components/icons/SettingsIcon';
import type { League, User } from '../types';
import { BookOpenIcon } from '../components/icons/BookOpenIcon';
import { MaskIcon } from '../components/icons/MaskIcon';
import { generateAiChatMessage, generateLeagueSlogan } from '../services/geminiService';
import { Avatar } from '../components/ui/Avatar';
import { GavelIcon } from '../components/icons/GavelIcon';
import { useLeague } from '../hooks/useLeague';
import { BrainCircuitIcon } from '../components/icons/BrainCircuitIcon';
import AnnouncementsWidget from '../components/hub/AnnouncementsWidget';
import WeeklyPollWidget from '../components/hub/WeeklyPollWidget';
import RivalryWidget from '../components/hub/RivalryWidget';
import { ChartBarIcon } from '../components/icons/ChartBarIcon';
import { AwardIcon } from '../components/icons/AwardIcon';
import { NewspaperIcon } from '../components/icons/NewspaperIcon';
import SideBetsWidget from '../components/hub/SideBetsWidget';

const LeagueHubContent: React.FC<{ league: League; user: User; dispatch: React.Dispatch<any> }> = ({ league, user, dispatch }: any) => {
    const isCommissioner = user.id === league.commissionerId;
    const isSeasonStarted = league.status === 'IN_SEASON' || league.status === 'PLAYOFFS';
    const isDraftComplete = league.status === 'DRAFT_COMPLETE';
    const isPreDraft = league.status === 'PRE_DRAFT';
    const isHistoryAvailable = league.history && league.history.length > 0;
    const [slogan, setSlogan] = React.useState<string | null>(null);

    const prevWeekRef = React.useRef(league.currentWeek);
    
    React.useEffect(() => {
        generateLeagueSlogan(league.name, league.teams.map((t: any) => t.name)).then(setSlogan);
    }, [league.name, league.teams]);

    React.useEffect(() => {
        if (league.currentWeek > prevWeekRef.current) {
            const justCompletedWeek = league.currentWeek - 1;
            const matchups = league.schedule.filter((m: any) => m.week === justCompletedWeek);

            matchups.forEach((matchup: any) => {
                const teamA = league.teams.find((t: any) => t.id === matchup.teamA.teamId);
                const teamB = league.teams.find((t: any) => t.id === matchup.teamB.teamId);

                if (teamA && teamB) {
                    if (teamA.owner.persona) {
                        generateAiChatMessage(teamA, teamB, matchup.teamA.score, matchup.teamB.score).then(text => {
                            if (text) {
                                dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { leagueId: league.id, message: { user: teamA.owner, text } } });
                            }
                        });
                    }
                    if (teamB.owner.persona) {
                        generateAiChatMessage(teamB, teamA, matchup.teamB.score, matchup.teamA.score).then(text => {
                            if (text) {
                                dispatch({ type: 'ADD_CHAT_MESSAGE', payload: { leagueId: league.id, message: { user: teamB.owner, text } } });
                            }
                        });
                    }
                }
            });
            prevWeekRef.current = league.currentWeek;
        }
    }, [league.currentWeek, league.schedule, league.teams, league.id, dispatch]);


    const handleProcessWaivers = () => {
        dispatch({ type: 'PROCESS_WAIVERS', payload: { leagueId: league.id } });
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: 'Waivers are being processed...', type: 'SYSTEM' } });
    };

    const handleAdvanceWeek = () => {
        dispatch({ type: 'ADVANCE_WEEK', payload: { leagueId: league.id } });
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: `Advancing to Week ${league.currentWeek + 1}...`, type: 'SYSTEM' } });
    };

    const handleSetReady = (isReady: boolean) => {
        dispatch({ type: 'SET_USER_READY', payload: { leagueId: league.id, userId: user.id, isReady } });
    };

    const allHumanPlayersReady = league.members.filter((m: any) => !m.id.startsWith('ai_')).every((m: any) => m.isReady);

    return (
        <div className="min-h-screen">
            {/* Navigation Header */}
            <div className="nav-header">
                <div className="flex justify-between items-center">
                    <div>
                        <h1>{league.name}</h1>
                        <p className="page-subtitle">{league.status.replace('_', ' ')}</p>
                        {slogan && (
                            <p className="text-sm text-cyan-300/80 font-semibold italic mt-1">"{slogan}"</p>
                        )}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                        {isCommissioner && (
                            <button 
                                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'COMMISSIONER_TOOLS' })} 
                                className="btn btn-danger flex items-center gap-2"
                            >
                               <GavelIcon /> Commissioner Tools
                            </button>
                        )}
                        {isSeasonStarted && (
                            <button 
                                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_NEWSPAPER' })} 
                                className="btn btn-secondary flex items-center gap-2"
                            >
                                <NewspaperIcon /> League Newspaper
                            </button>
                        )}
                        {isSeasonStarted && (
                            <button 
                                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_STATS' })} 
                                className="btn btn-secondary flex items-center gap-2"
                            >
                                <ChartBarIcon /> League Stats
                            </button>
                        )}
                        <button 
                            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TROPHY_ROOM' })} 
                            className="btn btn-warning flex items-center gap-2"
                        >
                            <AwardIcon /> Trophy Room
                        </button>
                        {isHistoryAvailable && (
                            <button 
                                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_HISTORY' })} 
                                className="btn btn-warning flex items-center gap-2"
                            >
                                <BookOpenIcon /> League History
                            </button>
                        )}
                        <button 
                            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })} 
                            className="back-btn"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Widget title="League Members" icon={<UserIcon />}>
                            <div className="space-y-3 p-4">
                                {league.members.map((member: any) => (
                                    <div key={member.id} className="flex items-center gap-3">
                                        <Avatar avatar={member.avatar} className="w-8 h-8 text-xl rounded-md" />
                                        <div className="flex-grow">
                                            <span className="font-semibold">{member.name} {member.id === user.id && '(You)'}</span>
                                            {member.persona && (
                                                <div className="flex items-center gap-1 text-xs text-cyan-300/80">
                                                    <MaskIcon className="w-3 h-3"/>
                                                    <span>{member.persona}</span>
                                                </div>
                                            )}
                                        </div>
                                        {member.isReady ? (
                                            <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">Ready</span>
                                        ) : (
                                             <span className="text-xs bg-gray-500/20 text-gray-400 px-2 py-0.5 rounded-full">Not Ready</span>
                                        )}
                                        {member.isCommissioner && <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded-full">Commish</span>}
                                    </div>
                                ))}
                            </div>
                        </Widget>
                        <div className="space-y-6">
                            <AnnouncementsWidget />
                            <WeeklyPollWidget />
                            <RivalryWidget />
                            <SideBetsWidget />
                            <Widget title="League Settings" icon={<SettingsIcon />}>
                                 <div className="space-y-2 p-4 text-sm">
                                    <p><strong>Format:</strong> {league.settings.draftFormat}</p>
                                    <p><strong>Teams:</strong> {league.settings.teamCount}</p>
                                    <p><strong>Scoring:</strong> {league.settings.scoring}</p>
                                    <button 
                                        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_RULES' })} 
                                        className="btn btn-secondary w-full mt-2"
                                    >
                                        View All Rules
                                    </button>
                                 </div>
                            </Widget>
                        </div>
                        <div className="sm:col-span-2 p-4 flex flex-col items-center justify-center text-center">
                            {league.status === 'PRE_DRAFT' && (
                                <div className="flex gap-4">
                                     <button
                                        onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DRAFT_PREP_CENTER' })}
                                        className="btn flex items-center gap-3 text-xl px-8 py-4"
                                    >
                                        <BrainCircuitIcon /> Draft Prep Center
                                    </button>
                                   {isCommissioner ? (
                                        <div className="flex flex-col gap-2 items-center">
                                            <button
                                                onClick={() => dispatch({ type: 'START_DRAFT' })}
                                                disabled={!allHumanPlayersReady}
                                                className="btn btn-success text-xl px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                START DRAFT
                                            </button>
                                            <button
                                                onClick={() => dispatch({ type: 'SET_ALL_USERS_READY', payload: { leagueId: league.id }})}
                                                className="btn btn-secondary text-xs"
                                            >
                                                Mark All Users Ready
                                            </button>
                                        </div>
                                    ) : (
                                         <button
                                            onClick={() => handleSetReady(!user.isReady)}
                                            className={`btn text-xl px-8 py-4 ${user.isReady ? 'btn-danger' : 'btn-success'}`}
                                        >
                                            {user.isReady ? "I'm Not Ready" : "I'm Ready"}
                                        </button>
                                    )}
                                </div>
                            )}
                            {league.status === 'DRAFTING' ? (
                                 <button 
                                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DRAFT_ROOM' })} 
                                    className="btn text-xl px-8 py-4"
                                >
                                    ENTER DRAFT
                                </button>
                            ) : isCommissioner && isDraftComplete ? (
                                 <button 
                                    onClick={handleProcessWaivers} 
                                    className="btn text-xl px-8 py-4"
                                >
                                    START SEASON
                                </button>
                            ) : isCommissioner && isSeasonStarted ? (
                                <button 
                                    onClick={handleAdvanceWeek} 
                                    className="btn btn-danger text-xl px-8 py-4"
                                >
                                    ADVANCE WEEK
                                </button>
                            ) : null}
                        </div>
                    </div>
                    <div className="md:col-span-1">
                        <ChatPanel />
                    </div>
                </main>
            </div>
        </div>
    );
};

export const LeagueHubView: React.FC = () => {
    const { state, dispatch } = useAppState();
    const { league } = useLeague();

    return (
        <div className="w-full h-full">
            {!league || !state.user ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <p className="text-lg">Error: {!league ? 'No active league found' : 'Please log in to access the league hub'}.</p>
                     <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })} className="mt-4 px-4 py-2 bg-cyan-500 rounded text-black font-bold">
                        Back to Dashboard
                    </button>
                </div>
            ) : (
                <LeagueHubContent league={league} user={state.user} dispatch={dispatch} />
            )}
        </div>
    );
};

export default LeagueHubView;
