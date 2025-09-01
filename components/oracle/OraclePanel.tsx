/**
 * Oracle Panel Component
 * Main interface for AI-powered predictions and insights
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { BrainCircuit, TrendingUp, Trophy, Sparkles, AlertTriangle } from &apos;lucide-react&apos;;
import { useAppState } from &apos;../../hooks/useAppState&apos;;
import { useLeague } from &apos;../../hooks/useLeague&apos;;
import { Player } from &apos;../../types&apos;;

interface OraclePrediction {
}
  id: string;
  type: &apos;player&apos; | &apos;team&apos; | &apos;matchup&apos; | &apos;trade&apos;;
  confidence: number;
  prediction: string;
  reasoning: string[];
  timestamp: Date;

}

export const OraclePanel: React.FC = () => {
}
  const { state, dispatch } = useAppState();
  const { league, myTeam } = useLeague();
  const [activeTab, setActiveTab] = React.useState<&apos;predictions&apos; | &apos;insights&apos; | &apos;challenge&apos;>(&apos;predictions&apos;);
  const [userPrediction, setUserPrediction] = React.useState(&apos;&apos;);
  const [oracleScore, setOracleScore] = React.useState(0);
  const [userScore, setUserScore] = React.useState(0);
  
  // Mock predictions
  const predictions: OraclePrediction[] = [
    {
}
      id: &apos;1&apos;,
      type: &apos;player&apos;,
      confidence: 85,
      prediction: &apos;CeeDee Lamb will score 25+ fantasy points this week&apos;,
      reasoning: [
        &apos;Facing a bottom-5 pass defense&apos;,
        &apos;Averaging 10 targets per game&apos;,
        &apos;Red zone target share of 28%&apos;
      ],
      timestamp: new Date()
    },
    {
}
      id: &apos;2&apos;,
      type: &apos;team&apos;,
      confidence: 72,
      prediction: &apos;Your team has a 68% chance to win this week&apos;,
      reasoning: [
        &apos;Favorable matchups at RB positions&apos;,
        &apos;Opponent missing key players&apos;,
        &apos;Historical performance in similar matchups&apos;
      ],
      timestamp: new Date()
    },
    {
}
      id: &apos;3&apos;,
      type: &apos;trade&apos;,
      confidence: 90,
      prediction: &apos;Trade Alert: Sell high on Josh Jacobs&apos;,
      reasoning: [
        &apos;Peak value after recent performances&apos;,
        &apos;Tough schedule ahead&apos;,
        &apos;Potential workload concerns&apos;
      ],
      timestamp: new Date()

  ];
  
  const insights = [
    {
}
      title: &apos;Sleeper Alert&apos;,
      content: &apos;Jaylen Warren is projected to outperform his ranking by 15+ spots&apos;,
      icon: <Sparkles className="w-5 h-5 text-yellow-400 sm:px-4 md:px-6 lg:px-8" />
    },
    {
}
      title: &apos;Injury Impact&apos;,
      content: &apos;Monitor Travis Kelce\&apos;s practice status - 30% performance drop if limited&apos;,
      icon: <AlertTriangle className="w-5 h-5 text-red-400 sm:px-4 md:px-6 lg:px-8" />
    },
    {
}
      title: &apos;Weather Factor&apos;,
      content: &apos;High winds expected in BUF vs MIA - favor running backs&apos;,
      icon: <TrendingUp className="w-5 h-5 text-blue-400 sm:px-4 md:px-6 lg:px-8" />

  ];
  
  const handleChallenge = () => {
}
    // Submit user prediction to challenge the Oracle
    if (!userPrediction) return;
    
    dispatch({
}
      type: &apos;ADD_NOTIFICATION&apos;,
      payload: {
}
        message: &apos;Prediction submitted! Check back after games to see results.&apos;,
        type: &apos;INFO&apos;

    });
    
    setUserPrediction(&apos;&apos;);
  };
  
  const renderPredictions = () => (
    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
      {predictions.map((pred: any) => (
}
        <motion.div
          key={pred.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8"
        >
          <div className="flex items-start justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
            <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-center gap-2 mb-1 sm:px-4 md:px-6 lg:px-8">
                <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded sm:px-4 md:px-6 lg:px-8">
                  {pred.type.toUpperCase()}
                </span>
                <span className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                  {pred.confidence}% confidence
                </span>
              </div>
              <h3 className="font-semibold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                {pred.prediction}
              </h3>
            </div>
            <div className="text-right sm:px-4 md:px-6 lg:px-8">
              <div className={`text-2xl font-bold ${
}
                pred.confidence >= 80 ? &apos;text-green-400&apos; :
                pred.confidence >= 60 ? &apos;text-yellow-400&apos; :
                &apos;text-red-400&apos;
              }`}>
                {pred.confidence}%
              </div>
            </div>
          </div>
          
          <div className="mt-3 space-y-1 sm:px-4 md:px-6 lg:px-8">
            <p className="text-xs font-medium text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Reasoning:</p>
            <ul className="space-y-1 sm:px-4 md:px-6 lg:px-8">
              {pred.reasoning.map((reason, idx) => (
}
                <li key={idx} className="text-xs text-[var(--text-secondary)] flex items-start gap-2 sm:px-4 md:px-6 lg:px-8">
                  <span className="text-cyan-400 mt-0.5 sm:px-4 md:px-6 lg:px-8">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );
  
  const renderInsights = () => (
    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
      {insights.map((insight, idx) => (
}
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-black/20 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8"
        >
          <div className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
            <div className="mt-1 sm:px-4 md:px-6 lg:px-8">{insight.icon}</div>
            <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
              <h3 className="font-semibold text-[var(--text-primary)] mb-1 sm:px-4 md:px-6 lg:px-8">
                {insight.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                {insight.content}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
  
  const renderChallenge = () => (
    <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
      {/* Score Board */}
      <div className="grid grid-cols-2 gap-4 sm:px-4 md:px-6 lg:px-8">
        <div className="bg-black/20 rounded-lg p-4 text-center sm:px-4 md:px-6 lg:px-8">
          <div className="text-3xl font-bold text-cyan-400 sm:px-4 md:px-6 lg:px-8">{userScore}</div>
          <div className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Your Score</div>
        </div>
        <div className="bg-black/20 rounded-lg p-4 text-center sm:px-4 md:px-6 lg:px-8">
          <div className="text-3xl font-bold text-purple-400 sm:px-4 md:px-6 lg:px-8">{oracleScore}</div>
          <div className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Oracle Score</div>
        </div>
      </div>
      
      {/* Make Prediction */}
      <div className="bg-black/20 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
        <h3 className="font-semibold text-[var(--text-primary)] mb-3 sm:px-4 md:px-6 lg:px-8">
          Make Your Prediction
        </h3>
        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
          <select className="w-full px-3 py-2 bg-black/20 border border-[var(--panel-border)] rounded text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
            <option>Player Performance</option>
            <option>Game Outcome</option>
            <option>Season Stats</option>
          </select>
          
          <textarea
            value={userPrediction}
            onChange={(e: any) => setUserPrediction(e.target.value)}
            className="w-full px-3 py-2 bg-black/20 border border-[var(--panel-border)] rounded text-[var(--text-primary)] h-24 resize-none sm:px-4 md:px-6 lg:px-8"
          />
          
          <button
            onClick={handleChallenge}
            className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded font-medium hover:opacity-90 transition-opacity sm:px-4 md:px-6 lg:px-8"
           aria-label="Action button">
            Submit Prediction
          </button>
        </div>
      </div>
      
      {/* Recent Challenges */}
      <div className="bg-black/20 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
        <h3 className="font-semibold text-[var(--text-primary)] mb-3 sm:px-4 md:px-6 lg:px-8">
          Recent Challenges
        </h3>
        <div className="space-y-2 text-sm sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
            <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Week 1: Player Points</span>
            <span className="text-green-400 sm:px-4 md:px-6 lg:px-8">Won (+1)</span>
          </div>
          <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
            <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Week 2: Game Outcome</span>
            <span className="text-red-400 sm:px-4 md:px-6 lg:px-8">Lost (0)</span>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="p-6 sm:px-4 md:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 sm:px-4 md:px-6 lg:px-8">
        <BrainCircuit className="w-8 h-8 text-cyan-400 sm:px-4 md:px-6 lg:px-8" />
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
            The Oracle
          </h2>
          <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
            AI-powered predictions and insights
          </p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6 sm:px-4 md:px-6 lg:px-8">
        {([&apos;predictions&apos;, &apos;insights&apos;, &apos;challenge&apos;] as const).map((tab: any) => (
}
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Content */}
      <div className="min-h-[400px] sm:px-4 md:px-6 lg:px-8">
        {activeTab === &apos;predictions&apos; && renderPredictions()}
        {activeTab === &apos;insights&apos; && renderInsights()}
        {activeTab === &apos;challenge&apos; && renderChallenge()}
      </div>
    </div>
  );
};

const OraclePanelWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OraclePanel {...props} />
  </ErrorBoundary>
);

export default React.memo(OraclePanelWithErrorBoundary);