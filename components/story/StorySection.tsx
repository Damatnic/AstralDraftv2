
import { ErrorBoundary } from '../ui/ErrorBoundary';

interface StorySectionProps {
    title: string;
    children: React.ReactNode;


const StorySection: React.FC<StorySectionProps> = ({ title, children }: any) => {
    return (
        <section>
            <h2 className="font-display text-2xl font-bold mb-4 border-b-2 border-cyan-400/30 pb-2 sm:px-4 md:px-6 lg:px-8">
                {title}
            </h2>
            {children}
        </section>
    );
};

const StorySectionWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <StorySection {...props} />
  </ErrorBoundary>
);

export default React.memo(StorySectionWithErrorBoundary);
