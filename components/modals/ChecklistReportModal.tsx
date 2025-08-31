
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React from 'react';
import { motion } from 'framer-motion';
import type { IntegrityTask, IntegrityTaskStatus } from '../../types';
import { Modal } from '../ui/Modal';
import { CheckCircleIcon } from '../icons/CheckCircleIcon';
import { XCircleIcon } from '../icons/XCircleIcon';

interface ChecklistReportModalProps {
    tasks: IntegrityTask[];
    onClose: () => void;

}

const StatusIcon = ({ status }: { status: IntegrityTaskStatus }) => {
    switch (status) {
        case 'passed': return <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />;
        case 'failed': return <XCircleIcon className="h-5 w-5 text-red-400 flex-shrink-0 sm:px-4 md:px-6 lg:px-8" />;
        case 'skipped': return <span className="h-5 w-5 text-gray-500 flex-shrink-0 sm:px-4 md:px-6 lg:px-8">-</span>;
        case 'pending':
        default:
            return <div className="w-4 h-4 border-2 border-gray-500 rounded-full flex-shrink-0 self-center sm:px-4 md:px-6 lg:px-8"></div>;
    }
};

const ChecklistReportModal: React.FC<ChecklistReportModalProps> = ({ tasks, onClose }) => {
    
    const groupedTasks = React.useMemo(() => {
        return tasks.reduce<Record<string, IntegrityTask[]>>((acc, task) => {
            if (!acc[task.category]) {
                acc[task.category] = [];
            }
            acc[task.category].push(task);
            return acc;
        }, {});
    }, [tasks]);
    
    const categories = Object.keys(groupedTasks);

    return (
        <Modal isOpen={true} onClose={onClose}>
            <motion.div
                className="glass-pane rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col sm:px-4 md:px-6 lg:px-8"
                onClick={e => e.stopPropagation()}
                animate={{ opacity: 1, scale: 1 }}
            >
                <header className="p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold font-display sm:px-4 md:px-6 lg:px-8">Project Integrity Checklist Status</h2>
                </header>
                <main className="flex-grow p-4 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                    <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        {categories.map((category: any) => (
                            <div key={category}>
                                <h3 className="font-bold text-cyan-300 mb-2 sm:px-4 md:px-6 lg:px-8">{category}</h3>
                                <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                                    {groupedTasks[category].map((task: any) => (
                                        <div key={task.id} className="flex items-start gap-3 text-sm p-2 bg-black/10 rounded-md sm:px-4 md:px-6 lg:px-8">
                                            <StatusIcon status={task?.status} />
                                            <span className={`${task?.status === 'pending' ? 'text-gray-400' : ''}`}>{task.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
                <footer className="p-4 border-t border-[var(--panel-border)] text-center sm:px-4 md:px-6 lg:px-8">
                    <button onClick={onClose} className="px-6 py-2 bg-cyan-500 text-black font-bold text-sm rounded-md sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                        Close
                    </button>
                </footer>
            </motion.div>
        </Modal>
    );
};

const ChecklistReportModalWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <ChecklistReportModal {...props} />
  </ErrorBoundary>
);

export default React.memo(ChecklistReportModalWithErrorBoundary);
