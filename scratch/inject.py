import json

with open('missing_en.json', 'r', encoding='utf-8') as f:
    en_missing = json.load(f)
with open('missing_kn.json', 'r', encoding='utf-8') as f:
    kn_missing = json.load(f)
with open('missing_ta.json', 'r', encoding='utf-8') as f:
    ta_missing = json.load(f)

with open('content/translate_json.js', 'r', encoding='utf-8') as f:
    content = f.read()

def insert_into_map(content, map_name, missing_dict):
    search_str = f'const {map_name} = {{'
    idx = content.find(search_str)
    if idx != -1:
        insert_idx = idx + len(search_str)
        insert_str = '\n'
        for k, v in missing_dict.items():
            if v:
                insert_str += f'  "{k}": "{v}",\n'
        return content[:insert_idx] + insert_str + content[insert_idx:]
    return content

content = insert_into_map(content, 'enMap', en_missing)
content = insert_into_map(content, 'knMap', kn_missing)
content = insert_into_map(content, 'taMap', ta_missing)

with open('content/translate_json.js', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated translate_json.js')
