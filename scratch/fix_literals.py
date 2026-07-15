import json

with open('content/translate_json.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('const enMap = {\\n', 'const enMap = {\n')
text = text.replace('const knMap = {\\n', 'const knMap = {\n')
text = text.replace('const taMap = {\\n', 'const taMap = {\n')

with open('content/translate_json.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Fixed literals')
