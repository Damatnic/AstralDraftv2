import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo, useState, useEffect } from &apos;react&apos;;
import &apos;./OracleStatisticalModelingSection.css&apos;;

interface StatisticalModel {
}
  id: string;
  name: string;
  category: &apos;regression&apos; | &apos;classification&apos; | &apos;bayesian&apos; | &apos;ensemble&apos; | &apos;probability&apos;;
  description: string;
  formula: string;
  applications: string[];
  assumptions: string[];
  accuracy: number;
  complexity: &apos;low&apos; | &apos;medium&apos; | &apos;high&apos;;
  interpretability: number; // 0-100

}

interface ProbabilityDistribution {
}
  id: string;
  name: string;
  type: &apos;continuous&apos; | &apos;discrete&apos;;
  formula: string;
  description: string;
  parameters: string[];
  applications: string[];
  examples: DistributionExample[];
  cdf?: string;
  mean?: string;
  variance?: string;

interface DistributionExample {
}
  scenario: string;
  parameters: Record<string, number>;
  visualization: number[];
  interpretation: string;

}

interface BayesianComponent {
}
  id: string;
  name: string;
  type: &apos;prior&apos; | &apos;likelihood&apos; | &apos;posterior&apos; | &apos;evidence&apos;;
  description: string;
  formula: string;
  role: string;
  examples: string[];

interface ConfidenceMethod {
}
  id: string;
  name: string;
  category: &apos;frequentist&apos; | &apos;bayesian&apos; | &apos;bootstrap&apos; | &apos;ensemble&apos;;
  description: string;
  formula: string;
  advantages: string[];
  limitations: string[];
  accuracy: number;
  computationalCost: &apos;low&apos; | &apos;medium&apos; | &apos;high&apos;;

}

interface StatisticalDemo {
}
  id: string;
  name: string;
  type: &apos;calculation&apos; | &apos;simulation&apos; | &apos;comparison&apos; | &apos;prediction&apos;;
  description: string;
  inputData: Record<string, any>;
  steps: DemoStep[];
  result: any;
  interpretation: string;

interface DemoStep {
}
  id: string;
  title: string;
  description: string;
  calculation: string;
  result: string | number;
  explanation: string;

}

