# API Alternatives & Setup Guide

This document provides comprehensive information about API alternatives for the LCARS Console and step-by-step setup instructions.

## 🤖 AI / Language Models

### Primary: Claude AI (Anthropic)

**Status**: ✅ Integrated (ready for API key)

**Setup**:
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create an account and generate an API key
3. Add to `.env`: `ANTHROPIC_API_KEY=your_key_here`
4. Restart the application

**Pricing**: Pay-as-you-go, $0.003/1K input tokens, $0.015/1K output tokens for Claude 3.5 Sonnet

**Features**:
- State-of-the-art language understanding
- Long context window (200K tokens)
- Fast response times
- Strong reasoning capabilities

---

### Alternative 1: OpenAI GPT

**Models**: GPT-4, GPT-4 Turbo, GPT-3.5 Turbo

**Setup**:
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create API key
3. Install: `npm install openai`
4. Update `server/services/ai.ts` to use OpenAI SDK

**Pricing**: 
- GPT-4 Turbo: $0.01/1K input, $0.03/1K output tokens
- GPT-3.5 Turbo: $0.0005/1K input, $0.0015/1K output tokens

**Code Example**:
```typescript
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  messages: [{ role: "user", content: message }],
});
```

---

### Alternative 2: Google Gemini

**Models**: Gemini Pro, Gemini Pro Vision

