import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import type { Player } from &apos;../../types&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;

interface StoryHighlightCardProps {
}
    icon: React.ReactNode;
    title: string;
    description: string;
    player?: Player | null;

}

const StoryHighlightCard: React.FC<StoryHighlightCardProps> = ({ icon, title, description, player }: any) => {
}
    return (
        <div className="glass-pane p-4 rounded-xl flex items-start gap-4 sm:px-4 md:px-6 lg:px-8">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-cyan-400/10 text-cyan-300 rounded-lg text-2xl sm:px-4 md:px-6 lg:px-8">
                {icon}
            </div>
            <div className="flex-grow sm:px-4 md:px-6 lg:px-8">
                <h4 className="font-bold text-lg text-white sm:px-4 md:px-6 lg:px-8">{title}</h4>
                {player && (
}
                    <div className="flex items-center gap-2 my-1 sm:px-4 md:px-6 lg:px-8">
                        <Avatar avatar={player.astralIntelligence?.spiritAnimal?.split(&apos;,&apos;)[0] || &apos;🏈&apos;} className="w-8 h-8 text-xl rounded-md sm:px-4 md:px-6 lg:px-8" />
                        <div>
                             <p className="font-semibold text-base sm:px-4 md:px-6 lg:px-8">{player.name}</p>
                             <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{player.position} - {player.team}</p>
                        </div>
                    </div>
                )}
                <p className="text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">{description}</p>
            </div>
        </div>
    );
};

const StoryHighlightCardWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <StoryHighlightCard {...props} />
  </ErrorBoundary>
);

export default React.memo(StoryHighlightCardWithErrorBoundary);