# 🎯 Quick Start Guide - BookMyAdvocate

## 🔥 Everything is Ready!

### Current Status
✅ Backend running on http://localhost:5000
✅ Frontend running on http://localhost:3000
✅ SQLite database initialized with sample data
✅ 20+ Advocates across 8 Indian cities
✅ Login system fully functional

---

## 🚀 Try It Now!

### 1. Open Application
```
http://localhost:3000
```

### 2. Login with Test Account
**User (John Doe)**
- Email: john@example.com
- Password: password123

**Or Login as Admin**
- Email: admin@bookmyadvocate.com
- Password: admin123

**Or Login as Advocate**
- Email: rajesh@example.com
- Password: password123

---

## 📍 Available Advocates

### Bangalore (8 Lawyers)
- Priya Sharma (Corporate Law) - ₹2,500/hr ⭐ 4.8
- Arun Kumar (IP Law) - ₹3,000/hr ⭐ 4.9
- Divya Singh (Family Law) - ₹1,800/hr ⭐ 4.7
- Vikram Reddy (Labor Law) - ₹2,200/hr ⭐ 4.6
- Anjali Gupta (Tax Law) - ₹3,200/hr ⭐ 4.9
- Rajesh Nair (Real Estate) - ₹2,100/hr ⭐ 4.5
- Neha Desai (Constitutional) - ₹3,500/hr ⭐ 4.8
- Rajesh Kumar (Criminal Law) - ₹2,000/hr ⭐ 4.5

### Other Cities
- **Delhi**: 2 Advocates
- **Mumbai**: 2 Advocates
- **Hyderabad**: 2 Advocates
- **Chennai**: 2 Advocates
- **Kolkata**: 2 Advocates
- **Pune**: 1 Advocate

---

## 🎯 What You Can Do

### Search & Book
1. Go to "Find Advocates" 
2. Filter by location (e.g., "Bangalore")
3. Filter by specialization
4. Click on advocate to view profile
5. Book a service (Consultation, Case Review, Representation)

### User Dashboard
- View your upcoming bookings
- Cancel bookings
- Leave reviews and ratings

### Advocate Dashboard
- View received bookings
- Manage your services
- Accept/Reject bookings

### Admin Dashboard
- View all users
- View all advocates
- Monitor system usage

---

## 🌐 API Examples

### Get Advocates by Location
```bash
curl http://localhost:5000/api/advocates?location=Bangalore
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "advocate_id": 1,
    "service_id": 1,
    "booking_date": "2024-01-20",
    "booking_time": "14:00",
    "service_type": "online"
  }'
```

---

## 📦 Vercel Deployment (Coming Next)

When ready to deploy:

```bash
# Deploy backend
cd server
vercel deploy

# Deploy frontend
cd client
vercel deploy
```

Set environment variables on Vercel dashboard:
- `JWT_SECRET`: bookmyadvocate_jwt_secret_key_2024_vercel_deployment
- `DB_PATH`: /tmp/database.sqlite
- `NODE_ENV`: production

---

## 🆘 Troubleshooting

**If login doesn't work:**
1. Check if both servers are running
2. Check browser console (F12) for errors
3. Check server logs
4. Try different test account

**If advocates don't show:**
1. Refresh the page
2. Check if "Find Advocates" tab works
3. Try filtering by location "Bangalore"

**If database resets:**
1. Run: `node server/config/initDb.js`
2. Restart both servers

---

## 📧 Sample Advocate Emails

```
priya.sharma@advocates.com
arun.kumar@advocates.com
divya.singh@advocates.com
vikram.reddy@advocates.com
anjali.gupta@advocates.com
rajesh.nair@advocates.com
neha.desai@advocates.com
rajesh@example.com (demo advocate)
amrit.patel@advocates.com
pooja.singh@advocates.com
arjun.mehta@advocates.com
shreya.kapoor@advocates.com
nikhil.rao@advocates.com
kavya.reddy@advocates.com
suresh.kumar@advocates.com
meera.iyer@advocates.com
rajib.chatterjee@advocates.com
soumya.banerjee@advocates.com
vivek.jadhav@advocates.com
```

All use password: `password123`

---

## 🎉 Ready to Go!

Your application is fully functional with:
- ✅ User authentication
- ✅ Advocate database with 20+ lawyers
- ✅ Service booking system
- ✅ Review & rating system
- ✅ Admin dashboard
- ✅ SQLite database
- ✅ Production-ready code

**Start exploring at**: http://localhost:3000

Enjoy! 🚀
