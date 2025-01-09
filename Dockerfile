# Step 1: Use Node.js image as base
FROM --platform=linux/amd64 node:20

# Step 2: Set working directory
WORKDIR /app

# Step 3: Copy package.json and install dependencies
COPY package.json /app
RUN npm install

# Step 4: Copy the rest of your application code
COPY . /app

# Step 5: Expose port (optional, if you want to add a web server later)
EXPOSE 8080

# Step 6: Set environment variables for RDS connection (these can be configured at runtime)
ENV RDS_HOST=your-rds-endpoint
ENV RDS_USER=your-db-username
ENV RDS_PASSWORD=your-db-password
ENV RDS_DB_NAME=your-db-name

# Step 7: Run the application
CMD ["npm", "start"]
