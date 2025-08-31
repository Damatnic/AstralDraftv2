
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo } from 'react';
import type { League, WaiverIntelligence } from '../../types';
import { Widget } from '../ui/Widget';
import { getWaiverIntelligence } from '../../services/geminiService';
import { LightbulbIcon } from '../icons/LightbulbIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUpIcon } from '../icons/TrendingUpIcon';

interface WaiverIntelligenceWidgetProps {
    league: League;

}

const WaiverIntelligenceWidget: React.FC<WaiverIntelligenceWidgetProps> = ({ league }) => {
    const [intel, setIntel] = React.useState<WaiverIntelligence[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
        const fetchIntel = async () => {
            setIsLoading(true);
            try {
                const data = await getWaiverIntelligence(league);
                if (data) {
                    setIntel(data);
                }
            } catch (error) {
                console.error('Error fetching waiver intelligence:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchIntel();
    }, [league.id, league.currentWeek]);
    
     React.useEffect(() => {
        if (intel.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex: any) => (prevIndex + 1) % intel.length);
            }, 8000); // Change story every 8 seconds
            return () => clearInterval(interval);
        }
    }, [intel.length]);
    
    if(isLoading) {
        return (
             <Widget title="Oracle's Insight" icon={<LightbulbIcon />}>
                <LoadingSpinner size="sm" text="Scouring the waiver wire..." />
            </Widget>
        );
    }

    if(intel.length === 0) {
        return null;
    }

    const currentIntel = intel[currentIndex];

    return (
        <Widget title="Oracle's Insight" icon={<LightbulbIcon />}>
            <div className="p-3 overflow-hidden sm:px-4 md:px-6 lg:px-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        {...{
                            initial: { opacity: 0, x: 50 },
                            animate: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: -50 },
                            transition: { duration: 0.5, ease: 'easeInOut' },
                        }}
                    >
                         <div className="flex items-center gap-2 mb-1 sm:px-4 md:px-6 lg:px-8">
                            {currentIntel.type === 'STREAMING' && <TrendingUpIcon className="h-4 w-4 text-green-400 sm:px-4 md:px-6 lg:px-8" />}
                            <h4 className="font-bold text-sm text-cyan-300 sm:px-4 md:px-6 lg:px-8">{currentIntel.title}</h4>
                         </div>
                        <p className="text-xs text-gray-300 italic sm:px-4 md:px-6 lg:px-8">"{currentIntel.content}"</p>
                         <div className="mt-2 flex flex-wrap gap-1 sm:px-4 md:px-6 lg:px-8">
                            {currentIntel.players.map((name: any) => (
                                <span key={name} className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-full sm:px-4 md:px-6 lg:px-8">{name}</span>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </Widget>
    );
};

const WaiverIntelligenceWidgetWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <WaiverIntelligenceWidget {...props} />
  </ErrorBoundary>
);

export default React.memo(WaiverIntelligenceWidgetWithErrorBoundary);
