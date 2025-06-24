# Security Implementation - Product Backlog Estimator

## Rate Limiting Protection

The application implements comprehensive rate limiting to protect against API abuse and database attacks.

### Security Measures

#### 1. Daily Request Limits
- **General API Requests**: Maximum 20 requests per day per IP address
- **Write Operations**: Maximum 10 create/update/delete operations per day per IP address
- **Burst Protection**: Maximum 5 requests per minute to prevent rapid-fire attacks

#### 2. Progressive Slowdown
- After 5 requests per hour, response times increase exponentially
- Maximum delay capped at 10 seconds
- Automatic reset after time window expires

#### 3. Multi-Layer Protection

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Burst Protection│────│ Speed Limiter   │────│ Daily Limits    │
│ 5 req/minute    │    │ Progressive     │    │ 20 req/day      │
│                 │    │ Slowdown        │    │ 10 writes/day   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Implementation Details

#### Express Server Rate Limiting
```javascript
// Applied to all Express routes
app.use(burstProtection);     // 5 requests/minute
app.use(speedLimiter);        // Progressive delays
app.use(dailyRateLimit);      // 20 requests/day

// Write operations have stricter limits
app.post("/api/requests", writeOperationsLimit, handler);
app.put("/api/requests/:id", writeOperationsLimit, handler);
app.delete("/api/requests/:id", writeOperationsLimit, handler);
```

#### Serverless Function Protection
```javascript
// IP-based tracking with memory storage
function checkRateLimit(ip, maxRequests = 20, windowMs = 24 * 60 * 60 * 1000)
function checkWriteRateLimit(ip) // 10 requests/day for writes

// Applied before database operations
const rateLimitResult = checkRateLimit(ip);
const writeRateLimit = checkWriteRateLimit(ip);
```

### Error Responses

#### Rate Limit Exceeded (429)
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests from this IP address. Maximum 20 requests allowed per day.",
  "resetTime": "2025-06-24T18:30:00.000Z"
}
```

#### Write Operations Limited (429)
```json
{
  "error": "Write operation rate limit exceeded", 
  "message": "Too many write operations from this IP address. Maximum 10 create/update/delete operations allowed per day.",
  "resetTime": "2025-06-24T18:30:00.000Z"
}
```

### HTTP Headers

Rate limit information is provided in response headers:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Timestamp when limit resets

### IP Detection

The system properly identifies client IP addresses in various deployment scenarios:
- Direct connections: `req.socket.remoteAddress`
- Proxy/Load Balancer: `x-forwarded-for` header
- Express trust proxy configuration enabled

### Database Protection

Rate limiting prevents:
- SQL injection attempts through rapid requests
- Database overload from automated attacks
- Resource exhaustion from malicious users
- Abuse of write operations that could corrupt data

### Monitoring & Alerting

All rate limit violations are logged with:
- Client IP address
- Request timestamp
- Request type (read/write)
- Limit type exceeded

### Configuration

Rate limits can be adjusted by modifying:
- `server/middleware/rateLimiter.ts` for Express server
- Rate limiting functions in `api/index.js` for serverless deployment

### Security Best Practices

1. **Layered Defense**: Multiple rate limiting tiers
2. **Graceful Degradation**: Progressive slowdown before hard limits
3. **Clear Communication**: Informative error messages with reset times
4. **Monitoring**: Request logging for security analysis
5. **Flexible Configuration**: Adjustable limits for different deployment scenarios

This implementation ensures the application remains available to legitimate users while protecting against malicious attacks and database abuse.