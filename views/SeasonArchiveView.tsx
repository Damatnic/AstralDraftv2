import React, { useState, useMemo } from 'react';

// Mock context
const useAppContext = () => ({
  state: {
    league: { 
      id: '1', 
      name: 'Fantasy League', 
      teams: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E', 'Team F'],
      seasons: [
        { year: 2024, champion: 'Team A', totalPoints: 1842 },
        { year: 2023, champion: 'Team B', totalPoints: 1765 },
        { year: 2022, champion: 'Team C', totalPoints: 1698 }
      ]
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
const ArchiveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
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

interface Season {
  year: number;
  champion: string;
  totalPoints: number;
  playoffs?: string[];
  regularSeasonWinner?: string;
  records?: Record<string, number>;
}

const SeasonArchiveView: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { league, myTeam } = state;
  
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  const [archiveFilter, setArchiveFilter] = useState<'all' | 'champions' | 'playoffs'>('all');

  // Mock historical data
  const historicalSeasons: Season[] = useMemo(() => [
    {
      year: 2024,
      champion: 'The Champions',
      totalPoints: 1842,
      regularSeasonWinner: 'Regular Season Kings',
      playoffs: ['The Champions', 'Regular Season Kings', 'Playoff Pushers', 'Last Chance'],
      records: {
        'Most Points Scored': 156.8,
        'Biggest Blowout': 89.4,
        'Most Consistent': 12.5
      }
    },
    {
      year: 2023,
      champion: 'Dynasty Builders',
      totalPoints: 1765,
      regularSeasonWinner: 'Points Leaders',
      playoffs: ['Dynasty Builders', 'Points Leaders', 'Trade Masters', 'Waiver Heroes'],
      records: {
        'Most Points Scored': 148.2,
        'Biggest Blowout': 76.8,
        'Most Consistent': 15.2
      }
    },
    {
      year: 2022,
      champion: 'Fantasy Legends',
      totalPoints: 1698,
      regularSeasonWinner: 'Season Dominators',
      playoffs: ['Fantasy Legends', 'Season Dominators', 'Draft Experts', 'Lucky Streamers'],
      records: {
        'Most Points Scored': 142.6,
        'Biggest Blowout': 82.1,
        'Most Consistent': 18.7
      }
    }
  ], []);

  const filteredSeasons = historicalSeasons.filter(season => {
    if (archiveFilter === 'champions') return true; // All have champions
    if (archiveFilter === 'playoffs') return season.playoffs && season.playoffs.length > 0;
    return true;
  });

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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Season Archive
          </h1>
          <p className="text-gray-400 mt-2">
            Explore your league&apos;s historical seasons and achievements
          </p>
        </div>
        
        <button 
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_HUB' })}
          className="glass-button"
        >
          Back to League
        </button>
      </div>

      {/* Archive Filters */}
      <div className="flex items-center gap-4">
        <ArchiveIcon className="w-5 h-5 text-purple-400" />
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All Seasons' },
            { key: 'champions', label: 'Champions' },
            { key: 'playoffs', label: 'Playoff Teams' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setArchiveFilter(filter.key as 'all' | 'champions' | 'playoffs')}
              className={`px-4 py-2 rounded-lg transition-all ${
                archiveFilter === filter.key
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Seasons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSeasons.map(season => (
          <SeasonCard 
            key={season.year}
            season={season}
            isSelected={selectedSeason === season.year}
            onSelect={() => setSelectedSeason(
              selectedSeason === season.year ? null : season.year
            )}
          />
        ))}
      </div>

      {/* Season Details */}
      {selectedSeason && (
        <Widget title={`${selectedSeason} Season Details`}>
          <SeasonDetails 
            season={historicalSeasons.find(s => s.year === selectedSeason)!}
          />
        </Widget>
      )}

      {/* Archive Stats */}
      <Widget title="Archive Statistics">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold">{historicalSeasons.length}</div>
            <div className="text-sm text-gray-400">Total Seasons</div>
          </div>
          
          <div className="text-center">
            <TrophyIcon className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold">
              {new Set(historicalSeasons.map(s => s.champion)).size}
            </div>
            <div className="text-sm text-gray-400">Different Champions</div>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-2 bg-green-400 rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xs">AVG</span>
            </div>
            <div className="text-2xl font-bold">
              {Math.round(historicalSeasons.reduce((sum, s) => sum + s.totalPoints, 0) / historicalSeasons.length)}
            </div>
            <div className="text-sm text-gray-400">Avg Champion Points</div>
          </div>
        </div>
      </Widget>
    </div>
  );
};

interface SeasonCardProps {
  season: Season;
  isSelected: boolean;
  onSelect: () => void;
}

const SeasonCard: React.FC<SeasonCardProps> = ({ season, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`
        glass-panel p-6 rounded-lg border text-left w-full transition-all
        ${isSelected ? 'ring-2 ring-purple-500 border-purple-500/50' : 'border-white/10 hover:border-white/20'}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{season.year}</h3>
        <TrophyIcon className="w-6 h-6 text-yellow-400" />
      </div>
      
      <div className="space-y-2">
        <div>
          <span className="text-gray-400 text-sm">Champion:</span>
          <div className="font-semibold text-yellow-300">{season.champion}</div>
        </div>
        
        <div>
          <span className="text-gray-400 text-sm">Total Points:</span>
          <div className="font-semibold">{season.totalPoints.toLocaleString()}</div>
        </div>
        
        {season.regularSeasonWinner && (
          <div>
            <span className="text-gray-400 text-sm">Regular Season:</span>
            <div className="font-semibold text-blue-300">{season.regularSeasonWinner}</div>
          </div>
        )}
      </div>
      
      {isSelected && (
        <div className="mt-3 text-sm text-purple-300">
          Click to view details
        </div>
      )}
    </button>
  );
};

interface SeasonDetailsProps {
  season: Season;
}

const SeasonDetails: React.FC<SeasonDetailsProps> = ({ season }) => {
  return (
    <div className="space-y-6">
      {/* Playoff Teams */}
      {season.playoffs && (
        <div>
          <h4 className="text-lg font-semibold mb-3">Playoff Teams</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {season.playoffs.map((team, index) => (
              <div 
                key={team}
                className={`
                  p-3 rounded-lg text-center
                  ${index === 0 ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-gray-700/50'}
                `}
              >
                <div className="font-medium">{team}</div>
                {index === 0 && (
                  <div className="text-xs text-yellow-300 mt-1">Champion</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Season Records */}
      {season.records && (
        <div>
          <h4 className="text-lg font-semibold mb-3">Season Records</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(season.records).map(([record, value]) => (
              <div key={record} className="bg-gray-700/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400">{record}</div>
                <div className="text-lg font-bold">{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonArchiveView;
