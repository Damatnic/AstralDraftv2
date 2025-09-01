

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import type { DailyBriefingItem, Player } from &apos;../../types&apos;;
import { players } from &apos;../../data/players&apos;;
import { TargetIcon } from &apos;../icons/TargetIcon&apos;;
import { LightbulbIcon } from &apos;../icons/LightbulbIcon&apos;;
import { AlertTriangleIcon } from &apos;../icons/AlertTriangleIcon&apos;;
import { SparklesIcon } from &apos;../icons/SparklesIcon&apos;;
import { ArrowRightLeftIcon } from &apos;../icons/ArrowRightLeftIcon&apos;;
import { WandIcon } from &apos;../icons/WandIcon&apos;;
import { PlusCircleIcon } from &apos;../icons/PlusCircleIcon&apos;;
import { FireIcon } from &apos;../icons/FireIcon&apos;;

interface BriefingItemCardProps {
}
    item: DailyBriefingItem;
    dispatch: React.Dispatch<any>;
    onGetAdvice?: (playerIds: number[]) => void;
    onClaimPlayer?: (player: Player) => void;

}

const itemConfig = {
}
    MATCHUP_PREVIEW: { icon: <TargetIcon />, color: &apos;text-blue-400&apos; },
    WAIVER_GEM: { icon: <LightbulbIcon />, color: &apos;text-green-400&apos; },
    ROSTER_WARNING: { icon: <AlertTriangleIcon />, color: &apos;text-red-400&apos; },
    PLAYER_SPOTLIGHT: { icon: <SparklesIcon />, color: &apos;text-yellow-400&apos; },
    TRADE_TIP: { icon: <ArrowRightLeftIcon />, color: &apos;text-purple-400&apos; },
    ON_THE_HOT_SEAT: { icon: <FireIcon />, color: &apos;text-orange-400&apos; },
};

const BriefingItemCard: React.FC<BriefingItemCardProps> = ({ item, dispatch, onGetAdvice, onClaimPlayer }: any) => {
}
    const config = itemConfig[item.type] || { icon: <SparklesIcon />, color: &apos;text-gray-400&apos; };

    const handleCardClick = () => {
}
        if (item.type === &apos;WAIVER_GEM&apos;) {
}
            dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;WAIVER_WIRE&apos; });
        } else if (item.type === &apos;MATCHUP_PREVIEW&apos;) {
}
            dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;MATCHUP&apos; });
        } else if (item.type === &apos;TRADE_TIP&apos;) {
}
            // Future: Navigate to trade center or a specific trade proposal view

    };

    const canGetAdvice = (item.type === &apos;ROSTER_WARNING&apos; || item.type === &apos;ON_THE_HOT_SEAT&apos;) && item.relatedPlayerIds && item.relatedPlayerIds.length > 0 && onGetAdvice;
    const waiverGemPlayer = item.type === &apos;WAIVER_GEM&apos; && item.playerName ? players.find((p: any) => p.name === item.playerName) : null;
    const canClaimPlayer = waiverGemPlayer && onClaimPlayer;

    const actionButton = () => {
}
        if (canGetAdvice) {
}
            return (
                <button
                    onClick={(e: any) = aria-label="Action button"> {
}
                        e.stopPropagation();
                        onGetAdvice(item.relatedPlayerIds!);
                    }}
                    className="mt-2 flex items-center gap-1.5 px-2 py-1 bg-cyan-500/10 text-cyan-300 text-xs font-bold rounded-md hover:bg-cyan-500/20 sm:px-4 md:px-6 lg:px-8"
                >
                    <WandIcon />
                    Get Lineup Advice
                </button>
            );

        if (canClaimPlayer) {
}
             return (
                <button
                    onClick={(e: any) = aria-label="Action button"> {
}
                        e.stopPropagation();
                        onClaimPlayer(waiverGemPlayer);
                    }}
                    className="mt-2 flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-300 text-xs font-bold rounded-md hover:bg-green-500/20 sm:px-4 md:px-6 lg:px-8"
                >
                    <PlusCircleIcon />
                    Claim Player
                </button>
            );

        return null;

    return (
        <motion.div
            onClick={handleCardClick}
            className="flex items-start gap-3 p-2 bg-black/10 rounded-lg cursor-pointer hover:bg-black/20 sm:px-4 md:px-6 lg:px-8"
            {...{
}
                layout: true,
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0 },
                transition: { type: &apos;spring&apos;, stiffness: 300, damping: 30 },
            }}
        >
            <div className={`mt-0.5 ${config.color}`}>
                {config.icon}
            </div>
            <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                <h4 className="font-bold text-sm text-white sm:px-4 md:px-6 lg:px-8">{item.title}</h4>
                <p className="text-xs text-gray-300 sm:px-4 md:px-6 lg:px-8">{item.summary}</p>
                {actionButton()}
            </div>
        </motion.div>
    );
};

const BriefingItemCardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <BriefingItemCard {...props} />
  </ErrorBoundary>
);

export default React.memo(BriefingItemCardWithErrorBoundary);