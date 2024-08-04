# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app
# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the package.json and package-lock.json into the container at /app
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy the rest of the current directory contents into the container at /app
COPY . .

# Expose the port the app runs on
EXPOSE 3030
EXPOSE 3040

# Run the app
CMD ["npm", "start"]
