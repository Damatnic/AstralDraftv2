import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState } from 'react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Trophy, TrendingUp, Calendar, Edit3, Camera, Shield, Star } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;

}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user }) => {
  // Handle Escape key to close modal
  useEscapeKey(isOpen, onClose);

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: user?.name || 'Fantasy Manager',
    teamName: user?.teamName || 'My Team',
    bio: 'Passionate fantasy football manager with a keen eye for talent and strategy.',
    location: 'United States',
    favoriteTeam: 'Green Bay Packers',
    experience: 'Expert (5+ years)',
    avatar: null
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> },
    { id: 'stats', label: 'Statistics', icon: <TrendingUp className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> },
    { id: 'achievements', label: 'Achievements', icon: <Trophy className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> },
    { id: 'history', label: 'History', icon: <Calendar className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> }
  ];

  const achievements = [
    { id: 1, title: 'League Champion', description: '2023 Season Winner', icon: '🏆', rarity: 'legendary' },
    { id: 2, title: 'Trade Master', description: 'Completed 50+ trades', icon: '🤝', rarity: 'epic' },
    { id: 3, title: 'Draft Expert', description: 'Perfect draft score', icon: '🎯', rarity: 'rare' },
    { id: 4, title: 'Waiver Wire Wizard', description: 'Top waiver pickups', icon: '✨', rarity: 'epic' },
    { id: 5, title: 'Consistency King', description: 'Top 3 finish 3 seasons', icon: '👑', rarity: 'legendary' },
    { id: 6, title: 'Rookie Sensation', description: 'Won first season', icon: '⭐', rarity: 'rare' }
  ];

  const seasonHistory = [
    { year: 2023, record: '12-2', finish: '1st', points: 1847.5, champion: true },
    { year: 2022, record: '9-5', finish: '3rd', points: 1623.2, champion: false },
    { year: 2021, record: '11-3', finish: '2nd', points: 1789.4, champion: false },
    { year: 2020, record: '7-7', finish: '6th', points: 1456.8, champion: false },
    { year: 2019, record: '10-4', finish: '1st', points: 1692.1, champion: true }
  ];

  const currentSeasonStats = {
    wins: 8,
    losses: 3,
    pointsFor: 1234.5,
    pointsAgainst: 1098.7,
    rank: 2,
    totalTeams: 10,
    tradesCompleted: 12,
    waiverClaims: 8,
    bestWeek: 156.8,
    worstWeek: 87.2
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save profile data to backend/context
    console.log('Saving profile:', profileData);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'epic': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      case 'rare': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';

  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:px-4 md:px-6 lg:px-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm sm:px-4 md:px-6 lg:px-8"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-dark-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden sm:px-4 md:px-6 lg:px-8"
        >
          {/* Header with Profile Banner */}
          <div className="relative sm:px-4 md:px-6 lg:px-8">
            <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-700 sm:px-4 md:px-6 lg:px-8"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-dark-800/90 to-transparent sm:px-4 md:px-6 lg:px-8"></div>
            
            <div className="absolute top-4 right-4 sm:px-4 md:px-6 lg:px-8">
              <button
                onClick={onClose}
                className="w-8 h-8 bg-black/30 hover:bg-black/50 rounded-lg flex items-center justify-center text-white/80 hover:text-white transition-colors sm:px-4 md:px-6 lg:px-8"
               aria-label="Action button">
                <X className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
              </button>
            </div>

            <div className="absolute bottom-4 left-6 sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-end gap-4 sm:px-4 md:px-6 lg:px-8">
                <div className="relative sm:px-4 md:px-6 lg:px-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl border-4 border-dark-800 sm:px-4 md:px-6 lg:px-8">
                    {profileData.displayName.charAt(0).toUpperCase()}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary-500 hover:bg-primary-600 rounded-full flex items-center justify-center text-white sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                      <Camera className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                    </button>
                  )}
                </div>
                <div className="pb-2 sm:px-4 md:px-6 lg:px-8">
                  <h2 className="text-2xl font-bold text-white sm:px-4 md:px-6 lg:px-8">{profileData.displayName}</h2>
                  <p className="text-primary-300 sm:px-4 md:px-6 lg:px-8">{profileData.teamName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-white/10 bg-dark-900/50 sm:px-4 md:px-6 lg:px-8">
            <div className="flex px-6 gap-1 sm:px-4 md:px-6 lg:px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
              <div className="flex-1 sm:px-4 md:px-6 lg:px-8"></div>
              <button
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar sm:px-4 md:px-6 lg:px-8">
            <div className="p-6 sm:px-4 md:px-6 lg:px-8">
              {activeTab === 'overview' && (
                <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                  {/* Bio Section */}
                  <div className="bg-dark-700/50 rounded-xl p-6 sm:px-4 md:px-6 lg:px-8">
                    <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">About</h3>
                    {isEditing ? (
                      <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Display Name</label>
                          <input
                            type="text"
                            value={profileData.displayName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }}
                            className="w-full bg-dark-600 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 sm:px-4 md:px-6 lg:px-8"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Team Name</label>
                          <input
                            type="text"
                            value={profileData.teamName}
                            onChange={(e) => setProfileData(prev => ({ ...prev, teamName: e.target.value }}
                            className="w-full bg-dark-600 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 sm:px-4 md:px-6 lg:px-8"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Bio</label>
                          <textarea
                            value={profileData.bio}
                            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }}
                            rows={3}
                            className="w-full bg-dark-600 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 resize-none sm:px-4 md:px-6 lg:px-8"
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-300 sm:px-4 md:px-6 lg:px-8">{profileData.bio}</p>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-dark-700/50 rounded-xl p-4 text-center sm:px-4 md:px-6 lg:px-8">
                      <div className="text-2xl font-bold text-primary-400 sm:px-4 md:px-6 lg:px-8">{currentSeasonStats.rank}</div>
                      <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Current Rank</div>
                    </div>
                    <div className="bg-dark-700/50 rounded-xl p-4 text-center sm:px-4 md:px-6 lg:px-8">
                      <div className="text-2xl font-bold text-green-400 sm:px-4 md:px-6 lg:px-8">{currentSeasonStats.wins}-{currentSeasonStats.losses}</div>
                      <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Record</div>
                    </div>
                    <div className="bg-dark-700/50 rounded-xl p-4 text-center sm:px-4 md:px-6 lg:px-8">
                      <div className="text-2xl font-bold text-blue-400 sm:px-4 md:px-6 lg:px-8">{currentSeasonStats.pointsFor}</div>
                      <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Points For</div>
                    </div>
                    <div className="bg-dark-700/50 rounded-xl p-4 text-center sm:px-4 md:px-6 lg:px-8">
                      <div className="text-2xl font-bold text-yellow-400 sm:px-4 md:px-6 lg:px-8">{currentSeasonStats.tradesCompleted}</div>
                      <div className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Trades Made</div>
                    </div>
                  </div>

                  {/* Personal Info */}
                  <div className="bg-dark-700/50 rounded-xl p-6 sm:px-4 md:px-6 lg:px-8">
                    <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Location</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }}
                            className="w-full bg-dark-600 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 sm:px-4 md:px-6 lg:px-8"
                          />
                        ) : (
                          <p className="text-white sm:px-4 md:px-6 lg:px-8">{profileData.location}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Favorite NFL Team</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={profileData.favoriteTeam}
                            onChange={(e) => setProfileData(prev => ({ ...prev, favoriteTeam: e.target.value }}
                            className="w-full bg-dark-600 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 sm:px-4 md:px-6 lg:px-8"
                          />
                        ) : (
                          <p className="text-white sm:px-4 md:px-6 lg:px-8">{profileData.favoriteTeam}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'stats' && (
                <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-dark-700/50 rounded-xl p-6 sm:px-4 md:px-6 lg:px-8">
                      <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Current Season</h3>
                      <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Wins/Losses</span>
                          <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{currentSeasonStats.wins}-{currentSeasonStats.losses}</span>
                        </div>
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Points For</span>
                          <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{currentSeasonStats.pointsFor}</span>
                        </div>
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Points Against</span>
                          <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{currentSeasonStats.pointsAgainst}</span>
                        </div>
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Best Week</span>
                          <span className="text-green-400 font-medium sm:px-4 md:px-6 lg:px-8">{currentSeasonStats.bestWeek}</span>
                        </div>
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Worst Week</span>
                          <span className="text-red-400 font-medium sm:px-4 md:px-6 lg:px-8">{currentSeasonStats.worstWeek}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-dark-700/50 rounded-xl p-6 sm:px-4 md:px-6 lg:px-8">
                      <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Activity</h3>
                      <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Trades Completed</span>
                          <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{currentSeasonStats.tradesCompleted}</span>
                        </div>
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Waiver Claims</span>
                          <span className="text-white font-medium sm:px-4 md:px-6 lg:px-8">{currentSeasonStats.waiverClaims}</span>
                        </div>
                        <div className="flex justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-gray-400 sm:px-4 md:px-6 lg:px-8">Current Rank</span>
                          <span className="text-primary-400 font-medium sm:px-4 md:px-6 lg:px-8">#{currentSeasonStats.rank} of {currentSeasonStats.totalTeams}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                  <div className="grid md:grid-cols-2 gap-4">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className={`bg-dark-700/50 rounded-xl p-4 border ${getRarityColor(achievement.rarity)}`}>
                        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                          <div className="text-2xl sm:px-4 md:px-6 lg:px-8">{achievement.icon}</div>
                          <div>
                            <h4 className="font-semibold text-white sm:px-4 md:px-6 lg:px-8">{achievement.title}</h4>
                            <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">{achievement.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                  <div className="bg-dark-700/50 rounded-xl overflow-hidden sm:px-4 md:px-6 lg:px-8">
                    <div className="p-4 border-b border-white/10 sm:px-4 md:px-6 lg:px-8">
                      <h3 className="text-lg font-semibold text-white sm:px-4 md:px-6 lg:px-8">Season History</h3>
                    </div>
                    <div className="overflow-x-auto sm:px-4 md:px-6 lg:px-8">
                      <table className="w-full sm:px-4 md:px-6 lg:px-8">
                        <thead>
                          <tr className="bg-dark-600/50 sm:px-4 md:px-6 lg:px-8">
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 sm:px-4 md:px-6 lg:px-8">Year</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 sm:px-4 md:px-6 lg:px-8">Record</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 sm:px-4 md:px-6 lg:px-8">Finish</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 sm:px-4 md:px-6 lg:px-8">Points</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 sm:px-4 md:px-6 lg:px-8">Champion</th>
                          </tr>
                        </thead>
                        <tbody>
                          {seasonHistory.map((season, index) => (
                            <tr key={season.year} className="border-t border-white/5 sm:px-4 md:px-6 lg:px-8">
                              <td className="px-4 py-3 text-white font-medium sm:px-4 md:px-6 lg:px-8">{season.year}</td>
                              <td className="px-4 py-3 text-white sm:px-4 md:px-6 lg:px-8">{season.record}</td>
                              <td className="px-4 py-3 sm:px-4 md:px-6 lg:px-8">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  season.finish === '1st' ? 'bg-yellow-400/20 text-yellow-400' :
                                  season.finish === '2nd' ? 'bg-gray-400/20 text-gray-400' :
                                  season.finish === '3rd' ? 'bg-amber-600/20 text-amber-600' :
                                  'bg-gray-600/20 text-gray-300'
                                }`}>
                                  {season.finish}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-white sm:px-4 md:px-6 lg:px-8">{season.points}</td>
                              <td className="px-4 py-3 sm:px-4 md:px-6 lg:px-8">
                                {season.champion && (
                                  <Trophy className="w-4 h-4 text-yellow-400 sm:px-4 md:px-6 lg:px-8" />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {isEditing && (
            <div className="p-6 border-t border-white/10 bg-dark-900/50 sm:px-4 md:px-6 lg:px-8">
              <div className="flex justify-end gap-3 sm:px-4 md:px-6 lg:px-8">
                <button
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                 aria-label="Action button">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const ProfileModalWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <ProfileModal {...props} />
  </ErrorBoundary>
);

export default React.memo(ProfileModalWithErrorBoundary);