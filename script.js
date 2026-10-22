// Canadian capitals and major cities
const locations = [
  { city: 'Ottawa', province: 'Ontario', timezone: 'America/Toronto', observesDST: true },
  { city: 'St. John\'s', province: 'Newfoundland and Labrador', timezone: 'America/St_Johns', observesDST: true },
  { city: 'Halifax', province: 'Nova Scotia', timezone: 'America/Halifax', observesDST: true },
  { city: 'Charlottetown', province: 'Prince Edward Island', timezone: 'America/Halifax', observesDST: true },
  { city: 'Fredericton', province: 'New Brunswick', timezone: 'America/Halifax', observesDST: true },
  { city: 'Québec', province: 'Quebec', timezone: 'America/Toronto', observesDST: true },
  { city: 'Montréal', province: 'Quebec', timezone: 'America/Toronto', observesDST: true },
  { city: 'Winnipeg', province: 'Manitoba', timezone: 'America/Winnipeg', observesDST: false },
  { city: 'Regina', province: 'Saskatchewan', timezone: 'America/Regina', observesDST: false },
  { city: 'Edmonton', province: 'Alberta', timezone: 'America/Edmonton', observesDST: true },
  { city: 'Calgary', province: 'Alberta', timezone: 'America/Edmonton', observesDST: true },
  { city: 'Victoria', province: 'British Columbia', timezone: 'America/Vancouver', observesDST: false },
  { city: 'Vancouver', province: 'British Columbia', timezone: 'America/Vancouver', observesDST: false },
  { city: 'Whitehorse', province: 'Yukon', timezone: 'America/Whitehorse', observesDST: false },
  { city: 'Yellowknife', province: 'Northwest Territories', timezone: 'America/Yellowknife', observesDST: true },
  { city: 'Iqaluit', province: 'Nunavut', timezone: 'America/Iqaluit', observesDST: true },
];

const translations = {
  en: {
    title: 'Canadian Time Zones',
    subtitle: 'Understanding time across Canada',
    langSwitch: 'FR',
    viewingFrom: 'Viewing from Ottawa',
    now: 'Now',
    timelineHeader: 'At the same moment across Canada:',
    dstTitle: 'Daylight Saving 2027',
    dstDates: 'Mar 14 – Nov 7',
    dstWho: 'ON, QC, NS, NB, PE, NL, NU, NT, AB',
    permanentTitle: 'Permanent Time',
    permanentWho: 'BC, MB, YT, SK',
    permanentNote: 'No clock changes',
    sameTime: 'Same time',
    ahead: 'ahead',
    behind: 'behind',
    dst: 'DST',
    noDst: 'No DST',
    provinces: {
      'Ontario': 'Ontario',
      'Newfoundland and Labrador': 'Newfoundland and Labrador',
      'Nova Scotia': 'Nova Scotia',
      'Prince Edward Island': 'Prince Edward Island',
      'New Brunswick': 'New Brunswick',
      'Quebec': 'Quebec',
      'Manitoba': 'Manitoba',
      'Saskatchewan': 'Saskatchewan',
      'Alberta': 'Alberta',
      'British Columbia': 'British Columbia',
      'Yukon': 'Yukon',
      'Northwest Territories': 'Northwest Territories',
      'Nunavut': 'Nunavut'
    }
  },
  fr: {
    title: 'Fuseaux horaires canadiens',
    subtitle: 'Comprendre l\'heure au Canada',
    langSwitch: 'EN',
    viewingFrom: 'Vue depuis Ottawa',
    now: 'Maintenant',
    timelineHeader: 'Au même moment à travers le Canada :',
    dstTitle: 'Heure avancée 2027',
    dstDates: '14 mars – 7 nov',
    dstWho: 'ON, QC, NS, NB, PE, NL, NU, NT, AB',
    permanentTitle: 'Heure permanente',
    permanentWho: 'C.-B., MB, YT, SK',
    permanentNote: 'Pas de changement',
    sameTime: 'Même heure',
    ahead: 'en avance',
    behind: 'en retard',
    dst: 'HA',
    noDst: 'Pas d\'HA',
    provinces: {
      'Ontario': 'Ontario',
      'Newfoundland and Labrador': 'Terre-Neuve-et-Labrador',
      'Nova Scotia': 'Nouvelle-Écosse',
      'Prince Edward Island': 'Île-du-Prince-Édouard',
      'New Brunswick': 'Nouveau-Brunswick',
      'Quebec': 'Québec',
      'Manitoba': 'Manitoba',
      'Saskatchewan': 'Saskatchewan',
      'Alberta': 'Alberta',
      'British Columbia': 'Colombie-Britannique',
      'Yukon': 'Yukon',
      'Northwest Territories': 'Territoires du Nord-Ouest',
      'Nunavut': 'Nunavut'
    }
  }
};

let currentLang = 'en';
let selectedDate = new Date();

