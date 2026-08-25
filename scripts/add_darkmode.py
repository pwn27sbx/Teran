import os
import re

replacements = {
    r'\bbg-white\b(?!/)(?! dark:bg-)': 'bg-white dark:bg-gray-900',
    r'\bbg-\[\#f8f9fa\]\b(?! dark:bg-)': 'bg-[#f8f9fa] dark:bg-gray-950',
    r'\btext-gray-900\b(?! dark:text-)': 'text-gray-900 dark:text-white',
    r'\btext-gray-800\b(?! dark:text-)': 'text-gray-800 dark:text-gray-100',
    r'\btext-gray-700\b(?! dark:text-)': 'text-gray-700 dark:text-gray-300',
    r'\btext-gray-600\b(?! dark:text-)': 'text-gray-600 dark:text-gray-400',
    r'\btext-gray-500\b(?! dark:text-)': 'text-gray-500 dark:text-gray-400',
    r'\bbg-white/70\b(?! dark:bg-)': 'bg-white/70 dark:bg-gray-900/70',
    r'\bbg-white/80\b(?! dark:bg-)': 'bg-white/80 dark:bg-gray-900/80',
    r'\bbg-gray-100\b(?!/)': 'bg-gray-100 dark:bg-gray-800',
    r'\bborder-gray-100\b': 'border-gray-100 dark:border-gray-800',
    r'\bborder-gray-200/50\b': 'border-gray-200/50 dark:border-gray-700/50',
    r'\bborder-white/40\b': 'border-white/40 dark:border-gray-700/40',
    r'\bborder-white/20\b': 'border-white/20 dark:border-gray-700/20',
    r'\bbg-blue-50/80\b': 'bg-blue-50/80 dark:bg-blue-900/40',
    r'\bborder-blue-100\b': 'border-blue-100 dark:border-blue-800',
    r'\bbg-gradient-to-br from-\[\#0277ab\]/5 to-\[\#0277ab\]/10\b': 'bg-gradient-to-br from-[#0277ab]/5 to-[#0277ab]/10 dark:from-[#0277ab]/20 dark:to-[#0277ab]/40',
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

