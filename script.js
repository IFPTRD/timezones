// Canadian capitals and their time zone information
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

// Translation strings
const translations = {
  en: {
    title: 'Canadian Time Zones',
    langSwitch: 'Français',
    checkDate: 'Check time for:',
    now: 'Now',
    dstNotice: 'Daylight Saving Time Changes in 2027',
    dstStart: 'Starts:',
    dstStartDate: 'March 14, 2:00 AM (clocks forward)',
    dstEnd: 'Ends:',
    dstEndDate: 'November 7, 2:00 AM (clocks back)',
    noChanges: 'No clock changes: BC, Manitoba, Yukon, Saskatchewan (permanent daylight time)',
    recentChanges: '2026 changes: BC and Manitoba moved to permanent daylight time',
    observesDST: 'DST',
    noDST: 'No DST',
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
    langSwitch: 'English',
    checkDate: 'Vérifier l\'heure pour :',
    now: 'Maintenant',
    dstNotice: 'Changements d\'heure avancée en 2027',
    dstStart: 'Début :',
    dstStartDate: '14 mars, 2 h (avancer l\'heure)',
    dstEnd: 'Fin :',
    dstEndDate: '7 novembre, 2 h (reculer l\'heure)',
    noChanges: 'Pas de changement d\'heure : C.-B., Manitoba, Yukon, Saskatchewan (heure avancée permanente)',
    recentChanges: 'Changements de 2026 : C.-B. et Manitoba sont passés à l\'heure avancée permanente',
    observesDST: 'HA',
    noDST: 'Pas d\'HA',
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

// Initialize the app
function init() {
  const dateInput = document.getElementById('dateInput');
  const hourInput = document.getElementById('hourInput');
  const minuteInput = document.getElementById('minuteInput');
  const ampmInput = document.getElementById('ampmInput');
  const nowBtn = document.getElementById('nowBtn');
  const langToggle = document.getElementById('langToggle');
  
  // Set initial date input values
  setDateInputValue(selectedDate);
  
  // Event listeners
  dateInput.addEventListener('change', updateFromInputs);
  hourInput.addEventListener('input', updateFromInputs);
  minuteInput.addEventListener('input', updateFromInputs);
  ampmInput.addEventListener('change', updateFromInputs);
  
  nowBtn.addEventListener('click', () => {
    selectedDate = new Date();
    setDateInputValue(selectedDate);
    updateTimes();
    updateComparison();
  });
  
  langToggle.addEventListener('click', toggleLanguage);
  
  // Initial render
  updateTimes();
  updateComparison();
  updateLanguage();
}

function updateFromInputs() {
  const dateInput = document.getElementById('dateInput');
  const hourInput = document.getElementById('hourInput');
  const minuteInput = document.getElementById('minuteInput');
  const ampmInput = document.getElementById('ampmInput');
  
  const dateVal = dateInput.value;
  const hourVal = parseInt(hourInput.value) || 12;
  const minuteVal = parseInt(minuteInput.value) || 0;
  const ampm = ampmInput.value;
  
  if (dateVal) {
    let hour24 = hourVal;
    if (ampm === 'PM' && hourVal !== 12) hour24 += 12;
    if (ampm === 'AM' && hourVal === 12) hour24 = 0;
    
    const [year, month, day] = dateVal.split('-');
    selectedDate = new Date(year, month - 1, day, hour24, minuteVal);
    updateTimes();
    updateComparison();
  }
}

function setDateInputValue(date) {
  const dateInput = document.getElementById('dateInput');
  const hourInput = document.getElementById('hourInput');
  const minuteInput = document.getElementById('minuteInput');
  const ampmInput = document.getElementById('ampmInput');
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  dateInput.value = `${year}-${month}-${day}`;
  
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  
  hourInput.value = hours;
  minuteInput.value = String(minutes).padStart(2, '0');
  ampmInput.value = ampm;
}

function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'fr' : 'en';
  document.documentElement.lang = currentLang;
  updateLanguage();
  updateTimes(); // Re-render with new language
}

function updateLanguage() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const keys = key.split('.');
    let value = translations[currentLang];
    
    keys.forEach(k => {
      value = value[k];
    });
    
    if (value) {
      el.textContent = value;
    }
  });
}

