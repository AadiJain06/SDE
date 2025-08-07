# Use Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Create tmp directory for database
RUN mkdir -p /tmp

# Start the application
CMD ["npm", "start"]
