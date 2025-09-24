# Use Node 22 as base image
FROM node:22-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY stripe/package.json ./stripe/
COPY stripe/package-lock.json ./stripe/

# Install dependencies
RUN cd stripe && npm ci --only=production

# Copy source code
COPY stripe/src ./stripe/src
COPY stripe/tsconfig.json ./stripe/

# Build TypeScript
RUN cd stripe && npm run build

# Expose port
EXPOSE 3000

# Set environment variables for HTTP transport
ENV TRANSPORT_TYPE=http
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the server
CMD ["node", "stripe/dist/index.js"]
