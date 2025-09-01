import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState } from &apos;react&apos;;
import type { HoldoutResult, TimeSeriesResult, BootstrapResult, CalibrationResult } from &apos;../../types&apos;;
import &apos;./OracleCalibrationValidationSection.css&apos;;

// ===== TYPE ALIASES =====

type ComplexityLevel = &apos;low&apos; | &apos;medium&apos; | &apos;high&apos;;
type ValidationMethodType = &apos;cross_validation&apos; | &apos;holdout&apos; | &apos;time_series&apos; | &apos;bootstrap&apos; | &apos;monte_carlo&apos;;
type CrossValidationType = &apos;k_fold&apos; | &apos;stratified_k_fold&apos; | &apos;time_series_split&apos; | &apos;group_k_fold&apos; | &apos;nested_cv&apos; | &apos;leave_one_out&apos;;
type HoldoutType = &apos;simple_holdout&apos; | &apos;stratified_holdout&apos; | &apos;temporal_holdout&apos; | &apos;grouped_holdout&apos;;
type TimeSeriesValidationType = &apos;walk_forward&apos; | &apos;expanding_window&apos; | &apos;rolling_window&apos; | &apos;blocked_time_series&apos; | &apos;purged_group_time_series&apos;;
type CalibrationMethodType = &apos;parametric&apos; | &apos;non_parametric&apos; | &apos;bayesian&apos; | &apos;ensemble&apos;;
type MetricCategory = &apos;classification&apos; | &apos;regression&apos; | &apos;ranking&apos; | &apos;calibration&apos; | &apos;fairness&apos; | &apos;custom&apos;;
type TargetType = &apos;classification&apos; | &apos;regression&apos;;
type ExperimentStatus = &apos;pending&apos; | &apos;running&apos; | &apos;completed&apos; | &apos;failed&apos;;
type CalibrationQuality = &apos;poor&apos; | &apos;fair&apos; | &apos;good&apos; | &apos;excellent&apos;;
type ActiveTab = &apos;overview&apos; | &apos;crossval&apos; | &apos;holdout&apos; | &apos;timeseries&apos; | &apos;bootstrap&apos; | &apos;calibration&apos; | &apos;metrics&apos; | &apos;biasvariance&apos; | &apos;demo&apos;;
type BinStrategy = &apos;uniform&apos; | &apos;quantile&apos; | &apos;kmeans&apos;;
type VotingStrategy = &apos;soft&apos; | &apos;hard&apos; | &apos;weighted&apos;;

// ===== VALIDATION METHOD INTERFACES =====

interface ValidationMethod {
}
  id: string;
  name: string;
  type: ValidationMethodType;
  description: string;
  advantages: string[];
  disadvantages: string[];
  useCases: string[];
  complexity: ComplexityLevel;
  computationalCost: ComplexityLevel;
  reliability: ComplexityLevel;

// Cross-Validation Interfaces
}

interface CrossValidationConfig {
}
  id: string;
  name: string;
  type: CrossValidationType;
  folds: number;
  shuffle: boolean;
  randomState?: number;
  stratifyColumn?: string;
  groupColumn?: string;
  timeColumn?: string;
  testSize?: number;
  validationSize?: number;
  description: string;
  formula: string;
  implementation: string;

interface CrossValidationResult {
}
  method: string;
  folds: number;
  scores: number[];
  meanScore: number;
  stdScore: number;
  confidenceInterval: [number, number];
  trainingTime: number;
  validationTime: number;
  details: {
}
    fold: number;
    trainSize: number;
    testSize: number;
    score: number;
    metrics: Record<string, number>;
  }[];

// Holdout Validation Interfaces
interface HoldoutConfig {
}
  id: string;
  name: string;
  icon: string;
  type: HoldoutType;
  trainRatio: number;
  validationRatio?: number;
  testRatio: number;
  shuffle: boolean;
  stratify: boolean;
  groupBy?: string;
  timeAware: boolean;
  description: string;
  implementation: string;

// Time Series Validation Interfaces
}

interface TimeSeriesValidationConfig {
}
  id: string;
  name: string;
  icon: string;
  type: TimeSeriesValidationType;
  windowSize: number;
  stepSize: number;
  minTrainSize: number;
  maxTrainSize?: number;
  preserveOrder: boolean;
  allowDataLeakage: boolean;
  description: string;
  implementation: string;
  advantages: string[];
  disadvantages: string[];
  useCases: string[];

// Bootstrap Resampling Configuration
interface BootstrapConfig {
}
  id: string;
  name: string;
  icon: string;
  type: &apos;basic&apos; | &apos;stratified&apos; | &apos;block&apos; | &apos;parametric&apos;;
  nBootstraps: number;
  sampleSize?: number;
  blockSize?: number;
  replacement: boolean;
  stratifyColumn?: string;
  distribution?: string;
  confidenceLevel: number;
  description: string;
  implementation: string;
  advantages: string[];
  disadvantages: string[];
  useCases: string[];

}

interface TimeSeriesValidationResult {
}
  method: string;
  windows: number;
  scores: number[];
  meanScore: number;
  stdScore: number;
  temporalStability: number;
  degenerationRate: number;
  forecastAccuracy: number[];
  details: {
}
    window: number;
    trainStart: string;
    trainEnd: string;
    testStart: string;
    testEnd: string;
    score: number;
    metrics: Record<string, number>;
  }[];

// ===== CALIBRATION METHOD INTERFACES =====

interface CalibrationMethod {
}
  id: string;
  name: string;
  type: CalibrationMethodType;
  description: string;
  formula: string;
  advantages: string[];
  disadvantages: string[];
  complexity: ComplexityLevel;
  accuracy: ComplexityLevel;
  interpretability: ComplexityLevel;
  scalability: ComplexityLevel;
  robustness: ComplexityLevel;

}

interface CalibrationConfig {
}
  method: string;
  parameters: Record<string, any>;
  cvFolds?: number;
  binStrategy?: BinStrategy;
  nBins?: number;
  smoothingParameter?: number;
  ensemble?: {
}
    methods: string[];
    weights?: number[];
    voting: VotingStrategy;
  };

// ===== PERFORMANCE METRICS INTERFACES =====

interface PerformanceMetric {
}
  id: string;
  name: string;
  category: MetricCategory;
  description: string;
  formula: string;
  interpretation: string;
  range: string;
  higherIsBetter: boolean;
  useCases: string[];
  limitations: string[];

}

interface ClassificationMetrics {
}
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  specificity: number;
  sensitivity: number;
  auc: number;
  rocAuc: number;
  prAuc: number;
  logLoss: number;
  matthews: number;
  kappa: number;
  balancedAccuracy: number;
  topKAccuracy?: number;
  confusionMatrix: number[][];

interface RegressionMetrics {
}
  mse: number;
  rmse: number;
  mae: number;
  mape: number;
  r2: number;
  adjustedR2: number;
  meanAbsError: number;
  meanSqError: number;
  medianAbsError: number;
  maxError: number;
  explainedVariance: number;
  huberLoss?: number;
  quantileLoss?: number;

}

interface CalibrationMetrics {
}
  expectedCalibrationError: number;
  maximumCalibrationError: number;
  averageCalibrationError: number;
  brierScore: number;
  brierSkillScore: number;
  negativeLogLikelihood: number;
  sharpness: number;
  reliability: number;
  resolution: number;
  uncertainty: number;
  calibrationSlope: number;
  calibrationIntercept: number;

interface FantasyMetrics {
}
  pointsAccuracy: number;
  rankingAccuracy: number;
  topPerformerPrecision: number;
  bustDetectionRecall: number;
  valueOverReplacement: number;
  projectionBias: number;
  consistencyScore: number;
  upsetPrediction: number;
  sleoperIdentification: number;
  injuryAdjustedAccuracy: number;
  weatherAdjustedAccuracy: number;
  matchupAdjustedAccuracy: number;

}

interface ComprehensiveMetrics {
}
  classification?: ClassificationMetrics;
  regression?: RegressionMetrics;
  calibration: CalibrationMetrics;
  fantasy: FantasyMetrics;
  custom?: Record<string, number>;

// ===== EXPERIMENT AND EVALUATION INTERFACES =====

interface ValidationExperiment {
}
  id: string;
  name: string;
  description: string;
  model: string;
  dataset: {
}
    name: string;
    size: number;
    features: number;
    target: string;
    timeRange?: [string, string];
  };
  validationConfig: {
}
    method: string;
    config: CrossValidationConfig | HoldoutConfig | TimeSeriesValidationConfig;
  };
  calibrationConfig?: CalibrationConfig;
  metrics: string[];
  status: ExperimentStatus;
  startTime?: string;
  endTime?: string;
  duration?: number;

interface ExperimentResult {
}
  experimentId: string;
  validationResults: CrossValidationResult | HoldoutResult | TimeSeriesValidationResult;
  calibrationResults?: CalibrationResult;
  metrics: ComprehensiveMetrics;
  modelPerformance: {
}
    trainingTime: number;
    inferenceTime: number;
    memoryUsage: number;
    modelSize: number;
  };
  insights: {
}
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    riskAssessment: string;
  };

interface ValidationReport {
}
  summary: {
}
    totalExperiments: number;
    completedExperiments: number;
    averageScore: number;
    bestMethod: string;
    recommendedApproach: string;
  };
  methodComparison: {
}
    method: string;
    score: number;
    rank: number;
    reliability: number;
    computationalCost: number;
    interpretability: number;
  }[];
  calibrationAnalysis: {
}
    uncalibratedScore: number;
    calibratedScore: number;
    improvement: number;
    bestCalibrationMethod: string;
    calibrationQuality: CalibrationQuality;
  };
  recommendations: {
}
    productionMethod: string;
    alternativeMethod: string;
    calibrationStrategy: string;
    monitoringMetrics: string[];
    revalidationFrequency: string;
  };

// ===== DEMO AND INTERACTION INTERFACES =====

interface ValidationDemoConfig {
}
  selectedMethod: string;
  selectedCalibration: string;
  selectedMetrics: string[];
  datasetSize: number;
  noiseLevel: number;
  featureCount: number;
  targetType: TargetType;
  temporalData: boolean;
  realTimeMode: boolean;

}

interface ValidationDemoState {
}
  isRunning: boolean;
  progress: number;
  currentStage: string;
  results?: ExperimentResult;
  visualizations: {
}
    calibrationCurve?: any;
    reliabilityDiagram?: any;
    learningCurve?: any;
    validationCurve?: any;
    residualPlot?: any;
    featureImportance?: any;
  };

// ===== UTILITY INTERFACES =====

interface ValidationConfig {
}
  seed: number;
  verbose: boolean;
  nJobs: number;
  backend: &apos;sklearn&apos; | &apos;custom&apos; | &apos;distributed&apos;;
  cachePredictions: boolean;
  saveIntermediateResults: boolean;

}

interface ModelMetadata {
}
  name: string;
  version: string;
  type: TargetType | &apos;ranking&apos;;
  algorithm: string;
  hyperparameters: Record<string, any>;
  trainingData: {
}
    size: number;
    features: string[];
    target: string;
    timeRange?: [string, string];
  };
  performance: {
}
    training: number;
    validation: number;
    test?: number;
  };

// ===== BIAS-VARIANCE ANALYSIS INTERFACES =====

interface BiasVarianceExperiment {
}
  id: string;
  name: string;
  modelComplexity: number;
  description: string;
  expectedBias: number;
  expectedVariance: number;
  expectedNoise: number;
  totalError: number;
  decompositionMethod: &apos;bootstrap&apos; | &apos;analytical&apos; | &apos;monte_carlo&apos;;

}

interface BiasVarianceResult {
}
  modelComplexity: number;
  bias: number;
  variance: number;
  noise: number;
  totalError: number;
  irreducibleError: number;
  predictions: number[];
  trueValues: number[];
  decomposition: {
}
    biasSquared: number;
    varianceComponent: number;
    noiseComponent: number;
    covariance: number;
  };
  metrics: {
}
    mse: number;
    mae: number;
    r2: number;
    adjustedR2: number;
  };

interface BiasVarianceVisualization {
}
  complexityRange: number[];
  biasValues: number[];
  varianceValues: number[];
  totalErrorValues: number[];
  optimalComplexity: number;
  underfittingRegion: [number, number];
  overfittingRegion: [number, number];
  sweetSpot: number;

}

interface ModelComplexityConfig {
}
  id: string;
  name: string;
  description: string;
  complexityParameter: string;
  minComplexity: number;
  maxComplexity: number;
  stepSize: number;
  optimizationTarget: &apos;bias&apos; | &apos;variance&apos; | &apos;total_error&apos; | &apos;generalization&apos;;
  regularization: boolean;
  crossValidation: boolean;

// ===== LEARNING CURVE ANALYSIS INTERFACES =====

interface LearningCurveExperiment {
}
  id: string;
  name: string;
  description: string;
  modelType: string;
  sampleSizeRange: [number, number];
  stepSize: number;
  convergenceThreshold: number;
  expectedConvergencePoint: number;
  dataEfficiency: &apos;low&apos; | &apos;medium&apos; | &apos;high&apos;;
  convergenceRate: &apos;slow&apos; | &apos;medium&apos; | &apos;fast&apos;;

}

interface LearningCurveResult {
}
  sampleSize: number;
  trainScore: number;
  validationScore: number;
  testScore?: number;
  trainingTime: number;
  convergenceIndicator: number;
  dataEfficiency: number;
  overfittingGap: number;
  generalizationError: number;
  confidenceInterval: [number, number];
  isConverged: boolean;

interface LearningCurveVisualization {
}
  sampleSizes: number[];
  trainScores: number[];
  validationScores: number[];
  testScores: number[];
  convergencePoint: number;
  plateauStart: number;
  dataEfficiencyScore: number;
  recommendedSampleSize: number;
  convergenceAnalysis: {
}
    hasConverged: boolean;
    convergenceRate: &apos;slow&apos; | &apos;medium&apos; | &apos;fast&apos;;
    plateauDetected: boolean;
    optimalDataSize: number;
  };
  insights: {
}
    dataEfficiency: string;
    convergenceBehavior: string;
    recommendations: string[];
  };

interface DataSizeConfig {
}
  id: string;
  name: string;
  description: string;
  minSamples: number;
  maxSamples: number;
  stepStrategy: &apos;linear&apos; | &apos;logarithmic&apos; | &apos;exponential&apos;;
  validationRatio: number;
  crossValidationFolds: number;
  randomState: number;

}

interface FantasyContext {
}
  league: {
}
    type: &apos;standard&apos; | &apos;ppr&apos; | &apos;half_ppr&apos; | &apos;dynasty&apos; | &apos;redraft&apos;;
    size: number;
    scoringSystem: Record<string, number>;
  };
  season: {
}
    year: number;
    week?: number;
    phase: &apos;preseason&apos; | &apos;regular&apos; | &apos;playoffs&apos;;
  };
  playerPool: {
}
    positions: string[];
    totalPlayers: number;
    activeRosters: number;
  };

