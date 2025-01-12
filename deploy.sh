#!/bin/bash

# Production deployment script

# Environment validation
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "Error: Missing required environment variables"
  exit 1
fi

# Build optimization
echo "Optimizing build..."
npm run build

# Verify build
if [ ! -d "dist" ]; then
  echo "Error: Build failed"
  exit 1
fi

# Run tests
echo "Running tests..."
npm run test

# Deploy to CDN
echo "Deploying to CDN..."
# Add CDN deployment commands here

# Verify deployment
echo "Verifying deployment..."
# Add deployment verification commands here

echo "Deployment complete!"