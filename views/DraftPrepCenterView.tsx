

import { useAppState } from &apos;../contexts/AppContext&apos;;
import { useLeague } from &apos;../hooks/useLeague&apos;;
import { Widget } from &apos;../components/ui/Widget&apos;;
import { Tabs } from &apos;../components/ui/Tabs&apos;;
import { AnimatePresence, motion } from &apos;framer-motion&apos;;
import MyRankingsEditor from &apos;../components/prep/MyRankingsEditor&apos;;
import MockDraftHistory from &apos;../components/prep/MockDraftHistory&apos;;
import DraftSimulationDemo from &apos;../components/draft/DraftSimulationDemo&apos;;

const DraftPrepCenterView: React.FC = () => {
}
    const { dispatch } = useAppState();
    const { league } = useLeague();
    const [activeTab, setActiveTab] = React.useState(&apos;rankings&apos;);

    if (!league) {
}
        return (
            <div className="p-8 text-center w-full h-full flex flex-col items-center justify-center">
                <p>Please select a league to prepare for your draft.</p>
                 <button onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;DASHBOARD&apos; }) className="mt-4 px-4 py-2 bg-cyan-500 rounded">
                    Back to Dashboard
                </button>
            </div>
        );

    const tabs = [
        { id: &apos;rankings&apos;, label: &apos;My Rankings&apos; },
        { id: &apos;ai_simulation&apos;, label: &apos;AI Draft Simulation&apos; },
        { id: &apos;mock_history&apos;, label: &apos;Mock Draft History&apos; },
    ];

    return (
        <div className="min-h-screen">
            {/* Navigation Header */}
            <div className="nav-header">
                <div className="flex justify-between items-center">
                    <div>
                        <h1>Draft Prep Center</h1>
                        <p className="page-subtitle">{league.name}</p>
                    </div>
                    <button 
                        onClick={() => dispatch({ type: &apos;SET_VIEW&apos;, payload: &apos;LEAGUE_HUB&apos; }) 
                        className="back-btn"
                    >
                        Back to League Hub
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                <div className="border-b border-slate-600 mb-6">
                    <Tabs items={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
                </div>
                <main>
                     <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            {...{
}
                                initial: { opacity: 0, y: 20 },
                                animate: { opacity: 1, y: 0 },
                                exit: { opacity: 0, y: -20 },
                                transition: { duration: 0.2 },
                            }}
                        >
                            {activeTab === &apos;rankings&apos; && <MyRankingsEditor leagueId={league.id} />}
                            {activeTab === &apos;ai_simulation&apos; && <DraftSimulationDemo />}
                            {activeTab === &apos;mock_history&apos; && <MockDraftHistory />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};

export default DraftPrepCenterView;
