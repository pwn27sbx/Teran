from PIL import Image

def find_dog_width(path):
    img = Image.open(path).convert("L") # Grayscale
    w, h = img.size
    
    # scan row at h//2 to find edges of the dog (non-white pixels)
    y = h // 2
    row = [img.getpixel((x, y)) for x in range(w)]
    
    left = 0
    while left < w and row[left] > 240:
        left += 1
        
    right = w - 1
    while right > 0 and row[right] > 240:
        right -= 1
        
    print(f"Dog width at center: {right - left}px ({(right-left)/w*100:.1f}%)")

find_dog_width("/home/pwnsxb/.gemini/antigravity-cli/brain/a2f71603-06ad-491a-8fe9-a96daeca5558/.user_uploaded/uploaded_media_1787445560590.png")
find_dog_width("/home/pwnsxb/.gemini/antigravity-cli/brain/a2f71603-06ad-491a-8fe9-a96daeca5558/.user_uploaded/uploaded_media_1787446054870.png")
