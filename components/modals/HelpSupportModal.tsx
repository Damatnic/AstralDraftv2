import React, { useState } from 'react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, MessageCircle, Book, Video, Search, ChevronRight, ExternalLink, Mail, Phone, Clock } from 'lucide-react';

interface HelpSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({ isOpen, onClose }) => {
  // Handle Escape key to close modal
  useEscapeKey(isOpen, onClose);

  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [supportTicket, setSupportTicket] = useState({
    category: 'general',
    subject: '',
    description: '',
    priority: 'medium'
  });

  const tabs = [
    { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'guides', label: 'Guides', icon: <Book className="w-4 h-4" /> },
    { id: 'videos', label: 'Tutorials', icon: <Video className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact Support', icon: <MessageCircle className="w-4 h-4" /> }
  ];

  const faqData = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create my first fantasy team?',
          a: 'Navigate to the Team Hub and click "Create Team". Follow the setup wizard to select your league settings, draft format, and invite friends.'
        },
        {
          q: 'What scoring system should I use?',
          a: 'We recommend PPR (Point Per Reception) for beginners as it provides more consistent scoring. Standard scoring is also popular for traditional leagues.'
        },
        {
          q: 'How many teams should be in my league?',
          a: '10-12 teams is ideal for competitive balance. 8 teams can work for casual leagues, while 14+ teams are for experienced players who want a challenge.'
        }
      ]
    },
    {
      category: 'Draft & Players',
      questions: [
        {
          q: 'How does the draft work?',
          a: 'Our live draft room supports snake, auction, and custom formats. Players take turns selecting from available players until all rosters are full.'
        },
        {
          q: 'Can I trade players?',
          a: 'Yes! Use the Trade Center to propose trades. Both managers must accept, and your league commissioner may need to approve depending on settings.'
        },
        {
          q: 'What is the waiver wire?',
          a: 'The waiver wire contains unowned players. Submit claims during the waiver period (usually Tuesday-Wednesday) to add players to your team.'
        }
      ]
    },
    {
      category: 'Scoring & Rules',
      questions: [
        {
          q: 'When are scores updated?',
          a: 'Scores are updated in real-time during games. Final scores are typically available within 24 hours after the last game ends.'
        },
        {
          q: 'What happens if a player is injured?',
          a: 'If a player is ruled out before the game starts, you can substitute them. Once games begin, injured players score 0 points.'
        },
        {
          q: 'How do playoffs work?',
          a: 'Top teams (usually 4-6) make playoffs in weeks 14-17. Playoffs use single-elimination brackets with matchups based on regular season standings.'
        }
      ]
    },
    {
      category: 'Technical Issues',
      questions: [
        {
          q: 'The app is running slowly, what can I do?',
          a: 'Try clearing your browser cache, updating to the latest version, or switching to a different browser. Contact support if issues persist.'
        },
        {
          q: 'I lost access to my account, how do I recover it?',
          a: 'Use the "Forgot Password" link on the login page, or contact support with your email address and we\'ll help you regain access.'
        },
        {
          q: 'Can I use the app on my phone?',
          a: 'Yes! Our app is fully responsive and optimized for mobile devices. You can also install it as a PWA for native app-like experience.'
        }
      ]
    }
  ];

  const guides = [
    {
      title: 'Fantasy Football Basics',
      description: 'Complete guide for beginners covering all fundamentals',
      duration: '15 min read',
      category: 'Beginner',
      icon: '📚'
    },
    {
      title: 'Draft Strategy Guide',
      description: 'Advanced drafting techniques and position prioritization',
      duration: '20 min read',
      category: 'Advanced',
      icon: '🎯'
    },
    {
      title: 'Waiver Wire Mastery',
      description: 'How to find and claim the best free agents',
      duration: '12 min read',
      category: 'Intermediate',
      icon: '🔍'
    },
    {
      title: 'Trade Negotiation',
      description: 'Tips for successful player trades and valuations',
      duration: '18 min read',
      category: 'Advanced',
      icon: '🤝'
    },
    {
      title: 'Mobile App Features',
      description: 'Make the most of our mobile experience',
      duration: '8 min read',
      category: 'Beginner',
      icon: '📱'
    },
    {
      title: 'League Management',
      description: 'Commissioner tools and league administration',
      duration: '25 min read',
      category: 'Advanced',
      icon: '⚙️'
    }
  ];

  const tutorials = [
    {
      title: 'Setting Up Your First League',
      description: 'Step-by-step video walkthrough of league creation',
      duration: '8:32',
      thumbnail: '🎬',
      category: 'Getting Started'
    },
    {
      title: 'Live Draft Walkthrough',
      description: 'See how our draft room works in real-time',
      duration: '12:15',
      thumbnail: '🎬',
      category: 'Draft'
    },
    {
      title: 'Managing Your Team',
      description: 'Weekly roster management and lineup optimization',
      duration: '6:48',
      thumbnail: '🎬',
      category: 'Team Management'
    },
    {
      title: 'Using Analytics Tools',
      description: 'Leverage our advanced analytics for better decisions',
      duration: '10:23',
      thumbnail: '🎬',
      category: 'Analytics'
    },
    {
      title: 'Mobile App Tour',
      description: 'Complete guide to mobile features and navigation',
      duration: '5:17',
      thumbnail: '🎬',
      category: 'Mobile'
    }
  ];

  const filteredFAQ = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(
      item =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle support ticket submission
    console.log('Support ticket submitted:', supportTicket);
    // Reset form
    setSupportTicket({
      category: 'general',
      subject: '',
      description: '',
      priority: 'medium'
    });
    // Show success message
    alert('Support ticket submitted successfully! We\'ll get back to you within 24 hours.');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-dark-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-primary-500/10 to-primary-600/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Help & Support</h2>
                <p className="text-sm text-gray-400">Get the help you need to succeed</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-white/10 bg-dark-900/50">
            <div className="flex px-6 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-primary-400 border-b-2 border-primary-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-160px)] custom-scrollbar">
            <div className="p-6">
              {activeTab === 'faq' && (
                <div className="space-y-6">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search frequently asked questions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-dark-700 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  {/* FAQ Categories */}
                  <div className="space-y-6">
                    {(searchQuery ? filteredFAQ : faqData).map((category, categoryIndex) => (
                      <div key={category.category} className="space-y-4">
                        <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                          {category.category}
                        </h3>
                        <div className="space-y-3">
                          {category.questions.map((faq, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                              className="bg-dark-700/50 rounded-lg"
                            >
                              <details className="group">
                                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5">
                                  <h4 className="font-medium text-white pr-4">{faq.q}</h4>
                                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform" />
                                </summary>
                                <div className="px-4 pb-4">
                                  <p className="text-gray-300 leading-relaxed">{faq.a}</p>
                                </div>
                              </details>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'guides' && (
                <div className="grid md:grid-cols-2 gap-4">
                  {guides.map((guide, index) => (
                    <motion.div
                      key={guide.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-dark-700/50 rounded-xl p-6 hover:bg-dark-700/70 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{guide.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">
                              {guide.title}
                            </h3>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white" />
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{guide.description}</p>
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              guide.category === 'Beginner' ? 'bg-green-400/20 text-green-400' :
                              guide.category === 'Intermediate' ? 'bg-yellow-400/20 text-yellow-400' :
                              'bg-red-400/20 text-red-400'
                            }`}>
                              {guide.category}
                            </span>
                            <span className="text-xs text-gray-400">{guide.duration}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'videos' && (
                <div className="grid md:grid-cols-2 gap-4">
                  {tutorials.map((video, index) => (
                    <motion.div
                      key={video.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-dark-700/50 rounded-xl overflow-hidden hover:bg-dark-700/70 transition-colors cursor-pointer group"
                    >
                      <div className="aspect-video bg-gradient-to-br from-primary-500/20 to-primary-700/20 flex items-center justify-center text-4xl">
                        {video.thumbnail}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">{video.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full">
                            {video.category}
                          </span>
                          <span className="text-xs text-gray-400">{video.duration}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="max-w-2xl mx-auto space-y-6">
                  {/* Contact Options */}
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-dark-700/50 rounded-xl p-4 text-center">
                      <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Mail className="w-6 h-6 text-primary-400" />
                      </div>
                      <h3 className="font-semibold text-white mb-1">Email Support</h3>
                      <p className="text-sm text-gray-400 mb-2">support@astraldraft.com</p>
                      <p className="text-xs text-gray-500">Response within 24 hours</p>
                    </div>
                    <div className="bg-dark-700/50 rounded-xl p-4 text-center">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="w-6 h-6 text-green-400" />
                      </div>
                      <h3 className="font-semibold text-white mb-1">Live Chat</h3>
                      <p className="text-sm text-gray-400 mb-2">Available 9 AM - 6 PM EST</p>
                      <p className="text-xs text-gray-500">Instant response</p>
                    </div>
                    <div className="bg-dark-700/50 rounded-xl p-4 text-center">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-white mb-1">24/7 Help Center</h3>
                      <p className="text-sm text-gray-400 mb-2">Self-service resources</p>
                      <p className="text-xs text-gray-500">Always available</p>
                    </div>
                  </div>

                  {/* Support Ticket Form */}
                  <div className="bg-dark-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Submit Support Ticket</h3>
                    <form onSubmit={handleSubmitTicket} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                          <select
                            value={supportTicket.category}
                            onChange={(e) => setSupportTicket(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full bg-dark-600 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="general">General Question</option>
                            <option value="technical">Technical Issue</option>
                            <option value="billing">Billing & Account</option>
                            <option value="feature">Feature Request</option>
                            <option value="bug">Bug Report</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                          <select
                            value={supportTicket.priority}
                            onChange={(e) => setSupportTicket(prev => ({ ...prev, priority: e.target.value }))}
                            className="w-full bg-dark-600 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                        <input
                          type="text"
                          value={supportTicket.subject}
                          onChange={(e) => setSupportTicket(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Brief description of your issue"
                          className="w-full bg-dark-600 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                        <textarea
                          value={supportTicket.description}
                          onChange={(e) => setSupportTicket(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Please provide as much detail as possible about your issue"
                          rows={5}
                          className="w-full bg-dark-600 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 resize-none"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-lg transition-colors"
                      >
                        Submit Support Ticket
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default HelpSupportModal;