# Render Deployment Guide

## Required Environment Variables

Set these in your Render dashboard under Environment Variables:

### Required
- `NODE_ENV=production`
- `JWT_SECRET` - A secure random string (Render can auto-generate this)

### Optional (for Google OAuth)
- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Same as above (for client-side)

### Optional (for AI summaries)
- `JINA_API_KEY` - Your Jina AI API key for link summarization

## Deployment Steps

1. **Connect Repository**
   - Connect your GitHub repository to Render
   - Select "Web Service" as the service type

2. **Build Settings**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: `Node`

3. **Environment Variables**
   - Add the environment variables listed above
   - Let Render auto-generate `JWT_SECRET`

4. **Health Check**
   - Set Health Check Path to: `/api/health`

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete

## Important Notes

- **Database**: Uses SQLite stored in `/tmp` directory (ephemeral)
- **File Storage**: Files are recreated on each deployment
- **Free Tier**: Service may sleep after 15 minutes of inactivity

## Database Persistence

⚠️ **Warning**: On Render's free tier, the SQLite database is stored in `/tmp` and will be lost on each deployment or service restart.

For production use, consider:
- Upgrading to a paid plan with persistent disk
- Using an external database (PostgreSQL, MySQL)
- Using Render's managed database services

## Testing

After deployment, test these endpoints:
- `https://your-app.onrender.com/api/health` - Should return healthy status
- `https://your-app.onrender.com/register` - Registration page
- `https://your-app.onrender.com/login` - Login page
