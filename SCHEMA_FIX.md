# Database Schema Fix Applied

## Issue Resolved
- Fixed data type mismatch: `score` field was incorrectly defined as `serial` instead of `integer`
- Added missing `integer` import to API schema
- Table name `backlog_requests` is correct in both Neon and application code

## Deploy Fix
```bash
git add .
git commit -m "Fix database schema - correct score field data type from serial to integer"
git push origin main
```

After pushing, redeploy in Vercel and your application will connect properly to the Neon database.