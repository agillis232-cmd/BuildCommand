# BuildCommand AI Proxy (server)

This small Express proxy forwards requests from the app to the Google Generative Language API so the API key stays on the server.

Local development

1. Copy the example env file and add your Google API key:

```bash
cd server
cp .env.example .env
# edit .env and set GOOGLE_API_KEY
npm install
npm start
```

2. Run the Expo app from the project root and open the `AI Studio` tab.

Notes for devices

- Android emulator: the app will default to `http://10.0.2.2:3000` when `SERVER_URL` isn't set in `app.json` extras.
- Physical devices: replace `extra.SERVER_URL` in `app.json` with `http://<your-machine-ip>:3000`.

Deployment (Vercel example)

You can deploy this `server/` folder to Vercel. Create a Vercel project (from GitHub) or use the GitHub Action below. Store the Google API key in GitHub Secrets as `GOOGLE_API_KEY`.

GitHub Actions example (see .github/workflows/deploy-server.yml):

- Add repository secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `GOOGLE_API_KEY`.
- The workflow deploys the repository and Vercel will provide a production URL. After deploy, set `extra.SERVER_URL` in `app.json` to your Vercel deployment URL (for builds) or configure EAS build-time environment.

Security

- Never commit `.env` with secrets. Keep `GOOGLE_API_KEY` in GitHub Secrets or a dedicated secret manager.
- For production, consider adding rate limiting and request validation on the proxy.
