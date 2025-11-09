"""
AWS Lambda handler for YOLO object detection.
Uses ONNX Runtime for efficient inference.

Deploy as Lambda container image to bypass 250MB limit.
"""

import json
import base64
import io
from typing import Dict, Any

import numpy as np
from PIL import Image
from onnx_detector import YOLO_ONNX

# Load model once at cold start
MODEL_PATH = "/var/task/models/yolov8n.onnx"
model = YOLO_ONNX(MODEL_PATH)

print(f"✅ YOLO model loaded: {MODEL_PATH}")


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda handler for YOLO detection.

    Event format:
    {
        "image": "base64-encoded-image",
        "conf_threshold": 0.25,
        "iou_threshold": 0.45
    }

    Returns:
    {
        "statusCode": 200,
        "body": {
            "detections": [
                {
                    "class": "car",
                    "confidence": 0.92,
                    "bbox": [x1, y1, x2, y2]
                },
                ...
            ]
        }
    }
    """
    try:
        # Parse request
        body = json.loads(event.get("body", "{}")) if isinstance(event.get("body"), str) else event

        image_b64 = body.get("image")
        conf_threshold = body.get("conf_threshold", 0.25)
        iou_threshold = body.get("iou_threshold", 0.45)

        if not image_b64:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing 'image' field"})
            }

        # Decode image
        image_bytes = base64.b64decode(image_b64)
        image = Image.open(io.BytesIO(image_bytes))
        image_np = np.array(image)

        # Run inference
        results = model.predict(
            source=image_np,
            conf=conf_threshold,
            iou=iou_threshold,
            verbose=False
        )

        # Format results
        detections = []
        result = results[0]

        if result.boxes is not None and len(result.boxes) > 0:
            for box in result.boxes:
                cls_id = int(box.cls[0])
                cls_name = model.names[cls_id]
                confidence = float(box.conf[0])
                x1, y1, x2, y2 = box.xyxy[0].tolist()

                detections.append({
                    "class": cls_name,
                    "confidence": confidence,
                    "bbox": [int(x1), int(y1), int(x2), int(y2)]
                })

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "detections": detections,
                "count": len(detections)
            })
        }

    except Exception as e:
        print(f"Error: {e}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }


# For local testing
if __name__ == "__main__":
    # Test with sample event
    test_event = {
        "image": "",  # Add base64 image here
        "conf_threshold": 0.25
    }

    result = lambda_handler(test_event, None)
    print(json.dumps(result, indent=2))
