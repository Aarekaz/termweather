# Termweather

Beautiful weather in your terminal - CLI commands + interactive TUI dashboard.

```
╔══════════════════════════════════════════════════════════════════════════════╗
║ Weather TUI                      < New York, USA >                     [1/3] ║
╚══════════════════════════════════════════════════════════════════════════════╝

         5°C  ☀️ Clear
         Feels like 2°C

  ══ HOURLY FORECAST ══
  1   2   3   4   5   6   7   8
  ☀️  ☀️  🌤  ⛅  ⛅  🌧  🌧  ☁️
  5°  4°  3°  2°  2°  1°  1°  0°

  ══ NEXT PRECIPITATION ══
  ⚠️ Rain in 2 hours
  Probability: 65% | Expected: 2.5 mm

  ══ PRECIPITATION ══
  Next 24 Hours: 🌧 2.5 mm total
  Next 7 Days: 12.3 mm total | Avg: 1.8 mm/day

  ══ SUN & MOON ══          ══ ATMOSPHERIC ══
  Sunrise  ↑ 7:20 AM        Visibility  10 km Excellent
  [Sun Arc]                 Cloud Cover 45% Partly cloudy
  Sunset   ↓ 4:38 PM        Dewpoint   2°C  High humidity
  🌗 Waning (72%)           Pressure   1013 mb ↑ Rising

┌──────────────────────────────────────────────────────────────────────────────┐
│ [d] Dashboard [f] Forecast [/] Search [q] Quit                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Install

```bash
npm install -g termweather
```

## v3.3.0 Features ✨

The TUI dashboard now includes enhanced features to bring it closer to Apple Weather:

### Dashboard Layout

The interactive dashboard has been redesigned with a 4-tier responsive layout:

1. **Unified Header** (always visible)
   - Location name with multi-location navigation
   - Current temperature + weather condition
   - Wind speed + direction + humidity
   - Pressure with trend indicator
   - UV Index + Air Quality

2. **Hourly Forecast** (always visible, enhanced)
   - Temperature sparkline with range
   - Feels-like temperature sparkline
   - Precipitation probability sparkline
   - **NEW:** Wind gust sparkline (shows peak gusts)
   - **NEW:** Precipitation type emoji (🌧 rain, ❄️ snow, 🌨 mixed)

3. **Precipitation Row** (medium+ screens)
   - **Next Precipitation Alert**: "Rain in X hours" with probability
   - **Precipitation Summary**: 24-hour and 7-day accumulation with rain/snow breakdown

4. **Atmospheric Section** (medium+ screens, enhanced)
   - Sun & Moon times with sun arc visualization
   - **NEW:** Moon phase with illumination percentage
   - Visibility rating + cloud cover
   - **NEW:** Cloud cover description + color-coded progress
   - Dew point with humidity interpretation
   - Pressure with trend indicator

### New Forecast Features

In the 7-day forecast view:
- **NEW:** Temperature range bars showing min/max for each day
- Visual gradient from cool (blue) to warm (red) temperatures
- Color-coded by temperature zones

### What's New (8 Enhancements)

**Next Precipitation Alert** - Know when rain/snow is coming
**Precipitation Accumulation** - 24hr and 7-day totals with rain/snow breakdown
**Temperature Range Bars** - Visual daily temperature ranges
**Wind Gusts Display** - Prominent gust indicators in hourly forecast
**Dew Point** - Fetched from API (atmospheric moisture indicator)
**Cloud Cover Enhancement** - Descriptive text + color-coded progress
**Precipitation Type Detection** - Rain vs snow identification with emojis
**Moon Illumination %** - Shows lunar phase percentage


## Usage

### Interactive TUI (default)

Just run `weather` with no arguments to launch the interactive dashboard:

```bash
weather
```

**Keyboard shortcuts:**
- `d` - Dashboard view
- `f` - Forecast view
- `/` - Search locations
- `←` `→` - Switch between saved locations
- `r` - Refresh data
- `q` - Quit

### CLI Commands

One-shot commands for scripts and quick lookups:

```bash
# Current weather
weather current "New York"
weather current "Tokyo, Japan"
weather current --lat 40.71 --lon -74.01

# 7-day forecast
weather forecast "London"
weather forecast "Paris" --hourly
weather forecast "Berlin" --days 3

# Search locations
weather search "San Francisco"

# Configuration
weather config set location "New York"    # Set default location
weather config set units metric           # metric or imperial
weather config show                       # Show current config
```

### Output Formats

```bash
# Beautiful table (default)
weather current "NYC"

# JSON (for scripts)
weather current "NYC" --json

# Compact one-liner
weather current "NYC" --compact
# Output: New York, United States: 5°C ☀️ Clear | Feels 2°C | Wind 15 km/h NW | Humidity 45%
```

## Examples

```bash
# Quick weather check
$ weather current "Kathmandu"
╭──────────────────────────────────────────╮
│ Kathmandu, Nepal                         │
│ 10:30 AM NPT · Updated just now          │
├──────────────────────────────────────────┤
│                                          │
│         18°C  ☀️ Clear                   │
│         Feels like 16°C                  │
│                                          │
│ Humidity    45%      UV Index    6 (HIGH)│
│ Wind        8 km/h Northwest             │
│ Pressure    1012 mb —                    │
│ Visibility  10 km   AQI         142      │
╰──────────────────────────────────────────╯

# Weekly forecast
$ weather forecast "Tokyo"
7-Day Forecast - Tokyo
------------------------------------------------------------
  Mon Jan 1   ☀️  12°C / 4°C   Precip: 0%
  Tue Jan 2   ⛅  10°C / 2°C   Precip: 20%
  Wed Jan 3   🌧️   8°C / 3°C   Precip: 80%
  ...
```

## Data Source

Weather data is provided by [Open-Meteo](https://open-meteo.com/) - a free, open-source weather API.

## Requirements

- Node.js 18 or higher
- A terminal that supports Unicode and colors


# Self - setup

## Prereqs
- Node.js + pnpm

## Install
```
pnpm install
```

## Web app
From repo root:
```
pnpm --filter @weather/web dev
```
Then open the URL shown in the terminal (usually http://localhost:3000).

## CLI (one-off)
Run without global install:
```
pnpm --filter termweather start
```

## CLI (global `weather` command)
```
cd packages/cli
pnpm link --global
```
Then:
```
weather
```

## TUI (interactive dashboard)
- From repo root (no global link):
```
pnpm --filter termweather start
```
- Or after global link:
```
weather
```

### TUI keys
- `/` search
- `d` dashboard
- `f` forecast
- `r` refresh
- `q` quit
- arrows: cycle saved locations
- `Esc` cancel search

## Notes
- `weather-tui` is also available after global link.



## License

MIT
