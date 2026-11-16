import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const c=JSON.parse(readFileSync('site.config.json','utf8'));
const html=readFileSync('dist/index.html','utf8');
assert(html.includes(c.cityForms.prepositional)&&html.includes('https://'+c.domain+'/'));
assert(html.includes('lg:grid-cols-[1.1fr_1fr]')&&html.includes('aspect-[4/5]'),'Reference layout missing');
for(const file of ['CNAME','favicon.ico','robots.txt','sitemap.xml','privacy.html','site.webmanifest',c.heroPath,c.ogPath,'metrika.js'])assert(existsSync('dist/'+file),'Missing '+file);
assert.equal(readFileSync('dist/CNAME','utf8').trim(),c.domain);
for(const m of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)){
 const u=new URL(m[1],'https://'+c.domain+'/');
 if(u.hostname===c.domain&&/^\/(assets|images)\//.test(u.pathname))assert(existsSync('dist'+decodeURIComponent(u.pathname)),'Missing '+u.pathname);
}
let ld=0;
for(const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){
 const obj=JSON.parse(m[1]);
 if(obj.hasOfferCatalog){assert.deepEqual(obj.hasOfferCatalog.itemListElement.map(x=>x.priceSpecification.price),c.rates);ld++;}
}
assert(ld>0,'Structured prices missing');
for(const f of ['robots.txt','sitemap.xml','privacy.html'])assert(readFileSync('dist/'+f,'utf8').includes(c.domain));
const metrika=readFileSync('dist/metrika.js','utf8');
assert.equal(Number(metrika.match(/var id = (\d+)/)?.[1]),c.metrikaId);
for(const goal of ['click_phone','click_max','click_telegram','click_whatsapp','calc_interaction'])assert(metrika.includes(goal));
console.log('Release passed: configured city/SEO/structured prices/assets/layout/analytics code');
