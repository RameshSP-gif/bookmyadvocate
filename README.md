# BookMyAdvocate - Full Stack Application

A comprehensive platform for booking legal advocate services with React frontend, Express backend, and MySQL database.

## Features

### For Users
- 🔐 Register and login
- 🔍 Search advocates by specialization, location, and ratings
- 📅 Book appointments (online and offline)
- ⭐ Rate and review advocates
- 📊 Track booking history

### For Advocates
- 📝 Create professional profile
- 💼 Post and manage services
- 📅 Manage bookings and appointments
- 💰 Set pricing for services
- 🎯 Toggle availability status

### For Admin
- 📊 Comprehensive dashboard
- 👥 Manage users and advocates
- ✅ Verify advocates
- 📈 View statistics and analytics
- 🗂️ Manage all bookings

## Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Express.js, Node.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone or Download the Project

```bash
cd BookMyAdvocate
```

### 2. Setup MySQL Database

**Option A: Using MySQL Workbench or Command Line**

1. Start MySQL server
2. Open MySQL command line or Workbench
3. Create a database:
```sql
CREATE DATABASE bookmyadvocate;
```

**Option B: Using XAMPP**

1. Start XAMPP Control Panel
2. Start Apache and MySQL services
3. Open phpMyAdmin (http://localhost/phpmyadmin)
4. Create database `bookmyadvocate`

### 3. Configure Backend

1. Navigate to server folder:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Open `.env` file in the `server` folder
   - Update the MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bookmyadvocate
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

4. Initialize the database (creates tables and admin user):
```bash
npm run init-db
```

This will create all necessary tables and a default admin user:
- Email: `admin@bookmyadvocate.com`
- Password: `admin123`

5. Start the backend server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on http://localhost:5000

### 4. Configure Frontend

1. Open a new terminal and navigate to client folder:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on http://localhost:3000

## Default Credentials

After running `npm run init-db` in the server folder:

**Admin Account:**
- Email: `admin@bookmyadvocate.com`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user/advocate
- `POST /api/auth/login` - Login

### Advocates
- `GET /api/advocates` - Get all advocates (with search/filters)
- `GET /api/advocates/:id` - Get advocate details
- `PUT /api/advocates/profile` - Update advocate profile
- `GET /api/advocates/me/profile` - Get own profile
- `PATCH /api/advocates/availability` - Toggle availability

### Services
- `GET /api/services/advocate/:advocateId` - Get services by advocate
- `GET /api/services/my-services` - Get own services
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/advocate-bookings` - Get advocate bookings
- `PATCH /api/bookings/:id/status` - Update booking status
- `PATCH /api/bookings/:id/cancel` - Cancel booking
- `GET /api/bookings/:id` - Get booking details

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/advocate/:advocateId` - Get advocate reviews

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/advocates` - Get all advocates
- `PATCH /api/admin/advocates/:id/verify` - Verify advocate
- `GET /api/admin/bookings` - Get all bookings
- `DELETE /api/admin/users/:id` - Delete user

## Project Structure

```
BookMyAdvocate/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React Context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                # Express backend
│   ├── config/
│   │   ├── db.js         # Database connection
│   │   └── initDb.js     # Database initialization
│   ├── middleware/
│   │   └── auth.js       # Authentication middleware
│   ├── routes/
│   │   ├── auth.js
│   │   ├── advocates.js
│   │   ├── services.js
│   │   ├── bookings.js
│   │   ├── reviews.js
│   │   └── admin.js
│   ├── .env              # Environment variables
│   ├── server.js         # Main server file
│   └── package.json
│
└── README.md
```

## Database Schema

### Tables
1. **users** - User accounts (user, advocate, admin)
2. **advocates** - Advocate profiles and details
3. **services** - Services offered by advocates
4. **bookings** - Appointment bookings
5. **reviews** - User reviews for advocates

## Troubleshooting

### MySQL Connection Error
If you see `ER_ACCESS_DENIED_ERROR`:
1. Check your MySQL username and password in `.env`
2. Make sure MySQL server is running
3. Verify the database exists: `CREATE DATABASE bookmyadvocate;`

### Port Already in Use
If port 5000 or 3000 is already in use:
1. Change `PORT` in `server/.env`
2. Update proxy in `client/package.json`

### Database Initialization Fails
1. Make sure MySQL is running
2. Check database credentials in `.env`
3. Drop and recreate database if needed:
```sql
DROP DATABASE IF EXISTS bookmyadvocate;
CREATE DATABASE bookmyadvocate;
```

## Usage Flow

### For Users:
1. Register as a User
2. Browse advocates by search/filter
3. View advocate profiles and services
4. Book an appointment (online/offline)
5. After completion, leave a review

### For Advocates:
1. Register as an Advocate
2. Complete your profile (specialization, experience, etc.)
3. Add your services with pricing
4. Manage incoming bookings
5. Update booking status

### For Admin:
1. Login with admin credentials
2. View dashboard statistics
3. Verify advocates
4. Manage users and bookings
5. Monitor platform activity

## Development

### Backend Development
```bash
cd server
npm run dev  # Runs with nodemon for auto-reload
```

### Frontend Development
```bash
cd client
npm start    # Runs React development server
```

## Production Deployment

1. Update `.env` with production credentials
2. Build the React app:
```bash
cd client
npm run build
```

3. Serve the build folder with Express or use a hosting service
4. Set up production MySQL database
5. Use environment variables for sensitive data
6. Enable HTTPS

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
