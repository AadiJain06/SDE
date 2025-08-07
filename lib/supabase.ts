import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bmspahfdjdqhafpukygj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtc3BhaGZkamRxaGFmcHVreWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1OTI0NjIsImV4cCI6MjA3MDE2ODQ2Mn0.NYKlzmVJG3WAGYVqmo8CbJOMBXTEcHEffYAFxFbIfgc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  db: {
    schema: 'public'
  },
  // Bypass RLS for custom authentication
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Database types
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  parent_id?: string;
  created_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  url: string;
  title: string;
  favicon: string;
  summary: string;
  tags: string;
  category_id?: string;
  created_at: string;
}
