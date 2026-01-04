const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create database file path
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'database.sqlite');

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
      // Create new database
      db = new SQL.Database();
    }
    
    // Enable foreign keys
    db.run('PRAGMA foreign_keys = ON');
  } catch (error) {
    console.error('Error initializing database:', error);
    db = new SQL.Database();
  }
  
  return db;
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
