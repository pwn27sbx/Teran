import sys
from PIL import Image
from rembg import remove

def process_image(input_path, output_path):
    print(f"Processing {input_path}...")
    try:
        with open(input_path, 'rb') as i:
            input_data = i.read()
        
        # rembg automatically downloads models on first run
        output_data = remove(input_data)
        
        tmp_path = output_path + ".tmp.png"
        with open(tmp_path, 'wb') as o:
            o.write(output_data)
            
        img = Image.open(tmp_path)
        img.save(output_path, 'webp', lossless=True)
        print(f"Saved successfully: {output_path}")
    except Exception as e:
        print(f"Failed to process {input_path}: {e}")

process_image('public/atreusperfil.png', 'public/atreusperfil_nobg.webp')
process_image('public/miloperfil.png', 'public/miloperfil_nobg.webp')
