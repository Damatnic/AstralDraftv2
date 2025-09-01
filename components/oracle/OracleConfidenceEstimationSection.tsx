import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState } from &apos;react&apos;;
import &apos;./OracleConfidenceEstimationSection.css&apos;;

interface ConfidenceMethod {
}
  id: string;
  name: string;
  description: string;
  formula: string;
  advantages: string[];
  limitations: string[];
  implementationDetails: string;
  confidenceRange: string;
  useCases: string[];

}

interface UncertaintySource {
}
  id: string;
  name: string;
  type: &apos;Aleatoric&apos; | &apos;Epistemic&apos;;
  description: string;
  quantificationMethod: string;
  impact: &apos;Low&apos; | &apos;Medium&apos; | &apos;High&apos;;
  mitigation: string[];

interface CalibrationMetric {
}
  id: string;
  name: string;
  formula: string;
  description: string;
  idealValue: string;
  interpretation: string;

}

interface PredictionInterval {
}
  id: string;
  confidence: number;
  lowerBound: number;
  upperBound: number;
  prediction: number;
  method: string;
  width: number;

// Helper functions for method ratings
const getMethodEffectiveness = (methodId: string): string => {
}
  const ratings: Record<string, string> = {
}
    &apos;temperature_scaling&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
    &apos;evidential_deep_learning&apos;: &apos;⭐⭐⭐⭐&apos;,
    &apos;conformal_prediction&apos;: &apos;⭐⭐⭐&apos;,
    &apos;ensemble_uncertainty&apos;: &apos;⭐⭐&apos;,
    &apos;monte_carlo&apos;: &apos;⭐&apos;,
    &apos;bayesian_neural_networks&apos;: &apos;⭐&apos;
  };
  return ratings[methodId] || &apos;⭐&apos;;
};

const getMethodSpeedRating = (methodId: string): string => {
}
  const ratings: Record<string, string> = {
}
    &apos;ensemble_uncertainty&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
    &apos;evidential_deep_learning&apos;: &apos;⭐⭐⭐⭐&apos;,
    &apos;conformal_prediction&apos;: &apos;⭐⭐⭐⭐&apos;,
    &apos;temperature_scaling&apos;: &apos;⭐⭐⭐&apos;,
    &apos;monte_carlo&apos;: &apos;⭐⭐⭐&apos;,
    &apos;bayesian_neural_networks&apos;: &apos;⭐⭐⭐&apos;
  };
  return ratings[methodId] || &apos;⭐⭐⭐&apos;;
};

const getMethodScalabilityRating = (methodId: string): string => {
}
  const ratings: Record<string, string> = {
}
    &apos;temperature_scaling&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
    &apos;ensemble_uncertainty&apos;: &apos;⭐⭐⭐⭐&apos;,
    &apos;conformal_prediction&apos;: &apos;⭐⭐⭐&apos;,
    &apos;evidential_deep_learning&apos;: &apos;⭐⭐&apos;,
    &apos;monte_carlo&apos;: &apos;⭐&apos;,
    &apos;bayesian_neural_networks&apos;: &apos;⭐&apos;
  };
  return ratings[methodId] || &apos;⭐&apos;;
};

const getMethodRobustnessRating = (methodId: string): string => {
}
  const ratings: Record<string, string> = {
}
    &apos;conformal_prediction&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
    &apos;evidential_deep_learning&apos;: &apos;⭐⭐⭐⭐&apos;,
    &apos;ensemble_uncertainty&apos;: &apos;⭐⭐⭐&apos;,
    &apos;temperature_scaling&apos;: &apos;⭐⭐⭐&apos;,
    &apos;monte_carlo&apos;: &apos;⭐⭐&apos;,
    &apos;bayesian_neural_networks&apos;: &apos;⭐⭐&apos;
  };
  return ratings[methodId] || &apos;⭐⭐&apos;;
};

const getConfidenceClass = (confidence: number): string => {
}
  if (confidence > 0.8) return &apos;high&apos;;
  if (confidence > 0.7) return &apos;medium&apos;;
  return &apos;low&apos;;
};

