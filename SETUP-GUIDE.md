# 🛠️ LCARS Console - Complete Setup Guide

This guide will walk you through setting up the LCARS AI Console from scratch, including all optional API integrations.

## 📋 Table of Contents

1. [Basic Setup (No API Keys)](#basic-setup)
2. [Claude AI Setup](#claude-ai-setup)
3. [TomTom Maps Setup](#tomtom-maps-setup)
4. [Alternative API Setup](#alternative-api-setup)
5. [Database Setup (Optional)](#database-setup)
6. [GitHub Integration](#github-integration)
7. [Troubleshooting](#troubleshooting)

---

## Basic Setup

The LCARS Console works **immediately** with free APIs - no configuration required!

### Step 1: Install Node.js

Download and install Node.js 18 or higher:
- Visit [nodejs.org](https://nodejs.org/)
- Download LTS version
- Run installer

Verify installation:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### Step 2: Get the Code

**Option A: Clone from GitHub**
```bash
git clone https://github.com/yourusername/lcars-console.git
cd lcars-console
```

**Option B: Download ZIP**
1. Download ZIP from GitHub
2. Extract to a folder
3. Open terminal in that folder

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages. It may take a few minutes.

### Step 4: Create Environment File

```bash
cp .env.example .env
```

**Note**: The application works without editing `.env` - it's only needed for premium features.

### Step 5: Start the Application

```bash
npm run dev
```

You should see:
```
🚀 Server started on port 5000
✅ All systems online
```

### Step 6: Open in Browser

Navigate to: `http://localhost:5000`

**Congratulations!** 🎉 Your LCARS Console is now running with:
- ✅ Weather (Open-Meteo)
- ✅ NASA APOD
- ✅ ISS Tracker
- ✅ Task Management
- ✅ Calendar
- ✅ Analytics
- ✅ Terminal

---

## Claude AI Setup

Add Claude AI for enhanced natural language conversations.

### Step 1: Create Anthropic Account

1. Visit [console.anthropic.com](https://console.anthropic.com/)
2. Click "Sign Up"
3. Verify your email
4. Complete account setup

### Step 2: Generate API Key

1. Go to API Keys section
2. Click "Create Key"
3. Give it a name (e.g., "LCARS Console")
4. Copy the key (it starts with `sk-ant-...`)
5. **Save it securely** - you won't see it again!

### Step 3: Add to Environment

Open `.env` file and add:
```
ANTHROPIC_API_KEY=sk-ant-your_actual_key_here
```

**Security Warning**: Never commit `.env` to version control!

### Step 4: Restart Application

```bash
# Press Ctrl+C to stop
npm run dev  # Start again
```

### Step 5: Test AI Chat

1. Navigate to AI Chat panel
2. Type a message
3. You should get Claude's response!

**Cost**: ~$0.003 per 1K input tokens (very affordable for personal use)

---

## TomTom Maps Setup

Add TomTom Maps for route calculation and travel planning.

### Step 1: Create TomTom Account

1. Visit [developer.tomtom.com](https://developer.tomtom.com/)
2. Click "Get Started Free"
3. Complete registration
4. Verify email

### Step 2: Create App and Get API Key

1. Go to Dashboard
2. Click "Add a new app"
3. Name it "LCARS Console"
4. Copy the API Key

### Step 3: Add to Environment

Open `.env` file and add:
```
TOMTOM_API_KEY=your_actual_key_here
```

### Step 4: Restart Application

```bash
# Press Ctrl+C to stop
npm run dev  # Start again
```

### Step 5: Test Travel Calculator

1. Navigate to Travel panel
2. Enter origin and destination
3. Click "Calculate Route"
4. You should see distance and duration!

**Free Tier**: 2,500 requests per day

---

## Alternative API Setup

### Using OpenAI Instead of Claude

1. **Get API Key**:
   - Visit [platform.openai.com](https://platform.openai.com/)
   - Create account and get API key

2. **Install OpenAI SDK**:
   ```bash
   npm install openai
   ```

3. **Update `.env`**:
   ```
   OPENAI_API_KEY=your_key_here
   AI_PROVIDER=openai
   ```

4. **Update `server/services/ai.ts`**:
   ```typescript
   import OpenAI from "openai";

   const provider = process.env.AI_PROVIDER || 'anthropic';
   
   if (provider === 'openai') {
     const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
     const response = await openai.chat.completions.create({
       model: "gpt-4",
       messages: [{ role: "user", content: message }],
     });
     return response.choices[0].message.content;
   }
   ```

### Using Google Gemini (Free Tier!)

1. **Get API Key**:
   - Visit [ai.google.dev](https://ai.google.dev/)
   - Click "Get API key in Google AI Studio"

2. **Install Gemini SDK**:
   ```bash
   npm install @google/generative-ai
   ```

3. **Update `.env`**:
   ```
   GEMINI_API_KEY=your_key_here
   AI_PROVIDER=gemini
   ```

4. **Update `server/services/ai.ts`**:
   ```typescript
   import { GoogleGenerativeAI } from "@google/generative-ai";

   if (provider === 'gemini') {
     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
     const result = await model.generateContent(message);
     return result.response.text();
   }
   ```

### Using Local AI (Ollama - FREE!)

1. **Install Ollama**:
   - Visit [ollama.com](https://ollama.com/)
   - Download for your OS
   - Install

2. **Download a Model**:
   ```bash
   ollama pull llama2
   ```

3. **Start Ollama Server**:
   ```bash
   ollama serve
   ```

4. **Update `.env`**:
   ```
   AI_PROVIDER=ollama
   OLLAMA_URL=http://localhost:11434
   ```

5. **Update `server/services/ai.ts`**:
   ```typescript
   if (provider === 'ollama') {
     const response = await fetch(`${process.env.OLLAMA_URL}/api/generate`, {
       method: 'POST',
       body: JSON.stringify({
         model: 'llama2',
         prompt: message,
       }),
     });
     const data = await response.json();
     return data.response;
   }
   ```

**Benefits**: Completely free, private, no rate limits!

### Using Google Maps Instead of TomTom

1. **Get API Key**:
   - Visit [console.cloud.google.com](https://console.cloud.google.com/)
   - Enable Maps Platform APIs
   - Create credentials

2. **Install Google Maps SDK**:
   ```bash
   npm install @googlemaps/google-maps-services-js
   ```

3. **Update `.env`**:
   ```
   GOOGLE_MAPS_API_KEY=your_key_here
   MAPS_PROVIDER=google
   ```

4. **Update `server/services/maps.ts`** - see API-ALTERNATIVES.md for code

**Free Credit**: $200 monthly

---

## Database Setup (Optional)

By default, the app uses in-memory storage. To persist data across restarts:

### Option 1: Local PostgreSQL

1. **Install PostgreSQL**:
   - macOS: `brew install postgresql`
   - Windows: Download from postgresql.org
   - Linux: `sudo apt-get install postgresql`

2. **Create Database**:
   ```bash
   createdb lcars_console
   ```

3. **Update `.env`**:
   ```
   DATABASE_URL=postgresql://localhost/lcars_console
   ```

4. **Push Schema**:
   ```bash
   npm run db:push
   ```

### Option 2: Neon (Free Cloud PostgreSQL)

1. Visit [neon.tech](https://neon.tech/)
2. Create free account
3. Create new project
4. Copy connection string
5. Add to `.env`:
   ```
   DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
   ```

---

## GitHub Integration

### Push to Your GitHub

1. **Create Repository on GitHub**:
   - Go to github.com
   - Click "New repository"
   - Name it "lcars-console"
   - Do NOT initialize with README

2. **Initialize Local Git**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: LCARS Console v4.0"
   ```

3. **Connect to GitHub**:
   ```bash
   git remote add origin https://github.com/yourusername/lcars-console.git
   git branch -M main
   git push -u origin main
   ```

### Automated Deployments

For CI/CD with GitHub Actions, add:

**.github/workflows/deploy.yml**:
```yaml
name: Deploy LCARS Console

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy to Replit
        run: |
          # Add your deployment commands here
```

---

## Troubleshooting

### Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or use different port
PORT=3000 npm run dev
```

### Module Not Found Errors

**Error**: `Error: Cannot find module...`

**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### API Key Not Working

**Symptoms**: Features show "API not configured" even with key added

**Checklist**:
- [ ] Copied key correctly (no extra spaces)
- [ ] Restarted application after adding key
- [ ] Key is in `.env` file (not `.env.example`)
- [ ] `.env` is in project root directory
- [ ] Key has correct format (starts with expected prefix)

### Weather Not Loading

**Possible Causes**:
1. Internet connection issue
2. Open-Meteo API temporarily down
3. Invalid city name

**Solution**:
- Try different city: "London", "Tokyo", "Paris"
- Check internet connection
- Wait a few minutes and try again

### Database Connection Errors

**Error**: `Error: connect ECONNREFUSED`

**Solution**:
1. Make sure PostgreSQL is running
2. Check DATABASE_URL format
3. Verify database exists
4. Check credentials

### Build Errors

**Error**: TypeScript compilation errors

**Solution**:
```bash
# Clear TypeScript cache
rm -rf client/src/.next
rm -rf dist

# Rebuild
npm run build
```

---

## Advanced Configuration

### Custom Port

Add to `.env`:
```
PORT=3000
```

### Enable Debug Logging

Add to `.env`:
```
DEBUG=true
LOG_LEVEL=debug
```

### Custom Session Secret

Generate secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env`:
```
SESSION_SECRET=your_generated_secret_here
```

---

## Security Best Practices

1. **Never Commit Secrets**:
   - Add `.env` to `.gitignore`
   - Use `.env.example` for templates
   - Rotate keys periodically

2. **Restrict API Keys**:
   - Limit keys to specific domains
   - Set usage quotas
   - Monitor for unusual activity

3. **Use HTTPS in Production**:
   - Get SSL certificate (Let's Encrypt)
   - Configure reverse proxy
   - Force HTTPS redirects

4. **Regular Updates**:
   ```bash
   npm outdated  # Check for updates
   npm update    # Update packages
   ```

---

## Getting Help

- **Documentation**: Read API-ALTERNATIVES.md for API details
- **Issues**: Check existing GitHub issues
- **Community**: Star Trek LCARS communities
- **Support**: Open an issue on GitHub

---

**Remember**: The app works great with just free APIs! Paid features are optional upgrades.

**Live Long and Prosper!** 🖖
