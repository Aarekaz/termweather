# Weather App Architecture

## Implementation Status

| Phase | Package | Description | Status |
|-------|---------|-------------|--------|
| Phase 1 | `@weather/core` | Shared API client, types, utilities | **Complete** |
| Phase 2 | `@weather/web` | Next.js web application with real-time data | **Complete** |
| Phase 3 | `@weather/cli` | Command-line tool with Commander.js | **Complete** |
| Phase 4 | `@weather/tui` | Interactive terminal UI with Ink | **Complete** |

---

## Overview

This document outlines the architecture for transforming the current Next.js weather app into a monorepo that supports:
- **Web App** (Next.js - current)
- **TUI** (Terminal User Interface - interactive)
- **CLI** (Command-line tool - scriptable)

All three interfaces share a common core library for data fetching, types, and utilities.

---

## Project Structure

```
weather-app/
├── packages/
│   ├── core/                    # Shared: API client, types, utilities
│   │   ├── src/
│   │   │   ├── api/
│   │   │   │   ├── client.ts         # Open-Meteo API client
│   │   │   │   ├── geocoding.ts      # Location search
│   │   │   │   └── types.ts          # API response types
│   │   │   ├── types/
│   │   │   │   ├── weather.ts        # Core weather types
│   │   │   │   ├── location.ts       # Location types
│   │   │   │   └── forecast.ts       # Forecast types
│   │   │   ├── utils/
│   │   │   │   ├── formatters.ts     # Temperature, wind, etc.
│   │   │   │   ├── descriptors.ts    # UV level, AQI rating, etc.
│   │   │   │   └── calculations.ts   # Daylight duration, etc.
│   │   │   ├── cache/
│   │   │   │   └── store.ts          # Simple cache layer
│   │   │   └── index.ts              # Public exports
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── web/                     # Next.js web application
│   │   ├── app/                      # App Router pages
│   │   ├── components/               # React components
│   │   ├── hooks/                    # React hooks (useWeather, etc.)
│   │   ├── lib/                      # Web-specific utilities
│   │   ├── public/
│   │   ├── package.json
│   │   └── next.config.mjs
│   │
│   ├── tui/                     # Terminal User Interface
│   │   ├── src/
│   │   │   ├── app.tsx              # Main Ink app
│   │   │   ├── components/
│   │   │   │   ├── Dashboard.tsx    # Main weather view
│   │   │   │   ├── Forecast.tsx     # Hourly/daily forecast
│   │   │   │   ├── Metrics.tsx      # Environmental metrics grid
│   │   │   │   ├── Search.tsx       # Location search
│   │   │   │   └── StatusBar.tsx    # Bottom status
│   │   │   ├── hooks/
│   │   │   │   └── useWeatherData.ts
│   │   │   └── utils/
│   │   │       └── terminal.ts      # Terminal helpers
│   │   ├── bin/
│   │   │   └── weather-tui          # Executable entry
│   │   └── package.json
│   │
│   └── cli/                     # Command-line tool
│       ├── src/
│       │   ├── index.ts             # CLI entry point
│       │   ├── commands/
│       │   │   ├── current.ts       # weather current [location]
│       │   │   ├── forecast.ts      # weather forecast [location]
│       │   │   ├── search.ts        # weather search <query>
│       │   │   └── config.ts        # weather config [set/get]
│       │   ├── formatters/
│       │   │   ├── table.ts         # Table output
│       │   │   ├── json.ts          # JSON output
│       │   │   └── compact.ts       # One-line output
│       │   └── config/
│       │       └── store.ts         # User preferences
│       ├── bin/
│       │   └── weather              # Executable
│       └── package.json
│
├── package.json                 # Workspace root
├── pnpm-workspace.yaml          # pnpm workspaces config
├── turbo.json                   # Turborepo config (optional)
├── tsconfig.base.json           # Shared TypeScript config
└── README.md
```

---

## Package Details

### 1. `@weather/core` - Shared Core Library

The heart of the architecture. All three interfaces depend on this package.

#### API Client (`src/api/client.ts`)

