# 🚀 Deployment Guide

This guide will help you deploy your Link Saver application to various platforms.

## 📋 Prerequisites

Before deploying, make sure you have:

1. **Supabase Project** - Set up your database
2. **Environment Variables** - Configure all required secrets
3. **GitHub Repository** - Push your code to GitHub

## 🌐 Vercel Deployment (Recommended)

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository and click "Import"

### 2. Configure Environment Variables

In your Vercel project settings, add these environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Jina AI API Key
JINA_AI_API_KEY=your_jina_ai_api_key

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Deploy

1. Vercel will automatically detect Next.js
2. Click "Deploy"
3. Wait for the build to complete
4. Your app will be live at `https://your-project.vercel.app`

### 4. Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions

## 🐳 Docker Deployment

### 1. Create Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Build and Run

```bash
# Build the image
docker build -t link-saver .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e JWT_SECRET=your_secret \
  -e JINA_AI_API_KEY=your_key \
  link-saver
```

## 🐙 GitHub Pages Deployment

### 1. Install gh-pages

```bash
npm install --save-dev gh-pages
```

### 2. Add to package.json

```json
{
  "scripts": {
    "export": "next build && next export",
    "deploy": "npm run export && gh-pages -d out"
  }
}
```

### 3. Deploy

```bash
npm run deploy
```

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | `eyJ...` |
| `JWT_SECRET` | Secret for JWT tokens | `your-secret-key` |
| `JINA_AI_API_KEY` | Jina AI API key | `jina_xxx` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | `xxx.apps.googleusercontent.com` |

## 🧪 Testing Before Deployment

### 1. Local Testing

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build locally
npm run build

# Start production server
npm start
```

### 2. Environment Check

Create a `.env.local` file and test all features:

- ✅ User registration
- ✅ User login
- ✅ Add bookmarks
- ✅ AI summarization
- ✅ Category management
- ✅ Search functionality

## 🔍 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check all environment variables are set
   - Ensure Node.js version is 20+
   - Clear `.next` folder and rebuild

2. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check if database schema is applied
   - Ensure RLS policies are configured

3. **AI Summarization Not Working**
   - Verify Jina AI API key is valid
   - Check API rate limits
   - Test API key separately

4. **Authentication Issues**
   - Verify JWT_SECRET is set
   - Check cookie settings
   - Ensure HTTPS in production

### Debug Commands

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Run tests
npm test

# Build with verbose output
npm run build --verbose
```

## 📊 Performance Optimization

### 1. Image Optimization

- Use Next.js Image component
- Optimize favicon sizes
- Implement lazy loading

### 2. Database Optimization

- Add proper indexes
- Use connection pooling
- Implement caching

### 3. Bundle Optimization

- Analyze bundle size
- Remove unused dependencies
- Implement code splitting

## 🔒 Security Checklist

- [ ] Environment variables are secure
- [ ] JWT secret is strong
- [ ] HTTPS is enabled
- [ ] CORS is configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] SQL injection is prevented

## 📈 Monitoring

### 1. Vercel Analytics

Enable Vercel Analytics in your project settings for:
- Page views
- Performance metrics
- Error tracking

### 2. Supabase Monitoring

Monitor your database:
- Query performance
- Connection usage
- Error logs

### 3. Custom Monitoring

Consider adding:
- Error tracking (Sentry)
- Performance monitoring
- Uptime monitoring

## 🚀 Post-Deployment

1. **Test all features** on the live site
2. **Monitor performance** and errors
3. **Set up monitoring** and alerts
4. **Configure backups** for your database
5. **Document the deployment** process

---

**Need help?** Check the [GitHub Issues](https://github.com/yourusername/link-saver/issues) or create a new one.
