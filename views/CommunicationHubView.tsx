/**
 * Communication Hub View
 * Central hub for all league communication features
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../contexts/AppContext';
import TrashTalkBoard from '../components/communication/TrashTalkBoard';
import DirectMessaging from '../components/communication/DirectMessaging';
import TradeDiscussion from '../components/communication/TradeDiscussion';

const CommunicationHubView: React.FC = () => {
  const { state, dispatch } = useAppState();
  const [activeTab, setActiveTab] = useState<'trash-talk' | 'messages' | 'announcements' | 'polls'>('trash-talk');
  const [showTradeDiscussion, setShowTradeDiscussion] = useState(false);

  const league = state.leagues[0];

  const tabs = [
    { 
      id: 'trash-talk', 
      label: 'Trash Talk', 
      icon: '🔥', 
      description: 'League banter & competition',
      count: 12 // unread posts
    },
    { 
      id: 'messages', 
      label: 'Direct Messages', 
      icon: '💬', 
      description: 'Private conversations',
      count: 3 // unread messages
    },
    { 
      id: 'announcements', 
      label: 'Announcements', 
      icon: '📢', 
      description: 'League news & updates',
      count: 1 // unread announcements
    },
    { 
      id: 'polls', 
      label: 'League Polls', 
      icon: '🗳️', 
      description: 'Vote on league matters',
      count: 0 // active polls

  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trash-talk':
        return <TrashTalkBoard />;
      
      case 'messages':
        return <DirectMessaging />;
      
      case 'announcements':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">League Announcements</h2>
                <p className="text-slate-400">Important updates from the commissioner</p>
              </div>
              
              <div className="text-right">
                <div className="text-white font-semibold">Commissioner</div>
                <div className="text-sm text-slate-400">Nick Damato</div>
              </div>
            </div>

            {/* Recent Announcements */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card border-yellow-500 bg-yellow-900/20"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📢</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">
                        📌 Pinned
                      </span>
                      <span className="text-slate-400 text-sm">2 hours ago</span>
                    </div>
                    <h3 className="text-white font-bold mb-2">Trade Deadline Reminder</h3>
                    <p className="text-slate-300 mb-3">
                      Just a friendly reminder that the trade deadline is coming up on <strong>November 15th (Week 12)</strong>. 
                      Make sure to get your trades in before then! After the deadline, rosters will be locked for trades 
                      until next season.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="text-blue-400 hover:text-blue-300">👍 12 reactions</button>
                      <button className="text-slate-400 hover:text-white">💬 3 comments</button>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🏆</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-slate-400 text-sm">1 day ago</span>
                    </div>
                    <h3 className="text-white font-bold mb-2">Week 8 Awards Announced</h3>
                    <p className="text-slate-300 mb-3">
                      Congratulations to this week's award winners! 🎉
                      <br />• <strong>Player of the Week:</strong> Josh Allen (Thunder Bolts) - 34.8 pts
                      <br />• <strong>Waiver Wire Hero:</strong> Gus Edwards (Lightning Strikes) - 18.4 pts
                      <br />• <strong>Biggest Bust:</strong> Cooper Kupp (Gridiron Giants) - 4.1 pts
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="text-blue-400 hover:text-blue-300">🔥 8 reactions</button>
                      <button className="text-slate-400 hover:text-white">💬 5 comments</button>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">⚖️</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-slate-400 text-sm">3 days ago</span>
                    </div>
                    <h3 className="text-white font-bold mb-2">Waiver Wire Processing Update</h3>
                    <p className="text-slate-300 mb-3">
                      Waivers will continue to process every Wednesday at 12:00 AM EST. Remember that FAAB bids 
                      are due by Tuesday at 11:59 PM. Good luck with your claims!
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <button className="text-blue-400 hover:text-blue-300">👍 6 reactions</button>
                      <button className="text-slate-400 hover:text-white">💬 2 comments</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Commissioner Tools */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">📝 Commissioner Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="btn btn-primary">
                  📢 Post Announcement
                </button>
                <button className="btn btn-secondary">
                  🗳️ Create Poll
                </button>
                <button className="btn btn-secondary">
                  📊 View Analytics
                </button>
                <button className="btn btn-secondary">
                  ⚙️ League Settings
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'polls':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">League Polls</h2>
                <p className="text-slate-400">Vote on league decisions and fun topics</p>
              </div>
              
              <button className="btn btn-primary">
                🗳️ Create Poll
              </button>
            </div>

            {/* Active Polls */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card border-green-500 bg-green-900/20"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🗳️</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                        🟢 Active
                      </span>
                      <span className="text-slate-400 text-sm">Ends in 2 days</span>
                    </div>
                    <h3 className="text-white font-bold mb-3">Should we add a toilet bowl bracket for last place?</h3>
                    
                    {/* Poll Options */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <input type="radio" name="poll-1" className="text-blue-600" />
                          <span className="text-white">Yes, add toilet bowl bracket</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-600 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                          </div>
                          <span className="text-sm text-slate-400">7 votes</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <input type="radio" name="poll-1" className="text-blue-600" />
                          <span className="text-white">No, keep it simple</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-600 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                          </div>
                          <span className="text-sm text-slate-400">3 votes</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">10 total votes</span>
                      <button className="btn btn-primary btn-sm">
                        Submit Vote
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Completed Polls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✅</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-slate-600 text-white text-xs rounded-full">
//                         Completed
                      </span>
                      <span className="text-slate-400 text-sm">Ended 1 week ago</span>
                    </div>
                    <h3 className="text-white font-bold mb-3">What should the punishment be for last place?</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <span className="text-slate-300">🏆 Winner: Buy trophy for champion</span>
                        <span className="text-green-400 font-semibold">6 votes (60%)</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <span className="text-slate-300">📸 Take embarrassing photo</span>
                        <span className="text-slate-400">4 votes (40%)</span>
                      </div>
                    </div>

                    <span className="text-sm text-slate-400">10 total votes • Decision implemented</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Poll Creation */}
            <div className="card">
              <h3 className="text-lg font-bold text-white mb-4">💡 Poll Ideas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="text-white font-semibold mb-2">League Rules</h4>
                  <ul className="text-slate-400 space-y-1">
                    <li>• Playoff format changes</li>
                    <li>• Scoring system adjustments</li>
                    <li>• Trade deadline modifications</li>
                    <li>• Waiver wire rules</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Fun Topics</h4>
                  <ul className="text-slate-400 space-y-1">
                    <li>• Weekly predictions</li>
                    <li>• Best team names</li>
                    <li>• MVP predictions</li>
                    <li>• Season awards</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'DASHBOARD' })
              className="back-btn"
            >
              ← Back to Dashboard
            </button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <span className="text-2xl">💬</span>
                Communication Hub
              </h1>
              <p className="text-slate-400">{league?.name} • League Chat</p>
            </div>
            
            <div className="text-right">
              <div className="text-white font-semibold">Active Members</div>
              <div className="text-sm text-green-400">8 online</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-white">47</div>
            <div className="text-sm text-slate-400">Total Posts</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-blue-400">12</div>
            <div className="text-sm text-slate-400">Active Chats</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-green-400">1</div>
            <div className="text-sm text-slate-400">Active Polls</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card text-center"
          >
            <div className="text-2xl font-bold text-orange-400">8</div>
            <div className="text-sm text-slate-400">Online Now</div>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-800/50 rounded-lg p-2 mb-8">
          {tabs.map((tab: any) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <div className="text-center">
                <div className="font-medium text-sm">{tab.label}</div>
                <div className="text-xs opacity-75">{tab.description}</div>
              </div>
              {tab.count > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>

        {/* Community Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 card"
        >
          <h3 className="text-lg font-bold text-white mb-4">🤝 Community Guidelines</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="text-green-400 font-semibold mb-2">✅ Encouraged</h4>
              <ul className="text-slate-400 space-y-1">
                <li>• Friendly competition</li>
                <li>• Trade discussions</li>
                <li>• Strategy sharing</li>
                <li>• Good sportsmanship</li>
              </ul>
            </div>
            <div>
              <h4 className="text-yellow-400 font-semibold mb-2">⚠️ Use Caution</h4>
              <ul className="text-slate-400 space-y-1">
                <li>• Heated debates</li>
                <li>• Controversial topics</li>
                <li>• Personal information</li>
                <li>• Off-topic discussions</li>
              </ul>
            </div>
            <div>
              <h4 className="text-red-400 font-semibold mb-2">❌ Not Allowed</h4>
              <ul className="text-slate-400 space-y-1">
                <li>• Personal attacks</li>
                <li>• Harassment</li>
                <li>• Spam or flooding</li>
                <li>• Inappropriate content</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trade Discussion Modal */}
      <TradeDiscussion
        tradeId="trade-1"
        isVisible={showTradeDiscussion}
        onClose={() => setShowTradeDiscussion(false)}
      />
    </div>
  );
};

export default CommunicationHubView;