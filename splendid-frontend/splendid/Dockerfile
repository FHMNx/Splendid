# Stage 1: Build the React Application
FROM node:24-alpine AS build
WORKDIR /app

# Copy dependency files first to utilize Docker caching
COPY package*.json ./
RUN npm install

# Copy the rest of your application code and compile
COPY . .
RUN npm run build

# Stage 2: Serve with NGINX
FROM nginx:stable-alpine

# Copy the compiled assets from the build stage over to NGINX's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]