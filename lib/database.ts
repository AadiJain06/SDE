import sqlite3 from 'sqlite3';
import path from 'path';

// Use /tmp directory for Render deployment or current directory for local development
const dbPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/database.sqlite' 
  : path.join(process.cwd(), 'database.sqlite');

export const initDatabase = () => {
  return new Promise<sqlite3.Database>((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create bookmarks table
      db.run(`
        CREATE TABLE IF NOT EXISTS bookmarks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          url TEXT NOT NULL,
          title TEXT,
          favicon TEXT,
          summary TEXT,
          tags TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);

      resolve(db);
    });
  });
};

export const getDatabase = () => {
  return new sqlite3.Database(dbPath);
}; 