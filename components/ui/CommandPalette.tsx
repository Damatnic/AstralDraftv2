/**
 * Elite Command Palette for quick navigation and actions
 */
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/SimpleAuthContext';

interface Command {
  id: string;
  title: string;
  description: string;
  icon: string;
  action: () => void;
  category: string;
  keywords: string[];
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Elite commands
  const commands: Command[] = useMemo(() => [
    {
      id: 'nav-dashboard',
      title: 'Go to Dashboard',
      description: 'View your team overview and stats',
      icon: '📊',
      action: () => navigate('/dashboard'),
      category: 'Navigation',
      keywords: ['dashboard', 'home', 'overview'],
    },
    {
      id: 'nav-draft',
      title: 'Open Draft Room',
      description: 'Enter the live draft experience',
      icon: '🎯',
      action: () => navigate('/draft'),
      category: 'Navigation',
      keywords: ['draft', 'pick', 'room'],
    },
    {
      id: 'nav-analytics',
      title: 'View Analytics',
      description: 'Advanced team and player analytics',
      icon: '📈',
      action: () => navigate('/analytics'),
      category: 'Navigation',
      keywords: ['analytics', 'stats', 'data'],
    },
    {
      id: 'nav-insights',
      title: 'Player Insights',
      description: 'AI-powered player recommendations',
      icon: '🧠',
      action: () => navigate('/insights'),
      category: 'Navigation',
      keywords: ['insights', 'ai', 'recommendations'],
    },
    {
      id: 'nav-league',
      title: 'League Overview',
      description: 'League standings and matchups',
      icon: '🏆',
      action: () => navigate('/league'),
      category: 'Navigation',
      keywords: ['league', 'standings', 'matchups'],
    },
    {
      id: 'action-search-players',
      title: 'Search Players',
      description: 'Find and analyze players',
      icon: '🔍',
      action: () => {/* TODO: Implement player search */},
      category: 'Actions',
      keywords: ['search', 'players', 'find'],
    },
    {
      id: 'action-trade-analyzer',
      title: 'Trade Analyzer',
      description: 'Evaluate potential trades',
      icon: '🔄',
      action: () => {/* TODO: Implement trade analyzer */},
      category: 'Actions',
      keywords: ['trade', 'analyze', 'evaluate'],
    },
    {
      id: 'action-waiver-wire',
      title: 'Waiver Wire',
      description: 'Browse available players',
      icon: '📋',
      action: () => {/* TODO: Implement waiver wire */},
      category: 'Actions',
      keywords: ['waiver', 'wire', 'available'],
    },
  ], [navigate]);

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    
    const lowerQuery = query.toLowerCase();
    return commands.filter(command =>
      command.title.toLowerCase().includes(lowerQuery) ||
      command.description.toLowerCase().includes(lowerQuery) ||
      command.keywords.some(keyword => keyword.includes(lowerQuery))
    );
  }, [commands, query]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
      
      if (event.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    const handleToggle = () => {
      setIsOpen(!isOpen);
    };

    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-command-palette', handleToggle);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-command-palette', handleToggle);
    };
  }, [isOpen]);

  const executeCommand = (command: Command) => {
    command.action();
    setIsOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl mx-4 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="p-4 border-b border-white/10">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands... (⌘K)"
                className="w-full bg-transparent text-white placeholder-gray-400 text-lg outline-none"
                autoFocus
              />
            </div>

            {/* Commands List */}
            <div className="max-h-96 overflow-y-auto">
              {filteredCommands.length > 0 ? (
                <div className="p-2">
                  {Object.entries(
                    filteredCommands.reduce((acc, command) => {
                      if (!acc[command.category]) acc[command.category] = [];
                      acc[command.category].push(command);
                      return acc;
                    }, {} as Record<string, Command[]>)
                  ).map(([category, categoryCommands]) => (
                    <div key={category} className="mb-4">
                      <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {category}
                      </div>
                      {categoryCommands.map((command) => (
                        <motion.button
                          key={command.id}
                          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => executeCommand(command)}
                          className="w-full flex items-center space-x-3 p-3 rounded-lg text-left hover:bg-white/5 transition-colors"
                        >
                          <span className="text-2xl">{command.icon}</span>
                          <div className="flex-1">
                            <div className="text-white font-medium">{command.title}</div>
                            <div className="text-gray-400 text-sm">{command.description}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <div className="text-4xl mb-2">🔍</div>
                  <div>No commands found for "{query}"</div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-white/10 text-xs text-gray-400 flex items-center justify-between">
              <div>Press ⌘K to open, ESC to close</div>
              <div>Elite Commands v2.0</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
