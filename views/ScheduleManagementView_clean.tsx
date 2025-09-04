import React, { useState, useMemo } from 'react';

// Mock context for now
const useAppContext = () => ({
  state: {
    league: { 
      id: '1', 
      name: 'Fantasy League', 
      teams: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E', 'Team F'] 
    },
    myTeam: { id: '1', name: 'My Team' }
  },
  dispatch: (_action: { type: string; payload?: string }) => {
    // Mock dispatch function
  }
});

// Simple Widget component
const Widget: React.FC<{ title: string; className?: string; children: React.ReactNode }> = ({ title, className, children }) => (
  <div className={`bg-gray-800/50 backdrop-blur-sm border border-white/10 rounded-lg p-6 ${className || ''}`}>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

// Simple icons
const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

interface Matchup {
  week: number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  isPlayoff?: boolean;
}

const ScheduleManagementView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { league, myTeam } = state;
  
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Mock schedule data
  const mockMatchups: Matchup[] = useMemo(() => {
    const matchups: Matchup[] = [];
    const teams = league?.teams || ['Team A', 'Team B', 'Team C', 'Team D', 'Team E', 'Team F'];
    
    // Regular season (weeks 1-14)
    for (let week = 1; week <= 14; week++) {
      for (let i = 0; i < teams.length; i += 2) {
        matchups.push({
          week,
          homeTeam: teams[i] || 'TBA',
          awayTeam: teams[i + 1] || 'TBA',
          homeScore: week <= 12 ? Math.floor(Math.random() * 50) + 80 : undefined,
          awayScore: week <= 12 ? Math.floor(Math.random() * 50) + 80 : undefined,
        });
      }
    }
    
    // Playoffs (weeks 15-17)
    for (let week = 15; week <= 17; week++) {
      matchups.push({
        week,
        homeTeam: teams[0] || 'TBA',
        awayTeam: teams[1] || 'TBA',
        isPlayoff: true,
        homeScore: week === 15 ? Math.floor(Math.random() * 50) + 80 : undefined,
        awayScore: week === 15 ? Math.floor(Math.random() * 50) + 80 : undefined,
      });
    }
    
    return matchups;
  }, [league?.teams]);

  const currentWeekMatchups = mockMatchups.filter(m => m.week === selectedWeek);
  const maxWeek = 17;
  const isPlayoffWeek = selectedWeek >= 15;

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    // Simulate schedule regeneration
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRegenerating(false);
  };

  if (!league || !myTeam) {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="text-gray-400">League data not available</p>
        <button 
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })}
          className="glass-button-primary mt-4"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Schedule Management
          </h1>
          <p className="text-gray-400 mt-2">
            Manage your league&apos;s weekly matchups and playoff schedule
          </p>
        </div>
        
        <button 
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'COMMISSIONER_TOOLS' })}
          className="glass-button"
        >
          Back to Tools
        </button>
      </div>

      <Widget title="Weekly Schedule" className="lg:col-span-2">
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedWeek(w => Math.max(1, w-1))} 
              disabled={selectedWeek === 1}
              className="glass-button p-2 disabled:opacity-50"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h3 className="text-xl font-semibold">Week {selectedWeek}</h3>
              {isPlayoffWeek && (
                <span className="text-sm text-yellow-400">Playoffs</span>
              )}
            </div>
            
            <button 
              onClick={() => setSelectedWeek(w => Math.min(maxWeek, w+1))} 
              disabled={selectedWeek === maxWeek}
              className="glass-button p-2 disabled:opacity-50"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className="glass-button"
            >
              {editMode ? 'Done Editing' : 'Edit Mode'}
            </button>
            
            <button 
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="glass-button-primary"
            >
              <RefreshIcon className="w-4 h-4 inline mr-2" />
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </button>
          </div>
        </div>

        {isPlayoffWeek && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
            <p className="text-sm text-yellow-300 flex items-center gap-2">
              <TrophyIcon className="w-4 h-4" />
              Playoff Week - Top teams compete for the championship
            </p>
          </div>
        )}

        {/* Matchups Grid */}
        <div className="grid gap-4">
          {currentWeekMatchups.map((matchup, index) => (
            <MatchupCard 
              key={`${matchup.week}-${index}`}
              matchup={matchup}
              editMode={editMode}
            />
          ))}
        </div>
      </Widget>

      {/* Season Overview */}
      <Widget title="Season Overview">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold">14</div>
            <div className="text-sm text-gray-400">Regular Season Weeks</div>
          </div>
          
          <div className="text-center">
            <TrophyIcon className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-gray-400">Playoff Weeks</div>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-green-400 rounded-full flex items-center justify-center">
              <span className="text-black font-bold">✓</span>
            </div>
            <div className="text-2xl font-bold">{selectedWeek}</div>
            <div className="text-sm text-gray-400">Current Week</div>
          </div>
        </div>
      </Widget>
    </div>
  );
};

interface MatchupCardProps {
  matchup: Matchup;
  editMode: boolean;
}

const MatchupCard: React.FC<MatchupCardProps> = ({ matchup, editMode }) => {
  const hasScore = matchup.homeScore !== undefined && matchup.awayScore !== undefined;
  
  return (
    <div className={`
      glass-panel p-4 rounded-lg border
      ${matchup.isPlayoff ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-white/10'}
      ${editMode ? 'ring-2 ring-blue-500/50' : ''}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium">{matchup.homeTeam}</span>
            {hasScore && (
              <span className="text-lg font-bold">{matchup.homeScore}</span>
            )}
          </div>
          
          <div className="text-center text-gray-400 my-2">vs</div>
          
          <div className="flex items-center justify-between">
            <span className="font-medium">{matchup.awayTeam}</span>
            {hasScore && (
              <span className="text-lg font-bold">{matchup.awayScore}</span>
            )}
          </div>
        </div>
        
        {editMode && (
          <div className="ml-4 flex flex-col gap-2">
            <button className="glass-button text-xs px-2 py-1">
              Swap
            </button>
            <button className="glass-button text-xs px-2 py-1">
              Edit
            </button>
          </div>
        )}
      </div>
      
      {!hasScore && (
        <div className="mt-3 text-center text-sm text-gray-400">
          Not yet played
        </div>
      )}
    </div>
  );
};

export default ScheduleManagementView;
