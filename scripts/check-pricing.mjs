import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {TARIFFS} from '../src/data.ts';
import {calculateVisit} from '../src/pricing.ts';
const c=JSON.parse(readFileSync('site.config.json','utf8'));
assert.deepEqual(TARIFFS.flatMap(t=>t.rateOptions?t.rateOptions.map(o=>o.rate):[t.rate]),c.rates);
assert.deepEqual(TARIFFS.map(t=>t.id),['regular','general','facade-general','after-renovation','turnkey']);
assert.equal(TARIFFS[2].name,'Генеральная уборка с окнами');
for(const t of TARIFFS){assert.equal(t.minPrice,6000);for(const o of t.rateOptions??[{rate:t.rate}])for(const area of [0,1,25,40,60,100,250])assert.equal(calculateVisit(area?[o.rate*area]:[]),area?Math.max(6000,o.rate*area):0);}
for(const [items,total] of [[[],0],[[0],0],[[4500],6000],[[4500,2000],6500],[[1000,2000],6000],[[9000,1000],10000]])assert.equal(calculateVisit(items),total);
for(const items of [[-1],[NaN],[Infinity]])assert.throws(()=>calculateVisit(items));
const calc=readFileSync('src/components/Calculator.tsx','utf8');
assert(!/textarea|clipboard|copyQuote|cleaning-quote|WhatsApp|WA_LINK/.test(calc));
assert(calc.includes('href={PHONE_HREF}')&&calc.includes('Позвонить'));
console.log('Pricing passed: 7 variants × 7 areas, shared minimum, empty total, UI order');
