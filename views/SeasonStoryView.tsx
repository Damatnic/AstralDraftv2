/**
 * Season Story View Component
 * Clean rewrite focusing on narrative season summary
 */

import React, { useState, useEffect } from 'react';
import { useAppState } from '../contexts/AppContext';

// Simple interfaces for this view
interface SeasonStoryViewProps {
  className?: string;
}

interface StoryChapter {
  id: string;
  title: string;
  content: string;
  week?: number;
  highlight: boolean;
}

interface SeasonStory {
  title: string;
  subtitle: string;
  chapters: StoryChapter[];
  stats: {
    totalGames: number;
    biggestWin: string;
    toughestLoss: string;
    keyMoment: string;
  };
}

/**
 * Season Story View - Narrative recap of the season
 */
const SeasonStoryView: React.FC<SeasonStoryViewProps> = ({ className = '' }) => {
  const { dispatch } = useAppState();
  const [isLoading, setIsLoading] = useState(true);
  const [storyData, setStoryData] = useState<SeasonStory | null>(null);

  useEffect(() => {
    // Simulate loading story data
    const loadStoryData = async () => {
      setIsLoading(true);
      
      // Mock data - would normally come from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStoryData({
        title: 'The Dynasty Kings: A Championship Journey',
        subtitle: 'From draft day dreams to championship glory',
        chapters: [
          {
            id: 'draft',
            title: 'Draft Day Foundation',
            content: 'It all began on a warm August evening when the Dynasty Kings made their mark. With the 3rd overall pick, they selected their cornerstone player, setting the tone for what would become a legendary season.',
            highlight: true
          },
          {
            id: 'early-season',
            title: 'Early Season Struggles',
            content: 'The first month tested their resolve. Injuries mounted, key players underperformed, and the playoff picture looked bleak. But champions are forged in adversity.',
            week: 4,
            highlight: false
          },
          {
            id: 'midseason-surge',
            title: 'The Mid-Season Surge',
            content: 'Week 8 marked the turning point. A brilliant waiver wire pickup and a strategic trade transformed the roster. Suddenly, the Dynasty Kings were unstoppable.',
            week: 8,
            highlight: true
          },
          {
            id: 'playoff-run',
            title: 'Playoff Perfection',
            content: 'When it mattered most, every decision paid off. Three consecutive playoff victories, each more dramatic than the last, culminated in championship glory.',
            highlight: true
          }
        ],
        stats: {
          totalGames: 16,
          biggestWin: '156.8 vs 87.2 (Week 10)',
          toughestLoss: '124.1 vs 125.3 (Week 3)',
          keyMoment: 'Week 12 waiver wire pickup of breakout rookie RB'
        }
      });

      setIsLoading(false);
    };

    loadStoryData();
  }, []);

  const handleNavigateBack = () => {
    dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' });
  };

  if (isLoading) {
    return (
      <div className={`season-story-view p-6 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">The Oracle is chronicling your epic season...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!storyData) {
    return (
      <div className={`season-story-view p-6 ${className}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">No season story available.</p>
            <button
              onClick={handleNavigateBack}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Team Hub
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`season-story-view p-6 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{storyData.title}</h1>
              <p className="text-gray-600">{storyData.subtitle}</p>
            </div>
            <button
              onClick={handleNavigateBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Team Hub
            </button>
          </div>
        </div>

        {/* Season Stats Overview */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Season at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Games Played</p>
              <p className="font-semibold">{storyData.stats.totalGames}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Biggest Victory</p>
              <p className="font-semibold">{storyData.stats.biggestWin}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Toughest Loss</p>
              <p className="font-semibold">{storyData.stats.toughestLoss}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Key Moment</p>
              <p className="font-semibold">{storyData.stats.keyMoment}</p>
            </div>
          </div>
        </div>

        {/* Story Chapters */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-900">Your Season Story</h2>
          
          {storyData.chapters.map((chapter, index) => (
            <div key={chapter.id} className={`relative p-6 rounded-lg border ${
              chapter.highlight 
                ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' 
                : 'bg-white border-gray-200'
            }`}>
              {/* Chapter Number */}
              <div className={`absolute -left-4 -top-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                chapter.highlight 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}>
                {index + 1}
              </div>

              {/* Chapter Content */}
              <div className="pl-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{chapter.title}</h3>
                  {chapter.week && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      Week {chapter.week}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-700 leading-relaxed">{chapter.content}</p>
                
                {chapter.highlight && (
                  <div className="mt-3 flex items-center">
                    <span className="text-yellow-600 text-sm font-medium">
                      ⭐ Season Highlight
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gray-50 p-8 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready for Next Season?</h3>
          <p className="text-gray-600 mb-4">
            Every ending is a new beginning. Will you repeat as champion or face new challenges?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'LEAGUE_HUB' })}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              League Hub
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'TEAM_HUB' })}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Team Management
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonStoryView;
