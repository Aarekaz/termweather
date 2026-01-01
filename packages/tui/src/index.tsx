import React, { useState } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import { Dashboard } from './components/Dashboard.js';
import { Forecast } from './components/Forecast.js';
import { Search } from './components/Search.js';
import { StatusBar } from './components/StatusBar.js';
import { useWeatherData } from './hooks/useWeatherData.js';

type View = 'dashboard' | 'forecast' | 'search';

interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

const DEFAULT_LOCATIONS: Location[] = [
  { name: 'New York, USA', latitude: 40.7128, longitude: -74.006 },
  { name: 'London, UK', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503 },
];

function App() {
  const { exit } = useApp();
  const [view, setView] = useState<View>('dashboard');
  const [locations, setLocations] = useState<Location[]>(DEFAULT_LOCATIONS);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);

  const currentLocation = locations[currentLocationIndex];

  const { data, loading, error, lastUpdated, refetch } = useWeatherData(
    currentLocation.latitude,
    currentLocation.longitude,
    { refreshInterval: 5 * 60 * 1000 } // 5 minutes
  );

  // Handle keyboard input
  useInput((input, key) => {
    // Global navigation
    if (input === 'q') {
      exit();
    }
    if (input === 'd') {
      setView('dashboard');
    }
    if (input === 'f') {
      setView('forecast');
    }
    if (input === '/') {
      setView('search');
    }
    if (input === 'r') {
      refetch();
    }

    // Location switching with arrow keys (only when not in search)
    if (view !== 'search') {
      if (key.leftArrow) {
        setCurrentLocationIndex((prev) =>
          prev === 0 ? locations.length - 1 : prev - 1
        );
      }
      if (key.rightArrow) {
        setCurrentLocationIndex((prev) =>
          prev === locations.length - 1 ? 0 : prev + 1
        );
      }
    }
  });

  const handleLocationSelect = (location: Location) => {
    setLocations((prev) => {
      const existingIndex = prev.findIndex(
        (l) =>
          l.latitude === location.latitude && l.longitude === location.longitude
      );

      if (existingIndex >= 0) {
        setCurrentLocationIndex(existingIndex);
        return prev;
      }

      const next = [...prev, location];
      setCurrentLocationIndex(next.length - 1);
      return next;
    });

    setView('dashboard');
  };

  return (
    <Box flexDirection="column" width="100%">
      {/* Header */}
      <Box
        borderStyle="double"
        borderColor="cyan"
        paddingX={1}
        justifyContent="space-between"
      >
        <Text bold color="cyan">
          Weather TUI
        </Text>
        <Box gap={1}>
          {view !== 'search' && (
            <>
              <Text dimColor>{'<'}</Text>
              <Text bold>{currentLocation.name}</Text>
              <Text dimColor>{'>'}</Text>
            </>
          )}
        </Box>
        <Text dimColor>
          [{currentLocationIndex + 1}/{locations.length}]
        </Text>
      </Box>

      {/* Main Content */}
      <Box flexGrow={1} minHeight={20}>
        {error && view !== 'search' ? (
          <Box padding={2}>
            <Text color="red">Error: {error.message}</Text>
            <Text dimColor> Press 'r' to retry</Text>
          </Box>
        ) : (
          <>
            {view === 'dashboard' && <Dashboard data={data} loading={loading} />}
            {view === 'forecast' && <Forecast data={data} loading={loading} />}
            {view === 'search' && <Search onSelect={handleLocationSelect} />}
          </>
        )}
      </Box>

      {/* Status Bar */}
      <StatusBar view={view} lastUpdated={lastUpdated} loading={loading} />
    </Box>
  );
}

/**
 * Launch the TUI application
 * This is the main entry point that can be called from other packages
 */
export function launchTUI(): void {
  render(<App />);
}

// Export the App component for potential reuse
export { App };

// Auto-launch if run directly (for backwards compatibility with bin/weather-tui)
const isDirectRun = process.argv[1]?.includes('weather-tui') ||
                    process.argv[1]?.endsWith('/dist/index.js');

if (isDirectRun) {
  launchTUI();
}