function init() {
  const dateInput = document.getElementById('dateInput');
  const timeInput = document.getElementById('timeInput');
  const nowBtn = document.getElementById('nowBtn');
  const langToggle = document.getElementById('langToggle');
  
  updateInputs();
  
  dateInput.addEventListener('change', handleDateTimeChange);
  timeInput.addEventListener('change', handleDateTimeChange);
  
  nowBtn.addEventListener('click', () => {
    selectedDate = new Date();
    updateInputs();
    updateDisplay();
  });
  
  langToggle.addEventListener('click', toggleLanguage);
  
  updateDisplay();
  updateLanguage();
}

function handleDateTimeChange() {
  const dateInput = document.getElementById('dateInput');
  const timeInput = document.getElementById('timeInput');
  
  const dateVal = dateInput.value;
  const timeVal = timeInput.value;
  
  if (dateVal && timeVal) {
    const [year, month, day] = dateVal.split('-');
    const [hours, minutes] = timeVal.split(':');
    selectedDate = new Date(year, month - 1, day, hours, minutes);
    updateDisplay();
  }
}

function updateInputs() {
  const dateInput = document.getElementById('dateInput');
  const timeInput = document.getElementById('timeInput');
  
  const year = selectedDate.getFullYear();
  const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
  const day = String(selectedDate.getDate()).padStart(2, '0');
  dateInput.value = `${year}-${month}-${day}`;
  
  const hours = String(selectedDate.getHours()).padStart(2, '0');
  const minutes = String(selectedDate.getMinutes()).padStart(2, '0');
  timeInput.value = `${hours}:${minutes}`;
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'fr' : 'en';
  document.documentElement.lang = currentLang;
  updateLanguage();
  updateDisplay();
}

function updateLanguage() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = translations[currentLang][key];
    if (value) {
      el.textContent = value;
    }
  });
}

function updateDisplay() {
  updateOttawaTime();
  updateTimeline();
}

function updateOttawaTime() {
  const timeDisplay = document.getElementById('ottawaTime');
  const dateDisplay = document.getElementById('ottawaDate');
  
  const ottawaTime = selectedDate.toLocaleString(currentLang === 'en' ? 'en-CA' : 'fr-CA', {
    timeZone: 'America/Toronto',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const ottawaDate = selectedDate.toLocaleString(currentLang === 'en' ? 'en-CA' : 'fr-CA', {
    timeZone: 'America/Toronto',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  timeDisplay.textContent = ottawaTime;
  dateDisplay.textContent = ottawaDate;
}

function updateTimeline() {
  const timeline = document.getElementById('timeline');
  const ottawaTimezone = 'America/Toronto';
  
  const ottawaDate = new Date(selectedDate.toLocaleString('en-US', { timeZone: ottawaTimezone }));
  const ottawaMinutes = ottawaDate.getHours() * 60 + ottawaDate.getMinutes();
  
  const timeZoneData = {};
  locations.forEach(loc => {
    if (!timeZoneData[loc.timezone]) {
      const locDate = new Date(selectedDate.toLocaleString('en-US', { timeZone: loc.timezone }));
      const locMinutes = locDate.getHours() * 60 + locDate.getMinutes();
      const diffMinutes = ottawaMinutes - locMinutes;
      
      timeZoneData[loc.timezone] = {
        date: locDate,
        diffMinutes: diffMinutes,
        locations: [],
        observesDST: loc.observesDST
      };
    }
    timeZoneData[loc.timezone].locations.push(loc);
  });
  
  const sortedZones = Object.entries(timeZoneData).sort((a, b) => b[1].diffMinutes - a[1].diffMinutes);
  
  const t = translations[currentLang];
  
  timeline.innerHTML = sortedZones.map(([tz, data]) => {
    const isOttawa = tz === ottawaTimezone;
    const cities = data.locations.map(l => l.city).join(', ');
    const provinces = data.locations.map(l => t.provinces[l.province]).join(', ');
    
    const timeStr = data.date.toLocaleString(currentLang === 'en' ? 'en-CA' : 'fr-CA', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    let diffText = '';
    if (data.diffMinutes === 0) {
      diffText = t.sameTime;
    } else {
      const absDiff = Math.abs(data.diffMinutes);
      const hours = Math.floor(absDiff / 60);
      const minutes = absDiff % 60;
      
      let parts = [];
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
      
      const direction = data.diffMinutes > 0 ? t.behind : t.ahead;
      diffText = `${parts.join(' ')} ${direction}`;
    }
    
    const dstText = data.observesDST ? t.dst : t.noDst;
    
    return `
      <div class="timeline-row ${isOttawa ? 'highlight' : ''}">
        <div class="row-location">
          <div class="row-city">${cities}</div>
          <div class="row-province">${provinces}</div>
        </div>
        <div class="row-time">${timeStr}</div>
        <div class="row-diff">
          <div class="diff-time">${diffText}</div>
          <div class="diff-dst">${dstText}</div>
        </div>
      </div>
    `;
  }).join('');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