```typescript
import { WeatherData, ForecastData, LocationData } from '../types';

export interface WeatherClientConfig {
  cacheEnabled?: boolean;
  cacheTTL?: number;         // seconds
  temperatureUnit?: 'celsius' | 'fahrenheit';
  windSpeedUnit?: 'kmh' | 'mph' | 'ms' | 'kn';
}

export class WeatherClient {
  private config: WeatherClientConfig;
  private baseUrl = 'https://api.open-meteo.com/v1';

  constructor(config?: WeatherClientConfig);

  // Current weather for coordinates
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData>;

  // Hourly forecast (up to 7 days)
  async getHourlyForecast(lat: number, lon: number, days?: number): Promise<ForecastData>;

  // Daily forecast (up to 16 days)
  async getDailyForecast(lat: number, lon: number, days?: number): Promise<ForecastData>;

  // Search locations by name (uses Open-Meteo Geocoding API)
  async searchLocation(query: string): Promise<LocationData[]>;

  // Reverse geocode
  async reverseGeocode(lat: number, lon: number): Promise<LocationData>;
}
```

#### Open-Meteo API Mapping

Open-Meteo provides all the data we need:

| Our Metric | Open-Meteo Parameter | Endpoint |
|------------|---------------------|----------|
| Temperature | `temperature_2m` | `/forecast` |
| Feels Like | `apparent_temperature` | `/forecast` |
| Humidity | `relative_humidity_2m` | `/forecast` |
| Wind Speed | `wind_speed_10m` | `/forecast` |
| Wind Direction | `wind_direction_10m` | `/forecast` |
| Pressure | `surface_pressure` | `/forecast` |
| Visibility | `visibility` | `/forecast` |
| UV Index | `uv_index` | `/forecast` |
| Weather Code | `weather_code` | `/forecast` |
| Sunrise/Sunset | `sunrise`, `sunset` | `/forecast` + `daily` |
| Air Quality | `us_aqi` | `/air-quality` |

**Example API Call:**
```
https://api.open-meteo.com/v1/forecast?
  latitude=40.71&
  longitude=-74.01&
  current=temperature_2m,relative_humidity_2m,apparent_temperature,
          weather_code,wind_speed_10m,wind_direction_10m,
          surface_pressure,visibility,uv_index&
  hourly=temperature_2m,precipitation_probability&
  daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&
  timezone=auto
```

#### Core Types (`src/types/weather.ts`)

```typescript
// Extend existing types with API-friendly versions
export interface WeatherData {
  location: LocationData;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  lastUpdated: Date;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  uvIndex: number;
  windSpeed: number;
  windDirection: WindDirection;
  pressure: number;
  pressureTrend: PressureTrend;   // Calculated from hourly data
  visibility: number;
  airQuality: number;
  weatherCode: number;            // WMO code
  condition: WeatherCondition;    // Derived from code
  sunrise: string;
  sunset: string;
  isDay: boolean;
}

export interface LocationData {
  id: string;
  name: string;
  country: string;
  admin1?: string;               // State/province
  latitude: number;
  longitude: number;
  timezone: string;
  elevation?: number;
}

export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm';

// WMO Weather Codes mapping
export const weatherCodeToCondition: Record<number, WeatherCondition> = {
  0: 'clear',
  1: 'clear',
  2: 'partly-cloudy',
  3: 'cloudy',
  45: 'fog',
  48: 'fog',
  51: 'drizzle',
  53: 'drizzle',
  55: 'drizzle',
  61: 'rain',
  63: 'rain',
  65: 'rain',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  95: 'thunderstorm',
  96: 'thunderstorm',
  99: 'thunderstorm',
};
```

#### Utility Functions (`src/utils/`)

Move and extend current `weather-utils.ts`:

```typescript
// formatters.ts
export function formatTemperature(temp: number, unit: 'C' | 'F'): string;
export function formatWindSpeed(speed: number, unit: 'kmh' | 'mph'): string;
export function formatPressure(pressure: number, unit: 'mb' | 'inHg'): string;
export function formatTime(date: Date, format: '12h' | '24h'): string;

// descriptors.ts (existing functions)
export function getHumidityDescription(humidity: number): string;
export function getUVLevel(uvIndex: number): string;
export function getUVAdvice(uvIndex: number): string;
export function getWindBeaufort(speed: number): string;
export function getAQIRating(aqi: number): string;
export function getAQIDescription(aqi: number): string;
export function getVisibilityDescription(km: number): string;
export function getConditionDescription(code: number): string;

// calculations.ts
export function calculateDaylightDuration(sunrise: string, sunset: string): string;
export function calculatePressureTrend(pressureHistory: number[]): PressureTrend;
export function getFeelsLikeComparison(feelsLike: number, actual: number): string;
```

