# Environment Setup Guide

## Overview

This guide explains how to set up the required environment variables for FitLog's backend server.

## Server Environment Variables

### Required Variables

#### 1. DATABASE_URL (Required)

PostgreSQL connection string for your database.

**Format:**
```
DATABASE_URL=postgresql://username:password@host:port/database_name
```

**Examples:**
```bash
# Local development
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/fitlog

# Remote database (e.g., Railway, Neon, Supabase)
DATABASE_URL=postgresql://user:pass@host.region.provider.com:5432/fitlog

# With SSL (production)
DATABASE_URL=postgresql://user:pass@host:5432/fitlog?sslmode=require
```

**Where to get it:**
- **Local PostgreSQL**: Install PostgreSQL locally and create a database named `fitlog`
- **Neon**: https://neon.tech (Free tier available)
- **Supabase**: https://supabase.com (Free tier available)
- **Railway**: https://railway.app (Free tier available)
- **Heroku Postgres**: https://www.heroku.com/postgres

#### 2. OPENAI_API_KEY (Required for AI features)

OpenAI API key for AI workout generation.

**Format:**
```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
```

**Where to get it:**
1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (you won't be able to see it again!)

**Cost:**
- gpt-4o-mini: $0.15/1M input tokens, $0.60/1M output tokens
- Average workout generation: ~$0.000126 per request
- Free tier: $5 credit for new accounts

#### 3. CLERK_PUBLISHABLE_KEY & CLERK_SECRET_KEY (Required for authentication)

Clerk keys for user authentication. Both keys are required for the backend server.

**Format:**
```
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
```

**Where to get them:**
1. Go to https://dashboard.clerk.com
2. Sign in or create an account
3. Create a new application
4. Go to "API Keys" in the dashboard
5. Copy both the "Publishable Key" (pk_test_...) and "Secret Key" (sk_test_...)

**Note:**
- Use `pk_test_` and `sk_test_` for development
- Use `pk_live_` and `sk_live_` for production
- Both keys must be from the same environment (both test or both live)

### Optional Variables

#### PORT

Server port number (default: 3000)

```
PORT=3000
```

#### NODE_ENV

Environment mode: `development`, `production`, or `test`

```
NODE_ENV=development
```

#### FRONTEND_URL

Frontend URL for CORS configuration (default: http://localhost:5173)

```
FRONTEND_URL=http://localhost:5173
```

#### LOG_REQUESTS

Enable request logging (default: false)

```
LOG_REQUESTS=true
```

#### LOG_ERRORS

Enable error logging (default: false)

```
LOG_ERRORS=true
```

## Setup Instructions

### 1. Copy Example File

```bash
cd server
cp .env.example .env
```

### 2. Edit .env File

Open `server/.env` in your editor and fill in the required values:

```bash
# Use your preferred editor
nano .env
# or
vim .env
# or
code .env
```

### 3. Update Values

Replace the placeholder values with your actual credentials:

```bash
# Before
DATABASE_URL=postgresql://postgres:password@localhost:5432/fitlog
OPENAI_API_KEY=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# After
DATABASE_URL=postgresql://myuser:mypass@localhost:5432/fitlog
OPENAI_API_KEY=sk-proj-abc123xyz789...
CLERK_PUBLISHABLE_KEY=pk_test_abc123xyz789...
CLERK_SECRET_KEY=sk_test_abc123xyz789...
```

### 4. Verify Configuration

Test that the server can read the environment variables:

```bash
cd server
npm run dev
```

You should see:
```
✓ DATABASE_URL found, length: XX
Server running on port 3000
```

## Database Setup

### Local PostgreSQL

1. **Install PostgreSQL**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql

   # macOS (with Homebrew)
   brew install postgresql

   # Windows
   # Download from https://www.postgresql.org/download/windows/
   ```

2. **Create Database**
   ```bash
   # Start PostgreSQL service
   sudo service postgresql start  # Linux
   brew services start postgresql # macOS

   # Create database
   createdb fitlog

   # Or using psql
   psql -U postgres
   CREATE DATABASE fitlog;
   \q
   ```

3. **Update DATABASE_URL**
   ```bash
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/fitlog
   ```

### Cloud Database (Recommended for Production)

#### Using Neon (Recommended)

1. Go to https://neon.tech
2. Sign up for free account
3. Create a new project
4. Copy the connection string
5. Add to `.env`:
   ```
   DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/fitlog?sslmode=require
   ```

#### Using Supabase

1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the "Connection string" (URI)
5. Replace `[YOUR-PASSWORD]` with your database password
6. Add to `.env`

#### Using Railway

1. Go to https://railway.app
2. Create a new project
3. Add a PostgreSQL database
4. Copy the `DATABASE_URL` from the environment variables
5. Add to `.env`

## Security Best Practices

### ⚠️ Important Security Notes

1. **Never commit .env files**
   - `.env` is in `.gitignore` - keep it that way!
   - Only commit `.env.example` with placeholder values

2. **Rotate keys regularly**
   - Change API keys every 3-6 months
   - Immediately rotate if compromised

3. **Use different keys for environments**
   - Development: `sk_test_...`, test database
   - Production: `sk_live_...`, production database

4. **Restrict API key permissions**
   - OpenAI: Set usage limits in dashboard
   - Clerk: Use separate keys for dev/prod

5. **Monitor usage**
   - Check OpenAI usage at https://platform.openai.com/usage
   - Check Clerk usage at https://dashboard.clerk.com

## Troubleshooting

### "DATABASE_URL environment variable is required but not found"

**Solution:**
1. Make sure `.env` file exists in `server/` directory
2. Check that `DATABASE_URL` is set in `.env`
3. Restart the server after editing `.env`

### "OpenAI API key not configured"

**Solution:**
1. Add `OPENAI_API_KEY` to `server/.env`
2. Verify the key is valid at https://platform.openai.com/api-keys
3. Check that key hasn't expired or been revoked

### "Invalid Clerk API key"

**Solution:**
1. Verify you're using the correct key (Secret Key, not Publishable Key)
2. Use `sk_test_` for development, not `sk_live_`
3. Check key at https://dashboard.clerk.com

### Database connection fails

**Solution:**
1. Verify PostgreSQL is running: `pg_isready`
2. Test connection: `psql $DATABASE_URL`
3. Check firewall/network settings
4. For cloud databases, ensure IP whitelisting is configured

### Port already in use

**Solution:**
1. Change `PORT` in `.env` to a different port (e.g., 3001)
2. Or kill the process using port 3000:
   ```bash
   # Linux/macOS
   lsof -ti:3000 | xargs kill -9

   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

## Environment Variables Checklist

Before running the server, ensure:

- [ ] `server/.env` file exists
- [ ] `DATABASE_URL` is set with valid PostgreSQL connection string
- [ ] Database exists and is accessible
- [ ] `OPENAI_API_KEY` is set (if using AI features)
- [ ] `CLERK_PUBLISHABLE_KEY` is set (if using authentication)
- [ ] `CLERK_SECRET_KEY` is set (if using authentication)
- [ ] `.env` is in `.gitignore` (should be by default)
- [ ] No secrets are committed to git

## Testing Environment Setup

To test that your environment is configured correctly:

```bash
cd server

# Run tests (uses test environment variables)
npm test

# Start development server
npm run dev
```

Expected output:
```
✓ DATABASE_URL found, length: XX
⚠️  OPENAI_API_KEY not found in environment variables (if not set)
Server running on port 3000
Database connected successfully
```

## Additional Resources

- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **OpenAI API Docs**: https://platform.openai.com/docs
- **Clerk Documentation**: https://clerk.com/docs
- **dotenv Documentation**: https://github.com/motdotla/dotenv

## Support

If you continue to have issues:

1. Check the error logs in the console
2. Verify all values in `.env` are correct
3. Try using the test environment first
4. Check that all dependencies are installed: `npm install`

---

*Last Updated: 2025-01-15*
