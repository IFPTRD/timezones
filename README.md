# Canada, at the same time / Le Canada, au même moment

Live: https://ifptrd.github.io/timezones/

Bilingual Ottawa-centred meeting planner, inspired by the operator-provided Google Sites reference. Static HTML/CSS/JavaScript, no build step or application dependencies. Optional Google Fonts request; system-font fallback works offline.

## Features

- Capital cities grouped by actual offset from Ottawa, west to east.
- Inline month calendar, time slider, exact 24-hour inputs and meeting presets.
- Before/after November 1, 2026 comparison with a persistent change table.
- Canadian English/French; 12/24-hour output; previous/next-day labels.
- Copy meeting times; illustrative weekday office-hour indicators.
- Explicit, source-documented 2026/2027 rules independent of browser timezone data.
- Spring gap rejection and explicit autumn repeated-hour selection.

Ottawa represents Ontario; Toronto and duplicate major cities are omitted. Capital-city rules do not describe every community in a province/territory.

## Run and test

Open index.html or serve the directory with any static HTTP server.

```
node time.test.js
```

For browser regression checks, install Playwright and its Chromium dependencies, then run `node browser.test.cjs`.

## Deploy

GitHub Pages publishes the root of `main`. Push reviewed changes, then verify the Pages build and live assets. No secrets, analytics or server-side storage.

See [SOURCES.md](SOURCES.md) for government links, verified date, limitations and maintenance instructions. Recheck legislation before expanding the supported planning window beyond December 2027.
