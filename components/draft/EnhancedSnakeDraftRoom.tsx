/**
 * Enhanced Snake Draft Room Component
 * Advanced draft interface with auto-draft, analytics, and keeper league support
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useSnakeDraft, SnakeDraftState } from '../../hooks/useSnakeDraft';
import { Player, League, PlayerPosition } from '../../types';
import { DraftRecommendation, AutoDraftConfig } from '../../services/enhancedDraftEngine';
import GeniusAiChat from './GeniusAiChat';
import './EnhancedSnakeDraftRoom.css';

interface Props {
  league: League;
  userTeamId: number;
  onExit: () => void;

}

interface PlayerRowProps {
  player: Player;
  isInQueue: boolean;
  isInWatchlist: boolean;
  recommendations: DraftRecommendation[];
  onSelect: () => void;
  onAddToQueue: () => void;
  onRemoveFromQueue: () => void;
  onAddToWatchlist: () => void;
  onRemoveFromWatchlist: () => void;}

const PlayerRow: React.FC<PlayerRowProps> = ({ player,
  isInQueue,
  isInWatchlist,
  recommendations,
  onSelect,
  onAddToQueue,
  onRemoveFromQueue,
  onAddToWatchlist,
  onRemoveFromWatchlist
 }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const recommendation = recommendations.find((rec: any) => rec.player.id === player.id);
  
  return (
    <div className={`player-row ${recommendation ? 'recommended' : ''}`}>
      <div className="player-info sm:px-4 md:px-6 lg:px-8">
        <div className="player-name sm:px-4 md:px-6 lg:px-8">{player.name}</div>
        <div className="player-details sm:px-4 md:px-6 lg:px-8">
          {player.position} | {player.team} | ADP: {player?.adp || 'N/A'}
          {Boolean(player?.tier) && <span className="tier sm:px-4 md:px-6 lg:px-8">Tier {player?.tier}</span>}
        </div>
        {recommendation && (
          <div className="recommendation sm:px-4 md:px-6 lg:px-8">
            <span className="rec-confidence sm:px-4 md:px-6 lg:px-8">Confidence: {(recommendation.confidence * 100).toFixed(0)}%</span>
            <span className="rec-reason sm:px-4 md:px-6 lg:px-8">{recommendation.reasoning}</span>
          </div>
        )}
      </div>
      
      <div className="player-actions sm:px-4 md:px-6 lg:px-8">
        <button 
          className="btn-draft sm:px-4 md:px-6 lg:px-8"
          onClick={onSelect}
         aria-label="Action button">
          Draft
        </button>
        
        {isInQueue ? (
          <button 
            className="btn-queue remove sm:px-4 md:px-6 lg:px-8"
            onClick={onRemoveFromQueue}
           aria-label="Action button">
            Remove from Queue
          </button>
        ) : (
          <button 
            className="btn-queue add sm:px-4 md:px-6 lg:px-8"
            onClick={onAddToQueue}
           aria-label="Action button">
            Add to Queue
          </button>
        )}
        
        {isInWatchlist ? (
          <button 
            className="btn-watchlist remove sm:px-4 md:px-6 lg:px-8"
            onClick={onRemoveFromWatchlist}
           aria-label="Action button">
            Remove from Watchlist
          </button>
        ) : (
          <button 
            className="btn-watchlist add sm:px-4 md:px-6 lg:px-8"
            onClick={onAddToWatchlist}
           aria-label="Action button">
            Add to Watchlist
          </button>
        )}
      </div>
    </div>
  );
};

interface AutoDraftPanelProps {
  autoDraftEnabled: boolean;
  autoDraftConfig: AutoDraftConfig;
  onEnableAutoDraft: (config?: Partial<AutoDraftConfig>) => void;
  onDisableAutoDraft: () => void;

}

const AutoDraftPanel: React.FC<AutoDraftPanelProps> = ({
  autoDraftEnabled,
  autoDraftConfig,
  onEnableAutoDraft,
  onDisableAutoDraft
}) => {
  const [strategy, setStrategy] = useState(autoDraftConfig.strategy);
  const [riskTolerance, setRiskTolerance] = useState(autoDraftConfig.riskTolerance);
  const [avoidInjuryProne, setAvoidInjuryProne] = useState(autoDraftConfig.avoidInjuryProne);
  
  const handleConfigChange = () => {
    onEnableAutoDraft({
      strategy,
      riskTolerance,
      avoidInjuryProne
    });
  };

  return (
    <div className="auto-draft-panel sm:px-4 md:px-6 lg:px-8">
      <h3>Auto-Draft Settings</h3>
      
      <div className="settings-grid sm:px-4 md:px-6 lg:px-8">
        <div className="setting-group sm:px-4 md:px-6 lg:px-8">
          <label htmlFor="strategy-select">Strategy:</label>
          <select 
            id="strategy-select"
            value={strategy} 
            onChange={(e: any) => setStrategy(e.target.value as AutoDraftConfig['strategy'])}
            <option value="BPA">Best Player Available</option>
            <option value="POSITIONAL_NEED">Positional Need</option>
            <option value="VALUE_BASED">Value Based</option>
            <option value="CONSERVATIVE">Conservative</option>
            <option value="AGGRESSIVE">Aggressive</option>
          </select>
        </div>
        
        <div className="setting-group sm:px-4 md:px-6 lg:px-8">
          <label htmlFor="risk-select">Risk Tolerance:</label>
          <select 
            id="risk-select"
            value={riskTolerance} 
            onChange={(e: any) => setRiskTolerance(e.target.value as AutoDraftConfig['riskTolerance'])}
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        
        <div className="setting-group sm:px-4 md:px-6 lg:px-8">
          <label>
            <input
              type="checkbox"
              checked={avoidInjuryProne}
              onChange={(e: any) => setAvoidInjuryProne(e.target.checked)}
            Avoid Injury-Prone Players
          </label>
        </div>
      </div>
      
      <div className="auto-draft-controls sm:px-4 md:px-6 lg:px-8">
        {autoDraftEnabled ? (
          <button 
            className="btn-auto-draft disable sm:px-4 md:px-6 lg:px-8"
            onClick={onDisableAutoDraft}
           aria-label="Action button">
            Disable Auto-Draft
          </button>
        ) : (
          <button 
            className="btn-auto-draft enable sm:px-4 md:px-6 lg:px-8"
            onClick={handleConfigChange}
           aria-label="Action button">
            Enable Auto-Draft
          </button>
        )}
      </div>
    </div>
  );
};

const EnhancedSnakeDraftRoom: React.FC<Props> = ({ league, userTeamId, onExit }) => {
  const [activeTab, setActiveTab] = useState<'players' | 'queue' | 'watchlist' | 'analytics' | 'ai-assistant'>('players');
  const [showAiChat, setShowAiChat] = useState(false);
  
  const draftState: SnakeDraftState = useSnakeDraft({
    league,
    userTeamId,
    autoDraftTimeout: 60000,
    enableAnalytics: true
  });

  const {
    currentPick,
    currentRound,
    currentTeamId,
    isComplete,
    autoDraftEnabled,
    autoDraftConfig,
    draftAnalysis,
    recommendations,
    filteredPlayers,
    searchTerm,
    positionFilter,
    tierFilter,
    draftQueue,
    watchlist,
    makePick,
    enableAutoDraft,
    disableAutoDraft,
    addToQueue,
    removeFromQueue,
    addToWatchlist,
    removeFromWatchlist,
    setPositionFilter,
    setTierFilter,
    setSearchTerm,
    getRecommendations
  } = draftState;

  // Get current team info
  const currentTeam = league.teams.find((team: any) => team.id === currentTeamId);
  const userTeam = league.teams.find((team: any) => team.id === userTeamId);
  const isUserTurn = currentTeamId === userTeamId;

  // Update recommendations when it's user's turn
  useEffect(() => {
    if (isUserTurn && !isComplete) {
      getRecommendations();
    }
  }, [isUserTurn, isComplete, getRecommendations]);

  const renderPlayersList = () => {
    let playersToShow: Player[];
    
    if (activeTab === 'queue') {
      playersToShow = draftQueue
        .map((id: any) => filteredPlayers.find((p: any) => p.id === id))
        .filter((player): player is Player => Boolean(player));
    } else if (activeTab === 'watchlist') {
      playersToShow = watchlist
        .map((id: any) => filteredPlayers.find((p: any) => p.id === id))
        .filter((player): player is Player => Boolean(player));
    } else {
      playersToShow = filteredPlayers;

    return (
      <div className="players-list sm:px-4 md:px-6 lg:px-8">
        {playersToShow.map((player: any) => (
          <PlayerRow
            key={player.id}
            player={player}
            isInQueue={draftQueue.includes(player.id)}
            isInWatchlist={watchlist.includes(player.id)}
            recommendations={recommendations}
            onSelect={() => makePick(player.id)}
            onAddToQueue={() => addToQueue(player.id)}
            onRemoveFromQueue={() => removeFromQueue(player.id)}
            onAddToWatchlist={() => addToWatchlist(player.id)}
            onRemoveFromWatchlist={() => removeFromWatchlist(player.id)}
          />
        ))}
      </div>
    );
  };

  const renderAnalytics = () => (
    <div className="analytics-panel sm:px-4 md:px-6 lg:px-8">
      <h3>Draft Analytics</h3>
      
      {draftAnalysis && (
        <div className="position-analysis sm:px-4 md:px-6 lg:px-8">
          <h4>Position Analysis</h4>
          <div className="analysis-grid sm:px-4 md:px-6 lg:px-8">
            <div className="metric sm:px-4 md:px-6 lg:px-8">
              <span>Picks Until Next Turn:</span>
              <span>{draftAnalysis.turnAnalysis.nextPickIn}</span>
            </div>
            <div className="metric sm:px-4 md:px-6 lg:px-8">
              <span>Strategic Value:</span>
              <span className={draftAnalysis.turnAnalysis.strategicValue > 0.7 ? 'high' : draftAnalysis.turnAnalysis.strategicValue > 0.4 ? 'medium' : 'low'}>
                {(draftAnalysis.turnAnalysis.strategicValue * 100).toFixed(1)}%
              </span>
            </div>
            <div className="metric sm:px-4 md:px-6 lg:px-8">
              <span>Turn Position:</span>
              <span>{draftAnalysis.turnAnalysis.position}</span>
            </div>
          </div>
          
          {draftAnalysis.turnAnalysis.recommendations.length > 0 && (
            <div className="turn-recommendations sm:px-4 md:px-6 lg:px-8">
              <h5>Position Recommendations:</h5>
              {draftAnalysis.turnAnalysis.recommendations.map((rec, index) => (
                <div key={`rec-${index}`} className="turn-recommendation sm:px-4 md:px-6 lg:px-8">
                  {rec}
                </div>
              ))}
            </div>
          )}
          
          {draftAnalysis.pickTrading.suggestedTrades.length > 0 && (
            <div className="trade-suggestions sm:px-4 md:px-6 lg:px-8">
              <h5>Trade Suggestions:</h5>
              {draftAnalysis.pickTrading.suggestedTrades.map((trade, index) => (
                <div key={`trade-${index}`} className="trade-suggestion sm:px-4 md:px-6 lg:px-8">
                  {trade.rationale} (Value: {trade.valueGained.toFixed(2)})
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {recommendations.length > 0 && (
        <div className="recommendations sm:px-4 md:px-6 lg:px-8">
          <h4>Top Recommendations</h4>
          {recommendations.slice(0, 5).map((rec, index) => (
            <div key={rec.player.id} className="recommendation-item sm:px-4 md:px-6 lg:px-8">
              <div className="rec-rank sm:px-4 md:px-6 lg:px-8">#{index + 1}</div>
              <div className="rec-player sm:px-4 md:px-6 lg:px-8">{rec.player.name}</div>
              <div className="rec-confidence sm:px-4 md:px-6 lg:px-8">{(rec.confidence * 100).toFixed(0)}%</div>
              <div className="rec-reasoning sm:px-4 md:px-6 lg:px-8">{rec.reasoning}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (isComplete) {
    return (
      <div className="draft-complete sm:px-4 md:px-6 lg:px-8">
        <h2>Draft Complete!</h2>
        <button onClick={onExit} aria-label="Action button">Return to League</button>
      </div>
    );

  return (
    <div className="enhanced-snake-draft-room sm:px-4 md:px-6 lg:px-8">
      <header className="draft-header sm:px-4 md:px-6 lg:px-8">
        <div className="draft-status sm:px-4 md:px-6 lg:px-8">
          <h2>Snake Draft - {league.name}</h2>
          <div className="pick-info sm:px-4 md:px-6 lg:px-8">
            Pick {currentPick} (Round {currentRound})
          </div>
          <div className="current-team sm:px-4 md:px-6 lg:px-8">
            {isUserTurn ? 'Your Turn!' : `${currentTeam?.name || 'Unknown'}'s Turn`}
          </div>
        </div>
        
        <div className="draft-controls sm:px-4 md:px-6 lg:px-8">
          <button 
            className="ai-chat-toggle sm:px-4 md:px-6 lg:px-8"
            onClick={() => setShowAiChat(!showAiChat)}
          >
            {showAiChat ? 'Hide' : 'Show'} Coach
          </button>
          <button onClick={onExit} aria-label="Action button">Exit Draft</button>
        </div>
      </header>

      <div className={`draft-content ${showAiChat ? 'with-ai-panel' : ''}`}>
        {showAiChat && (
          <div className="ai-chat-panel sm:px-4 md:px-6 lg:px-8">
            <GeniusAiChat
              currentRoster={userTeam?.roster || []}
              availablePlayers={filteredPlayers}
              currentRound={currentRound}
              currentPick={currentPick}
              leagueSettings={league.settings || {}}
              draftHistory={league.draftPicks || []}
              onPlayerSelect={(player: any) => makePick(player.id)}
            />
          </div>
        )}
        <div className="left-panel sm:px-4 md:px-6 lg:px-8">
          <div className="filters sm:px-4 md:px-6 lg:px-8">
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
            
            <select 
              value={positionFilter} 
              onChange={(e: any) => setPositionFilter(e.target.value as PlayerPosition | 'ALL')}
            >
              <option value="ALL">All Positions</option>
              <option value="QB">QB</option>
              <option value="RB">RB</option>
              <option value="WR">WR</option>
              <option value="TE">TE</option>
              <option value="K">K</option>
              <option value="DST">DST</option>
            </select>
            
            <select 
              value={tierFilter} 
              onChange={(e: any) => setTierFilter(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
            >
              <option value="ALL">All Tiers</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((tier: any) => (
                <option key={tier} value={tier}>Tier {tier}</option>
              ))}
            </select>
          </div>

          <div className="tabs sm:px-4 md:px-6 lg:px-8">
            <button 
              className={activeTab === 'players' ? 'active' : ''}
              onClick={() => setActiveTab('players')}
              Available Players ({filteredPlayers.length})
            </button>
            <button 
              className={activeTab === 'queue' ? 'active' : ''}
              onClick={() => setActiveTab('queue')}
              Queue ({draftQueue.length})
            </button>
            <button 
              className={activeTab === 'watchlist' ? 'active' : ''}
              onClick={() => setActiveTab('watchlist')}
              Watchlist ({watchlist.length})
            </button>
            <button 
              className={activeTab === 'analytics' ? 'active' : ''}
              onClick={() => setActiveTab('analytics')}
              Analytics
            </button>
            <button 
              className={`ai-tab ${activeTab === 'ai-assistant' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai-assistant')}
              Coach
            </button>
          </div>

          <div className="content-area sm:px-4 md:px-6 lg:px-8">
            {activeTab === 'analytics' ? renderAnalytics() : 
             activeTab === 'ai-assistant' ? (
              <GeniusAiChat
                currentRoster={userTeam?.roster || []}
                availablePlayers={filteredPlayers}
                currentRound={currentRound}
                currentPick={currentPick}
                leagueSettings={league.settings || {}}
                draftHistory={league.draftPicks || []}
                onPlayerSelect={(player: any) => makePick(player.id)}
              />
            ) : renderPlayersList()}
          </div>
        </div>

        <div className="right-panel sm:px-4 md:px-6 lg:px-8">
          <AutoDraftPanel
            autoDraftEnabled={autoDraftEnabled}
            autoDraftConfig={autoDraftConfig}
            onEnableAutoDraft={enableAutoDraft}
            onDisableAutoDraft={disableAutoDraft}
          />

          {userTeam && (
            <div className="team-roster sm:px-4 md:px-6 lg:px-8">
              <h3>Your Roster</h3>
              <div className="roster-slots sm:px-4 md:px-6 lg:px-8">
                {userTeam.roster?.map((player, index) => (
                  <div key={index} className="roster-slot sm:px-4 md:px-6 lg:px-8">
                    <span className="position sm:px-4 md:px-6 lg:px-8">{player.position}</span>
                    <span className="name sm:px-4 md:px-6 lg:px-8">{player.name}</span>
                  </div>
                )) || <div>No players drafted yet</div>}
              </div>
            </div>
          )}

          <div className="draft-board sm:px-4 md:px-6 lg:px-8">
            <h3>Recent Picks</h3>
            <div className="recent-picks sm:px-4 md:px-6 lg:px-8">
              {league.draftPicks
                .filter((pick: any) => pick.playerId)
                .slice(-10)
                .reverse()
                .map((pick, index) => {
                  const team = league.teams.find((t: any) => t.id === pick.teamId);
                  return (
                    <div key={index} className="pick-item sm:px-4 md:px-6 lg:px-8">
                      <span className="pick-number sm:px-4 md:px-6 lg:px-8">{pick.overall}</span>
                      <span className="team-name sm:px-4 md:px-6 lg:px-8">{team?.name}</span>
                      <span className="player-name sm:px-4 md:px-6 lg:px-8">Player #{pick.playerId}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EnhancedSnakeDraftRoomWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <EnhancedSnakeDraftRoom {...props} />
  </ErrorBoundary>
);

export default React.memo(EnhancedSnakeDraftRoomWithErrorBoundary);
