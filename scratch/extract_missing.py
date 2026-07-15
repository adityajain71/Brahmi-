import re
import json

with open('dev_strings_list.txt', 'r', encoding='utf-8') as f:
    lines = [l.strip() for l in f.readlines() if l.strip()]

with open('content/translate_json.js', 'r', encoding='utf-8') as f:
    content = f.read()

en_map_match = re.search(r'const enMap = (\{.*?\});', content, re.DOTALL)
if en_map_match:
    en_map_str = en_map_match.group(1)
    # Extract keys
    keys = re.findall(r'\"(.*?)\"\s*:', en_map_str)
    keys_set = set(keys)
    
    missing = [l for l in lines if l not in keys_set]
    # Filter out single hindi chars or hindi with brahmi symbols if we don't want to translate them or handled separately.
    missing_filtered = []
    for m in missing:
        if re.match(r'^[\u0900-\u097F\s\W\u11000-\u1107F\u25CC]+$', m):
            continue
        if m.startswith('TODO:') or m.startswith('Cross-checked') or m.startswith('Is the symbol') or m.startswith('What is the Brahmi') or m.startswith('Write ') or m.startswith('Yes, ') or m.startswith('No, ') or m.startswith('backend/') or m.startswith('tf-011'):
            continue
        missing_filtered.append(m)
        
    with open('missing_strings.txt', 'w', encoding='utf-8') as out:
        for m in missing_filtered:
            out.write(m + '\n')
    print(f'Missing {len(missing_filtered)} strings')
