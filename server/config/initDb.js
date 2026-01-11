const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function initializeDatabase() {
  try {
    // Initialize SQL.js
    const SQL = await initSqlJs();
    
    // Create database file path
    const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite');
    
    // Create new database
    const db = new SQL.Database();

    console.log('Connected to SQLite database');

    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');

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
    console.log('Users table created');

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
    console.log('Advocates table created');

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
    console.log('Services table created');

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
    console.log('Bookings table created');

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
    console.log('Reviews table created');

    // Create triggers for updated_at
    const tables = ['users', 'advocates', 'services', 'bookings'];
    tables.forEach(table => {
      db.run(`
        CREATE TRIGGER IF NOT EXISTS ${table}_updated_at
        AFTER UPDATE ON ${table}
        FOR EACH ROW
        BEGIN
          UPDATE ${table} SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END
      `);
    });
    console.log('Update triggers created');

    // Create test users
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('password123', 10);
    const advocatePassword = await bcrypt.hash('password123', 10);
    
    // Insert admin user
    db.run(`
      INSERT OR IGNORE INTO users (name, email, password, role, phone)
      VALUES (?, ?, ?, ?, ?)
    `, ['Admin User', 'admin@bookmyadvocate.com', adminPassword, 'admin', '9999999999']);
    console.log('Admin user created (email: admin@bookmyadvocate.com, password: admin123)');

    // Insert regular user
    db.run(`
      INSERT OR IGNORE INTO users (name, email, password, role, phone)
      VALUES (?, ?, ?, ?, ?)
    `, ['John Doe', 'john@example.com', userPassword, 'user', '9876543210']);
    console.log('Regular user created (email: john@example.com, password: password123)');

    // Insert advocate user
    db.run(`
      INSERT OR IGNORE INTO users (name, email, password, role, phone)
      VALUES (?, ?, ?, ?, ?)
    `, ['Rajesh Kumar', 'rajesh@example.com', advocatePassword, 'advocate', '9123456789']);
    console.log('Advocate user created (email: rajesh@example.com, password: password123)');

    // Get advocate user ID and create advocate profile
    const advocateUserResult = db.exec(`SELECT id FROM users WHERE email = 'rajesh@example.com'`);
    if (advocateUserResult.length > 0 && advocateUserResult[0].values.length > 0) {
      const advocateUserId = advocateUserResult[0].values[0][0];
      db.run(`
        INSERT OR IGNORE INTO advocates (user_id, specialization, experience_years, location, is_verified, is_available)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [advocateUserId, 'Criminal Law', 5, 'New Delhi', 1, 1]);
      console.log('Advocate profile created for Rajesh Kumar');
    }

    // Save database to file
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
    
    db.close();
    console.log('Database saved to:', dbPath);
    console.log('Database initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initializeDatabase();