// Component placeholder for the main section
const OracleCalibrationValidationSection: React.FC = () => {
}
  const [activeTab, setActiveTab] = useState<ActiveTab>(&apos;overview&apos;);
  const [selectedCVMethod, setSelectedCVMethod] = useState<string>(&apos;k_fold&apos;);
  const [cvExperimentRunning, setCvExperimentRunning] = useState<boolean>(false);
  const [cvResults, setCvResults] = useState<CrossValidationResult | null>(null);
  const [experimentProgress, setExperimentProgress] = useState<number>(0);
  const [selectedHoldoutMethod, setSelectedHoldoutMethod] = useState<string>(&apos;simple_holdout&apos;);
  const [holdoutExperimentRunning, setHoldoutExperimentRunning] = useState<boolean>(false);
  const [holdoutResults, setHoldoutResults] = useState<HoldoutResult | null>(null);
  const [holdoutProgress, setHoldoutProgress] = useState<number>(0);

  // Time series validation state
  const [selectedTimeSeriesMethod, setSelectedTimeSeriesMethod] = useState<string>(&apos;walk_forward&apos;);
  const [timeSeriesExperimentRunning, setTimeSeriesExperimentRunning] = useState<boolean>(false);
  const [timeSeriesResults, setTimeSeriesResults] = useState<TimeSeriesResult | null>(null);
  const [timeSeriesProgress, setTimeSeriesProgress] = useState<number>(0);

  // Bootstrap resampling state
  const [selectedBootstrapMethod, setSelectedBootstrapMethod] = useState<string>(&apos;basic_bootstrap&apos;);
  const [bootstrapExperimentRunning, setBootstrapExperimentRunning] = useState<boolean>(false);
  const [bootstrapResults, setBootstrapResults] = useState<BootstrapResult | null>(null);
  const [bootstrapProgress, setBootstrapProgress] = useState<number>(0);

  // Calibration techniques state
  const [selectedCalibrationMethod, setSelectedCalibrationMethod] = useState<string>(&apos;platt_scaling&apos;);
  const [calibrationExperimentRunning, setCalibrationExperimentRunning] = useState<boolean>(false);
  const [calibrationResults, setCalibrationResults] = useState<CalibrationResult | null>(null);
  const [calibrationProgress, setCalibrationProgress] = useState<number>(0);

  // Performance metrics state
  const [selectedMetricCategory, setSelectedMetricCategory] = useState<string>(&apos;classification&apos;);
  const [selectedMetric, setSelectedMetric] = useState<string>(&apos;accuracy&apos;);
  const [metricsExperimentRunning, setMetricsExperimentRunning] = useState<boolean>(false);
  const [metricsResults, setMetricsResults] = useState<ComprehensiveMetrics | null>(null);
  const [metricsProgress, setMetricsProgress] = useState<number>(0);
  const [selectedModel, setSelectedModel] = useState<string>(&apos;neural_network&apos;);

  // Bias-variance analysis state
  const [selectedComplexityModel, setSelectedComplexityModel] = useState<string>(&apos;polynomial&apos;);
  const [biasVarianceExperimentRunning, setBiasVarianceExperimentRunning] = useState<boolean>(false);
  const [biasVarianceResults, setBiasVarianceResults] = useState<BiasVarianceResult[] | null>(null);
  const [biasVarianceProgress, setBiasVarianceProgress] = useState<number>(0);
  const [selectedComplexityRange, setSelectedComplexityRange] = useState<[number, number]>([1, 20]);
  const [biasVarianceVisualization, setBiasVarianceVisualization] = useState<BiasVarianceVisualization | null>(null);
  const [decompositionMethod, setDecompositionMethod] = useState<string>(&apos;bootstrap&apos;);

  // Learning curve analysis state
  const [selectedLearningModel, setSelectedLearningModel] = useState<string>(&apos;neural_network&apos;);
  const [learningCurveExperimentRunning, setLearningCurveExperimentRunning] = useState<boolean>(false);
  const [learningCurveResults, setLearningCurveResults] = useState<LearningCurveResult[] | null>(null);
  const [learningCurveProgress, setLearningCurveProgress] = useState<number>(0);
  const [selectedSampleRange, setSelectedSampleRange] = useState<[number, number]>([100, 5000]);
  const [learningCurveVisualization, setLearningCurveVisualization] = useState<LearningCurveVisualization | null>(null);
  const [dataSizeStrategy, setDataSizeStrategy] = useState<string>(&apos;logarithmic&apos;);

  // Cross-validation method configurations
  const crossValidationMethods: CrossValidationConfig[] = [
    {
}
      id: &apos;k_fold&apos;,
      name: &apos;K-Fold Cross-Validation&apos;,
      type: &apos;k_fold&apos;,
      folds: 5,
      shuffle: true,
      randomState: 42,
      description: &apos;Standard k-fold CV that divides data into k equal-sized folds, using k-1 for training and 1 for validation&apos;,
      formula: &apos;CV(k) = (1/k) ∑ᵢ₌₁ᵏ L(fᵢ(X₋ᵢ), yᵢ)&apos;,
      implementation: &apos;Randomly shuffle dataset, split into k folds, rotate validation fold&apos;
    },
    {
}
      id: &apos;stratified_k_fold&apos;,
      name: &apos;Stratified K-Fold CV&apos;,
      type: &apos;stratified_k_fold&apos;,
      folds: 5,
      shuffle: true,
      randomState: 42,
      stratifyColumn: &apos;position&apos;,
      description: &apos;K-fold CV that maintains class distribution across folds, crucial for imbalanced fantasy football positions&apos;,
      formula: &apos;StratifiedCV(k) = (1/k) ∑ᵢ₌₁ᵏ L(fᵢ(X₋ᵢ), yᵢ) s.t. P(yᵢ) ≈ P(y)&apos;,
      implementation: &apos;Ensure proportional representation of each position (QB, RB, WR, TE) in every fold&apos;
    },
    {
}
      id: &apos;time_series_split&apos;,
      name: &apos;Time Series Split CV&apos;,
      type: &apos;time_series_split&apos;,
      folds: 5,
      shuffle: false,
      timeColumn: &apos;game_date&apos;,
      description: &apos;Temporal validation that respects chronological order, preventing data leakage from future games&apos;,
      formula: &apos;TimeSeriesCV = ∑ᵢ₌₁ⁿ L(f(X₁:ᵢ), yᵢ₊₁)&apos;,
      implementation: &apos;Use historical data to predict future performance, expanding training window over time&apos;
    },
    {
}
      id: &apos;group_k_fold&apos;,
      name: &apos;Group K-Fold CV&apos;,
      type: &apos;group_k_fold&apos;,
      folds: 5,
      shuffle: true,
      groupColumn: &apos;player_id&apos;,
      description: &apos;Groups data by player to prevent information leakage between training and validation sets&apos;,
      formula: &apos;GroupCV(k) = (1/k) ∑ᵢ₌₁ᵏ L(fᵢ(X₋Gᵢ), yGᵢ)&apos;,
      implementation: &apos;Ensure same player never appears in both training and validation within a fold&apos;
    },
    {
}
      id: &apos;nested_cv&apos;,
      name: &apos;Nested Cross-Validation&apos;,
      type: &apos;nested_cv&apos;,
      folds: 5,
      shuffle: true,
      randomState: 42,
      description: &apos;Double CV for unbiased hyperparameter tuning and model selection in fantasy sports&apos;,
      formula: &apos;NestedCV = (1/k₁) ∑ᵢ₌₁ᵏ¹ min_{h} (1/k₂) ∑ⱼ₌₁ᵏ² L(fₕ(X₋ᵢⱼ), yᵢⱼ)&apos;,
      implementation: &apos;Outer loop for model evaluation, inner loop for hyperparameter optimization&apos;

  ];

  // Holdout validation method configurations
  const holdoutMethods: HoldoutConfig[] = [
    {
}
      id: &apos;simple_holdout&apos;,
      name: &apos;Simple Holdout&apos;,
      icon: &apos;🎯&apos;,
      type: &apos;simple_holdout&apos;,
      trainRatio: 0.7,
      testRatio: 0.3,
      shuffle: true,
      stratify: false,
      timeAware: false,
      description: &apos;Basic train/test split with random partitioning of the dataset&apos;,
      implementation: &apos;Random split maintaining specified ratios, suitable for balanced datasets&apos;
    },
    {
}
      id: &apos;stratified_holdout&apos;,
      name: &apos;Stratified Holdout&apos;,
      icon: &apos;⚖️&apos;,
      type: &apos;stratified_holdout&apos;,
      trainRatio: 0.7,
      testRatio: 0.3,
      shuffle: true,
      stratify: true,
      timeAware: false,
      description: &apos;Holdout split maintaining proportional representation of each position across train/test sets&apos;,
      implementation: &apos;Stratified sampling ensures equal representation of QB, RB, WR, TE in both sets&apos;
    },
    {
}
      id: &apos;temporal_holdout&apos;,
      name: &apos;Temporal Holdout&apos;,
      icon: &apos;📅&apos;,
      type: &apos;temporal_holdout&apos;,
      trainRatio: 0.8,
      testRatio: 0.2,
      shuffle: false,
      stratify: false,
      timeAware: true,
      description: &apos;Time-aware split using historical data for training and recent data for testing&apos;,
      implementation: &apos;Chronological split preventing future information leakage in fantasy predictions&apos;
    },
    {
}
      id: &apos;grouped_holdout&apos;,
      name: &apos;Grouped Holdout&apos;,
      icon: &apos;👥&apos;,
      type: &apos;grouped_holdout&apos;,
      trainRatio: 0.75,
      testRatio: 0.25,
      shuffle: true,
      stratify: false,
      groupBy: &apos;player_id&apos;,
      timeAware: false,
      description: &apos;Player-grouped split ensuring same player never appears in both train and test sets&apos;,
      implementation: &apos;Group-based sampling for testing generalization to unseen players&apos;

  ];

  // Time series validation methods configuration
  const timeSeriesMethods: TimeSeriesValidationConfig[] = [
    {
}
      id: &apos;walk_forward&apos;,
      name: &apos;Walk-Forward Validation&apos;,
      icon: &apos;🚶&apos;,
      type: &apos;walk_forward&apos;,
      windowSize: 4,
      stepSize: 1,
      minTrainSize: 4,
      maxTrainSize: 12,
      preserveOrder: true,
      allowDataLeakage: false,
      description: &apos;Sequential validation that walks forward through time, using past data to predict future outcomes&apos;,
      implementation: &apos;Incrementally expand training set while testing on next time period&apos;,
      advantages: [&apos;Realistic temporal validation&apos;, &apos;Prevents look-ahead bias&apos;, &apos;Simulates live trading&apos;],
      disadvantages: [&apos;Limited training data early on&apos;, &apos;Computationally expensive&apos;, &apos;May underestimate performance&apos;],
      useCases: [&apos;Season progression modeling&apos;, &apos;Weekly prediction validation&apos;, &apos;Real-time strategy testing&apos;]
    },
    {
}
      id: &apos;expanding_window&apos;,
      name: &apos;Expanding Window Validation&apos;,
      icon: &apos;📈&apos;,
      type: &apos;expanding_window&apos;,
      windowSize: 0,
      stepSize: 1,
      minTrainSize: 4,
      maxTrainSize: undefined,
      preserveOrder: true,
      allowDataLeakage: false,
      description: &apos;Growing training window that starts small and expands to include all historical data&apos;,
      implementation: &apos;Start with minimum training size and grow window with each validation step&apos;,
      advantages: [&apos;Uses all available data&apos;, &apos;Stable performance metrics&apos;, &apos;Good for trend analysis&apos;],
      disadvantages: [&apos;May include outdated patterns&apos;, &apos;Slower adaptation to changes&apos;, &apos;Computational overhead&apos;],
      useCases: [&apos;Long-term trend analysis&apos;, &apos;Career progression modeling&apos;, &apos;Historical performance evaluation&apos;]
    },
    {
}
      id: &apos;rolling_window&apos;,
      name: &apos;Rolling Window Validation&apos;,
      icon: &apos;🎡&apos;,
      type: &apos;rolling_window&apos;,
      windowSize: 8,
      stepSize: 1,
      minTrainSize: 8,
      maxTrainSize: 8,
      preserveOrder: true,
      allowDataLeakage: false,
      description: &apos;Fixed-size sliding window that maintains constant training period length&apos;,
      implementation: &apos;Slide window through time keeping training size constant&apos;,
      advantages: [&apos;Consistent data volume&apos;, &apos;Adapts to recent patterns&apos;, &apos;Efficient computation&apos;],
      disadvantages: [&apos;May miss long-term trends&apos;, &apos;Less stable than expanding&apos;, &apos;Window size tuning needed&apos;],
      useCases: [&apos;Recent form analysis&apos;, &apos;Injury recovery patterns&apos;, &apos;Short-term consistency evaluation&apos;]
    },
    {
}
      id: &apos;blocked_time_series&apos;,
      name: &apos;Blocked Time Series Validation&apos;,
      icon: &apos;🧱&apos;,
      type: &apos;blocked_time_series&apos;,
      windowSize: 4,
      stepSize: 4,
      minTrainSize: 8,
      maxTrainSize: 16,
      preserveOrder: true,
      allowDataLeakage: false,
      description: &apos;Non-overlapping blocks of time periods for independent validation splits&apos;,
      implementation: &apos;Divide timeline into discrete blocks with gaps between train/test periods&apos;,
      advantages: [&apos;Independent validation sets&apos;, &apos;Prevents temporal leakage&apos;, &apos;Clear separation&apos;],
      disadvantages: [&apos;Wastes data with gaps&apos;, &apos;Fewer validation points&apos;, &apos;May miss transitions&apos;],
      useCases: [&apos;Season-to-season validation&apos;, &apos;Draft class analysis&apos;, &apos;Multi-year trend detection&apos;]

  ];

  // Bootstrap resampling methods configuration
  const bootstrapMethods: BootstrapConfig[] = [
    {
}
      id: &apos;basic_bootstrap&apos;,
      name: &apos;Basic Bootstrap&apos;,
      icon: &apos;🎲&apos;,
      type: &apos;basic&apos;,
      nBootstraps: 1000,
      sampleSize: undefined,
      replacement: true,
      confidenceLevel: 0.95,
      description: &apos;Standard bootstrap resampling with replacement from the original dataset&apos;,
      implementation: &apos;Randomly sample N observations with replacement to create bootstrap samples&apos;,
      advantages: [&apos;Simple and intuitive&apos;, &apos;Works with any distribution&apos;, &apos;Provides confidence intervals&apos;],
      disadvantages: [&apos;May not preserve data structure&apos;, &apos;Assumes independence&apos;, &apos;Can underestimate variance&apos;],
      useCases: [&apos;General uncertainty quantification&apos;, &apos;Confidence intervals&apos;, &apos;Model stability assessment&apos;]
    },
    {
}
      id: &apos;stratified_bootstrap&apos;,
      name: &apos;Stratified Bootstrap&apos;,
      icon: &apos;📊&apos;,
      type: &apos;stratified&apos;,
      nBootstraps: 1000,
      sampleSize: undefined,
      replacement: true,
      stratifyColumn: &apos;position&apos;,
      confidenceLevel: 0.95,
      description: &apos;Bootstrap that preserves class proportions by sampling within each stratum&apos;,
      implementation: &apos;Sample proportionally from each class/group to maintain original distribution&apos;,
      advantages: [&apos;Preserves class balance&apos;, &apos;Better for imbalanced data&apos;, &apos;More representative samples&apos;],
      disadvantages: [&apos;Requires categorical variable&apos;, &apos;More complex implementation&apos;, &apos;May miss rare interactions&apos;],
      useCases: [&apos;Position-based sampling&apos;, &apos;Imbalanced datasets&apos;, &apos;Multi-class validation&apos;]
    },
    {
}
      id: &apos;block_bootstrap&apos;,
      name: &apos;Block Bootstrap&apos;,
      icon: &apos;🧱&apos;,
      type: &apos;block&apos;,
      nBootstraps: 1000,
      sampleSize: undefined,
      blockSize: 4,
      replacement: true,
      confidenceLevel: 0.95,
      description: &apos;Bootstrap that samples contiguous blocks to preserve temporal or spatial dependencies&apos;,
      implementation: &apos;Sample overlapping or non-overlapping blocks of consecutive observations&apos;,
      advantages: [&apos;Preserves dependencies&apos;, &apos;Good for time series&apos;, &apos;Maintains local patterns&apos;],
      disadvantages: [&apos;Block size selection critical&apos;, &apos;Less efficient sampling&apos;, &apos;May miss long-term patterns&apos;],
      useCases: [&apos;Time series data&apos;, &apos;Weekly fantasy patterns&apos;, &apos;Seasonal dependencies&apos;]
    },
    {
}
      id: &apos;parametric_bootstrap&apos;,
      name: &apos;Parametric Bootstrap&apos;,
      icon: &apos;📈&apos;,
      type: &apos;parametric&apos;,
      nBootstraps: 1000,
      sampleSize: undefined,
      replacement: true,
      distribution: &apos;normal&apos;,
      confidenceLevel: 0.95,
      description: &apos;Bootstrap based on assumed parametric distribution fitted to the data&apos;,
      implementation: &apos;Fit distribution to data, then generate samples from fitted distribution&apos;,
      advantages: [&apos;Model-based uncertainty&apos;, &apos;Smooth estimates&apos;, &apos;Extrapolation possible&apos;],
      disadvantages: [&apos;Distribution assumption required&apos;, &apos;May miss non-parametric features&apos;, &apos;Model misspecification risk&apos;],
      useCases: [&apos;Well-understood distributions&apos;, &apos;Smooth confidence bands&apos;, &apos;Prediction intervals&apos;]

  ];

  // Calibration methods configuration
  const calibrationMethods = [
    {
}
      id: &apos;platt_scaling&apos;,
      name: &apos;Platt Scaling&apos;,
      icon: &apos;🎯&apos;,
      type: &apos;parametric&apos;,
      description: &apos;Parametric calibration using sigmoid function to map predictions to probabilities&apos;,
      implementation: &apos;Train logistic regression on hold-out set using model outputs as features&apos;,
      formula: &apos;P(y=1|f) = 1 / (1 + exp(A*f + B))&apos;,
      complexity: &apos;Low&apos;,
      dataRequirement: &apos;Small hold-out set&apos;,
      advantages: [
        &apos;Simple and fast implementation&apos;,
        &apos;Effective for small datasets&apos;,
        &apos;Well-established theoretical foundation&apos;,
        &apos;Monotonic calibration mapping&apos;
      ],
      disadvantages: [
        &apos;Assumes sigmoid relationship&apos;,
        &apos;May overfit on small datasets&apos;,
        &apos;Limited flexibility for complex patterns&apos;,
        &apos;Requires additional validation data&apos;
      ],
      useCases: [
        &apos;Binary classification tasks&apos;,
        &apos;Small to medium datasets&apos;,
        &apos;Real-time calibration needs&apos;,
        &apos;Linear probability relationships&apos;
      ],
      fantasyApplications: [
        &apos;Player performance probability calibration&apos;,
        &apos;Binary outcomes (injury, breakout)&apos;,
        &apos;Draft pick success probability&apos;,
        &apos;Win/loss predictions&apos;

    },
    {
}
      id: &apos;isotonic_regression&apos;,
      name: &apos;Isotonic Regression&apos;,
      icon: &apos;📊&apos;,
      type: &apos;non_parametric&apos;,
      description: &apos;Non-parametric calibration preserving monotonic relationship between predictions and probabilities&apos;,
      implementation: &apos;Fit isotonic regression to map model outputs to calibrated probabilities&apos;,
      formula: &apos;P_cal = isotonic_fit(P_raw)&apos;,
      complexity: &apos;Medium&apos;,
      dataRequirement: &apos;Medium-sized hold-out set&apos;,
      advantages: [
        &apos;No distributional assumptions&apos;,
        &apos;Preserves ranking order&apos;,
        &apos;Flexible calibration curves&apos;,
        &apos;Handles non-linear relationships&apos;
      ],
      disadvantages: [
        &apos;Can overfit to calibration data&apos;,
        &apos;Step-wise function artifacts&apos;,
        &apos;Requires more data than Platt scaling&apos;,
        &apos;May reduce discriminative performance&apos;
      ],
      useCases: [
        &apos;Non-linear probability relationships&apos;,
        &apos;Ranking preservation important&apos;,
        &apos;Large calibration datasets&apos;,
        &apos;Complex prediction patterns&apos;
      ],
      fantasyApplications: [
        &apos;Player ranking calibration&apos;,
        &apos;Multi-class position predictions&apos;,
        &apos;Performance tier classifications&apos;,
        &apos;Trade value assessments&apos;

    },
    {
}
      id: &apos;bayesian_calibration&apos;,
      name: &apos;Bayesian Calibration&apos;,
      icon: &apos;🧠&apos;,
      type: &apos;bayesian&apos;,
      description: &apos;Bayesian approach incorporating prior knowledge and uncertainty quantification&apos;,
      implementation: &apos;Use Bayesian inference to estimate calibration mapping with uncertainty&apos;,
      formula: &apos;P(y|x) = ∫ P(y|θ,x) P(θ|D) dθ&apos;,
      complexity: &apos;High&apos;,
      dataRequirement: &apos;Variable with priors&apos;,
      advantages: [
        &apos;Incorporates prior knowledge&apos;,
        &apos;Quantifies calibration uncertainty&apos;,
        &apos;Principled Bayesian framework&apos;,
        &apos;Handles small datasets well&apos;
      ],
      disadvantages: [
        &apos;Computationally intensive&apos;,
        &apos;Requires prior specification&apos;,
        &apos;Complex implementation&apos;,
        &apos;Slower inference time&apos;
      ],
      useCases: [
        &apos;Limited training data&apos;,
        &apos;Prior knowledge available&apos;,
        &apos;Uncertainty quantification needed&apos;,
        &apos;High-stakes decisions&apos;
      ],
      fantasyApplications: [
        &apos;Rookie performance prediction&apos;,
        &apos;Injury recovery probability&apos;,
        &apos;Career trajectory modeling&apos;,
        &apos;Draft value uncertainty&apos;

    },
    {
}
      id: &apos;temperature_scaling&apos;,
      name: &apos;Temperature Scaling&apos;,
      icon: &apos;🌡️&apos;,
      type: &apos;parametric&apos;,
      description: &apos;Single-parameter scaling method adjusting confidence of neural network predictions&apos;,
      implementation: &apos;Learn single temperature parameter T to scale logits before softmax&apos;,
      formula: &apos;P_cal = softmax(z/T)&apos;,
      complexity: &apos;Very Low&apos;,
      dataRequirement: &apos;Small validation set&apos;,
      advantages: [
        &apos;Extremely simple - single parameter&apos;,
        &apos;Preserves model accuracy&apos;,
        &apos;Fast optimization&apos;,
        &apos;Works well with neural networks&apos;
      ],
      disadvantages: [
        &apos;Limited to neural network outputs&apos;,
        &apos;Single global parameter&apos;,
        &apos;May not handle local miscalibration&apos;,
        &apos;Assumes uniform miscalibration&apos;
      ],
      useCases: [
        &apos;Neural network calibration&apos;,
        &apos;Multi-class problems&apos;,
        &apos;Preserving top-1 accuracy&apos;,
        &apos;Large-scale applications&apos;
      ],
      fantasyApplications: [
        &apos;Deep learning player predictions&apos;,
        &apos;Multi-position classifications&apos;,
        &apos;Ensemble model calibration&apos;,
        &apos;Neural ranking systems&apos;

  ];

  // Performance metrics configuration
  const performanceMetrics: PerformanceMetric[] = [
    // Classification Metrics
    {
}
      id: &apos;accuracy&apos;,
      name: &apos;Accuracy&apos;,
      category: &apos;classification&apos; as MetricCategory,
      description: &apos;Proportion of correct predictions among total predictions&apos;,
      formula: &apos;Accuracy = (TP + TN) / (TP + TN + FP + FN)&apos;,
      interpretation: &apos;Higher values indicate better overall performance&apos;,
      range: &apos;[0, 1]&apos;,
      higherIsBetter: true,
      useCases: [&apos;Balanced datasets&apos;, &apos;Overall performance assessment&apos;, &apos;Simple classification tasks&apos;],
      limitations: [&apos;Misleading with imbalanced data&apos;, &apos;Ignores class-specific performance&apos;, &apos;Can hide poor minority class performance&apos;]
    },
    {
}
      id: &apos;precision&apos;,
      name: &apos;Precision&apos;,
      category: &apos;classification&apos; as MetricCategory,
      description: &apos;Proportion of true positives among predicted positives&apos;,
      formula: &apos;Precision = TP / (TP + FP)&apos;,
      interpretation: &apos;Higher values mean fewer false positives&apos;,
      range: &apos;[0, 1]&apos;,
      higherIsBetter: true,
      useCases: [&apos;When false positives are costly&apos;, &apos;Quality-focused applications&apos;, &apos;Spam detection&apos;],
      limitations: [&apos;Ignores false negatives&apos;, &apos;Can be high with low recall&apos;, &apos;Sensitive to class distribution&apos;]
    },
    {
}
      id: &apos;recall&apos;,
      name: &apos;Recall (Sensitivity)&apos;,
      category: &apos;classification&apos; as MetricCategory,
      description: &apos;Proportion of true positives among actual positives&apos;,
      formula: &apos;Recall = TP / (TP + FN)&apos;,
      interpretation: &apos;Higher values mean fewer missed positive cases&apos;,
      range: &apos;[0, 1]&apos;,
      higherIsBetter: true,
      useCases: [&apos;When false negatives are costly&apos;, &apos;Medical diagnosis&apos;, &apos;Fraud detection&apos;],
      limitations: [&apos;Ignores false positives&apos;, &apos;Can be high with low precision&apos;, &apos;May favor over-prediction&apos;]
    },
    {
}
      id: &apos;f1_score&apos;,
      name: &apos;F1-Score&apos;,
      category: &apos;classification&apos; as MetricCategory,
      description: &apos;Harmonic mean of precision and recall&apos;,
      formula: &apos;F1 = 2 × (Precision × Recall) / (Precision + Recall)&apos;,
      interpretation: &apos;Balances precision and recall, higher is better&apos;,
      range: &apos;[0, 1]&apos;,
      higherIsBetter: true,
      useCases: [&apos;Imbalanced datasets&apos;, &apos;Need balance of precision/recall&apos;, &apos;Single performance metric&apos;],
      limitations: [&apos;Equal weight to precision/recall&apos;, &apos;Ignores true negatives&apos;, &apos;Can be misleading with very imbalanced data&apos;]
    },
    {
}
      id: &apos;auc_roc&apos;,
      name: &apos;AUC-ROC&apos;,
      category: &apos;classification&apos; as MetricCategory,
      description: &apos;Area under the ROC curve, measuring separability&apos;,
      formula: &apos;AUC = ∫ TPR d(FPR)&apos;,
      interpretation: &apos;Higher values indicate better discrimination ability&apos;,
      range: &apos;[0, 1]&apos;,
      higherIsBetter: true,
      useCases: [&apos;Binary classification&apos;, &apos;Ranking problems&apos;, &apos;Threshold-independent evaluation&apos;],
      limitations: [&apos;Optimistic with imbalanced data&apos;, &apos;Hard to interpret&apos;, &apos;May not reflect real-world performance&apos;]
    },
    // Regression Metrics
    {
}
      id: &apos;mse&apos;,
      name: &apos;Mean Squared Error&apos;,
      category: &apos;regression&apos; as MetricCategory,
      description: &apos;Average of squared differences between predicted and actual values&apos;,
      formula: &apos;MSE = (1/n) ∑(yᵢ - ŷᵢ)²&apos;,
      interpretation: &apos;Lower values indicate better fit, penalizes large errors heavily&apos;,
      range: &apos;[0, ∞)&apos;,
      higherIsBetter: false,
      useCases: [&apos;Continuous predictions&apos;, &apos;When large errors are very bad&apos;, &apos;Optimization objective&apos;],
      limitations: [&apos;Sensitive to outliers&apos;, &apos;Units are squared&apos;, &apos;Hard to interpret scale&apos;]
    },
    {
}
      id: &apos;mae&apos;,
      name: &apos;Mean Absolute Error&apos;,
      category: &apos;regression&apos; as MetricCategory,
      description: &apos;Average of absolute differences between predicted and actual values&apos;,
      formula: &apos;MAE = (1/n) ∑|yᵢ - ŷᵢ|&apos;,
      interpretation: &apos;Lower values indicate better fit, robust to outliers&apos;,
      range: &apos;[0, ∞)&apos;,
      higherIsBetter: false,
      useCases: [&apos;When outliers are present&apos;, &apos;Robust error measurement&apos;, &apos;Interpretable metric&apos;],
      limitations: [&apos;Treats all errors equally&apos;, &apos;Less sensitive to large errors&apos;, &apos;May not penalize worst predictions&apos;]
    },
    {
}
      id: &apos;r_squared&apos;,
      name: &apos;R-Squared&apos;,
      category: &apos;regression&apos; as MetricCategory,
      description: &apos;Proportion of variance in target explained by the model&apos;,
      formula: &apos;R² = 1 - SS_res / SS_tot&apos;,
      interpretation: &apos;Higher values indicate better explanatory power&apos;,
      range: &apos;(-∞, 1]&apos;,
      higherIsBetter: true,
      useCases: [&apos;Model comparison&apos;, &apos;Explanatory analysis&apos;, &apos;Variance explanation&apos;],
      limitations: [&apos;Can be negative&apos;, &apos;Affected by number of features&apos;, &apos;Not suitable for all regression types&apos;]
    },
    {
}
      id: &apos;mape&apos;,
      name: &apos;Mean Absolute Percentage Error&apos;,
      category: &apos;regression&apos; as MetricCategory,
      description: &apos;Average of absolute percentage errors&apos;,
      formula: &apos;MAPE = (100/n) ∑|yᵢ - ŷᵢ| / |yᵢ|&apos;,
      interpretation: &apos;Lower percentage indicates better relative accuracy&apos;,
      range: &apos;[0, ∞)&apos;,
      higherIsBetter: false,
      useCases: [&apos;Percentage-based errors&apos;, &apos;Scale-independent comparison&apos;, &apos;Business metrics&apos;],
      limitations: [&apos;Division by zero issues&apos;, &apos;Biased toward low values&apos;, &apos;Asymmetric penalty&apos;]
    },
    // Fantasy-Specific Metrics
    {
}
      id: &apos;points_accuracy&apos;,
      name: &apos;Points Accuracy&apos;,
      category: &apos;fantasy&apos; as MetricCategory,
      description: &apos;Accuracy of fantasy point predictions within tolerance&apos;,
      formula: &apos;Points Accuracy = Count(|predicted - actual| < threshold) / Total&apos;,
      interpretation: &apos;Higher values indicate more accurate point predictions&apos;,
      range: &apos;[0, 1]&apos;,
      higherIsBetter: true,
      useCases: [&apos;Fantasy point predictions&apos;, &apos;Player performance evaluation&apos;, &apos;Lineup optimization&apos;],
      limitations: [&apos;Threshold dependent&apos;, &apos;May miss systematic bias&apos;, &apos;Ignores magnitude of errors&apos;]
    },
    {
}
      id: &apos;ranking_accuracy&apos;,
      name: &apos;Ranking Accuracy&apos;,
      category: &apos;fantasy&apos; as MetricCategory,
      description: &apos;Accuracy of player ranking predictions&apos;,
      formula: &apos;Ranking Accuracy = 1 - (Kendall Tau Distance / Max Distance)&apos;,
      interpretation: &apos;Higher values indicate better ranking predictions&apos;,
      range: &apos;[0, 1]&apos;,
      higherIsBetter: true,
      useCases: [&apos;Draft rankings&apos;, &apos;Weekly rankings&apos;, &apos;Player tiers&apos;],
      limitations: [&apos;Position-sensitive&apos;, &apos;May not reflect fantasy relevance&apos;, &apos;Equal weight to all positions&apos;]
    },
    {
}
      id: &apos;bust_detection&apos;,
      name: &apos;Bust Detection&apos;,
      category: &apos;fantasy&apos; as MetricCategory,
      description: &apos;Ability to identify players who significantly underperform&apos;,
      formula: &apos;Bust Detection = TP_busts / (TP_busts + FN_busts)&apos;,
      interpretation: &apos;Higher values indicate better bust identification&apos;,
      range: &apos;[0, 1]&apos;,
      higherIsBetter: true,
      useCases: [&apos;Draft strategy&apos;, &apos;Risk assessment&apos;, &apos;Avoid disappointments&apos;],
      limitations: [&apos;Bust definition subjective&apos;, &apos;May be conservative&apos;, &apos;Class imbalance issues&apos;]
    },
    {
}
      id: &apos;sleeper_identification&apos;,
      name: &apos;Sleeper Identification&apos;,
      category: &apos;fantasy&apos; as MetricCategory,
      description: &apos;Ability to identify undervalued players who outperform&apos;,
      formula: &apos;Sleeper ID = TP_sleepers / (TP_sleepers + FN_sleepers)&apos;,
      interpretation: &apos;Higher values indicate better sleeper detection&apos;,
      range: &apos;[0, 1]&apos;,
      higherIsBetter: true,
      useCases: [&apos;Finding value picks&apos;, &apos;Late-round gems&apos;, &apos;Competitive advantage&apos;],
      limitations: [&apos;Sleeper definition varies&apos;, &apos;Rare event prediction&apos;, &apos;Market efficiency limits&apos;]

  ];

  const metricCategories = [
    { id: &apos;classification&apos;, name: &apos;Classification&apos;, icon: &apos;🎯&apos;, description: &apos;Metrics for binary and multi-class classification problems&apos; },
    { id: &apos;regression&apos;, name: &apos;Regression&apos;, icon: &apos;📈&apos;, description: &apos;Metrics for continuous value prediction problems&apos; },
    { id: &apos;ranking&apos;, name: &apos;Ranking&apos;, icon: &apos;📊&apos;, description: &apos;Metrics for ordering and ranking prediction problems&apos; },
    { id: &apos;calibration&apos;, name: &apos;Calibration&apos;, icon: &apos;⚖️&apos;, description: &apos;Metrics for probability calibration and reliability&apos; },
    { id: &apos;fantasy&apos;, name: &apos;Fantasy Football&apos;, icon: &apos;🏈&apos;, description: &apos;Domain-specific metrics for fantasy football performance&apos; }
  ];

  const modelTypes = [
    { id: &apos;neural_network&apos;, name: &apos;Neural Network&apos;, icon: &apos;🧠&apos;, description: &apos;Deep learning model with multiple layers&apos; },
    { id: &apos;random_forest&apos;, name: &apos;Random Forest&apos;, icon: &apos;🌲&apos;, description: &apos;Ensemble of decision trees&apos; },
    { id: &apos;gradient_boosting&apos;, name: &apos;Gradient Boosting&apos;, icon: &apos;🚀&apos;, description: &apos;Sequential boosting algorithm&apos; },
    { id: &apos;linear_regression&apos;, name: &apos;Linear Regression&apos;, icon: &apos;📏&apos;, description: &apos;Linear relationship modeling&apos; },
    { id: &apos;svm&apos;, name: &apos;Support Vector Machine&apos;, icon: &apos;⚡&apos;, description: &apos;Maximum margin classifier&apos; }
  ];

  // Bias-variance analysis experiments
  const biasVarianceExperiments: BiasVarianceExperiment[] = [
    {
}
      id: &apos;polynomial_complexity&apos;,
      name: &apos;Polynomial Degree Analysis&apos;,
      modelComplexity: 1,
      description: &apos;Analyze bias-variance trade-off by varying polynomial degree from 1 to 20&apos;,
      expectedBias: 0.45,
      expectedVariance: 0.15,
      expectedNoise: 0.10,
      totalError: 0.70,
      decompositionMethod: &apos;bootstrap&apos;
    },
    {
}
      id: &apos;neural_depth&apos;,
      name: &apos;Neural Network Depth&apos;,
      modelComplexity: 2,
      description: &apos;Study bias-variance by varying number of hidden layers in neural networks&apos;,
      expectedBias: 0.35,
      expectedVariance: 0.25,
      expectedNoise: 0.10,
      totalError: 0.70,
      decompositionMethod: &apos;bootstrap&apos;
    },
    {
}
      id: &apos;tree_depth&apos;,
      name: &apos;Decision Tree Depth&apos;,
      modelComplexity: 5,
      description: &apos;Examine bias-variance trade-off with different tree maximum depths&apos;,
      expectedBias: 0.30,
      expectedVariance: 0.35,
      expectedNoise: 0.10,
      totalError: 0.75,
      decompositionMethod: &apos;bootstrap&apos;
    },
    {
}
      id: &apos;ensemble_size&apos;,
      name: &apos;Ensemble Size Impact&apos;,
      modelComplexity: 10,
      description: &apos;Evaluate how ensemble size affects bias-variance decomposition&apos;,
      expectedBias: 0.25,
      expectedVariance: 0.20,
      expectedNoise: 0.10,
      totalError: 0.55,
      decompositionMethod: &apos;bootstrap&apos;
    },
    {
}
      id: &apos;regularization_strength&apos;,
      name: &apos;Regularization Analysis&apos;,
      modelComplexity: 8,
      description: &apos;Study bias-variance with different L1/L2 regularization strengths&apos;,
      expectedBias: 0.40,
      expectedVariance: 0.15,
      expectedNoise: 0.10,
      totalError: 0.65,
      decompositionMethod: &apos;analytical&apos;

  ];

  // Model complexity configurations
  const complexityConfigs: ModelComplexityConfig[] = [
    {
}
      id: &apos;polynomial&apos;,
      name: &apos;Polynomial Regression&apos;,
      description: &apos;Varying polynomial degree to control model complexity&apos;,
      complexityParameter: &apos;degree&apos;,
      minComplexity: 1,
      maxComplexity: 20,
      stepSize: 1,
      optimizationTarget: &apos;total_error&apos;,
      regularization: false,
      crossValidation: true
    },
    {
}
      id: &apos;neural_network&apos;,
      name: &apos;Neural Network&apos;,
      description: &apos;Varying number of hidden layers and neurons&apos;,
      complexityParameter: &apos;hidden_layers&apos;,
      minComplexity: 1,
      maxComplexity: 10,
      stepSize: 1,
      optimizationTarget: &apos;generalization&apos;,
      regularization: true,
      crossValidation: true
    },
    {
}
      id: &apos;decision_tree&apos;,
      name: &apos;Decision Tree&apos;,
      description: &apos;Varying maximum depth of decision trees&apos;,
      complexityParameter: &apos;max_depth&apos;,
      minComplexity: 1,
      maxComplexity: 15,
      stepSize: 1,
      optimizationTarget: &apos;total_error&apos;,
      regularization: false,
      crossValidation: true
    },
    {
}
      id: &apos;random_forest&apos;,
      name: &apos;Random Forest&apos;,
      description: &apos;Varying number of trees in the ensemble&apos;,
      complexityParameter: &apos;n_estimators&apos;,
      minComplexity: 10,
      maxComplexity: 200,
      stepSize: 10,
      optimizationTarget: &apos;variance&apos;,
      regularization: false,
      crossValidation: true
    },
    {
}
      id: &apos;svm&apos;,
      name: &apos;Support Vector Machine&apos;,
      description: &apos;Varying regularization parameter C&apos;,
      complexityParameter: &apos;C&apos;,
      minComplexity: 0.01,
      maxComplexity: 100,
      stepSize: 0.1,
      optimizationTarget: &apos;total_error&apos;,
      regularization: true,
      crossValidation: true

  ];

  // Learning curve experiments
  const learningCurveExperiments: LearningCurveExperiment[] = [
    {
}
      id: &apos;neural_network_learning&apos;,
      name: &apos;Neural Network Convergence&apos;,
      description: &apos;Analyze how neural network performance improves with training data size&apos;,
      modelType: &apos;neural_network&apos;,
      sampleSizeRange: [100, 5000],
      stepSize: 100,
      convergenceThreshold: 0.01,
      expectedConvergencePoint: 2500,
      dataEfficiency: &apos;medium&apos;,
      convergenceRate: &apos;medium&apos;
    },
    {
}
      id: &apos;random_forest_learning&apos;,
      name: &apos;Random Forest Data Scaling&apos;,
      description: &apos;Study random forest performance scaling with dataset size&apos;,
      modelType: &apos;random_forest&apos;,
      sampleSizeRange: [50, 3000],
      stepSize: 50,
      convergenceThreshold: 0.005,
      expectedConvergencePoint: 1500,
      dataEfficiency: &apos;high&apos;,
      convergenceRate: &apos;fast&apos;
    },
    {
}
      id: &apos;linear_regression_learning&apos;,
      name: &apos;Linear Model Efficiency&apos;,
      description: &apos;Examine linear regression data efficiency and convergence patterns&apos;,
      modelType: &apos;linear_regression&apos;,
      sampleSizeRange: [50, 2000],
      stepSize: 50,
      convergenceThreshold: 0.02,
      expectedConvergencePoint: 800,
      dataEfficiency: &apos;high&apos;,
      convergenceRate: &apos;fast&apos;
    },
    {
}
      id: &apos;gradient_boosting_learning&apos;,
      name: &apos;Gradient Boosting Scaling&apos;,
      description: &apos;Analyze gradient boosting performance with increasing data volumes&apos;,
      modelType: &apos;gradient_boosting&apos;,
      sampleSizeRange: [100, 4000],
      stepSize: 100,
      convergenceThreshold: 0.008,
      expectedConvergencePoint: 2000,
      dataEfficiency: &apos;medium&apos;,
      convergenceRate: &apos;medium&apos;
    },
    {
}
      id: &apos;ensemble_learning&apos;,
      name: &apos;Ensemble Learning Curves&apos;,
      description: &apos;Study ensemble method convergence and data requirements&apos;,
      modelType: &apos;ensemble&apos;,
      sampleSizeRange: [200, 6000],
      stepSize: 200,
      convergenceThreshold: 0.005,
      expectedConvergencePoint: 3500,
      dataEfficiency: &apos;low&apos;,
      convergenceRate: &apos;slow&apos;

  ];

  // Data size configurations
  const dataSizeConfigs: DataSizeConfig[] = [
    {
}
      id: &apos;logarithmic&apos;,
      name: &apos;Logarithmic Scaling&apos;,
      description: &apos;Sample sizes increase logarithmically for efficient exploration&apos;,
      minSamples: 50,
      maxSamples: 5000,
      stepStrategy: &apos;logarithmic&apos;,
      validationRatio: 0.2,
      crossValidationFolds: 5,
      randomState: 42
    },
    {
}
      id: &apos;linear&apos;,
      name: &apos;Linear Scaling&apos;,
      description: &apos;Sample sizes increase linearly for detailed analysis&apos;,
      minSamples: 100,
      maxSamples: 3000,
      stepStrategy: &apos;linear&apos;,
      validationRatio: 0.25,
      crossValidationFolds: 5,
      randomState: 42
    },
    {
}
      id: &apos;exponential&apos;,
      name: &apos;Exponential Scaling&apos;,
      description: &apos;Sample sizes increase exponentially for rapid exploration&apos;,
      minSamples: 100,
      maxSamples: 8000,
      stepStrategy: &apos;exponential&apos;,
      validationRatio: 0.2,
      crossValidationFolds: 3,
      randomState: 42

  ];

  // Helper functions for cross-validation analysis
  const getCVComplexityScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;k_fold&apos;: &apos;⭐⭐&apos;,
      &apos;stratified_k_fold&apos;: &apos;⭐⭐⭐&apos;,
      &apos;time_series_split&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;group_k_fold&apos;: &apos;⭐⭐⭐&apos;,
      &apos;nested_cv&apos;: &apos;⭐⭐⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getCVReliabilityScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;nested_cv&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;stratified_k_fold&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;group_k_fold&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;time_series_split&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;k_fold&apos;: &apos;⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getCVEfficiencyScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;k_fold&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;stratified_k_fold&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;group_k_fold&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;time_series_split&apos;: &apos;⭐⭐⭐&apos;,
      &apos;nested_cv&apos;: &apos;⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getCVFantasyScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;time_series_split&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;group_k_fold&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;stratified_k_fold&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;nested_cv&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;k_fold&apos;: &apos;⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  // Helper functions for holdout validation analysis
  const getHoldoutSimplicityScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;simple_holdout&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;stratified_holdout&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;grouped_holdout&apos;: &apos;⭐⭐⭐&apos;,
      &apos;temporal_holdout&apos;: &apos;⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getHoldoutReliabilityScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;temporal_holdout&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;grouped_holdout&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;stratified_holdout&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;simple_holdout&apos;: &apos;⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getHoldoutSpeedScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;simple_holdout&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;stratified_holdout&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;grouped_holdout&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;temporal_holdout&apos;: &apos;⭐⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getHoldoutFantasyScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;temporal_holdout&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;grouped_holdout&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;stratified_holdout&apos;: &apos;⭐⭐⭐&apos;,
      &apos;simple_holdout&apos;: &apos;⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getHoldoutDataLeakageRisk = (methodId: string): string => {
}
    const risks: Record<string, string> = {
}
      &apos;simple_holdout&apos;: &apos;Low&apos;,
      &apos;stratified_holdout&apos;: &apos;Low&apos;, 
      &apos;grouped_holdout&apos;: &apos;Very Low&apos;,
      &apos;temporal_holdout&apos;: &apos;Minimal&apos;
    };
    return risks[methodId] || &apos;Unknown&apos;;
  };

  const getHoldoutBestUseCase = (methodId: string): string => {
}
    const useCases: Record<string, string> = {
}
      &apos;simple_holdout&apos;: &apos;Quick model evaluation with balanced datasets&apos;,
      &apos;stratified_holdout&apos;: &apos;Maintaining class distributions in classification tasks&apos;,
      &apos;grouped_holdout&apos;: &apos;Player-based validation to prevent data leakage&apos;,
      &apos;temporal_holdout&apos;: &apos;Time-aware validation for seasonal patterns&apos;
    };
    return useCases[methodId] || &apos;General validation&apos;;
  };

  // Simulate holdout validation experiment
  const runHoldoutExperiment = async () => {
}
    try {
}

    setHoldoutExperimentRunning(true);
    setHoldoutProgress(0);

    const selectedMethod = holdoutMethods.find((m: any) => m.id === selectedHoldoutMethod);
    if (!selectedMethod) return;

    // Simulate experiment progress
    const steps = [&apos;Data Loading&apos;, &apos;Split Generation&apos;, &apos;Model Training&apos;, &apos;Evaluation&apos;, &apos;Analysis&apos;];
    
    for (let step = 0; step < steps.length; step++) {
}
      await new Promise(resolve => setTimeout(resolve, 600));
      setHoldoutProgress((step + 1) / steps.length * 100);
    
    } catch (error) {
}
      console.error(&apos;Error in runHoldoutExperiment:&apos;, error);

    } catch (error) {
}
        console.error(error);
    }// Generate realistic results
    const totalSize = 10000;
    const trainSize = Math.floor(totalSize * selectedMethod.trainRatio);
    const testSize = Math.floor(totalSize * selectedMethod.testRatio);
    const validationSize = selectedMethod.validationRatio ? Math.floor(totalSize * selectedMethod.validationRatio) : undefined;

    const baseScore = 0.85;
    const trainScore = baseScore + Math.random() * 0.08; // Training usually higher
    const testScore = baseScore + Math.random() * 0.06; // Test usually lower
    const validationScore = validationSize ? baseScore + Math.random() * 0.07 : undefined;

    const result: HoldoutResult = {
}
      method: selectedMethod.name,
      trainSize,
      testSize,
      validationSize,
      trainScore,
      testScore,
      validationScore,
      overfit: trainScore - testScore,
      generalizationGap: Math.abs(trainScore - testScore),
      metrics: {
}
        mae: 2.1 + Math.random() * 0.5,
        rmse: 2.8 + Math.random() * 0.7,
        r2: 0.78 + Math.random() * 0.15,
        mape: 15.2 + Math.random() * 3.0,
        fantasyAccuracy: 0.82 + Math.random() * 0.12,
        rankingCorrelation: 0.75 + Math.random() * 0.18

    };

    setHoldoutResults(result);
    setHoldoutExperimentRunning(false);
  };

  // Helper functions for time series validation analysis
  const getTimeSeriesComplexityScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;walk_forward&apos;: &apos;⭐⭐⭐&apos;,
      &apos;expanding_window&apos;: &apos;⭐⭐&apos;,
      &apos;rolling_window&apos;: &apos;⭐⭐⭐&apos;,
      &apos;blocked_time_series&apos;: &apos;⭐⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getTimeSeriesReliabilityScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;walk_forward&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;blocked_time_series&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;expanding_window&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;rolling_window&apos;: &apos;⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getTimeSeriesEfficiencyScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;rolling_window&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;expanding_window&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;walk_forward&apos;: &apos;⭐⭐⭐&apos;,
      &apos;blocked_time_series&apos;: &apos;⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getTimeSeriesFantasyScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;walk_forward&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;rolling_window&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;blocked_time_series&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;expanding_window&apos;: &apos;⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getTimeSeriesDataUsage = (methodId: string): string => {
}
    const usage: Record<string, string> = {
}
      &apos;expanding_window&apos;: &apos;Maximum - uses all historical data&apos;,
      &apos;walk_forward&apos;: &apos;Progressive - incremental data usage&apos;,
      &apos;rolling_window&apos;: &apos;Fixed - consistent window size&apos;,
      &apos;blocked_time_series&apos;: &apos;Segmented - discrete time blocks&apos;
    };
    return usage[methodId] || &apos;Variable usage&apos;;
  };

  const getTimeSeriesBestUseCase = (methodId: string): string => {
}
    const useCases: Record<string, string> = {
}
      &apos;walk_forward&apos;: &apos;Live prediction simulation and season progression&apos;,
      &apos;expanding_window&apos;: &apos;Long-term trend analysis and career modeling&apos;,
      &apos;rolling_window&apos;: &apos;Recent form analysis and injury recovery patterns&apos;,
      &apos;blocked_time_series&apos;: &apos;Independent season validation and draft analysis&apos;
    };
    return useCases[methodId] || &apos;General time series validation&apos;;
  };

  // Helper functions for bootstrap resampling analysis
  const getBootstrapComplexityScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;basic_bootstrap&apos;: &apos;⭐⭐&apos;,
      &apos;stratified_bootstrap&apos;: &apos;⭐⭐⭐&apos;,
      &apos;block_bootstrap&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;parametric_bootstrap&apos;: &apos;⭐⭐⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getBootstrapReliabilityScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;parametric_bootstrap&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;block_bootstrap&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;stratified_bootstrap&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;basic_bootstrap&apos;: &apos;⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getBootstrapEfficiencyScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;basic_bootstrap&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;stratified_bootstrap&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;block_bootstrap&apos;: &apos;⭐⭐⭐&apos;,
      &apos;parametric_bootstrap&apos;: &apos;⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getBootstrapFantasyScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;stratified_bootstrap&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;block_bootstrap&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;parametric_bootstrap&apos;: &apos;⭐⭐⭐&apos;,
      &apos;basic_bootstrap&apos;: &apos;⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getBootstrapDataUsage = (methodId: string): string => {
}
    const usage: Record<string, string> = {
}
      &apos;basic_bootstrap&apos;: &apos;100% with replacement&apos;,
      &apos;stratified_bootstrap&apos;: &apos;100% stratified sampling&apos;,
      &apos;block_bootstrap&apos;: &apos;~90% block sampling&apos;,
      &apos;parametric_bootstrap&apos;: &apos;Model-based generation&apos;
    };
    return usage[methodId] || &apos;Variable usage&apos;;
  };

  const getBootstrapBestUseCase = (methodId: string): string => {
}
    const useCases: Record<string, string> = {
}
      &apos;basic_bootstrap&apos;: &apos;General uncertainty quantification and confidence intervals&apos;,
      &apos;stratified_bootstrap&apos;: &apos;Position-balanced sampling and imbalanced datasets&apos;,
      &apos;block_bootstrap&apos;: &apos;Time-dependent data and seasonal fantasy patterns&apos;,
      &apos;parametric_bootstrap&apos;: &apos;Model-based uncertainty and smooth predictions&apos;
    };
    return useCases[methodId] || &apos;General bootstrap resampling&apos;;
  };

  // Helper functions for calibration analysis
  const getCalibrationComplexityScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;temperature_scaling&apos;: &apos;⭐&apos;,
      &apos;platt_scaling&apos;: &apos;⭐⭐&apos;,
      &apos;isotonic_regression&apos;: &apos;⭐⭐⭐&apos;,
      &apos;bayesian_calibration&apos;: &apos;⭐⭐⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getCalibrationReliabilityScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;bayesian_calibration&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;isotonic_regression&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;platt_scaling&apos;: &apos;⭐⭐⭐&apos;,
      &apos;temperature_scaling&apos;: &apos;⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getCalibrationEfficiencyScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;temperature_scaling&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;platt_scaling&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;isotonic_regression&apos;: &apos;⭐⭐⭐&apos;,
      &apos;bayesian_calibration&apos;: &apos;⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getCalibrationFantasyScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;isotonic_regression&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;bayesian_calibration&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;platt_scaling&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;temperature_scaling&apos;: &apos;⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐&apos;;
  };

  const getCalibrationDataRequirement = (methodId: string): string => {
}
    const requirements: Record<string, string> = {
}
      &apos;temperature_scaling&apos;: &apos;Minimal - single parameter&apos;,
      &apos;platt_scaling&apos;: &apos;Small - hold-out validation set&apos;,
      &apos;isotonic_regression&apos;: &apos;Medium - sufficient calibration data&apos;,
      &apos;bayesian_calibration&apos;: &apos;Variable - depends on priors&apos;
    };
    return requirements[methodId] || &apos;Variable requirement&apos;;
  };

  const getCalibrationBestUseCase = (methodId: string): string => {
}
    const useCases: Record<string, string> = {
}
      &apos;temperature_scaling&apos;: &apos;Neural networks with preserved accuracy requirements&apos;,
      &apos;platt_scaling&apos;: &apos;Binary classification with parametric assumptions&apos;,
      &apos;isotonic_regression&apos;: &apos;Ranking preservation and non-linear relationships&apos;,
      &apos;bayesian_calibration&apos;: &apos;Limited data with domain expertise and uncertainty needs&apos;
    };
    return useCases[methodId] || &apos;General probability calibration&apos;;
  };

  const getCalibrationPreservesRanking = (methodId: string): boolean => {
}
    const preserves: Record<string, boolean> = {
}
      &apos;temperature_scaling&apos;: true,
      &apos;platt_scaling&apos;: true,
      &apos;isotonic_regression&apos;: true,
      &apos;bayesian_calibration&apos;: false
    };
    return preserves[methodId] || false;
  };

  // Helper functions for performance metrics analysis
  const getMetricImportanceScore = (metricId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;accuracy&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;precision&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;recall&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;f1_score&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;auc_roc&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;mse&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;mae&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;r_squared&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;mape&apos;: &apos;⭐⭐⭐&apos;,
      &apos;points_accuracy&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;ranking_accuracy&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;bust_detection&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;sleeper_identification&apos;: &apos;⭐⭐⭐⭐&apos;
    };
    return scores[metricId] || &apos;⭐&apos;;
  };

  const getMetricInterpretabilityScore = (metricId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;accuracy&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;precision&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;recall&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;f1_score&apos;: &apos;⭐⭐⭐&apos;,
      &apos;auc_roc&apos;: &apos;⭐⭐&apos;,
      &apos;mse&apos;: &apos;⭐⭐⭐&apos;,
      &apos;mae&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;r_squared&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;mape&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;points_accuracy&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;ranking_accuracy&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;bust_detection&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;sleeper_identification&apos;: &apos;⭐⭐⭐⭐&apos;
    };
    return scores[metricId] || &apos;⭐&apos;;
  };

  const getMetricRobustnessScore = (metricId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;accuracy&apos;: &apos;⭐⭐&apos;,
      &apos;precision&apos;: &apos;⭐⭐⭐&apos;,
      &apos;recall&apos;: &apos;⭐⭐⭐&apos;,
      &apos;f1_score&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;auc_roc&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;mse&apos;: &apos;⭐⭐&apos;,
      &apos;mae&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;r_squared&apos;: &apos;⭐⭐⭐&apos;,
      &apos;mape&apos;: &apos;⭐⭐&apos;,
      &apos;points_accuracy&apos;: &apos;⭐⭐⭐&apos;,
      &apos;ranking_accuracy&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;bust_detection&apos;: &apos;⭐⭐⭐&apos;,
      &apos;sleeper_identification&apos;: &apos;⭐⭐&apos;
    };
    return scores[metricId] || &apos;⭐&apos;;
  };

  const getMetricFantasyRelevanceScore = (metricId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;accuracy&apos;: &apos;⭐⭐⭐&apos;,
      &apos;precision&apos;: &apos;⭐⭐⭐&apos;,
      &apos;recall&apos;: &apos;⭐⭐⭐&apos;,
      &apos;f1_score&apos;: &apos;⭐⭐⭐&apos;,
      &apos;auc_roc&apos;: &apos;⭐⭐⭐&apos;,
      &apos;mse&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;mae&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;r_squared&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;mape&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;points_accuracy&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;ranking_accuracy&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;bust_detection&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;sleeper_identification&apos;: &apos;⭐⭐⭐⭐⭐&apos;
    };
    return scores[metricId] || &apos;⭐&apos;;
  };

  // Helper functions for bias-variance analysis
  const getBiasComplexityScore = (experimentId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;polynomial_complexity&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;neural_depth&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;tree_depth&apos;: &apos;⭐⭐⭐&apos;,
      &apos;ensemble_size&apos;: &apos;⭐⭐&apos;,
      &apos;regularization_strength&apos;: &apos;⭐⭐⭐⭐&apos;
    };
    return scores[experimentId] || &apos;⭐&apos;;
  };

  const getVarianceComplexityScore = (experimentId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;polynomial_complexity&apos;: &apos;⭐⭐⭐&apos;,
      &apos;neural_depth&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;tree_depth&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;ensemble_size&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;regularization_strength&apos;: &apos;⭐⭐&apos;
    };
    return scores[experimentId] || &apos;⭐&apos;;
  };

  const getInterpretabilityScore = (experimentId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;polynomial_complexity&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;neural_depth&apos;: &apos;⭐⭐&apos;,
      &apos;tree_depth&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;ensemble_size&apos;: &apos;⭐⭐⭐&apos;,
      &apos;regularization_strength&apos;: &apos;⭐⭐⭐&apos;
    };
    return scores[experimentId] || &apos;⭐&apos;;
  };

  const getComputationalComplexityScore = (experimentId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;polynomial_complexity&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;neural_depth&apos;: &apos;⭐⭐&apos;,
      &apos;tree_depth&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;ensemble_size&apos;: &apos;⭐⭐⭐&apos;,
      &apos;regularization_strength&apos;: &apos;⭐⭐⭐⭐&apos;
    };
    return scores[experimentId] || &apos;⭐&apos;;
  };

  // Helper functions for learning curve analysis
  const getDataEfficiencyScore = (experimentId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;neural_network_learning&apos;: &apos;⭐⭐⭐&apos;,
      &apos;random_forest_learning&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;linear_regression_learning&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;gradient_boosting_learning&apos;: &apos;⭐⭐⭐&apos;,
      &apos;ensemble_learning&apos;: &apos;⭐⭐&apos;
    };
    return scores[experimentId] || &apos;⭐&apos;;
  };

  const getConvergenceSpeedScore = (experimentId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;neural_network_learning&apos;: &apos;⭐⭐⭐&apos;,
      &apos;random_forest_learning&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;linear_regression_learning&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;gradient_boosting_learning&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;ensemble_learning&apos;: &apos;⭐⭐&apos;
    };
    return scores[experimentId] || &apos;⭐&apos;;
  };

  const getScalabilityScore = (experimentId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;neural_network_learning&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;random_forest_learning&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;linear_regression_learning&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;gradient_boosting_learning&apos;: &apos;⭐⭐⭐&apos;,
      &apos;ensemble_learning&apos;: &apos;⭐⭐&apos;
    };
    return scores[experimentId] || &apos;⭐&apos;;
  };

  const getMemoryEfficiencyScore = (experimentId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;neural_network_learning&apos;: &apos;⭐⭐&apos;,
      &apos;random_forest_learning&apos;: &apos;⭐⭐⭐&apos;,
      &apos;linear_regression_learning&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;gradient_boosting_learning&apos;: &apos;⭐⭐⭐&apos;,
      &apos;ensemble_learning&apos;: &apos;⭐⭐&apos;
    };
    return scores[experimentId] || &apos;⭐&apos;;
  };

  // Simulate time series validation experiment
  const runTimeSeriesExperiment = async () => {
}
    try {
}

    setTimeSeriesExperimentRunning(true);
    setTimeSeriesProgress(0);

    const selectedMethod = timeSeriesMethods.find((m: any) => m.id === selectedTimeSeriesMethod);
    if (!selectedMethod) return;

    // Simulate experiment progress
    const steps = [&apos;Data Preparation&apos;, &apos;Time Split Generation&apos;, &apos;Model Training&apos;, &apos;Window Validation&apos;, &apos;Results Aggregation&apos;];
    
    for (let step = 0; step < steps.length; step++) {
}
      await new Promise(resolve => setTimeout(resolve, 800));
      setTimeSeriesProgress((step + 1) / steps.length * 100);
    
    } catch (error) {
}
      console.error(&apos;Error in runTimeSeriesExperiment:&apos;, error);

    } catch (error) {
}
        console.error(error);
    }// Generate realistic time series validation results
    const totalWeeks = 17; // NFL season
    const minTrainSize = selectedMethod.minTrainSize;
    const windowSize = selectedMethod.windowSize;
    const stepSize = selectedMethod.stepSize;
    
    const splits = [];
    let currentStart = 0;
    let splitIndex = 0;

    while (currentStart + minTrainSize < totalWeeks) {
}
      const trainStart = currentStart;
      let trainEnd, testStart, testEnd;

      switch (selectedMethod.id) {
}
        case &apos;walk_forward&apos;:
          trainEnd = Math.min(trainStart + minTrainSize + splitIndex, totalWeeks - 1);
          testStart = trainEnd;
          testEnd = Math.min(testStart + 1, totalWeeks);
          break;
        case &apos;expanding_window&apos;:
          trainEnd = Math.min(trainStart + minTrainSize + splitIndex * 2, totalWeeks - 1);
          testStart = trainEnd;
          testEnd = Math.min(testStart + 1, totalWeeks);
          break;
        case &apos;rolling_window&apos;:
          trainEnd = Math.min(trainStart + windowSize, totalWeeks - 1);
          testStart = trainEnd;
          testEnd = Math.min(testStart + 1, totalWeeks);
          break;
        case &apos;blocked_time_series&apos;:
          trainEnd = Math.min(trainStart + windowSize, totalWeeks - 2);
          testStart = trainEnd + 1; // gap
          testEnd = Math.min(testStart + windowSize, totalWeeks);
          break;
        default:
          trainEnd = trainStart + minTrainSize;
          testStart = trainEnd;
          testEnd = testStart + 1;

      if (testEnd <= totalWeeks) {
}
        const trainScore = 0.85 + Math.random() * 0.1 - splitIndex * 0.005; // Slight degradation over time
        const testScore = 0.82 + Math.random() * 0.08 - splitIndex * 0.008;

        splits.push({
}
          splitIndex,
          trainPeriod: `Week ${trainStart + 1}-${trainEnd}`,
          testPeriod: `Week ${testStart + 1}-${testEnd}`,
          trainScore,
          testScore,
          dataLeakage: false
        });

      currentStart += stepSize;
      splitIndex++;
      
      if (splitIndex > 10) break; // Limit to reasonable number of splits

    const avgTrainScore = splits.reduce((sum, s) => sum + s.trainScore, 0) / splits.length;
    const avgTestScore = splits.reduce((sum, s) => sum + s.testScore, 0) / splits.length;
    const scoreVariance = splits.reduce((sum, s) => sum + Math.pow(s.testScore - avgTestScore, 2), 0) / splits.length;
    const scoreStability = Math.max(0, 1 - scoreVariance * 10);

    const result: TimeSeriesResult = {
}
      method: selectedMethod.name,
      totalSplits: splits.length,
      trainSize: Math.round(splits.reduce((sum, s) => sum + parseInt(s.trainPeriod.split(&apos;-&apos;)[1]) - parseInt(s.trainPeriod.split(&apos;-&apos;)[0].split(&apos; &apos;)[1]) + 1, 0) / splits.length),
      testSize: 1, // Usually 1 week for fantasy
      windowSize: selectedMethod.windowSize,
      stepSize: selectedMethod.stepSize,
      avgTrainScore,
      avgTestScore,
      scoreStability,
      temporalConsistency: Math.max(0.6, scoreStability + Math.random() * 0.2),
      splits,
      metrics: {
}
        mae: 2.3 + Math.random() * 0.6,
        rmse: 3.1 + Math.random() * 0.8,
        r2: 0.74 + Math.random() * 0.18,
        mape: 16.8 + Math.random() * 3.5,
        fantasyAccuracy: 0.79 + Math.random() * 0.14,
        rankingCorrelation: 0.71 + Math.random() * 0.20,
        temporalStability: scoreStability,
        seasonConsistency: 0.68 + Math.random() * 0.25

    };

    setTimeSeriesResults(result);
    setTimeSeriesExperimentRunning(false);
  };

  // Simulate bootstrap resampling experiment
  const runBootstrapExperiment = async () => {
}
    try {
}

    setBootstrapExperimentRunning(true);
    setBootstrapProgress(0);

    const selectedMethod = bootstrapMethods.find((m: any) => m.id === selectedBootstrapMethod);
    if (!selectedMethod) return;

    // Simulate experiment progress
    const steps = [&apos;Data Preparation&apos;, &apos;Sample Generation&apos;, &apos;Model Training&apos;, &apos;Bootstrap Sampling&apos;, &apos;Confidence Estimation&apos;];
    const totalSteps = steps.length;

    for (let step = 0; step < totalSteps; step++) {
}
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      setBootstrapProgress(((step + 1) / totalSteps) * 100);
    
    } catch (error) {
}
      console.error(&apos;Error in runBootstrapExperiment:&apos;, error);

    } catch (error) {
}
        console.error(error);
    }// Generate realistic bootstrap results with fantasy football context
    const nBootstraps = selectedMethod.nBootstraps;
    const baseScore = 0.78 + Math.random() * 0.15;
    
    // Generate bootstrap scores with method-specific characteristics
    const bootstrapScores = Array.from({ length: nBootstraps }, (_, i) => {
}
      let score = baseScore;
      
      if (selectedMethod.type === &apos;basic&apos;) {
}
        score += (Math.random() - 0.5) * 0.1;
      } else if (selectedMethod.type === &apos;stratified&apos;) {
}
        score += (Math.random() - 0.5) * 0.08 + 0.02; // More stable
      } else if (selectedMethod.type === &apos;block&apos;) {
}
        score += (Math.random() - 0.5) * 0.12 - 0.01; // More variable
      } else if (selectedMethod.type === &apos;parametric&apos;) {
}
        score += (Math.random() - 0.5) * 0.06 + 0.04; // Smoothest

      return Math.max(0.1, Math.min(0.95, score));
    });

    const avgScore = bootstrapScores.reduce((a, b) => a + b, 0) / bootstrapScores.length;
    const variance = bootstrapScores.reduce((sum, score) => sum + Math.pow(score - avgScore, 2), 0) / bootstrapScores.length;
    const std = Math.sqrt(variance);
    
    // Calculate confidence interval
    const alpha = 1 - selectedMethod.confidenceLevel;
    const lowerPercentile = (alpha / 2) * 100;
    const upperPercentile = (1 - alpha / 2) * 100;
    const sortedScores = [...bootstrapScores].sort((a, b) => a - b);
    const lowerIndex = Math.floor(lowerPercentile / 100 * nBootstraps);
    const upperIndex = Math.floor(upperPercentile / 100 * nBootstraps);

    // Calculate statistics
    const median = sortedScores[Math.floor(nBootstraps / 2)];
    const q25 = sortedScores[Math.floor(0.25 * nBootstraps)];
    const q75 = sortedScores[Math.floor(0.75 * nBootstraps)];
    const skewness = bootstrapScores.reduce((sum, score) => sum + Math.pow((score - avgScore) / std, 3), 0) / nBootstraps;
    const kurtosis = bootstrapScores.reduce((sum, score) => sum + Math.pow((score - avgScore) / std, 4), 0) / nBootstraps - 3;

    const result: BootstrapResult = {
}
      method: selectedMethod.name,
      nBootstraps: nBootstraps,
      sampleSize: 1000,
      blockSize: selectedMethod.blockSize,
      replacementRatio: selectedMethod.replacement ? 1.0 : 0.8,
      avgScore: avgScore,
      bootstrapScores: bootstrapScores,
      confidenceInterval: {
}
        lower: sortedScores[lowerIndex],
        upper: sortedScores[upperIndex],
        level: selectedMethod.confidenceLevel
      },
      statistics: {
}
        mean: avgScore,
        std: std,
        variance: variance,
        skewness: skewness,
        kurtosis: kurtosis,
        median: median,
        q25: q25,
        q75: q75
      },
      metrics: {
}
        mae: 0.045 + Math.random() * 0.02,
        rmse: 0.067 + Math.random() * 0.03,
        r2: avgScore,
        mape: 8.2 + Math.random() * 3.0,
        fantasyAccuracy: avgScore * 0.95 + 0.02,
        stabilityIndex: 1 - (std / avgScore),
        diversityScore: Math.min(1.0, std * 5),
        robustnessMetric: 1 / (1 + std * 2)
      },
      convergence: {
}
        converged: std < 0.05,
        requiredSamples: Math.min(nBootstraps, Math.ceil(1000 / (std + 0.01))),
        stabilityThreshold: 0.05,
        finalVariance: variance

    };

    setBootstrapResults(result);
    setBootstrapExperimentRunning(false);
  };

  // Simulate calibration experiment
  const runCalibrationExperiment = async () => {
}
    try {
}
    setCalibrationExperimentRunning(true);
    setCalibrationProgress(0);

    const selectedMethod = calibrationMethods.find((m: any) => m.id === selectedCalibrationMethod);
    if (!selectedMethod) return;

    // Simulate experiment progress
    const steps = [&apos;Data Preparation&apos;, &apos;Hold-out Split&apos;, &apos;Model Training&apos;, &apos;Calibration Fitting&apos;, &apos;Reliability Assessment&apos;];
    const totalSteps = steps.length;

    for (let step = 0; step < totalSteps; step++) {
}
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));
      setCalibrationProgress(((step + 1) / totalSteps) * 100);
    
    `${(binStart * 100).toFixed(0)}-${(binEnd * 100).toFixed(0)}%`,
        uncalibrated: {
}
          count: uncalInBin.length,
          meanPrediction: uncalMeanPred,
          accuracy: uncalAccuracy,
          calibrationError: Math.abs(uncalMeanPred - uncalAccuracy)
        },
        calibrated: {
}
          count: calInBin.length,
          meanPrediction: calMeanPred,
          accuracy: calAccuracy,
          calibrationError: Math.abs(calMeanPred - calAccuracy)

      };
    });

    // Calculate overall metrics
    const uncalBrierScore = uncalibratedPredictions.reduce((sum, pred, idx) => 
      sum + Math.pow(pred - trueLabels[idx], 2), 0) / nSamples;
    const calBrierScore = calibratedPredictions.reduce((sum, pred, idx) => 
      sum + Math.pow(pred - trueLabels[idx], 2), 0) / nSamples;
    
    const uncalECE = reliabilityDiagram.reduce((sum, bin) => 
      sum + (bin.uncalibrated.count / nSamples) * bin.uncalibrated.calibrationError, 0);
    const calECE = reliabilityDiagram.reduce((sum, bin) => 
      sum + (bin.calibrated.count / nSamples) * bin.calibrated.calibrationError, 0);

    // Calculate performance metrics
    const accuracy = trueLabels.reduce((a: number, b: number) => a + b, 0) / nSamples;
    const threshold = 0.5;
    const predicted = calibratedPredictions.map((p: any) => p > threshold ? 1 : 0);
    const tp = predicted.reduce((sum: number, p: number, i: number) => sum + (p === 1 && trueLabels[i] === 1 ? 1 : 0), 0);
    const fp = predicted.reduce((sum: number, p: number, i: number) => sum + (p === 1 && trueLabels[i] === 0 ? 1 : 0), 0);
    const fn = predicted.reduce((sum: number, p: number, i: number) => sum + (p === 0 && trueLabels[i] === 1 ? 1 : 0), 0);
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1Score = 2 * (precision * recall) / (precision + recall) || 0;

    // Create proper reliability diagram
    const binEdges = Array.from({ length: nBins + 1 }, (_, i) => i / nBins);
    const binMeans = reliabilityDiagram.map((bin: any) => bin.calibrated.meanPrediction);
    const binCounts = reliabilityDiagram.map((bin: any) => bin.calibrated.count);

    const result: CalibrationResult = {
}
      method: selectedMethod.name,
      methodType: selectedMethod.type === &apos;parametric&apos; ? &apos;parametric&apos; : 
                 selectedMethod.type === &apos;bayesian&apos; ? &apos;bayesian&apos; : &apos;non_parametric&apos;,
      calibrationType: selectedMethod.id === &apos;platt_scaling&apos; ? &apos;platt&apos; :
                      selectedMethod.id === &apos;isotonic_regression&apos; ? &apos;isotonic&apos; :
                      selectedMethod.id === &apos;bayesian_calibration&apos; ? &apos;bayesian&apos; : &apos;temperature&apos;,
      originalBrierScore: uncalBrierScore,
      calibratedBrierScore: calBrierScore,
      brierImprovement: (uncalBrierScore - calBrierScore) / uncalBrierScore,
      reliabilityDiagram: {
}
        binEdges,
        binMeans,
        binCounts,
        expectedCalibrationError: calECE,
        maximumCalibrationError: Math.max(...reliabilityDiagram.map((b: any) => b.calibrated.calibrationError))
      },
      calibrationMetrics: {
}
        brierScore: calBrierScore,
        logLoss: -trueLabels.reduce((sum: number, label: number, i: number) => 
          sum + label * Math.log(calibratedPredictions[i]) + (1 - label) * Math.log(1 - calibratedPredictions[i]), 0) / nSamples,
        calibrationError: calECE,
        reliability: 1 - calECE,
        resolution: 0.1 + Math.random() * 0.05,
        uncertainty: 0.15 + Math.random() * 0.05
      },
      parameters: {
}
        nSamples,
        nBins,
        method: selectedMethod.id,
        preservesRanking: getCalibrationPreservesRanking(selectedMethod.id)
      },
      predictions: {
}
        original: uncalibratedPredictions.slice(0, 100), // Limit for display
        calibrated: calibratedPredictions.slice(0, 100),
        actualOutcomes: trueLabels.slice(0, 100)
      },
      performanceMetrics: {
}
        accuracy,
        precision,
        recall,
        f1Score,
        auc: 0.75 + Math.random() * 0.2,
        fantasyAccuracy: 0.78 + Math.random() * 0.15
      },
      calibrationCurve: {
}
        meanPredicted: binMeans,
        fractionPositives: reliabilityDiagram.map((bin: any) => bin.calibrated.accuracy),
