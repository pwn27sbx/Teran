from html.parser import HTMLParser
import re

class MyHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text_content = []

    def handle_data(self, data):
        text = data.strip()
        if text and len(text) > 2:
            self.text_content.append(text)

parser = MyHTMLParser()
with open("/home/pwnsxb/.gemini/antigravity-ide/brain/b4613fab-634d-4162-947c-c13a2ebcd9eb/.system_generated/steps/369/content.md", "r") as f:
    parser.feed(f.read())

# Print unique text snippets
for i, text in enumerate(set(parser.text_content)):
    print(text)

