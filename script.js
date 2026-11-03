const {cities,ottawa,offset,wall,resolve}=TimeRules;
const {provinces,zones,markers}=CanadaMap;
const $=id=>document.getElementById(id);
const words={
 en:{title:'Canada, at the same time',eyebrow:'A meeting planner for Ottawa & the provinces and territories',subtitle:'One Ottawa time. Every capital. See who shares the same hour — and when that changes.',notice:'November 1, 2026: Ottawa turned clocks back. Six western and northern jurisdictions did not.',plannerTitle:'Your reference time',now:'Use current time',sliderLabel:'Move through the day in Ottawa',exactLabel:'Exact time',transitionTitle:'The clocks stayed put. The difference changed.',transitionText:'When Ottawa fell back on November 1, the six capitals on year-round time became one hour closer to Ottawa. Compare the same Ottawa hour on either side.',before:'Oct 31 · Before',after:'Nov 1 · After',print:'🖨️ Print',resultsTitle:'At this moment across Canada',resultsHelp:'Cities in the same column share the same local time. All differences are relative to Ottawa.',showMap:'🗺️ Show map',hideMap:'🗺️ Hide map',mapCaption:'Shaded by time difference relative to Ottawa, including intra-provincial time zones and year-round pockets (e.g., Northern Ontario, Labrador, Nunavut, Basse-Côte-Nord).',mapAria:'Map of Canada showing time differences relative to Ottawa',mapExceptions:'Regional fixed-time / split-zone exception',copy:'Copy meeting times',legend:'● Filled dot = 08:30–16:30 local, Monday–Friday (illustrative office hours; holidays not included).',compareTitle:'What changed on November 1?',compareHelp:'Same Ottawa meeting time, different relationship. These six capitals did not turn their clocks back.',scope:'Capital-city times only — not every community in a province or territory.',verified:'Rules checked against government sources on October 22, 2026. Future legislation may change these rules. Confirm important invitations in an updated calendar.',method:'Sources & calculation notes',same:'Same as Ottawa',behind:'behind Ottawa',ahead:'ahead of Ottawa',previous:'Previous day',next:'Next day',today:'Same day as Ottawa',fixed:'No clock change Nov 1',seasonal:'Clocks fell back',selected:'Selected meeting time',live:'Current time · refreshes every minute',gap:'This Ottawa time does not exist: clocks jump from 02:00 to 03:00. Choose another time.',ambiguous:'This Ottawa time occurs twice. Choose which occurrence:',first:'First · UTC−4',second:'Second · UTC−5',invalid:'Enter a valid hour (0–23) and minute (0–59).',copied:'Meeting times copied.',copyFailed:'Clipboard unavailable. Select and copy the times below.',capital:'Capital',beforeHead:'Oct 31 · vs Ottawa',afterHead:'Nov 1 · vs Ottawa',local:'Year-round offset',prevMonth:'Previous month',nextMonth:'Next month',hour:'Ottawa hour (24-hour)',minute:'Ottawa minute'},
 fr:{title:'Le Canada, au même moment',eyebrow:'Planifier une réunion entre Ottawa, les provinces et les territoires',subtitle:'Une heure à Ottawa. Toutes les capitales. Voyez qui partage la même heure — et quand cela change.',notice:'Le 1er novembre 2026 : Ottawa a reculé l’heure. Six provinces et territoires de l’Ouest et du Nord ne l’ont pas changée.',plannerTitle:'Votre heure de référence',now:'Heure actuelle',sliderLabel:'Parcourez la journée à Ottawa',exactLabel:'Heure précise',transitionTitle:'L’heure est restée fixe. Le décalage a changé.',transitionText:'Quand Ottawa a reculé l’heure le 1er novembre, le décalage avec les six capitales à heure fixe a diminué d’une heure. Comparez la même heure d’Ottawa avant et après.',before:'31 oct. · Avant',after:'1er nov. · Après',print:'🖨️ Imprimer',resultsTitle:'Au même moment au Canada',resultsHelp:'Les villes d’une même colonne partagent la même heure locale. Tous les décalages sont par rapport à Ottawa.',showMap:'🗺️ Afficher la carte',hideMap:'🗺️ Masquer la carte',mapCaption:'Coloré selon l’écart par rapport à Ottawa, incluant les fuseaux intraprovinciaux et les régions sans changement d’heure (p. ex. Nord de l’Ontario, Labrador, Nunavut, Basse-Côte-Nord).',mapAria:'Carte du Canada illustrant les décalages horaires par rapport à Ottawa',mapExceptions:'Exception régionale (heure fixe / fuseau distinct)',copy:'Copier les heures',legend:'● Point plein = 8 h 30 à 16 h 30, du lundi au vendredi (heures de bureau indicatives; jours fériés exclus).',compareTitle:'Qu’est-ce qui a changé le 1er novembre?',compareHelp:'Même heure de réunion à Ottawa, mais un décalage différent. Ces six capitales n’ont pas reculé l’heure.',scope:'Heures des capitales seulement — pas de toutes les localités.',verified:'Règles vérifiées auprès de sources gouvernementales le 22 octobre 2026. La législation peut changer. Confirmez les invitations importantes dans un calendrier à jour.',method:'Sources et méthode de calcul',same:'Même heure qu’à Ottawa',behind:'de moins qu’à Ottawa',ahead:'de plus qu’à Ottawa',previous:'La veille',next:'Le lendemain',today:'Même jour qu’à Ottawa',fixed:'Aucun changement le 1er nov.',seasonal:'A reculé l’heure',selected:'Heure de réunion choisie',live:'Heure actuelle · actualisée chaque minute',gap:'Cette heure n’existe pas à Ottawa : l’horloge passe de 2 h à 3 h. Choisissez une autre heure.',ambiguous:'Cette heure survient deux fois à Ottawa. Choisissez l’occurrence :',first:'Première · UTC−4',second:'Deuxième · UTC−5',invalid:'Entrez une heure (0–23) et des minutes (0–59) valides.',copied:'Heures de réunion copiées.',copyFailed:'Presse-papiers indisponible. Sélectionnez et copiez les heures ci-dessous.',capital:'Capitale',beforeHead:'31 oct. · écart avec Ottawa',afterHead:'1er nov. · écart avec Ottawa',local:'Décalage fixe',prevMonth:'Mois précédent',nextMonth:'Mois suivant',hour:'Heure à Ottawa (sur 24 heures)',minute:'Minutes à Ottawa'}
};
let lang=new URLSearchParams(location.search).get('lang')==='fr'?'fr':'en', h24=lang==='fr', live=true, occurrence=0, showMap=new URLSearchParams(location.search).get('map')==='1';
let date,minutes,viewYear,viewMonth,instant;
let theme=matchMedia('(prefers-color-scheme: light)').matches?'day':'night';
try { theme=localStorage.getItem('timezones-theme')||theme; } catch {}
const cityFlags={'Victoria':'bc','Whitehorse':'yt','Edmonton':'ab','Yellowknife':'nt','Regina':'sk','Winnipeg':'mb','Toronto':'on','Ottawa':'on','Québec':'qc','Iqaluit':'nu','Fredericton':'nb','Charlottetown':'pe','Halifax':'ns',"St. John's":'nl'};
const flagFor=city=>cityFlags[city.name];
const cityByCode=Object.fromEntries(cities.map(c=>[flagFor(c),c]));
function updateTheme(){
 document.documentElement.dataset.theme=theme;
 $('theme').textContent=lang==='en'?(theme==='day'?'☾ Night mode':'☀ Day mode'):(theme==='day'?'☾ Mode nuit':'☀ Mode jour');
 $('theme').setAttribute('aria-label',$('theme').textContent);
}
$('theme').onclick=()=>{theme=theme==='day'?'night':'day';try{localStorage.setItem('timezones-theme',theme);}catch{}updateTheme();};
const locale=()=>lang==='fr'?'fr-CA':'en-CA';
const iso=d=>d.toISOString().slice(0,10);
function current(){const d=wall(ottawa,Date.now());date=iso(d);minutes=d.getUTCHours()*60+d.getUTCMinutes();if(date<'2026-01-01'){date='2026-10-31';live=false;}viewYear=+date.slice(0,4);viewMonth=+date.slice(5,7)-1;const candidates=resolve(date,minutes);occurrence=candidates.length===2 && Date.now()>=candidates[1]?1:0;}
function time(d){return new Intl.DateTimeFormat(locale(),{timeZone:'UTC',hour:'numeric',minute:'2-digit',hour12:!h24}).format(d);}
function dateText(d,options={year:'numeric',month:'long',day:'numeric'}){return new Intl.DateTimeFormat(locale(),{timeZone:'UTC',...options}).format(d);}
function difference(n){const t=words[lang];if(!n)return t.same;const a=Math.abs(n);return `${Math.floor(a/60)?Math.floor(a/60)+' h':''}${a%60?' 30 min':''} ${n<0?t.behind:t.ahead}`;}
function shortDiff(n){if(!n)return '0 h';const a=Math.abs(n);return `${n<0?'−':'+'}${Math.floor(a/60)?Math.floor(a/60)+' h':''}${a%60?' 30':''}`;}
function utc(n){return 'UTC'+(n<0?'−':'+')+String(Math.floor(Math.abs(n)/60)).padStart(2,'0')+':'+String(Math.abs(n)%60).padStart(2,'0');}
function calendar(){
 $('month').textContent=dateText(new Date(Date.UTC(viewYear,viewMonth,1)),{month:'long',year:'numeric'});
 $('weekdays').innerHTML=Array.from({length:7},(_,i)=>`<span>${dateText(new Date(Date.UTC(2026,9,19+i)),{weekday:'narrow'})}</span>`).join('');
 const start=(new Date(Date.UTC(viewYear,viewMonth,1)).getUTCDay()+6)%7,count=new Date(Date.UTC(viewYear,viewMonth+1,0)).getUTCDate();
 $('days').replaceChildren();for(let i=0;i<start;i++)$('days').append(document.createElement('span'));
 for(let i=1;i<=count;i++){const d=new Date(Date.UTC(viewYear,viewMonth,i)),s=iso(d),b=document.createElement('button');b.textContent=i;b.className=s===date?'selected':'';b.setAttribute('aria-label',dateText(d));b.setAttribute('aria-pressed',String(s===date));b.onclick=()=>{date=s;live=false;occurrence=0;render();};$('days').append(b);}
 $('prevMonth').disabled=viewYear===2026&&viewMonth===0;$('nextMonth').disabled=false;
}
function renderMap(groups){
 const t=words[lang];
 $('mapToggle').textContent=showMap?t.hideMap:t.showMap;
 $('mapToggle').setAttribute('aria-pressed',String(showMap));
 $('mapToggle').setAttribute('aria-expanded',String(showMap));
 $('mapPanel').hidden=!showMap;
 $('canadaMap').setAttribute('aria-label',t.mapAria);
 if(!groups){$('mapLegend').replaceChildren();$('canadaMap').replaceChildren();return;}
 const sorted=[...groups.entries()].sort((a,b)=>a[0]-b[0]);
 $('mapLegend').innerHTML=sorted.map(([diff,list])=>`<span class="legend-item"><span class="swatch" data-diff="${diff}"></span><strong>${shortDiff(diff)}</strong><span>${difference(diff)} · ${time(wall(list[0],instant))}</span></span>`).join('')+`<span class="legend-item"><span class="swatch swatch-exception"></span><span>${t.mapExceptions}</span></span>`;
 const defs=`<defs>${['on','qc','bc'].map(k=>`<clipPath id="clip-${k}"><path d="${provinces[k]}"/></clipPath>`).join('')}<pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="var(--map-hatch)" stroke-width="2.2"/></pattern></defs>`;
 const pathsHtml=Object.entries(provinces).map(([code,d])=>{
  const c=cityByCode[code],diff=offset(c,instant)-offset(ottawa,instant),local=wall(c,instant);
  return `<path class="prov" data-prov="${code}" data-diff="${diff}" d="${d}"><title>${c[lang]} (${c.name}) · ${difference(diff)} · ${time(local)}</title></path>`;
 }).join('');
 const zonesHtml=(zones||[]).map(z=>{
  const diff=offset(z,instant)-offset(ottawa,instant),local=wall(z,instant),clip=z.clip?` clip-path="url(#clip-${z.clip})"`:'';
  const hatch=z.hatched?`<path class="subprov-hatch" d="${z.d}"${clip} fill="url(#hatch)" pointer-events="none"/>`:'';
  const border=z.line?`<path class="zone-divider" d="${z.line}"${clip} pointer-events="none"/>`:'';
  return `<g class="subzone"><path class="subprov ${z.hatched?'fixed-pocket':''}" data-zone="${z.id}" data-diff="${diff}" d="${z.d}"${clip}><title>${z[lang]} · ${difference(diff)} · ${time(local)}</title></path>${hatch}${border}</g>`;
 }).join('');
 const bordersHtml=Object.entries(provinces).map(([,d])=>`<path class="prov-border" d="${d}" pointer-events="none"/>`).join('');
 const markersHtml=markers.map(m=>{
  const c=m.ref?ottawa:cityByCode[m.code],diff=m.ref?0:offset(c,instant)-offset(ottawa,instant),local=wall(c,instant);
  const label=m.ref?'Ottawa ★':c.name,sub=`${shortDiff(diff)} · ${time(local)}`;
  const w=Math.max(label.length*7.2,sub.length*6.4)+20;
  return `<g class="map-marker ${m.ref?'ref':''}" data-diff="${diff}"><line x1="${m.x}" y1="${m.y}" x2="${m.lx}" y2="${m.ly}"/><circle cx="${m.x}" cy="${m.y}" r="${m.ref?6:4.5}"/><g transform="translate(${m.lx-w/2},${m.ly-19})"><rect width="${w}" height="38" rx="6"/><text class="marker-city" x="${w/2}" y="15" text-anchor="middle">${label}</text><text class="marker-time" x="${w/2}" y="30" text-anchor="middle">${sub}</text></g></g>`;
 }).join('');
 $('canadaMap').innerHTML=`<svg viewBox="0 0 1015 950" xmlns="http://www.w3.org/2000/svg">${defs}<g class="map-provinces">${pathsHtml}</g><g class="map-subregions">${zonesHtml}</g><g class="map-borders">${bordersHtml}</g><g class="map-markers">${markersHtml}</g></svg>`;
}
function comparison(){const t=words[lang];$('compareHead').innerHTML=`<tr><th>${t.capital}</th><th>${t.beforeHead}</th><th>${t.afterHead}</th><th>${t.local}</th></tr>`;
 $('compareBody').innerHTML=cities.filter(c=>c.policy!=='seasonal').map(c=>`<tr><td>${c.name}</td><td>${difference(c.fixed+240)}</td><td class="changed">${difference(c.fixed+300)}</td><td>${utc(c.fixed)}</td></tr>`).join('');}
