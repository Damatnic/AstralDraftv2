/**
 * Live Scoreboard Component
 * Real-time NFL game scores with premium animations and ESPN-beating features
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import realTimeDataService, { LiveScore } from '../../services/realTimeDataService';
import { GlassCard } from '../ui/GlassCard';
import styles from './LiveScoreboard.module.css';

interface LiveScoreboardProps {
  className?: string;
  compact?: boolean;
}

export const LiveScoreboard: React.FC<LiveScoreboardProps> = ({ 
  className = '', 
  compact = false 
}) => {
  const [liveScores, setLiveScores] = useState<LiveScore[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Subscribe to live scores
    const unsubscribeScores = realTimeDataService.onLiveScores((scores) => {
      setLiveScores(scores);
      setLastUpdated(new Date());
    });

    // Subscribe to connection status
    const unsubscribeStatus = realTimeDataService.onConnectionStatus((connected) => {
      setIsConnected(connected);
    });

    return () => {
      unsubscribeScores();
      unsubscribeStatus();
    };
  }, []);

  const getStatusColor = (status: LiveScore['status']) => {
    switch (status) {
      case 'pre-game': return 'var(--color-neutral-400)';
      case 'in-progress': return 'var(--color-success-400)';
      case 'halftime': return 'var(--color-warning-400)';
      case 'overtime': return 'var(--color-error-400)';
      case 'final': return 'var(--color-neutral-500)';
      default: return 'var(--color-neutral-400)';
    }
  };

  const getStatusText = (status: LiveScore['status'], quarter: number, timeRemaining: string) => {
    switch (status) {
      case 'pre-game': return 'PRE-GAME';
      case 'in-progress': return `Q${quarter} ${timeRemaining}`;
      case 'halftime': return 'HALFTIME';
      case 'overtime': return `OT ${timeRemaining}`;
      case 'final': return 'FINAL';
      default: return 'UNKNOWN';
    }
  };

  if (compact) {
    return (
      <GlassCard className={`${styles.liveScoreboardCompact} ${className}`}>
        <div className={styles.scoreboardHeader}>
          <div className={styles.headerTitle}>
            <span className={styles.titleText}>Live Scores</span>
            <div className={`${styles.connectionIndicator} ${isConnected ? styles.connected : styles.disconnected}`}>
              <div className={styles.indicatorDot} />
              <span className={styles.indicatorText}>
                {isConnected ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.scoresContainerCompact}>
          <AnimatePresence>
            {liveScores.map((score, index) => (
              <motion.div
                key={score.gameId}
                className={styles.gameScoreCompact}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.teamsCompact}>
                  <div className={styles.teamCompact}>
                    <span className={styles.teamName}>{score.awayTeam}</span>
                    <span className={styles.teamScore}>{score.awayScore}</span>
                  </div>
                  <div className={styles.vsSeparator}>@</div>
                  <div className={styles.teamCompact}>
                    <span className={styles.teamName}>{score.homeTeam}</span>
                    <span className={styles.teamScore}>{score.homeScore}</span>
                  </div>
                </div>
                <div
                  className={styles.gameStatusCompact}
                  style={{ color: getStatusColor(score.status) }}
                >
                  {getStatusText(score.status, score.quarter, score.timeRemaining)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className={`${styles.liveScoreboard} ${className}`}>
      <div className={styles.scoreboardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h2 className={styles.scoreboardTitle}>Live NFL Scores</h2>
            {lastUpdated && (
              <span className={styles.lastUpdated}>
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className={`${styles.connectionStatus} ${isConnected ? styles.connected : styles.disconnected}`}>
            <div className={styles.statusIndicator} />
            <span className={styles.statusText}>
              {isConnected ? 'LIVE' : 'RECONNECTING...'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.scoresGrid}>
        <AnimatePresence>
          {liveScores.map((score, index) => (
            <motion.div
              key={score.gameId}
              className={styles.gameCard}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                delay: index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <div className={styles.gameHeader}>
                <div
                  className={styles.gameStatus}
                  style={{ color: getStatusColor(score.status) }}
                >
                  {getStatusText(score.status, score.quarter, score.timeRemaining)}
                </div>
              </div>

              <div className={styles.matchup}>
                <div className={styles.team}>
                  <div className={styles.teamInfo}>
                    <span className={styles.teamName}>{score.awayTeam}</span>
                    <span className={styles.teamRecord}>(Away)</span>
                  </div>
                  <motion.span
                    className={styles.teamScore}
                    key={`${score.gameId}-away-${score.awayScore}`}
                    initial={{ scale: 1.2, color: 'var(--color-success-400)' }}
                    animate={{ scale: 1, color: 'var(--color-text-primary)' }}
                    transition={{ duration: 0.3 }}
                  >
                    {score.awayScore}
                  </motion.span>
                </div>

                <div className={styles.vsDivider}>
                  <span>VS</span>
                </div>

                <div className={styles.team}>
                  <div className={styles.teamInfo}>
                    <span className={styles.teamName}>{score.homeTeam}</span>
                    <span className={styles.teamRecord}>(Home)</span>
                  </div>
                  <motion.span
                    className={styles.teamScore}
                    key={`${score.gameId}-home-${score.homeScore}`}
                    initial={{ scale: 1.2, color: 'var(--color-success-400)' }}
                    animate={{ scale: 1, color: 'var(--color-text-primary)' }}
                    transition={{ duration: 0.3 }}
                  >
                    {score.homeScore}
                  </motion.span>
                </div>
              </div>

              <div className={styles.gameProgress}>
                <div className={styles.progressBar}>
                  <motion.div
                    className={styles.progressFill}
                    initial={{ width: 0 }}
                    animate={{
                      width: score.status === 'final' ? '100%' :
                            score.status === 'halftime' ? '50%' :
                            score.status === 'in-progress' ? `${(score.quarter / 4) * 100}%` : '0%'
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {liveScores.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🏈</div>
          <p className={styles.emptyText}>No live games at the moment</p>
          <span className={styles.emptySubtext}>Check back during NFL game times</span>
        </div>
      )}
    </GlassCard>
  );
};