

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { MatchupPlayer, GamedayEvent } from '../../types';
import AnimatedNumber from '../ui/AnimatedNumber';
import { FlameIcon } from '../icons/FlameIcon';
import { Tooltip } from '../ui/Tooltip';

interface PlayerRowProps {
    playerData: MatchupPlayer;
    position: string;
    latestEvent: GamedayEvent | null;

}

const PlayerRow: React.FC<PlayerRowProps> = ({ playerData, position, latestEvent }) => {
    const controls = useAnimation();
    const { player, projectedScore, actualScore, isHot } = playerData;

    React.useEffect(() => {
        if (latestEvent && latestEvent.player.id === player.id && latestEvent.type !== 'REDZONE_ENTRY') {
            controls.start({
                backgroundColor: ["#16a34a", "rgba(0,0,0,0.1)"],
                transition: { duration: 1.5, ease: "easeOut" },
            });

    }, [latestEvent, player.id, controls]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
        <motion.div
            {...{ animate: controls }}
            className="grid grid-cols-[3rem_1fr_4rem_4rem] gap-2 items-center p-2 rounded-md sm:px-4 md:px-6 lg:px-8"
        >
            <span className="font-bold text-cyan-300 sm:px-4 md:px-6 lg:px-8">{position}</span>
            <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                {isHot && (
                    <Tooltip content={`${player.name} is in the RedZone!`}>
                        <FlameIcon className="h-4 w-4 text-red-500 animate-pulse sm:px-4 md:px-6 lg:px-8" />
                    </Tooltip>
                )}
                <div>
                    <p className="font-semibold text-sm text-white sm:px-4 md:px-6 lg:px-8">{player.name}</p>
                    <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">{player.team}</p>
                </div>
            </div>
            <span className="text-right text-sm text-gray-300 font-mono sm:px-4 md:px-6 lg:px-8">{projectedScore.toFixed(2)}</span>
            <span className="text-right text-sm font-bold text-white font-mono sm:px-4 md:px-6 lg:px-8">
                <AnimatedNumber value={actualScore} />
            </span>
        </motion.div>
    );
};

const PlayerRowWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <PlayerRow {...props} />
  </ErrorBoundary>
);

export default React.memo(PlayerRowWithErrorBoundary);
