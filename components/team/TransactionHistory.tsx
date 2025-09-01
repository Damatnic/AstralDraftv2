/**
 * Transaction History
 * Complete history of adds, drops, trades, and waiver claims
 */

import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useMemo } from &apos;react&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { Widget } from &apos;../ui/Widget&apos;;
import { Avatar } from &apos;../ui/Avatar&apos;;
import { Team, League, Player } from &apos;../../types&apos;;
import { ClockIcon } from &apos;../icons/ClockIcon&apos;;
import { ArrowRightLeftIcon } from &apos;../icons/ArrowRightLeftIcon&apos;;
import { UserPlusIcon } from &apos;../icons/UserPlusIcon&apos;;
import { UserRemoveIcon } from &apos;../icons/UserRemoveIcon&apos;;
import { DollarSignIcon } from &apos;../icons/DollarSignIcon&apos;;

interface TransactionHistoryProps {
}
    team: Team;
    league: League;
    dispatch: React.Dispatch<any>;

}

interface Transaction {
}
    id: string;
    type: &apos;ADD&apos; | &apos;DROP&apos; | &apos;TRADE&apos; | &apos;WAIVER&apos; | &apos;DRAFT&apos; | &apos;KEEPER&apos;;
    date: string;
    week: number;
    description: string;
    playerIn?: Player;
    playerOut?: Player;
    tradingPartner?: Team;
    cost?: number;
    status: &apos;COMPLETED&apos; | &apos;PENDING&apos; | &apos;CANCELLED&apos;;
    details?: string;}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ team, league, dispatch }: any) => {
}
    const [filterType, setFilterType] = React.useState<&apos;ALL&apos; | Transaction[&apos;type&apos;]>(&apos;ALL&apos;);
    const [filterWeek, setFilterWeek] = React.useState<&apos;ALL&apos; | number>(&apos;ALL&apos;);
    const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);

    // Mock transaction data - in real app this would come from the backend
    const mockTransactions: Transaction[] = [
        {
}
            id: &apos;1&apos;,
            type: &apos;WAIVER&apos;,
            date: &apos;2024-09-15T10:30:00Z&apos;,
            week: 2,
            description: &apos;Claimed Jordan Mason from waivers&apos;,
            playerIn: { id: 101, name: &apos;Jordan Mason&apos;, position: &apos;RB&apos;, team: &apos;SF&apos;, rank: 45, adp: 120, bye: 9, tier: 3, age: 25, auctionValue: 8, stats: { projection: 12.5, lastYear: 8.2, vorp: 2.1, weeklyProjections: {} } } as Player,
            cost: 15,
            status: &apos;COMPLETED&apos;,
            details: &apos;FAAB bid: $15 (3rd highest bid)&apos;
        },
        {
}
            id: &apos;2&apos;,
            type: &apos;DROP&apos;,
            date: &apos;2024-09-15T10:30:00Z&apos;,
            week: 2,
            description: &apos;Dropped Tyler Allgeier&apos;,
            playerOut: { id: 102, name: &apos;Tyler Allgeier&apos;, position: &apos;RB&apos;, team: &apos;ATL&apos;, rank: 78, adp: 145, bye: 12, tier: 4, age: 24, auctionValue: 3, stats: { projection: 6.8, lastYear: 9.1, vorp: -1.2, weeklyProjections: {} } } as Player,
            status: &apos;COMPLETED&apos;
        },
        {
}
            id: &apos;3&apos;,
            type: &apos;TRADE&apos;,
            date: &apos;2024-09-08T14:15:00Z&apos;,
            week: 1,
            description: &apos;Traded with Thunder Bolts&apos;,
            playerIn: { id: 103, name: &apos;Diontae Johnson&apos;, position: &apos;WR&apos;, team: &apos;CAR&apos;, rank: 25, adp: 65, bye: 11, tier: 2, age: 28, auctionValue: 18, stats: { projection: 14.8, lastYear: 16.2, vorp: 4.5, weeklyProjections: {} } } as Player,
            playerOut: { id: 104, name: &apos;Calvin Ridley&apos;, position: &apos;WR&apos;, team: &apos;TEN&apos;, rank: 32, adp: 72, bye: 5, tier: 3, age: 29, auctionValue: 16, stats: { projection: 13.2, lastYear: 15.8, vorp: 3.1, weeklyProjections: {} } } as Player,
            tradingPartner: {
}
                id: 3, 
                name: &apos;Thunder Bolts&apos;, 
                owner: { id: &apos;3&apos;, name: &apos;Carol Davis&apos;, avatar: &apos;👩&apos; }, 
                avatar: &apos;⚡&apos;,
                roster: [],
                budget: 0,
                faab: 0,
                record: { wins: 0, losses: 0, ties: 0 },
                futureDraftPicks: []
            } as Team,
            status: &apos;COMPLETED&apos;,
            details: &apos;Also received 2025 3rd round pick&apos;
        },
        {
}
            id: &apos;4&apos;,
            type: &apos;ADD&apos;,
            date: &apos;2024-09-01T09:00:00Z&apos;,
            week: 1,
            description: &apos;Added Kendre Miller from free agency&apos;,
            playerIn: { id: 105, name: &apos;Kendre Miller&apos;, position: &apos;RB&apos;, team: &apos;NO&apos;, rank: 89, adp: 180, bye: 12, tier: 5, age: 22, auctionValue: 1, stats: { projection: 5.2, lastYear: 0, vorp: -2.1, weeklyProjections: {} } } as Player,
            status: &apos;COMPLETED&apos;
        },
        {
}
            id: &apos;5&apos;,
            type: &apos;DRAFT&apos;,
            date: &apos;2024-08-28T19:45:00Z&apos;,
            week: 0,
            description: &apos;Drafted Christian McCaffrey (1st overall)&apos;,
            playerIn: { id: 106, name: &apos;Christian McCaffrey&apos;, position: &apos;RB&apos;, team: &apos;SF&apos;, rank: 1, adp: 1, bye: 9, tier: 1, age: 28, auctionValue: 65, stats: { projection: 22.8, lastYear: 24.2, vorp: 8.9, weeklyProjections: {} } } as Player,
            status: &apos;COMPLETED&apos;,
            details: &apos;Round 1, Pick 1&apos;

    ];

    const filteredTransactions = mockTransactions.filter((transaction: any) => {
}
        if (filterType !== &apos;ALL&apos; && transaction.type !== filterType) return false;
        if (filterWeek !== &apos;ALL&apos; && transaction.week !== filterWeek) return false;
        return true;
    });

    const getTransactionIcon = (type: Transaction[&apos;type&apos;]) => {
}
        switch (type) {
}
            case &apos;ADD&apos;:
                return <UserPlusIcon className="w-5 h-5 text-green-400 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;DROP&apos;:
                return <UserRemoveIcon className="w-5 h-5 text-red-400 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;TRADE&apos;:
                return <ArrowRightLeftIcon className="w-5 h-5 text-blue-400 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;WAIVER&apos;:
                return <DollarSignIcon className="w-5 h-5 text-yellow-400 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;DRAFT&apos;:
                return <UserPlusIcon className="w-5 h-5 text-purple-400 sm:px-4 md:px-6 lg:px-8" />;
            case &apos;KEEPER&apos;:
                return <UserPlusIcon className="w-5 h-5 text-cyan-400 sm:px-4 md:px-6 lg:px-8" />;
            default:
                return <ClockIcon className="w-5 h-5 text-gray-400 sm:px-4 md:px-6 lg:px-8" />;

    };

    const getTransactionColor = (type: Transaction[&apos;type&apos;]) => {
}
        switch (type) {
}
            case &apos;ADD&apos;:
            case &apos;DRAFT&apos;:
            case &apos;KEEPER&apos;:
                return &apos;border-l-green-500 bg-green-500/5&apos;;
            case &apos;DROP&apos;:
                return &apos;border-l-red-500 bg-red-500/5&apos;;
            case &apos;TRADE&apos;:
                return &apos;border-l-blue-500 bg-blue-500/5&apos;;
            case &apos;WAIVER&apos;:
                return &apos;border-l-yellow-500 bg-yellow-500/5&apos;;
            default:
                return &apos;border-l-gray-500 bg-gray-500/5&apos;;

    };

    const formatDate = (dateString: string) => {
}
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(&apos;en-US&apos;, {
}
            month: &apos;short&apos;,
            day: &apos;numeric&apos;,
            hour: &apos;numeric&apos;,
            minute: &apos;2-digit&apos;,
            hour12: true
        }).format(date);
    };

    const transactionTypes = [&apos;ALL&apos;, &apos;ADD&apos;, &apos;DROP&apos;, &apos;TRADE&apos;, &apos;WAIVER&apos;, &apos;DRAFT&apos;, &apos;KEEPER&apos;] as const;
    const availableWeeks = Array.from(new Set(mockTransactions.map((t: any) => t.week))).sort((a, b) => b - a);

    return (
        <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
            {/* Summary Stats */}
            <Widget title="Transaction Summary">
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-green-500/20 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">
                                {mockTransactions.filter((t: any) => [&apos;ADD&apos;, &apos;WAIVER&apos;, &apos;DRAFT&apos;, &apos;KEEPER&apos;].includes(t.type)).length}
                            </div>
                            <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Players Acquired</div>
                        </div>
                        <div className="text-center p-3 bg-red-500/20 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-red-400 sm:px-4 md:px-6 lg:px-8">
                                {mockTransactions.filter((t: any) => t.type === &apos;DROP&apos;).length}
                            </div>
                            <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Players Dropped</div>
                        </div>
                        <div className="text-center p-3 bg-blue-500/20 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">
                                {mockTransactions.filter((t: any) => t.type === &apos;TRADE&apos;).length}
                            </div>
                            <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">Trades Made</div>
                        </div>
                        <div className="text-center p-3 bg-yellow-500/20 rounded-lg sm:px-4 md:px-6 lg:px-8">
                            <div className="text-2xl font-bold text-yellow-400 sm:px-4 md:px-6 lg:px-8">
                                ${mockTransactions.filter((t: any) => t.type === &apos;WAIVER&apos;).reduce((sum, t) => sum + (t.cost || 0), 0)}
                            </div>
                            <div className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">FAAB Spent</div>
                        </div>
                    </div>
                </div>
            </Widget>

            {/* Filters */}
            <Widget title="Transaction History">
                <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                            <label htmlFor="filter-type" className="block text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                Filter by Type
                            </label>
                            <select
                                id="filter-type"
                                value={filterType}
                                onChange={(e: any) => setFilterType(e.target.value as any)}
                            >
                                {transactionTypes.map((type: any) => (
}
                                    <option key={type} value={type}>
                                        {type === &apos;ALL&apos; ? &apos;All Types&apos; : type.charAt(0) + type.slice(1).toLowerCase()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                            <label htmlFor="filter-week" className="block text-sm font-medium text-[var(--text-secondary)] mb-2 sm:px-4 md:px-6 lg:px-8">
                                Filter by Week
                            </label>
                            <select
                                id="filter-week"
                                value={filterWeek}
                                onChange={(e: any) => setFilterWeek(e.target.value === &apos;ALL&apos; ? &apos;ALL&apos; : Number(e.target.value))}
                            >
                                <option value="ALL">All Weeks</option>
                                {availableWeeks.map((week: any) => (
}
                                    <option key={week} value={week}>
                                        {week === 0 ? &apos;Pre-Season&apos; : `Week ${week}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Transaction List */}
                    <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        {filteredTransactions.length === 0 ? (
}
                            <div className="text-center py-8 sm:px-4 md:px-6 lg:px-8">
                                <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-3 sm:px-4 md:px-6 lg:px-8" />
                                <p className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">No transactions found with current filters</p>
                            </div>
                        ) : (
                            filteredTransactions.map((transaction: any) => (
                                <motion.div
                                    key={transaction.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 border-l-4 rounded-lg cursor-pointer transition-all hover:bg-white/5 ${getTransactionColor(transaction.type)}`}
                                    onClick={() => setSelectedTransaction(transaction)}
                                >
                                    <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                                        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                                            {getTransactionIcon(transaction.type)}
                                            <div>
                                                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                                    <h4 className="font-medium text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                                        {transaction.description}
                                                    </h4>
                                                    {(() => {
}
                                                        const getStatusClass = () => {
}
                                                            if (transaction?.status === &apos;COMPLETED&apos;) return &apos;bg-green-500/20 text-green-400&apos;;
                                                            if (transaction?.status === &apos;PENDING&apos;) return &apos;bg-yellow-500/20 text-yellow-400&apos;;
                                                            return &apos;bg-red-500/20 text-red-400&apos;;
                                                        };
                                                        return (
                                                            <span className={`px-2 py-1 rounded text-xs ${getStatusClass()}`}>
                                                                {transaction?.status}
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mt-1 sm:px-4 md:px-6 lg:px-8">
                                                    <span>{formatDate(transaction.date)}</span>
                                                    <span>{transaction.week === 0 ? &apos;Pre-Season&apos; : `Week ${transaction.week}`}</span>
                                                    {Boolean(transaction.cost) && (
}
                                                        <span className="text-yellow-400 sm:px-4 md:px-6 lg:px-8">Cost: ${transaction.cost}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                            {transaction.playerIn && (
}
                                                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                                    <Avatar>
                                                        avatar={transaction.playerIn.astralIntelligence?.spiritAnimal?.[0] || &apos;🏈&apos;}
                                                        className="w-8 h-8 text-lg rounded-md sm:px-4 md:px-6 lg:px-8"
                                                    />
                                                    <span className="text-green-400 text-sm sm:px-4 md:px-6 lg:px-8">+{transaction.playerIn.name}</span>
                                                </div>
                                            )}
                                            {transaction.type === &apos;TRADE&apos; && <ArrowRightLeftIcon className="w-4 h-4 text-gray-400 sm:px-4 md:px-6 lg:px-8" />}
                                            {transaction.playerOut && (
}
                                                <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                                    <Avatar>
                                                        avatar={transaction.playerOut.astralIntelligence?.spiritAnimal?.[0] || &apos;🏈&apos;}
                                                        className="w-8 h-8 text-lg rounded-md sm:px-4 md:px-6 lg:px-8"
                                                    />
                                                    <span className="text-red-400 text-sm sm:px-4 md:px-6 lg:px-8">-{transaction.playerOut.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </Widget>

            {/* Transaction Details Modal */}
            <AnimatePresence>
                {selectedTransaction && (
}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 sm:px-4 md:px-6 lg:px-8"
                        onClick={(e: any) => e.target === e.currentTarget && setSelectedTransaction(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-lg shadow-xl p-6 max-w-2xl w-full sm:px-4 md:px-6 lg:px-8"
                        >
                            <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                                <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                                    {getTransactionIcon(selectedTransaction.type)}
                                    <h3 className="text-xl font-bold text-[var(--text-primary)] sm:px-4 md:px-6 lg:px-8">
                                        Transaction Details
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setSelectedTransaction(null)}
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                                <div>
                                    <h4 className="font-semibold text-[var(--text-primary)] mb-2 sm:px-4 md:px-6 lg:px-8">Summary</h4>
                                    <p className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{selectedTransaction.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 sm:px-4 md:px-6 lg:px-8">
                                    <div>
                                        <h5 className="font-medium text-[var(--text-primary)] mb-1 sm:px-4 md:px-6 lg:px-8">Date & Time</h5>
                                        <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{formatDate(selectedTransaction.date)}</p>
                                    </div>
                                    <div>
                                        <h5 className="font-medium text-[var(--text-primary)] mb-1 sm:px-4 md:px-6 lg:px-8">Week</h5>
                                        <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">
                                            {selectedTransaction.week === 0 ? &apos;Pre-Season&apos; : `Week ${selectedTransaction.week}`}
                                        </p>
                                    </div>
                                </div>

                                {selectedTransaction.tradingPartner && (
}
                                    <div>
                                        <h5 className="font-medium text-[var(--text-primary)] mb-1 sm:px-4 md:px-6 lg:px-8">Trading Partner</h5>
                                        <div className="flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
                                            <Avatar avatar={selectedTransaction.tradingPartner.avatar} className="w-8 h-8 text-lg rounded-md sm:px-4 md:px-6 lg:px-8" />
                                            <span className="text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{selectedTransaction.tradingPartner.name}</span>
                                        </div>
                                    </div>
                                )}

                                {selectedTransaction.details && (
}
                                    <div>
                                        <h5 className="font-medium text-[var(--text-primary)] mb-1 sm:px-4 md:px-6 lg:px-8">Additional Details</h5>
                                        <p className="text-sm text-[var(--text-secondary)] sm:px-4 md:px-6 lg:px-8">{selectedTransaction.details}</p>
                                    </div>
                                )}

                                <div className="flex justify-end sm:px-4 md:px-6 lg:px-8">
                                    <button
                                        onClick={() => setSelectedTransaction(null)}
                                    >
//                                         Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TransactionHistoryWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <TransactionHistory {...props} />
  </ErrorBoundary>
);

export default React.memo(TransactionHistoryWithErrorBoundary);
