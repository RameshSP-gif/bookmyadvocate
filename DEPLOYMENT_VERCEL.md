# Vercel Deployment Guide - BookMyAdvocate

## Prerequisites
- GitHub account (for connecting repository)
- Vercel account (https://vercel.com)
- Project pushed to GitHub

## Deployment Steps

### 1. Prepare Repository for Deployment

The project is already configured with:
- ✅ SQLite database (works on Vercel without external dependencies)
- ✅ Environment variables configured
- ✅ Vercel configuration files created
- ✅ Production-ready setup

### 2. Deploy Backend to Vercel

**Backend URL**: `https://bookmyadvocate-api.vercel.app`

1. Go to https://vercel.com/import
2. Connect your GitHub repository
3. Select the `server` folder as the root
4. Add environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=bookmyadvocate_jwt_secret_key_2024_vercel_deployment
   DB_PATH=/tmp/database.sqlite
   ```
5. Click "Deploy"

### 3. Deploy Frontend to Vercel

**Frontend URL**: `https://bookmyadvocate.vercel.app`

1. Go to https://vercel.com/import
2. Connect your GitHub repository
3. Select the `client` folder as the root
4. Add environment variables:
   ```
   REACT_APP_API_URL=https://bookmyadvocate-api.vercel.app/api
   ```
5. Click "Deploy"

## Database on Vercel

The SQLite database automatically:
- Initializes on first server start
- Creates all required tables
- Seeds test data (admin, user, advocate)
- Persists to `/tmp/database.sqlite` on Vercel

**Test Credentials**:
- Admin: `admin@bookmyadvocate.com` / `admin123`
- User: `john@example.com` / `password123`
- Advocate: `rajesh@example.com` / `password123`

## Local Testing

Both servers running locally:
- **Backend**: http://localhost:5000/api
- **Frontend**: http://localhost:3000

## Key Configuration Files

### Server Configuration
- `.env` - Local development variables
- `.env.production` - Production variables
- `vercel.json` - Vercel build configuration
- `config/db.js` - SQLite database setup with auto-initialization

### Client Configuration
- `.env` - Local API endpoint
- `.env.production` - Production API endpoint
- `vercel.json` - React build configuration

## Troubleshooting

### Login Not Working
- Ensure `JWT_SECRET` environment variable is set
- Check that database has initialized with test users
- Verify backend API is running and accessible

### Database Issues
- Database auto-initializes on first run
- Test users are seeded automatically
- Uses SQLite (no external DB needed)

### CORS Issues
- Backend CORS is configured to accept all origins
- Frontend API URL must match backend deployment URL

## Important Notes

1. **Database Persistence**: SQLite database is stored in `/tmp` on Vercel, which is reset on redeploy
2. **JWT Secret**: Change the JWT_SECRET in production to a unique, secure value
3. **API URL**: Update `REACT_APP_API_URL` in client when backend URL changes
4. **Build Settings**: Use default npm build commands

## Git Workflow

1. Push changes to GitHub
2. Vercel automatically deploys on push
3. Check deployment status in Vercel dashboard
4. Test at deployed URLs

## Environment Variables Summary

### Backend (Server)
| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_ENV` | `production` | Runtime environment |
| `JWT_SECRET` | `[secure key]` | JWT token signing |
| `DB_PATH` | `/tmp/database.sqlite` | Database file location |
| `PORT` | `3001` | Server port (Vercel) |

### Frontend (Client)
| Variable | Value | Purpose |
|----------|-------|---------|
| `REACT_APP_API_URL` | `https://bookmyadvocate-api.vercel.app/api` | Backend API endpoint |

## Support

For issues:
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Test backend health: `GET /api/health`
4. Check browser console for client errors
