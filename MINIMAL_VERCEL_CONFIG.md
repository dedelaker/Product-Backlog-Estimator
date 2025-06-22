# Minimal Vercel Configuration

## Removed Functions Configuration
- Eliminated runtime specification causing validation errors
- Vercel will auto-detect the serverless function from `/api/index.js`
- Default Node.js runtime will be used automatically

## Deploy Commands
```bash
git add vercel.json
git commit -m "Remove functions config, use auto-detection"
git push origin main
```

This minimal configuration should deploy successfully.