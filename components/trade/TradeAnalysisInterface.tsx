/**
 * Trade Analysis Interface
 * Clean implementation with trade builder and analysis view
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowRightLeftIcon, 
    AlertTriangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    BarChart3Icon,
//     UsersIcon
} from 'lucide-react';
import { Widget } from '../ui/Widget';
import { Player } from '../../types';

interface SimpleTradeProposal {
    fromPlayers: Player[];
    toPlayers: Player[];


interface SimpleTradeAnalysis {
    overallGrade: string;
    fairnessScore: number;
    recommendation: string;
    currentValueDifference: number;
    projectedValueDifference: number;
    reasoning: string[];
    warnings: string[];

export const TradeAnalysisInterface: React.FC<{
    className?: string;
}> = ({ className = '' }: any) => {
    const [proposal, setProposal] = useState<SimpleTradeProposal>({
        fromPlayers: [],
        toPlayers: []
    });
    const [analysis, setAnalysis] = useState<SimpleTradeAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
    const [activeTab, setActiveTab] = useState<'builder' | 'analysis'>('builder');

    useEffect(() => {
        // Mock player data
        const mockPlayers: Player[] = [
            { 
                id: 1, 
                name: 'Josh Allen', 
                position: 'QB', 
                team: 'BUF', 
                adp: 12,
                rank: 1,
                bye: 7,
                tier: 1,
                age: 27,
                auctionValue: 30,
                stats: {
                    projection: 320,
                    lastYear: 310,
                    vorp: 85,
                    weeklyProjections: { 1: 25, 2: 22, 3: 28 }

            },
            { 
                id: 2, 
                name: 'Christian McCaffrey', 
                position: 'RB', 
                team: 'SF', 
                adp: 1,
                rank: 1,
                bye: 9,
                tier: 1,
                age: 26,
                auctionValue: 45,
                stats: {
                    projection: 380,
                    lastYear: 400,
                    vorp: 120,
                    weeklyProjections: { 1: 28, 2: 25, 3: 32 }

            },
            { 
                id: 3, 
                name: 'Cooper Kupp', 
                position: 'WR', 
                team: 'LAR', 
                adp: 8,
                rank: 1,
                bye: 6,
                tier: 1,
                age: 29,
                auctionValue: 35,
                stats: {
                    projection: 290,
                    lastYear: 320,
                    vorp: 95,
                    weeklyProjections: { 1: 22, 2: 20, 3: 25 }

            },
        ];
        setAvailablePlayers(mockPlayers);
    }, []);

    const addPlayer = useCallback((player: Player, side: 'from' | 'to') => {
        setProposal(prev => ({
            ...prev,
            [side === 'from' ? 'fromPlayers' : 'toPlayers']: [
                ...prev[side === 'from' ? 'fromPlayers' : 'toPlayers'], 
//                 player

        }));
    }, []);

    const removePlayer = useCallback((playerId: number, side: 'from' | 'to') => {
        setProposal(prev => ({
            ...prev,
            [side === 'from' ? 'fromPlayers' : 'toPlayers']: 
                prev[side === 'from' ? 'fromPlayers' : 'toPlayers'].filter((p: any) => p.id !== playerId)
        }));
    }, []);

    const analyzeCurrentTrade = useCallback(async () => {
        if (!proposal.fromPlayers.length || !proposal.toPlayers.length) return;

        setIsAnalyzing(true);
        try {

            // Mock analysis
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const mockAnalysis: SimpleTradeAnalysis = {
                overallGrade: 'B+',
                fairnessScore: 75,
                recommendation: 'accept',
                currentValueDifference: 12,
                projectedValueDifference: 8,
                reasoning: [
                    'Solid value improvement for your team',
                    'Addresses positional needs effectively',
                    'Good long-term outlook'
                ],
                warnings: [
                    'Slightly reduces bench depth',
                    'Minor injury risk consideration'

            };
            
            setAnalysis(mockAnalysis);
            setActiveTab('analysis');
    
    } catch (error) {
        } finally {
            setIsAnalyzing(false);

    }, [proposal]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
        <Widget title="Trade Analysis Center" className={`bg-gray-900 ${className}`}>
            <div className="p-6 sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-6 sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold text-white flex items-center sm:px-4 md:px-6 lg:px-8">
                        <ArrowRightLeftIcon className="w-6 h-6 mr-2 sm:px-4 md:px-6 lg:px-8" />
                        Trade Analysis Center
                    </h2>
                    <div className="flex space-x-2 sm:px-4 md:px-6 lg:px-8">
                        <button
                            onClick={() => setActiveTab('builder')}`}
                        >
//                             Builder
                        </button>
                        <button
                            onClick={() => setActiveTab('analysis')}`}
                            disabled={!analysis}
                        >
//                             Analysis
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'builder' && (
                        <motion.div
                            key="builder"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6 sm:px-4 md:px-6 lg:px-8"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* From Team */}
                                <div className="bg-gray-800/50 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center sm:px-4 md:px-6 lg:px-8">
                                        <UsersIcon className="w-5 h-5 mr-2 sm:px-4 md:px-6 lg:px-8" />
                                        Trading Away
                                    </h3>
                                    <div className="space-y-2 mb-4 sm:px-4 md:px-6 lg:px-8">
                                        {proposal.fromPlayers.map((player: any) => (
                                            <div key={player.id} className="flex items-center justify-between bg-gray-700/50 rounded p-2 sm:px-4 md:px-6 lg:px-8">
                                                <div>
                                                    <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{player.name}</span>
                                                    <span className="text-gray-400 text-sm ml-2 sm:px-4 md:px-6 lg:px-8">{player.position} - {player.team}</span>
                                                </div>
                                                <button
                                                    onClick={() => removePlayer(player.id, 'from')}
                                                >
                                                    <XCircleIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* To Team */}
                                <div className="bg-gray-800/50 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center sm:px-4 md:px-6 lg:px-8">
                                        <UsersIcon className="w-5 h-5 mr-2 sm:px-4 md:px-6 lg:px-8" />
//                                         Receiving
                                    </h3>
                                    <div className="space-y-2 mb-4 sm:px-4 md:px-6 lg:px-8">
                                        {proposal.toPlayers.map((player: any) => (
                                            <div key={player.id} className="flex items-center justify-between bg-gray-700/50 rounded p-2 sm:px-4 md:px-6 lg:px-8">
                                                <div>
                                                    <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{player.name}</span>
                                                    <span className="text-gray-400 text-sm ml-2 sm:px-4 md:px-6 lg:px-8">{player.position} - {player.team}</span>
                                                </div>
                                                <button
                                                    onClick={() => removePlayer(player.id, 'to')}
                                                >
                                                    <XCircleIcon className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Available Players */}
                            <div className="bg-gray-800/50 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Available Players</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                                    {availablePlayers.map((player: any) => (
                                        <div key={player.id} className="bg-gray-700/50 rounded p-2 text-sm sm:px-4 md:px-6 lg:px-8">
                                            <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                                <div>
                                                    <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{player.name}</span>
                                                    <div className="text-gray-400 sm:px-4 md:px-6 lg:px-8">{player.position} - {player.team}</div>
                                                </div>
                                                <div className="flex space-x-1 sm:px-4 md:px-6 lg:px-8">
                                                    <button
                                                        onClick={() => addPlayer(player, 'from')}
                                                    >
//                                                         Give
                                                    </button>
                                                    <button
                                                        onClick={() => addPlayer(player, 'to')}
                                                    >
//                                                         Get
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={analyzeCurrentTrade}
                                disabled={isAnalyzing || !proposal.fromPlayers.length || !proposal.toPlayers.length}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center sm:px-4 md:px-6 lg:px-8"
                             aria-label="Action button">
                                {isAnalyzing ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2 sm:px-4 md:px-6 lg:px-8"
                                        />
                                        Analyzing Trade...
                                    </>
                                ) : (
                                    <>
                                        <BarChart3Icon className="w-5 h-5 mr-2 sm:px-4 md:px-6 lg:px-8" />
                                        Analyze Trade
                                    </>
                                )}
                            </button>
                        </motion.div>
                    )}

                    {activeTab === 'analysis' && analysis && (
                        <motion.div
                            key="analysis"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6 sm:px-4 md:px-6 lg:px-8"
                        >
                            {/* Overall Grade */}
                            <div className="bg-gray-800/50 rounded-lg p-6 text-center sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center justify-center mb-4 sm:px-4 md:px-6 lg:px-8">
                                    <CheckCircleIcon className="w-8 h-8 text-green-400 sm:px-4 md:px-6 lg:px-8" />
                                </div>
                                <div className="text-4xl font-bold mb-2 text-blue-400 sm:px-4 md:px-6 lg:px-8">
                                    {analysis.overallGrade}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2 sm:px-4 md:px-6 lg:px-8">Trade Grade</h3>
                                <p className="text-gray-300 sm:px-4 md:px-6 lg:px-8">Good value trade with positive team impact</p>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-800/50 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                    <h4 className="font-semibold text-white mb-2 sm:px-4 md:px-6 lg:px-8">Fairness Score</h4>
                                    <div className="text-2xl font-bold text-yellow-400 sm:px-4 md:px-6 lg:px-8">
                                        {analysis.fairnessScore}/100
                                    </div>
                                </div>
                                <div className="bg-gray-800/50 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                    <h4 className="font-semibold text-white mb-2 sm:px-4 md:px-6 lg:px-8">Current Value</h4>
                                    <div className="text-2xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                                        +{analysis.currentValueDifference}%
                                    </div>
                                </div>
                                <div className="bg-gray-800/50 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                    <h4 className="font-semibold text-white mb-2 sm:px-4 md:px-6 lg:px-8">Future Value</h4>
                                    <div className="text-2xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                                        +{analysis.projectedValueDifference}%
                                    </div>
                                </div>
                            </div>

                            {/* Reasoning and Warnings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-gray-800/50 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                    <h4 className="font-semibold text-white mb-4 flex items-center sm:px-4 md:px-6 lg:px-8">
                                        <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2 sm:px-4 md:px-6 lg:px-8" />
//                                         Reasoning
                                    </h4>
                                    <ul className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                        {analysis.reasoning.map((reason, index) => (
                                            <li key={`reason-${reason.slice(0, 10)}-${index}`} className="text-sm text-gray-300 flex items-start space-x-2 sm:px-4 md:px-6 lg:px-8">
                                                <CheckCircleIcon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />
                                                <span>{reason}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-gray-800/50 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
                                    <h4 className="font-semibold text-white mb-4 flex items-center sm:px-4 md:px-6 lg:px-8">
                                        <AlertTriangleIcon className="w-5 h-5 text-yellow-400 mr-2 sm:px-4 md:px-6 lg:px-8" />
//                                         Warnings
                                    </h4>
                                    <ul className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                        {analysis.warnings.map((warning, index) => (
                                            <li key={`warning-${warning.slice(0, 10)}-${index}`} className="text-sm text-yellow-300 flex items-start space-x-2 sm:px-4 md:px-6 lg:px-8">
                                                <AlertTriangleIcon className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />
                                                <span>{warning}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="text-center sm:px-4 md:px-6 lg:px-8">
                                <button className="px-8 py-3 rounded-lg font-semibold transition-colors bg-green-600 hover:bg-green-700 text-white sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                                    Accept Trade
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Widget>
    );
};

const TradeAnalysisInterfaceWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TradeAnalysisInterface {...props} />
  </ErrorBoundary>
);

export default React.memo(TradeAnalysisInterfaceWithErrorBoundary);
