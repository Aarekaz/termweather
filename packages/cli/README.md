# termweather

Beautiful weather in your terminal - CLI commands + interactive TUI dashboard.

```
╔══════════════════════════════════════════════════════════════════════════════╗
║ Weather TUI                      < New York, USA >                     [1/3] ║
╚══════════════════════════════════════════════════════════════════════════════╝

         5°C  ☀️ Clear
         Feels like 2°C

  Sunrise: 7:20 AM    Sunset: 4:38 PM    Daylight: 9h 18m

┌──────────────────────────────────────────────────────────────────────────────┐
│ [d] Dashboard [f] Forecast [/] Search [q] Quit                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Install

```bash
npm install -g termweather
```

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

## License

MIT
