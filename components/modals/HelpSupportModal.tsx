import { ErrorBoundary } from &apos;../ui/ErrorBoundary&apos;;
import React, { useCallback, useMemo, useState } from &apos;react&apos;;
import { useEscapeKey } from &apos;../../hooks/useEscapeKey&apos;;
import { motion, AnimatePresence } from &apos;framer-motion&apos;;
import { X, HelpCircle, MessageCircle, Book, Video, Search, ChevronRight, ExternalLink, Mail, Phone, Clock } from &apos;lucide-react&apos;;

interface HelpSupportModalProps {
}
  isOpen: boolean;
  onClose: () => void;

}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({ isOpen, onClose }: any) => {
}
  // Handle Escape key to close modal
  useEscapeKey(isOpen, onClose);

  const [activeTab, setActiveTab] = useState(&apos;faq&apos;);
  const [searchQuery, setSearchQuery] = useState(&apos;&apos;);
  const [supportTicket, setSupportTicket] = useState({
}
    category: &apos;general&apos;,
    subject: &apos;&apos;,
    description: &apos;&apos;,
    priority: &apos;medium&apos;
  });

  const tabs = [
    { id: &apos;faq&apos;, label: &apos;FAQ&apos;, icon: <HelpCircle className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> },
    { id: &apos;guides&apos;, label: &apos;Guides&apos;, icon: <Book className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> },
    { id: &apos;videos&apos;, label: &apos;Tutorials&apos;, icon: <Video className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> },
    { id: &apos;contact&apos;, label: &apos;Contact Support&apos;, icon: <MessageCircle className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" /> }
  ];

  const faqData = [
    {
}
      category: &apos;Getting Started&apos;,
      questions: [
        {
}
          q: &apos;How do I create my first fantasy team?&apos;,
          a: &apos;Navigate to the Team Hub and click "Create Team". Follow the setup wizard to select your league settings, draft format, and invite friends.&apos;
        },
        {
}
          q: &apos;What scoring system should I use?&apos;,
          a: &apos;We recommend PPR (Point Per Reception) for beginners as it provides more consistent scoring. Standard scoring is also popular for traditional leagues.&apos;
        },
        {
}
          q: &apos;How many teams should be in my league?&apos;,
          a: &apos;10-12 teams is ideal for competitive balance. 8 teams can work for casual leagues, while 14+ teams are for experienced players who want a challenge.&apos;
        }
      ]
    },
    {
}
      category: &apos;Draft & Players&apos;,
      questions: [
        {
}
          q: &apos;How does the draft work?&apos;,
          a: &apos;Our live draft room supports snake, auction, and custom formats. Players take turns selecting from available players until all rosters are full.&apos;
        },
        {
}
          q: &apos;Can I trade players?&apos;,
          a: &apos;Yes! Use the Trade Center to propose trades. Both managers must accept, and your league commissioner may need to approve depending on settings.&apos;
        },
        {
}
          q: &apos;What is the waiver wire?&apos;,
          a: &apos;The waiver wire contains unowned players. Submit claims during the waiver period (usually Tuesday-Wednesday) to add players to your team.&apos;
        }
      ]
    },
    {
}
      category: &apos;Scoring & Rules&apos;,
      questions: [
        {
}
          q: &apos;When are scores updated?&apos;,
          a: &apos;Scores are updated in real-time during games. Final scores are typically available within 24 hours after the last game ends.&apos;
        },
        {
}
          q: &apos;What happens if a player is injured?&apos;,
          a: &apos;If a player is ruled out before the game starts, you can substitute them. Once games begin, injured players score 0 points.&apos;
        },
        {
}
          q: &apos;How do playoffs work?&apos;,
          a: &apos;Top teams (usually 4-6) make playoffs in weeks 14-17. Playoffs use single-elimination brackets with matchups based on regular season standings.&apos;
        }
      ]
    },
    {
}
      category: &apos;Technical Issues&apos;,
      questions: [
        {
}
          q: &apos;The app is running slowly, what can I do?&apos;,
          a: &apos;Try clearing your browser cache, updating to the latest version, or switching to a different browser. Contact support if issues persist.&apos;
        },
        {
}
          q: &apos;I lost access to my account, how do I recover it?&apos;,
          a: &apos;Use the "Forgot Password" link on the login page, or contact support with your email address and we\&apos;ll help you regain access.&apos;
        },
        {
}
          q: &apos;Can I use the app on my phone?&apos;,
          a: &apos;Yes! Our app is fully responsive and optimized for mobile devices. You can also install it as a PWA for native app-like experience.&apos;
        }
      ]
    }
  ];

  const guides = [
    {
}
      title: &apos;Fantasy Football Basics&apos;,
      description: &apos;Complete guide for beginners covering all fundamentals&apos;,
      duration: &apos;15 min read&apos;,
      category: &apos;Beginner&apos;,
      icon: &apos;📚&apos;
    },
    {
}
      title: &apos;Draft Strategy Guide&apos;,
      description: &apos;Advanced drafting techniques and position prioritization&apos;,
      duration: &apos;20 min read&apos;,
      category: &apos;Advanced&apos;,
      icon: &apos;🎯&apos;
    },
    {
}
      title: &apos;Waiver Wire Mastery&apos;,
      description: &apos;How to find and claim the best free agents&apos;,
      duration: &apos;12 min read&apos;,
      category: &apos;Intermediate&apos;,
      icon: &apos;🔍&apos;
    },
    {
}
      title: &apos;Trade Negotiation&apos;,
      description: &apos;Tips for successful player trades and valuations&apos;,
      duration: &apos;18 min read&apos;,
      category: &apos;Advanced&apos;,
      icon: &apos;🤝&apos;
    },
    {
}
      title: &apos;Mobile App Features&apos;,
      description: &apos;Make the most of our mobile experience&apos;,
      duration: &apos;8 min read&apos;,
      category: &apos;Beginner&apos;,
      icon: &apos;📱&apos;
    },
    {
}
      title: &apos;League Management&apos;,
      description: &apos;Commissioner tools and league administration&apos;,
      duration: &apos;25 min read&apos;,
      category: &apos;Advanced&apos;,
      icon: &apos;⚙️&apos;
    }
  ];

  const tutorials = [
    {
}
      title: &apos;Setting Up Your First League&apos;,
      description: &apos;Step-by-step video walkthrough of league creation&apos;,
      duration: &apos;8:32&apos;,
      thumbnail: &apos;🎬&apos;,
      category: &apos;Getting Started&apos;
    },
    {
}
      title: &apos;Live Draft Walkthrough&apos;,
      description: &apos;See how our draft room works in real-time&apos;,
      duration: &apos;12:15&apos;,
      thumbnail: &apos;🎬&apos;,
      category: &apos;Draft&apos;
    },
    {
}
      title: &apos;Managing Your Team&apos;,
      description: &apos;Weekly roster management and lineup optimization&apos;,
      duration: &apos;6:48&apos;,
      thumbnail: &apos;🎬&apos;,
      category: &apos;Team Management&apos;
    },
    {
}
      title: &apos;Using Analytics Tools&apos;,
      description: &apos;Leverage our advanced analytics for better decisions&apos;,
      duration: &apos;10:23&apos;,
      thumbnail: &apos;🎬&apos;,
      category: &apos;Analytics&apos;
    },
    {
}
      title: &apos;Mobile App Tour&apos;,
      description: &apos;Complete guide to mobile features and navigation&apos;,
      duration: &apos;5:17&apos;,
      thumbnail: &apos;🎬&apos;,
      category: &apos;Mobile&apos;
    }
  ];

  const filteredFAQ = faqData.map((category: any) => ({
}
    ...category,
    questions: category.questions.filter(
      item =>
        item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter((category: any) => category.questions.length > 0);

  const handleSubmitTicket = (e: React.FormEvent) => {
}
    e.preventDefault();
    // Handle support ticket submission
    console.log(&apos;Support ticket submitted:&apos;, supportTicket);
    // Reset form
    setSupportTicket({
}
      category: &apos;general&apos;,
      subject: &apos;&apos;,
      description: &apos;&apos;,
      priority: &apos;medium&apos;
    });
    // Show success message
    alert(&apos;Support ticket submitted successfully! We\&apos;ll get back to you within 24 hours.&apos;);
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
          className="relative w-full max-w-5xl max-h-[90vh] bg-dark-800/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden sm:px-4 md:px-6 lg:px-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-primary-500/10 to-primary-600/10 sm:px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
              <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center sm:px-4 md:px-6 lg:px-8">
                <HelpCircle className="w-5 h-5 text-primary-400 sm:px-4 md:px-6 lg:px-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Help & Support</h2>
                <p className="text-sm text-gray-400 sm:px-4 md:px-6 lg:px-8">Get the help you need to succeed</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition-colors sm:px-4 md:px-6 lg:px-8"
             aria-label="Action button">
              <X className="w-4 h-4 sm:px-4 md:px-6 lg:px-8" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-white/10 bg-dark-900/50 sm:px-4 md:px-6 lg:px-8">
            <div className="flex px-6 gap-1 sm:px-4 md:px-6 lg:px-8">
              {tabs.map((tab: any) => (
}
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
}
                    activeTab === tab.id
                      ? &apos;bg-primary-500 text-white&apos;
                      : &apos;text-gray-400 hover:text-white hover:bg-white/10&apos;
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-160px)] custom-scrollbar sm:px-4 md:px-6 lg:px-8">
            <div className="p-6 sm:px-4 md:px-6 lg:px-8">
              {activeTab === &apos;faq&apos; && (
}
                <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                  {/* Search */}
                  <div className="relative sm:px-4 md:px-6 lg:px-8">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 sm:px-4 md:px-6 lg:px-8" />
                    <input
                      type="text"
                      placeholder="Search frequently asked questions..."
                      value={searchQuery}
                      onChange={(e: any) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* FAQ Categories */}
                  <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
                    {(searchQuery ? filteredFAQ : faqData).map((category, categoryIndex) => (
}
                      <div key={category.category} className="space-y-4 sm:px-4 md:px-6 lg:px-8">
                        <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2 sm:px-4 md:px-6 lg:px-8">
                          {category.category}
                        </h3>
                        <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
                          {category.questions.map((faq, index) => (
}
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                              className="bg-dark-700/50 rounded-lg sm:px-4 md:px-6 lg:px-8"
                            >
                              <details className="group sm:px-4 md:px-6 lg:px-8">
                                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 sm:px-4 md:px-6 lg:px-8">
                                  <h4 className="font-medium text-white pr-4 sm:px-4 md:px-6 lg:px-8">{faq.q}</h4>
                                  <ChevronRight className="w-4 h-4 text-gray-400 group-open:rotate-90 transition-transform sm:px-4 md:px-6 lg:px-8" />
                                </summary>
                                <div className="px-4 pb-4 sm:px-4 md:px-6 lg:px-8">
                                  <p className="text-gray-300 leading-relaxed sm:px-4 md:px-6 lg:px-8">{faq.a}</p>
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

              {activeTab === &apos;guides&apos; && (
}
                <div className="grid md:grid-cols-2 gap-4">
                  {guides.map((guide, index) => (
}
                    <motion.div
                      key={guide.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-dark-700/50 rounded-xl p-6 hover:bg-dark-700/70 transition-colors cursor-pointer group sm:px-4 md:px-6 lg:px-8"
                    >
                      <div className="flex items-start gap-4 sm:px-4 md:px-6 lg:px-8">
                        <div className="text-3xl sm:px-4 md:px-6 lg:px-8">{guide.icon}</div>
                        <div className="flex-1 sm:px-4 md:px-6 lg:px-8">
                          <div className="flex items-center justify-between mb-2 sm:px-4 md:px-6 lg:px-8">
                            <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors sm:px-4 md:px-6 lg:px-8">
                              {guide.title}
                            </h3>
                            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white sm:px-4 md:px-6 lg:px-8" />
                          </div>
                          <p className="text-gray-400 text-sm mb-3 sm:px-4 md:px-6 lg:px-8">{guide.description}</p>
                          <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                            <span className={`text-xs px-2 py-1 rounded-full ${
}
                              guide.category === &apos;Beginner&apos; ? &apos;bg-green-400/20 text-green-400&apos; :
                              guide.category === &apos;Intermediate&apos; ? &apos;bg-yellow-400/20 text-yellow-400&apos; :
                              &apos;bg-red-400/20 text-red-400&apos;
                            }`}>
                              {guide.category}
                            </span>
                            <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{guide.duration}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === &apos;videos&apos; && (
}
                <div className="grid md:grid-cols-2 gap-4">
                  {tutorials.map((video, index) => (
}
                    <motion.div
                      key={video.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-dark-700/50 rounded-xl overflow-hidden hover:bg-dark-700/70 transition-colors cursor-pointer group sm:px-4 md:px-6 lg:px-8"
                    >
                      <div className="aspect-video bg-gradient-to-br from-primary-500/20 to-primary-700/20 flex items-center justify-center text-4xl sm:px-4 md:px-6 lg:px-8">
                        {video.thumbnail}
                      </div>
                      <div className="p-4 sm:px-4 md:px-6 lg:px-8">
                        <h3 className="font-semibold text-white mb-2 group-hover:text-primary-400 transition-colors sm:px-4 md:px-6 lg:px-8">
                          {video.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3 sm:px-4 md:px-6 lg:px-8">{video.description}</p>
                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                          <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full sm:px-4 md:px-6 lg:px-8">
                            {video.category}
                          </span>
                          <span className="text-xs text-gray-400 sm:px-4 md:px-6 lg:px-8">{video.duration}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === &apos;contact&apos; && (
}
                <div className="max-w-2xl mx-auto space-y-6 sm:px-4 md:px-6 lg:px-8">
                  {/* Contact Options */}
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-dark-700/50 rounded-xl p-4 text-center sm:px-4 md:px-6 lg:px-8">
                      <div className="w-12 h-12 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 sm:px-4 md:px-6 lg:px-8">
                        <Mail className="w-6 h-6 text-primary-400 sm:px-4 md:px-6 lg:px-8" />
                      </div>
                      <h3 className="font-semibold text-white mb-1 sm:px-4 md:px-6 lg:px-8">Email Support</h3>
                      <p className="text-sm text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">support@astraldraft.com</p>
                      <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">Response within 24 hours</p>
                    </div>
                    <div className="bg-dark-700/50 rounded-xl p-4 text-center sm:px-4 md:px-6 lg:px-8">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 sm:px-4 md:px-6 lg:px-8">
                        <MessageCircle className="w-6 h-6 text-green-400 sm:px-4 md:px-6 lg:px-8" />
                      </div>
                      <h3 className="font-semibold text-white mb-1 sm:px-4 md:px-6 lg:px-8">Live Chat</h3>
                      <p className="text-sm text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">Available 9 AM - 6 PM EST</p>
                      <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">Instant response</p>
                    </div>
                    <div className="bg-dark-700/50 rounded-xl p-4 text-center sm:px-4 md:px-6 lg:px-8">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 sm:px-4 md:px-6 lg:px-8">
                        <Clock className="w-6 h-6 text-blue-400 sm:px-4 md:px-6 lg:px-8" />
                      </div>
                      <h3 className="font-semibold text-white mb-1 sm:px-4 md:px-6 lg:px-8">24/7 Help Center</h3>
                      <p className="text-sm text-gray-400 mb-2 sm:px-4 md:px-6 lg:px-8">Self-service resources</p>
                      <p className="text-xs text-gray-500 sm:px-4 md:px-6 lg:px-8">Always available</p>
                    </div>
                  </div>

                  {/* Support Ticket Form */}
                  <div className="bg-dark-700/50 rounded-xl p-6 sm:px-4 md:px-6 lg:px-8">
                    <h3 className="text-lg font-semibold text-white mb-4 sm:px-4 md:px-6 lg:px-8">Submit Support Ticket</h3>
                    <form onSubmit={handleSubmitTicket} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Category</label>
                          <select
                            value={supportTicket.category}
                            onChange={(e: any) => setSupportTicket(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full bg-dark-600 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 sm:px-4 md:px-6 lg:px-8"
                          >
                            <option value="general">General Question</option>
                            <option value="technical">Technical Issue</option>
                            <option value="billing">Billing & Account</option>
                            <option value="feature">Feature Request</option>
                            <option value="bug">Bug Report</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Priority</label>
                          <select
                            value={supportTicket.priority}
                            onChange={(e: any) => setSupportTicket(prev => ({ ...prev, priority: e.target.value }))}
                            className="w-full bg-dark-600 border border-white/20 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-primary-500 sm:px-4 md:px-6 lg:px-8"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Subject</label>
                        <input
                          type="text"
                          value={supportTicket.subject}
                          onChange={(e: any) => setSupportTicket(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="Brief description of your issue"
                          className="w-full bg-dark-600 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 sm:px-4 md:px-6 lg:px-8"
//                           required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 sm:px-4 md:px-6 lg:px-8">Description</label>
                        <textarea
                          value={supportTicket.description}
                          onChange={(e: any) => setSupportTicket(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Please provide as much detail as possible about your issue"
                          rows={5}
                          className="w-full bg-dark-600 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 resize-none sm:px-4 md:px-6 lg:px-8"
//                           required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-lg transition-colors sm:px-4 md:px-6 lg:px-8"
                       aria-label="Action button">
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

const HelpSupportModalWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <HelpSupportModal {...props} />
  </ErrorBoundary>
);

export default React.memo(HelpSupportModalWithErrorBoundary);