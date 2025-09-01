import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useState } from 'react';
import type { HoldoutResult, TimeSeriesResult, BootstrapResult, CalibrationResult } from '../../types';
import './OracleCalibrationValidationSection.css';

// ===== TYPE ALIASES =====

type ComplexityLevel = 'low' | 'medium' | 'high';
type ValidationMethodType = 'cross_validation' | 'holdout' | 'time_series' | 'bootstrap' | 'monte_carlo';
type CrossValidationType = 'k_fold' | 'stratified_k_fold' | 'time_series_split' | 'group_k_fold' | 'nested_cv' | 'leave_one_out';
type HoldoutType = 'simple_holdout' | 'stratified_holdout' | 'temporal_holdout' | 'grouped_holdout';
type TimeSeriesValidationType = 'walk_forward' | 'expanding_window' | 'rolling_window' | 'blocked_time_series' | 'purged_group_time_series';
type CalibrationMethodType = 'parametric' | 'non_parametric' | 'bayesian' | 'ensemble';
type MetricCategory = 'classification' | 'regression' | 'ranking' | 'calibration' | 'fairness' | 'custom';
type TargetType = 'classification' | 'regression';
type ExperimentStatus = 'pending' | 'running' | 'completed' | 'failed';
type CalibrationQuality = 'poor' | 'fair' | 'good' | 'excellent';
type ActiveTab = 'overview' | 'crossval' | 'holdout' | 'timeseries' | 'bootstrap' | 'calibration' | 'metrics' | 'biasvariance' | 'demo';
type BinStrategy = 'uniform' | 'quantile' | 'kmeans';
type VotingStrategy = 'soft' | 'hard' | 'weighted';

// ===== VALIDATION METHOD INTERFACES =====

