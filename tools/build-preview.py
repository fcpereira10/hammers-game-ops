#!/usr/bin/env python3
"""Build a single-file preview of the app for a claude.ai link (testing before production).

The preview runs without Firebase: no sign-in, games stay in the browser, team data is never touched.
Usage: python3 tools/build-preview.py <output.html>
"""
import base64, pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent.parent
out = pathlib.Path(sys.argv[1])
css = (root / 'style.css').read_text()
js = (root / 'app.js').read_text()
logo = 'data:image/png;base64,' + base64.b64encode((root / 'icons' / 'logo.png').read_bytes()).decode()
html = (root / 'index.html').read_text()
splash = re.search(r'<div class="app" id="app">(.*?)</div>\n<div id="layer">', html, re.S).group(1)
version = re.search(r"APP_VERSION='([^']+)'", js).group(1)

page = f'''<title>Hammers Game Ops Preview</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Barlow:wght@400;500;600;700&display=swap">
<style>{css}</style>
<div class="app" id="app">{splash}</div>
<div id="layer"></div>
<script>window.HGO_PREVIEW=true;window.HGO_FIREBASE={{}};</script>
<script type="module">{js}</script>
'''
page = page.replace('icons/logo.png', logo)
out.write_text(page)
print(f'preview {version} -> {out} ({len(page)//1024} KB)')
