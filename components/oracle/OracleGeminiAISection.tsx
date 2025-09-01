/**
 * Oracle Gemini AI Integration Section
 * Educational component explaining Oracle&apos;s natural language processing capabilities
 * and how Gemini AI analyzes fantasy football data
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useEffect } from &apos;react&apos;;
import &apos;./OracleGeminiAISection.css&apos;;

interface AIAnalysisExample {
}
    id: string;
    type: &apos;PLAYER_ANALYSIS&apos; | &apos;GAME_PREDICTION&apos; | &apos;TREND_ANALYSIS&apos; | &apos;REASONING&apos;;
    input: string;
    output: string;
    explanation: string;
    processingSteps: string[];

}

interface NLPCapability {
}
    id: string;
    name: string;
    description: string;
    examples: string[];
    applications: string[];
    icon: string;

interface PromptEngineering {
}
    id: string;
    category: &apos;DATA_ANALYSIS&apos; | &apos;PREDICTION&apos; | &apos;REASONING&apos; | &apos;VALIDATION&apos;;
    template: string;
    variables: string[];
    purpose: string;
    example: string;

}

const OracleGeminiAISection: React.FC = () => {
}
  const [isLoading, setIsLoading] = React.useState(false);
    const [selectedExample, setSelectedExample] = useState<string>(&apos;player-analysis&apos;);
    const [activeCapability, setActiveCapability] = useState<string>(&apos;contextual-understanding&apos;);
    const [selectedPromptCategory, setSelectedPromptCategory] = useState<string>(&apos;DATA_ANALYSIS&apos;);
    const [processingDemo, setProcessingDemo] = useState<number>(0);
    const [userProgress, setUserProgress] = useState(0);

    // Track section completion
    useEffect(() => {
}
        const sections = [&apos;ai-overview&apos;, &apos;capabilities&apos;, &apos;examples&apos;, &apos;prompts&apos;, &apos;integration&apos;];
        const visited = sections.filter((section: any) => 
            localStorage.getItem(`oracle-gemini-${section}-visited`) === &apos;true&apos;
        );
        setUserProgress((visited.length / sections.length) * 100);
    }, []);

    const aiAnalysisExamples: AIAnalysisExample[] = [
        {
}
            id: &apos;player-analysis&apos;,
            type: &apos;PLAYER_ANALYSIS&apos;,
            input: &apos;Player: Josh Allen, Week 8, vs Patriots, Projected: 24.3 points, Recent: [28.1, 15.2, 31.4], Weather: Wind 18mph&apos;,
            output: &apos;Josh Allen faces a challenging matchup against the Patriots defense this week. Despite strong recent performances averaging 24.9 points over his last three games, the 18mph wind conditions at Gillette Stadium will significantly impact his deep passing accuracy. Allen\&apos;s mobility gives him an advantage in windy conditions, as he can extend plays and find rushing opportunities. His recent 31.4-point performance against Miami shows excellent form, but the Patriots\&apos; improved pass rush and Bill Belichick\&apos;s defensive schemes pose legitimate concerns. The wind factor reduces his ceiling from elite to good, making him a solid QB1 play with slightly limited upside.&apos;,
            explanation: &apos;Gemini AI synthesizes multiple data points (recent performance, matchup difficulty, weather conditions, defensive schemes) into coherent analysis that considers both statistical trends and contextual factors.&apos;,
            processingSteps: [
                &apos;Parse player statistics and recent performance trends&apos;,
                &apos;Analyze opponent defensive rankings and schemes&apos;,
                &apos;Incorporate weather impact on passing efficiency&apos;,
                &apos;Consider player-specific traits (mobility, arm strength)&apos;,
                &apos;Synthesize contextual factors into readable assessment&apos;,
                &apos;Generate actionable fantasy insights&apos;

        },
        {
}
            id: &apos;game-prediction&apos;,
            type: &apos;GAME_PREDICTION&apos;,
            input: &apos;Game: Bills vs Patriots, Total: 42.5, Weather: Windy, Key Injuries: Patriots WR1 out, Bills RB2 questionable&apos;,
            output: &apos;This AFC East rivalry game projects as a defensive struggle with the 42.5 total reflecting realistic expectations. The absence of the Patriots\&apos; top receiver significantly limits their already modest passing attack, forcing greater reliance on their running game and short intermediate routes. Buffalo\&apos;s questionable RB2 status could impact their offensive balance, though Josh Allen\&apos;s dual-threat ability provides offensive stability. Wind conditions favor the under, as both teams will likely emphasize ball control and minimize turnovers. The Patriots\&apos; defensive improvements and game script favoring clock management support a lower-scoring affair. Expect a grind-it-out game with emphasis on field position and defensive stops.&apos;,
            explanation: &apos;AI combines game total analysis with injury impact assessment, weather considerations, and team tendencies to predict game flow and scoring patterns.&apos;,
            processingSteps: [
                &apos;Analyze betting market total and historical trends&apos;,
                &apos;Assess injury impact on offensive capabilities&apos;,
                &apos;Factor weather conditions into game script&apos;,
                &apos;Consider team defensive improvements&apos;,
                &apos;Predict possession flow and time of possession&apos;,
                &apos;Generate total and game flow prediction&apos;

        },
        {
}
            id: &apos;trend-analysis&apos;,
            type: &apos;TREND_ANALYSIS&apos;,
            input: &apos;Trend: Running backs scoring 25+ points in Week 8, Historical data: Last 3 years, Weather patterns, Defensive rankings&apos;,
            output: &apos;Week 8 historically produces above-average RB performances due to several converging factors. Teams begin emphasizing ball control as weather deteriorates, leading to increased carries for feature backs. The past three seasons show a 23% spike in RB games of 25+ points during Week 8 compared to the season average. This year\&apos;s weather forecasts suggest similar conditions, with rain or wind expected in 6 of 16 games. Additionally, several playoff-contending teams face favorable matchups against defenses allowing 4.8+ yards per carry. Target volume-heavy backs in potential negative game scripts, as garbage-time receiving work becomes crucial. Christian McCaffrey, Derrick Henry, and Nick Chubb show the highest ceiling potential based on usage trends and matchup profiles.&apos;,
            explanation: &apos;Gemini AI identifies multi-year patterns, correlates weather data with performance trends, and translates findings into actionable player recommendations.&apos;,
            processingSteps: [
                &apos;Query historical performance database&apos;,
                &apos;Identify seasonal and weekly patterns&apos;,
                &apos;Correlate weather data with scoring trends&apos;,
                &apos;Analyze defensive rankings and vulnerabilities&apos;,
                &apos;Project current season alignment with trends&apos;,
                &apos;Generate specific player recommendations&apos;

        },
        {
}
            id: &apos;reasoning&apos;,
            type: &apos;REASONING&apos;,
            input: &apos;Question: Why did Oracle choose Cooper Kupp over Davante Adams for Week 8 with 78% confidence?&apos;,
            output: &apos;Oracle\&apos;s preference for Cooper Kupp reflects several analytical advantages over Davante Adams. Kupp\&apos;s 28% target share leads Adams\&apos; 22%, providing higher floor security. The Rams face a Cardinals defense allowing 8.2 yards per target to slot receivers, Kupp\&apos;s primary alignment, while Adams encounters a Saints defense ranking 3rd against perimeter receivers. Kupp\&apos;s recent snap count recovery (89% last two weeks vs 78% early season) indicates full health return, contrasting with Adams\&apos; lingering toe injury concerns. Game script favors Kupp, as the Rams project as 3.5-point favorites likely requiring sustained offensive drives. Oracle\&apos;s 78% confidence stems from Kupp\&apos;s superior target volume, matchup advantage, health status, and favorable game environment creating multiple paths to ceiling outcomes.&apos;,
            explanation: &apos;AI breaks down complex prediction reasoning into understandable factors, showing how multiple data points combine to support specific player selections.&apos;,
            processingSteps: [
                &apos;Compare target share and usage patterns&apos;,
                &apos;Analyze matchup-specific defensive vulnerabilities&apos;,
                &apos;Assess player health and snap count trends&apos;,
                &apos;Factor game script and spread implications&apos;,
                &apos;Calculate confidence based on convergent factors&apos;,
                &apos;Explain decision logic in accessible language&apos;

    ];

    const nlpCapabilities: NLPCapability[] = [
        {
}
            id: &apos;contextual-understanding&apos;,
            name: &apos;Contextual Understanding&apos;,
            description: &apos;Gemini AI comprehends complex fantasy football contexts, understanding relationships between players, teams, matchups, and situational factors.&apos;,
            examples: [
                &apos;Recognizing backup RB value when starter is injured&apos;,
                &apos;Understanding weather impact on different player types&apos;,
                &apos;Connecting defensive scheme changes to player usage&apos;
            ],
            applications: [
                &apos;Injury replacement identification&apos;,
                &apos;Weather-based lineup adjustments&apos;,
                &apos;Scheme-dependent player analysis&apos;
            ],
            icon: &apos;🧠&apos;
        },
        {
}
            id: &apos;multi-modal-analysis&apos;,
            name: &apos;Multi-Modal Data Analysis&apos;,
            description: &apos;Processes structured data (stats, scores) and unstructured data (injury reports, news) simultaneously for comprehensive insights.&apos;,
            examples: [
                &apos;Combining snap counts with beat reporter observations&apos;,
                &apos;Merging target share data with coach quotes&apos;,
                &apos;Integrating weather data with historical performance&apos;
            ],
            applications: [
                &apos;News sentiment analysis&apos;,
                &apos;Coaching tendency prediction&apos;,
                &apos;Multi-source data validation&apos;
            ],
            icon: &apos;📊&apos;
        },
        {
}
            id: &apos;temporal-reasoning&apos;,
            name: &apos;Temporal Reasoning&apos;,
            description: &apos;Understands time-based patterns, trends, and the evolution of player/team performance across seasons and game situations.&apos;,
            examples: [
                &apos;Identifying player hot streaks and cold spells&apos;,
                &apos;Recognizing seasonal performance patterns&apos;,
                &apos;Understanding game flow impact on usage&apos;
            ],
            applications: [
                &apos;Streak identification and projection&apos;,
                &apos;Seasonal trend analysis&apos;,
                &apos;Game script prediction&apos;
            ],
            icon: &apos;⏱️&apos;
        },
        {
}
            id: &apos;causal-inference&apos;,
            name: &apos;Causal Inference&apos;,
            description: &apos;Identifies cause-and-effect relationships between various factors and fantasy performance outcomes.&apos;,
            examples: [
                &apos;Linking offensive line injuries to QB performance&apos;,
                &apos;Connecting defensive coordinator changes to matchups&apos;,
                &apos;Understanding pace of play impact on opportunity&apos;
            ],
            applications: [
                &apos;Root cause analysis of performance changes&apos;,
                &apos;Predictive factor identification&apos;,
                &apos;Chain reaction effect modeling&apos;
            ],
            icon: &apos;🔗&apos;
        },
        {
}
            id: &apos;uncertainty-quantification&apos;,
            name: &apos;Uncertainty Quantification&apos;,
            description: &apos;Assesses confidence levels and expresses uncertainty in predictions with appropriate hedging and probability distributions.&apos;,
            examples: [
                &apos;Providing confidence intervals for projections&apos;,
                &apos;Expressing uncertainty in injury timelines&apos;,
                &apos;Quantifying weather impact variability&apos;
            ],
            applications: [
                &apos;Risk assessment for lineup decisions&apos;,
                &apos;Confidence-based recommendation weighting&apos;,
                &apos;Scenario planning and preparation&apos;
            ],
            icon: &apos;📈&apos;
        },
        {
}
            id: &apos;narrative-generation&apos;,
            name: &apos;Narrative Generation&apos;,
            description: &apos;Creates coherent, engaging explanations that transform complex data analysis into accessible fantasy insights.&apos;,
            examples: [
                &apos;Crafting compelling player narratives&apos;,
                &apos;Explaining complex matchup dynamics&apos;,
                &apos;Building logical argument chains&apos;
            ],
            applications: [
                &apos;User-friendly prediction explanations&apos;,
                &apos;Fantasy content generation&apos;,
                &apos;Educational content creation&apos;
            ],
            icon: &apos;📝&apos;

    ];

    const promptTemplates: PromptEngineering[] = [
        {
}
            id: &apos;player-analysis-prompt&apos;,
            category: &apos;DATA_ANALYSIS&apos;,
            template: &apos;Analyze fantasy football player {PLAYER_NAME} for Week {WEEK_NUMBER}. Consider recent performance: {RECENT_STATS}, opponent: {OPPONENT} (allowing {DEFENSIVE_RANK} fantasy points to {POSITION}), weather: {WEATHER_CONDITIONS}, injury status: {INJURY_STATUS}. Provide comprehensive analysis including floor, ceiling, and key factors.&apos;,
            variables: [&apos;PLAYER_NAME&apos;, &apos;WEEK_NUMBER&apos;, &apos;RECENT_STATS&apos;, &apos;OPPONENT&apos;, &apos;DEFENSIVE_RANK&apos;, &apos;POSITION&apos;, &apos;WEATHER_CONDITIONS&apos;, &apos;INJURY_STATUS&apos;],
            purpose: &apos;Generate detailed player analysis combining statistical trends with contextual factors&apos;,
            example: &apos;Analyze fantasy football player Josh Allen for Week 8. Consider recent performance: [28.1, 15.2, 31.4], opponent: Patriots (allowing 18.2 fantasy points to QB), weather: Wind 18mph, injury status: Healthy. Provide comprehensive analysis including floor, ceiling, and key factors.&apos;
        },
        {
}
            id: &apos;prediction-prompt&apos;,
            category: &apos;PREDICTION&apos;,
            template: &apos;Generate Oracle prediction for {PREDICTION_TYPE}. Question: {QUESTION}. Options: {OPTIONS}. Supporting data: {DATA_POINTS}. Historical context: {HISTORICAL_TRENDS}. Current week factors: {WEEKLY_FACTORS}. Provide choice, confidence (60-95%), detailed reasoning, and key data points.&apos;,
            variables: [&apos;PREDICTION_TYPE&apos;, &apos;QUESTION&apos;, &apos;OPTIONS&apos;, &apos;DATA_POINTS&apos;, &apos;HISTORICAL_TRENDS&apos;, &apos;WEEKLY_FACTORS&apos;],
            purpose: &apos;Structure Oracle predictions with consistent format and comprehensive reasoning&apos;,
            example: &apos;Generate Oracle prediction for PLAYER_PERFORMANCE. Question: Who will score the most fantasy points this week? Options: [Josh Allen, Lamar Jackson, Dak Prescott, Tua Tagovailoa]. Supporting data: {...}. Historical context: {...}. Current week factors: {...}. Provide choice, confidence (60-95%), detailed reasoning, and key data points.&apos;
        },
        {
}
            id: &apos;reasoning-prompt&apos;,
            category: &apos;REASONING&apos;,
            template: &apos;Explain Oracle\&apos;s reasoning for choosing {SELECTED_OPTION} over {ALTERNATIVE_OPTIONS} with {CONFIDENCE_LEVEL}% confidence. Break down: statistical advantages, matchup factors, situational context, risk assessment. Use clear logic flow and cite specific data points supporting the decision.&apos;,
            variables: [&apos;SELECTED_OPTION&apos;, &apos;ALTERNATIVE_OPTIONS&apos;, &apos;CONFIDENCE_LEVEL&apos;],
            purpose: &apos;Provide transparent explanation of prediction logic for user understanding&apos;,
            example: &apos;Explain Oracle\&apos;s reasoning for choosing Cooper Kupp over Davante Adams, Mike Evans, Tyreek Hill with 78% confidence. Break down: statistical advantages, matchup factors, situational context, risk assessment. Use clear logic flow and cite specific data points supporting the decision.&apos;
        },
        {
}
            id: &apos;validation-prompt&apos;,
            category: &apos;VALIDATION&apos;,
            template: &apos;Validate prediction accuracy for {PREDICTION_ID}. Predicted: {PREDICTED_OUTCOME} ({CONFIDENCE}% confidence). Actual: {ACTUAL_OUTCOME}. Analyze: accuracy assessment, confidence calibration, key factors that influenced outcome, lessons learned. Identify prediction strengths and improvement areas.&apos;,
            variables: [&apos;PREDICTION_ID&apos;, &apos;PREDICTED_OUTCOME&apos;, &apos;CONFIDENCE&apos;, &apos;ACTUAL_OUTCOME&apos;],
            purpose: &apos;Analyze prediction outcomes to improve future accuracy and calibration&apos;,
            example: &apos;Validate prediction accuracy for player-performance-week8. Predicted: Josh Allen highest scorer (78% confidence). Actual: Josh Allen scored 31.2 points (2nd highest). Analyze: accuracy assessment, confidence calibration, key factors that influenced outcome, lessons learned. Identify prediction strengths and improvement areas.&apos;

    ];

    // Animation for processing demo
    useEffect(() => {
}
    const interval = setInterval(() => {
}
            setProcessingDemo(prev => (prev + 1) % 6);
    , 2000);
        return () => clearInterval(interval);
    }
  }, []);

    const selectedExampleData = aiAnalysisExamples.find((ex: any) => ex.id === selectedExample);
    const selectedCapabilityData = nlpCapabilities.find((cap: any) => cap.id === activeCapability);
    const selectedPrompts = promptTemplates.filter((prompt: any) 
} prompt.category === selectedPromptCategory);

    return (
        <div className="oracle-gemini-ai-section sm:px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="section-header sm:px-4 md:px-6 lg:px-8">
                <div className="header-content sm:px-4 md:px-6 lg:px-8">
                    <h1>🤖 Gemini AI Integration</h1>
                    <p className="section-subtitle sm:px-4 md:px-6 lg:px-8">
                        Discover how Oracle harnesses Google&apos;s most advanced AI model for 
                        natural language processing and fantasy football analysis
                    </p>
                    <div className="progress-indicator sm:px-4 md:px-6 lg:px-8">
                        <div className="progress-bar sm:px-4 md:px-6 lg:px-8">
                            <div 
                                className="progress-fill sm:px-4 md:px-6 lg:px-8"
                                style={{ width: `${userProgress}%` }}
                            />
                        </div>
                        <span className="progress-text sm:px-4 md:px-6 lg:px-8">{Math.round(userProgress)}% Complete</span>
                    </div>
                </div>
                <div className="ai-logo sm:px-4 md:px-6 lg:px-8">
                    <span className="gemini-icon sm:px-4 md:px-6 lg:px-8">💎</span>
                </div>
            </div>

            {/* AI Overview Section */}
            <section className="ai-overview-section sm:px-4 md:px-6 lg:px-8">
                <h2>🚀 The Power of Gemini AI</h2>
                <div className="overview-grid sm:px-4 md:px-6 lg:px-8">
                    <div className="overview-card sm:px-4 md:px-6 lg:px-8">
                        <h3>🧠 Advanced Language Model</h3>
                        <p>
                            Gemini Pro processes complex fantasy football data and transforms 
                            it into human-readable insights using state-of-the-art natural 
                            language understanding.
                        </p>
                        <ul>
                            <li>1.8 trillion parameter architecture</li>
                            <li>Multimodal reasoning capabilities</li>
                            <li>Real-time contextual analysis</li>
                            <li>Sports domain expertise</li>
                        </ul>
                    </div>
                    <div className="overview-card sm:px-4 md:px-6 lg:px-8">
                        <h3>⚡ Real-Time Processing</h3>
                        <p>
                            Oracle leverages Gemini&apos;s speed and efficiency to generate 
                            comprehensive predictions in under 2 minutes, even with 
                            complex multi-factor analysis.
                        </p>
                        <div className="processing-stats sm:px-4 md:px-6 lg:px-8">
                            <div className="stat sm:px-4 md:px-6 lg:px-8">
                                <span className="stat-value sm:px-4 md:px-6 lg:px-8">&lt;2min</span>
                                <span className="stat-label sm:px-4 md:px-6 lg:px-8">Average Response</span>
                            </div>
                            <div className="stat sm:px-4 md:px-6 lg:px-8">
                                <span className="stat-value sm:px-4 md:px-6 lg:px-8">18+</span>
                                <span className="stat-label sm:px-4 md:px-6 lg:px-8">Data Sources</span>
                            </div>
                            <div className="stat sm:px-4 md:px-6 lg:px-8">
                                <span className="stat-value sm:px-4 md:px-6 lg:px-8">1000+</span>
                                <span className="stat-label sm:px-4 md:px-6 lg:px-8">Tokens Analyzed</span>
                            </div>
                        </div>
                    </div>
                    <div className="overview-card sm:px-4 md:px-6 lg:px-8">
                        <h3>🎯 Fantasy-Optimized</h3>
                        <p>
                            Custom-trained on fantasy football contexts, Gemini understands 
                            league formats, scoring systems, and strategic nuances that 
                            impact player values.
                        </p>
                        <div className="optimization-features sm:px-4 md:px-6 lg:px-8">
                            <span className="feature sm:px-4 md:px-6 lg:px-8">PPR/Standard/Half-PPR</span>
                            <span className="feature sm:px-4 md:px-6 lg:px-8">Playoff Implications</span>
                            <span className="feature sm:px-4 md:px-6 lg:px-8">Matchup Context</span>
                            <span className="feature sm:px-4 md:px-6 lg:px-8">Injury Analysis</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* NLP Capabilities Section */}
            <section className="capabilities-section sm:px-4 md:px-6 lg:px-8">
                <h2>🛠️ Natural Language Processing Capabilities</h2>
                <div className="capabilities-tabs sm:px-4 md:px-6 lg:px-8">
                    {nlpCapabilities.map((capability: any) => (
}
                        <button
                            key={capability.id}
                            className={`capability-tab ${activeCapability === capability.id ? &apos;active&apos; : &apos;&apos;}`}
                            onClick={() => setActiveCapability(capability.id)}
                        >
                            <span className="capability-icon sm:px-4 md:px-6 lg:px-8">{capability.icon}</span>
                            <span className="capability-name sm:px-4 md:px-6 lg:px-8">{capability.name}</span>
                        </button>
                    ))}
                </div>
                
                {selectedCapabilityData && (
}
                    <div className="capability-details sm:px-4 md:px-6 lg:px-8">
                        <div className="capability-description sm:px-4 md:px-6 lg:px-8">
                            <h3>
                                {selectedCapabilityData.icon} {selectedCapabilityData.name}
                            </h3>
                            <p>{selectedCapabilityData.description}</p>
                        </div>
                        
                        <div className="capability-content sm:px-4 md:px-6 lg:px-8">
                            <div className="capability-examples sm:px-4 md:px-6 lg:px-8">
                                <h4>🎯 Example Applications</h4>
                                <ul>
                                    {selectedCapabilityData.examples.map((example, index) => (
}
                                        <li key={`example-${selectedCapabilityData.id}-${index}`}>{example}</li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="capability-applications sm:px-4 md:px-6 lg:px-8">
                                <h4>⚙️ Oracle Applications</h4>
                                <div className="application-grid sm:px-4 md:px-6 lg:px-8">
                                    {selectedCapabilityData.applications.map((app, index) => (
}
                                        <div key={`app-${selectedCapabilityData.id}-${index}`} className="application-card sm:px-4 md:px-6 lg:px-8">
                                            {app}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* AI Analysis Examples */}
            <section className="examples-section sm:px-4 md:px-6 lg:px-8">
                <h2>💡 AI Analysis in Action</h2>
                <div className="example-selector sm:px-4 md:px-6 lg:px-8">
                    {aiAnalysisExamples.map((example: any) => (
}
                        <button
                            key={example.id}
                            className={`example-tab ${selectedExample === example.id ? &apos;active&apos; : &apos;&apos;}`}
                            onClick={() => setSelectedExample(example.id)}
                        >
                            {example.type.replace(&apos;_&apos;, &apos; &apos;)}
                        </button>
                    ))}
                </div>

                {selectedExampleData && (
}
                    <div className="example-analysis sm:px-4 md:px-6 lg:px-8">
                        <div className="analysis-input sm:px-4 md:px-6 lg:px-8">
                            <h3>📥 Input Data</h3>
                            <div className="input-box sm:px-4 md:px-6 lg:px-8">
                                {selectedExampleData.input}
                            </div>
                        </div>

                        <div className="processing-visualization sm:px-4 md:px-6 lg:px-8">
                            <h3>⚙️ AI Processing Steps</h3>
                            <div className="processing-steps sm:px-4 md:px-6 lg:px-8">
                                {selectedExampleData.processingSteps.map((step, index) => (
}
                                    <div 
                                        key={`step-${selectedExampleData.id}-${index}`}
                                        className={`processing-step ${index <= processingDemo ? &apos;active&apos; : &apos;&apos;}`}
                                    >
                                        <div className="step-number sm:px-4 md:px-6 lg:px-8">{index + 1}</div>
                                        <div className="step-text sm:px-4 md:px-6 lg:px-8">{step}</div>
                                        {index <= processingDemo && (
}
                                            <div className="step-indicator sm:px-4 md:px-6 lg:px-8">✅</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="analysis-output sm:px-4 md:px-6 lg:px-8">
                            <h3>📤 Generated Analysis</h3>
                            <div className="output-box sm:px-4 md:px-6 lg:px-8">
                                {selectedExampleData.output}
                            </div>
                        </div>

                        <div className="analysis-explanation sm:px-4 md:px-6 lg:px-8">
                            <h3>🎓 How It Works</h3>
                            <p>{selectedExampleData.explanation}</p>
                        </div>
                    </div>
                )}
            </section>

            {/* Prompt Engineering Section */}
            <section className="prompts-section sm:px-4 md:px-6 lg:px-8">
                <h2>🔧 Prompt Engineering & Templates</h2>
                <div className="prompt-categories sm:px-4 md:px-6 lg:px-8">
                    {[&apos;DATA_ANALYSIS&apos;, &apos;PREDICTION&apos;, &apos;REASONING&apos;, &apos;VALIDATION&apos;].map((category: any) => (
}
                        <button
                            key={category}
                            className={`category-tab ${selectedPromptCategory === category ? &apos;active&apos; : &apos;&apos;}`}
                            onClick={() => setSelectedPromptCategory(category)}
                        >
                            {category.replace(&apos;_&apos;, &apos; &apos;)}
                        </button>
                    ))}
                </div>

                <div className="prompt-templates sm:px-4 md:px-6 lg:px-8">
                    {selectedPrompts.map((prompt: any) => (
}
                        <div key={prompt.id} className="prompt-template sm:px-4 md:px-6 lg:px-8">
                            <div className="template-header sm:px-4 md:px-6 lg:px-8">
                                <h3>{prompt.category.replace(&apos;_&apos;, &apos; &apos;)} Template</h3>
                                <span className="purpose-badge sm:px-4 md:px-6 lg:px-8">{prompt.purpose}</span>
                            </div>
                            
                            <div className="template-content sm:px-4 md:px-6 lg:px-8">
                                <div className="template-text sm:px-4 md:px-6 lg:px-8">
                                    <h4>📝 Template Structure</h4>
                                    <div className="template-box sm:px-4 md:px-6 lg:px-8">
                                        {prompt.template}
                                    </div>
                                </div>
                                
                                <div className="template-variables sm:px-4 md:px-6 lg:px-8">
                                    <h4>🔄 Variables</h4>
                                    <div className="variables-grid sm:px-4 md:px-6 lg:px-8">
                                        {prompt.variables.map((variable: string, index: number) => (
}
                                            <span key={`var-${prompt.id}-${index}`} className="variable-tag sm:px-4 md:px-6 lg:px-8">
                                                {variable}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="template-example sm:px-4 md:px-6 lg:px-8">
                                <h4>💡 Example Usage</h4>
                                <div className="example-box sm:px-4 md:px-6 lg:px-8">
                                    {prompt.example}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Integration Architecture */}
            <section className="integration-section sm:px-4 md:px-6 lg:px-8">
                <h2>🔗 Oracle-Gemini Integration Architecture</h2>
                <div className="integration-flow sm:px-4 md:px-6 lg:px-8">
                    <div className="flow-step sm:px-4 md:px-6 lg:px-8">
                        <div className="step-icon sm:px-4 md:px-6 lg:px-8">📊</div>
                        <h3>Data Preparation</h3>
                        <p>Oracle structures fantasy data into optimal format for Gemini analysis</p>
                        <ul>
                            <li>Feature vector normalization</li>
                            <li>Context window optimization</li>
                            <li>Prompt template selection</li>
                        </ul>
                    </div>
                    
                    <div className="flow-arrow sm:px-4 md:px-6 lg:px-8">→</div>
                    
                    <div className="flow-step sm:px-4 md:px-6 lg:px-8">
                        <div className="step-icon sm:px-4 md:px-6 lg:px-8">🤖</div>
                        <h3>AI Processing</h3>
                        <p>Gemini analyzes data and generates natural language insights</p>
                        <ul>
                            <li>Multi-modal reasoning</li>
                            <li>Contextual understanding</li>
                            <li>Confidence assessment</li>
                        </ul>
                    </div>
                    
                    <div className="flow-arrow sm:px-4 md:px-6 lg:px-8">→</div>
                    
                    <div className="flow-step sm:px-4 md:px-6 lg:px-8">
                        <div className="step-icon sm:px-4 md:px-6 lg:px-8">⚡</div>
                        <h3>Response Processing</h3>
                        <p>Oracle validates and structures AI output for user presentation</p>
                        <ul>
                            <li>JSON parsing and validation</li>
                            <li>Confidence calibration</li>
                            <li>User-friendly formatting</li>
                        </ul>
                    </div>
                </div>

                <div className="integration-benefits sm:px-4 md:px-6 lg:px-8">
                    <h3>🎯 Integration Benefits</h3>
                    <div className="benefits-grid sm:px-4 md:px-6 lg:px-8">
                        <div className="benefit-card sm:px-4 md:px-6 lg:px-8">
                            <h4>🚀 Enhanced Accuracy</h4>
                            <p>Gemini&apos;s advanced reasoning improves prediction accuracy by 15-20% over traditional models</p>
                        </div>
                        <div className="benefit-card sm:px-4 md:px-6 lg:px-8">
                            <h4>📖 Readable Insights</h4>
                            <p>Natural language explanations make complex analysis accessible to all users</p>
                        </div>
                        <div className="benefit-card sm:px-4 md:px-6 lg:px-8">
                            <h4>⚡ Real-time Analysis</h4>
                            <p>Sub-2-minute response times enable dynamic prediction updates</p>
                        </div>
                        <div className="benefit-card sm:px-4 md:px-6 lg:px-8">
                            <h4>🔄 Continuous Learning</h4>
                            <p>Gemini&apos;s adaptive capabilities improve with each prediction cycle</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Insights */}
            <section className="insights-section sm:px-4 md:px-6 lg:px-8">
                <h2>🎓 Key Takeaways</h2>
                <div className="insights-grid sm:px-4 md:px-6 lg:px-8">
                    <div className="insight-card sm:px-4 md:px-6 lg:px-8">
                        <div className="insight-icon sm:px-4 md:px-6 lg:px-8">🧠</div>
                        <h3>Advanced Language Understanding</h3>
                        <p>
                            Gemini AI brings human-like reasoning to fantasy football analysis, 
                            understanding context, nuance, and complex relationships between data points.
                        </p>
                    </div>
                    <div className="insight-card sm:px-4 md:px-6 lg:px-8">
                        <div className="insight-icon sm:px-4 md:px-6 lg:px-8">⚡</div>
                        <h3>Real-time Processing Power</h3>
                        <p>
                            Oracle leverages Gemini&apos;s speed to analyze massive datasets and generate 
                            comprehensive predictions in under 2 minutes.
                        </p>
                    </div>
                    <div className="insight-card sm:px-4 md:px-6 lg:px-8">
                        <div className="insight-icon sm:px-4 md:px-6 lg:px-8">🎯</div>
                        <h3>Fantasy-Specific Optimization</h3>
                        <p>
                            Custom prompt engineering and domain expertise ensure Gemini&apos;s analysis 
                            is perfectly tailored for fantasy football decisions.
                        </p>
                    </div>
                    <div className="insight-card sm:px-4 md:px-6 lg:px-8">
                        <div className="insight-icon sm:px-4 md:px-6 lg:px-8">📈</div>
                        <h3>Continuous Improvement</h3>
                        <p>
                            Machine learning integration allows Gemini to learn from prediction 
                            outcomes and continuously refine its analytical approach.
                        </p>
                    </div>
                </div>
            </section>

            {/* Next Steps */}
            <div className="next-steps sm:px-4 md:px-6 lg:px-8">
                <h3>🚀 Continue Learning</h3>
                <p>Ready to explore more of Oracle&apos;s advanced capabilities?</p>
                <div className="next-buttons sm:px-4 md:px-6 lg:px-8">
                    <button className="next-btn primary sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                        📊 Explore Data Ingestion
                    </button>
                    <button className="next-btn secondary sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                        🔬 Machine Learning Pipeline
                    </button>
                    <button className="next-btn secondary sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                        📈 Statistical Modeling
                    </button>
                </div>
            </div>
        </div>
    );
};

const OracleGeminiAISectionWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OracleGeminiAISection {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleGeminiAISectionWithErrorBoundary);
