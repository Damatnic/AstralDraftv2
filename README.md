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