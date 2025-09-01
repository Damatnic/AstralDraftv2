

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { formatRelativeTime } from &apos;../../utils/time&apos;;
import { FlameIcon } from &apos;../icons/FlameIcon&apos;;
import { ZapIcon } from &apos;../icons/ZapIcon&apos;;
import type { GamedayEventType } from &apos;../../types&apos;;

interface LiveEventTickerProps {
}
    matchupId: string;

}

const eventIcons: Record<GamedayEventType, React.ReactElement> = {
}
    TOUCHDOWN: <FlameIcon />,
    FIELD_GOAL: <ZapIcon />,
    BIG_PLAY: <ZapIcon />,
    REDZONE_ENTRY: <FlameIcon />,
    INTERCEPTION: <ZapIcon />,
    FUMBLE: <ZapIcon />,
};

const LiveEventTicker: React.FC<LiveEventTickerProps> = ({ matchupId }: any) => {
}
    const { state } = useAppState();
    const events = (state.gamedayEvents[matchupId] || []).slice(-5); // Show last 5 events
    const scrollRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
}
        if (scrollRef.current) {
}
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [events]);

    // Remove isLoading check as it&apos;s not defined
    // if (isLoading) {
}
    //   return (
    //     <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
    //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
    //       <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
    //     </div>
    //   );
    // }

    return (
        <div className="glass-pane p-3 rounded-xl flex-grow flex flex-col min-w-[300px] sm:px-4 md:px-6 lg:px-8">
            <h3 className="text-center font-bold text-sm mb-2 text-red-400 animate-pulse sm:px-4 md:px-6 lg:px-8">LIVE</h3>
            <div ref={scrollRef} className="flex-grow space-y-2 overflow-y-auto pr-2 sm:px-4 md:px-6 lg:px-8">
                <AnimatePresence initial={false}>
                    {events.map((event: any) => (
}
                        <motion.div
                            key={event.id}
                            className="p-2 bg-black/20 rounded-md text-xs sm:px-4 md:px-6 lg:px-8"
                            {...{
}
                                layout: true,
                                initial: { opacity: 0, y: 20, scale: 0.8 },
                                animate: { opacity: 1, y: 0, scale: 1 },
                                exit: { opacity: 0, x: -20 },
                                transition: { type: &apos;spring&apos;, stiffness: 200, damping: 20 },
                            }}
                        >
                            <div className="flex justify-between items-center text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">
                                <span className="font-bold text-cyan-300 flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                                    {eventIcons[event.type as keyof typeof eventIcons] || <ZapIcon />}
                                    {event.type.replace(&apos;_&apos;, &apos; &apos;)}
                                </span>
                                <span>{formatRelativeTime(event.timestamp)}</span>
                            </div>
                            <p>{event.text}</p>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

const LiveEventTickerWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <LiveEventTicker {...props} />
  </ErrorBoundary>
);

export default React.memo(LiveEventTickerWithErrorBoundary);
