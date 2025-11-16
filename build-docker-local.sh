#!/bin/bash
# Script to build Docker image locally with environment variables from .env file

set -e

# Load environment variables from .env file
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    exit 1
fi

# Source the .env file
export $(grep -v '^#' .env | xargs)

# Build the Docker image
docker build \
    --build-arg NEON_AUTH_JWKS_URL="$NEON_AUTH_JWKS_URL" \
    --build-arg NEXT_PUBLIC_API_BASE="$NEXT_PUBLIC_API_BASE" \
    --build-arg NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
    --build-arg NEXT_PUBLIC_STACK_PROJECT_ID="$NEXT_PUBLIC_STACK_PROJECT_ID" \
    --build-arg NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="$NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY" \
    --build-arg STACK_SECRET_SERVER_KEY="$STACK_SECRET_SERVER_KEY" \
    -t olympicks-test:local \
    .

echo "✅ Docker image built successfully: olympicks-test:local"
echo "To run it: docker run -p 3000:3000 olympicks-test:local"

