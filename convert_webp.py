import os
import glob
from PIL import Image

src_dir = "/home/pwnsxb/Videos/Milo/milo"
dest_dir = "/home/pwnsxb/Projects/Works/Teran/public/milo-frames"

os.makedirs(dest_dir, exist_ok=True)

# Find all jpgs and sort them
files = sorted(glob.glob(os.path.join(src_dir, "*.jpg")))

print(f"Found {len(files)} files to convert.")

for i, filepath in enumerate(files):
    # format index to be padded, e.g., 001
    idx_str = f"{i+1:03d}"
    dest_path = os.path.join(dest_dir, f"frame-{idx_str}.webp")
    
    with Image.open(filepath) as img:
        # Convert to webp with high quality (90) which balances size and quality perfectly
        img.save(dest_path, "webp", quality=90, method=6)

print("Conversion complete!")
