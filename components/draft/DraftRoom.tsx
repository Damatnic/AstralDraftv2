import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo, useState, useEffect, useRef, FC, MouseEvent } from &apos;react&apos;;
import { useDraftRoom } from &apos;../../hooks/useDraftRoom&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;

interface DraftRoomProps {
}
  leagueId: string;
  userId: string;
  teamId: number;
  onExitDraft?: () => void;

}

interface Player {
}
  id: number;
  name: string;
  position: string;
  team: string;
  adp: number;
  projectedPoints: number;
  tier: number;
}

const DraftRoom: FC<DraftRoomProps> = ({ leagueId,
}
  userId,
  teamId,
//   onExitDraft
 }: any) => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const {
}
    isConnected,
    connectionStatus,
    participants,
    currentPick,
    currentRound,
    timeRemaining,
    isPaused,
    isMyTurn,
    picks,
    chatMessages,
    connect,
    disconnect,
    makePick,
    sendChatMessage,
    toggleTimer,
    error,
//     clearError
  } = useDraftRoom({ leagueId, userId, teamId });

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [chatInput, setChatInput] = useState(&apos;&apos;);
  const [filterPosition, setFilterPosition] = useState<string>(&apos;ALL&apos;);
  const [availablePlayers] = useState<Player[]>([
    // Mock available players - replace with real data
    { id: 1, name: &apos;Christian McCaffrey&apos;, position: &apos;RB&apos;, team: &apos;SF&apos;, adp: 1.2, projectedPoints: 320, tier: 1 },
    { id: 2, name: &apos;Austin Ekeler&apos;, position: &apos;RB&apos;, team: &apos;LAC&apos;, adp: 2.1, projectedPoints: 305, tier: 1 },
    { id: 3, name: &apos;Cooper Kupp&apos;, position: &apos;WR&apos;, team: &apos;LAR&apos;, adp: 3.5, projectedPoints: 295, tier: 1 },
    { id: 4, name: &apos;Derrick Henry&apos;, position: &apos;RB&apos;, team: &apos;TEN&apos;, adp: 4.2, projectedPoints: 285, tier: 2 },
    { id: 5, name: &apos;Davante Adams&apos;, position: &apos;WR&apos;, team: &apos;LV&apos;, adp: 5.1, projectedPoints: 280, tier: 2 }
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
}
    if (chatContainerRef.current) {
}
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Timer animation effect
  useEffect(() => {
}
    if (timerRef.current && timeRemaining <= 30 && isMyTurn) {
}
      timerRef.current.classList.add(&apos;timer-warning&apos;);
    } else if (timerRef.current) {
}
      timerRef.current.classList.remove(&apos;timer-warning&apos;);
    }
  }, [timeRemaining, isMyTurn]);

  const handleMakePick = () => {
}
    if (selectedPlayer && isMyTurn) {
}
      makePick(selectedPlayer.id);
      setSelectedPlayer(null);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
}
    e.preventDefault();
    if (chatInput.trim()) {
}
      sendChatMessage(chatInput.trim());
      setChatInput(&apos;&apos;);
    }
  };

  const formatTime = (seconds: number): string => {
}
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, &apos;0&apos;)}`;
  };

  const getPositionColor = (position: string): string => {
}
    switch (position) {
}
      case &apos;QB&apos;: return &apos;text-red-600&apos;;
      case &apos;RB&apos;: return &apos;text-green-600&apos;;
      case &apos;WR&apos;: return &apos;text-blue-600&apos;;
      case &apos;TE&apos;: return &apos;text-orange-600&apos;;
      case &apos;DEF&apos;: return &apos;text-purple-600&apos;;
      case &apos;K&apos;: return &apos;text-yellow-600&apos;;
      default: return &apos;text-gray-600&apos;;
    }
  };

  const getTierColor = (tier: number): string => {
}
    switch (tier) {
}
      case 1: return &apos;bg-yellow-100 border-yellow-400&apos;;
      case 2: return &apos;bg-blue-100 border-blue-400&apos;;
      case 3: return &apos;bg-green-100 border-green-400&apos;;
      default: return &apos;bg-gray-100 border-gray-400&apos;;
    }
  };

  const filteredPlayers = availablePlayers.filter((player: any) => {
}
    if (filterPosition === &apos;ALL&apos;) return true;
    return player.position === filterPosition;
  });

  if (!isConnected && connectionStatus !== &apos;CONNECTING&apos;) {
}
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connection Issue</h2>
          <p className="text-gray-600 mb-6">
            Unable to connect to the draft room. Please check your connection and try again.
          </p>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={(e: MouseEvent<HTMLButtonElement>) => { e.preventDefault(); connect(); }}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]"
              aria-label="Retry connection to draft room"
            >
              Retry Connection
            </button>
            {onExitDraft && (
}
              <button
                type="button"
                onClick={(e: MouseEvent<HTMLButtonElement>) => { e.preventDefault(); onExitDraft(); }}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors min-h-[44px]"
                aria-label="Exit draft room"
              >
                Exit Draft
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            <h1 className="text-2xl font-bold">Draft Room</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Round {currentRound}</span>
              <span className="text-sm text-gray-400">Pick {currentPick}</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
}
                  connectionStatus === &apos;CONNECTED&apos; ? &apos;bg-green-400&apos; :
                  connectionStatus === &apos;CONNECTING&apos; ? &apos;bg-yellow-400&apos; : 
                  &apos;bg-red-400&apos;
                }`} />
                <span className="text-sm text-gray-400 capitalize">{connectionStatus.toLowerCase()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Timer */}
            <div
              ref={timerRef}
              className={`text-2xl font-mono px-4 py-2 rounded-lg border-2 transition-all duration-300 ${
}
                isPaused ? &apos;bg-yellow-600 border-yellow-400&apos; :
                timeRemaining <= 30 ? &apos;bg-red-600 border-red-400 animate-pulse&apos; :
                &apos;bg-gray-700 border-gray-600&apos;
              }`}
            >
              {formatTime(timeRemaining)}
            </div>
            
            {/* Timer controls */}
            <button
              type="button"
              onClick={(e: MouseEvent<HTMLButtonElement>) => { e.preventDefault(); toggleTimer(); }}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isPaused ? &apos;Resume draft timer&apos; : &apos;Pause draft timer&apos;}
            >
              {isPaused ? &apos;Resume&apos; : &apos;Pause&apos;}
            </button>
            
            {onExitDraft && (
}
              <button
                type="button"
                onClick={(e: MouseEvent<HTMLButtonElement>) => { e.preventDefault(); onExitDraft(); }}
                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Exit draft room"
              >
                Exit Draft
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-red-600 text-white p-4 text-center"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={(e: MouseEvent<HTMLButtonElement>) => { e.preventDefault(); clearError(); }}
              className="ml-4 underline hover:no-underline min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Dismiss error message"
            >
//               Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Available Players */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Available Players</h2>
              <select
                value={filterPosition}
                onChange={(e: any) => setFilterPosition(e.target.value)}
              >
                <option value="ALL">All Positions</option>
                <option value="QB">Quarterback</option>
                <option value="RB">Running Back</option>
                <option value="WR">Wide Receiver</option>
                <option value="TE">Tight End</option>
                <option value="DEF">Defense</option>
                <option value="K">Kicker</option>
              </select>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPlayers.map((player: any) => (
}
                <motion.div
                  key={player.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
}
                    selectedPlayer?.id === player.id
                      ? &apos;border-blue-400 bg-blue-900/30&apos;
                      : `${getTierColor(player?.tier)} bg-gray-700 border-gray-600 hover:border-gray-500`
                  }`}
                  onClick={() => setSelectedPlayer(player)}
                  onKeyDown={(e: any) => {
}
                    if (e.key === &apos;Enter&apos; || e.key === &apos; &apos;) {
}
                      e.preventDefault();
                      setSelectedPlayer(player);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{player.name}</span>
                        <span className={`text-sm font-medium ${getPositionColor(player.position)}`}>
                          {player.position}
                        </span>
                        <span className="text-sm text-gray-400">{player.team}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                        <span>ADP: {player?.adp}</span>
                        <span>Proj: {player.projectedPoints}</span>
                        <span>Tier {player?.tier}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Draft Button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleMakePick}
                disabled={!selectedPlayer || !isMyTurn}
                className={`w-full py-3 rounded-lg font-semibold transition-colors min-h-[44px] ${
}
                  selectedPlayer && isMyTurn
                    ? &apos;bg-green-600 hover:bg-green-700 text-white&apos;
                    : &apos;bg-gray-600 text-gray-400 cursor-not-allowed&apos;
                }`}
                aria-label={!isMyTurn ? "Waiting for your turn" : 
}
                           !selectedPlayer ? "Select a player to draft" : 
                           `Draft ${selectedPlayer.name}`}
              >
                {!isMyTurn ? "Not Your Turn" : 
}
                 !selectedPlayer ? "Select a Player" : 
                 `Draft ${selectedPlayer.name}`}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Draft Board */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Picks</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto mobile-scroll custom-scrollbar">
              {picks.slice(-10).reverse().map((pick, index) => (
}
                <motion.div
                  key={`${pick.pickNumber}-${pick.timestamp}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-2 bg-gray-700 rounded-lg"
                >
                  <div>
                    <span className="text-sm text-gray-400">Pick #{pick.pickNumber}</span>
                    <span className="ml-2 font-medium">Team {pick.teamId}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    Player ID: {pick.playerId}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Participants */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Participants</h2>
            <div className="space-y-2">
              {participants.map((participant: any) => (
}
                <div
                  key={participant.userId}
                  className="flex items-center justify-between p-2 bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
}
                      participant.isOnline ? &apos;bg-green-400&apos; : &apos;bg-gray-400&apos;
                    }`} />
                    <span>Team {participant.teamId}</span>
                    {participant.userId === userId && (
}
                      <span className="text-xs bg-blue-600 px-2 py-1 rounded">You</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-400">
                    {participant.isOnline ? &apos;Online&apos; : &apos;Offline&apos;}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Chat</h2>
            <div
              ref={chatContainerRef}
              className="space-y-2 max-h-48 overflow-y-auto mb-4 mobile-scroll custom-scrollbar"
            >
              {chatMessages.map((message, index) => (
}
                <div
                  key={`${message.timestamp}-${index}`}
                  className={`p-2 rounded-lg ${
}
                    message.isTradeProposal ? &apos;bg-orange-900/30 border border-orange-600&apos; : &apos;bg-gray-700&apos;
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-400">
                      User {message.userId}
                    </span>
                    {message.isTradeProposal && (
}
                      <span className="text-xs bg-orange-600 px-2 py-1 rounded">Trade</span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{message.message}</p>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e: any) => setChatInput(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 min-h-[44px]"
                autoComplete="off"
                placeholder="Type a message..."
                aria-label="Chat message input"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Send chat message"
              >
//                 Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const DraftRoomWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <DraftRoom {...props} />
  </ErrorBoundary>
);

export default React.memo(DraftRoomWithErrorBoundary);
