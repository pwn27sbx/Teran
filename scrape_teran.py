import urllib.request
import re
import html

url = "http://hospitalveterinarioteran.com/"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        content = response.read().decode('utf-8')
        
        # Extract phone numbers
        phones = re.findall(r'>([0-9]{3} [0-9]{3} [0-9]{3}|[0-9]{9}|\+51[0-9 ]+)<', content)
        print("Phones:", set(phones))
        
        # Extract emails
        emails = re.findall(r'mailto:([^"]+)', content)
        print("Emails:", set(emails))
        
        # Remove scripts and styles
        content = re.sub(r'<script.*?</script>', '', content, flags=re.DOTALL)
        content = re.sub(r'<style.*?</style>', '', content, flags=re.DOTALL)
        
        # Extract headings and paragraphs to see structure
        tags = re.findall(r'<(h[1-6]|p|li|a)[^>]*>(.*?)</\1>', content, flags=re.DOTALL | re.IGNORECASE)
        
        print("\n--- CONTENT ---")
        for tag, text in tags:
            # Clean HTML tags inside
            clean_text = re.sub(r'<[^>]+>', '', text)
            clean_text = html.unescape(clean_text).strip()
            if len(clean_text) > 10:
                print(f"[{tag.upper()}] {clean_text}")

except Exception as e:
    print("Error:", e)
