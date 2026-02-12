# Project Architecture

This document describes the architecture and organization of the MindToolbox project.

## Overview

MindToolbox is organized as a monorepo with clear separation between frontend and backend:

```
mind-toolbox/
├── frontend/          # Angular application
├── backend/           # Cloudflare Workers API
├── docs/             # Additional documentation
├── package.json      # Root package configuration
├── angular.json      # Angular CLI configuration
├── tsconfig*.json    # TypeScript configurations
└── wrangler.jsonc    # Cloudflare Workers configuration
```

## Directory Structure

### `/frontend` - Angular Application

Contains the complete Angular application including all UI components, services, and assets.

```
frontend/
├── src/
│   ├── app/              # Application components and modules
│   │   ├── core/        # Core services (auth, supabase, etc.)
│   │   ├── layout/      # Layout components
│   │   ├── pages/       # Page components
│   │   │   ├── login/  # Login page
│   │   │   ├── clinician-dashboard/
│   │   │   ├── researcher-dashboard/
│   │   │   └── site/   # Public site pages
│   │   ├── services/    # Application services
│   │   └── content/     # Content management
│   ├── environment.ts   # Environment configuration
│   ├── main.ts         # Application entry point
│   └── styles.scss     # Global styles
├── public/             # Static assets
│   ├── favicon.ico
│   ├── templates/
│   └── design-spec/
├── dist/              # Build output (gitignored)
├── package.json       # Frontend dependencies (separate from backend)
└── README.md         # Frontend documentation
```

**Key Files:**
- `src/main.ts` - Bootstrap the Angular application
- `src/app/app.ts` - Root component
- `src/app/app.routes.ts` - Application routing
- `src/app/app.config.ts` - Application configuration

### `/backend` - Cloudflare Workers API

Contains the backend API built with Cloudflare Workers, including authentication and database logic.

```
backend/
├── src/
│   ├── handlers/        # API request handlers
│   │   └── auth.ts     # Authentication endpoints
│   ├── types/          # TypeScript type definitions
│   │   ├── env.ts     # Environment/binding types
│   │   └── user.ts    # User-related types
│   ├── utils/          # Utility functions
│   │   ├── cookies.ts  # Cookie management
│   │   ├── jwt.ts      # JWT signing/verification
│   │   ├── password.ts # Password hashing
│   │   ├── rate-limit.ts # Rate limiting
│   │   └── validate.ts # Input validation
│   └── index.ts        # Worker entry point
├── migrations/         # D1 database migrations
│   └── 0001_create_users_table.sql
├── tsconfig.json      # Backend TypeScript config
├── package.json       # Backend dependencies (separate from frontend)
└── README.md         # Backend documentation
```

**Key Files:**
- `src/index.ts` - Worker entry point and routing
- `src/handlers/auth.ts` - Authentication logic (login, register, logout)
- `migrations/` - Database schema definitions

### Root Configuration Files

#### `package.json`
Root package.json manages dependencies for both frontend and backend. It provides convenient scripts:

```json
{
  "scripts": {
    "start": "ng serve --project mind-frontend",
    "build": "ng build --project mind-frontend",
    "dev:frontend": "ng serve --project mind-frontend",
    "dev:backend": "npx wrangler dev",
    "deploy": "npm run build:frontend && npx wrangler deploy"
  }
}
```

#### `angular.json`
Angular CLI configuration. Defines the frontend project with paths pointing to the `frontend/` directory.

#### `wrangler.jsonc`
Cloudflare Workers configuration:
- Points to `backend/src/index.ts` as the worker entry point
- Configures D1 database binding
- Sets up static asset serving from `frontend/dist/mind-frontend/browser`

#### `tsconfig.json` (root)
Base TypeScript configuration shared by both frontend and backend.

## Build Process

### Frontend Build

```bash
npm run build:frontend
# or
npm run build
```

- Compiles Angular application using Angular CLI
- Output: `frontend/dist/mind-frontend/browser/`
- This output is served by the Cloudflare Worker as static assets

### Backend Build

Backend builds automatically during deployment via Wrangler:

```bash
npm run dev:backend  # Local development
npm run deploy       # Production deployment
```

## Development Workflow

### Starting Development Servers

1. **Frontend only:**
   ```bash
   npm start
   # or
   npm run dev:frontend
   ```
   Starts Angular dev server at http://localhost:4200/

2. **Backend only:**
   ```bash
   npm run dev:backend
   ```
   Starts Cloudflare Worker at http://localhost:8787/

3. **Both (in separate terminals):**
   ```bash
   # Terminal 1
   npm run dev:frontend
   
   # Terminal 2
   npm run dev:backend
   ```

### Making Changes

**Frontend changes:**
- Edit files in `frontend/src/`
- Angular dev server auto-reloads
- Use Angular CLI for scaffolding: `ng generate component my-component`

**Backend changes:**
- Edit files in `backend/src/`
- Wrangler dev server auto-reloads
- Test API endpoints at http://localhost:8787/api/...

## Deployment

The deployment process builds the frontend and deploys everything to Cloudflare Workers:

```bash
npm run deploy
```

This:
1. Builds the Angular frontend
2. Deploys the Worker with built frontend assets
3. Worker serves both API endpoints and static frontend files

## Dependencies

### Shared Dependencies (Root)
- Angular framework and CLI
- Cloudflare Workers tooling (Wrangler)
- TypeScript

### Frontend-Specific (`frontend/package.json`)
- Angular packages
- Supabase client
- RxJS

### Backend-Specific (`backend/package.json`)
- Cloudflare Workers types
- Vitest (for testing)

## Path Resolution

The project uses consistent path resolution:

- **Root-relative paths** in configuration files (angular.json, tsconfig.json)
- **Module-relative paths** in source code
- **Environment paths** configured via TypeScript path mapping

Example from `tsconfig.app.json`:
```json
{
  "paths": {
    "@core/*": ["frontend/src/app/core/*"],
    "pages/*": ["frontend/src/app/pages/*"]
  }
}
```

## API Communication

Frontend communicates with backend via HTTP:

**Development:**
- Frontend: http://localhost:4200
- Backend: http://localhost:8787
- CORS configured in backend to allow localhost origins

**Production:**
- Single origin (Cloudflare Worker serves both)
- No CORS issues as everything is same-origin

## Database

Cloudflare D1 (SQLite) database:
- Configured in `wrangler.jsonc`
- Migrations in `backend/migrations/`
- Accessed via D1 binding in Worker code

## Security

- JWT-based authentication with HttpOnly cookies
- Password hashing with PBKDF2
- Rate limiting on authentication endpoints
- Input validation and sanitization
- CORS configured appropriately per environment

## Testing

**Frontend tests:**
```bash
npm run test:frontend
```

**Backend tests:**
```bash
cd backend && npm test
```

## Contributing

When adding new features:

1. **Frontend features** - Add to `frontend/src/app/`
2. **Backend API endpoints** - Add to `backend/src/handlers/`
3. **Database changes** - Create new migration in `backend/migrations/`
4. **Documentation** - Update relevant README.md files

## Further Reading

- [frontend/README.md](frontend/README.md) - Frontend development guide
- [backend/README.md](backend/README.md) - Backend API guide
- [AUTH_SETUP.md](AUTH_SETUP.md) - Authentication setup
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
