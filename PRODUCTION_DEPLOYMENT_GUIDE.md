# PRODUCTION DEPLOYMENT GUIDE
## Astral Draft Fantasy Football Platform v2.0.0

**Document Type:** Operational Procedure  
**Classification:** RESTRICTED  
**Last Updated:** 2025-09-01  
**Deployment Team:** DevOps & Platform Engineering  

---

## QUICK REFERENCE

**Deployment Window:** 2025-09-01 02:00 - 06:00 EST  
**Estimated Duration:** 45 minutes  
**Rollback Time:** < 10 minutes  
**Emergency Contact:** ops-team@astraldraft.com  
**War Room:** https://meet.astraldraft.com/deployment  

---

## 1. PRE-DEPLOYMENT CHECKLIST (T-24 Hours)

### Environment Verification
```bash
# 1. Verify production environment
npm run env:check:prod

# 2. Check dependency versions
npm audit
npm outdated

# 3. Validate configuration
npm run config:validate

# 4. Test database connectivity
npm run db:health:prod
```

### Backup Creation
```bash
# 1. Database backup
pg_dump -h prod-db.astraldraft.com -U admin -d astraldraft > backup-$(date +%Y%m%d-%H%M%S).sql

# 2. Configuration backup
tar -czf config-backup-$(date +%Y%m%d-%H%M%S).tar.gz .env config/

# 3. Upload to S3
aws s3 cp backup-*.sql s3://astraldraft-backups/$(date +%Y%m%d)/
aws s3 cp config-backup-*.tar.gz s3://astraldraft-backups/$(date +%Y%m%d)/
```

### Team Preparation
- [ ] Deployment team briefed
- [ ] Support team on standby
- [ ] Communication channels open
- [ ] Rollback plan reviewed
- [ ] Emergency contacts confirmed

---

## 2. DEPLOYMENT PROCEDURES

### Step 1: Maintenance Mode (T-15 minutes)
```bash
# Enable maintenance mode
npm run maintenance:enable

# Verify maintenance page is displayed
curl -I https://astraldraft.com
# Should return: X-Maintenance-Mode: true

# Send notification to users
npm run notify:maintenance
```

### Step 2: Stop Services (T-10 minutes)
```bash
# Stop application services
systemctl stop astraldraft-web
systemctl stop astraldraft-worker
systemctl stop astraldraft-scheduler

# Verify services stopped
systemctl status astraldraft-*

# Close database connections
npm run db:connections:close
```

### Step 3: Deploy Application Code (T-0)
```bash
# 1. Pull latest code
git fetch origin
git checkout v2.0.0-production
git pull origin v2.0.0-production

# 2. Install dependencies
npm ci --production

# 3. Build application
npm run build:prod

# 4. Run database migrations
npm run db:migrate:prod

# 5. Update static assets
npm run assets:deploy

# 6. Clear cache
npm run cache:clear:all
```

### Step 4: Configuration Updates
```bash
# 1. Update environment variables
cp .env.production .env

# 2. Rotate API keys if needed
npm run secrets:rotate

# 3. Update security headers
npm run security:headers:update

# 4. Configure rate limiting
npm run ratelimit:configure
```

### Step 5: Start Services (T+20 minutes)
```bash
# Start services in order
systemctl start astraldraft-db
sleep 10
systemctl start astraldraft-cache
sleep 5
systemctl start astraldraft-web
systemctl start astraldraft-worker
systemctl start astraldraft-scheduler

# Verify all services running
systemctl status astraldraft-*
```

### Step 6: Health Checks (T+25 minutes)
```bash
# Run automated health checks
npm run health:check:all

# Check individual components
curl https://api.astraldraft.com/health
curl https://astraldraft.com/api/status
npm run test:smoke:prod

# Verify WebSocket connections
npm run websocket:test:prod

# Check database performance
npm run db:performance:check
```

### Step 7: Disable Maintenance Mode (T+30 minutes)
```bash
# Disable maintenance mode
npm run maintenance:disable

# Verify site is accessible
curl -I https://astraldraft.com
# Should NOT have: X-Maintenance-Mode header

# Clear CDN cache
npm run cdn:purge

# Send go-live notification
npm run notify:live
```

---

## 3. POST-DEPLOYMENT VALIDATION

### Immediate Checks (T+35 minutes)
```bash
# 1. Monitor error rates
npm run monitor:errors -- --duration=10m

# 2. Check performance metrics
npm run monitor:performance

# 3. Validate critical paths
npm run test:critical:prod

# 4. Review application logs
tail -f /var/log/astraldraft/app.log

# 5. Check user sessions
npm run sessions:validate
```

### Extended Monitoring (T+1 hour)
```bash
# Monitor for 1 hour post-deployment
npm run monitor:extended -- --duration=1h

# Check metrics dashboard
open https://monitoring.astraldraft.com/dashboard

# Review alerts
npm run alerts:review
```

---

## 4. ROLLBACK PROCEDURES

### Automatic Rollback Triggers
- Error rate > 5% for 5 minutes
- Response time > 3s for 10 requests
- Memory usage > 90% for 3 minutes
- Database connection failures > 10

### Manual Rollback Process
```bash
# IMMEDIATE ROLLBACK (< 5 minutes)

# 1. Enable maintenance mode
npm run maintenance:enable

# 2. Stop current services
systemctl stop astraldraft-*

# 3. Revert to previous version
git checkout v1.9.8-stable
npm ci --production
npm run build:prod

# 4. Restore database if needed
psql -h prod-db.astraldraft.com -U admin -d astraldraft < backup-latest.sql

# 5. Start services
systemctl start astraldraft-*

# 6. Validate rollback
npm run health:check:all

# 7. Disable maintenance mode
npm run maintenance:disable
```