**Setup**:
1. Visit [Google AI Studio](https://ai.google.dev/)
2. Get API key
3. Install: `npm install @google/generative-ai`
4. Update `server/services/ai.ts`

**Pricing**: 
- Free tier: 60 requests/minute
- Paid: $0.00025/1K input, $0.0005/1K output tokens

**Code Example**:
```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const result = await model.generateContent(message);
```

---

### Alternative 3: Perplexity AI

**Models**: pplx-7b-online, pplx-70b-online, pplx-7b-chat, pplx-70b-chat

**Setup**:
1. Visit [Perplexity AI](https://www.perplexity.ai/)
2. Sign up for API access
3. Use OpenAI-compatible endpoint

**Pricing**: Contact for pricing

**Features**:
- Real-time web search integration
- Citation-backed responses
- Multiple model sizes

---

### Alternative 4: Local LLMs (Free!)

**Options**: Ollama, LM Studio, llama.cpp

**Setup (Ollama)**:
1. Install Ollama from [ollama.com](https://ollama.com/)
2. Download model: `ollama pull llama2`
3. Run local server: `ollama serve`
4. Update code to use local endpoint

**Pricing**: FREE (runs on your hardware)

**Code Example**:
```typescript
const response = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  body: JSON.stringify({
    model: "llama2",
    prompt: message,
  }),
});
```

**Pros**:
- Completely free
- No rate limits
- Privacy (data stays local)
- No internet required

**Cons**:
- Requires decent hardware (GPU recommended)
- Slower than cloud APIs
- Manual model management

---

## 🗺️ Maps & Routing

### Primary: TomTom Maps

**Status**: ✅ Integrated (ready for API key)

**Setup**:
1. Visit [TomTom Developer Portal](https://developer.tomtom.com/)
2. Create account and get API key
3. Add to `.env`: `TOMTOM_API_KEY=your_key_here`
4. Restart application

**Pricing**: 
- Free tier: 2,500 transactions/day
- Pay-as-you-go: $0.0042 per transaction

**Features**:
- Real-time traffic data
- Route optimization
- Geocoding
- Places search

---

### Alternative 1: Google Maps Platform

**APIs**: Directions API, Geocoding API, Places API, Maps JavaScript API

**Setup**:
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps Platform APIs
3. Create API key with restrictions
4. Install: `npm install @googlemaps/google-maps-services-js`

**Pricing**:
- $200 free credit monthly
- Directions API: $5/1000 requests
- Geocoding API: $5/1000 requests

**Code Example**:
```typescript
import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

const response = await client.directions({
  params: {
    origin: originAddress,
    destination: destAddress,
    key: process.env.GOOGLE_MAPS_API_KEY,
  },
});
```

---

### Alternative 2: Mapbox

**APIs**: Directions API, Geocoding API, Navigation API, Static Images

**Setup**:
1. Visit [Mapbox](https://www.mapbox.com/)
2. Create account and get access token
3. Install: `npm install @mapbox/mapbox-sdk`

**Pricing**:
- Free tier: 100,000 requests/month
- Directions: $0.60/1000 requests

**Code Example**:
```typescript
import mbxDirections from "@mapbox/mapbox-sdk/services/directions";

const directionsClient = mbxDirections({ 
  accessToken: process.env.MAPBOX_TOKEN 
});

const response = await directionsClient.getDirections({
  profile: "driving",
  waypoints: [
    { coordinates: [lon1, lat1] },
    { coordinates: [lon2, lat2] },
  ],
}).send();
```

---

### Alternative 3: OpenStreetMap (Free!)

**APIs**: Nominatim (geocoding), OSRM (routing), Overpass (data)

**Setup**:
1. Use public instances or self-host
2. No API key required (rate limits apply)
3. Install: `npm install node-osrm`

**Pricing**: FREE

**Code Example (Nominatim)**:
```typescript
// Geocoding
const geoUrl = `https://nominatim.openstreetmap.org/search?q=${address}&format=json`;
const response = await fetch(geoUrl, {
  headers: { "User-Agent": "LCARS-Console/1.0" }
});

// Routing (OSRM)
const routeUrl = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}`;
const routeResponse = await fetch(routeUrl);
```

**Pros**:
- Completely free
- Community-driven
- No rate limits on self-hosted

**Cons**:
- Public instances have rate limits
- Self-hosting requires setup
- Less polish than commercial options

---

## 🌐 Other Free APIs Already Integrated

### Weather: Open-Meteo
- **Status**: ✅ Active
- **Website**: [open-meteo.com](https://open-meteo.com/)
- **Features**: 7-day forecast, current conditions, historical data
- **Limits**: None (unlimited free usage)

### Space: NASA APOD
- **Status**: ✅ Active (using DEMO_KEY)
- **Website**: [api.nasa.gov](https://api.nasa.gov/)
- **Features**: Astronomy picture of the day
- **Limits**: 30 requests/hour with DEMO_KEY, 1000/hour with free API key

### ISS Tracking: Open Notify
- **Status**: ✅ Active
- **Website**: [open-notify.org](http://open-notify.org/)
- **Features**: Real-time ISS location
- **Limits**: None (unlimited free usage)

### Location: IP API
- **Status**: ✅ Active
- **Website**: [ip-api.com](http://ip-api.com/)
- **Features**: IP geolocation
- **Limits**: 45 requests/minute (free tier)

---

## 🛠️ How to Switch APIs

### AI Provider Switch

1. **Update environment variable**:
   ```
   # .env
   AI_PROVIDER=openai  # or gemini, perplexity, ollama
   OPENAI_API_KEY=your_key_here
   ```

2. **Update `server/services/ai.ts`**:
   ```typescript
   const provider = process.env.AI_PROVIDER || 'anthropic';
   
   switch(provider) {
     case 'openai':
       return await chatWithOpenAI(message);
     case 'gemini':
       return await chatWithGemini(message);
     // ...
   }
   ```

### Maps Provider Switch

1. **Update environment variable**:
   ```
   # .env
   MAPS_PROVIDER=google  # or mapbox, osm
   GOOGLE_MAPS_API_KEY=your_key_here
   ```

2. **Update `server/services/maps.ts`**:
   ```typescript
   const provider = process.env.MAPS_PROVIDER || 'tomtom';
   
   switch(provider) {
     case 'google':
       return await calculateRouteGoogle(origin, destination);
     case 'mapbox':
       return await calculateRouteMapbox(origin, destination);
     // ...
   }
   ```

---

## 💰 Cost Optimization Tips

1. **Implement caching**: Cache API responses for frequently requested data
2. **Rate limiting**: Limit requests per user/session
3. **Use free tiers**: Stay within free tier limits when possible
4. **Monitoring**: Track API usage to avoid surprises
5. **Fallbacks**: Use free alternatives as fallbacks for paid APIs
6. **Local processing**: Process data locally when possible

---

## 🔐 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all secrets
3. **Restrict API keys** to specific domains/IPs
4. **Rotate keys** periodically
5. **Monitor usage** for unusual activity
6. **Use separate keys** for development and production

---

## 📚 Additional Resources

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Maps Platform Docs](https://developers.google.com/maps/documentation)
- [Mapbox Documentation](https://docs.mapbox.com/)
- [TomTom Developer Portal](https://developer.tomtom.com/documentation)

---

## 🆘 Troubleshooting

### "API key not configured" error
- Check `.env` file exists and contains the key
- Restart the application after adding keys
- Verify key format is correct

### Rate limit errors
- Implement exponential backoff
- Consider upgrading to paid tier
- Use caching to reduce requests

### CORS errors
- Ensure API keys are server-side only
- Check API provider CORS settings
- Use proxy if needed

---

*Last updated: January 2025*
