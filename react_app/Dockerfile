# Use an official node image as the base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application
RUN npm run build

# Install a simple HTTP server to serve the static files
RUN npm install -g serve

# Expose the port the app will run on
EXPOSE 3000

# Expose additional ports for APIs
EXPOSE 3030
EXPOSE 4650
EXPOSE 5600
EXPOSE 5540
EXPOSE 5550
EXPOSE 3055
EXPOSE 5080
EXPOSE 6379
EXPOSE 5100

# Command to run the app
CMD ["serve", "-s", "build", "-l", "3000"]
