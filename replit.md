# LCARS AI Console

## Overview

The LCARS AI Console is a Star Trek-themed productivity dashboard that combines task management, weather tracking, space exploration, and AI chat capabilities in an authentic LCARS (Library Computer Access/Retrieval System) interface. Built as a full-stack TypeScript application, it features both free and premium API integrations, persistent data storage, and a responsive design that works across all devices.

The application emphasizes a "works out of the box" philosophy - core features like weather, space data, and ISS tracking use free APIs with no configuration required, while advanced features (AI chat, maps) are ready to activate with API keys.

**Key Features:**
- **Voice Control with Text-to-Speech**: Star Trek-style voice commands starting with "Computer" - the system speaks back to confirm actions, navigate panels, create tasks, and answer questions using AI integration
- **Multi-Panel Split View**: Request multiple panels simultaneously via voice (e.g., "Computer show me weather and tasks") for side-by-side comparison
- **AI-Powered Assistance**: Natural language processing for questions and commands, with Claude AI integration for advanced responses

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite for fast development and optimized production builds.

**State Management**: React Query (TanStack Query) handles all server state, API calls, and caching. Local component state uses React hooks (useState, useEffect). No global state management library needed due to React Query's built-in capabilities.

**Routing**: Wouter provides lightweight client-side routing without the overhead of React Router.

**UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling. Custom LCARS theme implemented through CSS custom properties and Tailwind configuration.

**Design System**: 
- LCARS color palette (purple/pink gradients) defined in CSS variables
- Custom animations (scanning effects, glowing borders, pulse effects)
- Responsive grid layouts using Tailwind
- Accessibility-first with WCAG 2.1 compliance
- Dark theme optimized for space/sci-fi aesthetic

**Key Design Decisions**:
- Single-page application with client-side routing for instant navigation
- Component-based architecture with shadcn/ui for consistency
- CSS-in-Tailwind approach for maintainability
- Custom LCARS animations without heavy JavaScript overhead

### Backend Architecture

**Runtime**: Node.js with Express.js server framework

**API Structure**: RESTful API design with the following endpoints:
- `/api/tasks` - CRUD operations for task management
- `/api/calendar/events` - Calendar event management
- `/api/weather` - Weather data proxy (Open-Meteo)
- `/api/nasa/apod` - NASA Astronomy Picture of the Day
- `/api/iss/location` - Real-time ISS tracking
- `/api/ai/chat` - Claude AI integration
- `/api/travel/route` - TomTom Maps route calculation
- `/api/notifications` - System notifications
- `/api/analytics` - Productivity analytics
- `/api/settings` - User preferences

**Service Layer Pattern**: Each external API has a dedicated service module:
- `server/services/weather.ts` - Open-Meteo integration
- `server/services/nasa.ts` - NASA API integration
- `server/services/iss.ts` - ISS tracking via Open Notify API
- `server/services/ai.ts` - Claude AI (Anthropic) integration
- `server/services/maps.ts` - TomTom Maps integration

**Data Storage**: 
- Primary: PostgreSQL database via Drizzle ORM
- Schema-first approach with type-safe queries
- Migration support through drizzle-kit
- Connection pooling via @neondatabase/serverless

**Key Backend Decisions**:
- Stateless API design for scalability
- Service layer separates business logic from routes
- Environment-based configuration (API keys via .env)
- Graceful degradation when API keys missing (returns apiAvailable: false)
- Error handling with proper HTTP status codes

### Database Schema

**ORM**: Drizzle ORM for type-safe database operations

**Tables**:
1. `tasks` - Task management with priority, status, due dates
2. `calendar_events` - Calendar events with date ranges
3. `analytics` - Productivity metrics and statistics
4. `settings` - User preferences and configuration
5. `notifications` - System notifications
6. `conversations` - AI chat history
7. `travel_routes` - Saved travel/route calculations

**Schema Design**:
- Serial primary keys for simplicity
- Timestamps for auditing (createdAt, completedAt)
- Text enums for status/priority (validated at application layer)
- JSON columns for flexible metadata storage
- Foreign key constraints not heavily used (simple relational structure)

**Migration Strategy**:
- Schema defined in `shared/schema.ts` (shared between client/server)
- Migrations generated via `drizzle-kit push`
- Type safety through Drizzle's inference

### Authentication & Authorization

**Current State**: No authentication implemented (single-user application)

**Future Consideration**: Session-based authentication ready via `connect-pg-simple` package already installed

### API Integration Strategy

**Free APIs (No Configuration)**:
- Open-Meteo for weather (unlimited, no key required)
- NASA APOD via DEMO_KEY (limited rate)
- Open Notify for ISS tracking
- ip-api.com for geolocation

**Premium APIs (Require Keys)**:
- Claude AI (Anthropic) - Primary AI provider
- TomTom Maps - Primary mapping provider

**Design Pattern**:
- Service functions check for API key availability
- Return `{ apiAvailable: false }` when key missing
- Frontend displays helpful setup messages
- Alternative providers documented in API-ALTERNATIVES.md

### Build & Deployment

**Development**:
- Vite dev server with HMR for frontend
- tsx for running TypeScript server directly
- Concurrent development via single `npm run dev` command

**Production**:
- Vite builds optimized static assets to `dist/public`
- esbuild bundles server code to `dist/index.js`
- Single Node.js process serves both API and static files
- Environment variables required: DATABASE_URL, optional API keys

**Performance Optimizations**:
- Code splitting via Vite
- Tree shaking for smaller bundles
- React Query caching reduces API calls
- Lazy loading for route components

## External Dependencies

### Database
- **PostgreSQL**: Primary data storage via Neon serverless or any Postgres provider
- **Connection**: `@neondatabase/serverless` for edge compatibility
- **ORM**: Drizzle ORM with drizzle-kit for migrations

### AI Services
- **Claude AI (Anthropic)**: Primary AI chat provider via `@anthropic-ai/sdk`
  - Model: claude-3-5-sonnet-20241022
  - Requires: ANTHROPIC_API_KEY environment variable
  - Fallback: Displays setup instructions when key missing

### Mapping Services
- **TomTom Maps**: Route calculation and geocoding
  - Requires: TOMTOM_API_KEY environment variable
  - Alternative: Google Maps, Mapbox (documented in API-ALTERNATIVES.md)

### Weather & Space APIs
- **Open-Meteo**: Free weather API (no key required)
  - Provides: Current weather, 7-day forecast, humidity, wind, UV index
  - Updates: Every 10 minutes
- **NASA APOD**: Astronomy Picture of the Day
  - Uses: DEMO_KEY (limited rate, upgradeable)
- **Open Notify**: ISS real-time location tracking (free, no key)
- **ip-api.com**: IP-based geolocation (free, no key)

### UI & Styling
- **Radix UI**: Accessible component primitives (~20 packages)
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library for consistent iconography

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety across stack
- **React Query**: Server state management
- **Wouter**: Lightweight routing
- **Zod**: Runtime schema validation (via drizzle-zod)

### Session Management
- **connect-pg-simple**: PostgreSQL session store (installed but not currently used)
  - Ready for future authentication implementation

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal**: Error overlay in development
- **@replit/vite-plugin-cartographer**: Code navigation
- **@replit/vite-plugin-dev-banner**: Development mode indicator