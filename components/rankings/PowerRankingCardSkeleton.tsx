
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import SkeletonLoader from &apos;../SkeletonLoader&apos;;

const PowerRankingCardSkeleton: React.FC = () => {
}
    return (
        <div className="p-4 bg-white/5 rounded-lg flex gap-4 sm:px-4 md:px-6 lg:px-8">
            <div className="flex flex-col items-center flex-shrink-0 sm:px-4 md:px-6 lg:px-8">
                <SkeletonLoader className="w-10 h-10 mb-2 sm:px-4 md:px-6 lg:px-8" />
                <SkeletonLoader className="w-6 h-4 sm:px-4 md:px-6 lg:px-8" />
            </div>
            <div className="flex-grow sm:px-4 md:px-6 lg:px-8">
                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                    <SkeletonLoader className="w-10 h-10 rounded-lg sm:px-4 md:px-6 lg:px-8" />
                    <div className="w-full sm:px-4 md:px-6 lg:px-8">
                        <SkeletonLoader className="h-4 w-3/4 mb-2 sm:px-4 md:px-6 lg:px-8" />
                        <SkeletonLoader className="h-3 w-1/2 sm:px-4 md:px-6 lg:px-8" />
                    </div>
                </div>
                <div className="mt-3 space-y-1 sm:px-4 md:px-6 lg:px-8">
                    <SkeletonLoader className="h-3 w-full sm:px-4 md:px-6 lg:px-8" />
                    <SkeletonLoader className="h-3 w-5/6 sm:px-4 md:px-6 lg:px-8" />
                </div>
            </div>
        </div>
    );
};

const PowerRankingCardSkeletonWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <PowerRankingCardSkeleton {...props} />
  </ErrorBoundary>
);

export default React.memo(PowerRankingCardSkeletonWithErrorBoundary);
