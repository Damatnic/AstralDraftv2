# 🎯 TypeScript Migration Plan
## Replace 110+ 'any' types with proper interfaces

## Current Issues
- **110+ instances of `any`** across the codebase
- Loose type definitions in critical areas
- Missing interfaces for complex objects

## Phase 1: Create Core Type Definitions (1 hour)

### 1. Create comprehensive types directory:
```bash
mkdir src/types
```

### 2. Core interfaces (`src/types/index.ts`):
```typescript
// Player and Team Types
export interface Player {
  id: number;
  name: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DEF';
  team: string;
  projectedPoints: number;
  averageDraftPosition: number;
  tier: number;
  byeWeek: number;
  injury?: {
    status: 'healthy' | 'questionable' | 'doubtful' | 'out';
    description?: string;
  };
}

export interface Team {
  id: number;
  name: string;
  owner: string;
  roster: Player[];
  record: {
    wins: number;
    losses: number;
    ties: number;
  };
  totalPoints: number;
}

// Draft Types
export interface DraftPick {
  pick: number;
  round: number;
  teamId: number;
  playerId?: number;
  timeSelected?: Date;
  timeRemaining?: number;
}

export interface DraftState {
  isActive: boolean;
  currentPick: number;
  currentTeamId: number;
  picks: DraftPick[];
  timePerPick: number;
  draftType: 'snake' | 'linear' | 'auction';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  timestamp: string;
}

// User and Auth Types
export interface User {
  id: number;
  name: string;
  email: string;
  teamName: string;
  avatar: string;
  isCommissioner: boolean;
  isAuthenticated: boolean;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  autoRefresh: boolean;
  draftReminders: boolean;
}
```

## Phase 2: Update Context Providers (1 hour)

### Update `contexts/AppContext.tsx`:
```typescript
// Replace 'any' with proper types
interface AppState {
  user: User | null;
  currentView: ViewType;
  draftState: DraftState | null;
  notifications: Notification[];
  isLoading: boolean;
}

type AppAction = 
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'UPDATE_DRAFT'; payload: DraftState }
  | { type: 'ADD_NOTIFICATION'; payload: Notification };

// Update reducer with proper typing
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    // ... other cases
    default:
      return state;
  }
};
```

## Phase 3: Component Props Typing (1 hour)

### Example: Fix AdminRoute component
```typescript
interface AdminLoginProps {
  onLogin: (admin: User) => void;
}

interface AdminCredentials {
  username: string;
  password: string;
}

// Replace 'any' event handlers
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // ...
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setCredentials(prev => ({ ...prev, [name]: value }));
};
```

## Phase 4: Service Layer Typing (1 hour)

### API Services with proper types
```typescript
// services/playerService.ts
export class PlayerService {
  static async getPlayers(): Promise<ApiResponse<Player[]>> {
    // Implementation with proper return type
  }
  
  static async getPlayerById(id: number): Promise<ApiResponse<Player>> {
    // Implementation with proper return type
  }
}

// services/draftService.ts
export class DraftService {
  static async startDraft(leagueId: number): Promise<ApiResponse<DraftState>> {
    // Implementation
  }
  
  static async makePick(pick: DraftPick): Promise<ApiResponse<DraftState>> {
    // Implementation  
  }
}
```

## Commands to Run

1. **Check current TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

2. **Enable strict mode gradually:**
   ```typescript
   // tsconfig.json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true
     }
   }
   ```

3. **Use type checking tools:**
   ```bash
   npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
   ```

## Expected Results
- Zero TypeScript compilation errors
- Better IDE support and autocomplete
- Fewer runtime type errors
- Improved code maintainability
- Better refactoring capabilities