function updateTimes() {
  const grid = document.getElementById('timeGrid');
  grid.innerHTML = '';
  
  locations.forEach(location => {
    const card = createTimeCard(location);
    grid.appendChild(card);
  });
}

function updateComparison() {
  const comparisonDiv = document.getElementById('timeComparison');
  
  // Get unique time zones
  const timeZones = {};
  locations.forEach(loc => {
    if (!timeZones[loc.timezone]) {
      timeZones[loc.timezone] = [];
    }
    timeZones[loc.timezone].push(loc.city);
  });
  
  // Calculate time differences from Ottawa
  const ottawaTimezone = 'America/Toronto';
  const ottawaDate = new Date(selectedDate.toLocaleString('en-US', { timeZone: ottawaTimezone }));
  
  const differences = [];
  Object.keys(timeZones).forEach(tz => {
    if (tz !== ottawaTimezone) {
      const tzDate = new Date(selectedDate.toLocaleString('en-US', { timeZone: tz }));
      const diffMinutes = (ottawaDate - tzDate) / 1000 / 60;
      const diffHours = diffMinutes / 60;
      
      const cities = timeZones[tz].join(', ');
      differences.push({
        cities,
        diffHours,
        ahead: diffHours > 0
      });
    }
  });
  
  // Sort by time difference
  differences.sort((a, b) => b.diffHours - a.diffHours);
  
  const labels = {
    en: { ahead: 'ahead of', behind: 'behind', ottawa: 'Ottawa' },
    fr: { ahead: 'en avance sur', behind: 'en retard sur', ottawa: 'Ottawa' }
  };
  const l = labels[currentLang];
  
  comparisonDiv.innerHTML = differences.map(diff => {
    const absDiff = Math.abs(diff.diffHours);
    const hours = Math.floor(absDiff);
    const minutes = Math.round((absDiff - hours) * 60);
    
    let timeStr = '';
    if (hours > 0) timeStr += `${hours}h`;
    if (minutes > 0) timeStr += ` ${minutes}min`;
    
    const direction = diff.ahead ? l.behind : l.ahead;
    
    return `
      <div class="comparison-item">
        <span class="comparison-cities">${diff.cities}</span>
        <span class="comparison-diff">${timeStr} ${direction} ${l.ottawa}</span>
      </div>
    `;
  }).join('');
}

function createTimeCard(location) {
  const card = document.createElement('div');
  card.className = 'time-card';
  
  // Get time in the location's timezone
  const timeStr = selectedDate.toLocaleString(currentLang === 'en' ? 'en-CA' : 'fr-CA', {
    timeZone: location.timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  // Get timezone abbreviation
  const formatter = new Intl.DateTimeFormat(currentLang === 'en' ? 'en-CA' : 'fr-CA', {
    timeZone: location.timezone,
    timeZoneName: 'short'
  });
  
  const parts = formatter.formatToParts(selectedDate);
  const timeZoneName = parts.find(part => part.type === 'timeZoneName')?.value || '';
  
  // Calculate UTC offset
  const localDate = new Date(selectedDate.toLocaleString('en-US', { timeZone: location.timezone }));
  const offsetMinutes = -localDate.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMins = Math.abs(offsetMinutes) % 60;
  const offsetSign = offsetMinutes >= 0 ? '+' : '-';
  const offsetStr = `UTC${offsetSign}${offsetHours}${offsetMins > 0 ? ':' + String(offsetMins).padStart(2, '0') : ''}`;
  
  // Highlight Ottawa
  if (location.city === 'Ottawa') {
    card.classList.add('highlight');
  }
  
  const provinceName = translations[currentLang].provinces[location.province];
  const dstLabel = location.observesDST ? translations[currentLang].observesDST : translations[currentLang].noDST;
  const badgeClass = location.observesDST ? 'dst-badge' : 'dst-badge no-change';
  
  card.innerHTML = `
    <div class="card-header">
      <div>
        <div class="city-name">${location.city}</div>
        <div class="province">${provinceName}</div>
      </div>
      <div class="${badgeClass}">${dstLabel}</div>
    </div>
    <div class="time-display">${timeStr}</div>
    <div class="timezone-info">
      ${timeZoneName}
      <span class="offset">${offsetStr}</span>
    </div>
  `;
  
  return card;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
