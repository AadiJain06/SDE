# Link Saver + Auto-Summary

A professional full-stack bookmark management application with AI-powered summaries, built with Next.js, TypeScript, and SQLite.

## Features

### Core Features
- **Authentication**: Secure email/password registration and login with bcrypt password hashing
- **Bookmark Management**: Save URLs with automatic title and favicon extraction
- **AI Summaries**: Automatic content summarization using Jina AI
- **Tag System**: Organize bookmarks with custom tags
- **Search & Filter**: Find bookmarks by title, URL, content, or tags

### Enhanced Features
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Professional UI**: Clean, modern interface with professional color palette
- **Real-time Updates**: Instant feedback for all user actions
- **Secure**: JWT-based authentication with HTTP-only cookies

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom professional color palette
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: bcrypt + JWT
- **AI Integration**: Jina AI API for content summarization
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd link-saver-auto-summary
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   
   # AI Integration
   JINA_API_KEY=your-jina-ai-api-key
   
   # Google OAuth (Optional)
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_ID=your-google-client-id
   ```

   **Optional: Google OAuth Setup**
   To enable Google Sign-In functionality:
   
   1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
   2. Create a new project or select an existing one
   3. Enable the Google+ API
   4. Go to "Credentials" and create an "OAuth 2.0 Client ID"
   5. Set the authorized JavaScript origins to `http://localhost:3000` (for development)
   6. Copy the Client ID and add it to your `.env.local` file as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   7. For production, add your production domain to the authorized origins

4. **Set up Supabase database**
   Follow the instructions in `MIGRATION_GUIDE.md` to set up your Supabase project and database schema.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Bookmarks
- `GET /api/bookmarks` - Fetch user's bookmarks (supports tag filtering)
- `POST /api/bookmarks` - Create new bookmark
- `PUT /api/bookmarks/[id]` - Update bookmark
- `DELETE /api/bookmarks/[id]` - Delete bookmark

## Database Schema

The database schema is defined in `supabase-schema.sql`. Key features:

- **UUID-based IDs**: All tables use UUID primary keys for better scalability
- **Row Level Security (RLS)**: Built-in security policies ensure data isolation
- **Automatic timestamps**: Created_at fields are automatically managed
- **Foreign key constraints**: Proper referential integrity between tables

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Bookmarks Table
```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT,
  favicon TEXT,
  summary TEXT,
  tags TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── bookmarks/     # Bookmark management endpoints
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── AuthForm.tsx       # Authentication form
│   ├── BookmarkCard.tsx   # Individual bookmark display
│   └── AddBookmarkForm.tsx # Add bookmark form
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   ├── bookmarks.ts      # Bookmark management
│   ├── supabase.ts       # Supabase client configuration
│   └── summary.ts        # AI summary generation
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## Features in Detail

### Authentication System
- Secure password hashing with bcrypt (12 salt rounds)
- JWT token-based sessions with 7-day expiration
- HTTP-only cookies for enhanced security
- Input validation and error handling

### Bookmark Management
- Automatic title extraction from webpage metadata
- Favicon extraction from website
- AI-powered content summarization
- Tag-based organization system
- Real-time search and filtering

### AI Integration
- Uses Jina AI API for intelligent content summarization
- Handles API errors gracefully with fallback messages
- Configurable summary length and style

### User Experience
- Professional color palette suitable for business environments
- Responsive design that works on all devices
- Dark mode toggle with persistent preference
- Toast notifications for user feedback
- Loading states and error handling

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies
- Input sanitization
- SQL injection prevention
- CORS protection
- Rate limiting considerations

## Deployment

### Environment Variables
Make sure to set these in production:
- `JWT_SECRET`: A strong, unique secret key
- `JINA_API_KEY`: Your Jina AI API key
- `NODE_ENV`: Set to "production"

### Database
The application now uses Supabase (PostgreSQL) for the database. For production, consider:
- Regular backups (handled by Supabase)
- Database optimization
- Row Level Security policies
- Connection pooling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is created for educational and professional purposes.

## Support

For issues or questions, please check the documentation or create an issue in the repository. 