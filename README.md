# Ando eSports

Northern Nevada's eSports League: find teammates, improve safely, and get seen.

Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + Clerk auth.

## Quickstart

```bash
# Install dependencies
pnpm i

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Clerk keys

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

**Required:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Get from [Clerk Dashboard](https://dashboard.clerk.com)
- `CLERK_SECRET_KEY` - Get from [Clerk Dashboard](https://dashboard.clerk.com)

**Optional:**
- `NEXT_PUBLIC_SITE_URL` - Site URL for metadata (defaults to `https://ando.gg`)

## Scripts

- `pnpm dev` - Development server (webpack mode)
- `pnpm build` - Production build
- `pnpm start` - Production server
- `pnpm lint` - Run ESLint

## Project Structure

```
app/
├── _components/     # Shared components (SiteHeader, SiteFooter, UI primitives)
├── _hooks/          # Custom hooks (useThemeMode)
├── _lib/            # Utilities (env validation)
├── api/             # API routes (waitlist, partnerships)
├── [pages]/         # Route pages (about, games, memberships, etc.)
└── globals.css      # Tailwind v4 + design tokens

db/                  # TypeScript schemas and types
public/              # Static assets (fonts, images)
.data/               # Lead storage (NDJSON, gitignored)
proxy.ts             # Clerk middleware (Next.js 16+)
```

## Architecture

### Signup Flow

```
                    User Visits Site
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
      [Clerk SignUp]  [Waitlist Form]  [Partnership Form]
            │              │              │
            │              ▼              ▼
            │      POST /api/waitlist  POST /api/partnerships
            │              │              │
            │              ▼              ▼
            │           Validation & Processing
            │              │              │
            │              ├──────────────┘
            │              │
            ▼              ▼
    ┌───────────────┐  ┌──────────────────────────────┐
    │  Clerk Cloud  │  │   Local File Storage (Temp)  │
    │               │  │                              │
    │ • User Mgmt   │  │ • .data/waitlist.ndjson      │
    │ • Email       │  │ • .data/partnerships.ndjson  │
    │ • Contact List│  │                              │
    └───────────────┘  └──────────────────────────────┘
```

**Clerk Flow:** Users click `SignUpButton` → Clerk handles authentication → User data stored in Clerk → Enables email outreach and contact list management via Clerk dashboard.

**Form Flows:** Users submit waitlist or partnership forms → Validated via API routes → Stored in local `.data/*.ndjson` files → Available for lead management and follow-up.

## Key Features

**Authentication:** Clerk integration via `proxy.ts` middleware and `ClerkProvider` in `app/layout.tsx`.

**Theme System:** Light/dark mode with `useThemeMode` hook, persisted in `localStorage` as `"bb_theme"`.

**Lead Storage:** File-based NDJSON storage in `.data/` directory. Gracefully handles write failures.

**API Routes:** Standardized error responses, structured logging, input validation. See `app/api/_shared/` for utilities.

## API Endpoints

**POST `/api/waitlist`** - Waitlist signup submissions  
**POST `/api/partnerships`** - Partnership inquiries

Both endpoints return `{ ok: boolean, message: string, code?: string }` and persist to `.data/*.ndjson`.

## Development

**Adding Pages:** Create `app/[route]/page.tsx` with default export.

**Adding API Routes:** Create `app/api/[route]/route.ts` with HTTP method handlers. Use `appendLead()` from `app/api/_shared/leadStore.ts` for persistence.

**Code Style:** TypeScript strict mode, ESLint with Next.js config, JSDoc for public APIs.

## Deployment

**Build:** `pnpm build`  
**Start:** `pnpm start`

**Platforms:** Vercel (recommended), Netlify, AWS Amplify, or self-hosted.

Ensure all required environment variables are set in production. The app validates env vars on startup.

## Troubleshooting

**Clerk not working:** Verify env vars, check `proxy.ts` exists, confirm `ClerkProvider` in `app/layout.tsx`.

**Theme not persisting:** Check browser console for localStorage errors, verify `ThemeInitScript` in layout.

**API routes failing:** Check `.data/` directory permissions (must be writable), review server logs.
