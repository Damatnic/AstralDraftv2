

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';
import { Modal } from '../ui/Modal';
import { ClipboardListIcon } from '../icons/ClipboardListIcon';
import { CloseIcon } from '../icons/CloseIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';

interface CreatePollModalProps {
    leagueId: string;
    onClose: () => void;

}

const CreatePollModal: React.FC<CreatePollModalProps> = ({ leagueId, onClose }) => {
    const { state, dispatch } = useAppState();
    const [question, setQuestion] = React.useState('');
    const [options, setOptions] = React.useState(['', '']);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length < 5) {
            setOptions([...options, '']);

    };
    
    const removeOption = (index: number) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));

    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim() || options.some((opt: any) => !opt.trim())) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: { message: "Question and all options must be filled out.", type: 'SYSTEM' } });
            return;

        dispatch({
            type: 'CREATE_POLL',
            payload: {
                leagueId,
                poll: {
                    question,
                    options: options.map((opt: any) => ({ id: `opt_${Math.random()}`, text: opt, votes: [] })),
                    createdBy: state.user?.id || 'guest',
                    closesAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
                },
            },
        });
        dispatch({ type: 'ADD_NOTIFICATION', payload: { message: "Poll created successfully!", type: 'SYSTEM' } });
        onClose();
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <motion.form
                onSubmit={handleSubmit}
                onClick={e => e.stopPropagation()},
                    animate: { opacity: 1, scale: 1 },
                }}
            >
                <header className="p-4 border-b border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold font-display flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                        <ClipboardListIcon /> Create New Poll
                    </h2>
                </header>
                <main className="p-4 space-y-4 sm:px-4 md:px-6 lg:px-8">
                    <div>
                        <label htmlFor="poll-question" className="block text-sm font-medium text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Poll Question</label>
                        <input
                            id="poll-question"
                            type="text"
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            placeholder="e.g., Biggest upset this week?"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1 sm:px-4 md:px-6 lg:px-8">Options</label>
                        <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                            {options.map((opt, index) => (
                                <div key={index} className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                    <input
                                        type="text"
                                        value={opt}
                                        onChange={e => handleOptionChange(index, e.target.value)}
                                        placeholder={`Option ${index + 1}`}
                                    />
                                    {options.length > 2 && (
                                        <button type="button" onClick={() => removeOption(index)} className="mobile-touch-target p-3 text-red-400 hover:bg-red-500/10 rounded-full sm:px-4 md:px-6 lg:px-8" aria-label="Remove option"><CloseIcon /></button>
                                    )}
                                </div>
                            ))}
                        </div>
                         {options.length < 5 && (
                            <button type="button" onClick={addOption} className="mt-2 flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200 sm:px-4 md:px-6 lg:px-8">
                                <PlusCircleIcon /> Add Option
                            </button>
                        )}
                    </div>
                </main>
                 <footer className="p-4 flex justify-end gap-2 border-t border-[var(--panel-border)] sm:px-4 md:px-6 lg:px-8">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold bg-transparent border border-transparent hover:border-[var(--panel-border)] rounded-md sm:px-4 md:px-6 lg:px-8">Cancel</button>
                    <button type="submit" className="px-4 py-2 text-sm font-bold bg-cyan-500 text-black rounded-md sm:px-4 md:px-6 lg:px-8">Post Poll</button>
                </footer>
            </motion.form>
        </Modal>
    );
};

const CreatePollModalWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <CreatePollModal {...props} />
  </ErrorBoundary>
);

export default React.memo(CreatePollModalWithErrorBoundary);
