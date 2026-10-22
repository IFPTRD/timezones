const assert=require('node:assert/strict');
const {cities,ottawa,offset,wall,resolve}=require('./time.js');
const c=name=>cities.find(c=>c.name===name);
const at=(date,m=720)=>resolve(date,m)[0];
assert.equal(cities.length,13);
for(const [name,before,after] of [['Victoria',-180,-120],['Whitehorse',-180,-120],['Edmonton',-120,-60],['Yellowknife',-120,-60],['Regina',-120,-60],['Winnipeg',-60,0],['Québec',0,0],['Iqaluit',0,0],['Halifax',60,60],["St. John's",90,90]]){
 for(const [date,expected] of [['2026-10-31',before],['2026-11-01',after]])assert.equal(offset(c(name),at(date))-offset(ottawa,at(date)),expected,name+' '+date);
}
assert.equal(resolve('2026-03-08',150).length,0);
assert.equal(resolve('2027-03-14',150).length,0);
assert.equal(resolve('2026-11-01',90).length,2);
assert.equal(resolve('2027-11-07',90).length,2);
assert.equal(resolve('2026-11-01',90)[1]-resolve('2026-11-01',90)[0],3600000);
assert.equal(offset(ottawa,Date.parse('2026-11-01T05:59:00Z')),-240);
assert.equal(offset(ottawa,Date.parse('2026-11-01T06:00:00Z')),-300);
assert.equal(wall(c('Victoria'),at('2026-11-02',30)).toISOString(),'2026-11-01T22:30:00.000Z');
assert.equal(wall(c("St. John's"),at('2026-11-02',1410)).toISOString(),'2026-11-03T01:00:00.000Z');
for(const name of ['Victoria','Edmonton','Yellowknife','Winnipeg']){
 assert.equal(offset(c(name),at('2026-01-10')),c(name).standard);
 assert.equal(offset(c(name),at('2027-01-10')),c(name).fixed);
 assert.equal(offset(c(name),at('2027-07-10')),c(name).fixed);
}
console.log('PASS: 13 capitals; 2026/27 policy rules, transition instants, gaps, folds, half-hour offsets, date rollovers.');
