const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create database file path - use /tmp for Vercel, local for development
const dbPath = process.env.DB_PATH || (
  process.env.NODE_ENV === 'production' 
    ? '/tmp/database.sqlite' 
    : path.join(__dirname, '..', 'database.sqlite')
);

let db = null;
let SQL = null;

// Initialize database
async function initDatabase() {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  
  try {
    // Load existing database if it exists
    if (fs.existsSync(dbPath)) {
      const buffer = fs.readFileSync(dbPath);
      db = new SQL.Database(buffer);
    } else {
      // Create new database and initialize with tables and seed data
      db = new SQL.Database();
      await initializeTables();
    }
    
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
  } catch (error) {
    console.error('Error initializing database:', error);
    db = new SQL.Database();
    await initializeTables();
  }
  
  return db;
}

// Initialize tables and seed data
async function initializeTables() {
  const bcrypt = require('bcryptjs');
  
  // Create users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'user' CHECK(role IN ('user', 'advocate', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create advocates table
  db.run(`
    CREATE TABLE IF NOT EXISTS advocates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      specialization TEXT,
      experience_years INTEGER,
      bar_council_number TEXT UNIQUE,
      license_number TEXT,
      location TEXT,
      bio TEXT,
      hourly_rate REAL,
      rating REAL DEFAULT 0.00,
      total_reviews INTEGER DEFAULT 0,
      is_verified INTEGER DEFAULT 0,
      is_available INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create services table
  db.run(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      advocate_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      service_type TEXT DEFAULT 'both' CHECK(service_type IN ('online', 'offline', 'both')),
      category TEXT,
      price REAL,
      duration_minutes INTEGER,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (advocate_id) REFERENCES advocates(id) ON DELETE CASCADE
    )
  `);

  // Create bookings table
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      advocate_id INTEGER NOT NULL,
      service_id INTEGER,
      booking_date DATE NOT NULL,
      booking_time TIME NOT NULL,
      service_type TEXT NOT NULL CHECK(service_type IN ('online', 'offline')),
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
      payment_status TEXT DEFAULT 'pending' CHECK(payment_status IN ('pending', 'paid', 'refunded')),
      total_amount REAL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (advocate_id) REFERENCES advocates(id) ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
    )
  `);

  // Create reviews table
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id INTEGER UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      advocate_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (advocate_id) REFERENCES advocates(id) ON DELETE CASCADE
    )
  `);

  // Seed test users
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('password123', 10);
  const advocatePassword = await bcrypt.hash('password123', 10);
  
  db.run(`
    INSERT OR IGNORE INTO users (name, email, password, role, phone)
    VALUES (?, ?, ?, ?, ?)
  `, ['Admin User', 'admin@bookmyadvocate.com', adminPassword, 'admin', '9999999999']);

  db.run(`
    INSERT OR IGNORE INTO users (name, email, password, role, phone)
    VALUES (?, ?, ?, ?, ?)
  `, ['John Doe', 'john@example.com', userPassword, 'user', '9876543210']);

  db.run(`
    INSERT OR IGNORE INTO users (name, email, password, role, phone)
    VALUES (?, ?, ?, ?, ?)
  `, ['Rajesh Kumar', 'rajesh@example.com', advocatePassword, 'advocate', '9123456789']);

  // Get advocate user ID and create advocate profile
  const advocateUserResult = db.exec(`SELECT id FROM users WHERE email = 'rajesh@example.com'`);
  if (advocateUserResult.length > 0 && advocateUserResult[0].values.length > 0) {
    const advocateUserId = advocateUserResult[0].values[0][0];
    db.run(`
      INSERT OR IGNORE INTO advocates (user_id, specialization, experience_years, location, is_verified, is_available, hourly_rate, rating)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [advocateUserId, 'Criminal Law', 5, 'New Delhi', 1, 1, 2000, 4.5]);
  }

  // Add more advocate users and profiles
  const advocatesData = [
    // Bangalore Advocates
    { name: 'Priya Sharma', email: 'priya.sharma@advocates.com', specialization: 'Corporate Law', experience: 8, location: 'Bangalore', hourly_rate: 2500, rating: 4.8 },
    { name: 'Arun Kumar', email: 'arun.kumar@advocates.com', specialization: 'Intellectual Property', experience: 10, location: 'Bangalore', hourly_rate: 3000, rating: 4.9 },
    { name: 'Divya Singh', email: 'divya.singh@advocates.com', specialization: 'Family Law', experience: 6, location: 'Bangalore', hourly_rate: 1800, rating: 4.7 },
    { name: 'Vikram Reddy', email: 'vikram.reddy@advocates.com', specialization: 'Labor Law', experience: 9, location: 'Bangalore', hourly_rate: 2200, rating: 4.6 },
    { name: 'Anjali Gupta', email: 'anjali.gupta@advocates.com', specialization: 'Tax Law', experience: 11, location: 'Bangalore', hourly_rate: 3200, rating: 4.9 },
    { name: 'Rajesh Nair', email: 'rajesh.nair@advocates.com', specialization: 'Real Estate Law', experience: 7, location: 'Bangalore', hourly_rate: 2100, rating: 4.5 },
    { name: 'Neha Desai', email: 'neha.desai@advocates.com', specialization: 'Constitutional Law', experience: 12, location: 'Bangalore', hourly_rate: 3500, rating: 4.8 },
    
    // Delhi Advocates
    { name: 'Amrit Patel', email: 'amrit.patel@advocates.com', specialization: 'Criminal Law', experience: 15, location: 'New Delhi', hourly_rate: 2800, rating: 4.7 },
    { name: 'Pooja Singh', email: 'pooja.singh@advocates.com', specialization: 'Civil Litigation', experience: 8, location: 'New Delhi', hourly_rate: 2000, rating: 4.4 },
    
    // Mumbai Advocates
    { name: 'Arjun Mehta', email: 'arjun.mehta@advocates.com', specialization: 'Banking Law', experience: 9, location: 'Mumbai', hourly_rate: 2600, rating: 4.6 },
    { name: 'Shreya Kapoor', email: 'shreya.kapoor@advocates.com', specialization: 'Merger & Acquisition', experience: 11, location: 'Mumbai', hourly_rate: 3000, rating: 4.8 },
    
    // Hyderabad Advocates
    { name: 'Nikhil Rao', email: 'nikhil.rao@advocates.com', specialization: 'IT Law', experience: 7, location: 'Hyderabad', hourly_rate: 2300, rating: 4.5 },
    { name: 'Kavya Reddy', email: 'kavya.reddy@advocates.com', specialization: 'Contract Law', experience: 6, location: 'Hyderabad', hourly_rate: 1900, rating: 4.3 },
    
    // Chennai Advocates
    { name: 'Suresh Kumar', email: 'suresh.kumar@advocates.com', specialization: 'Arbitration', experience: 13, location: 'Chennai', hourly_rate: 3100, rating: 4.7 },
    { name: 'Meera Iyer', email: 'meera.iyer@advocates.com', specialization: 'Property Rights', experience: 7, location: 'Chennai', hourly_rate: 2000, rating: 4.4 },
    
    // Kolkata Advocates
    { name: 'Rajib Chatterjee', email: 'rajib.chatterjee@advocates.com', specialization: 'Employment Law', experience: 10, location: 'Kolkata', hourly_rate: 2400, rating: 4.5 },
    { name: 'Soumya Banerjee', email: 'soumya.banerjee@advocates.com', specialization: 'Environmental Law', experience: 8, location: 'Kolkata', hourly_rate: 2100, rating: 4.6 },
    
    // Pune Advocates
    { name: 'Vivek Jadhav', email: 'vivek.jadhav@advocates.com', specialization: 'Criminal Law', experience: 7, location: 'Pune', hourly_rate: 2000, rating: 4.4 },
  ];

  for (const advocate of advocatesData) {
    const hashedPass = await bcrypt.hash('password123', 10);
    
    // Insert advocate user
    db.run(`
      INSERT OR IGNORE INTO users (name, email, password, role, phone)
      VALUES (?, ?, ?, ?, ?)
    `, [advocate.name, advocate.email, hashedPass, 'advocate', '9' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0')]);

    // Get the advocate user ID and create advocate profile
    const result = db.exec(`SELECT id FROM users WHERE email = '${advocate.email}'`);
    if (result.length > 0 && result[0].values.length > 0) {
      const userId = result[0].values[0][0];
      db.run(`
        INSERT OR IGNORE INTO advocates (user_id, specialization, experience_years, location, is_verified, is_available, hourly_rate, rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [userId, advocate.specialization, advocate.experience, advocate.location, 1, 1, advocate.hourly_rate, advocate.rating]);

      // Add services for each advocate
      const services = [
        { title: 'Consultation', description: 'Initial case consultation', service_type: 'online', category: 'Consultation', price: advocate.hourly_rate, duration: 30 },
        { title: 'Case Review', description: 'Detailed case review and strategy', service_type: 'both', category: 'Review', price: advocate.hourly_rate * 2, duration: 60 },
        { title: 'Representation', description: 'Court representation and appearance', service_type: 'offline', category: 'Representation', price: advocate.hourly_rate * 3, duration: 120 },
      ];

      for (const service of services) {
        db.run(`
          INSERT OR IGNORE INTO services (advocate_id, title, description, service_type, category, price, duration_minutes, is_active)
          VALUES (
            (SELECT id FROM advocates WHERE user_id = ?),
            ?, ?, ?, ?, ?, ?, ?
          )
        `, [userId, service.title, service.description, service.service_type, service.category, service.price, service.duration, 1]);
      }
    }
  }

  saveDatabase();
}

// Save database to file
function saveDatabase() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }
}

// Helper function for database operations
const dbAsync = {
  query: async (sql, params = []) => {
    if (!db) await initDatabase();
    
    try {
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const results = db.exec(sql, params);
        if (results.length === 0) return [[]];
        
        const columns = results[0].columns;
        const values = results[0].values;
        const rows = values.map(row => {
          const obj = {};
          columns.forEach((col, idx) => {
            obj[col] = row[idx];
          });
          return obj;
        });
        return [rows];
      } else {
        db.run(sql, params);
        saveDatabase();
        const lastId = db.exec("SELECT last_insert_rowid() as id")[0]?.values[0]?.[0] || 0;
        const changes = db.getRowsModified();
        return [{ insertId: lastId, affectedRows: changes }];
      }
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
  execute: async (sql, params = []) => {
    return dbAsync.query(sql, params);
  }
};

// Initialize on first import
initDatabase();

module.exports = dbAsync;
