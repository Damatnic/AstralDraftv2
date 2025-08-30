# Real-Time Features Implementation Guide

## Overview
This document provides a comprehensive overview of the real-time features implemented for the fantasy football platform. The system uses WebSocket connections for bidirectional communication, enabling instant updates across all connected clients.

## Architecture

### Core Services

#### 1. Enhanced WebSocket Service (`services/enhancedWebSocketService.ts`)
The foundation of our real-time infrastructure.

**Key Features:**
- Automatic reconnection with exponential backoff
- Connection pooling for multiple namespaces
- Message queuing for offline scenarios
- Heartbeat monitoring for connection health
- Built-in authentication and security

**Usage Example:**
```typescript
import { enhancedWebSocketService } from './services/enhancedWebSocketService';

// Initialize connection
await enhancedWebSocketService.connect(authToken, userId);

// Join draft room
enhancedWebSocketService.joinDraftRoom(draftId);

// Send message
enhancedWebSocketService.sendMessage(roomId, 'league', 'Hello everyone!');

// Subscribe to live scoring
enhancedWebSocketService.subscribeToLiveScoring(leagueId, weekNumber);
```

#### 2. Real-Time Draft Service V2 (`services/realTimeDraftServiceV2.ts`)
Complete draft room functionality with live updates.

**Features:**
- Snake, auction, and dynasty draft support
- Real-time pick updates and timer synchronization
- Auto-draft with customizable strategies
- Draft chat and reactions
- Trade draft picks during draft
- Commissioner controls (pause/resume)
- Draft grades and analysis

**Draft Strategies:**
```typescript
// Set auto-draft strategy
draftService.setAutoDraftStrategy(teamId, {
  strategy: 'balanced',
  positionPriority: ['RB', 'WR', 'QB', 'TE'],
  avoidPlayers: ['player123'],
  targetPlayers: ['player456'],
  maxPlayersPerPosition: {
    QB: 3,
    RB: 6,
    WR: 6,
    TE: 2
  }
});

// Make a pick
await draftService.makePick(playerId, bid);

// Queue players
draftService.queuePlayer(playerId, teamId);
```

#### 3. Live Scoring Service (`services/liveScoringService.ts`)
Real-time scoring updates during NFL games.

**Features:**
- Live game score tracking
- Real-time fantasy point calculations
- Custom scoring settings support
- Win probability calculations
- Red zone alerts
- Stat corrections
- Play-by-play updates

**Implementation:**
```typescript
import { liveScoringService } from './services/liveScoringService';

// Initialize for current week
await liveScoringService.initialize(leagueId, weekNumber);

// Subscribe to specific player
liveScoringService.subscribeToPlayer(playerId);

// Listen for updates
liveScoringService.on('stat:update', (update) => {
  console.log(`${update.playerName}: ${update.pointsChange} points`);
});

// Get current matchup
const matchup = liveScoringService.getMatchup(matchupId);
console.log(`Win Probability: ${matchup.winProbability.team1}%`);
```

#### 4. Real-Time Notification Service V2 (`services/realtimeNotificationServiceV2.ts`)
Comprehensive notification system with multiple delivery channels.

**Features:**
- Push notifications (PWA)
- In-app toasts and banners
- Email notifications for critical alerts
- Notification grouping and threading
- Quiet hours support
- Custom notification sounds
- Device vibration patterns

**Notification Types:**
```typescript
// Initialize notifications
await notificationService.initialize(userId);

// Update settings
notificationService.updateSettings({
  pushNotifications: true,
  categories: {
    trades: true,
    injuries: true,
    scoring: false
  },
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '08:00'
  }
});

// Send custom notification
await notificationService.sendNotification({
  type: 'trade_proposed',
  category: 'trades',
  priority: 'high',
  title: 'New Trade Proposal',
  message: 'John Smith wants to trade with you',
  actions: [
    { id: 'view', label: 'View Trade', type: 'primary', action: '/trades/123' }
  ]
});
```

## Integration Examples

### 1. Draft Room Component
```typescript
import React, { useEffect, useState } from 'react';
import { realTimeDraftService } from '../services/realTimeDraftServiceV2';

export const DraftRoom: React.FC = () => {
  const [draftState, setDraftState] = useState(null);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    // Join draft
    realTimeDraftService.joinDraft(draftId, userId);

    // Listen for updates
    realTimeDraftService.on('draft:pick:made', (pick) => {
      // Update UI with new pick
    });

    realTimeDraftService.on('draft:timer:tick', (timer) => {
      setTimer(timer);
    });

    realTimeDraftService.on('draft:turn:change', (data) => {
      // Highlight current picker
    });

    return () => {
      realTimeDraftService.leaveDraft();
    };
  }, []);

  const handlePick = (playerId: string) => {
    realTimeDraftService.makePick(playerId);
  };

  return (
    <div>
      {/* Draft UI */}
    </div>
  );
};
```

