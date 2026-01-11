# BookMyAdvocate - Complete Setup & Deployment Guide

## ✅ Project Status: READY FOR PRODUCTION

### Current Setup
- **Backend**: Express.js with SQLite (sql.js)
- **Frontend**: React 18 with React Router
- **Database**: SQLite (database.sqlite)
- **Authentication**: JWT-based
- **Environment**: Ready for Vercel deployment

---

## 🚀 Running Locally

### Prerequisites
- Node.js 16+
- npm or yarn

### Start Servers
```bash
# Terminal 1 - Backend (Port 5000)
cd server
npm install
npm start

# Terminal 2 - Frontend (Port 3000)
cd client
npm install
npm start
```

**Access Application**: http://localhost:3000

---

## 🔐 Test Credentials

### Admin Account
- **Email**: admin@bookmyadvocate.com
- **Password**: admin123

### Regular User
- **Email**: john@example.com
- **Password**: password123

### Advocate User
- **Email**: rajesh@example.com
- **Password**: password123

---

## 📍 Sample Advocates Data

### Bangalore (8 Advocates)
1. **Priya Sharma** - Corporate Law (8 years) - ₹2,500/hr - Rating: 4.8★
2. **Arun Kumar** - Intellectual Property (10 years) - ₹3,000/hr - Rating: 4.9★
3. **Divya Singh** - Family Law (6 years) - ₹1,800/hr - Rating: 4.7★
4. **Vikram Reddy** - Labor Law (9 years) - ₹2,200/hr - Rating: 4.6★
5. **Anjali Gupta** - Tax Law (11 years) - ₹3,200/hr - Rating: 4.9★
6. **Rajesh Nair** - Real Estate Law (7 years) - ₹2,100/hr - Rating: 4.5★
7. **Neha Desai** - Constitutional Law (12 years) - ₹3,500/hr - Rating: 4.8★
8. **Rajesh Kumar** - Criminal Law (5 years) - ₹2,000/hr - Rating: 4.5★

### New Delhi (2 Advocates)
1. **Amrit Patel** - Criminal Law (15 years) - ₹2,800/hr - Rating: 4.7★
2. **Pooja Singh** - Civil Litigation (8 years) - ₹2,000/hr - Rating: 4.4★

### Mumbai (2 Advocates)
1. **Arjun Mehta** - Banking Law (9 years) - ₹2,600/hr - Rating: 4.6★
2. **Shreya Kapoor** - Merger & Acquisition (11 years) - ₹3,000/hr - Rating: 4.8★

### Hyderabad (2 Advocates)
1. **Nikhil Rao** - IT Law (7 years) - ₹2,300/hr - Rating: 4.5★
2. **Kavya Reddy** - Contract Law (6 years) - ₹1,900/hr - Rating: 4.3★

### Chennai (2 Advocates)
1. **Suresh Kumar** - Arbitration (13 years) - ₹3,100/hr - Rating: 4.7★
2. **Meera Iyer** - Property Rights (7 years) - ₹2,000/hr - Rating: 4.4★

### Kolkata (2 Advocates)
1. **Rajib Chatterjee** - Employment Law (10 years) - ₹2,400/hr - Rating: 4.5★
2. **Soumya Banerjee** - Environmental Law (8 years) - ₹2,100/hr - Rating: 4.6★

### Pune (1 Advocate)
1. **Vivek Jadhav** - Criminal Law (7 years) - ₹2,000/hr - Rating: 4.4★

**Total Advocates**: 20+ across India

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Advocates
- `GET /api/advocates` - List all advocates
- `GET /api/advocates/:id` - Get advocate details
- `POST /api/advocates/register` - Register as advocate

