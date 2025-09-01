/**
 * Training Data Manager Component
 * Comprehensive interface for managing ML training data, datasets, model training, and performance monitoring
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useState, useEffect, useCallback, useMemo, memo } from &apos;react&apos;;
import { motion } from &apos;framer-motion&apos;;
import { 
}
    Database, 
    Brain, 
    TrendingUp, 
    Settings, 
    BarChart3, 
    Download,
    Upload,
    Play,
    Pause,
    Target,
    CheckCircle,
    AlertTriangle,
    Save,
    RefreshCw,
//     Activity
} from &apos;lucide-react&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import oracleEnsembleMLService, { 
}
    TrainingConfiguration, 
    TrainingProgress, 
    TrainingSession,
    ValidationReport,
    DataValidationRule,
//     EnsembleModel
} from &apos;../../services/oracleEnsembleMachineLearningService&apos;;

type TabType = &apos;overview&apos; | &apos;datasets&apos; | &apos;validation&apos; | &apos;training&apos; | &apos;performance&apos; | &apos;config&apos;;

interface TrainingMetrics {
}
    accuracy: number;
    loss: number;
    epoch: number;
    learningRate: number;
    validationAccuracy: number;

}

const TrainingDataManager = memo(() => {
}
    const [activeTab, setActiveTab] = useState<TabType>(&apos;overview&apos;);
    const [isTraining, setIsTraining] = useState(false);
    const [currentSession, setCurrentSession] = useState<TrainingSession | null>(null);
    const [trainingProgress, setTrainingProgress] = useState<TrainingProgress>({
}
        currentStep: 0,
        totalSteps: 100,
        currentModel: &apos;Idle&apos;,
        phase: &apos;preparation&apos;,
        percentage: 0,
        message: &apos;Initializing training session&apos;,
        accuracy: 0.85,
        loss: 0.23,
        epoch: 45
    });
    const [trainingConfig, setTrainingConfig] = useState<TrainingConfiguration>({
}
        algorithm: &apos;ENSEMBLE&apos;,
        modelType: &apos;ensemble&apos;,
        hyperparameters: { learningRate: 0.001 }, // Move learningRate to hyperparameters
        trainingSplit: 0.8,
        validationSplit: 0.2,
        maxEpochs: 100,
        batchSize: 64,
        earlyStoppingEnabled: true,
        crossValidationEnabled: true,
        hyperparameterTuningEnabled: false
    });
    const [trainingHistory, setTrainingHistory] = useState<TrainingSession[]>([]);
    const [datasetStats, setDatasetStats] = useState({
}
        totalRecords: 0,
        trainingRecords: 0,
        validationRecords: 0,
        dataQuality: 0,
        featureCount: 0,
        missingValues: 0,
        duplicates: 0
    });
    const [modelMetrics, setModelMetrics] = useState<{
}
        models: EnsembleModel[];
        overallAccuracy: number;
        lastTraining: string;
    }>({
}
        models: [],
        overallAccuracy: 0.85,
        lastTraining: new Date().toISOString()
    });
    const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
    const [validationRules, setValidationRules] = useState<DataValidationRule[]>([]);
    const [isValidating, setIsValidating] = useState(false);
    const [systemConfig, setSystemConfig] = useState({
}
        ensembleStrategy: &apos;weighted_average&apos;,
        predictionThreshold: 0.75,
        retrainFrequency: &apos;weekly&apos;,
        realTimeLearning: true,
        apiRateLimit: 1000,
        cacheTtl: &apos;15_minutes&apos;,
        logLevel: &apos;INFO&apos;,
        enableMonitoring: true,
        autoBackupModels: true,
        alertOnAnomalies: true
    });
    const [configurationChanged, setConfigurationChanged] = useState(false);
    const [savingConfiguration, setSavingConfiguration] = useState(false);
    
    // Enhanced loading and error states
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dataLoading, setDataLoading] = useState(false);
    const [realtimeConnected, setRealtimeConnected] = useState(false);
    
    // Specific loading states for different operations
    const [loadingStates, setLoadingStates] = useState({
}
        initialLoad: true,
        trainingData: false,
        validation: false,
        configuration: false,
        export: false,
        modelMetrics: false,
        datasetStats: false,
        realtimeUpdate: false
    });
    
    // Enhanced error tracking with categorization
    const [errors, setErrors] = useState<{
}
        general: string | null;
        training: string | null;
        validation: string | null;
        configuration: string | null;
        connection: string | null;
        dataLoad: string | null;
    }>({
}
        general: null,
        training: null,
        validation: null,
        configuration: null,
        connection: null,
        dataLoad: null
    });
    
    // Operation retry counts for resilience
    const [retryAttempts, setRetryAttempts] = useState<{
}
        dataLoad: number;
        training: number;
        validation: number;
        configuration: number;
    }>({
}
        dataLoad: 0,
        training: 0,
        validation: 0,
        configuration: 0
    });
    
    // Real-time update intervals
    const [updateIntervals, setUpdateIntervals] = useState<NodeJS.Timeout[]>([]);

    // Enhanced error handling utilities
    const setSpecificError = useCallback((category: keyof typeof errors, message: string | null) => {
}
        setErrors(prev => ({ ...prev, [category]: message }));
        if (message) {
}

    }, [errors]);

    const clearAllErrors = useCallback(() => {
}
        setErrors({
}
            general: null,
            training: null,
            validation: null,
            configuration: null,
            connection: null,
            dataLoad: null
        });
        setError(null);
    }, []);

    const setSpecificLoading = useCallback((operation: keyof typeof loadingStates, loading: boolean) => {
}
        setLoadingStates(prev => ({ ...prev, [operation]: loading }));
    }, [loadingStates]);

    const incrementRetryAttempt = useCallback((operation: keyof typeof retryAttempts) => {
}
        setRetryAttempts(prev => ({ ...prev, [operation]: prev[operation] + 1 }));
    }, [retryAttempts]);

    const resetRetryAttempts = useCallback((operation: keyof typeof retryAttempts) => {
}
        setRetryAttempts(prev => ({ ...prev, [operation]: 0 }));
    }, [retryAttempts]);

    // Enhanced async operation wrapper with retry logic
    const executeWithRetry = useCallback(async <T,>(
        operation: () => Promise<T>,
        operationType: keyof typeof retryAttempts,
        maxRetries: number = 3,
        retryDelay: number = 1000
    ): Promise<T | null> => {
}
        const currentAttempts = retryAttempts[operationType];
        
        try {
}

            const result = await operation();
            resetRetryAttempts(operationType);
            return result;
        
    } catch (error) {
}
            const errorMessage = error instanceof Error ? error.message : &apos;Unknown error occurred&apos;;
            
            if (currentAttempts < maxRetries) {
}
                incrementRetryAttempt(operationType);
                
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return executeWithRetry(operation, operationType, maxRetries, retryDelay * 1.5); // Exponential backoff
            } else {
}
                setSpecificError(operationType === &apos;dataLoad&apos; ? &apos;dataLoad&apos; : &apos;general&apos;, errorMessage);
                resetRetryAttempts(operationType);
                return null;


    }, [retryAttempts, incrementRetryAttempt, resetRetryAttempts, setSpecificError]);

    // Load configuration function (moved up to avoid forward reference)
    const loadConfiguration = useCallback(async () => {
}
        return await withLoadingState(async () => {
}
            // FUTURE: Replace with actual service call when configuration API is available
            // const config = await oracleEnsembleMLService.getConfiguration();
            
            // Simulate potential loading failures
            if (Math.random() < 0.05) {
}
                throw new Error(&apos;Configuration service temporarily unavailable&apos;);

            const config = {
}
                ensembleStrategy: &apos;weighted_average&apos;,
                predictionThreshold: 0.75,
                retrainFrequency: &apos;weekly&apos;,
                realTimeLearning: true,
                apiRateLimit: 1000,
                cacheTtl: &apos;15_minutes&apos;,
                logLevel: &apos;INFO&apos;,
                enableMonitoring: true,
                autoBackupModels: true,
                alertOnAnomalies: true
            };
            
            setSystemConfig(config);
            setConfigurationChanged(false);
            return config;
        }, &apos;configuration&apos;, &apos;configuration&apos;);
    }, []);

    // Enhanced loading state management
    const withLoadingState = useCallback(async <T,>(
        operation: () => Promise<T>,
        loadingType: keyof typeof loadingStates,
        errorCategory?: keyof typeof errors
    ): Promise<T | null> => {
}
        try {
}

            setSpecificLoading(loadingType, true);
            if (errorCategory) {
}
                setSpecificError(errorCategory, null);

            const result = await operation();
            return result;
    
    } catch (error) {
}
            const errorMessage = error instanceof Error ? error.message : &apos;Operation failed&apos;;
            
            if (errorCategory) {
}
                setSpecificError(errorCategory, errorMessage);
            } else {
}
                setError(errorMessage);

            return null;
        } finally {
}
            setSpecificLoading(loadingType, false);

    }, [setSpecificLoading, setSpecificError]);

    // Connection health monitoring
    const checkConnectionHealth = useCallback(async (): Promise<boolean> => {
}
        try {
}

            // Test connection with a lightweight operation
            const testResult = await Promise.race([
                Promise.resolve(oracleEnsembleMLService.getCurrentModelMetrics()),
                new Promise((_, reject) => setTimeout(() => reject(new Error(&apos;Connection timeout&apos;)), 5000))
            ]);
            
            if (testResult) {
}
                setRealtimeConnected(true);
                setSpecificError(&apos;connection&apos;, null);
                return true;

            return false;

    } catch (error) {
}
            setRealtimeConnected(false);
            setSpecificError(&apos;connection&apos;, &apos;Connection lost - attempting to reconnect...&apos;);
            return false;

    }, [setSpecificError]);

    // Load initial data
    useEffect(() => {
}
        loadInitialData();
        const interval = setInterval(loadTrainingStatus, 1000);
        setUpdateIntervals(prev => [...prev, interval]);
        
        return () => {
}
            // Cleanup all intervals
            updateIntervals.forEach(clearInterval);
            clearInterval(interval);
        };
    }, []); // Remove dependencies to avoid forward reference issues

    // Initialize real-time monitoring
    const initializeRealtimeMonitoring = useCallback(async () => {
}
        try {
}
            // Set up periodic data refresh for live metrics
            const metricsInterval = setInterval(async () => {
}
                if (!isTraining) return;
                
                try {
}

                    const metrics = oracleEnsembleMLService.getCurrentModelMetrics();
                    setModelMetrics(metrics);
                    
                    const stats = await oracleEnsembleMLService.getDatasetStatistics();
                    setDatasetStats(stats);

    } catch (error) {
}

            }, 5000); // Refresh every 5 seconds
            
            // Set up training session monitoring
            const sessionInterval = setInterval(() => {
}
                loadTrainingStatus();
            }, 1000); // Check training status every second
            
            setUpdateIntervals(prev => [...prev, metricsInterval, sessionInterval]);
    
    } catch (error) {
}
            throw error;

    }, [isTraining]);

    // Enhanced data refresh for specific widgets
    const refreshDataSources = useCallback(async () => {
}
        return await withLoadingState(async () => {
}
            clearAllErrors();
            
            // Refresh all data sources with individual error handling
            const [stats, metrics, history, report] = await Promise.allSettled([
                oracleEnsembleMLService.getDatasetStatistics(),
                Promise.resolve(oracleEnsembleMLService.getCurrentModelMetrics()),
                Promise.resolve(oracleEnsembleMLService.getTrainingHistory()),
                Promise.resolve(oracleEnsembleMLService.getLastValidationReport())
            ]);
            
            // Process results and handle partial failures
            let hasErrors = false;
            
            if (stats?.status === &apos;fulfilled&apos;) {
}
                setDatasetStats(stats.value);
            } else {
}
                setSpecificError(&apos;dataLoad&apos;, &apos;Failed to load dataset statistics&apos;);
                hasErrors = true;

            if (metrics?.status === &apos;fulfilled&apos;) {
}
                setModelMetrics(metrics.value);
            } else {
}
                setSpecificError(&apos;general&apos;, &apos;Failed to load model metrics&apos;);
                hasErrors = true;

            if (history?.status === &apos;fulfilled&apos;) {
}
                setTrainingHistory(history.value);
            } else {
}

            if (report?.status === &apos;fulfilled&apos;) {
}
                setValidationReport(report.value);
            } else {
}

            if (hasErrors) {
}
                throw new Error(&apos;Some data sources failed to refresh&apos;);

            return true;
        }, &apos;datasetStats&apos;, &apos;dataLoad&apos;);
    }, [withLoadingState, clearAllErrors, setSpecificError]);

    const loadInitialData = useCallback(async () => {
}
        return await executeWithRetry(async () => {
}
            setIsLoading(true);
            setSpecificLoading(&apos;initialLoad&apos;, true);
            clearAllErrors();
            
            // Initialize real-time monitoring with error handling
            try {
}

                await initializeRealtimeMonitoring();
            
    } catch (error) {
}
                setSpecificError(&apos;connection&apos;, &apos;Real-time features limited - some data may not auto-refresh&apos;);

            // Load dataset statistics with enhanced error handling
            await withLoadingState(async () => {
}
                const stats = await oracleEnsembleMLService.getDatasetStatistics();
                setDatasetStats(stats);
                return stats;
            }, &apos;datasetStats&apos;, &apos;dataLoad&apos;);

            // Load model metrics with fallback
            try {
}

                setSpecificLoading(&apos;modelMetrics&apos;, true);
                const metrics = oracleEnsembleMLService.getCurrentModelMetrics();
                setModelMetrics(metrics);
            
    } catch (error) {
}
                setSpecificError(&apos;general&apos;, &apos;Model metrics temporarily unavailable&apos;);
            } finally {
}
                setSpecificLoading(&apos;modelMetrics&apos;, false);

            // Load training history (non-critical)
            try {
}

                const history = oracleEnsembleMLService.getTrainingHistory();
                setTrainingHistory(history);
            
    } catch (error) {
}
                // Don&apos;t set error for non-critical data

            // Load validation rules (non-critical)
            try {
}

                const rules = oracleEnsembleMLService.getValidationRules();
                setValidationRules(rules);
            
    } catch (error) {
}

            // Load system configuration with enhanced handling
            await withLoadingState(async () => {
}
                await loadConfiguration();
                return true;
            }, &apos;configuration&apos;, &apos;configuration&apos;);

            // Load last validation report (non-critical)
            try {
}

                const lastReport = oracleEnsembleMLService.getLastValidationReport();
                setValidationReport(lastReport);
            
    } catch (error) {
}

            // Test connection health
            const connectionHealthy = await checkConnectionHealth();
            if (connectionHealthy) {
}
                setRealtimeConnected(true);
            } else {
}
                setSpecificError(&apos;connection&apos;, &apos;Connection unstable - some features may be limited&apos;);

            return true;
        }, &apos;dataLoad&apos;, 3, 2000).finally(() => {
}
            setIsLoading(false);
            setSpecificLoading(&apos;initialLoad&apos;, false);
            setDataLoading(false);
        });
    }, [
        executeWithRetry, 
        setSpecificLoading, 
        clearAllErrors, 
        initializeRealtimeMonitoring, 
        withLoadingState, 
        setSpecificError, 
        loadConfiguration, 
//         checkConnectionHealth
    ]);

    const loadTrainingStatus = useCallback(async () => {
}
        return await withLoadingState(async () => {
}
            // Check for active training sessions with timeout
            const activeSessions = await Promise.race([
                Promise.resolve(oracleEnsembleMLService.getActiveTrainingSessions()),
                new Promise<TrainingSession[]>((_, reject) => 
                    setTimeout(() => reject(new Error(&apos;Training status check timeout&apos;)), 3000)
                )
            ]);
            
            if (Array.isArray(activeSessions) && activeSessions.length > 0) {
}
                const session = activeSessions[0];
                setCurrentSession(session);
                setIsTraining(session?.status === &apos;running&apos;);
                setTrainingProgress(session.progress);
                
                // Auto-refresh model metrics during training with error handling
                if (session?.status === &apos;running&apos;) {
}
                    try {
}

                        const metrics = oracleEnsembleMLService.getCurrentModelMetrics();
                        setModelMetrics(metrics);

    } catch (error) {
}
                        // Don&apos;t fail the entire operation for metrics refresh


            } else if (isTraining) {
}
                setIsTraining(false);
                setCurrentSession(null);
                // Reload data after training completion with error handling
                try {
}

                    await refreshDataSources();

    } catch (error) {
}
                    setSpecificError(&apos;dataLoad&apos;, &apos;Failed to refresh data after training completion&apos;);


            return true;
        }, &apos;realtimeUpdate&apos;, &apos;general&apos;);
    }, [isTraining, refreshDataSources, withLoadingState, setSpecificError]);

    const handleTrainModels = useCallback(async () => {
}
        return await withLoadingState(async () => {
}
            setIsTraining(true);
            clearAllErrors();
            
            // Validate training prerequisites
            if (!realtimeConnected) {
}
                throw new Error(&apos;Cannot start training: Connection to ML service is not available&apos;);

            if (datasetStats.totalRecords === 0) {
}
                throw new Error(&apos;Cannot start training: No training data available&apos;);

            if (!trainingConfig.maxEpochs || trainingConfig.maxEpochs <= 0 || !trainingConfig.batchSize || trainingConfig.batchSize <= 0) {
}
                throw new Error(&apos;Cannot start training: Invalid training configuration&apos;);

            // Get real training data from service with retry
            const trainingData = await executeWithRetry(async () => {
}
                return await oracleEnsembleMLService.getStoredTrainingData();
            }, &apos;training&apos;, 2, 1000);
            
            if (!trainingData) {
}
                throw new Error(&apos;Failed to retrieve training data after multiple attempts&apos;);

            // Start training session with current configuration
            const sessionId = await oracleEnsembleMLService.startTrainingSession(
                trainingData,
                trainingConfig,
                `Training Session ${new Date().toLocaleString()}`,
                (progress: TrainingProgress) => {
}
                    setTrainingProgress(progress);

            );

            // Trigger immediate data refresh
            try {
}

                await refreshDataSources();
            
    } catch (error) {
}
                // Don&apos;t fail training start for this

            resetRetryAttempts(&apos;training&apos;);
            return sessionId;
        }, &apos;trainingData&apos;, &apos;training&apos;).catch((error: any) => {
}
            setIsTraining(false);
            return null;
        });
    }, [
        trainingConfig, 
        refreshDataSources, 
        withLoadingState, 
        clearAllErrors, 
        realtimeConnected, 
        datasetStats.totalRecords, 
        executeWithRetry, 
//         resetRetryAttempts
    ]);

    const handleStopTraining = useCallback(async () => {
}
        return await withLoadingState(async () => {
}
            if (!currentSession) {
}
                throw new Error(&apos;No active training session to stop&apos;);

            // Attempt to cancel training session
            try {
}

                oracleEnsembleMLService.cancelTrainingSession(currentSession.id);
            
    } catch (error) {
}
                // Force stop the training state even if cancellation fails

            setIsTraining(false);
            setCurrentSession(null);
            clearAllErrors();
            
            // Refresh data after stopping training
            try {
}

                await refreshDataSources();
            
    } catch (error) {
}
        console.error(error);
    `oracle_training_data_${new Date().toISOString().split(&apos;T&apos;)[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                
                return true;

    } catch (error) {
}
                throw new Error(&apos;Failed to create or download export file&apos;);

        }, &apos;export&apos;, &apos;general&apos;);
    };

    // Update configuration handlers with enhanced error handling
    const updateTrainingConfig = useCallback((updates: Partial<TrainingConfiguration>) => {
}
        try {
}

            // Validate configuration updates
            if (updates.maxEpochs !== undefined && updates.maxEpochs <= 0) {
}
                throw new Error(&apos;Max epochs must be greater than 0&apos;);

            if (updates.batchSize !== undefined && updates.batchSize <= 0) {
}
                throw new Error(&apos;Batch size must be greater than 0&apos;);

            if (updates.hyperparameters?.learningRate !== undefined && (updates.hyperparameters.learningRate <= 0 || updates.hyperparameters.learningRate >= 1)) {
}
                throw new Error(&apos;Learning rate must be between 0 and 1&apos;);

            if (updates.trainingSplit !== undefined && (updates.trainingSplit <= 0 || updates.trainingSplit >= 1)) {
}
                throw new Error(&apos;Training split must be between 0 and 1&apos;);

            if (updates.validationSplit !== undefined && (updates.validationSplit <= 0 || updates.validationSplit >= 1)) {
}
                throw new Error(&apos;Validation split must be between 0 and 1&apos;);

            setTrainingConfig(prev => ({ ...prev, ...updates }));
            clearAllErrors();

    } catch (error) {
}
            const errorMessage = error instanceof Error ? error.message : &apos;Invalid configuration update&apos;;
            setSpecificError(&apos;configuration&apos;, errorMessage);

    }, [clearAllErrors, setSpecificError]);

    // Memoized computed values for performance optimization
    const trainingProgressPercentage = useMemo(() => {
}
        return Math.round((trainingProgress.currentStep / trainingProgress.totalSteps) * 100);
    }, [trainingProgress.currentStep, trainingProgress.totalSteps]);

    const trainingSplitPercentages = useMemo(() => ({
}
        training: Math.round((trainingConfig.trainingSplit || 0.8) * 100),
        validation: Math.round((trainingConfig.validationSplit || 0.2) * 100)
    }), [trainingConfig.trainingSplit, trainingConfig.validationSplit]);

    const formattedTrainingMetrics = useMemo(() => ({
}
        accuracy: (trainingProgress.accuracy || 0).toFixed(3),
        loss: (trainingProgress.loss || 0).toFixed(3),
        overallAccuracy: modelMetrics.overallAccuracy.toFixed(3)
    }), [trainingProgress.accuracy, trainingProgress.loss, modelMetrics.overallAccuracy]);

    const recentTrainingSessions = useMemo(() => {
}
        return trainingHistory.slice(0, 4);
    }, [trainingHistory]);

    // Enhanced event handlers for better performance
    const handleErrorDismiss = useCallback((errorType?: keyof typeof errors) => {
}
        if (errorType) {
}
            setSpecificError(errorType, null);
        } else {
}
            clearAllErrors();

    }, [setSpecificError, clearAllErrors]);

    // Enhanced validation handlers
    const handleValidateData = useCallback(async () => {
}
        return await executeWithRetry(async () => {
}
            setSpecificError(&apos;validation&apos;, null);
            
            // Validate prerequisites
            if (!realtimeConnected) {
}
                throw new Error(&apos;Cannot validate data: Connection to ML service is not available&apos;);

            if (datasetStats.totalRecords === 0) {
}
                throw new Error(&apos;Cannot validate data: No dataset available for validation&apos;);

            // Get real training data and run validation
            const trainingData = await oracleEnsembleMLService.getStoredTrainingData();
            
            if (!trainingData || (Array.isArray(trainingData) && trainingData.length === 0)) {
}
                throw new Error(&apos;No training data available for validation&apos;);

            const report = await oracleEnsembleMLService.validateDataset(trainingData);
            
            if (!report) {
}
                throw new Error(&apos;Validation completed but no report was generated&apos;);

            setValidationReport(report);
            
            // Refresh related data with error handling
            try {
}

                const rules = oracleEnsembleMLService.getValidationRules();
                setValidationRules(rules);
            
    } catch (error) {
}
                // Don&apos;t fail the entire validation for this

            resetRetryAttempts(&apos;validation&apos;);
            return report;
        }, &apos;validation&apos;, 3, 1500);
    }, [
        executeWithRetry, 
        setSpecificError, 
        realtimeConnected, 
        datasetStats.totalRecords, 
//         resetRetryAttempts
    ]);

    // Helper functions for styling
    const getSessionStatusClass = (status: string): string => {
}
        switch (status) {
}
            case &apos;completed&apos;:
                return &apos;bg-green-600 text-green-100&apos;;
            case &apos;running&apos;:
                return &apos;bg-blue-600 text-blue-100&apos;;
            case &apos;failed&apos;:
                return &apos;bg-red-600 text-red-100&apos;;
            default:
                return &apos;bg-gray-600 text-gray-100&apos;;

    };

    const getQualityScoreClass = (score: number): string => {
}
        if (score >= 90) return &apos;text-green-400&apos;;
        if (score >= 75) return &apos;text-yellow-400&apos;;
        return &apos;text-red-400&apos;;
    };

    const getDatasetQualityClass = (quality: number): string => {
}
        if (quality >= 95) return &apos;bg-green-600 text-green-100&apos;;
        if (quality >= 90) return &apos;bg-yellow-600 text-yellow-100&apos;;
        return &apos;bg-red-600 text-red-100&apos;;
    };

    const getValidationResultClass = (passed: boolean, severity?: string): string => {
}
        if (passed) return &apos;bg-green-600 text-green-100&apos;;
        return severity === &apos;error&apos; ? &apos;bg-red-600 text-red-100&apos; : &apos;bg-yellow-600 text-yellow-100&apos;;
    };

    const getValidationResultText = (passed: boolean, severity?: string): string => {
}
        if (passed) return &apos;Pass&apos;;
        return severity === &apos;error&apos; ? &apos;Error&apos; : &apos;Warning&apos;;
    };

    const getTestStatusClass = (status: string): string => {
}
        switch (status) {
}
            case &apos;active&apos;:
                return &apos;bg-blue-500/20 text-blue-400&apos;;
            case &apos;completed&apos;:
                return &apos;bg-green-500/20 text-green-400&apos;;
            case &apos;paused&apos;:
                return &apos;bg-yellow-500/20 text-yellow-400&apos;;
            default:
                return &apos;bg-gray-500/20 text-gray-400&apos;;

    };

    const getModelStatusClass = (isActive: boolean, type?: string): string => {
}
        if (isActive && type === &apos;STACKED_ENSEMBLE&apos;) return &apos;bg-green-600 text-green-100&apos;;
        return isActive ? &apos;bg-blue-600 text-blue-100&apos; : &apos;bg-gray-600 text-gray-100&apos;;
    };

    const getModelStatusText = (isActive: boolean, type?: string): string => {
}
        if (isActive && type === &apos;STACKED_ENSEMBLE&apos;) return &apos;Active Ensemble&apos;;
        return isActive ? &apos;Active&apos; : &apos;Inactive&apos;;
    };

    // Helper function to get loading state message
    const getLoadingStateMessage = useCallback(() => {
}
        if (loadingStates.trainingData) return &apos;Processing training data...&apos;;
        if (loadingStates.validation) return &apos;Running validation...&apos;;
        return &apos;Refreshing data...&apos;;
    }, [loadingStates]);

    // Helper function to get button text based on connection
    const getConnectionDependentText = useCallback((connectedText: string, disconnectedText: string = &apos;Connection Required&apos;) => {
}
        return realtimeConnected ? connectedText : disconnectedText;
    }, [realtimeConnected]);

    // Enhanced configuration management functions
    const handleConfigurationChange = useCallback((field: string, value: any) => {
}
        try {
}

            // Validate specific configuration fields
            if (field === &apos;predictionThreshold&apos; && (value < 0 || value > 1)) {
}
                throw new Error(&apos;Prediction threshold must be between 0 and 1&apos;);

            if (field === &apos;apiRateLimit&apos; && value <= 0) {
}
                throw new Error(&apos;API rate limit must be greater than 0&apos;);

            setSystemConfig(prev => ({ ...prev, [field]: value }));
            setConfigurationChanged(true);
            setSpecificError(&apos;configuration&apos;, null);

    } catch (error) {
}
            const errorMessage = error instanceof Error ? error.message : &apos;Invalid configuration value&apos;;
            setSpecificError(&apos;configuration&apos;, errorMessage);

    }, [setSpecificError]);

    const saveConfiguration = useCallback(async () => {
}
        return await withLoadingState(async () => {
}
            if (!configurationChanged) {
}
                throw new Error(&apos;No configuration changes to save&apos;);

            // Validate entire configuration before saving
            if (systemConfig.predictionThreshold < 0 || systemConfig.predictionThreshold > 1) {
}
                throw new Error(&apos;Invalid prediction threshold value&apos;);

            if (systemConfig.apiRateLimit <= 0) {
}
                throw new Error(&apos;Invalid API rate limit value&apos;);

            // FUTURE: Implement actual service call when configuration API is available
            // const success = await oracleEnsembleMLService.updateConfiguration(systemConfig);
            
            // Simulate API call delay for now with potential failure
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulate occasional failures for testing
            if (Math.random() < 0.1) {
}
                throw new Error(&apos;Configuration service temporarily unavailable&apos;);

            const success = true; 
            
            if (success) {
}
                setConfigurationChanged(false);
                
                // Refresh data to reflect configuration changes
                try {
}

                    await refreshDataSources();
                return true;
            
    `px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
}
                                isTraining ? &apos;bg-blue-600 text-blue-100&apos; : &apos;bg-green-600 text-green-100&apos;
                            }`}>
                                {isTraining ? &apos;Training&apos; : &apos;Ready&apos;}
                            </span>
                        </div>
                        
                        {/* Real-time Connection Status with Enhanced Mobile Details */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-gray-300 text-sm sm:text-base">Connection</span>
                            <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                <div className={`w-2 h-2 rounded-full ${getAPIStatusClass(realtimeConnected ? &apos;connected&apos; : &apos;error&apos;)}`}></div>
                                <span className={`text-xs sm:text-sm ${getAPIStatusTextClass(realtimeConnected ? &apos;connected&apos; : &apos;error&apos;)}`}>
                                    {realtimeConnected ? &apos;Connected&apos; : &apos;Disconnected&apos;}
                                </span>
                                {errors.connection && (
}
                                    <AlertTriangle className="w-3 h-3 text-yellow-400 sm:px-4 md:px-6 lg:px-8" />
                                )}
                            </div>
                        </div>
                        
                        {/* Enhanced Data Loading Indicators */}
                        {(dataLoading || Object.values(loadingStates).some((loading: any) => loading)) && (
}
                            <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                    <RefreshCw className="w-4 h-4 text-blue-400 animate-spin sm:px-4 md:px-6 lg:px-8" />
                                    <span className="text-blue-300 text-sm sm:px-4 md:px-6 lg:px-8">
                                        {loadingStates.export ? &apos;Exporting data...&apos; : getLoadingStateMessage()}
                                    </span>
                                </div>
                                {retryAttempts.dataLoad > 0 && (
}
                                    <div className="text-xs text-yellow-300 sm:px-4 md:px-6 lg:px-8">
                                        Retry attempt {retryAttempts.dataLoad}/3
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Training Progress with Error Handling */}
                        {isTraining && (
}
                            <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                    <span className="text-gray-400 text-sm sm:px-4 md:px-6 lg:px-8">Progress</span>
                                    <span className="text-blue-400 font-semibold text-sm sm:px-4 md:px-6 lg:px-8">{trainingProgressPercentage}%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
                                    <div 
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 sm:h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${trainingProgressPercentage}%` }}
                                    ></div>
                                </div>
                                <div className="text-xs sm:text-sm text-gray-400">
                                    {trainingProgress.currentModel} - {trainingProgress.phase}
                                    {errors.training && (
}
                                        <span className="text-red-400 ml-2 sm:px-4 md:px-6 lg:px-8">(Error occurred)</span>
                                    )}
                                </div>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-4 border-t border-gray-700">
                            <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                <div className="text-base sm:text-lg font-bold text-green-400">{formattedTrainingMetrics.accuracy}</div>
                                <div className="text-xs sm:text-sm text-gray-400">Accuracy</div>
                            </div>
                            <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                <div className="text-base sm:text-lg font-bold text-blue-400">{formattedTrainingMetrics.loss}</div>
                                <div className="text-xs sm:text-sm text-gray-400">Loss</div>
                            </div>
                        </div>
                    </div>
                </Widget>

                {/* Dataset Summary Widget - Mobile Enhanced */}
                <Widget title="Dataset Summary" className="bg-gray-900/50 widget-mobile-responsive sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-gray-300 text-sm sm:text-base">Total Records</span>
                            <span className="text-lg sm:text-2xl font-bold text-white">{datasetStats.totalRecords.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-gray-300 text-sm sm:text-base">Training Set</span>
                            <span className="text-white text-sm sm:text-base">{datasetStats.trainingRecords.toLocaleString()} ({trainingSplitPercentages.training}%)</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-gray-300 text-sm sm:text-base">Validation Set</span>
                            <span className="text-white text-sm sm:text-base">{datasetStats.validationRecords.toLocaleString()} ({trainingSplitPercentages.validation}%)</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-gray-300 text-sm sm:text-base">Data Quality</span>
                            <span className="text-green-400 font-semibold text-sm sm:text-base">{datasetStats.dataQuality.toFixed(1)}%</span>
                        </div>
                    </div>
                </Widget>

                {/* Model Performance Widget - Mobile Enhanced */}
                <Widget title="Model Performance" className="bg-gray-900/50 widget-mobile-responsive sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-gray-300 text-sm sm:text-base">Validation Accuracy</span>
                            <span className="text-lg sm:text-xl font-bold text-green-400">{formattedTrainingMetrics.overallAccuracy}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-gray-300 text-sm sm:text-base">Current Epoch</span>
                            <span className="text-white text-sm sm:text-base">{trainingProgress.epoch || 0}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-gray-300 text-sm sm:text-base">Learning Rate</span>
                            <span className="text-white text-sm sm:text-base">{trainingConfig.hyperparameters?.learningRate || 0.001}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-gray-300 text-sm sm:text-base">Active Models</span>
                            <span className="text-blue-400 text-sm sm:text-base">{modelMetrics.models.length}</span>
                        </div>
                    </div>
                </Widget>
            </div>

            {/* Mobile-Optimized Secondary Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Recent Training Sessions Widget - Mobile Enhanced */}
                <Widget title="Recent Training Sessions" className="bg-gray-900/50 widget-mobile-responsive sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        {recentTrainingSessions.map((session: any) => (
}
                            <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-800/50 rounded-lg gap-3 sm:gap-0 min-h-[80px] sm:min-h-[60px]">
                                <div className="flex-1 min-w-0 sm:px-4 md:px-6 lg:px-8">
                                    <div className="font-medium text-white text-sm sm:text-base truncate">{session.name}</div>
                                    <div className="text-xs sm:text-sm text-gray-400">{new Date(session.startTime).toLocaleDateString()}</div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end space-x-3 flex-shrink-0">
                                    {Boolean(session.metrics.finalAccuracy) && (
}
                                        <span className="text-green-400 font-semibold text-sm sm:px-4 md:px-6 lg:px-8">{session.metrics.finalAccuracy.toFixed(3)}</span>
                                    )}
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
}
                                        getSessionStatusClass(session?.status)
                                    }`}>
                                        {session?.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentTrainingSessions.length === 0 && (
}
                            <div className="text-center text-gray-400 py-6 sm:py-4">
                                <Brain className="w-8 h-8 mx-auto mb-2 opacity-50 sm:px-4 md:px-6 lg:px-8" />
                                <p className="text-sm sm:px-4 md:px-6 lg:px-8">No training sessions yet.</p>
                                <p className="text-xs sm:px-4 md:px-6 lg:px-8">Start your first training session!</p>
                            </div>
                        )}
                    </div>
                </Widget>

                {/* System Resources Widget - Mobile Enhanced */}
                <Widget title="System Resources" className="bg-gray-900/50 widget-mobile-responsive sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm mb-2 gap-1">
                                <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">GPU Usage</span>
                                <span className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">73%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
                                <div className="bg-red-500 h-2 sm:h-3 rounded-full transition-all duration-300" style={{ width: &apos;73%&apos; }}></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm mb-2 gap-1">
                                <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">Memory Usage</span>
                                <span className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">45%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
                                <div className="bg-yellow-500 h-2 sm:h-3 rounded-full transition-all duration-300" style={{ width: &apos;45%&apos; }}></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm mb-2 gap-1">
                                <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">CPU Usage</span>
                                <span className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">28%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
                                <div className="bg-green-500 h-2 sm:h-3 rounded-full transition-all duration-300" style={{ width: &apos;28%&apos; }}></div>
                            </div>
                        </div>
                        
                        {/* Additional System Info */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-3 border-t border-gray-700">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <span className="text-gray-300 text-xs sm:text-sm">Active Workers</span>
                                <span className="text-white font-semibold text-xs sm:text-sm">8/12</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <span className="text-gray-300 text-xs sm:text-sm">Queue Size</span>
                                <span className="text-white font-semibold text-xs sm:text-sm">3 jobs</span>
                            </div>
                        </div>
                    </div>
                </Widget>
            </div>
        </div>
    );

    const renderDatasetsTab = () => (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Widget title="Data Sources" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        {[
}
                            { name: &apos;Fantasy API&apos;, status: &apos;active&apos;, records: &apos;1.2M&apos;, lastUpdate: &apos;2 min ago&apos; },
                            { name: &apos;Historical Stats&apos;, status: &apos;active&apos;, records: &apos;890K&apos;, lastUpdate: &apos;5 min ago&apos; },
                            { name: &apos;Weather Data&apos;, status: &apos;warning&apos;, records: &apos;145K&apos;, lastUpdate: &apos;1 hour ago&apos; },
                            { name: &apos;Injury Reports&apos;, status: &apos;active&apos;, records: &apos;23K&apos;, lastUpdate: &apos;30 sec ago&apos; }
                        ].map((source: any) => (
                            <div key={source.name} className="flex items-center justify-between p-3 sm:p-4 bg-gray-800/50 rounded-lg min-h-[60px]">
                                <div className="flex-1 min-w-0 sm:px-4 md:px-6 lg:px-8">
                                    <div className="font-medium text-white text-sm sm:text-base truncate">{source.name}</div>
                                    <div className="text-xs sm:text-sm text-gray-400">{source.records} records</div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-3 sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex items-center justify-end mb-1 sm:px-4 md:px-6 lg:px-8">
                                        <div className={`w-2 h-2 rounded-full ${
}
                                            source?.status === &apos;active&apos; ? &apos;bg-green-400&apos; : &apos;bg-yellow-400&apos;
                                        }`}></div>
                                        <span className="ml-2 text-xs text-gray-400 capitalize sm:px-4 md:px-6 lg:px-8">{source?.status}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 whitespace-nowrap sm:px-4 md:px-6 lg:px-8">{source.lastUpdate}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Widget>

                <Widget title="Data Quality Metrics" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        {validationReport ? (
}
                            <>
                                <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">Overall Score</span>
                                    <span className={`text-2xl font-bold ${getQualityScoreClass(validationReport.score)}`}>
                                        {validationReport.score.toFixed(1)}%
                                    </span>
                                </div>
                                
                                <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2 sm:px-4 md:px-6 lg:px-8">
                                            <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Completeness</span>
                                            <span className="text-white sm:px-4 md:px-6 lg:px-8">{validationReport.qualityMetrics.completeness.score.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                            <div className="bg-green-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: `${validationReport.qualityMetrics.completeness.score}%` }}></div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between text-sm mb-2 sm:px-4 md:px-6 lg:px-8">
                                            <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Accuracy</span>
                                            <span className="text-white sm:px-4 md:px-6 lg:px-8">{validationReport.qualityMetrics.accuracy.score.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                            <div className="bg-blue-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: `${validationReport.qualityMetrics.accuracy.score}%` }}></div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between text-sm mb-2 sm:px-4 md:px-6 lg:px-8">
                                            <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Consistency</span>
                                            <span className="text-white sm:px-4 md:px-6 lg:px-8">{validationReport.qualityMetrics.consistency.score.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                            <div className="bg-purple-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: `${validationReport.qualityMetrics.consistency.score}%` }}></div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between text-sm mb-2 sm:px-4 md:px-6 lg:px-8">
                                            <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Validity</span>
                                            <span className="text-white sm:px-4 md:px-6 lg:px-8">{validationReport.qualityMetrics.validity.score.toFixed(1)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                            <div className="bg-yellow-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: `${validationReport.qualityMetrics.validity.score}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4 sm:px-4 md:px-6 lg:px-8">
                                <div className="text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">No validation report available</div>
                                <button 
                                    onClick={handleValidateData}
                                    disabled={isValidating}
                                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
                                 aria-label="Action button">
                                    {isValidating ? &apos;Validating...&apos; : &apos;Run Validation&apos;}
                                </button>
                            </div>
                        )}
                    </div>
                </Widget>

                <Widget title="Dataset Actions" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        {/* Error display for dataset actions */}
                        {errors.dataLoad && (
}
                            <div className="bg-red-900/50 border border-red-500 rounded p-2 mb-3 sm:px-4 md:px-6 lg:px-8">
                                <div className="text-red-300 text-sm sm:px-4 md:px-6 lg:px-8">{errors.dataLoad}</div>
                                <button 
                                    onClick={() => handleErrorDismiss(&apos;dataLoad&apos;)}
                                >
//                                     Dismiss
                                </button>
                            </div>
                        )}
                        
                        <button 
                            disabled={!realtimeConnected}
                            className="w-full flex items-center justify-center space-x-2 p-3 sm:p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base min-h-[48px] touch-target"
                         aria-label="Action button">
                            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Upload Dataset</span>
                        </button>
                        
                        <button 
                            onClick={refreshDataSources}
                            disabled={loadingStates.datasetStats || !realtimeConnected}
                            className="w-full flex items-center justify-center space-x-2 p-3 sm:p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm sm:text-base min-h-[48px] touch-target"
                         aria-label="Action button">
                            <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loadingStates.datasetStats ? &apos;animate-spin&apos; : &apos;&apos;}`} />
                            <span className="truncate sm:px-4 md:px-6 lg:px-8">
                                {loadingStates.datasetStats ? &apos;Refreshing...&apos; : getConnectionDependentText(&apos;Refresh Data&apos;)}
                            </span>
                        </button>
                        
                        <button 
                            onClick={handleValidateData}
                            disabled={loadingStates.validation || loadingStates.datasetStats || !realtimeConnected}
                            className="w-full flex items-center justify-center space-x-2 p-3 sm:p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm sm:text-base min-h-[48px] touch-target"
                         aria-label="Action button">
                            <Target className={`w-4 h-4 sm:w-5 sm:h-5 ${loadingStates.validation ? &apos;animate-spin&apos; : &apos;&apos;}`} />
                            <span className="truncate sm:px-4 md:px-6 lg:px-8">
                                {loadingStates.validation ? &apos;Validating...&apos; : getConnectionDependentText(&apos;Validate Quality&apos;)}
                            </span>
                        </button>
                        
                        <button 
                            onClick={exportTrainingData}
                            disabled={loadingStates.export || !realtimeConnected}
                            className="w-full flex items-center justify-center space-x-2 p-3 sm:p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm sm:text-base min-h-[48px] touch-target"
                         aria-label="Action button">
                            <Download className={`w-4 h-4 sm:w-5 sm:h-5 ${loadingStates.export ? &apos;animate-spin&apos; : &apos;&apos;}`} />
                            <span className="truncate sm:px-4 md:px-6 lg:px-8">
                                {loadingStates.export ? &apos;Exporting...&apos; : getConnectionDependentText(&apos;Export Dataset&apos;)}
                            </span>
                        </button>
                        
                        {/* Retry attempts indicator */}
                        {(retryAttempts.dataLoad > 0 || retryAttempts.validation > 0) && (
}
                            <div className="text-xs text-yellow-300 text-center pt-2 border-t border-gray-700 sm:px-4 md:px-6 lg:px-8">
                                {retryAttempts.dataLoad > 0 && `Data load retries: ${retryAttempts.dataLoad}/3`}
                                {retryAttempts.validation > 0 && `Validation retries: ${retryAttempts.validation}/3`}
                            </div>
                        )}
                    </div>
                </Widget>
            </div>

            <Widget title="Dataset Management" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">Available Datasets</h3>
                        <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base min-h-[44px] touch-target" aria-label="Action button">
                                Add Dataset
                            </button>
                            <button className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base min-h-[44px] touch-target" aria-label="Action button">
//                                 Import
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                        {[
}
                            { name: &apos;Player Statistics 2024&apos;, size: &apos;245 MB&apos;, records: &apos;1.2M&apos;, format: &apos;CSV&apos;, lastModified: &apos;2 hours ago&apos;, quality: 96.8 },
                            { name: &apos;Historical Matchups&apos;, size: &apos;156 MB&apos;, records: &apos;890K&apos;, format: &apos;JSON&apos;, lastModified: &apos;5 hours ago&apos;, quality: 94.2 },
                            { name: &apos;Weather Conditions&apos;, size: &apos;89 MB&apos;, records: &apos;145K&apos;, format: &apos;CSV&apos;, lastModified: &apos;1 day ago&apos;, quality: 87.5 },
                            { name: &apos;Injury Reports&apos;, size: &apos;12 MB&apos;, records: &apos;23K&apos;, format: &apos;JSON&apos;, lastModified: &apos;3 hours ago&apos;, quality: 98.1 },
                            { name: &apos;Team Analytics&apos;, size: &apos;198 MB&apos;, records: &apos;567K&apos;, format: &apos;Parquet&apos;, lastModified: &apos;6 hours ago&apos;, quality: 95.7 },
                            { name: &apos;Draft Results&apos;, size: &apos;34 MB&apos;, records: &apos;78K&apos;, format: &apos;CSV&apos;, lastModified: &apos;12 hours ago&apos;, quality: 93.4 }
                        ].map((dataset: any) => (
                            <div key={dataset.name} className="p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-gray-700 min-h-[200px] flex flex-col">
                                <div className="flex items-start justify-between mb-2 flex-wrap gap-2 sm:px-4 md:px-6 lg:px-8">
                                    <h4 className="font-medium text-white text-sm sm:text-base truncate flex-1 min-w-0">{dataset.name}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap flex-shrink-0 ${getDatasetQualityClass(dataset.quality)}`}>
                                        {dataset.quality}%
                                    </span>
                                </div>
                                <div className="space-y-1 text-xs sm:text-sm text-gray-400 flex-1">
                                    <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                                        <span>Size:</span>
                                        <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{dataset.size}</span>
                                    </div>
                                    <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                                        <span>Records:</span>
                                        <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{dataset.records}</span>
                                    </div>
                                    <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                                        <span>Format:</span>
                                        <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{dataset.format}</span>
                                    </div>
                                    <div className="flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                                        <span>Modified:</span>
                                        <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{dataset.lastModified}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 mt-3 pt-2 border-t border-gray-700">
                                    <button className="flex-1 px-2 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded hover:bg-blue-700 transition-colors min-h-[36px] touch-target" aria-label="Action button">
//                                         View
                                    </button>
                                    <button className="flex-1 px-2 py-2 bg-gray-600 text-white text-xs sm:text-sm rounded hover:bg-gray-700 transition-colors min-h-[36px] touch-target" aria-label="Action button">
//                                         Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Widget>
        </div>
    );

    const renderValidationTab = () => (
        <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <Widget title="Validation Overview" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:space-y-4">
                        {validationReport ? (
}
                            <>
                                <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                    <div className={`text-3xl sm:text-4xl font-bold mb-2 ${getQualityScoreClass(validationReport.score)}`}>
                                        {validationReport.score.toFixed(1)}%
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-400">Overall Quality Score</div>
                                </div>
                                
                                <div className="flex items-center justify-between py-1 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-gray-300 text-sm sm:text-base">Status</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
}
                                        validationReport.passed ? &apos;bg-green-600 text-green-100&apos; : &apos;bg-red-600 text-red-100&apos;
                                    }`}>
                                        {validationReport.passed ? &apos;Passed&apos; : &apos;Failed&apos;}
                                    </span>
                                </div>
                                
                                <div className="flex items-center justify-between py-1 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-gray-300 text-sm sm:text-base">Records</span>
                                    <span className="text-white text-sm sm:text-base">{validationReport.datasetProfile.recordCount.toLocaleString()}</span>
                                </div>
                                
                                <div className="flex items-center justify-between py-1 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-gray-300 text-sm sm:text-base">Fields</span>
                                    <span className="text-white text-sm sm:text-base">{validationReport.datasetProfile.fieldCount}</span>
                                </div>
                                
                                <div className="text-xs text-gray-400 text-center sm:px-4 md:px-6 lg:px-8">
                                    Last validated: {new Date(validationReport.timestamp).toLocaleString()}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-4 sm:px-4 md:px-6 lg:px-8">
                                <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-yellow-400 opacity-50" />
                                <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">No validation report available</p>
                                <button 
                                    onClick={handleValidateData}
                                    disabled={isValidating}
                                    className="px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 min-h-[44px] touch-target text-sm sm:text-base"
                                 aria-label="Action button">
                                    {isValidating ? &apos;Validating...&apos; : &apos;Run Validation&apos;}
                                </button>
                            </div>
                        )}
                    </div>
                </Widget>

                <Widget title="Quality Dimensions" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        {validationReport ? (
}
                            <>
                                <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex justify-between text-sm sm:px-4 md:px-6 lg:px-8">
                                        <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Completeness</span>
                                        <span className="text-white sm:px-4 md:px-6 lg:px-8">{validationReport.qualityMetrics.completeness.score.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                        <div className="bg-green-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: `${validationReport.qualityMetrics.completeness.score}%` }}></div>
                                    </div>
                                    <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                        {validationReport.qualityMetrics.completeness.missingValues} missing values
                                    </div>
                                </div>
                                
                                <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex justify-between text-sm sm:px-4 md:px-6 lg:px-8">
                                        <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Consistency</span>
                                        <span className="text-white sm:px-4 md:px-6 lg:px-8">{validationReport.qualityMetrics.consistency.score.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                        <div className="bg-blue-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: `${validationReport.qualityMetrics.consistency.score}%` }}></div>
                                    </div>
                                    <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                        {validationReport.qualityMetrics.consistency.duplicates} duplicates
                                    </div>
                                </div>
                                
                                <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex justify-between text-sm sm:px-4 md:px-6 lg:px-8">
                                        <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Accuracy</span>
                                        <span className="text-white sm:px-4 md:px-6 lg:px-8">{validationReport.qualityMetrics.accuracy.score.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                        <div className="bg-purple-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: `${validationReport.qualityMetrics.accuracy.score}%` }}></div>
                                    </div>
                                    <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                        {validationReport.qualityMetrics.accuracy.outliers} outliers detected
                                    </div>
                                </div>
                                
                                <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex justify-between text-sm sm:px-4 md:px-6 lg:px-8">
                                        <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Validity</span>
                                        <span className="text-white sm:px-4 md:px-6 lg:px-8">{validationReport.qualityMetrics.validity.score.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                        <div className="bg-yellow-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: `${validationReport.qualityMetrics.validity.score}%` }}></div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-400 py-8 sm:px-4 md:px-6 lg:px-8">
                                Run validation to see quality metrics
                            </div>
                        )}
                    </div>
                </Widget>

                <Widget title="Validation Actions" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        <button 
                            onClick={handleValidateData}
                            disabled={isValidating}
                            className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 sm:px-4 md:px-6 lg:px-8"
                         aria-label="Action button">
                            <CheckCircle className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            <span>{isValidating ? &apos;Running Validation...&apos; : &apos;Run Full Validation&apos;}</span>
                        </button>
                        
                        <button className="w-full flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                            <Save className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            <span>Save Report</span>
                        </button>
                        
                        <button className="w-full flex items-center justify-center space-x-2 p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                            <Download className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            <span>Export Report</span>
                        </button>
                        
                        <div className="pt-3 border-t border-gray-700 sm:px-4 md:px-6 lg:px-8">
                            <h4 className="text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Quick Actions</h4>
                            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                <button className="w-full text-left text-sm p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                    Fix Missing Values
                                </button>
                                <button className="w-full text-left text-sm p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                    Remove Duplicates
                                </button>
                                <button className="w-full text-left text-sm p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                    Handle Outliers
                                </button>
                            </div>
                        </div>
                    </div>
                </Widget>
            </div>

            {validationReport && (
}
                <>
                    <Widget title="Validation Results" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">Rule Results ({validationReport.validationResults.length})</h3>
                                <div className="flex space-x-2 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                        {validationReport.validationResults.filter((r: any) => r.passed).length} passed
                                    </span>
                                    <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">•</span>
                                    <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                        {validationReport.validationResults.filter((r: any) => !r.passed).length} failed
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {validationReport.validationResults.map((result: any) => {
}
                                    const rule = validationRules.find((r: any) => r.id === result.ruleId);
                                    return (
                                        <div key={result.ruleId} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 sm:px-4 md:px-6 lg:px-8">
                                            <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                                                <h4 className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{rule?.name || result.ruleId}</h4>
                                                <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                                    <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{result.score.toFixed(1)}%</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${getValidationResultClass(result.passed, rule?.severity)}`}>
                                                        {getValidationResultText(result.passed, rule?.severity)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">{result.message}</div>
                                            {result.affectedRecords > 0 && (
}
                                                <div className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">
                                                    Affected records: {result.affectedRecords.toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Widget>

                    <Widget title="Recommendations" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                            <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">Data Quality Recommendations</h3>
                            <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                                {validationReport.recommendations.map((recommendation: any) => (
}
                                    <div key={`rec-${recommendation}`} className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 sm:px-4 md:px-6 lg:px-8" />
                                        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                                            <div className="text-white text-sm sm:px-4 md:px-6 lg:px-8">{recommendation}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Widget>
                </>
            )}
        </div>
    );

    const renderTrainingTab = () => (
        <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Widget title="Training Configuration" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:space-y-4">
                        <div>
                            <label htmlFor="model-type" className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Model Type</label>
                            <select 
                                id="model-type"
                                value={trainingConfig.modelType}
                                onChange={(e: any) => updateTrainingConfig({ modelType: e.target.value as TrainingConfiguration[&apos;modelType&apos;] }}
                                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 sm:py-3 border border-gray-600 min-h-[48px] touch-target text-sm sm:text-base"
                            >
                                <option value="ensemble">Ensemble (Recommended)</option>
                                <option value="random_forest">Random Forest</option>
                                <option value="gradient_boosting">Gradient Boosting</option>
                                <option value="neural_network">Neural Network</option>
                                <option value="linear_regression">Linear Regression</option>
                                <option value="svm">Support Vector Machine</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="training-split" className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Training Split</label>
                            <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                                <input 
                                    id="training-split"
                                    type="number" 
                                    value={Math.round((trainingConfig.trainingSplit || 0.8) * 100)}
                                    onChange={(e: any) => updateTrainingConfig({ 
}
                                        trainingSplit: parseInt(e.target.value) / 100,
                                        validationSplit: 1 - (parseInt(e.target.value) / 100)
                                    }}
                                    className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 sm:py-3 border border-gray-600 min-h-[48px] text-sm sm:text-base"
                                    placeholder="Training %"
                                    min="60" max="90"
                                />
                                <input 
                                    type="number" 
                                    value={Math.round(trainingConfig.validationSplit * 100)}
//                                     readOnly
                                    className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 sm:py-3 border border-gray-600 min-h-[48px] text-sm sm:text-base"
                                    placeholder="Validation %"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="learning-rate" className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Learning Rate</label>
                            <input 
                                id="learning-rate"
                                type="range" 
                                min="0.0001" 
                                max="0.1" 
                                step="0.0001" 
                                value={trainingConfig.hyperparameters?.learningRate || 0.001}
                                onChange={(e: any) => updateTrainingConfig({ 
}
                                    hyperparameters: {
}
                                        ...trainingConfig.hyperparameters, 
                                        learningRate: parseFloat(e.target.value) 
                                    }})}
                                className="w-full min-h-[40px] touch-target sm:px-4 md:px-6 lg:px-8"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">
                                <span>0.0001</span>
                                <span className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{trainingConfig.hyperparameters?.learningRate || 0.001}</span>
                                <span>0.1</span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="batch-size" className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Batch Size</label>
                            <select 
                                id="batch-size"
                                value={trainingConfig.batchSize}
                                onChange={(e: any) => updateTrainingConfig({ batchSize: parseInt(e.target.value) }}
                                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 sm:py-3 border border-gray-600 min-h-[48px] touch-target text-sm sm:text-base"
                            >
                                <option value={16}>16</option>
                                <option value={32}>32</option>
                                <option value={64}>64</option>
                                <option value={128}>128</option>
                                <option value={256}>256</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="max-epochs" className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Max Epochs</label>
                            <input 
                                id="max-epochs"
                                type="number" 
                                value={trainingConfig.maxEpochs}
                                onChange={(e: any) => updateTrainingConfig({ maxEpochs: parseInt(e.target.value) }}
                                min="10" 
                                max="1000"
                                className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 sm:py-3 border border-gray-600 min-h-[48px] touch-target text-sm sm:text-base"
                            />
                        </div>

                        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center justify-between py-2 sm:px-4 md:px-6 lg:px-8">
                                <span className="text-gray-300 text-sm sm:text-base">Early Stopping</span>
                                <input 
                                    type="checkbox" 
                                    checked={trainingConfig.earlyStoppingEnabled}
                                    onChange={(e: any) => updateTrainingConfig({ earlyStoppingEnabled: e.target.checked }}
                                    className="rounded bg-gray-700 border-gray-600 min-w-[20px] min-h-[20px] touch-target sm:px-4 md:px-6 lg:px-8" 
                                />
                            </div>
                            <div className="flex items-center justify-between py-2 sm:px-4 md:px-6 lg:px-8">
                                <span className="text-gray-300 text-sm sm:text-base">Cross Validation</span>
                                <input 
                                    type="checkbox" 
                                    checked={trainingConfig.crossValidationEnabled}
                                    onChange={(e: any) => updateTrainingConfig({ crossValidationEnabled: e.target.checked }}
                                    className="rounded bg-gray-700 border-gray-600 min-w-[20px] min-h-[20px] touch-target sm:px-4 md:px-6 lg:px-8" 
                                />
                            </div>
                            <div className="flex items-center justify-between py-2 sm:px-4 md:px-6 lg:px-8">
                                <span className="text-gray-300 text-sm sm:text-base">Hyperparameter Tuning</span>
                                <input 
                                    type="checkbox" 
                                    checked={trainingConfig.hyperparameterTuningEnabled}
                                    onChange={(e: any) => updateTrainingConfig({ hyperparameterTuningEnabled: e.target.checked }}
                                    className="rounded bg-gray-700 border-gray-600 min-w-[20px] min-h-[20px] touch-target sm:px-4 md:px-6 lg:px-8" 
                                />
                            </div>
                        </div>
                    </div>
                </Widget>

                <Widget title="Training Progress" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">Current Session</h3>
                            <span className={`px-2 py-1 rounded-full text-xs ${
}
                                isTraining ? &apos;bg-blue-600 text-blue-100&apos; : &apos;bg-green-600 text-green-100&apos;
                            }`}>
                                {isTraining ? &apos;Training&apos; : &apos;Idle&apos;}
                            </span>
                        </div>

                        {isTraining && (
}
                            <div className="space-y-3 sm:space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs sm:text-sm mb-2">
                                        <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Overall Progress</span>
                                        <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{Math.round((trainingProgress.currentStep / trainingProgress.totalSteps) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-3 sm:h-4">
                                        <div 
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 sm:h-4 rounded-full transition-all duration-300"
                                            style={{ width: `${(trainingProgress.currentStep / trainingProgress.totalSteps) * 100}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1 truncate sm:px-4 md:px-6 lg:px-8">
                                        {trainingProgress.currentModel} - {trainingProgress.phase}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                    <div className="p-3 bg-gray-800/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                        <div className="text-xs sm:text-sm text-gray-400">Current Epoch</div>
                                        <div className="text-lg sm:text-xl font-bold text-white">{trainingProgress.epoch || 0}</div>
                                    </div>
                                    <div className="p-3 bg-gray-800/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                        <div className="text-xs sm:text-sm text-gray-400">Learning Rate</div>
                                        <div className="text-lg sm:text-xl font-bold text-white">{trainingConfig.hyperparameters?.learningRate || 0.001}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                            <div className="p-3 bg-gray-800/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <div className="text-xs sm:text-sm text-gray-400">Accuracy</div>
                                <div className="text-xl sm:text-2xl font-bold text-green-400">{(trainingProgress.accuracy || 0).toFixed(3)}</div>
                            </div>
                            <div className="p-3 bg-gray-800/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <div className="text-xs sm:text-sm text-gray-400">Loss</div>
                                <div className="text-xl sm:text-2xl font-bold text-red-400">{(trainingProgress.loss || 0).toFixed(3)}</div>
                            </div>
                        </div>

                        <div className="p-3 bg-gray-800/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-xs sm:text-sm text-gray-400 mb-2">Validation Accuracy</div>
                            <div className="text-xl sm:text-2xl font-bold text-blue-400">{modelMetrics.overallAccuracy.toFixed(3)}</div>
                        </div>

                        {!isTraining && (
}
                            <button 
                                onClick={handleTrainModels}
                                className="w-full flex items-center justify-center space-x-2 p-3 sm:p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 min-h-[48px] touch-target text-sm sm:text-base font-medium"
                             aria-label="Action button">
                                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Start Training</span>
                            </button>
                        )}

                        {isTraining && (
}
                            <button 
                                onClick={handleStopTraining}
                                className="w-full flex items-center justify-center space-x-2 p-3 sm:p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors min-h-[48px] touch-target text-sm sm:text-base font-medium"
                             aria-label="Action button">
                                <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Stop Training</span>
                            </button>
                        )}
                    </div>
                </Widget>
            </div>

            <Widget title="Training History" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h3 className="text-base sm:text-lg font-semibold text-white">Recent Training Sessions</h3>
                        <button className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors min-h-[40px] touch-target text-sm sm:text-base self-start sm:self-auto" aria-label="Action button">
                            View All
                        </button>
                    </div>

                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        {trainingHistory.slice(0, 4).map((session: any) => (
}
                            <div key={session.id} className="p-3 sm:p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                    <h4 className="font-medium text-white text-sm sm:text-base truncate">{session.name}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs self-start ${getSessionStatusClass(session?.status)}`}>
                                        {session?.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Duration</div>
                                        <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">
                                            {session.metrics.trainingDuration ? 
}
                                                `${Math.round(session.metrics.trainingDuration / 60000)}m` : 
                                                &apos;N/A&apos;

                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Accuracy</div>
                                        <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">
                                            {session.metrics.finalAccuracy?.toFixed(3) || &apos;N/A&apos;}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Loss</div>
                                        <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">
                                            {session.metrics.finalLoss?.toFixed(3) || &apos;N/A&apos;}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Epochs</div>
                                        <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{session.metrics.epochs || &apos;N/A&apos;}</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 mt-2 sm:px-4 md:px-6 lg:px-8">
                                    {new Date(session.startTime).toLocaleString()}
                                </div>
                            </div>
                        ))}
                        {trainingHistory.length === 0 && (
}
                            <div className="text-center text-gray-400 py-8 sm:px-4 md:px-6 lg:px-8">
                                <Brain className="w-12 h-12 mx-auto mb-4 opacity-50 sm:px-4 md:px-6 lg:px-8" />
                                <p>No training sessions yet.</p>
                                <p className="text-sm sm:px-4 md:px-6 lg:px-8">Start your first training to see history here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </Widget>
        </div>
    );

    const renderPerformanceTab = () => (
        <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <Widget title="Model Metrics" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:space-y-4">
                        <div className="text-center sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl sm:text-3xl font-bold text-green-400">{(modelMetrics.overallAccuracy * 100).toFixed(1)}%</div>
                            <div className="text-xs sm:text-sm text-gray-400">Overall Accuracy</div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                <div className="text-lg sm:text-xl font-bold text-blue-400">0.847</div>
                                <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Precision</div>
                            </div>
                            <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                <div className="text-lg sm:text-xl font-bold text-purple-400">0.823</div>
                                <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Recall</div>
                            </div>
                        </div>
                        
                        <div className="text-center sm:px-4 md:px-6 lg:px-8">
                            <div className="text-lg sm:text-xl font-bold text-yellow-400">0.834</div>
                            <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">F1-Score</div>
                        </div>
                    </div>
                </Widget>

                <Widget title="Performance Trends" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:space-y-4">
                        <div>
                            <div className="flex justify-between text-xs sm:text-sm mb-2">
                                <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">7-Day Trend</span>
                                <span className="text-green-400 font-medium sm:px-4 md:px-6 lg:px-8">+2.3%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
                                <div className="bg-green-500 h-2 sm:h-3 rounded-full transition-all duration-300" style={{ width: &apos;85%&apos; }}></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between text-xs sm:text-sm mb-2">
                                <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">30-Day Trend</span>
                                <span className="text-green-400 font-medium sm:px-4 md:px-6 lg:px-8">+5.7%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
                                <div className="bg-blue-500 h-2 sm:h-3 rounded-full transition-all duration-300" style={{ width: &apos;78%&apos; }}></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between text-xs sm:text-sm mb-2">
                                <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Model Stability</span>
                                <span className="text-white sm:px-4 md:px-6 lg:px-8">High</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                <div className="bg-purple-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: &apos;92%&apos; }}></div>
                            </div>
                        </div>
                        
                        <div className="pt-2 border-t border-gray-700 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center justify-between text-sm sm:px-4 md:px-6 lg:px-8">
                                <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Prediction Confidence</span>
                                <span className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">87.3%</span>
                            </div>
                        </div>
                    </div>
                </Widget>

                <Widget title="Model Comparison" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        {modelMetrics.models.slice(0, 4).map((model, idx) => (
}
                            <div key={model.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded sm:px-4 md:px-6 lg:px-8">
                                <div>
                                    <div className="text-white text-sm font-medium sm:px-4 md:px-6 lg:px-8">{model.name}</div>
                                    <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{model.accuracy.toFixed(3)}</div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs ${getModelStatusClass(model.isActive, model.type)}`}>
                                    {getModelStatusText(model.isActive, model.type)}
                                </span>
                            </div>
                        ))}
                        {modelMetrics.models.length === 0 && (
}
                            <div className="text-center text-gray-400 py-4 sm:px-4 md:px-6 lg:px-8">
                                No trained models yet. Start training to see model comparison.
                            </div>
                        )}
                    </div>
                </Widget>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Widget title="Accuracy Distribution" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="text-center sm:px-4 md:px-6 lg:px-8">
                            <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Prediction Accuracy by Category</h3>
                        </div>
                        
                        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                            {[
}
                                { category: &apos;Quarterback&apos;, accuracy: 92.4, predictions: 1245 },
                                { category: &apos;Running Back&apos;, accuracy: 88.7, predictions: 2156 },
                                { category: &apos;Wide Receiver&apos;, accuracy: 85.3, predictions: 3421 },
                                { category: &apos;Tight End&apos;, accuracy: 89.1, predictions: 876 },
                                { category: &apos;Kicker&apos;, accuracy: 94.8, predictions: 543 },
                                { category: &apos;Defense&apos;, accuracy: 87.2, predictions: 987 }
                            ].map((item: any) => (
                                <div key={item.category} className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex justify-between text-sm sm:px-4 md:px-6 lg:px-8">
                                        <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">{item.category}</span>
                                        <span className="text-white sm:px-4 md:px-6 lg:px-8">{item.accuracy}% ({item.predictions})</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                        <div 
                                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" 
                                            style={{ width: `${item.accuracy}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Widget>

                <Widget title="Real-time Performance" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">Live Metrics</h3>
                            <div className="flex items-center space-x-2 text-green-400 sm:px-4 md:px-6 lg:px-8">
                                <Activity className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                <span className="text-sm sm:px-4 md:px-6 lg:px-8">Live</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:px-4 md:px-6 lg:px-8">
                            <div className="p-3 bg-gray-800/50 rounded-lg text-center sm:px-4 md:px-6 lg:px-8">
                                <div className="text-2xl font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">847</div>
                                <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Predictions/min</div>
                            </div>
                            <div className="p-3 bg-gray-800/50 rounded-lg text-center sm:px-4 md:px-6 lg:px-8">
                                <div className="text-2xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">23ms</div>
                                <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Avg Response</div>
                            </div>
                        </div>

                        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                            <div>
                                <div className="flex justify-between text-sm mb-1 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Success Rate</span>
                                    <span className="text-white sm:px-4 md:px-6 lg:px-8">98.7%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                    <div className="bg-green-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: &apos;98.7%&apos; }}></div>
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex justify-between text-sm mb-1 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Error Rate</span>
                                    <span className="text-white sm:px-4 md:px-6 lg:px-8">1.3%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                    <div className="bg-red-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: &apos;1.3%&apos; }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-700 sm:px-4 md:px-6 lg:px-8">
                            <h4 className="text-white font-medium mb-2 sm:px-4 md:px-6 lg:px-8">Recent Alerts</h4>
                            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center space-x-2 text-sm sm:px-4 md:px-6 lg:px-8">
                                    <CheckCircle className="w-4 h-4 text-green-400 sm:px-4 md:px-6 lg:px-8" />
                                    <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">Model health check passed</span>
                                    <span className="text-gray-500 sm:px-4 md:px-6 lg:px-8">2m ago</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm sm:px-4 md:px-6 lg:px-8">
                                    <AlertTriangle className="w-4 h-4 text-yellow-400 sm:px-4 md:px-6 lg:px-8" />
                                    <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">High memory usage detected</span>
                                    <span className="text-gray-500 sm:px-4 md:px-6 lg:px-8">15m ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Widget>

                <Widget title="A/B Testing & Model Comparison" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">Model Performance Comparison</h3>
                            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                New A/B Test
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="p-3 bg-gray-800/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <div className="text-sm text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Active A/B Tests</div>
                                <div className="text-2xl font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">3</div>
                            </div>
                            <div className="p-3 bg-gray-800/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <div className="text-sm text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Completed Tests</div>
                                <div className="text-2xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">12</div>
                            </div>
                        </div>

                        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                            {[
}
                                {
}
                                    id: &apos;test-1&apos;,
                                    name: &apos;Enhanced Ensemble vs Standard&apos;,
                                    status: &apos;active&apos;,
                                    modelA: &apos;Standard Model v2.1&apos;,
                                    modelB: &apos;Enhanced Ensemble v3.0&apos;,
                                    improvement: &apos;+2.3%&apos;,
                                    significance: 0.023,
                                    progress: 67,
                                    sampleSize: 1547
                                },
                                {
}
                                    id: &apos;test-2&apos;,
                                    name: &apos;Real-time vs Batch Prediction&apos;,
                                    status: &apos;active&apos;,
                                    modelA: &apos;Batch Predictor v1.5&apos;,
                                    modelB: &apos;Real-time Engine v2.0&apos;,
                                    improvement: &apos;+1.8%&apos;,
                                    significance: 0.045,
                                    progress: 89,
                                    sampleSize: 2103
                                },
                                {
}
                                    id: &apos;test-3&apos;,
                                    name: &apos;Feature Selection Optimization&apos;,
                                    status: &apos;completed&apos;,
                                    modelA: &apos;Full Features v1.0&apos;,
                                    modelB: &apos;Optimized Features v1.0&apos;,
                                    improvement: &apos;+4.1%&apos;,
                                    significance: 0.001,
                                    progress: 100,
                                    sampleSize: 3250

                            ].map((test: any) => (
                                <div key={test.id} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700 sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                                        <h4 className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{test.name}</h4>
                                        <span className={`px-2 py-1 rounded-full text-xs ${getTestStatusClass(test?.status)}`}>
                                            {test?.status}
                                        </span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-sm mb-3 sm:px-4 md:px-6 lg:px-8">
                                        <div>
                                            <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Model A</div>
                                            <div className="text-white sm:px-4 md:px-6 lg:px-8">{test.modelA}</div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Model B</div>
                                            <div className="text-white sm:px-4 md:px-6 lg:px-8">{test.modelB}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-sm mb-3 sm:px-4 md:px-6 lg:px-8">
                                        <div>
                                            <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Improvement</div>
                                            <div className={`font-medium ${
}
                                                test.improvement.startsWith(&apos;+&apos;) ? &apos;text-green-400&apos; : &apos;text-red-400&apos;
                                            }`}>
                                                {test.improvement}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Significance</div>
                                            <div className={`font-medium ${
}
                                                test.significance < 0.05 ? &apos;text-green-400&apos; : &apos;text-yellow-400&apos;
                                            }`}>
                                                p = {test.significance.toFixed(3)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Sample Size</div>
                                            <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{test.sampleSize.toLocaleString()}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                        <div className="flex justify-between text-xs sm:px-4 md:px-6 lg:px-8">
                                            <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Progress</span>
                                            <span className="text-white sm:px-4 md:px-6 lg:px-8">{test.progress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                            <div 
                                                className={`h-2 rounded-full ${
}
                                                    test?.status === &apos;completed&apos; ? &apos;bg-green-500&apos; : &apos;bg-blue-500&apos;
                                                }`}
                                                style={{ width: `${test.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {test?.status === &apos;active&apos; && (
}
                                        <div className="flex justify-end space-x-2 mt-3 sm:px-4 md:px-6 lg:px-8">
                                            <button className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500 transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
//                                                 Pause
                                            </button>
                                            <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
//                                                 Details
                                            </button>
                                        </div>
                                    )}

                                    {test?.status === &apos;completed&apos; && (
}
                                        <div className="flex justify-end space-x-2 mt-3 sm:px-4 md:px-6 lg:px-8">
                                            <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                                View Results
                                            </button>
                                            <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                                Deploy Winner
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-gray-700 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                <span className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Statistical Power Analysis</span>
                                <span className="text-sm text-white sm:px-4 md:px-6 lg:px-8">Power: 0.85 (Adequate)</span>
                            </div>
                            <div className="mt-2 w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                <div className="bg-green-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: &apos;85%&apos; }}></div>
                            </div>
                        </div>
                    </div>
                </Widget>

                <Widget title="Model Performance Trends" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">Historical Performance</h3>
                            <select className="bg-gray-700 text-white rounded-lg px-3 py-1 text-sm border border-gray-600 sm:px-4 md:px-6 lg:px-8">
                                <option>Last 7 days</option>
                                <option>Last 30 days</option>
                                <option>Last 90 days</option>
                                <option>All time</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                <div className="text-lg font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">↗ +2.3%</div>
                                <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Accuracy Trend</div>
                            </div>
                            <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                <div className="text-lg font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">↗ +1.8%</div>
                                <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Precision Trend</div>
                            </div>
                            <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                <div className="text-lg font-bold text-yellow-400 sm:px-4 md:px-6 lg:px-8">→ +0.1%</div>
                                <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Recall Trend</div>
                            </div>
                            <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                <div className="text-lg font-bold text-red-400 sm:px-4 md:px-6 lg:px-8">↘ -0.5%</div>
                                <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Response Time</div>
                            </div>
                        </div>

                        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                            <div>
                                <div className="flex justify-between text-sm mb-1 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Model Stability Index</span>
                                    <span className="text-white sm:px-4 md:px-6 lg:px-8">0.94 (Excellent)</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                    <div className="bg-green-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: &apos;94%&apos; }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Performance Consistency</span>
                                    <span className="text-white sm:px-4 md:px-6 lg:px-8">0.89 (Good)</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                    <div className="bg-blue-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: &apos;89%&apos; }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Drift Detection Score</span>
                                    <span className="text-white sm:px-4 md:px-6 lg:px-8">0.12 (Low Risk)</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                    <div className="bg-green-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: &apos;88%&apos; }}></div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-700 sm:px-4 md:px-6 lg:px-8">
                            <h4 className="text-white font-medium mb-2 sm:px-4 md:px-6 lg:px-8">Performance Alerts</h4>
                            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center space-x-2 text-sm sm:px-4 md:px-6 lg:px-8">
                                    <CheckCircle className="w-4 h-4 text-green-400 sm:px-4 md:px-6 lg:px-8" />
                                    <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">All models performing within expected ranges</span>
                                    <span className="text-gray-500 sm:px-4 md:px-6 lg:px-8">1h ago</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm sm:px-4 md:px-6 lg:px-8">
                                    <AlertTriangle className="w-4 h-4 text-yellow-400 sm:px-4 md:px-6 lg:px-8" />
                                    <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">Minor accuracy degradation in QB predictions</span>
                                    <span className="text-gray-500 sm:px-4 md:px-6 lg:px-8">3h ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Widget>
            </div>
        </div>
    );

    const renderConfigTab = () => (
        <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <Widget title="Model Configuration" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:space-y-4">
                        <div>
                            <label htmlFor="ensemble-strategy" className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Ensemble Strategy</label>
                            <select 
                                id="ensemble-strategy" 
                                value={systemConfig.ensembleStrategy}
                                onChange={(e: any) => handleConfigurationChange(&apos;ensembleStrategy&apos;, e.target.value)}
                            >
                                <option value="weighted_average">Weighted Average</option>
                                <option value="majority_voting">Majority Voting</option>
                                <option value="stacked_ensemble">Stacked Ensemble</option>
                                <option value="bayesian_model_averaging">Bayesian Model Averaging</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="prediction-threshold" className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">
                                Prediction Threshold: {systemConfig.predictionThreshold}
                            </label>
                            <input 
                                id="prediction-threshold"
                                type="range" 
                                min="0.5" 
                                max="0.95" 
                                step="0.05" 
                                value={systemConfig.predictionThreshold}
                                onChange={(e: any) => handleConfigurationChange(&apos;predictionThreshold&apos;, parseFloat(e.target.value))}
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">
                                <span>0.5</span>
                                <span className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{systemConfig.predictionThreshold}</span>
                                <span>0.95</span>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="retrain-frequency" className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Auto-Retrain Frequency</label>
                            <select 
                                id="retrain-frequency" 
                                value={systemConfig.retrainFrequency}
                                onChange={(e: any) => handleConfigurationChange(&apos;retrainFrequency&apos;, e.target.value)}
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="manual">Manual Only</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-between py-2 sm:px-4 md:px-6 lg:px-8">
                            <span className="text-gray-300 text-sm sm:text-base">Enable Real-time Learning</span>
                            <input 
                                type="checkbox" 
                                checked={systemConfig.realTimeLearning}
                                onChange={(e: any) => handleConfigurationChange(&apos;realTimeLearning&apos;, e.target.checked)}
                            />
                        </div>
                    </div>
                </Widget>

                <Widget title="System Settings" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <div>
                            <label htmlFor="api-rate-limit" className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">API Rate Limit</label>
                            <input 
                                id="api-rate-limit"
                                type="number" 
                                value={systemConfig.apiRateLimit}
                                onChange={(e: any) => handleConfigurationChange(&apos;apiRateLimit&apos;, parseInt(e.target.value) || 1000)}
                            />
                            <div className="text-xs text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">Requests per hour</div>
                        </div>

                        <div>
                            <label htmlFor="cache-ttl" className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Cache TTL</label>
                            <select 
                                id="cache-ttl" 
                                value={systemConfig.cacheTtl}
                                onChange={(e: any) => handleConfigurationChange(&apos;cacheTtl&apos;, e.target.value)}
                            >
                                <option value="5_minutes">5 minutes</option>
                                <option value="15_minutes">15 minutes</option>
                                <option value="1_hour">1 hour</option>
                                <option value="24_hours">24 hours</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="log-level" className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Log Level</label>
                            <select 
                                id="log-level" 
                                value={systemConfig.logLevel}
                                onChange={(e: any) => handleConfigurationChange(&apos;logLevel&apos;, e.target.value)}
                            >
                                <option value="ERROR">ERROR</option>
                                <option value="WARN">WARN</option>
                                <option value="INFO">INFO</option>
                                <option value="DEBUG">DEBUG</option>
                            </select>
                        </div>

                        <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">Enable Monitoring</span>
                                <input 
                                    type="checkbox" 
                                    checked={systemConfig.enableMonitoring}
                                    onChange={(e: any) => handleConfigurationChange(&apos;enableMonitoring&apos;, e.target.checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">Auto-backup Models</span>
                                <input 
                                    type="checkbox" 
                                    checked={systemConfig.autoBackupModels}
                                    onChange={(e: any) => handleConfigurationChange(&apos;autoBackupModels&apos;, e.target.checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">Alert on Anomalies</span>
                                <input 
                                    type="checkbox" 
                                    checked={systemConfig.alertOnAnomalies}
                                    onChange={(e: any) => handleConfigurationChange(&apos;alertOnAnomalies&apos;, e.target.checked)}
                                />
                            </div>
                        </div>
                    </div>
                </Widget>
            </div>

            <Widget title="Data Sources & APIs" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                        <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">API Connections</h3>
                        <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                            <Target className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            <span>Test All</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {[
}
                            { name: &apos;ESPN Fantasy API&apos;, status: &apos;connected&apos;, latency: &apos;145ms&apos;, lastSync: &apos;2 min ago&apos; },
                            { name: &apos;Yahoo Sports API&apos;, status: &apos;connected&apos;, latency: &apos;203ms&apos;, lastSync: &apos;5 min ago&apos; },
                            { name: &apos;Weather Service&apos;, status: &apos;warning&apos;, latency: &apos;1.2s&apos;, lastSync: &apos;1 hour ago&apos; },
                            { name: &apos;Injury Reports API&apos;, status: &apos;connected&apos;, latency: &apos;89ms&apos;, lastSync: &apos;30 sec ago&apos; }
                        ].map((api: any) => (
                            <div key={api.name} className="p-4 bg-gray-800/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                                    <h4 className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{api.name}</h4>
                                    <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                        <div className={`w-2 h-2 rounded-full ${getAPIStatusClass(api?.status)}`}></div>
                                        <span className={`text-xs ${getAPIStatusTextClass(api?.status)}`}>{api?.status}</span>
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                    <div>Latency: {api.latency}</div>
                                    <div>Last sync: {api.lastSync}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Widget>

            <Widget title="Backup & Recovery" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                        <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">Model Backups</h3>
                        <div className="flex space-x-2 sm:px-4 md:px-6 lg:px-8">
                            <button className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                <Save className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                <span>Create Backup</span>
                            </button>
                            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                <Download className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                <span>Download</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {[
}
                            { name: &apos;Daily Auto-backup&apos;, date: &apos;2025-08-04 03:00&apos;, size: &apos;125 MB&apos;, status: &apos;success&apos; },
                            { name: &apos;Pre-training Checkpoint&apos;, date: &apos;2025-08-03 14:30&apos;, size: &apos;118 MB&apos;, status: &apos;success&apos; },
                            { name: &apos;Weekly Archive&apos;, date: &apos;2025-08-01 00:00&apos;, size: &apos;134 MB&apos;, status: &apos;success&apos; },
                            { name: &apos;Manual Backup&apos;, date: &apos;2025-07-28 16:45&apos;, size: &apos;112 MB&apos;, status: &apos;success&apos; }
                        ].map((backup: any) => (
                            <div key={`${backup.name}-${backup.date}`} className="p-3 bg-gray-800/50 rounded-lg sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center justify-between mb-1 sm:px-4 md:px-6 lg:px-8">
                                    <span className="font-medium text-white sm:px-4 md:px-6 lg:px-8">{backup.name}</span>
                                    <CheckCircle className="w-4 h-4 text-green-400 sm:px-4 md:px-6 lg:px-8" />
                                </div>
                                <div className="space-y-1 text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">
                                    <div>{backup.date}</div>
                                    <div>{backup.size}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Widget>

            {/* Configuration Action Buttons */}
            <Widget title="Configuration Management" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                        <div className="text-white sm:px-4 md:px-6 lg:px-8">
                            <h3 className="font-semibold sm:px-4 md:px-6 lg:px-8">Configuration Status</h3>
                            <p className="text-sm text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">
                                {configurationChanged ? &apos;You have unsaved changes&apos; : &apos;All changes saved&apos;}
                            </p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${configurationChanged ? &apos;bg-yellow-400&apos; : &apos;bg-green-400&apos;}`}></div>
                    </div>
                    
                    <div className="flex space-x-3 sm:px-4 md:px-6 lg:px-8">
                        <button
                            onClick={saveConfiguration}
                            disabled={!configurationChanged || savingConfiguration}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:px-4 md:px-6 lg:px-8"
                         aria-label="Action button">
                            {savingConfiguration ? (
}
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin sm:px-4 md:px-6 lg:px-8"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                    <span>Save Configuration</span>
                                </>
                            )}
                        </button>
                        
                        <button
                            onClick={resetConfiguration}
                            className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors sm:px-4 md:px-6 lg:px-8"
                         aria-label="Action button">
                            <RefreshCw className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            <span>Reset to Defaults</span>
                        </button>

                        <button
                            onClick={() = aria-label="Action button"> {
}
                                if (configurationChanged) {
}
                                    saveConfiguration().then(() => {
}
                                        // Apply configuration immediately after saving
                                    });

                            }}
                            disabled={!configurationChanged}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:px-4 md:px-6 lg:px-8"
                        >
                            <Target className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                            <span>Apply Changes</span>
                        </button>
                    </div>

                    {configurationChanged && (
}
                        <div className="p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                <AlertTriangle className="w-4 h-4 text-yellow-400 sm:px-4 md:px-6 lg:px-8" />
                                <span className="text-yellow-200 text-sm sm:px-4 md:px-6 lg:px-8">
                                    Configuration changes will take effect after saving and applying.
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </Widget>
        </div>
    );

    return (
        <div className="space-y-6 p-4 sm:p-6">
            {/* Mobile-responsive header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <Database className="text-blue-400 w-5 h-5 sm:w-6 sm:h-6" />
                        Training Data Manager
                    </h2>
                    <p className="text-sm sm:text-base text-gray-400">Manage datasets, training sessions, and model performance</p>
                </div>
                
                {/* Mobile-responsive action buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                        onClick={exportTrainingData}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors mobile-touch-target sm:px-4 md:px-6 lg:px-8"
                     aria-label="Action button">
                        <Download className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                        <span>Export Data</span>
                    </button>
                    
                    <button
                        onClick={handleTrainModels}
                        disabled={isTraining}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mobile-touch-target sm:px-4 md:px-6 lg:px-8"
                     aria-label="Action button">
                        {isTraining ? (
}
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin sm:px-4 md:px-6 lg:px-8"></div>
                                <span>Training...</span>
                            </>
                        ) : (
                            <>
                                <Brain className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                <span>Train Models</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
            
            {/* Mobile-responsive tab navigation */}
            <div className="flex space-x-1 bg-gray-800/50 p-1 rounded-lg overflow-x-auto scrollbar-hide sm:px-4 md:px-6 lg:px-8">
                {[
}
                    { id: &apos;overview&apos;, label: &apos;Overview&apos;, icon: BarChart3 },
                    { id: &apos;datasets&apos;, label: &apos;Datasets&apos;, icon: Database },
                    { id: &apos;validation&apos;, label: &apos;Validation&apos;, icon: CheckCircle },
                    { id: &apos;training&apos;, label: &apos;Training&apos;, icon: Brain },
                    { id: &apos;performance&apos;, label: &apos;Performance&apos;, icon: TrendingUp },
                    { id: &apos;config&apos;, label: &apos;Config&apos;, icon: Settings }
                ].map((tab: any) => {
}
                    const IconComponent = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}`}
                        >
                            <IconComponent className="w-4 h-4 flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />
                            <span className="text-sm sm:text-base">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
            
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTab === &apos;overview&apos; && renderOverviewTab()}
                {activeTab === &apos;datasets&apos; && renderDatasetsTab()}
                {activeTab === &apos;validation&apos; && renderValidationTab()}
                {activeTab === &apos;training&apos; && renderTrainingTab()}
                {activeTab === &apos;performance&apos; && renderPerformanceTab()}
                {activeTab === &apos;config&apos; && renderConfigTab()}
            </motion.div>
        </div>
    );
});

TrainingDataManager.displayName = &apos;TrainingDataManager&apos;;

export { TrainingDataManager };

const TrainingDataManagerWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TrainingDataManager {...props} />
  </ErrorBoundary>
);

export default React.memo(TrainingDataManagerWithErrorBoundary);
