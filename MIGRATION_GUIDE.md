# Migration Guide: SQLite to Supabase

This guide will help you set up Supabase and migrate your data from SQLite.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project in your Supabase dashboard

## Step 1: Set up Supabase Project

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy your project URL and anon key

## Step 2: Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Keep your existing variables
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_ID=your-google-client-id
JINA_API_KEY=your-jina-ai-api-key
NODE_ENV=development
```

## Step 3: Set up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-schema.sql` into the editor
4. Run the SQL commands to create your tables

## Step 4: Data Migration (Optional)

If you have existing data in your SQLite database, you can migrate it:

1. Export your SQLite data to CSV or JSON format
2. Use Supabase's import feature or write a migration script
3. Update the data to use UUID format for IDs

## Step 5: Test Your Application

1. Start your development server: `npm run dev`
2. Test user registration and login
3. Test bookmark creation, reading, updating, and deletion
4. Verify that all functionality works as expected

## Key Changes Made

### Database Layer
- Replaced SQLite with Supabase client
- Updated all database operations to use Supabase API
- Changed ID types from integers to UUIDs

### Authentication
- Updated user ID handling to use strings instead of numbers
- Maintained JWT-based authentication
- Updated all auth-related functions

### API Routes
- Removed SQLite initialization calls
- Updated all routes to work with Supabase
- Maintained the same API interface

### Type Safety
- Updated TypeScript interfaces to use string IDs
- Added proper Supabase types

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure your `.env.local` file is in the project root
   - Restart your development server after adding environment variables

2. **Supabase Connection Issues**
   - Verify your project URL and anon key are correct
   - Check that your Supabase project is active

3. **RLS (Row Level Security) Issues**
   - The schema includes RLS policies for security
   - Ensure your authentication is working properly

4. **Type Errors**
   - Update any remaining references to numeric IDs to use strings
   - Check that all imports are updated

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [Supabase JavaScript client docs](https://supabase.com/docs/reference/javascript)
- Check the console for detailed error messages

## Security Notes

- The schema includes Row Level Security (RLS) policies
- User data is properly isolated
- JWT tokens are still used for authentication
- Passwords are still hashed using bcrypt

## Performance Considerations

- Supabase provides automatic scaling
- Database indexes are created for optimal performance
- Consider implementing caching for frequently accessed data
