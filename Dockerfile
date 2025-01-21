# -------------------------------
# Stage 1: Development Dependencies
# -------------------------------
FROM node:20-alpine AS development-dependencies-env
# Install pnpm globally
RUN npm install -g pnpm

# Copy all sources (including package.json and pnpm-lock.yaml)
COPY . /app
WORKDIR /app

# Install all dependencies (including dev)
RUN pnpm install --frozen-lockfile

# -------------------------------
# Stage 2: Production Dependencies
# -------------------------------
FROM node:20-alpine AS production-dependencies-env
# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Only copy the files needed for an install
COPY package.json pnpm-lock.yaml ./

# Install production-only dependencies
RUN pnpm install --prod --frozen-lockfile

# -------------------------------
# Stage 3: Build
# -------------------------------
FROM node:20-alpine AS build-env
# Install pnpm globally
RUN npm install -g pnpm

COPY . /app
WORKDIR /app

# Copy node_modules with dev dependencies from the dev stage
COPY --from=development-dependencies-env /app/node_modules /app/node_modules

# Build your application
RUN pnpm run build

# -------------------------------
# Stage 4: Final Image
# -------------------------------
FROM node:20-alpine
# Install pnpm globally to run "pnpm start"
RUN npm install -g pnpm

WORKDIR /app

# Copy the production node_modules from the production-dependencies stage
COPY --from=production-dependencies-env /app/node_modules ./node_modules

# Copy the build artifacts from the build stage
COPY --from=build-env /app/build ./build

# Copy package.json and pnpm-lock.yaml in case your app needs them at runtime
COPY package.json pnpm-lock.yaml ./

# Start the application
CMD ["pnpm", "run", "start"]

EXPOSE 3000