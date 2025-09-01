/**
 * Trade Analysis Dashboard Component
 * Comprehensive trade evaluation interface with fair value calculations and recommendations
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo, useState, useEffect } from &apos;react&apos;;
import { 
}
  useTradeAnalysis, 
  useTradeComparison, 
  useSingleTradeAnalysis,
//   useTradeRecommendations 
} from &apos;../../hooks/useTradeAnalysis&apos;;
import { TradeProposal, TradeAnalysis, FantasyRoster } from &apos;../../services/tradeAnalysisService&apos;;

// Type aliases for better code organization
type TradeAction = &apos;accept&apos; | &apos;reject&apos; | &apos;counter&apos;;

// Dashboard props interface
interface TradeAnalysisDashboardProps {
}
  currentRoster: FantasyRoster;
  opponentRoster?: FantasyRoster;
  activeProposals?: TradeProposal[];
  onTradeAction?: (tradeId: string, action: TradeAction) => void;
  className?: string;

// Component interfaces
}

interface TradeScoreDisplayProps {
}
  analysis: TradeAnalysis;
  compact?: boolean;

interface PlayerValueCardProps {
}
  player: {
}
    playerId: string;
    playerName: string;
    position: string;
    team: string;
    currentValue: number;
    projectedValue: number;
    confidence: number;
  };
  isGiving: boolean;

interface TradeRecommendationProps {
}
  analysis: TradeAnalysis;
  onAccept?: () => void;
  onReject?: () => void;
  onCounter?: () => void;

// Main dashboard component
}

const TradeAnalysisDashboard: React.FC<TradeAnalysisDashboardProps> = ({
}
  currentRoster,
  opponentRoster,
  activeProposals = [],
  onTradeAction,
  className = &apos;&apos;
}: any) => {
}
  const [selectedTab, setSelectedTab] = useState<&apos;analyze&apos; | &apos;compare&apos; | &apos;recommendations&apos;>(&apos;analyze&apos;);
  const [selectedProposal, setSelectedProposal] = useState<TradeProposal | null>(null);
  const [customGivingPlayers, setCustomGivingPlayers] = useState<string[]>([]);
  const [customReceivingPlayers, setCustomReceivingPlayers] = useState<string[]>([]);

  // Hooks
  const tradeAnalysis = useTradeAnalysis({ autoRefresh: true, refreshInterval: 300000 });
  const tradeComparison = useTradeComparison();
  const singleTradeAnalysis = useSingleTradeAnalysis();
  const tradeRecommendations = useTradeRecommendations();

  // Initialize recommendations
  useEffect(() => {
}
    tradeRecommendations.generateRecommendations(currentRoster, {}, 1);
  }, [currentRoster]);

  // Handle proposal selection
  const handleProposalSelect = async () => {
}
    try {
}

    if (!opponentRoster) return;
    
    setSelectedProposal(proposal);
    await tradeAnalysis.analyzeTradeProposal(proposal, currentRoster, opponentRoster);

    } catch (error) {
}
      console.error(&apos;Error in handleProposalSelect:&apos;, error);

  };

  // Handle custom trade analysis
  const handleCustomTradeAnalysis = async () => {
}
    try {
}

    if (!opponentRoster || customGivingPlayers.length === 0 || customReceivingPlayers.length === 0) {
}
      return;
    
    } catch (error) {
}
      console.error(&apos;Error in handleCustomTradeAnalysis:&apos;, error);

    } catch (error) {
}
        console.error(error);
    }await singleTradeAnalysis.analyzeTradeByPlayers(
      customGivingPlayers,
      customReceivingPlayers,
      currentRoster,
      opponentRoster,
      {
}
        league: &apos;custom&apos;,
        week: 1,
        season: 2024,
        tradeDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    );
  };

  // Handle trade action
  const handleTradeAction = (action: TradeAction) => {
}
    if (selectedProposal && onTradeAction) {
}
      onTradeAction(selectedProposal.id, action);

  };

  return (
    <div className={`trade-analysis-dashboard ${className}`}>
      {/* Header */}
      <div className="dashboard-header sm:px-4 md:px-6 lg:px-8">
        <h2 className="dashboard-title sm:px-4 md:px-6 lg:px-8">Trade Analysis Center</h2>
        <p className="dashboard-subtitle sm:px-4 md:px-6 lg:px-8">
          Comprehensive trade evaluation with fair value calculations and AI-powered recommendations
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-tabs sm:px-4 md:px-6 lg:px-8">
        <button
          className={`tab-button ${selectedTab === &apos;analyze&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setSelectedTab(&apos;analyze&apos;)}
          Analyze Trades
        </button>
        <button
          className={`tab-button ${selectedTab === &apos;compare&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setSelectedTab(&apos;compare&apos;)}
          Compare Offers
        </button>
        <button
          className={`tab-button ${selectedTab === &apos;recommendations&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setSelectedTab(&apos;recommendations&apos;)}
//           Recommendations
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content sm:px-4 md:px-6 lg:px-8">
        {selectedTab === &apos;analyze&apos; && (
}
          <AnalyzeTradesTab>
            activeProposals={activeProposals}
            selectedProposal={selectedProposal}
            onProposalSelect={handleProposalSelect}
            tradeAnalysis={tradeAnalysis}
            singleTradeAnalysis={singleTradeAnalysis}
            customGivingPlayers={customGivingPlayers}
            customReceivingPlayers={customReceivingPlayers}
            onCustomGivingChange={setCustomGivingPlayers}
            onCustomReceivingChange={setCustomReceivingPlayers}
            onCustomAnalyze={handleCustomTradeAnalysis}
            onTradeAction={handleTradeAction}
            currentRoster={currentRoster}
          />
        )}

        {selectedTab === &apos;compare&apos; && (
}
          <CompareTradesTab>
            tradeComparison={tradeComparison}
            currentRoster={currentRoster}
            opponentRoster={opponentRoster}
          />
        )}

        {selectedTab === &apos;recommendations&apos; && (
}
          <RecommendationsTab>
            tradeRecommendations={tradeRecommendations}
            currentRoster={currentRoster}
          />
        )}
      </div>
    </div>
  );
};

// Analyze trades tab component
const AnalyzeTradesTab: React.FC<{
}
  activeProposals: TradeProposal[];
  selectedProposal: TradeProposal | null;
  onProposalSelect: (proposal: TradeProposal) => void;
  tradeAnalysis: any;
  singleTradeAnalysis: any;
  customGivingPlayers: string[];
  customReceivingPlayers: string[];
  onCustomGivingChange: (players: string[]) => void;
  onCustomReceivingChange: (players: string[]) => void;
  onCustomAnalyze: () => void;
  onTradeAction: (action: &apos;accept&apos; | &apos;reject&apos; | &apos;counter&apos;) => void;
  currentRoster: FantasyRoster;
}> = ({
}
  activeProposals,
  selectedProposal,
  onProposalSelect,
  tradeAnalysis,
  singleTradeAnalysis,
  customGivingPlayers,
  customReceivingPlayers,
  onCustomGivingChange,
  onCustomReceivingChange,
  onCustomAnalyze,
  onTradeAction,
//   currentRoster
}: any) => {
}
  return (
    <div className="analyze-trades-tab sm:px-4 md:px-6 lg:px-8">
      {/* Active Proposals Section */}
      <div className="proposals-section sm:px-4 md:px-6 lg:px-8">
        <h3>Active Trade Proposals</h3>
        {activeProposals.length > 0 ? (
}
          <div className="proposals-list sm:px-4 md:px-6 lg:px-8">
            {activeProposals.map((proposal: any) => (
}
              <div
                key={proposal.id}
                className={`proposal-card ${selectedProposal?.id === proposal.id ? &apos;selected&apos; : &apos;&apos;}`}
                onClick={() => onProposalSelect(proposal)}
                onKeyDown={(e: any) => {
}
                  if (e.key === &apos;Enter&apos; || e.key === &apos; &apos;) {
}
                    onProposalSelect(proposal);

                }}
                role="button"
                tabIndex={0}
              >
                <div className="proposal-header sm:px-4 md:px-6 lg:px-8">
                  <span className="proposal-id sm:px-4 md:px-6 lg:px-8">Trade #{proposal.id}</span>
                  <span className={`proposal-status ${proposal?.status}`}>
                    {proposal?.status}
                  </span>
                </div>
                <div className="proposal-details sm:px-4 md:px-6 lg:px-8">
                  <div className="proposal-side sm:px-4 md:px-6 lg:px-8">
                    <span className="side-label sm:px-4 md:px-6 lg:px-8">Giving:</span>
                    <span className="player-count sm:px-4 md:px-6 lg:px-8">{proposal.givingPlayers.length} players</span>
                  </div>
                  <div className="proposal-side sm:px-4 md:px-6 lg:px-8">
                    <span className="side-label sm:px-4 md:px-6 lg:px-8">Receiving:</span>
                    <span className="player-count sm:px-4 md:px-6 lg:px-8">{proposal.receivingPlayers.length} players</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-proposals sm:px-4 md:px-6 lg:px-8">
            <p>No active trade proposals</p>
          </div>
        )}
      </div>

      {/* Custom Trade Builder */}
      <div className="custom-trade-section sm:px-4 md:px-6 lg:px-8">
        <h3>Custom Trade Analyzer</h3>
        <div className="custom-trade-builder sm:px-4 md:px-6 lg:px-8">
          <div className="trade-side sm:px-4 md:px-6 lg:px-8">
            <label>Players You&apos;re Giving:</label>
            <PlayerSelector>
              availablePlayers={currentRoster.players}
              selectedPlayers={customGivingPlayers}
              onSelectionChange={onCustomGivingChange}
            />
          </div>
          <div className="trade-side sm:px-4 md:px-6 lg:px-8">
            <label>Players You&apos;re Receiving:</label>
            <PlayerSelector>
              availablePlayers={[]} // Would get from opponent roster
              selectedPlayers={customReceivingPlayers}
              onSelectionChange={onCustomReceivingChange}
            />
          </div>
          <button
            className="analyze-button sm:px-4 md:px-6 lg:px-8"
            onClick={onCustomAnalyze}
            disabled={customGivingPlayers.length === 0 || customReceivingPlayers.length === 0}
           aria-label="Action button">
            Analyze Custom Trade
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {(tradeAnalysis.currentAnalysis || singleTradeAnalysis.analysis) && (
}
        <div className="analysis-results sm:px-4 md:px-6 lg:px-8">
          <h3>Trade Analysis Results</h3>
          <TradeAnalysisDisplay>
            analysis={tradeAnalysis.currentAnalysis || singleTradeAnalysis.analysis}
            onTradeAction={onTradeAction}
            showActions={!!selectedProposal}
          />
        </div>
      )}

      {/* Loading States */}
      {(tradeAnalysis.isAnalyzing || singleTradeAnalysis.isAnalyzing) && (
}
        <div className="analysis-loading sm:px-4 md:px-6 lg:px-8">
          <div className="loading-spinner sm:px-4 md:px-6 lg:px-8"></div>
          <p>Analyzing trade proposal...</p>
        </div>
      )}

      {/* Error States */}
      {(tradeAnalysis.error || singleTradeAnalysis.error) && (
}
        <div className="analysis-error sm:px-4 md:px-6 lg:px-8">
          <p>Error: {tradeAnalysis.error || singleTradeAnalysis.error}</p>
        </div>
      )}
    </div>
  );
};

// Compare trades tab component
const CompareTradesTab: React.FC<{
}
  tradeComparison: any;
  currentRoster: FantasyRoster;
  opponentRoster?: FantasyRoster;
}> = ({ tradeComparison, currentRoster, opponentRoster }: any) => {
}
  return (
    <div className="compare-trades-tab sm:px-4 md:px-6 lg:px-8">
      <h3>Trade Comparison</h3>
      {tradeComparison.proposals.length > 0 ? (
}
        <div className="comparison-results sm:px-4 md:px-6 lg:px-8">
          <div className="rankings-list sm:px-4 md:px-6 lg:px-8">
            {tradeComparison.rankings.map((ranking: any, index: number) => (
}
              <div key={ranking.tradeId} className="ranking-item sm:px-4 md:px-6 lg:px-8">
                <span className="rank sm:px-4 md:px-6 lg:px-8">#{index + 1}</span>
                <span className="score sm:px-4 md:px-6 lg:px-8">{ranking.score}%</span>
                <span className="recommendation sm:px-4 md:px-6 lg:px-8">{ranking.recommendation}</span>
              </div>
            ))}
          </div>
          {tradeComparison.bestTrade && (
}
            <div className="best-trade sm:px-4 md:px-6 lg:px-8">
              <h4>Best Trade Option</h4>
              <TradeScoreDisplay analysis={tradeComparison.bestTrade} />
            </div>
          )}
        </div>
      ) : (
        <div className="no-comparisons sm:px-4 md:px-6 lg:px-8">
          <p>No trades added for comparison</p>
        </div>
      )}
    </div>
  );
};

// Recommendations tab component
const RecommendationsTab: React.FC<{
}
  tradeRecommendations: any;
  currentRoster: FantasyRoster;
}> = ({ tradeRecommendations }: any) => {
}
  return (
    <div className="recommendations-tab sm:px-4 md:px-6 lg:px-8">
      <h3>Trade Recommendations</h3>
      
      {tradeRecommendations.isGenerating ? (
}
        <div className="recommendations-loading sm:px-4 md:px-6 lg:px-8">
          <div className="loading-spinner sm:px-4 md:px-6 lg:px-8"></div>
          <p>Generating personalized recommendations...</p>
        </div>
      ) : (
        <div className="recommendations-content sm:px-4 md:px-6 lg:px-8">
          <div className="recommendation-section sm:px-4 md:px-6 lg:px-8">
            <h4>Players to Consider Trading</h4>
            <ul className="recommendation-list sm:px-4 md:px-6 lg:px-8">
              {tradeRecommendations.recommendations.playerToTrade.map((rec: any, index: number) => (
}
                <li key={index} className="recommendation-item sm:px-4 md:px-6 lg:px-8">{rec}</li>
              ))}
            </ul>
          </div>

          <div className="recommendation-section sm:px-4 md:px-6 lg:px-8">
            <h4>Players to Target</h4>
            <ul className="recommendation-list sm:px-4 md:px-6 lg:px-8">
              {tradeRecommendations.recommendations.playersToTarget.map((rec: any, index: number) => (
}
                <li key={index} className="recommendation-item sm:px-4 md:px-6 lg:px-8">{rec}</li>
              ))}
            </ul>
          </div>

          <div className="recommendation-section sm:px-4 md:px-6 lg:px-8">
            <h4>Trade Strategies</h4>
            <ul className="recommendation-list sm:px-4 md:px-6 lg:px-8">
              {tradeRecommendations.recommendations.tradeStrategies.map((rec: any, index: number) => (
}
                <li key={index} className="recommendation-item sm:px-4 md:px-6 lg:px-8">{rec}</li>
              ))}
            </ul>
          </div>

          <div className="recommendation-section sm:px-4 md:px-6 lg:px-8">
            <h4>Market Trends</h4>
            <ul className="recommendation-list sm:px-4 md:px-6 lg:px-8">
              {tradeRecommendations.recommendations.marketTrends.map((rec: any, index: number) => (
}
                <li key={index} className="recommendation-item sm:px-4 md:px-6 lg:px-8">{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// Trade analysis display component
const TradeAnalysisDisplay: React.FC<{
}
  analysis: TradeAnalysis;
  onTradeAction?: (action: &apos;accept&apos; | &apos;reject&apos; | &apos;counter&apos;) => void;
  showActions?: boolean;
}> = ({ analysis, onTradeAction, showActions = false }: any) => {
}
  return (
    <div className="trade-analysis-display sm:px-4 md:px-6 lg:px-8">
      {/* Overall Score and Recommendation */}
      <div className="analysis-header sm:px-4 md:px-6 lg:px-8">
        <TradeScoreDisplay analysis={analysis} />
        <TradeRecommendationComponent>
          analysis={analysis}
          onAccept={showActions ? () => onTradeAction?.(&apos;accept&apos;) : undefined}
          onReject={showActions ? () => onTradeAction?.(&apos;reject&apos;) : undefined}
          onCounter={showActions ? () => onTradeAction?.(&apos;counter&apos;) : undefined}
        />
      </div>

      {/* Value Comparison */}
      <div className="value-comparison sm:px-4 md:px-6 lg:px-8">
        <h4>Value Analysis</h4>
        <div className="value-sides sm:px-4 md:px-6 lg:px-8">
          <div className="value-side giving sm:px-4 md:px-6 lg:px-8">
            <h5>Giving ({analysis.analysis.valueComparison.givingSide.totalValue.toFixed(1)})</h5>
            <div className="player-values sm:px-4 md:px-6 lg:px-8">
              {analysis.analysis.valueComparison.givingSide.playerValues.map((player: any) => (
}
                <PlayerValueCard key={player.playerId} player={player} isGiving={true} />
              ))}
            </div>
          </div>
          <div className="value-side receiving sm:px-4 md:px-6 lg:px-8">
            <h5>Receiving ({analysis.analysis.valueComparison.receivingSide.totalValue.toFixed(1)})</h5>
            <div className="player-values sm:px-4 md:px-6 lg:px-8">
              {analysis.analysis.valueComparison.receivingSide.playerValues.map((player: any) => (
}
                <PlayerValueCard key={player.playerId} player={player} isGiving={false} />
              ))}
            </div>
          </div>
        </div>
        <div className="value-difference sm:px-4 md:px-6 lg:px-8">
          <span className={`difference ${analysis.analysis.valueComparison.valueDifference >= 0 ? &apos;positive&apos; : &apos;negative&apos;}`}>
            {analysis.analysis.valueComparison.valueDifference >= 0 ? &apos;+&apos; : &apos;&apos;}
            {analysis.analysis.valueComparison.valueDifference.toFixed(1)} value difference
          </span>
        </div>
      </div>

      {/* Future Projections */}
      <div className="future-projections sm:px-4 md:px-6 lg:px-8">
        <h4>Future Impact</h4>
        <div className="projection-metrics sm:px-4 md:px-6 lg:px-8">
          <div className="metric sm:px-4 md:px-6 lg:px-8">
            <span className="metric-label sm:px-4 md:px-6 lg:px-8">Rest of Season:</span>
            <span className={`metric-value ${analysis.analysis.futureProjections.restOfSeasonProjection.cumulativeAdvantage >= 0 ? &apos;positive&apos; : &apos;negative&apos;}`}>
              {analysis.analysis.futureProjections.restOfSeasonProjection.cumulativeAdvantage >= 0 ? &apos;+&apos; : &apos;&apos;}
              {analysis.analysis.futureProjections.restOfSeasonProjection.cumulativeAdvantage.toFixed(1)} points
            </span>
          </div>
          <div className="metric sm:px-4 md:px-6 lg:px-8">
            <span className="metric-label sm:px-4 md:px-6 lg:px-8">Playoffs:</span>
            <span className={`metric-value ${analysis.analysis.futureProjections.playoffProjection.playoffAdvantage >= 0 ? &apos;positive&apos; : &apos;negative&apos;}`}>
              {analysis.analysis.futureProjections.playoffProjection.playoffAdvantage >= 0 ? &apos;+&apos; : &apos;&apos;}
              {analysis.analysis.futureProjections.playoffProjection.playoffAdvantage.toFixed(1)} points
            </span>
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="risk-assessment sm:px-4 md:px-6 lg:px-8">
        <h4>Risk Analysis</h4>
        <div className="risk-summary sm:px-4 md:px-6 lg:px-8">
          <span className={`risk-level ${analysis.analysis.riskAssessment.overallRisk}`}>
            {analysis.analysis.riskAssessment.overallRisk.replace(&apos;_&apos;, &apos; &apos;)} Risk
          </span>
          <span className="risk-score sm:px-4 md:px-6 lg:px-8">
            Risk Score: {analysis.analysis.riskAssessment.riskScore.toFixed(0)}/100
          </span>
        </div>
        {analysis.analysis.riskAssessment.riskFactors.length > 0 && (
}
          <div className="risk-factors sm:px-4 md:px-6 lg:px-8">
            {analysis.analysis.riskAssessment.riskFactors.map((factor, index) => (
}
              <div key={index} className={`risk-factor ${factor.severity}`}>
                <span className="factor-type sm:px-4 md:px-6 lg:px-8">{factor.type.replace(&apos;_&apos;, &apos; &apos;)}</span>
                <span className="factor-description sm:px-4 md:px-6 lg:px-8">{factor.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reasoning */}
      <div className="analysis-reasoning sm:px-4 md:px-6 lg:px-8">
        <h4>Analysis Summary</h4>
        <p>{analysis.reasoning}</p>
      </div>

      {/* Alternative Offers */}
      {analysis.alternativeOffers && analysis.alternativeOffers.length > 0 && (
}
        <div className="alternative-offers sm:px-4 md:px-6 lg:px-8">
          <h4>Alternative Suggestions</h4>
          <div className="alternatives-list sm:px-4 md:px-6 lg:px-8">
            {analysis.alternativeOffers.map((offer, index) => (
}
              <div key={index} className="alternative-offer sm:px-4 md:px-6 lg:px-8">
                <div className="offer-score sm:px-4 md:px-6 lg:px-8">
                  Score: {offer.fairnessScore.toFixed(1)}%
                </div>
                <div className="offer-reasoning sm:px-4 md:px-6 lg:px-8">
                  {offer.reasoning}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Trade score display component
const TradeScoreDisplay: React.FC<TradeScoreDisplayProps> = ({ analysis, compact = false }: any) => {
}
  const getScoreColor = (score: number) => {
}
    if (score >= 75) return &apos;excellent&apos;;
    if (score >= 60) return &apos;good&apos;;
    if (score >= 40) return &apos;fair&apos;;
    return &apos;poor&apos;;
  };

  const getRecommendationColor = (recommendation: string) => {
}
    switch (recommendation) {
}
      case &apos;accept&apos;: return &apos;accept&apos;;
      case &apos;reject&apos;: return &apos;reject&apos;;
      case &apos;counter&apos;: return &apos;counter&apos;;
      default: return &apos;hold&apos;;

  };

  return (
    <div className={`trade-score-display ${compact ? &apos;compact&apos; : &apos;&apos;}`}>
      <div className="score-container sm:px-4 md:px-6 lg:px-8">
        <div className={`score-circle ${getScoreColor(analysis.fairnessScore)}`}>
          <span className="score-value sm:px-4 md:px-6 lg:px-8">{analysis.fairnessScore.toFixed(0)}</span>
          <span className="score-label sm:px-4 md:px-6 lg:px-8">Fair</span>
        </div>
        <div className={`recommendation ${getRecommendationColor(analysis.recommendation)}`}>
          {analysis.recommendation.toUpperCase()}
        </div>
      </div>
      <div className="confidence-indicator sm:px-4 md:px-6 lg:px-8">
        <span>Confidence: {(analysis.confidence * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
};

// Player value card component
const PlayerValueCard: React.FC<PlayerValueCardProps> = ({ player, isGiving }: any) => {
}
  return (
    <div className={`player-value-card ${isGiving ? &apos;giving&apos; : &apos;receiving&apos;}`}>
      <div className="player-info sm:px-4 md:px-6 lg:px-8">
        <span className="player-name sm:px-4 md:px-6 lg:px-8">{player.playerName}</span>
        <span className="player-details sm:px-4 md:px-6 lg:px-8">{player.position} - {player.team}</span>
      </div>
      <div className="player-values sm:px-4 md:px-6 lg:px-8">
        <div className="value-metric sm:px-4 md:px-6 lg:px-8">
          <span className="value-label sm:px-4 md:px-6 lg:px-8">Current:</span>
          <span className="value-number sm:px-4 md:px-6 lg:px-8">{player.currentValue.toFixed(1)}</span>
        </div>
        <div className="value-metric sm:px-4 md:px-6 lg:px-8">
          <span className="value-label sm:px-4 md:px-6 lg:px-8">Projected:</span>
          <span className="value-number sm:px-4 md:px-6 lg:px-8">{player.projectedValue.toFixed(1)}</span>
        </div>
      </div>
      <div className="confidence-bar sm:px-4 md:px-6 lg:px-8">
        <div 
          className="confidence-fill sm:px-4 md:px-6 lg:px-8" 
          style={{ width: `${player.confidence * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

// Trade recommendation component
const TradeRecommendationComponent: React.FC<TradeRecommendationProps> = ({
}
  analysis,
  onAccept,
  onReject,
//   onCounter
}: any) => {
}
  const getRecommendationStyle = (recommendation: string) => {
}
    switch (recommendation) {
}
      case &apos;accept&apos;: return &apos;recommendation-accept&apos;;
      case &apos;reject&apos;: return &apos;recommendation-reject&apos;;
      case &apos;counter&apos;: return &apos;recommendation-counter&apos;;
      default: return &apos;recommendation-hold&apos;;

  };

  return (
    <div className={`trade-recommendation ${getRecommendationStyle(analysis.recommendation)}`}>
      <div className="recommendation-text sm:px-4 md:px-6 lg:px-8">
        <strong>{analysis.recommendation.toUpperCase()}</strong>
      </div>
      {(onAccept || onReject || onCounter) && (
}
        <div className="recommendation-actions sm:px-4 md:px-6 lg:px-8">
          {onAccept && (
}
            <button className="action-button accept sm:px-4 md:px-6 lg:px-8" onClick={onAccept} aria-label="Action button">
//               Accept
            </button>
          )}
          {onCounter && (
}
            <button className="action-button counter sm:px-4 md:px-6 lg:px-8" onClick={onCounter} aria-label="Action button">
//               Counter
            </button>
          )}
          {onReject && (
}
            <button className="action-button reject sm:px-4 md:px-6 lg:px-8" onClick={onReject} aria-label="Action button">
//               Reject
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Player selector component
const PlayerSelector: React.FC<{
}
  availablePlayers: any[];
  selectedPlayers: string[];
  onSelectionChange: (players: string[]) => void;
  placeholder: string;
}> = ({ availablePlayers, selectedPlayers, onSelectionChange, placeholder }: any) => {
}
  
  if (isLoading) {
}
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
    <div className="player-selector sm:px-4 md:px-6 lg:px-8">
      <div className="selected-players sm:px-4 md:px-6 lg:px-8">
        {selectedPlayers.length > 0 ? (
}
          selectedPlayers.map((playerId: any) => (
            <div key={playerId} className="selected-player sm:px-4 md:px-6 lg:px-8">
              <span>{playerId}</span>
              <button
                onClick={() => onSelectionChange(selectedPlayers.filter((id: any) => id !== playerId))}
                ×
              </button>
            </div>
          ))
        ) : (
          <div className="placeholder sm:px-4 md:px-6 lg:px-8">{placeholder}</div>
        )}
      </div>
      {/* Would add dropdown for available players */}
    </div>
  );
};

const TradeAnalysisDashboardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TradeAnalysisDashboard {...props} />
  </ErrorBoundary>
);

export default React.memo(TradeAnalysisDashboardWithErrorBoundary);
