import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useState, useEffect } from 'react';
import './OracleFeatureExtractionSection.css';

interface FeatureCategory {
  id: string;
  name: string;
  description: string;
  features: FeatureDetail[];
  color: string;
  icon: string;


interface FeatureDetail {
  id: string;
  name: string;
  type: 'numeric' | 'categorical' | 'boolean' | 'array';
  description: string;
  example: string;
  preprocessing: string[];
  importance: number; // 0-100
  range?: string;
  normalization?: string;

interface PreprocessingStage {
  id: string;
  name: string;
  description: string;
  techniques: string[];
  inputFormat: string;
  outputFormat: string;
  timing: string;
  dependencies: string[];


interface TransformationExample {
  id: string;
  name: string;
  rawData: Record<string, any>;
  transformedData: Record<string, any>;
  steps: string[];
  explanation: string;

interface FeatureEngineeringMethod {
  id: string;
  name: string;
  category: 'aggregation' | 'derivation' | 'interaction' | 'temporal' | 'statistical';
  description: string;
  formula: string;
  examples: string[];
  benefits: string[];


const OracleFeatureExtractionSection: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('player-metrics');
  const [activeStage, setActiveStage] = useState<string>('extraction');
  const [activeExample, setActiveExample] = useState<string>('player-transform');
  const [activeMethod, setActiveMethod] = useState<string>('moving-averages');
  const [isTransformDemo, setIsTransformDemo] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);

