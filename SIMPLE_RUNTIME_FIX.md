# Simplified Runtime Configuration

## Applied Fix
- Changed to `@vercel/node` (default latest version)
- This uses Vercel's recommended Node.js runtime automatically

## Deploy Now
```bash
git add vercel.json
git commit -m "Use default Vercel Node runtime"
git push origin main
```

This should resolve the runtime version validation issues.