# Dockerfile for AWS Lambda YOLO detection
# Bypasses 250MB limit by using container images (up to 10GB)

FROM public.ecr.aws/lambda/python:3.12

# Install system dependencies for OpenCV
RUN yum install -y \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && yum clean all

# Copy requirements
COPY requirements-lambda.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements-lambda.txt

# Copy ONNX model
COPY api/models/yolov8n.onnx /var/task/models/

# Copy YOLO detection code
COPY api/_utils/object_detection/ /var/task/

# Copy Lambda handler
COPY lambda/handler.py ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler
CMD [ "handler.lambda_handler" ]
