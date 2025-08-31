

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Player } from '../../../types';
import { ContractIcon } from '../../icons/ContractIcon';

interface ScoutingTabProps {
  player: Player;

}

const ScoutingTab: React.FC<ScoutingTabProps> = ({ player }) => {
  const { scoutingReport: report, contract } = player;

  if (!report) {
      return <p className="text-gray-500 sm:px-4 md:px-6 lg:px-8">No scouting report available for this player.</p>

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
        <h3 className="font-bold text-lg text-cyan-300 mb-2 sm:px-4 md:px-6 lg:px-8">Scouting Summary</h3>
        <p className="text-gray-300 text-sm italic sm:px-4 md:px-6 lg:px-8">"{report.summary}"</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-green-400 mb-2 sm:px-4 md:px-6 lg:px-8">Strengths</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">
            {report.strengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-red-400 mb-2 sm:px-4 md:px-6 lg:px-8">Weaknesses</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300 sm:px-4 md:px-6 lg:px-8">
             {report.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>
      </div>

      {contract && (
        <div>
            <h3 className="font-bold text-lg text-cyan-300 mb-2 flex items-center gap-2 sm:px-4 md:px-6 lg:px-8"><ContractIcon /> Contract Details</h3>
            <div className="text-sm bg-white/5 p-4 rounded-lg flex justify-around sm:px-4 md:px-6 lg:px-8">
                <div><span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Years: </span><strong className="text-white sm:px-4 md:px-6 lg:px-8">{contract.years}</strong></div>
                <div><span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Value: </span><strong className="text-white sm:px-4 md:px-6 lg:px-8">{contract.amount}</strong></div>
                <div><span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Guaranteed: </span><strong className="text-white sm:px-4 md:px-6 lg:px-8">{contract.guaranteed}</strong></div>
            </div>
        </div>
      )}

    </motion.div>
  );
};

const ScoutingTabWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <ScoutingTab {...props} />
  </ErrorBoundary>
);

export default React.memo(ScoutingTabWithErrorBoundary);