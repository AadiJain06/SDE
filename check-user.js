const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://bmspahfdjdqhafpukygj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtc3BhaGZkamRxaGFmcHVreWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1OTI0NjIsImV4cCI6MjA3MDE2ODQ2Mn0.NYKlzmVJG3WAGYVqmo8CbJOMBXTEcHEffYAFxFbIfgc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkAndCreateUser() {
  try {
    // Check if any users exist
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (usersError) {
      console.error('Error checking users:', usersError);
      return;
    }

    console.log('Existing users:', users);

    if (!users || users.length === 0) {
      console.log('No users found. Creating a test user...');
      
      // Create a test user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            email: 'test@example.com',
            password: 'hashedpassword123' // This should be properly hashed in real app
          }
        ])
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return;
      }

      console.log('Created test user:', newUser);
    } else {
      console.log('Users exist:', users);
    }

    // Check categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (categoriesError) {
      console.error('Error checking categories:', categoriesError);
      return;
    }

    console.log('Existing categories:', categories);

  } catch (error) {
    console.error('Error:', error);
  }
}

checkAndCreateUser();