interface ValidationMethod {
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
  method: string;
  folds: number;
  scores: number[];
  meanScore: number;
  stdScore: number;
  confidenceInterval: [number, number];
  trainingTime: number;
  validationTime: number;
  details: {
    fold: number;
    trainSize: number;
    testSize: number;
    score: number;
    metrics: Record<string, number>;
  }[];

// Holdout Validation Interfaces
interface HoldoutConfig {
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
  id: string;
  name: string;
  icon: string;
  type: 'basic' | 'stratified' | 'block' | 'parametric';
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
  method: string;
  windows: number;
  scores: number[];
  meanScore: number;
  stdScore: number;
  temporalStability: number;
  degenerationRate: number;
  forecastAccuracy: number[];
  details: {
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
  method: string;
  parameters: Record<string, any>;
  cvFolds?: number;
  binStrategy?: BinStrategy;
  nBins?: number;
  smoothingParameter?: number;
  ensemble?: {
    methods: string[];
    weights?: number[];
    voting: VotingStrategy;
  };

// ===== PERFORMANCE METRICS INTERFACES =====

interface PerformanceMetric {
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
  classification?: ClassificationMetrics;
  regression?: RegressionMetrics;
  calibration: CalibrationMetrics;
  fantasy: FantasyMetrics;
  custom?: Record<string, number>;

// ===== EXPERIMENT AND EVALUATION INTERFACES =====

interface ValidationExperiment {
  id: string;
  name: string;
  description: string;
  model: string;
  dataset: {
    name: string;
    size: number;
    features: number;
    target: string;
    timeRange?: [string, string];
  };
  validationConfig: {
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
  experimentId: string;
  validationResults: CrossValidationResult | HoldoutResult | TimeSeriesValidationResult;
  calibrationResults?: CalibrationResult;
  metrics: ComprehensiveMetrics;
  modelPerformance: {
    trainingTime: number;
    inferenceTime: number;
    memoryUsage: number;
    modelSize: number;
  };
  insights: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    riskAssessment: string;
  };

interface ValidationReport {
  summary: {
    totalExperiments: number;
    completedExperiments: number;
    averageScore: number;
    bestMethod: string;
    recommendedApproach: string;
  };
  methodComparison: {
    method: string;
    score: number;
    rank: number;
    reliability: number;
    computationalCost: number;
    interpretability: number;
  }[];
  calibrationAnalysis: {
    uncalibratedScore: number;
    calibratedScore: number;
    improvement: number;
    bestCalibrationMethod: string;
    calibrationQuality: CalibrationQuality;
  };
  recommendations: {
    productionMethod: string;
    alternativeMethod: string;
    calibrationStrategy: string;
    monitoringMetrics: string[];
    revalidationFrequency: string;
  };

// ===== DEMO AND INTERACTION INTERFACES =====

interface ValidationDemoConfig {
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
  isRunning: boolean;
  progress: number;
  currentStage: string;
  results?: ExperimentResult;
  visualizations: {
    calibrationCurve?: any;
    reliabilityDiagram?: any;
    learningCurve?: any;
    validationCurve?: any;
    residualPlot?: any;
    featureImportance?: any;
  };

// ===== UTILITY INTERFACES =====

interface ValidationConfig {
  seed: number;
  verbose: boolean;
  nJobs: number;
  backend: 'sklearn' | 'custom' | 'distributed';
  cachePredictions: boolean;
  saveIntermediateResults: boolean;

}

interface ModelMetadata {
  name: string;
  version: string;
  type: TargetType | 'ranking';
  algorithm: string;
  hyperparameters: Record<string, any>;
  trainingData: {
    size: number;
    features: string[];
    target: string;
    timeRange?: [string, string];
  };
  performance: {
    training: number;
    validation: number;
    test?: number;
  };

// ===== BIAS-VARIANCE ANALYSIS INTERFACES =====

interface BiasVarianceExperiment {
  id: string;
  name: string;
  modelComplexity: number;
  description: string;
  expectedBias: number;
  expectedVariance: number;
  expectedNoise: number;
  totalError: number;
  decompositionMethod: 'bootstrap' | 'analytical' | 'monte_carlo';

}

interface BiasVarianceResult {
  modelComplexity: number;
  bias: number;
  variance: number;
  noise: number;
  totalError: number;
  irreducibleError: number;
  predictions: number[];
  trueValues: number[];
  decomposition: {
    biasSquared: number;
    varianceComponent: number;
    noiseComponent: number;
    covariance: number;
  };
  metrics: {
    mse: number;
    mae: number;
    r2: number;
    adjustedR2: number;
  };

interface BiasVarianceVisualization {
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
  id: string;
  name: string;
  description: string;
  complexityParameter: string;
  minComplexity: number;
  maxComplexity: number;
  stepSize: number;
  optimizationTarget: 'bias' | 'variance' | 'total_error' | 'generalization';
  regularization: boolean;
  crossValidation: boolean;

// ===== LEARNING CURVE ANALYSIS INTERFACES =====

interface LearningCurveExperiment {
  id: string;
  name: string;
  description: string;
  modelType: string;
  sampleSizeRange: [number, number];
  stepSize: number;
  convergenceThreshold: number;
  expectedConvergencePoint: number;
  dataEfficiency: 'low' | 'medium' | 'high';
  convergenceRate: 'slow' | 'medium' | 'fast';

}

interface LearningCurveResult {
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
  sampleSizes: number[];
  trainScores: number[];
  validationScores: number[];
  testScores: number[];
  convergencePoint: number;
  plateauStart: number;
  dataEfficiencyScore: number;
  recommendedSampleSize: number;
  convergenceAnalysis: {
    hasConverged: boolean;
    convergenceRate: 'slow' | 'medium' | 'fast';
    plateauDetected: boolean;
    optimalDataSize: number;
  };
  insights: {
    dataEfficiency: string;
    convergenceBehavior: string;
    recommendations: string[];
  };

interface DataSizeConfig {
  id: string;
  name: string;
  description: string;
  minSamples: number;
  maxSamples: number;
  stepStrategy: 'linear' | 'logarithmic' | 'exponential';
  validationRatio: number;
  crossValidationFolds: number;
  randomState: number;

}

interface FantasyContext {
  league: {
    type: 'standard' | 'ppr' | 'half_ppr' | 'dynasty' | 'redraft';
    size: number;
    scoringSystem: Record<string, number>;
  };
  season: {
    year: number;
    week?: number;
    phase: 'preseason' | 'regular' | 'playoffs';
  };
  playerPool: {
    positions: string[];
    totalPlayers: number;
    activeRosters: number;
  };

// Component placeholder for the main section
const OracleCalibrationValidationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedCVMethod, setSelectedCVMethod] = useState<string>('k_fold');
  const [cvExperimentRunning, setCvExperimentRunning] = useState<boolean>(false);
  const [cvResults, setCvResults] = useState<CrossValidationResult | null>(null);
  const [experimentProgress, setExperimentProgress] = useState<number>(0);
  const [selectedHoldoutMethod, setSelectedHoldoutMethod] = useState<string>('simple_holdout');
  const [holdoutExperimentRunning, setHoldoutExperimentRunning] = useState<boolean>(false);
  const [holdoutResults, setHoldoutResults] = useState<HoldoutResult | null>(null);
  const [holdoutProgress, setHoldoutProgress] = useState<number>(0);

  // Time series validation state
  const [selectedTimeSeriesMethod, setSelectedTimeSeriesMethod] = useState<string>('walk_forward');
  const [timeSeriesExperimentRunning, setTimeSeriesExperimentRunning] = useState<boolean>(false);
  const [timeSeriesResults, setTimeSeriesResults] = useState<TimeSeriesResult | null>(null);
  const [timeSeriesProgress, setTimeSeriesProgress] = useState<number>(0);

  // Bootstrap resampling state
  const [selectedBootstrapMethod, setSelectedBootstrapMethod] = useState<string>('basic_bootstrap');
  const [bootstrapExperimentRunning, setBootstrapExperimentRunning] = useState<boolean>(false);
  const [bootstrapResults, setBootstrapResults] = useState<BootstrapResult | null>(null);
  const [bootstrapProgress, setBootstrapProgress] = useState<number>(0);

  // Calibration techniques state
  const [selectedCalibrationMethod, setSelectedCalibrationMethod] = useState<string>('platt_scaling');
  const [calibrationExperimentRunning, setCalibrationExperimentRunning] = useState<boolean>(false);
  const [calibrationResults, setCalibrationResults] = useState<CalibrationResult | null>(null);
  const [calibrationProgress, setCalibrationProgress] = useState<number>(0);

  // Performance metrics state
  const [selectedMetricCategory, setSelectedMetricCategory] = useState<string>('classification');
  const [selectedMetric, setSelectedMetric] = useState<string>('accuracy');
  const [metricsExperimentRunning, setMetricsExperimentRunning] = useState<boolean>(false);
  const [metricsResults, setMetricsResults] = useState<ComprehensiveMetrics | null>(null);
  const [metricsProgress, setMetricsProgress] = useState<number>(0);
  const [selectedModel, setSelectedModel] = useState<string>('neural_network');

  // Bias-variance analysis state
  const [selectedComplexityModel, setSelectedComplexityModel] = useState<string>('polynomial');
  const [biasVarianceExperimentRunning, setBiasVarianceExperimentRunning] = useState<boolean>(false);
  const [biasVarianceResults, setBiasVarianceResults] = useState<BiasVarianceResult[] | null>(null);
  const [biasVarianceProgress, setBiasVarianceProgress] = useState<number>(0);
  const [selectedComplexityRange, setSelectedComplexityRange] = useState<[number, number]>([1, 20]);
  const [biasVarianceVisualization, setBiasVarianceVisualization] = useState<BiasVarianceVisualization | null>(null);
  const [decompositionMethod, setDecompositionMethod] = useState<string>('bootstrap');

  // Learning curve analysis state
  const [selectedLearningModel, setSelectedLearningModel] = useState<string>('neural_network');
  const [learningCurveExperimentRunning, setLearningCurveExperimentRunning] = useState<boolean>(false);
  const [learningCurveResults, setLearningCurveResults] = useState<LearningCurveResult[] | null>(null);
  const [learningCurveProgress, setLearningCurveProgress] = useState<number>(0);
  const [selectedSampleRange, setSelectedSampleRange] = useState<[number, number]>([100, 5000]);
  const [learningCurveVisualization, setLearningCurveVisualization] = useState<LearningCurveVisualization | null>(null);
  const [dataSizeStrategy, setDataSizeStrategy] = useState<string>('logarithmic');

  // Cross-validation method configurations
  const crossValidationMethods: CrossValidationConfig[] = [
    {
      id: 'k_fold',
      name: 'K-Fold Cross-Validation',
      type: 'k_fold',
      folds: 5,
      shuffle: true,
      randomState: 42,
      description: 'Standard k-fold CV that divides data into k equal-sized folds, using k-1 for training and 1 for validation',
      formula: 'CV(k) = (1/k) ∑ᵢ₌₁ᵏ L(fᵢ(X₋ᵢ), yᵢ)',
      implementation: 'Randomly shuffle dataset, split into k folds, rotate validation fold'
    },
    {
      id: 'stratified_k_fold',
      name: 'Stratified K-Fold CV',
      type: 'stratified_k_fold',
      folds: 5,
      shuffle: true,
      randomState: 42,
      stratifyColumn: 'position',
      description: 'K-fold CV that maintains class distribution across folds, crucial for imbalanced fantasy football positions',
      formula: 'StratifiedCV(k) = (1/k) ∑ᵢ₌₁ᵏ L(fᵢ(X₋ᵢ), yᵢ) s.t. P(yᵢ) ≈ P(y)',
      implementation: 'Ensure proportional representation of each position (QB, RB, WR, TE) in every fold'
    },
    {
      id: 'time_series_split',
      name: 'Time Series Split CV',
      type: 'time_series_split',
      folds: 5,
      shuffle: false,
      timeColumn: 'game_date',
      description: 'Temporal validation that respects chronological order, preventing data leakage from future games',
      formula: 'TimeSeriesCV = ∑ᵢ₌₁ⁿ L(f(X₁:ᵢ), yᵢ₊₁)',
      implementation: 'Use historical data to predict future performance, expanding training window over time'
    },
    {
      id: 'group_k_fold',
      name: 'Group K-Fold CV',
      type: 'group_k_fold',
      folds: 5,
      shuffle: true,
      groupColumn: 'player_id',
      description: 'Groups data by player to prevent information leakage between training and validation sets',
      formula: 'GroupCV(k) = (1/k) ∑ᵢ₌₁ᵏ L(fᵢ(X₋Gᵢ), yGᵢ)',
      implementation: 'Ensure same player never appears in both training and validation within a fold'
    },
    {
      id: 'nested_cv',
      name: 'Nested Cross-Validation',
      type: 'nested_cv',
      folds: 5,
      shuffle: true,
      randomState: 42,
      description: 'Double CV for unbiased hyperparameter tuning and model selection in fantasy sports',
      formula: 'NestedCV = (1/k₁) ∑ᵢ₌₁ᵏ¹ min_{h} (1/k₂) ∑ⱼ₌₁ᵏ² L(fₕ(X₋ᵢⱼ), yᵢⱼ)',
      implementation: 'Outer loop for model evaluation, inner loop for hyperparameter optimization'

  ];

  // Holdout validation method configurations
  const holdoutMethods: HoldoutConfig[] = [
    {
      id: 'simple_holdout',
      name: 'Simple Holdout',
      icon: '🎯',
      type: 'simple_holdout',
      trainRatio: 0.7,
      testRatio: 0.3,
      shuffle: true,
      stratify: false,
      timeAware: false,
      description: 'Basic train/test split with random partitioning of the dataset',
      implementation: 'Random split maintaining specified ratios, suitable for balanced datasets'
    },
    {
      id: 'stratified_holdout',
      name: 'Stratified Holdout',
      icon: '⚖️',
      type: 'stratified_holdout',
      trainRatio: 0.7,
      testRatio: 0.3,
      shuffle: true,
      stratify: true,
      timeAware: false,
      description: 'Holdout split maintaining proportional representation of each position across train/test sets',
      implementation: 'Stratified sampling ensures equal representation of QB, RB, WR, TE in both sets'
    },
    {
      id: 'temporal_holdout',
      name: 'Temporal Holdout',
      icon: '📅',
      type: 'temporal_holdout',
      trainRatio: 0.8,
      testRatio: 0.2,
      shuffle: false,
      stratify: false,
      timeAware: true,
      description: 'Time-aware split using historical data for training and recent data for testing',
      implementation: 'Chronological split preventing future information leakage in fantasy predictions'
    },
    {
      id: 'grouped_holdout',
      name: 'Grouped Holdout',
      icon: '👥',
      type: 'grouped_holdout',
      trainRatio: 0.75,
      testRatio: 0.25,
      shuffle: true,
      stratify: false,
      groupBy: 'player_id',
      timeAware: false,
      description: 'Player-grouped split ensuring same player never appears in both train and test sets',
      implementation: 'Group-based sampling for testing generalization to unseen players'

  ];

  // Time series validation methods configuration
  const timeSeriesMethods: TimeSeriesValidationConfig[] = [
    {
      id: 'walk_forward',
      name: 'Walk-Forward Validation',
      icon: '🚶',
      type: 'walk_forward',
      windowSize: 4,
      stepSize: 1,
      minTrainSize: 4,
      maxTrainSize: 12,
      preserveOrder: true,
      allowDataLeakage: false,
      description: 'Sequential validation that walks forward through time, using past data to predict future outcomes',
      implementation: 'Incrementally expand training set while testing on next time period',
      advantages: ['Realistic temporal validation', 'Prevents look-ahead bias', 'Simulates live trading'],
      disadvantages: ['Limited training data early on', 'Computationally expensive', 'May underestimate performance'],
      useCases: ['Season progression modeling', 'Weekly prediction validation', 'Real-time strategy testing']
    },
    {
      id: 'expanding_window',
      name: 'Expanding Window Validation',
      icon: '📈',
      type: 'expanding_window',
      windowSize: 0,
      stepSize: 1,
      minTrainSize: 4,
      maxTrainSize: undefined,
      preserveOrder: true,
      allowDataLeakage: false,
      description: 'Growing training window that starts small and expands to include all historical data',
      implementation: 'Start with minimum training size and grow window with each validation step',
      advantages: ['Uses all available data', 'Stable performance metrics', 'Good for trend analysis'],
      disadvantages: ['May include outdated patterns', 'Slower adaptation to changes', 'Computational overhead'],
      useCases: ['Long-term trend analysis', 'Career progression modeling', 'Historical performance evaluation']
    },
    {
      id: 'rolling_window',
      name: 'Rolling Window Validation',
      icon: '🎡',
      type: 'rolling_window',
      windowSize: 8,
      stepSize: 1,
      minTrainSize: 8,
      maxTrainSize: 8,
      preserveOrder: true,
      allowDataLeakage: false,
      description: 'Fixed-size sliding window that maintains constant training period length',
      implementation: 'Slide window through time keeping training size constant',
      advantages: ['Consistent data volume', 'Adapts to recent patterns', 'Efficient computation'],
      disadvantages: ['May miss long-term trends', 'Less stable than expanding', 'Window size tuning needed'],
      useCases: ['Recent form analysis', 'Injury recovery patterns', 'Short-term consistency evaluation']
    },
    {
      id: 'blocked_time_series',
      name: 'Blocked Time Series Validation',
      icon: '🧱',
      type: 'blocked_time_series',
      windowSize: 4,
      stepSize: 4,
      minTrainSize: 8,
      maxTrainSize: 16,
      preserveOrder: true,
      allowDataLeakage: false,
      description: 'Non-overlapping blocks of time periods for independent validation splits',
      implementation: 'Divide timeline into discrete blocks with gaps between train/test periods',
      advantages: ['Independent validation sets', 'Prevents temporal leakage', 'Clear separation'],
      disadvantages: ['Wastes data with gaps', 'Fewer validation points', 'May miss transitions'],
      useCases: ['Season-to-season validation', 'Draft class analysis', 'Multi-year trend detection']

  ];

  // Bootstrap resampling methods configuration
  const bootstrapMethods: BootstrapConfig[] = [
    {
      id: 'basic_bootstrap',
      name: 'Basic Bootstrap',
      icon: '🎲',
      type: 'basic',
      nBootstraps: 1000,
      sampleSize: undefined,
      replacement: true,
      confidenceLevel: 0.95,
      description: 'Standard bootstrap resampling with replacement from the original dataset',
      implementation: 'Randomly sample N observations with replacement to create bootstrap samples',
      advantages: ['Simple and intuitive', 'Works with any distribution', 'Provides confidence intervals'],
      disadvantages: ['May not preserve data structure', 'Assumes independence', 'Can underestimate variance'],
      useCases: ['General uncertainty quantification', 'Confidence intervals', 'Model stability assessment']
    },
    {
      id: 'stratified_bootstrap',
      name: 'Stratified Bootstrap',
      icon: '📊',
      type: 'stratified',
      nBootstraps: 1000,
      sampleSize: undefined,
      replacement: true,
      stratifyColumn: 'position',
      confidenceLevel: 0.95,
      description: 'Bootstrap that preserves class proportions by sampling within each stratum',
      implementation: 'Sample proportionally from each class/group to maintain original distribution',
      advantages: ['Preserves class balance', 'Better for imbalanced data', 'More representative samples'],
      disadvantages: ['Requires categorical variable', 'More complex implementation', 'May miss rare interactions'],
      useCases: ['Position-based sampling', 'Imbalanced datasets', 'Multi-class validation']
    },
    {
      id: 'block_bootstrap',
      name: 'Block Bootstrap',
      icon: '🧱',
      type: 'block',
      nBootstraps: 1000,
      sampleSize: undefined,
      blockSize: 4,
      replacement: true,
      confidenceLevel: 0.95,
      description: 'Bootstrap that samples contiguous blocks to preserve temporal or spatial dependencies',
      implementation: 'Sample overlapping or non-overlapping blocks of consecutive observations',
      advantages: ['Preserves dependencies', 'Good for time series', 'Maintains local patterns'],
      disadvantages: ['Block size selection critical', 'Less efficient sampling', 'May miss long-term patterns'],
      useCases: ['Time series data', 'Weekly fantasy patterns', 'Seasonal dependencies']
    },
    {
      id: 'parametric_bootstrap',
      name: 'Parametric Bootstrap',
      icon: '📈',
      type: 'parametric',
      nBootstraps: 1000,
      sampleSize: undefined,
      replacement: true,
      distribution: 'normal',
      confidenceLevel: 0.95,
      description: 'Bootstrap based on assumed parametric distribution fitted to the data',
      implementation: 'Fit distribution to data, then generate samples from fitted distribution',
      advantages: ['Model-based uncertainty', 'Smooth estimates', 'Extrapolation possible'],
      disadvantages: ['Distribution assumption required', 'May miss non-parametric features', 'Model misspecification risk'],
      useCases: ['Well-understood distributions', 'Smooth confidence bands', 'Prediction intervals']

  ];

  // Calibration methods configuration
  const calibrationMethods = [
    {
      id: 'platt_scaling',
      name: 'Platt Scaling',
      icon: '🎯',
      type: 'parametric',
      description: 'Parametric calibration using sigmoid function to map predictions to probabilities',
      implementation: 'Train logistic regression on hold-out set using model outputs as features',
      formula: 'P(y=1|f) = 1 / (1 + exp(A*f + B))',
      complexity: 'Low',
      dataRequirement: 'Small hold-out set',
      advantages: [
        'Simple and fast implementation',
        'Effective for small datasets',
        'Well-established theoretical foundation',
        'Monotonic calibration mapping'
      ],
      disadvantages: [
        'Assumes sigmoid relationship',
        'May overfit on small datasets',
        'Limited flexibility for complex patterns',
        'Requires additional validation data'
      ],
      useCases: [
        'Binary classification tasks',
        'Small to medium datasets',
        'Real-time calibration needs',
        'Linear probability relationships'
      ],
      fantasyApplications: [
        'Player performance probability calibration',
        'Binary outcomes (injury, breakout)',
        'Draft pick success probability',
        'Win/loss predictions'

    },
    {
      id: 'isotonic_regression',
      name: 'Isotonic Regression',
      icon: '📊',
      type: 'non_parametric',
      description: 'Non-parametric calibration preserving monotonic relationship between predictions and probabilities',
      implementation: 'Fit isotonic regression to map model outputs to calibrated probabilities',
      formula: 'P_cal = isotonic_fit(P_raw)',
      complexity: 'Medium',
      dataRequirement: 'Medium-sized hold-out set',
      advantages: [
        'No distributional assumptions',
        'Preserves ranking order',
        'Flexible calibration curves',
        'Handles non-linear relationships'
      ],
      disadvantages: [
        'Can overfit to calibration data',
        'Step-wise function artifacts',
        'Requires more data than Platt scaling',
        'May reduce discriminative performance'
      ],
      useCases: [
        'Non-linear probability relationships',
        'Ranking preservation important',
        'Large calibration datasets',
        'Complex prediction patterns'
      ],
      fantasyApplications: [
        'Player ranking calibration',
        'Multi-class position predictions',
        'Performance tier classifications',
        'Trade value assessments'

    },
    {
      id: 'bayesian_calibration',
      name: 'Bayesian Calibration',
      icon: '🧠',
      type: 'bayesian',
      description: 'Bayesian approach incorporating prior knowledge and uncertainty quantification',
      implementation: 'Use Bayesian inference to estimate calibration mapping with uncertainty',
      formula: 'P(y|x) = ∫ P(y|θ,x) P(θ|D) dθ',
      complexity: 'High',
      dataRequirement: 'Variable with priors',
      advantages: [
        'Incorporates prior knowledge',
        'Quantifies calibration uncertainty',
        'Principled Bayesian framework',
        'Handles small datasets well'
      ],
      disadvantages: [
        'Computationally intensive',
        'Requires prior specification',
        'Complex implementation',
        'Slower inference time'
      ],
      useCases: [
        'Limited training data',
        'Prior knowledge available',
        'Uncertainty quantification needed',
        'High-stakes decisions'
      ],
      fantasyApplications: [
        'Rookie performance prediction',
        'Injury recovery probability',
        'Career trajectory modeling',
        'Draft value uncertainty'

    },
    {
      id: 'temperature_scaling',
      name: 'Temperature Scaling',
      icon: '🌡️',
      type: 'parametric',
      description: 'Single-parameter scaling method adjusting confidence of neural network predictions',
      implementation: 'Learn single temperature parameter T to scale logits before softmax',
      formula: 'P_cal = softmax(z/T)',
      complexity: 'Very Low',
      dataRequirement: 'Small validation set',
      advantages: [
        'Extremely simple - single parameter',
        'Preserves model accuracy',
        'Fast optimization',
        'Works well with neural networks'
      ],
      disadvantages: [
        'Limited to neural network outputs',
        'Single global parameter',
        'May not handle local miscalibration',
        'Assumes uniform miscalibration'
      ],
      useCases: [
        'Neural network calibration',
        'Multi-class problems',
        'Preserving top-1 accuracy',
        'Large-scale applications'
      ],
      fantasyApplications: [
        'Deep learning player predictions',
        'Multi-position classifications',
        'Ensemble model calibration',
        'Neural ranking systems'

  ];

  // Performance metrics configuration
  const performanceMetrics: PerformanceMetric[] = [
    // Classification Metrics
    {
      id: 'accuracy',
      name: 'Accuracy',
      category: 'classification' as MetricCategory,
      description: 'Proportion of correct predictions among total predictions',
      formula: 'Accuracy = (TP + TN) / (TP + TN + FP + FN)',
      interpretation: 'Higher values indicate better overall performance',
      range: '[0, 1]',
      higherIsBetter: true,
      useCases: ['Balanced datasets', 'Overall performance assessment', 'Simple classification tasks'],
      limitations: ['Misleading with imbalanced data', 'Ignores class-specific performance', 'Can hide poor minority class performance']
    },
    {
      id: 'precision',
      name: 'Precision',
      category: 'classification' as MetricCategory,
      description: 'Proportion of true positives among predicted positives',
      formula: 'Precision = TP / (TP + FP)',
      interpretation: 'Higher values mean fewer false positives',
      range: '[0, 1]',
      higherIsBetter: true,
      useCases: ['When false positives are costly', 'Quality-focused applications', 'Spam detection'],
      limitations: ['Ignores false negatives', 'Can be high with low recall', 'Sensitive to class distribution']
    },
    {
      id: 'recall',
      name: 'Recall (Sensitivity)',
      category: 'classification' as MetricCategory,
      description: 'Proportion of true positives among actual positives',
      formula: 'Recall = TP / (TP + FN)',
      interpretation: 'Higher values mean fewer missed positive cases',
      range: '[0, 1]',
      higherIsBetter: true,
      useCases: ['When false negatives are costly', 'Medical diagnosis', 'Fraud detection'],
      limitations: ['Ignores false positives', 'Can be high with low precision', 'May favor over-prediction']
    },
    {
      id: 'f1_score',
      name: 'F1-Score',
      category: 'classification' as MetricCategory,
      description: 'Harmonic mean of precision and recall',
      formula: 'F1 = 2 × (Precision × Recall) / (Precision + Recall)',
      interpretation: 'Balances precision and recall, higher is better',
      range: '[0, 1]',
      higherIsBetter: true,
      useCases: ['Imbalanced datasets', 'Need balance of precision/recall', 'Single performance metric'],
      limitations: ['Equal weight to precision/recall', 'Ignores true negatives', 'Can be misleading with very imbalanced data']
    },
    {
      id: 'auc_roc',
      name: 'AUC-ROC',
      category: 'classification' as MetricCategory,
      description: 'Area under the ROC curve, measuring separability',
      formula: 'AUC = ∫ TPR d(FPR)',
      interpretation: 'Higher values indicate better discrimination ability',
      range: '[0, 1]',
      higherIsBetter: true,
      useCases: ['Binary classification', 'Ranking problems', 'Threshold-independent evaluation'],
      limitations: ['Optimistic with imbalanced data', 'Hard to interpret', 'May not reflect real-world performance']
    },
    // Regression Metrics
    {
      id: 'mse',
      name: 'Mean Squared Error',
      category: 'regression' as MetricCategory,
      description: 'Average of squared differences between predicted and actual values',
      formula: 'MSE = (1/n) ∑(yᵢ - ŷᵢ)²',
      interpretation: 'Lower values indicate better fit, penalizes large errors heavily',
      range: '[0, ∞)',
      higherIsBetter: false,
      useCases: ['Continuous predictions', 'When large errors are very bad', 'Optimization objective'],
      limitations: ['Sensitive to outliers', 'Units are squared', 'Hard to interpret scale']
    },
    {
      id: 'mae',
      name: 'Mean Absolute Error',
      category: 'regression' as MetricCategory,
      description: 'Average of absolute differences between predicted and actual values',
      formula: 'MAE = (1/n) ∑|yᵢ - ŷᵢ|',
      interpretation: 'Lower values indicate better fit, robust to outliers',
      range: '[0, ∞)',
      higherIsBetter: false,
      useCases: ['When outliers are present', 'Robust error measurement', 'Interpretable metric'],
      limitations: ['Treats all errors equally', 'Less sensitive to large errors', 'May not penalize worst predictions']
    },
    {
      id: 'r_squared',
      name: 'R-Squared',
      category: 'regression' as MetricCategory,
      description: 'Proportion of variance in target explained by the model',
      formula: 'R² = 1 - SS_res / SS_tot',
      interpretation: 'Higher values indicate better explanatory power',
      range: '(-∞, 1]',
      higherIsBetter: true,
      useCases: ['Model comparison', 'Explanatory analysis', 'Variance explanation'],
      limitations: ['Can be negative', 'Affected by number of features', 'Not suitable for all regression types']
    },
    {
      id: 'mape',
      name: 'Mean Absolute Percentage Error',
      category: 'regression' as MetricCategory,
      description: 'Average of absolute percentage errors',
      formula: 'MAPE = (100/n) ∑|yᵢ - ŷᵢ| / |yᵢ|',
      interpretation: 'Lower percentage indicates better relative accuracy',
      range: '[0, ∞)',
      higherIsBetter: false,
      useCases: ['Percentage-based errors', 'Scale-independent comparison', 'Business metrics'],
      limitations: ['Division by zero issues', 'Biased toward low values', 'Asymmetric penalty']
    },
    // Fantasy-Specific Metrics
    {
      id: 'points_accuracy',
      name: 'Points Accuracy',
      category: 'fantasy' as MetricCategory,
      description: 'Accuracy of fantasy point predictions within tolerance',
      formula: 'Points Accuracy = Count(|predicted - actual| < threshold) / Total',
      interpretation: 'Higher values indicate more accurate point predictions',
      range: '[0, 1]',
      higherIsBetter: true,
      useCases: ['Fantasy point predictions', 'Player performance evaluation', 'Lineup optimization'],
      limitations: ['Threshold dependent', 'May miss systematic bias', 'Ignores magnitude of errors']
    },
    {
      id: 'ranking_accuracy',
      name: 'Ranking Accuracy',
      category: 'fantasy' as MetricCategory,
      description: 'Accuracy of player ranking predictions',
      formula: 'Ranking Accuracy = 1 - (Kendall Tau Distance / Max Distance)',
      interpretation: 'Higher values indicate better ranking predictions',
      range: '[0, 1]',
      higherIsBetter: true,
      useCases: ['Draft rankings', 'Weekly rankings', 'Player tiers'],
      limitations: ['Position-sensitive', 'May not reflect fantasy relevance', 'Equal weight to all positions']
    },
    {
      id: 'bust_detection',
      name: 'Bust Detection',
      category: 'fantasy' as MetricCategory,
      description: 'Ability to identify players who significantly underperform',
      formula: 'Bust Detection = TP_busts / (TP_busts + FN_busts)',
      interpretation: 'Higher values indicate better bust identification',
      range: '[0, 1]',
      higherIsBetter: true,
      useCases: ['Draft strategy', 'Risk assessment', 'Avoid disappointments'],
      limitations: ['Bust definition subjective', 'May be conservative', 'Class imbalance issues']
    },
    {
      id: 'sleeper_identification',
      name: 'Sleeper Identification',
      category: 'fantasy' as MetricCategory,
      description: 'Ability to identify undervalued players who outperform',
      formula: 'Sleeper ID = TP_sleepers / (TP_sleepers + FN_sleepers)',
      interpretation: 'Higher values indicate better sleeper detection',
      range: '[0, 1]',
      higherIsBetter: true,
      useCases: ['Finding value picks', 'Late-round gems', 'Competitive advantage'],
      limitations: ['Sleeper definition varies', 'Rare event prediction', 'Market efficiency limits']

  ];

  const metricCategories = [
    { id: 'classification', name: 'Classification', icon: '🎯', description: 'Metrics for binary and multi-class classification problems' },
    { id: 'regression', name: 'Regression', icon: '📈', description: 'Metrics for continuous value prediction problems' },
    { id: 'ranking', name: 'Ranking', icon: '📊', description: 'Metrics for ordering and ranking prediction problems' },
    { id: 'calibration', name: 'Calibration', icon: '⚖️', description: 'Metrics for probability calibration and reliability' },
    { id: 'fantasy', name: 'Fantasy Football', icon: '🏈', description: 'Domain-specific metrics for fantasy football performance' }
  ];

  const modelTypes = [
    { id: 'neural_network', name: 'Neural Network', icon: '🧠', description: 'Deep learning model with multiple layers' },
    { id: 'random_forest', name: 'Random Forest', icon: '🌲', description: 'Ensemble of decision trees' },
    { id: 'gradient_boosting', name: 'Gradient Boosting', icon: '🚀', description: 'Sequential boosting algorithm' },
    { id: 'linear_regression', name: 'Linear Regression', icon: '📏', description: 'Linear relationship modeling' },
    { id: 'svm', name: 'Support Vector Machine', icon: '⚡', description: 'Maximum margin classifier' }
  ];

  // Bias-variance analysis experiments
  const biasVarianceExperiments: BiasVarianceExperiment[] = [
    {
      id: 'polynomial_complexity',
      name: 'Polynomial Degree Analysis',
      modelComplexity: 1,
      description: 'Analyze bias-variance trade-off by varying polynomial degree from 1 to 20',
      expectedBias: 0.45,
      expectedVariance: 0.15,
      expectedNoise: 0.10,
      totalError: 0.70,
      decompositionMethod: 'bootstrap'
    },
    {
      id: 'neural_depth',
      name: 'Neural Network Depth',
      modelComplexity: 2,
      description: 'Study bias-variance by varying number of hidden layers in neural networks',
      expectedBias: 0.35,
      expectedVariance: 0.25,
      expectedNoise: 0.10,
      totalError: 0.70,
      decompositionMethod: 'bootstrap'
    },
    {
      id: 'tree_depth',
      name: 'Decision Tree Depth',
      modelComplexity: 5,
      description: 'Examine bias-variance trade-off with different tree maximum depths',
      expectedBias: 0.30,
      expectedVariance: 0.35,
      expectedNoise: 0.10,
      totalError: 0.75,
      decompositionMethod: 'bootstrap'
    },
    {
      id: 'ensemble_size',
      name: 'Ensemble Size Impact',
      modelComplexity: 10,
      description: 'Evaluate how ensemble size affects bias-variance decomposition',
      expectedBias: 0.25,
      expectedVariance: 0.20,
      expectedNoise: 0.10,
      totalError: 0.55,
      decompositionMethod: 'bootstrap'
    },
    {
      id: 'regularization_strength',
      name: 'Regularization Analysis',
      modelComplexity: 8,
      description: 'Study bias-variance with different L1/L2 regularization strengths',
      expectedBias: 0.40,
      expectedVariance: 0.15,
      expectedNoise: 0.10,
      totalError: 0.65,
      decompositionMethod: 'analytical'

  ];

  // Model complexity configurations
  const complexityConfigs: ModelComplexityConfig[] = [
    {
      id: 'polynomial',
      name: 'Polynomial Regression',
      description: 'Varying polynomial degree to control model complexity',
      complexityParameter: 'degree',
      minComplexity: 1,
      maxComplexity: 20,
      stepSize: 1,
      optimizationTarget: 'total_error',
      regularization: false,
      crossValidation: true
    },
    {
      id: 'neural_network',
      name: 'Neural Network',
      description: 'Varying number of hidden layers and neurons',
      complexityParameter: 'hidden_layers',
      minComplexity: 1,
      maxComplexity: 10,
      stepSize: 1,
      optimizationTarget: 'generalization',
      regularization: true,
      crossValidation: true
    },
    {
      id: 'decision_tree',
      name: 'Decision Tree',
      description: 'Varying maximum depth of decision trees',
      complexityParameter: 'max_depth',
      minComplexity: 1,
      maxComplexity: 15,
      stepSize: 1,
      optimizationTarget: 'total_error',
      regularization: false,
      crossValidation: true
    },
    {
      id: 'random_forest',
      name: 'Random Forest',
      description: 'Varying number of trees in the ensemble',
      complexityParameter: 'n_estimators',
      minComplexity: 10,
      maxComplexity: 200,
      stepSize: 10,
      optimizationTarget: 'variance',
      regularization: false,
      crossValidation: true
    },
    {
      id: 'svm',
      name: 'Support Vector Machine',
      description: 'Varying regularization parameter C',
      complexityParameter: 'C',
      minComplexity: 0.01,
      maxComplexity: 100,
      stepSize: 0.1,
      optimizationTarget: 'total_error',
      regularization: true,
      crossValidation: true

  ];

  // Learning curve experiments
  const learningCurveExperiments: LearningCurveExperiment[] = [
    {
      id: 'neural_network_learning',
      name: 'Neural Network Convergence',
      description: 'Analyze how neural network performance improves with training data size',
      modelType: 'neural_network',
      sampleSizeRange: [100, 5000],
      stepSize: 100,
      convergenceThreshold: 0.01,
      expectedConvergencePoint: 2500,
      dataEfficiency: 'medium',
      convergenceRate: 'medium'
    },
    {
      id: 'random_forest_learning',
      name: 'Random Forest Data Scaling',
      description: 'Study random forest performance scaling with dataset size',
      modelType: 'random_forest',
      sampleSizeRange: [50, 3000],
      stepSize: 50,
      convergenceThreshold: 0.005,
      expectedConvergencePoint: 1500,
      dataEfficiency: 'high',
      convergenceRate: 'fast'
    },
    {
      id: 'linear_regression_learning',
      name: 'Linear Model Efficiency',
      description: 'Examine linear regression data efficiency and convergence patterns',
      modelType: 'linear_regression',
      sampleSizeRange: [50, 2000],
      stepSize: 50,
      convergenceThreshold: 0.02,
      expectedConvergencePoint: 800,
      dataEfficiency: 'high',
      convergenceRate: 'fast'
    },
    {
      id: 'gradient_boosting_learning',
      name: 'Gradient Boosting Scaling',
      description: 'Analyze gradient boosting performance with increasing data volumes',
      modelType: 'gradient_boosting',
      sampleSizeRange: [100, 4000],
      stepSize: 100,
      convergenceThreshold: 0.008,
      expectedConvergencePoint: 2000,
      dataEfficiency: 'medium',
      convergenceRate: 'medium'
    },
    {
      id: 'ensemble_learning',
      name: 'Ensemble Learning Curves',
      description: 'Study ensemble method convergence and data requirements',
      modelType: 'ensemble',
      sampleSizeRange: [200, 6000],
      stepSize: 200,
      convergenceThreshold: 0.005,
      expectedConvergencePoint: 3500,
      dataEfficiency: 'low',
      convergenceRate: 'slow'

  ];

  // Data size configurations
  const dataSizeConfigs: DataSizeConfig[] = [
    {
      id: 'logarithmic',
      name: 'Logarithmic Scaling',
      description: 'Sample sizes increase logarithmically for efficient exploration',
      minSamples: 50,
      maxSamples: 5000,
      stepStrategy: 'logarithmic',
      validationRatio: 0.2,
      crossValidationFolds: 5,
      randomState: 42
    },
    {
      id: 'linear',
      name: 'Linear Scaling',
      description: 'Sample sizes increase linearly for detailed analysis',
      minSamples: 100,
      maxSamples: 3000,
      stepStrategy: 'linear',
      validationRatio: 0.25,
      crossValidationFolds: 5,
      randomState: 42
    },
    {
      id: 'exponential',
      name: 'Exponential Scaling',
      description: 'Sample sizes increase exponentially for rapid exploration',
      minSamples: 100,
      maxSamples: 8000,
      stepStrategy: 'exponential',
      validationRatio: 0.2,
      crossValidationFolds: 3,
      randomState: 42

  ];

  // Helper functions for cross-validation analysis
  const getCVComplexityScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'k_fold': '⭐⭐',
      'stratified_k_fold': '⭐⭐⭐',
      'time_series_split': '⭐⭐⭐⭐',
      'group_k_fold': '⭐⭐⭐',
      'nested_cv': '⭐⭐⭐⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getCVReliabilityScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'nested_cv': '⭐⭐⭐⭐⭐',
      'stratified_k_fold': '⭐⭐⭐⭐',
      'group_k_fold': '⭐⭐⭐⭐',
      'time_series_split': '⭐⭐⭐⭐',
      'k_fold': '⭐⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getCVEfficiencyScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'k_fold': '⭐⭐⭐⭐⭐',
      'stratified_k_fold': '⭐⭐⭐⭐',
      'group_k_fold': '⭐⭐⭐⭐',
      'time_series_split': '⭐⭐⭐',
      'nested_cv': '⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getCVFantasyScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'time_series_split': '⭐⭐⭐⭐⭐',
      'group_k_fold': '⭐⭐⭐⭐⭐',
      'stratified_k_fold': '⭐⭐⭐⭐',
      'nested_cv': '⭐⭐⭐⭐',
      'k_fold': '⭐⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  // Helper functions for holdout validation analysis
  const getHoldoutSimplicityScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'simple_holdout': '⭐⭐⭐⭐⭐',
      'stratified_holdout': '⭐⭐⭐⭐',
      'grouped_holdout': '⭐⭐⭐',
      'temporal_holdout': '⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getHoldoutReliabilityScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'temporal_holdout': '⭐⭐⭐⭐⭐',
      'grouped_holdout': '⭐⭐⭐⭐⭐',
      'stratified_holdout': '⭐⭐⭐⭐',
      'simple_holdout': '⭐⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getHoldoutSpeedScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'simple_holdout': '⭐⭐⭐⭐⭐',
      'stratified_holdout': '⭐⭐⭐⭐',
      'grouped_holdout': '⭐⭐⭐⭐',
      'temporal_holdout': '⭐⭐⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getHoldoutFantasyScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'temporal_holdout': '⭐⭐⭐⭐⭐',
      'grouped_holdout': '⭐⭐⭐⭐',
      'stratified_holdout': '⭐⭐⭐',
      'simple_holdout': '⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getHoldoutDataLeakageRisk = (methodId: string): string => {
    const risks: Record<string, string> = {
      'simple_holdout': 'Low',
      'stratified_holdout': 'Low', 
      'grouped_holdout': 'Very Low',
      'temporal_holdout': 'Minimal'
    };
    return risks[methodId] || 'Unknown';
  };

  const getHoldoutBestUseCase = (methodId: string): string => {
    const useCases: Record<string, string> = {
      'simple_holdout': 'Quick model evaluation with balanced datasets',
      'stratified_holdout': 'Maintaining class distributions in classification tasks',
      'grouped_holdout': 'Player-based validation to prevent data leakage',
      'temporal_holdout': 'Time-aware validation for seasonal patterns'
    };
    return useCases[methodId] || 'General validation';
  };

  // Simulate holdout validation experiment
  const runHoldoutExperiment = async () => {
    try {

    setHoldoutExperimentRunning(true);
    setHoldoutProgress(0);

    const selectedMethod = holdoutMethods.find((m: any) => m.id === selectedHoldoutMethod);
    if (!selectedMethod) return;

    // Simulate experiment progress
    const steps = ['Data Loading', 'Split Generation', 'Model Training', 'Evaluation', 'Analysis'];
    
    for (let step = 0; step < steps.length; step++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setHoldoutProgress((step + 1) / steps.length * 100);
    
    } catch (error) {
      console.error('Error in runHoldoutExperiment:', error);

    } catch (error) {
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
    const scores: Record<string, string> = {
      'walk_forward': '⭐⭐⭐',
      'expanding_window': '⭐⭐',
      'rolling_window': '⭐⭐⭐',
      'blocked_time_series': '⭐⭐⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getTimeSeriesReliabilityScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'walk_forward': '⭐⭐⭐⭐⭐',
      'blocked_time_series': '⭐⭐⭐⭐⭐',
      'expanding_window': '⭐⭐⭐⭐',
      'rolling_window': '⭐⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getTimeSeriesEfficiencyScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'rolling_window': '⭐⭐⭐⭐⭐',
      'expanding_window': '⭐⭐⭐⭐',
      'walk_forward': '⭐⭐⭐',
      'blocked_time_series': '⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getTimeSeriesFantasyScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'walk_forward': '⭐⭐⭐⭐⭐',
      'rolling_window': '⭐⭐⭐⭐',
      'blocked_time_series': '⭐⭐⭐⭐',
      'expanding_window': '⭐⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getTimeSeriesDataUsage = (methodId: string): string => {
    const usage: Record<string, string> = {
      'expanding_window': 'Maximum - uses all historical data',
      'walk_forward': 'Progressive - incremental data usage',
      'rolling_window': 'Fixed - consistent window size',
      'blocked_time_series': 'Segmented - discrete time blocks'
    };
    return usage[methodId] || 'Variable usage';
  };

  const getTimeSeriesBestUseCase = (methodId: string): string => {
    const useCases: Record<string, string> = {
      'walk_forward': 'Live prediction simulation and season progression',
      'expanding_window': 'Long-term trend analysis and career modeling',
      'rolling_window': 'Recent form analysis and injury recovery patterns',
      'blocked_time_series': 'Independent season validation and draft analysis'
    };
    return useCases[methodId] || 'General time series validation';
  };

  // Helper functions for bootstrap resampling analysis
  const getBootstrapComplexityScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'basic_bootstrap': '⭐⭐',
      'stratified_bootstrap': '⭐⭐⭐',
      'block_bootstrap': '⭐⭐⭐⭐',
      'parametric_bootstrap': '⭐⭐⭐⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getBootstrapReliabilityScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'parametric_bootstrap': '⭐⭐⭐⭐⭐',
      'block_bootstrap': '⭐⭐⭐⭐',
      'stratified_bootstrap': '⭐⭐⭐⭐',
      'basic_bootstrap': '⭐⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getBootstrapEfficiencyScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'basic_bootstrap': '⭐⭐⭐⭐⭐',
      'stratified_bootstrap': '⭐⭐⭐⭐',
      'block_bootstrap': '⭐⭐⭐',
      'parametric_bootstrap': '⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getBootstrapFantasyScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'stratified_bootstrap': '⭐⭐⭐⭐⭐',
      'block_bootstrap': '⭐⭐⭐⭐',
      'parametric_bootstrap': '⭐⭐⭐',
      'basic_bootstrap': '⭐⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getBootstrapDataUsage = (methodId: string): string => {
    const usage: Record<string, string> = {
      'basic_bootstrap': '100% with replacement',
      'stratified_bootstrap': '100% stratified sampling',
      'block_bootstrap': '~90% block sampling',
      'parametric_bootstrap': 'Model-based generation'
    };
    return usage[methodId] || 'Variable usage';
  };

  const getBootstrapBestUseCase = (methodId: string): string => {
    const useCases: Record<string, string> = {
      'basic_bootstrap': 'General uncertainty quantification and confidence intervals',
      'stratified_bootstrap': 'Position-balanced sampling and imbalanced datasets',
      'block_bootstrap': 'Time-dependent data and seasonal fantasy patterns',
      'parametric_bootstrap': 'Model-based uncertainty and smooth predictions'
    };
    return useCases[methodId] || 'General bootstrap resampling';
  };

  // Helper functions for calibration analysis
  const getCalibrationComplexityScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'temperature_scaling': '⭐',
      'platt_scaling': '⭐⭐',
      'isotonic_regression': '⭐⭐⭐',
      'bayesian_calibration': '⭐⭐⭐⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getCalibrationReliabilityScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'bayesian_calibration': '⭐⭐⭐⭐⭐',
      'isotonic_regression': '⭐⭐⭐⭐',
      'platt_scaling': '⭐⭐⭐',
      'temperature_scaling': '⭐⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getCalibrationEfficiencyScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'temperature_scaling': '⭐⭐⭐⭐⭐',
      'platt_scaling': '⭐⭐⭐⭐',
      'isotonic_regression': '⭐⭐⭐',
      'bayesian_calibration': '⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getCalibrationFantasyScore = (methodId: string): string => {
    const scores: Record<string, string> = {
      'isotonic_regression': '⭐⭐⭐⭐⭐',
      'bayesian_calibration': '⭐⭐⭐⭐',
      'platt_scaling': '⭐⭐⭐⭐',
      'temperature_scaling': '⭐⭐⭐'
    };
    return scores[methodId] || '⭐';
  };

  const getCalibrationDataRequirement = (methodId: string): string => {
    const requirements: Record<string, string> = {
      'temperature_scaling': 'Minimal - single parameter',
      'platt_scaling': 'Small - hold-out validation set',
      'isotonic_regression': 'Medium - sufficient calibration data',
      'bayesian_calibration': 'Variable - depends on priors'
    };
    return requirements[methodId] || 'Variable requirement';
  };

  const getCalibrationBestUseCase = (methodId: string): string => {
    const useCases: Record<string, string> = {
      'temperature_scaling': 'Neural networks with preserved accuracy requirements',
      'platt_scaling': 'Binary classification with parametric assumptions',
      'isotonic_regression': 'Ranking preservation and non-linear relationships',
      'bayesian_calibration': 'Limited data with domain expertise and uncertainty needs'
    };
    return useCases[methodId] || 'General probability calibration';
  };

  const getCalibrationPreservesRanking = (methodId: string): boolean => {
    const preserves: Record<string, boolean> = {
      'temperature_scaling': true,
      'platt_scaling': true,
      'isotonic_regression': true,
      'bayesian_calibration': false
    };
    return preserves[methodId] || false;
  };

  // Helper functions for performance metrics analysis
  const getMetricImportanceScore = (metricId: string): string => {
    const scores: Record<string, string> = {
      'accuracy': '⭐⭐⭐⭐',
      'precision': '⭐⭐⭐⭐',
      'recall': '⭐⭐⭐⭐',
      'f1_score': '⭐⭐⭐⭐⭐',
      'auc_roc': '⭐⭐⭐⭐⭐',
      'mse': '⭐⭐⭐⭐',
      'mae': '⭐⭐⭐⭐',
      'r_squared': '⭐⭐⭐⭐⭐',
      'mape': '⭐⭐⭐',
      'points_accuracy': '⭐⭐⭐⭐⭐',
      'ranking_accuracy': '⭐⭐⭐⭐⭐',
      'bust_detection': '⭐⭐⭐⭐',
      'sleeper_identification': '⭐⭐⭐⭐'
    };
    return scores[metricId] || '⭐';
  };

  const getMetricInterpretabilityScore = (metricId: string): string => {
    const scores: Record<string, string> = {
      'accuracy': '⭐⭐⭐⭐⭐',
      'precision': '⭐⭐⭐⭐',
      'recall': '⭐⭐⭐⭐',
      'f1_score': '⭐⭐⭐',
      'auc_roc': '⭐⭐',
      'mse': '⭐⭐⭐',
      'mae': '⭐⭐⭐⭐⭐',
      'r_squared': '⭐⭐⭐⭐',
      'mape': '⭐⭐⭐⭐⭐',
      'points_accuracy': '⭐⭐⭐⭐⭐',
      'ranking_accuracy': '⭐⭐⭐⭐',
      'bust_detection': '⭐⭐⭐⭐',
      'sleeper_identification': '⭐⭐⭐⭐'
    };
    return scores[metricId] || '⭐';
  };

  const getMetricRobustnessScore = (metricId: string): string => {
    const scores: Record<string, string> = {
      'accuracy': '⭐⭐',
      'precision': '⭐⭐⭐',
      'recall': '⭐⭐⭐',
      'f1_score': '⭐⭐⭐⭐',
      'auc_roc': '⭐⭐⭐⭐⭐',
      'mse': '⭐⭐',
      'mae': '⭐⭐⭐⭐⭐',
      'r_squared': '⭐⭐⭐',
      'mape': '⭐⭐',
      'points_accuracy': '⭐⭐⭐',
      'ranking_accuracy': '⭐⭐⭐⭐',
      'bust_detection': '⭐⭐⭐',
      'sleeper_identification': '⭐⭐'
    };
    return scores[metricId] || '⭐';
  };

  const getMetricFantasyRelevanceScore = (metricId: string): string => {
    const scores: Record<string, string> = {
      'accuracy': '⭐⭐⭐',
      'precision': '⭐⭐⭐',
      'recall': '⭐⭐⭐',
      'f1_score': '⭐⭐⭐',
      'auc_roc': '⭐⭐⭐',
      'mse': '⭐⭐⭐⭐',
      'mae': '⭐⭐⭐⭐',
      'r_squared': '⭐⭐⭐⭐',
      'mape': '⭐⭐⭐⭐',
      'points_accuracy': '⭐⭐⭐⭐⭐',
      'ranking_accuracy': '⭐⭐⭐⭐⭐',
      'bust_detection': '⭐⭐⭐⭐⭐',
      'sleeper_identification': '⭐⭐⭐⭐⭐'
    };
    return scores[metricId] || '⭐';
  };

  // Helper functions for bias-variance analysis
  const getBiasComplexityScore = (experimentId: string): string => {
    const scores: Record<string, string> = {
      'polynomial_complexity': '⭐⭐⭐⭐',
      'neural_depth': '⭐⭐⭐⭐⭐',
      'tree_depth': '⭐⭐⭐',
      'ensemble_size': '⭐⭐',
      'regularization_strength': '⭐⭐⭐⭐'
    };
    return scores[experimentId] || '⭐';
  };

  const getVarianceComplexityScore = (experimentId: string): string => {
    const scores: Record<string, string> = {
      'polynomial_complexity': '⭐⭐⭐',
      'neural_depth': '⭐⭐⭐⭐',
      'tree_depth': '⭐⭐⭐⭐⭐',
      'ensemble_size': '⭐⭐⭐⭐⭐',
      'regularization_strength': '⭐⭐'
    };
    return scores[experimentId] || '⭐';
  };

  const getInterpretabilityScore = (experimentId: string): string => {
    const scores: Record<string, string> = {
      'polynomial_complexity': '⭐⭐⭐⭐',
      'neural_depth': '⭐⭐',
      'tree_depth': '⭐⭐⭐⭐⭐',
      'ensemble_size': '⭐⭐⭐',
      'regularization_strength': '⭐⭐⭐'
    };
    return scores[experimentId] || '⭐';
  };

  const getComputationalComplexityScore = (experimentId: string): string => {
    const scores: Record<string, string> = {
      'polynomial_complexity': '⭐⭐⭐⭐⭐',
      'neural_depth': '⭐⭐',
      'tree_depth': '⭐⭐⭐⭐',
      'ensemble_size': '⭐⭐⭐',
      'regularization_strength': '⭐⭐⭐⭐'
    };
    return scores[experimentId] || '⭐';
  };

  // Helper functions for learning curve analysis
  const getDataEfficiencyScore = (experimentId: string): string => {
    const scores: Record<string, string> = {
      'neural_network_learning': '⭐⭐⭐',
      'random_forest_learning': '⭐⭐⭐⭐⭐',
      'linear_regression_learning': '⭐⭐⭐⭐⭐',
      'gradient_boosting_learning': '⭐⭐⭐',
      'ensemble_learning': '⭐⭐'
    };
    return scores[experimentId] || '⭐';
  };

  const getConvergenceSpeedScore = (experimentId: string): string => {
    const scores: Record<string, string> = {
      'neural_network_learning': '⭐⭐⭐',
      'random_forest_learning': '⭐⭐⭐⭐⭐',
      'linear_regression_learning': '⭐⭐⭐⭐⭐',
      'gradient_boosting_learning': '⭐⭐⭐⭐',
      'ensemble_learning': '⭐⭐'
    };
    return scores[experimentId] || '⭐';
  };

  const getScalabilityScore = (experimentId: string): string => {
    const scores: Record<string, string> = {
      'neural_network_learning': '⭐⭐⭐⭐',
      'random_forest_learning': '⭐⭐⭐⭐',
      'linear_regression_learning': '⭐⭐⭐⭐⭐',
      'gradient_boosting_learning': '⭐⭐⭐',
      'ensemble_learning': '⭐⭐'
    };
    return scores[experimentId] || '⭐';
  };

  const getMemoryEfficiencyScore = (experimentId: string): string => {
    const scores: Record<string, string> = {
      'neural_network_learning': '⭐⭐',
      'random_forest_learning': '⭐⭐⭐',
      'linear_regression_learning': '⭐⭐⭐⭐⭐',
      'gradient_boosting_learning': '⭐⭐⭐',
      'ensemble_learning': '⭐⭐'
    };
    return scores[experimentId] || '⭐';
  };

  // Simulate time series validation experiment
  const runTimeSeriesExperiment = async () => {
    try {

    setTimeSeriesExperimentRunning(true);
    setTimeSeriesProgress(0);

    const selectedMethod = timeSeriesMethods.find((m: any) => m.id === selectedTimeSeriesMethod);
    if (!selectedMethod) return;

    // Simulate experiment progress
    const steps = ['Data Preparation', 'Time Split Generation', 'Model Training', 'Window Validation', 'Results Aggregation'];
    
    for (let step = 0; step < steps.length; step++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setTimeSeriesProgress((step + 1) / steps.length * 100);
    
    } catch (error) {
      console.error('Error in runTimeSeriesExperiment:', error);

    } catch (error) {
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
      const trainStart = currentStart;
      let trainEnd, testStart, testEnd;

      switch (selectedMethod.id) {
        case 'walk_forward':
          trainEnd = Math.min(trainStart + minTrainSize + splitIndex, totalWeeks - 1);
          testStart = trainEnd;
          testEnd = Math.min(testStart + 1, totalWeeks);
          break;
        case 'expanding_window':
          trainEnd = Math.min(trainStart + minTrainSize + splitIndex * 2, totalWeeks - 1);
          testStart = trainEnd;
          testEnd = Math.min(testStart + 1, totalWeeks);
          break;
        case 'rolling_window':
          trainEnd = Math.min(trainStart + windowSize, totalWeeks - 1);
          testStart = trainEnd;
          testEnd = Math.min(testStart + 1, totalWeeks);
          break;
        case 'blocked_time_series':
          trainEnd = Math.min(trainStart + windowSize, totalWeeks - 2);
          testStart = trainEnd + 1; // gap
          testEnd = Math.min(testStart + windowSize, totalWeeks);
          break;
        default:
          trainEnd = trainStart + minTrainSize;
          testStart = trainEnd;
          testEnd = testStart + 1;

      if (testEnd <= totalWeeks) {
        const trainScore = 0.85 + Math.random() * 0.1 - splitIndex * 0.005; // Slight degradation over time
        const testScore = 0.82 + Math.random() * 0.08 - splitIndex * 0.008;

        splits.push({
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
      method: selectedMethod.name,
      totalSplits: splits.length,
      trainSize: Math.round(splits.reduce((sum, s) => sum + parseInt(s.trainPeriod.split('-')[1]) - parseInt(s.trainPeriod.split('-')[0].split(' ')[1]) + 1, 0) / splits.length),
      testSize: 1, // Usually 1 week for fantasy
      windowSize: selectedMethod.windowSize,
      stepSize: selectedMethod.stepSize,
      avgTrainScore,
      avgTestScore,
      scoreStability,
      temporalConsistency: Math.max(0.6, scoreStability + Math.random() * 0.2),
      splits,
      metrics: {
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
    try {

    setBootstrapExperimentRunning(true);
    setBootstrapProgress(0);

    const selectedMethod = bootstrapMethods.find((m: any) => m.id === selectedBootstrapMethod);
    if (!selectedMethod) return;

    // Simulate experiment progress
    const steps = ['Data Preparation', 'Sample Generation', 'Model Training', 'Bootstrap Sampling', 'Confidence Estimation'];
    const totalSteps = steps.length;

    for (let step = 0; step < totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      setBootstrapProgress(((step + 1) / totalSteps) * 100);
    
    } catch (error) {
      console.error('Error in runBootstrapExperiment:', error);

    } catch (error) {
        console.error(error);
    }// Generate realistic bootstrap results with fantasy football context
    const nBootstraps = selectedMethod.nBootstraps;
    const baseScore = 0.78 + Math.random() * 0.15;
    
    // Generate bootstrap scores with method-specific characteristics
    const bootstrapScores = Array.from({ length: nBootstraps }, (_, i) => {
      let score = baseScore;
      
      if (selectedMethod.type === 'basic') {
        score += (Math.random() - 0.5) * 0.1;
      } else if (selectedMethod.type === 'stratified') {
        score += (Math.random() - 0.5) * 0.08 + 0.02; // More stable
      } else if (selectedMethod.type === 'block') {
        score += (Math.random() - 0.5) * 0.12 - 0.01; // More variable
      } else if (selectedMethod.type === 'parametric') {
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
      method: selectedMethod.name,
      nBootstraps: nBootstraps,
      sampleSize: 1000,
      blockSize: selectedMethod.blockSize,
      replacementRatio: selectedMethod.replacement ? 1.0 : 0.8,
      avgScore: avgScore,
      bootstrapScores: bootstrapScores,
      confidenceInterval: {
        lower: sortedScores[lowerIndex],
        upper: sortedScores[upperIndex],
        level: selectedMethod.confidenceLevel
      },
      statistics: {
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
    try {
    setCalibrationExperimentRunning(true);
    setCalibrationProgress(0);

    const selectedMethod = calibrationMethods.find((m: any) => m.id === selectedCalibrationMethod);
    if (!selectedMethod) return;

    // Simulate experiment progress
    const steps = ['Data Preparation', 'Hold-out Split', 'Model Training', 'Calibration Fitting', 'Reliability Assessment'];
    const totalSteps = steps.length;

    for (let step = 0; step < totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));
      setCalibrationProgress(((step + 1) / totalSteps) * 100);
    
    `${(binStart * 100).toFixed(0)}-${(binEnd * 100).toFixed(0)}%`,
        uncalibrated: {
          count: uncalInBin.length,
          meanPrediction: uncalMeanPred,
          accuracy: uncalAccuracy,
          calibrationError: Math.abs(uncalMeanPred - uncalAccuracy)
        },
        calibrated: {
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
      method: selectedMethod.name,
      methodType: selectedMethod.type === 'parametric' ? 'parametric' : 
                 selectedMethod.type === 'bayesian' ? 'bayesian' : 'non_parametric',
      calibrationType: selectedMethod.id === 'platt_scaling' ? 'platt' :
                      selectedMethod.id === 'isotonic_regression' ? 'isotonic' :
                      selectedMethod.id === 'bayesian_calibration' ? 'bayesian' : 'temperature',
      originalBrierScore: uncalBrierScore,
      calibratedBrierScore: calBrierScore,
      brierImprovement: (uncalBrierScore - calBrierScore) / uncalBrierScore,
      reliabilityDiagram: {
        binEdges,
        binMeans,
        binCounts,
        expectedCalibrationError: calECE,
        maximumCalibrationError: Math.max(...reliabilityDiagram.map((b: any) => b.calibrated.calibrationError))
      },
      calibrationMetrics: {
        brierScore: calBrierScore,
        logLoss: -trueLabels.reduce((sum: number, label: number, i: number) => 
          sum + label * Math.log(calibratedPredictions[i]) + (1 - label) * Math.log(1 - calibratedPredictions[i]), 0) / nSamples,
        calibrationError: calECE,
        reliability: 1 - calECE,
        resolution: 0.1 + Math.random() * 0.05,
        uncertainty: 0.15 + Math.random() * 0.05
      },
      parameters: {
        nSamples,
        nBins,
        method: selectedMethod.id,
        preservesRanking: getCalibrationPreservesRanking(selectedMethod.id)
      },
      predictions: {
        original: uncalibratedPredictions.slice(0, 100), // Limit for display
        calibrated: calibratedPredictions.slice(0, 100),
        actualOutcomes: trueLabels.slice(0, 100)
      },
      performanceMetrics: {
        accuracy,
        precision,
        recall,
        f1Score,
        auc: 0.75 + Math.random() * 0.2,
        fantasyAccuracy: 0.78 + Math.random() * 0.15
      },
      calibrationCurve: {
        meanPredicted: binMeans,
        fractionPositives: reliabilityDiagram.map((bin: any) => bin.calibrated.accuracy),
        binCounts

    };

    setCalibrationResults(result);
    setCalibrationExperimentRunning(false);
  };

  // Simulate performance metrics experiment
  const runPerformanceMetricsExperiment = async () => {
    try {

    setMetricsExperimentRunning(true);
    setMetricsProgress(0);

    // Simulate experiment progress
    const steps = ['Model Training', 'Prediction Generation', 'Metrics Calculation', 'Validation Analysis', 'Results Compilation'];
    const totalSteps = steps.length;

    for (let step = 0; step < totalSteps; step++) {
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      setMetricsProgress(((step + 1) / totalSteps) * 100);
    
    } catch (error) {
      console.error('Error in runPerformanceMetricsExperiment:', error);

    } catch (error) {
        console.error(error);
    }// Generate realistic performance metrics based on selected model
    const selectedModelType = modelTypes.find((m: any) => m.id === selectedModel);
    const nSamples = 1000;
    
    // Generate predictions and ground truth
    const predictions = Array.from({ length: nSamples }, () => Math.random());
    const groundTruth = predictions.map((pred: any) => {
      // Add realistic noise based on model type
      let noise = 0;
      switch (selectedModel) {
        case 'neural_network':
          noise = (Math.random() - 0.5) * 0.1;
          break;
        case 'random_forest':
          noise = (Math.random() - 0.5) * 0.12;
          break;
        case 'gradient_boosting':
          noise = (Math.random() - 0.5) * 0.08;
          break;
        case 'linear_regression':
          noise = (Math.random() - 0.5) * 0.15;
          break;
        case 'svm':
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
      classification: {
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
        confusionMatrix
      },
      regression: {
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
    try {

    setBiasVarianceExperimentRunning(true);
    setBiasVarianceProgress(0);

    const selectedConfig = complexityConfigs.find((c: any) => c.id === selectedComplexityModel);
    if (!selectedConfig) return;

    // Simulate experiment progress
    const steps = ['Data Generation', 'Model Training', 'Bootstrap Sampling', 'Bias-Variance Decomposition', 'Visualization Generation'];
    
    for (let step = 0; step < steps.length; step++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBiasVarianceProgress((step + 1) / steps.length * 100);
    
    } catch (error) {
      console.error('Error in runBiasVarianceExperiment:', error);

    } catch (error) {
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
      // Simulate bias-variance decomposition for this complexity level
      const baseNoise = 0.10 + Math.random() * 0.05;
      
      // Bias typically decreases with complexity (until overfitting)
      let bias: number;
      if (complexity < optimalComplexity) {
        // Underfitting region - high bias
        bias = 0.8 * Math.exp(-complexity / 3) + 0.05;
      } else {
        // Overfitting region - increasing bias due to poor generalization
        bias = 0.05 + 0.2 * Math.exp((complexity - optimalComplexity) / 8);

      // Variance typically increases with complexity
      let variance: number;
      if (selectedConfig.regularization) {
        // With regularization, variance increases more slowly
        variance = 0.02 + 0.3 * (1 - Math.exp(-complexity / 5));
      } else {
        // Without regularization, variance increases faster
        variance = 0.02 + 0.5 * (complexity / complexityEnd);

      // Add model-specific adjustments
      switch (selectedConfig.id) {
        case 'polynomial':
          bias = Math.max(0.01, 1.2 * Math.exp(-complexity / 2.5) + 0.02);
          variance = 0.01 + Math.pow(complexity / 20, 2) * 0.4;
          break;
        case 'neural_network':
          bias = Math.max(0.02, 0.6 * Math.exp(-complexity / 2) + 0.02);
          variance = 0.03 + complexity * 0.08 + Math.pow(complexity / 10, 1.5) * 0.1;
          break;
        case 'decision_tree':
          bias = Math.max(0.05, 0.8 * Math.exp(-complexity / 3) + 0.05);
          variance = Math.min(0.6, 0.02 + Math.pow(complexity / 15, 1.8) * 0.4);
          break;
        case 'random_forest':
          bias = Math.max(0.03, 0.4 * Math.exp(-complexity / 50) + 0.03);
          variance = Math.max(0.01, 0.3 * Math.exp(-complexity / 30) + 0.01);
          break;
        case 'svm':
          if (complexity < 1) {
            // Low C (high regularization)
            bias = 0.3 + 0.2 * Math.exp(-complexity * 10);
            variance = 0.05 + complexity * 0.1;
          } else {
            // High C (low regularization)
            bias = 0.05 + 0.1 * Math.exp((complexity - 1) / 10);
            variance = 0.05 + Math.log(complexity) * 0.15;

          break;

      const totalError = bias + variance + baseNoise;
      
      if (totalError < minTotalError) {
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
        modelComplexity: complexity,
        bias: bias,
        variance: variance,
        noise: baseNoise,
        totalError: totalError,
        irreducibleError: baseNoise,
        predictions,
        trueValues,
        decomposition: {
          biasSquared: bias,
          varianceComponent: variance,
          noiseComponent: baseNoise,
          covariance: (Math.random() - 0.5) * 0.05
        },
        metrics: {
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
    try {
    setLearningCurveExperimentRunning(true);
    setLearningCurveProgress(0);

    const selectedExperiment = learningCurveExperiments.find((e: any) => e.id === experimentId);
    if (!selectedExperiment) return;

    // Simulate experiment progress
    const steps = ['Data Generation', 'Model Training', 'Sample Size Scaling', 'Performance Measurement', 'Visualization Generation'];
    for (let step = 0; step < steps.length; step++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLearningCurveProgress((step + 1) / steps.length * 100);
    
    `block-${method.id}-${foldIndex}-${blockIndex}`}
        className={`fold-block ${blockIndex === foldIndex ? 'validation' : 'training'}`}
      >
        {blockIndex === foldIndex ? 'Val' : 'Train'}
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
          <span>{method.shuffle ? 'Yes' : 'No'}</span>
        </div>
        {method.stratifyColumn && (
          <div className="config-item sm:px-4 md:px-6 lg:px-8">
            <span>Stratify:</span>
            <span>{method.stratifyColumn}</span>
          </div>
        )}
        {method.groupColumn && (
          <div className="config-item sm:px-4 md:px-6 lg:px-8">
            <span>Group By:</span>
            <span>{method.groupColumn}</span>
          </div>
        )}
        {method.timeColumn && (
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
    const applications = {
      'k_fold': {
        best: 'General model evaluation with balanced datasets',
        use: 'Overall model performance assessment',
        caution: 'May not preserve temporal relationships or player groupings'
      },
      'stratified_k_fold': {
        best: 'Imbalanced position distributions (more RBs than QBs)',
        use: 'Ensuring fair representation of all positions',
        benefit: 'Prevents bias toward common positions'
      },
      'time_series_split': {
        best: 'Temporal prediction scenarios',
        use: 'Predicting future game performance from historical data',
        critical: 'Prevents future information leakage'
      },
      'group_k_fold': {
        best: 'Player-specific generalization',
        use: 'Testing model performance on unseen players',
        insight: 'Reveals if model learns player-specific vs. general patterns'
      },
      'nested_cv': {
        best: 'Hyperparameter optimization with unbiased evaluation',
        use: 'Model selection for production deployment',
        tradeoff: 'Most reliable but computationally expensive'

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
    try {
    setCvExperimentRunning(true);
    setExperimentProgress(0);

    const selectedMethod = crossValidationMethods.find((m: any) => m.id === selectedCVMethod);
    if (!selectedMethod) return;

    // Simulate experiment progress
    const totalSteps = selectedMethod.folds;
    const foldResults: Array<{
      fold: number;
      trainSize: number;
      testSize: number;
      score: number;
      metrics: Record<string, number>;
    
    `cv-method-card ${selectedCVMethod === method.id ? 'selected' : ''}`}
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
            {cvExperimentRunning ? 'Running Experiment...' : 'Run CV Experiment'}
          </button>
        </div>

        {cvExperimentRunning && (
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
          <div 
            key={method.id} 
            className={`method-card ${selectedHoldoutMethod === method.id ? 'selected' : ''}`}
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
            {holdoutExperimentRunning ? 'Running Experiment...' : 'Run Holdout Experiment'}
          </button>
        </div>

        {holdoutExperimentRunning && (
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
                    <div className="score-item sm:px-4 md:px-6 lg:px-8">
                      <span className="label sm:px-4 md:px-6 lg:px-8">Validation Score:</span>
                      <span className="value sm:px-4 md:px-6 lg:px-8">{holdoutResults.validationScore.toFixed(4)}</span>
                    </div>
                  )}
                  <div className="score-item sm:px-4 md:px-6 lg:px-8">
                    <span className="label sm:px-4 md:px-6 lg:px-8">Overfitting:</span>
                    <span className={`value ${holdoutResults.overfit > 0.05 ? 'warning' : 'good'}`}>
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
            <h5>❌ Don't</h5>
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
          <div 
            key={method.id} 
            className={`method-card ${selectedTimeSeriesMethod === method.id ? 'selected' : ''}`}
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
                      <li key={`advantage-${method.id}-${advIndex}`}>{advantage}</li>
                    ))}
                  </ul>
                </div>
                <div className="disadvantages sm:px-4 md:px-6 lg:px-8">
                  <h6>⚠️ Disadvantages</h6>
                  <ul>
                    {method.disadvantages.map((disadvantage, disIndex) => (
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
            {timeSeriesExperimentRunning ? 'Running Experiment...' : 'Run Time Series Experiment'}
          </button>
        </div>

        {timeSeriesExperimentRunning && (
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
                    <span className={`value ${timeSeriesResults.temporalConsistency > 0.8 ? 'good' : 'warning'}`}>
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
                  <div key={`split-${split.splitIndex}`} className="splits-row sm:px-4 md:px-6 lg:px-8">
                    <span>{split.splitIndex + 1}</span>
                    <span>{split.trainPeriod}</span>
                    <span>{split.testPeriod}</span>
                    <span>{split.trainScore.toFixed(3)}</span>
                    <span>{split.testScore.toFixed(3)}</span>
                    <span className={split.trainScore - split.testScore > 0.05 ? 'warning' : 'good'}>
                      {(split.trainScore - split.testScore).toFixed(3)}
                    </span>
                  </div>
                ))}
                {timeSeriesResults.splits.length > 8 && (
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
            <h5>❌ Don't</h5>
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
            <div 
              key={method.id} 
              className={`method-card ${selectedBootstrapMethod === method.id ? 'selected' : ''}`}
              onClick={() => setSelectedBootstrapMethod(method.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e: any) => e.key === 'Enter' && setSelectedBootstrapMethod(method.id)}
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
                  <span>{method.replacement ? 'Yes' : 'No'}</span>
                </div>
                <div className="detail-item sm:px-4 md:px-6 lg:px-8">
                  <strong>Confidence Level:</strong>
                  <span>{(method.confidenceLevel * 100)}%</span>
                </div>
                {method.blockSize && (
                  <div className="detail-item sm:px-4 md:px-6 lg:px-8">
                    <strong>Block Size:</strong>
                    <span>{method.blockSize}</span>
                  </div>
                )}
                {method.stratifyColumn && (
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
                      <li key={`advantage-${method.id}-${advIndex}`}>{advantage}</li>
                    ))}
                  </ul>
                </div>
                <div className="disadvantages sm:px-4 md:px-6 lg:px-8">
                  <h6>⚠️ Disadvantages</h6>
                  <ul>
                    {method.disadvantages.map((disadvantage, disIndex) => (
                      <li key={`disadvantage-${method.id}-${disIndex}`}>{disadvantage}</li>
                    ))}
                  </ul>
                </div>
                <div className="use-cases sm:px-4 md:px-6 lg:px-8">
                  <h6>🎯 Use Cases</h6>
                  <ul>
                    {method.useCases.map((useCase, useIndex) => (
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
            {bootstrapExperimentRunning ? 'Running Experiment...' : 'Run Bootstrap Experiment'}
          </button>
        </div>

        {bootstrapExperimentRunning && (
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
                  <span className={`status ${bootstrapResults.convergence.converged ? 'success' : 'warning'}`}>
                    {bootstrapResults.convergence.converged ? '✅ Yes' : '⚠️ No'}
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
                  with scores ranging from {Math.min(...bootstrapResults.bootstrapScores).toFixed(3)} to{' '}
                  {Math.max(...bootstrapResults.bootstrapScores).toFixed(3)}.
                </p>
                <div className="distribution-stats sm:px-4 md:px-6 lg:px-8">
                  <div className="dist-item sm:px-4 md:px-6 lg:px-8">
                    <strong>Distribution Shape:</strong>
                    <span>
                      {bootstrapResults.statistics.skewness > 0.5 ? 'Right-skewed' : 
                       bootstrapResults.statistics.skewness < -0.5 ? 'Left-skewed' : 'Symmetric'}
                    </span>
                  </div>
                  <div className="dist-item sm:px-4 md:px-6 lg:px-8">
                    <strong>Tail Behavior:</strong>
                    <span>
                      {bootstrapResults.statistics.kurtosis > 1 ? 'Heavy-tailed' :
                       bootstrapResults.statistics.kurtosis < -1 ? 'Light-tailed' : 'Normal-tailed'}
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
          <div 
            key={method.id} 
            className={`method-card ${selectedCalibrationMethod === method.id ? 'selected' : ''}`}
            onClick={() => setSelectedCalibrationMethod(method.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e: any) => {
              if (e.key === 'Enter' || e.key === ' ') {
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
                      <li key={index}>{advantage}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="list-section sm:px-4 md:px-6 lg:px-8">
                  <h6>⚠️ Disadvantages</h6>
                  <ul>
                    {method.disadvantages.map((disadvantage, index) => (
                      <li key={index}>{disadvantage}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="list-section sm:px-4 md:px-6 lg:px-8">
                  <h6>🎯 Use Cases</h6>
                  <ul>
                    {method.useCases.map((useCase, index) => (
                      <li key={index}>{useCase}</li>
                    ))}
                  </ul>
                </div>

                <div className="list-section sm:px-4 md:px-6 lg:px-8">
                  <h6>🏈 Fantasy Applications</h6>
                  <ul>
                    {method.fantasyApplications.map((application, index) => (
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
            {calibrationExperimentRunning ? '🔄 Running Calibration...' : '🚀 Run Calibration Experiment'}
          </button>

          {calibrationExperimentRunning && (
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
                      {calibrationResults.parameters.preservesRanking ? '✅ Yes' : '❌ No'}
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
                      const binStart = index / calibrationResults.calibrationCurve.meanPredicted.length;
                      const binEnd = (index + 1) / calibrationResults.calibrationCurve.meanPredicted.length;
                      const actualRate = calibrationResults.calibrationCurve.fractionPositives[index];
                      const count = calibrationResults.calibrationCurve.binCounts[index];
                      const error = Math.abs(meanPred - actualRate);
                      
                      return (
                        <tr key={index} className={error < 0.05 ? 'well-calibrated' : error > 0.15 ? 'poorly-calibrated' : ''}>
                          <td>{(binStart * 100).toFixed(0)}-{(binEnd * 100).toFixed(0)}%</td>
                          <td>{count}</td>
                          <td>{(meanPred * 100).toFixed(1)}%</td>
                          <td>{(actualRate * 100).toFixed(1)}%</td>
                          <td>{(error * 100).toFixed(1)}%</td>
                          <td>
                            {error < 0.05 ? '🟢 Excellent' : 
                             error < 0.1 ? '🟡 Good' : 
                             error < 0.15 ? '🟠 Fair' : '🔴 Poor'}
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
                    The {calibrationResults.method} method achieved a calibration error of{' '}
                    {(calibrationResults.calibrationMetrics.calibrationError * 100).toFixed(2)}%, indicating{' '}
                    {calibrationResults.calibrationMetrics.calibrationError < 0.05 ? 'excellent' :
                     calibrationResults.calibrationMetrics.calibrationError < 0.1 ? 'good' :
                     calibrationResults.calibrationMetrics.calibrationError < 0.15 ? 'moderate' : 'poor'} calibration.
                  </p>
                </div>
                <div className="insight-item sm:px-4 md:px-6 lg:px-8">
                  <h6>Ranking Preservation</h6>
                  <p>
                    This method {calibrationResults.parameters.preservesRanking ? 'preserves' : 'does not preserve'} the 
                    original ranking of predictions, which is{' '}
                    {calibrationResults.parameters.preservesRanking ? 'ideal' : 'potentially problematic'} for 
                    fantasy football player rankings and draft strategies.
                  </p>
                </div>
                <div className="insight-item sm:px-4 md:px-6 lg:px-8">
                  <h6>Fantasy Football Application</h6>
                  <p>
                    For fantasy football, this calibration approach provides{' '}
                    {calibrationResults.calibrationMetrics.reliability > 0.9 ? 'highly reliable' :
                     calibrationResults.calibrationMetrics.reliability > 0.8 ? 'reliable' :
                     calibrationResults.calibrationMetrics.reliability > 0.7 ? 'moderately reliable' : 'limited'} 
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
              <tr key={method.id} className={selectedCalibrationMethod === method.id ? 'selected-row' : ''}>
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
              Calibration builds trust in Oracle's predictions by ensuring confidence levels accurately 
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
            <button
              key={category.id}
              className={`category-card ${selectedMetricCategory === category.id ? 'selected' : ''}`}
              onClick={() => setSelectedMetricCategory(category.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e: any) => {
                if (e.key === 'Enter' || e.key === ' ') {
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
            .filter((metric: any) => metric.category === selectedMetricCategory)
            .map((metric: any) => (
              <div
                key={metric.id}
                className={`metric-card ${selectedMetric === metric.id ? 'selected' : ''}`}
                onClick={() => setSelectedMetric(metric.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedMetric(metric.id);

                }}
              >
                <div className="metric-header sm:px-4 md:px-6 lg:px-8">
                  <h5>{metric.name}</h5>
                  <div className="metric-range sm:px-4 md:px-6 lg:px-8">Range: {metric.range}</div>
                  <div className={`metric-direction ${metric.higherIsBetter ? 'higher-better' : 'lower-better'}`}>
                    {metric.higherIsBetter ? '⬆️ Higher is Better' : '⬇️ Lower is Better'}
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
                          <li key={`usecase-${metric.id}-${index}`}>{useCase}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="limitations sm:px-4 md:px-6 lg:px-8">
                      <h6>⚠️ Limitations</h6>
                      <ul>
                        {metric.limitations.map((limitation, index) => (
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
            {metricsExperimentRunning ? '🔄 Evaluating Performance...' : '🚀 Run Performance Evaluation'}
          </button>

          {metricsExperimentRunning && (
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
                    The {modelTypes.find((m: any) => m.id === selectedModel)?.name} model shows{' '}
                    {metricsResults.classification && metricsResults.classification.f1Score > 0.8 ? 'excellent' :
                     metricsResults.classification && metricsResults.classification.f1Score > 0.7 ? 'good' :
                     metricsResults.classification && metricsResults.classification.f1Score > 0.6 ? 'moderate' : 'limited'} 
                    classification performance with strong predictive capabilities for fantasy football applications.
                  </p>
                </div>
                <div className="insight-item sm:px-4 md:px-6 lg:px-8">
                  <h6>Calibration Quality</h6>
                  <p>
                    The calibration metrics indicate{' '}
                    {metricsResults.calibration.reliability > 0.9 ? 'excellent' :
                     metricsResults.calibration.reliability > 0.8 ? 'good' :
                     metricsResults.calibration.reliability > 0.7 ? 'moderate' : 'poor'} 
                    probability calibration, providing reliable confidence estimates for decision-making.
                  </p>
                </div>
                <div className="insight-item sm:px-4 md:px-6 lg:px-8">
                  <h6>Fantasy Relevance</h6>
                  <p>
                    The fantasy-specific metrics demonstrate{' '}
                    {metricsResults.fantasy.pointsAccuracy > 0.8 ? 'strong' :
                     metricsResults.fantasy.pointsAccuracy > 0.7 ? 'good' :
                     metricsResults.fantasy.pointsAccuracy > 0.6 ? 'moderate' : 'limited'} 
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
              .filter((metric: any) => metric.category === selectedMetricCategory)
              .map((metric: any) => (
                <tr key={metric.id} className={selectedMetric === metric.id ? 'selected-row' : ''}>
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
            {biasVarianceExperimentRunning ? '🔄 Analyzing Trade-offs...' : '🚀 Run Bias-Variance Analysis'}
          </button>

          {biasVarianceExperimentRunning && (
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
                      <div key={`chart-point-${complexity}`} className="chart-point sm:px-4 md:px-6 lg:px-8" style={{
                        left: `${(complexity - biasVarianceVisualization.complexityRange[0]) / 
                          (biasVarianceVisualization.complexityRange[biasVarianceVisualization.complexityRange.length - 1] - 
                           biasVarianceVisualization.complexityRange[0]) * 100}%`
                      }}>
                        <div className="bias-bar sm:px-4 md:px-6 lg:px-8" style={{
                          height: `${biasVarianceVisualization.biasValues[index] * 200}px`,
                          backgroundColor: '#ff6b6b'
                        }}></div>
                        <div className="variance-bar sm:px-4 md:px-6 lg:px-8" style={{
                          height: `${biasVarianceVisualization.varianceValues[index] * 200}px`,
                          backgroundColor: '#4ecdc4'
                        }}></div>
                        <div className="total-line sm:px-4 md:px-6 lg:px-8" style={{
                          bottom: `${biasVarianceVisualization.totalErrorValues[index] * 200}px`
                        }}></div>
                        {Math.abs(complexity - biasVarianceVisualization.optimalComplexity) < 0.5 && (
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
                      <tr key={`result-${result.modelComplexity}`} className={
                        Math.abs(result.modelComplexity - biasVarianceVisualization.optimalComplexity) < 1 ? 'optimal-row' : ''
                      }>
                        <td>{result.modelComplexity.toFixed(1)}</td>
                        <td>{(result.bias * 100).toFixed(2)}%</td>
                        <td>{(result.variance * 100).toFixed(2)}%</td>
                        <td>{(result.noise * 100).toFixed(2)}%</td>
                        <td>{(result.totalError * 100).toFixed(2)}%</td>
                        <td>{result.metrics.r2.toFixed(3)}</td>
                        <td>
                          {result.totalError < 0.3 ? '🟢 Excellent' :
                           result.totalError < 0.5 ? '🟡 Good' :
                           result.totalError < 0.7 ? '🟠 Fair' : '🔴 Poor'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {biasVarianceResults.length > 8 && (
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
                    The {complexityConfigs.find((c: any) => c.id === selectedComplexityModel)?.name} model shows{' '}
                    {biasVarianceVisualization.optimalComplexity < 5 ? 'low' :
                     biasVarianceVisualization.optimalComplexity < 10 ? 'moderate' : 'high'} optimal complexity,
                    indicating {biasVarianceVisualization.optimalComplexity < 5 ? 'simple relationships' : 
                               biasVarianceVisualization.optimalComplexity < 10 ? 'moderate complexity patterns' :
                               'complex non-linear interactions'} in fantasy football data.
                  </p>
                </div>
                <div className="insight-item sm:px-4 md:px-6 lg:px-8">
                  <h6>Generalization Capability</h6>
                  <p>
                    The optimal bias-variance balance suggests{' '}
                    {Math.min(...biasVarianceVisualization.totalErrorValues) < 0.3 ? 'excellent' :
                     Math.min(...biasVarianceVisualization.totalErrorValues) < 0.5 ? 'good' : 'limited'} 
                    generalization performance for unseen fantasy football scenarios and player combinations.
                  </p>
                </div>
                <div className="insight-item sm:px-4 md:px-6 lg:px-8">
                  <h6>Fantasy Football Application</h6>
                  <p>
                    For fantasy football predictions, this analysis suggests using{' '}
                    {biasVarianceVisualization.optimalComplexity < 5 ? 'simpler models with strong domain features' :
                     biasVarianceVisualization.optimalComplexity < 10 ? 'moderately complex models with regularization' :
                     'complex ensemble methods with careful validation'} to achieve optimal prediction accuracy.
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
        <p>Ensuring accuracy, reliability, and trustworthiness in Oracle's predictions</p>
      </div>
      
      <div className="section-navigation sm:px-4 md:px-6 lg:px-8">
        <button 
          className={`nav-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-button ${activeTab === 'crossval' ? 'active' : ''}`}
          onClick={() => setActiveTab('crossval')}
        >
          🔄 Cross-Validation
        </button>
        <button 
          className={`nav-button ${activeTab === 'holdout' ? 'active' : ''}`}
          onClick={() => setActiveTab('holdout')}
        >
          🎲 Holdout Methods
        </button>
        <button 
          className={`nav-button ${activeTab === 'timeseries' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeseries')}
        >
          ⏰ Time Series
        </button>
        <button 
          className={`nav-button ${activeTab === 'bootstrap' ? 'active' : ''}`}
          onClick={() => setActiveTab('bootstrap')}
        >
          🎲 Bootstrap
        </button>
        <button 
          className={`nav-button ${activeTab === 'calibration' ? 'active' : ''}`}
          onClick={() => setActiveTab('calibration')}
        >
          ⚖️ Calibration
        </button>
        <button 
          className={`nav-button ${activeTab === 'metrics' ? 'active' : ''}`}
          onClick={() => setActiveTab('metrics')}
        >
          📈 Metrics
        </button>
        <button 
          className={`nav-button ${activeTab === 'biasvariance' ? 'active' : ''}`}
          onClick={() => setActiveTab('biasvariance')}
        >
          ⚖️ Bias-Variance
        </button>
        <button 
          className={`nav-button ${activeTab === 'demo' ? 'active' : ''}`}
          onClick={() => setActiveTab('demo')}
        >
          🧪 Demo
        </button>
      </div>
      
      <div className="section-content sm:px-4 md:px-6 lg:px-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'crossval' && renderCrossValidation()}
        {activeTab === 'holdout' && renderHoldout()}
        {activeTab === 'timeseries' && renderTimeSeries()}
        {activeTab === 'bootstrap' && renderBootstrap()}
        {activeTab === 'calibration' && renderCalibration()}
        {activeTab === 'metrics' && renderPerformanceMetrics()}
        {activeTab === 'biasvariance' && renderBiasVarianceAnalysis()}
        {activeTab === 'demo' && renderPlaceholder('Interactive Demo')}
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
