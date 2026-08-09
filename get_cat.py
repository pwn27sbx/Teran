import urllib.request
import json
import re

url = "https://poly.pizza/search/cat"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        matches = re.findall(r'href="/m/([^"]+)"', html)
        if matches:
            dl_url = f"https://poly.pizza/m/{matches[0]}"
            print("Found ID:", matches[0])
            # fetch the actual page to get the static glb link
            req2 = urllib.request.Request(dl_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req2) as res2:
                html2 = res2.read().decode('utf-8')
                glb_match = re.search(r'https://static\.poly\.pizza/[^"]*\.glb', html2)
                if glb_match:
                    print("Cat GLB:", glb_match.group(0))
except Exception as e:
    print("Error:", e)
