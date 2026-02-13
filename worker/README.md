# Authentication Worker for Cloudflare Workers + D1

This directory contains the authentication backend for the MIND application, built with Cloudflare Workers and D1 database.

## Features

- ✅ User registration and login
- ✅ JWT-based authentication with HttpOnly cookies
- ✅ Secure password hashing using PBKDF2
- ✅ Rate limiting for auth endpoints
- ✅ Email, password, and name validation
- ✅ Safe error messages (prevents user enumeration)
- ✅ Role-based access control (clinician, researcher, admin)

## API Endpoints

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "full_name": "John Doe",
  "role": "researcher"  // Optional: clinician, researcher, or admin (default: researcher)
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

Sets `auth_token` cookie (HttpOnly, Secure, SameSite=Lax, 24h expiry).

### POST /api/auth/login
Login an existing user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
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

Sets `auth_token` cookie (HttpOnly, Secure, SameSite=Lax, 24h expiry).

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

**Response (401):**
```json
{
  "error": "Not authenticated"
}
```

## Form + Compute + Rules Engine

The researcher intake engine lets studies define intake forms, derived variables, and rules without hardcoded logic.

### POST /api/studies/:id/forms
Create a form template.

### POST /api/studies/:id/forms/:formId/fields
Add a form field definition.

### POST /api/studies/:id/forms/:formId/logic
Add conditional logic JSON for a form template.

### POST /api/studies/:id/compute-definitions
Create a derived variable definition (functions: midpoint, duration, add_days, normalize_time).

### POST /api/studies/:id/rule-sets
Create an eligibility, group assignment, or scheduling rule set.

### POST /api/studies/:id/participants/:participantId/intake-submit
Submit intake answers, run compute definitions, and evaluate rule sets.

### GET /api/studies/:id/participants/:participantId/intake-result
Fetch the latest intake evaluation payload.

## Setup

### 1. Install Dependencies

```bash
npm install -D wrangler @cloudflare/workers-types
```

### 2. Create D1 Database

```bash
# Create a new D1 database
npx wrangler d1 create mindtoolbox-db

# Note the database_id from the output and update wrangler.jsonc
```

### 3. Run Migrations

```bash
# Apply the migration to create the users table
npx wrangler d1 execute mindtoolbox-db --file=./worker/migrations/0001_create_users_table.sql --local

# Apply the form/compute/rules engine schema
npx wrangler d1 execute mindtoolbox-db --file=./worker/migrations/0002_create_form_compute_rules_tables.sql --local

# For production:
npx wrangler d1 execute mindtoolbox-db --file=./worker/migrations/0001_create_users_table.sql --remote
npx wrangler d1 execute mindtoolbox-db --file=./worker/migrations/0002_create_form_compute_rules_tables.sql --remote
```

### 4. Update Configuration

Edit `wrangler.jsonc`:
- Update `database_id` with your D1 database ID
- Change `JWT_SECRET` to a strong random secret (use `openssl rand -base64 32`)

### 5. Development

```bash
# Start local development server
npx wrangler dev

# Test endpoints
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456","full_name":"Test User"}'
```

### 6. Deploy

```bash
# Deploy to Cloudflare Workers
npx wrangler deploy
```

## Security Features

### Password Hashing
- Uses PBKDF2 with SHA-256
- 100,000 iterations
- 16-byte random salt per password
- Outputs base64-encoded hash

### JWT Tokens
- Signed with HMAC SHA-256
- 24-hour expiration
- Includes user ID and role
- Issued at timestamp (iat) and expiration (exp)

### Cookies
- HttpOnly (prevents JavaScript access)
- Secure (HTTPS only)
- SameSite=Lax (CSRF protection)
- 24-hour max age

### Rate Limiting
- 5 attempts per 15-minute window per IP
- Applies to /login and /register endpoints
- Returns 429 with Retry-After header

### Input Validation
- Email format validation (RFC 5322)
- Password requirements: min 8 chars, includes letter and number
- Name validation: 2-100 chars, letters/spaces/hyphens/apostrophes only
- Role validation: must be clinician, researcher, or admin

### Error Handling
- Generic error messages prevent user enumeration
- Constant-time password comparison
- Timing attack mitigation for login

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

## Project Structure

```
worker/
├── src/
│   ├── handlers/
│   │   └── auth.ts          # Authentication endpoint handlers
│   ├── types/
│   │   ├── env.ts           # Environment/binding types
│   │   └── user.ts          # User-related types
│   ├── utils/
│   │   ├── cookies.ts       # Cookie management
│   │   ├── jwt.ts           # JWT signing/verification
│   │   ├── password.ts      # Password hashing
│   │   ├── rate-limit.ts    # Rate limiting middleware
│   │   └── validate.ts      # Input validation
│   └── index.ts             # Worker entry point
├── migrations/
│   └── 0001_create_users_table.sql
├── tsconfig.json
└── README.md
```

## Environment Variables

Set these in `wrangler.jsonc`:

- `JWT_SECRET`: Secret key for signing JWT tokens (required)

For production, use Cloudflare dashboard or wrangler secrets:

```bash
# Set JWT_SECRET as a secret (not in wrangler.jsonc)
echo "your-super-secret-key" | npx wrangler secret put JWT_SECRET
```

## Troubleshooting

### Database not found
Make sure you've created the D1 database and updated the `database_id` in `wrangler.jsonc`.

### 401 errors on /api/me
Check that:
1. The cookie is being sent with the request
2. The JWT_SECRET matches between token creation and verification
3. The token hasn't expired (24-hour lifetime)

### Rate limiting too aggressive
Adjust `MAX_ATTEMPTS` and `RATE_LIMIT_WINDOW` in `src/utils/rate-limit.ts`.

## Testing

Use curl or any HTTP client:

```bash
# Register
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testPass123",
    "full_name": "Test User",
    "role": "researcher"
  }'

# Login (save cookies)
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "testPass123"
  }'

# Get current user (use saved cookies)
curl -X GET http://localhost:8787/api/me \
  -b cookies.txt

# Logout
curl -X POST http://localhost:8787/api/auth/logout \
  -b cookies.txt
```

## License

Same as the main project.
