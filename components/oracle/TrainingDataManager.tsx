/**
 * Training Data Manager Component
 * Comprehensive interface for managing ML training data, datasets, model training, and performance monitoring
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { 
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
} from 'lucide-react';
import { Widget } from '../ui/Widget';
import oracleEnsembleMLService, { 
    TrainingConfiguration, 
    TrainingProgress, 
    TrainingSession,
    ValidationReport,
    DataValidationRule,
//     EnsembleModel
} from '../../services/oracleEnsembleMachineLearningService';

type TabType = 'overview' | 'datasets' | 'validation' | 'training' | 'performance' | 'config';

interface TrainingMetrics {
    accuracy: number;
    loss: number;
    epoch: number;
    learningRate: number;
    validationAccuracy: number;


const TrainingDataManager = memo(() => {
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [isTraining, setIsTraining] = useState(false);
    const [currentSession, setCurrentSession] = useState<TrainingSession | null>(null);
    const [trainingProgress, setTrainingProgress] = useState<TrainingProgress>({
        currentStep: 0,
        totalSteps: 100,
        currentModel: 'Idle',
        phase: 'preparation',
        percentage: 0,
        message: 'Initializing training session',
        accuracy: 0.85,
        loss: 0.23,
        epoch: 45
    });
    const [trainingConfig, setTrainingConfig] = useState<TrainingConfiguration>({
        algorithm: 'ENSEMBLE',
        modelType: 'ensemble',
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
        totalRecords: 0,
        trainingRecords: 0,
        validationRecords: 0,
        dataQuality: 0,
        featureCount: 0,
        missingValues: 0,
        duplicates: 0
    });
    const [modelMetrics, setModelMetrics] = useState<{
        models: EnsembleModel[];
        overallAccuracy: number;
        lastTraining: string;
    }>({
        models: [],
        overallAccuracy: 0.85,
        lastTraining: new Date().toISOString()
    });
    const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
    const [validationRules, setValidationRules] = useState<DataValidationRule[]>([]);
    const [isValidating, setIsValidating] = useState(false);
    const [systemConfig, setSystemConfig] = useState({
        ensembleStrategy: 'weighted_average',
        predictionThreshold: 0.75,
        retrainFrequency: 'weekly',
        realTimeLearning: true,
        apiRateLimit: 1000,
        cacheTtl: '15_minutes',
        logLevel: 'INFO',
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
        general: string | null;
        training: string | null;
        validation: string | null;
        configuration: string | null;
        connection: string | null;
        dataLoad: string | null;
    }>({
        general: null,
        training: null,
        validation: null,
        configuration: null,
        connection: null,
        dataLoad: null
    });
    
    // Operation retry counts for resilience
    const [retryAttempts, setRetryAttempts] = useState<{
        dataLoad: number;
        training: number;
        validation: number;
        configuration: number;
    }>({
        dataLoad: 0,
        training: 0,
        validation: 0,
        configuration: 0
    });
    
    // Real-time update intervals
    const [updateIntervals, setUpdateIntervals] = useState<NodeJS.Timeout[]>([]);

    // Enhanced error handling utilities
    const setSpecificError = useCallback((category: keyof typeof errors, message: string | null) => {
        setErrors(prev => ({ ...prev, [category]: message }));
        if (message) {

    }, [errors]);

    const clearAllErrors = useCallback(() => {
        setErrors({
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
        setLoadingStates(prev => ({ ...prev, [operation]: loading }));
    }, [loadingStates]);

    const incrementRetryAttempt = useCallback((operation: keyof typeof retryAttempts) => {
        setRetryAttempts(prev => ({ ...prev, [operation]: prev[operation] + 1 }));
    }, [retryAttempts]);

    const resetRetryAttempts = useCallback((operation: keyof typeof retryAttempts) => {
        setRetryAttempts(prev => ({ ...prev, [operation]: 0 }));
    }, [retryAttempts]);

    // Enhanced async operation wrapper with retry logic
    const executeWithRetry = useCallback(async <T,>(
        operation: () => Promise<T>,
        operationType: keyof typeof retryAttempts,
        maxRetries: number = 3,
        retryDelay: number = 1000
    ): Promise<T | null> => {
        const currentAttempts = retryAttempts[operationType];
        
        try {

            const result = await operation();
            resetRetryAttempts(operationType);
            return result;
        
    } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            
            if (currentAttempts < maxRetries) {
                incrementRetryAttempt(operationType);
                
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                return executeWithRetry(operation, operationType, maxRetries, retryDelay * 1.5); // Exponential backoff
            } else {
                setSpecificError(operationType === 'dataLoad' ? 'dataLoad' : 'general', errorMessage);
                resetRetryAttempts(operationType);
                return null;


    }, [retryAttempts, incrementRetryAttempt, resetRetryAttempts, setSpecificError]);

    // Load configuration function (moved up to avoid forward reference)
    const loadConfiguration = useCallback(async () => {
        return await withLoadingState(async () => {
            // FUTURE: Replace with actual service call when configuration API is available
            // const config = await oracleEnsembleMLService.getConfiguration();
            
            // Simulate potential loading failures
            if (Math.random() < 0.05) {
                throw new Error('Configuration service temporarily unavailable');

            const config = {
                ensembleStrategy: 'weighted_average',
                predictionThreshold: 0.75,
                retrainFrequency: 'weekly',
                realTimeLearning: true,
                apiRateLimit: 1000,
                cacheTtl: '15_minutes',
                logLevel: 'INFO',
                enableMonitoring: true,
                autoBackupModels: true,
                alertOnAnomalies: true
            };
            
            setSystemConfig(config);
            setConfigurationChanged(false);
            return config;
        }, 'configuration', 'configuration');
    }, []);

    // Enhanced loading state management
    const withLoadingState = useCallback(async <T,>(
        operation: () => Promise<T>,
        loadingType: keyof typeof loadingStates,
        errorCategory?: keyof typeof errors
    ): Promise<T | null> => {
        try {

            setSpecificLoading(loadingType, true);
            if (errorCategory) {
                setSpecificError(errorCategory, null);

            const result = await operation();
            return result;
    
    } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Operation failed';
            
            if (errorCategory) {
                setSpecificError(errorCategory, errorMessage);
            } else {
                setError(errorMessage);

            return null;
        } finally {
            setSpecificLoading(loadingType, false);

    }, [setSpecificLoading, setSpecificError]);

    // Connection health monitoring
    const checkConnectionHealth = useCallback(async (): Promise<boolean> => {
        try {

            // Test connection with a lightweight operation
            const testResult = await Promise.race([
                Promise.resolve(oracleEnsembleMLService.getCurrentModelMetrics()),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 5000))
            ]);
            
            if (testResult) {
                setRealtimeConnected(true);
                setSpecificError('connection', null);
                return true;

            return false;

    } catch (error) {
            setRealtimeConnected(false);
            setSpecificError('connection', 'Connection lost - attempting to reconnect...');
            return false;

    }, [setSpecificError]);

    // Load initial data
    useEffect(() => {
        loadInitialData();
        const interval = setInterval(loadTrainingStatus, 1000);
        setUpdateIntervals(prev => [...prev, interval]);
        
        return () => {
            // Cleanup all intervals
            updateIntervals.forEach(clearInterval);
            clearInterval(interval);
        };
    }, []); // Remove dependencies to avoid forward reference issues

    // Initialize real-time monitoring
    const initializeRealtimeMonitoring = useCallback(async () => {
        try {
            // Set up periodic data refresh for live metrics
            const metricsInterval = setInterval(async () => {
                if (!isTraining) return;
                
                try {

                    const metrics = oracleEnsembleMLService.getCurrentModelMetrics();
                    setModelMetrics(metrics);
                    
                    const stats = await oracleEnsembleMLService.getDatasetStatistics();
                    setDatasetStats(stats);

    } catch (error) {

            }, 5000); // Refresh every 5 seconds
            
            // Set up training session monitoring
            const sessionInterval = setInterval(() => {
                loadTrainingStatus();
            }, 1000); // Check training status every second
            
            setUpdateIntervals(prev => [...prev, metricsInterval, sessionInterval]);
    
    } catch (error) {
            throw error;

    }, [isTraining]);

    // Enhanced data refresh for specific widgets
    const refreshDataSources = useCallback(async () => {
        return await withLoadingState(async () => {
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
            
            if (stats?.status === 'fulfilled') {
                setDatasetStats(stats.value);
            } else {
                setSpecificError('dataLoad', 'Failed to load dataset statistics');
                hasErrors = true;

            if (metrics?.status === 'fulfilled') {
                setModelMetrics(metrics.value);
            } else {
                setSpecificError('general', 'Failed to load model metrics');
                hasErrors = true;

            if (history?.status === 'fulfilled') {
                setTrainingHistory(history.value);
            } else {

            if (report?.status === 'fulfilled') {
                setValidationReport(report.value);
            } else {

            if (hasErrors) {
                throw new Error('Some data sources failed to refresh');

            return true;
        }, 'datasetStats', 'dataLoad');
    }, [withLoadingState, clearAllErrors, setSpecificError]);

    const loadInitialData = useCallback(async () => {
        return await executeWithRetry(async () => {
            setIsLoading(true);
            setSpecificLoading('initialLoad', true);
            clearAllErrors();
            
            // Initialize real-time monitoring with error handling
            try {

                await initializeRealtimeMonitoring();
            
    } catch (error) {
                setSpecificError('connection', 'Real-time features limited - some data may not auto-refresh');

            // Load dataset statistics with enhanced error handling
            await withLoadingState(async () => {
                const stats = await oracleEnsembleMLService.getDatasetStatistics();
                setDatasetStats(stats);
                return stats;
            }, 'datasetStats', 'dataLoad');

            // Load model metrics with fallback
            try {

                setSpecificLoading('modelMetrics', true);
                const metrics = oracleEnsembleMLService.getCurrentModelMetrics();
                setModelMetrics(metrics);
            
    } catch (error) {
                setSpecificError('general', 'Model metrics temporarily unavailable');
            } finally {
                setSpecificLoading('modelMetrics', false);

            // Load training history (non-critical)
            try {

                const history = oracleEnsembleMLService.getTrainingHistory();
                setTrainingHistory(history);
            
    } catch (error) {
                // Don't set error for non-critical data

            // Load validation rules (non-critical)
            try {

                const rules = oracleEnsembleMLService.getValidationRules();
                setValidationRules(rules);
            
    } catch (error) {

            // Load system configuration with enhanced handling
            await withLoadingState(async () => {
                await loadConfiguration();
                return true;
            }, 'configuration', 'configuration');

            // Load last validation report (non-critical)
            try {

                const lastReport = oracleEnsembleMLService.getLastValidationReport();
                setValidationReport(lastReport);
            
    } catch (error) {

            // Test connection health
            const connectionHealthy = await checkConnectionHealth();
            if (connectionHealthy) {
                setRealtimeConnected(true);
            } else {
                setSpecificError('connection', 'Connection unstable - some features may be limited');

            return true;
        }, 'dataLoad', 3, 2000).finally(() => {
            setIsLoading(false);
            setSpecificLoading('initialLoad', false);
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
        return await withLoadingState(async () => {
            // Check for active training sessions with timeout
            const activeSessions = await Promise.race([
                Promise.resolve(oracleEnsembleMLService.getActiveTrainingSessions()),
                new Promise<TrainingSession[]>((_, reject) => 
                    setTimeout(() => reject(new Error('Training status check timeout')), 3000)
                )
            ]);
            
            if (Array.isArray(activeSessions) && activeSessions.length > 0) {
                const session = activeSessions[0];
                setCurrentSession(session);
                setIsTraining(session?.status === 'running');
                setTrainingProgress(session.progress);
                
                // Auto-refresh model metrics during training with error handling
                if (session?.status === 'running') {
                    try {

                        const metrics = oracleEnsembleMLService.getCurrentModelMetrics();
                        setModelMetrics(metrics);

    } catch (error) {
                        // Don't fail the entire operation for metrics refresh


            } else if (isTraining) {
                setIsTraining(false);
                setCurrentSession(null);
                // Reload data after training completion with error handling
                try {

                    await refreshDataSources();

    } catch (error) {
                    setSpecificError('dataLoad', 'Failed to refresh data after training completion');


            return true;
        }, 'realtimeUpdate', 'general');
    }, [isTraining, refreshDataSources, withLoadingState, setSpecificError]);

    const handleTrainModels = useCallback(async () => {
        return await withLoadingState(async () => {
            setIsTraining(true);
            clearAllErrors();
            
            // Validate training prerequisites
            if (!realtimeConnected) {
                throw new Error('Cannot start training: Connection to ML service is not available');

            if (datasetStats.totalRecords === 0) {
                throw new Error('Cannot start training: No training data available');

            if (!trainingConfig.maxEpochs || trainingConfig.maxEpochs <= 0 || !trainingConfig.batchSize || trainingConfig.batchSize <= 0) {
                throw new Error('Cannot start training: Invalid training configuration');

            // Get real training data from service with retry
            const trainingData = await executeWithRetry(async () => {
                return await oracleEnsembleMLService.getStoredTrainingData();
            }, 'training', 2, 1000);
            
            if (!trainingData) {
                throw new Error('Failed to retrieve training data after multiple attempts');

            // Start training session with current configuration
            const sessionId = await oracleEnsembleMLService.startTrainingSession(
                trainingData,
                trainingConfig,
                `Training Session ${new Date().toLocaleString()}`,
                (progress: TrainingProgress) => {
                    setTrainingProgress(progress);

            );

            // Trigger immediate data refresh
            try {

                await refreshDataSources();
            
    } catch (error) {
                // Don't fail training start for this

            resetRetryAttempts('training');
            return sessionId;
        }, 'trainingData', 'training').catch((error: any) => {
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
        return await withLoadingState(async () => {
            if (!currentSession) {
                throw new Error('No active training session to stop');

            // Attempt to cancel training session
            try {

                oracleEnsembleMLService.cancelTrainingSession(currentSession.id);
            
    } catch (error) {
                // Force stop the training state even if cancellation fails

            setIsTraining(false);
            setCurrentSession(null);
            clearAllErrors();
            
            // Refresh data after stopping training
            try {

                await refreshDataSources();
            
    } catch (error) {
        console.error(error);
    `oracle_training_data_${new Date().toISOString().split('T')[0]}.json`;
                a.click();
                URL.revokeObjectURL(url);
                
                return true;

    } catch (error) {
                throw new Error('Failed to create or download export file');

        }, 'export', 'general');
    };

    // Update configuration handlers with enhanced error handling
    const updateTrainingConfig = useCallback((updates: Partial<TrainingConfiguration>) => {
        try {

            // Validate configuration updates
            if (updates.maxEpochs !== undefined && updates.maxEpochs <= 0) {
                throw new Error('Max epochs must be greater than 0');

            if (updates.batchSize !== undefined && updates.batchSize <= 0) {
                throw new Error('Batch size must be greater than 0');

            if (updates.hyperparameters?.learningRate !== undefined && (updates.hyperparameters.learningRate <= 0 || updates.hyperparameters.learningRate >= 1)) {
                throw new Error('Learning rate must be between 0 and 1');

            if (updates.trainingSplit !== undefined && (updates.trainingSplit <= 0 || updates.trainingSplit >= 1)) {
                throw new Error('Training split must be between 0 and 1');

            if (updates.validationSplit !== undefined && (updates.validationSplit <= 0 || updates.validationSplit >= 1)) {
                throw new Error('Validation split must be between 0 and 1');

            setTrainingConfig(prev => ({ ...prev, ...updates }));
            clearAllErrors();

    } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Invalid configuration update';
            setSpecificError('configuration', errorMessage);

    }, [clearAllErrors, setSpecificError]);

    // Memoized computed values for performance optimization
    const trainingProgressPercentage = useMemo(() => {
        return Math.round((trainingProgress.currentStep / trainingProgress.totalSteps) * 100);
    }, [trainingProgress.currentStep, trainingProgress.totalSteps]);

    const trainingSplitPercentages = useMemo(() => ({
        training: Math.round((trainingConfig.trainingSplit || 0.8) * 100),
        validation: Math.round((trainingConfig.validationSplit || 0.2) * 100)
    }), [trainingConfig.trainingSplit, trainingConfig.validationSplit]);

    const formattedTrainingMetrics = useMemo(() => ({
        accuracy: (trainingProgress.accuracy || 0).toFixed(3),
        loss: (trainingProgress.loss || 0).toFixed(3),
        overallAccuracy: modelMetrics.overallAccuracy.toFixed(3)
    }), [trainingProgress.accuracy, trainingProgress.loss, modelMetrics.overallAccuracy]);

    const recentTrainingSessions = useMemo(() => {
        return trainingHistory.slice(0, 4);
    }, [trainingHistory]);

    // Enhanced event handlers for better performance
    const handleErrorDismiss = useCallback((errorType?: keyof typeof errors) => {
        if (errorType) {
            setSpecificError(errorType, null);
        } else {
            clearAllErrors();

    }, [setSpecificError, clearAllErrors]);

    // Enhanced validation handlers
    const handleValidateData = useCallback(async () => {
        return await executeWithRetry(async () => {
            setSpecificError('validation', null);
            
            // Validate prerequisites
            if (!realtimeConnected) {
                throw new Error('Cannot validate data: Connection to ML service is not available');

            if (datasetStats.totalRecords === 0) {
                throw new Error('Cannot validate data: No dataset available for validation');

            // Get real training data and run validation
            const trainingData = await oracleEnsembleMLService.getStoredTrainingData();
            
            if (!trainingData || (Array.isArray(trainingData) && trainingData.length === 0)) {
                throw new Error('No training data available for validation');

            const report = await oracleEnsembleMLService.validateDataset(trainingData);
            
            if (!report) {
                throw new Error('Validation completed but no report was generated');

            setValidationReport(report);
            
            // Refresh related data with error handling
            try {

                const rules = oracleEnsembleMLService.getValidationRules();
                setValidationRules(rules);
            
    } catch (error) {
                // Don't fail the entire validation for this

            resetRetryAttempts('validation');
            return report;
        }, 'validation', 3, 1500);
    }, [
        executeWithRetry, 
        setSpecificError, 
        realtimeConnected, 
        datasetStats.totalRecords, 
//         resetRetryAttempts
    ]);

    // Helper functions for styling
    const getSessionStatusClass = (status: string): string => {
        switch (status) {
            case 'completed':
                return 'bg-green-600 text-green-100';
            case 'running':
                return 'bg-blue-600 text-blue-100';
            case 'failed':
                return 'bg-red-600 text-red-100';
            default:
                return 'bg-gray-600 text-gray-100';

    };

    const getQualityScoreClass = (score: number): string => {
        if (score >= 90) return 'text-green-400';
        if (score >= 75) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getDatasetQualityClass = (quality: number): string => {
        if (quality >= 95) return 'bg-green-600 text-green-100';
        if (quality >= 90) return 'bg-yellow-600 text-yellow-100';
        return 'bg-red-600 text-red-100';
    };

    const getValidationResultClass = (passed: boolean, severity?: string): string => {
        if (passed) return 'bg-green-600 text-green-100';
        return severity === 'error' ? 'bg-red-600 text-red-100' : 'bg-yellow-600 text-yellow-100';
    };

    const getValidationResultText = (passed: boolean, severity?: string): string => {
        if (passed) return 'Pass';
        return severity === 'error' ? 'Error' : 'Warning';
    };

    const getTestStatusClass = (status: string): string => {
        switch (status) {
            case 'active':
                return 'bg-blue-500/20 text-blue-400';
            case 'completed':
                return 'bg-green-500/20 text-green-400';
            case 'paused':
                return 'bg-yellow-500/20 text-yellow-400';
            default:
                return 'bg-gray-500/20 text-gray-400';

    };

    const getModelStatusClass = (isActive: boolean, type?: string): string => {
        if (isActive && type === 'STACKED_ENSEMBLE') return 'bg-green-600 text-green-100';
        return isActive ? 'bg-blue-600 text-blue-100' : 'bg-gray-600 text-gray-100';
    };

    const getModelStatusText = (isActive: boolean, type?: string): string => {
        if (isActive && type === 'STACKED_ENSEMBLE') return 'Active Ensemble';
        return isActive ? 'Active' : 'Inactive';
    };

    // Helper function to get loading state message
    const getLoadingStateMessage = useCallback(() => {
        if (loadingStates.trainingData) return 'Processing training data...';
        if (loadingStates.validation) return 'Running validation...';
        return 'Refreshing data...';
    }, [loadingStates]);

    // Helper function to get button text based on connection
    const getConnectionDependentText = useCallback((connectedText: string, disconnectedText: string = 'Connection Required') => {
        return realtimeConnected ? connectedText : disconnectedText;
    }, [realtimeConnected]);

    // Enhanced configuration management functions
    const handleConfigurationChange = useCallback((field: string, value: any) => {
        try {

            // Validate specific configuration fields
            if (field === 'predictionThreshold' && (value < 0 || value > 1)) {
                throw new Error('Prediction threshold must be between 0 and 1');

            if (field === 'apiRateLimit' && value <= 0) {
                throw new Error('API rate limit must be greater than 0');

            setSystemConfig(prev => ({ ...prev, [field]: value }));
            setConfigurationChanged(true);
            setSpecificError('configuration', null);

    } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Invalid configuration value';
            setSpecificError('configuration', errorMessage);

    }, [setSpecificError]);

    const saveConfiguration = useCallback(async () => {
        return await withLoadingState(async () => {
            if (!configurationChanged) {
                throw new Error('No configuration changes to save');

            // Validate entire configuration before saving
            if (systemConfig.predictionThreshold < 0 || systemConfig.predictionThreshold > 1) {
                throw new Error('Invalid prediction threshold value');

            if (systemConfig.apiRateLimit <= 0) {
                throw new Error('Invalid API rate limit value');

            // FUTURE: Implement actual service call when configuration API is available
            // const success = await oracleEnsembleMLService.updateConfiguration(systemConfig);
            
            // Simulate API call delay for now with potential failure
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Simulate occasional failures for testing
            if (Math.random() < 0.1) {
                throw new Error('Configuration service temporarily unavailable');

            const success = true; 
            
            if (success) {
                setConfigurationChanged(false);
                
                // Refresh data to reflect configuration changes
                try {

                    await refreshDataSources();
                return true;
            
    `px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                                isTraining ? 'bg-blue-600 text-blue-100' : 'bg-green-600 text-green-100'
                            }`}>
                                {isTraining ? 'Training' : 'Ready'}
                            </span>
                        </div>
                        
                        {/* Real-time Connection Status with Enhanced Mobile Details */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <span className="text-gray-300 text-sm sm:text-base">Connection</span>
                            <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                <div className={`w-2 h-2 rounded-full ${getAPIStatusClass(realtimeConnected ? 'connected' : 'error')}`}></div>
                                <span className={`text-xs sm:text-sm ${getAPIStatusTextClass(realtimeConnected ? 'connected' : 'error')}`}>
                                    {realtimeConnected ? 'Connected' : 'Disconnected'}
                                </span>
                                {errors.connection && (
                                    <AlertTriangle className="w-3 h-3 text-yellow-400 sm:px-4 md:px-6 lg:px-8" />
                                )}
                            </div>
                        </div>
                        
                        {/* Enhanced Data Loading Indicators */}
                        {(dataLoading || Object.values(loadingStates).some((loading: any) => loading)) && (
                            <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center space-x-2 sm:px-4 md:px-6 lg:px-8">
                                    <RefreshCw className="w-4 h-4 text-blue-400 animate-spin sm:px-4 md:px-6 lg:px-8" />
                                    <span className="text-blue-300 text-sm sm:px-4 md:px-6 lg:px-8">
                                        {loadingStates.export ? 'Exporting data...' : getLoadingStateMessage()}
                                    </span>
                                </div>
                                {retryAttempts.dataLoad > 0 && (
                                    <div className="text-xs text-yellow-300 sm:px-4 md:px-6 lg:px-8">
                                        Retry attempt {retryAttempts.dataLoad}/3
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Training Progress with Error Handling */}
                        {isTraining && (
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
                            <div key={session.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-800/50 rounded-lg gap-3 sm:gap-0 min-h-[80px] sm:min-h-[60px]">
                                <div className="flex-1 min-w-0 sm:px-4 md:px-6 lg:px-8">
                                    <div className="font-medium text-white text-sm sm:text-base truncate">{session.name}</div>
                                    <div className="text-xs sm:text-sm text-gray-400">{new Date(session.startTime).toLocaleDateString()}</div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end space-x-3 flex-shrink-0">
                                    {Boolean(session.metrics.finalAccuracy) && (
                                        <span className="text-green-400 font-semibold text-sm sm:px-4 md:px-6 lg:px-8">{session.metrics.finalAccuracy.toFixed(3)}</span>
                                    )}
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        getSessionStatusClass(session?.status)
                                    }`}>
                                        {session?.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {recentTrainingSessions.length === 0 && (
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
                                <div className="bg-red-500 h-2 sm:h-3 rounded-full transition-all duration-300" style={{ width: '73%' }}></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm mb-2 gap-1">
                                <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">Memory Usage</span>
                                <span className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">45%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
                                <div className="bg-yellow-500 h-2 sm:h-3 rounded-full transition-all duration-300" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm mb-2 gap-1">
                                <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">CPU Usage</span>
                                <span className="text-white font-semibold sm:px-4 md:px-6 lg:px-8">28%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
                                <div className="bg-green-500 h-2 sm:h-3 rounded-full transition-all duration-300" style={{ width: '28%' }}></div>
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
                            { name: 'Fantasy API', status: 'active', records: '1.2M', lastUpdate: '2 min ago' },
                            { name: 'Historical Stats', status: 'active', records: '890K', lastUpdate: '5 min ago' },
                            { name: 'Weather Data', status: 'warning', records: '145K', lastUpdate: '1 hour ago' },
                            { name: 'Injury Reports', status: 'active', records: '23K', lastUpdate: '30 sec ago' }
                        ].map((source: any) => (
                            <div key={source.name} className="flex items-center justify-between p-3 sm:p-4 bg-gray-800/50 rounded-lg min-h-[60px]">
                                <div className="flex-1 min-w-0 sm:px-4 md:px-6 lg:px-8">
                                    <div className="font-medium text-white text-sm sm:text-base truncate">{source.name}</div>
                                    <div className="text-xs sm:text-sm text-gray-400">{source.records} records</div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-3 sm:px-4 md:px-6 lg:px-8">
                                    <div className="flex items-center justify-end mb-1 sm:px-4 md:px-6 lg:px-8">
                                        <div className={`w-2 h-2 rounded-full ${
                                            source?.status === 'active' ? 'bg-green-400' : 'bg-yellow-400'
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
                                    {isValidating ? 'Validating...' : 'Run Validation'}
                                </button>
                            </div>
                        )}
                    </div>
                </Widget>

                <Widget title="Dataset Actions" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        {/* Error display for dataset actions */}
                        {errors.dataLoad && (
                            <div className="bg-red-900/50 border border-red-500 rounded p-2 mb-3 sm:px-4 md:px-6 lg:px-8">
                                <div className="text-red-300 text-sm sm:px-4 md:px-6 lg:px-8">{errors.dataLoad}</div>
                                <button 
                                    onClick={() => handleErrorDismiss('dataLoad')}
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
                            <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loadingStates.datasetStats ? 'animate-spin' : ''}`} />
                            <span className="truncate sm:px-4 md:px-6 lg:px-8">
                                {loadingStates.datasetStats ? 'Refreshing...' : getConnectionDependentText('Refresh Data')}
                            </span>
                        </button>
                        
                        <button 
                            onClick={handleValidateData}
                            disabled={loadingStates.validation || loadingStates.datasetStats || !realtimeConnected}
                            className="w-full flex items-center justify-center space-x-2 p-3 sm:p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm sm:text-base min-h-[48px] touch-target"
                         aria-label="Action button">
                            <Target className={`w-4 h-4 sm:w-5 sm:h-5 ${loadingStates.validation ? 'animate-spin' : ''}`} />
                            <span className="truncate sm:px-4 md:px-6 lg:px-8">
                                {loadingStates.validation ? 'Validating...' : getConnectionDependentText('Validate Quality')}
                            </span>
                        </button>
                        
                        <button 
                            onClick={exportTrainingData}
                            disabled={loadingStates.export || !realtimeConnected}
                            className="w-full flex items-center justify-center space-x-2 p-3 sm:p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 text-sm sm:text-base min-h-[48px] touch-target"
                         aria-label="Action button">
                            <Download className={`w-4 h-4 sm:w-5 sm:h-5 ${loadingStates.export ? 'animate-spin' : ''}`} />
                            <span className="truncate sm:px-4 md:px-6 lg:px-8">
                                {loadingStates.export ? 'Exporting...' : getConnectionDependentText('Export Dataset')}
                            </span>
                        </button>
                        
                        {/* Retry attempts indicator */}
                        {(retryAttempts.dataLoad > 0 || retryAttempts.validation > 0) && (
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
                            { name: 'Player Statistics 2024', size: '245 MB', records: '1.2M', format: 'CSV', lastModified: '2 hours ago', quality: 96.8 },
                            { name: 'Historical Matchups', size: '156 MB', records: '890K', format: 'JSON', lastModified: '5 hours ago', quality: 94.2 },
                            { name: 'Weather Conditions', size: '89 MB', records: '145K', format: 'CSV', lastModified: '1 day ago', quality: 87.5 },
                            { name: 'Injury Reports', size: '12 MB', records: '23K', format: 'JSON', lastModified: '3 hours ago', quality: 98.1 },
                            { name: 'Team Analytics', size: '198 MB', records: '567K', format: 'Parquet', lastModified: '6 hours ago', quality: 95.7 },
                            { name: 'Draft Results', size: '34 MB', records: '78K', format: 'CSV', lastModified: '12 hours ago', quality: 93.4 }
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
                                        validationReport.passed ? 'bg-green-600 text-green-100' : 'bg-red-600 text-red-100'
                                    }`}>
                                        {validationReport.passed ? 'Passed' : 'Failed'}
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
                                    {isValidating ? 'Validating...' : 'Run Validation'}
                                </button>
                            </div>
                        )}
                    </div>
                </Widget>

                <Widget title="Quality Dimensions" className="bg-gray-900/50 sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        {validationReport ? (
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
                            <span>{isValidating ? 'Running Validation...' : 'Run Full Validation'}</span>
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
                                onChange={(e: any) => updateTrainingConfig({ modelType: e.target.value as TrainingConfiguration['modelType'] }}
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
                                    hyperparameters: {
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
                                isTraining ? 'bg-blue-600 text-blue-100' : 'bg-green-600 text-green-100'
                            }`}>
                                {isTraining ? 'Training' : 'Idle'}
                            </span>
                        </div>

                        {isTraining && (
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
                            <button 
                                onClick={handleTrainModels}
                                className="w-full flex items-center justify-center space-x-2 p-3 sm:p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 min-h-[48px] touch-target text-sm sm:text-base font-medium"
                             aria-label="Action button">
                                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>Start Training</span>
                            </button>
                        )}

                        {isTraining && (
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
                                                `${Math.round(session.metrics.trainingDuration / 60000)}m` : 
                                                'N/A'

                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Accuracy</div>
                                        <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">
                                            {session.metrics.finalAccuracy?.toFixed(3) || 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Loss</div>
                                        <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">
                                            {session.metrics.finalLoss?.toFixed(3) || 'N/A'}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Epochs</div>
                                        <div className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{session.metrics.epochs || 'N/A'}</div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 mt-2 sm:px-4 md:px-6 lg:px-8">
                                    {new Date(session.startTime).toLocaleString()}
                                </div>
                            </div>
                        ))}
                        {trainingHistory.length === 0 && (
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
                                <div className="bg-green-500 h-2 sm:h-3 rounded-full transition-all duration-300" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between text-xs sm:text-sm mb-2">
                                <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">30-Day Trend</span>
                                <span className="text-green-400 font-medium sm:px-4 md:px-6 lg:px-8">+5.7%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
                                <div className="bg-blue-500 h-2 sm:h-3 rounded-full transition-all duration-300" style={{ width: '78%' }}></div>
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between text-xs sm:text-sm mb-2">
                                <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Model Stability</span>
                                <span className="text-white sm:px-4 md:px-6 lg:px-8">High</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                <div className="bg-purple-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: '92%' }}></div>
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
                                { category: 'Quarterback', accuracy: 92.4, predictions: 1245 },
                                { category: 'Running Back', accuracy: 88.7, predictions: 2156 },
                                { category: 'Wide Receiver', accuracy: 85.3, predictions: 3421 },
                                { category: 'Tight End', accuracy: 89.1, predictions: 876 },
                                { category: 'Kicker', accuracy: 94.8, predictions: 543 },
                                { category: 'Defense', accuracy: 87.2, predictions: 987 }
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
                                    <div className="bg-green-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: '98.7%' }}></div>
                                </div>
                            </div>
                            
                            <div>
                                <div className="flex justify-between text-sm mb-1 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Error Rate</span>
                                    <span className="text-white sm:px-4 md:px-6 lg:px-8">1.3%</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                    <div className="bg-red-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: '1.3%' }}></div>
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
                                {
                                    id: 'test-1',
                                    name: 'Enhanced Ensemble vs Standard',
                                    status: 'active',
                                    modelA: 'Standard Model v2.1',
                                    modelB: 'Enhanced Ensemble v3.0',
                                    improvement: '+2.3%',
                                    significance: 0.023,
                                    progress: 67,
                                    sampleSize: 1547
                                },
                                {
                                    id: 'test-2',
                                    name: 'Real-time vs Batch Prediction',
                                    status: 'active',
                                    modelA: 'Batch Predictor v1.5',
                                    modelB: 'Real-time Engine v2.0',
                                    improvement: '+1.8%',
                                    significance: 0.045,
                                    progress: 89,
                                    sampleSize: 2103
                                },
                                {
                                    id: 'test-3',
                                    name: 'Feature Selection Optimization',
                                    status: 'completed',
                                    modelA: 'Full Features v1.0',
                                    modelB: 'Optimized Features v1.0',
                                    improvement: '+4.1%',
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
                                                test.improvement.startsWith('+') ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                                {test.improvement}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Significance</div>
                                            <div className={`font-medium ${
                                                test.significance < 0.05 ? 'text-green-400' : 'text-yellow-400'
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
                                                    test?.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                                                }`}
                                                style={{ width: `${test.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {test?.status === 'active' && (
                                        <div className="flex justify-end space-x-2 mt-3 sm:px-4 md:px-6 lg:px-8">
                                            <button className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500 transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
//                                                 Pause
                                            </button>
                                            <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
//                                                 Details
                                            </button>
                                        </div>
                                    )}

                                    {test?.status === 'completed' && (
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
                                <div className="bg-green-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: '85%' }}></div>
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
                                    <div className="bg-green-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: '94%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Performance Consistency</span>
                                    <span className="text-white sm:px-4 md:px-6 lg:px-8">0.89 (Good)</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                    <div className="bg-blue-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: '89%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-1 sm:px-4 md:px-6 lg:px-8">
                                    <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Drift Detection Score</span>
                                    <span className="text-white sm:px-4 md:px-6 lg:px-8">0.12 (Low Risk)</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2 sm:px-4 md:px-6 lg:px-8">
                                    <div className="bg-green-500 h-2 rounded-full sm:px-4 md:px-6 lg:px-8" style={{ width: '88%' }}></div>
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
                                onChange={(e: any) => handleConfigurationChange('ensembleStrategy', e.target.value)}
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
                                onChange={(e: any) => handleConfigurationChange('predictionThreshold', parseFloat(e.target.value))}
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
                                onChange={(e: any) => handleConfigurationChange('retrainFrequency', e.target.value)}
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
                                onChange={(e: any) => handleConfigurationChange('realTimeLearning', e.target.checked)}
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
                                onChange={(e: any) => handleConfigurationChange('apiRateLimit', parseInt(e.target.value) || 1000)}
                            />
                            <div className="text-xs text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">Requests per hour</div>
                        </div>

                        <div>
                            <label htmlFor="cache-ttl" className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Cache TTL</label>
                            <select 
                                id="cache-ttl" 
                                value={systemConfig.cacheTtl}
                                onChange={(e: any) => handleConfigurationChange('cacheTtl', e.target.value)}
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
                                onChange={(e: any) => handleConfigurationChange('logLevel', e.target.value)}
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
                                    onChange={(e: any) => handleConfigurationChange('enableMonitoring', e.target.checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">Auto-backup Models</span>
                                <input 
                                    type="checkbox" 
                                    checked={systemConfig.autoBackupModels}
                                    onChange={(e: any) => handleConfigurationChange('autoBackupModels', e.target.checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                <span className="text-gray-300 sm:px-4 md:px-6 lg:px-8">Alert on Anomalies</span>
                                <input 
                                    type="checkbox" 
                                    checked={systemConfig.alertOnAnomalies}
                                    onChange={(e: any) => handleConfigurationChange('alertOnAnomalies', e.target.checked)}
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
                            { name: 'ESPN Fantasy API', status: 'connected', latency: '145ms', lastSync: '2 min ago' },
                            { name: 'Yahoo Sports API', status: 'connected', latency: '203ms', lastSync: '5 min ago' },
                            { name: 'Weather Service', status: 'warning', latency: '1.2s', lastSync: '1 hour ago' },
                            { name: 'Injury Reports API', status: 'connected', latency: '89ms', lastSync: '30 sec ago' }
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
                            { name: 'Daily Auto-backup', date: '2025-08-04 03:00', size: '125 MB', status: 'success' },
                            { name: 'Pre-training Checkpoint', date: '2025-08-03 14:30', size: '118 MB', status: 'success' },
                            { name: 'Weekly Archive', date: '2025-08-01 00:00', size: '134 MB', status: 'success' },
                            { name: 'Manual Backup', date: '2025-07-28 16:45', size: '112 MB', status: 'success' }
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
                                {configurationChanged ? 'You have unsaved changes' : 'All changes saved'}
                            </p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${configurationChanged ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
                    </div>
                    
                    <div className="flex space-x-3 sm:px-4 md:px-6 lg:px-8">
                        <button
                            onClick={saveConfiguration}
                            disabled={!configurationChanged || savingConfiguration}
                            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:px-4 md:px-6 lg:px-8"
                         aria-label="Action button">
                            {savingConfiguration ? (
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
                                if (configurationChanged) {
                                    saveConfiguration().then(() => {
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
                    { id: 'overview', label: 'Overview', icon: BarChart3 },
                    { id: 'datasets', label: 'Datasets', icon: Database },
                    { id: 'validation', label: 'Validation', icon: CheckCircle },
                    { id: 'training', label: 'Training', icon: Brain },
                    { id: 'performance', label: 'Performance', icon: TrendingUp },
                    { id: 'config', label: 'Config', icon: Settings }
                ].map((tab: any) => {
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
                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'datasets' && renderDatasetsTab()}
                {activeTab === 'validation' && renderValidationTab()}
                {activeTab === 'training' && renderTrainingTab()}
                {activeTab === 'performance' && renderPerformanceTab()}
                {activeTab === 'config' && renderConfigTab()}
            </motion.div>
        </div>
    );
});

TrainingDataManager.displayName = 'TrainingDataManager';

export { TrainingDataManager };

const TrainingDataManagerWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TrainingDataManager {...props} />
  </ErrorBoundary>
);

export default React.memo(TrainingDataManagerWithErrorBoundary);
