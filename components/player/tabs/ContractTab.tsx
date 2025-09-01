
import { ErrorBoundary } from '../../ui/ErrorBoundary';
import { motion } from 'framer-motion';
import type { Player } from '../../../types';
import { ContractIcon } from '../../icons/ContractIcon';

interface ContractTabProps {
    player: Player;


const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }: any) => (
    <div className="bg-white/5 p-4 rounded-lg text-center flex-1 sm:px-4 md:px-6 lg:px-8">
        <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{label}</p>
        <p className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{value}</p>
    </div>
);

const ContractTab: React.FC<ContractTabProps> = ({ player }: any) => {
    const { contract } = player;

    if (!contract) {
        return <p className="text-gray-500 text-center py-8 sm:px-4 md:px-6 lg:px-8">No contract information available for this player.</p>
    }

    return (
        <motion.div
            className="space-y-6 sm:px-4 md:px-6 lg:px-8"
            {...{
                initial: { opacity: 0, x: -10 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.3 },
            }}
        >
            <div>
                <h3 className="font-bold text-lg text-cyan-300 mb-2 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                    <ContractIcon /> Contract Details
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                    <StatCard label="Years" value={contract.years} />
                    <StatCard label="Total Value" value={contract.amount} />
                    <StatCard label="Guaranteed" value={contract.guaranteed} />
                </div>
            </div>
            <p className="text-xs text-gray-500 text-center sm:px-4 md:px-6 lg:px-8">
                Contract data is for informational purposes and may not reflect the most recent signings or restructures.
            </p>
        </motion.div>
    );
};

const ContractTabWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <ContractTab {...props} />
  </ErrorBoundary>
);

export default React.memo(ContractTabWithErrorBoundary);