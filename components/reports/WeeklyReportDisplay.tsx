

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import type { WeeklyReportData } from &apos;../../types&apos;;
import { TrophyIcon } from &apos;../icons/TrophyIcon&apos;;
import { FlameIcon } from &apos;../icons/FlameIcon&apos;;
import { ZapIcon } from &apos;../icons/ZapIcon&apos;;

interface WeeklyReportDisplayProps {
}
    report: WeeklyReportData;

}

const WeeklyReportDisplay: React.FC<WeeklyReportDisplayProps> = ({ report }: any) => {
}
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-6">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 via-cyan-300 to-indigo-400 sm:px-4 md:px-6 lg:px-8">
                    {report.title}
                </span>
            </h2>

            <div className="max-w-3xl mx-auto sm:px-4 md:px-6 lg:px-8">
                <p className="text-sm text-gray-300 leading-relaxed mb-8 whitespace-pre-wrap text-center italic sm:px-4 md:px-6 lg:px-8">
                    "{report.summary}"
                </p>
                
                {report.powerPlay && (
}
                    <div className="mb-8 p-4 bg-purple-500/10 border border-purple-400/20 rounded-lg text-center sm:px-4 md:px-6 lg:px-8">
                        <h3 className="font-bold text-lg text-purple-300 mb-1 flex items-center justify-center gap-2 sm:px-4 md:px-6 lg:px-8"><ZapIcon /> Power Play of the Week</h3>
                        <p className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">{report.powerPlay.move} by {report.powerPlay.teamName}</p>
                        <p className="text-xs text-gray-400 mt-1 italic sm:px-4 md:px-6 lg:px-8">"{report.powerPlay.rationale}"</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Game of the Week */}
                    <div className="bg-white/5 p-4 rounded-lg flex flex-col items-center text-center sm:px-4 md:px-6 lg:px-8">
                        <FlameIcon />
                        <h3 className="font-bold text-lg text-cyan-300 mt-2 mb-1 sm:px-4 md:px-6 lg:px-8">Game of the Week</h3>
                        <p className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">{report.gameOfWeek.teamAName} vs. {report.gameOfWeek.teamBName}</p>
                        <p className="text-xs text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">"{report.gameOfWeek.reason}"</p>
                    </div>

                    {/* Player of the Week */}
                    <div className="bg-white/5 p-4 rounded-lg flex flex-col items-center text-center sm:px-4 md:px-6 lg:px-8">
                        <TrophyIcon />
                        <h3 className="font-bold text-lg text-yellow-300 mt-2 mb-1 sm:px-4 md:px-6 lg:px-8">Player of the Week</h3>
                        <p className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">{report.playerOfWeek.playerName}</p>
                        <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{report.playerOfWeek.teamName} - {report.playerOfWeek.stats} points</p>
                        <p className="text-xs text-gray-400 mt-1 sm:px-4 md:px-6 lg:px-8">"{report.playerOfWeek.reason}"</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WeeklyReportDisplayWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <WeeklyReportDisplay {...props} />
  </ErrorBoundary>
);

export default React.memo(WeeklyReportDisplayWithErrorBoundary);