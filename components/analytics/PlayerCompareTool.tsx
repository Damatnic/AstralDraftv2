

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo } from 'react';
import type { Player } from '../../types';
import { Modal } from '../ui/Modal';

interface PlayerCompareToolProps {
    players: Player[];
    onClose: () => void;
}

const PlayerCompareTool: React.FC<PlayerCompareToolProps> = ({ players, onClose }: any) => {

    const renderStatRow = (label: string, data: (string | number | undefined)[], higherIsBetter = true) => {
        let bestValue: string | number | undefined;
        const numericValues = data.filter((v: any) => typeof v === 'number') as number[];

        if (numericValues.length > 1) {
            bestValue = higherIsBetter ? Math.max(...numericValues) : Math.min(...numericValues);

        return (
             <tr className="border-t border-white/10 sm:px-4 md:px-6 lg:px-8">
                <td className="p-3 font-semibold text-gray-300 text-sm whitespace-nowrap sm:px-4 md:px-6 lg:px-8">{label}</td>
                {data.map((val, i) => (
                    <td key={i} className={`p-3 text-center text-sm ${val === bestValue ? 'font-bold text-green-400' : 'text-white'}`}>
                        {val ?? 'N/A'}
                    </td>
                ))}
            </tr>
        )
    }

    return (
        <Modal isOpen={true} onClose={onClose}>
            <div className="glass-pane p-4 sm:p-6 rounded-2xl w-full max-w-5xl max-h-[85vh] flex flex-col">
                <h2 className="font-display text-2xl font-bold mb-4 text-center sm:px-4 md:px-6 lg:px-8">Player Comparison</h2>
                <div className="overflow-y-auto mobile-scroll custom-scrollbar sm:px-4 md:px-6 lg:px-8">
                    <table className="w-full min-w-max text-sm border-separate border-spacing-0 sm:px-4 md:px-6 lg:px-8">
                        <thead>
                            <tr>
                                <th className="sticky top-0 text-left p-3 bg-[var(--panel-bg)]/80 backdrop-blur-sm z-10 sm:px-4 md:px-6 lg:px-8">Metric</th>
                                {players.map((p: any) => (
                                    <th key={p.id} className="sticky top-0 text-center p-3 bg-[var(--panel-bg)]/80 backdrop-blur-sm z-10 sm:px-4 md:px-6 lg:px-8">
                                        <p className="font-bold text-cyan-300 text-base sm:px-4 md:px-6 lg:px-8">{p.name}</p>
                                        <p className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{p.position} - {p.team}</p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Basic Info */}
                            {renderStatRow("Rank", players.map((p: any) => p.rank), false)}
                            {renderStatRow("Tier", players.map((p: any) => p?.tier), false)}
                            {renderStatRow("ADP", players.map((p: any) => p?.adp), false)}
                            {renderStatRow("Bye", players.map((p: any) => p.bye), false)}
                            {renderStatRow("Age", players.map((p: any) => p?.age), false)}

                             {/* Separator */}
                            <tr className="h-4 sm:px-4 md:px-6 lg:px-8"><td colSpan={players.length + 1}></td></tr>
                            
                            {/* Projections */}
                            {renderStatRow("Projection", players.map((p: any) => p.stats.projection), true)}
                            {renderStatRow("Auction Value", players.map((p: any) => p.auctionValue), true)}
                            {renderStatRow("Value Over Replacement", players.map((p: any) => p.stats.vorp), true)}
                            {renderStatRow("Last Year Pts", players.map((p: any) => p.stats.lastYear), true)}

                            {/* Separator */}
                            <tr className="h-4 sm:px-4 md:px-6 lg:px-8"><td colSpan={players.length + 1}></td></tr>

                            {/* Scouting */}
                             <tr className="border-t border-white/10 sm:px-4 md:px-6 lg:px-8">
                                <td className="p-3 font-semibold text-gray-300 text-sm align-top sm:px-4 md:px-6 lg:px-8">Bio</td>
                                {players.map((p, i) => (
                                    <td key={i} className="p-3 text-left text-xs text-gray-300 align-top sm:px-4 md:px-6 lg:px-8">
                                        {p.bio ?? 'N/A'}
                                    </td>
                                ))}
                            </tr>
                             <tr className="border-t border-white/10 sm:px-4 md:px-6 lg:px-8">
                                <td className="p-3 font-semibold text-gray-300 text-sm align-top sm:px-4 md:px-6 lg:px-8">Scouting</td>
                                {players.map((p, i) => (
                                    <td key={i} className="p-3 text-left text-xs text-gray-300 align-top sm:px-4 md:px-6 lg:px-8">
                                        {p.scoutingReport?.summary ?? 'N/A'}
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
                 <div className="mt-6 text-center sm:px-4 md:px-6 lg:px-8">
                    <button type="button" onClick={(e: any) => { e.preventDefault(); onClose(); }} aria-label="Close comparison" className="px-6 py-2 bg-cyan-500 text-black font-bold text-sm rounded-md min-h-[44px] min-w-[88px] flex items-center justify-center mx-auto sm:px-4 md:px-6 lg:px-8">
//                         Done
                    </button>
                </div>
            </div>
        </Modal>
    );
};

const PlayerCompareToolWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <PlayerCompareTool {...props} />
  </ErrorBoundary>
);

export default React.memo(PlayerCompareToolWithErrorBoundary);
}
