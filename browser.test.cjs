const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
const browser=await chromium.launch({headless:true,args:['--disable-gpu']});
const errors=[];
for(const tz of ['America/Toronto','Asia/Tokyo']){
 const context=await browser.newContext({timezoneId:tz,colorScheme:'dark',viewport:{width:1440,height:1100}});
 const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.SITE_URL || pathToFileURL(path.join(__dirname,'index.html')).href);
 assert.equal(await page.locator('#datePanel').getAttribute('open'),null);
 assert.ok(await page.locator('#groups').evaluate(e=>e.getBoundingClientRect().top)<600,'Columns above fold');
 await page.locator('#theme').click();assert.equal(await page.locator('html').getAttribute('data-theme'),'day');
 await page.reload();assert.equal(await page.locator('html').getAttribute('data-theme'),'day');
 await page.locator('#dateSummary').click();
 await page.locator('#after').click();await page.locator('#presets button').filter({hasText:'14:00'}).click();
 assert.equal(await page.locator('.city').count(),13);
 assert.equal(await page.locator('.group').count(),5);
 const winnipeg=page.locator('.group').filter({has:page.locator('.city strong',{hasText:'Winnipeg'})});
 assert.match(await winnipeg.innerText(),/Same as Ottawa/);
 assert.match(await page.locator('#anchorTime').innerText(),/2:00/);
 await page.locator('#before').click();assert.equal(await page.locator('.group').count(),6);
 assert.match(await winnipeg.innerText(),/1 h behind Ottawa/);
 await page.locator('#after').click();
 await page.locator('#hour').fill('1');await page.locator('#minute').fill('30');await page.locator('#minute').press('Tab');
 assert.equal(await page.locator('#fold').isVisible(),true);
 await page.locator('#second').click();assert.equal(await page.locator('#anchorZone').innerText(),'UTC−05:00');
 await page.locator('#language').click();assert.equal(await page.locator('html').getAttribute('lang'),'fr-CA');
 assert.match(await page.locator('#resultsTitle').innerText(),/Au même moment/);
 await page.locator('#presets button').filter({hasText:'14:00'}).click();
 await page.locator('#dateSummary').click();
 for(const period of ['before','after']){
  await page.locator('#'+period).click();
  const heights=await page.locator('.group-head').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().height));
  assert.ok(Math.max(...heights)-Math.min(...heights)<1,'Equal column header heights');
  const times=await page.locator('.group-time').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().top));
  assert.ok(Math.max(...times)-Math.min(...times)<1,'Aligned clock readouts');
 }
 if(tz==='America/Toronto')await page.screenshot({path:path.join(require('node:os').tmpdir(),'timezones-desktop.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No page overflow');
 assert.ok(await page.locator('#groups').evaluate(e=>e.getBoundingClientRect().top)<750,'Mobile columns prominent');
 if(tz==='America/Toronto')await page.screenshot({path:path.join(require('node:os').tmpdir(),'timezones-mobile.png'),fullPage:true});
 await context.close();
}
assert.deepEqual(errors,[]);await browser.close();console.log('PASS: browser rendering, group changes, fold selector, French, mobile width, Tokyo/Ottawa host zones; zero JS errors');
})();
