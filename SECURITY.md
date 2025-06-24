# Security Implementation - Product Backlog Estimator

## Rate Limiting Protection

The application implements focused rate limiting to protect against database abuse while allowing normal usage.

### Security Measures

#### Write Operations Limit
- **Write Operations Only**: Maximum 30 create/update/delete operations per day per IP address
- **Read Operations**: Unlimited (GET requests for viewing data)
- **24-Hour Reset**: Counter resets every 24 hours from first write operation

#### Focused Protection

```
┌─────────────────────────────────────────────────────────────┐
│                    Write Operations Only                   │
│                  30 requests per day                       │
│            POST | PUT | DELETE | PATCH                     │
└─────────────────────────────────────────────────────────────┘
```

### Implementation Details

#### Express Server Rate Limiting
```javascript
// Only write operations are limited
app.post("/api/requests", writeOperationsLimit, handler);
app.put("/api/requests/:id", writeOperationsLimit, handler);
app.delete("/api/requests/:id", writeOperationsLimit, handler);

// GET requests are unlimited
app.get("/api/requests", handler); // No rate limiting
```

#### Serverless Function Protection
```javascript
// Write operations rate limiting - 30 per day
function checkWriteRateLimit(ip, maxRequests = 30, windowMs = 24 * 60 * 60 * 1000)

// Applied only to POST requests in serverless functions
if (req.method === 'POST') {
  const writeRateLimit = checkWriteRateLimit(ip);
  // Check limit before database operations
}
```

### Error Responses

#### Write Operations Limited (429)
```json
{
  "error": "Write operation rate limit exceeded", 
  "message": "Too many write operations from this IP address. Maximum 30 create/update/delete operations allowed per day.",
  "resetTime": "2025-06-24T18:30:00.000Z"
}
```

### HTTP Headers

Rate limit information is provided in response headers for write operations:
- `X-RateLimit-Limit`: 30 (Maximum write operations allowed)
- `X-RateLimit-Remaining`: Remaining write operations in current window
- `X-RateLimit-Reset`: Timestamp when limit resets

### IP Detection

The system properly identifies client IP addresses in various deployment scenarios:
- Direct connections: `req.socket.remoteAddress`
- Proxy/Load Balancer: `x-forwarded-for` header
- Express trust proxy configuration enabled

### Database Protection

Write operations rate limiting prevents:
- Database corruption from excessive write operations
- Resource exhaustion from automated create/update/delete attacks
- Malicious bulk data insertion or modification
- System overload from write-heavy abuse patterns

Read operations remain unlimited to allow normal browsing and data viewing.

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

1. **Focused Protection**: Rate limiting only where needed (write operations)
2. **User-Friendly**: Unlimited read access for normal app usage
3. **Clear Communication**: Informative error messages with reset times
4. **Monitoring**: Write operation logging for security analysis
5. **Flexible Configuration**: Adjustable limits for different deployment scenarios

This implementation ensures the application remains highly available for legitimate users while protecting against database write abuse.