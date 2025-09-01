

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import type { Player, Team, AuctionState } from &apos;../../types&apos;;
import { Tooltip } from &apos;../ui/Tooltip&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;

interface AuctionPanelProps {
}
    nominatingTeam?: Team;
    nominatedPlayer: Player | null;
    currentBid: number;
    highBidder?: Team | null;
    timeLeft: number;
    myBudget: number;
    onPlaceBid: (bid: number) => void;
    myTeamId?: number;
    bidHistory: AuctionState[&apos;bidHistory&apos;];
    teams: Team[];

}

const BidHistory: React.FC<{ history: AuctionState[&apos;bidHistory&apos;], teams: Team[] }> = ({ history, teams }: any) => (
    <div className="text-xs text-gray-400 flex flex-wrap-reverse items-center gap-x-3 gap-y-1 sm:px-4 md:px-6 lg:px-8">
        <span>History:</span>
        {history.slice().reverse().slice(0, 5).map((item, index) => {
}
            const team = teams.find((t: any) => t.id === item.teamId);
            return (
                 <span key={index} className="flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                    <Avatar avatar={team?.avatar || &apos;❓&apos;} className="w-4 h-4 text-xs rounded-full sm:px-4 md:px-6 lg:px-8" />
                    <span className="font-mono sm:px-4 md:px-6 lg:px-8">${item.bid}</span>
                </span>
            );
        })}
    </div>
);

const AuctionPanel: React.FC<AuctionPanelProps> = ({ nominatingTeam, nominatedPlayer, currentBid, highBidder, timeLeft, myBudget, onPlaceBid, myTeamId, bidHistory, teams }: any) => {
}
    const [myBidString, setMyBidString] = React.useState((currentBid + 1).toString());
    const isMeHighBidder = !!(myTeamId && highBidder && highBidder.id === myTeamId);

    React.useEffect(() => {
}
        const currentMyBidNumber = parseInt(myBidString, 10);
        if (isNaN(currentMyBidNumber) || currentMyBidNumber <= currentBid) {
}
           setMyBidString((currentBid + 1).toString());
    }
  }, [currentBid]);

    const handleBidSubmit = (e: React.FormEvent) => {
}
        e.preventDefault();
        const bidAmount = parseInt(myBidString, 10);
        if (isNaN(bidAmount) || bidAmount > myBudget || bidAmount <= currentBid) {
}
            return;

        onPlaceBid(bidAmount);
    };
    
    const bidAmountAsNumber = parseInt(myBidString, 10);
    const isMyBidTooHigh = !isNaN(bidAmountAsNumber) && bidAmountAsNumber > myBudget;
    const isBidInvalid = isNaN(bidAmountAsNumber) || bidAmountAsNumber <= currentBid;
    
    const progress = (timeLeft / 10) * 100;

  if (isLoading) {
}
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
        <div className="glass-pane p-3 rounded-xl flex flex-col gap-2 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                {nominatedPlayer ? (
}
                    <>
                        <div>
                            <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">ON THE BLOCK (NOM BY: {nominatingTeam?.name || &apos;N/A&apos;})</p>
                            <p className="font-bold text-lg text-white sm:px-4 md:px-6 lg:px-8">{nominatedPlayer.name} <span className="text-sm font-normal sm:px-4 md:px-6 lg:px-8">({nominatedPlayer.position})</span></p>
                            <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">High Bid: <span className="font-bold text-yellow-300 sm:px-4 md:px-6 lg:px-8">${currentBid}</span> ({highBidder?.name || &apos;N/A&apos;})</p>
                        </div>
                        <form onSubmit={handleBidSubmit}
                            <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                <Tooltip content={isMyBidTooHigh ? "Bid exceeds your budget!" : `Your Budget: ${myBudget}`}>
                                    <input 
                                        type="number" 
                                        value={myBidString}
                                        onChange={e => setMyBidString(e.target.value)}
                                        disabled={isMeHighBidder}
                                        className={`w-20 bg-black/20 text-white font-bold text-center p-2 rounded-md border  ${isMyBidTooHigh ? &apos;border-red-500&apos; : &apos;border-cyan-400/50&apos;} disabled:opacity-60`}
                                    />
                                </Tooltip>
                                <button type="submit" className={`px-6 py-2 text-white font-bold rounded-md transition-colors ${isMeHighBidder ? &apos;bg-yellow-600&apos; : &apos;bg-green-500 hover:bg-green-400&apos;} disabled:opacity-60 disabled:cursor-not-allowed`} disabled={isMyBidTooHigh || isBidInvalid || isMeHighBidder} aria-label="Action button">
                                    {isMeHighBidder ? &apos;LEADING&apos; : &apos;BID&apos;}
                                </button>
                            </div>
                            <div className="w-24 h-8 bg-gray-800/50 rounded-full relative overflow-hidden sm:px-4 md:px-6 lg:px-8">
                                <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000 linear sm:px-4 md:px-6 lg:px-8" style={{ width: `${progress}%` }}></div>
                                <span className="absolute inset-0 flex items-center justify-center font-mono font-bold text-lg text-white sm:px-4 md:px-6 lg:px-8">
                                    {timeLeft}
                                </span>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="w-full flex justify-center items-center sm:px-4 md:px-6 lg:px-8">
                        <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{nominatingTeam?.name || &apos;...&apos;} is nominating...</p>
                    </div>
                )}
            </div>
            {nominatedPlayer && bidHistory.length > 0 && <BidHistory history={bidHistory} teams={teams} />}
        </div>
    );
};

const AuctionPanelWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <AuctionPanel {...props} />
  </ErrorBoundary>
);

export default React.memo(AuctionPanelWithErrorBoundary);