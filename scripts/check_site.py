"""Regression checks for the static training site. Standard library only."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import re
import xml.etree.ElementTree as ET

root = Path(__file__).resolve().parent.parent
base = 'https://sd334.github.io/smoky-papits-site/'
pages = ['index.html', 'menu.html', 'cocktails.html', 'kitchen.html', 'events.html', 'contacts.html', 'seo-practice.html']

class Page(HTMLParser):
    def __init__(self, filename):
        super().__init__(convert_charrefs=True)
        self.filename=filename; self.tags=[]; self.ids=[]; self.links=[]; self.scripts=[]; self.meta={}; self.canonicals=[]; self.title=False; self.title_text=''; self.headers=0; self.iframes=0; self.h1=False; self.h1_text=''
    def handle_starttag(self, tag, attrs):
        a=dict(attrs); self.tags.append(tag)
        if 'id' in a: self.ids.append(a['id'])
        if tag=='title': self.title=True
        if tag=='h1': self.headers+=1; self.h1=True
        if tag=='iframe': self.iframes+=1; assert a.get('title'), self.filename+' lacks iframe title'
        if tag=='meta': self.meta[a.get('name') or a.get('property')]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonicals.append(a.get('href'))
        if tag=='a': self.links.append(a.get('href',''))
        if tag=='script' and a.get('src'): self.scripts.append(a['src'])
        if tag=='link' and a.get('rel') in ('stylesheet','icon'): self.scripts.append(a.get('href',''))
    def handle_endtag(self, tag):
        if tag=='title': self.title=False
        if tag=='h1': self.h1=False
    def handle_data(self, data):
        if self.title: self.title_text+=data
        if self.h1: self.h1_text+=data

parsed={}; titles=set()
for filename in pages:
    text=(root/filename).read_text(); page=Page(filename); page.feed(text); parsed[filename]=page
    assert text.lstrip().lower().startswith('<!doctype html>'), filename+' missing standard doctype'
    assert '<html lang="ru">' in text
    assert page.headers==1 and page.h1_text.strip(), filename+' needs one nonempty H1 for this project'
    assert page.title_text.strip() and page.title_text not in titles, filename+' missing or duplicate title'
    titles.add(page.title_text)
    assert page.meta.get('description','').strip(), filename+' missing description'
    assert 'viewport' in page.meta
    assert len(page.ids)==len(set(page.ids)), filename+' duplicate element IDs'
    assert text.count('<main')==text.count('</main>')==1
    assert text.count('<section')==text.count('</section>'), filename+' unclosed section'
    assert '<<div' not in text and 'smoky-papits.ru' not in text and 'tel:+78005553535' not in text
    if filename!='seo-practice.html':
        expected=base+('' if filename=='index.html' else filename)
        assert page.canonicals==[expected]
        assert page.meta.get('og:url')==expected
        assert 'Учебный SEO-проект' in text
    else: assert page.meta.get('robots')=='noindex,follow'
    for src in page.scripts:
        if not urlsplit(src).scheme: assert (root/unquote(urlsplit(src).path)).is_file(), filename+' missing asset '+src

for filename,page in parsed.items():
    for link in page.links:
        url=urlsplit(link)
        if url.scheme or url.netloc: continue
        target=unquote(url.path) or filename
        assert (root/target).is_file(), filename+' broken link '+link
        if url.fragment and target in parsed: assert unquote(url.fragment) in parsed[target].ids, filename+' missing fragment '+link

assert parsed['contacts.html'].iframes==1
assert (root/'contacts.html').read_text().count('</iframe>')==1
site=ET.parse(root/'sitemap.xml'); ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls=[e.text for e in site.findall('s:url/s:loc',ns)]
assert set(urls)=={base+('' if p=='index.html' else p) for p in pages[:-1]} and len(urls)==6
text=(root/'index.html').read_text()
assert 'id="booking-submit"' in text and 'disabled' in text and 'бронирования' in text
for data in re.findall(r'<script type="application/ld\+json">(.*?)</script>',text,re.S):
    schema=json.loads(data); assert schema['@type']=='WebSite' and schema['url']==base
print('PASS: 7 pages; titles, H1, metadata, canonical, assets, all local links and anchors, map structure, Sitemap and demo form.')
