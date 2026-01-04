# Vercel Deployment Guide

## Overview
This guide will help you deploy both the frontend (React) and backend (Express) of BookMyAdvocate on Vercel.

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub repository with your code
- MySQL database (PlanetScale, Railway, AWS RDS, or other cloud MySQL provider)

## Step 1: Set Up Database

You'll need a cloud-hosted MySQL database since Vercel is serverless. Options:

### Option A: PlanetScale (Recommended)
1. Sign up at https://planetscale.com
2. Create a new database
3. Get connection details (host, username, password, database name)

### Option B: Railway
1. Sign up at https://railway.app
2. Create a new MySQL database
3. Get connection details from the Connect tab

### Option C: AWS RDS
1. Create a MySQL instance on AWS RDS
2. Configure security groups to allow connections
3. Get connection details

## Step 2: Deploy Backend (Express API)

1. **Install Vercel CLI** (optional but recommended):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to server folder**:
   ```bash
   cd server
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   Or use the Vercel dashboard:
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Set Root Directory to `server`
   - Click Deploy

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add the following variables:
     ```
     DB_HOST=your_database_host
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     DB_NAME=bookmyadvocate
     JWT_SECRET=your_secure_random_string
     NODE_ENV=production
     ```

5. **Note your backend URL**: `https://your-backend.vercel.app`

## Step 3: Initialize Database

Run the database setup script with your cloud database credentials:

```bash
cd server
node config/initDb.js
```

Make sure your `.env` file has the correct database credentials before running this.

## Step 4: Deploy Frontend (React App)

1. **Navigate to client folder**:
   ```bash
   cd ../client
   ```

2. **Create `.env.production` file**:
   ```bash
   REACT_APP_API_URL=https://your-backend.vercel.app/api
   ```
   Replace `your-backend.vercel.app` with your actual backend URL from Step 2.

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```
   Or use the Vercel dashboard:
   - Go to https://vercel.com/dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Set Root Directory to `client`
   - Click Deploy

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add:
     ```
     REACT_APP_API_URL=https://your-backend.vercel.app/api
     ```

5. **Redeploy** if needed after setting environment variables.

## Step 5: Configure CORS

Update your backend CORS settings if needed. The current configuration allows all origins, but you can restrict it to your frontend URL:

```javascript
// In server/server.js
app.use(cors({
  origin: 'https://your-frontend.vercel.app',
  credentials: true
}));
```

## Deployment via GitHub (Recommended)

For automatic deployments on every push:

1. **Connect Repository to Vercel**:
   - Go to Vercel Dashboard
   - Click "Add New Project"
   - Import your GitHub repository
   - Create two separate projects:
     - One for `client` folder (frontend)
     - One for `server` folder (backend)

2. **Configure Build Settings**:
   
   **Frontend Project**:
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
   
   **Backend Project**:
   - Root Directory: `server`
   - Build Command: (leave empty)
   - Output Directory: (leave empty)

3. **Set Environment Variables** for both projects as described above.

4. **Enable Auto-Deploy**:
   - By default, Vercel will auto-deploy on every push to main branch
   - You can configure this in Project Settings → Git

## Troubleshooting

### Backend Issues

**Error: Cannot connect to database**
- Verify database credentials in Vercel environment variables
- Check if database allows connections from Vercel IPs (0.0.0.0/0)
- Ensure database is online and accessible

**Error: Module not found**
- Make sure all dependencies are in `package.json`
- Redeploy the backend

### Frontend Issues

**Error: API calls fail**
- Verify `REACT_APP_API_URL` is set correctly
- Check browser console for CORS errors
- Ensure backend is deployed and accessible

**Error: Environment variables not working**
- Environment variables must start with `REACT_APP_`
- Redeploy after changing environment variables
- Clear cache and hard reload browser

### General Issues

**Deployment fails**
- Check Vercel deployment logs for specific errors
- Ensure `vercel.json` files are present
- Verify Node.js version compatibility

## Testing Your Deployment

1. **Test Backend**:
   ```bash
   curl https://your-backend.vercel.app/api/health
   ```

2. **Test Frontend**:
   - Open `https://your-frontend.vercel.app` in browser
   - Try registering a new user
   - Test login functionality
   - Check browser console for any errors

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions
4. Update CORS and environment variables if needed

## Continuous Deployment

Once connected to GitHub:
- Push to main branch → auto-deploys to production
- Push to other branches → creates preview deployments
- Pull requests → creates preview deployments

## Security Recommendations

1. **Use strong JWT_SECRET**: Generate a secure random string
2. **Enable CORS properly**: Restrict to your frontend domain
3. **Use HTTPS**: Vercel provides this by default
4. **Database security**: Use strong passwords and restrict IPs
5. **Environment variables**: Never commit `.env` files to Git
6. **Rate limiting**: Consider adding rate limiting middleware

## Cost Considerations

- Vercel Free tier includes:
  - Unlimited deployments
  - 100 GB bandwidth per month
  - Serverless function execution (limited)
  
- Database hosting will have separate costs depending on provider

## Support

- Vercel Documentation: https://vercel.com/docs
- Vercel Community: https://github.com/vercel/vercel/discussions
- PlanetScale Docs: https://planetscale.com/docs

## Quick Commands Reference

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy current directory
vercel

# Deploy to production
vercel --prod

# Check deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel remove
```
