# hello-aws

sample image for testing aws services connectivity

##  -- test transfer family with s3 -- ##
After setting up the AWS Transfer Family server and associating it with your S3 bucket, you can verify file upload and download functionality using the s3-test.js script.

✅ Prerequisites
	•	AWS Transfer Family server is ONLINE
	•	The S3 bucket is accessible and correctly linked to the Transfer server
	•	Your local environment or ECS task role has appropriate S3 permissions

Use the following command to run the script:
```
   AWS_REGION=<your_aws_region> BUCKET_NAME=<your_bucket_name> TRANSFER_SERVER_ID=<your_server_id> node s3-test.js
```

📄 What It Does
	•	Uploads a test file to the specified S3 bucket
	•	Downloads the same file to verify access
	•	Logs success/failure of the operations