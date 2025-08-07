import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { userId: number } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch {
    return null;
  }
};

export const createUser = async (email: string, password: string): Promise<User> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = getDatabase();
      const hashedPassword = await hashPassword(password);
      
      db.run(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          db.get(
            'SELECT id, email, created_at FROM users WHERE id = ?',
            [this.lastID],
            (err, row) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(row as User);
            }
          );
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

export const getUserByEmail = async (email: string): Promise<User & { password: string } | null> => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    db.get(
      'SELECT id, email, password, created_at FROM users WHERE email = ?',
      [email],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row as User & { password: string } | null);
      }
    );
  });
};

export const getUserById = async (id: number): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    const db = getDatabase();
    
    db.get(
      'SELECT id, email, created_at FROM users WHERE id = ?',
      [id],
      (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row as User | null);
      }
    );
  });
}; 