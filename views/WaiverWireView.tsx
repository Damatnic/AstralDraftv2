
import { AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../contexts/AppContext&apos;;
import { players } from &apos;../data/players&apos;;
import type { Player, Team, League, AppState } from &apos;../types&apos;;
import PlaceClaimModal from &apos;../components/team/PlaceClaimModal&apos;;
import PlayerDetailModal from &apos;../components/player/PlayerDetailModal&apos;;
import { useLeague } from &apos;../hooks/useLeague&apos;;
import WaiverIntelligenceWidget from &apos;../components/team/WaiverIntelligenceWidget&apos;;

const WaiverWireContent: React.FC<{ league: League; myTeam: Team; dispatch: React.Dispatch<any>; playerNotes: AppState[&apos;playerNotes&apos;], playerAvatars: AppState[&apos;playerAvatars&apos;] }> = ({ league, myTeam, dispatch, playerNotes, playerAvatars }: any) => {
}
    const [search, setSearch] = React.useState(&apos;&apos;);
    const [positionFilter, setPositionFilter] = React.useState<string>(&apos;ALL&apos;);
    const [isClaimModalOpen, setIsClaimModalOpen] = React.useState(false);
    const [playerToClaim, setPlayerToClaim] = React.useState<Player | null>(null);
    const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);

    const draftedPlayerIds = new Set(league.teams.flatMap(t => t.roster.map((p: any) => p.id)));
    const freeAgents = players.filter((p: any) => !draftedPlayerIds.has(p.id));

    const filteredPlayers = React.useMemo(() => {
}
        return freeAgents.filter((p: any) => {
}
            const searchLower = search.toLowerCase();
            const matchesSearch = p.name.toLowerCase().includes(searchLower) || p.team.toLowerCase().includes(searchLower);
            const matchesPosition = positionFilter === &apos;ALL&apos; || p.position === positionFilter;
            return matchesSearch && matchesPosition;
        }).slice(0, 100);
    }, [freeAgents, search, positionFilter]);

    const myPendingClaims = league.waiverClaims.filter((c: any) => c.teamId === myTeam.id && c.status === &apos;PENDING&apos;);

    const handleOpenClaimModal = (player: Player) => {
}
        setPlayerToClaim(player);
        setIsClaimModalOpen(true);
    };

    const handleCancelClaim = (claimId: string) => {
}
        dispatch({ type: &apos;CANCEL_WAIVER_CLAIM&apos;, payload: { leagueId: league.id, claimId }});
        dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message:&apos;Waiver claim cancelled.&apos;, type: &apos;SYSTEM&apos; } });
    };

    const positions = [&apos;ALL&apos;, &apos;QB&apos;, &apos;RB&apos;, &apos;WR&apos;, &apos;TE&apos;, &apos;K&apos;, &apos;DST&apos;];

    return (
        <div className="min-h-screen">
            {/* Navigation Header */}
            <div className="nav-header">
                <div className="flex justify-between items-center">
                    <div>
                        <h1>Waiver Wire</h1>
                        <p className="page-subtitle">{league.name}</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="px-4 py-2 bg-green-500/10 rounded-lg text-sm">
                            <span className="text-green-300 font-bold">FAAB: ${myTeam.faab}</span>
                        </div>
                        <button 
                            onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;TEAM_HUB&apos; })} 
                            className="back-btn"
                        >
                            Back to Team
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="search-container">
                            <h3 className="text-xl font-bold text-white mb-4">Available Free Agents</h3>
                            
                            <div className="search-row mb-4">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        placeholder="Search player..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-1 justify-center flex-wrap mb-4">
                                {positions.map((pos: any) => (
}
                                    <button
                                        key={pos}
                                        onClick={() => setPositionFilter(pos)}
                                        className={`btn btn-sm ${positionFilter === pos ? &apos;btn-primary&apos; : &apos;btn-secondary&apos;}`}
                                    >
                                        {pos}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {filteredPlayers.map((player: any) => (
}
                                    <div key={player.id} className="player-card cursor-pointer">
                                        <div className="player-header">
                                            <div className="player-info" onClick={() => setSelectedPlayer(player)}>
                                                <div className="position-badge">{player.position}</div>
                                                <h3 className="player-name">{player.name}</h3>
                                                <p className="player-team">{player.team} • Rank #{player.rank}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleOpenClaimModal(player)}
                                                className="btn btn-success btn-sm"
                                            >
//                                                 Claim
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="card">
                            <h3 className="card-title">My Pending Claims</h3>
                            <div className="space-y-2">
                                {myPendingClaims.length === 0 ? (
}
                                    <p className="text-center text-secondary py-4">You have no pending claims.</p>
                                ) : myPendingClaims.map((claim: any) => {
}
                                    const playerToAdd = players.find((p: any) => p.id === claim.playerId);
                                    return (
                                        <div key={claim.id} className="p-3 bg-slate-700/30 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-white">{playerToAdd?.name}</p>
                                                <button 
                                                    onClick={() => handleCancelClaim(claim.id)}
                                                >
//                                                     Cancel
                                                </button>
                                            </div>
                                            <p className="text-sm text-secondary">Bid: <span className="font-bold text-yellow-300">${claim.bid}</span></p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <WaiverIntelligenceWidget league={league} />
                    </div>
                </main>
                
                <AnimatePresence>
                    {isClaimModalOpen && playerToClaim && (
}
                        <PlaceClaimModal>
                            playerToAdd={playerToClaim}
                            myTeam={myTeam}
                            leagueId={league.id}
                            dispatch={dispatch}
                            onClose={() => setIsClaimModalOpen(false)}
                        />
                    )}
                    {selectedPlayer && (
}
                        <PlayerDetailModal>
                            player={selectedPlayer}
                            onClose={() => setSelectedPlayer(null)}
                            playerNotes={playerNotes}
                            dispatch={dispatch}
                            league={league}
                            playerAvatars={playerAvatars}
                        />
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const WaiverWireView: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const { league, myTeam } = useLeague();

    if (!league || !myTeam) {
}
        return (
            <div className="w-full h-full flex items-center justify-center p-4">
                <p>Could not load waiver wire. Please select a league first.</p>
                <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; })} className="ml-4 px-4 py-2 bg-cyan-500 rounded">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return <WaiverWireContent league={league} myTeam={myTeam} dispatch={dispatch} playerNotes={state.playerNotes} playerAvatars={state.playerAvatars} />;
};

export default WaiverWireView;