function render(){
 const t=words[lang];document.documentElement.lang=locale();document.title=t.title;
 updateTheme();$('dateSummary').textContent=lang==='en'?'Change date & time':'Modifier la date et l’heure';
 for(const key of Object.keys(t))if($(key)&&!['prevMonth','nextMonth','hour','minute'].includes(key))$(key).textContent=t[key];
 $('language').textContent=lang==='en'?'Français':'English';$('language').lang=lang==='en'?'fr-CA':'en-CA';
 $('format').textContent=h24?'12 h':'24 h';$('format').setAttribute('aria-label',lang==='en'?'Switch hour format':'Changer le format de l’heure');
 $('hour').setAttribute('aria-label',t.hour);$('minute').setAttribute('aria-label',t.minute);
 $('prevMonth').setAttribute('aria-label',t.prevMonth);$('nextMonth').setAttribute('aria-label',t.nextMonth);
 $('slider').value=minutes;$('hour').value=Math.floor(minutes/60);$('minute').value=String(minutes%60).padStart(2,'0');
 $('before').setAttribute('aria-pressed',String(date<='2026-10-31'));$('after').setAttribute('aria-pressed',String(date>='2026-11-01'));
 calendar();comparison();$('copyStatus').textContent='';
 const candidates=resolve(date,minutes);instant=candidates[occurrence]??candidates[0];
 if(candidates.length!==1) $('datePanel').open=true;
 $('fold').hidden=candidates.length!==2;$('first').setAttribute('aria-pressed',String(occurrence===0));$('second').setAttribute('aria-pressed',String(occurrence===1));
 $('timeError').textContent=!candidates.length?t.gap:candidates.length===2?t.ambiguous:'';
 $('copy').disabled=!candidates.length;
 $('anchorTime').textContent=time(new Date(date+'T00:00Z').getTime()+minutes*60000);
 $('anchorDate').textContent=dateText(new Date(date+'T12:00Z'),{weekday:'long',month:'long',day:'numeric',year:'numeric'});
 $('mode').textContent=live?t.live:t.selected;
 $('anchorZone').textContent=candidates.length?utc(offset(ottawa,instant)):'—';
 if(!candidates.length){$('groups').replaceChildren();renderMap(null);return;}
 const groups=new Map();for(const c of cities){const diff=offset(c,instant)-offset(ottawa,instant);if(!groups.has(diff))groups.set(diff,[]);groups.get(diff).push(c);}
 renderMap(groups);
 $('groups').style.setProperty('--columns',groups.size);
 $('groups').innerHTML=[...groups.entries()].sort((a,b)=>a[0]-b[0]).map(([diff,list])=>{const d=wall(list[0],instant),day=iso(d),relation=day<date?t.previous:day>date?t.next:t.today;
 return `<article class="group ${diff===0?'reference':''}"><div class="group-head"><h3>${difference(diff)}</h3><div class="group-time">${time(d)}</div><div class="day-label">${relation} · ${dateText(d,{month:'short',day:'numeric'})}</div></div><div class="city-list">${list.map(c=>{const local=wall(c,instant),m=local.getUTCHours()*60+local.getUTCMinutes(),work=local.getUTCDay()>0&&local.getUTCDay()<6&&m>=510&&m<990;return `<div class="city"><strong><img class="flag" src="assets/flags/${flagFor(c)}.svg" alt="" width="24" height="16">${c.name}<span class="work ${work?'on':''}" aria-hidden="true"></span></strong><div class="province">${c[lang]}</div><div class="policy">${c.policy==='seasonal'?t.seasonal:t.fixed}</div></div>`;}).join('')}</div></article>`;}).join('');
 $('slider').setAttribute('aria-valuetext',time(wall(ottawa,instant))+' Ottawa');
}
function choose(m){minutes=m;live=false;occurrence=0;render();}
$('slider').oninput=e=>choose(+e.target.value);
function exact(){const h=$('hour'),m=$('minute');if(!h.value||!m.value||!h.checkValidity()||!m.checkValidity()){ $('timeError').textContent=words[lang].invalid;return;}choose(+h.value*60+(+m.value));}
$('hour').onchange=exact;$('minute').onchange=exact;
$('now').onclick=()=>{live=true;current();render();};
$('language').onclick=()=>{lang=lang==='en'?'fr':'en';h24=lang==='fr';const u=new URL(location.href);u.searchParams.set('lang',lang);history.replaceState(null,'',u);render();};
$('format').onclick=()=>{h24=!h24;render();};
$('mapToggle').onclick=()=>{showMap=!showMap;render();};
for(const [id,n] of [['prevMonth',-1],['nextMonth',1]])$(id).onclick=()=>{const d=new Date(Date.UTC(viewYear,viewMonth+n,1));viewYear=d.getUTCFullYear();viewMonth=d.getUTCMonth();calendar();};
for(const [id,s] of [['before','2026-10-31'],['after','2026-11-01']])$(id).onclick=()=>{date=s;viewYear=2026;viewMonth=+s.slice(5,7)-1;live=false;occurrence=0;render();};
$('first').onclick=()=>{occurrence=0;render();};$('second').onclick=()=>{occurrence=1;render();};
for(const m of [540,630,720,780,840,900]){const b=document.createElement('button');b.textContent=String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');b.onclick=()=>choose(m);$('presets').append(b);}
$('copy').onclick=async()=>{const text=cities.map(c=>{const d=wall(c,instant);return `${c.name}: ${dateText(d)} · ${time(d)} (${utc(offset(c,instant))})`;}).join('\n');try{await navigator.clipboard.writeText(text);$('copyStatus').textContent=words[lang].copied;}catch{$('copyStatus').textContent=words[lang].copyFailed;const pre=document.createElement('pre');pre.style.whiteSpace='pre-wrap';pre.textContent=text;$('copyStatus').append(pre);}};
$('print').onclick=()=>window.print();
$('sources').innerHTML=[['B.C. / C.-B.','https://www2.gov.bc.ca/gov/content/governments/celebrating-british-columbia/daylight-saving-time'],['Alberta','https://www.alberta.ca/albertas-new-time-system-abt'],['NWT / T.N.-O.','https://www.gov.nt.ca/en/newsroom/northwest-territories-ends-seasonal-time-change'],['Manitoba','https://news.gov.mb.ca/news/index.html?archive=&item=75397'],['Yukon','https://yukon.ca/en/your-government/about-yukon/learn-about-yukon-standard-time'],['Saskatchewan','https://www.saskatchewan.ca/government/municipal-administration/tools-guides-and-resources/saskatchewan-time-system']].map(([n,u])=>`<a href="${u}">${n}</a>`).join('');
current();render();setInterval(()=>{if(live){current();render();}},60000);
