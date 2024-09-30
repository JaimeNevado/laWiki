# Cloudinary: Image Management and Optimization

## Overview
Cloudinary is a cloud-based service designed to manage, optimize, and deliver images and videos. It provides powerful tools for developers to upload, transform, optimize, and serve media files efficiently across websites and applications. 

## Key Features

1. **Image Upload and Storage**:  
   Cloudinary allows you to upload images through APIs, SDKs, or a simple drag-and-drop interface. Once uploaded, the files are stored securely in the cloud with easy access.

2. **Image Transformations**:  
   Cloudinary supports a wide range of real-time transformations including:
   - Resizing, cropping, and scaling.
   - Applying filters (grayscale, sepia, etc.).
   - Adding overlays, text, and watermarks.
   - Rotating, flipping, or mirroring images.
   - Automatic format conversion (JPEG, PNG, WebP, AVIF).

3. **Optimization**:  
   Automatically optimizes images for web performance, delivering the smallest possible file size while maintaining quality. Features include:
   - Adaptive formats (WebP, AVIF).
        - AVIF: Best for websites or apps where reducing bandwidth usage is crucial, such as image-heavy e-commerce websites, photography portfolios, or sites with a global audience. It’s also great for high-quality visuals and HDR content.

        - **WebP**: A great all-around option that balances performance, quality, and compression efficiency. It's more reliable for broader compatibility across devices and browsers today, making it suitable for most general-purpose websites
   - Lossless and lossy compression.
   - Lazy loading.

4. **Responsive Images**:  
   Generate multiple versions of an image for different screen sizes and devices using the `srcset` attribute. This ensures fast loading across mobile, desktop, and high-DPI displays.

5. **CDN Delivery**:  
   Cloudinary integrates with Content Delivery Networks (CDNs) to serve media files globally, ensuring low-latency and fast image delivery worldwide.

6. **Advanced Search & Tagging**:  
   Cloudinary offers AI-based automatic tagging and searching for images, allowing easy organization and retrieval of media files.

7. **Video Support**:  
   In addition to images, Cloudinary handles video uploads, transcoding, transformations, and delivery.

## Free plan
-**In case of exceeding the limits**: Cloudinary sends a message saying that the free plan is not possible anymore and give you the chance to upgrade. It does not charge you as you dont need to give the credit card for using it 

-**Storage:**  Max 25,000 images , 25 GB storage

-**Bandwidth:** 25 GB monthly bandwidth

-**Image Transformations:** 25 credits per month (1,000 transformations(resizing, cropping, format conversion, etc.) per credit)

-**File Upload Size:** Max upload size of 100 MB per file 
## How to use

Cloudinary provides a robust API and SDKs for various programming languages and frameworks, including:
- **RESTful API**: Comprehensive control over all Cloudinary functionalities.

Dependencies:
- **Cloudinary**: To interact with Cloudinary API.
- **python-multipart**: To handle file uploads in FastAPI.
```bash
pip install cloudinary cloudinary-storage python-multipart
```

Example of a simple image upload in Python using the Cloudinary SDK:

```python
from fastapi import FastAPI, File, UploadFile, HTTPException
import cloudinary
import cloudinary.uploader
import cloudinary.api

# Initialize FastAPI app
app = FastAPI()

# Cloudinary configuration
cloudinary.config(
    cloud_name='your_cloud_name',
    api_key='your_api_key',
    api_secret='your_api_secret',
    secure=True
)

# Upload endpoint for Cloudinary
@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Upload the file to Cloudinary
        result = cloudinary.uploader.upload(file.file, folder="fastapi_uploads")
        
        # Return the secure URL of the uploaded image
        return {"url": result["secure_url"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")