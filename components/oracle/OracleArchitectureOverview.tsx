/**
 * Oracle Architecture Overview Component
 * Educational section explaining Oracle&apos;s prediction architecture and system design
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useEffect } from &apos;react&apos;;
import &apos;./OracleArchitectureOverview.css&apos;;

interface ArchitectureLayer {
}
    id: string;
    name: string;
    description: string;
    components: string[];
    dataFlow: string;
    examples: string[];

}

interface SystemComponent {
}
    id: string;
    name: string;
    purpose: string;
    inputs: string[];
    outputs: string[];
    technology: string;

interface DataFlowStep {
}
    id: string;
    step: number;
    title: string;
    description: string;
    duration: string;
    dependencies: string[];

}

const OracleArchitectureOverview: React.FC = () => {
}
  const [isLoading, setIsLoading] = React.useState(false);
    const [activeLayer, setActiveLayer] = useState<string>(&apos;data-layer&apos;);
    const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
    const [showDataFlow, setShowDataFlow] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    // Architecture layers definition
    const architectureLayers: ArchitectureLayer[] = [
        {
}
            id: &apos;data-layer&apos;,
            name: &apos;Data Ingestion Layer&apos;,
            description: &apos;Real-time sports data collection and validation from multiple sources&apos;,
            components: [&apos;SportsIO API&apos;, &apos;Live Data Feeds&apos;, &apos;Data Validators&apos;, &apos;Cache Management&apos;],
            dataFlow: &apos;External APIs → Data Validation → Real-time Processing → Storage&apos;,
            examples: [
                &apos;Player statistics updates every 30 seconds during games&apos;,
                &apos;Injury reports processed within minutes of announcement&apos;,
                &apos;Weather data refreshed hourly for all game locations&apos;,
                &apos;Team roster changes tracked in real-time&apos;

        },
        {
}
            id: &apos;processing-layer&apos;,
            name: &apos;Data Processing Layer&apos;,
            description: &apos;Feature extraction and data transformation for machine learning models&apos;,
            components: [&apos;Feature Extractors&apos;, &apos;Data Preprocessors&apos;, &apos;Statistical Calculators&apos;, &apos;Trend Analyzers&apos;],
            dataFlow: &apos;Raw Data → Feature Extraction → Normalization → Model Input&apos;,
            examples: [
                &apos;Convert player stats into 18-dimensional feature vectors&apos;,
                &apos;Calculate Player Efficiency Ratings (PER) from raw statistics&apos;,
                &apos;Extract team chemistry scores from performance patterns&apos;,
                &apos;Generate matchup difficulty ratings based on historical data&apos;

        },
        {
}
            id: &apos;ai-layer&apos;,
            name: &apos;AI Intelligence Layer&apos;,
            description: &apos;Gemini AI integration for natural language processing and intelligent analysis&apos;,
            components: [&apos;Gemini AI Engine&apos;, &apos;NLP Processors&apos;, &apos;Context Analyzers&apos;, &apos;Reasoning Generators&apos;],
            dataFlow: &apos;Structured Data → AI Analysis → Natural Language Reasoning → Confidence Scoring&apos;,
            examples: [
                &apos;Generate human-readable explanations for predictions&apos;,
                &apos;Analyze complex scenario interactions using natural language&apos;,
                &apos;Provide contextual reasoning for prediction confidence&apos;,
                &apos;Adapt communication style based on user expertise level&apos;

        },
        {
}
            id: &apos;ml-layer&apos;,
            name: &apos;Machine Learning Layer&apos;,
            description: &apos;Advanced statistical modeling and ensemble prediction algorithms&apos;,
            components: [&apos;Ensemble Models&apos;, &apos;Confidence Calibrators&apos;, &apos;Pattern Detectors&apos;, &apos;Accuracy Optimizers&apos;],
            dataFlow: &apos;Feature Vectors → Model Training → Ensemble Prediction → Confidence Calibration&apos;,
            examples: [
                &apos;Combine multiple prediction models for consensus accuracy&apos;,
                &apos;Calibrate confidence scores based on historical performance&apos;,
                &apos;Detect seasonal patterns and trend shifts automatically&apos;,
                &apos;Continuously learn from prediction outcomes&apos;

        },
        {
}
            id: &apos;prediction-layer&apos;,
            name: &apos;Prediction Generation Layer&apos;,
            description: &apos;Final prediction synthesis and output formatting&apos;,
            components: [&apos;Prediction Synthesizers&apos;, &apos;Probability Calculators&apos;, &apos;Risk Assessors&apos;, &apos;Output Formatters&apos;],
            dataFlow: &apos;Model Outputs → Synthesis → Probability Assignment → User Interface&apos;,
            examples: [
                &apos;Generate 5 types of predictions: Player, Game, Scoring, Weather, Injury&apos;,
                &apos;Calculate precise probability distributions for all options&apos;,
                &apos;Assess prediction risk and uncertainty levels&apos;,
                &apos;Format predictions for optimal user comprehension&apos;

    ];

    // System components definition
    const systemComponents: SystemComponent[] = [
        {
}
            id: &apos;oracle-prediction-service&apos;,
            name: &apos;Oracle Prediction Service&apos;,
            purpose: &apos;Central orchestrator for all prediction generation and management&apos;,
            inputs: [&apos;Live sports data&apos;, &apos;Historical trends&apos;, &apos;User preferences&apos;],
            outputs: [&apos;Structured predictions&apos;, &apos;Confidence scores&apos;, &apos;Supporting data&apos;],
            technology: &apos;TypeScript/React with advanced analytics integration&apos;
        },
        {
}
            id: &apos;gemini-ai-engine&apos;,
            name: &apos;Gemini AI Engine&apos;,
            purpose: &apos;Natural language processing and intelligent reasoning generation&apos;,
            inputs: [&apos;Structured prediction data&apos;, &apos;Context prompts&apos;, &apos;Analysis requirements&apos;],
            outputs: [&apos;Human-readable reasoning&apos;, &apos;Contextual explanations&apos;, &apos;Confidence assessments&apos;],
            technology: &apos;Google Gemini AI with fantasy football optimization&apos;
        },
        {
}
            id: &apos;ml-learning-service&apos;,
            name: &apos;Machine Learning Service&apos;,
            purpose: &apos;Continuous model improvement and accuracy optimization&apos;,
            inputs: [&apos;Historical predictions&apos;, &apos;Actual outcomes&apos;, &apos;Feature vectors&apos;],
            outputs: [&apos;Model updates&apos;, &apos;Accuracy metrics&apos;, &apos;Performance insights&apos;],
            technology: &apos;Advanced ML algorithms with ensemble modeling&apos;
        },
        {
}
            id: &apos;advanced-analytics&apos;,
            name: &apos;Advanced Analytics Service&apos;,
            purpose: &apos;Complex statistical modeling and advanced metric calculation&apos;,
            inputs: [&apos;Player statistics&apos;, &apos;Team data&apos;, &apos;Market information&apos;],
            outputs: [&apos;PER ratings&apos;, &apos;Chemistry scores&apos;, &apos;Market sentiment&apos;],
            technology: &apos;Statistical modeling with real-time calculation&apos;
        },
        {
}
            id: &apos;real-time-processor&apos;,
            name: &apos;Real-time Data Processor&apos;,
            purpose: &apos;Live data monitoring and dynamic prediction updates&apos;,
            inputs: [&apos;Live game feeds&apos;, &apos;Breaking news&apos;, &apos;Roster changes&apos;],
            outputs: [&apos;Real-time updates&apos;, &apos;Dynamic adjustments&apos;, &apos;Alert notifications&apos;],
            technology: &apos;Event-driven architecture with WebSocket connections&apos;

    ];

    // Data flow steps
    const dataFlowSteps: DataFlowStep[] = [
        {
}
            id: &apos;data-collection&apos;,
            step: 1,
            title: &apos;Data Collection&apos;,
            description: &apos;Gather live sports data from multiple sources including SportsIO API, injury reports, and weather services&apos;,
            duration: &apos;30-second intervals&apos;,
            dependencies: []
        },
        {
}
            id: &apos;data-validation&apos;,
            step: 2,
            title: &apos;Data Validation&apos;,
            description: &apos;Validate incoming data for accuracy, completeness, and consistency using automated quality checks&apos;,
            duration: &apos;< 5 seconds&apos;,
            dependencies: [&apos;data-collection&apos;]
        },
        {
}
            id: &apos;feature-extraction&apos;,
            step: 3,
            title: &apos;Feature Extraction&apos;,
            description: &apos;Convert raw data into structured feature vectors for machine learning models&apos;,
            duration: &apos;10-15 seconds&apos;,
            dependencies: [&apos;data-validation&apos;]
        },
        {
}
            id: &apos;advanced-analytics&apos;,
            step: 4,
            title: &apos;Advanced Analytics&apos;,
            description: &apos;Calculate Player Efficiency Ratings, team chemistry scores, and market sentiment analysis&apos;,
            duration: &apos;15-20 seconds&apos;,
            dependencies: [&apos;feature-extraction&apos;]
        },
        {
}
            id: &apos;ml-processing&apos;,
            step: 5,
            title: &apos;ML Processing&apos;,
            description: &apos;Run ensemble models and generate preliminary predictions with confidence scoring&apos;,
            duration: &apos;20-30 seconds&apos;,
            dependencies: [&apos;advanced-analytics&apos;]
        },
        {
}
            id: &apos;ai-analysis&apos;,
            step: 6,
            title: &apos;AI Analysis&apos;,
            description: &apos;Gemini AI processes structured data and generates human-readable reasoning&apos;,
            duration: &apos;10-15 seconds&apos;,
            dependencies: [&apos;ml-processing&apos;]
        },
        {
}
            id: &apos;prediction-synthesis&apos;,
            step: 7,
            title: &apos;Prediction Synthesis&apos;,
            description: &apos;Combine all analysis layers into final predictions with supporting evidence&apos;,
            duration: &apos;5-10 seconds&apos;,
            dependencies: [&apos;ai-analysis&apos;]
        },
        {
}
            id: &apos;output-generation&apos;,
            step: 8,
            title: &apos;Output Generation&apos;,
            description: &apos;Format predictions for user interface with interactive elements and explanations&apos;,
            duration: &apos;< 5 seconds&apos;,
            dependencies: [&apos;prediction-synthesis&apos;]

    ];

    // Progress tracking
    useEffect(() => {
}
    const interval = setInterval(() => {
}
            setProgress(prev => prev < 100 ? prev + 1 : 0);
    , 100);

        return () => clearInterval(interval);
    }
  }, []);

    // Helper functions
    const getLayerIcon = (layerId: string): string 
} {
}
        const icons: Record<string, string> = {
}
            &apos;data-layer&apos;: &apos;📡&apos;,
            &apos;processing-layer&apos;: &apos;⚙️&apos;,
            &apos;ai-layer&apos;: &apos;🤖&apos;,
            &apos;ml-layer&apos;: &apos;🧠&apos;,
            &apos;prediction-layer&apos;: &apos;🎯&apos;
        };
        return icons[layerId] || &apos;📊&apos;;
    };

    const getComponentStatusColor = (componentId: string): string => {
}
        const colors: Record<string, string> = {
}
            &apos;oracle-prediction-service&apos;: &apos;#2196F3&apos;,
            &apos;gemini-ai-engine&apos;: &apos;#4CAF50&apos;,
            &apos;ml-learning-service&apos;: &apos;#FF9800&apos;,
            &apos;advanced-analytics&apos;: &apos;#9C27B0&apos;,
            &apos;real-time-processor&apos;: &apos;#F44336&apos;
        };
        return colors[componentId] || &apos;#757575&apos;;
    };

    const renderArchitectureLayer = (layer: ArchitectureLayer) => (
        <button
            key={layer.id}
            className={`architecture-layer ${activeLayer === layer.id ? &apos;active&apos; : &apos;&apos;}`}
            onClick={() => setActiveLayer(layer.id)}
            type="button"
            aria-expanded={activeLayer === layer.id}
            aria-controls={`layer-content-${layer.id}`}
        >
            <div className="layer-header sm:px-4 md:px-6 lg:px-8">
                <span className="layer-icon sm:px-4 md:px-6 lg:px-8">{getLayerIcon(layer.id)}</span>
                <h3 className="layer-name sm:px-4 md:px-6 lg:px-8">{layer.name}</h3>
            </div>
            
            <div className="layer-content sm:px-4 md:px-6 lg:px-8" id={`layer-content-${layer.id}`}>
                <p className="layer-description sm:px-4 md:px-6 lg:px-8">{layer.description}</p>
                
                <div className="layer-components sm:px-4 md:px-6 lg:px-8">
                    <h4>Key Components:</h4>
                    <ul>
                        {layer.components.map((component, index) => (
}
                            <li key={`${layer.id}-component-${index}`}>{component}</li>
                        ))}
                    </ul>
                </div>
                
                <div className="data-flow sm:px-4 md:px-6 lg:px-8">
                    <h4>Data Flow:</h4>
                    <div className="flow-diagram sm:px-4 md:px-6 lg:px-8">
                        {layer.dataFlow.split(&apos; → &apos;).map((step, index, array) => (
}
                            <React.Fragment key={`${layer.id}-flow-${index}`}>
                                <span className="flow-step sm:px-4 md:px-6 lg:px-8">{step}</span>
                                {index < array.length - 1 && <span className="flow-arrow sm:px-4 md:px-6 lg:px-8">→</span>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                
                <div className="layer-examples sm:px-4 md:px-6 lg:px-8">
                    <h4>Examples:</h4>
                    <ul>
                        {layer.examples.map((example, index) => (
}
                            <li key={`${layer.id}-example-${index}`}>{example}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </button>
    );

    const renderSystemComponent = (component: SystemComponent) => (
        <button
            key={component.id}
            className={`system-component ${selectedComponent === component.id ? &apos;selected&apos; : &apos;&apos;}`}
            onClick={() => setSelectedComponent(selectedComponent === component.id ? null : component.id)}
            style={{ borderColor: getComponentStatusColor(component.id) }}
            type="button"
            aria-expanded={selectedComponent === component.id}
            aria-controls={`component-details-${component.id}`}
        >
            <div className="component-header sm:px-4 md:px-6 lg:px-8">
                <div
                    className="component-status sm:px-4 md:px-6 lg:px-8"
                    style={{ backgroundColor: getComponentStatusColor(component.id) }}
                ></div>
                <h4 className="component-name sm:px-4 md:px-6 lg:px-8">{component.name}</h4>
            </div>
            
            {selectedComponent === component.id && (
}
                <div className="component-details sm:px-4 md:px-6 lg:px-8" id={`component-details-${component.id}`}>
                    <p className="component-purpose sm:px-4 md:px-6 lg:px-8">{component.purpose}</p>
                    
                    <div className="component-io sm:px-4 md:px-6 lg:px-8">
                        <div className="inputs sm:px-4 md:px-6 lg:px-8">
                            <h5>Inputs:</h5>
                            <ul>
                                {component.inputs.map((input, index) => (
}
                                    <li key={`${component.id}-input-${index}`}>{input}</li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="outputs sm:px-4 md:px-6 lg:px-8">
                            <h5>Outputs:</h5>
                            <ul>
                                {component.outputs.map((output, index) => (
}
                                    <li key={`${component.id}-output-${index}`}>{output}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="component-tech sm:px-4 md:px-6 lg:px-8">
                        <h5>Technology:</h5>
                        <p>{component.technology}</p>
                    </div>
                </div>
            )}
        </button>
    );

    const renderDataFlowStep = (step: DataFlowStep) => (
        <div key={step.id} className="data-flow-step sm:px-4 md:px-6 lg:px-8">
            <div className="step-number sm:px-4 md:px-6 lg:px-8">{step.step}</div>
            <div className="step-content sm:px-4 md:px-6 lg:px-8">
                <h4 className="step-title sm:px-4 md:px-6 lg:px-8">{step.title}</h4>
                <p className="step-description sm:px-4 md:px-6 lg:px-8">{step.description}</p>
                <div className="step-meta sm:px-4 md:px-6 lg:px-8">
                    <span className="step-duration sm:px-4 md:px-6 lg:px-8">⏱️ {step.duration}</span>
                    {step.dependencies.length > 0 && (
}
                        <span className="step-dependencies sm:px-4 md:px-6 lg:px-8">
                            🔗 Depends on: {step.dependencies.join(&apos;, &apos;)}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="oracle-architecture-overview sm:px-4 md:px-6 lg:px-8">
            <div className="overview-header sm:px-4 md:px-6 lg:px-8">
                <h2>🏗️ Oracle Prediction Architecture</h2>
                <p className="overview-description sm:px-4 md:px-6 lg:px-8">
                    Discover how Oracle&apos;s sophisticated AI-driven prediction system processes millions of data points 
                    to generate accurate fantasy football predictions. This multi-layered architecture combines 
                    real-time data processing, advanced machine learning, and natural language AI to deliver 
                    insights that consistently outperform traditional analysis methods.
                </p>
            </div>

            <div className="architecture-sections sm:px-4 md:px-6 lg:px-8">
                {/* System Overview */}
                <section className="architecture-section sm:px-4 md:px-6 lg:px-8">
                    <h3>📊 System Overview</h3>
                    <div className="system-overview sm:px-4 md:px-6 lg:px-8">
                        <div className="overview-stats sm:px-4 md:px-6 lg:px-8">
                            <div className="stat-item sm:px-4 md:px-6 lg:px-8">
                                <span className="stat-number sm:px-4 md:px-6 lg:px-8">5</span>
                                <span className="stat-label sm:px-4 md:px-6 lg:px-8">Architecture Layers</span>
                            </div>
                            <div className="stat-item sm:px-4 md:px-6 lg:px-8">
                                <span className="stat-number sm:px-4 md:px-6 lg:px-8">18</span>
                                <span className="stat-label sm:px-4 md:px-6 lg:px-8">Feature Dimensions</span>
                            </div>
                            <div className="stat-item sm:px-4 md:px-6 lg:px-8">
                                <span className="stat-number sm:px-4 md:px-6 lg:px-8">30s</span>
                                <span className="stat-label sm:px-4 md:px-6 lg:px-8">Update Frequency</span>
                            </div>
                            <div className="stat-item sm:px-4 md:px-6 lg:px-8">
                                <span className="stat-number sm:px-4 md:px-6 lg:px-8">85%+</span>
                                <span className="stat-label sm:px-4 md:px-6 lg:px-8">Accuracy Rate</span>
                            </div>
                        </div>
                        
                        <div className="architecture-diagram sm:px-4 md:px-6 lg:px-8">
                            <div className="diagram-header sm:px-4 md:px-6 lg:px-8">
                                <h4>Prediction Pipeline</h4>
                                <div className="progress-bar sm:px-4 md:px-6 lg:px-8">
                                    <div 
                                        className="progress-fill sm:px-4 md:px-6 lg:px-8" 
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                    <span className="progress-text sm:px-4 md:px-6 lg:px-8">Processing: {progress}%</span>
                                </div>
                            </div>
                            
                            <div className="pipeline-visualization sm:px-4 md:px-6 lg:px-8">
                                {architectureLayers.map((layer, index) => (
}
                                    <button 
                                        key={layer.id} 
                                        className={`pipeline-layer ${activeLayer === layer.id ? &apos;active&apos; : &apos;&apos;}`}
                                        onClick={() => setActiveLayer(layer.id)}
                                        type="button"
                                        aria-label={`Select ${layer.name}`}
                                    >
                                        <div className="pipeline-icon sm:px-4 md:px-6 lg:px-8">{getLayerIcon(layer.id)}</div>
                                        <div className="pipeline-name sm:px-4 md:px-6 lg:px-8">{layer.name}</div>
                                        {index < architectureLayers.length - 1 && (
}
                                            <div className="pipeline-connector sm:px-4 md:px-6 lg:px-8">↓</div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Architecture Layers */}
                <section className="architecture-section sm:px-4 md:px-6 lg:px-8">
                    <h3>🏗️ Architecture Layers</h3>
                    <p className="section-description sm:px-4 md:px-6 lg:px-8">
                        Oracle&apos;s prediction system is built on five interconnected layers, each responsible 
                        for specific aspects of data processing and analysis. Click on each layer to explore 
                        its components and data flow.
                    </p>
                    
                    <div className="architecture-layers sm:px-4 md:px-6 lg:px-8">
                        {architectureLayers.map(renderArchitectureLayer)}
                    </div>
                </section>

                {/* System Components */}
                <section className="architecture-section sm:px-4 md:px-6 lg:px-8">
                    <h3>⚙️ Core Components</h3>
                    <p className="section-description sm:px-4 md:px-6 lg:px-8">
                        Each layer contains specialized components that work together to process data and 
                        generate predictions. Click on components to see their inputs, outputs, and technology stack.
                    </p>
                    
                    <div className="system-components sm:px-4 md:px-6 lg:px-8">
                        {systemComponents.map(renderSystemComponent)}
                    </div>
                </section>

                {/* Data Flow */}
                <section className="architecture-section sm:px-4 md:px-6 lg:px-8">
                    <h3>🔄 Data Flow Process</h3>
                    <div className="section-controls sm:px-4 md:px-6 lg:px-8">
                        <button
                            className={`control-button ${showDataFlow ? &apos;active&apos; : &apos;&apos;}`}
                            onClick={() => setShowDataFlow(!showDataFlow)}
                        >
                            {showDataFlow ? &apos;Hide&apos; : &apos;Show&apos;} Detailed Flow
                        </button>
                    </div>
                    
                    {showDataFlow && (
}
                        <div className="data-flow-visualization sm:px-4 md:px-6 lg:px-8">
                            <p className="flow-description sm:px-4 md:px-6 lg:px-8">
                                Follow the complete journey of data from collection to final prediction output. 
                                Each step builds upon the previous one to create increasingly sophisticated analysis.
                            </p>
                            
                            <div className="data-flow-steps sm:px-4 md:px-6 lg:px-8">
                                {dataFlowSteps.map(renderDataFlowStep)}
                            </div>
                            
                            <div className="flow-summary sm:px-4 md:px-6 lg:px-8">
                                <h4>🎯 End-to-End Processing Time</h4>
                                <div className="timing-breakdown sm:px-4 md:px-6 lg:px-8">
                                    <div className="timing-item sm:px-4 md:px-6 lg:px-8">
                                        <span className="timing-label sm:px-4 md:px-6 lg:px-8">Total Processing:</span>
                                        <span className="timing-value sm:px-4 md:px-6 lg:px-8">90-120 seconds</span>
                                    </div>
                                    <div className="timing-item sm:px-4 md:px-6 lg:px-8">
                                        <span className="timing-label sm:px-4 md:px-6 lg:px-8">Critical Path:</span>
                                        <span className="timing-value sm:px-4 md:px-6 lg:px-8">Data → ML → AI → Output</span>
                                    </div>
                                    <div className="timing-item sm:px-4 md:px-6 lg:px-8">
                                        <span className="timing-label sm:px-4 md:px-6 lg:px-8">Update Frequency:</span>
                                        <span className="timing-value sm:px-4 md:px-6 lg:px-8">Every 30 seconds (10s during games)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Key Insights */}
                <section className="architecture-section sm:px-4 md:px-6 lg:px-8">
                    <h3>💡 Key Architecture Insights</h3>
                    <div className="insights-grid sm:px-4 md:px-6 lg:px-8">
                        <div className="insight-card sm:px-4 md:px-6 lg:px-8">
                            <div className="insight-icon sm:px-4 md:px-6 lg:px-8">🚀</div>
                            <h4>Performance Optimization</h4>
                            <p>
                                Parallel processing across layers enables sub-2-minute prediction generation 
                                while maintaining high accuracy through comprehensive data analysis.
                            </p>
                        </div>
                        
                        <div className="insight-card sm:px-4 md:px-6 lg:px-8">
                            <div className="insight-icon sm:px-4 md:px-6 lg:px-8">🔄</div>
                            <h4>Continuous Learning</h4>
                            <p>
                                The ML layer continuously improves by recording prediction outcomes and 
                                retraining models every 7 days to adapt to changing fantasy football patterns.
                            </p>
                        </div>
                        
                        <div className="insight-card sm:px-4 md:px-6 lg:px-8">
                            <div className="insight-icon sm:px-4 md:px-6 lg:px-8">🎯</div>
                            <h4>Ensemble Accuracy</h4>
                            <p>
                                Multiple prediction models are combined using weighted voting to achieve 
                                higher accuracy than any single model could provide independently.
                            </p>
                        </div>
                        
                        <div className="insight-card sm:px-4 md:px-6 lg:px-8">
                            <div className="insight-icon sm:px-4 md:px-6 lg:px-8">📊</div>
                            <h4>Real-time Adaptation</h4>
                            <p>
                                Live data monitoring allows predictions to adapt instantly to breaking news, 
                                injury reports, and game-time developments for maximum relevance.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Technical Specifications */}
                <section className="architecture-section sm:px-4 md:px-6 lg:px-8">
                    <h3>🔧 Technical Specifications</h3>
                    <div className="tech-specs sm:px-4 md:px-6 lg:px-8">
                        <div className="spec-category sm:px-4 md:px-6 lg:px-8">
                            <h4>Data Processing</h4>
                            <ul>
                                <li><strong>Input Sources:</strong> SportsIO API, Weather APIs, News Feeds</li>
                                <li><strong>Processing Rate:</strong> 1M+ data points per prediction cycle</li>
                                <li><strong>Feature Dimensions:</strong> 18-dimensional feature vectors</li>
                                <li><strong>Update Frequency:</strong> 30-second intervals (10s during games)</li>
                            </ul>
                        </div>
                        
                        <div className="spec-category sm:px-4 md:px-6 lg:px-8">
                            <h4>Machine Learning</h4>
                            <ul>
                                <li><strong>Model Types:</strong> Ensemble methods with multiple algorithms</li>
                                <li><strong>Training Data:</strong> Historical predictions and outcomes</li>
                                <li><strong>Retraining Schedule:</strong> Weekly model optimization</li>
                                <li><strong>Confidence Calibration:</strong> Historical accuracy-based adjustment</li>
                            </ul>
                        </div>
                        
                        <div className="spec-category sm:px-4 md:px-6 lg:px-8">
                            <h4>AI Integration</h4>
                            <ul>
                                <li><strong>AI Engine:</strong> Google Gemini with fantasy football optimization</li>
                                <li><strong>Processing:</strong> Natural language reasoning generation</li>
                                <li><strong>Context Awareness:</strong> User expertise level adaptation</li>
                                <li><strong>Output Quality:</strong> Human-readable explanations</li>
                            </ul>
                        </div>
                        
                        <div className="spec-category sm:px-4 md:px-6 lg:px-8">
                            <h4>Performance Metrics</h4>
                            <ul>
                                <li><strong>Accuracy Rate:</strong> 85%+ across all prediction types</li>
                                <li><strong>Response Time:</strong> &lt; 2 minutes end-to-end</li>
                                <li><strong>Uptime:</strong> 99.9% availability during NFL season</li>
                                <li><strong>Scalability:</strong> Handles 10K+ concurrent users</li>
                            </ul>
                        </div>
                    </div>
                </section>
            </div>

            <div className="overview-footer sm:px-4 md:px-6 lg:px-8">
                <div className="next-steps sm:px-4 md:px-6 lg:px-8">
                    <h4>🎓 Continue Learning</h4>
                    <p>
                        Now that you understand Oracle&apos;s architecture, explore how each component works in detail:
                    </p>
                    <div className="next-step-buttons sm:px-4 md:px-6 lg:px-8">
                        <button className="next-step-btn sm:px-4 md:px-6 lg:px-8">
                            🤖 AI Integration Details
                        </button>
                        <button className="next-step-btn sm:px-4 md:px-6 lg:px-8">
                            📡 Data Processing Deep Dive
                        </button>
                        <button className="next-step-btn sm:px-4 md:px-6 lg:px-8">
                            🧠 Machine Learning Methods
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OracleArchitectureOverviewWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OracleArchitectureOverview {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleArchitectureOverviewWithErrorBoundary);
