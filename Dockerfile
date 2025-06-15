# Use the official Node.js 14 image as the base image
FROM oven/bun:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN bun install

# Copy the rest of the project files to the working directory
COPY . .

# Expose the port that the Next.js app will run on
EXPOSE 3000

# Start the Next.js app
CMD ["sh","init.sh"]