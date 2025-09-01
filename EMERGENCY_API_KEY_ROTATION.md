# 🚨 EMERGENCY API KEY ROTATION - IMMEDIATE ACTION REQUIRED

## CRITICAL SECURITY BREACH DETECTED

**Date:** ${new Date().toISOString()}
**Severity:** CRITICAL
**Impact:** Financial liability, data breach risk

## EXPOSED CREDENTIALS FOUND

### 1. **Sports.io API Key (COMPROMISED)**
- **Exposed Key:** `bab44477ed904140b43630a7520517e7`
- **Location:** `.env` file (not in git, but exposed in audit report)
- **Risk:** Unauthorized API usage, potential financial charges
- **ACTION:** ROTATE IMMEDIATELY

### 2. **Authentication Tokens in localStorage**
- **Risk:** XSS attacks can steal tokens
- **Affected Files:**
  - `contexts/AuthContext.tsx`
  - `services/authService.ts`
  - `hooks/useAuth.ts`
- **ACTION:** Migrate to httpOnly cookies

## IMMEDIATE ROTATION STEPS

### Step 1: Rotate Sports.io API Key (5 minutes)

1. **Login to Sports.io Dashboard:**
   ```
   https://sportsdata.io/members/portal
   ```

2. **Generate New API Key:**
   - Navigate to API Keys section
   - Revoke existing key: `bab44477ed904140b43630a7520517e7`
   - Generate new key
   - Copy new key (DO NOT paste in any file yet)

3. **Update in Netlify:**
   ```bash
   # Set in Netlify UI or CLI
   netlify env:set VITE_SPORTS_IO_API_KEY "your_new_key_here"
   ```

4. **Update Local .env (DO NOT COMMIT):**
   ```env
   VITE_SPORTS_IO_API_KEY=your_new_key_here
   ```

### Step 2: Rotate Gemini API Key (5 minutes)

1. **Login to Google AI Studio:**
   ```
   https://makersuite.google.com/app/apikey
   ```

2. **Generate New Key:**
   - Delete/revoke any existing keys
   - Create new API key
   - Restrict key to your domains

3. **Update in Netlify:**
   ```bash
   netlify env:set VITE_GEMINI_API_KEY "your_new_gemini_key"
   ```

### Step 3: Generate New JWT Secrets (5 minutes)

```bash
# Generate new secrets
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('ENCRYPTION_KEY=' + require('crypto').randomBytes(16).toString('hex'))"
```

Update in Netlify environment variables.

### Step 4: Clear Git History (10 minutes)

Check if any secrets were committed:

```bash
# Search for exposed keys in git history
git log -S "bab44477ed904140b43630a7520517e7" --oneline
git log -S "AIza" --oneline
git log -S "sk-" --oneline
```

If found, clean history:

```bash
# Use BFG Repo Cleaner or git filter-branch
# Download BFG: https://rtyley.github.io/bfg-repo-cleaner/

# Clean specific strings
java -jar bfg.jar --replace-text passwords.txt repo.git

# Or use git filter-branch (slower)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

### Step 5: Update .gitignore (2 minutes)

Ensure these are in `.gitignore`:

```gitignore
# Environment files
.env
.env.*
!.env.example
*.env

# API keys and secrets
**/apikeys.json
**/secrets.json
**/credentials.json

# Local config
config.local.js
settings.local.json
```

### Step 6: Deploy Security Patches (10 minutes)

1. **Apply emergency middleware:**
   ```javascript
   // In server/index.js
   const emergencySecurity = require('./middleware/emergencySecurityMiddleware');
   emergencySecurity.applyEmergencySecurityMiddleware(app);
   ```

2. **Update authentication to use secure cookies:**
   - Replace all `localStorage.setItem` for tokens
   - Use `httpOnly` cookies instead

3. **Deploy to Netlify:**
   ```bash
   npm run build
   netlify deploy --prod
   ```

## VERIFICATION CHECKLIST

- [ ] Sports.io old API key revoked
- [ ] Sports.io new API key set in Netlify
- [ ] Gemini API key rotated
- [ ] JWT secrets regenerated
- [ ] All tokens moved from localStorage to httpOnly cookies
- [ ] Security headers configured
- [ ] CORS restricted to specific domains
- [ ] Rate limiting enabled on auth endpoints
- [ ] Git history cleaned of secrets
- [ ] .gitignore updated
- [ ] Emergency patches deployed

## POST-INCIDENT ACTIONS

1. **Monitor API Usage:**
   - Check Sports.io dashboard for unauthorized usage
   - Review billing for unexpected charges
   - Set up usage alerts

2. **Security Audit:**
   - Run `npm audit`
   - Test with OWASP ZAP
   - Verify headers at securityheaders.com

3. **User Communication:**
   - Force logout all users
   - Require password reset for admin accounts
   - Send security notification email

4. **Documentation:**
   - Update security procedures
   - Document incident response
   - Create rotation schedule

## PREVENTION MEASURES

1. **Use Secret Management:**
   - Consider HashiCorp Vault
   - Use Netlify environment variables
   - Never commit .env files

2. **Automated Scanning:**
   - Pre-commit hooks with git-secrets
   - GitHub secret scanning
   - Regular security audits

3. **Key Rotation Policy:**
   - Rotate API keys every 90 days
   - Rotate JWT secrets monthly
   - Document rotation procedures

## EMERGENCY CONTACTS

- **Sports.io Support:** support@sportsdata.io
- **Google Cloud Support:** https://cloud.google.com/support
- **Netlify Support:** https://www.netlify.com/support/

## TIME ESTIMATE

**Total Time:** 30-40 minutes
**Priority:** CRITICAL - Start immediately

---

**Remember:** Every minute of delay increases risk exposure. Begin with Step 1 immediately.