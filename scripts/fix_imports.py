import os
import re

def fix_imports(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r') as f:
                    content = f.read()

                # Regex to match import ... from "../something" or import ... from "../../something"
                # We need to replace ../.. or ../ with @/ but it's tricky depending on depth.
                # Actually, Vite alias @/ is relative to project root, so @/components is always src/components.
                # A simple approach: replace "../components" with "@/components", etc.
                
                # Because the folder structure is simple: src/pages, src/components, src/hooks
                # ../components -> @/components
                # ../hooks -> @/hooks
                # ../data -> @/data
                # ./components -> @/components (only if in src/App.tsx etc)
                # Let's just find any match of "from '../" and "from '../../" and replace appropriately.
                # Wait, if we are in src/pages/Home.tsx, ../components means src/components. So @/components.
                
                content = re.sub(r'from\s+["\']\.\./components/([^"\']+)["\']', r'from "@/components/\1"', content)
                content = re.sub(r'from\s+["\']\.\./hooks/([^"\']+)["\']', r'from "@/hooks/\1"', content)
                content = re.sub(r'from\s+["\']\.\./data/([^"\']+)["\']', r'from "@/data/\1"', content)
                
                content = re.sub(r'from\s+["\']\.\./\.\./components/([^"\']+)["\']', r'from "@/components/\1"', content)
                content = re.sub(r'from\s+["\']\.\./\.\./hooks/([^"\']+)["\']', r'from "@/hooks/\1"', content)
                
                with open(filepath, 'w') as f:
                    f.write(content)

if __name__ == "__main__":
    fix_imports("src")
