/**
 * Mobile Player Search Wrapper
 * Integrates MobileSearchInterface for player search functionality
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import { Player } from &apos;../../types&apos;;
import { useMediaQuery } from &apos;../../hooks/useMediaQuery&apos;;
import MobileSearchInterface from &apos;./MobileSearchInterface&apos;;

interface MobilePlayerSearchProps {
}
    players: Player[];
    onPlayerSelect?: (player: Player) => void;
    onSearch?: (query: string) => void;
    placeholder?: string;
    className?: string;

}

const MobilePlayerSearch: React.FC<MobilePlayerSearchProps> = ({
}
    players,
    onPlayerSelect,
    onSearch,
    placeholder = "Search players...",
    className = &apos;&apos;
}: any) => {
}
    const isMobile = useMediaQuery(&apos;(max-width: 768px)&apos;);

    if (!isMobile) {
}
        // Return desktop search component or null
        return (
            <div className={`desktop-search-fallback p-4 ${className}`}>
                <input
                    type="text"
                    placeholder={placeholder}
                    onChange={(e: any) => onSearch?.(e.target.value)}
                />
                <div className="mt-4 grid gap-2 sm:px-4 md:px-6 lg:px-8">
                    {players.slice(0, 10).map((player: any) => (
}
                        <button
                            key={player.id}
                            onClick={() => onPlayerSelect?.(player)}
                        >
                            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                <span className="font-medium sm:px-4 md:px-6 lg:px-8">{player.name}</span>
                                <span className="text-sm text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                    {player.position} - {player.team}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );

    return (
        <MobileSearchInterface>
            players={players}
            onPlayerSelect={onPlayerSelect}
            onSearch={onSearch}
            placeholder={placeholder}
            showFilters={true}
            showSorting={true}
            className={className}
        />
    );
};

const MobilePlayerSearchWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <MobilePlayerSearch {...props} />
  </ErrorBoundary>
);

export default React.memo(MobilePlayerSearchWithErrorBoundary);
