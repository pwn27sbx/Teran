import os
import requests
from PIL import Image
import io

brands = ["Pfizer", "NexGard", "Hills", "Purina", "Equilibrio", "Hartz", "Virbac"]
logo_dir = 'public/logos'
os.makedirs(logo_dir, exist_ok=True)

def fetch_clearbit(domain):
    url = f"https://logo.clearbit.com/{domain}"
    try:
        res = requests.get(url)
        if res.status_code == 200:
            return res.content
    except:
        pass
    return None

domains = {
    'Pfizer': 'pfizer.com',
    'NexGard': 'nexgard.com',
    'Hills': 'hillspet.com',
    'Purina': 'purina.com',
    'Equilibrio': 'equilibriopet.com',
    'Hartz': 'hartz.com',
    'Virbac': 'virbac.com'
}

for brand in brands:
    print(f"Searching for {brand}...")
    domain = domains[brand]
    content = fetch_clearbit(domain)
    
    if content:
        print(f"  -> Found via Clearbit")
        try:
            img = Image.open(io.BytesIO(content)).convert("RGBA")
            webp_path = os.path.join(logo_dir, f"{brand.lower()}.webp")
            img.save(webp_path, 'WEBP', quality=85)
            original_size = len(content)
            new_size = os.path.getsize(webp_path)
            print(f"  -> Saved {webp_path} (Optimized {original_size}B -> {new_size}B)")
        except Exception as e:
            print(f"  -> Error processing image: {e}")
    else:
        print(f"  -> Not found")
