/**
 * League Creation Wizard Component
 * Step-by-step league setup process for fantasy football leagues
 * Implements T2.1 League Management System requirements
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { ChevronLeftIcon } from &apos;../icons/ChevronLeftIcon&apos;;
import { ChevronRightIcon } from &apos;../icons/ChevronRightIcon&apos;;
import { CheckIcon } from &apos;../icons/CheckIcon&apos;;

interface WizardSettings {
}
    // Basic Info
    name: string;
    teamCount: number;
    commissionerId: string;
    isPublic: boolean;
    description: string;
    
    // Scoring Settings
    scoringType: &apos;standard&apos; | &apos;ppr&apos; | &apos;half_ppr&apos; | &apos;custom&apos;;
    
    // Draft Settings
    draftType: &apos;snake&apos; | &apos;auction&apos;;
    draftDate: string;
    draftTime: string;

}

interface LeagueCreationStep {
}
    id: string;
    title: string;
    description: string;
    component: React.ComponentType<StepProps>;
    validation: (data: WizardSettings) => string | null;

interface StepProps {
}
    settings: WizardSettings;
    updateSettings: (updates: Partial<WizardSettings>) => void;
    errors: Record<string, string>;

// Step 1: Basic Information
}

const BasicInfoStep: React.FC<StepProps> = ({ settings, updateSettings, errors }: any) => {
}
    return (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                    League Name *
                </label>
                <input
                    type="text"
                    value={settings.name}
                    onChange={(e: any) => updateSettings({ name: e.target.value }}
                    className="w-full px-3 py-2 border border-[var(--panel-border)] rounded-lg bg-[var(--panel-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:px-4 md:px-6 lg:px-8"
                    placeholder="Enter your league name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 sm:px-4 md:px-6 lg:px-8">{errors.name}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                    Number of Teams *
                </label>
                <select
                    value={settings.teamCount}
                    onChange={(e: any) => updateSettings({ teamCount: parseInt(e.target.value) }}
                    className="w-full px-3 py-2 border border-[var(--panel-border)] rounded-lg bg-[var(--panel-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:px-4 md:px-6 lg:px-8"
                >
                    {[8, 10, 12, 14, 16].map((count: any) => (
}
                        <option key={count} value={count}>{count} Teams</option>
                    ))}
                </select>
                {errors.teamCount && <p className="text-red-500 text-sm mt-1 sm:px-4 md:px-6 lg:px-8">{errors.teamCount}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                    League Description
                </label>
                <textarea
                    value={settings.description}
                    onChange={(e: any) => updateSettings({ description: e.target.value }}
                    rows={3}
                    className="w-full px-3 py-2 border border-[var(--panel-border)] rounded-lg bg-[var(--panel-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:px-4 md:px-6 lg:px-8"
                    placeholder="Optional description for your league"
                />
            </div>

            <div className="flex items-center sm:px-4 md:px-6 lg:px-8">
                <input
                    type="checkbox"
                    id="isPublic"
                    checked={settings.isPublic}
                    onChange={(e: any) => updateSettings({ isPublic: e.target.checked }}
                    className="mr-2 sm:px-4 md:px-6 lg:px-8"
                />
                <label htmlFor="isPublic" className="text-sm text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                    Make this league public (others can request to join)
                </label>
            </div>
        </div>
    );
};

// Step 2: Scoring Settings
const ScoringStep: React.FC<StepProps> = ({ settings, updateSettings, errors }: any) => {
}
    const scoringPresets = {
}
        standard: { description: "Standard scoring (no points for receptions)" },
        ppr: { description: "Point Per Reception (1 point per catch)" },
        half_ppr: { description: "Half Point Per Reception (0.5 points per catch)" },
        custom: { description: "Custom scoring settings" }
    };

    const handlePresetChange = (preset: keyof typeof scoringPresets) => {
}
        updateSettings({
}
            scoringType: preset
        });
    };

    return (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-4 sm:px-4 md:px-6 lg:px-8">
                    Scoring Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.entries(scoringPresets).map(([key, preset]) => (
}
                        <div
                            key={key}
                            onClick={() = role="button" tabIndex={0}> handlePresetChange(key as keyof typeof scoringPresets)}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
}
                                settings.scoringType === key
                                    ? &apos;border-blue-500 bg-blue-50 dark:bg-blue-900/20&apos;
                                    : &apos;border-[var(--panel-border)] hover:border-blue-300&apos;
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                                <h3 className="font-semibold text-[var(--text-primary)] capitalize sm:px-4 md:px-6 lg:px-8">
                                    {key.replace(&apos;_&apos;, &apos; &apos;)}
                                </h3>
                                {settings.scoringType === key && (
}
                                    <CheckIcon className="w-5 h-5 text-blue-500 sm:px-4 md:px-6 lg:px-8" />
                                )}
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{preset.description}</p>
                        </div>
                    ))}
                </div>
                {errors.scoringType && <p className="text-red-500 text-sm mt-1 sm:px-4 md:px-6 lg:px-8">{errors.scoringType}</p>}
            </div>
        </div>
    );
};

// Step 3: Draft Settings
const DraftStep: React.FC<StepProps> = ({ settings, updateSettings, errors }: any) => {
}
    return (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-4 sm:px-4 md:px-6 lg:px-8">
                    Draft Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
}
                        { key: &apos;snake&apos;, name: &apos;Snake Draft&apos;, description: &apos;Order reverses each round&apos; },
                        { key: &apos;auction&apos;, name: &apos;Auction Draft&apos;, description: &apos;Bid on players with budget&apos; }
                    ].map((type: any) => (
                        <div
                            key={type.key}
                            onClick={() = role="button" tabIndex={0}> updateSettings({ draftType: type.key as any })}
                            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
}
                                settings.draftType === type.key
                                    ? &apos;border-blue-500 bg-blue-50 dark:bg-blue-900/20&apos;
                                    : &apos;border-[var(--panel-border)] hover:border-blue-300&apos;
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                                <h3 className="font-semibold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">{type.name}</h3>
                                {settings.draftType === type.key && (
}
                                    <CheckIcon className="w-5 h-5 text-blue-500 sm:px-4 md:px-6 lg:px-8" />
                                )}
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{type.description}</p>
                        </div>
                    ))}
                </div>
                {errors.draftType && <p className="text-red-500 text-sm mt-1 sm:px-4 md:px-6 lg:px-8">{errors.draftType}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                        Draft Date
                    </label>
                    <input
                        type="date"
                        value={settings.draftDate}
                        onChange={(e: any) => updateSettings({ draftDate: e.target.value }}
                        className="w-full px-3 py-2 border border-[var(--panel-border)] rounded-lg bg-[var(--panel-bg)] text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8"
                    />
                    {errors.draftDate && <p className="text-red-500 text-sm mt-1 sm:px-4 md:px-6 lg:px-8">{errors.draftDate}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                        Draft Time
                    </label>
                    <input
                        type="time"
                        value={settings.draftTime}
                        onChange={(e: any) => updateSettings({ draftTime: e.target.value }}
                        className="w-full px-3 py-2 border border-[var(--panel-border)] rounded-lg bg-[var(--panel-bg)] text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8"
                    />
                    {errors.draftTime && <p className="text-red-500 text-sm mt-1 sm:px-4 md:px-6 lg:px-8">{errors.draftTime}</p>}
                </div>
            </div>
        </div>
    );
};

// Step 4: Review & Create
const ReviewStep: React.FC<StepProps> = ({ settings }: any) => {
}
    return (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            <div className="bg-[var(--panel-bg)] p-6 rounded-lg border border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 sm:px-4 md:px-6 lg:px-8">League Summary</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">Basic Information</h4>
                        <ul className="space-y-1 text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                            <li>Name: {settings.name}</li>
                            <li>Teams: {settings.teamCount}</li>
                            <li>Type: {settings.isPublic ? &apos;Public&apos; : &apos;Private&apos;}</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">Scoring</h4>
                        <ul className="space-y-1 text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                            <li>Type: {settings.scoringType.replace(&apos;_&apos;, &apos; &apos;).toUpperCase()}</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">Draft Settings</h4>
                        <ul className="space-y-1 text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                            <li>Type: {settings.draftType.charAt(0).toUpperCase() + settings.draftType.slice(1)}</li>
                            <li>Date: {settings.draftDate}</li>
                            <li>Time: {settings.draftTime}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LeagueCreationWizard: React.FC = () => {
}
    const { state, dispatch } = useAppState();
    const [currentStep, setCurrentStep] = React.useState(0);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [isCreating, setIsCreating] = React.useState(false);

    const [settings, setSettings] = React.useState<WizardSettings>({
}
        name: &apos;&apos;,
        teamCount: 12,
        commissionerId: state.user?.id || &apos;guest&apos;,
        isPublic: false,
        description: &apos;&apos;,
        scoringType: &apos;ppr&apos;,
        draftType: &apos;snake&apos;,
        draftDate: new Date().toISOString().split(&apos;T&apos;)[0],
        draftTime: &apos;19:00&apos;
    });

    const steps: LeagueCreationStep[] = [
        {
}
            id: &apos;basic&apos;,
            title: &apos;Basic Information&apos;,
            description: &apos;Set up your league name and basic settings&apos;,
            component: BasicInfoStep,
            validation: (data: any) => {
}
                if (!data.name.trim()) return &apos;League name is required&apos;;
                if (data.teamCount < 4 || data.teamCount > 20) return &apos;Team count must be between 4 and 20&apos;;
                return null;

        },
        {
}
            id: &apos;scoring&apos;,
            title: &apos;Scoring Settings&apos;,
            description: &apos;Configure how points are awarded&apos;,
            component: ScoringStep,
            validation: () => null
        },
        {
}
            id: &apos;draft&apos;,
            title: &apos;Draft Settings&apos;,
            description: &apos;Set up your draft format and schedule&apos;,
            component: DraftStep,
            validation: (data: any) => {
}
                if (!data.draftDate) return &apos;Draft date is required&apos;;
                if (!data.draftTime) return &apos;Draft time is required&apos;;
                return null;

        },
        {
}
            id: &apos;review&apos;,
            title: &apos;Review & Create&apos;,
            description: &apos;Review your settings and create the league&apos;,
            component: ReviewStep,
            validation: () => null

    ];

    const updateSettings = (updates: Partial<WizardSettings>) => {
}
        setSettings(prev => ({ ...prev, ...updates }));
        setErrors({});
    };

    const validateCurrentStep = () => {
}
        const currentStepData = steps[currentStep];
        const error = currentStepData.validation(settings);
        
        if (error) {
}
            setErrors({ [currentStepData.id]: error });
            return false;

        setErrors({});
        return true;
    };

    const handleNext = () => {
}
        if (validateCurrentStep()) {
}
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));

    };

    const handlePrev = () => {
}
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleCreateLeague = async () => {
}
        if (!validateCurrentStep()) return;
        
        setIsCreating(true);
        
        try {
}
            // Map wizard settings to proper LeagueSettings format
            const getDraftFormat = (): &apos;SNAKE&apos; | &apos;AUCTION&apos; => {
}
                if (settings.draftType === &apos;snake&apos;) return &apos;SNAKE&apos;;
                if (settings.draftType === &apos;auction&apos;) return &apos;AUCTION&apos;;
                return &apos;SNAKE&apos;; // Default fallback
            };

            const getScoring = (): &apos;PPR&apos; | &apos;Standard&apos; | &apos;Half-PPR&apos; => {
}
                if (settings.scoringType === &apos;ppr&apos;) return &apos;PPR&apos;;
                if (settings.scoringType === &apos;half_ppr&apos;) return &apos;Half-PPR&apos;;
                return &apos;Standard&apos;;
            };

            // Create the league payload that matches CreateLeaguePayload interface
            const createPayload = {
}
                id: Date.now().toString(),
                name: settings.name,
                settings: {
}
                    draftFormat: getDraftFormat(),
                    teamCount: settings.teamCount,
                    rosterSize: 16, // Default value
                    scoring: getScoring(),
                    tradeDeadline: 10, // Default week 10
                    playoffFormat: &apos;6_TEAM&apos; as const,
                    waiverRule: &apos;FAAB&apos; as const,
                    aiAssistanceLevel: &apos;FULL&apos; as const
                },
                status: &apos;PRE_DRAFT&apos; as const,
                commissionerId: state.user?.id || &apos;guest&apos;,
                userTeamName: `${state.user?.name || &apos;Guest&apos;}&apos;s Team`,
                userTeamAvatar: state.user?.avatar || &apos;/default-avatar&apos;,
                aiProfiles: []
            };

            dispatch({ type: &apos;CREATE_LEAGUE&apos;, payload: createPayload });
            dispatch({ type: &apos;SET_ACTIVE_LEAGUE&apos;, payload: createPayload.id });
            dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;LEAGUE_HUB&apos; });
            dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: {
}
                message: `League "${settings.name}" created successfully!`,
                type: &apos;SYSTEM&apos;
            }});
        });
        } finally {
}
            setIsCreating(false);

    };

    const CurrentStepComponent = steps[currentStep].component;

    return (
        <div className="w-full h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <header className="flex-shrink-0 mb-6 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                    <div>
                        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wider uppercase text-[var(--text-primary)]">
                            Create League
                        </h1>
                        <p className="text-sm text-[var(--text-secondary)] tracking-widest sm:px-4 md:px-6 lg:px-8">
                            Step {currentStep + 1} of {steps.length}
                        </p>
                    </div>
                    <button
                        onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; }}
                        className="px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 mobile-touch-target sm:px-4 md:px-6 lg:px-8"
                    >
//                         Cancel
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6 sm:px-4 md:px-6 lg:px-8">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300 sm:px-4 md:px-6 lg:px-8"
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    />
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
                    {steps.map((step, index) => (
}
                        <div key={step.id} className="flex flex-col items-center sm:px-4 md:px-6 lg:px-8">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
}
                                index <= currentStep
                                    ? &apos;bg-blue-600 text-white&apos;
                                    : &apos;bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-300&apos;
                            }`}>
                                {index < currentStep ? <CheckIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> : index + 1}
                            </div>
                            <span className="text-xs text-[var(--text-secondary)] mt-1 text-center max-w-20 sm:px-4 md:px-6 lg:px-8">
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </header>

            <main className="flex-grow sm:px-4 md:px-6 lg:px-8">
                <Widget title={steps[currentStep].title}>
                    <div className="p-6 sm:px-4 md:px-6 lg:px-8">
                        <p className="text-[var(--text-secondary)] mb-6 sm:px-4 md:px-6 lg:px-8">
                            {steps[currentStep].description}
                        </p>
                        
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CurrentStepComponent>
                                    settings={settings}
                                    updateSettings={updateSettings}
                                    errors={errors}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </Widget>
            </main>

            <footer className="flex-shrink-0 flex justify-between items-center mt-6 pt-6 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                <button
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50 disabled:cursor-not-allowed mobile-touch-target sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                    <ChevronLeftIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
//                     Previous
                </button>

                {currentStep === steps.length - 1 ? (
}
                    <button
                        onClick={handleCreateLeague}
                        disabled={isCreating}
                        className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed mobile-touch-target sm:px-4 md:px-6 lg:px-8"
                     aria-label="Action button">
                        {isCreating ? &apos;Creating...&apos; : &apos;Create League&apos;}
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium mobile-touch-target sm:px-4 md:px-6 lg:px-8"
                     aria-label="Action button">
//                         Next
                        <ChevronRightIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                    </button>
                )}
            </footer>
        </div>
    );
};

const LeagueCreationWizardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <LeagueCreationWizard {...props} />
  </ErrorBoundary>
);

export default React.memo(LeagueCreationWizardWithErrorBoundary);
