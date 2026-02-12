# Frontend - Angular Application

This directory contains the Angular frontend application for the MIND Toolbox.

## Structure

```
frontend/
├── src/              # Application source code
│   ├── app/         # Angular components, services, and modules
│   ├── main.ts      # Application entry point
│   └── styles.scss  # Global styles
├── public/          # Static assets
├── angular.json     # Angular CLI configuration
├── tsconfig.*.json  # TypeScript configurations
└── package.json     # Frontend dependencies
```

## Development

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200/`

### Build for production
```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

## Testing

Run unit tests:
```bash
npm test
```

## Features

- Clinical decision support tools for dementia and psychiatric assessment
- Researcher mode for building and managing research studies
- Study creation and configuration
- Intake forms and participant enrollment
- Test administration and sequencing
- Centralized data organization
- Authentication integration with backend API

## Technologies

- Angular 21
- TypeScript
- SCSS
- RxJS
- Supabase JS Client (for auth)
