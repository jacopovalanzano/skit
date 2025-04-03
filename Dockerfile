# Base Image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (to optimize caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build Next.js
RUN npm run build

# Install Electron dependencies (if using Electron)
RUN npm install electron electron-builder --global

# Expose Next.js default port (3000)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
