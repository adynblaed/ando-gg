# Ando eSports

Northern Nevada's eSports League: find teammates, improve safely, and get seen.

## Overview

This is a [Next.js](https://nextjs.org) application built with React 19, TypeScript, and Tailwind CSS v4. The application features Clerk authentication integration, a custom theme system with dark mode support, and a file-based lead storage system for waitlist and partnership submissions.

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Authentication**: Clerk (@clerk/nextjs)
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **Fonts**: Geist Sans & Mono (Google Fonts), AAAiight (custom brand font)

## Getting Started

### Prerequisites

- Node.js 18+ (or use a Node version manager like nvm)
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ando-esports
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```
   
   Required variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Get from [Clerk Dashboard](https://dashboard.clerk.com)
   - `CLERK_SECRET_KEY` - Get from [Clerk Dashboard](https://dashboard.clerk.com)
   
   Optional variables:
  - `NEXT_PUBLIC_SITE_URL` - Site URL for metadata (defaults to https://ando.gg)

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ando-esports/
├── app/                      # Next.js App Router directory
│   ├── _components/          # Shared React components
│   │   ├── SiteHeader.tsx   # Main navigation header with Clerk integration
│   │   ├── SiteFooter.tsx   # Site footer component
│   │   ├── ErrorBoundary.tsx # React error boundary for error handling
│   │   └── ui.tsx           # Reusable UI components (Card, Input, etc.)
│   ├── _hooks/              # Custom React hooks
│   │   └── useThemeMode.ts  # Theme management hook (light/dark mode)
│   ├── _lib/                # Shared utilities
│   │   └── env.ts            # Environment variable validation
│   ├── api/                 # API routes
│   │   ├── _shared/         # Shared API utilities
│   │   │   ├── leadStore.ts # File-based lead storage (NDJSON)
│   │   │   ├── logger.ts    # Structured logging utility
│   │   │   └── errors.ts    # Error handling utilities
│   │   ├── waitlist/        # Waitlist submission endpoint
│   │   │   └── route.ts     # POST /api/waitlist
│   │   └── partnerships/    # Partnership inquiry endpoint
│   │       └── route.ts     # POST /api/partnerships
│   ├── about/               # About Us page
│   ├── games/               # Games catalog page
│   ├── memberships/         # Membership tiers page
│   ├── players/             # Player registry and leaderboards page
│   ├── globals.css          # Global styles and design tokens
│   ├── layout.tsx           # Root layout with ClerkProvider
│   └── page.tsx             # Home page
├── db/                      # Database schemas and types
│   ├── esports_waitlist_*   # Waitlist schema definitions
│   └── esports_partnership_* # Partnership schema definitions
├── public/                  # Static assets
│   ├── fonts/               # Custom fonts (AAAiight)
│   └── images/              # Image assets
├── .data/                   # Lead storage (NDJSON files, gitignored)
├── .env.example             # Environment variable template
├── proxy.ts                 # Clerk middleware (Next.js 16+)
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## Key Features

### Error Handling & Logging

The application includes comprehensive error handling:

- **Error Boundaries**: React error boundaries catch component errors and display fallback UI
- **API Error Handling**: Standardized error responses with error codes
- **Structured Logging**: JSON-formatted logs with context for debugging
- **Graceful Degradation**: File storage failures don't crash the app

**Error Handling Utilities:**
- `app/api/_shared/errors.ts` - Standardized error responses and error codes
- `app/api/_shared/logger.ts` - Structured logging utility
- `app/_components/ErrorBoundary.tsx` - React error boundary component

### Authentication (Clerk)

The application uses Clerk for authentication. Key integration points:

- **Middleware**: `proxy.ts` - Provides authentication state throughout the app
- **Provider**: `app/layout.tsx` - Wraps app with `ClerkProvider`
- **Components**: `app/_components/SiteHeader.tsx` - Uses `SignUpButton`, `SignedIn`, `SignedOut`

**Environment Variables Required:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Public Clerk key
- `CLERK_SECRET_KEY` - Server-side Clerk secret

**Note**: For Next.js ≤15, rename `proxy.ts` to `middleware.ts`. The code remains the same.

### Theme System

The application features a custom theme system with light/dark mode support:

- **Initialization**: `app/layout.tsx` - `ThemeInitScript` prevents FOUC
- **Hook**: `app/_hooks/useThemeMode.ts` - Manages theme state with cross-tab sync
- **Storage**: Preferences stored in `localStorage` under key `"bb_theme"`
- **CSS**: Tailwind v4 custom variant for `.dark` class

### Lead Storage

Lead data (waitlist signups, partnership inquiries) is stored in `.data/` directory as NDJSON files:

- `.data/waitlist.ndjson` - Waitlist submissions
- `.data/partnerships.ndjson` - Partnership inquiries

Each line is a JSON object with `receivedAt` timestamp and `payload`. The system gracefully handles filesystem write failures (e.g., in serverless environments).

### API Routes

All API routes follow consistent patterns:
- Standardized error responses with error codes
- Structured logging for debugging
- Input validation with descriptive error messages
- Graceful error handling (never exposes internal details)

#### POST /api/waitlist

Handles waitlist signup submissions.

**Request Body:**
```json
{
  "email": "user@example.com",
  "clubUsername": "username",
  "locality": { ... },
  "games": ["game1", "game2"],
  "preferredPlayTimes": ["evening"],
  "consent": { ... },
  "notes": "Optional notes (max 300 chars)"
}
```

**Success Response:**
```json
{
  "ok": true,
  "message": "Received.",
  "data": {
    "persisted": true
  }
}
```

**Error Response:**
```json
{
  "ok": false,
  "message": "Email is required.",
  "code": "VALIDATION_ERROR"
}
```

#### POST /api/partnerships

Handles partnership inquiry submissions.

**Request Body:**
```json
{
  "email": "partner@example.com",
  "notes": "Partnership inquiry details (max 1000 chars)"
}
```

**Success Response:**
```json
{
  "ok": true,
  "message": "Received. We will reach out as soon as possible.",
  "data": {
    "persisted": true
  }
}
```

**Error Response:**
```json
{
  "ok": false,
  "message": "Enter a valid email.",
  "code": "VALIDATION_ERROR"
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint with Next.js config
- JSDoc comments for public APIs
- Consistent naming conventions (camelCase for functions, PascalCase for components)

### Adding New Pages

1. Create a new directory under `app/` (e.g., `app/new-page/`)
2. Add `page.tsx` file with your page component
3. Export default function component
4. Use shared components from `app/_components/`

### Adding New API Routes

1. Create a new directory under `app/api/` (e.g., `app/api/new-endpoint/`)
2. Add `route.ts` file with HTTP method handlers (e.g., `export async function POST(req: Request)`)
3. Use `appendLead()` from `app/api/_shared/leadStore.ts` for data persistence

## Production Deployment

### Environment Variables

Ensure all required environment variables are set in your production environment:

**Required:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key

**Optional:**
- `NEXT_PUBLIC_SITE_URL` - Site URL for metadata (defaults to https://ando.gg)
- `NEXT_PUBLIC_SITE_URL` - Site URL for metadata (defaults to https://ando.gg)

The application validates environment variables on startup and will warn in development or throw in production if required variables are missing.

### Build and Deploy

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

### Recommended Platforms

- **Vercel** - Recommended for Next.js applications (zero-config deployment)
- **Netlify** - Supports Next.js with configuration
- **AWS Amplify** - Full-stack deployment with CI/CD
- **Self-hosted** - Node.js server with PM2 or similar

## Documentation

### Component Documentation

All public components and functions include JSDoc comments. Key areas:

- **Components**: `app/_components/` - Reusable UI components
- **Hooks**: `app/_hooks/` - Custom React hooks
- **API Routes**: `app/api/` - Server-side endpoints
- **Utilities**: `app/api/_shared/` - Shared server utilities

### Clerk Documentation

- [Clerk Next.js Documentation](https://clerk.com/docs/nextjs/overview)
- [Clerk Components Reference](https://clerk.com/docs/components/overview)
- [Clerk Middleware Guide](https://clerk.com/docs/nextjs/middleware)

### Next.js Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## Troubleshooting

### Clerk Authentication Not Working

1. Verify environment variables are set correctly
2. Check Clerk dashboard for correct keys
3. Ensure `proxy.ts` (or `middleware.ts`) is in the root directory
4. Verify `ClerkProvider` wraps the app in `app/layout.tsx`

### Theme Not Persisting

1. Check browser console for localStorage errors
2. Verify `ThemeInitScript` is in `<head>` of `app/layout.tsx`
3. Check browser privacy settings (private browsing may block localStorage)

### API Routes Not Working

1. Verify request format matches expected schema
2. Check `.data/` directory permissions (must be writable)
3. Review server logs for validation errors

## License

[Add your license here]

## Support

For issues and questions, please [open an issue](https://github.com/your-org/ando-esports/issues) or contact the development team.