---

### 2. `@weather/web` - Next.js Application

The current codebase, refactored to use `@weather/core`.

#### Changes from Current Structure

1. **Replace mock data** with real API calls
2. **Add custom hooks** for data fetching
3. **Keep components** mostly unchanged (they already accept props)

#### New Hook: `useWeather`

```typescript
// hooks/use-weather.ts
import { WeatherClient, WeatherData } from '@weather/core';
import { useEffect, useState } from 'react';

export function useWeather(locationId: string | null) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!locationId) return;

    const client = new WeatherClient();

    async function fetchWeather() {
      try {
        setLoading(true);
        const location = await client.searchLocation(locationId);
        const weather = await client.getCurrentWeather(
          location[0].latitude,
          location[0].longitude
        );
        setData(weather);
      } catch (e) {
        setError(e as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();

    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [locationId]);

  return { data, loading, error, refetch: () => {} };
}
```

#### Server Actions (Optional)

```typescript
// app/actions/weather.ts
'use server'

import { WeatherClient } from '@weather/core';

export async function getWeatherForLocation(lat: number, lon: number) {
  const client = new WeatherClient();
  return client.getCurrentWeather(lat, lon);
}

export async function searchLocations(query: string) {
  const client = new WeatherClient();
  return client.searchLocation(query);
}
```

---

### 3. `@weather/tui` - Terminal User Interface

