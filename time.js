// Explicit capital-city rules for the supported planning window, 2026–2027.
// See SOURCES.md. Offsets are minutes east of UTC; no device timezone dependency.
(function (root) {
  const cities = [
    ['Victoria','Colombie-Britannique','British Columbia',-480,'permanent',-420],
    ['Whitehorse','Yukon','Yukon',-420,'fixed',-420],
    ['Edmonton','Alberta','Alberta',-420,'permanent',-360],
    ['Yellowknife','Territoires du Nord-Ouest','Northwest Territories',-420,'permanent',-360],
    ['Regina','Saskatchewan','Saskatchewan',-360,'fixed',-360],
    ['Winnipeg','Manitoba','Manitoba',-360,'permanent',-300],
    ['Ottawa','Ontario · référence','Ontario · reference',-300,'seasonal'],
    ['Québec','Québec','Quebec',-300,'seasonal'],
    ['Iqaluit','Nunavut','Nunavut',-300,'seasonal'],
    ['Fredericton','Nouveau-Brunswick','New Brunswick',-240,'seasonal'],
    ['Charlottetown','Île-du-Prince-Édouard','Prince Edward Island',-240,'seasonal'],
    ['Halifax','Nouvelle-Écosse','Nova Scotia',-240,'seasonal'],
    ["St. John's",'Terre-Neuve-et-Labrador','Newfoundland and Labrador',-210,'seasonal']
  ].map(([name,fr,en,standard,policy,fixed])=>({name,fr,en,standard,policy,fixed}));
  const ottawa = cities.find(c=>c.name==='Ottawa');
  function sunday(year,month,n) { return 1+(7-new Date(Date.UTC(year,month,1)).getUTCDay())%7+(n-1)*7; }
  function offset(city,instant) {
    const year=new Date(instant).getUTCFullYear();
    if(city.policy==='fixed') return city.fixed;
    const start=Date.UTC(year,2,sunday(year,2,2),2)-city.standard*60000;
    if(city.policy==='permanent' && instant>=Date.UTC(2026,2,8,2)-city.standard*60000) return city.fixed;
    const end=Date.UTC(year,10,sunday(year,10,1),2)-(city.standard+60)*60000;
    return city.standard+(instant>=start && instant<end ? 60 : 0);
  }
  function wall(city,instant) { return new Date(instant+offset(city,instant)*60000); }
  function resolve(date,minutes) {
    const base=Date.parse(date+'T00:00:00Z')+minutes*60000;
    return [-300,-240].map(o=>base-o*60000).filter(t=>offset(ottawa,t)===(base-t)/60000).sort((a,b)=>a-b);
  }
  const api={cities,ottawa,offset,wall,resolve};
  if(typeof module!=='undefined') module.exports=api; else root.TimeRules=api;
})(globalThis);
