# 🚀 Astral Draft Deployment Guide

This guide covers deploying Astral Draft to GitHub Pages with SportsDataIO integration.

## 📋 Prerequisites

1. **SportsDataIO API Key**: Get your free key from [SportsData.io](https://sportsdata.io/)
2. **GitHub Account**: Repository access to push code
3. **Optional: Gemini AI API Key**: For advanced AI features

## 🔧 Environment Setup

### 1. GitHub Secrets Configuration

In your GitHub repository, go to **Settings > Secrets and Variables > Actions** and add:

```
VITE_SPORTS_DATA_API_KEY=your_sportsdata_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here (optional)
```

### 2. Local Development

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_SPORTS_DATA_API_KEY=your_actual_api_key_here
VITE_GEMINI_API_KEY=your_gemini_key_here
NODE_ENV=development
VITE_NODE_ENV=development
```

## 🏗️ Build Process

The application uses Vite for building and includes:
- ✅ TypeScript compilation
- ✅ Bundle optimization
- ✅ Code splitting
- ✅ Environment variable validation

### Build Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Type checking
npm run type-check

# Production build
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment Options

### Option 1: GitHub Pages (Recommended)

The repository is configured with GitHub Actions for automatic deployment:

1. Push to `master` branch
2. GitHub Actions automatically:
   - Installs dependencies
   - Runs type checking
   - Builds the application
   - Deploys to GitHub Pages

**Live URL**: `https://[username].github.io/AstralDraftv2/`

### Option 2: Netlify

Alternative deployment option:

1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Option 3: Vercel

1. Import repository to Vercel
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variables

## ⚡ SportsDataIO Integration

### API Features

The application integrates with SportsDataIO for:
- 🏈 **Live NFL Scores**: Real-time game data
- 📊 **Player Stats**: Season and weekly statistics
- 🎯 **Team Data**: Roster information and standings
- 📅 **Schedule Data**: Upcoming games and results

### Fallback Behavior

- **With API Key**: Fetches live NFL data from SportsDataIO
- **Without API Key**: Uses mock data for development/demo

### Testing Integration

```bash
# Check if API key is configured
npm run build

# Should show:
# ✅ VITE_SPORTS_DATA_API_KEY: sk1234...5678
```

## 🔐 Security Notes

- API keys are only exposed to the build process
- Environment variables prefixed with `VITE_` are safe for client-side use
- SportsDataIO API key has read-only access to sports data

## 🎯 Performance Features

- **Bundle Splitting**: Optimized chunk loading
- **Code Optimization**: Tree shaking and minification  
- **PWA Ready**: Service worker and manifest configured
- **Responsive Design**: Mobile-first approach

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**: Check TypeScript errors with `npm run type-check`
2. **No Live Data**: Verify `VITE_SPORTS_DATA_API_KEY` is set
3. **Deployment Issues**: Check GitHub Actions logs

### Debug Commands

```bash
# Environment check
node scripts/verify-env.js

# Detailed build
npm run build -- --debug

# Test production build locally
npm run preview
```

## 📞 Support

- **Repository**: [GitHub Issues](https://github.com/Damatnic/AstralDraftv2/issues)
- **SportsDataIO Docs**: [API Documentation](https://sportsdata.io/developers/api-documentation/nfl)

---

✅ **Ready for Production Deployment!** 🚀