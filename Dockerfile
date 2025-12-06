# ---- Stage 1: Build ----
# This stage installs all dependencies (including dev)
# and runs the TypeScript build script.
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm install

# Copy the rest of the source code
COPY . .

# Run the build script (tsc)
# This creates the 'dist' folder with compiled JavaScript
RUN npm run build

# ---- Stage 2: Production ----
# This stage starts from a fresh, minimal Node image
# and only copies the necessary files for running the app.
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json again
COPY package*.json ./
COPY /public ./public

# Install *only* production dependencies
RUN npm install --omit=dev

# Copy the compiled 'dist' folder from the 'builder' stage
COPY --from=builder /app/.next ./.next

# --- Best Practices ---
# Create a non-root user to run the application
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the port your application runs on
#ENV PORT=8080
#EXPOSE 8080
ENV PORT=3000
EXPOSE 3000

# The command to start the application
# This will execute "node dist/server.js"
CMD ["npm", "start"]
