import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState } from &apos;react&apos;;
import &apos;./OracleNeuralNetworkSection.css&apos;;

interface NetworkLayer {
}
  id: string;
  name: string;
  type: string;
  neurons: number;
  activation: string;
  description: string;
  purpose: string;
  outputShape: string;

}

interface ActivationFunction {
}
  id: string;
  name: string;
  formula: string;
  range: string;
  description: string;
  advantages: string[];
  disadvantages: string[];
  useCases: string[];

interface TrainingTechnique {
}
  id: string;
  name: string;
  description: string;
  algorithm: string;
  benefits: string[];
  challenges: string[];
  implementation: string;

// --- Learning Curve Analysis Section ---
}

interface LearningCurvePoint {
}
  sampleSize: number;
  trainLoss: number;
  valLoss: number;
  trainAccuracy: number;
  valAccuracy: number;
  converged: boolean;

interface LearningCurveConfig {
}
  id: string;
  name: string;
  minSample: number;
  maxSample: number;
  step: number;
  convergenceThreshold: number;
  expectedConvergence: number;

// --- Feature Importance Analysis Section ---
}

interface FeatureImportanceResult {
}
  featureName: string;
  permutationImportance: number;
  shapValue: number;
  baselineContribution: number;
  rank: number;
  category: &apos;high&apos; | &apos;medium&apos; | &apos;low&apos;;
  description: string;

interface SHAPAnalysis {
}
  globalImportance: FeatureImportanceResult[];
  localExplanation: {
}
    prediction: number;
    baseValue: number;
    contributions: Array<{
}
      feature: string;
      value: number;
      shapValue: number;
    }>;
  };
  interactionMatrix: Array<Array<number>>;
  dependencePlots: Array<{
}
    feature: string;
    values: Array<{ x: number; y: number; color: number }>;
  }>;

interface PermutationConfig {
}
  id: string;
  name: string;
  features: string[];
  iterations: number;
  metric: &apos;mse&apos; | &apos;mae&apos; | &apos;r2&apos;;
  randomSeed: number;

}

const learningCurveConfigs: LearningCurveConfig[] = [
  {
}
    id: &apos;nn_curve&apos;,
    name: &apos;Neural Network Learning Curve&apos;,
    minSample: 100,
    maxSample: 5000,
    step: 100,
    convergenceThreshold: 0.01,
    expectedConvergence: 2500
  },
  {
}
    id: &apos;rf_curve&apos;,
    name: &apos;Random Forest Learning Curve&apos;,
    minSample: 50,
    maxSample: 3000,
    step: 50,
    convergenceThreshold: 0.005,
    expectedConvergence: 1500

];

// Feature importance configurations
const permutationConfigs: PermutationConfig[] = [
  {
}
    id: &apos;fantasy_features&apos;,
    name: &apos;Fantasy Football Features&apos;,
    features: [
      &apos;passing_yards&apos;, &apos;rushing_yards&apos;, &apos;receiving_yards&apos;, &apos;touchdowns&apos;,
      &apos;targets&apos;, &apos;completions&apos;, &apos;attempts&apos;, &apos;team_strength&apos;, &apos;opponent_ranking&apos;,
      &apos;weather_conditions&apos;, &apos;home_away&apos;, &apos;injury_status&apos;, &apos;recent_form&apos;,
      &apos;season_avg&apos;, &apos;matchup_difficulty&apos;, &apos;snap_percentage&apos;, &apos;red_zone_touches&apos;, &apos;game_script&apos;
    ],
    iterations: 50,
    metric: &apos;mse&apos;,
    randomSeed: 42
  },
  {
}
    id: &apos;player_specific&apos;,
    name: &apos;Player-Specific Analysis&apos;,
    features: [
      &apos;player_age&apos;, &apos;experience_years&apos;, &apos;position_rank&apos;, &apos;team_offensive_rating&apos;,
      &apos;usage_rate&apos;, &apos;target_share&apos;, &apos;air_yards&apos;, &apos;yards_after_catch&apos;,
      &apos;breakaway_runs&apos;, &apos;goal_line_carries&apos;, &apos;third_down_usage&apos;, &apos;two_minute_drill&apos;
    ],
    iterations: 30,
    metric: &apos;mae&apos;,
    randomSeed: 123

];

