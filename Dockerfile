# Use Node 22 as base image
FROM node:22-alpine

# No need for curl anymore

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY stripe/package.json ./stripe/
COPY stripe/package-lock.json ./stripe/

# Install dependencies (including dev dependencies for build)
RUN cd stripe && npm ci

# Copy source code
COPY stripe/src ./stripe/src
COPY stripe/tsconfig.json ./stripe/

# Build TypeScript
RUN cd stripe && npm run build

# Remove dev dependencies to reduce image size
RUN cd stripe && npm prune --production

# Expose port (Railway typically uses 8080)
EXPOSE 8080

# Set environment variables for HTTP transport
ENV TRANSPORT_TYPE=http
ENV PORT=8080

# No health check - let Railway handle it

# Start the server
CMD ["node", "stripe/dist/index.js"]
