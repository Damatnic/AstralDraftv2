/**
 * Genius AI Chat Component
 * Interactive chat interface for draft assistance with celebrity personas
 */

import { ErrorBoundary } from '../ui/ErrorBoundary';
import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { Player } from '../../types';
import { GeniusAiAssistant, AssistantResponse } from '../../services/geniusAiAssistant';
import { CelebrityPersonaEngine, CELEBRITY_PERSONAS } from '../../services/celebrityDraftPersonas';
import './GeniusAiChat.css';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant' | 'persona';
  message: string;
  recommendations?: Player[];
  insights?: string[];
  timestamp: Date;
}

interface Props {
  currentRoster: Player[];
  availablePlayers: Player[];
  currentRound: number;
  currentPick: number;
  leagueSettings: any;
  draftHistory: any[];
  onPlayerSelect?: (player: Player) => void;
}

const QUICK_QUESTIONS = [
  "Who's the best sleeper RB available?",
  "What's my biggest roster weakness?",
  "Should I reach for a TE or wait?",
  "Who has the easiest playoff schedule?",
  "Give me a boom/bust WR",
  "Who will outscore their ADP?",
  "Find me handcuffs for my RBs",
  "Build me a Zero-RB strategy",
  "Who's this year's league winner?",
  "I need a QB to pair with my WRs"
];

