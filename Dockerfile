# Use official Node.js 20 lightweight Alpine image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies (only production dependencies for a smaller image)
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Expose the port (Railway provides the PORT environment variable)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
