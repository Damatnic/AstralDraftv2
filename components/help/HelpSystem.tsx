/**
 * Help System Component
 * Comprehensive help documentation and tutorials
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useState, useMemo } from 'react';
import { useAppState } from '../../contexts/AppContext';
import { loadFramerMotion } from '../../utils/dynamicImports';
import DOMPurify from 'isomorphic-dompurify';

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  lastUpdated: Date;
  helpful: number;
  views: number;

}

interface HelpCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  articles: string[];}

const HelpSystem: React.FC = () => {
  const { state } = useAppState();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('getting-started');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Help categories
  const categories: HelpCategory[] = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: '🚀',
      description: 'New to fantasy football? Start here!',
      articles: ['fantasy-basics', 'league-setup', 'draft-guide', 'scoring-system']
    },
    {
      id: 'draft',
      name: 'Draft & Prep',
      icon: '📋',
      description: 'Master your draft strategy',
      articles: ['draft-strategy', 'player-rankings', 'mock-drafts', 'draft-room-guide']
    },
    {
      id: 'season-management',
      name: 'Season Management',
      icon: '🏈',
      description: 'Manage your team during the season',
      articles: ['lineup-setting', 'waiver-wire', 'trading-guide', 'injury-management']
    },
    {
      id: 'advanced',
      name: 'Advanced Strategy',
      icon: '🧠',
      description: 'Take your game to the next level',
      articles: ['advanced-analytics', 'playoff-strategy', 'championship-tips', 'ai-features']
    },
    {
      id: 'troubleshooting',
      name: 'Troubleshooting',
      icon: '🔧',
      description: 'Fix common issues',
      articles: ['login-issues', 'app-problems', 'notification-setup', 'performance-tips']

  ];

  // Help articles
  const articles: HelpArticle[] = [
    {
      id: 'fantasy-basics',
      title: 'Fantasy Football Basics',
      category: 'getting-started',
      content: `# Fantasy Football Basics

Welcome to the exciting world of fantasy football! Here's everything you need to know to get started.

## What is Fantasy Football?

Fantasy football is a game where you act as the owner and manager of a virtual football team. You draft real NFL players and score points based on their actual performance in games.

## How It Works

1. **Draft Players**: Select NFL players for your roster
2. **Set Lineups**: Choose which players to start each week
3. **Score Points**: Earn points based on player performance
4. **Win Games**: Beat other teams in your league
5. **Make Playoffs**: Top teams compete for the championship

## Basic Positions

- **QB (Quarterback)**: Throws passes, scores touchdowns
- **RB (Running Back)**: Runs the ball, catches passes
- **WR (Wide Receiver)**: Catches passes from QB
- **TE (Tight End)**: Blocks and catches passes
- **K (Kicker)**: Kicks field goals and extra points
- **DEF (Defense)**: Team defense and special teams

## Scoring System

Our league uses **PPR (Point Per Reception)** scoring:

- **Passing**: 1 point per 25 yards, 4 points per TD
- **Rushing**: 1 point per 10 yards, 6 points per TD
- **Receiving**: 1 point per 10 yards, 6 points per TD, 1 point per reception
- **Kicking**: 3 points per field goal, 1 point per extra point
- **Defense**: Points for turnovers, sacks, touchdowns, shutouts

## Season Structure

- **Regular Season**: Weeks 1-14 (head-to-head matchups)
- **Playoffs**: Weeks 15-17 (top 6 teams compete)
- **Championship**: Week 17 (final two teams)

## Key Strategies

1. **Draft Running Backs Early**: They're scarce and valuable
2. **Stream Defenses**: Pick up defenses with good matchups
3. **Work the Waiver Wire**: Add emerging players weekly
4. **Make Smart Trades**: Improve your team through trades
5. **Plan for Playoffs**: Consider playoff schedules

Ready to dominate your league? Let's get started!`,
      tags: ['basics', 'beginner', 'rules', 'scoring'],
      difficulty: 'beginner',
      readTime: 5,
      lastUpdated: new Date('2024-01-15'),
      helpful: 47,
      views: 234
    },
    {
      id: 'draft-strategy',
      title: 'Advanced Draft Strategy',
      category: 'draft',
      content: `# Advanced Draft Strategy

Master your draft with these proven strategies and techniques.

## Pre-Draft Preparation

### 1. Know Your League Settings
- **Scoring system** (PPR, Half-PPR, Standard)
- **Roster requirements** (2 RB, 3 WR, 1 FLEX, etc.)
- **League size** (10, 12, 14 teams)
- **Draft format** (Snake, Auction, etc.)

### 2. Create Your Rankings
- Use multiple sources (experts, projections, ADP)
- Adjust for your league's scoring system
- Create tiers within positions
- Identify value picks and sleepers

### 3. Mock Draft Practice
- Practice with your exact league settings
- Try different draft positions
- Test various strategies
- Get comfortable with the draft interface

## Draft Day Strategies

### The Zero RB Strategy
**When to Use**: Deep at WR, shallow at RB
- Draft WR/WR in first two rounds
- Target high-upside RBs in middle rounds
- Stream RBs from waiver wire

### The Robust RB Strategy
**When to Use**: RB-heavy draft board
- Draft RB/RB in first two rounds
- Secure backfield workhorses
- Find WR value in middle rounds

### The Balanced Approach
**When to Use**: Most situations
- Draft best available player
- Maintain positional balance
- Adapt to draft flow

## Position-Specific Tips

### Quarterback Strategy
- **Elite Tier**: Mahomes, Allen, Burrow (Rounds 3-5)
- **Streaming Tier**: Everyone else (Rounds 10+)
- **Never draft 2 QBs** unless superflex league

### Running Back Strategy
- **Tier 1**: Bellcow backs with 300+ touches
- **Tier 2**: Committee backs with upside
- **Handcuffs**: Backup RBs to elite starters
- **Target**: 4-5 RBs total

### Wide Receiver Strategy
- **Target share** is king (25%+ ideal)
- **Red zone targets** create TD upside
- **Age curve**: Peak years 24-28
- **Depth**: Draft 5-6 WRs

### Tight End Strategy
- **Elite tier**: Kelce, Andrews (Rounds 2-4)
- **Streaming tier**: Everyone else (Rounds 12+)
- **Avoid the middle**: Don't reach for TE6-12

### Defense/Kicker Strategy
- **Stream defenses** based on matchups
- **Draft last two rounds** only
- **Target**: Good offenses for kickers
- **Avoid**: Drafting too early

## Advanced Concepts

### Value-Based Drafting (VBD)
Calculate player value above replacement level:
- Compare to worst starter at position
- Draft players with highest VBD
- Adjust for positional scarcity

### Auction Strategy
- **Nominate players** you don't want early
- **Save money** for stars you target
- **Don't get stuck** with budget at end
- **Target value** in middle tiers

### Best Ball Strategy
- **No lineup management** required
- **Draft for ceiling** over floor
- **Correlate players** from same team
- **Handcuff strategy** more important

## Draft Day Execution

### Before Your Pick
1. Check your queue/rankings
2. Review available players
3. Consider positional needs
4. Watch for runs on positions

### Making Your Pick
1. **Trust your rankings** but adapt
2. **Don't reach** more than 1 round
3. **Consider bye weeks** in late rounds
4. **Take upside** over safety late

### After Your Pick
1. Update your needs
2. Adjust future strategy
3. Monitor other teams
4. Prepare for next pick

## Common Mistakes to Avoid

1. **Drafting a kicker too early**
2. **Reaching for your favorite players**
3. **Ignoring bye weeks completely**
4. **Not adapting to draft flow**
5. **Drafting injured players**
6. **Following rankings blindly**
7. **Panicking during runs**

## Post-Draft Strategy

1. **Evaluate your roster** honestly
2. **Identify weaknesses** to address
3. **Target handcuffs** on waivers
4. **Make early trades** if needed
5. **Prepare for Week 1** lineup

Remember: The draft is just the beginning. Stay active on waivers and make smart trades throughout the season!`,
      tags: ['draft', 'strategy', 'advanced', 'preparation'],
      difficulty: 'advanced',
      readTime: 12,
      lastUpdated: new Date('2024-01-20'),
      helpful: 89,
      views: 456
    },
    {
      id: 'ai-features',
      title: 'Using AI Features',
      category: 'advanced',
      content: `# Using AI Features

Astral Draft includes powerful AI features to give you a competitive edge. Here's how to use them effectively.

## AI Trade Analyzer

### What It Does
- Analyzes trade fairness (0-100 score)
- Predicts trade winner with confidence
- Provides detailed value breakdown
- Suggests alternative offers
- Considers schedule strength and injury risk

### How to Use It
1. Navigate to **Trade Center**
2. Select **Propose Trade** tab
3. Add players to trade
4. Click **Analyze Trade** button
5. Review detailed analysis and recommendations

### Understanding the Analysis
- **Fairness Score**: 85+ = Very Fair, 70-84 = Fair, 50-69 = Questionable, <50 = Unfair
- **Winner Prediction**: Based on projected value and team context
- **Confidence Level**: How certain the AI is about the analysis
- **Grades**: Letter grades for each team (A+ to C-)

### Pro Tips
- Use for **all major trades** before proposing
- Consider **schedule strength** in analysis
- Pay attention to **injury risk** factors
- Review **alternative offers** for better deals

## AI Fantasy Assistant

### What It Can Help With
- Trade analysis and recommendations
- Start/sit decisions for your lineup
- Waiver wire targets and FAAB strategy
- Injury impact analysis
- Team evaluation and playoff outlook
- General strategy advice

### How to Access
1. Click the **AI Assistant** button (bottom right)
2. Type your question in natural language
3. Review the detailed response
4. Use suggested follow-up questions

### Example Questions
- "Should I trade Derrick Henry for Cooper Kupp?"
- "Who should I start at RB this week?"
- "What waiver wire players should I target?"
- "How does CMC's injury affect his value?"
- "Analyze my team's playoff chances"

### Getting Better Responses
- Be **specific** about players and situations
- Mention your **league settings** (PPR, roster size)
- Include **context** about your team needs
- Ask **follow-up questions** for clarification

## Smart Lineup Optimizer

### What It Does
- Analyzes all possible lineup combinations
- Considers matchups and projections
- Factors in weather and injury reports
- Provides confidence ratings
- Explains reasoning for each decision

### How to Use It
1. Go to **Team Hub** → **Lineup** tab
2. Click **AI Optimize** button
3. Review suggested lineup
4. Read reasoning for each position
5. Make manual adjustments if desired

### Optimization Factors
- **Projected points** from multiple sources
- **Matchup difficulty** vs opposing defense
- **Weather conditions** for outdoor games
- **Injury status** and practice reports
- **Game script** predictions (blowouts vs close games)

## Waiver Wire AI

### Smart Recommendations
- Identifies **breakout candidates** before they break out
- Calculates **optimal FAAB bids** based on league trends
- Suggests **drop candidates** to make room
- Prioritizes pickups by **immediate vs future value**

### How to Access
1. Navigate to **Waiver Wire**
2. Click **AI Recommendations** tab
3. Review prioritized player list
4. See suggested bid amounts
5. One-click claim with AI suggestions

### Understanding Recommendations
- **Priority Level**: High/Medium/Low urgency
- **Bid Amount**: Suggested FAAB percentage
- **Reasoning**: Why the AI recommends this player
- **Drop Candidate**: Who to drop to make room

## Injury Impact Predictor

### What It Analyzes
- **Injury type and severity** impact on performance
- **Recovery timeline** based on historical data
- **Handcuff value** increases
- **Trade value** changes
- **Replacement options** available

### How to Use It
1. When injury news breaks, ask the AI Assistant
2. Example: "How does Saquon's ankle injury affect his value?"
3. Review impact prediction and timeline
4. Consider recommended actions (hold, trade, handcuff)

### Injury Categories
- **Minor** (1-2 weeks): Limited impact, usually hold
- **Moderate** (3-6 weeks): Significant impact, consider alternatives
- **Major** (6+ weeks): Season-changing, immediate action needed

## Performance Analytics

### Team Analysis
- **Strength/weakness** identification
- **Playoff probability** calculations
- **Schedule difficulty** remaining
- **Trade deadline** strategy suggestions

### Player Trends
- **Usage rate** changes over time
- **Target share** evolution
- **Red zone** opportunity trends
- **Snap count** progression

## Best Practices

### Do's
✅ **Use AI as a guide**, not absolute truth
✅ **Combine AI insights** with your knowledge
✅ **Ask specific questions** for better responses
✅ **Consider multiple factors** beyond AI recommendations
✅ **Update AI** with current information when possible

### Don'ts
❌ **Don't blindly follow** AI recommendations
❌ **Don't ignore** your gut feelings completely
❌ **Don't forget** league-specific factors
❌ **Don't rely solely** on AI for decisions
❌ **Don't expect perfection** - AI makes mistakes too

## Troubleshooting AI Features

### If AI Seems Wrong
1. **Check data recency** - AI uses latest available data
2. **Consider context** - Your league may be different
3. **Ask follow-up questions** for clarification
4. **Provide more details** about your situation

### If AI is Slow
1. **Check internet connection**
2. **Try refreshing** the page
3. **Ask simpler questions** first
4. **Contact support** if persistent issues

### Getting the Most Value
- **Use regularly** throughout the season
- **Ask about trends** and patterns
- **Combine with research** from other sources
- **Share insights** with league mates (or don't! 😉)

The AI features in Astral Draft are designed to give you an edge, but remember - fantasy football is still about having fun and enjoying the competition with friends!`,
      tags: ['ai', 'features', 'advanced', 'tools'],
      difficulty: 'intermediate',
      readTime: 8,
      lastUpdated: new Date('2024-01-25'),
      helpful: 72,
      views: 189

  ];

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((article: any) => article.category === selectedCategory);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((article: any) =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.tags.some((tag: any) => tag.toLowerCase().includes(query))
      );

    return filtered;
  }, [selectedCategory, searchQuery]);

  const selectedArticleData = articles.find((article: any) => article.id === selectedArticle);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-900/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-900/20';
      case 'advanced': return 'text-red-400 bg-red-900/20';
      default: return 'text-slate-400 bg-slate-900/20';

  };

  const formatContent = (content: string) => {
    // Escape HTML to prevent XSS attacks
    const escapeHtml = (text: string) => {
      const element = document.createElement('div');
      element.textContent = text;
      return element.innerHTML;
    };

    // Safe markdown-like formatting - escape first, then apply formatting
    const escaped = escapeHtml(content);
    return escaped
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-white mb-3 mt-6">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium text-white mb-2 mt-4">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\n\n/g, '</p><p class="text-slate-300 mb-4">')
      .replace(/\n/g, '<br>');
  };

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        title="Help & Documentation"
      >
        <span className="text-xl sm:px-4 md:px-6 lg:px-8">❓</span>
      </button>

      {/* Help System Modal */}
      <AnimatePresence>
        {isVisible && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:px-4 md:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-6xl h-[80vh] bg-slate-800/95 backdrop-blur-sm rounded-xl border border-slate-600 shadow-2xl flex sm:px-4 md:px-6 lg:px-8"
            >
              {/* Sidebar */}
              <div className="w-80 border-r border-slate-600 flex flex-col sm:px-4 md:px-6 lg:px-8">
                {/* Header */}
                <div className="p-4 border-b border-slate-600 sm:px-4 md:px-6 lg:px-8">
                  <div className="flex items-center justify-between mb-4 sm:px-4 md:px-6 lg:px-8">
                    <h2 className="text-xl font-bold text-white sm:px-4 md:px-6 lg:px-8">Help Center</h2>
                    <button
                      onClick={() => setIsVisible(false)}
                    >
                      <span className="text-xl sm:px-4 md:px-6 lg:px-8">×</span>
                    </button>
                  </div>
                  
                  {/* Search */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e: any) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:border-blue-500 focus:outline-none sm:px-4 md:px-6 lg:px-8"
                  />
                </div>

                {/* Categories */}
                <div className="flex-1 overflow-y-auto p-4 sm:px-4 md:px-6 lg:px-8">
                  <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
                    <button
                      onClick={() => setSelectedCategory('all')}`}
                    >
                      <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                        <span className="text-lg sm:px-4 md:px-6 lg:px-8">📚</span>
                        <div>
                          <div className="font-medium sm:px-4 md:px-6 lg:px-8">All Articles</div>
                          <div className="text-xs opacity-75 sm:px-4 md:px-6 lg:px-8">{articles.length} articles</div>
                        </div>
                      </div>
                    </button>

                    {categories.map((category: any) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}`}
                      >
                        <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                          <span className="text-lg sm:px-4 md:px-6 lg:px-8">{category.icon}</span>
                          <div>
                            <div className="font-medium sm:px-4 md:px-6 lg:px-8">{category.name}</div>
                            <div className="text-xs opacity-75 sm:px-4 md:px-6 lg:px-8">{category.description}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col sm:px-4 md:px-6 lg:px-8">
                {selectedArticle ? (
                  /* Article View */
                  <div className="flex-1 overflow-y-auto sm:px-4 md:px-6 lg:px-8">
                    <div className="p-6 sm:px-4 md:px-6 lg:px-8">
                      {/* Article Header */}
                      <div className="mb-6 sm:px-4 md:px-6 lg:px-8">
                        <button
                          onClick={() => setSelectedArticle(null)}
                        >
                          ← Back to articles
                        </button>
                        
                        <h1 className="text-3xl font-bold text-white mb-4 sm:px-4 md:px-6 lg:px-8">
                          {selectedArticleData?.title}
                        </h1>
                        
                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-4 sm:px-4 md:px-6 lg:px-8">
                          <span className={`px-2 py-1 rounded ${getDifficultyColor(selectedArticleData?.difficulty || 'beginner')}`}>
                            {selectedArticleData?.difficulty}
                          </span>
                          <span>📖 {selectedArticleData?.readTime} min read</span>
                          <span>👁️ {selectedArticleData?.views} views</span>
                          <span>👍 {selectedArticleData?.helpful} helpful</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 sm:px-4 md:px-6 lg:px-8">
                          {selectedArticleData?.tags.map((tag: any) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded sm:px-4 md:px-6 lg:px-8"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Article Content */}
                      <div 
                        className="prose prose-invert max-w-none sm:px-4 md:px-6 lg:px-8"
                        dangerouslySetInnerHTML={{ 
                          __html: DOMPurify.sanitize(formatContent(selectedArticleData?.content || ''))
                        }}
                      />

                      {/* Article Footer */}
                      <div className="mt-8 pt-6 border-t border-slate-600 sm:px-4 md:px-6 lg:px-8">
                        <div className="flex items-center justify-between sm:px-4 md:px-6 lg:px-8">
                          <div className="text-sm text-slate-400 sm:px-4 md:px-6 lg:px-8">
                            Last updated: {selectedArticleData?.lastUpdated.toLocaleDateString()}
                          </div>
                          <div className="flex gap-2 sm:px-4 md:px-6 lg:px-8">
                            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                              👍 Helpful
                            </button>
                            <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors sm:px-4 md:px-6 lg:px-8" aria-label="Action button">
                              📝 Suggest Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Article List */
                  <div className="flex-1 overflow-y-auto p-6 sm:px-4 md:px-6 lg:px-8">
                    <div className="mb-6 sm:px-4 md:px-6 lg:px-8">
                      <h2 className="text-2xl font-bold text-white mb-2 sm:px-4 md:px-6 lg:px-8">
                        {selectedCategory === 'all' ? 'All Articles' : 
                         categories.find((c: any) => c.id === selectedCategory)?.name}
                      </h2>
                      <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">
                        {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredArticles.map((article: any) => (
                        <motion.button
                          key={article.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => setSelectedArticle(article.id)}
                          className="text-left p-4 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-all sm:px-4 md:px-6 lg:px-8"
                        >
                          <h3 className="text-lg font-semibold text-white mb-2 sm:px-4 md:px-6 lg:px-8">
                            {article.title}
                          </h3>
                          
                          <div className="flex items-center gap-2 mb-3 sm:px-4 md:px-6 lg:px-8">
                            <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(article.difficulty)}`}>
                              {article.difficulty}
                            </span>
                            <span className="text-xs text-slate-400 sm:px-4 md:px-6 lg:px-8">
                              📖 {article.readTime} min
                            </span>
                          </div>
                          
                          <p className="text-slate-300 text-sm mb-3 line-clamp-2 sm:px-4 md:px-6 lg:px-8">
                            {article.content.substring(0, 120)}...
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-slate-400 sm:px-4 md:px-6 lg:px-8">
                            <div className="flex gap-4 sm:px-4 md:px-6 lg:px-8">
                              <span>👁️ {article.views}</span>
                              <span>👍 {article.helpful}</span>
                            </div>
                            <span>{article.lastUpdated.toLocaleDateString()}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {filteredArticles.length === 0 && (
                      <div className="text-center py-12 sm:px-4 md:px-6 lg:px-8">
                        <span className="text-6xl mb-4 block sm:px-4 md:px-6 lg:px-8">📚</span>
                        <h3 className="text-xl font-semibold text-white mb-2 sm:px-4 md:px-6 lg:px-8">No articles found</h3>
                        <p className="text-slate-400 sm:px-4 md:px-6 lg:px-8">Try adjusting your search or browse different categories.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const HelpSystemWithErrorBoundary: React.FC = (props) => (
  <ErrorBoundary>
    <HelpSystem {...props} />
  </ErrorBoundary>
);

export default React.memo(HelpSystemWithErrorBoundary);