// Canadian capitals and their time zone information
const locations = [
  { city: 'Ottawa', province: 'Ontario', timezone: 'America/Toronto', observesDST: true },
  { city: 'Toronto', province: 'Ontario', timezone: 'America/Toronto', observesDST: true },
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
  const nowBtn = document.getElementById('nowBtn');
  const langToggle = document.getElementById('langToggle');
  
  // Set initial date input value
  setDateInputValue(selectedDate);
  
  // Event listeners
  dateInput.addEventListener('change', (e) => {
    selectedDate = new Date(e.target.value);
    updateTimes();
  });
  
  nowBtn.addEventListener('click', () => {
    selectedDate = new Date();
    setDateInputValue(selectedDate);
    updateTimes();
  });
  
  langToggle.addEventListener('click', toggleLanguage);
  
  // Initial render
  updateTimes();
  updateLanguage();
}

function setDateInputValue(date) {
  const dateInput = document.getElementById('dateInput');
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  dateInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
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