const GeniusAiChat: React.FC<Props> = ({
  currentRoster,
  availablePlayers,
  currentRound,
  currentPick,
  leagueSettings,
  draftHistory,
//   onPlayerSelect
}: any) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const aiAssistant = useRef(new GeniusAiAssistant());
  const personaEngine = useRef(new CelebrityPersonaEngine());

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add welcome message on mount
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      type: 'assistant',
      message: `Welcome to your Draft Coach! I'm here to help you dominate your draft. Ask me anything about players, strategy, or roster construction. You can also select a celebrity persona to draft like your favorite sports legend!`,
      timestamp: new Date(),
      insights: [
        `Round ${currentRound}, Pick ${currentPick}`,
        `${availablePlayers.length} players available`,
        'Type a question or select one below to get started'
      ]
    };
    setMessages([welcomeMessage]);
  }, []);

  const handleSendMessage = async (question?: string) => {
    const messageText = question || inputValue.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setShowQuickQuestions(false);

    try {
      // Get AI response
      const response: AssistantResponse = await aiAssistant.current.processQuery({
        question: messageText,
        context: {
          currentRoster,
          availablePlayers,
          currentRound,
          currentPick,
          leagueSettings,
          draftHistory
        }
      });

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: 'assistant',
        message: response.answer,
        recommendations: response.recommendations,
        insights: response.insights,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      // If persona is selected, add their take
      if (selectedPersona) {
        const persona = personaEngine.current.getSelectedPersona();
        if (persona && response.recommendations.length > 0) {
          const personaRec = personaEngine.current.getPersonaRecommendation(
            response.recommendations,
            currentRoster,
            currentPick
          );
          
          if (personaRec.recommendedPlayer) {
            const personaMessage: ChatMessage = {
              id: `persona-${Date.now()}`,
              type: 'persona',
              message: `**${persona.name} says:** "${personaRec.catchPhrase}" ${personaRec.reasoning}`,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, personaMessage]);
          }
        }
      }

      // Add follow-up questions if provided
      if (response.followUpQuestions && response.followUpQuestions.length > 0) {
        setTimeout(() => {
          const followUpMessage: ChatMessage = {
            id: `followup-${Date.now()}`,
            type: 'assistant',
            message: 'Follow-up questions you might find helpful:',
            insights: response.followUpQuestions,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, followUpMessage]);
        }, 500);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'assistant',
        message: 'I encountered an error processing your question. Please try rephrasing or ask something else.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPersona = (personaId: string) => {
    const persona = personaEngine.current.selectPersona(personaId);
    if (persona) {
      setSelectedPersona(personaId);
      setShowPersonaMenu(false);
      
      const personaMessage: ChatMessage = {
        id: `persona-intro-${Date.now()}`,
        type: 'persona',
        message: `**${persona.name} Mode Activated!** ${persona.draftPhilosophy}`,
        insights: persona.draftTips,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, personaMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: ChatMessage) => {
    return (
      <div key={message.id} className={`chat-message ${message.type}`}>
        <div className="message-header sm:px-4 md:px-6 lg:px-8">
          <span className="message-author sm:px-4 md:px-6 lg:px-8">
            {message.type === 'user' ? 'You' : 
             message.type === 'persona' ? 'Celebrity Coach' : 'Coach'}
          </span>
          <span className="message-time sm:px-4 md:px-6 lg:px-8">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        
        <div className="message-content sm:px-4 md:px-6 lg:px-8">
          <div className="message-text sm:px-4 md:px-6 lg:px-8">{message.message}</div>
          
          {message.recommendations && message.recommendations.length > 0 && (
            <div className="message-recommendations sm:px-4 md:px-6 lg:px-8">
              <h4>Recommended Players:</h4>
              <div className="player-cards sm:px-4 md:px-6 lg:px-8">
                {message.recommendations.map((player, idx) => (
                  <div key={idx} className="recommended-player-card sm:px-4 md:px-6 lg:px-8">
                    <div className="player-rank sm:px-4 md:px-6 lg:px-8">#{idx + 1}</div>
                    <div className="player-info sm:px-4 md:px-6 lg:px-8">
                      <div className="player-name sm:px-4 md:px-6 lg:px-8">{player.name}</div>
                      <div className="player-details sm:px-4 md:px-6 lg:px-8">
                        {player.position} - {player.team}
                      </div>
                      {player.projectedPoints && (
                        <div className="player-projection sm:px-4 md:px-6 lg:px-8">
                          Projected: {player.projectedPoints} pts
                        </div>
                      )}
                    </div>
                    {onPlayerSelect && (
                      <button 
                        className="select-player-btn sm:px-4 md:px-6 lg:px-8"
                        onClick={() => onPlayerSelect(player)}
                      >
                        Draft
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {message.insights && message.insights.length > 0 && (
            <div className="message-insights sm:px-4 md:px-6 lg:px-8">
              <ul>
                {message.insights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="genius-ai-chat sm:px-4 md:px-6 lg:px-8">
      <div className="chat-header sm:px-4 md:px-6 lg:px-8">
        <h3>Draft Coach</h3>
        <div className="header-controls sm:px-4 md:px-6 lg:px-8">
          <button 
            className="persona-toggle sm:px-4 md:px-6 lg:px-8"
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
          >
            {selectedPersona ? 
              `Coaching as ${CELEBRITY_PERSONAS.find(p => p.id === selectedPersona)?.name}` : 
              'Select Celebrity Coach'}
          </button>
          {selectedPersona && (
            <button 
              className="clear-persona sm:px-4 md:px-6 lg:px-8"
              onClick={() => {
                setSelectedPersona(null);
                personaEngine.current.selectPersona('');
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {showPersonaMenu && (
        <div className="persona-menu sm:px-4 md:px-6 lg:px-8">
          <h4>Draft Like a Celebrity</h4>
          <div className="persona-grid sm:px-4 md:px-6 lg:px-8">
            {CELEBRITY_PERSONAS.map((persona: any) => (
              <div 
                key={persona.id}
                className={`persona-option ${selectedPersona === persona.id ? 'selected' : ''}`}
                onClick={() => handleSelectPersona(persona.id)}
                role="button" 
                tabIndex={0}
              >
                <div className="persona-name sm:px-4 md:px-6 lg:px-8">{persona.name}</div>
                <div className="persona-description sm:px-4 md:px-6 lg:px-8">{persona.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="chat-messages sm:px-4 md:px-6 lg:px-8">
        {messages.map(renderMessage)}
        {isLoading && (
          <div className="loading-message sm:px-4 md:px-6 lg:px-8">
            <div className="typing-indicator sm:px-4 md:px-6 lg:px-8">
              <span></span>
              <span></span>
              <span></span>
            </div>
            AI is analyzing...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {showQuickQuestions && (
        <div className="quick-questions sm:px-4 md:px-6 lg:px-8">
          <div className="quick-questions-header sm:px-4 md:px-6 lg:px-8">Quick Questions:</div>
          <div className="questions-grid sm:px-4 md:px-6 lg:px-8">
            {QUICK_QUESTIONS.map((question, idx) => (
              <button
                key={idx}
                className="quick-question-btn sm:px-4 md:px-6 lg:px-8"
                onClick={() => handleSendMessage(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="chat-input-container sm:px-4 md:px-6 lg:px-8">
        <input
          type="text"
          className="chat-input sm:px-4 md:px-6 lg:px-8"
          placeholder="Ask me anything about your draft..."
          value={inputValue}
          onChange={(e: any) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button 
          className="send-button sm:px-4 md:px-6 lg:px-8"
          onClick={() => handleSendMessage()}
        >
          Send
        </button>
      </div>

      <div className="chat-footer sm:px-4 md:px-6 lg:px-8">
        <div className="context-info sm:px-4 md:px-6 lg:px-8">
          Round {currentRound} • Pick {currentPick} • 
          {currentRoster.length} players drafted • 
          {availablePlayers.length} available
        </div>
      </div>
    </div>
  );
};

const GeniusAiChatWithErrorBoundary: React.FC = (props: any) => (
  <ErrorBoundary>
    <GeniusAiChat {...props} />
  </ErrorBoundary>
);

export default React.memo(GeniusAiChatWithErrorBoundary);