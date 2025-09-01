

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo } from &apos;react&apos;;
import { motion, Reorder } from &apos;framer-motion&apos;;
import { Modal } from &apos;../ui/Modal&apos;;
import { useAppState } from &apos;../../contexts/AppContext&apos;;
import { LayoutIcon } from &apos;../icons/LayoutIcon&apos;;
import { DragHandleIcon } from &apos;../icons/DragHandleIcon&apos;;

interface CustomizeDashboardModalProps {
}
    onClose: () => void;

}

const widgetLabels: { [key: string]: string } = {
}
    whatsNext: "What&apos;s Next",
    leagues: &apos;My Leagues&apos;,
    mockDrafts: &apos;Mock Drafts&apos;,
    watchlist: &apos;My Watchlist&apos;,
    power: &apos;Power Balance&apos;,
    news: &apos;News Ticker&apos;,
    assistant: &apos;AI Assistant&apos;,
};

const CustomizeDashboardModal: React.FC<CustomizeDashboardModalProps> = ({ onClose }: any) => {
}
    const { state, dispatch } = useAppState();
    const [layout, setLayout] = React.useState(state.dashboardLayout);

    const handleSave = () => {
}
        dispatch({ type: &apos;UPDATE_DASHBOARD_LAYOUT&apos;, payload: layout });
        dispatch({ type: &apos;ADD_NOTIFICATION&apos;, payload: { message: &apos;Dashboard layout updated!&apos;, type: &apos;SYSTEM&apos; } });
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <motion.div
                className="glass-pane rounded-xl shadow-2xl w-full max-w-md sm:px-4 md:px-6 lg:px-8"
                {...{
}
                    initial: { opacity: 0, scale: 0.95 },
                    animate: { opacity: 1, scale: 1 },
                }}
            >
                <header className="p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold font-display flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <LayoutIcon />
                        Customize Dashboard
                    </h2>
                </header>
                <main className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <p className="text-xs text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">Drag and drop to reorder your dashboard widgets.</p>
                    <Reorder.Group axis="y" values={layout} onReorder={setLayout} className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                        {layout.map((widgetId: any) => (
}
                            <Reorder.Item 
                                key={widgetId} 
                                value={widgetId}
                                className="p-3 bg-black/20 rounded-lg flex items-center gap-3 cursor-grab active:cursor-grabbing sm:px-4 md:px-6 lg:px-8"
                            >
                                <DragHandleIcon className="text-gray-500 sm:px-4 md:px-6 lg:px-8" />
                                <span className="font-semibold sm:px-4 md:px-6 lg:px-8">{widgetLabels[widgetId] || widgetId}</span>
                            </Reorder.Item>
                        ))}
                    </Reorder.Group>
                </main>
                <footer className="p-4 flex justify-end gap-2 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold bg-transparent border border-transparent hover:border-[var(--panel-border)] rounded-md sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 text-sm font-bold bg-cyan-500 text-black rounded-md sm:px-4 md:px-6 lg:px-8" aria-label="Action button">Save Layout</button>
                </footer>
            </motion.div>
        </Modal>
    );
};

const CustomizeDashboardModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <CustomizeDashboardModal {...props} />
  </ErrorBoundary>
);

export default React.memo(CustomizeDashboardModalWithErrorBoundary);