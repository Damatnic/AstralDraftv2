
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { motion } from 'framer-motion';
import type { TradeOffer, League, TradeStory } from '../../types';
import { Modal } from '../ui/Modal';
import { generateTradeStory } from '../../services/geminiService';
import LoadingSpinner from '../ui/LoadingSpinner';
import ReactMarkdown from 'react-markdown';

interface TradeStoryModalProps {
    offer: TradeOffer;
    league: League;
    onClose: () => void;
}

const TradeStoryModal: React.FC<TradeStoryModalProps> = ({ offer, league, onClose }: any) => {
    const [story, setStory] = React.useState<TradeStory | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStory = async () => {
    try {

            setIsLoading(true);
            const result = await generateTradeStory(offer, league);
            setStory(result);
            setIsLoading(false);

    } catch (error) {
      console.error('Error in fetchStory:', error);

  };
        fetchStory();
    }, [offer, league]);

    return (
        <Modal isOpen={true} onClose={onClose}>
            <motion.div
                className="glass-pane rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col sm:px-4 md:px-6 lg:px-8"
                {...{
                    initial: { opacity: 0, scale: 0.95 },
                    animate: { opacity: 1, scale: 1 },
                }}
            >
                <header className="p-4 border-b border-[var(--panel-border)] text-center sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold font-display sm:px-4 md:px-6 lg:px-8">The Story of the Trade</h2>
                </header>
                <main className="p-6 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                    {isLoading ? <LoadingSpinner text="Analyzing the trade's fallout..." /> :
                     story ? (
                        <div className="prose prose-sm prose-invert prose-headings:text-cyan-300 prose-strong:text-yellow-300 sm:px-4 md:px-6 lg:px-8">
                           <h2>{story.title}</h2>
                           <p className="lead sm:px-4 md:px-6 lg:px-8"><strong>Winner Declared:</strong> {story.winnerDeclared}</p>
                           <ReactMarkdown>{story.narrative}</ReactMarkdown>
                        </div>
                     ) : (
                        <p className="text-center text-red-400 sm:px-4 md:px-6 lg:px-8">Could not generate a story for this trade.</p>
                     )}
                </main>
                 <footer className="p-4 border-t border-[var(--panel-border)] text-center sm:px-4 md:px-6 lg:px-8">
                    <button onClick={onClose} className="px-6 py-2 bg-cyan-500 text-black font-bold text-sm rounded-md sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
//                         Close
                    </button>
                </footer>
            </motion.div>
        </Modal>
    );
};

const TradeStoryModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TradeStoryModal {...props} />
  </ErrorBoundary>
);

export default React.memo(TradeStoryModalWithErrorBoundary);
