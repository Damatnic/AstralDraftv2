
import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo } from 'react';
import { DndContext, closestCenter, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useAppState } from '../../contexts/AppContext';
import { players as allPlayers } from '../../data/players';
import type { Player, PlayerPosition, CustomRanking } from '../../types';
import { DragHandleIcon } from '../icons/DragHandleIcon';

const positionOrder: PlayerPosition[] = ['QB', 'RB', 'WR', 'TE', 'K', 'DST'];

interface SortableItemProps {
    player: Player;
    rank: number;

}

const SortableItem: React.FC<SortableItemProps> = ({ player, rank }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: player.id });
    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        transition,
        zIndex: isDragging ? 100 : 'auto',
    };

    return (
        <div ref={setNodeRef} style={style} className={`p-1.5 bg-white/5 rounded-md flex items-center gap-2 ${isDragging ? 'shadow-lg' : ''}`}>
            <div {...attributes} {...listeners} className="p-1 cursor-grab active:cursor-grabbing text-gray-500 sm:px-4 md:px-6 lg:px-8">
                <DragHandleIcon />
            </div>
            <span className="w-6 text-center text-xs font-mono text-gray-400 sm:px-4 md:px-6 lg:px-8">{rank}</span>
            <span className="font-semibold text-sm sm:px-4 md:px-6 lg:px-8">{player.name}</span>
            <span className="text-xs text-gray-500 ml-auto sm:px-4 md:px-6 lg:px-8">{player.position} - {player.team}</span>
        </div>
    );
};

const MyRankingsEditor: React.FC<{ leagueId: string }> = ({ leagueId }) => {
    const { state, dispatch } = useAppState();
    const [activePosition, setActivePosition] = React.useState<PlayerPosition>('RB');
    const [rankedPlayers, setRankedPlayers] = React.useState<Player[]>([]);
    
    const customRanks = state.customRankings[leagueId] || {};

    React.useEffect(() => {
        const playersForPosition = allPlayers.filter((p: any) => p.position === activePosition);
        playersForPosition.sort((a, b) => {
            const rankA = customRanks[a.id] ?? a.rank;
            const rankB = customRanks[b.id] ?? b.rank;
            if(rankA !== rankB) return rankA - rankB;
            return a.rank - b.rank;
        });
        setRankedPlayers(playersForPosition);
    }, [activePosition, customRanks]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = rankedPlayers.findIndex((p: any) => p.id === active.id);
            const newIndex = rankedPlayers.findIndex((p: any) => p.id === over.id);
            const newOrder = arrayMove(rankedPlayers, oldIndex, newIndex);
            setRankedPlayers(newOrder);

            const newCustomRanks: CustomRanking = { ...customRanks };
            newOrder.forEach((player, index) => {
                newCustomRanks[player.id] = index + 1;
            });

            dispatch({
                type: 'UPDATE_CUSTOM_RANKINGS',
                payload: { leagueId, rankings: newCustomRanks },
            });

    };
    
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4 sm:px-4 md:px-6 lg:px-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 sm:px-4 md:px-6 lg:px-8"></div>
        <span className="ml-2 sm:px-4 md:px-6 lg:px-8">Loading...</span>
      </div>
    );

  return (
        <div className="grid grid-cols-[1fr_3fr] gap-6 sm:px-4 md:px-6 lg:px-8">
            <div>
                <h3 className="font-bold mb-2 sm:px-4 md:px-6 lg:px-8">Positions</h3>
                <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                    {positionOrder.map((pos: any) => (
                        <button
                            key={pos}
                            onClick={() => setActivePosition(pos)}`}
                        >
                            {pos}
                        </button>
                    ))}
                </div>
            </div>
            <div className="glass-pane p-4 rounded-xl h-[70vh] flex flex-col sm:px-4 md:px-6 lg:px-8">
                <h3 className="font-bold mb-2 flex-shrink-0 sm:px-4 md:px-6 lg:px-8">My {activePosition} Rankings</h3>
                <p className="text-xs text-gray-400 mb-2 flex-shrink-0 sm:px-4 md:px-6 lg:px-8">Drag and drop to create your personal rankings. Changes are saved automatically.</p>
                <div className="flex-grow overflow-y-auto pr-2 sm:px-4 md:px-6 lg:px-8">
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={rankedPlayers.map((p: any) => p.id)} strategy={verticalListSortingStrategy}>
                            <div className="space-y-1 sm:px-4 md:px-6 lg:px-8">
                                {rankedPlayers.map((player, index) => (
                                    <SortableItem key={player.id} player={player} rank={index + 1} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>
            </div>
        </div>
    );
};

const MyRankingsEditorWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <MyRankingsEditor {...props} />
  </ErrorBoundary>
);

export default React.memo(MyRankingsEditorWithErrorBoundary);
