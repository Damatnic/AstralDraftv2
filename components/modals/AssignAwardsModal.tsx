import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import type { Team, League, PlayerAwardType, Player } from &apos;../../types&apos;;
import { Modal } from &apos;../ui/Modal&apos;;
import { AwardIcon } from &apos;../icons/AwardIcon&apos;;

interface AssignAwardsModalProps {
}
    team: Team;
    league: League;
    dispatch: React.Dispatch<any>;
    onClose: () => void;

}

const awardTypes: { type: PlayerAwardType, label: string, description: string }[] = [
    { type: &apos;MVP&apos;, label: &apos;Team MVP&apos;, description: &apos;The most valuable player on your squad.&apos; },
    { type: &apos;DRAFT_GEM&apos;, label: &apos;Draft Gem&apos;, description: &apos;The player who provided the most value relative to their draft position.&apos; },
    { type: &apos;WAIVER_HERO&apos;, label: &apos;Waiver Wire Hero&apos;, description: &apos;The best player you picked up from the waiver wire.&apos; },
    { type: &apos;BIGGEST_BUST&apos;, label: &apos;Biggest Bust&apos;, description: &apos;The player who most disappointed relative to their expectations.&apos; },
];

const AssignAwardsModal: React.FC<AssignAwardsModalProps> = ({ team, league, dispatch, onClose }: any) => {
}
    const [selectedAwards, setSelectedAwards] = React.useState<Record<PlayerAwardType, number | null>>(() => {
}
        const initialState: Record<PlayerAwardType, number | null> = {
}
            MVP: null, DRAFT_GEM: null, WAIVER_HERO: null, BIGGEST_BUST: null
        };
        const currentSeason = new Date().getFullYear();
        (league.playerAwards || []).forEach((award: any) => {
}
            if (award.awardedByTeamId === team.id && award.season === currentSeason && award.awardType in initialState) {
}
                initialState[award.awardType as PlayerAwardType] = award.playerId;
            }
        });
        return initialState;
    });

    const handleSelect = (awardType: PlayerAwardType, playerId: string) => {
}
        setSelectedAwards(prev => ({
}
            ...prev,
            [awardType]: playerId ? Number(playerId) : null
        }));
    };

    const handleSave = () => {
}
        const awardsPayload = Object.entries(selectedAwards).map(([awardType, playerId]) => ({
}
            awardType: awardType as PlayerAwardType,
            playerId,
        }));
        
        dispatch({
}
            type: &apos;ASSIGN_PLAYER_AWARDS&apos;,
            payload: { leagueId: league.id, teamId: team.id, awards: awardsPayload }
        });
        dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: &apos;Player awards have been saved!&apos;, type: &apos;SYSTEM&apos; } });
        onClose();
    };

    const labelClasses = "block text-sm font-medium text-cyan-300";
    const selectClasses = "w-full bg-black/20 p-2 rounded-md border border-white/10";

    return (
        <Modal isOpen={true} onClose={onClose}>
            <motion.div
                className="glass-pane rounded-xl shadow-2xl w-full max-w-lg sm:px-4 md:px-6 lg:px-8"
                onClick={e => e.stopPropagation()}
                animate={{ opacity: 1, scale: 1 }}
            >
                <header className="p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold font-display flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <AwardIcon /> Assign End of Season Awards
                    </h2>
                </header>
                <main className="p-4 space-y-4 max-h-[60vh] overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                    {awardTypes.map(({ type, label, description }: any) => (
                        <div key={type}>
                            <label htmlFor={`award-${type}`} className={labelClasses}>{label}</label>
                            <p className="text-xs text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">{description}</p>
                            <select
                                id={`award-${type}`}
                                value={selectedAwards[type] || &apos;&apos;}
                                onChange={e => handleSelect(type, e.target.value)}
                            >
                                <option value="">-- Select a Player --</option>
                                {team.roster.map((player: any) => (
}
                                    <option key={player.id} value={player.id}>
                                        {player.name} ({player.position})
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </main>
                <footer className="p-4 flex justify-end gap-2 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold bg-transparent border border-transparent hover:border-[var(--panel-border)] rounded-md sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-bold bg-cyan-500 text-black rounded-md sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Save Awards</button>
                </footer>
            </motion.div>
        </Modal>
    );
};

const AssignAwardsModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <AssignAwardsModal {...props} />
  </ErrorBoundary>
);

export default React.memo(AssignAwardsModalWithErrorBoundary);