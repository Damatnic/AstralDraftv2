

import React, { useCallback, useMemo } from 'react';
import type { Team, League, DailyBriefingItem, AiLineupSuggestion, Player } from '../../types';
import { Widget } from '../ui/Widget';
import { SparklesIcon } from '../icons/SparklesIcon';
import { generateDailyBriefing, getLineupSolution } from '../../services/geminiService';
import BriefingItemCard from './BriefingItemCard';
import { motion, AnimatePresence } from 'framer-motion';
import { players } from '../../data/players';
import PlaceClaimModal from './PlaceClaimModal';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Avatar } from '../ui/Avatar';

interface DailyBriefingWidgetProps {
    myTeam: Team;
    league: League;
    dispatch: React.Dispatch<any>;


const LineupSuggestion: React.FC<{ suggestion: AiLineupSuggestion, onAccept: () => void, onDismiss: () => void }> = ({ suggestion, onAccept, onDismiss }: any) => {
    const suggestedPlayers = suggestion.recommendedStarters.map((id: any) => players.find((p: any) => p.id === id)).filter(Boolean) as Player[];

    return (
        <motion.div 
            className="bg-cyan-900/50 border-t-2 border-cyan-400 p-3 overflow-hidden sm:px-4 md:px-6 lg:px-8"
            {...{
                initial: { opacity: 0, height: 0 },
                animate: { opacity: 1, height: 'auto' },
                exit: { opacity: 0, height: 0 },
            }}
        >
            <h5 className="font-bold text-sm text-cyan-300 sm:px-4 md:px-6 lg:px-8">Oracle's Suggested Lineup</h5>
            <p className="text-xs italic text-gray-400 mt-1 mb-2 sm:px-4 md:px-6 lg:px-8">"{suggestion.reasoning}"</p>
            <div className="flex flex-wrap gap-1 text-xs mb-3 sm:px-4 md:px-6 lg:px-8">
                {suggestedPlayers.map((p: any) => (
                    <div key={p.id} className="bg-black/20 px-1.5 py-0.5 rounded-full flex items-center gap-1 sm:px-4 md:px-6 lg:px-8">
                        <Avatar avatar={p.astralIntelligence?.spiritAnimal?.split(',')[0] || '🏈'} className="w-4 h-4 text-xs rounded-full sm:px-4 md:px-6 lg:px-8" />
                        <span>{p.name}</span>
                    </div>
                ))}
            </div>
            <div className="flex justify-end gap-2 sm:px-4 md:px-6 lg:px-8">
                <button onClick={onDismiss} className="px-2 py-0.5 text-xs font-bold rounded-md bg-transparent text-gray-400 hover:bg-white/10 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Dismiss</button>
                <button onClick={onAccept} className="px-2 py-0.5 text-xs font-bold rounded-md bg-green-500 text-white hover:bg-green-400 sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Set My Lineup</button>
            </div>
        </motion.div>
    );
};

export const DailyBriefingWidget: React.FC<DailyBriefingWidgetProps> = ({ myTeam, league, dispatch }: any) => {
    const [briefing, setBriefing] = React.useState<DailyBriefingItem[] | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAdviceLoading, setIsAdviceLoading] = React.useState(false);
    const [lineupSuggestion, setLineupSuggestion] = React.useState<AiLineupSuggestion | null>(null);
    const [claimModalPlayer, setClaimModalPlayer] = React.useState<Player | null>(null);

    React.useEffect(() => {
        const fetchBriefing = async () => {
            setIsLoading(true);
            try {

                const data = await generateDailyBriefing(league, myTeam);
                setBriefing(data);
            
    } catch (error) {
            } finally {
                setIsLoading(false);

        };

        // Only run for current week in season
        if (league?.status === 'IN_SEASON' || league?.status === 'PLAYOFFS') {
            fetchBriefing();
        } else {
            setIsLoading(false);

    }, [league.id, league.currentWeek, myTeam.id]);

    const handleGetAdvice = async (playerIds: number[]) => {
        setIsAdviceLoading(true);
        setLineupSuggestion(null);
        try {

            const suggestion = await getLineupSolution(myTeam, league, playerIds[0]);
            setLineupSuggestion(suggestion);
        
    } catch (error) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: "Could not get lineup advice." });
        } finally {
            setIsAdviceLoading(false);

    };

    const handleAcceptLineup = () => {
        if (!lineupSuggestion) return;
        dispatch({
            type: 'SET_LINEUP',
            payload: {
                leagueId: league.id,
                teamId: myTeam.id,
                playerIds: lineupSuggestion.recommendedStarters,

        });
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: "Oracle's lineup has been set!", type: 'SYSTEM' } });
        setLineupSuggestion(null);
    };
    
    const handleClaimPlayer = (player: Player) => {
        setClaimModalPlayer(player);
    };

    const renderContent = () => {
        if (isLoading) {
            return <LoadingSpinner size="sm" text="Consulting the Oracle..." />;

        if (!briefing || briefing.length === 0) {
            return <p className="text-center text-xs text-gray-400 py-4 sm:px-4 md:px-6 lg:px-8">The Oracle is quiet today. No new briefings.</p>;

        return (
            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                {briefing.map((item, index) => (
                    <BriefingItemCard key={index} item={item} dispatch={dispatch} onGetAdvice={handleGetAdvice} onClaimPlayer={handleClaimPlayer} />
                ))}
            </div>
        );

    return (
        <Widget title="Daily Briefing" icon={<SparklesIcon />}>
            <div className="p-3 sm:px-4 md:px-6 lg:px-8">
                {renderContent()}
            </div>
             {isAdviceLoading && <LoadingSpinner size="sm" text="Optimizing lineup..." />}
            <AnimatePresence>
                {lineupSuggestion && (
                    <LineupSuggestion>
                        suggestion={lineupSuggestion}
                        onAccept={handleAcceptLineup}
                        onDismiss={() => setLineupSuggestion(null)}
                    />
                )}
            </AnimatePresence>
             <AnimatePresence>
                {claimModalPlayer && (
                    <PlaceClaimModal>
                        playerToAdd={claimModalPlayer}
                        myTeam={myTeam}
                        leagueId={league.id}
                        dispatch={dispatch}
                        onClose={() => setClaimModalPlayer(null)}
                    />
                )}
            </AnimatePresence>
        </Widget>
    );
};