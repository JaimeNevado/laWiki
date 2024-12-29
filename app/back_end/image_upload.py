import cloudinary
import cloudinary.uploader
from environs import Env
from io import BytesIO
from datetime import datetime
from typing import List

# import os
# from cloudinary.utils import cloudinary_url
# from dotenv import load_dotenv


class ImageUploader:
    def __init__(self):
        env = Env()
        env.read_env()
        # Configuration
        cloudinary.config(
            cloud_name=env("CLOUD_NAME"),
            api_key=env("API_KEY"),
            api_secret=env("API_SECRET"),
            secure=True,
        )
        print("Cloudinary configured")

    def save_image(self, img):
        in_memory_file = BytesIO()
        img.save(in_memory_file)
        in_memory_file.seek(0)
        return in_memory_file

    def upload_image(self, image, id):
        upload_result = cloudinary.uploader.upload(
            image,
            public_id=id,
        )
        return upload_result

    async def upload_image_from_form(self, form_image):
        file_content = await form_image.read()
        upload_result = self.upload_image(
            image=file_content,
            id=f"{form_image.filename}_{datetime.now().timestamp()}",
        )
        return upload_result["secure_url"]

    async def upload_images(self, form_images: List):
        urls = []
        for form_image in form_images:
            url = await self.upload_image_from_form(form_image)
            urls.append(url)
        return urls


# script_dir = os.path.dirname(os.path.abspath(__file__))
# file_path = os.path.join(script_dir, "img", "test.png")
# with open(file_path, "rb") as file:
#     file_content = file.read()


# res = upload_image(file_content, "massage-gun")
# print("image url: ", res["secure_url"])


# Upload an image
# upload_result = cloudinary.uploader.upload(
#     "https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg",
#     public_id="shoes",
# )
# print(upload_result["secure_url"])

# Optimize delivery by resizing and applying auto-format and auto-quality
# optimize_url, _ = cloudinary_url("shoes", fetch_format="auto", quality="auto")
# print(optimize_url)

# # Transform the image: auto-crop to square aspect_ratio
# auto_crop_url, _ = cloudinary_url(
#     "shoes", width=500, height=500, crop="auto", gravity="auto"
# )
# print(auto_crop_url)