//         binCounts

    };

    setCalibrationResults(result);
    setCalibrationExperimentRunning(false);
  };

  // Simulate performance metrics experiment
  const runPerformanceMetricsExperiment = async () => {
}
    try {
}

    setMetricsExperimentRunning(true);
    setMetricsProgress(0);

    // Simulate experiment progress
    const steps = [&apos;Model Training&apos;, &apos;Prediction Generation&apos;, &apos;Metrics Calculation&apos;, &apos;Validation Analysis&apos;, &apos;Results Compilation&apos;];
    const totalSteps = steps.length;

    for (let step = 0; step < totalSteps; step++) {
}
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      setMetricsProgress(((step + 1) / totalSteps) * 100);
    
    } catch (error) {
}
      console.error(&apos;Error in runPerformanceMetricsExperiment:&apos;, error);

    } catch (error) {
}
        console.error(error);
    }// Generate realistic performance metrics based on selected model
    const selectedModelType = modelTypes.find((m: any) => m.id === selectedModel);
    const nSamples = 1000;
    
    // Generate predictions and ground truth
    const predictions = Array.from({ length: nSamples }, () => Math.random());
    const groundTruth = predictions.map((pred: any) => {
}
      // Add realistic noise based on model type
      let noise = 0;
      switch (selectedModel) {
}
        case &apos;neural_network&apos;:
          noise = (Math.random() - 0.5) * 0.1;
          break;
        case &apos;random_forest&apos;:
          noise = (Math.random() - 0.5) * 0.12;
          break;
        case &apos;gradient_boosting&apos;:
          noise = (Math.random() - 0.5) * 0.08;
          break;
        case &apos;linear_regression&apos;:
          noise = (Math.random() - 0.5) * 0.15;
          break;
        case &apos;svm&apos;:
          noise = (Math.random() - 0.5) * 0.13;
          break;
        default:
          noise = (Math.random() - 0.5) * 0.1;

      return Math.max(0, Math.min(1, pred + noise));
    });

    // Convert to binary for classification metrics
    const threshold = 0.5;
    const binaryPredictions = predictions.map((p: any) => p > threshold ? 1 : 0);
    const binaryGroundTruth = groundTruth.map((p: any) => p > threshold ? 1 : 0);

    // Calculate classification metrics
    const tp = binaryPredictions.reduce((sum: number, pred: number, i: number) => sum + (pred === 1 && binaryGroundTruth[i] === 1 ? 1 : 0), 0);
    const fp = binaryPredictions.reduce((sum: number, pred: number, i: number) => sum + (pred === 1 && binaryGroundTruth[i] === 0 ? 1 : 0), 0);
    const tn = binaryPredictions.reduce((sum: number, pred: number, i: number) => sum + (pred === 0 && binaryGroundTruth[i] === 0 ? 1 : 0), 0);
    const fn = binaryPredictions.reduce((sum: number, pred: number, i: number) => sum + (pred === 0 && binaryGroundTruth[i] === 1 ? 1 : 0), 0);

    const accuracy = (tp + tn) / (tp + tn + fp + fn);
    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
    const specificity = tn / (tn + fp) || 0;

    // Calculate confusion matrix
    const confusionMatrix = [
      [tn, fp],
      [fn, tp]
    ];

    // Calculate AUC-ROC (simplified)
    const rocAuc = 0.7 + Math.random() * 0.25; // Realistic range
    const prAuc = 0.65 + Math.random() * 0.3;

    // Calculate regression metrics
    const mse = predictions.reduce((sum, pred, i) => sum + Math.pow(pred - groundTruth[i], 2), 0) / nSamples;
    const mae = predictions.reduce((sum, pred, i) => sum + Math.abs(pred - groundTruth[i]), 0) / nSamples;
    const rmse = Math.sqrt(mse);
    
    const meanY = groundTruth.reduce((a, b) => a + b, 0) / groundTruth.length;
    const ssRes = groundTruth.reduce((sum, actual, i) => sum + Math.pow(actual - predictions[i], 2), 0);
    const ssTot = groundTruth.reduce((sum, actual) => sum + Math.pow(actual - meanY, 2), 0);
    const r2 = 1 - (ssRes / ssTot);

    const mape = predictions.reduce((sum, pred, i) => {
}
      const actual = groundTruth[i];
      return actual !== 0 ? sum + Math.abs((actual - pred) / actual) : sum;
    }, 0) / nSamples * 100;

    // Calculate calibration metrics
    const expectedCalibrationError = 0.05 + Math.random() * 0.1;
    const brierScore = predictions.reduce((sum, pred, i) => 
      sum + Math.pow(pred - binaryGroundTruth[i], 2), 0) / nSamples;

    // Calculate fantasy-specific metrics
    const pointsAccuracy = 0.75 + Math.random() * 0.2;
    const rankingAccuracy = 0.7 + Math.random() * 0.25;
    const bustDetection = 0.65 + Math.random() * 0.3;
    const sleeper = 0.6 + Math.random() * 0.35;

    const result: ComprehensiveMetrics = {
}
      classification: {
}
        accuracy,
        precision,
        recall,
        f1Score,
        specificity,
        sensitivity: recall, // Same as recall
        auc: rocAuc,
        rocAuc,
        prAuc,
        logLoss: -binaryGroundTruth.reduce((sum: number, actual: number, i: number) => 
          sum + actual * Math.log(Math.max(predictions[i], 1e-15)) + (1 - actual) * Math.log(Math.max(1 - predictions[i], 1e-15)), 0) / nSamples,
        matthews: (tp * tn - fp * fn) / Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn)) || 0,
        kappa: 2 * (tp * tn - fn * fp) / ((tp + fp) * (fp + tn) + (tp + fn) * (fn + tn)) || 0,
        balancedAccuracy: (recall + specificity) / 2,
