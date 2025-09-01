
import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import type { Analytics } from &apos;../../types&apos;;
import AnimatedNumber from &apos;../ui/AnimatedNumber&apos;;
import { ZapIcon } from &apos;../icons/ZapIcon&apos;;
import { FlameIcon } from &apos;../icons/FlameIcon&apos;;
import { TrophyIcon } from &apos;../icons/TrophyIcon&apos;;
import { Tooltip } from &apos;../ui/Tooltip&apos;;

interface AnalyticsPanelProps {
}
  analytics: Analytics;

}

const AnalyticsCard: React.FC<{ icon: React.ReactNode; label: string; value: number; unit: string; color: string; tooltip: string; }> = ({ icon, label, value, unit, color, tooltip }: any) => (
    <div className={`p-2 bg-gray-800/50 rounded-lg flex items-center gap-3`}>
        <Tooltip content={tooltip}>
            <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-gray-900/50 ${color}`}>
                {icon}
            </div>
        </Tooltip>
        <div>
            <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{label}</p>
            <p className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">
                <AnimatedNumber value={value} />
                <span className="text-sm font-normal text-gray-400 sm:px-4 md:px-6 lg:px-8">{unit}</span>
            </p>
        </div>
    </div>
);

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({ analytics }: any) => {
}
  return (
    <div className="glass-pane flex-shrink-0 flex flex-col bg-gray-900/40 border border-cyan-300/20 rounded-2xl backdrop-blur-sm shadow-2xl shadow-black/50 sm:px-4 md:px-6 lg:px-8">
      <div className="flex-shrink-0 p-3 text-center border-b border-cyan-300/20 sm:px-4 md:px-6 lg:px-8">
        <h2 className="font-display text-xl font-bold text-white tracking-wider sm:px-4 md:px-6 lg:px-8">DRAFT ANALYTICS</h2>
      </div>
      <div className="p-2 space-y-2 sm:px-4 md:px-6 lg:px-8">
            <AnalyticsCard>
                icon={<ZapIcon />} 
                label="Draft Efficiency"
                value={analytics.draftEfficiency}
                unit="%"
                color="text-green-400"
                tooltip="Measures how well your picks align with expert rankings and ADP."
            />
             <AnalyticsCard>
                icon={<FlameIcon />} 
                label="Value Picks Found"
                value={analytics.valuePicks}
                unit=""
                color="text-orange-400"
                tooltip="Number of players drafted significantly later than their ADP."
            />
             <AnalyticsCard>
                icon={<TrophyIcon />} 
                label="Championship Prob."
                value={analytics.championshipProbability}
                unit="%"
                color="text-yellow-400"
                tooltip="An estimated probability of winning based on roster strength."
            />
      </div>
    </div>
  );
};

const AnalyticsPanelWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <AnalyticsPanel {...props} />
  </ErrorBoundary>
);

export default React.memo(AnalyticsPanelWithErrorBoundary);