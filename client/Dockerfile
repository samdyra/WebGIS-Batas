# Use the official Node.js 20-slim base image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install serve to serve the build
RUN npm install -g serve

# Copy the rest of the application code
COPY . .

# Set environment variables
ENV BASE_API_URL=http://localhost:3000

# Build the React app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the app using serve
CMD ["serve", "-s", "dist", "-l", "3000"]
