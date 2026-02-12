# Pre-Deployment Checklist

Before deploying your Cloudflare Worker to production, complete these steps:

## Required Setup

### 1. ✅ Build Angular Application
The Angular application must be built before deployment.

```bash
npm run build
```

This creates the `dist/mind-frontend/browser` directory that the worker serves.

### 2. ⚠️ D1 Database Setup (Optional - for Authentication)

If you want to use the authentication features, you MUST set up the D1 database:

#### Step 2.1: Create D1 Database
```bash
npx wrangler d1 create mindtoolbox-db
```

The output will show something like:
```
✅ Successfully created DB 'mindtoolbox-db'!

[[d1_databases]]
binding = "DB"
database_name = "mindtoolbox-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

#### Step 2.2: Copy Database ID
Copy the `database_id` from the output above.

#### Step 2.3: Update wrangler.jsonc
Edit `wrangler.jsonc` and uncomment the D1 database section:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "mindtoolbox-db",
    "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  // <- Paste your ID here
  }
],
```

#### Step 2.4: Run Database Migration
```bash
npx wrangler d1 execute mindtoolbox-db --remote --file=./worker/migrations/0001_create_users_table.sql
```

#### Step 2.5: Set JWT Secret
```bash
echo "$(openssl rand -base64 32)" | npx wrangler secret put JWT_SECRET
```

### 3. ✅ Deploy
Once the above steps are complete:

```bash
npx wrangler deploy
# or
npx wrangler versions upload
```

## Deployment Without Authentication

If you want to deploy without authentication features (D1 database):

1. Ensure `wrangler.jsonc` has the D1 section commented out (default state)
2. Build the Angular app: `npm run build`
3. Deploy: `npx wrangler deploy`

The worker will serve your Angular application. Auth endpoints will return a 503 error with a helpful message.

## Common Issues

### Error: "binding DB of type d1 must have a valid `id` specified"

**Cause**: D1 database binding is uncommented in `wrangler.jsonc` but no database is configured.

**Solution**: Either:
- Comment out the D1 database section in `wrangler.jsonc` (default)
- OR complete the D1 setup steps above

### Error: "Directory not found: dist/mind-frontend/browser"

**Cause**: Angular app hasn't been built.

**Solution**: Run `npm run build` before deploying.

### Authentication endpoints return 503

**Cause**: D1 database is not configured.

**Solution**: This is expected if you haven't set up the D1 database. Complete step 2 above to enable authentication.

## Quick Deploy (No Auth)

For a quick deployment without authentication:

```bash
# Build Angular app
npm run build

# Ensure D1 is commented out in wrangler.jsonc (default state)
# Deploy
npx wrangler deploy
```

Your Angular app will be deployed and accessible. Authentication endpoints will gracefully return a "not configured" message.

## Full Deploy (With Auth)

For a full deployment with authentication:

```bash
# 1. Create database
npx wrangler d1 create mindtoolbox-db

# 2. Update wrangler.jsonc with database_id (uncomment and paste ID)

# 3. Run migration
npx wrangler d1 execute mindtoolbox-db --remote --file=./worker/migrations/0001_create_users_table.sql

# 4. Set JWT secret
echo "$(openssl rand -base64 32)" | npx wrangler secret put JWT_SECRET

# 5. Build Angular app
npm run build

# 6. Deploy
npx wrangler deploy
```

## Verification

After deployment, test your application:

```bash
# Check if app is running
curl https://your-worker.workers.dev/

# Check auth status (should return 503 if DB not configured, or 401 if configured but not logged in)
curl https://your-worker.workers.dev/api/me
```

## Need Help?

- See [AUTH_SETUP.md](AUTH_SETUP.md) for detailed authentication setup
- See [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for common commands
- See [worker/README.md](worker/README.md) for backend documentation
