# AstralDraft v2 🏈

**Advanced Fantasy Football Draft Platform with AI Oracle**

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/astraldraftv2/deploys)

## 🌟 Overview

AstralDraft v2 is a cutting-edge fantasy football platform that combines advanced analytics, AI-powered predictions, and real-time draft capabilities. Built with React, TypeScript, and modern web technologies, it offers an unparalleled fantasy football experience.

## ✨ Key Features

### 🤖 AI Oracle System
- **Machine Learning Predictions**: Advanced ML models for player performance forecasting
- **Real-time Analytics**: Live data integration and analysis
- **Ensemble Modeling**: Multiple prediction algorithms working together
- **Confidence Scoring**: Reliability metrics for all predictions

### 🎯 Draft Experience
- **Live Snake Drafts**: Real-time multiplayer drafting
- **Auction Drafts**: Dynamic bidding system
- **AI Draft Coach**: Intelligent draft recommendations
- **Mock Draft Simulator**: Practice with AI opponents

### 📊 Advanced Analytics
- **Player Comparison Tools**: Side-by-side statistical analysis
- **Trade Analyzer**: Fair trade evaluation system
- **Matchup Analytics**: Weekly opponent analysis
- **Championship Probability**: Season-long projections

### 📱 Mobile-First Design
- **Progressive Web App**: Install on any device
- **Touch-Optimized Interface**: Gesture-based navigation
- **Offline Capabilities**: Core features work without internet
- **Responsive Design**: Seamless across all screen sizes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Damatnic/AstralDraftv2.git
   cd AstralDraftv2
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   cp server/.env.example server/.env
   ```

4. **Configure API Keys**
   Edit `.env.local` and add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

5. **Start Development Server**
   ```bash
   npm run dev:all
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 🏗️ Architecture

### Frontend Stack
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Query** for data fetching

### Backend Stack
- **Node.js** with Express
- **Socket.io** for real-time features
- **MongoDB** for data persistence
- **JWT** for authentication

### AI/ML Integration
- **Google Gemini AI** for natural language processing
- **OpenAI GPT** for advanced analytics
- **Custom ML Models** for player predictions
- **Real-time Data APIs** for live statistics

## 📁 Project Structure

```
AstralDraftv2/
├── components/          # React components
│   ├── analytics/       # Analytics dashboards
│   ├── draft/          # Draft room components
│   ├── oracle/         # AI Oracle interface
│   └── mobile/         # Mobile-optimized components
├── services/           # API and business logic
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── server/             # Backend API
│   ├── routes/         # API endpoints
│   ├── models/         # Database models
│   └── services/       # Backend services
└── public/             # Static assets
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local)**
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=http://localhost:3001
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_ENABLE_AI_FEATURES=true
```

**Backend (server/.env)**
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/astraldraft
JWT_SECRET=your_jwt_secret_here
```

## 🚀 Deployment

### Netlify Deployment

1. **Connect Repository**
   - Link your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Environment Variables**
   Add all required environment variables in Netlify dashboard

3. **Deploy**
   - Automatic deployments on push to main branch
   - Preview deployments for pull requests

### Manual Deployment

```bash
# Build for production
npm run build

# Deploy to your hosting provider
# Upload the 'dist' folder contents
```

## 🎨 UI Design System Rules

### Glassmorphism Design Standards

All UI components and new features MUST follow these design rules to maintain consistency:

#### Core Design Classes
```css
/* Background Gradients - Use on all main containers */
.gradient-background {
  @apply bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5;
}

/* Glass Panel - Use for all cards and containers */
.glass-pane {
  @apply bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg;
}

/* Primary Button - Main actions */
.glass-button-primary {
  @apply bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] 
         text-white font-semibold rounded-lg shadow-lg hover:shadow-xl 
         transition-all backdrop-blur-sm;
}

/* Secondary Button - Secondary actions */
.glass-button {
  @apply bg-white/10 backdrop-blur-sm border border-white/20 
         text-white rounded-lg hover:bg-white/20 transition-all;
}

/* Input Fields - All form inputs */
.glass-input {
  @apply bg-white/10 backdrop-blur-sm border border-white/20 
         rounded-lg px-4 py-2 text-white placeholder-white/50 
         focus:border-[var(--color-primary)] focus:outline-none;
}
```

#### Design Rules for New Components

1. **Backgrounds**: Always use gradient backgrounds on main views
   ```jsx
   <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5">
   ```

2. **Containers**: Use glass-pane for all content containers
   ```jsx
   <div className="glass-pane p-6">
   ```

3. **Buttons**: Use appropriate glass button classes
   ```jsx
   <button className="glass-button-primary">Primary Action</button>
   <button className="glass-button">Secondary Action</button>
   ```

4. **Forms**: All inputs must use glass-input class
   ```jsx
   <input className="glass-input" />
   ```

5. **Colors**: Use CSS variables for consistency
   - Primary: `var(--color-primary)`
   - Secondary: `var(--color-secondary)`
   - Text: `var(--text-primary)`, `var(--text-secondary)`

6. **Spacing**: Maintain consistent padding/margins
   - Container padding: `p-6`
   - Section spacing: `space-y-6`
   - Component gaps: `gap-4`

7. **Animations**: Use Framer Motion for smooth transitions
   ```jsx
   <motion.div
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.3 }}
   >
   ```

#### Mobile Responsiveness Rules
- All components must be mobile-first
- Use responsive classes: `sm:`, `md:`, `lg:`, `xl:`
- Touch targets minimum 44x44px
- Ensure glassmorphism effects work on mobile

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run mobile tests
npm run test:mobile
```

## 📱 PWA Features

- **Offline Support**: Core functionality works without internet
- **Install Prompt**: Add to home screen on mobile devices
- **Push Notifications**: Real-time updates and alerts
- **Background Sync**: Data synchronization when back online

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NFL API** for real-time statistics
- **Fantasy Football Community** for feature inspiration
- **Open Source Contributors** for various libraries and tools

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Damatnic/AstralDraftv2/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Damatnic/AstralDraftv2/discussions)
- **Email**: support@astraldraft.com

---

**Built with ❤️ for the Fantasy Football Community**

[Live Demo](https://astraldraftv2.netlify.app) | [Documentation](https://docs.astraldraft.com) | [API Reference](https://api.astraldraft.com/docs)