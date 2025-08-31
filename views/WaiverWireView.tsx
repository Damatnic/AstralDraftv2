
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import { players } from '../data/players';
import type { Player, Team, League, AppState } from '../types';
import PlaceClaimModal from '../components/team/PlaceClaimModal';
import PlayerDetailModal from '../components/player/PlayerDetailModal';
import { useLeague } from '../hooks/useLeague';
import WaiverIntelligenceWidget from '../components/team/WaiverIntelligenceWidget';

const WaiverWireContent: React.FC<{ league: League; myTeam: Team; dispatch: React.Dispatch<any>; playerNotes: AppState['playerNotes'], playerAvatars: AppState['playerAvatars'] }> = ({ league, myTeam, dispatch, playerNotes, playerAvatars }) => {
    const [search, setSearch] = React.useState('');
    const [positionFilter, setPositionFilter] = React.useState<string>('ALL');
    const [isClaimModalOpen, setIsClaimModalOpen] = React.useState(false);
    const [playerToClaim, setPlayerToClaim] = React.useState<Player | null>(null);
    const [selectedPlayer, setSelectedPlayer] = React.useState<Player | null>(null);

    const draftedPlayerIds = new Set(league.teams.flatMap(t => t.roster.map((p: any) => p.id)));
    const freeAgents = players.filter((p: any) => !draftedPlayerIds.has(p.id));

    const filteredPlayers = React.useMemo(() => {
        return freeAgents.filter((p: any) => {
            const searchLower = search.toLowerCase();
            const matchesSearch = p.name.toLowerCase().includes(searchLower) || p.team.toLowerCase().includes(searchLower);
            const matchesPosition = positionFilter === 'ALL' || p.position === positionFilter;
            return matchesSearch && matchesPosition;
        }).slice(0, 100);
    }, [freeAgents, search, positionFilter]);

    const myPendingClaims = league.waiverClaims.filter((c: any) => c.teamId === myTeam.id && c.status === 'PENDING');

    const handleOpenClaimModal = (player: Player) => {
        setPlayerToClaim(player);
        setIsClaimModalOpen(true);
    };

    const handleCancelClaim = (claimId: string) => {
        dispatch({ type: 'CANCEL_WAIVER_CLAIM', payload: { leagueId: league.id, claimId }});
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message:'Waiver claim cancelled.', type: 'SYSTEM' } });
    };

    const positions = ['ALL', 'QB', 'RB', 'WR', 'TE', 'K', 'DST'];

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
                            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' })} 
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
                                    <button
                                        key={pos}
                                        onClick={() => setPositionFilter(pos)}
                                        className={`btn btn-sm ${positionFilter === pos ? 'btn-primary' : 'btn-secondary'}`}
                                    >
                                        {pos}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {filteredPlayers.map((player: any) => (
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
                                                Claim
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
                                    <p className="text-center text-secondary py-4">You have no pending claims.</p>
                                ) : myPendingClaims.map((claim: any) => {
                                    const playerToAdd = players.find((p: any) => p.id === claim.playerId);
                                    return (
                                        <div key={claim.id} className="p-3 bg-slate-700/30 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-white">{playerToAdd?.name}</p>
                                                <button 
                                                    onClick={() => handleCancelClaim(claim.id)}
                                                >
                                                    Cancel
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
                        <PlaceClaimModal
                            playerToAdd={playerToClaim}
                            myTeam={myTeam}
                            leagueId={league.id}
                            dispatch={dispatch}
                            onClose={() => setIsClaimModalOpen(false)}
                        />
                    )}
                    {selectedPlayer && (
                        <PlayerDetailModal
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
    const { state, dispatch } = useAppState();
    const { league, myTeam } = useLeague();

    if (!league || !myTeam) {
        return (
            <div className="w-full h-full flex items-center justify-center p-4">
                <p>Could not load waiver wire. Please select a league first.</p>
                <button onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })} className="ml-4 px-4 py-2 bg-cyan-500 rounded">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return <WaiverWireContent league={league} myTeam={myTeam} dispatch={dispatch} playerNotes={state.playerNotes} playerAvatars={state.playerAvatars} />;
};

export default WaiverWireView;
