const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bmspahfdjdqhafpukygj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtc3BhaGZkamRxaGFmcHVreWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1OTI0NjIsImV4cCI6MjA3MDE2ODQ2Mn0.NYKlzmVJG3WAGYVqmo8CbJOMBXTEcHEffYAFxFbIfgc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fixRLS() {
  try {
    console.log('Fixing RLS policies...');
    
    // Test if we can connect and run SQL
    const { data, error } = await supabase
      .rpc('exec_sql', {
        sql: `
          -- Drop existing RLS policies
          DROP POLICY IF EXISTS "Users can view their own data" ON users;
          DROP POLICY IF EXISTS "Users can insert their own data" ON users;
          DROP POLICY IF EXISTS "Users can view their own bookmarks" ON bookmarks;
          DROP POLICY IF EXISTS "Users can insert their own bookmarks" ON bookmarks;
          DROP POLICY IF EXISTS "Users can update their own bookmarks" ON bookmarks;
          DROP POLICY IF EXISTS "Users can delete their own bookmarks" ON bookmarks;

          -- Disable RLS for now since we're using custom JWT authentication
          ALTER TABLE users DISABLE ROW LEVEL SECURITY;
          ALTER TABLE bookmarks DISABLE ROW LEVEL SECURITY;
        `
      });

    if (error) {
      console.error('❌ Failed to fix RLS:', error);
    } else {
      console.log('✅ RLS policies fixed successfully!');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixRLS();
