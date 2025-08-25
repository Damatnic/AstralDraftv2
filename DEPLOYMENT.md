# Astral Draft - Netlify Deployment Guide

## 🚀 Quick Deployment to astraldraft.netlify.app

### Prerequisites
- GitHub repository with your code
- Netlify account (free tier works)
- Node.js 18+ installed locally

### Step 1: Prepare Your Repository

1. **Ensure all files are committed and pushed to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin master
   ```

### Step 2: Deploy to Netlify

#### Option A: Automatic Deployment (Recommended)

1. **Go to [Netlify](https://netlify.com) and sign in**

2. **Click "New site from Git"**

3. **Connect your GitHub repository:**
   - Choose GitHub as your Git provider
   - Select your `AstralDraftv2` repository
   - Choose the `master` branch

4. **Configure build settings:**
   - Build command: `npm run build:prod`
   - Publish directory: `dist`
   - Node version: `20`

5. **Set environment variables in Netlify dashboard:**
   ```
   VITE_API_BASE_URL=https://astraldraft.netlify.app/.netlify/functions/api
   VITE_ENVIRONMENT=production
   VITE_ENABLE_ANALYTICS=true
   VITE_ENABLE_PWA=true
   ```

6. **Deploy the site**

#### Option B: Manual Deployment with CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```bash
   netlify login
   ```

3. **Initialize your site:**
   ```bash
   netlify init
   ```

4. **Deploy:**
   ```bash
   npm run deploy:prod
   ```

### Step 3: Configure Custom Domain (Optional)

1. **In Netlify dashboard, go to Site settings > Domain management**
2. **Add custom domain: `astraldraft.netlify.app`**
3. **Netlify will automatically provision SSL certificate**

### Step 4: Set Up Environment Variables

In your Netlify dashboard, go to **Site settings > Environment variables** and add:

```
VITE_API_BASE_URL=https://astraldraft.netlify.app/.netlify/functions/api
VITE_ENVIRONMENT=production
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_PWA=true
VITE_ENABLE_OFFLINE=true
VITE_ENABLE_ORACLE=true
```

**Optional API Keys (for full functionality):**
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SPORTS_DATA_API_KEY=your_sports_data_api_key_here
```

### Step 5: Verify Deployment

1. **Check build logs in Netlify dashboard**
2. **Visit your deployed site**
3. **Test core functionality:**
   - Homepage loads
   - Navigation works
   - API endpoints respond (check Network tab)
   - PWA features work (try offline mode)

### Troubleshooting

#### Build Fails
- Check build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

#### API Errors
- Check that Netlify Functions are deployed
- Verify environment variables are set
- Check function logs in Netlify dashboard

#### Assets Not Loading
- Verify `dist` folder is being published
- Check that all assets are in the build output
- Ensure proper MIME types in `netlify.toml`

### Continuous Deployment

Once set up, your site will automatically redeploy when you push to the `master` branch:

```bash
git add .
git commit -m "Update feature"
git push origin master
# Site automatically rebuilds and deploys
```

### Performance Optimization

Your site is already optimized with:
- ✅ Gzip compression
- ✅ Asset caching
- ✅ Service worker for offline functionality
- ✅ Code splitting and lazy loading
- ✅ Image optimization
- ✅ PWA capabilities

### Monitoring

- **Netlify Analytics**: Built-in traffic and performance metrics
- **Build notifications**: Get notified of successful/failed deployments
- **Form handling**: Contact forms work out of the box
- **Function logs**: Monitor API performance

### Support

- **Netlify Docs**: https://docs.netlify.com
- **Build issues**: Check Netlify build logs
- **Function issues**: Check Netlify function logs
- **Performance**: Use Netlify Analytics

---

## 🎉 Your Astral Draft app is now live at astraldraft.netlify.app!

### Next Steps:
1. Test all functionality
2. Set up monitoring and alerts
3. Configure custom domain if needed
4. Add API keys for full Oracle functionality
5. Set up form handling for user feedback