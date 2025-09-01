
import { AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../contexts/AppContext&apos;;
import { useLeague } from &apos;../hooks/useLeague&apos;;
import { Widget } from &apos;../components/ui/Widget&apos;;
import type { Player } from &apos;../types&apos;;
import { Avatar } from &apos;../components/ui/Avatar&apos;;
import AddPlayerModal from &apos;../components/commissioner/AddPlayerModal&apos;;
import { UserPlusIcon } from &apos;../components/icons/UserPlusIcon&apos;;
import { UserRemoveIcon } from &apos;../components/icons/UserRemoveIcon&apos;;
import { PencilIcon } from &apos;../components/icons/PencilIcon&apos;;

const EditRosterView: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const { league } = useLeague();
    const [selectedTeamId, setSelectedTeamId] = React.useState<number | null>(league?.teams[0]?.id || null);
    const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

    if (!league || state.user?.id !== league.commissionerId) {
}
        return (
            <div className="p-8 text-center">
                <p className="text-red-400">Access Denied. You are not the commissioner of this league.</p>
                <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; }) className="btn btn-primary mt-4">
                    Back to Dashboard
                </button>
            </div>
        );

    const selectedTeam = league.teams.find((t: any) => t.id === selectedTeamId);

    const handleRemovePlayer = (player: Player) => {
}
        if (!selectedTeam) return;
        if (window.confirm(`Are you sure you want to remove ${player.name} from ${selectedTeam.name}?`)) {
}
            dispatch({ type: &apos;MANUAL_REMOVE_PLAYER&apos;, payload: { leagueId: league.id, teamId: selectedTeam.id, playerId: player.id }});
            dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: `${player.name} removed from ${selectedTeam.name}.`, type: &apos;SYSTEM&apos; } });

    };

    return (
        <div className="w-full h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <header className="flex-shrink-0 flex justify-between items-center mb-6">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wider uppercase text-[var(--text-primary)]">
                        Edit Rosters
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] tracking-widest">{league.name}</p>
                </div>
                <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;COMMISSIONER_TOOLS&apos; }) className="back-btn">
                    Back to Tools
                </button>
            </header>
            <main className="flex-grow max-w-4xl mx-auto w-full">
                <Widget title="Roster Management" icon={<PencilIcon />}>
                    <div className="p-4 space-y-4">
                        <div>
                            <label htmlFor="team-select" className="block text-sm font-medium text-gray-400 mb-1">Select Team to Edit</label>
                            <select
                                id="team-select"
                                value={selectedTeamId || &apos;&apos;}
                                onChange={(e: any) => setSelectedTeamId(Number(e.target.value))}
                            >
                                {league.teams.map((team: any) => (
}
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                ))}
                            </select>
                        </div>

                        {selectedTeam && (
}
                            <div className="p-3 bg-black/10 rounded-lg">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="font-bold text-lg text-cyan-300">Roster for {selectedTeam.name} ({selectedTeam.roster.length}/{league.settings.rosterSize})</h3>
                                    <button
                                        onClick={() => setIsAddModalOpen(true)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-green-500/10 text-green-300 rounded-md hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <UserPlusIcon /> Add Player
                                    </button>
                                </div>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {selectedTeam.roster.map((player: any) => (
}
                                        <div key={player.id} className="flex items-center justify-between p-2 bg-white/5 rounded-md">
                                            <div className="flex items-center gap-2">
                                                <Avatar avatar={player.astralIntelligence?.spiritAnimal?.[0] || &apos;🏈&apos;} className="w-8 h-8 text-xl rounded-md" />
                                                <div>
                                                    <p className="font-semibold text-sm">{player.name}</p>
                                                    <p className="text-xs text-gray-400">{player.position} - {player.team}</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleRemovePlayer(player)}
                                            >
                                                <UserRemoveIcon /> Remove
                                            </button>
                                        </div>
                                    ))}
                                    {selectedTeam.roster.length === 0 && <p className="text-center text-sm text-gray-500 py-8">This roster is empty.</p>}
                                </div>
                            </div>
                        )}
                    </div>
                </Widget>
            </main>
            <AnimatePresence>
                {isAddModalOpen && selectedTeam && (
}
                    <AddPlayerModal>
                        league={league}
                        team={selectedTeam}
                        dispatch={dispatch}
                        onClose={() => setIsAddModalOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default EditRosterView;
