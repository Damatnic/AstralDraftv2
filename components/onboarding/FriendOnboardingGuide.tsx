import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';

const FriendOnboardingGuide: React.FC = () => {
  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Astral Draft!',
      emoji: '🎯',
      content: (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-6xl mb-4 sm:px-4 md:px-6 lg:px-8">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2 sm:px-4 md:px-6 lg:px-8">
              Ready to Start Predicting?
            </h3>
            <p className="text-gray-600 sm:px-4 md:px-6 lg:px-8">
              You're joining an exclusive group of friends competing to outpredict the Oracle AI!
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
            <h4 className="font-semibold text-blue-800 mb-2 sm:px-4 md:px-6 lg:px-8">What You'll Learn:</h4>
            <ul className="text-blue-700 space-y-1 sm:px-4 md:px-6 lg:px-8">
              <li>• How to login with your friend PIN</li>
              <li>• Making your first prediction</li>
              <li>• Understanding the scoring system</li>
              <li>• Using social features</li>
            </ul>
          </div>

          <div className="text-center sm:px-4 md:px-6 lg:px-8">
            <Badge className="bg-green-100 text-green-800 sm:px-4 md:px-6 lg:px-8">
              Takes just 5 minutes to get started!
            </Badge>
          </div>
        </div>
      )
    },
    {
      id: 'login',
      title: 'Login with Your Friend PIN',
      emoji: '🔑',
      content: (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center sm:px-4 md:px-6 lg:px-8">
            <div className="text-3xl font-mono font-bold text-gray-800 mb-2 sm:px-4 md:px-6 lg:px-8">
              0000
            </div>
            <p className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Your Friend Group PIN</p>
          </div>

          <div className="space-y-3 sm:px-4 md:px-6 lg:px-8">
            <h4 className="font-semibold text-gray-800 sm:px-4 md:px-6 lg:px-8">Step by Step:</h4>
            <div className="space-y-2 sm:px-4 md:px-6 lg:px-8">
              <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold sm:px-4 md:px-6 lg:px-8">1</div>
                <span>Find the PIN entry field on the login screen</span>
              </div>
              <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold sm:px-4 md:px-6 lg:px-8">2</div>
                <span>Type exactly: <code className="bg-gray-100 px-1 rounded sm:px-4 md:px-6 lg:px-8">0000</code></span>
              </div>
              <div className="flex items-center gap-3 sm:px-4 md:px-6 lg:px-8">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold sm:px-4 md:px-6 lg:px-8">3</div>
                <span>Click "Login" or press Enter</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8">
            <p className="text-yellow-800 text-sm sm:px-4 md:px-6 lg:px-8">
              💡 <strong>Pro Tip:</strong> All friends use the same PIN (0000). 
              Bookmark the page for quick access!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'predictions',
      title: 'Make Your First Prediction',
      emoji: '🎯',
      content: (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
            <h4 className="font-semibold text-gray-800 mb-3 sm:px-4 md:px-6 lg:px-8">The Prediction Process:</h4>
            
            <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
              <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold sm:px-4 md:px-6 lg:px-8">1</div>
                <div>
                  <div className="font-medium sm:px-4 md:px-6 lg:px-8">Browse Events</div>
                  <div className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Look for upcoming games or events to predict</div>
                </div>
              </div>
              
              <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold sm:px-4 md:px-6 lg:px-8">2</div>
                <div>
                  <div className="font-medium sm:px-4 md:px-6 lg:px-8">Choose Your Answer</div>
                  <div className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Select from available options (usually Team A vs Team B)</div>
                </div>
              </div>
              
              <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold sm:px-4 md:px-6 lg:px-8">3</div>
                <div>
                  <div className="font-medium sm:px-4 md:px-6 lg:px-8">Set Confidence (1-100%)</div>
                  <div className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Higher confidence = more points if correct!</div>
                </div>
              </div>
              
              <div className="flex gap-3 sm:px-4 md:px-6 lg:px-8">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold sm:px-4 md:px-6 lg:px-8">4</div>
                <div>
                  <div className="font-medium sm:px-4 md:px-6 lg:px-8">Submit & Track</div>
                  <div className="text-sm text-gray-600 sm:px-4 md:px-6 lg:px-8">Watch your prediction and wait for results</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8">
            <h5 className="font-medium text-orange-800 mb-1 sm:px-4 md:px-6 lg:px-8">Confidence Strategy:</h5>
            <div className="text-sm text-orange-700 space-y-1 sm:px-4 md:px-6 lg:px-8">
              <div>• <strong>90-100%:</strong> Very confident (high risk, high reward)</div>
              <div>• <strong>70-80%:</strong> Pretty sure (balanced approach)</div>
              <div>• <strong>50-60%:</strong> Coin flip (safer bet)</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'scoring',
      title: 'Understanding Scoring & Competition',
      emoji: '🏆',
      content: (
        <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-4 sm:px-4 md:px-6 lg:px-8">
            <div className="text-4xl mb-2 sm:px-4 md:px-6 lg:px-8">🏆</div>
            <h4 className="font-semibold text-gray-800 sm:px-4 md:px-6 lg:px-8">How Points Work</h4>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:px-4 md:px-6 lg:px-8">
            <h5 className="font-semibold text-purple-800 mb-3 sm:px-4 md:px-6 lg:px-8">Scoring Formula:</h5>
            <div className="text-center bg-white rounded p-3 border sm:px-4 md:px-6 lg:px-8">
              <div className="text-lg font-mono sm:px-4 md:px-6 lg:px-8">
                Points = Confidence × Accuracy Multiplier
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:px-4 md:px-6 lg:px-8">
            <div className="bg-green-50 border border-green-200 rounded p-3 sm:px-4 md:px-6 lg:px-8">
              <h6 className="font-medium text-green-800 sm:px-4 md:px-6 lg:px-8">If Correct ✅</h6>
              <div className="text-sm text-green-700 mt-1 sm:px-4 md:px-6 lg:px-8">
                <div>80% confidence = 80 points</div>
                <div>50% confidence = 50 points</div>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded p-3 sm:px-4 md:px-6 lg:px-8">
              <h6 className="font-medium text-red-800 sm:px-4 md:px-6 lg:px-8">If Wrong ❌</h6>
              <div className="text-sm text-red-700 mt-1 sm:px-4 md:px-6 lg:px-8">
                <div>80% confidence = -40 points</div>
                <div>50% confidence = -25 points</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8">
            <h5 className="font-medium text-blue-800 mb-2 sm:px-4 md:px-6 lg:px-8">Your Goals:</h5>
            <div className="text-sm text-blue-700 space-y-1 sm:px-4 md:px-6 lg:px-8">
              <div>🎯 <strong>Beat the Oracle:</strong> Outperform the AI's predictions</div>
              <div>🏅 <strong>Climb Leaderboard:</strong> Rank higher than your friends</div>
              <div>📈 <strong>Improve Accuracy:</strong> Aim for 70%+ correct predictions</div>
            </div>
          </div>
        </div>
      )

  ];

  return (
    <div className="max-w-4xl mx-auto p-6 sm:px-4 md:px-6 lg:px-8">
      <div className="text-center mb-8 sm:px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 sm:px-4 md:px-6 lg:px-8">
          🎯 Friend Onboarding Guide
        </h1>
        <p className="text-gray-600 sm:px-4 md:px-6 lg:px-8">
          Get started with Astral Draft in just a few minutes!
        </p>
      </div>

      <div className="space-y-6 sm:px-4 md:px-6 lg:px-8">
        {steps.map((step, index) => (
          <Card key={step.id} className="mb-6 sm:px-4 md:px-6 lg:px-8">
            <CardHeader className="text-center sm:px-4 md:px-6 lg:px-8">
              <div className="text-4xl mb-2 sm:px-4 md:px-6 lg:px-8">{step.emoji}</div>
              <CardTitle className="text-xl sm:px-4 md:px-6 lg:px-8">
                {index + 1}. {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {step.content}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 bg-gray-50 sm:px-4 md:px-6 lg:px-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            📋 Quick Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-medium text-gray-800 mb-1 sm:px-4 md:px-6 lg:px-8">Login Info</div>
              <div className="text-gray-600 sm:px-4 md:px-6 lg:px-8">PIN: <code className="bg-gray-200 px-1 rounded sm:px-4 md:px-6 lg:px-8">0000</code></div>
            </div>
            <div>
              <div className="font-medium text-gray-800 mb-1 sm:px-4 md:px-6 lg:px-8">Scoring Goal</div>
              <div className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Beat Oracle & Friends</div>
            </div>
            <div>
              <div className="font-medium text-gray-800 mb-1 sm:px-4 md:px-6 lg:px-8">Need Help?</div>
              <div className="text-gray-600 sm:px-4 md:px-6 lg:px-8">Ask friend group admin</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-cyan-50 border-cyan-200 sm:px-4 md:px-6 lg:px-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 sm:px-4 md:px-6 lg:px-8">
            💡 Pro Tips & Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 sm:px-4 md:px-6 lg:px-8">
            <div>
              <h5 className="font-semibold text-cyan-800 mb-2 sm:px-4 md:px-6 lg:px-8">🚀 Pro Tips:</h5>
              <div className="text-sm text-cyan-700 space-y-1 sm:px-4 md:px-6 lg:px-8">
                <div>• Research before predicting - knowledge improves accuracy</div>
                <div>• Don't always use 100% confidence - manage your risk</div>
                <div>• Stay consistent - regular participation helps improve results</div>
                <div>• Learn from the Oracle - analyze when it&apos;s right vs wrong</div>
              </div>
            </div>

            <div>
              <h5 className="font-semibold text-red-800 mb-2 sm:px-4 md:px-6 lg:px-8">🔧 Common Issues:</h5>
              <div className="text-sm text-red-700 space-y-1 sm:px-4 md:px-6 lg:px-8">
                <div><strong>Can't login?</strong> Double-check PIN is exactly "0000"</div>
                <div><strong>Page looks broken?</strong> Refresh your browser</div>
                <div><strong>No predictions available?</strong> Check back later for new events</div>
                <div><strong>Prediction didn't save?</strong> Make sure you clicked "Submit"</div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:px-4 md:px-6 lg:px-8">
              <h5 className="font-medium text-green-800 mb-1 sm:px-4 md:px-6 lg:px-8">📱 Device Compatibility:</h5>
              <div className="text-sm text-green-700 sm:px-4 md:px-6 lg:px-8">
                ✅ Smartphones • ✅ Tablets • ✅ Computers • ✅ Any modern browser
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const FriendOnboardingGuideWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <FriendOnboardingGuide {...props} />
  </ErrorBoundary>
);

export default React.memo(FriendOnboardingGuideWithErrorBoundary);
