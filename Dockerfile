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
ENV BUCKET_NAME=<your-actual-s3-bucket-name>
ENV TRANSFER_SERVER_ID=<your-actual-transfer-server-id>

# Step 6.1: Set Lambda test environment variables (override in ECS if needed)
ENV REGION=ap-southeast-1
ENV TEST_LAMBDA=true
ENV TEST_LAMBDA_FUNCTION_NAME=helloLambda

# Step 7: Run the application
CMD ["npm", "start"]
