import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase, User } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface UserWithPassword extends User {
  password: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
};

export const createUser = async (email: string, password: string): Promise<User> => {
  try {
    const hashedPassword = await hashPassword(password);
    
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword
        }
      ])
      .select('id, email, created_at')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No data returned from user creation');
    }

    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email: string): Promise<UserWithPassword | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, password, created_at')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Supabase error in getUserByEmail:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, created_at')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}; 