An interactive terminal app using [Ink](https://github.com/vadimdemedes/ink) (React for CLI).

#### Why Ink?
- React-based (familiar patterns)
- Flexbox layout
- Hooks support
- Active community

#### Main App Structure

```tsx
// src/app.tsx
import React, { useState } from 'react';
import { render, Box, Text, useInput } from 'ink';
import { useWeather } from './hooks/useWeatherData';
import { Dashboard } from './components/Dashboard';
import { Forecast } from './components/Forecast';
import { Search } from './components/Search';
import { StatusBar } from './components/StatusBar';

type View = 'dashboard' | 'forecast' | 'search';

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [location, setLocation] = useState({ lat: 40.71, lon: -74.01 });
  const { data, loading, error } = useWeather(location);

  useInput((input, key) => {
    if (input === 'q') process.exit(0);
    if (input === 'd') setView('dashboard');
    if (input === 'f') setView('forecast');
    if (input === '/') setView('search');
    if (key.leftArrow) { /* previous location */ }
    if (key.rightArrow) { /* next location */ }
  });

  return (
    <Box flexDirection="column" width="100%">
      {/* Header */}
      <Box borderStyle="single" paddingX={1}>
        <Text bold color="cyan">
          Weather - {data?.location.name || 'Loading...'}
        </Text>
      </Box>

      {/* Main Content */}
      <Box flexGrow={1}>
        {view === 'dashboard' && <Dashboard data={data} />}
        {view === 'forecast' && <Forecast data={data} />}
        {view === 'search' && <Search onSelect={setLocation} />}
      </Box>

      {/* Status Bar */}
      <StatusBar
        view={view}
        lastUpdated={data?.lastUpdated}
      />
    </Box>
  );
}

render(<App />);
```

#### Dashboard Component

```tsx
// src/components/Dashboard.tsx
import React from 'react';
import { Box, Text } from 'ink';
import { WeatherData, getUVLevel, getAQIRating } from '@weather/core';

export function Dashboard({ data }: { data: WeatherData | null }) {
  if (!data) return <Text>Loading...</Text>;

  const { current } = data;

  return (
    <Box flexDirection="column" padding={1}>
      {/* Temperature Display */}
      <Box justifyContent="center">
        <Text bold>
          <Text color="yellow">{current.temperature}°</Text>
          <Text dimColor> Feels like {current.feelsLike}°</Text>
        </Text>
      </Box>

      {/* Condition */}
      <Box justifyContent="center" marginY={1}>
        <Text>{getConditionIcon(current.condition)} {current.condition}</Text>
      </Box>

      {/* Metrics Grid */}
      <Box flexDirection="row" justifyContent="space-between">
        <MetricBox label="Humidity" value={`${current.humidity}%`} />
        <MetricBox label="UV" value={getUVLevel(current.uvIndex)} />
        <MetricBox label="Wind" value={`${current.windSpeed} km/h`} />
        <MetricBox label="AQI" value={getAQIRating(current.airQuality)} />
      </Box>
    </Box>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <Box flexDirection="column" borderStyle="round" paddingX={2}>
      <Text dimColor>{label}</Text>
      <Text bold>{value}</Text>
    </Box>
  );
}

function getConditionIcon(condition: string): string {
  const icons: Record<string, string> = {
    'clear': '☀️',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'rain': '🌧️',
    'snow': '❄️',
    'thunderstorm': '⛈️',
    'fog': '🌫️',
  };
  return icons[condition] || '🌡️';
}
```

#### TUI Features

- **Keyboard navigation**: `d` dashboard, `f` forecast, `/` search, `q` quit
- **Arrow keys**: Switch between saved locations
- **Auto-refresh**: Updates every 5 minutes
- **Responsive**: Adapts to terminal width
- **Colors**: ANSI colors for temperature ranges, UV levels, etc.

---

### 4. `@weather/cli` - Command-Line Tool

A non-interactive CLI for scripting and quick lookups.

#### Commands

```bash
# Current weather (default: saved location or detect)
weather
weather current
weather current "New York"
weather current --lat 40.71 --lon -74.01

# Forecast
weather forecast "Tokyo" --days 5
weather forecast --hourly --hours 24

# Search locations
weather search "Paris"

# Configuration
weather config set location "London"
weather config set units metric
weather config get location

# Output formats
weather --json                    # JSON output
weather --format compact          # One-line output
weather --format table            # Table output (default)
```

#### Implementation

```typescript
// src/index.ts
import { Command } from 'commander';
import { currentCommand } from './commands/current';
import { forecastCommand } from './commands/forecast';
import { searchCommand } from './commands/search';
import { configCommand } from './commands/config';

const program = new Command();

program
  .name('weather')
  .description('Weather CLI - get weather from your terminal')
  .version('1.0.0');

program.addCommand(currentCommand);
program.addCommand(forecastCommand);
program.addCommand(searchCommand);
program.addCommand(configCommand);

// Default to current weather
program.action(async () => {
  await currentCommand.parseAsync([]);
});

program.parse();
```

```typescript
// src/commands/current.ts
import { Command } from 'commander';
import { WeatherClient } from '@weather/core';
import { formatWeatherTable, formatWeatherJson } from '../formatters';
import chalk from 'chalk';

export const currentCommand = new Command('current')
  .description('Get current weather')
  .argument('[location]', 'Location name or coordinates')
  .option('--lat <latitude>', 'Latitude')
  .option('--lon <longitude>', 'Longitude')
  .option('--json', 'Output as JSON')
  .option('--compact', 'Compact one-line output')
  .action(async (location, options) => {
    const client = new WeatherClient();

    let lat: number, lon: number;

    if (options.lat && options.lon) {
      lat = parseFloat(options.lat);
      lon = parseFloat(options.lon);
    } else if (location) {
      const results = await client.searchLocation(location);
      if (results.length === 0) {
        console.error(chalk.red(`Location not found: ${location}`));
        process.exit(1);
      }
      lat = results[0].latitude;
      lon = results[0].longitude;
    } else {
      // Use saved default or IP geolocation
      const config = loadConfig();
      lat = config.defaultLat;
      lon = config.defaultLon;
    }

    const weather = await client.getCurrentWeather(lat, lon);

    if (options.json) {
      console.log(JSON.stringify(weather, null, 2));
    } else if (options.compact) {
      console.log(formatCompact(weather));
    } else {
      console.log(formatWeatherTable(weather));
    }
  });
```

#### CLI Output Examples

**Default (table format):**
```
╭──────────────────────────────────────╮
│ New York, United States              │
│ 14:42 EST · Updated just now         │
├──────────────────────────────────────┤
│                                      │
│           18°C  Rain 🌧️              │
│       Feels like 15°C                │
│                                      │
├──────────────────────────────────────┤
│ Humidity    65%     UV Index    3    │
│ Wind        12 km/h NE              │
│ Pressure    1013 mb ▲               │
│ Visibility  10 km   AQI       42    │
╰──────────────────────────────────────╯
```

**Compact format:**
```
New York: 18°C 🌧️ Rain | Feels 15° | Wind 12km/h NE | Humidity 65%
```

**JSON format:**
```json
{
  "location": {
    "name": "New York",
    "country": "United States"
  },
  "current": {
    "temperature": 18,
    "condition": "rain",
    "humidity": 65
  }
}
```

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         OPEN-METEO API                              │
│                                                                     │
│  /v1/forecast          /v1/air-quality         /v1/geocoding       │
└─────────────────────────┬───────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       @weather/core                                  │
│                                                                     │
│  ┌─────────────────┐    ┌─────────────────┐    ┌────────────────┐  │
│  │  WeatherClient  │───▶│   Cache Layer   │───▶│  Transformers  │  │
│  │                 │    │   (optional)    │    │  API → Types   │  │
│  └─────────────────┘    └─────────────────┘    └────────────────┘  │
│           │                                            │            │
│           ▼                                            ▼            │
│  ┌─────────────────┐                        ┌────────────────────┐ │
│  │  Types/Models   │                        │  Utility Functions │ │
│  │  WeatherData    │                        │  formatters        │ │
│  │  LocationData   │                        │  descriptors       │ │
│  └─────────────────┘                        └────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
           │                    │                     │
           ▼                    ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   @weather/web   │  │   @weather/tui   │  │   @weather/cli   │
│                  │  │                  │  │                  │
│ Next.js + React  │  │   Ink + React    │  │   Commander.js   │
│ Server/Client    │  │   Interactive    │  │   Non-interactive│
│ Rich UI          │  │   Terminal UI    │  │   Scriptable     │
│ Charts/Graphs    │  │   Keyboard nav   │  │   JSON output    │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## Implementation Phases

### Phase 1: Core Library (Foundation)
1. Set up monorepo with pnpm workspaces
2. Create `@weather/core` package
3. Implement Open-Meteo API client
4. Migrate types from current codebase
5. Migrate and extend utility functions
6. Add caching layer
7. Write tests

### Phase 2: Web App Migration
1. Move current code to `@weather/web`
2. Replace mock data imports with core
3. Create `useWeather` hook
4. Update components to use real data
5. Add loading states and error handling
6. Implement location search with geocoding
7. Add auto-refresh capability

### Phase 3: CLI Tool
1. Create `@weather/cli` package
2. Set up Commander.js structure
3. Implement core commands (current, forecast, search)
4. Add output formatters (table, json, compact)
5. Implement config storage
6. Add to PATH as `weather` command

### Phase 4: TUI Application
1. Create `@weather/tui` package
2. Set up Ink framework
3. Build dashboard component
4. Add forecast views
5. Implement keyboard navigation
6. Add location search
7. Add auto-refresh

---

## Configuration

### Root `package.json`

```json
{
  "name": "weather-app",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.0.0"
  }
}
```

### `pnpm-workspace.yaml`

```yaml
packages:
  - 'packages/*'
```

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

---

## Tech Stack Summary

| Package | Technologies |
|---------|-------------|
| `@weather/core` | TypeScript, fetch API |
| `@weather/web` | Next.js 16, React 19, Tailwind, Recharts, shadcn/ui |
| `@weather/tui` | Ink (React), Node.js |
| `@weather/cli` | Commander.js, Chalk, Ora |

---

## API: Open-Meteo

**Why Open-Meteo?**
- Free, no API key required
- Reliable and fast
- Good global coverage
- Provides all needed data points
- Open source friendly

**Endpoints Used:**
- `https://api.open-meteo.com/v1/forecast` - Weather data
- `https://air-quality-api.open-meteo.com/v1/air-quality` - AQI data
- `https://geocoding-api.open-meteo.com/v1/search` - Location search

**Rate Limits:**
- 10,000 requests/day (non-commercial)
- No authentication required

---

## Future Enhancements

1. **Weather Alerts** - Severe weather notifications
2. **Widgets** - macOS/iOS widgets using the core library
3. **API Server** - Self-hosted API aggregating multiple sources
4. **Offline Mode** - Cache last known data for offline viewing
5. **Multiple Units** - Celsius/Fahrenheit, km/h/mph toggle
6. **Themes** - TUI color themes
7. **Shortcuts** - Global keyboard shortcuts for quick weather check

---