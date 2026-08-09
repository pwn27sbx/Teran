import urllib.request
import json
import re

url = "https://poly.pizza/search/Cocker%20Spaniel"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        # find href="/m/ID"
        matches = re.findall(r'href="/m/([^"]+)"', html)
        if matches:
            print("Found IDs:", matches)
            # Try to construct a download URL. Poly Pizza uses https://poly.pizza/api/download/ID
            dl_url = f"https://poly.pizza/api/download/{matches[0]}"
            print("Download URL:", dl_url)
        else:
            print("No matches")
except Exception as e:
    print("Error:", e)
