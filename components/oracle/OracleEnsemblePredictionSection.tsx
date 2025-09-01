import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState } from &apos;react&apos;;
import &apos;./OracleEnsemblePredictionSection.css&apos;;

interface EnsembleModel {
}
  id: string;
  name: string;
  type: string;
  accuracy: number;
  weight: number;
  prediction: number;
  confidence: number;
  description: string;

}

interface VotingMethod {
}
  id: string;
  name: string;
  description: string;
  formula: string;
  strengths: string[];
  limitations: string[];

interface WeightingStrategy {
}
  id: string;
  name: string;
  description: string;
  method: string;
  advantages: string[];
  useCases: string[];

}

const OracleEnsemblePredictionSection: React.FC = () => {
}
  const [activeTab, setActiveTab] = useState<&apos;overview&apos; | &apos;models&apos; | &apos;voting&apos; | &apos;weighting&apos; | &apos;optimization&apos; | &apos;demo&apos;>(&apos;overview&apos;);
  const [selectedModel, setSelectedModel] = useState<string>(&apos;&apos;);
  const [selectedVoting, setSelectedVoting] = useState<string>(&apos;weighted&apos;);
  const [selectedWeighting, setSelectedWeighting] = useState<string>(&apos;performance&apos;);
  const [ensembleResults, setEnsembleResults] = useState<any>(null);

  // Ensemble models used by Oracle
  const ensembleModels: EnsembleModel[] = [
    {
}
      id: &apos;linear_regression&apos;,
      name: &apos;Linear Regression&apos;,
      type: &apos;Statistical&apos;,
      accuracy: 78.5,
      weight: 0.15,
      prediction: 24.8,
      confidence: 0.82,
      description: &apos;Linear relationship modeling for baseline predictions&apos;
    },
    {
}
      id: &apos;random_forest&apos;,
      name: &apos;Random Forest&apos;,
      type: &apos;Tree-based&apos;,
      accuracy: 82.3,
      weight: 0.20,
      prediction: 26.2,
      confidence: 0.88,
      description: &apos;Ensemble of decision trees for robust predictions&apos;
    },
    {
}
      id: &apos;gradient_boosting&apos;,
      name: &apos;Gradient Boosting&apos;,
      type: &apos;Boosting&apos;,
      accuracy: 84.1,
      weight: 0.25,
      prediction: 25.9,
      confidence: 0.91,
      description: &apos;Sequential weak learners for high accuracy&apos;
    },
    {
}
      id: &apos;neural_network&apos;,
      name: &apos;Neural Network&apos;,
      type: &apos;Deep Learning&apos;,
      accuracy: 85.7,
      weight: 0.25,
      prediction: 27.1,
      confidence: 0.89,
      description: &apos;Multi-layer perceptron for complex patterns&apos;
    },
    {
}
      id: &apos;bayesian_regression&apos;,
      name: &apos;Bayesian Regression&apos;,
      type: &apos;Probabilistic&apos;,
      accuracy: 79.8,
      weight: 0.15,
      prediction: 25.4,
      confidence: 0.85,
      description: &apos;Uncertainty quantification and prior knowledge&apos;

  ];

  // Voting methodologies
  const votingMethods: VotingMethod[] = [
    {
}
      id: &apos;simple&apos;,
      name: &apos;Simple Averaging&apos;,
      description: &apos;Equal weight to all model predictions&apos;,
      formula: &apos;Prediction = (P₁ + P₂ + ... + Pₙ) / n&apos;,
      strengths: [&apos;Simple to implement&apos;, &apos;Reduces overfitting&apos;, &apos;Stable results&apos;],
      limitations: [&apos;Ignores model quality&apos;, &apos;Poor models affect results&apos;, &apos;No confidence weighting&apos;]
    },
    {
}
      id: &apos;weighted&apos;,
      name: &apos;Weighted Voting&apos;,
      description: &apos;Weight predictions by model performance&apos;,
      formula: &apos;Prediction = Σ(wᵢ × Pᵢ) where Σwᵢ = 1&apos;,
      strengths: [&apos;Emphasizes better models&apos;, &apos;Customizable weights&apos;, &apos;Performance-based&apos;],
      limitations: [&apos;Requires weight tuning&apos;, &apos;Risk of overfitting&apos;, &apos;Complex optimization&apos;]
    },
    {
}
      id: &apos;confidence&apos;,
      name: &apos;Confidence-Based&apos;,
      description: &apos;Weight by prediction confidence levels&apos;,
      formula: &apos;Prediction = Σ(cᵢ × Pᵢ) / Σcᵢ&apos;,
      strengths: [&apos;Adaptive weighting&apos;, &apos;Uncertainty aware&apos;, &apos;Dynamic adjustment&apos;],
      limitations: [&apos;Confidence calibration needed&apos;, &apos;Complex computation&apos;, &apos;May amplify bias&apos;]
    },
    {
}
      id: &apos;rank&apos;,
      name: &apos;Rank-Based Voting&apos;,
      description: &apos;Use model rankings instead of raw scores&apos;,
      formula: &apos;Final Rank = Σ(wᵢ × Rankᵢ)&apos;,
      strengths: [&apos;Scale invariant&apos;, &apos;Robust to outliers&apos;, &apos;Handles different scales&apos;],
      limitations: [&apos;Loses magnitude info&apos;, &apos;Ties handling needed&apos;, &apos;Less precise&apos;]
    },
    {
}
      id: &apos;stacking&apos;,
      name: &apos;Stacked Generalization&apos;,
      description: &apos;Meta-learner combines base model outputs&apos;,
      formula: &apos;Meta-Model(P₁, P₂, ..., Pₙ, Features)&apos;,
      strengths: [&apos;Learns optimal combination&apos;, &apos;Non-linear mixing&apos;, &apos;Feature integration&apos;],
      limitations: [&apos;Requires training data&apos;, &apos;Overfitting risk&apos;, &apos;Computational complexity&apos;]
    },
    {
}
      id: &apos;bayesian&apos;,
      name: &apos;Bayesian Model Averaging&apos;,
      description: &apos;Weight models by posterior probability&apos;,
      formula: &apos;Prediction = Σ(P(M|Data) × P(Y|M,Data))&apos;,
      strengths: [&apos;Principled uncertainty&apos;, &apos;Model uncertainty&apos;, &apos;Theoretical foundation&apos;],
      limitations: [&apos;Computational intensive&apos;, &apos;Prior specification&apos;, &apos;Approximation needed&apos;]

  ];

  // Weighting strategies
  const weightingStrategies: WeightingStrategy[] = [
    {
}
      id: &apos;performance&apos;,
      name: &apos;Performance-Based&apos;,
      description: &apos;Weight by historical accuracy metrics&apos;,
      method: &apos;wᵢ = Accuracyᵢ / Σ(Accuracy)&apos;,
      advantages: [&apos;Rewards accurate models&apos;, &apos;Simple to compute&apos;, &apos;Intuitive approach&apos;],
      useCases: [&apos;Stable environments&apos;, &apos;Clear performance metrics&apos;, &apos;Historical data available&apos;]
    },
    {
}
      id: &apos;diversity&apos;,
      name: &apos;Diversity-Based&apos;,
      description: &apos;Weight by model diversity contribution&apos;,
      method: &apos;wᵢ = (1 - Correlationᵢ) × Performanceᵢ&apos;,
      advantages: [&apos;Promotes model diversity&apos;, &apos;Reduces correlation&apos;, &apos;Better generalization&apos;],
      useCases: [&apos;Correlated models&apos;, &apos;Overfitting concerns&apos;, &apos;Robust predictions needed&apos;]
    },
    {
}
      id: &apos;adaptive&apos;,
      name: &apos;Adaptive Weighting&apos;,
      description: &apos;Dynamic weights based on recent performance&apos;,
      method: &apos;wᵢ(t) = α × wᵢ(t-1) + (1-α) × Performanceᵢ(t)&apos;,
      advantages: [&apos;Adapts to changes&apos;, &apos;Recent performance focus&apos;, &apos;Non-stationary handling&apos;],
      useCases: [&apos;Changing environments&apos;, &apos;Concept drift&apos;, &apos;Time-varying patterns&apos;]
    },
    {
}
      id: &apos;uncertainty&apos;,
      name: &apos;Uncertainty-Based&apos;,
      description: &apos;Weight by prediction uncertainty levels&apos;,
      method: &apos;wᵢ = (1 / Uncertaintyᵢ) / Σ(1 / Uncertainty)&apos;,
      advantages: [&apos;Uncertainty aware&apos;, &apos;Confidence weighting&apos;, &apos;Risk management&apos;],
      useCases: [&apos;High-stakes decisions&apos;, &apos;Risk assessment&apos;, &apos;Calibrated predictions&apos;]
    },
    {
}
      id: &apos;meta_learning&apos;,
      name: &apos;Meta-Learning&apos;,
      description: &apos;Learn optimal weights from data&apos;,
      method: &apos;Optimize: min Σ(Actual - Σ(wᵢ × Predictionᵢ))²&apos;,
      advantages: [&apos;Data-driven weights&apos;, &apos;Optimal combination&apos;, &apos;Feature integration&apos;],
      useCases: [&apos;Complex relationships&apos;, &apos;Large datasets&apos;, &apos;Non-linear combinations&apos;]
    },
    {
}
      id: &apos;contextual&apos;,
      name: &apos;Contextual Weighting&apos;,
      description: &apos;Weight based on prediction context&apos;,
      method: &apos;wᵢ = f(Context, Model_Type, Historical_Performance)&apos;,
      advantages: [&apos;Context-aware&apos;, &apos;Situation-specific&apos;, &apos;Domain knowledge&apos;],
      useCases: [&apos;Context-dependent performance&apos;, &apos;Domain expertise&apos;, &apos;Specialized models&apos;]

  ];

  // Helper functions for scoring
  const getComplexityScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;simple&apos;: &apos;⭐&apos;,
      &apos;weighted&apos;: &apos;⭐⭐&apos;,
      &apos;confidence&apos;: &apos;⭐⭐⭐&apos;,
      &apos;rank&apos;: &apos;⭐⭐&apos;,
      &apos;stacking&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;bayesian&apos;: &apos;⭐⭐⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐⭐⭐&apos;;
  };

  const getAccuracyScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;simple&apos;: &apos;⭐⭐&apos;,
      &apos;weighted&apos;: &apos;⭐⭐⭐&apos;,
      &apos;confidence&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;rank&apos;: &apos;⭐⭐⭐&apos;,
      &apos;stacking&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;bayesian&apos;: &apos;⭐⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐⭐⭐&apos;;
  };

  const getRobustnessScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;simple&apos;: &apos;⭐⭐⭐&apos;,
      &apos;weighted&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;confidence&apos;: &apos;⭐⭐⭐&apos;,
      &apos;rank&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;stacking&apos;: &apos;⭐⭐&apos;,
      &apos;bayesian&apos;: &apos;⭐⭐⭐⭐⭐&apos;
    };
    return scores[methodId] || &apos;⭐⭐⭐&apos;;
  };

  const getInterpretabilityScore = (methodId: string): string => {
}
    const scores: Record<string, string> = {
}
      &apos;simple&apos;: &apos;⭐⭐⭐⭐⭐&apos;,
      &apos;weighted&apos;: &apos;⭐⭐⭐⭐&apos;,
      &apos;confidence&apos;: &apos;⭐⭐⭐&apos;,
      &apos;rank&apos;: &apos;⭐⭐⭐&apos;,
      &apos;stacking&apos;: &apos;⭐⭐&apos;,
      &apos;bayesian&apos;: &apos;⭐&apos;
    };
    return scores[methodId] || &apos;⭐⭐⭐&apos;;
  };

  // Calculate ensemble prediction
  const calculateEnsemblePrediction = () => {
}
    const method = votingMethods.find((m: any) => m.id === selectedVoting);
    const weighting = weightingStrategies.find((w: any) => w.id === selectedWeighting);
    
    let finalPrediction = 0;
    let totalWeight = 0;
    let confidence = 0;
    
    switch (selectedVoting) {
}
      case &apos;simple&apos;:
        finalPrediction = ensembleModels.reduce((sum, model) => sum + model.prediction, 0) / ensembleModels.length;
        confidence = ensembleModels.reduce((sum, model) => sum + model.confidence, 0) / ensembleModels.length;
        break;
        
      case &apos;weighted&apos;:
        ensembleModels.forEach((model: any) => {
}
          finalPrediction += model.weight * model.prediction;
          confidence += model.weight * model.confidence;
          totalWeight += model.weight;
        });
        break;
        
      case &apos;confidence&apos;:
        ensembleModels.forEach((model: any) => {
}
          const weight = model.confidence;
          finalPrediction += weight * model.prediction;
          confidence += weight * model.confidence;
          totalWeight += weight;
        });
        finalPrediction /= totalWeight;
        confidence /= totalWeight;
        break;
        
      default:
        finalPrediction = ensembleModels.reduce((sum, model) => sum + model.weight * model.prediction, 0);
        confidence = ensembleModels.reduce((sum, model) => sum + model.weight * model.confidence, 0);

    // Calculate prediction variance for uncertainty
    const variance = ensembleModels.reduce((sum, model) => {
}
      const diff = model.prediction - finalPrediction;
      return sum + model.weight * diff * diff;
    }, 0);
    
    const uncertainty = Math.sqrt(variance);
    
    setEnsembleResults({
}
      prediction: finalPrediction,
      confidence: confidence,
      uncertainty: uncertainty,
      method: method?.name,
      weighting: weighting?.name,
      modelContributions: ensembleModels.map((model: any) => ({
}
        name: model.name,
        contribution: model.weight * model.prediction,
        weight: model.weight
      }))
    });
  };

  // Optimization techniques
  const optimizationTechniques = [
    {
}
      name: &apos;Cross-Validation&apos;,
      description: &apos;Validate ensemble performance across data folds&apos;,
      implementation: &apos;K-fold CV with ensemble weight optimization&apos;,
      benefits: [&apos;Unbiased performance estimate&apos;, &apos;Overfitting detection&apos;, &apos;Robust validation&apos;]
    },
    {
}
      name: &apos;Hyperparameter Tuning&apos;,
      description: &apos;Optimize ensemble configuration parameters&apos;,
      implementation: &apos;Grid search, random search, Bayesian optimization&apos;,
      benefits: [&apos;Optimal configuration&apos;, &apos;Performance maximization&apos;, &apos;Automated tuning&apos;]
    },
    {
}
      name: &apos;Dynamic Model Selection&apos;,
      description: &apos;Select subset of models based on performance&apos;,
      implementation: &apos;Performance thresholding, diversity metrics&apos;,
      benefits: [&apos;Removes poor models&apos;, &apos;Computational efficiency&apos;, &apos;Quality focus&apos;]
    },
    {
}
      name: &apos;Online Learning&apos;,
      description: &apos;Update ensemble weights with new data&apos;,
      implementation: &apos;Incremental weight updates, sliding windows&apos;,
      benefits: [&apos;Adaptation to changes&apos;, &apos;Real-time updates&apos;, &apos;Concept drift handling&apos;]

  ];

  const renderOverview = () => (
    <div className="ensemble-overview sm:px-4 md:px-6 lg:px-8">
      <h3>🎯 Ensemble Prediction Methodology</h3>
      <div className="overview-content sm:px-4 md:px-6 lg:px-8">
        <div className="overview-section sm:px-4 md:px-6 lg:px-8">
          <h4>What is Ensemble Learning?</h4>
          <p>
            Ensemble learning combines multiple machine learning models to create a stronger, more robust predictor than any individual model. 
            Oracle uses sophisticated ensemble methods to aggregate predictions from diverse models, reducing prediction variance and improving accuracy.
          </p>
          
          <div className="ensemble-benefits sm:px-4 md:px-6 lg:px-8">
            <h5>🔄 Key Benefits</h5>
            <div className="benefits-grid sm:px-4 md:px-6 lg:px-8">
              <div className="benefit-card sm:px-4 md:px-6 lg:px-8">
                <span className="benefit-icon sm:px-4 md:px-6 lg:px-8">📈</span>
                <h6>Improved Accuracy</h6>
                <p>Combining multiple models typically outperforms individual models by reducing prediction errors</p>
              </div>
              <div className="benefit-card sm:px-4 md:px-6 lg:px-8">
                <span className="benefit-icon sm:px-4 md:px-6 lg:px-8">🛡️</span>
                <h6>Reduced Overfitting</h6>
                <p>Ensemble methods help prevent overfitting by averaging out individual model biases</p>
              </div>
              <div className="benefit-card sm:px-4 md:px-6 lg:px-8">
                <span className="benefit-icon sm:px-4 md:px-6 lg:px-8">💪</span>
                <h6>Increased Robustness</h6>
                <p>Less sensitive to outliers and noise in data, providing more stable predictions</p>
              </div>
              <div className="benefit-card sm:px-4 md:px-6 lg:px-8">
                <span className="benefit-icon sm:px-4 md:px-6 lg:px-8">🎭</span>
                <h6>Model Diversity</h6>
                <p>Leverages different model strengths while compensating for individual weaknesses</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="overview-section sm:px-4 md:px-6 lg:px-8">
          <h4>Oracle&apos;s Ensemble Architecture</h4>
          <div className="architecture-diagram sm:px-4 md:px-6 lg:px-8">
            <div className="model-layer sm:px-4 md:px-6 lg:px-8">
              <h5>Base Models</h5>
              <div className="model-boxes sm:px-4 md:px-6 lg:px-8">
                <div className="model-box sm:px-4 md:px-6 lg:px-8">Linear Regression</div>
                <div className="model-box sm:px-4 md:px-6 lg:px-8">Random Forest</div>
                <div className="model-box sm:px-4 md:px-6 lg:px-8">Gradient Boosting</div>
                <div className="model-box sm:px-4 md:px-6 lg:px-8">Neural Network</div>
                <div className="model-box sm:px-4 md:px-6 lg:px-8">Bayesian Model</div>
              </div>
            </div>
            <div className="combination-layer sm:px-4 md:px-6 lg:px-8">
              <h5>Combination Layer</h5>
              <div className="combination-methods sm:px-4 md:px-6 lg:px-8">
                <div className="method-box sm:px-4 md:px-6 lg:px-8">Weighted Voting</div>
                <div className="method-box sm:px-4 md:px-6 lg:px-8">Confidence Weighting</div>
                <div className="method-box sm:px-4 md:px-6 lg:px-8">Stacking</div>
              </div>
            </div>
            <div className="output-layer sm:px-4 md:px-6 lg:px-8">
              <h5>Final Prediction</h5>
              <div className="output-box sm:px-4 md:px-6 lg:px-8">
                Ensemble Prediction + Confidence Score
              </div>
            </div>
          </div>
        </div>
        
        <div className="overview-section sm:px-4 md:px-6 lg:px-8">
          <h4>Mathematical Foundation</h4>
          <div className="math-foundation sm:px-4 md:px-6 lg:px-8">
            <div className="formula-card sm:px-4 md:px-6 lg:px-8">
              <h6>Basic Ensemble Formula</h6>
              <div className="formula sm:px-4 md:px-6 lg:px-8">
                ŷ = Σᵢ₌₁ⁿ wᵢ × ŷᵢ
              </div>
              <p>Where wᵢ is the weight and ŷᵢ is the prediction of model i</p>
            </div>
            <div className="formula-card sm:px-4 md:px-6 lg:px-8">
              <h6>Ensemble Variance</h6>
              <div className="formula sm:px-4 md:px-6 lg:px-8">
                Var(ŷ) = Σᵢ₌₁ⁿ wᵢ² × Var(ŷᵢ) + 2Σᵢ&lt;j wᵢwⱼCov(ŷᵢ,ŷⱼ)
              </div>
              <p>Ensemble variance depends on individual model variance and correlation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModels = () => (
    <div className="ensemble-models sm:px-4 md:px-6 lg:px-8">
      <h3>🤖 Base Models in Oracle&apos;s Ensemble</h3>
      <div className="models-grid sm:px-4 md:px-6 lg:px-8">
        {ensembleModels.map((model: any) => (
}
          <div 
            key={model.id} 
            className={`model-card ${selectedModel === model.id ? &apos;selected&apos; : &apos;&apos;}`}
            onClick={() => setSelectedModel(selectedModel === model.id ? &apos;&apos; : model.id)}
            onKeyDown={(e: any) => {
}
              if (e.key === &apos;Enter&apos; || e.key === &apos; &apos;) {
}
                e.preventDefault();
                setSelectedModel(selectedModel === model.id ? &apos;&apos; : model.id);

            }}
            role="button"
            tabIndex={0}
            aria-label={`Select ${model.name} model details`}
          >
            <div className="model-header sm:px-4 md:px-6 lg:px-8">
              <h4>{model.name}</h4>
              <span className="model-type sm:px-4 md:px-6 lg:px-8">{model.type}</span>
            </div>
            <div className="model-metrics sm:px-4 md:px-6 lg:px-8">
              <div className="metric sm:px-4 md:px-6 lg:px-8">
                <span className="metric-label sm:px-4 md:px-6 lg:px-8">Accuracy:</span>
                <span className="metric-value sm:px-4 md:px-6 lg:px-8">{model.accuracy}%</span>
              </div>
              <div className="metric sm:px-4 md:px-6 lg:px-8">
                <span className="metric-label sm:px-4 md:px-6 lg:px-8">Weight:</span>
                <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(model.weight * 100).toFixed(1)}%</span>
              </div>
              <div className="metric sm:px-4 md:px-6 lg:px-8">
                <span className="metric-label sm:px-4 md:px-6 lg:px-8">Confidence:</span>
                <span className="metric-value sm:px-4 md:px-6 lg:px-8">{(model.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="model-prediction sm:px-4 md:px-6 lg:px-8">
              <span className="prediction-label sm:px-4 md:px-6 lg:px-8">Current Prediction:</span>
              <span className="prediction-value sm:px-4 md:px-6 lg:px-8">{model.prediction.toFixed(1)} pts</span>
            </div>
            <p className="model-description sm:px-4 md:px-6 lg:px-8">{model.description}</p>
            
            {selectedModel === model.id && (
}
              <div className="model-details sm:px-4 md:px-6 lg:px-8">
                <h5>Model Details</h5>
                <div className="detail-grid sm:px-4 md:px-6 lg:px-8">
                  <div className="detail-item sm:px-4 md:px-6 lg:px-8">
                    <strong>Strengths:</strong>
                    <ul>
                      {model.type === &apos;Statistical&apos; && (
}
                        <>
                          <li>Fast training and inference</li>
                          <li>Interpretable coefficients</li>
                          <li>Good baseline performance</li>
                        </>
                      )}
                      {model.type === &apos;Tree-based&apos; && (
}
                        <>
                          <li>Handles non-linear relationships</li>
                          <li>Feature importance ranking</li>
                          <li>Robust to outliers</li>
                        </>
                      )}
                      {model.type === &apos;Boosting&apos; && (
}
                        <>
                          <li>High predictive accuracy</li>
                          <li>Handles complex patterns</li>
                          <li>Feature selection capability</li>
                        </>
                      )}
                      {model.type === &apos;Deep Learning&apos; && (
}
                        <>
                          <li>Captures complex non-linear patterns</li>
                          <li>Automatic feature learning</li>
                          <li>Scales with data size</li>
                        </>
                      )}
                      {model.type === &apos;Probabilistic&apos; && (
}
                        <>
                          <li>Uncertainty quantification</li>
                          <li>Incorporates prior knowledge</li>
                          <li>Handles small datasets well</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div className="detail-item sm:px-4 md:px-6 lg:px-8">
                    <strong>Use Cases:</strong>
                    <ul>
                      {model.type === &apos;Statistical&apos; && (
}
                        <>
                          <li>Linear trend identification</li>
                          <li>Baseline comparisons</li>
                          <li>Quick prototyping</li>
                        </>
                      )}
                      {model.type === &apos;Tree-based&apos; && (
}
                        <>
                          <li>Feature interaction modeling</li>
                          <li>Mixed data types</li>
                          <li>Interpretable decisions</li>
                        </>
                      )}
                      {model.type === &apos;Boosting&apos; && (
}
                        <>
                          <li>Competition-grade accuracy</li>
                          <li>Structured data problems</li>
                          <li>Feature engineering</li>
                        </>
                      )}
                      {model.type === &apos;Deep Learning&apos; && (
}
                        <>
                          <li>High-dimensional data</li>
                          <li>Complex pattern recognition</li>
                          <li>Large dataset scenarios</li>
                        </>
                      )}
                      {model.type === &apos;Probabilistic&apos; && (
}
                        <>
                          <li>Risk assessment</li>
                          <li>Decision under uncertainty</li>
                          <li>Prior knowledge integration</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="model-performance sm:px-4 md:px-6 lg:px-8">
        <h4>📊 Model Performance Comparison</h4>
        <div className="performance-chart sm:px-4 md:px-6 lg:px-8">
          <div className="chart-header sm:px-4 md:px-6 lg:px-8">
            <span>Model</span>
            <span>Accuracy</span>
            <span>Weight</span>
            <span>Contribution</span>
          </div>
          {ensembleModels.map((model: any) => (
}
            <div key={model.id} className="chart-row sm:px-4 md:px-6 lg:px-8">
              <span className="model-name sm:px-4 md:px-6 lg:px-8">{model.name}</span>
              <div className="accuracy-bar sm:px-4 md:px-6 lg:px-8">
                <div 
                  className="accuracy-fill sm:px-4 md:px-6 lg:px-8" 
                  style={{ width: `${model.accuracy}%` }}
                ></div>
                <span className="accuracy-text sm:px-4 md:px-6 lg:px-8">{model.accuracy}%</span>
              </div>
              <div className="weight-indicator sm:px-4 md:px-6 lg:px-8">
                <div 
                  className="weight-fill sm:px-4 md:px-6 lg:px-8" 
                  style={{ width: `${model.weight * 100}%` }}
                ></div>
                <span className="weight-text sm:px-4 md:px-6 lg:px-8">{(model.weight * 100).toFixed(1)}%</span>
              </div>
              <span className="contribution sm:px-4 md:px-6 lg:px-8">{(model.weight * model.prediction).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderVoting = () => (
    <div className="voting-methods sm:px-4 md:px-6 lg:px-8">
      <h3>🗳️ Voting and Combination Methods</h3>
      <div className="voting-grid sm:px-4 md:px-6 lg:px-8">
        {votingMethods.map((method: any) => (
}
          <div 
            key={method.id} 
            className={`voting-card ${selectedVoting === method.id ? &apos;selected&apos; : &apos;&apos;}`}
            onClick={() => setSelectedVoting(method.id)}
            onKeyDown={(e: any) => {
}
              if (e.key === &apos;Enter&apos; || e.key === &apos; &apos;) {
}
                e.preventDefault();
                setSelectedVoting(method.id);

            }}
            role="button"
            tabIndex={0}
            aria-label={`Select ${method.name} voting method`}
          >
            <div className="voting-header sm:px-4 md:px-6 lg:px-8">
              <h4>{method.name}</h4>
              {selectedVoting === method.id && <span className="selected-badge sm:px-4 md:px-6 lg:px-8">Active</span>}
            </div>
            <p className="voting-description sm:px-4 md:px-6 lg:px-8">{method.description}</p>
            <div className="voting-formula sm:px-4 md:px-6 lg:px-8">
              <strong>Formula:</strong>
              <code>{method.formula}</code>
            </div>
            <div className="voting-analysis sm:px-4 md:px-6 lg:px-8">
              <div className="strengths sm:px-4 md:px-6 lg:px-8">
                <h6>✅ Strengths</h6>
                <ul>
                  {method.strengths.map((strength, strengthIndex) => (
}
                    <li key={`strength-${method.id}-${strengthIndex}`}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div className="limitations sm:px-4 md:px-6 lg:px-8">
                <h6>⚠️ Limitations</h6>
                <ul>
                  {method.limitations.map((limitation, limitationIndex) => (
}
                    <li key={`limitation-${method.id}-${limitationIndex}`}>{limitation}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="voting-comparison sm:px-4 md:px-6 lg:px-8">
        <h4>📈 Method Comparison</h4>
        <div className="comparison-table sm:px-4 md:px-6 lg:px-8">
          <div className="table-header sm:px-4 md:px-6 lg:px-8">
            <span>Method</span>
            <span>Complexity</span>
            <span>Accuracy</span>
            <span>Robustness</span>
            <span>Interpretability</span>
          </div>
          {votingMethods.map((method: any) => (
}
            <div key={method.id} className="table-row sm:px-4 md:px-6 lg:px-8">
              <span className="method-name sm:px-4 md:px-6 lg:px-8">{method.name}</span>
              <span className="complexity-score sm:px-4 md:px-6 lg:px-8">
                {getComplexityScore(method.id)}
              </span>
              <span className="accuracy-score sm:px-4 md:px-6 lg:px-8">
                {getAccuracyScore(method.id)}
              </span>
              <span className="robustness-score sm:px-4 md:px-6 lg:px-8">
                {getRobustnessScore(method.id)}
              </span>
              <span className="interpretability-score sm:px-4 md:px-6 lg:px-8">
                {getInterpretabilityScore(method.id)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWeighting = () => (
    <div className="weighting-strategies sm:px-4 md:px-6 lg:px-8">
      <h3>⚖️ Weighting Strategies</h3>
      <div className="weighting-grid sm:px-4 md:px-6 lg:px-8">
        {weightingStrategies.map((strategy: any) => (
}
          <div 
            key={strategy.id} 
            className={`weighting-card ${selectedWeighting === strategy.id ? &apos;selected&apos; : &apos;&apos;}`}
            onClick={() => setSelectedWeighting(strategy.id)}
            onKeyDown={(e: any) => {
}
              if (e.key === &apos;Enter&apos; || e.key === &apos; &apos;) {
}
                e.preventDefault();
                setSelectedWeighting(strategy.id);

            }}
            role="button"
            tabIndex={0}
            aria-label={`Select ${strategy.name} weighting strategy`}
          >
            <div className="weighting-header sm:px-4 md:px-6 lg:px-8">
              <h4>{strategy.name}</h4>
              {selectedWeighting === strategy.id && <span className="selected-badge sm:px-4 md:px-6 lg:px-8">Active</span>}
            </div>
            <p className="weighting-description sm:px-4 md:px-6 lg:px-8">{strategy.description}</p>
            <div className="weighting-method sm:px-4 md:px-6 lg:px-8">
              <strong>Method:</strong>
              <code>{strategy.method}</code>
            </div>
            <div className="weighting-details sm:px-4 md:px-6 lg:px-8">
              <div className="advantages sm:px-4 md:px-6 lg:px-8">
                <h6>🎯 Advantages</h6>
                <ul>
                  {strategy.advantages.map((advantage, advIndex) => (
}
                    <li key={`advantage-${strategy.id}-${advIndex}`}>{advantage}</li>
                  ))}
                </ul>
              </div>
              <div className="use-cases sm:px-4 md:px-6 lg:px-8">
                <h6>🎪 Use Cases</h6>
                <ul>
                  {strategy.useCases.map((useCase, caseIndex) => (
}
                    <li key={`usecase-${strategy.id}-${caseIndex}`}>{useCase}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="weighting-visualization sm:px-4 md:px-6 lg:px-8">
        <h4>📊 Weight Distribution Visualization</h4>
        <div className="weight-chart sm:px-4 md:px-6 lg:px-8">
          {ensembleModels.map((model, index) => (
}
            <div key={model.id} className="weight-bar-container sm:px-4 md:px-6 lg:px-8">
              <div className="weight-label sm:px-4 md:px-6 lg:px-8">{model.name}</div>
              <div className="weight-bar sm:px-4 md:px-6 lg:px-8">
                <div 
                  className="weight-fill sm:px-4 md:px-6 lg:px-8" 
                  style={{ 
}
                    width: `${model.weight * 100}%`,
                    backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                  }}
                ></div>
                <span className="weight-percentage sm:px-4 md:px-6 lg:px-8">{(model.weight * 100).toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="weight-explanation sm:px-4 md:px-6 lg:px-8">
          <h5>Current Weighting: {weightingStrategies.find((s: any) => s.id === selectedWeighting)?.name}</h5>
          <p>{weightingStrategies.find((s: any) => s.id === selectedWeighting)?.description}</p>
          <div className="weight-factors sm:px-4 md:px-6 lg:px-8">
            <h6>Key Factors in Weight Assignment:</h6>
            <ul>
              <li><strong>Historical Accuracy:</strong> Models with better past performance receive higher weights</li>
              <li><strong>Model Diversity:</strong> Uncorrelated models get bonus weight to improve ensemble diversity</li>
              <li><strong>Recent Performance:</strong> Recent prediction quality influences current weights</li>
              <li><strong>Uncertainty Levels:</strong> More confident predictions receive proportionally higher weights</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOptimization = () => (
    <div className="optimization-techniques sm:px-4 md:px-6 lg:px-8">
      <h3>🔧 Ensemble Optimization</h3>
      <div className="optimization-grid sm:px-4 md:px-6 lg:px-8">
        {optimizationTechniques.map((technique: any) => (
}
          <div key={technique.name.toLowerCase().replace(/\s+/g, &apos;-&apos;)} className="optimization-card sm:px-4 md:px-6 lg:px-8">
            <h4>{technique.name}</h4>
            <p className="technique-description sm:px-4 md:px-6 lg:px-8">{technique.description}</p>
            <div className="implementation sm:px-4 md:px-6 lg:px-8">
              <strong>Implementation:</strong>
              <p>{technique.implementation}</p>
            </div>
            <div className="benefits sm:px-4 md:px-6 lg:px-8">
              <strong>Benefits:</strong>
              <ul>
                {technique.benefits.map((benefit, benefitIdx) => (
}
                  <li key={`benefit-${technique.name.toLowerCase().replace(/\s+/g, &apos;-&apos;)}-${benefitIdx}`}>{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="optimization-process sm:px-4 md:px-6 lg:px-8">
        <h4>🔄 Oracle&apos;s Optimization Process</h4>
        <div className="process-flow sm:px-4 md:px-6 lg:px-8">
          <div className="process-step sm:px-4 md:px-6 lg:px-8">
            <div className="step-number sm:px-4 md:px-6 lg:px-8">1</div>
            <h5>Data Collection</h5>
            <p>Gather training data and historical performance metrics for each base model</p>
          </div>
          <div className="process-arrow sm:px-4 md:px-6 lg:px-8">→</div>
          <div className="process-step sm:px-4 md:px-6 lg:px-8">
            <div className="step-number sm:px-4 md:px-6 lg:px-8">2</div>
            <h5>Weight Initialization</h5>
            <p>Initialize model weights based on historical accuracy or equal distribution</p>
          </div>
          <div className="process-arrow sm:px-4 md:px-6 lg:px-8">→</div>
          <div className="process-step sm:px-4 md:px-6 lg:px-8">
            <div className="step-number sm:px-4 md:px-6 lg:px-8">3</div>
            <h5>Performance Evaluation</h5>
            <p>Evaluate ensemble performance using cross-validation and various metrics</p>
          </div>
          <div className="process-arrow sm:px-4 md:px-6 lg:px-8">→</div>
          <div className="process-step sm:px-4 md:px-6 lg:px-8">
            <div className="step-number sm:px-4 md:px-6 lg:px-8">4</div>
            <h5>Weight Optimization</h5>
            <p>Optimize weights using gradient descent, grid search, or evolutionary algorithms</p>
          </div>
          <div className="process-arrow sm:px-4 md:px-6 lg:px-8">→</div>
          <div className="process-step sm:px-4 md:px-6 lg:px-8">
            <div className="step-number sm:px-4 md:px-6 lg:px-8">5</div>
            <h5>Validation & Deployment</h5>
            <p>Validate optimized ensemble on held-out data and deploy to production</p>
          </div>
        </div>
      </div>
      
      <div className="optimization-metrics sm:px-4 md:px-6 lg:px-8">
        <h4>📏 Optimization Metrics</h4>
        <div className="metrics-grid sm:px-4 md:px-6 lg:px-8">
          <div className="metric-card sm:px-4 md:px-6 lg:px-8">
            <h5>Ensemble Accuracy</h5>
            <div className="metric-value optimization-metric-value sm:px-4 md:px-6 lg:px-8">87.3%</div>
            <p>Overall prediction accuracy across all test cases</p>
          </div>
          <div className="metric-card sm:px-4 md:px-6 lg:px-8">
            <h5>Diversity Score</h5>
            <div className="metric-value optimization-metric-value sm:px-4 md:px-6 lg:px-8">0.68</div>
            <p>Measure of disagreement between base models (higher is better)</p>
          </div>
          <div className="metric-card sm:px-4 md:px-6 lg:px-8">
            <h5>Stability Index</h5>
            <div className="metric-value optimization-metric-value sm:px-4 md:px-6 lg:px-8">0.92</div>
            <p>Consistency of predictions across different data samples</p>
          </div>
          <div className="metric-card sm:px-4 md:px-6 lg:px-8">
            <h5>Computational Efficiency</h5>
            <div className="metric-value optimization-metric-value sm:px-4 md:px-6 lg:px-8">145ms</div>
            <p>Average time to generate ensemble prediction</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDemo = () => (
    <div className="ensemble-demo sm:px-4 md:px-6 lg:px-8">
      <h3>🧪 Interactive Ensemble Demo</h3>
      <div className="demo-controls sm:px-4 md:px-6 lg:px-8">
        <div className="control-group sm:px-4 md:px-6 lg:px-8">
          <label htmlFor="voting-method-select">Voting Method:</label>
          <select 
            id="voting-method-select"
            value={selectedVoting} 
            onChange={(e: any) => setSelectedVoting(e.target.value)} value={method.id}>{method.name}</option>
            ))}
          </select>
        </div>
        <div className="control-group sm:px-4 md:px-6 lg:px-8">
          <label htmlFor="weighting-strategy-select">Weighting Strategy:</label>
          <select 
            id="weighting-strategy-select"
            value={selectedWeighting} 
            onChange={(e: any) => setSelectedWeighting(e.target.value)} value={strategy.id}>{strategy.name}</option>
            ))}
          </select>
        </div>
        <button 
          className="calculate-button sm:px-4 md:px-6 lg:px-8"
          onClick={calculateEnsemblePrediction}
        >
          Calculate Ensemble Prediction
        </button>
      </div>
      
      {ensembleResults && (
}
        <div className="demo-results sm:px-4 md:px-6 lg:px-8">
          <h4>🎯 Ensemble Results</h4>
          <div className="results-summary sm:px-4 md:px-6 lg:px-8">
            <div className="result-card main-result sm:px-4 md:px-6 lg:px-8">
              <h5>Final Prediction</h5>
              <div className="prediction-value demo-prediction-value sm:px-4 md:px-6 lg:px-8">{ensembleResults.prediction.toFixed(2)} points</div>
              <div className="confidence-bar sm:px-4 md:px-6 lg:px-8">
                <div 
                  className="confidence-fill sm:px-4 md:px-6 lg:px-8" 
                  style={{ width: `${ensembleResults.confidence * 100}%` }}
                ></div>
                <span>Confidence: {(ensembleResults.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
            <div className="result-card sm:px-4 md:px-6 lg:px-8">
              <h5>Uncertainty</h5>
              <div className="uncertainty-value sm:px-4 md:px-6 lg:px-8">±{ensembleResults.uncertainty.toFixed(2)}</div>
              <p>Prediction interval</p>
            </div>
            <div className="result-card sm:px-4 md:px-6 lg:px-8">
              <h5>Method Used</h5>
              <div className="method-name sm:px-4 md:px-6 lg:px-8">{ensembleResults.method}</div>
              <div className="weighting-name sm:px-4 md:px-6 lg:px-8">{ensembleResults.weighting}</div>
            </div>
          </div>
          
          <div className="model-contributions sm:px-4 md:px-6 lg:px-8">
            <h5>🤝 Model Contributions</h5>
            <div className="contributions-chart sm:px-4 md:px-6 lg:px-8">
              {ensembleResults.modelContributions.map((contrib: any) => (
}
                <div key={`contribution-${contrib.name.toLowerCase().replace(/\s+/g, &apos;-&apos;)}`} className="contribution-bar sm:px-4 md:px-6 lg:px-8">
                  <span className="model-name sm:px-4 md:px-6 lg:px-8">{contrib.name}</span>
                  <div className="contribution-visual sm:px-4 md:px-6 lg:px-8">
                    <div 
                      className="contribution-fill sm:px-4 md:px-6 lg:px-8" 
                      style={{ 
}
                        width: `${(contrib.contribution / ensembleResults.prediction) * 100}%`,
                        backgroundColor: `hsl(${ensembleResults.modelContributions.indexOf(contrib) * 60}, 70%, 60%)`
                      }}
                    ></div>
                    <span className="contribution-text sm:px-4 md:px-6 lg:px-8">
                      {contrib.contribution.toFixed(2)} ({(contrib.weight * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="ensemble-explanation sm:px-4 md:px-6 lg:px-8">
            <h5>📝 Explanation</h5>
            <p>
              The ensemble prediction of <strong>{ensembleResults.prediction.toFixed(2)} points</strong> was calculated using {ensembleResults.method.toLowerCase()} with {ensembleResults.weighting.toLowerCase()}. 
              The highest contributing model was <strong>{ensembleResults.modelContributions[0].name}</strong> with a contribution of {ensembleResults.modelContributions[0].contribution.toFixed(2)} points.
              The prediction uncertainty of ±{ensembleResults.uncertainty.toFixed(2)} indicates the expected variation in the prediction.
            </p>
          </div>
        </div>
      )}
      
      <div className="demo-insights sm:px-4 md:px-6 lg:px-8">
        <h4>💡 Key Insights</h4>
        <div className="insights-grid sm:px-4 md:px-6 lg:px-8">
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h5>Model Diversity</h5>
            <p>
              Different models capture different aspects of the data. Linear regression identifies trends, 
              while neural networks capture complex non-linear patterns. Combining them provides comprehensive coverage.
            </p>
          </div>
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h5>Weight Optimization</h5>
            <p>
              Optimal weights balance model accuracy with diversity. Giving too much weight to the best model 
              can hurt ensemble performance if that model overfits or has systematic biases.
            </p>
          </div>
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h5>Uncertainty Quantification</h5>
            <p>
              Ensemble predictions provide natural uncertainty estimates. High agreement between models indicates 
              confidence, while disagreement suggests higher uncertainty in the prediction.
            </p>
          </div>
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h5>Real-time Adaptation</h5>
            <p>
              Oracle continuously updates model weights based on recent performance, allowing the ensemble 
              to adapt to changing patterns in fantasy football data and maintain prediction accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="oracle-ensemble-section sm:px-4 md:px-6 lg:px-8">
      <div className="section-header sm:px-4 md:px-6 lg:px-8">
        <h2>🎯 Ensemble Prediction Methodology</h2>
        <p>Understanding how Oracle combines multiple models for superior predictions</p>
      </div>
      
      <div className="section-navigation sm:px-4 md:px-6 lg:px-8">
        <button 
          className={`nav-button ${activeTab === &apos;overview&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;overview&apos;)}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;models&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;models&apos;)}
        >
          🤖 Base Models
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;voting&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;voting&apos;)}
        >
          🗳️ Voting Methods
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;weighting&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;weighting&apos;)}
        >
          ⚖️ Weighting
        </button>
        <button 
          className={`nav-button ${activeTab === &apos;optimization&apos; ? &apos;active&apos; : &apos;&apos;}`}
          onClick={() => setActiveTab(&apos;optimization&apos;)}
        >
          🔧 Optimization
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
        {activeTab === &apos;models&apos; && renderModels()}
        {activeTab === &apos;voting&apos; && renderVoting()}
        {activeTab === &apos;weighting&apos; && renderWeighting()}
        {activeTab === &apos;optimization&apos; && renderOptimization()}
        {activeTab === &apos;demo&apos; && renderDemo()}
      </div>
    </div>
  );
};

const OracleEnsemblePredictionSectionWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OracleEnsemblePredictionSection {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleEnsemblePredictionSectionWithErrorBoundary);
