from PIL import Image

img = Image.open("/home/pwnsxb/.gemini/antigravity-cli/brain/a2f71603-06ad-491a-8fe9-a96daeca5558/.user_uploaded/uploaded_media_1787446054870.png")
print("Size:", img.size)

# Find dog's nose bounding box roughly by looking for dark pixels