### 2. Live Scoring Dashboard
```typescript
import React, { useEffect, useState } from 'react';
import { liveScoringService } from '../services/liveScoringService';

export const LiveScoring: React.FC = () => {
  const [matchups, setMatchups] = useState([]);
  const [liveUpdates, setLiveUpdates] = useState([]);

  useEffect(() => {
    // Initialize live scoring
    liveScoringService.initialize(leagueId, currentWeek);

    // Listen for updates
    liveScoringService.on('matchup:update', (matchup) => {
      setMatchups(prev => {
        const updated = [...prev];
        const index = updated.findIndex(m => m.matchupId === matchup.matchupId);
        if (index > -1) {
          updated[index] = matchup;
        } else {
          updated.push(matchup);
        }
        return updated;
      });
    });

    liveScoringService.on('live:update', (update) => {
      setLiveUpdates(prev => [update, ...prev].slice(0, 50));
    });

    return () => {
      liveScoringService.stopMonitoring();
    };
  }, []);

  return (
    <div>
      {/* Live scoring UI */}
    </div>
  );
};
```

### 3. Notification Center
```typescript
import React, { useEffect, useState } from 'react';
import { realTimeNotificationService } from '../services/realtimeNotificationServiceV2';

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Initialize notifications
    realTimeNotificationService.initialize(userId);

    // Listen for new notifications
    realTimeNotificationService.on('notification:received', (notification) => {
      setNotifications(prev => [notification, ...prev]);
      
      // Show toast
      showToast(notification);
    });

    realTimeNotificationService.on('badge:update', (count) => {
      setUnreadCount(count);
    });

    // Load existing notifications
    const existing = realTimeNotificationService.getNotifications({ limit: 50 });
    setNotifications(existing);

    return () => {
      realTimeNotificationService.destroy();
    };
  }, []);

  const markAsRead = (notificationId: string) => {
    realTimeNotificationService.markAsRead(notificationId);
  };

  return (
    <div>
      {/* Notification UI */}
    </div>
  );
};
```

## WebSocket Events Reference

### Draft Events
- `draft:started` - Draft has begun
- `draft:pick:made` - A pick was made
- `draft:timer:update` - Timer tick
- `draft:turn:change` - Turn changed to new team
- `draft:paused` - Draft paused by commissioner
- `draft:resumed` - Draft resumed
- `draft:completed` - Draft finished
- `draft:trade` - Pick trade proposed
- `draft:chat:message` - Chat message received

### Scoring Events
- `scoring:update` - Score update for player/team
- `scoring:final` - Game finished, final scores
- `game:quarter` - Quarter change
- `game:score` - Team scored
- `game:redzone` - Team in red zone
- `player:stats` - Player stat update
- `player:injury` - Injury update

### Notification Events
- `notification:received` - New notification
- `notification:read` - Notification marked as read
- `notification:dismissed` - Notification dismissed
- `badge:update` - Unread count changed
- `settings:updated` - Notification settings changed

### Chat Events
- `chat:message` - New chat message
- `chat:typing:start` - User started typing
- `chat:typing:stop` - User stopped typing
- `chat:reaction` - Reaction added to message
- `presence:update` - User presence changed

## Performance Optimization

### Connection Management
```typescript
// Use connection pooling for multiple namespaces
const draftConnection = connectionPool.get('draft', config);
const scoringConnection = connectionPool.get('scoring', config);

// Implement message throttling
const throttledEmit = throttle((event, data) => {
  socket.emit(event, data);
}, 100);

// Batch updates
const batchedUpdates = [];
const flushBatch = debounce(() => {
  socket.emit('batch:update', batchedUpdates);
  batchedUpdates.length = 0;
}, 50);
```

### Memory Management
```typescript
// Clean up old data
setInterval(() => {
  // Remove notifications older than 30 days
  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  notifications = notifications.filter(n => n.timestamp > cutoff);
  
  // Clear old game data
  activeGames.forEach((game, id) => {
    if (game.status === 'FINAL' && game.timestamp < cutoff) {
      activeGames.delete(id);
    }
  });
}, 60 * 60 * 1000); // Every hour
```