### Services
- `GET /api/services/advocate/:advocateId` - Get services by advocate
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user's bookings
- `GET /api/bookings/advocate-bookings` - Get advocate's bookings
- `PUT /api/bookings/:id/status` - Update booking status

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/booking/:bookingId` - Get review for booking

---

## 📦 Vercel Deployment

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub account
3. Import both repositories (server & client)

### Step 2: Deploy Backend
```bash
# In server directory
vercel deploy
```

**Backend URL**: https://bookmyadvocate-api.vercel.app

**Environment Variables to set on Vercel**:
```
NODE_ENV=production
JWT_SECRET=bookmyadvocate_jwt_secret_key_2024_vercel_deployment
DB_PATH=/tmp/database.sqlite
REACT_APP_API_URL=https://bookmyadvocate-api.vercel.app/api
```

### Step 3: Deploy Frontend
```bash
# In client directory
vercel deploy
```

Update `.env.production`:
```
REACT_APP_API_URL=https://bookmyadvocate-api.vercel.app/api
```

**Frontend URL**: https://bookmyadvocate-client.vercel.app

---

## 🔧 Environment Variables

### Server (.env)
```
PORT=5000
NODE_ENV=production
DB_PATH=./database.sqlite
JWT_SECRET=bookmyadvocate_jwt_secret_key_2024_vercel_deployment
```

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Client Production (.env.production)
```
REACT_APP_API_URL=https://bookmyadvocate-api.vercel.app/api
```

---

## 🗄️ Database Schema

### Users Table
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT)
- `email` (TEXT UNIQUE)
- `password` (TEXT)
- `phone` (TEXT)
- `role` (TEXT - 'user', 'advocate', 'admin')
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### Advocates Table
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER FOREIGN KEY)
- `specialization` (TEXT)
- `experience_years` (INTEGER)
- `location` (TEXT)
- `hourly_rate` (REAL)
- `rating` (REAL)
- `is_verified` (INTEGER BOOLEAN)
- `is_available` (INTEGER BOOLEAN)

### Services Table
- `id` (INTEGER PRIMARY KEY)
- `advocate_id` (INTEGER FOREIGN KEY)
- `title` (TEXT)
- `description` (TEXT)
- `service_type` (TEXT - 'online', 'offline', 'both')
- `price` (REAL)
- `duration_minutes` (INTEGER)

### Bookings Table
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER FOREIGN KEY)
- `advocate_id` (INTEGER FOREIGN KEY)
- `booking_date` (DATE)
- `booking_time` (TIME)
- `service_type` (TEXT)
- `status` (TEXT - 'pending', 'confirmed', 'completed', 'cancelled')
- `total_amount` (REAL)

### Reviews Table
- `id` (INTEGER PRIMARY KEY)
- `booking_id` (INTEGER FOREIGN KEY)
- `user_id` (INTEGER FOREIGN KEY)
- `advocate_id` (INTEGER FOREIGN KEY)
- `rating` (INTEGER 1-5)
- `comment` (TEXT)

---

## 🎯 Features Implemented

✅ User Authentication (JWT)
✅ User Registration & Login
✅ Advocate Search & Filter
✅ Advocate Profiles
✅ Service Management
✅ Booking System
✅ Review & Rating System
✅ Admin Dashboard
✅ User Dashboard
✅ Advocate Dashboard
✅ Responsive UI
✅ SQLite Database
✅ Vercel Ready

---

## 📱 Features to Use

### For Regular Users
1. Register/Login
2. Search advocates by location, specialization
3. View advocate profiles and services
4. Book services (online/offline)
5. Leave reviews and ratings
6. Track bookings

### For Advocates
1. Register as advocate
2. Create and manage services
3. View incoming bookings
4. Accept/Reject bookings
5. View reviews and ratings
6. Update profile information

### For Admin
1. View all users
2. View all advocates
3. Manage bookings
4. View statistics

---

## 🚨 Troubleshooting

### Login Not Working
- Check if `.env` file has `JWT_SECRET` set
- Verify database.sqlite exists
- Check browser console for error details

### Port Already in Use
```bash
# Kill process on port 5000
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Kill process on port 3000
npx kill-port 3000
```

### Database Issues
```bash
# Reinitialize database
rm server/database.sqlite
node server/config/initDb.js
```

---

## 📞 Support

For issues or questions:
1. Check the browser console (F12)
2. Check server logs
3. Verify environment variables are set correctly
4. Ensure both servers are running

---

**Last Updated**: January 11, 2026
**Version**: 1.0.0
**Status**: ✅ Production Ready
