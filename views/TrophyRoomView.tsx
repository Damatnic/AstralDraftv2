/**
 * Trophy Room View Component
 * Clean rewrite focusing on league achievements and history
 */

import React, { useState, useEffect } from 'react';
import { useAppState } from '../contexts/AppContext';

// Simple interfaces for this view
interface TrophyRoomViewProps {
  className?: string;
}

interface Trophy {
  id: string;
  title: string;
  description: string;
  season: string;
  winner: string;
  icon: string;
  type: 'championship' | 'regular_season' | 'special';
}

interface LeagueRecord {
  category: string;
  record: string;
  holder: string;
  season: string;
}

/**
 * Trophy Room View - Displays league history and achievements
 */
const TrophyRoomView: React.FC<TrophyRoomViewProps> = ({ className = '' }) => {
  const { dispatch } = useAppState();
  const [isLoading, setIsLoading] = useState(true);
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [records, setRecords] = useState<LeagueRecord[]>([]);

  useEffect(() => {
    // Simulate loading trophy data
    const loadTrophyData = async () => {
      setIsLoading(true);
      
      // Mock data - would normally come from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTrophies([
        {
          id: 'champ-2024',
          title: 'League Champion',
          description: 'Defeated all challengers to claim ultimate victory',
          season: '2024',
          winner: 'Dynasty Kings',
          icon: '🏆',
          type: 'championship'
        },
        {
          id: 'regular-2024',
          title: 'Regular Season Champion',
          description: 'Dominated the regular season with consistency',
          season: '2024',
          winner: 'Consistent Crushers',
          icon: '👑',
          type: 'regular_season'
        },
        {
          id: 'champ-2023',
          title: 'League Champion',
          description: 'Previous season champion',
          season: '2023',
          winner: 'Playoff Warriors',
          icon: '🏆',
          type: 'championship'
        },
        {
          id: 'high-scorer-2024',
          title: 'Highest Single Game',
          description: 'Record-breaking weekly performance',
          season: '2024',
          winner: 'Offensive Juggernauts',
          icon: '⚡',
          type: 'special'
        }
      ]);

      setRecords([
        {
          category: 'Highest Single Game Score',
          record: '189.45 points',
          holder: 'Offensive Juggernauts',
          season: '2024'
        },
        {
          category: 'Most Points in a Season',
          record: '1,847.3 points',
          holder: 'Dynasty Kings',
          season: '2024'
        },
        {
          category: 'Longest Win Streak',
          record: '11 games',
          holder: 'Consistent Crushers',
          season: '2023-2024'
        },
        {
          category: 'Most Transactions',
          record: '47 moves',
          holder: 'Trade Master',
          season: '2024'
        }
      ]);

      setIsLoading(false);
    };

    loadTrophyData();
  }, []);

  const handleNavigateBack = () => {
    dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_HUB' });
  };

  const getTrophyColor = (type: Trophy['type']) => {
    switch (type) {
      case 'championship':
        return 'from-yellow-50 to-yellow-100 border-yellow-200';
      case 'regular_season':
        return 'from-blue-50 to-blue-100 border-blue-200';
      case 'special':
        return 'from-purple-50 to-purple-100 border-purple-200';
      default:
        return 'from-gray-50 to-gray-100 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className={`trophy-room-view p-6 ${className}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Loading trophy collection...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`trophy-room-view p-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Trophy Room</h1>
              <p className="text-gray-600">Celebrating our league&apos;s greatest achievements</p>
            </div>
            <button
              onClick={handleNavigateBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to League Hub
            </button>
          </div>
        </div>

        {/* Trophy Display */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">League Trophies</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trophies.map((trophy) => (
              <div 
                key={trophy.id} 
                className={`bg-gradient-to-br ${getTrophyColor(trophy.type)} p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{trophy.icon}</div>
                  <h3 className="font-semibold text-gray-900">{trophy.title}</h3>
                  <p className="text-sm text-gray-600">{trophy.season} Season</p>
                </div>
                
                <div className="text-center">
                  <p className="font-medium text-gray-900 mb-2">{trophy.winner}</p>
                  <p className="text-sm text-gray-600">{trophy.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* League Records */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">League Records</h2>
          
          <div className="bg-white rounded-lg shadow border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Record
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Record Holder
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Season
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {records.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {record.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-semibold text-blue-600">{record.record}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.holder}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.season}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Hall of Fame */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hall of Fame</h2>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-lg border border-yellow-200">
            <div className="text-center">
              <div className="text-4xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dynasty Kings</h3>
              <p className="text-gray-600 mb-4">Reigning Champions - 2024 Season</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">15-1</p>
                  <p className="text-sm text-gray-600">Regular Season Record</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">1,847</p>
                  <p className="text-sm text-gray-600">Total Points</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">3-0</p>
                  <p className="text-sm text-gray-600">Playoff Record</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Stats */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border">
              <p className="text-2xl font-bold text-blue-600">{trophies.length}</p>
              <p className="text-sm text-gray-600">Total Trophies</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <p className="text-2xl font-bold text-green-600">5</p>
              <p className="text-sm text-gray-600">Seasons Played</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <p className="text-2xl font-bold text-purple-600">{records.length}</p>
              <p className="text-sm text-gray-600">League Records</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <p className="text-2xl font-bold text-orange-600">12</p>
              <p className="text-sm text-gray-600">Active Managers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrophyRoomView;
