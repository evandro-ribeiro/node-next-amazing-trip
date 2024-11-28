# Base image
FROM node:20

# Set working directory
WORKDIR /usr/src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --include=dev

# Copy the rest of the application files
COPY . .

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

RUN npm run build

# Expose the backend port
EXPOSE 8080

# Command to run the application
CMD ["./wait-for-it.sh", "mysql:3306", "--", "npm", "run", "start"]
