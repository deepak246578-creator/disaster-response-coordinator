# Deployment Status

## Summary
The DRC-AI Disaster Coordinator project has deployment configuration **but is not currently actively deployed**.

## Evidence

### ✅ Deployment Configuration Present
- `vercel.json` - Configured for Vercel with Vite framework
  ```json
  {
    "version": 2,
    "framework": "vite",
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
  }
  ```
- Git remote: `https://github.com/deepak246578-creator/disaster-coordinator.git`
- Package.json scripts: `build`, `preview`, `dev`, `server`

### ✅ Build Artifacts Exist
- `dist/index.html` and `dist/assets/` - Built from `npm run build`

### ❌ No Active Deployment
- No live URL found in the project
- No deployment workflows (.github/workflows)
- No environment variables configured for live deployment (`.env.example` has only `PORT=5000` and optional `GEMINI_API_KEY`)
- `dist/` folder likely from local build, not necessarily deployed to Vercel

## Project Structure
- **Frontend**: React + Vite (src/App.jsx, src/main.jsx, etc.)
- **Backend**: Node/Express (server/index.js) with Socket.IO for real-time features
- **AI**: Gemini LLM integration (optional, falls back to heuristic engine)

## To Deploy
1. Push to GitHub (already configured)
2. Connect repo to Vercel, or run `vercel` CLI
3. Set `GEMINI_API_KEY` in Vercel environment variables (optional for live LLM)
4. The `vercel.json` config will handle: Vite build → serve `dist/` → client-side routing rewrites