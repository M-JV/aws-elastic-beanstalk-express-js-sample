# Use the required Node.js 16 runtime.
FROM node:16

# Set the application working directory inside the container.
WORKDIR /app

# Copy dependency manifests first to improve Docker layer caching.
COPY package*.json ./

# Install the exact dependency versions recorded in package-lock.json.
RUN npm ci --omit=dev

# Copy the application source into the image.
COPY app.js ./

# Document the port used by the Express application.
EXPOSE 8080

# Start the Node.js application.
CMD ["npm", "start"]
