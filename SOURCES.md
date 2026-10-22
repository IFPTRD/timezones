# Sources and calculation notes / Sources et méthode

Verified / Vérifié : 2026-10-22. Supported dates / Dates prises en charge : 2026–2027.

## Government sources / Sources gouvernementales

- [British Columbia / Colombie-Britannique](https://www2.gov.bc.ca/gov/content/governments/celebrating-british-columbia/daylight-saving-time): Victoria remains UTC−7 after the March 8, 2026 advance; no November fallback. Regional exceptions exist.
- [Alberta](https://www.alberta.ca/albertas-new-time-system-abt): permanent Alberta Time, UTC−6; no November 2026 fallback.
- [Northwest Territories / Territoires du Nord-Ouest](https://www.gov.nt.ca/en/newsroom/northwest-territories-ends-seasonal-time-change): UTC−6 year-round; no November 1, 2026 fallback. Regulations came into force August 21, 2026.
- [Manitoba](https://news.gov.mb.ca/news/index.html?archive=&item=75397): September 17, 2026 announcement; no November 1 fallback. Winnipeg remains UTC−5.
- [Saskatchewan](https://www.saskatchewan.ca/government/municipal-administration/tools-guides-and-resources/saskatchewan-time-system): Regina UTC−6 year-round; border-community exceptions must not be generalized to the capital.
- [Yukon](https://yukon.ca/en/your-government/about-yukon/learn-about-yukon-standard-time): Whitehorse UTC−7 year-round (confirmed via official search result; direct fetch restricted).
- [NRC / CNRC](https://nrc.canada.ca/en/certifications-evaluations-standards/canadas-official-time/time-zones-daylight-saving-time): general seasonal rule, second Sunday in March and first Sunday in November. The page warns that some information is under review for November 2026; use the provincial/territorial sources above for western changes.
- [St. John's transition schedule](https://www.timeanddate.com/time/zone/canada/st-johns): Newfoundland's half-hour offset and seasonal changes.

## Method / Méthode

`time.js` encodes capital-city UTC offsets explicitly. It does not rely on the device's timezone or on its potentially outdated IANA database. `Intl` is used only for localized formatting of already-calculated UTC-based wall times.

For the seasonal capitals, transitions occur at 02:00 local time: March 8 / November 1 in 2026 and March 14 / November 7 in 2027. Capitals adopting permanent time in 2026 retain their January/February standard offset, advance in March, and do not fall back. Yukon and Regina remain fixed throughout this window.

All entered times refer to Ottawa. A nonexistent spring-forward time is rejected. During the repeated autumn hour, users explicitly choose the first (UTC−4) or second (UTC−5) occurrence. Local dates and previous/next-day labels are calculated from the full instant, not by subtracting clock hours.

La saisie correspond toujours à l’heure d’Ottawa. Une heure inexistante au printemps est refusée; une heure répétée à l’automne propose les deux occurrences. Le calcul utilise l’instant complet pour conserver la bonne date locale.

The before/after table describes the offsets after Ottawa's fallback (from 02:00 on November 1). The interactive results are exact for the selected instant, including transition hours. Rules are limited to capital cities, not whole jurisdictions. Ottawa substitutes for Toronto at the user's request.

Les règles concernent les capitales seulement. Ottawa remplace Toronto à la demande de l’utilisateur. Les dates futures demeurent sujettes aux changements législatifs.

Office-hour indicators use 08:30–16:30 weekdays, not holiday calendars. They are illustrative, not availability information.

## Maintenance

Reverify government sources when legislation changes and before extending beyond 2027. Update `time.js`, this source record, translations and regression tests together. Never change just the clock-policy labels.

Run `node time.test.js`. Browser test: `npm install --no-save playwright`, then `node browser.test.cjs` (requires Playwright Chromium and its OS dependencies).
