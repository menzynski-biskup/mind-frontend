# Authentication Setup Guide

This document explains how to set up and use the Cloudflare Workers authentication system with D1 database.

## Quick Start

### 1. Install Dependencies

```bash
npm install --save-dev wrangler @cloudflare/workers-types
```

### 2. Create D1 Database (Production)

```bash
# Create a new D1 database in your Cloudflare account
npx wrangler d1 create mindtoolbox-db

# Copy the database_id from the output and update wrangler.jsonc
```

### 3. Run Database Migration

```bash
# Local (for development)
npx wrangler d1 execute mindtoolbox-db --local --file=./backend/migrations/0001_create_users_table.sql

# Remote (for production)
npx wrangler d1 execute mindtoolbox-db --remote --file=./backend/migrations/0001_create_users_table.sql
```

### 4. Update Configuration

Edit `wrangler.jsonc`:

1. Replace `YOUR_DATABASE_ID_HERE` with your actual D1 database ID
2. For local development, uncomment the `vars` section and set a temporary JWT_SECRET
3. For production, **always use Cloudflare secrets** (never commit secrets):

```bash
# Set JWT_SECRET as a secret (recommended for production)
echo "your-super-secret-jwt-key-$(openssl rand -base64 32)" | npx wrangler secret put JWT_SECRET
```

4. Update `allowedOrigins` in `backend/src/index.ts` with your frontend domain(s)

### 5. Test Locally

```bash
# Start the worker in development mode
npx wrangler dev --port 8787

# In another terminal, test the endpoints:

# Register a user
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"testPass123","full_name":"Test User","role":"researcher"}'

# Login
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"testPass123"}' \
  -c cookies.txt

# Get current user (uses cookie from login)
curl -X GET http://localhost:8787/api/me -b cookies.txt

# Logout
curl -X POST http://localhost:8787/api/auth/logout -b cookies.txt
```

### 6. Deploy to Cloudflare

```bash
# Deploy the worker
npx wrangler deploy
```

## Frontend Integration

See [docs/FRONTEND_INTEGRATION.md](docs/FRONTEND_INTEGRATION.md) for:
- Angular Auth Service usage
- Auth Guard for route protection
- Vanilla JavaScript examples
- Example components

## API Endpoints

### POST /api/auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePass123",
  "full_name": "John Doe",
  "role": "researcher"  // Optional: clinician, researcher, or admin
}
```

**Response (201):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "researcher",
    "created_at": "2026-02-12T12:00:00.000Z"
  }
}
```

Sets `auth_token` cookie (HttpOnly, Secure, SameSite=Lax, 24h).

### POST /api/auth/login
Login an existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securePass123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "researcher",
    "created_at": "2026-02-12T12:00:00.000Z"
  }
}
```

Sets `auth_token` cookie.

### POST /api/auth/logout
Logout the current user.

**Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

Clears the `auth_token` cookie.

### GET /api/me
Get the currently authenticated user.

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "researcher",
    "created_at": "2026-02-12T12:00:00.000Z"
  }
}
```

**Response (401) if not authenticated:**
```json
{
  "error": "Not authenticated"
}
```

## Security Features

### Password Hashing
- PBKDF2 with SHA-256
- 100,000 iterations
- 16-byte random salt per password
- Works with Web Crypto API (Workers-compatible)

### JWT Tokens
- HMAC SHA-256 signature
- 24-hour expiration
- Includes user ID and role
- Stored in HttpOnly cookie

### Cookies
- HttpOnly (prevents JavaScript access)
- Secure (HTTPS only)
- SameSite=Lax (CSRF protection)
- 24-hour max age

### Rate Limiting
- 5 attempts per 15-minute window per IP
- Applies to /login and /register
- Returns 429 status with Retry-After header

### Input Validation
- Email: RFC 5322 compliant
- Password: Min 8 chars, includes letter and number
- Name: 2-100 chars, letters/spaces/hyphens/apostrophes
- Role: Must be clinician, researcher, or admin

### Error Handling
- Generic error messages prevent user enumeration
- Constant-time password comparison
- Timing attack mitigation

## Database Schema

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'researcher' CHECK(role IN ('clinician', 'researcher', 'admin')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

## Development

### Running Tests

```bash
# Test registration
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testPass123","full_name":"Test User"}'

# Test invalid email
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"testPass123","full_name":"Test User"}'

# Test weak password
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test2@example.com","password":"weak","full_name":"Test User"}'

# Test invalid credentials
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrongpassword"}'
```

### Building Angular App with Worker

```bash
# Build Angular app
npm run build

# Uncomment assets section in wrangler.jsonc

# Deploy (will serve both API and static files)
npx wrangler deploy
```

## Project Structure

```
mind-frontend/
├── backend/                      # Cloudflare Worker backend
│   ├── src/
│   │   ├── handlers/
│   │   │   └── auth.ts          # Auth endpoint handlers
│   │   ├── types/
│   │   │   ├── env.ts           # Environment types
│   │   │   └── user.ts          # User types
│   │   ├── utils/
│   │   │   ├── cookies.ts       # Cookie utilities
│   │   │   ├── jwt.ts           # JWT utilities
│   │   │   ├── password.ts      # Password hashing
│   │   │   ├── rate-limit.ts    # Rate limiting
│   │   │   └── validate.ts      # Input validation
│   │   └── index.ts             # Worker entry point
│   ├── migrations/
│   │   └── 0001_create_users_table.sql
│   ├── tsconfig.json
│   └── README.md
├── src/app/services/            # Angular services
│   ├── auth.service.ts          # Auth service
│   └── auth.guard.ts            # Route guards
├── docs/
│   └── FRONTEND_INTEGRATION.md  # Frontend integration guide
├── wrangler.jsonc               # Worker configuration
└── AUTH_SETUP.md                # This file
```

## Troubleshooting

### Error: Database not found
Make sure you've created the D1 database and updated `database_id` in `wrangler.jsonc`.

### Error: 401 on /api/me
Check that:
1. The cookie is being sent with the request (use `credentials: 'include'`)
2. The JWT_SECRET matches between token creation and verification
3. The token hasn't expired (24-hour lifetime)

### Rate limiting too aggressive
Adjust `MAX_ATTEMPTS` and `RATE_LIMIT_WINDOW` in `backend/src/utils/rate-limit.ts`.

### CORS issues
If frontend and backend are on different domains, update CORS headers in `backend/src/index.ts`.

## Production Checklist

- [ ] Create production D1 database
- [ ] Run migrations on production database
- [ ] Set strong JWT_SECRET using Cloudflare secrets
- [ ] Update `database_id` in wrangler.jsonc
- [ ] Build Angular app (`npm run build`)
- [ ] Uncomment assets section in wrangler.jsonc
- [ ] Deploy worker (`npx wrangler deploy`)
- [ ] Test all endpoints in production
- [ ] Enable HTTPS (automatic with Cloudflare Workers)
- [ ] Set up monitoring and logging

## Additional Resources

- [Worker README](backend/README.md) - Detailed backend documentation
- [Frontend Integration Guide](docs/FRONTEND_INTEGRATION.md) - Frontend usage examples
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [D1 Database Docs](https://developers.cloudflare.com/d1/)
