/**
 * AI Fantasy Assistant Component
 * Natural language AI assistant for fantasy football advice
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../../contexts/AppContext';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  data?: any;
}

interface AIResponse {
  message: string;
  confidence: number;
  suggestions: string[];
  actionable: boolean;
  data?: any;
}

const AIFantasyAssistant: React.FC = () => {
  const { state } = useAppState();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUser = state.user;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        type: 'assistant',
        content: `Hi ${currentUser?.name}! I'm your AI Fantasy Assistant. I can help you with:\n\n• Trade analysis and recommendations\n• Start/sit decisions\n• Waiver wire targets\n• Injury impact analysis\n• Lineup optimization\n• League strategy advice\n\nWhat would you like help with today?`,
        timestamp: new Date(),
        suggestions: [
          'Analyze my team',
          'Who should I start this week?',
          'Find waiver wire targets',
          'Help me with a trade',
          'Injury impact analysis'
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [currentUser?.name, messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await getAIResponse(inputMessage.trim());
      
      // Simulate typing delay
      setTimeout(() => {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          type: 'assistant',
          content: response.message,
          timestamp: new Date(),
          suggestions: response.suggestions,
          data: response.data
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or rephrase your question.',
        timestamp: new Date(),
        suggestions: ['Try again', 'Ask something else']
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const getAIResponse = async (message: string): Promise<AIResponse> => {
    // Simulate AI processing with intelligent responses
    const lowerMessage = message.toLowerCase();
    
    // Trade analysis
    if (lowerMessage.includes('trade') || lowerMessage.includes('should i trade')) {
      return {
        message: `I'd be happy to help analyze a trade! Here's what I can do:\n\n🔍 **Trade Analysis:**\n• Fairness scoring (0-100)\n• Player value comparison\n• Schedule impact assessment\n• Injury risk evaluation\n• Positional impact analysis\n\n📊 **Current Market Insights:**\n• RBs are at premium value right now\n• WR depth is crucial for playoffs\n• QB streaming is viable this season\n\n💡 **Smart Trade Targets:**\nBased on your roster, I recommend targeting:\n• A consistent RB2 for depth\n• A high-ceiling WR for playoffs\n• Consider selling aging players now\n\nWould you like me to analyze a specific trade proposal?`,
        confidence: 95,
        suggestions: [
          'Analyze a specific trade',
          'Find trade targets',
          'What should I trade away?',
          'Trade deadline strategy'
        ],
        actionable: true
      };
    }

    // Start/sit decisions
    if (lowerMessage.includes('start') || lowerMessage.includes('sit') || lowerMessage.includes('lineup')) {
      return {
        message: `Let me help optimize your lineup! Here's my analysis:\n\n🏈 **This Week's Recommendations:**\n\n**Must Starts:**\n• Your top-tier players regardless of matchup\n• Players with plus matchups (weak defenses)\n• Red zone targets in high-scoring games\n\n**Sit Considerations:**\n• Players facing elite defenses\n• Injury-questionable players\n• Weather-affected games\n\n📈 **Matchup Analysis:**\n• Target teams allowing 25+ fantasy points to position\n• Avoid defenses in top 5 against position\n• Consider game script (blowout potential)\n\n🎯 **Key Factors This Week:**\n• Weather conditions in outdoor games\n• Injury reports (check Wednesday-Friday)\n• Vegas betting lines (implied team totals)\n\nWant me to analyze your specific lineup decisions?`,
        confidence: 90,
        suggestions: [
          'Analyze my lineup',
          'QB start/sit help',
          'RB matchup analysis',
          'WR/TE decisions'
        ],
        actionable: true
      };
    }

    // Waiver wire help
    if (lowerMessage.includes('waiver') || lowerMessage.includes('pickup') || lowerMessage.includes('add')) {
      return {
        message: `Great question! Here are this week's top waiver targets:\n\n🎯 **Priority Pickups:**\n\n**High Priority (15-25% FAAB):**\n• Handcuff RBs with injury concerns\n• Emerging WRs with target share growth\n• Streaming defenses vs weak offenses\n\n**Medium Priority (8-15% FAAB):**\n• Bye week fill-ins with good matchups\n• TEs with red zone usage increase\n• QBs with favorable schedules\n\n**Low Priority (1-5% FAAB):**\n• Speculative adds for future weeks\n• Deep league lottery tickets\n• Injury replacements\n\n💰 **FAAB Strategy:**\n• Save 30-40% for season-ending injuries\n• Bid aggressively on league winners\n• Don't overspend on one-week rentals\n\n🔍 **What to Look For:**\n• Snap count increases (65%+)\n• Target share growth (15%+)\n• Red zone opportunities\n• Favorable upcoming schedules\n\nWant specific recommendations for your team?`,
        confidence: 88,
        suggestions: [
          'Show me specific targets',
          'FAAB bidding strategy',
          'Who should I drop?',
          'Streaming options'
        ],
        actionable: true
      };
    }

    // Team analysis
    if (lowerMessage.includes('analyze my team') || lowerMessage.includes('team analysis')) {
      return {
        message: `Let me analyze your team! Here's my assessment:\n\n📊 **Team Strengths:**\n• Strong QB play with consistent scoring\n• Solid RB depth for bye weeks\n• Reliable WR1 with high target share\n\n⚠️ **Areas for Improvement:**\n• TE position needs upgrade\n• Lack of high-ceiling WR2\n• Bench depth at RB concerning\n\n🏆 **Playoff Outlook:**\n• Current trajectory: 7-6 record\n• Strength of schedule: Moderate\n• Key games: Weeks 12, 14, 16\n\n💡 **Recommendations:**\n1. **Trade for TE upgrade** - Target top-12 TE\n2. **Add WR depth** - Look for boom/bust options\n3. **Handcuff your RB1** - Insurance policy\n4. **Stream defenses** - Don't roster 2 defenses\n\n📈 **Power Ranking:** 6th of 10 teams\n**Championship Odds:** 15% (improving with moves)\n\nWant me to dive deeper into any specific area?`,
        confidence: 85,
        suggestions: [
          'Trade recommendations',
          'Playoff strategy',
          'Roster construction',
          'Weekly projections'
        ],
        actionable: true
      };
    }

    // Injury analysis
    if (lowerMessage.includes('injury') || lowerMessage.includes('hurt') || lowerMessage.includes('injured')) {
      return {
        message: `Injury analysis is crucial for fantasy success! Here's what I track:\n\n🏥 **Current Injury Concerns:**\n\n**High Impact:**\n• RB1 injuries - Immediate handcuff value\n• QB injuries - Affects entire offense\n• Elite WR injuries - Target share redistribution\n\n**Medium Impact:**\n• OL injuries - Affects run game/protection\n• TE injuries - Red zone target changes\n• Defense injuries - Affects game script\n\n📊 **Injury Impact Prediction:**\n• **Hamstring:** 2-4 weeks, 60% effectiveness\n• **Ankle:** 1-3 weeks, 80% effectiveness\n��� **Knee:** 4-8 weeks, variable recovery\n• **Concussion:** 1-2 weeks, protocol dependent\n\n🎯 **Action Items:**\n• Monitor practice reports (Wed-Fri)\n• Have backup plans for questionable players\n• Target handcuffs before injuries occur\n• Consider IR stashing for keeper leagues\n\n💡 **Pro Tip:** Injury-prone players often get hurt again. Factor this into trades and roster decisions.\n\nNeed analysis on a specific player's injury?`,
        confidence: 92,
        suggestions: [
          'Specific player injury',
          'Handcuff recommendations',
          'IR stash targets',
          'Injury-prone players'
        ],
        actionable: true
      };
    }

    // General strategy
    if (lowerMessage.includes('strategy') || lowerMessage.includes('advice') || lowerMessage.includes('help')) {
      return {
        message: `Here's my strategic advice for fantasy success:\n\n🎯 **Core Principles:**\n\n**1. Positional Value Hierarchy:**\n• Elite RBs > Elite WRs > Elite TEs > QBs\n• Scarcity drives value - RB depth crucial\n• Stream QBs and Defenses when possible\n\n**2. Trade Timing:**\n• **Weeks 3-6:** Buy low on slow starts\n• **Weeks 7-10:** Peak trading season\n• **Weeks 11-12:** Trade deadline push\n\n**3. Waiver Strategy:**\n• Prioritize opportunity over talent\n• Target players with increasing snap counts\n• Don't chase last week's points\n\n**4. Playoff Preparation:**\n• Weeks 15-17 schedule analysis\n• Handcuff your studs\n• Avoid players with tough playoff matchups\n\n🏆 **Championship Mindset:**\n• Take calculated risks for upside\n• Don't get attached to draft picks\n• Stream positions with good matchups\n• Always be looking ahead 2-3 weeks\n\nWhat specific area would you like to focus on?`,
        confidence: 88,
        suggestions: [
          'Draft strategy',
          'Trade timing',
          'Playoff preparation',
          'Risk management'
        ],
        actionable: true
      };
    }

    // Default response for unclear queries
    return {
      message: `I'd love to help! I can assist with many fantasy football topics:\n\n🏈 **What I Can Help With:**\n• **Trade Analysis** - Fair value and recommendations\n• **Start/Sit Decisions** - Weekly lineup optimization\n• **Waiver Wire** - Pickup targets and FAAB strategy\n• **Team Analysis** - Strengths, weaknesses, outlook\n• **Injury Impact** - Player value and timeline analysis\n• **Strategy Advice** - Season-long planning\n\n💡 **Try asking me:**\n• "Should I trade [Player A] for [Player B]?"\n• "Who should I start at RB this week?"\n• "What waiver wire players should I target?"\n• "Analyze my team's playoff chances"\n• "How does [Player]'s injury affect their value?"\n\nWhat would you like help with?`,
      confidence: 70,
      suggestions: [
        'Trade analysis',
        'Start/sit help',
        'Waiver targets',
        'Team analysis',
        'Injury impact'
      ],
      actionable: false
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white p-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-110"
        title="AI Fantasy Assistant"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🤖</span>
          <span className="hidden sm:inline text-sm font-semibold">AI Assistant</span>
        </div>
      </button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-20 right-4 z-50 w-96 h-96 bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-600 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-600 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Fantasy Assistant</h3>
                  <p className="text-xs text-slate-400">Powered by advanced AI</p>
                </div>
              </div>
              <button
                onClick={() => setIsVisible(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <span className="text-xl">×</span>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message: any) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-line">{message.content}</div>
                    {message.suggestions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-2 py-1 bg-slate-600 hover:bg-slate-500 text-xs rounded transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-700 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-600">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e: any) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about fantasy football..."
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <span className="text-sm">Send</span>
                </button>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-1 mt-2">
                {['Trade help', 'Start/sit', 'Waivers', 'Team analysis'].map((action: any) => (
                  <button
                    key={action}
                    onClick={() => handleSuggestionClick(action)}
                    className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIFantasyAssistant;