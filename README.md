# MindFrontend

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

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`.

### Building

```bash
# Build for production
ng build
```

This compiles your project and stores the build artifacts in the `dist/` directory.

### Deployment to Cloudflare Workers

**Important**: Before deploying, review the [DEPLOYMENT.md](DEPLOYMENT.md) checklist.

```bash
# Build the Angular app
npm run build

# Deploy to Cloudflare Workers
npx wrangler deploy
```

**Note**: The authentication features require D1 database setup. See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

## Authentication System

This project includes an optional authentication system using:
- Cloudflare Workers for the backend
- D1 database for user storage
- JWT cookies for session management

**Documentation**:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Pre-deployment checklist
- [AUTH_SETUP.md](AUTH_SETUP.md) - Complete authentication setup guide
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick command reference

**Important**: The authentication system is optional. The app will deploy and run without it. Auth endpoints will return a helpful message if not configured.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
