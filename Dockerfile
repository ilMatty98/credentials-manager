## Stage 1: Build the React application
FROM node:22-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . /app

# Build the application using the custom command
RUN npm run build:prod

# Stage 2: Serve the application using Nginx
FROM nginx:1.23-alpine

# Copy built files from the previous stage to the Nginx HTML folder
COPY --from=build /app/build /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]