### Emergency Recovery
```bash
# FULL RECOVERY (< 30 minutes)

# 1. Activate disaster recovery
npm run dr:activate

# 2. Switch to backup infrastructure
npm run infra:switch:backup

# 3. Restore from last known good state
npm run restore:full -- --timestamp=$(date -d '1 hour ago' +%s)

# 4. Validate recovery
npm run dr:validate

# 5. Update DNS if needed
npm run dns:update:emergency
```

---

## 5. MONITORING & ALERTING

### Key Performance Indicators (KPIs)
| Metric | Normal | Warning | Critical | Action |
|--------|--------|---------|----------|--------|
| **Error Rate** | <0.1% | 0.1-1% | >1% | Investigate/Rollback |
| **Response Time** | <200ms | 200-500ms | >500ms | Scale/Optimize |
| **CPU Usage** | <60% | 60-80% | >80% | Scale horizontally |
| **Memory Usage** | <70% | 70-85% | >85% | Restart/Scale |
| **DB Connections** | <80 | 80-95 | >95 | Connection pooling |

### Monitoring Commands
```bash
# Real-time metrics
npm run monitor:realtime

# Performance dashboard
npm run dashboard:performance

# Error tracking
npm run errors:track

# User activity
npm run analytics:realtime

# System resources
npm run system:stats
```

### Alert Configuration
```yaml
alerts:
  - name: high_error_rate
    condition: error_rate > 1%
    duration: 5m
    action: page_oncall
    
  - name: slow_response
    condition: p95_latency > 1s
    duration: 10m
    action: notify_team
    
  - name: memory_pressure
    condition: memory_usage > 85%
    duration: 3m
    action: auto_scale
```

---

## 6. TROUBLESHOOTING GUIDE

### Common Issues & Solutions

#### Issue: High Memory Usage
```bash
# Diagnose
npm run memory:analyze

# Quick fix
npm run cache:clear:partial
systemctl restart astraldraft-worker

# Long-term fix
npm run memory:optimize
```

#### Issue: Slow Database Queries
```bash
# Identify slow queries
npm run db:slow:queries

# Add missing indexes
npm run db:index:analyze
npm run db:index:create

# Optimize connection pool
npm run db:pool:optimize
```

#### Issue: WebSocket Connection Drops
```bash
# Check connection status
npm run websocket:status

# Reset connections
npm run websocket:reset

# Increase connection limits
npm run websocket:scale
```

#### Issue: Authentication Failures
```bash
# Check auth service
npm run auth:diagnose

# Clear session cache
npm run sessions:clear

# Regenerate JWT secrets
npm run secrets:rotate:jwt
```

---

## 7. COMMUNICATION PLAN

### Internal Communications
```
T-24h: Email deployment notification to all-team@
T-1h:  Slack reminder in #deployments
T-0:   Start war room call
T+30m: Post deployment status in #general
T+1h:  Send success report to stakeholders
```

### External Communications
```
T-24h: Banner on site about maintenance
T-1h:  Email to users about maintenance
T-0:   Maintenance page activated
T+30m: Site restored notification
T+24h: Post-mortem if issues occurred
```

### Escalation Path
```
Level 1: On-call Engineer (0-15 min)
Level 2: Team Lead (15-30 min)
Level 3: VP Engineering (30-60 min)
Level 4: CTO (60+ min)
```

---

## 8. SUCCESS METRICS

### Deployment Success Criteria
- [ ] All services healthy
- [ ] Error rate < 0.1%
- [ ] Response time < 200ms
- [ ] All critical paths functional
- [ ] No data loss
- [ ] No security incidents

### Post-Deployment Metrics (24 hours)
```bash
# Generate deployment report
npm run report:deployment -- --start=$(date -d '24 hours ago' +%s)

# Metrics to track:
# - Total requests handled
# - Error count and rate
# - Average response time
# - Peak concurrent users
# - Resource utilization
# - User feedback score
```

---

## 9. QUICK DEPLOY OPTIONS

### Option A: Netlify (Recommended for Static)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify deploy --prod --dir=dist
```

### Option B: Docker Deployment
```bash
# Build Docker image
docker build -t astraldraft:v2.0.0 .

# Run container
docker run -d -p 3000:3000 \
  --env-file .env.production \
  --name astraldraft \
  astraldraft:v2.0.0
```

### Option C: Kubernetes Deployment
```bash
# Apply deployment
kubectl apply -f k8s/deployment.yaml

# Check rollout status
kubectl rollout status deployment/astraldraft

# Verify pods
kubectl get pods -l app=astraldraft
```

---

## 10. PERFORMANCE ACHIEVEMENTS

### Bundle Optimization Results
- **Main Bundle:** 257 KB (75% reduction)
- **Load Time:** 1.8s (57% improvement)
- **Code Splitting:** 15 lazy-loaded chunks
- **Compression:** Brotli enabled

### Security Hardening
- **API Keys:** All rotated and secured
- **Authentication:** httpOnly cookies
- **Headers:** CSP Level 2 compliant
- **Rate Limiting:** 100 req/min

### Accessibility Compliance
- **WCAG Score:** 87/100
- **Screen Reader:** Fully compatible
- **Keyboard Nav:** Complete
- **Color Contrast:** 4.5:1+ achieved

---

**Document End**  
**Version:** 2.0.0-PRODUCTION  
**Next Review:** 2025-10-01  
**Owner:** Platform Engineering Team