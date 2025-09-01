
import { ErrorBoundary } from &apos;./ErrorBoundary&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { NewspaperIcon } from &apos;../icons/NewspaperIcon&apos;;
import { useLiveData } from &apos;../../hooks/useLiveData&apos;;
import { LiveNewsItem } from &apos;../../types&apos;;

const NewsTicker: React.FC = () => {
}
  const [isLoading, setIsLoading] = React.useState(false);
    const { latestNews } = useLiveData();
    const [headlines, setHeadlines] = React.useState<LiveNewsItem[]>([]);
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
}
        if (latestNews && !headlines.some((h: any) => h.id === latestNews.id)) {
}
            setHeadlines(prev => [latestNews, ...prev].slice(0, 10)); // Keep last 10
    }
  }, [latestNews, headlines]);

    React.useEffect(() => {
}
        if (headlines.length > 1) {
}
            const interval = setInterval(() => {
}
                setCurrentIndex((prevIndex: any) => (prevIndex + 1) % headlines.length);
    }
  }, 5000); // Change headline every 5 seconds
            return () => clearInterval(interval);

    }, [headlines.length]);

    if (headlines.length === 0) {
}
        return <div className="p-4 text-center text-sm text-[var(--text-secondary)] h-full flex items-center justify-center sm:px-4 md:px-6 lg:px-8">Awaiting latest news...</div>;

    const currentHeadline = headlines[currentIndex];

    return (
        <div className="p-4 overflow-hidden h-full flex items-center sm:px-4 md:px-6 lg:px-8">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentHeadline.id}
                    className="flex items-start gap-3 w-full sm:px-4 md:px-6 lg:px-8"
                    {...{
}
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 },
                        exit: { opacity: 0, y: -20 },
                        transition: { duration: 0.5, ease: &apos;easeInOut&apos; },
                    }}
                >
                    <NewspaperIcon className="w-5 h-5 mt-0.5 text-cyan-400 flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />
                    <div className="flex-grow sm:px-4 md:px-6 lg:px-8">
                        <p className="text-[var(--text-primary)] font-semibold sm:px-4 md:px-6 lg:px-8">{currentHeadline.headline}</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 sm:px-4 md:px-6 lg:px-8">{currentHeadline.source}</p>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const NewsTickerWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <NewsTicker {...props} />
  </ErrorBoundary>
);

export default React.memo(NewsTickerWithErrorBoundary);