const OracleNeuralNetworkSection: React.FC = () => {
}
  const [activeTab, setActiveTab] = useState<&apos;overview&apos; | &apos;architecture&apos; | &apos;activations&apos; | &apos;training&apos; | &apos;optimization&apos; | &apos;demo&apos; | &apos;learning_curve&apos; | &apos;feature_importance&apos; | &apos;model_selection&apos;>(&apos;overview&apos;);
  // Model Selection state
  const [selectedModelType, setSelectedModelType] = useState<&apos;neural_network&apos; | &apos;random_forest&apos; | &apos;ensemble&apos;>(&apos;neural_network&apos;);
  const [modelSelectionResults, setModelSelectionResults] = useState<any>(null);
  const [modelSelectionRunning, setModelSelectionRunning] = useState<boolean>(false);
  const [modelSelectionProgress, setModelSelectionProgress] = useState<number>(0);

  // Model selection configs
  const modelConfigs = [
    {
}
      id: &apos;neural_network&apos;,
      name: &apos;Neural Network&apos;,
      description: &apos;Deep learning model with multiple hidden layers and regularization.&apos;,
      criteria: [&apos;Accuracy&apos;, &apos;Generalization&apos;, &apos;Interpretability&apos;, &apos;Training Time&apos;, &apos;Robustness&apos;],
    },
    {
}
      id: &apos;random_forest&apos;,
      name: &apos;Random Forest&apos;,
      description: &apos;Ensemble of decision trees with bagging for stability and feature importance.&apos;,
      criteria: [&apos;Accuracy&apos;, &apos;Feature Importance&apos;, &apos;Training Time&apos;, &apos;Overfitting Risk&apos;, &apos;Interpretability&apos;],
    },
    {
}
      id: &apos;ensemble&apos;,
      name: &apos;Stacked Ensemble&apos;,
      description: &apos;Combines multiple models for improved prediction and robustness.&apos;,
      criteria: [&apos;Accuracy&apos;, &apos;Robustness&apos;, &apos;Complexity&apos;, &apos;Generalization&apos;, &apos;Training Time&apos;],
    },
  ];

  // Simulate model selection analysis
  const runModelSelectionAnalysis = async () => {
}
    try {
}

    setModelSelectionRunning(true);
    setModelSelectionProgress(0);
    const results: any = {
}
    } catch (error) {
}
      console.error(&apos;Error in runModelSelectionAnalysis:&apos;, error);

    } catch (error) {
}
        console.error(error);
    };
    for (let i = 0; i < modelConfigs.length; i++) {
}
      const model = modelConfigs[i];
      // Simulate metrics
      results[model.id] = {
}
        accuracy: (0.85 + Math.random() * 0.1).toFixed(3),
        generalization: (0.8 + Math.random() * 0.15).toFixed(3),
        interpretability: (model.id === &apos;random_forest&apos; ? 0.8 : model.id === &apos;ensemble&apos; ? 0.6 : 0.5).toFixed(2),
        trainingTime: (model.id === &apos;neural_network&apos; ? 120 : model.id === &apos;random_forest&apos; ? 40 : 180),
        robustness: (0.7 + Math.random() * 0.2).toFixed(2),
        overfittingRisk: (model.id === &apos;neural_network&apos; ? 0.3 : model.id === &apos;random_forest&apos; ? 0.2 : 0.15).toFixed(2),
        complexity: (model.id === &apos;ensemble&apos; ? 0.9 : model.id === &apos;neural_network&apos; ? 0.7 : 0.5).toFixed(2),
      };
      setModelSelectionProgress(((i + 1) / modelConfigs.length) * 100);
      await new Promise(res => setTimeout(res, 60));

    setModelSelectionResults(results);
    setModelSelectionRunning(false);
    setModelSelectionProgress(100);
  };
  // --- Model Selection Section ---
  const renderModelSelection = () => (
    <div className="model-selection-section sm:px-4 md:px-6 lg:px-8">
      <h3>🤖 Model Selection Framework</h3>
      <div className="model-controls sm:px-4 md:px-6 lg:px-8">
        <label htmlFor="model-type-select">Model Type:</label>
        <select
          id="model-type-select"
          value={selectedModelType}
          onChange={e => setSelectedModelType(e.target.value as &apos;neural_network&apos; | &apos;random_forest&apos; | &apos;ensemble&apos;)} value={cfg.id}>{cfg.name}</option>
          ))}
        </select>
        <button
          className="model-selection-run-btn sm:px-4 md:px-6 lg:px-8"
          onClick={runModelSelectionAnalysis}
          disabled={modelSelectionRunning}
        >
          {modelSelectionRunning ? &apos;Comparing...&apos; : &apos;Run Comparison&apos;}
        </button>
        <div className="model-selection-progress-bar sm:px-4 md:px-6 lg:px-8">
          <div className="model-selection-progress-fill sm:px-4 md:px-6 lg:px-8" style={{ width: `${modelSelectionProgress}%` }}></div>
        </div>
      </div>

      {modelSelectionResults && (
}
        <div className="model-selection-results sm:px-4 md:px-6 lg:px-8">
          <h4>📊 Model Comparison Table</h4>
          <table className="model-table sm:px-4 md:px-6 lg:px-8">
            <thead>
              <tr>
                <th>Model</th>
                <th>Accuracy</th>
                <th>Generalization</th>
                <th>Interpretability</th>
                <th>Training Time (s)</th>
                <th>Robustness</th>
                <th>Overfitting Risk</th>
                <th>Complexity</th>
              </tr>
            </thead>
            <tbody>
              {modelConfigs.map((cfg: any) => (
}
                <tr key={`model-row-${cfg.id}`} className={selectedModelType === cfg.id ? &apos;selected-model-row&apos; : &apos;&apos;}>
                  <td>{cfg.name}</td>
                  <td>{modelSelectionResults[cfg.id].accuracy}</td>
                  <td>{modelSelectionResults[cfg.id].generalization}</td>
                  <td>{modelSelectionResults[cfg.id].interpretability}</td>
                  <td>{modelSelectionResults[cfg.id].trainingTime}</td>
                  <td>{modelSelectionResults[cfg.id].robustness}</td>
                  <td>{modelSelectionResults[cfg.id].overfittingRisk}</td>
                  <td>{modelSelectionResults[cfg.id].complexity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="model-selection-insights sm:px-4 md:px-6 lg:px-8">
            <h5>Selection Criteria</h5>
            <ul>
              <li><strong>Accuracy:</strong> How well the model predicts fantasy points on unseen data.</li>
              <li><strong>Generalization:</strong> Ability to perform well on new, out-of-sample scenarios.</li>
              <li><strong>Interpretability:</strong> How easily model decisions can be explained to users.</li>
              <li><strong>Training Time:</strong> Computational resources and time required for training.</li>
              <li><strong>Robustness:</strong> Resistance to noise, outliers, and adversarial examples.</li>
              <li><strong>Overfitting Risk:</strong> Likelihood of memorizing training data and failing to generalize.</li>
              <li><strong>Complexity:</strong> Model architecture and maintenance requirements.</li>
            </ul>
          </div>
          <div className="model-selection-methodology sm:px-4 md:px-6 lg:px-8">
            <h5>Methodology</h5>
            <p>
              Models are compared using simulated metrics based on typical performance in fantasy football prediction tasks. Selection criteria are explained to help users choose the best model for their needs. Interactive controls allow users to compare neural networks, random forests, and ensemble models side-by-side.
            </p>
          </div>
        </div>
      )}
    </div>
  );
  const [selectedLayer, setSelectedLayer] = useState<string>(&apos;&apos;);
  const [selectedActivation, setSelectedActivation] = useState<string>(&apos;relu&apos;);
  const [trainingProgress, setTrainingProgress] = useState<any>(null);
  const [networkVisualization, setNetworkVisualization] = useState<any>(null);
  const [learningCurvePoints, setLearningCurvePoints] = useState<LearningCurvePoint[] | null>(null);
  const [learningCurveRunning, setLearningCurveRunning] = useState<boolean>(false);
  const [learningCurveProgress, setLearningCurveProgress] = useState<number>(0);
  const [selectedLearningCurveConfig, setSelectedLearningCurveConfig] = useState<string>(&apos;nn_curve&apos;);
  
  // Feature Importance state
  const [featureImportanceResults, setFeatureImportanceResults] = useState<FeatureImportanceResult[] | null>(null);
  const [shapAnalysis, setShapAnalysis] = useState<SHAPAnalysis | null>(null);
  const [featureImportanceRunning, setFeatureImportanceRunning] = useState<boolean>(false);
  const [featureImportanceProgress, setFeatureImportanceProgress] = useState<number>(0);
  const [selectedPermutationConfig, setSelectedPermutationConfig] = useState<string>(&apos;fantasy_features&apos;);
  const [selectedFeatureMethod, setSelectedFeatureMethod] = useState<&apos;permutation&apos; | &apos;shap&apos; | &apos;both&apos;>(&apos;both&apos;);

  // Helper functions for scoring
  const getComputationScore = (activationId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;relu&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;leaky_relu&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;sigmoid&apos;: &apos;⭐⭐⭐&apos;,
      &apos;tanh&apos;: &apos;⭐⭐&apos;,
      &apos;swish&apos;: &apos;⭐⭐&apos;,
      &apos;gelu&apos;: &apos;⭐&apos;
    };
    return scores[activationId] || &apos;⭐&apos;;
  };

  const getGradientScore = (activationId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;swish&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;gelu&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;relu&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;leaky_relu&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;tanh&apos;: &apos;⭐⭐&apos;,
      &apos;sigmoid&apos;: &apos;⭐&apos;
    };
    return scores[activationId] || &apos;⭐&apos;;
  };

  const getPerformanceScore = (activationId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;swish&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;gelu&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;relu&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;leaky_relu&apos;: &apos;⭐⭐⭐&apos;,
      &apos;tanh&apos;: &apos;⭐⭐&apos;,
      &apos;sigmoid&apos;: &apos;⭐⭐&apos;
    };
    return scores[activationId] || &apos;⭐&apos;;
  };

  const getMemoryScore = (activationId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;relu&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;leaky_relu&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;sigmoid&apos;: &apos;⭐⭐⭐&apos;,
      &apos;tanh&apos;: &apos;⭐⭐⭐&apos;,
      &apos;swish&apos;: &apos;⭐⭐&apos;,
      &apos;gelu&apos;: &apos;⭐&apos;
    };
    return scores[activationId] || &apos;⭐&apos;;
  };

  // Oracle&apos;s Neural Network Architecture
  const networkLayers: NetworkLayer[] = [
    {
}
      id: &apos;input&apos;,
      name: &apos;Input Layer&apos;,
      type: &apos;Input&apos;,
      neurons: 18,
      activation: &apos;None&apos;,
      description: &apos;Receives normalized feature vectors from preprocessing pipeline&apos;,
      purpose: &apos;Data ingestion and initial feature representation&apos;,
      outputShape: &apos;(batch_size, 18)&apos;
    },
    {
}
      id: &apos;embedding&apos;,
      name: &apos;Embedding Layer&apos;,
      type: &apos;Embedding&apos;,
      neurons: 64,
      activation: &apos;None&apos;,
      description: &apos;Transforms categorical features into dense vector representations&apos;,
      purpose: &apos;Convert discrete features to continuous space&apos;,
      outputShape: &apos;(batch_size, 64)&apos;
    },
    {
}
      id: &apos;hidden1&apos;,
      name: &apos;Hidden Layer 1&apos;,
      type: &apos;Dense&apos;,
      neurons: 128,
      activation: &apos;ReLU&apos;,
      description: &apos;First hidden layer with ReLU activation for non-linear transformations&apos;,
      purpose: &apos;Primary feature extraction and pattern recognition&apos;,
      outputShape: &apos;(batch_size, 128)&apos;
    },
    {
}
      id: &apos;dropout1&apos;,
      name: &apos;Dropout Layer 1&apos;,
      type: &apos;Dropout&apos;,
      neurons: 128,
      activation: &apos;None&apos;,
      description: &apos;Regularization layer to prevent overfitting (rate: 0.3)&apos;,
      purpose: &apos;Reduce overfitting and improve generalization&apos;,
      outputShape: &apos;(batch_size, 128)&apos;
    },
    {
}
      id: &apos;hidden2&apos;,
      name: &apos;Hidden Layer 2&apos;,
      type: &apos;Dense&apos;,
      neurons: 64,
      activation: &apos;ReLU&apos;,
      description: &apos;Second hidden layer for deeper feature abstractions&apos;,
      purpose: &apos;Advanced pattern recognition and feature combinations&apos;,
      outputShape: &apos;(batch_size, 64)&apos;
    },
    {
}
      id: &apos;batchnorm&apos;,
      name: &apos;Batch Normalization&apos;,
      type: &apos;BatchNorm&apos;,
      neurons: 64,
      activation: &apos;None&apos;,
      description: &apos;Normalizes layer inputs to stabilize training&apos;,
      purpose: &apos;Accelerate training and improve stability&apos;,
      outputShape: &apos;(batch_size, 64)&apos;
    },
    {
}
      id: &apos;hidden3&apos;,
      name: &apos;Hidden Layer 3&apos;,
      type: &apos;Dense&apos;,
      neurons: 32,
      activation: &apos;Swish&apos;,
      description: &apos;Third hidden layer with Swish activation for smooth gradients&apos;,
      purpose: &apos;Fine-grained feature refinement&apos;,
      outputShape: &apos;(batch_size, 32)&apos;
    },
    {
}
      id: &apos;dropout2&apos;,
      name: &apos;Dropout Layer 2&apos;,
      type: &apos;Dropout&apos;,
      neurons: 32,
      activation: &apos;None&apos;,
      description: &apos;Second dropout layer for additional regularization (rate: 0.2)&apos;,
      purpose: &apos;Final overfitting prevention&apos;,
      outputShape: &apos;(batch_size, 32)&apos;
    },
    {
}
      id: &apos;output&apos;,
      name: &apos;Output Layer&apos;,
      type: &apos;Dense&apos;,
      neurons: 1,
      activation: &apos;Linear&apos;,
      description: &apos;Final layer outputting continuous prediction values&apos;,
      purpose: &apos;Generate final fantasy points prediction&apos;,
      outputShape: &apos;(batch_size, 1)&apos;

  ];

  // Activation Functions
  const activationFunctions: ActivationFunction[] = [
    {
}
      id: &apos;relu&apos;,
      name: &apos;ReLU (Rectified Linear Unit)&apos;,
      formula: &apos;f(x) = max(0, x)&apos;,
      range: &apos;[0, ∞)&apos;,
      description: &apos;Most commonly used activation function that outputs zero for negative inputs&apos;,
      advantages: [&apos;Simple computation&apos;, &apos;Solves vanishing gradient&apos;, &apos;Sparse activation&apos;, &apos;Fast convergence&apos;],
      disadvantages: [&apos;Dying ReLU problem&apos;, &apos;Not zero-centered&apos;, &apos;Unbounded output&apos;],
      useCases: [&apos;Hidden layers&apos;, &apos;Convolutional networks&apos;, &apos;Most deep learning tasks&apos;]
    },
    {
}
      id: &apos;swish&apos;,
      name: &apos;Swish&apos;,
      formula: &apos;f(x) = x × σ(x) = x / (1 + e^(-x))&apos;,
      range: &apos;(-∞, ∞)&apos;,
      description: &apos;Self-gated activation function discovered by Google, smooth and non-monotonic&apos;,
      advantages: [&apos;Smooth gradients&apos;, &apos;Self-gating property&apos;, &apos;Better than ReLU in some cases&apos;, &apos;Unbounded above&apos;],
      disadvantages: [&apos;Computationally expensive&apos;, &apos;Can be slow to train&apos;, &apos;Memory intensive&apos;],
      useCases: [&apos;Deep networks&apos;, &apos;Image classification&apos;, &apos;Advanced architectures&apos;]
    },
    {
}
      id: &apos;sigmoid&apos;,
      name: &apos;Sigmoid&apos;,
      formula: &apos;f(x) = 1 / (1 + e^(-x))&apos;,
      range: &apos;(0, 1)&apos;,
      description: &apos;Classic S-shaped activation function that maps inputs to probability-like outputs&apos;,
      advantages: [&apos;Smooth gradients&apos;, &apos;Bounded output&apos;, &apos;Probabilistic interpretation&apos;],
      disadvantages: [&apos;Vanishing gradient problem&apos;, &apos;Not zero-centered&apos;, &apos;Saturates easily&apos;],
      useCases: [&apos;Binary classification&apos;, &apos;Output layers&apos;, &apos;Gate mechanisms&apos;]
    },
    {
}
      id: &apos;tanh&apos;,
      name: &apos;Tanh (Hyperbolic Tangent)&apos;,
      formula: &apos;f(x) = (e^x - e^(-x)) / (e^x + e^(-x))&apos;,
      range: &apos;(-1, 1)&apos;,
      description: &apos;Zero-centered activation function, scaled version of sigmoid&apos;,
      advantages: [&apos;Zero-centered&apos;, &apos;Stronger gradients than sigmoid&apos;, &apos;Bounded output&apos;],
      disadvantages: [&apos;Still suffers from vanishing gradients&apos;, &apos;Computational overhead&apos;],
      useCases: [&apos;RNNs&apos;, &apos;Hidden layers in shallow networks&apos;, &apos;When zero-centered needed&apos;]
    },
    {
}
      id: &apos;leaky_relu&apos;,
      name: &apos;Leaky ReLU&apos;,
      formula: &apos;f(x) = max(αx, x) where α = 0.01&apos;,
      range: &apos;(-∞, ∞)&apos;,
      description: &apos;Modified ReLU that allows small negative values to pass through&apos;,
      advantages: [&apos;Prevents dying ReLU&apos;, &apos;Allows negative information&apos;, &apos;Simple computation&apos;],
      disadvantages: [&apos;Hyperparameter tuning needed&apos;, &apos;Inconsistent results&apos;, &apos;Not zero-centered&apos;],
      useCases: [&apos;When ReLU causes dead neurons&apos;, &apos;Deep networks&apos;, &apos;Alternative to ReLU&apos;]
    },
    {
}
      id: &apos;gelu&apos;,
      name: &apos;GELU (Gaussian Error Linear Unit)&apos;,
      formula: &apos;f(x) = x × Φ(x) ≈ 0.5x(1 + tanh(√(2/π)(x + 0.044715x³)))&apos;,
      range: &apos;(-∞, ∞)&apos;,
      description: &apos;Smooth approximation to ReLU using Gaussian cumulative distribution&apos;,
      advantages: [&apos;Smooth gradients&apos;, &apos;Better performance than ReLU&apos;, &apos;Stochastic regularization&apos;],
      disadvantages: [&apos;Computationally complex&apos;, &apos;Not widely supported&apos;, &apos;Slower than ReLU&apos;],
      useCases: [&apos;Transformer models&apos;, &apos;BERT and GPT&apos;, &apos;State-of-the-art NLP&apos;]

  ];

  // Training Techniques
  const trainingTechniques: TrainingTechnique[] = [
    {
}
      id: &apos;backpropagation&apos;,
      name: &apos;Backpropagation&apos;,
      description: &apos;Core algorithm for training neural networks by propagating errors backward&apos;,
      algorithm: &apos;Gradient descent with chain rule for weight updates&apos;,
      benefits: [&apos;Efficient gradient computation&apos;, &apos;Scalable to deep networks&apos;, &apos;Well-established theory&apos;],
      challenges: [&apos;Vanishing/exploding gradients&apos;, &apos;Local minima&apos;, &apos;Computational complexity&apos;],
      implementation: &apos;Automatic differentiation with PyTorch/TensorFlow&apos;
    },
    {
}
      id: &apos;adam_optimizer&apos;,
      name: &apos;Adam Optimizer&apos;,
      description: &apos;Adaptive moment estimation optimizer combining momentum and RMSprop&apos;,
      algorithm: &apos;Adaptive learning rates with bias correction&apos;,
      benefits: [&apos;Fast convergence&apos;, &apos;Adaptive learning rates&apos;, &apos;Handles sparse gradients&apos;],
      challenges: [&apos;Memory overhead&apos;, &apos;Hyperparameter sensitivity&apos;, &apos;Can converge to suboptimal solutions&apos;],
      implementation: &apos;Built-in optimizer with learning rate scheduling&apos;
    },
    {
}
      id: &apos;batch_training&apos;,
      name: &apos;Mini-Batch Training&apos;,
      description: &apos;Train on small batches of data for efficient memory usage and convergence&apos;,
      algorithm: &apos;Stochastic gradient descent with batch processing&apos;,
      benefits: [&apos;Memory efficient&apos;, &apos;Regularization effect&apos;, &apos;Parallel processing&apos;],
      challenges: [&apos;Batch size tuning&apos;, &apos;Gradient noise&apos;, &apos;Convergence stability&apos;],
      implementation: &apos;DataLoader with batch size 32-128&apos;
    },
    {
}
      id: &apos;regularization&apos;,
      name: &apos;Regularization Techniques&apos;,
      description: &apos;Methods to prevent overfitting and improve generalization&apos;,
      algorithm: &apos;Dropout, batch normalization, weight decay&apos;,
      benefits: [&apos;Prevents overfitting&apos;, &apos;Better generalization&apos;, &apos;Stable training&apos;],
      challenges: [&apos;Hyperparameter tuning&apos;, &apos;Training time increase&apos;, &apos;Complexity&apos;],
      implementation: &apos;Dropout layers, BatchNorm, L2 regularization&apos;
    },
    {
}
      id: &apos;transfer_learning&apos;,
      name: &apos;Transfer Learning&apos;,
      description: &apos;Leverage pre-trained models and adapt to fantasy football domain&apos;,
      algorithm: &apos;Fine-tuning pre-trained weights on domain-specific data&apos;,
      benefits: [&apos;Faster training&apos;, &apos;Better performance with limited data&apos;, &apos;Leverages existing knowledge&apos;],
      challenges: [&apos;Domain adaptation&apos;, &apos;Feature mismatch&apos;, &apos;Catastrophic forgetting&apos;],
      implementation: &apos;Pre-trained sports models with fine-tuning&apos;

  ];

  // Simulate network training
  const simulateTraining = () => {
}
    setTrainingProgress({
}
      epoch: 0,
      totalEpochs: 100,
      trainLoss: 2.5,
      valLoss: 2.8,
      trainAccuracy: 0.45,
      valAccuracy: 0.42,
      learningRate: 0.001,
      isTraining: true
    });

    // Simulate training progress
    const interval = setInterval(() => {
}
      setTrainingProgress((prev: any) => {
}
        if (!prev || prev.epoch >= prev.totalEpochs) {
}
          clearInterval(interval);
          return { ...prev, isTraining: false };

        const newEpoch = prev.epoch + 1;
        const progress = newEpoch / prev.totalEpochs;
        
        return {
}
          ...prev,
          epoch: newEpoch,
          trainLoss: Math.max(0.15, 2.5 * Math.exp(-progress * 2) + Math.random() * 0.1),
          valLoss: Math.max(0.18, 2.8 * Math.exp(-progress * 1.8) + Math.random() * 0.15),
          trainAccuracy: Math.min(0.95, 0.45 + progress * 0.45 + Math.random() * 0.05),
          valAccuracy: Math.min(0.92, 0.42 + progress * 0.42 + Math.random() * 0.05),
          learningRate: 0.001 * Math.exp(-progress * 0.5)
        };
      });
    }, 100);
  };

  // Generate network visualization
  const generateNetworkVisualization = () => {
}
    const selectedLayers = networkLayers.filter((layer: any) => 
      layer.type === &apos;Dense&apos; || layer.type === &apos;Input&apos;
    );
    
    setNetworkVisualization({
}
      layers: selectedLayers,
      connections: selectedLayers.length - 1,
      totalParameters: selectedLayers.reduce((total, layer, index) => {
}
        if (index === 0) return 0;
        const prevNeurons = selectedLayers[index - 1].neurons;
        return total + (prevNeurons * layer.neurons + layer.neurons);
      }, 0),
      activationFlow: selectedLayers.map((layer: any) => ({
}
        name: layer.name,
        activation: layer.activation,
        neurons: layer.neurons
      }))
    });
  };

  const runLearningCurveAnalysis = async () => {
}
    try {
}
    setLearningCurveRunning(true);
    setLearningCurveProgress(0);
    const config = learningCurveConfigs.find((c: any) => c.id === selectedLearningCurveConfig);
    if (!config) return;
    const points: LearningCurvePoint[] = [];
    let converged = false;
    for (let sample = config.minSample; sample <= config.maxSample; sample += config.step) {
}
      // Simulate training/validation loss and accuracy
      const progress = sample / config.expectedConvergence;
      const trainLoss = Math.max(0.12, 2.5 * Math.exp(-progress * 2) + Math.random() * 0.1);
      const valLoss = Math.max(0.15, 2.8 * Math.exp(-progress * 1.8) + Math.random() * 0.15);
      const trainAccuracy = Math.min(0.95, 0.45 + progress * 0.45 + Math.random() * 0.05);
      const valAccuracy = Math.min(0.92, 0.42 + progress * 0.42 + Math.random() * 0.05);
      if (sample >= config.expectedConvergence && Math.abs(trainLoss - valLoss) < config.convergenceThreshold) {
}
        converged = true;

    `layer-card ${selectedLayer === layer.id ? &apos;selected&apos; : &apos;&apos;}`}
              onClick={() => setSelectedLayer(selectedLayer === layer.id ? &apos;&apos; : layer.id)}
              aria-label={`Select ${layer.name} details`}
            >
              <div className="layer-header sm:px-4 md:px-6 lg:px-8">
                <div className="layer-info sm:px-4 md:px-6 lg:px-8">
                  <h5>{layer.name}</h5>
                  <span className="layer-type sm:px-4 md:px-6 lg:px-8">{layer.type}</span>
                </div>
                <div className="layer-specs sm:px-4 md:px-6 lg:px-8">
                  <span className="neuron-count sm:px-4 md:px-6 lg:px-8">{layer.neurons} neurons</span>
                  <span className="activation-type sm:px-4 md:px-6 lg:px-8">{layer.activation}</span>
                </div>
              </div>
              
              <div className="layer-visual sm:px-4 md:px-6 lg:px-8">
                <div className="neurons-visualization sm:px-4 md:px-6 lg:px-8">
                  {Array.from({ length: Math.min(layer.neurons, 8) }).map((_, neuronIndex) => (
                    <div 
                      key={`neuron-${layer.id}-${neuronIndex}`} 
                      className={`neuron ${layer.type.toLowerCase()}`}
                    ></div>
                  ))}
                  {layer.neurons > 8 && <span className="neuron-overflow sm:px-4 md:px-6 lg:px-8">+{layer.neurons - 8}</span>}
                </div>
                {index < networkLayers.length - 1 && (
}
                  <div className="layer-connections sm:px-4 md:px-6 lg:px-8">
                    {Array.from({ length: Math.min(3, Math.min(layer.neurons, networkLayers[index + 1].neurons)) }).map((_, connIndex) => (
                      <div key={`connection-${layer.id}-${connIndex}`} className="connection-line sm:px-4 md:px-6 lg:px-8"></div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="layer-description sm:px-4 md:px-6 lg:px-8">
                <p>{layer.description}</p>
                <div className="output-shape sm:px-4 md:px-6 lg:px-8">Output: {layer.outputShape}</div>
              </div>
              
              {selectedLayer === layer.id && (
}
                <div className="layer-details sm:px-4 md:px-6 lg:px-8">
                  <h6>Layer Purpose</h6>
                  <p>{layer.purpose}</p>
                  
                  <div className="technical-details sm:px-4 md:px-6 lg:px-8">
                    <div className="detail-grid sm:px-4 md:px-6 lg:px-8">
                      <div className="detail-item sm:px-4 md:px-6 lg:px-8">
                        <strong>Layer Type:</strong>
                        <span>{layer.type}</span>
                      </div>
                      <div className="detail-item sm:px-4 md:px-6 lg:px-8">
                        <strong>Neuron Count:</strong>
                        <span>{layer.neurons}</span>
                      </div>
                      <div className="detail-item sm:px-4 md:px-6 lg:px-8">
                        <strong>Activation:</strong>
                        <span>{layer.activation}</span>
                      </div>
                      <div className="detail-item sm:px-4 md:px-6 lg:px-8">
                        <strong>Output Shape:</strong>
                        <span>{layer.outputShape}</span>
                      </div>
                    </div>
                    
                    {layer.type === &apos;Dense&apos; && (
}
                      <div className="parameter-calculation sm:px-4 md:px-6 lg:px-8">
                        <h6>Parameter Calculation</h6>
                        <p>
                          Parameters = (Input × Output) + Bias<br/>
                          {index > 0 && `= (${networkLayers[index - 1].neurons} × ${layer.neurons}) + ${layer.neurons} = ${networkLayers[index - 1].neurons * layer.neurons + layer.neurons}`}
                        </p>
                      </div>
                    )}
                    
                    {layer.type === &apos;Dropout&apos; && (
}
                      <div className="dropout-info sm:px-4 md:px-6 lg:px-8">
                        <h6>Dropout Configuration</h6>
                        <p>
                          Dropout Rate: {layer.id === &apos;dropout1&apos; ? &apos;30%&apos; : &apos;20%&apos;}<br/>
                          Purpose: Randomly zero out neurons during training to prevent overfitting
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
        
        <div className="architecture-summary sm:px-4 md:px-6 lg:px-8">
          <h4>📊 Architecture Summary</h4>
          <div className="summary-grid sm:px-4 md:px-6 lg:px-8">
            <div className="summary-card sm:px-4 md:px-6 lg:px-8">
              <h6>Total Layers</h6>
              <div className="summary-value sm:px-4 md:px-6 lg:px-8">{networkLayers.length}</div>
              <p>Including regularization layers</p>
            </div>
            <div className="summary-card sm:px-4 md:px-6 lg:px-8">
              <h6>Trainable Layers</h6>
              <div className="summary-value sm:px-4 md:px-6 lg:px-8">{networkLayers.filter((l: any) => l.type === &apos;Dense&apos;).length}</div>
              <p>Dense layers with weights</p>
            </div>
            <div className="summary-card sm:px-4 md:px-6 lg:px-8">
              <h6>Total Neurons</h6>
              <div className="summary-value sm:px-4 md:px-6 lg:px-8">{networkLayers.reduce((sum, layer) => sum + layer.neurons, 0)}</div>
              <p>Across all layers</p>
            </div>
            <div className="summary-card sm:px-4 md:px-6 lg:px-8">
              <h6>Network Depth</h6>
              <div className="summary-value sm:px-4 md:px-6 lg:px-8">{networkLayers.filter((l: any) => l.type === &apos;Dense&apos;).length}</div>
              <p>Hidden + output layers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivations = () => (
    <div className="activation-functions sm:px-4 md:px-6 lg:px-8">
      <h3>⚡ Activation Functions</h3>
      <div className="activations-grid sm:px-4 md:px-6 lg:px-8">
        {activationFunctions.map((activation: any) => (
}
          <button 
            key={activation.id} 
            className={`activation-card ${selectedActivation === activation.id ? &apos;selected&apos; : &apos;&apos;}`}
            onClick={() => setSelectedActivation(activation.id)}
            aria-label={`Select ${activation.name} activation function`}
          >
            <div className="activation-header sm:px-4 md:px-6 lg:px-8">
              <h4>{activation.name}</h4>
              {selectedActivation === activation.id && <span className="selected-badge sm:px-4 md:px-6 lg:px-8">Active</span>}
            </div>
            
            <div className="activation-formula sm:px-4 md:px-6 lg:px-8">
              <strong>Formula:</strong>
              <div className="formula sm:px-4 md:px-6 lg:px-8">{activation.formula}</div>
            </div>
            
            <div className="activation-range sm:px-4 md:px-6 lg:px-8">
              <strong>Range:</strong> <span>{activation.range}</span>
            </div>
            
            <p className="activation-description sm:px-4 md:px-6 lg:px-8">{activation.description}</p>
            
            <div className="activation-analysis sm:px-4 md:px-6 lg:px-8">
              <div className="advantages sm:px-4 md:px-6 lg:px-8">
                <h6>✅ Advantages</h6>
                <ul>
                  {activation.advantages.map((advantage, advIndex) => (
}
                    <li key={`advantage-${activation.id}-${advIndex}`}>{advantage}</li>
                  ))}
                </ul>
              </div>
              <div className="disadvantages sm:px-4 md:px-6 lg:px-8">
                <h6>⚠️ Disadvantages</h6>
                <ul>
                  {activation.disadvantages.map((disadvantage, disIndex) => (
}
                    <li key={`disadvantage-${activation.id}-${disIndex}`}>{disadvantage}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="use-cases sm:px-4 md:px-6 lg:px-8">
              <h6>🎯 Use Cases</h6>
              <ul>
                {activation.useCases.map((useCase, useIndex) => (
}
                  <li key={`usecase-${activation.id}-${useIndex}`}>{useCase}</li>
                ))}
              </ul>
            </div>
            
            {selectedActivation === activation.id && (
}
              <div className="activation-visualization sm:px-4 md:px-6 lg:px-8">
                <h6>📈 Function Visualization</h6>
                <div className="function-graph sm:px-4 md:px-6 lg:px-8">
                  <div className="graph-container sm:px-4 md:px-6 lg:px-8">
                    <div className={`function-curve ${activation.id}`}></div>
                    <div className="graph-axes sm:px-4 md:px-6 lg:px-8">
                      <div className="x-axis sm:px-4 md:px-6 lg:px-8"></div>
                      <div className="y-axis sm:px-4 md:px-6 lg:px-8"></div>
                    </div>
                    <div className="graph-labels sm:px-4 md:px-6 lg:px-8">
                      <span className="x-label sm:px-4 md:px-6 lg:px-8">Input (x)</span>
                      <span className="y-label sm:px-4 md:px-6 lg:px-8">Output f(x)</span>
                    </div>
                  </div>
                </div>
                
                <div className="function-properties sm:px-4 md:px-6 lg:px-8">
                  <div className="property-grid sm:px-4 md:px-6 lg:px-8">
                    <div className="property-item sm:px-4 md:px-6 lg:px-8">
                      <strong>Monotonic:</strong>
                      <span>{[&apos;relu&apos;, &apos;sigmoid&apos;, &apos;tanh&apos;, &apos;leaky_relu&apos;].includes(activation.id) ? &apos;Yes&apos; : &apos;No&apos;}</span>
                    </div>
                    <div className="property-item sm:px-4 md:px-6 lg:px-8">
                      <strong>Differentiable:</strong>
                      <span>{activation.id === &apos;relu&apos; ? &apos;Except at 0&apos; : &apos;Yes&apos;}</span>
                    </div>
                    <div className="property-item sm:px-4 md:px-6 lg:px-8">
                      <strong>Zero-Centered:</strong>
                      <span>{[&apos;tanh&apos;].includes(activation.id) ? &apos;Yes&apos; : &apos;No&apos;}</span>
                    </div>
                    <div className="property-item sm:px-4 md:px-6 lg:px-8">
                      <strong>Bounded:</strong>
                      <span>{[&apos;sigmoid&apos;, &apos;tanh&apos;].includes(activation.id) ? &apos;Yes&apos; : &apos;No&apos;}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      <div className="activation-comparison sm:px-4 md:px-6 lg:px-8">
        <h4>📊 Function Comparison Matrix</h4>
        <div className="comparison-table sm:px-4 md:px-6 lg:px-8">
          <div className="table-header sm:px-4 md:px-6 lg:px-8">
            <span>Function</span>
            <span>Computation</span>
            <span>Gradient Flow</span>
            <span>Performance</span>
            <span>Memory Usage</span>
          </div>
          {activationFunctions.map((activation: any) => (
}
            <div key={`comparison-${activation.id}`} className="table-row sm:px-4 md:px-6 lg:px-8">
              <span className="function-name sm:px-4 md:px-6 lg:px-8">{activation.name}</span>
              <span className="computation-score sm:px-4 md:px-6 lg:px-8">
                {getComputationScore(activation.id)}
              </span>
              <span className="gradient-score sm:px-4 md:px-6 lg:px-8">
                {getGradientScore(activation.id)}
              </span>
              <span className="performance-score sm:px-4 md:px-6 lg:px-8">
                {getPerformanceScore(activation.id)}
              </span>
              <span className="memory-score sm:px-4 md:px-6 lg:px-8">
                {getMemoryScore(activation.id)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTraining = () => (
    <div className="training-process sm:px-4 md:px-6 lg:px-8">
      <h3>🎓 Training Process & Techniques</h3>
      <div className="training-grid sm:px-4 md:px-6 lg:px-8">
        {trainingTechniques.map((technique: any) => (
}
          <div key={technique.id} className="training-card sm:px-4 md:px-6 lg:px-8">
            <h4>{technique.name}</h4>
            <p className="training-description sm:px-4 md:px-6 lg:px-8">{technique.description}</p>
            
            <div className="algorithm-section sm:px-4 md:px-6 lg:px-8">
              <strong>Algorithm:</strong>
              <p>{technique.algorithm}</p>
            </div>
            
            <div className="training-analysis sm:px-4 md:px-6 lg:px-8">
              <div className="benefits sm:px-4 md:px-6 lg:px-8">
                <h6>✅ Benefits</h6>
                <ul>
                  {technique.benefits.map((benefit, benefitIndex) => (
}
                    <li key={`benefit-${technique.id}-${benefitIndex}`}>{benefit}</li>
                  ))}
                </ul>
              </div>
              <div className="challenges sm:px-4 md:px-6 lg:px-8">
                <h6>⚠️ Challenges</h6>
                <ul>
                  {technique.challenges.map((challenge, challengeIndex) => (
}
                    <li key={`challenge-${technique.id}-${challengeIndex}`}>{challenge}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="implementation sm:px-4 md:px-6 lg:px-8">
              <strong>Implementation:</strong>
              <p>{technique.implementation}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="training-pipeline sm:px-4 md:px-6 lg:px-8">
        <h4>🔄 Oracle&apos;s Training Pipeline</h4>
        <div className="pipeline-flow sm:px-4 md:px-6 lg:px-8">
          <div className="pipeline-stage sm:px-4 md:px-6 lg:px-8">
            <div className="stage-number sm:px-4 md:px-6 lg:px-8">1</div>
            <h5>Data Preparation</h5>
            <p>Load and preprocess fantasy football data with feature engineering</p>
          </div>
          <div className="pipeline-arrow sm:px-4 md:px-6 lg:px-8">→</div>
          <div className="pipeline-stage sm:px-4 md:px-6 lg:px-8">
            <div className="stage-number sm:px-4 md:px-6 lg:px-8">2</div>
            <h5>Model Initialization</h5>
            <p>Initialize network weights using Xavier/He initialization</p>
          </div>
          <div className="pipeline-arrow sm:px-4 md:px-6 lg:px-8">→</div>
          <div className="pipeline-stage sm:px-4 md:px-6 lg:px-8">
            <div className="stage-number sm:px-4 md:px-6 lg:px-8">3</div>
            <h5>Forward Pass</h5>
            <p>Compute predictions through the network layers</p>
          </div>
          <div className="pipeline-arrow sm:px-4 md:px-6 lg:px-8">→</div>
          <div className="pipeline-stage sm:px-4 md:px-6 lg:px-8">
            <div className="stage-number sm:px-4 md:px-6 lg:px-8">4</div>
            <h5>Loss Calculation</h5>
            <p>Compute MSE loss with regularization terms</p>
          </div>
          <div className="pipeline-arrow sm:px-4 md:px-6 lg:px-8">→</div>
          <div className="pipeline-stage sm:px-4 md:px-6 lg:px-8">
            <div className="stage-number sm:px-4 md:px-6 lg:px-8">5</div>
            <h5>Backpropagation</h5>
            <p>Calculate gradients and update weights using Adam optimizer</p>
          </div>
          <div className="pipeline-arrow sm:px-4 md:px-6 lg:px-8">→</div>
          <div className="pipeline-stage sm:px-4 md:px-6 lg:px-8">
            <div className="stage-number sm:px-4 md:px-6 lg:px-8">6</div>
            <h5>Validation</h5>
            <p>Evaluate on validation set and adjust hyperparameters</p>
          </div>
        </div>
      </div>
      
      <div className="training-hyperparameters sm:px-4 md:px-6 lg:px-8">
        <h4>⚙️ Key Hyperparameters</h4>
        <div className="hyperparameters-grid sm:px-4 md:px-6 lg:px-8">
          <div className="param-card sm:px-4 md:px-6 lg:px-8">
            <h6>Learning Rate</h6>
            <div className="param-value sm:px-4 md:px-6 lg:px-8">0.001</div>
            <p>Initial learning rate with exponential decay</p>
          </div>
          <div className="param-card sm:px-4 md:px-6 lg:px-8">
            <h6>Batch Size</h6>
            <div className="param-value sm:px-4 md:px-6 lg:px-8">64</div>
            <p>Optimal balance of memory and convergence</p>
          </div>
          <div className="param-card sm:px-4 md:px-6 lg:px-8">
            <h6>Epochs</h6>
            <div className="param-value sm:px-4 md:px-6 lg:px-8">100</div>
            <p>Training iterations with early stopping</p>
          </div>
          <div className="param-card sm:px-4 md:px-6 lg:px-8">
            <h6>Dropout Rate</h6>
            <div className="param-value sm:px-4 md:px-6 lg:px-8">0.2-0.3</div>
            <p>Regularization to prevent overfitting</p>
          </div>
          <div className="param-card sm:px-4 md:px-6 lg:px-8">
            <h6>Weight Decay</h6>
            <div className="param-value sm:px-4 md:px-6 lg:px-8">1e-4</div>
            <p>L2 regularization coefficient</p>
          </div>
          <div className="param-card sm:px-4 md:px-6 lg:px-8">
            <h6>Optimizer</h6>
            <div className="param-value sm:px-4 md:px-6 lg:px-8">Adam</div>
            <p>Adaptive moment estimation</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOptimization = () => (
    <div className="optimization-section sm:px-4 md:px-6 lg:px-8">
      <h3>🚀 Optimization & Performance</h3>
      <div className="optimization-content sm:px-4 md:px-6 lg:px-8">
        <div className="optimization-techniques sm:px-4 md:px-6 lg:px-8">
          <h4>Performance Optimization Strategies</h4>
          <div className="strategies-grid sm:px-4 md:px-6 lg:px-8">
            <div className="strategy-card sm:px-4 md:px-6 lg:px-8">
              <h5>🔥 Mixed Precision Training</h5>
              <p>Use FP16 precision to reduce memory usage and increase training speed while maintaining accuracy</p>
              <div className="strategy-benefits sm:px-4 md:px-6 lg:px-8">
                <strong>Benefits:</strong> 2x faster training, 50% less memory usage
              </div>
            </div>
            <div className="strategy-card sm:px-4 md:px-6 lg:px-8">
              <h5>⚡ Gradient Accumulation</h5>
              <p>Simulate larger batch sizes by accumulating gradients across multiple mini-batches</p>
              <div className="strategy-benefits sm:px-4 md:px-6 lg:px-8">
                <strong>Benefits:</strong> Stable training with limited memory
              </div>
            </div>
            <div className="strategy-card sm:px-4 md:px-6 lg:px-8">
              <h5>📊 Dynamic Batching</h5>
              <p>Adjust batch sizes during training based on GPU memory availability and convergence</p>
              <div className="strategy-benefits sm:px-4 md:px-6 lg:px-8">
                <strong>Benefits:</strong> Optimal resource utilization
              </div>
            </div>
            <div className="strategy-card sm:px-4 md:px-6 lg:px-8">
              <h5>🎯 Early Stopping</h5>
              <p>Monitor validation loss and stop training when no improvement is observed</p>
              <div className="strategy-benefits sm:px-4 md:px-6 lg:px-8">
                <strong>Benefits:</strong> Prevents overfitting, saves time
              </div>
            </div>
            <div className="strategy-card sm:px-4 md:px-6 lg:px-8">
              <h5>📈 Learning Rate Scheduling</h5>
              <p>Dynamically adjust learning rate based on training progress and validation metrics</p>
              <div className="strategy-benefits sm:px-4 md:px-6 lg:px-8">
                <strong>Benefits:</strong> Better convergence, fine-tuning
              </div>
            </div>
            <div className="strategy-card sm:px-4 md:px-6 lg:px-8">
              <h5>🔄 Model Checkpointing</h5>
              <p>Save model state at regular intervals and restore from best performing checkpoint</p>
              <div className="strategy-benefits sm:px-4 md:px-6 lg:px-8">
                <strong>Benefits:</strong> Recovery from failures, best model selection
              </div>
            </div>
          </div>
        </div>
        
        <div className="performance-metrics sm:px-4 md:px-6 lg:px-8">
          <h4>📊 Performance Metrics</h4>
          <div className="metrics-dashboard sm:px-4 md:px-6 lg:px-8">
            <div className="metric-category sm:px-4 md:px-6 lg:px-8">
              <h5>Training Metrics</h5>
              <div className="metrics-grid sm:px-4 md:px-6 lg:px-8">
                <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-label sm:px-4 md:px-6 lg:px-8">Training Loss</div>
                  <div className="metric-value sm:px-4 md:px-6 lg:px-8">0.145</div>
                  <div className="metric-trend sm:px-4 md:px-6 lg:px-8">↓ -12.3%</div>
                </div>
                <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-label sm:px-4 md:px-6 lg:px-8">Validation Loss</div>
                  <div className="metric-value sm:px-4 md:px-6 lg:px-8">0.162</div>
                  <div className="metric-trend sm:px-4 md:px-6 lg:px-8">↓ -8.7%</div>
                </div>
                <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-label sm:px-4 md:px-6 lg:px-8">Training Accuracy</div>
                  <div className="metric-value sm:px-4 md:px-6 lg:px-8">94.2%</div>
                  <div className="metric-trend sm:px-4 md:px-6 lg:px-8">↑ +2.1%</div>
                </div>
                <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-label sm:px-4 md:px-6 lg:px-8">Validation Accuracy</div>
                  <div className="metric-value sm:px-4 md:px-6 lg:px-8">91.8%</div>
                  <div className="metric-trend sm:px-4 md:px-6 lg:px-8">↑ +1.9%</div>
                </div>
              </div>
            </div>
            
            <div className="metric-category sm:px-4 md:px-6 lg:px-8">
              <h5>Performance Metrics</h5>
              <div className="metrics-grid sm:px-4 md:px-6 lg:px-8">
                <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-label sm:px-4 md:px-6 lg:px-8">Inference Time</div>
                  <div className="metric-value sm:px-4 md:px-6 lg:px-8">1.8ms</div>
                  <div className="metric-trend sm:px-4 md:px-6 lg:px-8">↓ -0.3ms</div>
                </div>
                <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-label sm:px-4 md:px-6 lg:px-8">Memory Usage</div>
                  <div className="metric-value sm:px-4 md:px-6 lg:px-8">245MB</div>
                  <div className="metric-trend sm:px-4 md:px-6 lg:px-8">↓ -15%</div>
                </div>
                <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-label sm:px-4 md:px-6 lg:px-8">Throughput</div>
                  <div className="metric-value sm:px-4 md:px-6 lg:px-8">2,100/s</div>
                  <div className="metric-trend sm:px-4 md:px-6 lg:px-8">↑ +8.2%</div>
                </div>
                <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-label sm:px-4 md:px-6 lg:px-8">GPU Utilization</div>
                  <div className="metric-value sm:px-4 md:px-6 lg:px-8">87%</div>
                  <div className="metric-trend sm:px-4 md:px-6 lg:px-8">↑ +5%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="model-deployment sm:px-4 md:px-6 lg:px-8">
          <h4>🚀 Model Deployment & Serving</h4>
          <div className="deployment-pipeline sm:px-4 md:px-6 lg:px-8">
            <div className="deployment-stage sm:px-4 md:px-6 lg:px-8">
              <h5>Model Export</h5>
              <p>Convert trained PyTorch model to ONNX format for optimized inference</p>
              <div className="stage-details sm:px-4 md:px-6 lg:px-8">
                <span>Format: ONNX</span>
                <span>Size: 2.3MB</span>
                <span>Optimization: Graph fusion</span>
              </div>
            </div>
            <div className="deployment-stage sm:px-4 md:px-6 lg:px-8">
              <h5>Optimization</h5>
              <p>Apply quantization and pruning techniques to reduce model size and latency</p>
              <div className="stage-details sm:px-4 md:px-6 lg:px-8">
                <span>Quantization: INT8</span>
                <span>Pruning: 15% sparsity</span>
                <span>Size reduction: 60%</span>
              </div>
            </div>
            <div className="deployment-stage sm:px-4 md:px-6 lg:px-8">
              <h5>Production Serving</h5>
              <p>Deploy to high-performance inference servers with auto-scaling capabilities</p>
              <div className="stage-details sm:px-4 md:px-6 lg:px-8">
                <span>Runtime: TensorRT</span>
                <span>Scaling: Auto</span>
                <span>Latency: &lt;5ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDemo = () => (
    <div className="neural-demo sm:px-4 md:px-6 lg:px-8">
      <h3>🧪 Interactive Neural Network Demo</h3>
      <div className="demo-controls sm:px-4 md:px-6 lg:px-8">
        <button 
          className="demo-button sm:px-4 md:px-6 lg:px-8"
          onClick={simulateTraining}
          disabled={trainingProgress?.isTraining}
        >
          {trainingProgress?.isTraining ? &apos;Training...&apos; : &apos;Start Training Simulation&apos;}
        </button>
        <button 
          className="demo-button sm:px-4 md:px-6 lg:px-8"
          onClick={generateNetworkVisualization}
        >
          Generate Network Visualization
        </button>
      </div>
      
      {trainingProgress && (
}
        <div className="training-simulation sm:px-4 md:px-6 lg:px-8">
          <h4>📈 Training Progress</h4>
          <div className="progress-dashboard sm:px-4 md:px-6 lg:px-8">
            <div className="progress-header sm:px-4 md:px-6 lg:px-8">
              <div className="epoch-counter sm:px-4 md:px-6 lg:px-8">
                Epoch {trainingProgress.epoch} / {trainingProgress.totalEpochs}
              </div>
              <div className="progress-bar sm:px-4 md:px-6 lg:px-8">
                <div 
                  className="progress-fill sm:px-4 md:px-6 lg:px-8" 
                  style={{ width: `${(trainingProgress.epoch / trainingProgress.totalEpochs) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="metrics-display sm:px-4 md:px-6 lg:px-8">
              <div className="metric-group sm:px-4 md:px-6 lg:px-8">
                <h6>Loss</h6>
                <div className="metric-pair sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span>Train</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{trainingProgress.trainLoss.toFixed(4)}</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span>Val</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{trainingProgress.valLoss.toFixed(4)}</span>
                  </div>
                </div>
              </div>
              
              <div className="metric-group sm:px-4 md:px-6 lg:px-8">
                <h6>Accuracy</h6>
                <div className="metric-pair sm:px-4 md:px-6 lg:px-8">
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span>Train</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(trainingProgress.trainAccuracy * 100).toFixed(1)}%</span>
                  </div>
                  <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                    <span>Val</span>
                    <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(trainingProgress.valAccuracy * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="metric-group sm:px-4 md:px-6 lg:px-8">
                <h6>Learning Rate</h6>
                <div className="metric-value single sm:px-4 md:px-6 lg:px-8">{trainingProgress.learningRate.toExponential(3)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {networkVisualization && (
}
        <div className="network-visualization sm:px-4 md:px-6 lg:px-8">
          <h4>🧠 Network Structure</h4>
          <div className="visualization-summary sm:px-4 md:px-6 lg:px-8">
            <div className="summary-item sm:px-4 md:px-6 lg:px-8">
              <span>Total Layers:</span>
              <span>{networkVisualization.layers.length}</span>
            </div>
            <div className="summary-item sm:px-4 md:px-6 lg:px-8">
              <span>Connections:</span>
              <span>{networkVisualization.connections}</span>
            </div>
            <div className="summary-item sm:px-4 md:px-6 lg:px-8">
              <span>Parameters:</span>
              <span>{networkVisualization.totalParameters.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="activation-flow sm:px-4 md:px-6 lg:px-8">
            <h5>Activation Flow</h5>
            <div className="flow-visualization sm:px-4 md:px-6 lg:px-8">
              {networkVisualization.activationFlow.map((layer: any, index: number) => (
}
                <div key={`flow-${layer.name.toLowerCase().replace(/\s+/g, &apos;-&apos;)}`} className="flow-layer sm:px-4 md:px-6 lg:px-8">
                  <div className="layer-name sm:px-4 md:px-6 lg:px-8">{layer.name}</div>
                  <div className="layer-neurons sm:px-4 md:px-6 lg:px-8">{layer.neurons} neurons</div>
                  <div className="layer-activation sm:px-4 md:px-6 lg:px-8">{layer.activation}</div>
                  {index < networkVisualization.activationFlow.length - 1 && (
}
                    <div className="flow-arrow sm:px-4 md:px-6 lg:px-8">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="demo-insights sm:px-4 md:px-6 lg:px-8">
        <h4>💡 Key Insights</h4>
        <div className="insights-grid sm:px-4 md:px-6 lg:px-8">
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h5>Deep Learning Advantage</h5>
            <p>
              Neural networks can capture complex, non-linear relationships in fantasy football data 
              that traditional statistical models miss, leading to more accurate predictions.
            </p>
          </div>
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h5>Regularization Importance</h5>
            <p>
              Dropout and batch normalization are crucial for preventing overfitting in fantasy sports 
              where data can be noisy and patterns may not generalize well.
            </p>
          </div>
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h5>Architecture Design</h5>
            <p>
              Oracle&apos;s network architecture balances complexity and efficiency, using proven techniques 
              like residual connections and attention mechanisms for optimal performance.
            </p>
          </div>
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h5>Real-time Inference</h5>
            <p>
              Model optimization techniques ensure fast inference times (&lt;5ms) enabling real-time 
              predictions during live games and draft scenarios.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Learning Curve Analysis Section ---
  // Fix: Use unique key for table rows
  // Fix: Ensure all JSX tags are properly closed and parented
  const renderLearningCurveAnalysis = () => (
    <div className="learning-curve-section sm:px-4 md:px-6 lg:px-8">
      <h3>📈 Learning Curve Analysis</h3>
      <div className="curve-controls sm:px-4 md:px-6 lg:px-8">
        <label htmlFor="curve-select">Experiment:</label>
        <select id="curve-select" value={selectedLearningCurveConfig} onChange={e => setSelectedLearningCurveConfig(e.target.value)} value={cfg.id}>{cfg.name}</option>
          ))}
        </select>
        <button className="curve-run-btn sm:px-4 md:px-6 lg:px-8" onClick={runLearningCurveAnalysis} disabled={learningCurveRunning}>
          {learningCurveRunning ? &apos;Running...&apos; : &apos;Run Analysis&apos;}
        </button>
        <div className="curve-progress-bar sm:px-4 md:px-6 lg:px-8">
          <div className="curve-progress-fill sm:px-4 md:px-6 lg:px-8" style={{ width: `${learningCurveProgress}%` }}></div>
        </div>
      </div>
      {learningCurvePoints && (
}
        <div className="curve-results sm:px-4 md:px-6 lg:px-8">
          <h4>Results</h4>
          <table className="curve-table sm:px-4 md:px-6 lg:px-8">
            <thead>
              <tr>
                <th>Sample Size</th>
                <th>Train Loss</th>
                <th>Val Loss</th>
                <th>Train Acc</th>
                <th>Val Acc</th>
                <th>Converged</th>
              </tr>
            </thead>
            <tbody>
              {learningCurvePoints.map((pt: any) => (
}
                <tr key={`curve-${pt.sampleSize}-${pt.trainLoss.toFixed(4)}-${pt.valLoss.toFixed(4)}`} className={pt.converged ? &apos;converged-row&apos; : &apos;&apos;}>
                  <td>{pt.sampleSize}</td>
                  <td>{pt.trainLoss.toFixed(4)}</td>
                  <td>{pt.valLoss.toFixed(4)}</td>
                  <td>{(pt.trainAccuracy * 100).toFixed(1)}%</td>
                  <td>{(pt.valAccuracy * 100).toFixed(1)}%</td>
                  <td>{pt.converged ? &apos;✅&apos; : &apos;&apos;}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="curve-insights sm:px-4 md:px-6 lg:px-8">
            <h5>Insights</h5>
            <ul>
              <li>Model performance improves as sample size increases, with diminishing returns after convergence.</li>
              <li>Convergence point indicates sufficient data for optimal training.</li>
              <li>Gap between train and validation loss narrows as model generalizes.</li>
              <li>Use learning curves to assess data efficiency and avoid under/overfitting.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );

  // --- Feature Importance Analysis Section ---
  const renderFeatureImportanceAnalysis = () => (
    <div className="feature-importance-section sm:px-4 md:px-6 lg:px-8">
      <h3>🔍 Feature Importance Analysis</h3>
      
      <div className="importance-controls sm:px-4 md:px-6 lg:px-8">
        <div className="control-group sm:px-4 md:px-6 lg:px-8">
          <label htmlFor="config-select">Dataset:</label>
          <select 
            id="config-select" 
            value={selectedPermutationConfig} 
            onChange={e => setSelectedPermutationConfig(e.target.value)} value={cfg.id}>{cfg.name}</option>
            ))}
          </select>
        </div>
        
        <div className="control-group sm:px-4 md:px-6 lg:px-8">
          <label htmlFor="method-select">Method:</label>
          <select 
            id="method-select" 
            value={selectedFeatureMethod} 
            onChange={e => setSelectedFeatureMethod(e.target.value as &apos;permutation&apos; | &apos;shap&apos; | &apos;both&apos;)}
            <option value="permutation">Permutation Importance</option>
            <option value="shap">SHAP Values</option>
            <option value="both">Both Methods</option>
          </select>
        </div>
        
        <button 
          className="importance-run-btn sm:px-4 md:px-6 lg:px-8" 
          onClick={runFeatureImportanceAnalysis} 
          disabled={featureImportanceRunning}
        >
          {featureImportanceRunning ? &apos;Analyzing...&apos; : &apos;Run Analysis&apos;}
        </button>
        
        <div className="importance-progress-bar sm:px-4 md:px-6 lg:px-8">
          <div className="importance-progress-fill sm:px-4 md:px-6 lg:px-8" style={{ width: `${featureImportanceProgress}%` }}></div>
        </div>
      </div>

      {featureImportanceResults && (
}
        <div className="importance-results sm:px-4 md:px-6 lg:px-8">
          <div className="results-overview sm:px-4 md:px-6 lg:px-8">
            <h4>📊 Feature Ranking</h4>
            <div className="ranking-table sm:px-4 md:px-6 lg:px-8">
              <div className="table-header sm:px-4 md:px-6 lg:px-8">
                <span>Rank</span>
                <span>Feature</span>
                <span>Permutation</span>
                <span>SHAP Value</span>
                <span>Category</span>
                <span>Description</span>
              </div>
              {featureImportanceResults.map((result: any) => (
}
                <div key={`importance-${result.featureName}`} className={`table-row ${result.category}`}>
                  <span className="rank sm:px-4 md:px-6 lg:px-8">#{result.rank}</span>
                  <span className="feature-name sm:px-4 md:px-6 lg:px-8">{result.featureName}</span>
                  <span className="permutation-score sm:px-4 md:px-6 lg:px-8">
                    <div className="score-bar sm:px-4 md:px-6 lg:px-8">
                      <div 
                        className="score-fill sm:px-4 md:px-6 lg:px-8" 
                        style={{ width: `${result.permutationImportance * 100}%` }}
                      ></div>
                    </div>
                    {result.permutationImportance.toFixed(3)}
                  </span>
                  <span className="shap-value sm:px-4 md:px-6 lg:px-8">
                    <div className={`shap-indicator ${result.shapValue >= 0 ? &apos;positive&apos; : &apos;negative&apos;}`}>
                      {result.shapValue >= 0 ? &apos;+&apos; : &apos;&apos;}{result.shapValue.toFixed(3)}
                    </div>
                  </span>
                  <span className={`category-badge ${result.category}`}>
                    {result.category.toUpperCase()}
                  </span>
                  <span className="description sm:px-4 md:px-6 lg:px-8">{result.description}</span>
                </div>
              ))}
            </div>
          </div>

          {shapAnalysis && (
}
            <div className="shap-analysis sm:px-4 md:px-6 lg:px-8">
              <h4>🎯 SHAP Analysis</h4>
              
              <div className="shap-sections sm:px-4 md:px-6 lg:px-8">
                <div className="local-explanation sm:px-4 md:px-6 lg:px-8">
                  <h5>Local Explanation (Sample Prediction)</h5>
                  <div className="prediction-breakdown sm:px-4 md:px-6 lg:px-8">
                    <div className="prediction-summary sm:px-4 md:px-6 lg:px-8">
                      <div className="prediction-value sm:px-4 md:px-6 lg:px-8">
                        Predicted: <strong>{shapAnalysis.localExplanation.prediction.toFixed(1)} points</strong>
                      </div>
                      <div className="base-value sm:px-4 md:px-6 lg:px-8">
                        Base Value: {shapAnalysis.localExplanation.baseValue.toFixed(1)}
                      </div>
                    </div>
                    
                    <div className="contributions-chart sm:px-4 md:px-6 lg:px-8">
                      {shapAnalysis.localExplanation.contributions.map((contrib: any) => (
}
                        <div key={`contrib-${contrib.feature}`} className="contribution-bar sm:px-4 md:px-6 lg:px-8">
                          <div className="contrib-feature sm:px-4 md:px-6 lg:px-8">{contrib.feature}</div>
                          <div className="contrib-value sm:px-4 md:px-6 lg:px-8">
                            Value: {contrib.value.toFixed(1)}
                          </div>
                          <div className="contrib-shap sm:px-4 md:px-6 lg:px-8">
                            <div 
                              className={`shap-bar ${contrib.shapValue >= 0 ? &apos;positive&apos; : &apos;negative&apos;}`}
                              style={{ 
}
                                width: `${Math.abs(contrib.shapValue) * 50}px`,
                                marginLeft: contrib.shapValue < 0 ? `${50 - Math.abs(contrib.shapValue) * 50}px` : &apos;50px&apos;
                              }}
                            ></div>
                            <span className="shap-number sm:px-4 md:px-6 lg:px-8">
                              {contrib.shapValue >= 0 ? &apos;+&apos; : &apos;&apos;}{contrib.shapValue.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="interaction-matrix sm:px-4 md:px-6 lg:px-8">
                  <h5>Feature Interactions</h5>
                  <div className="matrix-visualization sm:px-4 md:px-6 lg:px-8">
                    <div className="matrix-grid sm:px-4 md:px-6 lg:px-8">
                      {shapAnalysis.interactionMatrix.map((row, i) => (
}
                        <div key={`matrix-row-${featureImportanceResults[i]?.featureName || i}`} className="matrix-row sm:px-4 md:px-6 lg:px-8">
                          {row.map((value, j) => (
}
                            <div 
                              key={`matrix-cell-${featureImportanceResults[i]?.featureName || i}-${featureImportanceResults[j]?.featureName || j}`}
                              className="matrix-cell sm:px-4 md:px-6 lg:px-8"
                              style={{ 
}
                                backgroundColor: `rgba(59, 130, 246, ${value})`,
                                color: value > 0.5 ? &apos;white&apos; : &apos;black&apos;
                              }}
                              title={`Interaction: ${value.toFixed(3)}`}
                            >
                              {value.toFixed(2)}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    <div className="matrix-labels sm:px-4 md:px-6 lg:px-8">
                      {featureImportanceResults.slice(0, 6).map((result: any) => (
}
                        <div key={`label-${result.featureName}`} className="matrix-label sm:px-4 md:px-6 lg:px-8">
                          {result.featureName}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="dependence-plots sm:px-4 md:px-6 lg:px-8">
                <h5>Feature Dependence Plots</h5>
                <div className="plots-grid sm:px-4 md:px-6 lg:px-8">
                  {shapAnalysis.dependencePlots.map((plot: any) => (
}
                    <div key={`plot-${plot.feature}`} className="dependence-plot sm:px-4 md:px-6 lg:px-8">
                      <h6>{plot.feature}</h6>
                      <div className="plot-container sm:px-4 md:px-6 lg:px-8">
                        <div className="plot-points sm:px-4 md:px-6 lg:px-8">
                          {plot.values.map((point, i) => (
}
                            <div
                              key={`point-${plot.feature}-${i}`}
                              className="plot-point sm:px-4 md:px-6 lg:px-8"
                              style={{
}
                                left: `${(point.x / 100) * 100}%`,
                                bottom: `${((point.y + 1) / 2) * 100}%`,
                                backgroundColor: `hsl(${point.color * 360}, 70%, 50%)`
                              }}
                            ></div>
                          ))}
                        </div>
                        <div className="plot-axes sm:px-4 md:px-6 lg:px-8">
                          <div className="x-axis-label sm:px-4 md:px-6 lg:px-8">Feature Value</div>
                          <div className="y-axis-label sm:px-4 md:px-6 lg:px-8">SHAP Value</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="importance-insights sm:px-4 md:px-6 lg:px-8">
            <h4>💡 Key Insights</h4>
            <div className="insights-grid sm:px-4 md:px-6 lg:px-8">
              <div className="insight-card sm:px-4 md:px-6 lg:px-8">
                <h5>🏆 Top Predictors</h5>
                <p>
                  The most important features for fantasy prediction are <strong>{featureImportanceResults[0]?.featureName}</strong> and <strong>{featureImportanceResults[1]?.featureName}</strong>, 
                  indicating that recent performance and usage metrics are critical for accurate forecasting.
                </p>
              </div>
              <div className="insight-card sm:px-4 md:px-6 lg:px-8">
                <h5>⚖️ SHAP Interpretability</h5>
                <p>
                  SHAP values show both positive and negative contributions, helping understand not just which features matter, 
                  but how they specifically impact individual predictions in either direction.
                </p>
              </div>
              <div className="insight-card sm:px-4 md:px-6 lg:px-8">
                <h5>🔗 Feature Interactions</h5>
                <p>
                  The interaction matrix reveals how features work together. Strong interactions between position-specific metrics 
                  and matchup difficulty create complex, non-linear prediction patterns.
                </p>
              </div>
              <div className="insight-card sm:px-4 md:px-6 lg:px-8">
                <h5>📈 Model Transparency</h5>
                <p>
                  Feature importance analysis provides transparency into Oracle&apos;s decision-making process, 
                  building trust and enabling better understanding of prediction rationale.
                </p>
              </div>
            </div>
          </div>

          <div className="methodology-section sm:px-4 md:px-6 lg:px-8">
            <h4>🔬 Methodology</h4>
            <div className="methodology-grid sm:px-4 md:px-6 lg:px-8">
              <div className="method-card sm:px-4 md:px-6 lg:px-8">
                <h5>Permutation Importance</h5>
                <p>
                  Measures feature importance by randomly shuffling feature values and observing the decrease in model performance. 
                  Higher values indicate features that are crucial for maintaining prediction accuracy.
                </p>
                <div className="method-formula sm:px-4 md:px-6 lg:px-8">
                  Importance = Performance(original) - Performance(permuted)
                </div>
              </div>
              <div className="method-card sm:px-4 md:px-6 lg:px-8">
                <h5>SHAP Values</h5>
                <p>
                  Provides unified framework for feature attribution based on cooperative game theory. 
                  SHAP values sum to the difference between prediction and baseline, ensuring faithful explanations.
                </p>
                <div className="method-formula sm:px-4 md:px-6 lg:px-8">
                  φᵢ = Σ |S|!(M-|S|-1)!/M! × [f(S∪&#123;i&#125;) - f(S)]
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="oracle-neural-section sm:px-4 md:px-6 lg:px-8">
      <div className="section-header sm:px-4 md:px-6 lg:px-8">
        <h2>🧠 Neural Network Architecture</h2>
        <p>Deep learning foundations powering Oracle&apos;s predictive intelligence</p>
      </div>
      
      <div className="section-navigation sm:px-4 md:px-6 lg:px-8">
        <button 
          className={`nav-button ${activeTab === &apos;overview&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;overview&apos;)}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;architecture&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;architecture&apos;)}
        >
          🏗️ Architecture
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;activations&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;activations&apos;)}
        >
          ⚡ Activations
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;training&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;training&apos;)}
        >
          🎓 Training
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;optimization&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;optimization&apos;)}
        >
          🚀 Optimization
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;demo&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;demo&apos;)}
        >
          🧪 Demo
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;learning_curve&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;learning_curve&apos;)}
        >
          📈 Learning Curve
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;feature_importance&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;feature_importance&apos;)}
        >
          🔍 Feature Importance
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;model_selection&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;model_selection&apos;)}
        >
          🤖 Model Selection
        </button>
      </div>
      
      <div className="section-content sm:px-4 md:px-6 lg:px-8">
        {activeTab === &apos;overview&apos; && renderOverview()}
        {activeTab === &apos;architecture&apos; && renderArchitecture()}
        {activeTab === &apos;activations&apos; && renderActivations()}
        {activeTab === &apos;training&apos; && renderTraining()}
        {activeTab === &apos;optimization&apos; && renderOptimization()}
        {activeTab === &apos;demo&apos; && renderDemo()}
        {activeTab === &apos;learning_curve&apos; && renderLearningCurveAnalysis()}
        {activeTab === &apos;feature_importance&apos; && renderFeatureImportanceAnalysis()}
        {activeTab === &apos;model_selection&apos; && renderModelSelection()}
      </div>
    </div>
  );
};

const OracleNeuralNetworkSectionWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OracleNeuralNetworkSection {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleNeuralNetworkSectionWithErrorBoundary);
