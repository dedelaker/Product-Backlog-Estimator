# Node.js 18 Runtime Configuration

## Updated Configuration
- Changed runtime to `nodejs18.x` for Vercel compatibility
- This matches Vercel's current Node.js 18 requirement

## Deploy Commands
```bash
git add vercel.json
git commit -m "Use Node.js 18 runtime for Vercel deployment"
git push origin main
```

The deployment should now succeed with Node.js 18 compatibility.