const OracleStatisticalModelingSection: React.FC = () => {
}
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeModel, setActiveModel] = useState<string>(&apos;linear-regression&apos;);
  const [activeDistribution, setActiveDistribution] = useState<string>(&apos;normal&apos;);
  const [activeBayesian, setActiveBayesian] = useState<string>(&apos;bayes-theorem&apos;);
  const [activeConfidence, setActiveConfidence] = useState<string>(&apos;confidence-intervals&apos;);
  const [activeDemo, setActiveDemo] = useState<string>(&apos;player-performance-prediction&apos;);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);

  const statisticalModels: StatisticalModel[] = [
    {
}
      id: &apos;linear-regression&apos;,
      name: &apos;Linear Regression&apos;,
      category: &apos;regression&apos;,
      description: &apos;Fundamental model for predicting continuous outcomes based on linear relationships between features&apos;,
      formula: &apos;y = β₀ + β₁x₁ + β₂x₂ + ... + βₚxₚ + ε&apos;,
      applications: [&apos;Player point predictions&apos;, &apos;Team scoring projections&apos;, &apos;Season performance trends&apos;],
      assumptions: [&apos;Linear relationship&apos;, &apos;Independence of residuals&apos;, &apos;Homoscedasticity&apos;, &apos;Normal distribution of errors&apos;],
      accuracy: 78,
      complexity: &apos;low&apos;,
      interpretability: 95
    },
    {
}
      id: &apos;logistic-regression&apos;,
      name: &apos;Logistic Regression&apos;,
      category: &apos;classification&apos;,
      description: &apos;Classification model for binary and multinomial outcomes using logistic function&apos;,
      formula: &apos;P(y=1) = 1 / (1 + e^(-z)), where z = β₀ + β₁x₁ + ... + βₚxₚ&apos;,
      applications: [&apos;Win/loss predictions&apos;, &apos;Injury risk classification&apos;, &apos;Over/under outcomes&apos;],
      assumptions: [&apos;Log-linear relationship&apos;, &apos;Independence of observations&apos;, &apos;No multicollinearity&apos;],
      accuracy: 82,
      complexity: &apos;medium&apos;,
      interpretability: 85
    },
    {
}
      id: &apos;poisson-regression&apos;,
      name: &apos;Poisson Regression&apos;,
      category: &apos;regression&apos;,
      description: &apos;Specialized model for count data like touchdowns, field goals, and scoring events&apos;,
      formula: &apos;log(λ) = β₀ + β₁x₁ + β₂x₂ + ... + βₚxₚ&apos;,
      applications: [&apos;Touchdown predictions&apos;, &apos;Field goal counts&apos;, &apos;Turnover frequencies&apos;],
      assumptions: [&apos;Count data&apos;, &apos;Log-linear relationship&apos;, &apos;Equidispersion (mean = variance)&apos;],
      accuracy: 75,
      complexity: &apos;medium&apos;,
      interpretability: 80
    },
    {
}
      id: &apos;ridge-regression&apos;,
      name: &apos;Ridge Regression (L2 Regularization)&apos;,
      category: &apos;regression&apos;,
      description: &apos;Regularized regression preventing overfitting with penalty on coefficient magnitudes&apos;,
      formula: &apos;Loss = MSE + λ∑βᵢ²&apos;,
      applications: [&apos;High-dimensional feature spaces&apos;, &apos;Multicollinearity handling&apos;, &apos;Stable predictions&apos;],
      assumptions: [&apos;Linear relationship&apos;, &apos;Feature scaling beneficial&apos;, &apos;Regularization parameter tuning&apos;],
      accuracy: 81,
      complexity: &apos;medium&apos;,
      interpretability: 75
    },
    {
}
      id: &apos;lasso-regression&apos;,
      name: &apos;LASSO Regression (L1 Regularization)&apos;,
      category: &apos;regression&apos;,
      description: &apos;Feature selection regression using L1 penalty to drive coefficients to zero&apos;,
      formula: &apos;Loss = MSE + λ∑|βᵢ|&apos;,
      applications: [&apos;Feature selection&apos;, &apos;Sparse model creation&apos;, &apos;Automated variable selection&apos;],
      assumptions: [&apos;Linear relationship&apos;, &apos;Sparsity assumption&apos;, &apos;Cross-validation for λ&apos;],
      accuracy: 80,
      complexity: &apos;medium&apos;,
      interpretability: 85
    },
    {
}
      id: &apos;random-forest&apos;,
      name: &apos;Random Forest&apos;,
      category: &apos;ensemble&apos;,
      description: &apos;Ensemble of decision trees with bootstrap aggregating for robust predictions&apos;,
      formula: &apos;ŷ = (1/B)∑ᵇ₌₁ᴮ Tᵦ(x), where Tᵦ is tree b trained on bootstrap sample&apos;,
      applications: [&apos;Non-linear patterns&apos;, &apos;Feature importance ranking&apos;, &apos;Robust predictions&apos;],
      assumptions: [&apos;No distributional assumptions&apos;, &apos;Handles mixed data types&apos;, &apos;Resistant to outliers&apos;],
      accuracy: 85,
      complexity: &apos;high&apos;,
      interpretability: 60
    },
    {
}
      id: &apos;gradient-boosting&apos;,
      name: &apos;Gradient Boosting&apos;,
      category: &apos;ensemble&apos;,
      description: &apos;Sequential ensemble building models to correct previous model errors&apos;,
      formula: &apos;Fₘ(x) = Fₘ₋₁(x) + γₘhₘ(x), where hₘ fits residuals&apos;,
      applications: [&apos;Complex pattern recognition&apos;, &apos;High accuracy predictions&apos;, &apos;Competition-grade models&apos;],
      assumptions: [&apos;Sequential improvement&apos;, &apos;Learning rate optimization&apos;, &apos;Overfitting prevention&apos;],
      accuracy: 88,
      complexity: &apos;high&apos;,
      interpretability: 45
    },
    {
}
      id: &apos;bayesian-regression&apos;,
      name: &apos;Bayesian Regression&apos;,
      category: &apos;bayesian&apos;,
      description: &apos;Probabilistic regression incorporating prior beliefs and uncertainty quantification&apos;,
      formula: &apos;p(β|D) ∝ p(D|β)p(β), where D is data and β are parameters&apos;,
      applications: [&apos;Uncertainty quantification&apos;, &apos;Prior knowledge incorporation&apos;, &apos;Confidence intervals&apos;],
      assumptions: [&apos;Prior distribution specification&apos;, &apos;Posterior computability&apos;, &apos;MCMC convergence&apos;],
      accuracy: 83,
      complexity: &apos;high&apos;,
      interpretability: 70

  ];

  const probabilityDistributions: ProbabilityDistribution[] = [
    {
}
      id: &apos;normal&apos;,
      name: &apos;Normal (Gaussian) Distribution&apos;,
      type: &apos;continuous&apos;,
      formula: &apos;f(x) = (1/√(2πσ²)) × e^(-(x-μ)²/(2σ²))&apos;,
      description: &apos;Bell-shaped continuous distribution fundamental to many statistical methods&apos;,
      parameters: [&apos;μ (mean)&apos;, &apos;σ² (variance)&apos;],
      applications: [&apos;Player performance scores&apos;, &apos;Error terms&apos;, &apos;Confidence intervals&apos;],
      mean: &apos;μ&apos;,
      variance: &apos;σ²&apos;,
      cdf: &apos;Φ((x-μ)/σ)&apos;,
      examples: [
        {
}
          scenario: &apos;QB Fantasy Points&apos;,
          parameters: { mean: 22.5, variance: 6.25 },
          visualization: [0.02, 0.05, 0.12, 0.24, 0.35, 0.24, 0.12, 0.05, 0.02],
          interpretation: &apos;Most QB performances cluster around 22.5 points with 68% falling within ±2.5 points&apos;
        },
        {
}
          scenario: &apos;Prediction Errors&apos;,
          parameters: { mean: 0, variance: 4 },
          visualization: [0.01, 0.04, 0.15, 0.30, 0.50, 0.30, 0.15, 0.04, 0.01],
          interpretation: &apos;Model errors are centered at zero with most predictions within ±2 points of actual&apos;

    },
    {
}
      id: &apos;binomial&apos;,
      name: &apos;Binomial Distribution&apos;,
      type: &apos;discrete&apos;,
      formula: &apos;P(X = k) = C(n,k) × p^k × (1-p)^(n-k)&apos;,
      description: &apos;Distribution of successes in fixed number of independent trials&apos;,
      parameters: [&apos;n (trials)&apos;, &apos;p (success probability)&apos;],
      applications: [&apos;Win/loss records&apos;, &apos;Touchdown probabilities&apos;, &apos;Binary outcome predictions&apos;],
      mean: &apos;np&apos;,
      variance: &apos;np(1-p)&apos;,
      examples: [
        {
}
          scenario: &apos;Team Wins in 16 Games&apos;,
          parameters: { n: 16, p: 0.625 },
          visualization: [0.0, 0.01, 0.04, 0.08, 0.15, 0.20, 0.23, 0.18, 0.11],
          interpretation: &apos;Team with 62.5% win probability expected to win 10 games (±2 games typical range)&apos;
        },
        {
}
          scenario: &apos;Red Zone Touchdowns&apos;,
          parameters: { n: 20, p: 0.65 },
          visualization: [0.0, 0.0, 0.01, 0.04, 0.09, 0.16, 0.22, 0.23, 0.17, 0.08],
          interpretation: &apos;20 red zone trips with 65% TD rate yields ~13 touchdowns typically&apos;

    },
    {
}
      id: &apos;poisson&apos;,
      name: &apos;Poisson Distribution&apos;,
      type: &apos;discrete&apos;,
      formula: &apos;P(X = k) = (λ^k × e^(-λ)) / k!&apos;,
      description: &apos;Distribution of rare events occurring at constant average rate&apos;,
      parameters: [&apos;λ (rate parameter)&apos;],
      applications: [&apos;Scoring events per game&apos;, &apos;Injury occurrences&apos;, &apos;Turnover frequencies&apos;],
      mean: &apos;λ&apos;,
      variance: &apos;λ&apos;,
      examples: [
        {
}
          scenario: &apos;Touchdowns per Game&apos;,
          parameters: { lambda: 2.8 },
          visualization: [0.06, 0.17, 0.24, 0.22, 0.15, 0.09, 0.04, 0.02, 0.01],
          interpretation: &apos;Team averages 2.8 TDs per game, with 2-3 TDs being most likely outcomes&apos;
        },
        {
}
          scenario: &apos;Player Injuries per Season&apos;,
          parameters: { lambda: 1.2 },
          visualization: [0.30, 0.36, 0.22, 0.09, 0.03, 0.01, 0.0, 0.0, 0.0],
          interpretation: &apos;Player experiences ~1.2 injuries per season, 0-1 injuries most common&apos;

    },
    {
}
      id: &apos;beta&apos;,
      name: &apos;Beta Distribution&apos;,
      type: &apos;continuous&apos;,
      formula: &apos;f(x) = (x^(α-1) × (1-x)^(β-1)) / B(α,β), x ∈ [0,1]&apos;,
      description: &apos;Flexible distribution for probabilities and proportions bounded between 0 and 1&apos;,
      parameters: [&apos;α (shape 1)&apos;, &apos;β (shape 2)&apos;],
      applications: [&apos;Success probabilities&apos;, &apos;Completion percentages&apos;, &apos;Efficiency ratings&apos;],
      mean: &apos;α/(α+β)&apos;,
      variance: &apos;αβ/((α+β)²(α+β+1))&apos;,
      examples: [
        {
}
          scenario: &apos;Passing Completion Rate&apos;,
          parameters: { alpha: 32, beta: 8 },
          visualization: [0.0, 0.0, 0.02, 0.08, 0.18, 0.28, 0.25, 0.15, 0.04],
          interpretation: &apos;QB with 80% completion rate (32 successes, 8 failures) with tight confidence&apos;
        },
        {
}
          scenario: &apos;Field Goal Success Rate&apos;,
          parameters: { alpha: 27, beta: 3 },
          visualization: [0.0, 0.0, 0.0, 0.01, 0.04, 0.12, 0.25, 0.35, 0.23],
          interpretation: &apos;Kicker with 90% success rate showing high reliability in range&apos;

    },
    {
}
      id: &apos;gamma&apos;,
      name: &apos;Gamma Distribution&apos;,
      type: &apos;continuous&apos;,
      formula: &apos;f(x) = (β^α/Γ(α)) × x^(α-1) × e^(-βx), x > 0&apos;,
      description: &apos;Versatile distribution for positive continuous values with skewed shape&apos;,
      parameters: [&apos;α (shape)&apos;, &apos;β (rate)&apos;],
      applications: [&apos;Time to events&apos;, &apos;Performance streaks&apos;, &apos;Waiting times&apos;],
      mean: &apos;α/β&apos;,
      variance: &apos;α/β²&apos;,
      examples: [
        {
}
          scenario: &apos;Time Between Touchdowns&apos;,
          parameters: { alpha: 2, beta: 0.5 },
          visualization: [0.25, 0.30, 0.20, 0.12, 0.07, 0.04, 0.02, 0.0, 0.0],
          interpretation: &apos;Average 4 minutes between TDs, with exponential decay for longer intervals&apos;

    },
    {
}
      id: &apos;student-t&apos;,
      name: &apos;Student\&apos;s t-Distribution&apos;,
      type: &apos;continuous&apos;,
      formula: &apos;f(x) = Γ((ν+1)/2) / (√(νπ)Γ(ν/2)) × (1 + x²/ν)^(-(ν+1)/2)&apos;,
      description: &apos;Heavy-tailed distribution used for small sample inference and robust modeling&apos;,
      parameters: [&apos;ν (degrees of freedom)&apos;],
      applications: [&apos;Small sample confidence intervals&apos;, &apos;Robust regression&apos;, &apos;Outlier modeling&apos;],
      mean: &apos;0 (for ν > 1)&apos;,
      variance: &apos;ν/(ν-2) (for ν > 2)&apos;,
      examples: [
        {
}
          scenario: &apos;Small Sample Player Analysis&apos;,
          parameters: { nu: 5 },
          visualization: [0.02, 0.06, 0.15, 0.25, 0.35, 0.25, 0.15, 0.06, 0.02],
          interpretation: &apos;With only 5 games, wider confidence intervals account for uncertainty&apos;

  ];

  const bayesianComponents: BayesianComponent[] = [
    {
}
      id: &apos;bayes-theorem&apos;,
      name: &apos;Bayes\&apos; Theorem&apos;,
      type: &apos;evidence&apos;,
      description: &apos;Fundamental theorem for updating probabilities with new evidence&apos;,
      formula: &apos;P(H|E) = P(E|H) × P(H) / P(E)&apos;,
      role: &apos;Foundation for all Bayesian inference and probability updating&apos;,
      examples: [
        &apos;Update player injury probability with medical reports&apos;,
        &apos;Revise team win probability with roster changes&apos;,
        &apos;Adjust weather impact estimates with forecast updates&apos;

    },
    {
}
      id: &apos;prior-distribution&apos;,
      name: &apos;Prior Distribution&apos;,
      type: &apos;prior&apos;,
      description: &apos;Initial beliefs about parameters before observing data&apos;,
      formula: &apos;p(θ) - represents knowledge before data collection&apos;,
      role: &apos;Incorporates domain expertise and historical knowledge into models&apos;,
      examples: [
        &apos;Historical team performance as starting point&apos;,
        &apos;Expert opinions on player capabilities&apos;,
        &apos;League-wide statistical patterns as baseline&apos;

    },
    {
}
      id: &apos;likelihood-function&apos;,
      name: &apos;Likelihood Function&apos;,
      type: &apos;likelihood&apos;,
      description: &apos;Probability of observed data given parameter values&apos;,
      formula: &apos;L(θ|data) = p(data|θ)&apos;,
      role: &apos;Quantifies how well parameters explain observed data&apos;,
      examples: [
        &apos;How well do QB stats explain team wins?&apos;,
        &apos;Probability of observed scores given player projections&apos;,
        &apos;Likelihood of weather affecting game outcomes&apos;

    },
    {
}
      id: &apos;posterior-distribution&apos;,
      name: &apos;Posterior Distribution&apos;,
      type: &apos;posterior&apos;,
      description: &apos;Updated beliefs after incorporating new data via Bayes\&apos; theorem&apos;,
      formula: &apos;p(θ|data) ∝ p(data|θ) × p(θ)&apos;,
      role: &apos;Combines prior knowledge with data evidence for refined estimates&apos;,
      examples: [
        &apos;Updated player projections after recent games&apos;,
        &apos;Revised team strength after key injuries&apos;,
        &apos;Adjusted weather impact after historical analysis&apos;

    },
    {
}
      id: &apos;marginal-likelihood&apos;,
      name: &apos;Marginal Likelihood (Evidence)&apos;,
      type: &apos;evidence&apos;,
      description: &apos;Total probability of data across all possible parameter values&apos;,
      formula: &apos;p(data) = ∫ p(data|θ) × p(θ) dθ&apos;,
      role: &apos;Normalizing constant for posterior and model comparison metric&apos;,
      examples: [
        &apos;Model selection between different prediction approaches&apos;,
        &apos;Evidence for including specific features&apos;,
        &apos;Comparing team strength models&apos;

    },
    {
}
      id: &apos;conjugate-priors&apos;,
      name: &apos;Conjugate Priors&apos;,
      type: &apos;prior&apos;,
      description: &apos;Prior distributions that yield posterior in same family after updating&apos;,
      formula: &apos;If p(θ) ~ Family, then p(θ|data) ~ Family with updated parameters&apos;,
      role: &apos;Enable analytical solutions without numerical integration&apos;,
      examples: [
        &apos;Beta prior for completion percentages yields beta posterior&apos;,
        &apos;Normal prior for player means yields normal posterior&apos;,
        &apos;Gamma prior for rate parameters yields gamma posterior&apos;

  ];

  const confidenceMethods: ConfidenceMethod[] = [
    {
}
      id: &apos;confidence-intervals&apos;,
      name: &apos;Confidence Intervals&apos;,
      category: &apos;frequentist&apos;,
      description: &apos;Range of values containing true parameter with specified probability&apos;,
      formula: &apos;95% CI: θ̂ ± 1.96 × SE(θ̂)&apos;,
      advantages: [&apos;Well-established interpretation&apos;, &apos;Wide applicability&apos;, &apos;Standard in research&apos;],
      limitations: [&apos;Frequentist interpretation&apos;, &apos;Fixed parameter assumption&apos;, &apos;No prior incorporation&apos;],
      accuracy: 85,
      computationalCost: &apos;low&apos;
    },
    {
}
      id: &apos;prediction-intervals&apos;,
      name: &apos;Prediction Intervals&apos;,
      category: &apos;frequentist&apos;,
      description: &apos;Range for future individual observations rather than parameter estimates&apos;,
      formula: &apos;PI: ŷ ± t_{α/2} × √(MSE × (1 + 1/n + (x-x̄)²/Σ(xᵢ-x̄)²))&apos;,
      advantages: [&apos;Accounts for prediction uncertainty&apos;, &apos;Realistic ranges&apos;, &apos;Practical application&apos;],
      limitations: [&apos;Wider than confidence intervals&apos;, &apos;Normality assumptions&apos;, &apos;Homoscedasticity required&apos;],
      accuracy: 80,
      computationalCost: &apos;low&apos;
    },
    {
}
      id: &apos;bootstrap-confidence&apos;,
      name: &apos;Bootstrap Confidence Intervals&apos;,
      category: &apos;bootstrap&apos;,
      description: &apos;Resampling-based confidence intervals without distributional assumptions&apos;,
      formula: &apos;Resample data B times, calculate statistic for each, use percentiles&apos;,
      advantages: [&apos;Distribution-free&apos;, &apos;Handles complex statistics&apos;, &apos;Robust to outliers&apos;],
      limitations: [&apos;Computationally intensive&apos;, &apos;Sample size dependent&apos;, &apos;Bootstrap assumptions&apos;],
      accuracy: 88,
      computationalCost: &apos;high&apos;
    },
    {
}
      id: &apos;bayesian-credible&apos;,
      name: &apos;Bayesian Credible Intervals&apos;,
      category: &apos;bayesian&apos;,
      description: &apos;Range containing parameter with specified posterior probability&apos;,
      formula: &apos;P(θ ∈ [a,b] | data) = 0.95&apos;,
      advantages: [&apos;Direct probability interpretation&apos;, &apos;Prior incorporation&apos;, &apos;Natural uncertainty quantification&apos;],
      limitations: [&apos;Prior sensitivity&apos;, &apos;Computational complexity&apos;, &apos;Subjective priors&apos;],
      accuracy: 90,
      computationalCost: &apos;high&apos;
    },
    {
}
      id: &apos;ensemble-uncertainty&apos;,
      name: &apos;Ensemble Uncertainty&apos;,
      category: &apos;ensemble&apos;,
      description: &apos;Uncertainty estimation from multiple model predictions&apos;,
      formula: &apos;Var(ŷ) = (1/M)Σ(ŷᵢ - ȳ)², where M is number of models&apos;,
      advantages: [&apos;Model uncertainty capture&apos;, &apos;Robust to individual model failures&apos;, &apos;Practical implementation&apos;],
      limitations: [&apos;Model correlation issues&apos;, &apos;Computational overhead&apos;, &apos;Interpretation complexity&apos;],
      accuracy: 87,
      computationalCost: &apos;medium&apos;
    },
    {
}
      id: &apos;quantile-regression&apos;,
      name: &apos;Quantile Regression Intervals&apos;,
      category: &apos;frequentist&apos;,
      description: &apos;Model different quantiles to create prediction intervals&apos;,
      formula: &apos;Model Q₀.₀₂₅(y|x) and Q₀.₉₇₅(y|x) for 95% interval&apos;,
      advantages: [&apos;Distribution-free&apos;, &apos;Handles heteroscedasticity&apos;, &apos;Asymmetric intervals&apos;],
      limitations: [&apos;Crossing quantiles possible&apos;, &apos;Limited software support&apos;, &apos;Interpretation complexity&apos;],
      accuracy: 83,
      computationalCost: &apos;medium&apos;

  ];

  const statisticalDemos: StatisticalDemo[] = [
    {
}
      id: &apos;player-performance-prediction&apos;,
      name: &apos;Player Performance Prediction&apos;,
      type: &apos;prediction&apos;,
      description: &apos;Comprehensive statistical modeling of QB fantasy points using multiple approaches&apos;,
      inputData: {
}
        player: &apos;Josh Allen&apos;,
        position: &apos;QB&apos;,
        recentGames: [24.7, 31.2, 18.4, 42.1, 28.5],
        opponent: &apos;Miami Dolphins&apos;,
        oppDefRank: 18,
        weather: &apos;Clear&apos;,
        homeAway: &apos;Home&apos;,
        restDays: 7
      },
      steps: [
        {
}
          id: &apos;step-1&apos;,
          title: &apos;Data Preparation&apos;,
          description: &apos;Calculate relevant statistics from recent performance data&apos;,
          calculation: &apos;Mean = (24.7 + 31.2 + 18.4 + 42.1 + 28.5) / 5&apos;,
          result: 28.98,
          explanation: &apos;Recent 5-game average provides baseline performance estimate&apos;
        },
        {
}
          id: &apos;step-2&apos;,
          title: &apos;Linear Regression Model&apos;,
          description: &apos;Apply linear regression with opponent defensive rank adjustment&apos;,
          calculation: &apos;ŷ = 28.98 + β₁(DefRank-16) + β₂(Home) + ε&apos;,
          result: 26.3,
          explanation: &apos;Opponent defense strength reduces projection by 2.7 points&apos;
        },
        {
}
          id: &apos;step-3&apos;,
          title: &apos;Bayesian Update&apos;,
          description: &apos;Incorporate prior beliefs about QB performance at home&apos;,
          calculation: &apos;Posterior = (Likelihood × Prior) / Evidence&apos;,
          result: 27.1,
          explanation: &apos;Home field advantage increases estimate by 0.8 points&apos;
        },
        {
}
          id: &apos;step-4&apos;,
          title: &apos;Confidence Interval&apos;,
          description: &apos;Calculate 95% confidence interval using bootstrap resampling&apos;,
          calculation: &apos;95% CI = ŷ ± 1.96 × SE(ŷ)&apos;,
          result: &apos;[22.4, 31.8]&apos;,
          explanation: &apos;Model predicts 27.1 points with 95% confidence range of ±4.7 points&apos;
        },
        {
}
          id: &apos;step-5&apos;,
          title: &apos;Probability Distributions&apos;,
          description: &apos;Model performance using normal distribution for outcome probabilities&apos;,
          calculation: &apos;P(>30 pts) = 1 - Φ((30-27.1)/2.4)&apos;,
          result: 0.227,
          explanation: &apos;22.7% probability of exceeding 30 fantasy points&apos;

      ],
      result: {
}
        prediction: 27.1,
        confidenceInterval: [22.4, 31.8],
        probabilities: {
}
          &apos;under20&apos;: 0.15,
          &apos;20to25&apos;: 0.23,
          &apos;25to30&apos;: 0.40,
          &apos;over30&apos;: 0.22

      },
      interpretation: &apos;Statistical models converge on 27.1 point prediction with moderate confidence. Bayesian approach provides slight upward adjustment for home field advantage. Bootstrap confidence intervals account for recent performance variability.&apos;
    },
    {
}
      id: &apos;team-scoring-model&apos;,
      name: &apos;Team Total Scoring Model&apos;,
      type: &apos;prediction&apos;,
      description: &apos;Poisson regression model for predicting total game points&apos;,
      inputData: {
}
        homeTeam: &apos;Buffalo Bills&apos;,
        awayTeam: &apos;Miami Dolphins&apos;,
        homeOffRank: 3,
        awayOffRank: 12,
        homeDefRank: 8,
        awayDefRank: 15,
        weather: &apos;Clear&apos;,
        total: 47.5
      },
      steps: [
        {
}
          id: &apos;poisson-1&apos;,
          title: &apos;Home Team Scoring Rate&apos;,
          description: &apos;Calculate expected home team points using Poisson model&apos;,
          calculation: &apos;log(λ_home) = β₀ + β₁(OffRank) + β₂(OppDefRank)&apos;,
          result: 2.73,
          explanation: &apos;Home team expected to score ~15.3 points (e^2.73)&apos;
        },
        {
}
          id: &apos;poisson-2&apos;,
          title: &apos;Away Team Scoring Rate&apos;,
          description: &apos;Calculate expected away team points with road penalty&apos;,
          calculation: &apos;log(λ_away) = β₀ + β₁(OffRank) + β₂(OppDefRank) - 0.15&apos;,
          result: 2.48,
          explanation: &apos;Away team expected to score ~12.0 points (e^2.48)&apos;
        },
        {
}
          id: &apos;poisson-3&apos;,
          title: &apos;Total Points Distribution&apos;,
          description: &apos;Sum of independent Poisson variables follows Poisson distribution&apos;,
          calculation: &apos;λ_total = λ_home + λ_away = 15.3 + 12.0&apos;,
          result: 27.3,
          explanation: &apos;Expected total of 27.3 points from both teams combined&apos;
        },
        {
}
          id: &apos;poisson-4&apos;,
          title: &apos;Over/Under Probability&apos;,
          description: &apos;Calculate probability of exceeding betting total using CDF&apos;,
          calculation: &apos;P(Total > 47.5) = 1 - P(Poisson(27.3) ≤ 47)&apos;,
          result: 0.02,
          explanation: &apos;Only 2% chance of exceeding 47.5 points - strong Under indication&apos;

      ],
      result: {
}
        homeScore: 15.3,
        awayScore: 12.0,
        totalPoints: 27.3,
        overProbability: 0.02,
        recommendation: &apos;Strong Under play&apos;
      },
      interpretation: &apos;Poisson regression model suggests significantly lower scoring than market expects. Both teams face above-average defenses, leading to conservative point estimates.&apos;
    },
    {
}
      id: &apos;injury-impact-bayesian&apos;,
      name: &apos;Bayesian Injury Impact Analysis&apos;,
      type: &apos;calculation&apos;,
      description: &apos;Update team win probability based on key player injury report&apos;,
      inputData: {
}
        priorWinProb: 0.65,
        playerPosition: &apos;QB&apos;,
        injuryStatus: &apos;Questionable&apos;,
        playerImportance: 0.85,
        historicalData: {
}
          gamesWithPlayer: 12,
          winsWithPlayer: 9,
          gamesWithoutPlayer: 4,
          winsWithoutPlayer: 1

      },
      steps: [
        {
}
          id: &apos;bayes-1&apos;,
          title: &apos;Prior Distribution&apos;,
          description: &apos;Establish prior belief about team strength&apos;,
          calculation: &apos;P(Win) ~ Beta(α=13, β=7) based on season record&apos;,
          result: 0.65,
          explanation: &apos;Prior win probability of 65% with moderate confidence&apos;
        },
        {
}
          id: &apos;bayes-2&apos;,
          title: &apos;Likelihood Calculation&apos;,
          description: &apos;Calculate likelihood of injury impact based on historical data&apos;,
          calculation: &apos;P(Win|Available) = 9/12 = 0.75, P(Win|Unavailable) = 1/4 = 0.25&apos;,
          result: 0.5,
          explanation: &apos;Strong evidence that player availability affects win probability&apos;
        },
        {
}
          id: &apos;bayes-3&apos;,
          title: &apos;Injury Probability&apos;,
          description: &apos;Estimate probability player misses game based on injury status&apos;,
          calculation: &apos;P(Miss|Questionable) = 0.35 based on historical "Questionable" outcomes&apos;,
          result: 0.35,
          explanation: &apos;35% chance questionable player sits out the game&apos;
        },
        {
}
          id: &apos;bayes-4&apos;,
          title: &apos;Updated Win Probability&apos;,
          description: &apos;Calculate expected win probability incorporating injury uncertainty&apos;,
          calculation: &apos;P(Win) = 0.65×0.75 + 0.35×0.25&apos;,
          result: 0.575,
          explanation: &apos;Win probability drops from 65% to 57.5% due to injury uncertainty&apos;

      ],
      result: {
}
        originalWinProb: 0.65,
        updatedWinProb: 0.575,
        impactMagnitude: -0.075,
        confidence: 0.82
      },
      interpretation: &apos;Bayesian analysis shows meaningful 7.5 percentage point decrease in win probability. The impact reflects both the player\&apos;s importance and uncertainty around injury status.&apos;
    },
    {
}
      id: &apos;confidence-comparison&apos;,
      name: &apos;Confidence Method Comparison&apos;,
      type: &apos;comparison&apos;,
      description: &apos;Compare different confidence estimation methods for same prediction&apos;,
      inputData: {
}
        prediction: 24.6,
        sampleSize: 16,
        standardError: 2.1,
        sampleData: [22.1, 26.3, 23.8, 25.9, 21.7, 27.2, 24.1, 23.5, 25.8, 22.9, 26.7, 24.3, 23.1, 25.4, 22.6, 26.1]
      },
      steps: [
        {
}
          id: &apos;conf-1&apos;,
          title: &apos;Classical Confidence Interval&apos;,
          description: &apos;Standard t-distribution based confidence interval&apos;,
          calculation: &apos;95% CI = 24.6 ± 2.131 × 2.1&apos;,
          result: &apos;[20.1, 29.1]&apos;,
          explanation: &apos;Traditional approach assuming normal distribution and known variance&apos;
        },
        {
}
          id: &apos;conf-2&apos;,
          title: &apos;Bootstrap Confidence Interval&apos;,
          description: &apos;Resampling-based confidence interval (1000 bootstrap samples)&apos;,
          calculation: &apos;Percentile method: 2.5th and 97.5th percentiles of bootstrap distribution&apos;,
          result: &apos;[20.3, 28.8]&apos;,
          explanation: &apos;Distribution-free approach slightly tighter due to empirical distribution&apos;
        },
        {
}
          id: &apos;conf-3&apos;,
          title: &apos;Bayesian Credible Interval&apos;,
          description: &apos;Posterior distribution interval with non-informative prior&apos;,
          calculation: &apos;HPD interval from posterior t-distribution&apos;,
          result: &apos;[20.0, 29.2]&apos;,
          explanation: &apos;Bayesian approach with direct probability interpretation&apos;
        },
        {
}
          id: &apos;conf-4&apos;,
          title: &apos;Prediction Interval&apos;,
          description: &apos;Interval for future individual observation&apos;,
          calculation: &apos;PI = 24.6 ± 2.131 × √(2.1² + 4.41)&apos;,
          result: &apos;[18.4, 30.8]&apos;,
          explanation: &apos;Wider interval accounting for both estimation and individual variability&apos;

      ],
      result: {
}
        methods: {
}
          &apos;Classical CI&apos;: [20.1, 29.1],
          &apos;Bootstrap CI&apos;: [20.3, 28.8],
          &apos;Bayesian CI&apos;: [20.0, 29.2],
          &apos;Prediction Interval&apos;: [18.4, 30.8]
        },
        recommendations: {
}
          &apos;Parameter estimation&apos;: &apos;Classical CI&apos;,
          &apos;Model-free inference&apos;: &apos;Bootstrap CI&apos;,
          &apos;Prior incorporation&apos;: &apos;Bayesian CI&apos;,
          &apos;Future prediction&apos;: &apos;Prediction Interval&apos;

      },
      interpretation: &apos;All confidence methods provide similar parameter intervals (~±4.5 points). Prediction intervals are wider for forecasting individuals. Bootstrap method shows slight efficiency gain from empirical distribution.&apos;

  ];

  useEffect(() => {
}
    if (isDemoRunning) {
}
      const interval = setInterval(() => {
}
        setDemoStep((prev: any) => {
}
          const currentDemo = statisticalDemos.find((d: any) => d.id === activeDemo);
          if (prev >= (currentDemo?.steps.length || 0) - 1) {
}
            setIsDemoRunning(false);
            return 0;

          return prev + 1;
        });
      }, 3000);

      return () => clearInterval(interval);

  }, [isDemoRunning, activeDemo, statisticalDemos]);

  const startDemo = () => {
}
    setDemoStep(0);
    setIsDemoRunning(true);
  };

  const selectedModel = statisticalModels.find((model: any) => model.id === activeModel);
  const selectedDistribution = probabilityDistributions.find((dist: any) => dist.id === activeDistribution);
  const selectedBayesian = bayesianComponents.find((comp: any) => comp.id === activeBayesian);
  const selectedConfidence = confidenceMethods.find((method: any) => method.id === activeConfidence);
  const selectedDemo = statisticalDemos.find((demo: any) => demo.id === activeDemo);

  return (
    <div className="oracle-statistical-modeling-section sm:px-4 md:px-6 lg:px-8">
      <div className="section-header sm:px-4 md:px-6 lg:px-8">
        <h2 className="section-title sm:px-4 md:px-6 lg:px-8">
          <span className="title-icon sm:px-4 md:px-6 lg:px-8">📊</span>
          {&apos; &apos;}
          Statistical Modeling & Probability Calculations
        </h2>
        <p className="section-description sm:px-4 md:px-6 lg:px-8">
          Explore Oracle&apos;s sophisticated statistical foundation including regression models, probability 
          distributions, Bayesian inference, and confidence estimation techniques that power accurate 
          sports predictions with quantified uncertainty.
        </p>
      </div>

      {/* Statistical Models */}
      <div className="content-section sm:px-4 md:px-6 lg:px-8">
        <h3 className="subsection-title sm:px-4 md:px-6 lg:px-8">
          <span className="subsection-icon sm:px-4 md:px-6 lg:px-8">🔢</span>
          {&apos; &apos;}
          Core Statistical Models
        </h3>
        <p className="subsection-description sm:px-4 md:px-6 lg:px-8">
          Oracle employs a comprehensive suite of statistical models, from simple linear regression to 
          advanced ensemble methods, each optimized for specific prediction scenarios and data characteristics.
        </p>

        <div className="models-grid sm:px-4 md:px-6 lg:px-8">
          {statisticalModels.map((model: any) => (
}
            <button
              key={model.id}
              className={`model-card ${activeModel === model.id ? &apos;active&apos; : &apos;&apos;} ${model.category}`}
              onClick={() => setActiveModel(model.id)}
              aria-label={`Explore ${model.name} model`}
            >
              <div className="model-header sm:px-4 md:px-6 lg:px-8">
                <h4 className="model-name sm:px-4 md:px-6 lg:px-8">{model.name}</h4>
                <span className={`model-category ${model.category}`}>
                  {model.category}
                </span>
              </div>
              
              <div className="model-metrics sm:px-4 md:px-6 lg:px-8">
                <div className="metric sm:px-4 md:px-6 lg:px-8">
                  <span className="metric-label sm:px-4 md:px-6 lg:px-8">Accuracy</span>
                  <div className="metric-bar sm:px-4 md:px-6 lg:px-8">
                    <div 
                      className="metric-fill sm:px-4 md:px-6 lg:px-8" 
                      style={{ width: `${model.accuracy}%` }}
                    />
                  </div>
                  <span className="metric-value sm:px-4 md:px-6 lg:px-8">{model.accuracy}%</span>
                </div>
                
                <div className="metric sm:px-4 md:px-6 lg:px-8">
                  <span className="metric-label sm:px-4 md:px-6 lg:px-8">Interpretability</span>
                  <div className="metric-bar sm:px-4 md:px-6 lg:px-8">
                    <div 
                      className="metric-fill interpretability sm:px-4 md:px-6 lg:px-8" 
                      style={{ width: `${model.interpretability}%` }}
                    />
                  </div>
                  <span className="metric-value sm:px-4 md:px-6 lg:px-8">{model.interpretability}%</span>
                </div>
              </div>
              
              <div className="complexity-indicator sm:px-4 md:px-6 lg:px-8">
                <span className={`complexity ${model.complexity}`}>
                  {model.complexity} complexity
                </span>
              </div>
            </button>
          ))}
        </div>

        {selectedModel && (
}
          <div className="model-details sm:px-4 md:px-6 lg:px-8">
            <div className="model-details-header sm:px-4 md:px-6 lg:px-8">
              <h4>{selectedModel.name}</h4>
              <span className={`category-badge ${selectedModel.category}`}>
                {selectedModel.category}
              </span>
            </div>
            
            <p className="model-description sm:px-4 md:px-6 lg:px-8">{selectedModel.description}</p>
            
            <div className="model-content sm:px-4 md:px-6 lg:px-8">
              <div className="formula-section sm:px-4 md:px-6 lg:px-8">
                <h5>Mathematical Formula</h5>
                <div className="formula-display sm:px-4 md:px-6 lg:px-8">
                  <code className="formula sm:px-4 md:px-6 lg:px-8">{selectedModel.formula}</code>
                </div>
              </div>
              
              <div className="applications-section sm:px-4 md:px-6 lg:px-8">
                <h5>Oracle Applications</h5>
                <ul className="applications-list sm:px-4 md:px-6 lg:px-8">
                  {selectedModel.applications.map((app: any) => (
}
                    <li key={`${selectedModel.id}-${app}`} className="application-item sm:px-4 md:px-6 lg:px-8">{app}</li>
                  ))}
                </ul>
              </div>
              
              <div className="assumptions-section sm:px-4 md:px-6 lg:px-8">
                <h5>Model Assumptions</h5>
                <ul className="assumptions-list sm:px-4 md:px-6 lg:px-8">
                  {selectedModel.assumptions.map((assumption: any) => (
}
                    <li key={`${selectedModel.id}-${assumption}`} className="assumption-item sm:px-4 md:px-6 lg:px-8">{assumption}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Probability Distributions */}
      <div className="content-section sm:px-4 md:px-6 lg:px-8">
        <h3 className="subsection-title sm:px-4 md:px-6 lg:px-8">
          <span className="subsection-icon sm:px-4 md:px-6 lg:px-8">📈</span>
          {&apos; &apos;}
          Probability Distributions
        </h3>
        <p className="subsection-description sm:px-4 md:px-6 lg:px-8">
          Oracle leverages fundamental probability distributions to model uncertainty, variability, and 
          likelihood in sports data, providing mathematical foundations for prediction confidence.
        </p>

        <div className="distribution-tabs sm:px-4 md:px-6 lg:px-8">
          {probabilityDistributions.map((dist: any) => (
}
            <button
              key={dist.id}
              className={`distribution-tab ${activeDistribution === dist.id ? &apos;active&apos; : &apos;&apos;} ${dist.type}`}
              onClick={() => setActiveDistribution(dist.id)}
              aria-label={`Explore ${dist.name} distribution`}
            >
              <span className="tab-name sm:px-4 md:px-6 lg:px-8">{dist.name.split(&apos; &apos;)[0]}</span>
              <span className={`tab-type ${dist.type}`}>{dist.type}</span>
            </button>
          ))}
        </div>

        {selectedDistribution && (
}
          <div className="distribution-details sm:px-4 md:px-6 lg:px-8">
            <div className="distribution-header sm:px-4 md:px-6 lg:px-8">
              <h4>{selectedDistribution.name}</h4>
              <span className={`type-badge ${selectedDistribution.type}`}>
                {selectedDistribution.type}
              </span>
            </div>
            
            <p className="distribution-description sm:px-4 md:px-6 lg:px-8">{selectedDistribution.description}</p>
            
            <div className="distribution-content sm:px-4 md:px-6 lg:px-8">
              <div className="formula-parameters sm:px-4 md:px-6 lg:px-8">
                <div className="formula-display sm:px-4 md:px-6 lg:px-8">
                  <h5>Probability Density/Mass Function</h5>
                  <code className="formula sm:px-4 md:px-6 lg:px-8">{selectedDistribution.formula}</code>
                </div>
                
                <div className="parameters-display sm:px-4 md:px-6 lg:px-8">
                  <h5>Parameters</h5>
                  <ul className="parameters-list sm:px-4 md:px-6 lg:px-8">
                    {selectedDistribution.parameters.map((param: any) => (
}
                      <li key={`${selectedDistribution.id}-${param}`} className="parameter-item sm:px-4 md:px-6 lg:px-8">
                        <code>{param}</code>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="statistics-display sm:px-4 md:px-6 lg:px-8">
                <h5>Key Statistics</h5>
                <div className="statistics-grid sm:px-4 md:px-6 lg:px-8">
                  <div className="statistic sm:px-4 md:px-6 lg:px-8">
                    <span className="stat-label sm:px-4 md:px-6 lg:px-8">Mean (μ)</span>
                    <code className="stat-value sm:px-4 md:px-6 lg:px-8">{selectedDistribution.mean}</code>
                  </div>
                  <div className="statistic sm:px-4 md:px-6 lg:px-8">
                    <span className="stat-label sm:px-4 md:px-6 lg:px-8">Variance (σ²)</span>
                    <code className="stat-value sm:px-4 md:px-6 lg:px-8">{selectedDistribution.variance}</code>
                  </div>
                  {selectedDistribution.cdf && (
}
                    <div className="statistic sm:px-4 md:px-6 lg:px-8">
                      <span className="stat-label sm:px-4 md:px-6 lg:px-8">CDF</span>
                      <code className="stat-value sm:px-4 md:px-6 lg:px-8">{selectedDistribution.cdf}</code>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="applications-display sm:px-4 md:px-6 lg:px-8">
                <h5>Oracle Applications</h5>
                <ul className="applications-list sm:px-4 md:px-6 lg:px-8">
                  {selectedDistribution.applications.map((app: any) => (
}
                    <li key={`${selectedDistribution.id}-${app}`} className="application-item sm:px-4 md:px-6 lg:px-8">{app}</li>
                  ))}
                </ul>
              </div>
              
              <div className="examples-display sm:px-4 md:px-6 lg:px-8">
                <h5>Real-World Examples</h5>
                <div className="examples-grid sm:px-4 md:px-6 lg:px-8">
                  {selectedDistribution.examples.map((example, exampleIndex) => (
}
                    <div key={`${selectedDistribution.id}-example-${exampleIndex}`} className="example-card sm:px-4 md:px-6 lg:px-8">
                      <h6>{example.scenario}</h6>
                      <div className="example-parameters sm:px-4 md:px-6 lg:px-8">
                        {Object.entries(example.parameters).map(([key, value]) => (
}
                          <span key={key} className="parameter sm:px-4 md:px-6 lg:px-8">
                            {key}: <code>{value}</code>
                          </span>
                        ))}
                      </div>
                      <div className="visualization sm:px-4 md:px-6 lg:px-8">
                        <div className="viz-bars sm:px-4 md:px-6 lg:px-8">
                          {example.visualization.map((height, barIndex) => (
}
                            <div 
                              key={`${selectedDistribution.id}-example-${exampleIndex}-bar-${barIndex}`} 
                              className="viz-bar sm:px-4 md:px-6 lg:px-8"
                              style={{ height: `${height * 100}px` }}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="example-interpretation sm:px-4 md:px-6 lg:px-8">{example.interpretation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bayesian Methods */}
      <div className="content-section sm:px-4 md:px-6 lg:px-8">
        <h3 className="subsection-title sm:px-4 md:px-6 lg:px-8">
          <span className="subsection-icon sm:px-4 md:px-6 lg:px-8">🧠</span>
          {&apos; &apos;}
          Bayesian Inference Framework
        </h3>
        <p className="subsection-description sm:px-4 md:px-6 lg:px-8">
          Oracle incorporates Bayesian methodology to update predictions with new evidence, combine prior 
          knowledge with current data, and provide probabilistic reasoning for uncertainty quantification.
        </p>

        <div className="bayesian-grid sm:px-4 md:px-6 lg:px-8">
          {bayesianComponents.map((component: any) => (
}
            <button
              key={component.id}
              className={`bayesian-card ${activeBayesian === component.id ? &apos;active&apos; : &apos;&apos;} ${component.type}`}
              onClick={() => setActiveBayesian(component.id)}
              aria-label={`Learn about ${component.name}`}
            >
              <div className="component-header sm:px-4 md:px-6 lg:px-8">
                <h4 className="component-name sm:px-4 md:px-6 lg:px-8">{component.name}</h4>
                <span className={`component-type ${component.type}`}>
                  {component.type}
                </span>
              </div>
              <p className="component-description sm:px-4 md:px-6 lg:px-8">{component.description}</p>
            </button>
          ))}
        </div>

        {selectedBayesian && (
}
          <div className="bayesian-details sm:px-4 md:px-6 lg:px-8">
            <div className="bayesian-details-header sm:px-4 md:px-6 lg:px-8">
              <h4>{selectedBayesian.name}</h4>
              <span className={`type-badge ${selectedBayesian.type}`}>
                {selectedBayesian.type}
              </span>
            </div>
            
            <p className="bayesian-description sm:px-4 md:px-6 lg:px-8">{selectedBayesian.description}</p>
            
            <div className="bayesian-content sm:px-4 md:px-6 lg:px-8">
              <div className="formula-section sm:px-4 md:px-6 lg:px-8">
                <h5>Mathematical Representation</h5>
                <code className="formula sm:px-4 md:px-6 lg:px-8">{selectedBayesian.formula}</code>
              </div>
              
              <div className="role-section sm:px-4 md:px-6 lg:px-8">
                <h5>Role in Oracle&apos;s System</h5>
                <p className="role-description sm:px-4 md:px-6 lg:px-8">{selectedBayesian.role}</p>
              </div>
              
              <div className="examples-section sm:px-4 md:px-6 lg:px-8">
                <h5>Practical Examples</h5>
                <ul className="examples-list sm:px-4 md:px-6 lg:px-8">
                  {selectedBayesian.examples.map((example: any) => (
}
                    <li key={`${selectedBayesian.id}-${example}`} className="example-item sm:px-4 md:px-6 lg:px-8">{example}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confidence Estimation */}
      <div className="content-section sm:px-4 md:px-6 lg:px-8">
        <h3 className="subsection-title sm:px-4 md:px-6 lg:px-8">
          <span className="subsection-icon sm:px-4 md:px-6 lg:px-8">🎯</span>
          {&apos; &apos;}
          Confidence Estimation Methods
        </h3>
        <p className="subsection-description sm:px-4 md:px-6 lg:px-8">
          Oracle employs multiple approaches to quantify prediction uncertainty, from classical confidence 
          intervals to modern ensemble methods, ensuring reliable uncertainty estimates across all predictions.
        </p>

        <div className="confidence-methods-grid sm:px-4 md:px-6 lg:px-8">
          {confidenceMethods.map((method: any) => (
}
            <button
              key={method.id}
              className={`confidence-card ${activeConfidence === method.id ? &apos;active&apos; : &apos;&apos;} ${method.category}`}
              onClick={() => setActiveConfidence(method.id)}
              aria-label={`Explore ${method.name} method`}
            >
              <div className="method-header sm:px-4 md:px-6 lg:px-8">
                <h4 className="method-name sm:px-4 md:px-6 lg:px-8">{method.name}</h4>
                <span className={`method-category ${method.category}`}>
                  {method.category}
                </span>
              </div>
              
              <div className="method-metrics sm:px-4 md:px-6 lg:px-8">
                <div className="accuracy-metric sm:px-4 md:px-6 lg:px-8">
                  <span className="metric-label sm:px-4 md:px-6 lg:px-8">Accuracy</span>
                  <span className="metric-value sm:px-4 md:px-6 lg:px-8">{method.accuracy}%</span>
                </div>
                <div className="cost-metric sm:px-4 md:px-6 lg:px-8">
                  <span className="metric-label sm:px-4 md:px-6 lg:px-8">Cost</span>
                  <span className={`cost-indicator ${method.computationalCost}`}>
                    {method.computationalCost}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedConfidence && (
}
          <div className="confidence-details sm:px-4 md:px-6 lg:px-8">
            <div className="confidence-details-header sm:px-4 md:px-6 lg:px-8">
              <h4>{selectedConfidence.name}</h4>
              <span className={`category-badge ${selectedConfidence.category}`}>
                {selectedConfidence.category}
              </span>
            </div>
            
            <p className="confidence-description sm:px-4 md:px-6 lg:px-8">{selectedConfidence.description}</p>
            
            <div className="confidence-content sm:px-4 md:px-6 lg:px-8">
              <div className="formula-section sm:px-4 md:px-6 lg:px-8">
                <h5>Mathematical Formula</h5>
                <code className="formula sm:px-4 md:px-6 lg:px-8">{selectedConfidence.formula}</code>
              </div>
              
              <div className="pros-cons sm:px-4 md:px-6 lg:px-8">
                <div className="advantages sm:px-4 md:px-6 lg:px-8">
                  <h5>Advantages</h5>
                  <ul className="advantages-list sm:px-4 md:px-6 lg:px-8">
                    {selectedConfidence.advantages.map((advantage: any) => (
}
                      <li key={`${selectedConfidence.id}-adv-${advantage}`} className="advantage-item sm:px-4 md:px-6 lg:px-8">{advantage}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="limitations sm:px-4 md:px-6 lg:px-8">
                  <h5>Limitations</h5>
                  <ul className="limitations-list sm:px-4 md:px-6 lg:px-8">
                    {selectedConfidence.limitations.map((limitation: any) => (
}
                      <li key={`${selectedConfidence.id}-lim-${limitation}`} className="limitation-item sm:px-4 md:px-6 lg:px-8">{limitation}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Demonstrations */}
      <div className="content-section sm:px-4 md:px-6 lg:px-8">
        <h3 className="subsection-title sm:px-4 md:px-6 lg:px-8">
          <span className="subsection-icon sm:px-4 md:px-6 lg:px-8">🧪</span>
          {&apos; &apos;}
          Interactive Statistical Demonstrations
        </h3>
        <p className="subsection-description sm:px-4 md:px-6 lg:px-8">
          See Oracle&apos;s statistical methods in action through step-by-step demonstrations of real prediction 
          scenarios, complete with calculations, interpretations, and comparative analysis.
        </p>

        <div className="demo-controls sm:px-4 md:px-6 lg:px-8">
          <div className="demo-selector sm:px-4 md:px-6 lg:px-8">
            {statisticalDemos.map((demo: any) => (
}
              <button
                key={demo.id}
                className={`demo-tab ${activeDemo === demo.id ? &apos;active&apos; : &apos;&apos;}`}
                onClick={() => setActiveDemo(demo.id)}
                aria-label={`Select ${demo.name} demonstration`}
              >
                {demo.name}
              </button>
            ))}
          </div>
          
          <button
            className="demo-start-button sm:px-4 md:px-6 lg:px-8"
            onClick={startDemo}
            disabled={isDemoRunning}
            aria-label="Start statistical demonstration"
          >
            {isDemoRunning ? &apos;Running...&apos; : &apos;Start Demo&apos;}
          </button>
        </div>

        {selectedDemo && (
}
          <div className="demo-content sm:px-4 md:px-6 lg:px-8">
            <div className="demo-header sm:px-4 md:px-6 lg:px-8">
              <h4>{selectedDemo.name}</h4>
              <span className={`demo-type ${selectedDemo.type}`}>
                {selectedDemo.type}
              </span>
            </div>
            
            <p className="demo-description sm:px-4 md:px-6 lg:px-8">{selectedDemo.description}</p>
            
            <div className="demo-input sm:px-4 md:px-6 lg:px-8">
              <h5>Input Data</h5>
              <div className="input-display sm:px-4 md:px-6 lg:px-8">
                {Object.entries(selectedDemo.inputData).map(([key, value]) => (
}
                  <div key={key} className="input-item sm:px-4 md:px-6 lg:px-8">
                    <span className="input-key sm:px-4 md:px-6 lg:px-8">{key.replace(/([A-Z])/g, &apos; $1&apos;).toLowerCase()}:</span>
                    <span className="input-value sm:px-4 md:px-6 lg:px-8">
                      {(() => {
}
                        if (Array.isArray(value)) {
}
                          return `[${value.join(&apos;, &apos;)}]`;

                        if (typeof value === &apos;object&apos; && value !== null) {
}
                          return JSON.stringify(value, null, 2);

                        return String(value);
                      })()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="demo-steps sm:px-4 md:px-6 lg:px-8">
              <h5>Calculation Steps</h5>
              <div className="steps-container sm:px-4 md:px-6 lg:px-8">
                {selectedDemo.steps.map((step, index) => (
}
                  <div 
                    key={step.id}
                    className={`demo-step ${
}
                      isDemoRunning && index === demoStep ? &apos;active&apos; : &apos;&apos;
                    } ${
}
                      isDemoRunning && index < demoStep ? &apos;completed&apos; : &apos;&apos;
                    }`}
                  >
                    <div className="step-number sm:px-4 md:px-6 lg:px-8">{index + 1}</div>
                    <div className="step-content sm:px-4 md:px-6 lg:px-8">
                      <h6>{step.title}</h6>
                      <p className="step-description sm:px-4 md:px-6 lg:px-8">{step.description}</p>
                      <div className="calculation sm:px-4 md:px-6 lg:px-8">
                        <code className="calculation-formula sm:px-4 md:px-6 lg:px-8">{step.calculation}</code>
                        <span className="calculation-result sm:px-4 md:px-6 lg:px-8">= {step.result}</span>
                      </div>
                      <p className="step-explanation sm:px-4 md:px-6 lg:px-8">{step.explanation}</p>
                    </div>
                    {isDemoRunning && index === demoStep && (
}
                      <div className="processing-indicator sm:px-4 md:px-6 lg:px-8">Computing...</div>
                    )}
                    {isDemoRunning && index < demoStep && (
}
                      <div className="completed-indicator sm:px-4 md:px-6 lg:px-8">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="demo-result sm:px-4 md:px-6 lg:px-8">
              <h5>Final Results</h5>
              <div className="result-display sm:px-4 md:px-6 lg:px-8">
                {typeof selectedDemo.result === &apos;object&apos; ? (
}
                  Object.entries(selectedDemo.result).map(([key, value]) => (
                    <div key={key} className="result-item sm:px-4 md:px-6 lg:px-8">
                      <span className="result-key sm:px-4 md:px-6 lg:px-8">{key.replace(/([A-Z])/g, &apos; $1&apos;).toLowerCase()}:</span>
                      <span className="result-value sm:px-4 md:px-6 lg:px-8">
                        {(() => {
}
                          if (Array.isArray(value)) {
}
                            return `[${value.join(&apos;, &apos;)}]`;

                          if (typeof value === &apos;object&apos; && value !== null) {
}
                            return JSON.stringify(value, null, 2);

                          if (typeof value === &apos;string&apos; || typeof value === &apos;number&apos; || typeof value === &apos;boolean&apos;) {
}
                            return String(value);

                          return &apos;&apos;;
                        })()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="result-item sm:px-4 md:px-6 lg:px-8">
                    <span className="result-value sm:px-4 md:px-6 lg:px-8">{String(selectedDemo.result)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="demo-interpretation sm:px-4 md:px-6 lg:px-8">
              <h5>Statistical Interpretation</h5>
              <p className="interpretation-text sm:px-4 md:px-6 lg:px-8">{selectedDemo.interpretation}</p>
            </div>
          </div>
        )}
      </div>

      {/* Key Mathematical Insights */}
      <div className="content-section sm:px-4 md:px-6 lg:px-8">
        <h3 className="subsection-title sm:px-4 md:px-6 lg:px-8">
          <span className="subsection-icon sm:px-4 md:px-6 lg:px-8">💡</span>
          {&apos; &apos;}
          Statistical Modeling Insights
        </h3>
        
        <div className="insights-grid sm:px-4 md:px-6 lg:px-8">
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h4>Model Selection Strategy</h4>
            <p>
              Oracle dynamically selects optimal statistical models based on data characteristics, 
              sample size, and prediction horizon. Linear models for interpretability, ensemble 
              methods for accuracy, Bayesian approaches for uncertainty quantification.
            </p>
          </div>
          
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h4>Probability Distribution Matching</h4>
            <p>
              Each prediction scenario uses domain-appropriate distributions: Normal for player 
              scores, Poisson for counting events, Beta for success rates, ensuring mathematical 
              validity and realistic confidence bounds.
            </p>
          </div>
          
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h4>Bayesian Prior Integration</h4>
            <p>
              Oracle incorporates expert knowledge through carefully constructed priors, allowing 
              predictions to benefit from historical patterns while adapting to new information 
              through Bayesian updating mechanisms.
            </p>
          </div>
          
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h4>Multi-Level Confidence</h4>
            <p>
              Prediction confidence operates at multiple levels: model uncertainty, parameter 
              uncertainty, and future outcome variability, providing comprehensive uncertainty 
              quantification for decision-making.
            </p>
          </div>
          
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h4>Computational Efficiency</h4>
            <p>
              Statistical calculations are optimized for real-time prediction generation, using 
              analytical solutions where possible and efficient numerical methods for complex 
              Bayesian computations and bootstrap procedures.
            </p>
          </div>
          
          <div className="insight-card sm:px-4 md:px-6 lg:px-8">
            <h4>Validation Framework</h4>
            <p>
              All statistical models undergo rigorous validation including cross-validation, 
              residual analysis, assumption checking, and out-of-sample testing to ensure 
              prediction reliability and model appropriateness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const OracleStatisticalModelingSectionWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <OracleStatisticalModelingSection {...props} />
  </ErrorBoundary>
);

export default React.memo(OracleStatisticalModelingSectionWithErrorBoundary);
