import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useEffect } from &apos;react&apos;;
import &apos;./OracleFeatureExtractionSection.css&apos;;

interface FeatureCategory {
}
  id: string;
  name: string;
  description: string;
  features: FeatureDetail[];
  color: string;
  icon: string;

}

interface FeatureDetail {
}
  id: string;
  name: string;
  type: &apos;numeric&apos; | &apos;categorical&apos; | &apos;boolean&apos; | &apos;array&apos;;
  description: string;
  example: string;
  preprocessing: string[];
  importance: number; // 0-100
  range?: string;
  normalization?: string;

interface PreprocessingStage {
}
  id: string;
  name: string;
  description: string;
  techniques: string[];
  inputFormat: string;
  outputFormat: string;
  timing: string;
  dependencies: string[];

}

interface TransformationExample {
}
  id: string;
  name: string;
  rawData: Record<string, any>;
  transformedData: Record<string, any>;
  steps: string[];
  explanation: string;

interface FeatureEngineeringMethod {
}
  id: string;
  name: string;
  category: &apos;aggregation&apos; | &apos;derivation&apos; | &apos;interaction&apos; | &apos;temporal&apos; | &apos;statistical&apos;;
  description: string;
  formula: string;
  examples: string[];
  benefits: string[];

}

const OracleFeatureExtractionSection: React.FC = () => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(&apos;player-metrics&apos;);
  const [activeStage, setActiveStage] = useState<string>(&apos;extraction&apos;);
  const [activeExample, setActiveExample] = useState<string>(&apos;player-transform&apos;);
  const [activeMethod, setActiveMethod] = useState<string>(&apos;moving-averages&apos;);
  const [isTransformDemo, setIsTransformDemo] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);

  const featureCategories: FeatureCategory[] = [
    {
}
      id: &apos;player-metrics&apos;,
      name: &apos;Player Performance Metrics&apos;,
      description: &apos;Individual player statistics and performance indicators extracted from recent games and historical data&apos;,
      color: &apos;#3b82f6&apos;,
      icon: &apos;🏈&apos;,
      features: [
        {
}
          id: &apos;recent-performance&apos;,
          name: &apos;Recent Performance Array&apos;,
          type: &apos;array&apos;,
          description: &apos;Last 5 games fantasy point scores with exponential weighting&apos;,
          example: &apos;[18.2, 24.7, 11.5, 31.2, 19.8]&apos;,
          preprocessing: [&apos;Missing value imputation&apos;, &apos;Exponential smoothing&apos;, &apos;Outlier detection&apos;],
          importance: 85,
          range: &apos;0-50 points per game&apos;,
          normalization: &apos;Min-max scaling (0-1)&apos;
        },
        {
}
          id: &apos;position-rank&apos;,
          name: &apos;Position Ranking&apos;,
          type: &apos;numeric&apos;,
          description: &apos;Current rank among players at the same position based on season performance&apos;,
          example: &apos;8 (8th best RB)&apos;,
          preprocessing: [&apos;Rank calculation&apos;, &apos;Positional normalization&apos;],
          importance: 75,
          range: &apos;1-150 rank&apos;,
          normalization: &apos;Log scaling for rank distribution&apos;
        },
        {
}
          id: &apos;injury-risk&apos;,
          name: &apos;Injury Risk Score&apos;,
          type: &apos;numeric&apos;,
          description: &apos;Calculated probability of injury impact based on status and historical patterns&apos;,
          example: &apos;0.25 (25% impact risk)&apos;,
          preprocessing: [&apos;Categorical encoding&apos;, &apos;Risk modeling&apos;, &apos;Historical correlation&apos;],
          importance: 90,
          range: &apos;0.0-1.0 probability&apos;,
          normalization: &apos;Sigmoid transformation&apos;
        },
        {
}
          id: &apos;target-share&apos;,
          name: &apos;Target Share Percentage&apos;,
          type: &apos;numeric&apos;,
          description: &apos;Percentage of team targets/touches directed to this player over recent weeks&apos;,
          example: &apos;0.28 (28% of targets)&apos;,
          preprocessing: [&apos;Percentage calculation&apos;, &apos;Moving average&apos;, &apos;Team context adjustment&apos;],
          importance: 80,
          range: &apos;0.0-1.0 percentage&apos;,
          normalization: &apos;Beta distribution fitting&apos;
        },
        {
}
          id: &apos;matchup-difficulty&apos;,
          name: &apos;Matchup Difficulty Index&apos;,
          type: &apos;numeric&apos;,
          description: &apos;Opponent defense strength against player position with situational adjustments&apos;,
          example: &apos;7.2 (tough matchup)&apos;,
          preprocessing: [&apos;Defense ranking&apos;, &apos;Situational adjustments&apos;, &apos;Weather factors&apos;],
          importance: 70,
          range: &apos;1-10 difficulty scale&apos;,
          normalization: &apos;Z-score standardization&apos;

    },
    {
}
      id: &apos;team-metrics&apos;,
      name: &apos;Team Performance Metrics&apos;,
      description: &apos;Team-level statistics including offensive efficiency, defensive strength, and situational factors&apos;,
      color: &apos;#10b981&apos;,
      icon: &apos;👥&apos;,
      features: [
        {
}
          id: &apos;offensive-rank&apos;,
          name: &apos;Offensive Efficiency Rank&apos;,
          type: &apos;numeric&apos;,
          description: &apos;Team ranking in total offensive production and efficiency metrics&apos;,
          example: &apos;12 (12th ranked offense)&apos;,
          preprocessing: [&apos;Efficiency calculations&apos;, &apos;Positional adjustments&apos;, &apos;Recent form weighting&apos;],
          importance: 65,
          range: &apos;1-32 team ranking&apos;,
          normalization: &apos;Inverse rank transformation&apos;
        },
        {
}
          id: &apos;defensive-rank&apos;,
          name: &apos;Defensive Strength Rank&apos;,
          type: &apos;numeric&apos;,
          description: &apos;Opponent defensive ranking against specific positions and play types&apos;,
          example: &apos;5 (5th best run defense)&apos;,
          preprocessing: [&apos;Position-specific metrics&apos;, &apos;Situational defense&apos;, &apos;Injury adjustments&apos;],
          importance: 70,
          range: &apos;1-32 team ranking&apos;,
          normalization: &apos;Inverse rank transformation&apos;
        },
        {
}
          id: &apos;home-advantage&apos;,
          name: &apos;Home Field Advantage&apos;,
          type: &apos;numeric&apos;,
          description: &apos;Quantified home field advantage including crowd, travel, and venue factors&apos;,
          example: &apos;2.1 (moderate home advantage)&apos;,
          preprocessing: [&apos;Venue analysis&apos;, &apos;Travel distance&apos;, &apos;Crowd impact modeling&apos;],
          importance: 45,
          range: &apos;0-5 advantage points&apos;,
          normalization: &apos;Linear scaling&apos;
        },
        {
}
          id: &apos;recent-form&apos;,
          name: &apos;Recent Team Form&apos;,
          type: &apos;array&apos;,
          description: &apos;Team performance trend over last 4 weeks with momentum indicators&apos;,
          example: &apos;[1.2, 0.8, 1.5, 1.1]&apos;,
          preprocessing: [&apos;Performance indexing&apos;, &apos;Momentum calculation&apos;, &apos;Opponent adjustment&apos;],
          importance: 60,
          range: &apos;0.5-2.0 performance index&apos;,
          normalization: &apos;Centered around 1.0&apos;

    },
    {
}
      id: &apos;game-conditions&apos;,
      name: &apos;Game Condition Features&apos;,
      description: &apos;Environmental and situational factors that influence game dynamics and player performance&apos;,
      color: &apos;#f59e0b&apos;,
      icon: &apos;🌤️&apos;,
      features: [
        {
}
          id: &apos;weather-conditions&apos;,
          name: &apos;Weather Impact Vector&apos;,
          type: &apos;array&apos;,
          description: &apos;Multi-dimensional weather impact including wind, precipitation, and temperature effects&apos;,
          example: &apos;[15.2, 0.1, 0.8] (wind, rain, visibility)&apos;,
          preprocessing: [&apos;Weather data aggregation&apos;, &apos;Impact modeling&apos;, &apos;Position-specific effects&apos;],
          importance: 55,
          range: &apos;Various units per dimension&apos;,
          normalization: &apos;Feature-specific scaling&apos;
        },
        {
}
          id: &apos;game-importance&apos;,
          name: &apos;Game Importance Score&apos;,
          type: &apos;numeric&apos;,
          description: &apos;Calculated importance based on playoff implications, divisional matchups, and season timing&apos;,
          example: &apos;7.8 (high importance)&apos;,
          preprocessing: [&apos;Playoff probability&apos;, &apos;Divisional weighting&apos;, &apos;Season context&apos;],
          importance: 40,
          range: &apos;1-10 importance scale&apos;,
          normalization: &apos;Exponential scaling&apos;
        },
        {
}
          id: &apos;rest-days&apos;,
          name: &apos;Rest Days Count&apos;,
          type: &apos;numeric&apos;,
          description: &apos;Number of days between games with fatigue and recovery modeling&apos;,
          example: &apos;6 (standard week)&apos;,
          preprocessing: [&apos;Rest calculation&apos;, &apos;Fatigue modeling&apos;, &apos;Travel adjustment&apos;],
          importance: 35,
          range: &apos;3-14 days&apos;,
          normalization: &apos;Optimal rest curve fitting&apos;
        },
        {
}
          id: &apos;travel-distance&apos;,
          name: &apos;Travel Distance&apos;,
          type: &apos;numeric&apos;,
          description: &apos;Miles traveled for away games with jet lag and fatigue considerations&apos;,
          example: &apos;1247 (cross-country)&apos;,
          preprocessing: [&apos;Distance calculation&apos;, &apos;Time zone adjustment&apos;, &apos;Fatigue correlation&apos;],
          importance: 25,
          range: &apos;0-3000 miles&apos;,
          normalization: &apos;Logarithmic scaling&apos;

    },
    {
}
      id: &apos;historical-patterns&apos;,
      name: &apos;Historical Pattern Features&apos;,
      description: &apos;Long-term trends, seasonal patterns, and historical performance indicators&apos;,
      color: &apos;#8b5cf6&apos;,
      icon: &apos;📊&apos;,
      features: [
        {
}
          id: &apos;head-to-head&apos;,
          name: &apos;Head-to-Head Record&apos;,
          type: &apos;array&apos;,
          description: &apos;Historical performance in similar matchups and opponent-specific trends&apos;,
          example: &apos;[0.85, 0.72] (win rate, performance index)&apos;,
          preprocessing: [&apos;Historical lookup&apos;, &apos;Performance indexing&apos;, &apos;Recency weighting&apos;],
          importance: 50,
          range: &apos;0.0-1.0 for rates, 0.5-2.0 for index&apos;,
          normalization: &apos;Historical distribution fitting&apos;
        },
        {
}
          id: &apos;seasonal-trends&apos;,
          name: &apos;Seasonal Performance Trends&apos;,
          type: &apos;array&apos;,
          description: &apos;Performance patterns across different parts of the season and weather conditions&apos;,
          example: &apos;[1.1, 0.9, 1.2] (early, mid, late season)&apos;,
          preprocessing: [&apos;Seasonal decomposition&apos;, &apos;Trend analysis&apos;, &apos;Weather correlation&apos;],
          importance: 45,
          range: &apos;0.5-2.0 performance multiplier&apos;,
          normalization: &apos;Seasonal curve normalization&apos;
        },
        {
}
          id: &apos;venue-performance&apos;,
          name: &apos;Venue-Specific Performance&apos;,
          type: &apos;array&apos;,
          description: &apos;Historical performance at specific venues with environmental and psychological factors&apos;,
          example: &apos;[22.4] (avg points at venue)&apos;,
          preprocessing: [&apos;Venue lookup&apos;, &apos;Sample size weighting&apos;, &apos;Confidence intervals&apos;],
          importance: 30,
          range: &apos;0-50 average points&apos;,
          normalization: &apos;Venue-specific z-scores&apos;

    },
    {
}
      id: &apos;contextual-factors&apos;,
      name: &apos;Contextual & Market Features&apos;,
      description: &apos;Advanced contextual information including market sentiment, coaching tendencies, and meta-factors&apos;,
      color: &apos;#ef4444&apos;,
      icon: &apos;🎯&apos;,
      features: [
        {
}
          id: &apos;time-of-season&apos;,
          name: &apos;Season Progress Factor&apos;,
          type: &apos;numeric&apos;,
          description: &apos;Normalized season progress with playoff and late-season adjustment factors&apos;,
          example: &apos;0.67 (week 12 of 18)&apos;,
          preprocessing: [&apos;Week normalization&apos;, &apos;Playoff weighting&apos;, &apos;Motivation factors&apos;],
          importance: 35,
          range: &apos;0.0-1.0 season progress&apos;,
          normalization: &apos;Linear with playoff adjustment&apos;
        },
        {
}
          id: &apos;week-type&apos;,
          name: &apos;Week Type Classification&apos;,
          type: &apos;categorical&apos;,
          description: &apos;Type of week (regular, playoff, championship) with performance pattern adjustments&apos;,
          example: &apos;REGULAR (regular season)&apos;,
          preprocessing: [&apos;Categorical encoding&apos;, &apos;One-hot encoding&apos;, &apos;Performance pattern lookup&apos;],
          importance: 40,
          range: &apos;REGULAR, PLAYOFF, CHAMPIONSHIP&apos;,
          normalization: &apos;Binary encoding vector&apos;
        },
        {
}
          id: &apos;market-confidence&apos;,
          name: &apos;Market Confidence Index&apos;,
          type: &apos;numeric&apos;,
          description: &apos;Aggregated market sentiment and expert consensus confidence in player performance&apos;,
          example: &apos;0.78 (high confidence)&apos;,
          preprocessing: [&apos;Sentiment aggregation&apos;, &apos;Expert weighting&apos;, &apos;Confidence calibration&apos;],
          importance: 60,
          range: &apos;0.0-1.0 confidence&apos;,
          normalization: &apos;Sigmoid calibration&apos;

  ];

  const preprocessingStages: PreprocessingStage[] = [
    {
}
      id: &apos;extraction&apos;,
      name: &apos;Raw Data Extraction&apos;,
      description: &apos;Extract relevant features from validated sports data using domain-specific algorithms&apos;,
      techniques: [&apos;Statistical aggregation&apos;, &apos;Time-series analysis&apos;, &apos;Pattern recognition&apos;, &apos;Domain calculations&apos;],
      inputFormat: &apos;Validated sports data (JSON/structured)&apos;,
      outputFormat: &apos;Raw feature values (numeric/categorical)&apos;,
      timing: &apos;< 500ms per player/game&apos;,
      dependencies: [&apos;Data validation&apos;, &apos;Historical database&apos;, &apos;Real-time feeds&apos;]
    },
    {
}
      id: &apos;cleaning&apos;,
      name: &apos;Data Cleaning & Validation&apos;,
      description: &apos;Clean extracted features, handle missing values, and validate data quality&apos;,
      techniques: [&apos;Missing value imputation&apos;, &apos;Outlier detection&apos;, &apos;Data type validation&apos;, &apos;Range checking&apos;],
      inputFormat: &apos;Raw feature values&apos;,
      outputFormat: &apos;Clean feature vectors&apos;,
      timing: &apos;< 200ms per feature set&apos;,
      dependencies: [&apos;Feature extraction&apos;, &apos;Quality thresholds&apos;]
    },
    {
}
      id: &apos;engineering&apos;,
      name: &apos;Feature Engineering&apos;,
      description: &apos;Create derived features, interactions, and advanced statistical measures&apos;,
      techniques: [&apos;Feature derivation&apos;, &apos;Interaction terms&apos;, &apos;Statistical aggregation&apos;, &apos;Domain transformations&apos;],
      inputFormat: &apos;Clean feature vectors&apos;,
      outputFormat: &apos;Engineered feature space&apos;,
      timing: &apos;< 1 second per feature set&apos;,
      dependencies: [&apos;Clean data&apos;, &apos;Domain knowledge&apos;, &apos;Historical patterns&apos;]
    },
    {
}
      id: &apos;normalization&apos;,
      name: &apos;Normalization & Scaling&apos;,
      description: &apos;Apply mathematical transformations to ensure optimal ML algorithm performance&apos;,
      techniques: [&apos;Min-max scaling&apos;, &apos;Z-score standardization&apos;, &apos;Robust scaling&apos;, &apos;Feature-specific transforms&apos;],
      inputFormat: &apos;Engineered features&apos;,
      outputFormat: &apos;Normalized feature vectors&apos;,
      timing: &apos;< 100ms per feature set&apos;,
      dependencies: [&apos;Feature engineering&apos;, &apos;Scaling parameters&apos;, &apos;Distribution analysis&apos;]
    },
    {
}
      id: &apos;vectorization&apos;,
      name: &apos;Vector Assembly&apos;,
      description: &apos;Combine all features into final 18-dimensional vectors ready for ML algorithms&apos;,
      techniques: [&apos;Vector concatenation&apos;, &apos;Dimensionality verification&apos;, &apos;Quality assurance&apos;, &apos;Format standardization&apos;],
      inputFormat: &apos;Normalized features&apos;,
      outputFormat: &apos;18-dimensional feature vectors&apos;,
      timing: &apos;< 50ms per vector&apos;,
      dependencies: [&apos;All preprocessing stages&apos;, &apos;ML model requirements&apos;]

  ];

  const transformationExamples: TransformationExample[] = [
    {
}
      id: &apos;player-transform&apos;,
      name: &apos;Player Performance Transformation&apos;,
      rawData: {
}
        name: &apos;Josh Allen&apos;,
        position: &apos;QB&apos;,
        recent_games: [24.7, 31.2, 18.4, 42.1, 28.5],
        injury_status: &apos;questionable&apos;,
        targets: 42,
        team_targets: 156,
        opponent_rank: 18
      },
      transformedData: {
}
        playerRecentPerformance: [0.494, 0.624, 0.368, 0.842, 0.570],
        playerPositionRank: 0.97,
        playerInjuryRisk: 0.35,
        playerTargetShare: 0.269,
        playerMatchupDifficulty: 6.2
      },
      steps: [
        &apos;Normalize recent performance using min-max scaling (0-50 range)&apos;,
        &apos;Calculate position rank percentile (top 3% of QBs)&apos;,
        &apos;Convert injury status to risk probability (questionable = 35%)&apos;,
        &apos;Calculate target share percentage (42/156 = 26.9%)&apos;,
        &apos;Assess matchup difficulty based on opponent ranking&apos;
        ],
      explanation: &apos;Player statistics are transformed into normalized values that ML algorithms can process effectively. Each transformation preserves the relative importance while ensuring consistent scaling.&apos;
    },
    {
}
      id: &apos;team-transform&apos;,
      name: &apos;Team Metrics Transformation&apos;,
      rawData: {
}
        team: &apos;Buffalo Bills&apos;,
        offensive_rank: 5,
        defensive_opponent_rank: 22,
        home_game: true,
        recent_form: [&apos;W&apos;, &apos;W&apos;, &apos;L&apos;, &apos;W&apos;],
        venue: &apos;Highmark Stadium&apos;
      },
      transformedData: {
}
        teamOffensiveRank: 0.844,
        teamDefensiveRank: 0.344,
        teamHomeAdvantage: 2.1,
        teamRecentForm: [1.3, 1.3, 0.7, 1.3]
      },
      steps: [
        &apos;Convert offensive rank to percentile score (5th = 84.4%)&apos;,
        &apos;Convert opponent defensive rank (22nd = 34.4%)&apos;,
        &apos;Apply home field advantage based on venue characteristics&apos;,
        &apos;Transform W/L record to performance index values&apos;
      ],
      explanation: &apos;Team metrics are converted to performance indicators that capture relative strength and situational advantages in a format suitable for mathematical modeling.&apos;
    },
    {
}
      id: &apos;weather-transform&apos;,
      name: &apos;Environmental Conditions Transformation&apos;,
      rawData: {
}
        temperature: 45,
        wind_speed: 12,
        precipitation: 0.2,
        visibility: 8,
        dome: false,
        game_time: &apos;1:00 PM&apos;
      },
      transformedData: {
}
        weatherConditions: [12.0, 0.2, 0.8],
        gameImportance: 6.5,
        restDays: 7
      },
      steps: [
        &apos;Extract weather vector [wind_speed, precipitation, visibility_factor]&apos;,
        &apos;Calculate game importance based on timing and context&apos;,
        &apos;Determine rest days from previous game&apos;
      ],
      explanation: &apos;Environmental factors are quantified into numerical representations that capture their impact on player performance and game dynamics.&apos;

  ];

  const engineeringMethods: FeatureEngineeringMethod[] = [
    {
}
      id: &apos;moving-averages&apos;,
      name: &apos;Exponential Moving Averages&apos;,
      category: &apos;temporal&apos;,
      description: &apos;Weight recent performances more heavily using exponential decay for trend analysis&apos;,
      formula: &apos;EMA(t) = α × Value(t) + (1-α) × EMA(t-1)&apos;,
      examples: [&apos;Recent performance trends&apos;, &apos;Target share evolution&apos;, &apos;Team efficiency progression&apos;],
      benefits: [&apos;Captures momentum&apos;, &apos;Reduces noise&apos;, &apos;Emphasizes recent form&apos;]
    },
    {
}
      id: &apos;interaction-terms&apos;,
      name: &apos;Feature Interactions&apos;,
      category: &apos;interaction&apos;,
      description: &apos;Create new features by combining existing ones to capture complex relationships&apos;,
      formula: &apos;Interaction = Feature_A × Feature_B × Weight_Factor&apos;,
      examples: [&apos;Player efficiency × Matchup difficulty&apos;, &apos;Weather impact × Home advantage&apos;, &apos;Rest days × Travel distance&apos;],
      benefits: [&apos;Captures non-linear relationships&apos;, &apos;Improves model accuracy&apos;, &apos;Reveals hidden patterns&apos;]
    },
    {
}
      id: &apos;statistical-aggregation&apos;,
      name: &apos;Statistical Aggregations&apos;,
      category: &apos;statistical&apos;,
      description: &apos;Derive statistical measures from time series and multi-dimensional data&apos;,
      formula: &apos;Aggregation = f(mean, std, percentiles, trends)&apos;,
      examples: [&apos;Performance consistency scores&apos;, &apos;Volatility indicators&apos;, &apos;Trend momentum metrics&apos;],
      benefits: [&apos;Quantifies uncertainty&apos;, &apos;Measures consistency&apos;, &apos;Captures distribution shape&apos;]
    },
    {
}
      id: &apos;domain-specific&apos;,
      name: &apos;Domain-Specific Calculations&apos;,
      category: &apos;derivation&apos;,
      description: &apos;Apply football-specific knowledge to create meaningful derived features&apos;,
      formula: &apos;Domain_Feature = Sport_Specific_Formula(inputs)&apos;,
      examples: [&apos;Red zone efficiency&apos;, &apos;Garbage time adjustment&apos;, &apos;Strength of schedule&apos;],
      benefits: [&apos;Incorporates expertise&apos;, &apos;Sport-specific insights&apos;, &apos;Contextual understanding&apos;]
    },
    {
}
      id: &apos;temporal-patterns&apos;,
      name: &apos;Temporal Pattern Detection&apos;,
      category: &apos;temporal&apos;,
      description: &apos;Identify and quantify time-based patterns in player and team performance&apos;,
      formula: &apos;Pattern_Score = Correlation(performance, time_factors)&apos;,
      examples: [&apos;Prime time performance&apos;, &apos;Divisional game patterns&apos;, &apos;Season progression trends&apos;],
      benefits: [&apos;Captures timing effects&apos;, &apos;Seasonal adjustments&apos;, &apos;Situational performance&apos;]

  ];

  useEffect(() => {
}
    if (isTransformDemo) {
}
      const interval = setInterval(() => {
}
        setDemoStep((prev: any) => {
}
          if (prev >= preprocessingStages.length - 1) {
}
            setIsTransformDemo(false);
            return 0;

          return prev + 1;
        });
      }, 2500);

      return () => clearInterval(interval);

  }, [isTransformDemo, preprocessingStages.length]);

  const startTransformDemo = () => {
}
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
          {&apos; &apos;}
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
          {&apos; &apos;}
          Feature Categories & Dimensions
        </h3>
        <p className="subsection-description sm:px-4 md:px-6 lg:px-8">
          Oracle&apos;s 18-dimensional feature space encompasses 5 major categories, each contributing critical 
          information for prediction accuracy and model performance.
        </p>

        <div className="feature-categories-grid sm:px-4 md:px-6 lg:px-8">
          {featureCategories.map((category: any) => (
}
            <button
              key={category.id}
              className={`category-card ${activeCategory === category.id ? &apos;active&apos; : &apos;&apos;}`}
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
}
          <div className="category-details sm:px-4 md:px-6 lg:px-8">
            <div className="category-details-header sm:px-4 md:px-6 lg:px-8">
              <h4>{selectedCategory.name}</h4>
              <span className="feature-count-badge sm:px-4 md:px-6 lg:px-8">{selectedCategory.features.length} Features</span>
            </div>
            
            <div className="features-list sm:px-4 md:px-6 lg:px-8">
              {selectedCategory.features.map((feature: any) => (
}
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
}
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
          {&apos; &apos;}
          Preprocessing Pipeline
        </h3>
        <p className="subsection-description sm:px-4 md:px-6 lg:px-8">
          Oracle&apos;s five-stage preprocessing pipeline transforms raw sports data into ML-ready feature vectors 
          through systematic cleaning, engineering, and normalization processes.
        </p>

        <div className="pipeline-demo-controls sm:px-4 md:px-6 lg:px-8">
          <button
            className="demo-button sm:px-4 md:px-6 lg:px-8"
            onClick={startTransformDemo}
            disabled={isTransformDemo}
            aria-label="Start preprocessing pipeline demonstration"
          >
            {isTransformDemo ? &apos;Processing...&apos; : &apos;Watch Transformation Demo&apos;}
          </button>
        </div>

        <div className="preprocessing-pipeline sm:px-4 md:px-6 lg:px-8">
          {preprocessingStages.map((stage, index) => (
}
            <div
              key={stage.id}
              className={`pipeline-stage ${activeStage === stage.id ? &apos;active&apos; : &apos;&apos;} ${
}
                isTransformDemo && index === demoStep ? &apos;processing&apos; : &apos;&apos;
              } ${isTransformDemo && index < demoStep ? &apos;completed&apos; : &apos;&apos;}`}
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
}
                    <div className="processing-indicator sm:px-4 md:px-6 lg:px-8">Transforming...</div>
                  )}
                  {isTransformDemo && index < demoStep && (
}
                    <div className="completed-indicator sm:px-4 md:px-6 lg:px-8">✓</div>
                  )}
                </div>
              </button>

              {activeStage === stage.id && (
}
                <div className="stage-details sm:px-4 md:px-6 lg:px-8">
                  <p className="stage-description sm:px-4 md:px-6 lg:px-8">{stage.description}</p>
                  
                  <div className="stage-content-grid sm:px-4 md:px-6 lg:px-8">
                    <div className="content-group sm:px-4 md:px-6 lg:px-8">
                      <h5>Techniques Applied</h5>
                      <ul className="techniques-list sm:px-4 md:px-6 lg:px-8">
                        {stage.techniques.map((technique: any) => (
}
                          <li key={`${stage.id}-${technique}`} className="technique-item sm:px-4 md:px-6 lg:px-8">{technique}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="content-group sm:px-4 md:px-6 lg:px-8">
                      <h5>Dependencies</h5>
                      <ul className="dependencies-list sm:px-4 md:px-6 lg:px-8">
                        {stage.dependencies.map((dependency: any) => (
}
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
          {&apos; &apos;}
          Real-World Transformation Examples
        </h3>
        <p className="subsection-description sm:px-4 md:px-6 lg:px-8">
          See how Oracle transforms actual sports data into feature vectors through step-by-step examples 
          showing the mathematical processes and domain-specific adjustments.
        </p>

        <div className="example-tabs sm:px-4 md:px-6 lg:px-8">
          {transformationExamples.map((example: any) => (
}
            <button
              key={example.id}
              className={`example-tab ${activeExample === example.id ? &apos;active&apos; : &apos;&apos;}`}
              onClick={() => setActiveExample(example.id)}
              aria-label={`View ${example.name} example`}
            >
              {example.name}
            </button>
          ))}
        </div>

        {selectedExample && (
}
          <div className="transformation-example sm:px-4 md:px-6 lg:px-8">
            <div className="example-header sm:px-4 md:px-6 lg:px-8">
              <h4>{selectedExample.name}</h4>
            </div>
            
            <div className="transformation-flow sm:px-4 md:px-6 lg:px-8">
              <div className="data-section sm:px-4 md:px-6 lg:px-8">
                <h5>Raw Input Data</h5>
                <div className="data-display sm:px-4 md:px-6 lg:px-8">
                  {Object.entries(selectedExample.rawData).map(([key, value]) => (
}
                    <div key={key} className="data-item sm:px-4 md:px-6 lg:px-8">
                      <span className="data-key sm:px-4 md:px-6 lg:px-8">{key}:</span>
                      <span className="data-value sm:px-4 md:px-6 lg:px-8">
                        {Array.isArray(value) ? `[${value.join(&apos;, &apos;)}]` : String(value)}
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
}
                    <div key={key} className="data-item sm:px-4 md:px-6 lg:px-8">
                      <span className="data-key sm:px-4 md:px-6 lg:px-8">{key}:</span>
                      <span className="data-value sm:px-4 md:px-6 lg:px-8">
                        {(() => {
}
                          if (Array.isArray(value)) {
}
                            return `[${value.map((v: any) => typeof v === &apos;number&apos; ? v.toFixed(3) : v).join(&apos;, &apos;)}]`;

                          if (typeof value === &apos;number&apos;) {
}
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
}
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
          {&apos; &apos;}
          Advanced Feature Engineering
        </h3>
        <p className="subsection-description sm:px-4 md:px-6 lg:px-8">
          Oracle employs sophisticated feature engineering techniques to extract maximum predictive value 
          from sports data through mathematical transformations and domain expertise.
        </p>

        <div className="engineering-methods-grid sm:px-4 md:px-6 lg:px-8">
          {engineeringMethods.map((method: any) => (
}
            <button
              key={method.id}
              className={`method-card ${activeMethod === method.id ? &apos;active&apos; : &apos;&apos;}`}
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
}
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
}
                    <li key={`${selectedMethod.id}-${example}`} className="example-item sm:px-4 md:px-6 lg:px-8">{example}</li>
                  ))}
                </ul>
              </div>
              
              <div className="benefits-section sm:px-4 md:px-6 lg:px-8">
                <h5>Key Benefits</h5>
                <ul className="benefits-list sm:px-4 md:px-6 lg:px-8">
                  {selectedMethod.benefits.map((benefit: any) => (
}
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
          {&apos; &apos;}
          Feature Engineering Insights
        </h3>
        
        <div className="insights-grid sm:px-4 md:px-6 lg:px-8">
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h4>Dimensional Efficiency</h4>
            <p>
              Oracle&apos;s 18-dimensional feature space represents an optimal balance between information richness 
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
