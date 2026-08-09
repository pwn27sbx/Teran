import urllib.request
import json

# search github API for lottie dog walking
url = "https://api.github.com/search/code?q=filename:dog.json"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        for item in data.get('items', [])[:5]:
            print(item['html_url'])
            print(item['url'])
except Exception as e:
    print("Error:", e)
