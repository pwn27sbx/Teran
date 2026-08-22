import os
import re

replacements = {
    r'\btext-\[\#0277ab\]\b(?! dark:text-)': 'text-[#0277ab] dark:text-sky-400',
    r'\bborder-blue-100\b(?! dark:border-)': 'border-blue-100 dark:border-blue-900',
    r'\bbg-blue-50(?!/)(?! dark:bg-)': 'bg-blue-50 dark:bg-blue-900',
    r'\bbg-gray-100/50\b(?! dark:bg-)': 'bg-gray-100/50 dark:bg-gray-800/50',
    r'\bbg-gray-100/80\b(?! dark:bg-)': 'bg-gray-100/80 dark:bg-gray-800/80',
    r'\bbg-white/70\b(?! dark:bg-)': 'bg-white/70 dark:bg-gray-900/70',
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    original = content
    for pattern, replacement in replacements.items():
        content = re.sub(pattern, replacement, content)
        
    if content != original:
        with open(filepath, 'w') as f:
            f.write(content)
        print(f"Updated {filepath}")

for root, _, files in os.walk('/home/pwnsxb/Projects/Teran/src'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            process_file(os.path.join(root, file))

