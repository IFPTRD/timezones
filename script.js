const {cities,ottawa,offset,wall,resolve}=TimeRules;
const $=id=>document.getElementById(id);
const words={
 en:{title:'Canada, at the same time',eyebrow:'A meeting planner for Ottawa & the provinces and territories',subtitle:'One Ottawa time. Every capital. See who shares the same hour — and when that changes.',notice:'November 1, 2026: Ottawa turns clocks back. Six western and northern jurisdictions do not.',plannerTitle:'Your reference time',now:'Use current time',sliderLabel:'Move through the day in Ottawa',exactLabel:'Exact time',transitionTitle:'The clocks stay put. The difference changes.',transitionText:'When Ottawa falls back on November 1, the six capitals on year-round time become one hour closer to Ottawa. Compare the same Ottawa hour on either side.',before:'Oct 31 · Before',after:'Nov 1 · After',print:'🖨️ Print',resultsTitle:'At this moment across Canada',resultsHelp:'Cities in the same column share the same local time. All differences are relative to Ottawa.',copy:'Copy meeting times',legend:'● Filled dot = 08:30–16:30 local, Monday–Friday (illustrative office hours; holidays not included).',compareTitle:'What changes on November 1?',compareHelp:'Same Ottawa meeting time, different relationship. These six capitals do not turn their clocks back.',scope:'Capital-city times only — not every community in a province or territory. Ottawa represents Ontario; Toronto is omitted. Planning window: January 2026–December 2027.',verified:'Rules checked against government sources on October 22, 2026. Future legislation may change these rules. Confirm important invitations in an updated calendar.',method:'Sources & calculation notes',same:'Same as Ottawa',behind:'behind Ottawa',ahead:'ahead of Ottawa',previous:'Previous day',next:'Next day',today:'Same day as Ottawa',fixed:'No clock change Nov 1',seasonal:'Clocks fall back with Ottawa',selected:'Selected meeting time',live:'Current time · refreshes every minute',gap:'This Ottawa time does not exist: clocks jump from 02:00 to 03:00. Choose another time.',ambiguous:'This Ottawa time occurs twice. Choose which occurrence:',first:'First · UTC−4',second:'Second · UTC−5',invalid:'Enter a valid hour (0–23) and minute (0–59).',copied:'Meeting times copied.',copyFailed:'Clipboard unavailable. Select and copy the times below.',capital:'Capital',beforeHead:'Oct 31 · vs Ottawa',afterHead:'Nov 1 · vs Ottawa',local:'Year-round offset',prevMonth:'Previous month',nextMonth:'Next month',hour:'Ottawa hour (24-hour)',minute:'Ottawa minute'},
 fr:{title:'Le Canada, au même moment',eyebrow:'Planifier une réunion entre Ottawa, les provinces et les territoires',subtitle:'Une heure à Ottawa. Toutes les capitales. Voyez qui partage la même heure — et quand cela change.',notice:'Le 1er novembre 2026 : Ottawa recule l’heure. Six provinces et territoires de l’Ouest et du Nord ne la changent pas.',plannerTitle:'Votre heure de référence',now:'Heure actuelle',sliderLabel:'Parcourez la journée à Ottawa',exactLabel:'Heure précise',transitionTitle:'L’heure reste fixe. Le décalage change.',transitionText:'Quand Ottawa recule l’heure le 1er novembre, le décalage avec les six capitales à heure fixe diminue d’une heure. Comparez la même heure d’Ottawa avant et après.',before:'31 oct. · Avant',after:'1er nov. · Après',print:'🖨️ Imprimer',resultsTitle:'Au même moment au Canada',resultsHelp:'Les villes d’une même colonne partagent la même heure locale. Tous les décalages sont par rapport à Ottawa.',copy:'Copier les heures',legend:'● Point plein = 8 h 30 à 16 h 30, du lundi au vendredi (heures de bureau indicatives; jours fériés exclus).',compareTitle:'Qu’est-ce qui change le 1er novembre?',compareHelp:'Même heure de réunion à Ottawa, mais un décalage différent. Ces six capitales ne reculent pas l’heure.',scope:'Heures des capitales seulement — pas de toutes les localités. Ottawa représente l’Ontario; Toronto est omise. Période de planification : janvier 2026 à décembre 2027.',verified:'Règles vérifiées auprès de sources gouvernementales le 22 octobre 2026. La législation peut changer. Confirmez les invitations importantes dans un calendrier à jour.',method:'Sources et méthode de calcul',same:'Même heure qu’à Ottawa',behind:'de moins qu’à Ottawa',ahead:'de plus qu’à Ottawa',previous:'La veille',next:'Le lendemain',today:'Même jour qu’à Ottawa',fixed:'Aucun changement le 1er nov.',seasonal:'Recule l’heure avec Ottawa',selected:'Heure de réunion choisie',live:'Heure actuelle · actualisée chaque minute',gap:'Cette heure n’existe pas à Ottawa : l’horloge passe de 2 h à 3 h. Choisissez une autre heure.',ambiguous:'Cette heure survient deux fois à Ottawa. Choisissez l’occurrence :',first:'Première · UTC−4',second:'Deuxième · UTC−5',invalid:'Entrez une heure (0–23) et des minutes (0–59) valides.',copied:'Heures de réunion copiées.',copyFailed:'Presse-papiers indisponible. Sélectionnez et copiez les heures ci-dessous.',capital:'Capitale',beforeHead:'31 oct. · écart avec Ottawa',afterHead:'1er nov. · écart avec Ottawa',local:'Décalage fixe',prevMonth:'Mois précédent',nextMonth:'Mois suivant',hour:'Heure à Ottawa (sur 24 heures)',minute:'Minutes à Ottawa'}
};
let lang=new URLSearchParams(location.search).get('lang')==='fr'?'fr':'en', h24=lang==='fr', live=true, occurrence=0;
let date,minutes,viewYear,viewMonth,instant;
let theme=matchMedia('(prefers-color-scheme: light)').matches?'day':'night';
try { theme=localStorage.getItem('timezones-theme')||theme; } catch {}
const cityFlags={'Victoria':'bc','Whitehorse':'yt','Edmonton':'ab','Yellowknife':'nt','Regina':'sk','Winnipeg':'mb','Ottawa':'on','Québec':'qc','Iqaluit':'nu','Fredericton':'nb','Charlottetown':'pe','Halifax':'ns',"St. John's":'nl'};
const flagFor=city=>cityFlags[city.name];
function updateTheme(){
 document.documentElement.dataset.theme=theme;
 $('theme').textContent=lang==='en'?(theme==='day'?'☾ Night mode':'☀ Day mode'):(theme==='day'?'☾ Mode nuit':'☀ Mode jour');
 $('theme').setAttribute('aria-label',$('theme').textContent);
}
$('theme').onclick=()=>{theme=theme==='day'?'night':'day';try{localStorage.setItem('timezones-theme',theme);}catch{}updateTheme();};
const locale=()=>lang==='fr'?'fr-CA':'en-CA';
const iso=d=>d.toISOString().slice(0,10);
function current(){const d=wall(ottawa,Date.now());date=iso(d);minutes=d.getUTCHours()*60+d.getUTCMinutes();if(date<'2026-01-01'||date>'2027-12-31'){date='2026-10-31';live=false;}viewYear=+date.slice(0,4);viewMonth=+date.slice(5,7)-1;const candidates=resolve(date,minutes);occurrence=candidates.length===2 && Date.now()>=candidates[1]?1:0;}
function time(d){return new Intl.DateTimeFormat(locale(),{timeZone:'UTC',hour:'numeric',minute:'2-digit',hour12:!h24}).format(d);}
function dateText(d,options={year:'numeric',month:'long',day:'numeric'}){return new Intl.DateTimeFormat(locale(),{timeZone:'UTC',...options}).format(d);}
function difference(n){const t=words[lang];if(!n)return t.same;const a=Math.abs(n);return `${Math.floor(a/60)?Math.floor(a/60)+' h':''}${a%60?' 30 min':''} ${n<0?t.behind:t.ahead}`;}
function utc(n){return 'UTC'+(n<0?'−':'+')+String(Math.floor(Math.abs(n)/60)).padStart(2,'0')+':'+String(Math.abs(n)%60).padStart(2,'0');}
function calendar(){
 $('month').textContent=dateText(new Date(Date.UTC(viewYear,viewMonth,1)),{month:'long',year:'numeric'});
 $('weekdays').innerHTML=Array.from({length:7},(_,i)=>`<span>${dateText(new Date(Date.UTC(2026,9,19+i)),{weekday:'narrow'})}</span>`).join('');
 const start=(new Date(Date.UTC(viewYear,viewMonth,1)).getUTCDay()+6)%7,count=new Date(Date.UTC(viewYear,viewMonth+1,0)).getUTCDate();
 $('days').replaceChildren();for(let i=0;i<start;i++)$('days').append(document.createElement('span'));
 for(let i=1;i<=count;i++){const d=new Date(Date.UTC(viewYear,viewMonth,i)),s=iso(d),b=document.createElement('button');b.textContent=i;b.className=s===date?'selected':'';b.setAttribute('aria-label',dateText(d));b.setAttribute('aria-pressed',String(s===date));b.onclick=()=>{date=s;live=false;occurrence=0;render();};$('days').append(b);}
 $('prevMonth').disabled=viewYear===2026&&viewMonth===0;$('nextMonth').disabled=viewYear===2027&&viewMonth===11;
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
 if(!candidates.length){$('groups').replaceChildren();return;}
 const groups=new Map();for(const c of cities){const diff=offset(c,instant)-offset(ottawa,instant);if(!groups.has(diff))groups.set(diff,[]);groups.get(diff).push(c);}
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
for(const [id,n] of [['prevMonth',-1],['nextMonth',1]])$(id).onclick=()=>{const d=new Date(Date.UTC(viewYear,viewMonth+n,1));viewYear=d.getUTCFullYear();viewMonth=d.getUTCMonth();calendar();};
for(const [id,s] of [['before','2026-10-31'],['after','2026-11-01']])$(id).onclick=()=>{date=s;viewYear=2026;viewMonth=+s.slice(5,7)-1;live=false;occurrence=0;render();};
$('first').onclick=()=>{occurrence=0;render();};$('second').onclick=()=>{occurrence=1;render();};
for(const m of [540,630,720,780,840,900]){const b=document.createElement('button');b.textContent=String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');b.onclick=()=>choose(m);$('presets').append(b);}
$('copy').onclick=async()=>{const text=cities.map(c=>{const d=wall(c,instant);return `${c.name}: ${dateText(d)} · ${time(d)} (${utc(offset(c,instant))})`;}).join('\n');try{await navigator.clipboard.writeText(text);$('copyStatus').textContent=words[lang].copied;}catch{$('copyStatus').textContent=words[lang].copyFailed;const pre=document.createElement('pre');pre.style.whiteSpace='pre-wrap';pre.textContent=text;$('copyStatus').append(pre);}};
$('print').onclick=()=>window.print();
$('sources').innerHTML=[['B.C. / C.-B.','https://www2.gov.bc.ca/gov/content/governments/celebrating-british-columbia/daylight-saving-time'],['Alberta','https://www.alberta.ca/albertas-new-time-system-abt'],['NWT / T.N.-O.','https://www.gov.nt.ca/en/newsroom/northwest-territories-ends-seasonal-time-change'],['Manitoba','https://news.gov.mb.ca/news/index.html?archive=&item=75397'],['Yukon','https://yukon.ca/en/your-government/about-yukon/learn-about-yukon-standard-time'],['Saskatchewan','https://www.saskatchewan.ca/government/municipal-administration/tools-guides-and-resources/saskatchewan-time-system']].map(([n,u])=>`<a href="${u}">${n}</a>`).join('');
current();render();setInterval(()=>{if(live){current();render();}},60000);
