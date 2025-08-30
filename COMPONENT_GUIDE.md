# 🧩 Component Architecture Guide

## 🎨 **UI Component System**

### **Core UI Components**
- **PremiumCard.tsx** - Glassmorphism card system with variants (sm/md/lg)
- **PremiumNavigation.tsx** - Dynamic navigation with scroll animations
- **Button.tsx** - Premium button system with shimmer effects
- **Modal.tsx** - Backdrop blur modals with glass panels
- **LoadingSpinner.tsx** - Animated loading states

### **Player Components**
- **PlayerCard.tsx** - Holographic player cards with position-specific styling
- **PlayerSearch.tsx** - Real-time search with filtering
- **Avatar.tsx** - User profile images with status indicators

### **Draft Components**
- **LiveDraftRoom.tsx** - Cinematic draft interface with particle effects
- **DraftBoard.tsx** - Real-time draft tracking
- **AICoachPanel.tsx** - AI recommendations and insights

### **Analytics Components**
- **ChampionshipProbChart.tsx** - Interactive probability charts
- **AdvancedAnalyticsDashboard.tsx** - Comprehensive statistics display
- **ActivityFeedWidget.tsx** - Social activity tracking

## 🏗️ **View Architecture**

### **Main Views**
- **LeagueHubView.tsx** - Central league dashboard
- **EnhancedDraftRoomView.tsx** - Complete draft experience
- **EnhancedTeamHubView.tsx** - Team management interface
- **PlayersView.tsx** - Player database and search
- **TradesView.tsx** - Trade proposals and analysis

### **Secondary Views**
- **LeagueStandingsView.tsx** - League rankings and playoffs
- **MatchupView.tsx** - Head-to-head matchup analysis  
- **WaiverWireView.tsx** - Free agent management
- **MessagesView.tsx** - League communication

## 🎯 **Service Layer**

### **Core Services**
- **aiDraftCoachService.ts** - AI-powered draft recommendations
- **enhancedAnalyticsService.ts** - Advanced statistics processing
- **liveScoringService.ts** - Real-time score updates
- **enhancedWebSocketService.ts** - Live connection management

### **Data Services**
- **oracleMachineLearningService.ts** - Predictive modeling
- **aiRecommendationEngine.ts** - Personalized suggestions
- **realtimeNotificationServiceV2.ts** - Push notifications

## 🎨 **Styling System**

### **Design Tokens**
```css
/* Glass Effects */
--glass-blur: 12px
--glass-saturation: 180%

/* Colors */
--primary-500: #5e6bff (Electric Blue)
--secondary-500: #10b981 (Emerald)
--accent-500: #06b6d4 (Cyan)

/* Position Colors */
--qb-color: #ef4444 (Red)
--rb-color: #10b981 (Green)  
--wr-color: #3b82f6 (Blue)
```

### **Key CSS Classes**
- `.glass-card` - Base glassmorphism component
- `.premium-button` - Enhanced button styling
- `.badge-position` - Position-specific badges
- `.holographic-text` - Gradient text effects
- `.floating-animation` - Subtle movement effects

## 📱 **Responsive Breakpoints**
- **xs**: 475px (Small phones)
- **sm**: 640px (Large phones)  
- **md**: 768px (Tablets)
- **lg**: 1024px (Small laptops)
- **xl**: 1280px (Desktops)
- **2xl**: 1536px (Large screens)