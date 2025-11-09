# AWS Lambda Container Deployment for YOLO

This directory contains the setup for deploying YOLO detection as an AWS Lambda container image, bypassing the 250MB deployment limit.

## Why Lambda Containers?

- **250MB limit** for regular Lambda deployments
- **10GB limit** for container deployments ✅
- ONNX Runtime + OpenCV = ~350 MB (too big for regular Lambda, perfect for containers)

## Prerequisites

1. AWS CLI installed and configured
2. Docker installed
3. AWS account with Lambda permissions
4. Exported YOLO model at `api/models/yolov8n.onnx`

## Deployment Steps

### 1. Build the Docker Image

```bash
# From project root
docker build -t yolo-lambda -f lambda/Dockerfile .
```

### 2. Test Locally

```bash
# Run container locally
docker run -p 9000:8080 yolo-lambda

# Test with curl (in another terminal)
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" \
  -d '{
    "image": "base64-encoded-image-here",
    "conf_threshold": 0.25
  }'
```

### 3. Push to AWS ECR

```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | \\
  docker login --username AWS --password-stdin \\
  123456789012.dkr.ecr.us-east-1.amazonaws.com

# Create ECR repository
aws ecr create-repository --repository-name yolo-lambda --region us-east-1

# Tag image
docker tag yolo-lambda:latest \\
  123456789012.dkr.ecr.us-east-1.amazonaws.com/yolo-lambda:latest

# Push image
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/yolo-lambda:latest
```

### 4. Create Lambda Function

```bash
# Create Lambda function from container
aws lambda create-function \\
  --function-name yolo-detection \\
  --package-type Image \\
  --code ImageUri=123456789012.dkr.ecr.us-east-1.amazonaws.com/yolo-lambda:latest \\
  --role arn:aws:iam::123456789012:role/lambda-execution-role \\
  --memory-size 3008 \\
  --timeout 60 \\
  --region us-east-1
```

### 5. Create Function URL (for HTTP access)

```bash
# Create public function URL
aws lambda create-function-url-config \\
  --function-name yolo-detection \\
  --auth-type NONE \\
  --cors '{"AllowOrigins": ["*"], "AllowMethods": ["POST"], "AllowHeaders": ["content-type"]}' \\
  --region us-east-1

# Add permission for public access
aws lambda add-permission \\
  --function-name yolo-detection \\
  --statement-id FunctionURLAllowPublicAccess \\
  --action lambda:InvokeFunctionUrl \\
  --principal "*" \\
  --function-url-auth-type NONE \\
  --region us-east-1
```

## Usage from Vercel API

```python
import requests
import base64

def detect_objects(image_path: str):
    # Read and encode image
    with open(image_path, 'rb') as f:
        image_b64 = base64.b64encode(f.read()).decode('utf-8')

    # Call Lambda function
    response = requests.post(
        "https://your-lambda-url.lambda-url.us-east-1.on.aws/",
        json={
            "image": image_b64,
            "conf_threshold": 0.25
        }
    )

    return response.json()
```

## Cost Estimate

AWS Lambda Container pricing:
- Free tier: 1M requests/month + 400,000 GB-seconds compute
- After free tier: $0.0000166667 per GB-second + $0.20 per 1M requests

Example: 1000 requests/day, 3 seconds each, 3GB memory:
- Compute: 1000 * 3 * 3 GB-seconds = 9000 GB-seconds/day
- Monthly: 270,000 GB-seconds = $4.50/month
- Requests: 30,000 requests = $0.006/month
- **Total: ~$4.51/month**

Much cheaper than running a dedicated server!

## Alternative: Use Terraform

See `lambda/terraform/` for Infrastructure-as-Code deployment.

## Troubleshooting

### "Error loading model"
- Ensure `api/models/yolov8n.onnx` exists
- Run `python scripts/export_yolo_to_onnx.py` to create it

### "Out of memory"
- Increase Lambda memory to 10GB (max)
- Check model size

### "Timeout"
- Increase Lambda timeout to 900s (max)
- Optimize model with ONNX optimization

## References

- [AWS Lambda Container Images](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html)
- [HowTo: deploying YOLOv8 on AWS Lambda](https://www.trainyolo.com/blog/deploy-yolov8-on-aws-lambda)