//         confusionMatrix
      },
      regression: {
}
        mse,
        rmse,
        mae,
        mape,
        r2,
        adjustedR2: 1 - (1 - r2) * (nSamples - 1) / (nSamples - 18 - 1), // Adjusted for 18 features
        meanAbsError: mae,
        meanSqError: mse,
        medianAbsError: mae * 0.8, // Approximation
        maxError: Math.max(...predictions.map((pred, i) => Math.abs(pred - groundTruth[i]))),
        explainedVariance: r2 + Math.random() * 0.05
      },
      calibration: {
}
        expectedCalibrationError,
        maximumCalibrationError: expectedCalibrationError * 2,
        averageCalibrationError: expectedCalibrationError * 0.8,
        brierScore,
        brierSkillScore: 1 - brierScore / 0.25, // Reference is random prediction
        negativeLogLikelihood: -Math.log(Math.max(0.01, 1 - brierScore)),
        sharpness: 0.4 + Math.random() * 0.3,
        reliability: 1 - expectedCalibrationError,
        resolution: 0.2 + Math.random() * 0.2,
        uncertainty: 0.25,
        calibrationSlope: 0.9 + Math.random() * 0.2,
        calibrationIntercept: -0.05 + Math.random() * 0.1
      },
      fantasy: {
}
        pointsAccuracy,
        rankingAccuracy,
        topPerformerPrecision: 0.7 + Math.random() * 0.25,
        bustDetectionRecall: bustDetection,
        valueOverReplacement: 15.5 + Math.random() * 10,
        projectionBias: -2.1 + Math.random() * 4.2,
        consistencyScore: 0.8 + Math.random() * 0.15,
        upsetPrediction: 0.3 + Math.random() * 0.4,
        sleoperIdentification: sleeper,
        injuryAdjustedAccuracy: pointsAccuracy * 0.95,
        weatherAdjustedAccuracy: pointsAccuracy * 0.98,
        matchupAdjustedAccuracy: pointsAccuracy * 1.02

    };

    setMetricsResults(result);
    setMetricsExperimentRunning(false);
  };

  // Simulate bias-variance trade-off experiment
  const runBiasVarianceExperiment = async () => {
}
    try {
}

    setBiasVarianceExperimentRunning(true);
    setBiasVarianceProgress(0);

    const selectedConfig = complexityConfigs.find((c: any) => c.id === selectedComplexityModel);
    if (!selectedConfig) return;

    // Simulate experiment progress
    const steps = [&apos;Data Generation&apos;, &apos;Model Training&apos;, &apos;Bootstrap Sampling&apos;, &apos;Bias-Variance Decomposition&apos;, &apos;Visualization Generation&apos;];
    
    for (let step = 0; step < steps.length; step++) {
}
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBiasVarianceProgress((step + 1) / steps.length * 100);
    
    } catch (error) {
}
      console.error(&apos;Error in runBiasVarianceExperiment:&apos;, error);

    } catch (error) {
}
        console.error(error);
    }// Generate bias-variance results across complexity range
    const complexityStart = selectedComplexityRange[0];
    const complexityEnd = selectedComplexityRange[1];
    const complexityStep = selectedConfig.stepSize;
    
    const results: BiasVarianceResult[] = [];
    const biasValues: number[] = [];
    const varianceValues: number[] = [];
    const totalErrorValues: number[] = [];
    const complexityRange: number[] = [];

    let optimalComplexity = (complexityStart + complexityEnd) / 2;
    let minTotalError = Infinity;

    for (let complexity = complexityStart; complexity <= complexityEnd; complexity += complexityStep) {
}
      // Simulate bias-variance decomposition for this complexity level
      const baseNoise = 0.10 + Math.random() * 0.05;
      
      // Bias typically decreases with complexity (until overfitting)
      let bias: number;
      if (complexity < optimalComplexity) {
}
        // Underfitting region - high bias
        bias = 0.8 * Math.exp(-complexity / 3) + 0.05;
      } else {
}
        // Overfitting region - increasing bias due to poor generalization
        bias = 0.05 + 0.2 * Math.exp((complexity - optimalComplexity) / 8);

      // Variance typically increases with complexity
      let variance: number;
      if (selectedConfig.regularization) {
}
        // With regularization, variance increases more slowly
        variance = 0.02 + 0.3 * (1 - Math.exp(-complexity / 5));
      } else {
}
        // Without regularization, variance increases faster
        variance = 0.02 + 0.5 * (complexity / complexityEnd);

      // Add model-specific adjustments
      switch (selectedConfig.id) {
}
        case &apos;polynomial&apos;:
          bias = Math.max(0.01, 1.2 * Math.exp(-complexity / 2.5) + 0.02);
          variance = 0.01 + Math.pow(complexity / 20, 2) * 0.4;
          break;
        case &apos;neural_network&apos;:
          bias = Math.max(0.02, 0.6 * Math.exp(-complexity / 2) + 0.02);
          variance = 0.03 + complexity * 0.08 + Math.pow(complexity / 10, 1.5) * 0.1;
          break;
        case &apos;decision_tree&apos;:
          bias = Math.max(0.05, 0.8 * Math.exp(-complexity / 3) + 0.05);
          variance = Math.min(0.6, 0.02 + Math.pow(complexity / 15, 1.8) * 0.4);
          break;
        case &apos;random_forest&apos;:
          bias = Math.max(0.03, 0.4 * Math.exp(-complexity / 50) + 0.03);
          variance = Math.max(0.01, 0.3 * Math.exp(-complexity / 30) + 0.01);
          break;
        case &apos;svm&apos;:
          if (complexity < 1) {
}
            // Low C (high regularization)
            bias = 0.3 + 0.2 * Math.exp(-complexity * 10);
            variance = 0.05 + complexity * 0.1;
          } else {
}
            // High C (low regularization)
            bias = 0.05 + 0.1 * Math.exp((complexity - 1) / 10);
            variance = 0.05 + Math.log(complexity) * 0.15;

          break;

      const totalError = bias + variance + baseNoise;
      
      if (totalError < minTotalError) {
}
        minTotalError = totalError;
        optimalComplexity = complexity;

      // Generate sample predictions for visualization
      const sampleSize = 100;
      const predictions = Array.from({ length: sampleSize }, () => 
        Math.random() * 30 + Math.sin(complexity) * 5 + (Math.random() - 0.5) * Math.sqrt(variance) * 10
      );
      const trueValues = Array.from({ length: sampleSize }, () => 
        Math.random() * 25 + 10 + (Math.random() - 0.5) * Math.sqrt(baseNoise) * 8
      );

      // Calculate metrics
      const mse = predictions.reduce((sum, pred, i) => sum + Math.pow(pred - trueValues[i], 2), 0) / sampleSize;
      const mae = predictions.reduce((sum, pred, i) => sum + Math.abs(pred - trueValues[i]), 0) / sampleSize;
      const meanTrue = trueValues.reduce((sum, val) => sum + val, 0) / sampleSize;
      const meanPred = predictions.reduce((sum, val) => sum + val, 0) / sampleSize;
      const ssTotal = trueValues.reduce((sum, val) => sum + Math.pow(val - meanTrue, 2), 0);
      const ssRes = predictions.reduce((sum, pred, i) => sum + Math.pow(trueValues[i] - pred, 2), 0);
      const r2 = 1 - (ssRes / ssTotal);

      const result: BiasVarianceResult = {
}
        modelComplexity: complexity,
        bias: bias,
        variance: variance,
        noise: baseNoise,
        totalError: totalError,
        irreducibleError: baseNoise,
        predictions,
        trueValues,
        decomposition: {
}
          biasSquared: bias,
          varianceComponent: variance,
          noiseComponent: baseNoise,
          covariance: (Math.random() - 0.5) * 0.05
        },
        metrics: {
}
          mse,
          mae,
          r2: Math.max(0, Math.min(1, r2)),
          adjustedR2: Math.max(0, 1 - (1 - r2) * (sampleSize - 1) / (sampleSize - 2 - 1))

      };

      results.push(result);
      biasValues.push(bias);
      varianceValues.push(variance);
      totalErrorValues.push(totalError);
      complexityRange.push(complexity);

    // Create visualization data
    const visualization: BiasVarianceVisualization = {
}
      complexityRange,
      biasValues,
      varianceValues,
      totalErrorValues,
      optimalComplexity,
      underfittingRegion: [complexityStart, optimalComplexity * 0.7],
      overfittingRegion: [optimalComplexity * 1.3, complexityEnd],
      sweetSpot: optimalComplexity
    };

    setBiasVarianceResults(results);
    setBiasVarianceVisualization(visualization);
    setBiasVarianceExperimentRunning(false);
  };

  // Learning Curve Experiment Simulation
  const runLearningCurveExperiment = async () => {
}
    try {
}
    setLearningCurveExperimentRunning(true);
    setLearningCurveProgress(0);

    const selectedExperiment = learningCurveExperiments.find((e: any) => e.id === experimentId);
    if (!selectedExperiment) return;

    // Simulate experiment progress
    const steps = [&apos;Data Generation&apos;, &apos;Model Training&apos;, &apos;Sample Size Scaling&apos;, &apos;Performance Measurement&apos;, &apos;Visualization Generation&apos;];
    for (let step = 0; step < steps.length; step++) {
}
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLearningCurveProgress((step + 1) / steps.length * 100);
    
    `block-${method.id}-${foldIndex}-${blockIndex}`}
        className={`fold-block ${blockIndex === foldIndex ? &apos;validation&apos; : &apos;training&apos;}`}
      >
        {blockIndex === foldIndex ? &apos;Val&apos; : &apos;Train&apos;}
      </div>
    ))
  );

  // Helper function to render fold visualization
  const renderFoldVisualization = (method: CrossValidationConfig) => (
    <div className="fold-diagram sm:px-4 md:px-6 lg:px-8">
      {Array.from({ length: method.folds }).map((_, foldIndex) => (
        <div key={`fold-${method.id}-${foldIndex}`} className="fold-row sm:px-4 md:px-6 lg:px-8">
          <span className="fold-label sm:px-4 md:px-6 lg:px-8">Fold {foldIndex + 1}:</span>
          <div className="fold-blocks sm:px-4 md:px-6 lg:px-8">
            {renderFoldBlocks(method, foldIndex)}
          </div>
        </div>
      ))}
    </div>
  );

  // Helper function to render method configuration
  const renderMethodConfig = (method: CrossValidationConfig) => (
    <div className="method-config sm:px-4 md:px-6 lg:px-8">
      <div className="config-grid sm:px-4 md:px-6 lg:px-8">
        <div className="config-item sm:px-4 md:px-6 lg:px-8">
          <span>Folds:</span>
          <span>{method.folds}</span>
        </div>
        <div className="config-item sm:px-4 md:px-6 lg:px-8">
          <span>Shuffle:</span>
          <span>{method.shuffle ? &apos;Yes&apos; : &apos;No&apos;}</span>
        </div>
        {method.stratifyColumn && (
}
          <div className="config-item sm:px-4 md:px-6 lg:px-8">
            <span>Stratify:</span>
            <span>{method.stratifyColumn}</span>
          </div>
        )}
        {method.groupColumn && (
}
          <div className="config-item sm:px-4 md:px-6 lg:px-8">
            <span>Group By:</span>
            <span>{method.groupColumn}</span>
          </div>
        )}
        {method.timeColumn && (
}
          <div className="config-item sm:px-4 md:px-6 lg:px-8">
            <span>Time Column:</span>
            <span>{method.timeColumn}</span>
          </div>
        )}
      </div>
    </div>
  );

  // Helper function to render fantasy applications
  const renderFantasyApplications = (methodId: string) => {
}
    const applications = {
}
      &apos;k_fold&apos;: {
}
        best: &apos;General model evaluation with balanced datasets&apos;,
        use: &apos;Overall model performance assessment&apos;,
        caution: &apos;May not preserve temporal relationships or player groupings&apos;
      },
      &apos;stratified_k_fold&apos;: {
}
        best: &apos;Imbalanced position distributions (more RBs than QBs)&apos;,
        use: &apos;Ensuring fair representation of all positions&apos;,
        benefit: &apos;Prevents bias toward common positions&apos;
      },
      &apos;time_series_split&apos;: {
}
        best: &apos;Temporal prediction scenarios&apos;,
        use: &apos;Predicting future game performance from historical data&apos;,
        critical: &apos;Prevents future information leakage&apos;
      },
      &apos;group_k_fold&apos;: {
}
        best: &apos;Player-specific generalization&apos;,
        use: &apos;Testing model performance on unseen players&apos;,
        insight: &apos;Reveals if model learns player-specific vs. general patterns&apos;
      },
      &apos;nested_cv&apos;: {
}
        best: &apos;Hyperparameter optimization with unbiased evaluation&apos;,
        use: &apos;Model selection for production deployment&apos;,
        tradeoff: &apos;Most reliable but computationally expensive&apos;

    };

    const app = applications[methodId as keyof typeof applications];
    if (!app) return null;

    return (
      <div className="application-info sm:px-4 md:px-6 lg:px-8">
        <p><strong>Best for:</strong> {app.best}</p>
        <p><strong>Fantasy Use:</strong> {app.use}</p>
        <p><strong>{Object.keys(app)[2]}:</strong> {Object.values(app)[2]}</p>
      </div>
    );
  };
  const runCVExperiment = async () => {
}
    try {
}
    setCvExperimentRunning(true);
    setExperimentProgress(0);

    const selectedMethod = crossValidationMethods.find((m: any) => m.id === selectedCVMethod);
    if (!selectedMethod) return;

    // Simulate experiment progress
    const totalSteps = selectedMethod.folds;
    const foldResults: Array<{
}
      fold: number;
      trainSize: number;
      testSize: number;
      score: number;
      metrics: Record<string, number>;
    
    `cv-method-card ${selectedCVMethod === method.id ? &apos;selected&apos; : &apos;&apos;}`}
            onClick={() => setSelectedCVMethod(method.id)}
          >
            <div className="method-header sm:px-4 md:px-6 lg:px-8">
              <h4>{method.name}</h4>
              {selectedCVMethod === method.id && <span className="selected-badge sm:px-4 md:px-6 lg:px-8">Selected</span>}
            </div>
            
            <div className="method-description sm:px-4 md:px-6 lg:px-8">
              <p>{method.description}</p>
            </div>
            
            <div className="method-formula sm:px-4 md:px-6 lg:px-8">
              <strong>Formula:</strong>
              <div className="formula-display sm:px-4 md:px-6 lg:px-8">{method.formula}</div>
            </div>
            
            {renderMethodConfig(method)}
            
            <div className="method-implementation sm:px-4 md:px-6 lg:px-8">
              <strong>Implementation:</strong>
              <p>{method.implementation}</p>
            </div>
            
            {selectedCVMethod === method.id && (
}
              <div className="method-details sm:px-4 md:px-6 lg:px-8">
                <h6>Fantasy Sports Applications</h6>
                {renderFantasyApplications(method.id)}
                
                <div className="method-visualization sm:px-4 md:px-6 lg:px-8">
                  <h6>Fold Structure Visualization</h6>
                  {renderFoldVisualization(method)}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="cv-comparison-matrix sm:px-4 md:px-6 lg:px-8">
        <h4>📊 Method Comparison Matrix</h4>
        <div className="comparison-table sm:px-4 md:px-6 lg:px-8">
          <div className="table-header sm:px-4 md:px-6 lg:px-8">
            <span>Method</span>
            <span>Complexity</span>
            <span>Reliability</span>
            <span>Efficiency</span>
            <span>Fantasy Fit</span>
          </div>
          {crossValidationMethods.map((method: any) => (
}
            <div key={`comparison-${method.id}`} className="table-row sm:px-4 md:px-6 lg:px-8">
              <span className="method-name sm:px-4 md:px-6 lg:px-8">{method.name}</span>
              <span className="complexity-score sm:px-4 md:px-6 lg:px-8">{getCVComplexityScore(method.id)}</span>
              <span className="reliability-score sm:px-4 md:px-6 lg:px-8">{getCVReliabilityScore(method.id)}</span>
              <span className="efficiency-score sm:px-4 md:px-6 lg:px-8">{getCVEfficiencyScore(method.id)}</span>
              <span className="fantasy-score sm:px-4 md:px-6 lg:px-8">{getCVFantasyScore(method.id)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="cv-experiment sm:px-4 md:px-6 lg:px-8">
        <h4>🧪 Interactive CV Experiment</h4>
        <div className="experiment-controls sm:px-4 md:px-6 lg:px-8">
          <div className="method-selector sm:px-4 md:px-6 lg:px-8">
            <label htmlFor="cv-method-select">Selected Method:</label>
            <select 
              id="cv-method-select"
              value={selectedCVMethod} 
              onChange={(e: any) => setSelectedCVMethod(e.target.value)}
            >
              {crossValidationMethods.map((method: any) => (
}
                <option key={`option-${method.id}`} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            className="experiment-button sm:px-4 md:px-6 lg:px-8"
            onClick={runCVExperiment}
            disabled={cvExperimentRunning}
          >
            {cvExperimentRunning ? &apos;Running Experiment...&apos; : &apos;Run CV Experiment&apos;}
          </button>
        </div>

        {cvExperimentRunning && (
}
          <div className="experiment-progress sm:px-4 md:px-6 lg:px-8">
            <div className="progress-header sm:px-4 md:px-6 lg:px-8">
              <span>Experiment Progress</span>
              <span>{Math.round(experimentProgress)}%</span>
            </div>
            <div className="progress-bar sm:px-4 md:px-6 lg:px-8">
              <div 
                className="progress-fill sm:px-4 md:px-6 lg:px-8" 
                style={{ width: `${experimentProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {cvResults && !cvExperimentRunning && (
}
          <div className="experiment-results sm:px-4 md:px-6 lg:px-8">
            <h5>📈 Experiment Results</h5>
            
            <div className="results-summary sm:px-4 md:px-6 lg:px-8">
              <div className="summary-metrics sm:px-4 md:px-6 lg:px-8">
                <div className="metric-card sm:px-4 md:px-6 lg:px-8">
                  <h6>Mean Score</h6>
                  <div className="metric-value-display sm:px-4 md:px-6 lg:px-8">{cvResults.meanScore.toFixed(4)}</div>
                </div>
                <div className="metric-card sm:px-4 md:px-6 lg:px-8">
                  <h6>Std Deviation</h6>
                  <div className="metric-value-display sm:px-4 md:px-6 lg:px-8">{cvResults.stdScore.toFixed(4)}</div>
                </div>
                <div className="metric-card sm:px-4 md:px-6 lg:px-8">
                  <h6>95% CI</h6>
                  <div className="metric-value-display sm:px-4 md:px-6 lg:px-8">
                    [{cvResults.confidenceInterval[0].toFixed(3)}, {cvResults.confidenceInterval[1].toFixed(3)}]
                  </div>
                </div>
                <div className="metric-card sm:px-4 md:px-6 lg:px-8">
                  <h6>Total Time</h6>
                  <div className="metric-value-display sm:px-4 md:px-6 lg:px-8">{cvResults.trainingTime.toFixed(1)}s</div>
                </div>
              </div>
              
              <div className="fold-results sm:px-4 md:px-6 lg:px-8">
                <h6>Individual Fold Results</h6>
                <div className="fold-results-table sm:px-4 md:px-6 lg:px-8">
                  <div className="fold-header sm:px-4 md:px-6 lg:px-8">
                    <span>Fold</span>
                    <span>Score</span>
                    <span>Train Size</span>
                    <span>Test Size</span>
                    <span>MAE</span>
                    <span>RMSE</span>
                  </div>
                  {cvResults.details.map((fold: any) => (
}
                    <div key={`fold-result-${fold.fold}`} className="fold-results-row sm:px-4 md:px-6 lg:px-8">
                      <span>{fold.fold}</span>
                      <span>{fold.score.toFixed(3)}</span>
                      <span>{fold.trainSize.toLocaleString()}</span>
                      <span>{fold.testSize.toLocaleString()}</span>
                      <span>{fold.metrics.mae.toFixed(2)}</span>
                      <span>{fold.metrics.rmse.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="cv-best-practices sm:px-4 md:px-6 lg:px-8">
        <h4>💡 Best Practices for Fantasy Sports CV</h4>
        <div className="practices-grid sm:px-4 md:px-6 lg:px-8">
          <div className="practice-card sm:px-4 md:px-6 lg:px-8">
            <h5>🕐 Temporal Awareness</h5>
            <p>
              Always use time-aware validation for fantasy sports. Historical data should never 
              be used to predict the past. Time series splits are essential for realistic evaluation.
            </p>
          </div>
          <div className="practice-card sm:px-4 md:px-6 lg:px-8">
            <h5>👤 Player Grouping</h5>
            <p>
              Group by player_id to test generalization to new players. This reveals whether 
              your model learns player-specific patterns or truly generalizable features.
            </p>
          </div>
          <div className="practice-card sm:px-4 md:px-6 lg:px-8">
            <h5>🎯 Position Stratification</h5>
            <p>
              Stratify by position to ensure balanced representation. Fantasy football has 
              different position distributions that affect model evaluation fairness.
            </p>
          </div>
          <div className="practice-card sm:px-4 md:px-6 lg:px-8">
            <h5>📏 Sufficient Folds</h5>
            <p>
              Use 5-10 folds for robust estimates. More folds reduce variance but increase 
              computational cost. Balance based on dataset size and available compute.
            </p>
          </div>
          <div className="practice-card sm:px-4 md:px-6 lg:px-8">
            <h5>🔁 Nested Validation</h5>
            <p>
              Use nested CV for hyperparameter tuning. This prevents optimistic bias from 
              hyperparameter selection and provides unbiased performance estimates.
            </p>
          </div>
          <div className="practice-card sm:px-4 md:px-6 lg:px-8">
            <h5>📊 Multiple Metrics</h5>
            <p>
              Evaluate multiple metrics (MAE, RMSE, R², fantasy-specific). Different metrics 
              reveal different aspects of model performance and reliability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHoldout = () => (
    <div className="validation-content sm:px-4 md:px-6 lg:px-8">
      <div className="section-header sm:px-4 md:px-6 lg:px-8">
        <h3>🎯 Holdout Validation Methods</h3>
        <p>
          Holdout validation splits data into separate training and testing sets, 
          providing a realistic estimate of model performance on unseen data.
        </p>
      </div>

      <div className="methods-grid sm:px-4 md:px-6 lg:px-8">
        {holdoutMethods.map((method: any) => (
}
          <div 
            key={method.id} 
            className={`method-card ${selectedHoldoutMethod === method.id ? &apos;selected&apos; : &apos;&apos;}`}
            onClick={() => setSelectedHoldoutMethod(method.id)}
          >
            <div className="method-header sm:px-4 md:px-6 lg:px-8">
              <span className="method-icon sm:px-4 md:px-6 lg:px-8">{method.icon}</span>
              <h4>{method.name}</h4>
            </div>
            <p className="method-description sm:px-4 md:px-6 lg:px-8">{method.description}</p>
            
            <div className="method-details sm:px-4 md:px-6 lg:px-8">
              <div className="split-info sm:px-4 md:px-6 lg:px-8">
                <div className="split-ratio sm:px-4 md:px-6 lg:px-8">
                  <span className="split-label sm:px-4 md:px-6 lg:px-8">Train: {(method.trainRatio * 100)}%</span>
                  <span className="split-label sm:px-4 md:px-6 lg:px-8">Test: {(method.testRatio * 100)}%</span>
                  {method.validationRatio && (
}
                    <span className="split-label sm:px-4 md:px-6 lg:px-8">Val: {(method.validationRatio * 100)}%</span>
                  )}
                </div>
              </div>
              
              <div className="method-metrics sm:px-4 md:px-6 lg:px-8">
                <div className="metric-row sm:px-4 md:px-6 lg:px-8">
                  <span className="metric-label sm:px-4 md:px-6 lg:px-8">Simplicity</span>
                  <span className="metric-stars sm:px-4 md:px-6 lg:px-8">{getHoldoutSimplicityScore(method.id)}</span>
                </div>
                <div className="metric-row sm:px-4 md:px-6 lg:px-8">
                  <span className="metric-label sm:px-4 md:px-6 lg:px-8">Reliability</span>
                  <span className="metric-stars sm:px-4 md:px-6 lg:px-8">{getHoldoutReliabilityScore(method.id)}</span>
                </div>
                <div className="metric-row sm:px-4 md:px-6 lg:px-8">
                  <span className="metric-label sm:px-4 md:px-6 lg:px-8">Speed</span>
                  <span className="metric-stars sm:px-4 md:px-6 lg:px-8">{getHoldoutSpeedScore(method.id)}</span>
                </div>
                <div className="metric-row sm:px-4 md:px-6 lg:px-8">
                  <span className="metric-label sm:px-4 md:px-6 lg:px-8">Fantasy Suitability</span>
                  <span className="metric-stars sm:px-4 md:px-6 lg:px-8">{getHoldoutFantasyScore(method.id)}</span>
                </div>
              </div>

              <div className="method-specifics sm:px-4 md:px-6 lg:px-8">
                <div className="specific-detail sm:px-4 md:px-6 lg:px-8">
                  <strong>Data Leakage Risk:</strong> {getHoldoutDataLeakageRisk(method.id)}
                </div>
                <div className="specific-detail sm:px-4 md:px-6 lg:px-8">
                  <strong>Best Use Case:</strong> {getHoldoutBestUseCase(method.id)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="methods-comparison sm:px-4 md:px-6 lg:px-8">
        <h4>📊 Holdout Methods Comparison</h4>
        <div className="comparison-table sm:px-4 md:px-6 lg:px-8">
          <div className="comparison-header sm:px-4 md:px-6 lg:px-8">
            <div className="header-cell sm:px-4 md:px-6 lg:px-8">Method</div>
            <div className="header-cell sm:px-4 md:px-6 lg:px-8">Simplicity</div>
            <div className="header-cell sm:px-4 md:px-6 lg:px-8">Reliability</div>
            <div className="header-cell sm:px-4 md:px-6 lg:px-8">Speed</div>
            <div className="header-cell sm:px-4 md:px-6 lg:px-8">Fantasy Score</div>
            <div className="header-cell sm:px-4 md:px-6 lg:px-8">Split Strategy</div>
          </div>
          {holdoutMethods.map((method: any) => (
}
            <div key={method.id} className="comparison-row sm:px-4 md:px-6 lg:px-8">
              <div className="cell method-name sm:px-4 md:px-6 lg:px-8">{method.name}</div>
              <div className="cell sm:px-4 md:px-6 lg:px-8">{getHoldoutSimplicityScore(method.id)}</div>
              <div className="cell sm:px-4 md:px-6 lg:px-8">{getHoldoutReliabilityScore(method.id)}</div>
              <div className="cell sm:px-4 md:px-6 lg:px-8">{getHoldoutSpeedScore(method.id)}</div>
              <div className="cell sm:px-4 md:px-6 lg:px-8">{getHoldoutFantasyScore(method.id)}</div>
              <div className="cell split-strategy sm:px-4 md:px-6 lg:px-8">
                {(method.trainRatio * 100)}% / {(method.testRatio * 100)}%
                {method.validationRatio && ` / ${(method.validationRatio * 100)}%`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fantasy-applications sm:px-4 md:px-6 lg:px-8">
        <h4>🏈 Fantasy Football Applications</h4>
        <div className="applications-grid sm:px-4 md:px-6 lg:px-8">
          <div className="application-card sm:px-4 md:px-6 lg:px-8">
            <h5>🎯 Simple Holdout</h5>
            <p>Perfect for quick model evaluation when you have abundant data and want fast results.</p>
            <ul>
              <li>Weekly performance prediction</li>
              <li>Quick injury impact assessment</li>
              <li>Rapid roster optimization</li>
            </ul>
          </div>
          
          <div className="application-card sm:px-4 md:px-6 lg:px-8">
            <h5>⚖️ Stratified Holdout</h5>
            <p>Maintains position balance across splits, ensuring fair evaluation for all player types.</p>
            <ul>
              <li>Position-balanced training</li>
              <li>Fair evaluation across roles</li>
              <li>Consistent performance metrics</li>
            </ul>
          </div>
          
          <div className="application-card sm:px-4 md:px-6 lg:px-8">
            <h5>👥 Grouped Holdout</h5>
            <p>Prevents data leakage by keeping related players together in same split.</p>
            <ul>
              <li>Team-based validation</li>
              <li>Player family grouping</li>
              <li>Coaching system integrity</li>
            </ul>
          </div>
          
          <div className="application-card sm:px-4 md:px-6 lg:px-8">
            <h5>📅 Temporal Holdout</h5>
            <p>Uses time-based splits to simulate real-world prediction scenarios.</p>
            <ul>
              <li>Season progression modeling</li>
              <li>Draft pick optimization</li>
              <li>Trade deadline analysis</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="interactive-experiment sm:px-4 md:px-6 lg:px-8">
        <h4>🧪 Holdout Validation Experiment</h4>
        <p>Run a real-time holdout validation experiment with the selected method:</p>
        
        <div className="experiment-controls sm:px-4 md:px-6 lg:px-8">
          <button 
            className="experiment-button sm:px-4 md:px-6 lg:px-8"
            onClick={runHoldoutExperiment}
            disabled={holdoutExperimentRunning}
          >
            {holdoutExperimentRunning ? &apos;Running Experiment...&apos; : &apos;Run Holdout Experiment&apos;}
          </button>
        </div>

        {holdoutExperimentRunning && (
}
          <div className="experiment-progress sm:px-4 md:px-6 lg:px-8">
            <div className="progress-header sm:px-4 md:px-6 lg:px-8">
              <span>Experiment Progress</span>
              <span>{Math.round(holdoutProgress)}%</span>
            </div>
            <div className="progress-bar sm:px-4 md:px-6 lg:px-8">
              <div 
                className="progress-fill sm:px-4 md:px-6 lg:px-8" 
                style={{ width: `${holdoutProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {holdoutResults && (
}
          <div className="experiment-results sm:px-4 md:px-6 lg:px-8">
            <h5>📈 Holdout Validation Results</h5>
            <div className="results-grid sm:px-4 md:px-6 lg:px-8">
              <div className="result-section sm:px-4 md:px-6 lg:px-8">
                <h6>Dataset Splits</h6>
                <div className="split-results sm:px-4 md:px-6 lg:px-8">
                  <div className="split-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Training Set:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{holdoutResults.trainSize.toLocaleString()} samples</span>
                  </div>
                  <div className="split-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Test Set:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{holdoutResults.testSize.toLocaleString()} samples</span>
                  </div>
                  {holdoutResults.validationSize && (
}
                    <div className="split-item sm:px-4 md:px-6 lg:px-8">
                      <span className="label sm:px-4 md:px-6 lg:px-8">Validation Set:</span>
                      <span className="value sm:px-4 md:px-6 lg:px-8">{holdoutResults.validationSize.toLocaleString()} samples</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="result-section sm:px-4 md:px-6 lg:px-8">
                <h6>Performance Scores</h6>
                <div className="score-results sm:px-4 md:px-6 lg:px-8">
                  <div className="score-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Training Score:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{holdoutResults.trainScore.toFixed(4)}</span>
                  </div>
                  <div className="score-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Test Score:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{holdoutResults.testScore.toFixed(4)}</span>
                  </div>
                  {holdoutResults.validationScore && (
}
                    <div className="score-item sm:px-4 md:px-6 lg:px-8">
                      <span className="label sm:px-4 md:px-6 lg:px-8">Validation Score:</span>
                      <span className="value sm:px-4 md:px-6 lg:px-8">{holdoutResults.validationScore.toFixed(4)}</span>
                    </div>
                  )}
                  <div className="score-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Overfitting:</span>
                    <span className={`value ${holdoutResults.overfit > 0.05 ? &apos;warning&apos; : &apos;good&apos;}`}>
                      {holdoutResults.overfit.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="result-section sm:px-4 md:px-6 lg:px-8">
                <h6>Detailed Metrics</h6>
                <div className="metrics-results sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">MAE:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{holdoutResults.metrics.mae.toFixed(2)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">RMSE:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{holdoutResults.metrics.rmse.toFixed(2)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">R²:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{holdoutResults.metrics.r2.toFixed(3)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">MAPE:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{holdoutResults.metrics.mape.toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Fantasy Accuracy:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{(holdoutResults.metrics.fantasyAccuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Ranking Correlation:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{holdoutResults.metrics.rankingCorrelation.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="best-practices sm:px-4 md:px-6 lg:px-8">
        <h4>📋 Holdout Validation Best Practices</h4>
        <div className="practices-grid sm:px-4 md:px-6 lg:px-8">
          <div className="practice-card sm:px-4 md:px-6 lg:px-8">
            <h5>✅ Do</h5>
            <ul>
              <li>Use appropriate split ratios (70/20/10 or 80/20)</li>
              <li>Maintain temporal order for time series data</li>
              <li>Consider stratification for imbalanced datasets</li>
              <li>Validate split representativeness</li>
              <li>Document split methodology</li>
            </ul>
          </div>
          
          <div className="practice-card sm:px-4 md:px-6 lg:px-8">
            <h5>❌ Don&apos;t</h5>
            <ul>
              <li>Use holdout with small datasets (&lt;1000 samples)</li>
              <li>Ignore class imbalance in splits</li>
              <li>Shuffle time series data randomly</li>
              <li>Reuse test set for model selection</li>
              <li>Make splits without considering data dependencies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimeSeries = () => (
    <div className="validation-content sm:px-4 md:px-6 lg:px-8">
      <div className="section-header sm:px-4 md:px-6 lg:px-8">
        <h3>📈 Time Series Validation Methods</h3>
        <p>
          Time series validation ensures models are evaluated using realistic temporal constraints,
          preventing look-ahead bias and simulating real-world prediction scenarios.
        </p>
      </div>

      <div className="methods-grid sm:px-4 md:px-6 lg:px-8">
        {timeSeriesMethods.map((method: any) => (
}
          <div 
            key={method.id} 
            className={`method-card ${selectedTimeSeriesMethod === method.id ? &apos;selected&apos; : &apos;&apos;}`}
            onClick={() => setSelectedTimeSeriesMethod(method.id)}
          >
            <div className="method-header sm:px-4 md:px-6 lg:px-8">
              <span className="method-icon sm:px-4 md:px-6 lg:px-8">{method.icon}</span>
              <h4>{method.name}</h4>
            </div>
            <p className="method-description sm:px-4 md:px-6 lg:px-8">{method.description}</p>
            
            <div className="method-details sm:px-4 md:px-6 lg:px-8">
              <div className="window-info sm:px-4 md:px-6 lg:px-8">
                <div className="window-specs sm:px-4 md:px-6 lg:px-8">
                  <span className="spec-label sm:px-4 md:px-6 lg:px-8">Window: {method.windowSize} weeks</span>
                  <span className="spec-label sm:px-4 md:px-6 lg:px-8">Step: {method.stepSize} week(s)</span>
                  <span className="spec-label sm:px-4 md:px-6 lg:px-8">Min Train: {method.minTrainSize} weeks</span>
                </div>
              </div>
              
              <div className="method-metrics sm:px-4 md:px-6 lg:px-8">
                <div className="metric-row sm:px-4 md:px-6 lg:px-8">
                  <span className="metric-label sm:px-4 md:px-6 lg:px-8">Complexity</span>
                  <span className="metric-stars sm:px-4 md:px-6 lg:px-8">{getTimeSeriesComplexityScore(method.id)}</span>
                </div>
                <div className="metric-row sm:px-4 md:px-6 lg:px-8">
                  <span className="metric-label sm:px-4 md:px-6 lg:px-8">Reliability</span>
                  <span className="metric-stars sm:px-4 md:px-6 lg:px-8">{getTimeSeriesReliabilityScore(method.id)}</span>
                </div>
                <div className="metric-row sm:px-4 md:px-6 lg:px-8">
                  <span className="metric-label sm:px-4 md:px-6 lg:px-8">Efficiency</span>
                  <span className="metric-stars sm:px-4 md:px-6 lg:px-8">{getTimeSeriesEfficiencyScore(method.id)}</span>
                </div>
                <div className="metric-row sm:px-4 md:px-6 lg:px-8">
                  <span className="metric-label sm:px-4 md:px-6 lg:px-8">Fantasy Suitability</span>
                  <span className="metric-stars sm:px-4 md:px-6 lg:px-8">{getTimeSeriesFantasyScore(method.id)}</span>
                </div>
              </div>

              <div className="method-specifics sm:px-4 md:px-6 lg:px-8">
                <div className="specific-detail sm:px-4 md:px-6 lg:px-8">
                  <strong>Data Usage:</strong> {getTimeSeriesDataUsage(method.id)}
                </div>
                <div className="specific-detail sm:px-4 md:px-6 lg:px-8">
                  <strong>Best Use Case:</strong> {getTimeSeriesBestUseCase(method.id)}
                </div>
              </div>

              <div className="advantages-disadvantages sm:px-4 md:px-6 lg:px-8">
                <div className="advantages sm:px-4 md:px-6 lg:px-8">
                  <h6>✅ Advantages</h6>
                  <ul>
                    {method.advantages.map((advantage, advIndex) => (
}
                      <li key={`advantage-${method.id}-${advIndex}`}>{advantage}</li>
                    ))}
                  </ul>
                </div>
                <div className="disadvantages sm:px-4 md:px-6 lg:px-8">
                  <h6>⚠️ Disadvantages</h6>
                  <ul>
                    {method.disadvantages.map((disadvantage, disIndex) => (
}
                      <li key={`disadvantage-${method.id}-${disIndex}`}>{disadvantage}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="methods-comparison sm:px-4 md:px-6 lg:px-8">
        <h4>📊 Time Series Methods Comparison</h4>
        <div className="comparison-table sm:px-4 md:px-6 lg:px-8">
          <div className="comparison-header sm:px-4 md:px-6 lg:px-8">
            <div className="header-cell sm:px-4 md:px-6 lg:px-8">Method</div>
            <div className="header-cell sm:px-4 md:px-6 lg:px-8">Complexity</div>
            <div className="header-cell sm:px-4 md:px-6 lg:px-8">Reliability</div>
            <div className="header-cell sm:px-4 md:px-6 lg:px-8">Efficiency</div>
            <div className="header-cell sm:px-4 md:px-6 lg:px-8">Fantasy Score</div>
            <div className="header-cell sm:px-4 md:px-6 lg:px-8">Window/Step</div>
          </div>
          {timeSeriesMethods.map((method: any) => (
}
            <div key={method.id} className="comparison-row sm:px-4 md:px-6 lg:px-8">
              <div className="cell method-name sm:px-4 md:px-6 lg:px-8">{method.name}</div>
              <div className="cell sm:px-4 md:px-6 lg:px-8">{getTimeSeriesComplexityScore(method.id)}</div>
              <div className="cell sm:px-4 md:px-6 lg:px-8">{getTimeSeriesReliabilityScore(method.id)}</div>
              <div className="cell sm:px-4 md:px-6 lg:px-8">{getTimeSeriesEfficiencyScore(method.id)}</div>
              <div className="cell sm:px-4 md:px-6 lg:px-8">{getTimeSeriesFantasyScore(method.id)}</div>
              <div className="cell window-step sm:px-4 md:px-6 lg:px-8">
                {method.windowSize}w / {method.stepSize}w
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fantasy-applications sm:px-4 md:px-6 lg:px-8">
        <h4>🏈 Fantasy Football Time Series Applications</h4>
        <div className="applications-grid sm:px-4 md:px-6 lg:px-8">
          <div className="application-card sm:px-4 md:px-6 lg:px-8">
            <h5>🚶 Walk-Forward Validation</h5>
            <p>Perfect for simulating live season progression and weekly prediction accuracy.</p>
            <ul>
              <li>Week-by-week prediction testing</li>
              <li>Season progression modeling</li>
              <li>Live prediction simulation</li>
              <li>Performance trend analysis</li>
            </ul>
          </div>
          
          <div className="application-card sm:px-4 md:px-6 lg:px-8">
            <h5>📈 Expanding Window</h5>
            <p>Ideal for career analysis and long-term trend identification using all historical data.</p>
            <ul>
              <li>Career trajectory modeling</li>
              <li>Multi-season trend analysis</li>
              <li>Player development patterns</li>
              <li>Historical performance evaluation</li>
            </ul>
          </div>
          
          <div className="application-card sm:px-4 md:px-6 lg:px-8">
            <h5>🎡 Rolling Window</h5>
            <p>Excellent for recent form analysis and injury recovery pattern detection.</p>
            <ul>
              <li>Recent form validation</li>
              <li>Injury recovery patterns</li>
              <li>Short-term consistency checks</li>
              <li>Roster decision support</li>
            </ul>
          </div>
          
          <div className="application-card sm:px-4 md:px-6 lg:px-8">
            <h5>🧱 Blocked Time Series</h5>
            <p>Best for independent season validation and draft class analysis.</p>
            <ul>
              <li>Season-to-season validation</li>
              <li>Draft class analysis</li>
              <li>Independent period testing</li>
              <li>Multi-year comparisons</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="interactive-experiment sm:px-4 md:px-6 lg:px-8">
        <h4>🧪 Time Series Validation Experiment</h4>
        <p>Run a real-time time series validation experiment with the selected method:</p>
        
        <div className="experiment-controls sm:px-4 md:px-6 lg:px-8">
          <button 
            className="experiment-button sm:px-4 md:px-6 lg:px-8"
            onClick={runTimeSeriesExperiment}
            disabled={timeSeriesExperimentRunning}
          >
            {timeSeriesExperimentRunning ? &apos;Running Experiment...&apos; : &apos;Run Time Series Experiment&apos;}
          </button>
        </div>

        {timeSeriesExperimentRunning && (
}
          <div className="experiment-progress sm:px-4 md:px-6 lg:px-8">
            <div className="progress-header sm:px-4 md:px-6 lg:px-8">
              <span>Experiment Progress</span>
              <span>{Math.round(timeSeriesProgress)}%</span>
            </div>
            <div className="progress-bar sm:px-4 md:px-6 lg:px-8">
              <div 
                className="progress-fill sm:px-4 md:px-6 lg:px-8" 
                style={{ width: `${timeSeriesProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {timeSeriesResults && (
}
          <div className="experiment-results sm:px-4 md:px-6 lg:px-8">
            <h5>📈 Time Series Validation Results</h5>
            <div className="results-grid sm:px-4 md:px-6 lg:px-8">
              <div className="result-section sm:px-4 md:px-6 lg:px-8">
                <h6>Validation Overview</h6>
                <div className="overview-results sm:px-4 md:px-6 lg:px-8">
                  <div className="overview-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Method:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{timeSeriesResults.method}</span>
                  </div>
                  <div className="overview-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Total Splits:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{timeSeriesResults.totalSplits}</span>
                  </div>
                  <div className="overview-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Avg Train Size:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{timeSeriesResults.trainSize} weeks</span>
                  </div>
                  <div className="overview-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Test Size:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{timeSeriesResults.testSize} week</span>
                  </div>
                </div>
              </div>

              <div className="result-section sm:px-4 md:px-6 lg:px-8">
                <h6>Performance Scores</h6>
                <div className="score-results sm:px-4 md:px-6 lg:px-8">
                  <div className="score-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Avg Training Score:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{timeSeriesResults.avgTrainScore.toFixed(4)}</span>
                  </div>
                  <div className="score-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Avg Test Score:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{timeSeriesResults.avgTestScore.toFixed(4)}</span>
                  </div>
                  <div className="score-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Score Stability:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{(timeSeriesResults.scoreStability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="score-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Temporal Consistency:</span>
                    <span className={`value ${timeSeriesResults.temporalConsistency > 0.8 ? &apos;good&apos; : &apos;warning&apos;}`}>
                      {(timeSeriesResults.temporalConsistency * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="result-section sm:px-4 md:px-6 lg:px-8">
                <h6>Detailed Metrics</h6>
                <div className="metrics-results sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">MAE:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{timeSeriesResults.metrics.mae.toFixed(2)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">RMSE:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{timeSeriesResults.metrics.rmse.toFixed(2)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">R²:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{timeSeriesResults.metrics.r2.toFixed(3)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">MAPE:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{timeSeriesResults.metrics.mape.toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Fantasy Accuracy:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{(timeSeriesResults.metrics.fantasyAccuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Temporal Stability:</span>
                    <span className="value sm:px-4 md:px-6 lg:px-8">{(timeSeriesResults.metrics.temporalStability * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="splits-breakdown sm:px-4 md:px-6 lg:px-8">
              <h6>📋 Individual Splits Performance</h6>
              <div className="splits-table sm:px-4 md:px-6 lg:px-8">
                <div className="splits-header sm:px-4 md:px-6 lg:px-8">
                  <span>Split</span>
                  <span>Train Period</span>
                  <span>Test Period</span>
                  <span>Train Score</span>
                  <span>Test Score</span>
                  <span>Difference</span>
                </div>
                {timeSeriesResults.splits.slice(0, 8).map((split: any) => (
}
                  <div key={`split-${split.splitIndex}`} className="splits-row sm:px-4 md:px-6 lg:px-8">
                    <span>{split.splitIndex + 1}</span>
                    <span>{split.trainPeriod}</span>
                    <span>{split.testPeriod}</span>
                    <span>{split.trainScore.toFixed(3)}</span>
                    <span>{split.testScore.toFixed(3)}</span>
                    <span className={split.trainScore - split.testScore > 0.05 ? &apos;warning&apos; : &apos;good&apos;}>
                      {(split.trainScore - split.testScore).toFixed(3)}
                    </span>
                  </div>
                ))}
                {timeSeriesResults.splits.length > 8 && (
}
                  <div className="splits-row summary sm:px-4 md:px-6 lg:px-8">
                    <div className="text-center text-gray-400 sm:px-4 md:px-6 lg:px-8">... and {timeSeriesResults.splits.length - 8} more splits</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="best-practices sm:px-4 md:px-6 lg:px-8">
        <h4>📋 Time Series Validation Best Practices</h4>
        <div className="practices-grid sm:px-4 md:px-6 lg:px-8">
          <div className="practice-card sm:px-4 md:px-6 lg:px-8">
            <h5>✅ Do</h5>
            <ul>
              <li>Maintain strict temporal order in all splits</li>
              <li>Use appropriate window sizes for your data frequency</li>
              <li>Include gaps between train/test to prevent leakage</li>
              <li>Validate method choice based on prediction horizon</li>
              <li>Monitor score stability across time periods</li>
            </ul>
          </div>
          
          <div className="practice-card sm:px-4 md:px-6 lg:px-8">
            <h5>❌ Don&apos;t</h5>
            <ul>
              <li>Shuffle time series data randomly</li>
              <li>Use future information in training sets</li>
              <li>Ignore seasonality and trends in validation</li>
              <li>Use too small windows for stable estimates</li>
              <li>Overlook temporal dependencies in features</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="temporal-insights sm:px-4 md:px-6 lg:px-8">
        <h4>⏰ Key Temporal Insights for Fantasy Football</h4>
        <div className="insights-grid sm:px-4 md:px-6 lg:px-8">
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h5>Season Progression</h5>
            <p>
              Player performance often changes throughout the season due to fatigue, injuries, 
              and game script evolution. Time series validation captures these temporal effects.
            </p>
          </div>
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h5>Weekly Dependencies</h5>
            <p>
              Fantasy performance can have week-to-week dependencies due to matchup difficulty, 
              weather conditions, and team strategy adaptations.
            </p>
          </div>
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h5>Look-Ahead Bias</h5>
            <p>
              Traditional validation can accidentally use future information. Time series validation 
              prevents this by enforcing realistic prediction scenarios.
            </p>
          </div>
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h5>Concept Drift</h5>
            <p>
              Fantasy football strategies and player roles evolve over time. Rolling windows 
              help detect when models need retraining due to changing patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBootstrap = () => (
    <div className="bootstrap-section sm:px-4 md:px-6 lg:px-8">
      <h3>🎲 Bootstrap Resampling Methods</h3>
      <div className="bootstrap-intro sm:px-4 md:px-6 lg:px-8">
        <p>
          Bootstrap resampling provides uncertainty quantification by creating multiple datasets through 
          resampling, enabling robust confidence interval estimation and model stability assessment.
        </p>
      </div>

      <div className="bootstrap-methods-grid sm:px-4 md:px-6 lg:px-8">
        <h4>Available Bootstrap Methods</h4>
        <div className="methods-container sm:px-4 md:px-6 lg:px-8">
          {bootstrapMethods.map((method: any) => (
}
            <div 
              key={method.id} 
              className={`method-card ${selectedBootstrapMethod === method.id ? &apos;selected&apos; : &apos;&apos;}`}
              onClick={() => setSelectedBootstrapMethod(method.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e: any) => e.key === &apos;Enter&apos; && setSelectedBootstrapMethod(method.id)}
              aria-label={`Select ${method.name} bootstrap method`}
            >
              <div className="method-header sm:px-4 md:px-6 lg:px-8">
                <span className="method-icon sm:px-4 md:px-6 lg:px-8">{method.icon}</span>
                <h5>{method.name}</h5>
              </div>
              
              <p className="method-description sm:px-4 md:px-6 lg:px-8">{method.description}</p>
              
              <div className="method-details sm:px-4 md:px-6 lg:px-8">
                <div className="detail-item sm:px-4 md:px-6 lg:px-8">
                  <strong>Type:</strong>
                  <span>{method.type}</span>
                </div>
                <div className="detail-item sm:px-4 md:px-6 lg:px-8">
                  <strong>Bootstraps:</strong>
                  <span>{method.nBootstraps.toLocaleString()}</span>
                </div>
                <div className="detail-item sm:px-4 md:px-6 lg:px-8">
                  <strong>Replacement:</strong>
                  <span>{method.replacement ? &apos;Yes&apos; : &apos;No&apos;}</span>
                </div>
                <div className="detail-item sm:px-4 md:px-6 lg:px-8">
                  <strong>Confidence Level:</strong>
                  <span>{(method.confidenceLevel * 100)}%</span>
                </div>
                {method.blockSize && (
}
                  <div className="detail-item sm:px-4 md:px-6 lg:px-8">
                    <strong>Block Size:</strong>
                    <span>{method.blockSize}</span>
                  </div>
                )}
                {method.stratifyColumn && (
}
                  <div className="detail-item sm:px-4 md:px-6 lg:px-8">
                    <strong>Stratify by:</strong>
                    <span>{method.stratifyColumn}</span>
                  </div>
                )}
              </div>

              <div className="method-analysis sm:px-4 md:px-6 lg:px-8">
                <div className="advantages sm:px-4 md:px-6 lg:px-8">
                  <h6>✅ Advantages</h6>
                  <ul>
                    {method.advantages.map((advantage, advIndex) => (
}
                      <li key={`advantage-${method.id}-${advIndex}`}>{advantage}</li>
                    ))}
                  </ul>
                </div>
                <div className="disadvantages sm:px-4 md:px-6 lg:px-8">
                  <h6>⚠️ Disadvantages</h6>
                  <ul>
                    {method.disadvantages.map((disadvantage, disIndex) => (
}
                      <li key={`disadvantage-${method.id}-${disIndex}`}>{disadvantage}</li>
                    ))}
                  </ul>
                </div>
                <div className="use-cases sm:px-4 md:px-6 lg:px-8">
                  <h6>🎯 Use Cases</h6>
                  <ul>
                    {method.useCases.map((useCase, useIndex) => (
}
                      <li key={`usecase-${method.id}-${useIndex}`}>{useCase}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="implementation-info sm:px-4 md:px-6 lg:px-8">
                <strong>Implementation:</strong>
                <p>{method.implementation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bootstrap-comparison sm:px-4 md:px-6 lg:px-8">
        <h4>📊 Method Comparison Matrix</h4>
        <div className="comparison-table sm:px-4 md:px-6 lg:px-8">
          <div className="comparison-header sm:px-4 md:px-6 lg:px-8">
            <span>Method</span>
            <span>Complexity</span>
            <span>Reliability</span>
            <span>Efficiency</span>
            <span>Fantasy Score</span>
            <span>Data Usage</span>
            <span>Best Use Case</span>
          </div>
          {bootstrapMethods.map((method: any) => (
}
            <div key={`comparison-${method.id}`} className="comparison-row sm:px-4 md:px-6 lg:px-8">
              <span className="method-name sm:px-4 md:px-6 lg:px-8">{method.name}</span>
              <span className="complexity-score sm:px-4 md:px-6 lg:px-8">
                {getBootstrapComplexityScore(method.id)}
              </span>
              <span className="reliability-score sm:px-4 md:px-6 lg:px-8">
                {getBootstrapReliabilityScore(method.id)}
              </span>
              <span className="efficiency-score sm:px-4 md:px-6 lg:px-8">
                {getBootstrapEfficiencyScore(method.id)}
              </span>
              <span className="fantasy-score sm:px-4 md:px-6 lg:px-8">
                {getBootstrapFantasyScore(method.id)}
              </span>
              <span className="data-usage sm:px-4 md:px-6 lg:px-8">
                {getBootstrapDataUsage(method.id)}
              </span>
              <span className="best-use-case sm:px-4 md:px-6 lg:px-8">
                {getBootstrapBestUseCase(method.id)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bootstrap-experiment sm:px-4 md:px-6 lg:px-8">
        <h4>🧪 Interactive Bootstrap Experiment</h4>
        <div className="experiment-controls sm:px-4 md:px-6 lg:px-8">
          <button 
            className="experiment-button sm:px-4 md:px-6 lg:px-8"
            onClick={runBootstrapExperiment}
            disabled={bootstrapExperimentRunning}
            aria-label="Run bootstrap resampling experiment"
          >
            {bootstrapExperimentRunning ? &apos;Running Experiment...&apos; : &apos;Run Bootstrap Experiment&apos;}
          </button>
        </div>

        {bootstrapExperimentRunning && (
}
          <div className="experiment-progress sm:px-4 md:px-6 lg:px-8">
            <div className="progress-header sm:px-4 md:px-6 lg:px-8">
              <span>Experiment Progress</span>
              <span>{bootstrapProgress.toFixed(0)}%</span>
            </div>
            <div className="progress-bar sm:px-4 md:px-6 lg:px-8">
              <div 
                className="progress-fill sm:px-4 md:px-6 lg:px-8" 
                style={{ width: `${bootstrapProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {bootstrapResults && (
}
          <div className="experiment-results sm:px-4 md:px-6 lg:px-8">
            <h5>📈 Bootstrap Resampling Results</h5>
            
            <div className="results-overview sm:px-4 md:px-6 lg:px-8">
              <div className="result-card sm:px-4 md:px-6 lg:px-8">
                <h6>Method Used</h6>
                <div className="result-value sm:px-4 md:px-6 lg:px-8">{bootstrapResults.method}</div>
              </div>
              <div className="result-card sm:px-4 md:px-6 lg:px-8">
                <h6>Bootstrap Samples</h6>
                <div className="result-value sm:px-4 md:px-6 lg:px-8">{bootstrapResults.nBootstraps.toLocaleString()}</div>
              </div>
              <div className="result-card sm:px-4 md:px-6 lg:px-8">
                <h6>Average Score</h6>
                <div className="result-value sm:px-4 md:px-6 lg:px-8">{bootstrapResults.avgScore.toFixed(4)}</div>
              </div>
              <div className="result-card sm:px-4 md:px-6 lg:px-8">
                <h6>Std Deviation</h6>
                <div className="result-value sm:px-4 md:px-6 lg:px-8">{bootstrapResults.statistics.std.toFixed(4)}</div>
              </div>
              <div className="result-card sm:px-4 md:px-6 lg:px-8">
                <h6>Confidence Interval</h6>
                <div className="result-value sm:px-4 md:px-6 lg:px-8">
                  [{bootstrapResults.confidenceInterval.lower.toFixed(3)}, {bootstrapResults.confidenceInterval.upper.toFixed(3)}]
                </div>
              </div>
              <div className="result-card sm:px-4 md:px-6 lg:px-8">
                <h6>Stability Index</h6>
                <div className="result-value sm:px-4 md:px-6 lg:px-8">{bootstrapResults.metrics.stabilityIndex.toFixed(3)}</div>
              </div>
            </div>

            <div className="detailed-statistics sm:px-4 md:px-6 lg:px-8">
              <h6>📊 Detailed Statistics</h6>
              <div className="stats-grid sm:px-4 md:px-6 lg:px-8">
                <div className="stat-item sm:px-4 md:px-6 lg:px-8">
                  <span>Mean:</span>
                  <span>{bootstrapResults.statistics.mean.toFixed(4)}</span>
                </div>
                <div className="stat-item sm:px-4 md:px-6 lg:px-8">
                  <span>Median:</span>
                  <span>{bootstrapResults.statistics.median.toFixed(4)}</span>
                </div>
                <div className="stat-item sm:px-4 md:px-6 lg:px-8">
                  <span>Q25:</span>
                  <span>{bootstrapResults.statistics.q25.toFixed(4)}</span>
                </div>
                <div className="stat-item sm:px-4 md:px-6 lg:px-8">
                  <span>Q75:</span>
                  <span>{bootstrapResults.statistics.q75.toFixed(4)}</span>
                </div>
                <div className="stat-item sm:px-4 md:px-6 lg:px-8">
                  <span>Variance:</span>
                  <span>{bootstrapResults.statistics.variance.toFixed(6)}</span>
                </div>
                <div className="stat-item sm:px-4 md:px-6 lg:px-8">
                  <span>Skewness:</span>
                  <span>{bootstrapResults.statistics.skewness.toFixed(3)}</span>
                </div>
                <div className="stat-item sm:px-4 md:px-6 lg:px-8">
                  <span>Kurtosis:</span>
                  <span>{bootstrapResults.statistics.kurtosis.toFixed(3)}</span>
                </div>
                <div className="stat-item sm:px-4 md:px-6 lg:px-8">
                  <span>Replacement Ratio:</span>
                  <span>{bootstrapResults.replacementRatio.toFixed(1)}</span>
                </div>
              </div>
            </div>

            <div className="bootstrap-metrics sm:px-4 md:px-6 lg:px-8">
              <h6>🎯 Fantasy Football Metrics</h6>
              <div className="metrics-grid sm:px-4 md:px-6 lg:px-8">
                <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                  <span>MAE:</span>
                  <span>{bootstrapResults.metrics.mae.toFixed(3)}</span>
                </div>
                <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                  <span>RMSE:</span>
                  <span>{bootstrapResults.metrics.rmse.toFixed(3)}</span>
                </div>
                <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                  <span>R² Score:</span>
                  <span>{bootstrapResults.metrics.r2.toFixed(3)}</span>
                </div>
                <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                  <span>MAPE:</span>
                  <span>{bootstrapResults.metrics.mape.toFixed(1)}%</span>
                </div>
                <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                  <span>Fantasy Accuracy:</span>
                  <span>{(bootstrapResults.metrics.fantasyAccuracy * 100).toFixed(1)}%</span>
                </div>
                <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                  <span>Diversity Score:</span>
                  <span>{bootstrapResults.metrics.diversityScore.toFixed(3)}</span>
                </div>
                <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                  <span>Robustness:</span>
                  <span>{bootstrapResults.metrics.robustnessMetric.toFixed(3)}</span>
                </div>
              </div>
            </div>

            <div className="convergence-analysis sm:px-4 md:px-6 lg:px-8">
              <h6>🔄 Convergence Analysis</h6>
              <div className="convergence-info sm:px-4 md:px-6 lg:px-8">
                <div className="convergence-status sm:px-4 md:px-6 lg:px-8">
                  <strong>Converged:</strong>
                  <span className={`status ${bootstrapResults.convergence.converged ? &apos;success&apos; : &apos;warning&apos;}`}>
                    {bootstrapResults.convergence.converged ? &apos;✅ Yes&apos; : &apos;⚠️ No&apos;}
                  </span>
                </div>
                <div className="convergence-details sm:px-4 md:px-6 lg:px-8">
                  <div className="detail-row sm:px-4 md:px-6 lg:px-8">
                    <span>Required Samples:</span>
                    <span>{bootstrapResults.convergence.requiredSamples.toLocaleString()}</span>
                  </div>
                  <div className="detail-row sm:px-4 md:px-6 lg:px-8">
                    <span>Stability Threshold:</span>
                    <span>{bootstrapResults.convergence.stabilityThreshold}</span>
                  </div>
                  <div className="detail-row sm:px-4 md:px-6 lg:px-8">
                    <span>Final Variance:</span>
                    <span>{bootstrapResults.convergence.finalVariance.toFixed(6)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bootstrap-distribution sm:px-4 md:px-6 lg:px-8">
              <h6>📈 Score Distribution Analysis</h6>
              <div className="distribution-info sm:px-4 md:px-6 lg:px-8">
                <p>
                  Bootstrap samples generated {bootstrapResults.nBootstraps.toLocaleString()} resampled datasets
                  with scores ranging from {Math.min(...bootstrapResults.bootstrapScores).toFixed(3)} to{&apos; &apos;}
                  {Math.max(...bootstrapResults.bootstrapScores).toFixed(3)}.
                </p>
                <div className="distribution-stats sm:px-4 md:px-6 lg:px-8">
                  <div className="dist-item sm:px-4 md:px-6 lg:px-8">
                    <strong>Distribution Shape:</strong>
                    <span>
                      {bootstrapResults.statistics.skewness > 0.5 ? &apos;Right-skewed&apos; : 
}
                       bootstrapResults.statistics.skewness < -0.5 ? &apos;Left-skewed&apos; : &apos;Symmetric&apos;}
                    </span>
                  </div>
                  <div className="dist-item sm:px-4 md:px-6 lg:px-8">
                    <strong>Tail Behavior:</strong>
                    <span>
                      {bootstrapResults.statistics.kurtosis > 1 ? &apos;Heavy-tailed&apos; :
}
                       bootstrapResults.statistics.kurtosis < -1 ? &apos;Light-tailed&apos; : &apos;Normal-tailed&apos;}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bootstrap-best-practices sm:px-4 md:px-6 lg:px-8">
        <h4>💡 Bootstrap Best Practices</h4>
        <div className="practices-grid sm:px-4 md:px-6 lg:px-8">
          <div className="practice-card sm:px-4 md:px-6 lg:px-8">
            <h5>🎯 Method Selection</h5>
            <ul>
              <li>Use basic bootstrap for general uncertainty quantification</li>
              <li>Apply stratified bootstrap for position-balanced sampling</li>
              <li>Choose block bootstrap for time-dependent data patterns</li>
              <li>Consider parametric bootstrap for well-understood distributions</li>
            </ul>
          </div>
          <div className="practice-card sm:px-4 md:px-6 lg:px-8">
            <h5>📊 Sample Size Guidelines</h5>
            <ul>
              <li>Start with 1000 bootstrap samples for initial analysis</li>
              <li>Use 5000+ samples for publication-quality confidence intervals</li>
              <li>Monitor convergence through variance stabilization</li>
              <li>Balance computational cost with precision requirements</li>
            </ul>
          </div>
          <div className="practice-card sm:px-4 md:px-6 lg:px-8">
            <h5>⚖️ Confidence Intervals</h5>
            <ul>
              <li>Use 95% confidence level for standard applications</li>
              <li>Apply bias-corrected intervals for small samples</li>
              <li>Validate interval coverage through cross-validation</li>
              <li>Consider bootstrap-t intervals for better coverage</li>
            </ul>
          </div>
          <div className="practice-card sm:px-4 md:px-6 lg:px-8">
            <h5>🏈 Fantasy Applications</h5>
            <ul>
              <li>Bootstrap player performance projections for uncertainty</li>
              <li>Use block bootstrap for weekly scoring patterns</li>
              <li>Apply stratified bootstrap for position-specific analysis</li>
              <li>Validate ranking stability through resampling</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bootstrap-insights sm:px-4 md:px-6 lg:px-8">
        <h4>🔍 Key Insights</h4>
        <div className="insights-container sm:px-4 md:px-6 lg:px-8">
          <div className="insight-item sm:px-4 md:px-6 lg:px-8">
            <h5>Uncertainty Quantification</h5>
            <p>
              Bootstrap resampling provides robust uncertainty estimates without strong distributional 
              assumptions, making it ideal for fantasy football predictions where data distributions 
              can be complex and non-normal.
            </p>
          </div>
          <div className="insight-item sm:px-4 md:px-6 lg:px-8">
            <h5>Model Stability</h5>
            <p>
              By generating multiple datasets through resampling, bootstrap methods reveal model 
              sensitivity to data variations, helping identify stable prediction strategies 
              for fantasy football applications.
            </p>
          </div>
          <div className="insight-item sm:px-4 md:px-6 lg:px-8">
            <h5>Confidence Intervals</h5>
            <p>
              Bootstrap confidence intervals provide practical bounds for fantasy point predictions, 
              enabling risk assessment and helping fantasy managers make informed decisions 
              about player selections and lineup optimization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalibration = () => (
    <div className="calibration-section sm:px-4 md:px-6 lg:px-8">
      <h3>⚖️ Probability Calibration Methods</h3>
      <p className="section-description sm:px-4 md:px-6 lg:px-8">
        Probability calibration ensures that predicted probabilities reflect true likelihood of outcomes. 
        Well-calibrated models provide reliable confidence estimates essential for fantasy football decision-making.
      </p>

      <div className="methods-grid sm:px-4 md:px-6 lg:px-8">
        {calibrationMethods.map((method: any) => (
}
          <div 
            key={method.id} 
            className={`method-card ${selectedCalibrationMethod === method.id ? &apos;selected&apos; : &apos;&apos;}`}
            onClick={() => setSelectedCalibrationMethod(method.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e: any) => {
}
              if (e.key === &apos;Enter&apos; || e.key === &apos; &apos;) {
}
                e.preventDefault();
                setSelectedCalibrationMethod(method.id);

            }}
          >
            <div className="method-header sm:px-4 md:px-6 lg:px-8">
              <span className="method-icon sm:px-4 md:px-6 lg:px-8">{method.icon}</span>
              <h4>{method.name}</h4>
              <span className="method-type sm:px-4 md:px-6 lg:px-8">{method.type}</span>
            </div>
            
            <div className="method-info sm:px-4 md:px-6 lg:px-8">
              <p className="method-description sm:px-4 md:px-6 lg:px-8">{method.description}</p>
              
              <div className="method-details sm:px-4 md:px-6 lg:px-8">
                <div className="detail-row sm:px-4 md:px-6 lg:px-8">
                  <strong>Formula:</strong> <code>{method.formula}</code>
                </div>
                <div className="detail-row sm:px-4 md:px-6 lg:px-8">
                  <strong>Complexity:</strong> {method.complexity}
                </div>
                <div className="detail-row sm:px-4 md:px-6 lg:px-8">
                  <strong>Data Need:</strong> {method.dataRequirement}
                </div>
              </div>

              <div className="performance-grid sm:px-4 md:px-6 lg:px-8">
                <div className="performance-item sm:px-4 md:px-6 lg:px-8">
                  <span className="performance-label sm:px-4 md:px-6 lg:px-8">Complexity</span>
                  <span className="performance-stars sm:px-4 md:px-6 lg:px-8">{getCalibrationComplexityScore(method.id)}</span>
                </div>
                <div className="performance-item sm:px-4 md:px-6 lg:px-8">
                  <span className="performance-label sm:px-4 md:px-6 lg:px-8">Reliability</span>
                  <span className="performance-stars sm:px-4 md:px-6 lg:px-8">{getCalibrationReliabilityScore(method.id)}</span>
                </div>
                <div className="performance-item sm:px-4 md:px-6 lg:px-8">
                  <span className="performance-label sm:px-4 md:px-6 lg:px-8">Efficiency</span>
                  <span className="performance-stars sm:px-4 md:px-6 lg:px-8">{getCalibrationEfficiencyScore(method.id)}</span>
                </div>
                <div className="performance-item sm:px-4 md:px-6 lg:px-8">
                  <span className="performance-label sm:px-4 md:px-6 lg:px-8">Fantasy Use</span>
                  <span className="performance-stars sm:px-4 md:px-6 lg:px-8">{getCalibrationFantasyScore(method.id)}</span>
                </div>
              </div>

              <div className="method-lists sm:px-4 md:px-6 lg:px-8">
                <div className="list-section sm:px-4 md:px-6 lg:px-8">
                  <h6>✅ Advantages</h6>
                  <ul>
                    {method.advantages.map((advantage, index) => (
}
                      <li key={index}>{advantage}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="list-section sm:px-4 md:px-6 lg:px-8">
                  <h6>⚠️ Disadvantages</h6>
                  <ul>
                    {method.disadvantages.map((disadvantage, index) => (
}
                      <li key={index}>{disadvantage}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="list-section sm:px-4 md:px-6 lg:px-8">
                  <h6>🎯 Use Cases</h6>
                  <ul>
                    {method.useCases.map((useCase, index) => (
}
                      <li key={index}>{useCase}</li>
                    ))}
                  </ul>
                </div>

                <div className="list-section sm:px-4 md:px-6 lg:px-8">
                  <h6>🏈 Fantasy Applications</h6>
                  <ul>
                    {method.fantasyApplications.map((application, index) => (
}
                      <li key={index}>{application}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="experiment-section sm:px-4 md:px-6 lg:px-8">
        <div className="experiment-controls sm:px-4 md:px-6 lg:px-8">
          <h4>🧪 Interactive Calibration Experiment</h4>
          <p>
            Run a calibration experiment to see how {calibrationMethods.find((m: any) => m.id === selectedCalibrationMethod)?.name} 
            improves probability reliability. This simulation demonstrates calibration performance on fantasy football predictions.
          </p>
          
          <div className="control-group sm:px-4 md:px-6 lg:px-8">
            <label htmlFor="calibration-method-select">Calibration Method:</label>
            <select 
              id="calibration-method-select"
              value={selectedCalibrationMethod} 
              onChange={(e: any) => setSelectedCalibrationMethod(e.target.value)}
            >
              {calibrationMethods.map((method: any) => (
}
                <option key={method.id} value={method.id}>
                  {method.icon} {method.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={runCalibrationExperiment}
            disabled={calibrationExperimentRunning}
            className="experiment-button sm:px-4 md:px-6 lg:px-8"
            aria-label="Run calibration experiment"
          >
            {calibrationExperimentRunning ? &apos;🔄 Running Calibration...&apos; : &apos;🚀 Run Calibration Experiment&apos;}
          </button>

          {calibrationExperimentRunning && (
}
            <div className="progress-container sm:px-4 md:px-6 lg:px-8">
              <div className="progress-bar sm:px-4 md:px-6 lg:px-8">
                <div 
                  className="progress-fill sm:px-4 md:px-6 lg:px-8" 
                  style={{ width: `${calibrationProgress}%` }}
                ></div>
              </div>
              <span className="progress-text sm:px-4 md:px-6 lg:px-8">{calibrationProgress.toFixed(1)}% Complete</span>
            </div>
          )}
        </div>

        {calibrationResults && (
}
          <div className="results-container sm:px-4 md:px-6 lg:px-8">
            <h5>⚖️ Calibration Results</h5>
            
            <div className="results-summary sm:px-4 md:px-6 lg:px-8">
              <div className="summary-card sm:px-4 md:px-6 lg:px-8">
                <h6>Method Overview</h6>
                <div className="metric-grid sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Method</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{calibrationResults.method}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Type</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{calibrationResults.methodType}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Samples</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{calibrationResults.parameters.nSamples}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Preserves Ranking</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">
                      {calibrationResults.parameters.preservesRanking ? &apos;✅ Yes&apos; : &apos;❌ No&apos;}
                    </span>
                  </div>
                </div>
              </div>

              <div className="summary-card sm:px-4 md:px-6 lg:px-8">
                <h6>Calibration Improvement</h6>
                <div className="metric-grid sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Original Brier Score</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{calibrationResults.originalBrierScore.toFixed(4)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Calibrated Brier Score</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{calibrationResults.calibratedBrierScore.toFixed(4)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Brier Improvement</span>
                    <span className="metric-value improvement sm:px-4 md:px-6 lg:px-8">
                      {(calibrationResults.brierImprovement * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Calibration Error</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">
                      {calibrationResults.calibrationMetrics.calibrationError.toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="summary-card sm:px-4 md:px-6 lg:px-8">
                <h6>Performance Metrics</h6>
                <div className="metric-grid sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Accuracy</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(calibrationResults.performanceMetrics.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Precision</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(calibrationResults.performanceMetrics.precision * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Recall</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(calibrationResults.performanceMetrics.recall * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">F1 Score</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(calibrationResults.performanceMetrics.f1Score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">AUC</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{calibrationResults.performanceMetrics.auc.toFixed(3)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Fantasy Accuracy</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(calibrationResults.performanceMetrics.fantasyAccuracy * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="reliability-diagram sm:px-4 md:px-6 lg:px-8">
              <h6>📊 Reliability Diagram</h6>
              <p>
                This diagram shows how well calibrated the predictions are. Points closer to the diagonal 
                line indicate better calibration, where predicted probabilities match actual frequencies.
              </p>
              
              <div className="diagram-container sm:px-4 md:px-6 lg:px-8">
                <table className="reliability-table sm:px-4 md:px-6 lg:px-8">
                  <thead>
                    <tr>
                      <th>Bin Range</th>
                      <th>Count</th>
                      <th>Mean Prediction</th>
                      <th>Actual Rate</th>
                      <th>Calibration Error</th>
                      <th>Reliability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calibrationResults.calibrationCurve.meanPredicted.map((meanPred, index) => {
}
                      const binStart = index / calibrationResults.calibrationCurve.meanPredicted.length;
                      const binEnd = (index + 1) / calibrationResults.calibrationCurve.meanPredicted.length;
                      const actualRate = calibrationResults.calibrationCurve.fractionPositives[index];
                      const count = calibrationResults.calibrationCurve.binCounts[index];
                      const error = Math.abs(meanPred - actualRate);
                      
                      return (
                        <tr key={index} className={error < 0.05 ? &apos;well-calibrated&apos; : error > 0.15 ? &apos;poorly-calibrated&apos; : &apos;&apos;}>
                          <td>{(binStart * 100).toFixed(0)}-{(binEnd * 100).toFixed(0)}%</td>
                          <td>{count}</td>
                          <td>{(meanPred * 100).toFixed(1)}%</td>
                          <td>{(actualRate * 100).toFixed(1)}%</td>
                          <td>{(error * 100).toFixed(1)}%</td>
                          <td>
                            {error < 0.05 ? &apos;🟢 Excellent&apos; : 
}
                             error < 0.1 ? &apos;🟡 Good&apos; : 
                             error < 0.15 ? &apos;🟠 Fair&apos; : &apos;🔴 Poor&apos;}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="calibration-insights sm:px-4 md:px-6 lg:px-8">
              <h6>🎯 Calibration Insights</h6>
              <div className="insights-grid sm:px-4 md:px-6 lg:px-8">
                <div className="insight-item sm:px-4 md:px-6 lg:px-8">
                  <h6>Reliability Assessment</h6>
                  <p>
                    The {calibrationResults.method} method achieved a calibration error of{&apos; &apos;}
                    {(calibrationResults.calibrationMetrics.calibrationError * 100).toFixed(2)}%, indicating{&apos; &apos;}
                    {calibrationResults.calibrationMetrics.calibrationError < 0.05 ? &apos;excellent&apos; :
}
                     calibrationResults.calibrationMetrics.calibrationError < 0.1 ? &apos;good&apos; :
                     calibrationResults.calibrationMetrics.calibrationError < 0.15 ? &apos;moderate&apos; : &apos;poor&apos;} calibration.
                  </p>
                </div>
                <div className="insight-item sm:px-4 md:px-6 lg:px-8">
                  <h6>Ranking Preservation</h6>
                  <p>
                    This method {calibrationResults.parameters.preservesRanking ? &apos;preserves&apos; : &apos;does not preserve&apos;} the 
                    original ranking of predictions, which is{&apos; &apos;}
                    {calibrationResults.parameters.preservesRanking ? &apos;ideal&apos; : &apos;potentially problematic&apos;} for 
                    fantasy football player rankings and draft strategies.
                  </p>
                </div>
                <div className="insight-item sm:px-4 md:px-6 lg:px-8">
                  <h6>Fantasy Football Application</h6>
                  <p>
                    For fantasy football, this calibration approach provides{&apos; &apos;}
                    {calibrationResults.calibrationMetrics.reliability > 0.9 ? &apos;highly reliable&apos; :
}
                     calibrationResults.calibrationMetrics.reliability > 0.8 ? &apos;reliable&apos; :
                     calibrationResults.calibrationMetrics.reliability > 0.7 ? &apos;moderately reliable&apos; : &apos;limited&apos;} 
                    confidence estimates for player performance predictions and decision support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="method-comparison sm:px-4 md:px-6 lg:px-8">
        <h4>📊 Method Comparison</h4>
        <table className="comparison-table sm:px-4 md:px-6 lg:px-8">
          <thead>
            <tr>
              <th>Method</th>
              <th>Complexity</th>
              <th>Reliability</th>
              <th>Efficiency</th>
              <th>Fantasy Score</th>
              <th>Data Requirement</th>
              <th>Best Use Case</th>
            </tr>
          </thead>
          <tbody>
            {calibrationMethods.map((method: any) => (
}
              <tr key={method.id} className={selectedCalibrationMethod === method.id ? &apos;selected-row&apos; : &apos;&apos;}>
                <td>
                  <span className="method-icon sm:px-4 md:px-6 lg:px-8">{method.icon}</span>
                  {method.name}
                </td>
                <td>{getCalibrationComplexityScore(method.id)}</td>
                <td>{getCalibrationReliabilityScore(method.id)}</td>
                <td>{getCalibrationEfficiencyScore(method.id)}</td>
                <td>{getCalibrationFantasyScore(method.id)}</td>
                <td>{getCalibrationDataRequirement(method.id)}</td>
                <td className="use-case-cell sm:px-4 md:px-6 lg:px-8">{getCalibrationBestUseCase(method.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="calibration-insights sm:px-4 md:px-6 lg:px-8">
        <h4>🎯 Calibration in Fantasy Football</h4>
        <div className="insights-grid sm:px-4 md:px-6 lg:px-8">
          <div className="insight-item sm:px-4 md:px-6 lg:px-8">
            <h5>Probability Reliability</h5>
            <p>
              Well-calibrated predictions ensure that when Oracle predicts a 70% chance of a player 
              scoring 20+ points, it actually happens about 70% of the time. This reliability is 
              crucial for risk assessment and lineup optimization decisions.
            </p>
          </div>
          <div className="insight-item sm:px-4 md:px-6 lg:px-8">
            <h5>Decision Support</h5>
            <p>
              Calibrated probabilities enable better decision-making by providing honest uncertainty 
              estimates. Fantasy managers can make informed trade-offs between high-risk, high-reward 
              players and safer, consistent options.
            </p>
          </div>
          <div className="insight-item sm:px-4 md:px-6 lg:px-8">
            <h5>Model Trust</h5>
            <p>
              Calibration builds trust in Oracle&apos;s predictions by ensuring confidence levels accurately 
              reflect prediction quality. This transparency helps users understand when to rely heavily 
              on predictions versus when to consider additional factors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformanceMetrics = () => (
    <div className="performance-metrics-section sm:px-4 md:px-6 lg:px-8">
      <h3>📊 Performance Evaluation Metrics</h3>
      <p className="section-description sm:px-4 md:px-6 lg:px-8">
        Comprehensive performance evaluation using classification, regression, calibration, and fantasy-specific metrics
        to assess model quality across different dimensions of prediction accuracy and reliability.
      </p>

      <div className="metrics-categories sm:px-4 md:px-6 lg:px-8">
        <h4>📋 Metric Categories</h4>
        <div className="categories-grid sm:px-4 md:px-6 lg:px-8">
          {metricCategories.map((category: any) => (
}
            <button
              key={category.id}
              className={`category-card ${selectedMetricCategory === category.id ? &apos;selected&apos; : &apos;&apos;}`}
              onClick={() => setSelectedMetricCategory(category.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e: any) => {
}
                if (e.key === &apos;Enter&apos; || e.key === &apos; &apos;) {
}
                  e.preventDefault();
                  setSelectedMetricCategory(category.id);

              }}
            >
              <div className="category-icon sm:px-4 md:px-6 lg:px-8">{category.icon}</div>
              <h5>{category.name}</h5>
              <p>{category.description}</p>
              {selectedMetricCategory === category.id && <span className="selected-badge sm:px-4 md:px-6 lg:px-8">Active</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="metrics-detailed sm:px-4 md:px-6 lg:px-8">
        <h4>🎯 Performance Metrics</h4>
        <div className="metrics-grid sm:px-4 md:px-6 lg:px-8">
          {performanceMetrics
}
            .filter((metric: any) => metric.category === selectedMetricCategory)
            .map((metric: any) => (
              <div
                key={metric.id}
                className={`metric-card ${selectedMetric === metric.id ? &apos;selected&apos; : &apos;&apos;}`}
                onClick={() => setSelectedMetric(metric.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e: any) => {
}
                  if (e.key === &apos;Enter&apos; || e.key === &apos; &apos;) {
}
                    e.preventDefault();
                    setSelectedMetric(metric.id);

                }}
              >
                <div className="metric-header sm:px-4 md:px-6 lg:px-8">
                  <h5>{metric.name}</h5>
                  <div className="metric-range sm:px-4 md:px-6 lg:px-8">Range: {metric.range}</div>
                  <div className={`metric-direction ${metric.higherIsBetter ? &apos;higher-better&apos; : &apos;lower-better&apos;}`}>
                    {metric.higherIsBetter ? &apos;⬆️ Higher is Better&apos; : &apos;⬇️ Lower is Better&apos;}
                  </div>
                </div>

                <div className="metric-details sm:px-4 md:px-6 lg:px-8">
                  <p className="metric-description sm:px-4 md:px-6 lg:px-8">{metric.description}</p>
                  
                  <div className="metric-formula sm:px-4 md:px-6 lg:px-8">
                    <strong>Formula:</strong>
                    <code>{metric.formula}</code>
                  </div>

                  <div className="metric-interpretation sm:px-4 md:px-6 lg:px-8">
                    <strong>Interpretation:</strong>
                    <p>{metric.interpretation}</p>
                  </div>

                  <div className="metric-analysis sm:px-4 md:px-6 lg:px-8">
                    <div className="use-cases sm:px-4 md:px-6 lg:px-8">
                      <h6>✅ Use Cases</h6>
                      <ul>
                        {metric.useCases.map((useCase, index) => (
}
                          <li key={`usecase-${metric.id}-${index}`}>{useCase}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="limitations sm:px-4 md:px-6 lg:px-8">
                      <h6>⚠️ Limitations</h6>
                      <ul>
                        {metric.limitations.map((limitation, index) => (
}
                          <li key={`limitation-${metric.id}-${index}`}>{limitation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="metric-scores sm:px-4 md:px-6 lg:px-8">
                    <div className="score-grid sm:px-4 md:px-6 lg:px-8">
                      <div className="score-item sm:px-4 md:px-6 lg:px-8">
                        <span className="score-label sm:px-4 md:px-6 lg:px-8">Importance</span>
                        <span className="score-stars sm:px-4 md:px-6 lg:px-8">{getMetricImportanceScore(metric.id)}</span>
                      </div>
                      <div className="score-item sm:px-4 md:px-6 lg:px-8">
                        <span className="score-label sm:px-4 md:px-6 lg:px-8">Interpretability</span>
                        <span className="score-stars sm:px-4 md:px-6 lg:px-8">{getMetricInterpretabilityScore(metric.id)}</span>
                      </div>
                      <div className="score-item sm:px-4 md:px-6 lg:px-8">
                        <span className="score-label sm:px-4 md:px-6 lg:px-8">Robustness</span>
                        <span className="score-stars sm:px-4 md:px-6 lg:px-8">{getMetricRobustnessScore(metric.id)}</span>
                      </div>
                      <div className="score-item sm:px-4 md:px-6 lg:px-8">
                        <span className="score-label sm:px-4 md:px-6 lg:px-8">Fantasy Relevance</span>
                        <span className="score-stars sm:px-4 md:px-6 lg:px-8">{getMetricFantasyRelevanceScore(metric.id)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="experiment-section sm:px-4 md:px-6 lg:px-8">
        <div className="experiment-controls sm:px-4 md:px-6 lg:px-8">
          <h4>🧪 Performance Evaluation Experiment</h4>
          <p>
            Evaluate multiple performance metrics across different model types to understand strengths,
            weaknesses, and trade-offs in fantasy football prediction tasks.
          </p>

          <div className="control-group sm:px-4 md:px-6 lg:px-8">
            <label htmlFor="model-type-select">Model Type:</label>
            <select
              id="model-type-select"
              value={selectedModel}
              onChange={(e: any) => setSelectedModel(e.target.value)}
            >
              {modelTypes.map((model: any) => (
}
                <option key={model.id} value={model.id}>
                  {model.icon} {model.name}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group sm:px-4 md:px-6 lg:px-8">
            <label htmlFor="metric-category-select">Focus Category:</label>
            <select
              id="metric-category-select"
              value={selectedMetricCategory}
              onChange={(e: any) => setSelectedMetricCategory(e.target.value)}
            >
              {metricCategories.map((category: any) => (
}
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={runPerformanceMetricsExperiment}
            disabled={metricsExperimentRunning}
            className="experiment-button sm:px-4 md:px-6 lg:px-8"
            aria-label="Run performance metrics experiment"
          >
            {metricsExperimentRunning ? &apos;🔄 Evaluating Performance...&apos; : &apos;🚀 Run Performance Evaluation&apos;}
          </button>

          {metricsExperimentRunning && (
}
            <div className="progress-container sm:px-4 md:px-6 lg:px-8">
              <div className="progress-bar sm:px-4 md:px-6 lg:px-8">
                <div
                  className="progress-fill sm:px-4 md:px-6 lg:px-8"
                  style={{ width: `${metricsProgress}%` }}
                ></div>
              </div>
              <span className="progress-text sm:px-4 md:px-6 lg:px-8">{metricsProgress.toFixed(1)}% Complete</span>
            </div>
          )}
        </div>

        {metricsResults && (
}
          <div className="results-container sm:px-4 md:px-6 lg:px-8">
            <h5>📊 Performance Evaluation Results</h5>

            <div className="results-summary sm:px-4 md:px-6 lg:px-8">
              <div className="summary-card sm:px-4 md:px-6 lg:px-8">
                <h6>Model Overview</h6>
                <div className="metric-grid sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Model Type</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">
                      {modelTypes.find((m: any) => m.id === selectedModel)?.name}
                    </span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Evaluation Set</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">1,000 samples</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Task Type</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">Fantasy Points Prediction</span>
                  </div>
                </div>
              </div>
            </div>

            {metricsResults.classification && (
}
              <div className="metrics-category-results sm:px-4 md:px-6 lg:px-8">
                <h6>🎯 Classification Metrics</h6>
                <div className="metric-grid sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Accuracy</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(metricsResults.classification.accuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Precision</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(metricsResults.classification.precision * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Recall</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(metricsResults.classification.recall * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">F1-Score</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(metricsResults.classification.f1Score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">AUC-ROC</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{metricsResults.classification.auc.toFixed(3)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">AUC-PR</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{metricsResults.classification.prAuc.toFixed(3)}</span>
                  </div>
                </div>

                <div className="confusion-matrix sm:px-4 md:px-6 lg:px-8">
                  <h6>Confusion Matrix</h6>
                  <table className="matrix-table sm:px-4 md:px-6 lg:px-8">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Predicted 0</th>
                        <th>Predicted 1</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Actual 0</strong></td>
                        <td className="true-negative sm:px-4 md:px-6 lg:px-8">{metricsResults.classification.confusionMatrix[0][0]}</td>
                        <td className="false-positive sm:px-4 md:px-6 lg:px-8">{metricsResults.classification.confusionMatrix[0][1]}</td>
                      </tr>
                      <tr>
                        <td><strong>Actual 1</strong></td>
                        <td className="false-negative sm:px-4 md:px-6 lg:px-8">{metricsResults.classification.confusionMatrix[1][0]}</td>
                        <td className="true-positive sm:px-4 md:px-6 lg:px-8">{metricsResults.classification.confusionMatrix[1][1]}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {metricsResults.regression && (
}
              <div className="metrics-category-results sm:px-4 md:px-6 lg:px-8">
                <h6>📈 Regression Metrics</h6>
                <div className="metric-grid sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">MSE</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{metricsResults.regression.mse.toFixed(4)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">RMSE</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{metricsResults.regression.rmse.toFixed(4)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">MAE</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{metricsResults.regression.mae.toFixed(4)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">MAPE</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{metricsResults.regression.mape.toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">R²</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{metricsResults.regression.r2.toFixed(3)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Adjusted R²</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{metricsResults.regression.adjustedR2.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            )}

            {metricsResults.calibration && (
}
              <div className="metrics-category-results sm:px-4 md:px-6 lg:px-8">
                <h6>⚖️ Calibration Metrics</h6>
                <div className="metric-grid sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Expected Calibration Error</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(metricsResults.calibration.expectedCalibrationError * 100).toFixed(2)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Brier Score</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{metricsResults.calibration.brierScore.toFixed(4)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Reliability</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(metricsResults.calibration.reliability * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Resolution</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{metricsResults.calibration.resolution.toFixed(3)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Sharpness</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{metricsResults.calibration.sharpness.toFixed(3)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Calibration Slope</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{metricsResults.calibration.calibrationSlope.toFixed(3)}</span>
                  </div>
                </div>
              </div>
            )}

            {metricsResults.fantasy && (
}
              <div className="metrics-category-results sm:px-4 md:px-6 lg:px-8">
                <h6>🏈 Fantasy Football Metrics</h6>
                <div className="metric-grid sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Points Accuracy</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(metricsResults.fantasy.pointsAccuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Ranking Accuracy</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(metricsResults.fantasy.rankingAccuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Bust Detection</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(metricsResults.fantasy.bustDetectionRecall * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Sleeper ID</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(metricsResults.fantasy.sleoperIdentification * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Value Over Replacement</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{metricsResults.fantasy.valueOverReplacement.toFixed(1)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Consistency Score</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(metricsResults.fantasy.consistencyScore * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}

            <div className="metrics-insights sm:px-4 md:px-6 lg:px-8">
              <h6>💡 Performance Insights</h6>
              <div className="insights-grid sm:px-4 md:px-6 lg:px-8">
                <div className="insight-item sm:px-4 md:px-6 lg:px-8">
                  <h6>Model Strengths</h6>
                  <p>
                    The {modelTypes.find((m: any) => m.id === selectedModel)?.name} model shows{&apos; &apos;}
                    {metricsResults.classification && metricsResults.classification.f1Score > 0.8 ? &apos;excellent&apos; :
}
                     metricsResults.classification && metricsResults.classification.f1Score > 0.7 ? &apos;good&apos; :
                     metricsResults.classification && metricsResults.classification.f1Score > 0.6 ? &apos;moderate&apos; : &apos;limited&apos;} 
                    classification performance with strong predictive capabilities for fantasy football applications.
                  </p>
                </div>
                <div className="insight-item sm:px-4 md:px-6 lg:px-8">
                  <h6>Calibration Quality</h6>
                  <p>
                    The calibration metrics indicate{&apos; &apos;}
                    {metricsResults.calibration.reliability > 0.9 ? &apos;excellent&apos; :
}
                     metricsResults.calibration.reliability > 0.8 ? &apos;good&apos; :
                     metricsResults.calibration.reliability > 0.7 ? &apos;moderate&apos; : &apos;poor&apos;} 
                    probability calibration, providing reliable confidence estimates for decision-making.
                  </p>
                </div>
                <div className="insight-item sm:px-4 md:px-6 lg:px-8">
                  <h6>Fantasy Relevance</h6>
                  <p>
                    The fantasy-specific metrics demonstrate{&apos; &apos;}
                    {metricsResults.fantasy.pointsAccuracy > 0.8 ? &apos;strong&apos; :
}
                     metricsResults.fantasy.pointsAccuracy > 0.7 ? &apos;good&apos; :
                     metricsResults.fantasy.pointsAccuracy > 0.6 ? &apos;moderate&apos; : &apos;limited&apos;} 
                    performance in actual fantasy football scenarios with practical value for lineup optimization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="metrics-comparison sm:px-4 md:px-6 lg:px-8">
        <h4>📊 Metrics Comparison</h4>
        <table className="comparison-table sm:px-4 md:px-6 lg:px-8">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Category</th>
              <th>Importance</th>
              <th>Interpretability</th>
              <th>Robustness</th>
              <th>Fantasy Relevance</th>
              <th>Best Use Case</th>
            </tr>
          </thead>
          <tbody>
            {performanceMetrics
}
              .filter((metric: any) => metric.category === selectedMetricCategory)
              .map((metric: any) => (
                <tr key={metric.id} className={selectedMetric === metric.id ? &apos;selected-row&apos; : &apos;&apos;}>
                  <td className="metric-name sm:px-4 md:px-6 lg:px-8">{metric.name}</td>
                  <td className="metric-category sm:px-4 md:px-6 lg:px-8">{metric.category}</td>
                  <td>{getMetricImportanceScore(metric.id)}</td>
                  <td>{getMetricInterpretabilityScore(metric.id)}</td>
                  <td>{getMetricRobustnessScore(metric.id)}</td>
                  <td>{getMetricFantasyRelevanceScore(metric.id)}</td>
                  <td className="use-case-cell sm:px-4 md:px-6 lg:px-8">{metric.useCases[0]}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="performance-insights sm:px-4 md:px-6 lg:px-8">
        <h4>🎯 Performance Evaluation in Fantasy Football</h4>
        <div className="insights-grid sm:px-4 md:px-6 lg:px-8">
          <div className="insight-item sm:px-4 md:px-6 lg:px-8">
            <h5>Multi-Metric Assessment</h5>
            <p>
              Comprehensive performance evaluation requires multiple metrics to capture different aspects
              of prediction quality. Classification metrics assess binary decisions, regression metrics
              evaluate point predictions, and calibration metrics ensure reliable confidence estimates.
            </p>
          </div>
          <div className="insight-item sm:px-4 md:px-6 lg:px-8">
            <h5>Context-Dependent Metrics</h5>
            <p>
              Different fantasy football scenarios require different metric priorities. Draft preparation
              emphasizes ranking accuracy, while lineup optimization focuses on point prediction accuracy
              and bust detection capabilities.
            </p>
          </div>
          <div className="insight-item sm:px-4 md:px-6 lg:px-8">
            <h5>Trade-off Analysis</h5>
            <p>
              Model performance often involves trade-offs between different metrics. Understanding these
              trade-offs helps select the most appropriate model for specific fantasy football applications
              and user preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBiasVarianceAnalysis = () => (
    <div className="bias-variance-section sm:px-4 md:px-6 lg:px-8">
      <h3>⚖️ Bias-Variance Trade-off Analysis</h3>
      <p className="section-description sm:px-4 md:px-6 lg:px-8">
        Understanding the fundamental trade-off between bias and variance in machine learning models
        to optimize prediction accuracy and generalization in fantasy football applications.
      </p>

      <div className="bias-variance-concepts sm:px-4 md:px-6 lg:px-8">
        <h4>🧠 Core Concepts</h4>
        <div className="concepts-grid sm:px-4 md:px-6 lg:px-8">
          <div className="concept-card sm:px-4 md:px-6 lg:px-8">
            <div className="concept-icon sm:px-4 md:px-6 lg:px-8">📉</div>
            <h5>Bias</h5>
            <p>
              Error from overly simplistic assumptions. High bias models (underfitting) miss relevant
              relationships between player performance factors, leading to systematic prediction errors.
            </p>
            <div className="concept-formula sm:px-4 md:px-6 lg:px-8">
              <strong>Bias² = </strong>(E[f̂(x)] - f(x))²
            </div>
          </div>
          <div className="concept-card sm:px-4 md:px-6 lg:px-8">
            <div className="concept-icon sm:px-4 md:px-6 lg:px-8">📊</div>
            <h5>Variance</h5>
            <p>
              Error from sensitivity to small changes in training data. High variance models (overfitting)
              change dramatically with different player samples, reducing generalization ability.
            </p>
            <div className="concept-formula sm:px-4 md:px-6 lg:px-8">
              <strong>Variance = </strong>E[(f̂(x) - E[f̂(x)])²]
            </div>
          </div>
          <div className="concept-card sm:px-4 md:px-6 lg:px-8">
            <div className="concept-icon sm:px-4 md:px-6 lg:px-8">🎯</div>
            <h5>Total Error</h5>
            <p>
              Combination of bias, variance, and irreducible noise. The goal is finding optimal
              model complexity that minimizes total prediction error for fantasy football scenarios.
            </p>
            <div className="concept-formula sm:px-4 md:px-6 lg:px-8">
              <strong>Error = </strong>Bias² + Variance + Noise
            </div>
          </div>
        </div>
      </div>

      <div className="model-complexity-selection sm:px-4 md:px-6 lg:px-8">
        <h4>🔧 Model Complexity Analysis</h4>
        <div className="complexity-controls sm:px-4 md:px-6 lg:px-8">
          <div className="control-group sm:px-4 md:px-6 lg:px-8">
            <label htmlFor="complexity-model-select">Model Type:</label>
            <select
              id="complexity-model-select"
              value={selectedComplexityModel}
              onChange={(e: any) => setSelectedComplexityModel(e.target.value)}
            >
              {complexityConfigs.map((config: any) => (
}
                <option key={config.id} value={config.id}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group sm:px-4 md:px-6 lg:px-8">
            <label htmlFor="decomposition-method-select">Decomposition Method:</label>
            <select
              id="decomposition-method-select"
              value={decompositionMethod}
              onChange={(e: any) => setDecompositionMethod(e.target.value)}
            >
              <option value="bootstrap">Bootstrap Sampling</option>
              <option value="analytical">Analytical Decomposition</option>
              <option value="monte_carlo">Monte Carlo Simulation</option>
            </select>
          </div>

          <div className="control-group sm:px-4 md:px-6 lg:px-8">
            <label htmlFor="complexity-range">Complexity Range:</label>
            <div className="range-inputs sm:px-4 md:px-6 lg:px-8">
              <input
                type="number"
                value={selectedComplexityRange[0]}
                onChange={(e: any) => setSelectedComplexityRange([+e.target.value, selectedComplexityRange[1]])}
                max="50"
                className="range-input sm:px-4 md:px-6 lg:px-8"
              />
              <span>to</span>
              <input
                type="number"
                value={selectedComplexityRange[1]}
                onChange={(e: any) => setSelectedComplexityRange([selectedComplexityRange[0], +e.target.value])}
                max="50"
                className="range-input sm:px-4 md:px-6 lg:px-8"
              />
            </div>
          </div>
        </div>

        <div className="complexity-experiments sm:px-4 md:px-6 lg:px-8">
          <h5>📋 Experiment Configurations</h5>
          <div className="experiments-grid sm:px-4 md:px-6 lg:px-8">
            {biasVarianceExperiments.map((experiment: any) => (
}
              <div key={experiment.id} className="experiment-card sm:px-4 md:px-6 lg:px-8">
                <h6>{experiment.name}</h6>
                <p>{experiment.description}</p>
                
                <div className="experiment-preview sm:px-4 md:px-6 lg:px-8">
                  <div className="preview-metrics sm:px-4 md:px-6 lg:px-8">
                    <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                      <span className="metric-label sm:px-4 md:px-6 lg:px-8">Expected Bias</span>
                      <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(experiment.expectedBias * 100).toFixed(1)}%</span>
                    </div>
                    <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                      <span className="metric-label sm:px-4 md:px-6 lg:px-8">Expected Variance</span>
                      <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(experiment.expectedVariance * 100).toFixed(1)}%</span>
                    </div>
                    <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                      <span className="metric-label sm:px-4 md:px-6 lg:px-8">Total Error</span>
                      <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(experiment.totalError * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div className="experiment-scores sm:px-4 md:px-6 lg:px-8">
                    <div className="score-item sm:px-4 md:px-6 lg:px-8">
                      <span>Bias Tendency</span>
                      <span>{getBiasComplexityScore(experiment.id)}</span>
                    </div>
                    <div className="score-item sm:px-4 md:px-6 lg:px-8">
                      <span>Variance Tendency</span>
                      <span>{getVarianceComplexityScore(experiment.id)}</span>
                    </div>
                    <div className="score-item sm:px-4 md:px-6 lg:px-8">
                      <span>Interpretability</span>
                      <span>{getInterpretabilityScore(experiment.id)}</span>
                    </div>
                    <div className="score-item sm:px-4 md:px-6 lg:px-8">
                      <span>Computation</span>
                      <span>{getComputationalComplexityScore(experiment.id)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bias-variance-experiment sm:px-4 md:px-6 lg:px-8">
        <div className="experiment-controls sm:px-4 md:px-6 lg:px-8">
          <h4>🧪 Bias-Variance Decomposition Experiment</h4>
          <p>
            Run comprehensive bias-variance analysis to understand model behavior across different
            complexity levels and identify optimal trade-offs for fantasy football predictions.
          </p>

          <button
            onClick={runBiasVarianceExperiment}
            disabled={biasVarianceExperimentRunning}
            className="experiment-button sm:px-4 md:px-6 lg:px-8"
            aria-label="Run bias-variance analysis experiment"
          >
            {biasVarianceExperimentRunning ? &apos;🔄 Analyzing Trade-offs...&apos; : &apos;🚀 Run Bias-Variance Analysis&apos;}
          </button>

          {biasVarianceExperimentRunning && (
}
            <div className="progress-container sm:px-4 md:px-6 lg:px-8">
              <div className="progress-bar sm:px-4 md:px-6 lg:px-8">
                <div
                  className="progress-fill sm:px-4 md:px-6 lg:px-8"
                  style={{ width: `${biasVarianceProgress}%` }}
                ></div>
              </div>
              <span className="progress-text sm:px-4 md:px-6 lg:px-8">{biasVarianceProgress.toFixed(1)}% Complete</span>
            </div>
          )}
        </div>

        {biasVarianceVisualization && biasVarianceResults && (
}
          <div className="results-container sm:px-4 md:px-6 lg:px-8">
            <h5>📊 Bias-Variance Decomposition Results</h5>

            <div className="results-summary sm:px-4 md:px-6 lg:px-8">
              <div className="summary-card sm:px-4 md:px-6 lg:px-8">
                <h6>Optimal Complexity</h6>
                <div className="metric-grid sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Sweet Spot</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{biasVarianceVisualization.sweetSpot.toFixed(1)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Model Type</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">
                      {complexityConfigs.find((c: any) => c.id === selectedComplexityModel)?.name}
                    </span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span className="metric-label sm:px-4 md:px-6 lg:px-8">Complexity Range</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{selectedComplexityRange[0]} - {selectedComplexityRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bias-variance-chart sm:px-4 md:px-6 lg:px-8">
              <h6>📈 Bias-Variance Trade-off Visualization</h6>
              <div className="chart-container sm:px-4 md:px-6 lg:px-8">
                <div className="chart-legend sm:px-4 md:px-6 lg:px-8">
                  <div className="legend-item bias sm:px-4 md:px-6 lg:px-8">
                    <span className="legend-color sm:px-4 md:px-6 lg:px-8"></span>
                    <span>Bias²</span>
                  </div>
                  <div className="legend-item variance sm:px-4 md:px-6 lg:px-8">
                    <span className="legend-color sm:px-4 md:px-6 lg:px-8"></span>
                    <span>Variance</span>
                  </div>
                  <div className="legend-item total sm:px-4 md:px-6 lg:px-8">
                    <span className="legend-color sm:px-4 md:px-6 lg:px-8"></span>
                    <span>Total Error</span>
                  </div>
                  <div className="legend-item optimal sm:px-4 md:px-6 lg:px-8">
                    <span className="legend-marker sm:px-4 md:px-6 lg:px-8">⭐</span>
                    <span>Optimal Point</span>
                  </div>
                </div>
                
                <div className="chart-area sm:px-4 md:px-6 lg:px-8">
                  <div className="chart-grid sm:px-4 md:px-6 lg:px-8">
                    {biasVarianceVisualization.complexityRange.map((complexity, index) => (
}
                      <div key={`chart-point-${complexity}`} className="chart-point sm:px-4 md:px-6 lg:px-8" style={{
}
                        left: `${(complexity - biasVarianceVisualization.complexityRange[0]) / 
}
                          (biasVarianceVisualization.complexityRange[biasVarianceVisualization.complexityRange.length - 1] - 
                           biasVarianceVisualization.complexityRange[0]) * 100}%`
                      }}>
                        <div className="bias-bar sm:px-4 md:px-6 lg:px-8" style={{
}
                          height: `${biasVarianceVisualization.biasValues[index] * 200}px`,
                          backgroundColor: &apos;#ff6b6b&apos;
                        }}></div>
                        <div className="variance-bar sm:px-4 md:px-6 lg:px-8" style={{
}
                          height: `${biasVarianceVisualization.varianceValues[index] * 200}px`,
                          backgroundColor: &apos;#4ecdc4&apos;
                        }}></div>
                        <div className="total-line sm:px-4 md:px-6 lg:px-8" style={{
}
                          bottom: `${biasVarianceVisualization.totalErrorValues[index] * 200}px`
                        }}></div>
                        {Math.abs(complexity - biasVarianceVisualization.optimalComplexity) < 0.5 && (
}
                          <div className="optimal-marker sm:px-4 md:px-6 lg:px-8">⭐</div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="chart-labels sm:px-4 md:px-6 lg:px-8">
                    <div className="x-axis-label sm:px-4 md:px-6 lg:px-8">Model Complexity</div>
                    <div className="y-axis-label sm:px-4 md:px-6 lg:px-8">Error</div>
                  </div>
                </div>

                <div className="region-indicators sm:px-4 md:px-6 lg:px-8">
                  <div className="underfitting-region sm:px-4 md:px-6 lg:px-8">
                    <span>🔻 Underfitting</span>
                    <p>High bias, low variance</p>
                  </div>
                  <div className="sweet-spot-region sm:px-4 md:px-6 lg:px-8">
                    <span>🎯 Sweet Spot</span>
                    <p>Balanced bias-variance</p>
                  </div>
                  <div className="overfitting-region sm:px-4 md:px-6 lg:px-8">
                    <span>🔺 Overfitting</span>
                    <p>Low bias, high variance</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="detailed-results sm:px-4 md:px-6 lg:px-8">
              <h6>📋 Detailed Analysis</h6>
              <div className="results-table-container sm:px-4 md:px-6 lg:px-8">
                <table className="results-table sm:px-4 md:px-6 lg:px-8">
                  <thead>
                    <tr>
                      <th>Complexity</th>
                      <th>Bias²</th>
                      <th>Variance</th>
                      <th>Noise</th>
                      <th>Total Error</th>
                      <th>R² Score</th>
                      <th>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {biasVarianceResults.slice(0, 8).map((result, index) => (
}
                      <tr key={`result-${result.modelComplexity}`} className={
}
                        Math.abs(result.modelComplexity - biasVarianceVisualization.optimalComplexity) < 1 ? &apos;optimal-row&apos; : &apos;&apos;
                      }>
                        <td>{result.modelComplexity.toFixed(1)}</td>
                        <td>{(result.bias * 100).toFixed(2)}%</td>
                        <td>{(result.variance * 100).toFixed(2)}%</td>
                        <td>{(result.noise * 100).toFixed(2)}%</td>
                        <td>{(result.totalError * 100).toFixed(2)}%</td>
                        <td>{result.metrics.r2.toFixed(3)}</td>
                        <td>
                          {result.totalError < 0.3 ? &apos;🟢 Excellent&apos; :
}
                           result.totalError < 0.5 ? &apos;🟡 Good&apos; :
                           result.totalError < 0.7 ? &apos;🟠 Fair&apos; : &apos;🔴 Poor&apos;}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {biasVarianceResults.length > 8 && (
}
                  <p className="table-truncation sm:px-4 md:px-6 lg:px-8">
                    Showing first 8 of {biasVarianceResults.length} complexity levels. 
                    Full analysis includes {biasVarianceResults.length} data points.
                  </p>
                )}
              </div>
            </div>

            <div className="bias-variance-insights sm:px-4 md:px-6 lg:px-8">
              <h6>💡 Trade-off Insights</h6>
              <div className="insights-grid sm:px-4 md:px-6 lg:px-8">
                <div className="insight-item sm:px-4 md:px-6 lg:px-8">
                  <h6>Model Complexity Impact</h6>
                  <p>
                    The {complexityConfigs.find((c: any) => c.id === selectedComplexityModel)?.name} model shows{&apos; &apos;}
                    {biasVarianceVisualization.optimalComplexity < 5 ? &apos;low&apos; :
}
                     biasVarianceVisualization.optimalComplexity < 10 ? &apos;moderate&apos; : &apos;high&apos;} optimal complexity,
                    indicating {biasVarianceVisualization.optimalComplexity < 5 ? &apos;simple relationships&apos; : 
}
                               biasVarianceVisualization.optimalComplexity < 10 ? &apos;moderate complexity patterns&apos; :
                               &apos;complex non-linear interactions&apos;} in fantasy football data.
                  </p>
                </div>
                <div className="insight-item sm:px-4 md:px-6 lg:px-8">
                  <h6>Generalization Capability</h6>
                  <p>
                    The optimal bias-variance balance suggests{&apos; &apos;}
                    {Math.min(...biasVarianceVisualization.totalErrorValues) < 0.3 ? &apos;excellent&apos; :
}
                     Math.min(...biasVarianceVisualization.totalErrorValues) < 0.5 ? &apos;good&apos; : &apos;limited&apos;} 
                    generalization performance for unseen fantasy football scenarios and player combinations.
                  </p>
                </div>
                <div className="insight-item sm:px-4 md:px-6 lg:px-8">
                  <h6>Fantasy Football Application</h6>
                  <p>
                    For fantasy football predictions, this analysis suggests using{&apos; &apos;}
                    {biasVarianceVisualization.optimalComplexity < 5 ? &apos;simpler models with strong domain features&apos; :
}
                     biasVarianceVisualization.optimalComplexity < 10 ? &apos;moderately complex models with regularization&apos; :
                     &apos;complex ensemble methods with careful validation&apos;} to achieve optimal prediction accuracy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bias-variance-applications sm:px-4 md:px-6 lg:px-8">
        <h4>🏈 Fantasy Football Applications</h4>
        <div className="applications-grid sm:px-4 md:px-6 lg:px-8">
          <div className="application-card sm:px-4 md:px-6 lg:px-8">
            <h5>Player Performance Modeling</h5>
            <p>
              Bias-variance analysis helps determine optimal model complexity for different player types.
              Running backs may require simpler models (lower variance) while wide receivers benefit from
              complex models capturing matchup nuances (accepting higher variance for lower bias).
            </p>
          </div>
          <div className="application-card sm:px-4 md:px-6 lg:px-8">
            <h5>Seasonal vs Weekly Predictions</h5>
            <p>
              Season-long projections favor lower variance models (ensemble methods, regularization) while
              weekly predictions may accept higher variance for lower bias to capture game-specific factors
              and short-term trends.
            </p>
          </div>
          <div className="application-card sm:px-4 md:px-6 lg:px-8">
            <h5>Draft Strategy Optimization</h5>
            <p>
              Understanding bias-variance trade-offs guides draft preparation models. Early rounds emphasize
              low variance (consistent performers) while late rounds may target high-variance, high-upside
              players where bias reduction is more valuable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string) => (
    <div className="placeholder-content sm:px-4 md:px-6 lg:px-8">
      <h3>🚧 {title}</h3>
      <p>This section will be implemented in upcoming tasks.</p>
    </div>
  );
  
  return (
    <div className="oracle-calibration-validation-section sm:px-4 md:px-6 lg:px-8">
      <div className="section-header sm:px-4 md:px-6 lg:px-8">
        <h2>🎯 Prediction Calibration & Validation</h2>
        <p>Ensuring accuracy, reliability, and trustworthiness in Oracle&apos;s predictions</p>
      </div>
      
      <div className="section-navigation sm:px-4 md:px-6 lg:px-8">
        <button 
          className={`nav-button ${activeTab === &apos;overview&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;overview&apos;)}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;crossval&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;crossval&apos;)}
        >
          🔄 Cross-Validation
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;holdout&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;holdout&apos;)}
        >
          🎲 Holdout Methods
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;timeseries&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;timeseries&apos;)}
        >
          ⏰ Time Series
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;bootstrap&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;bootstrap&apos;)}
        >
          🎲 Bootstrap
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;calibration&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;calibration&apos;)}
        >
          ⚖️ Calibration
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;metrics&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;metrics&apos;)}
        >
          📈 Metrics
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;biasvariance&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;biasvariance&apos;)}
        >
          ⚖️ Bias-Variance
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;demo&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;demo&apos;)}
        >
          🧪 Demo
        </button>
      </div>
      
      <div className="section-content sm:px-4 md:px-6 lg:px-8">
        {activeTab === &apos;overview&apos; && renderOverview()}
        {activeTab === &apos;crossval&apos; && renderCrossValidation()}
        {activeTab === &apos;holdout&apos; && renderHoldout()}
        {activeTab === &apos;timeseries&apos; && renderTimeSeries()}
        {activeTab === &apos;bootstrap&apos; && renderBootstrap()}
        {activeTab === &apos;calibration&apos; && renderCalibration()}
        {activeTab === &apos;metrics&apos; && renderPerformanceMetrics()}
        {activeTab === &apos;biasvariance&apos; && renderBiasVarianceAnalysis()}
        {activeTab === &apos;demo&apos; && renderPlaceholder(&apos;Interactive Demo&apos;)}
      </div>
    </div>
  );
};

const OracleCalibrationValidationSectionWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OracleCalibrationValidationSection {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleCalibrationValidationSectionWithErrorBoundary);
