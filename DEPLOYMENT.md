# AI Studio Deployment Guide

## Overview

This project integrates Google AI Studio (Generative Language API) with a secure server proxy. The AI Studio screen allows users to generate text using a backend service that manages the API key securely.

## Architecture

- **Client**: Expo React Native app with AI Studio tab (`app/(tabs)/ai-studio.tsx`)
- **Server**: Express.js proxy (`server/index.js`) that forwards requests to Google Generative Language API
- **CI/CD**: GitHub Actions workflows to auto-deploy and update configuration

## Local Development

### 1. Set up the server

```bash
cd server
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
npm install
npm start
```

The server runs on `http://localhost:3000` by default (configurable via `PORT` env var).

### 2. Run the Expo app

```bash
# From project root
npm install
npm run start
```

Open the app in Expo Go or an emulator and navigate to the **AI Studio** tab.

- **Android emulator**: Automatically uses `http://10.0.2.2:3000`
- **iOS simulator**: Automatically uses `http://localhost:3000`
- **Physical device**: Update `extra.SERVER_URL` in `app.json` to `http://<your-machine-ip>:3000`

## Production Deployment

### GitHub Secrets Setup

Add the following secrets to your repository (Settings > Secrets and variables > Actions):

#### For Vercel deployment
- `VERCEL_TOKEN`: Personal access token from [Vercel settings](https://vercel.com/account/tokens)
- `VERCEL_ORG_ID`: Found in Vercel dashboard (Team Settings > General > ID)
- `VERCEL_PROJECT_ID`: Found in Vercel project Settings > General
- `GOOGLE_API_KEY`: Your Google Generative Language API key

#### For Render deployment
- `RENDER_API_KEY`: API key from [Render account](https://dashboard.render.com/user/account)
- `RENDER_SERVICE_ID`: Service ID from your Render service dashboard (visible in the URL or service details)
- `GOOGLE_API_KEY`: Your Google Generative Language API key

### Deployment Workflows

#### Vercel (`.github/workflows/deploy-server.yml`)

Triggered on push to `main` branch:
1. Installs dependencies
2. Deploys `server/` folder to Vercel
3. Fetches the deployment URL from Vercel API
4. Updates `app.json` with the new `SERVER_URL`
5. Commits and pushes the change back to the repo

**Setup**:
1. Create a Vercel account and project (or connect to GitHub)
2. Get your `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID`
3. Add them as GitHub Secrets
4. The workflow will deploy on every push to `main`

#### Render (`.github/workflows/deploy-server-render.yml`)

Triggered on push to `main` or `master` branch:
1. Installs dependencies
2. Deploys `server/` folder to Render
3. Fetches the service URL from Render API
4. Updates `app.json` with the new `SERVER_URL`
5. Commits and pushes the change back to the repo

**Setup**:
1. Create a Render account and service (or connect from GitHub)
2. Get your `RENDER_API_KEY` from account settings
3. Get your `RENDER_SERVICE_ID` (visible in service dashboard or URL)
4. Add them as GitHub Secrets
5. The workflow will deploy on every push to `main` or `master`

### Environment Variables

**For server**: Create `server/.env` with:
```
GOOGLE_API_KEY=your_key_here
PORT=3000
```

**For app builds**: `extra.SERVER_URL` in `app.json` is automatically updated by CI/CD after deployment.

## How It Works

1. **User enters a prompt** in the AI Studio screen
2. **Client sends request** to the configured `SERVER_URL`
3. **Server validates** the request and forwards it to Google's API
4. **API response** is returned to the client
5. **Result is displayed** in the app

## Security Notes

- **API Key**: Only stored on the server (never committed or exposed client-side)
- **CORS**: Server includes CORS headers; adjust as needed for your domain
- **Rate Limiting**: Consider adding rate limiting to the server endpoint in production
- **Validation**: Validate request parameters and implement request signing if needed

## Troubleshooting

### Server won't start
- Ensure Node.js 18+ is installed
- Check that `GOOGLE_API_KEY` is set in `.env`
- Verify port 3000 is not in use (or set `PORT` env var)

### App can't reach server
- Android emulator: Ensure you're using `http://10.0.2.2:3000` (handled automatically)
- Physical device: Update `app.json` `SERVER_URL` to your machine's IP address
- Check firewall rules on your machine

### Deployment fails
- Verify all GitHub Secrets are set correctly
- Check that the service project ID is correct
- Review GitHub Actions workflow run logs for detailed error messages

### `app.json` not updating after deploy
- Ensure `VERCEL_TOKEN` or `RENDER_API_KEY` has sufficient permissions
- Check the GitHub Actions workflow logs for API response errors
- The URL extraction may need adjustment if your provider returns a different response format

## Next Steps

- Test locally with `npm run start` (server) and `npm run android`/`npm run ios`
- Deploy to Vercel or Render by pushing to the configured branch
- Monitor the GitHub Actions workflow for successful deployment
- Update the app in your build pipeline to use the production `SERVER_URL`

## Files Added/Modified

- `app/(tabs)/ai-studio.tsx` - New AI Studio screen
- `app/(tabs)/_layout.tsx` - Added AI Studio tab
- `app.json` - Added `SERVER_URL` in extras
- `server/` - New Express.js proxy server
  - `index.js` - Main server code
  - `package.json` - Dependencies
  - `.env.example` - Example env file
  - `README.md` - Server documentation
- `.github/workflows/deploy-server.yml` - Vercel CI/CD
- `.github/workflows/deploy-server-render.yml` - Render CI/CD
- `scripts/update-appjson.js` - Helper to update app.json in CI
