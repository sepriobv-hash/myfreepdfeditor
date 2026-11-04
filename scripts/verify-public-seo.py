"""Read-only production SEO smoke audit; run with Python 3 after deployment."""
import concurrent.futures
from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

BASE = 'https://www.myfreepdfeditor.com'
class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.lang=None; self.canonical=None; self.alternates={}; self.robots=''; self.h1=0; self.title=''; self.description=''; self.in_title=False
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='html': self.lang=a.get('lang')
        if tag=='h1': self.h1+=1
        if tag=='title': self.in_title=True
        if tag=='meta' and a.get('name')=='robots': self.robots=a.get('content','')
        if tag=='meta' and a.get('name')=='description': self.description=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonical=a.get('href')
        if tag=='link' and a.get('rel')=='alternate': self.alternates[a.get('hreflang')]=a.get('href')
    def handle_endtag(self,tag):
        if tag=='title': self.in_title=False
    def handle_data(self,data):
        if self.in_title:self.title+=data

def fetch(url):
    try:
        with urllib.request.urlopen(url,timeout=35) as response:return response.status,response.read().decode(),dict(response.headers),response.url
    except urllib.error.HTTPError as error:return error.code,error.read().decode(),dict(error.headers),error.url

def inspect(url):
    status,html,headers,final=fetch(url);p=Page();p.feed(html)
    errors=[]
    segments=url[len(BASE):].strip('/').split('/')
    locale=segments.pop(0) if segments[0] in ['nl','de','fr','es','it'] else 'en'
    suffix='/'+'/'.join(segments) if any(segments) else ''
    expected={lang:BASE+('' if lang=='en' else '/'+lang)+suffix for lang in ['en','nl','de','fr','es','it']}
    expected['x-default']=expected['en']
    if p.lang!=locale:errors.append('html lang')
    if p.alternates!=expected:errors.append('alternate destinations')
    if status!=200:errors.append(f'HTTP {status}')
    if final!=url:errors.append('redirect')
    if p.canonical!=url:errors.append('canonical')
    if p.h1!=1:errors.append('H1')
    if 'noindex' in p.robots.lower() or any(k.lower()=='x-robots-tag' and 'noindex' in v.lower() for k,v in headers.items()):errors.append('noindex')
    if set(p.alternates)!=set(['en','nl','de','fr','es','it','x-default']):errors.append('alternates')
    if not p.title or not p.description:errors.append('metadata')
    return {'url':url,'status':status,'lang':p.lang,'canonical':p.canonical,'h1':p.h1,'robots':p.robots,'alternates':p.alternates,'title':p.title,'description':p.description,'errors':errors}

def main():
    status,xml,_,_=fetch(BASE+'/sitemaps/pages.xml')
    urls=[n.text for n in ET.fromstring(xml).findall('{*}url/{*}loc')]
    print(f'Checking {len(urls)} published URLs',flush=True)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:pages=list(executor.map(inspect,urls))
    index=fetch(BASE+'/sitemap.xml');robots=fetch(BASE+'/robots.txt')
    invalid={p:fetch(BASE+p)[0] for p in ['/nl/not-a-tool','/zz','/zz/merge-pdf']}
    result={'sitemap_status':status,'sitemap_count':len(urls),'lastmod_present':'<lastmod>' in xml,'sitemap_index_status':index[0],'robots_status':robots[0],'robots_body':robots[1],'invalid_routes':invalid,'pages':[{k:v for k,v in page.items() if k not in ['title','description','alternates']} | {'alternate_count':len(page['alternates'])} for page in pages]}
    result['duplicate_metadata']={field:[{'locale':lang,'value':value,'count':count} for (lang,value),count in Counter((page['lang'],page[field]) for page in pages).items() if count>1] for field in ['title','description']}
    out=Path('docs/validation/production-seo.json');out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    failed=[p for p in pages if p['errors']]
    print(json.dumps({'pages':len(pages),'failed':failed,'invalid_routes':invalid,'sitemap_status':status,'robots_status':robots[0]}))
    if failed or len(pages)!=114 or any(v!=404 for v in invalid.values()):raise SystemExit(1)

if __name__=='__main__':main()