  const featureCategories: FeatureCategory[] = [
    {
      id: 'player-metrics',
      name: 'Player Performance Metrics',
      description: 'Individual player statistics and performance indicators extracted from recent games and historical data',
      color: '#3b82f6',
      icon: '🏈',
      features: [
        {
          id: 'recent-performance',
          name: 'Recent Performance Array',
          type: 'array',
          description: 'Last 5 games fantasy point scores with exponential weighting',
          example: '[18.2, 24.7, 11.5, 31.2, 19.8]',
          preprocessing: ['Missing value imputation', 'Exponential smoothing', 'Outlier detection'],
          importance: 85,
          range: '0-50 points per game',
          normalization: 'Min-max scaling (0-1)'
        },
        {
          id: 'position-rank',
          name: 'Position Ranking',
          type: 'numeric',
          description: 'Current rank among players at the same position based on season performance',
          example: '8 (8th best RB)',
          preprocessing: ['Rank calculation', 'Positional normalization'],
          importance: 75,
          range: '1-150 rank',
          normalization: 'Log scaling for rank distribution'
        },
        {
          id: 'injury-risk',
          name: 'Injury Risk Score',
          type: 'numeric',
          description: 'Calculated probability of injury impact based on status and historical patterns',
          example: '0.25 (25% impact risk)',
          preprocessing: ['Categorical encoding', 'Risk modeling', 'Historical correlation'],
          importance: 90,
          range: '0.0-1.0 probability',
          normalization: 'Sigmoid transformation'
        },
        {
          id: 'target-share',
          name: 'Target Share Percentage',
          type: 'numeric',
          description: 'Percentage of team targets/touches directed to this player over recent weeks',
          example: '0.28 (28% of targets)',
          preprocessing: ['Percentage calculation', 'Moving average', 'Team context adjustment'],
          importance: 80,
          range: '0.0-1.0 percentage',
          normalization: 'Beta distribution fitting'
        },
        {
          id: 'matchup-difficulty',
          name: 'Matchup Difficulty Index',
          type: 'numeric',
          description: 'Opponent defense strength against player position with situational adjustments',
          example: '7.2 (tough matchup)',
          preprocessing: ['Defense ranking', 'Situational adjustments', 'Weather factors'],
          importance: 70,
          range: '1-10 difficulty scale',
          normalization: 'Z-score standardization'

    },
    {
      id: 'team-metrics',
      name: 'Team Performance Metrics',
      description: 'Team-level statistics including offensive efficiency, defensive strength, and situational factors',
      color: '#10b981',
      icon: '👥',
      features: [
        {
          id: 'offensive-rank',
          name: 'Offensive Efficiency Rank',
          type: 'numeric',
          description: 'Team ranking in total offensive production and efficiency metrics',
          example: '12 (12th ranked offense)',
          preprocessing: ['Efficiency calculations', 'Positional adjustments', 'Recent form weighting'],
          importance: 65,
          range: '1-32 team ranking',
          normalization: 'Inverse rank transformation'
        },
        {
          id: 'defensive-rank',
          name: 'Defensive Strength Rank',
          type: 'numeric',
          description: 'Opponent defensive ranking against specific positions and play types',
          example: '5 (5th best run defense)',
          preprocessing: ['Position-specific metrics', 'Situational defense', 'Injury adjustments'],
          importance: 70,
          range: '1-32 team ranking',
          normalization: 'Inverse rank transformation'
        },
        {
          id: 'home-advantage',
          name: 'Home Field Advantage',
          type: 'numeric',
          description: 'Quantified home field advantage including crowd, travel, and venue factors',
          example: '2.1 (moderate home advantage)',
          preprocessing: ['Venue analysis', 'Travel distance', 'Crowd impact modeling'],
          importance: 45,
          range: '0-5 advantage points',
          normalization: 'Linear scaling'
        },
        {
          id: 'recent-form',
          name: 'Recent Team Form',
          type: 'array',
          description: 'Team performance trend over last 4 weeks with momentum indicators',
          example: '[1.2, 0.8, 1.5, 1.1]',
          preprocessing: ['Performance indexing', 'Momentum calculation', 'Opponent adjustment'],
          importance: 60,
          range: '0.5-2.0 performance index',
          normalization: 'Centered around 1.0'

    },
    {
      id: 'game-conditions',
      name: 'Game Condition Features',
      description: 'Environmental and situational factors that influence game dynamics and player performance',
      color: '#f59e0b',
      icon: '🌤️',
      features: [
        {
          id: 'weather-conditions',
          name: 'Weather Impact Vector',
          type: 'array',
          description: 'Multi-dimensional weather impact including wind, precipitation, and temperature effects',
          example: '[15.2, 0.1, 0.8] (wind, rain, visibility)',
          preprocessing: ['Weather data aggregation', 'Impact modeling', 'Position-specific effects'],
          importance: 55,
          range: 'Various units per dimension',
          normalization: 'Feature-specific scaling'
        },
        {
          id: 'game-importance',
          name: 'Game Importance Score',
          type: 'numeric',
          description: 'Calculated importance based on playoff implications, divisional matchups, and season timing',
          example: '7.8 (high importance)',
          preprocessing: ['Playoff probability', 'Divisional weighting', 'Season context'],
          importance: 40,
          range: '1-10 importance scale',
          normalization: 'Exponential scaling'
        },
        {
          id: 'rest-days',
          name: 'Rest Days Count',
          type: 'numeric',
          description: 'Number of days between games with fatigue and recovery modeling',
          example: '6 (standard week)',
          preprocessing: ['Rest calculation', 'Fatigue modeling', 'Travel adjustment'],
          importance: 35,
          range: '3-14 days',
          normalization: 'Optimal rest curve fitting'
        },
        {
          id: 'travel-distance',
          name: 'Travel Distance',
          type: 'numeric',
          description: 'Miles traveled for away games with jet lag and fatigue considerations',
          example: '1247 (cross-country)',
          preprocessing: ['Distance calculation', 'Time zone adjustment', 'Fatigue correlation'],
          importance: 25,
          range: '0-3000 miles',
          normalization: 'Logarithmic scaling'

    },
    {
      id: 'historical-patterns',
      name: 'Historical Pattern Features',
      description: 'Long-term trends, seasonal patterns, and historical performance indicators',
      color: '#8b5cf6',
      icon: '📊',
      features: [
        {
          id: 'head-to-head',
          name: 'Head-to-Head Record',
          type: 'array',
          description: 'Historical performance in similar matchups and opponent-specific trends',
          example: '[0.85, 0.72] (win rate, performance index)',
          preprocessing: ['Historical lookup', 'Performance indexing', 'Recency weighting'],
          importance: 50,
          range: '0.0-1.0 for rates, 0.5-2.0 for index',
          normalization: 'Historical distribution fitting'
        },
        {
          id: 'seasonal-trends',
          name: 'Seasonal Performance Trends',
          type: 'array',
          description: 'Performance patterns across different parts of the season and weather conditions',
          example: '[1.1, 0.9, 1.2] (early, mid, late season)',
          preprocessing: ['Seasonal decomposition', 'Trend analysis', 'Weather correlation'],
          importance: 45,
          range: '0.5-2.0 performance multiplier',
          normalization: 'Seasonal curve normalization'
        },
        {
          id: 'venue-performance',
          name: 'Venue-Specific Performance',
          type: 'array',
          description: 'Historical performance at specific venues with environmental and psychological factors',
          example: '[22.4] (avg points at venue)',
          preprocessing: ['Venue lookup', 'Sample size weighting', 'Confidence intervals'],
          importance: 30,
          range: '0-50 average points',
          normalization: 'Venue-specific z-scores'

    },
    {
      id: 'contextual-factors',
      name: 'Contextual & Market Features',
      description: 'Advanced contextual information including market sentiment, coaching tendencies, and meta-factors',
      color: '#ef4444',
      icon: '🎯',
      features: [
        {
          id: 'time-of-season',
          name: 'Season Progress Factor',
          type: 'numeric',
          description: 'Normalized season progress with playoff and late-season adjustment factors',
          example: '0.67 (week 12 of 18)',
          preprocessing: ['Week normalization', 'Playoff weighting', 'Motivation factors'],
          importance: 35,
          range: '0.0-1.0 season progress',
          normalization: 'Linear with playoff adjustment'
        },
        {
          id: 'week-type',
          name: 'Week Type Classification',
          type: 'categorical',
          description: 'Type of week (regular, playoff, championship) with performance pattern adjustments',
          example: 'REGULAR (regular season)',
          preprocessing: ['Categorical encoding', 'One-hot encoding', 'Performance pattern lookup'],
          importance: 40,
          range: 'REGULAR, PLAYOFF, CHAMPIONSHIP',
          normalization: 'Binary encoding vector'
        },
        {
          id: 'market-confidence',
          name: 'Market Confidence Index',
          type: 'numeric',
          description: 'Aggregated market sentiment and expert consensus confidence in player performance',
          example: '0.78 (high confidence)',
          preprocessing: ['Sentiment aggregation', 'Expert weighting', 'Confidence calibration'],
          importance: 60,
          range: '0.0-1.0 confidence',
          normalization: 'Sigmoid calibration'

  ];

  const preprocessingStages: PreprocessingStage[] = [
    {
      id: 'extraction',
      name: 'Raw Data Extraction',
      description: 'Extract relevant features from validated sports data using domain-specific algorithms',
      techniques: ['Statistical aggregation', 'Time-series analysis', 'Pattern recognition', 'Domain calculations'],
      inputFormat: 'Validated sports data (JSON/structured)',
      outputFormat: 'Raw feature values (numeric/categorical)',
      timing: '< 500ms per player/game',
      dependencies: ['Data validation', 'Historical database', 'Real-time feeds']
    },
    {
      id: 'cleaning',
      name: 'Data Cleaning & Validation',
      description: 'Clean extracted features, handle missing values, and validate data quality',
      techniques: ['Missing value imputation', 'Outlier detection', 'Data type validation', 'Range checking'],
      inputFormat: 'Raw feature values',
      outputFormat: 'Clean feature vectors',
      timing: '< 200ms per feature set',
      dependencies: ['Feature extraction', 'Quality thresholds']
    },
    {
      id: 'engineering',
      name: 'Feature Engineering',
      description: 'Create derived features, interactions, and advanced statistical measures',
      techniques: ['Feature derivation', 'Interaction terms', 'Statistical aggregation', 'Domain transformations'],
      inputFormat: 'Clean feature vectors',
      outputFormat: 'Engineered feature space',
      timing: '< 1 second per feature set',
      dependencies: ['Clean data', 'Domain knowledge', 'Historical patterns']
    },
    {
      id: 'normalization',
      name: 'Normalization & Scaling',
      description: 'Apply mathematical transformations to ensure optimal ML algorithm performance',
      techniques: ['Min-max scaling', 'Z-score standardization', 'Robust scaling', 'Feature-specific transforms'],
      inputFormat: 'Engineered features',
      outputFormat: 'Normalized feature vectors',
      timing: '< 100ms per feature set',
      dependencies: ['Feature engineering', 'Scaling parameters', 'Distribution analysis']
    },
    {
      id: 'vectorization',
      name: 'Vector Assembly',
      description: 'Combine all features into final 18-dimensional vectors ready for ML algorithms',
      techniques: ['Vector concatenation', 'Dimensionality verification', 'Quality assurance', 'Format standardization'],
      inputFormat: 'Normalized features',
      outputFormat: '18-dimensional feature vectors',
      timing: '< 50ms per vector',
      dependencies: ['All preprocessing stages', 'ML model requirements']

  ];

  const transformationExamples: TransformationExample[] = [
    {
      id: 'player-transform',
      name: 'Player Performance Transformation',
      rawData: {
        name: 'Josh Allen',
        position: 'QB',
        recent_games: [24.7, 31.2, 18.4, 42.1, 28.5],
        injury_status: 'questionable',
        targets: 42,
        team_targets: 156,
        opponent_rank: 18
      },
      transformedData: {
        playerRecentPerformance: [0.494, 0.624, 0.368, 0.842, 0.570],
        playerPositionRank: 0.97,
        playerInjuryRisk: 0.35,
        playerTargetShare: 0.269,
        playerMatchupDifficulty: 6.2
      },
      steps: [
        'Normalize recent performance using min-max scaling (0-50 range)',
        'Calculate position rank percentile (top 3% of QBs)',
        'Convert injury status to risk probability (questionable = 35%)',
        'Calculate target share percentage (42/156 = 26.9%)',
        'Assess matchup difficulty based on opponent ranking'
        ],
      explanation: 'Player statistics are transformed into normalized values that ML algorithms can process effectively. Each transformation preserves the relative importance while ensuring consistent scaling.'
    },
    {
      id: 'team-transform',
      name: 'Team Metrics Transformation',
      rawData: {
        team: 'Buffalo Bills',
        offensive_rank: 5,
        defensive_opponent_rank: 22,
        home_game: true,
        recent_form: ['W', 'W', 'L', 'W'],
        venue: 'Highmark Stadium'
      },
      transformedData: {
        teamOffensiveRank: 0.844,
        teamDefensiveRank: 0.344,
        teamHomeAdvantage: 2.1,
        teamRecentForm: [1.3, 1.3, 0.7, 1.3]
      },
      steps: [
        'Convert offensive rank to percentile score (5th = 84.4%)',
        'Convert opponent defensive rank (22nd = 34.4%)',
        'Apply home field advantage based on venue characteristics',
        'Transform W/L record to performance index values'
      ],
      explanation: 'Team metrics are converted to performance indicators that capture relative strength and situational advantages in a format suitable for mathematical modeling.'
    },
    {
      id: 'weather-transform',
      name: 'Environmental Conditions Transformation',
      rawData: {
        temperature: 45,
        wind_speed: 12,
        precipitation: 0.2,
        visibility: 8,
        dome: false,
        game_time: '1:00 PM'
      },
      transformedData: {
        weatherConditions: [12.0, 0.2, 0.8],
        gameImportance: 6.5,
        restDays: 7
      },
      steps: [
        'Extract weather vector [wind_speed, precipitation, visibility_factor]',
        'Calculate game importance based on timing and context',
        'Determine rest days from previous game'
      ],
      explanation: 'Environmental factors are quantified into numerical representations that capture their impact on player performance and game dynamics.'

  ];

  const engineeringMethods: FeatureEngineeringMethod[] = [
    {
      id: 'moving-averages',
      name: 'Exponential Moving Averages',
      category: 'temporal',
      description: 'Weight recent performances more heavily using exponential decay for trend analysis',
      formula: 'EMA(t) = α × Value(t) + (1-α) × EMA(t-1)',
      examples: ['Recent performance trends', 'Target share evolution', 'Team efficiency progression'],
      benefits: ['Captures momentum', 'Reduces noise', 'Emphasizes recent form']
    },
    {
      id: 'interaction-terms',
      name: 'Feature Interactions',
      category: 'interaction',
      description: 'Create new features by combining existing ones to capture complex relationships',
      formula: 'Interaction = Feature_A × Feature_B × Weight_Factor',
      examples: ['Player efficiency × Matchup difficulty', 'Weather impact × Home advantage', 'Rest days × Travel distance'],
      benefits: ['Captures non-linear relationships', 'Improves model accuracy', 'Reveals hidden patterns']
    },
    {
      id: 'statistical-aggregation',
      name: 'Statistical Aggregations',
      category: 'statistical',
      description: 'Derive statistical measures from time series and multi-dimensional data',
      formula: 'Aggregation = f(mean, std, percentiles, trends)',
      examples: ['Performance consistency scores', 'Volatility indicators', 'Trend momentum metrics'],
      benefits: ['Quantifies uncertainty', 'Measures consistency', 'Captures distribution shape']
    },
    {
      id: 'domain-specific',
      name: 'Domain-Specific Calculations',
      category: 'derivation',
      description: 'Apply football-specific knowledge to create meaningful derived features',
      formula: 'Domain_Feature = Sport_Specific_Formula(inputs)',
      examples: ['Red zone efficiency', 'Garbage time adjustment', 'Strength of schedule'],
      benefits: ['Incorporates expertise', 'Sport-specific insights', 'Contextual understanding']
    },
    {
      id: 'temporal-patterns',
      name: 'Temporal Pattern Detection',
      category: 'temporal',
      description: 'Identify and quantify time-based patterns in player and team performance',
      formula: 'Pattern_Score = Correlation(performance, time_factors)',
      examples: ['Prime time performance', 'Divisional game patterns', 'Season progression trends'],
      benefits: ['Captures timing effects', 'Seasonal adjustments', 'Situational performance']

  ];

  useEffect(() => {
    if (isTransformDemo) {
      const interval = setInterval(() => {
        setDemoStep((prev: any) => {
          if (prev >= preprocessingStages.length - 1) {
            setIsTransformDemo(false);
            return 0;

          return prev + 1;
        });
      }, 2500);

      return () => clearInterval(interval);

  }, [isTransformDemo, preprocessingStages.length]);

  const startTransformDemo = () => {
    setDemoStep(0);
    setIsTransformDemo(true);
  };

  const selectedCategory = featureCategories.find((cat: any) => cat.id === activeCategory);
  const selectedExample = transformationExamples.find((example: any) => example.id === activeExample);
  const selectedMethod = engineeringMethods.find((method: any) => method.id === activeMethod);

  return (
    <div className="oracle-feature-extraction-section sm:px-4 md:px-6 lg:px-8">
      <div className="section-header sm:px-4 md:px-6 lg:px-8">
        <h2 className="section-title sm:px-4 md:px-6 lg:px-8">
          <span className="title-icon sm:px-4 md:px-6 lg:px-8">🔧</span>
          {' '}
          Feature Extraction & Preprocessing
        </h2>
        <p className="section-description sm:px-4 md:px-6 lg:px-8">
          Discover how Oracle transforms raw sports data into 18-dimensional feature vectors using advanced 
          mathematical preprocessing, feature engineering, and domain-specific transformations for optimal 
          machine learning performance.
        </p>
      </div>

      {/* Feature Categories Overview */}
      <div className="content-section sm:px-4 md:px-6 lg:px-8">
        <h3 className="subsection-title sm:px-4 md:px-6 lg:px-8">
          <span className="subsection-icon sm:px-4 md:px-6 lg:px-8">📁</span>
          {' '}
          Feature Categories & Dimensions
        </h3>
        <p className="subsection-description sm:px-4 md:px-6 lg:px-8">
          Oracle's 18-dimensional feature space encompasses 5 major categories, each contributing critical 
          information for prediction accuracy and model performance.
        </p>

        <div className="feature-categories-grid sm:px-4 md:px-6 lg:px-8">
          {featureCategories.map((category: any) => (
            <button
              key={category.id}
              className={`category-card ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
              style={{ borderLeftColor: category.color }}
              aria-label={`Explore ${category.name} features`}
            >
              <div className="category-header sm:px-4 md:px-6 lg:px-8">
                <span className="category-icon sm:px-4 md:px-6 lg:px-8">{category.icon}</span>
                <h4 className="category-name sm:px-4 md:px-6 lg:px-8">{category.name}</h4>
              </div>
              <p className="category-description sm:px-4 md:px-6 lg:px-8">{category.description}</p>
              <div className="category-stats sm:px-4 md:px-6 lg:px-8">
                <span className="feature-count sm:px-4 md:px-6 lg:px-8">{category.features.length} Features</span>
                <span className="avg-importance sm:px-4 md:px-6 lg:px-8">
                  Avg Importance: {Math.round(category.features.reduce((sum, f) => sum + f.importance, 0) / category.features.length)}%
                </span>
              </div>
            </button>
          ))}
        </div>

        {selectedCategory && (
          <div className="category-details sm:px-4 md:px-6 lg:px-8">
            <div className="category-details-header sm:px-4 md:px-6 lg:px-8">
              <h4>{selectedCategory.name}</h4>
              <span className="feature-count-badge sm:px-4 md:px-6 lg:px-8">{selectedCategory.features.length} Features</span>
            </div>
            
            <div className="features-list sm:px-4 md:px-6 lg:px-8">
              {selectedCategory.features.map((feature: any) => (
                <div key={feature.id} className="feature-item sm:px-4 md:px-6 lg:px-8">
                  <div className="feature-header sm:px-4 md:px-6 lg:px-8">
                    <div className="feature-info sm:px-4 md:px-6 lg:px-8">
                      <h5 className="feature-name sm:px-4 md:px-6 lg:px-8">{feature.name}</h5>
                      <span className={`feature-type ${feature.type}`}>{feature.type}</span>
                    </div>
                    <div className="feature-importance sm:px-4 md:px-6 lg:px-8">
                      <span className="importance-label sm:px-4 md:px-6 lg:px-8">Importance</span>
                      <div className="importance-bar sm:px-4 md:px-6 lg:px-8">
                        <div 
                          className="importance-fill sm:px-4 md:px-6 lg:px-8" 
                          style={{ width: `${feature.importance}%`, backgroundColor: selectedCategory.color }}
                        />
                      </div>
                      <span className="importance-value sm:px-4 md:px-6 lg:px-8">{feature.importance}%</span>
                    </div>
                  </div>
                  
                  <p className="feature-description sm:px-4 md:px-6 lg:px-8">{feature.description}</p>
                  
                  <div className="feature-details-grid sm:px-4 md:px-6 lg:px-8">
                    <div className="detail-group sm:px-4 md:px-6 lg:px-8">
                      <h6>Example Value</h6>
                      <code className="example-value sm:px-4 md:px-6 lg:px-8">{feature.example}</code>
                    </div>
                    
                    <div className="detail-group sm:px-4 md:px-6 lg:px-8">
                      <h6>Range</h6>
                      <span className="range-value sm:px-4 md:px-6 lg:px-8">{feature.range}</span>
                    </div>
                    
                    <div className="detail-group sm:px-4 md:px-6 lg:px-8">
                      <h6>Normalization</h6>
                      <span className="normalization-value sm:px-4 md:px-6 lg:px-8">{feature.normalization}</span>
                    </div>
                  </div>
                  
                  <div className="preprocessing-steps sm:px-4 md:px-6 lg:px-8">
                    <h6>Preprocessing Steps</h6>
                    <ul className="preprocessing-list sm:px-4 md:px-6 lg:px-8">
                      {feature.preprocessing.map((step: any) => (
                        <li key={`${feature.id}-${step}`} className="preprocessing-step sm:px-4 md:px-6 lg:px-8">{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preprocessing Pipeline */}
      <div className="content-section sm:px-4 md:px-6 lg:px-8">
        <h3 className="subsection-title sm:px-4 md:px-6 lg:px-8">
          <span className="subsection-icon sm:px-4 md:px-6 lg:px-8">⚙️</span>
          {' '}
          Preprocessing Pipeline
        </h3>
        <p className="subsection-description sm:px-4 md:px-6 lg:px-8">
          Oracle's five-stage preprocessing pipeline transforms raw sports data into ML-ready feature vectors 
          through systematic cleaning, engineering, and normalization processes.
        </p>

        <div className="pipeline-demo-controls sm:px-4 md:px-6 lg:px-8">
          <button
            className="demo-button sm:px-4 md:px-6 lg:px-8"
            onClick={startTransformDemo}
            disabled={isTransformDemo}
            aria-label="Start preprocessing pipeline demonstration"
          >
            {isTransformDemo ? 'Processing...' : 'Watch Transformation Demo'}
          </button>
        </div>

        <div className="preprocessing-pipeline sm:px-4 md:px-6 lg:px-8">
          {preprocessingStages.map((stage, index) => (
            <div
              key={stage.id}
              className={`pipeline-stage ${activeStage === stage.id ? 'active' : ''} ${
                isTransformDemo && index === demoStep ? 'processing' : ''
              } ${isTransformDemo && index < demoStep ? 'completed' : ''}`}
            >
              <button
                className="stage-header sm:px-4 md:px-6 lg:px-8"
                onClick={() => setActiveStage(stage.id)}
                aria-label={`View details for ${stage.name}`}
              >
                <div className="stage-number sm:px-4 md:px-6 lg:px-8">{index + 1}</div>
                <div className="stage-info sm:px-4 md:px-6 lg:px-8">
                  <h4 className="stage-name sm:px-4 md:px-6 lg:px-8">{stage.name}</h4>
                  <span className="stage-timing sm:px-4 md:px-6 lg:px-8">{stage.timing}</span>
                </div>
                <div className="stage-status sm:px-4 md:px-6 lg:px-8">
                  {isTransformDemo && index === demoStep && (
                    <div className="processing-indicator sm:px-4 md:px-6 lg:px-8">Transforming...</div>
                  )}
                  {isTransformDemo && index < demoStep && (
                    <div className="completed-indicator sm:px-4 md:px-6 lg:px-8">✓</div>
                  )}
                </div>
              </button>

              {activeStage === stage.id && (
                <div className="stage-details sm:px-4 md:px-6 lg:px-8">
                  <p className="stage-description sm:px-4 md:px-6 lg:px-8">{stage.description}</p>
                  
                  <div className="stage-content-grid sm:px-4 md:px-6 lg:px-8">
                    <div className="content-group sm:px-4 md:px-6 lg:px-8">
                      <h5>Techniques Applied</h5>
                      <ul className="techniques-list sm:px-4 md:px-6 lg:px-8">
                        {stage.techniques.map((technique: any) => (
                          <li key={`${stage.id}-${technique}`} className="technique-item sm:px-4 md:px-6 lg:px-8">{technique}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="content-group sm:px-4 md:px-6 lg:px-8">
                      <h5>Dependencies</h5>
                      <ul className="dependencies-list sm:px-4 md:px-6 lg:px-8">
                        {stage.dependencies.map((dependency: any) => (
                          <li key={`${stage.id}-${dependency}`} className="dependency-item sm:px-4 md:px-6 lg:px-8">{dependency}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="data-flow sm:px-4 md:px-6 lg:px-8">
                    <div className="flow-item sm:px-4 md:px-6 lg:px-8">
                      <h6>Input Format</h6>
                      <span className="format-description sm:px-4 md:px-6 lg:px-8">{stage.inputFormat}</span>
                    </div>
                    <div className="flow-arrow sm:px-4 md:px-6 lg:px-8">→</div>
                    <div className="flow-item sm:px-4 md:px-6 lg:px-8">
                      <h6>Output Format</h6>
                      <span className="format-description sm:px-4 md:px-6 lg:px-8">{stage.outputFormat}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Transformation Examples */}
      <div className="content-section sm:px-4 md:px-6 lg:px-8">
        <h3 className="subsection-title sm:px-4 md:px-6 lg:px-8">
          <span className="subsection-icon sm:px-4 md:px-6 lg:px-8">🔄</span>
          {' '}
          Real-World Transformation Examples
        </h3>
        <p className="subsection-description sm:px-4 md:px-6 lg:px-8">
          See how Oracle transforms actual sports data into feature vectors through step-by-step examples 
          showing the mathematical processes and domain-specific adjustments.
        </p>

        <div className="example-tabs sm:px-4 md:px-6 lg:px-8">
          {transformationExamples.map((example: any) => (
            <button
              key={example.id}
              className={`example-tab ${activeExample === example.id ? 'active' : ''}`}
              onClick={() => setActiveExample(example.id)}
              aria-label={`View ${example.name} example`}
            >
              {example.name}
            </button>
          ))}
        </div>

        {selectedExample && (
          <div className="transformation-example sm:px-4 md:px-6 lg:px-8">
            <div className="example-header sm:px-4 md:px-6 lg:px-8">
              <h4>{selectedExample.name}</h4>
            </div>
            
            <div className="transformation-flow sm:px-4 md:px-6 lg:px-8">
              <div className="data-section sm:px-4 md:px-6 lg:px-8">
                <h5>Raw Input Data</h5>
                <div className="data-display sm:px-4 md:px-6 lg:px-8">
                  {Object.entries(selectedExample.rawData).map(([key, value]) => (
                    <div key={key} className="data-item sm:px-4 md:px-6 lg:px-8">
                      <span className="data-key sm:px-4 md:px-6 lg:px-8">{key}:</span>
                      <span className="data-value sm:px-4 md:px-6 lg:px-8">
                        {Array.isArray(value) ? `[${value.join(', ')}]` : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="transformation-arrow sm:px-4 md:px-6 lg:px-8">
                <span className="arrow-text sm:px-4 md:px-6 lg:px-8">Transform</span>
                <div className="arrow-icon sm:px-4 md:px-6 lg:px-8">⇓</div>
              </div>
              
              <div className="data-section sm:px-4 md:px-6 lg:px-8">
                <h5>Processed Feature Vector</h5>
                <div className="data-display sm:px-4 md:px-6 lg:px-8">
                  {Object.entries(selectedExample.transformedData).map(([key, value]) => (
                    <div key={key} className="data-item sm:px-4 md:px-6 lg:px-8">
                      <span className="data-key sm:px-4 md:px-6 lg:px-8">{key}:</span>
                      <span className="data-value sm:px-4 md:px-6 lg:px-8">
                        {(() => {
                          if (Array.isArray(value)) {
                            return `[${value.map((v: any) => typeof v === 'number' ? v.toFixed(3) : v).join(', ')}]`;

                          if (typeof value === 'number') {
                            return value.toFixed(3);

                          return String(value);
                        })()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="transformation-steps sm:px-4 md:px-6 lg:px-8">
              <h5>Transformation Steps</h5>
              <ol className="steps-list sm:px-4 md:px-6 lg:px-8">
                {selectedExample.steps.map((step: any) => (
                  <li key={`${selectedExample.id}-step-${step.slice(0, 20)}`} className="step-item sm:px-4 md:px-6 lg:px-8">{step}</li>
                ))}
              </ol>
            </div>
            
            <div className="explanation-section sm:px-4 md:px-6 lg:px-8">
              <h5>Technical Explanation</h5>
              <p className="explanation-text sm:px-4 md:px-6 lg:px-8">{selectedExample.explanation}</p>
            </div>
          </div>
        )}
      </div>

      {/* Feature Engineering Methods */}
      <div className="content-section sm:px-4 md:px-6 lg:px-8">
        <h3 className="subsection-title sm:px-4 md:px-6 lg:px-8">
          <span className="subsection-icon sm:px-4 md:px-6 lg:px-8">🧪</span>
          {' '}
          Advanced Feature Engineering
        </h3>
        <p className="subsection-description sm:px-4 md:px-6 lg:px-8">
          Oracle employs sophisticated feature engineering techniques to extract maximum predictive value 
          from sports data through mathematical transformations and domain expertise.
        </p>

        <div className="engineering-methods-grid sm:px-4 md:px-6 lg:px-8">
          {engineeringMethods.map((method: any) => (
            <button
              key={method.id}
              className={`method-card ${activeMethod === method.id ? 'active' : ''}`}
              onClick={() => setActiveMethod(method.id)}
              aria-label={`Learn about ${method.name}`}
            >
              <div className="method-header sm:px-4 md:px-6 lg:px-8">
                <h4 className="method-name sm:px-4 md:px-6 lg:px-8">{method.name}</h4>
                <span className={`method-category ${method.category}`}>
                  {method.category}
                </span>
              </div>
              <p className="method-description sm:px-4 md:px-6 lg:px-8">{method.description}</p>
            </button>
          ))}
        </div>

        {selectedMethod && (
          <div className="method-details sm:px-4 md:px-6 lg:px-8">
            <div className="method-details-header sm:px-4 md:px-6 lg:px-8">
              <h4>{selectedMethod.name}</h4>
              <span className={`category-badge ${selectedMethod.category}`}>
                {selectedMethod.category}
              </span>
            </div>
            
            <p className="method-full-description sm:px-4 md:px-6 lg:px-8">{selectedMethod.description}</p>
            
            <div className="method-content sm:px-4 md:px-6 lg:px-8">
              <div className="formula-section sm:px-4 md:px-6 lg:px-8">
                <h5>Mathematical Formula</h5>
                <code className="formula sm:px-4 md:px-6 lg:px-8">{selectedMethod.formula}</code>
              </div>
              
              <div className="examples-section sm:px-4 md:px-6 lg:px-8">
                <h5>Application Examples</h5>
                <ul className="examples-list sm:px-4 md:px-6 lg:px-8">
                  {selectedMethod.examples.map((example: any) => (
                    <li key={`${selectedMethod.id}-${example}`} className="example-item sm:px-4 md:px-6 lg:px-8">{example}</li>
                  ))}
                </ul>
              </div>
              
              <div className="benefits-section sm:px-4 md:px-6 lg:px-8">
                <h5>Key Benefits</h5>
                <ul className="benefits-list sm:px-4 md:px-6 lg:px-8">
                  {selectedMethod.benefits.map((benefit: any) => (
                    <li key={`${selectedMethod.id}-${benefit}`} className="benefit-item sm:px-4 md:px-6 lg:px-8">{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Key Insights */}
      <div className="content-section sm:px-4 md:px-6 lg:px-8">
        <h3 className="subsection-title sm:px-4 md:px-6 lg:px-8">
          <span className="subsection-icon sm:px-4 md:px-6 lg:px-8">💡</span>
          {' '}
          Feature Engineering Insights
        </h3>
        
        <div className="insights-grid sm:px-4 md:px-6 lg:px-8">
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h4>Dimensional Efficiency</h4>
            <p>
              Oracle's 18-dimensional feature space represents an optimal balance between information richness 
              and computational efficiency, capturing 95%+ of predictive variance in sports data.
            </p>
          </div>
          
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h4>Domain-Specific Scaling</h4>
            <p>
              Each feature uses sport-specific normalization techniques that preserve meaningful relationships 
              while ensuring optimal ML algorithm performance across diverse data types.
            </p>
          </div>
          
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h4>Temporal Weighting</h4>
            <p>
              Recent performance data receives exponential weighting to capture momentum and current form, 
              with decay parameters optimized through historical backtesting.
            </p>
          </div>
          
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h4>Interaction Discovery</h4>
            <p>
              Machine learning automatically discovers feature interactions during training, with the most 
              predictive combinations being weather×matchup and rest×travel correlations.
            </p>
          </div>
          
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h4>Real-Time Adaptation</h4>
            <p>
              Feature scaling parameters are continuously updated based on league-wide performance trends, 
              ensuring Oracle adapts to evolving game dynamics and rule changes.
            </p>
          </div>
          
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h4>Quality Assurance</h4>
            <p>
              Every feature vector undergoes 15+ validation checks before reaching ML algorithms, with 
              automatic fallback to historical averages for missing or invalid data points.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const OracleFeatureExtractionSectionWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OracleFeatureExtractionSection {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleFeatureExtractionSectionWithErrorBoundary);