function OracleConfidenceEstimationSection() {
}
  const [activeTab, setActiveTab] = useState<&apos;overview&apos; | &apos;methods&apos; | &apos;uncertainty&apos; | &apos;calibration&apos; | &apos;intervals&apos; | &apos;demo&apos;>(&apos;overview&apos;);
  const [selectedMethod, setSelectedMethod] = useState<string>(&apos;monte_carlo&apos;);
  const [selectedUncertaintyType, setSelectedUncertaintyType] = useState<string>(&apos;aleatoric&apos;);
  const [confidenceLevel, setConfidenceLevel] = useState<number>(95);
  const [simulationResults, setSimulationResults] = useState<any>(null);

  // Confidence Estimation Methods
  const confidenceMethods: ConfidenceMethod[] = [
    {
}
      id: &apos;monte_carlo&apos;,
      name: &apos;Monte Carlo Dropout&apos;,
      description: &apos;Uses dropout at inference time to approximate Bayesian uncertainty through multiple forward passes&apos;,
      formula: &apos;μ = (1/T)∑f(x), σ² = (1/T)∑(f(x) - μ)²&apos;,
      advantages: [
        &apos;Easy to implement with existing models&apos;,
        &apos;Provides both prediction and uncertainty&apos;,
        &apos;No architectural changes required&apos;,
        &apos;Computationally efficient&apos;
      ],
      limitations: [
        &apos;Approximation quality depends on dropout rate&apos;,
        &apos;May underestimate uncertainty&apos;,
        &apos;Requires multiple forward passes&apos;,
        &apos;Not theoretically grounded&apos;
      ],
      implementationDetails: &apos;Enable dropout during inference and run T=100 forward passes to estimate prediction variance&apos;,
      confidenceRange: &apos;0-100% based on prediction variance&apos;,
      useCases: [&apos;Real-time prediction confidence&apos;, &apos;Model uncertainty estimation&apos;, &apos;Active learning&apos;]
    },
    {
}
      id: &apos;bayesian_neural_network&apos;,
      name: &apos;Bayesian Neural Networks&apos;,
      description: &apos;Treats network weights as probability distributions rather than point estimates&apos;,
      formula: &apos;p(y|x,D) = ∫p(y|x,θ)p(θ|D)dθ&apos;,
      advantages: [
        &apos;Principled uncertainty quantification&apos;,
        &apos;Naturally captures model uncertainty&apos;,
        &apos;Theoretically well-founded&apos;,
        &apos;Provides full posterior distribution&apos;
      ],
      limitations: [
        &apos;Computationally expensive&apos;,
        &apos;Complex implementation&apos;,
        &apos;Slower inference&apos;,
        &apos;Requires specialized training&apos;
      ],
      implementationDetails: &apos;Use variational inference with mean-field approximation and reparameterization trick&apos;,
      confidenceRange: &apos;0-100% from posterior predictive distribution&apos;,
      useCases: [&apos;High-stakes predictions&apos;, &apos;Safety-critical applications&apos;, &apos;Research applications&apos;]
    },
    {
}
      id: &apos;ensemble_uncertainty&apos;,
      name: &apos;Deep Ensembles&apos;,
      description: &apos;Trains multiple independent models and uses ensemble disagreement as uncertainty measure&apos;,
      formula: &apos;σ²_ensemble = (1/M)∑(fᵢ(x) - f̄(x))²&apos;,
      advantages: [
        &apos;High-quality uncertainty estimates&apos;,
        &apos;Captures both types of uncertainty&apos;,
        &apos;Simple to understand and implement&apos;,
        &apos;Proven effectiveness&apos;
      ],
      limitations: [
        &apos;Computationally expensive training&apos;,
        &apos;Multiple models to maintain&apos;,
        &apos;Higher memory requirements&apos;,
        &apos;Slower inference&apos;
      ],
      implementationDetails: &apos;Train 5-10 models with different initializations and compute prediction variance&apos;,
      confidenceRange: &apos;0-100% based on ensemble variance&apos;,
      useCases: [&apos;Production systems&apos;, &apos;Critical predictions&apos;, &apos;Uncertainty-aware decisions&apos;]
    },
    {
}
      id: &apos;evidential_deep_learning&apos;,
      name: &apos;Evidential Deep Learning&apos;,
      description: &apos;Learns a higher-order distribution over predictions to capture uncertainty&apos;,
      formula: &apos;p(y|x) ~ NormalInverseGamma(μ,λ,α,β)&apos;,
      advantages: [
        &apos;Single forward pass&apos;,
        &apos;Separates aleatoric and epistemic uncertainty&apos;,
        &apos;Theoretically principled&apos;,
        &apos;Computationally efficient&apos;
      ],
      limitations: [
        &apos;Complex loss function&apos;,
        &apos;Sensitive to hyperparameters&apos;,
        &apos;Limited empirical validation&apos;,
        &apos;Requires specialized architecture&apos;
      ],
      implementationDetails: &apos;Modify output layer to predict distribution parameters and use evidential loss&apos;,
      confidenceRange: &apos;0-100% from evidential distribution&apos;,
      useCases: [&apos;Out-of-distribution detection&apos;, &apos;Active learning&apos;, &apos;Robust predictions&apos;]
    },
    {
}
      id: &apos;conformal_prediction&apos;,
      name: &apos;Conformal Prediction&apos;,
      description: &apos;Provides prediction intervals with finite-sample validity guarantees&apos;,
      formula: &apos;C(x) = {y : s(x,y) ≤ ĝ((n+1)(1-α))}&apos;,
      advantages: [
        &apos;Distribution-free guarantees&apos;,
        &apos;Valid for any model&apos;,
        &apos;Exact coverage probability&apos;,
        &apos;Model-agnostic approach&apos;
      ],
      limitations: [
        &apos;Requires calibration set&apos;,
        &apos;May produce large intervals&apos;,
        &apos;Limited to coverage guarantees&apos;,
        &apos;No uncertainty quantification&apos;
      ],
      implementationDetails: &apos;Use nonconformity scores and calibration set to construct prediction intervals&apos;,
      confidenceRange: &apos;User-specified confidence level (e.g., 90%, 95%)&apos;,
      useCases: [&apos;Safety-critical applications&apos;, &apos;Regulatory compliance&apos;, &apos;Risk management&apos;]
    },
    {
}
      id: &apos;temperature_scaling&apos;,
      name: &apos;Temperature Scaling&apos;,
      description: &apos;Post-hoc calibration method that rescales logits to improve confidence calibration&apos;,
      formula: &apos;p̂ᵢ = max σ(zᵢ/T), where T is learned temperature&apos;,
      advantages: [
        &apos;Simple and effective&apos;,
        &apos;Fast calibration&apos;,
        &apos;Preserves accuracy&apos;,
        &apos;Single parameter optimization&apos;
      ],
      limitations: [
        &apos;Only for classification&apos;,
        &apos;Requires validation set&apos;,
        &apos;Uniform scaling&apos;,
        &apos;Limited expressiveness&apos;
      ],
      implementationDetails: &apos;Optimize temperature parameter T on validation set using NLL loss&apos;,
      confidenceRange: &apos;0-100% calibrated confidence scores&apos;,
      useCases: [&apos;Model calibration&apos;, &apos;Confidence thresholding&apos;, &apos;Decision making&apos;]

  ];

  // Uncertainty Sources
  const uncertaintySources: UncertaintySource[] = [
    {
}
      id: &apos;data_noise&apos;,
      name: &apos;Data/Measurement Noise&apos;,
      type: &apos;Aleatoric&apos;,
      description: &apos;Inherent randomness in player performance and game outcomes that cannot be reduced&apos;,
      quantificationMethod: &apos;Statistical analysis of historical variance in player performance&apos;,
      impact: &apos;Medium&apos;,
      mitigation: [&apos;Robust loss functions&apos;, &apos;Data augmentation&apos;, &apos;Ensemble methods&apos;]
    },
    {
}
      id: &apos;model_uncertainty&apos;,
      name: &apos;Model Parameter Uncertainty&apos;,
      type: &apos;Epistemic&apos;,
      description: &apos;Uncertainty about the optimal model parameters due to limited training data&apos;,
      quantificationMethod: &apos;Bayesian inference over model weights&apos;,
      impact: &apos;High&apos;,
      mitigation: [&apos;Bayesian neural networks&apos;, &apos;Dropout&apos;, &apos;Weight decay regularization&apos;]
    },
    {
}
      id: &apos;structural_uncertainty&apos;,
      name: &apos;Model Structure Uncertainty&apos;,
      type: &apos;Epistemic&apos;,
      description: &apos;Uncertainty about the correct model architecture and feature selection&apos;,
      quantificationMethod: &apos;Model averaging across different architectures&apos;,
      impact: &apos;High&apos;,
      mitigation: [&apos;Neural architecture search&apos;, &apos;Ensemble of different models&apos;, &apos;Cross-validation&apos;]
    },
    {
}
      id: &apos;distributional_shift&apos;,
      name: &apos;Distribution Shift&apos;,
      type: &apos;Epistemic&apos;,
      description: &apos;Changes in data distribution between training and deployment (injuries, rule changes)&apos;,
      quantificationMethod: &apos;Out-of-distribution detection and domain adaptation metrics&apos;,
      impact: &apos;High&apos;,
      mitigation: [&apos;Continual learning&apos;, &apos;Domain adaptation&apos;, &apos;Robust optimization&apos;]
    },
    {
}
      id: &apos;feature_uncertainty&apos;,
      name: &apos;Feature/Input Uncertainty&apos;,
      type: &apos;Aleatoric&apos;,
      description: &apos;Uncertainty in measured features like weather conditions or injury status&apos;,
      quantificationMethod: &apos;Propagation of input uncertainties through the model&apos;,
      impact: &apos;Medium&apos;,
      mitigation: [&apos;Input noise modeling&apos;, &apos;Robust features&apos;, &apos;Multiple data sources&apos;]
    },
    {
}
      id: &apos;temporal_uncertainty&apos;,
      name: &apos;Temporal Dynamics&apos;,
      type: &apos;Aleatoric&apos;,
      description: &apos;Uncertainty due to changing player form, team dynamics, and seasonal effects&apos;,
      quantificationMethod: &apos;Time-series analysis and trend detection&apos;,
      impact: &apos;Medium&apos;,
      mitigation: [&apos;Recurrent architectures&apos;, &apos;Attention mechanisms&apos;, &apos;Adaptive learning rates&apos;]

  ];

  // Calibration Metrics
  const calibrationMetrics: CalibrationMetric[] = [
    {
}
      id: &apos;ece&apos;,
      name: &apos;Expected Calibration Error (ECE)&apos;,
      formula: &apos;ECE = Σᵦ (nᵦ/n)|acc(b) - conf(b)|&apos;,
      description: &apos;Measures the difference between confidence and accuracy across confidence bins&apos;,
      idealValue: &apos;0.0&apos;,
      interpretation: &apos;Lower values indicate better calibration. ECE < 0.05 is considered well-calibrated.&apos;
    },
    {
}
      id: &apos;mce&apos;,
      name: &apos;Maximum Calibration Error (MCE)&apos;,
      formula: &apos;MCE = maxᵦ|acc(b) - conf(b)|&apos;,
      description: &apos;Maximum difference between confidence and accuracy across all bins&apos;,
      idealValue: &apos;0.0&apos;,
      interpretation: &apos;Measures worst-case calibration error. MCE < 0.1 indicates reasonable calibration.&apos;
    },
    {
}
      id: &apos;reliability_diagram&apos;,
      name: &apos;Reliability Diagram&apos;,
      formula: &apos;Plot of bin accuracy vs bin confidence&apos;,
      description: &apos;Visual representation of calibration across different confidence levels&apos;,
      idealValue: &apos;Perfect diagonal line&apos;,
      interpretation: &apos;Points below diagonal indicate overconfidence, above indicate underconfidence.&apos;
    },
    {
}
      id: &apos;brier_score&apos;,
      name: &apos;Brier Score&apos;,
      formula: &apos;BS = (1/N)Σᵢ(pᵢ - yᵢ)²&apos;,
      description: &apos;Measures accuracy of probabilistic predictions&apos;,
      idealValue: &apos;0.0&apos;,
      interpretation: &apos;Lower scores indicate better calibrated predictions. Combines calibration and sharpness.&apos;
    },
    {
}
      id: &apos;log_likelihood&apos;,
      name: &apos;Negative Log-Likelihood&apos;,
      formula: &apos;NLL = -(1/N)Σᵢlog(pᵢ)&apos;,
      description: &apos;Measures quality of predicted probabilities&apos;,
      idealValue: &apos;Lower values&apos;,
      interpretation: &apos;Proper scoring rule that rewards confident correct predictions and penalizes confident incorrect ones.&apos;

  ];

  // Generate prediction intervals
  const generatePredictionIntervals = (confidenceLevel: number): PredictionInterval[] => {
}
    const prediction = 18.5; // Example fantasy points prediction
    const baseUncertainty = 3.2;
    
    return [
      {
}
        id: &apos;monte_carlo_interval&apos;,
        confidence: confidenceLevel,
        prediction: prediction,
        method: &apos;Monte Carlo Dropout&apos;,
        lowerBound: prediction - (baseUncertainty * (confidenceLevel / 100) * 1.96),
        upperBound: prediction + (baseUncertainty * (confidenceLevel / 100) * 1.96),
        width: 2 * (baseUncertainty * (confidenceLevel / 100) * 1.96)
      },
      {
}
        id: &apos;bayesian_interval&apos;,
        confidence: confidenceLevel,
        prediction: prediction,
        method: &apos;Bayesian Neural Network&apos;,
        lowerBound: prediction - (baseUncertainty * 0.9 * (confidenceLevel / 100) * 1.96),
        upperBound: prediction + (baseUncertainty * 0.9 * (confidenceLevel / 100) * 1.96),
        width: 2 * (baseUncertainty * 0.9 * (confidenceLevel / 100) * 1.96)
      },
      {
}
        id: &apos;ensemble_interval&apos;,
        confidence: confidenceLevel,
        prediction: prediction,
        method: &apos;Deep Ensemble&apos;,
        lowerBound: prediction - (baseUncertainty * 1.1 * (confidenceLevel / 100) * 1.96),
        upperBound: prediction + (baseUncertainty * 1.1 * (confidenceLevel / 100) * 1.96),
        width: 2 * (baseUncertainty * 1.1 * (confidenceLevel / 100) * 1.96)
      },
      {
}
        id: &apos;conformal_interval&apos;,
        confidence: confidenceLevel,
        prediction: prediction,
        method: &apos;Conformal Prediction&apos;,
        lowerBound: prediction - (baseUncertainty * 1.2 * (confidenceLevel / 100) * 1.96),
        upperBound: prediction + (baseUncertainty * 1.2 * (confidenceLevel / 100) * 1.96),
        width: 2 * (baseUncertainty * 1.2 * (confidenceLevel / 100) * 1.96)

    ];
  };

  // Simulate confidence estimation
  const simulateConfidenceEstimation = () => {
}
    const predictions = Array.from({ length: 100 }, (_, i) => ({
}
      id: i,
      player: `Player ${i + 1}`,
      prediction: 15 + Math.random() * 10,
      confidence: 0.6 + Math.random() * 0.4,
      uncertainty: Math.random() * 2 + 0.5,
      method: confidenceMethods[Math.floor(Math.random() * confidenceMethods.length)].name
    }));

    setSimulationResults({
}
      predictions,
      averageConfidence: predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length,
      averageUncertainty: predictions.reduce((sum, p) => sum + p.uncertainty, 0) / predictions.length,
      highConfidencePredictions: predictions.filter((p: any) => p.confidence > 0.8).length,
      lowConfidencePredictions: predictions.filter((p: any) => p.confidence < 0.7).length,
      calibrationScore: 0.923, // Simulated calibration score
      reliabilityScore: 0.887  // Simulated reliability score
    });
  };

  const renderOverview = () => (
    <div className="confidence-overview sm:px-4 md:px-6 lg:px-8">
      <h3>🎯 Confidence Scores & Uncertainty Quantification</h3>
      <div className="overview-content sm:px-4 md:px-6 lg:px-8">
        <div className="overview-section sm:px-4 md:px-6 lg:px-8">
          <h4>Why Confidence Matters</h4>
          <p>
            In fantasy football, knowing how confident Oracle is in its predictions is just as important as the predictions themselves. 
            Confidence scores help you make informed decisions about which players to start, trade, or target in drafts. 
            Oracle provides sophisticated uncertainty quantification to give you a complete picture of prediction reliability.
          </p>
          
          <div className="confidence-benefits sm:px-4 md:px-6 lg:px-8">
            <h5>🎲 Key Benefits</h5>
            <div className="benefits-grid sm:px-4 md:px-6 lg:px-8">
              <div className="benefit-card sm:px-4 md:px-6 lg:px-8">
                <span className="benefit-icon sm:px-4 md:px-6 lg:px-8">📊</span>
                <h6>Risk Assessment</h6>
                <p>Understand the risk level of each prediction to make better lineup decisions</p>
              </div>
              <div className="benefit-card sm:px-4 md:px-6 lg:px-8">
                <span className="benefit-icon sm:px-4 md:px-6 lg:px-8">🎯</span>
                <h6>Decision Support</h6>
                <p>Use confidence levels to prioritize high-certainty predictions over risky plays</p>
              </div>
              <div className="benefit-card sm:px-4 md:px-6 lg:px-8">
                <span className="benefit-icon sm:px-4 md:px-6 lg:px-8">⚖️</span>
                <h6>Balanced Strategies</h6>
                <p>Balance safe, high-confidence picks with potentially high-reward uncertain plays</p>
              </div>
              <div className="benefit-card sm:px-4 md:px-6 lg:px-8">
                <span className="benefit-icon sm:px-4 md:px-6 lg:px-8">🔬</span>
                <h6>Model Transparency</h6>
                <p>Understand when Oracle is uncertain and why certain predictions are more reliable</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overview-section sm:px-4 md:px-6 lg:px-8">
          <h4>Oracle&apos;s Confidence Framework</h4>
          <div className="confidence-framework sm:px-4 md:px-6 lg:px-8">
            <div className="framework-flow sm:px-4 md:px-6 lg:px-8">
              <div className="flow-stage sm:px-4 md:px-6 lg:px-8">
                <div className="stage-icon sm:px-4 md:px-6 lg:px-8">🧠</div>
                <h6>Prediction Generation</h6>
                <p>Neural network generates base prediction</p>
              </div>
              <div className="flow-arrow sm:px-4 md:px-6 lg:px-8">→</div>
              <div className="flow-stage sm:px-4 md:px-6 lg:px-8">
                <div className="stage-icon sm:px-4 md:px-6 lg:px-8">📈</div>
                <h6>Uncertainty Estimation</h6>
                <p>Multiple methods quantify prediction uncertainty</p>
              </div>
              <div className="flow-arrow sm:px-4 md:px-6 lg:px-8">→</div>
              <div className="flow-stage sm:px-4 md:px-6 lg:px-8">
                <div className="stage-icon sm:px-4 md:px-6 lg:px-8">🎯</div>
                <h6>Confidence Score</h6>
                <p>Combined confidence metric (0-100%)</p>
              </div>
            </div>
          </div>
          
          <div className="confidence-types sm:px-4 md:px-6 lg:px-8">
            <h5>Types of Uncertainty</h5>
            <div className="uncertainty-grid sm:px-4 md:px-6 lg:px-8">
              <div className="uncertainty-card aleatoric sm:px-4 md:px-6 lg:px-8">
                <h6>🎲 Aleatoric Uncertainty</h6>
                <p><strong>Data Uncertainty:</strong> Inherent randomness in player performance that cannot be reduced with more data</p>
                <ul>
                  <li>Player performance variability</li>
                  <li>Weather and game conditions</li>
                  <li>Injury and fatigue effects</li>
                </ul>
              </div>
              <div className="uncertainty-card epistemic sm:px-4 md:px-6 lg:px-8">
                <h6>🧠 Epistemic Uncertainty</h6>
                <p><strong>Model Uncertainty:</strong> Uncertainty about the model itself that can be reduced with more data or better models</p>
                <ul>
                  <li>Model parameter uncertainty</li>
                  <li>Architecture uncertainty</li>
                  <li>Out-of-distribution scenarios</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overview-section sm:px-4 md:px-6 lg:px-8">
          <h4>Confidence Score Interpretation</h4>
          <div className="score-interpretation sm:px-4 md:px-6 lg:px-8">
            <div className="confidence-levels sm:px-4 md:px-6 lg:px-8">
              <div className="confidence-level high sm:px-4 md:px-6 lg:px-8">
                <div className="level-indicator sm:px-4 md:px-6 lg:px-8">90-100%</div>
                <div className="level-content sm:px-4 md:px-6 lg:px-8">
                  <h6>🟢 High Confidence</h6>
                  <p>Strong conviction in prediction. Low uncertainty across all methods. Ideal for must-start decisions.</p>
                </div>
              </div>
              <div className="confidence-level medium sm:px-4 md:px-6 lg:px-8">
                <div className="level-indicator sm:px-4 md:px-6 lg:px-8">70-89%</div>
                <div className="level-content sm:px-4 md:px-6 lg:px-8">
                  <h6>🟡 Medium Confidence</h6>
                  <p>Moderate certainty with some uncertainty factors. Good for lineup decisions with alternatives.</p>
                </div>
              </div>
              <div className="confidence-level low sm:px-4 md:px-6 lg:px-8">
                <div className="level-indicator sm:px-4 md:px-6 lg:px-8">50-69%</div>
                <div className="level-content sm:px-4 md:px-6 lg:px-8">
                  <h6>🟠 Low Confidence</h6>
                  <p>Significant uncertainty present. Consider as boom-or-bust plays with careful risk management.</p>
                </div>
              </div>
              <div className="confidence-level very-low sm:px-4 md:px-6 lg:px-8">
                <div className="level-indicator sm:px-4 md:px-6 lg:px-8">0-49%</div>
                <div className="level-content sm:px-4 md:px-6 lg:px-8">
                  <h6>🔴 Very Low Confidence</h6>
                  <p>High uncertainty across methods. Avoid or use sparingly in low-stakes situations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMethods = () => (
    <div className="confidence-methods sm:px-4 md:px-6 lg:px-8">
      <h3>🔬 Confidence Estimation Methods</h3>
      <div className="methods-grid sm:px-4 md:px-6 lg:px-8">
        {confidenceMethods.map((method: any) => (
}
          <button
            key={method.id}
            className={`method-card ${selectedMethod === method.id ? &apos;selected&apos; : &apos;&apos;}`}
            onClick={() => setSelectedMethod(method.id)}
            aria-label={`Select ${method.name} method`}
          >
            <div className="method-header sm:px-4 md:px-6 lg:px-8">
              <h4>{method.name}</h4>
              {selectedMethod === method.id && <span className="selected-badge sm:px-4 md:px-6 lg:px-8">Selected</span>}
            </div>
            
            <p className="method-description sm:px-4 md:px-6 lg:px-8">{method.description}</p>
            
            <div className="method-formula sm:px-4 md:px-6 lg:px-8">
              <strong>Formula:</strong>
              <div className="formula sm:px-4 md:px-6 lg:px-8">{method.formula}</div>
            </div>
            
            <div className="method-range sm:px-4 md:px-6 lg:px-8">
              <strong>Confidence Range:</strong> {method.confidenceRange}
            </div>
            
            <div className="method-analysis sm:px-4 md:px-6 lg:px-8">
              <div className="advantages sm:px-4 md:px-6 lg:px-8">
                <h6>✅ Advantages</h6>
                <ul>
                  {method.advantages.map((advantage, index) => (
}
                    <li key={`advantage-${method.id}-${index}`}>{advantage}</li>
                  ))}
                </ul>
              </div>
              <div className="limitations sm:px-4 md:px-6 lg:px-8">
                <h6>⚠️ Limitations</h6>
                <ul>
                  {method.limitations.map((limitation, index) => (
}
                    <li key={`limitation-${method.id}-${index}`}>{limitation}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            {selectedMethod === method.id && (
}
              <div className="method-details sm:px-4 md:px-6 lg:px-8">
                <div className="implementation-details sm:px-4 md:px-6 lg:px-8">
                  <h6>🔧 Implementation</h6>
                  <p>{method.implementationDetails}</p>
                </div>
                
                <div className="use-cases sm:px-4 md:px-6 lg:px-8">
                  <h6>🎯 Use Cases</h6>
                  <ul>
                    {method.useCases.map((useCase, index) => (
}
                      <li key={`usecase-${method.id}-${index}`}>{useCase}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      
      <div className="methods-comparison sm:px-4 md:px-6 lg:px-8">
        <h4>📊 Method Comparison</h4>
        <div className="comparison-table sm:px-4 md:px-6 lg:px-8">
          <div className="table-header sm:px-4 md:px-6 lg:px-8">
            <span>Method</span>
            <span>Computational Cost</span>
            <span>Quality</span>
            <span>Implementation</span>
            <span>Theoretical Foundation</span>
          </div>
          {confidenceMethods.map((method: any) => (
}
            <div key={`comparison-${method.id}`} className="table-row sm:px-4 md:px-6 lg:px-8">
              <span className="method-name sm:px-4 md:px-6 lg:px-8">{method.name}</span>
              <span className="cost-score sm:px-4 md:px-6 lg:px-8">
                {getMethodEffectiveness(method.id)}
              </span>
              <span className="quality-score sm:px-4 md:px-6 lg:px-8">
                {getMethodSpeedRating(method.id)}
              </span>
              <span className="implementation-score sm:px-4 md:px-6 lg:px-8">
                {getMethodScalabilityRating(method.id)}
              </span>
              <span className="theory-score sm:px-4 md:px-6 lg:px-8">
                {getMethodRobustnessRating(method.id)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUncertainty = () => (
    <div className="uncertainty-sources sm:px-4 md:px-6 lg:px-8">
      <h3>🔍 Uncertainty Sources & Analysis</h3>
      <div className="uncertainty-type-selector sm:px-4 md:px-6 lg:px-8">
        <button
          className={`type-button ${selectedUncertaintyType === &apos;aleatoric&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setSelectedUncertaintyType(&apos;aleatoric&apos;)}
        >
          🎲 Aleatoric (Data) Uncertainty
        </button>
        <button
          className={`type-button ${selectedUncertaintyType === &apos;epistemic&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setSelectedUncertaintyType(&apos;epistemic&apos;)}
        >
          🧠 Epistemic (Model) Uncertainty
        </button>
        <button
          className={`type-button ${selectedUncertaintyType === &apos;all&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setSelectedUncertaintyType(&apos;all&apos;)}
        >
          📊 All Sources
        </button>
      </div>
      
      <div className="uncertainty-grid sm:px-4 md:px-6 lg:px-8">
        {uncertaintySources
}
          .filter((source: any) => selectedUncertaintyType === &apos;all&apos; || source.type.toLowerCase() === selectedUncertaintyType)
          .map((source: any) => (
            <div key={source.id} className={`uncertainty-card ${source.type.toLowerCase()}`}>
              <div className="uncertainty-header sm:px-4 md:px-6 lg:px-8">
                <h4>{source.name}</h4>
                <div className="uncertainty-badges sm:px-4 md:px-6 lg:px-8">
                  <span className={`type-badge ${source.type.toLowerCase()}`}>{source.type}</span>
                  <span className={`impact-badge ${source.impact.toLowerCase()}`}>{source.impact} Impact</span>
                </div>
              </div>
              
              <p className="uncertainty-description sm:px-4 md:px-6 lg:px-8">{source.description}</p>
              
              <div className="quantification-method sm:px-4 md:px-6 lg:px-8">
                <strong>Quantification:</strong>
                <p>{source.quantificationMethod}</p>
              </div>
              
              <div className="mitigation-strategies sm:px-4 md:px-6 lg:px-8">
                <h6>🛡️ Mitigation Strategies</h6>
                <ul>
                  {source.mitigation.map((strategy, index) => (
}
                    <li key={`mitigation-${source.id}-${index}`}>{strategy}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
      </div>
      
      <div className="uncertainty-framework sm:px-4 md:px-6 lg:px-8">
        <h4>🔬 Oracle&apos;s Uncertainty Decomposition</h4>
        <div className="decomposition-formula sm:px-4 md:px-6 lg:px-8">
          <div className="formula-card sm:px-4 md:px-6 lg:px-8">
            <h6>Total Uncertainty Decomposition</h6>
            <div className="formula sm:px-4 md:px-6 lg:px-8">
              σ²_total = σ²_aleatoric + σ²_epistemic
            </div>
            <p>Oracle separates total prediction uncertainty into reducible and irreducible components</p>
          </div>
          
          <div className="formula-card sm:px-4 md:px-6 lg:px-8">
            <h6>Aleatoric Uncertainty</h6>
            <div className="formula sm:px-4 md:px-6 lg:px-8">
              σ²_aleatoric = E[Var[y|x,θ]]
            </div>
            <p>Data-dependent uncertainty that cannot be reduced by collecting more data</p>
          </div>
          
          <div className="formula-card sm:px-4 md:px-6 lg:px-8">
            <h6>Epistemic Uncertainty</h6>
            <div className="formula sm:px-4 md:px-6 lg:px-8">
              σ²_epistemic = Var[E[y|x,θ]]
            </div>
            <p>Model uncertainty that can be reduced with more data or better models</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalibration = () => (
    <div className="calibration-section sm:px-4 md:px-6 lg:px-8">
      <h3>⚖️ Calibration & Reliability</h3>
      <div className="calibration-intro sm:px-4 md:px-6 lg:px-8">
        <p>
          A well-calibrated model means that when it predicts 80% confidence, it should be correct about 80% of the time. 
          Oracle employs multiple calibration techniques to ensure its confidence scores are reliable and trustworthy.
        </p>
      </div>
      
      <div className="calibration-metrics sm:px-4 md:px-6 lg:px-8">
        <h4>📊 Calibration Metrics</h4>
        <div className="metrics-grid sm:px-4 md:px-6 lg:px-8">
          {calibrationMetrics.map((metric: any) => (
}
            <div key={metric.id} className="metric-card sm:px-4 md:px-6 lg:px-8">
              <h5>{metric.name}</h5>
              <div className="metric-formula sm:px-4 md:px-6 lg:px-8">
                <strong>Formula:</strong>
                <div className="formula sm:px-4 md:px-6 lg:px-8">{metric.formula}</div>
              </div>
              <p className="metric-description sm:px-4 md:px-6 lg:px-8">{metric.description}</p>
              <div className="metric-interpretation sm:px-4 md:px-6 lg:px-8">
                <div className="ideal-value sm:px-4 md:px-6 lg:px-8">
                  <strong>Ideal Value:</strong> {metric.idealValue}
                </div>
                <div className="interpretation sm:px-4 md:px-6 lg:px-8">
                  <strong>Interpretation:</strong> {metric.interpretation}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="calibration-techniques sm:px-4 md:px-6 lg:px-8">
        <h4>🔧 Calibration Techniques</h4>
        <div className="techniques-grid sm:px-4 md:px-6 lg:px-8">
          <div className="technique-card sm:px-4 md:px-6 lg:px-8">
            <h5>🌡️ Temperature Scaling</h5>
            <p>Post-hoc calibration method that learns a single temperature parameter to rescale logits</p>
            <div className="technique-details sm:px-4 md:px-6 lg:px-8">
              <strong>When to use:</strong> Simple, effective for most models
              <br />
              <strong>Limitations:</strong> Uniform scaling across all predictions
            </div>
          </div>
          <div className="technique-card sm:px-4 md:px-6 lg:px-8">
            <h5>📈 Platt Scaling</h5>
            <p>Fits a sigmoid function to map model outputs to calibrated probabilities</p>
            <div className="technique-details sm:px-4 md:px-6 lg:px-8">
              <strong>When to use:</strong> Small datasets, binary classification
              <br />
              <strong>Limitations:</strong> Can overfit with limited data
            </div>
          </div>
          <div className="technique-card sm:px-4 md:px-6 lg:px-8">
            <h5>🔍 Isotonic Regression</h5>
            <p>Non-parametric method that learns a monotonic mapping function</p>
            <div className="technique-details sm:px-4 md:px-6 lg:px-8">
              <strong>When to use:</strong> Large datasets, complex calibration needs
              <br />
              <strong>Limitations:</strong> Requires more data, less interpretable
            </div>
          </div>
          <div className="technique-card sm:px-4 md:px-6 lg:px-8">
            <h5>🧮 Histogram Binning</h5>
            <p>Divides predictions into bins and assigns calibrated probabilities</p>
            <div className="technique-details sm:px-4 md:px-6 lg:px-8">
              <strong>When to use:</strong> Simple baseline method
              <br />
              <strong>Limitations:</strong> Loses information, sensitive to bin choice
            </div>
          </div>
        </div>
      </div>
      
      <div className="calibration-results sm:px-4 md:px-6 lg:px-8">
        <h4>📈 Oracle&apos;s Calibration Performance</h4>
        <div className="results-dashboard sm:px-4 md:px-6 lg:px-8">
          <div className="calibration-score sm:px-4 md:px-6 lg:px-8">
            <h5>Overall Calibration Score</h5>
            <div className="score-display sm:px-4 md:px-6 lg:px-8">
              <div className="score-value sm:px-4 md:px-6 lg:px-8">92.3%</div>
              <div className="score-label sm:px-4 md:px-6 lg:px-8">Well Calibrated</div>
            </div>
          </div>
          
          <div className="calibration-breakdown sm:px-4 md:px-6 lg:px-8">
            <div className="breakdown-item sm:px-4 md:px-6 lg:px-8">
              <span className="metric-name sm:px-4 md:px-6 lg:px-8">Expected Calibration Error</span>
              <span className="metric-value sm:px-4 md:px-6 lg:px-8">0.047</span>
              <span className="metric-status good sm:px-4 md:px-6 lg:px-8">Excellent</span>
            </div>
            <div className="breakdown-item sm:px-4 md:px-6 lg:px-8">
              <span className="metric-name sm:px-4 md:px-6 lg:px-8">Maximum Calibration Error</span>
              <span className="metric-value sm:px-4 md:px-6 lg:px-8">0.089</span>
              <span className="metric-status good sm:px-4 md:px-6 lg:px-8">Good</span>
            </div>
            <div className="breakdown-item sm:px-4 md:px-6 lg:px-8">
              <span className="metric-name sm:px-4 md:px-6 lg:px-8">Brier Score</span>
              <span className="metric-value sm:px-4 md:px-6 lg:px-8">0.123</span>
              <span className="metric-status good sm:px-4 md:px-6 lg:px-8">Good</span>
            </div>
            <div className="breakdown-item sm:px-4 md:px-6 lg:px-8">
              <span className="metric-name sm:px-4 md:px-6 lg:px-8">Negative Log-Likelihood</span>
              <span className="metric-value sm:px-4 md:px-6 lg:px-8">0.287</span>
              <span className="metric-status excellent sm:px-4 md:px-6 lg:px-8">Excellent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntervals = () => {
}
    const intervals = generatePredictionIntervals(confidenceLevel);
    
    return (
      <div className="prediction-intervals sm:px-4 md:px-6 lg:px-8">
        <h3>📊 Prediction Intervals</h3>
        <div className="intervals-intro sm:px-4 md:px-6 lg:px-8">
          <p>
            Prediction intervals provide a range of plausible values for Oracle&apos;s predictions, 
            giving you a complete picture of uncertainty rather than just point estimates.
          </p>
        </div>
        
        <div className="confidence-selector sm:px-4 md:px-6 lg:px-8">
          <label htmlFor="confidence-level">Confidence Level:</label>
          <input
            id="confidence-level"
            type="range"
            min="50"
            max="99"
            value={confidenceLevel}
            onChange={(e: any) => setConfidenceLevel(Number(e.target.value))}
          />
          <span className="confidence-display sm:px-4 md:px-6 lg:px-8">{confidenceLevel}%</span>
        </div>
        
        <div className="intervals-visualization sm:px-4 md:px-6 lg:px-8">
          <h4>📈 Prediction Intervals for {confidenceLevel}% Confidence</h4>
          <div className="intervals-grid sm:px-4 md:px-6 lg:px-8">
            {intervals.map((interval: any) => (
}
              <div key={interval.id} className="interval-card sm:px-4 md:px-6 lg:px-8">
                <h5>{interval.method}</h5>
                <div className="interval-display sm:px-4 md:px-6 lg:px-8">
                  <div className="prediction-point sm:px-4 md:px-6 lg:px-8">
                    <span className="prediction-value sm:px-4 md:px-6 lg:px-8">{interval.prediction.toFixed(1)}</span>
                    <span className="prediction-label sm:px-4 md:px-6 lg:px-8">Prediction</span>
                  </div>
                  <div className="interval-range sm:px-4 md:px-6 lg:px-8">
                    <div className="interval-bounds sm:px-4 md:px-6 lg:px-8">
                      <span className="lower-bound sm:px-4 md:px-6 lg:px-8">{interval.lowerBound.toFixed(1)}</span>
                      <span className="interval-separator sm:px-4 md:px-6 lg:px-8">to</span>
                      <span className="upper-bound sm:px-4 md:px-6 lg:px-8">{interval.upperBound.toFixed(1)}</span>
                    </div>
                    <div className="interval-width sm:px-4 md:px-6 lg:px-8">
                      Width: {interval.width.toFixed(1)} points
                    </div>
                  </div>
                </div>
                <div className="interval-bar sm:px-4 md:px-6 lg:px-8">
                  <div className="interval-range-bar sm:px-4 md:px-6 lg:px-8">
                    <div className="prediction-marker sm:px-4 md:px-6 lg:px-8"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="intervals-interpretation sm:px-4 md:px-6 lg:px-8">
          <h4>🎯 Interpretation Guide</h4>
          <div className="interpretation-grid sm:px-4 md:px-6 lg:px-8">
            <div className="interpretation-card sm:px-4 md:px-6 lg:px-8">
              <h6>📏 Interval Width</h6>
              <p>Narrower intervals indicate higher confidence. Wider intervals suggest more uncertainty in the prediction.</p>
            </div>
            <div className="interpretation-card sm:px-4 md:px-6 lg:px-8">
              <h6>🎲 Coverage Probability</h6>
              <p>A 95% confidence interval should contain the true value 95% of the time across many predictions.</p>
            </div>
            <div className="interpretation-card sm:px-4 md:px-6 lg:px-8">
              <h6>⚖️ Risk Assessment</h6>
              <p>Use interval width to assess prediction risk. Narrow intervals are safer bets.</p>
            </div>
            <div className="interpretation-card sm:px-4 md:px-6 lg:px-8">
              <h6>📊 Method Comparison</h6>
              <p>Different methods may produce different intervals. Ensemble approaches often provide best estimates.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDemo = () => (
    <div className="confidence-demo sm:px-4 md:px-6 lg:px-8">
      <h3>🧪 Interactive Confidence Demo</h3>
      <div className="demo-controls sm:px-4 md:px-6 lg:px-8">
        <button
          className="demo-button sm:px-4 md:px-6 lg:px-8"
          onClick={simulateConfidenceEstimation}
        >
          Generate Confidence Analysis
        </button>
      </div>
      
      {simulationResults && (
}
        <div className="simulation-results sm:px-4 md:px-6 lg:px-8">
          <h4>📊 Confidence Analysis Results</h4>
          <div className="results-summary sm:px-4 md:px-6 lg:px-8">
            <div className="summary-metrics sm:px-4 md:px-6 lg:px-8">
              <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                <div className="metric-label sm:px-4 md:px-6 lg:px-8">Average Confidence</div>
                <div className="metric-value-display sm:px-4 md:px-6 lg:px-8">{(simulationResults.averageConfidence * 100).toFixed(1)}%</div>
              </div>
              <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                <div className="metric-label sm:px-4 md:px-6 lg:px-8">Average Uncertainty</div>
                <div className="metric-value-display sm:px-4 md:px-6 lg:px-8">{simulationResults.averageUncertainty.toFixed(2)}</div>
              </div>
              <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                <div className="metric-label sm:px-4 md:px-6 lg:px-8">High Confidence Predictions</div>
                <div className="metric-value-display sm:px-4 md:px-6 lg:px-8">{simulationResults.highConfidencePredictions}</div>
              </div>
              <div className="metric-item sm:px-4 md:px-6 lg:px-8">
                <div className="metric-label sm:px-4 md:px-6 lg:px-8">Low Confidence Predictions</div>
                <div className="metric-value-display sm:px-4 md:px-6 lg:px-8">{simulationResults.lowConfidencePredictions}</div>
              </div>
            </div>
            
            <div className="calibration-metrics sm:px-4 md:px-6 lg:px-8">
              <div className="calibration-item sm:px-4 md:px-6 lg:px-8">
                <span className="calibration-label sm:px-4 md:px-6 lg:px-8">Calibration Score</span>
                <span className="calibration-value sm:px-4 md:px-6 lg:px-8">{(simulationResults.calibrationScore * 100).toFixed(1)}%</span>
                <span className="calibration-status good sm:px-4 md:px-6 lg:px-8">Well Calibrated</span>
              </div>
              <div className="calibration-item sm:px-4 md:px-6 lg:px-8">
                <span className="calibration-label sm:px-4 md:px-6 lg:px-8">Reliability Score</span>
                <span className="calibration-value sm:px-4 md:px-6 lg:px-8">{(simulationResults.reliabilityScore * 100).toFixed(1)}%</span>
                <span className="calibration-status good sm:px-4 md:px-6 lg:px-8">Reliable</span>
              </div>
            </div>
          </div>
          
          <div className="predictions-sample sm:px-4 md:px-6 lg:px-8">
            <h5>Sample Predictions with Confidence</h5>
            <div className="predictions-table sm:px-4 md:px-6 lg:px-8">
              <div className="table-header sm:px-4 md:px-6 lg:px-8">
                <span>Player</span>
                <span>Prediction</span>
                <span>Confidence</span>
                <span>Uncertainty</span>
                <span>Method</span>
              </div>
              {simulationResults.predictions.slice(0, 10).map((prediction: any) => (
}
                <div key={prediction.id} className="table-row sm:px-4 md:px-6 lg:px-8">
                  <span className="player-name sm:px-4 md:px-6 lg:px-8">{prediction.player}</span>
                  <span className="prediction-value sm:px-4 md:px-6 lg:px-8">{prediction.prediction.toFixed(1)}</span>
                  <span className={`confidence-value ${getConfidenceClass(prediction.confidence)}`}>
                    {(prediction.confidence * 100).toFixed(0)}%
                  </span>
                  <span className="uncertainty-value sm:px-4 md:px-6 lg:px-8">±{prediction.uncertainty.toFixed(1)}</span>
                  <span className="method-name sm:px-4 md:px-6 lg:px-8">{prediction.method}</span>
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
            <h5>Confidence-Based Strategies</h5>
            <p>
              Use high-confidence predictions for cash games and safe plays. 
              Reserve low-confidence, high-upside plays for tournaments where differentiation matters.
            </p>
          </div>
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h5>Uncertainty as Information</h5>
            <p>
              High uncertainty doesn&apos;t mean bad predictions - it indicates situations where 
              multiple outcomes are plausible, creating opportunity for strategic advantage.
            </p>
          </div>
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h5>Dynamic Confidence</h5>
            <p>
              Oracle&apos;s confidence adapts to changing conditions. Pre-game confidence may differ 
              from in-game confidence as new information becomes available.
            </p>
          </div>
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h5>Portfolio Approach</h5>
            <p>
              Balance your lineup with a mix of high-confidence safe plays and 
              lower-confidence high-upside options for optimal risk-reward profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="oracle-confidence-section sm:px-4 md:px-6 lg:px-8">
      <div className="section-header sm:px-4 md:px-6 lg:px-8">
        <h2>🎯 Confidence Scores & Uncertainty Quantification</h2>
        <p>Understanding prediction reliability and uncertainty bounds in Oracle&apos;s AI system</p>
      </div>
      
      <div className="section-navigation sm:px-4 md:px-6 lg:px-8">
        <button
          className={`nav-button ${activeTab === &apos;overview&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;overview&apos;)}
        >
          📊 Overview
        </button>
        <button
          className={`nav-button ${activeTab === &apos;methods&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;methods&apos;)}
        >
          🔬 Methods
        </button>
        <button
          className={`nav-button ${activeTab === &apos;uncertainty&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;uncertainty&apos;)}
        >
          🔍 Uncertainty
        </button>
        <button
          className={`nav-button ${activeTab === &apos;calibration&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;calibration&apos;)}
        >
          ⚖️ Calibration
        </button>
        <button
          className={`nav-button ${activeTab === &apos;intervals&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;intervals&apos;)}
        >
          📊 Intervals
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
        {activeTab === &apos;methods&apos; && renderMethods()}
        {activeTab === &apos;uncertainty&apos; && renderUncertainty()}
        {activeTab === &apos;calibration&apos; && renderCalibration()}
        {activeTab === &apos;intervals&apos; && renderIntervals()}
        {activeTab === &apos;demo&apos; && renderDemo()}
      </div>
    </div>
  );

const OracleConfidenceEstimationSectionWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OracleConfidenceEstimationSection {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleConfidenceEstimationSectionWithErrorBoundary);
