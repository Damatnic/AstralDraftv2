/**
 * Automated Suggestions Tab
 * AI-powered trade recommendations and alternative offers
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;
import { League, Team, Player } from &apos;../../types&apos;;
import { TradeProposal, TradeAnalysis, ImprovementSuggestion, AlternativeOffer } from &apos;./TradeAnalyzerView&apos;;
import { SearchIcon } from &apos;../icons/SearchIcon&apos;;
import { ArrowRightLeftIcon } from &apos;../icons/ArrowRightLeftIcon&apos;;
import { TrendingUpIcon } from &apos;../icons/TrendingUpIcon&apos;;
import { BrainCircuitIcon } from &apos;../icons/BrainCircuitIcon&apos;;
import { CheckIcon } from &apos;../icons/CheckIcon&apos;;

interface AutomatedSuggestionsTabProps {
}
    proposal: TradeProposal | null;
    analysis: TradeAnalysis | null;
    league: League;
    currentTeam: Team;
    onProposalUpdate: (proposal: TradeProposal) => void;
    dispatch: React.Dispatch<any>;

}

interface SmartSuggestion {
}
    id: string;
    type: &apos;balance&apos; | &apos;upgrade&apos; | &apos;need&apos; | &apos;value&apos;;
    title: string;
    description: string;
    confidence: number;
    impact: number;
    players?: Player[];
    reasoning: string;}

const AutomatedSuggestionsTab: React.FC<AutomatedSuggestionsTabProps> = ({
}
    proposal,
    analysis,
    league,
    currentTeam,
    onProposalUpdate,
//     dispatch
}: any) => {
}
    const [selectedSuggestion, setSelectedSuggestion] = React.useState<SmartSuggestion | null>(null);
    const [showAlternatives, setShowAlternatives] = React.useState(false);

    // Generate smart suggestions based on analysis
    const smartSuggestions: SmartSuggestion[] = React.useMemo(() => {
}
        if (!proposal || !analysis) return [];

        const suggestions: SmartSuggestion[] = [];

        // Balance suggestions
        if (Math.abs(analysis.currentValueDiff) > 10) {
}
            suggestions.push({
}
                id: &apos;balance-value&apos;,
                type: &apos;balance&apos;,
                title: &apos;Balance Trade Value&apos;,
                description: `Add a ${analysis.currentValueDiff > 0 ? &apos;lower&apos; : &apos;higher&apos;} value player to balance the trade`,
                confidence: 85,
                impact: Math.abs(analysis.currentValueDiff) * 0.5,
                reasoning: `Current value difference of $${Math.abs(analysis.currentValueDiff)} creates unfair trade`
            });

        // Position need suggestions
        if (proposal.fromPlayers.some((p: any) => p.position === &apos;RB&apos;)) {
}
            suggestions.push({
}
                id: &apos;rb-depth&apos;,
                type: &apos;need&apos;,
                title: &apos;Address RB Depth&apos;,
                description: &apos;Consider adding RB depth to maintain roster balance&apos;,
                confidence: 70,
                impact: 15,
                reasoning: &apos;Trading away RB creates potential depth issues&apos;
            });

        // Upgrade suggestions
        suggestions.push({
}
            id: &apos;upgrade-wr&apos;,
            type: &apos;upgrade&apos;,
            title: &apos;Target Elite WR&apos;,
            description: &apos;Package players for a top-tier WR upgrade&apos;,
            confidence: 75,
            impact: 20,
            reasoning: &apos;WR position offers best upgrade potential for your roster&apos;
        });

        // Value suggestions
        if (analysis.riskAssessment.overallRisk === &apos;high&apos;) {
}
            suggestions.push({
}
                id: &apos;reduce-risk&apos;,
                type: &apos;value&apos;,
                title: &apos;Reduce Risk Profile&apos;,
                description: &apos;Target younger, more consistent players&apos;,
                confidence: 80,
                impact: 12,
                reasoning: &apos;Current trade involves high-risk players&apos;
            });

        return suggestions;
    }, [proposal, analysis]);

    // Mock alternative offers
    const alternativeOffers: AlternativeOffer[] = React.useMemo(() => {
}
        if (!proposal) return [];

        return [
            {
}
                id: &apos;alt-1&apos;,
                description: &apos;Balanced value trade with pick sweetener&apos;,
                fromPlayers: proposal.fromPlayers.slice(0, 1),
                toPlayers: proposal.toPlayers.slice(0, 1),
                expectedImprovement: 15,
                reasoning: &apos;Reduces complexity while maintaining core value exchange&apos;
            },
            {
}
                id: &apos;alt-2&apos;,
                description: &apos;Package deal for single elite player&apos;,
                fromPlayers: proposal.fromPlayers,
                toPlayers: proposal.toPlayers.slice(0, 1),
                expectedImprovement: 22,
                reasoning: &apos;Consolidates depth into top-tier talent&apos;
            },
            {
}
                id: &apos;alt-3&apos;,
                description: &apos;Add complementary pieces for position balance&apos;,
                fromPlayers: [...proposal.fromPlayers],
                toPlayers: [...proposal.toPlayers],
                expectedImprovement: 8,
                reasoning: &apos;Maintains current framework with better position balance&apos;

        ];
    }, [proposal]);

    const getConfidenceColor = (confidence: number) => {
}
        if (confidence >= 80) return &apos;text-green-400&apos;;
        if (confidence >= 60) return &apos;text-blue-400&apos;;
        if (confidence >= 40) return &apos;text-yellow-400&apos;;
        return &apos;text-red-400&apos;;
    };

    const getSuggestionIcon = (type: string) => {
}
        switch (type) {
}
            case &apos;balance&apos;: return <ArrowRightLeftIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;upgrade&apos;: return <TrendingUpIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;need&apos;: return <SearchIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;value&apos;: return <CheckIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;
            default: return <BrainCircuitIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />;

    };

    const applySuggestion = (suggestion: SmartSuggestion) => {
}
        // Mock implementation - in real app would modify the proposal
        setSelectedSuggestion(suggestion);
    };

    const selectAlternativeOffer = (offer: AlternativeOffer) => {
}
        if (!proposal) return;
        
        const newProposal: TradeProposal = {
}
            ...proposal,
            id: `trade-alt-${Date.now()}`,
            fromPlayers: offer.fromPlayers,
            toPlayers: offer.toPlayers,
            status: &apos;draft&apos;
        };
        
        onProposalUpdate(newProposal);
        setShowAlternatives(false);
    };

    if (!proposal || !analysis) {
}
        return (
            <div className="text-center py-12 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                <BrainCircuitIcon className="w-16 h-16 mx-auto mb-4 opacity-50 sm:px-4 md:px-6 lg:px-8" />
                <h3 className="text-lg font-medium mb-2 sm:px-4 md:px-6 lg:px-8">No Trade to Analyze</h3>
                <p>Build a trade proposal to get AI-powered suggestions and alternatives</p>
            </div>
        );

    return (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* AI Suggestions Overview */}
            <Widget title="Smart Suggestions" icon={<BrainCircuitIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />} className="bg-[var(--panel-bg)] sm:px-4 md:px-6 lg:px-8">
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="grid gap-4 sm:px-4 md:px-6 lg:px-8">
                        {smartSuggestions.map((suggestion, index) => (
}
                            <motion.div
                                key={suggestion.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 rounded-lg p-4 border border-[var(--panel-border)] hover:border-blue-400/50 transition-colors cursor-pointer sm:px-4 md:px-6 lg:px-8"
                                onClick={() => applySuggestion(suggestion)}
                            >
                                <div className="flex items-start gap-4 sm:px-4 md:px-6 lg:px-8">
                                    <div className={`p-2 rounded-lg ${
}
                                        suggestion.type === &apos;balance&apos; ? &apos;bg-blue-500/20 text-blue-400&apos; :
                                        suggestion.type === &apos;upgrade&apos; ? &apos;bg-green-500/20 text-green-400&apos; :
                                        suggestion.type === &apos;need&apos; ? &apos;bg-yellow-500/20 text-yellow-400&apos; :
                                        &apos;bg-purple-500/20 text-purple-400&apos;
                                    }`}>
                                        {getSuggestionIcon(suggestion.type)}
                                    </div>
                                    
                                    <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                        <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                                            <h4 className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                {suggestion.title}
                                            </h4>
                                            <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                                                <span className={`text-sm font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                                                    {suggestion.confidence}% confidence
                                                </span>
                                                <span className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                    +{suggestion.impact} impact
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <p className="text-[var(--text-secondary)] mb-3 sm:px-4 md:px-6 lg:px-8">
                                            {suggestion.description}
                                        </p>
                                        
                                        <div className="bg-white/5 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8">
                                            <div className="text-xs text-[var(--text-secondary)] mb-1 sm:px-4 md:px-6 lg:px-8">AI Reasoning:</div>
                                            <div className="text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                {suggestion.reasoning}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        
                        {smartSuggestions.length === 0 && (
}
                            <div className="text-center py-8 text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                <BrainCircuitIcon className="w-12 h-12 mx-auto mb-3 opacity-50 sm:px-4 md:px-6 lg:px-8" />
                                <p>AI is analyzing your trade for optimization opportunities...</p>
                            </div>
                        )}
                    </div>
                </div>
            </Widget>

            {/* Improvement Suggestions */}
            {analysis.improvementSuggestions.length > 0 && (
}
                <Widget title="Trade Improvements" className="bg-[var(--panel-bg)] sm:px-4 md:px-6 lg:px-8">
                    <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                            {analysis.improvementSuggestions.map((improvement, index) => (
}
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-3 p-3 bg-white/5 rounded-lg sm:px-4 md:px-6 lg:px-8"
                                >
                                    <TrendingUpIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />
                                    <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                        <div className="flex items-center justify-between mb-1 sm:px-4 md:px-6 lg:px-8">
                                            <div className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                {improvement.description}
                                            </div>
                                            <div className="text-sm text-green-400 font-medium sm:px-4 md:px-6 lg:px-8">
                                                +{improvement.impact}% improvement
                                            </div>
                                        </div>
                                        <div className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                            {improvement.suggestion}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </Widget>
            )}

            {/* Alternative Offers */}
            <Widget title="Alternative Trade Structures" className="bg-[var(--panel-bg)] sm:px-4 md:px-6 lg:px-8">
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="mb-4 sm:px-4 md:px-6 lg:px-8">
                        <button
                            onClick={() => setShowAlternatives(!showAlternatives)}
                        >
                            {showAlternatives ? &apos;Hide&apos; : &apos;Show&apos;} Alternative Structures
                        </button>
                    </div>
                    
                    <AnimatePresence>
                        {showAlternatives && (
}
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: &apos;auto&apos; }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 sm:px-4 md:px-6 lg:px-8"
                            >
                                {alternativeOffers.map((offer, index) => (
}
                                    <motion.div
                                        key={offer.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white/5 rounded-lg p-4 border border-[var(--panel-border)] hover:border-green-400/50 transition-colors cursor-pointer sm:px-4 md:px-6 lg:px-8"
                                        onClick={() => selectAlternativeOffer(offer)}
                                    >
                                        <div className="flex items-center justify-between mb-3 sm:px-4 md:px-6 lg:px-8">
                                            <h4 className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                {offer.description}
                                            </h4>
                                            <div className="text-green-400 font-medium sm:px-4 md:px-6 lg:px-8">
                                                +{offer.expectedImprovement}% better
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                            <div>
                                                <div className="text-sm text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">You Trade:</div>
                                                <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                                                    {offer.fromPlayers.map((player: any) => (
}
                                                        <div key={player.id} className="flex items-center gap-2 text-sm sm:px-4 md:px-6 lg:px-8">
                                                            <Avatar avatar="🏈" className="w-6 h-6 rounded-full sm:px-4 md:px-6 lg:px-8" />
                                                            <span className="text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                                {player.name}
                                                            </span>
                                                            <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                                ({player.position})
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <div className="text-sm text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">You Receive:</div>
                                                <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                                                    {offer.toPlayers.map((player: any) => (
}
                                                        <div key={player.id} className="flex items-center gap-2 text-sm sm:px-4 md:px-6 lg:px-8">
                                                            <Avatar avatar="🏈" className="w-6 h-6 rounded-full sm:px-4 md:px-6 lg:px-8" />
                                                            <span className="text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                                {player.name}
                                                            </span>
                                                            <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                                                ({player.position})
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-white/5 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8">
                                            <div className="text-xs text-[var(--text-secondary)] mb-1 sm:px-4 md:px-6 lg:px-8">Why this works:</div>
                                            <div className="text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                {offer.reasoning}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Widget>

            {/* AI Analysis Summary */}
            <Widget title="AI Trade Analysis" className="bg-[var(--panel-bg)] sm:px-4 md:px-6 lg:px-8">
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/30 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-start gap-3 sm:px-4 md:px-6 lg:px-8">
                            <BrainCircuitIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />
                            <div>
                                <h4 className="font-medium text-blue-400 mb-2 sm:px-4 md:px-6 lg:px-8">AI Recommendation Summary</h4>
                                <div className="text-[var(--text-primary)] mb-3 sm:px-4 md:px-6 lg:px-8">
                                    Based on comprehensive analysis of {proposal.fromPlayers.length + proposal.toPlayers.length} players, 
                                    market values, team needs, and risk factors, this trade shows{&apos; &apos;}
                                    <span className={analysis.fairnessScore >= 60 ? &apos;text-green-400&apos; : &apos;text-yellow-400&apos;}>
                                        {analysis.fairnessScore >= 80 ? &apos;excellent&apos; : 
}
                                         analysis.fairnessScore >= 60 ? &apos;good&apos; : &apos;moderate&apos;} fairness
                                    </span>{&apos; &apos;}
                                    with {analysis.confidence}% confidence.
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                    <div className="text-center p-2 bg-white/10 rounded sm:px-4 md:px-6 lg:px-8">
                                        <div className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{smartSuggestions.length}</div>
                                        <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Suggestions</div>
                                    </div>
                                    <div className="text-center p-2 bg-white/10 rounded sm:px-4 md:px-6 lg:px-8">
                                        <div className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{alternativeOffers.length}</div>
                                        <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Alternatives</div>
                                    </div>
                                    <div className="text-center p-2 bg-white/10 rounded sm:px-4 md:px-6 lg:px-8">
                                        <div className={`font-bold ${analysis.riskAssessment.overallRisk === &apos;low&apos; ? &apos;text-green-400&apos; : &apos;text-yellow-400&apos;}`}>
                                            {analysis.riskAssessment.overallRisk.toUpperCase()}
                                        </div>
                                        <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Risk Level</div>
                                    </div>
                                    <div className="text-center p-2 bg-white/10 rounded sm:px-4 md:px-6 lg:px-8">
                                        <div className="font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                            {Math.abs(analysis.currentValueDiff)} pts
                                        </div>
                                        <div className="text-xs text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">Value Gap</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Widget>
        </div>
    );
};

const AutomatedSuggestionsTabWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <AutomatedSuggestionsTab {...props} />
  </ErrorBoundary>
);

export default React.memo(AutomatedSuggestionsTabWithErrorBoundary);
