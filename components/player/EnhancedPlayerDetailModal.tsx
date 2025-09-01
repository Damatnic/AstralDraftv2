/**
 * Enhanced Player Detail Modal
 * Updated modal to use the new PlayerProfileView for comprehensive player information
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import { AnimatePresence } from &apos;framer-motion&apos;;
import type { Player, League } from &apos;../../types&apos;;
import { Modal } from &apos;../ui/Modal&apos;;
import PlayerProfileView from &apos;./PlayerProfileView&apos;;
import { players } from &apos;../../data/players&apos;;

interface EnhancedPlayerDetailModalProps {
}
    player: Player;
    onClose: () => void;
    league?: League | null;
    dispatch: React.Dispatch<any>;

}

const EnhancedPlayerDetailModal: React.FC<EnhancedPlayerDetailModalProps> = ({ 
}
    player, 
    onClose, 
    league,
//     dispatch 
}: any) => {
}
    // Fallback league if none provided
    const defaultLeague: League = {
}
        id: &apos;1&apos;,
        name: &apos;Demo League&apos;,
        settings: {
}
            draftFormat: &apos;SNAKE&apos;,
            teamCount: 12,
            rosterSize: 16,
            scoring: &apos;PPR&apos;,
            tradeDeadline: 12,
            playoffFormat: &apos;4_TEAM&apos;,
            waiverRule: &apos;FAAB&apos;,
            aiAssistanceLevel: &apos;FULL&apos;
        },
        members: [],
        status: &apos;IN_SEASON&apos;,
        commissionerId: &apos;1&apos;,
        draftPicks: [],
        teams: [],
        draftLog: [],
        chatMessages: [],
        tradeOffers: [],
        waiverClaims: [],
        schedule: [],
        currentWeek: 4,
        draftCommentary: [],
        allPlayers: players
    };

    const activeLeague = league || defaultLeague;

    return (
        <AnimatePresence>
            <Modal isOpen={true} onClose={onClose}>
                <PlayerProfileView>
                    player={player}
                    league={activeLeague}
                    dispatch={dispatch}
                    onClose={onClose}
                />
            </Modal>
        </AnimatePresence>
    );
};

const EnhancedPlayerDetailModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <EnhancedPlayerDetailModal {...props} />
  </ErrorBoundary>
);

export default React.memo(EnhancedPlayerDetailModalWithErrorBoundary);
