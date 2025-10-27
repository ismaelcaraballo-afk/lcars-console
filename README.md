# 🖖 LCARS AI Console

A production-ready **Star Trek LCARS-themed productivity dashboard** built with React, TypeScript, and Express. Features AI chat, task management, weather tracking, space exploration, and more — all with the iconic LCARS aesthetic.

![LCARS Console](https://img.shields.io/badge/Star%20Trek-LCARS-9966ff?style=for-the-badge)
![Version](https://img.shields.io/badge/version-4.0-ff99cc?style=for-the-badge)
![Status](https://img.shields.io/badge/systems-online-00ff00?style=for-the-badge)

## ✨ Features

### 🚀 Core Functionality
- **Dashboard**: System overview with real-time stats and LCARS scanning effects
- **Task Manager**: Full CRUD task management with priorities and due dates
- **Weather Center**: 7-day forecast powered by Open-Meteo (free forever!)
- **Calendar**: Event scheduling and management
- **Analytics**: Productivity tracking with visual charts
- **Space Exploration**: NASA APOD + Real-time ISS tracker
- **Travel Calculator**: Route planning (TomTom Maps integration ready)
- **Terminal/CLI**: Star Trek-inspired command-line interface
- **AI Chat**: Natural language interface (Claude AI integration ready)
- **Notifications**: Real-time system notifications
- **Settings**: Customizable preferences

### 🎨 LCARS Design
- Authentic Star Trek LCARS color scheme (purple/pink gradients)
- Scanning animations and glowing effects
- LCARS sound effects (beeps and tones)
- Responsive design for all devices
- Starfield background
- Smooth panel transitions

### 🔌 API Integrations

#### ✅ Active (No API Keys Required)
- **Weather**: Open-Meteo
- **Space**: NASA APOD
- **ISS Tracking**: Open Notify
- **Geolocation**: IP API

#### 🔓 Ready to Activate (Add API Keys)
- **AI Chat**: Claude (Anthropic) - Primary option
- **Maps**: TomTom - Primary option

See [API-ALTERNATIVES.md](./API-ALTERNATIVES.md) for alternative providers (OpenAI, Google Maps, Mapbox, etc.)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/lcars-console.git
   cd lcars-console
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment** (optional for free features):
   ```bash
   cp .env.example .env
   # Edit .env to add API keys for Claude AI and TomTom Maps
   ```

4. **Start the application**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:5000`

That's it! The console works out of the box with free APIs. Add paid API keys later to unlock Claude AI and Maps features.

## 📋 Detailed Setup

See [SETUP-GUIDE.md](./SETUP-GUIDE.md) for:
- Step-by-step API key setup
- Alternative API providers
- Troubleshooting
- Advanced configuration

## 🔑 API Keys (Optional)

The application works **immediately** with free APIs. To unlock premium features:

### Claude AI (for enhanced AI chat)
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create account and generate API key
3. Add to `.env`: `ANTHROPIC_API_KEY=your_key_here`
4. Restart application

### TomTom Maps (for route calculation)
1. Visit [TomTom Developer Portal](https://developer.tomtom.com/)
2. Create account and get API key
3. Add to `.env`: `TOMTOM_API_KEY=your_key_here`
4. Restart application

**Don't want to pay?** See [API-ALTERNATIVES.md](./API-ALTERNATIVES.md) for free alternatives like:
- **AI**: Ollama (local), Google Gemini (free tier)
- **Maps**: OpenStreetMap (free), Mapbox (100K requests/month free)

## 🏗️ Architecture

```
lcars-console/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # All LCARS panels (Dashboard, Tasks, etc.)
│   │   ├── components/    # Reusable components + AppSidebar
│   │   └── lib/           # Query client, utilities
├── server/                # Express backend
│   ├── services/          # API service modules
│   │   ├── weather.ts    # Open-Meteo integration
│   │   ├── nasa.ts       # NASA APOD integration
│   │   ├── iss.ts        # ISS tracker integration
│   │   ├── ai.ts         # Claude AI integration (ready)
│   │   └── maps.ts       # TomTom Maps integration (ready)
│   ├── routes.ts          # API endpoints
│   └── storage.ts         # In-memory data storage
├── shared/                # Shared types and schemas
│   └── schema.ts          # Drizzle ORM schemas
└── attached_assets/       # Original HTML file (archived)
```

## 🎯 Technology Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Express, Node.js
- **Data**: In-memory storage (easily upgradeable to PostgreSQL)
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Form Validation**: React Hook Form + Zod
- **UI Components**: Radix UI primitives
- **Animations**: CSS animations + Framer Motion

## 📱 Features Breakdown

### Dashboard
- Real-time system status
- Quick stats (tasks, productivity, weather, events)
- Quick action buttons
- LCARS scanning effects

### Task Manager
- Create, complete, delete tasks
- Priority levels (low, medium, high)
- Due date tracking
- Urgency indicators

### Weather Center
- Current conditions for any city
- 7-day forecast
- Temperature, humidity, wind speed
- Real-time updates

### Space Exploration
- NASA Astronomy Picture of the Day
- Real-time ISS location tracking
- Space facts and information

### AI Chat
- Natural language processing
- Sentiment analysis
- Context-aware responses
- Quick question buttons
- Ready for Claude AI upgrade

### Terminal/CLI
- Star Trek command interface
- 30+ built-in commands
- Command history (arrow keys)
- System diagnostics

### Travel Calculator
- Route planning between any two locations
- Distance and duration estimates
- Multiple travel modes (driving, walking, transit)
- Ready for TomTom Maps activation

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:push` - Push database schema (if using PostgreSQL)

### Environment Variables

See `.env.example` for all available configuration options.

## 🚢 Deployment

### Deploy to Replit
1. Import this repository to Replit
2. Add environment variables in Secrets
3. Click "Run"
4. Use Replit's built-in deployment

### Deploy Elsewhere
1. Build the application: `npm run build`
2. Set environment variables
3. Start: `npm start`
4. Configure reverse proxy (nginx, etc.)

## 📚 Documentation

- **[API-ALTERNATIVES.md](./API-ALTERNATIVES.md)** - Comprehensive guide to API providers and alternatives
- **[SETUP-GUIDE.md](./SETUP-GUIDE.md)** - Step-by-step setup instructions
- **[design_guidelines.md](./design_guidelines.md)** - LCARS design system specifications

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome! 

## 📄 License

MIT License - feel free to use this project for learning or building your own LCARS interface.

## 🖖 Acknowledgments

- Star Trek and LCARS design © Paramount Pictures
- Weather data from Open-Meteo
- Space data from NASA and Open Notify
- Icons from Lucide React

## 🆘 Troubleshooting

### Application won't start
- Check Node.js version (18+ required)
- Delete `node_modules` and run `npm install` again
- Check console for error messages

### Weather not loading
- Check internet connection
- Open-Meteo might be temporarily unavailable
- Try a different city name

### AI chat shows "not configured"
- This is normal if you haven't added ANTHROPIC_API_KEY
- The app works with basic NLP without Claude
- See SETUP-GUIDE.md to add Claude AI

### Maps not working
- This is normal if you haven't added TOMTOM_API_KEY
- See API-ALTERNATIVES.md for free alternatives
- Check SETUP-GUIDE.md for configuration help

## 📞 Support

- Check SETUP-GUIDE.md for configuration help
- Review API-ALTERNATIVES.md for API options
- Open an issue for bugs or questions

---

**Live Long and Prosper!** 🖖

*LCARS Console v4.0 - All systems operational*
