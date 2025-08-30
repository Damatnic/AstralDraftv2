import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import { useLeague } from '../hooks/useLeague';
import { Widget } from '../components/ui/Widget';
import ErrorDisplay from '../components/core/ErrorDisplay';
import { 
    ScrollTextIcon, 
    EditIcon, 
    SaveIcon, 
    FileTextIcon,
    ShieldIcon,
    GavelIcon,
    AlertCircleIcon,
    CheckCircleIcon
} from 'lucide-react';

const LeagueConstitutionView: React.FC = () => {
    const { state, dispatch } = useAppState();
    const { league } = useLeague();
    const [isEditing, setIsEditing] = useState(false);
    const [constitution, setConstitution] = useState(league?.constitution || getDefaultConstitution());
    const [showSaved, setShowSaved] = useState(false);

    const isCommissioner = state.user?.id === league?.commissionerId;

    if (!league) {
        return <ErrorDisplay title="Error" message="Could not load league data." onRetry={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })} />;
    }

    function getDefaultConstitution() {
        return `
# LEAGUE CONSTITUTION

## Article I: League Structure
- League Name: ${league?.name || 'Fantasy Football League'}
- Number of Teams: ${league?.settings.teamCount || 10}
- Commissioner: ${league?.teams.find((t: any) => t.owner.id === league?.commissionerId)?.owner.name || 'TBD'}

## Article II: Scoring System
- Scoring Format: ${league?.settings.scoringFormat || 'PPR'}
- Passing TD: 6 points
- Rushing/Receiving TD: 6 points
- 1 point per 10 yards rushing/receiving
- 1 point per 25 yards passing
- ${league?.settings.scoringFormat === 'PPR' ? '1 point per reception' : league?.settings.scoringFormat === 'HALF_PPR' ? '0.5 points per reception' : 'No points per reception'}

## Article III: Roster Format
- QB: 1
- RB: 2
- WR: 2
- TE: 1
- FLEX: 1
- K: 1
- DST: 1
- Bench: 6

## Article IV: Draft Rules
- Draft Date: August 31, 2025
- Draft Format: Snake
- Draft Order: Randomized
- Time Per Pick: 90 seconds
- Keepers: ${league?.settings.keeperCount || 0} allowed

## Article V: Waiver Wire
- Waiver Type: FAAB
- Budget: $100
- Processing: Tuesday night/Wednesday morning
- Free Agency: After waivers clear

## Article VI: Trading
- Trade Deadline: Week ${league?.settings.tradeDeadline || 10}
- Trade Review: Commissioner approval
- Veto Period: 24 hours
- No trades during playoffs

## Article VII: Playoffs
- Playoff Teams: ${league?.settings.playoffTeams || 6}
- Playoff Weeks: 15-17
- Seeding: By record, then points scored
- Championship: Week 17

## Article VIII: Payouts
- Entry Fee: $${league?.dues?.amount || 50}
- 1st Place: $${league?.payouts?.firstPlace || 300}
- 2nd Place: $${league?.payouts?.secondPlace || 150}
- 3rd Place: $${league?.payouts?.thirdPlace || 50}

## Article IX: Code of Conduct
1. All managers must set lineups weekly
2. No collusion or unfair practices
3. Respect all league members
4. Commissioner decisions are final
5. Have fun and compete fairly

## Article X: Amendments
- Constitution changes require commissioner approval
- Major changes require league vote (majority wins)
- Changes take effect following season unless emergency
        `.trim();
    }

    const handleSave = () => {
        dispatch({
            type: 'UPDATE_LEAGUE_CONSTITUTION',
            payload: { leagueId: league.id, constitution }
        });
        dispatch({ 
            type: 'ADD_NOTIFICATION', 
            payload: { message: 'Constitution saved successfully!', type: 'SYSTEM' }
        });
        setIsEditing(false);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 3000);
    };

    const handleGenerate = () => {
        const newConstitution = getDefaultConstitution();
        setConstitution(newConstitution);
        setIsEditing(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5 p-4 sm:p-6 lg:p-8">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wider uppercase text-[var(--text-primary)] flex items-center gap-3">
                        <ScrollTextIcon className="w-8 h-8" />
                        League Constitution
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] tracking-widest">{league.name}</p>
                </div>
                <button 
                    onClick={() => dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_HUB' })} 
                    className="glass-button"
                >
                    Back to League Hub
                </button>
            </header>

            <main className="max-w-4xl mx-auto">
                {/* Constitution Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-pane p-6 mb-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <GavelIcon className="w-6 h-6 text-blue-400" />
                            <h2 className="text-xl font-bold text-white">Official League Rules</h2>
                        </div>
                        {isCommissioner && (
                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <>
                                        <button
                                            onClick={handleGenerate}
                                            className="glass-button px-4 py-2 flex items-center gap-2"
                                        >
                                            <FileTextIcon className="w-4 h-4" />
                                            Generate Template
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="glass-button-primary px-4 py-2 flex items-center gap-2"
                                        >
                                            <EditIcon className="w-4 h-4" />
                                            Edit
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setConstitution(league.constitution || getDefaultConstitution());
                                                setIsEditing(false);
                                            }}
                                            className="glass-button px-4 py-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="glass-button-primary px-4 py-2 flex items-center gap-2"
                                        >
                                            <SaveIcon className="w-4 h-4" />
                                            Save
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Info Banner */}
                    <div className="p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                        <p className="text-sm text-blue-300 flex items-center gap-2">
                            <ShieldIcon className="w-4 h-4" />
                            This constitution governs all league activities and decisions
                        </p>
                    </div>
                </motion.div>

                {/* Constitution Content */}
                <Widget 
                    title="Constitution Document" 
                    icon={<ScrollTextIcon />}
                    className="glass-pane"
                >
                    <div className="p-6">
                        {isEditing ? (
                            <textarea
                                value={constitution}
                                onChange={(e: any) => setConstitution(e.target.value)}
                                className="glass-input w-full h-[600px] font-mono text-sm p-4"
                                placeholder="Enter your league constitution..."
                            />
                        ) : (
                            <div className="prose prose-invert max-w-none">
                                <div className="whitespace-pre-wrap font-sans text-[var(--text-primary)]">
                                    {constitution.split('\n').map((line, index) => {
                                        // Style headers
                                        if (line.startsWith('# ')) {
                                            return (
                                                <h1 key={index} className="text-3xl font-bold text-white mt-6 mb-4">
                                                    {line.replace('# ', '')}
                                                </h1>
                                            );
                                        }
                                        if (line.startsWith('## ')) {
                                            return (
                                                <h2 key={index} className="text-xl font-semibold text-blue-400 mt-4 mb-2">
                                                    {line.replace('## ', '')}
                                                </h2>
                                            );
                                        }
                                        if (line.startsWith('### ')) {
                                            return (
                                                <h3 key={index} className="text-lg font-medium text-white mt-3 mb-2">
                                                    {line.replace('### ', '')}
                                                </h3>
                                            );
                                        }
                                        // Style list items
                                        if (line.startsWith('- ')) {
                                            return (
                                                <li key={index} className="ml-4 text-[var(--text-secondary)] mb-1">
                                                    {line.replace('- ', '')}
                                                </li>
                                            );
                                        }
                                        if (line.match(/^\d+\. /)) {
                                            return (
                                                <li key={index} className="ml-4 text-[var(--text-secondary)] mb-1">
                                                    {line}
                                                </li>
                                            );
                                        }
                                        // Regular paragraphs
                                        return line.trim() ? (
                                            <p key={index} className="text-[var(--text-secondary)] mb-2">
                                                {line}
                                            </p>
                                        ) : (
                                            <br key={index} />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Last Updated */}
                    {!isEditing && (
                        <div className="p-4 border-t border-white/10">
                            <p className="text-sm text-[var(--text-secondary)] text-center">
                                Last updated: {new Date().toLocaleDateString()}
                            </p>
                        </div>
                    )}
                </Widget>

                {/* Save Confirmation */}
                {showSaved && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed bottom-8 right-8 glass-pane p-4 flex items-center gap-3"
                    >
                        <CheckCircleIcon className="w-5 h-5 text-green-400" />
                        <span className="text-white font-medium">Constitution saved successfully!</span>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default LeagueConstitutionView;