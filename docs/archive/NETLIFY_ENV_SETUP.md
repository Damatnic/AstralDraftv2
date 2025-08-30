# 🔧 Netlify Environment Variables Setup

## Required Environment Variables

Set these in your Netlify dashboard under **Site settings > Environment variables**:

### 🔑 Essential Variables
```
VITE_API_BASE_URL=https://astraldraft.netlify.app/.netlify/functions/api
VITE_ENVIRONMENT=production
NODE_ENV=production
```

### 🎯 Feature Flags (Recommended)
```
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=true
VITE_ENABLE_ORACLE=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_OFFLINE=true
```

### 🤖 API Keys (Optional - for full functionality)
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SPORTS_DATA_API_KEY=your_sports_data_api_key_here
```

## 📋 How to Set Environment Variables in Netlify

1. **Go to your Netlify dashboard**
2. **Select your site** (astraldraft)
3. **Navigate to Site settings > Environment variables**
4. **Click "Add a variable"** for each variable above
5. **Enter the key and value**
6. **Click "Save"**

## 🔍 Verification

After setting the variables, your next build will show:
```
🔍 Environment Variables Check

Node Environment: production
Vite Environment: production

📋 API Keys Status:
✅ VITE_API_BASE_URL: https://...
✅ VITE_OPENAI_API_KEY: sk-proj...
✅ VITE_GEMINI_API_KEY: AIza...

⚙️ Feature Flags:
✅ VITE_ENABLE_ANALYTICS: true
✅ VITE_ENABLE_PWA: true
✅ VITE_ENABLE_ORACLE: true

🌐 Netlify Build Environment Detected
```

## 🚀 Trigger New Build

After setting environment variables:
1. **Go to Deploys tab**
2. **Click "Trigger deploy"**
3. **Select "Deploy site"**

Your app will rebuild with the new environment variables!

## 🎯 What Each Variable Does

- **VITE_API_BASE_URL**: Points API calls to your Netlify Functions
- **VITE_ENVIRONMENT**: Enables production optimizations
- **VITE_ENABLE_ORACLE**: Enables AI-powered predictions
- **VITE_OPENAI_API_KEY**: Powers advanced analytics (optional)
- **VITE_GEMINI_API_KEY**: Powers Oracle predictions (optional)

## ⚠️ Important Notes

- Variables starting with `VITE_` are exposed to the browser
- API keys are masked in build logs for security
- Changes require a new deployment to take effect
- The app works without API keys (uses mock data)