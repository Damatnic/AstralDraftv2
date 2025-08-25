# 🚀 Starting the Astral Draft Backend

This guide will help you get the backend server running with real data.

## Prerequisites

Before starting, make sure you have:

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
3. **Redis** (optional, for caching) - [Download here](https://redis.io/download)

## Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Setup

Copy the environment template:
```bash
cp .env.example .env
```

Edit `.env` file with your settings:
```env
# Required
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/astral_draft
JWT_SECRET=your-super-secret-jwt-key-change-this

# Optional (for enhanced features)
REDIS_URL=redis://localhost:6379
SPORTSDATA_API_KEY=your-sportsdata-api-key
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
brew services start mongodb-community
```

**MongoDB Atlas:**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string and update `MONGODB_URI` in `.env`

### 4. Start Redis (Optional)

```bash
# Windows (if installed)
redis-server

# macOS
brew services start redis

# Linux
sudo systemctl start redis
```

### 5. Seed the Database

```bash
npm run seed:dev
```

This will create:
- ✅ 10 test users (player1@astral.com to player10@astral.com, password: test1234)
- ✅ 1 admin user (admin@astral.com, password: admin1234)
- ✅ 2000+ NFL players with stats and rankings
- ✅ 1 test league ready for drafting

### 6. Start the Server

```bash
npm run dev
```

You should see:
```
🔌 Initializing database connections...
✅ MongoDB connected successfully
✅ Redis connected successfully (or warning if not available)
✅ All database connections established
🚀 Astral Draft server running on port 3001
📊 Health check: http://localhost:3001/api/health
🌐 Environment: development
🔗 Frontend URL: http://localhost:5173
```

## Testing the API

### Health Check
```bash
curl http://localhost:3001/api/health
```

### Login Test
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"player1@astral.com","password":"test1234"}'
```

### Get Players
```bash
curl http://localhost:3001/api/players/rankings?position=QB&limit=10
```

## Frontend Integration

The frontend is already configured to connect to the backend. Just make sure:

1. Backend is running on port 3001
2. Frontend environment variable is set:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

## Test Users

Use these accounts to test the application:

| Email | Password | Role |
|-------|----------|------|
| player1@astral.com | test1234 | Commissioner |
| player2@astral.com | test1234 | User |
| player3@astral.com | test1234 | User |
| ... | test1234 | User |
| player10@astral.com | test1234 | User |
| admin@astral.com | admin1234 | Admin |

## API Endpoints Available

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Leagues
- `GET /api/leagues` - Get user's leagues
- `POST /api/leagues` - Create new league
- `POST /api/leagues/join` - Join league by invite code
- `GET /api/leagues/public` - Get public leagues
- `GET /api/leagues/:id` - Get league details
- `PUT /api/leagues/:id` - Update league (commissioner only)
- `DELETE /api/leagues/:id` - Delete league (commissioner only)
- `GET /api/leagues/:id/standings` - Get league standings
- `POST /api/leagues/:id/leave` - Leave league

### Players
- `GET /api/players/search` - Search players
- `GET /api/players/rankings` - Get player rankings
- `GET /api/players/:id` - Get player details
- `GET /api/players/:id/stats/:week` - Get weekly stats
- `GET /api/players/position/:position` - Get players by position
- `GET /api/players/team/:team` - Get players by NFL team
- `GET /api/players/available/:leagueId` - Get available players for league
- `GET /api/players/news/:id` - Get player news

## Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"

# Check connection string
echo $MONGODB_URI
```

### Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Missing Dependencies
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Database Seeding Issues
```bash
# Clear database and reseed
npm run seed:dev
```

## External API Keys (Optional)

For enhanced features, get these API keys:

### SportsData.io (NFL Data)
1. Sign up at [SportsData.io](https://sportsdata.io/)
2. Get your API key from the dashboard
3. Add to `.env`: `SPORTSDATA_API_KEY=your-key-here`

### Google Gemini AI (Oracle Features)
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `.env`: `GEMINI_API_KEY=your-key-here`

### OpenAI (Advanced Analytics)
1. Sign up at [OpenAI](https://platform.openai.com/)
2. Create an API key
3. Add to `.env`: `OPENAI_API_KEY=your-key-here`

## Next Steps

Once the backend is running:

1. ✅ **Test Authentication** - Login with test users
2. ✅ **Create/Join Leagues** - Test league functionality
3. ✅ **Browse Players** - Search and view player data
4. 🔄 **Draft System** - Coming next in development
5. 🔄 **Real-time Features** - WebSocket implementation
6. 🔄 **AI Integration** - Oracle predictions and analysis

## Support

If you encounter issues:

1. Check the server logs for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB and Redis are running
4. Check that ports 3001 and 5173 are available
5. Review the troubleshooting section above

The backend is now fully functional with real data and ready for frontend integration!