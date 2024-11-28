# Base image
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Build the Next.js application
COPY . .
RUN npm run build

# Expose the frontend port
EXPOSE 80

# Command to run the application
CMD ["npm", "run", "start"]