### Error Recovery
```typescript
// Implement circuit breaker pattern
class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  async execute(fn: Function) {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailTime > 60000) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await fn();
      if (this.state === 'half-open') {
        this.state = 'closed';
        this.failures = 0;
      }
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailTime = Date.now();
      
      if (this.failures >= 5) {
        this.state = 'open';
      }
      
      throw error;
    }
  }
}
```

## Security Considerations

### Authentication
- All WebSocket connections require authentication token
- Tokens are validated on each reconnection
- User permissions checked for each action

### Data Validation
```typescript
// Validate incoming messages
const validateMessage = (message: any): boolean => {
  if (!message.type || !message.data) return false;
  if (message.data.length > MAX_MESSAGE_SIZE) return false;
  if (!isValidUserId(message.userId)) return false;
  return true;
};

// Sanitize user input
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
};
```

### Rate Limiting
```typescript
// Implement rate limiting
const rateLimiter = new Map();

const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const userLimits = rateLimiter.get(userId) || [];
  
  // Remove old entries
  const recent = userLimits.filter(t => now - t < 60000);
  
  if (recent.length >= 100) {
    return false; // Too many requests
  }
  
  recent.push(now);
  rateLimiter.set(userId, recent);
  return true;
};
```

## Deployment Checklist

### Environment Variables
```env
VITE_WS_URL=wss://api.yourplatform.com
VITE_VAPID_PUBLIC_KEY=your-vapid-key
VITE_ENV=production
```

### Service Worker Registration
```javascript
// public/service-worker.js
self.addEventListener('push', (event) => {
  const data = event.data.json();
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: '/badge-72x72.png',
      data: data.data
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
```

### Monitoring
```typescript
// Track WebSocket metrics
const metrics = {
  connections: 0,
  messages_sent: 0,
  messages_received: 0,
  errors: 0,
  reconnections: 0,
  latency: []
};

// Send to analytics
setInterval(() => {
  analytics.track('websocket_metrics', metrics);
  
  // Reset counters
  metrics.messages_sent = 0;
  metrics.messages_received = 0;
  metrics.errors = 0;
}, 60000);
```

## Testing

### Unit Tests
```typescript
import { enhancedWebSocketService } from '../services/enhancedWebSocketService';
import { vi } from 'vitest';

describe('WebSocket Service', () => {
  it('should reconnect on disconnect', async () => {
    const spy = vi.spyOn(enhancedWebSocketService, 'connect');
    
    await enhancedWebSocketService.connect();
    enhancedWebSocketService.disconnect();
    
    // Simulate reconnection
    await new Promise(resolve => setTimeout(resolve, 1100));
    
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
```

### Integration Tests
```typescript
describe('Draft Room Integration', () => {
  it('should sync picks across clients', async () => {
    const client1 = new MockClient();
    const client2 = new MockClient();
    
    await client1.joinDraft(draftId);
    await client2.joinDraft(draftId);
    
    const pickPromise = new Promise(resolve => {
      client2.on('draft:pick:made', resolve);
    });
    
    await client1.makePick(playerId);
    
    const pick = await pickPromise;
    expect(pick.playerId).toBe(playerId);
  });
});
```

## Troubleshooting

### Common Issues

1. **Connection Drops**
   - Check network stability
   - Verify WebSocket URL
   - Check firewall/proxy settings

2. **Messages Not Received**
   - Verify subscription to correct channels
   - Check authentication status
   - Review server logs

3. **High Latency**
   - Monitor network conditions
   - Check server load
   - Consider geographic distribution

### Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('DEBUG', 'websocket:*');

// Monitor connection state
enhancedWebSocketService.on('connection:state', (state) => {
  console.log('Connection state:', state);
});

// Track all messages
enhancedWebSocketService.on('*', (event, data) => {
  console.log('Event:', event, 'Data:', data);
});
```

## Future Enhancements

1. **WebRTC Integration**
   - Voice/video chat during drafts
   - Screen sharing for strategy sessions

2. **GraphQL Subscriptions**
   - More efficient data fetching
   - Automatic query updates

3. **Server-Sent Events Fallback**
   - Alternative for restrictive networks
   - One-way updates when WebSocket unavailable

4. **Edge Computing**
   - Deploy WebSocket servers closer to users
   - Reduce latency for global users

5. **AI-Powered Predictions**
   - Real-time win probability with ML
   - Injury impact predictions
   - Trade value calculations

## Support

For issues or questions regarding real-time features, please refer to:
- Technical documentation: `/docs/websocket-api.md`
- API reference: `/docs/api-reference.md`
- Support forum: `https://support.yourplatform.com`

## License

Copyright 2024 - Fantasy Football Platform
All rights reserved.