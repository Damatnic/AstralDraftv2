/**
 * Enhanced League Settings Editor Modal
 * Comprehensive league configuration management
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { XIcon } from &apos;../icons/XIcon&apos;;
import { SaveIcon } from &apos;../icons/SaveIcon&apos;;
import { SettingsIcon } from &apos;../icons/SettingsIcon&apos;;
import { League, LeagueSettings } from &apos;../../types&apos;;

interface LeagueSettingsEditorProps {
}
    league: League;
    onClose: () => void;
    onSave: (settings: LeagueSettings) => void;

}

interface SettingsFormData {
}
    draftFormat: &apos;SNAKE&apos; | &apos;AUCTION&apos;;
    teamCount: number;
    rosterSize: number;
    scoring: &apos;Standard&apos; | &apos;PPR&apos; | &apos;Half-PPR&apos;;
    tradeDeadline: number;
    playoffFormat: &apos;4_TEAM&apos; | &apos;6_TEAM&apos;;
    waiverRule: &apos;FAAB&apos; | &apos;REVERSE_ORDER&apos;;
    aiAssistanceLevel: &apos;FULL&apos; | &apos;BASIC&apos;;
    // Additional settings
    rosterPositions: {
}
        QB: number;
        RB: number;
        WR: number;
        TE: number;
        FLEX: number;
        K: number;
        DST: number;
        BENCH: number;
        IR: number;
    };
    faabBudget: number;
    pickTimer: number;
    maxKeepers: number;
    tradingEnabled: boolean;
    waiverPeriod: number;

const LeagueSettingsEditor: React.FC<LeagueSettingsEditorProps> = ({ league, onClose, onSave }: any) => {
}
    const [formData, setFormData] = React.useState<SettingsFormData>({
}
        draftFormat: league.settings.draftFormat,
        teamCount: league.settings.teamCount,
        rosterSize: league.settings.rosterSize,
        scoring: league.settings.scoring,
        tradeDeadline: league.settings.tradeDeadline,
        playoffFormat: league.settings.playoffFormat,
        waiverRule: league.settings.waiverRule,
        aiAssistanceLevel: league.settings.aiAssistanceLevel,
        rosterPositions: {
}
            QB: 1,
            RB: 2,
            WR: 2,
            TE: 1,
            FLEX: 1,
            K: 1,
            DST: 1,
            BENCH: 6,
            IR: 1
        },
        faabBudget: 100,
        pickTimer: 90,
        maxKeepers: 0,
        tradingEnabled: true,
        waiverPeriod: 1
    });

    const [activeTab, setActiveTab] = React.useState<&apos;basic&apos; | &apos;roster&apos; | &apos;scoring&apos; | &apos;waivers&apos; | &apos;advanced&apos;>(&apos;basic&apos;);
    const [hasChanges, setHasChanges] = React.useState(false);

    const updateField = <K extends keyof SettingsFormData>(field: K, value: SettingsFormData[K]) => {
}
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const updateRosterPosition = (position: keyof SettingsFormData[&apos;rosterPositions&apos;], value: number) => {
}
        setFormData(prev => ({
}
            ...prev,
            rosterPositions: { ...prev.rosterPositions, [position]: value }
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
}
        const updatedSettings: LeagueSettings = {
}
            draftFormat: formData.draftFormat,
            teamCount: formData.teamCount,
            rosterSize: formData.rosterSize,
            scoring: formData.scoring,
            tradeDeadline: formData.tradeDeadline,
            playoffFormat: formData.playoffFormat,
            waiverRule: formData.waiverRule,
            aiAssistanceLevel: formData.aiAssistanceLevel
        };
        onSave(updatedSettings);
        onClose();
    };

    const tabs = [
        { id: &apos;basic&apos;, label: &apos;Basic&apos;, icon: &apos;⚙️&apos; },
        { id: &apos;roster&apos;, label: &apos;Roster&apos;, icon: &apos;👥&apos; },
        { id: &apos;scoring&apos;, label: &apos;Scoring&apos;, icon: &apos;🏆&apos; },
        { id: &apos;waivers&apos;, label: &apos;Waivers&apos;, icon: &apos;📋&apos; },
        { id: &apos;advanced&apos;, label: &apos;Advanced&apos;, icon: &apos;🔧&apos; }
    ] as const;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 sm:px-4 md:px-6 lg:px-8"
                onClick={(e: any) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden sm:px-4 md:px-6 lg:px-8"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-[var(--panel-border)] flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                            <SettingsIcon className="w-6 h-6 text-blue-500 sm:px-4 md:px-6 lg:px-8" />
                            <div>
                                <h2 className="text-xl font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">League Settings</h2>
                                <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{league.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                         aria-label="Action button">
                            <XIcon className="w-5 h-5 sm:px-4 md:px-6 lg:px-8" />
                        </button>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex border-b border-[var(--panel-border)] bg-[var(--bg-secondary)] sm:px-4 md:px-6 lg:px-8">
                        {tabs.map((tab: any) => (
}
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}`}
                            >
                                <span className="mr-2 sm:px-4 md:px-6 lg:px-8">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[60vh] sm:px-4 md:px-6 lg:px-8">
                        {activeTab === &apos;basic&apos; && (
}
                            <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                            Draft Format
                                        </label>
                                        <select
                                            value={formData.draftFormat}
                                            onChange={(e: any) => updateField(&apos;draftFormat&apos;, e.target.value as &apos;SNAKE&apos; | &apos;AUCTION&apos;)}
                                        >
                                            <option value="SNAKE">Snake Draft</option>
                                            <option value="AUCTION">Auction Draft</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                            Team Count
                                        </label>
                                        <select
                                            value={formData.teamCount}
                                            onChange={(e: any) => updateField(&apos;teamCount&apos;, parseInt(e.target.value))}
                                        >
                                            {[8, 10, 12, 14, 16, 18, 20].map((count: any) => (
}
                                                <option key={count} value={count}>{count} Teams</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                            Playoff Format
                                        </label>
                                        <select
                                            value={formData.playoffFormat}
                                            onChange={(e: any) => updateField(&apos;playoffFormat&apos;, e.target.value as any)}
                                        >
                                            <option value="4_TEAM">4 Team Playoff</option>
                                            <option value="6_TEAM">6 Team Playoff</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                            Trade Deadline (Week)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="17"
                                            value={formData.tradeDeadline}
                                            onChange={(e: any) => updateField(&apos;tradeDeadline&apos;, parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === &apos;roster&apos; && (
}
                            <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4 sm:px-4 md:px-6 lg:px-8">Roster Positions</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {Object.entries(formData.rosterPositions).map(([position, count]) => (
}
                                            <div key={position}>
                                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                                    {position}
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="10"
                                                    value={count}
                                                    onChange={(e: any) => updateRosterPosition(position as any, parseInt(e.target.value))}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === &apos;scoring&apos; && (
}
                            <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                        Scoring System
                                    </label>
                                    <select
                                        value={formData.scoring}
                                        onChange={(e: any) => updateField(&apos;scoring&apos;, e.target.value as any)}
                                    >
                                        <option value="Standard">Standard (No PPR)</option>
                                        <option value="Half-PPR">Half PPR (0.5 pts/reception)</option>
                                        <option value="PPR">Full PPR (1 pt/reception)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {activeTab === &apos;waivers&apos; && (
}
                            <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                            Waiver System
                                        </label>
                                        <select
                                            value={formData.waiverRule}
                                            onChange={(e: any) => updateField(&apos;waiverRule&apos;, e.target.value as any)}
                                        >
                                            <option value="FAAB">FAAB (Free Agent Auction Budget)</option>
                                            <option value="REVERSE_ORDER">Reverse Order (Waiver Priority)</option>
                                        </select>
                                    </div>
                                    {formData.waiverRule === &apos;FAAB&apos; && (
}
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                                FAAB Budget ($)
                                            </label>
                                            <input
                                                type="number"
                                                min="50"
                                                max="1000"
                                                step="25"
                                                value={formData.faabBudget}
                                                onChange={(e: any) => updateField(&apos;faabBudget&apos;, parseInt(e.target.value))}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                            Waiver Period (Days)
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="7"
                                            value={formData.waiverPeriod}
                                            onChange={(e: any) => updateField(&apos;waiverPeriod&apos;, parseInt(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === &apos;advanced&apos; && (
}
                            <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                            AI Assistance Level
                                        </label>
                                        <select
                                            value={formData.aiAssistanceLevel}
                                            onChange={(e: any) => updateField(&apos;aiAssistanceLevel&apos;, e.target.value as any)}
                                        >
                                            <option value="BASIC">Basic Recommendations</option>
                                            <option value="FULL">Full Oracle Integration</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                            Draft Pick Timer (seconds)
                                        </label>
                                        <input
                                            type="number"
                                            min="30"
                                            max="600"
                                            step="30"
                                            value={formData.pickTimer}
                                            onChange={(e: any) => updateField(&apos;pickTimer&apos;, parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                            Max Keepers
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="10"
                                            value={formData.maxKeepers}
                                            onChange={(e: any) => updateField(&apos;maxKeepers&apos;, parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div className="flex items-center sm:px-4 md:px-6 lg:px-8">
                                        <input
                                            type="checkbox"
                                            id="tradingEnabled"
                                            checked={formData.tradingEnabled}
                                            onChange={(e: any) => updateField(&apos;tradingEnabled&apos;, e.target.checked)}
                                        />
                                        <label htmlFor="tradingEnabled" className="text-sm font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                            Enable Trading
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-[var(--panel-border)] flex justify-between items-center sm:px-4 md:px-6 lg:px-8">
                        <div className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                            {hasChanges && &apos;• Unsaved changes&apos;}
                        </div>
                        <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors sm:px-4 md:px-6 lg:px-8"
                             aria-label="Action button">
//                                 Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!hasChanges}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed sm:px-4 md:px-6 lg:px-8"
                             aria-label="Action button">
                                <SaveIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                Save Changes
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const LeagueSettingsEditorWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <LeagueSettingsEditor {...props} />
  </ErrorBoundary>
);

export default React.memo(LeagueSettingsEditorWithErrorBoundary);
