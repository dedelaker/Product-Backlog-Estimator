# Quick Deployment Commands

## Push Changes to GitHub
Run these commands in your terminal:

```bash
git add .
git commit -m "Fix Vercel deployment: Update serverless function configuration"
git push origin main
```

## Vercel Deployment Will Automatically Start
After pushing, Vercel will automatically detect the changes and redeploy.

## Set Environment Variable
Once deployed, add your database connection:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `DATABASE_URL` = `your_postgresql_connection_string`
3. Redeploy if needed

## Expected Result
Your app will be live at: `https://product-backlog-estimator.vercel.app`

The deployment should succeed now because I've:
- Removed the problematic runtime configuration from vercel.json
- Fixed the serverless function structure in api/hello.js
- Ensured proper CommonJS module exports for Vercel compatibility