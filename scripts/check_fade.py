from PIL import Image

def check_fade(path):
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    
    # Check alpha values in the bottom 200 pixels
    bottom_alpha = []
    for y in range(h - 200, h):
        row_alpha = [img.getpixel((x, y))[3] for x in range(w)]
        max_alpha = max(row_alpha)
        bottom_alpha.append(max_alpha)
        
    print(f"{path} max alpha at bottom rows:")
    print(bottom_alpha[::20]) # Print every 20th row to summarize

check_fade("public/atreus1_nobg.webp")
check_fade("public/atreusx_nobg.webp")
