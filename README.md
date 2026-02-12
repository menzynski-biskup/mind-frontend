# MindToolbox

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.0.

## Project Overview

MIND is a proposed research and development initiative exploring mechanism-informed, technology-enabled decision support for mental health and neurocognitive disorders. The platform includes:

- Clinical decision support tools for dementia and psychiatric assessment
- Researcher mode for building and managing research studies with:
  - Study creation and configuration
  - Intake forms and participant enrollment
  - Test administration and sequencing
  - Centralized data organization
  - Research pipeline management
- Authentication system with Cloudflare Workers and D1 database (optional)

## Project Structure

This project follows a clear separation between frontend and backend:

```
mind-toolbox/
├── frontend/           # Angular application
│   ├── src/           # Application source code
│   ├── public/        # Static assets
│   ├── angular.json   # Angular configuration
│   └── README.md      # Frontend documentation
├── backend/           # Cloudflare Workers API
│   ├── src/          # Worker source code
│   ├── migrations/   # Database migrations
│   └── README.md     # Backend documentation
├── docs/             # Additional documentation
├── package.json      # Root package configuration
└── wrangler.jsonc    # Cloudflare Workers configuration
```

For detailed information:
- See [frontend/README.md](frontend/README.md) for frontend development
- See [backend/README.md](backend/README.md) for backend API development

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm (v11.6.2 or higher)

### Development

```bash
# Install dependencies
npm install

# Start frontend development server
npm run dev:frontend
# or
npm start

# Start backend development server (in another terminal)
npm run dev:backend
```

Frontend: `http://localhost:4200/`  
Backend API: `http://localhost:8787/`

### Building

```bash
# Build frontend
npm run build:frontend
# or
npm run build

# Backend builds via Wrangler during deployment
```

Frontend build artifacts will be stored in the `frontend/dist/` directory.

### Deployment to Cloudflare Workers

**Important**: Before deploying, review the [DEPLOYMENT.md](DEPLOYMENT.md) checklist.

```bash
# Build and deploy (both frontend and backend)
npm run deploy
```

**Note**: The authentication features require D1 database setup. See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

## Authentication System

This project includes an optional authentication system using:
- Cloudflare Workers for the backend API
- D1 database for user storage
- JWT cookies for session management

**Documentation**:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Pre-deployment checklist
- [AUTH_SETUP.md](AUTH_SETUP.md) - Complete authentication setup guide
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick command reference
- [frontend/README.md](frontend/README.md) - Frontend development guide
- [backend/README.md](backend/README.md) - Backend API guide

**Important**: The authentication system is optional. The app will deploy and run without it. Auth endpoints will return a helpful message if not configured.

## Development server

To start the frontend development server, run:

```bash
npm start
# or
npm run dev:frontend
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

To start the backend development server:

```bash
npm run dev:backend
```

The API will be available at `http://localhost:8787/`.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
cd frontend
ng generate component component-name
# or from root
npm run ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
cd frontend
ng generate --help
```

## Building

To build the project run:

```bash
npm run build
# or
npm run build:frontend
```

This will compile your project and store the build artifacts in the `frontend/dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute frontend unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
npm test
# or
npm run test:frontend
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
