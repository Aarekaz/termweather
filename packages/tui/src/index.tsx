import React, { useState, useEffect } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import { Dashboard } from './components/Dashboard.js';
import { Forecast } from './components/Forecast.js';
import { Search } from './components/Search.js';
import { StatusBar } from './components/StatusBar.js';
import { HelpModal } from './components/overlays/HelpModal.js';
import { OnboardingModal } from './components/overlays/OnboardingModal.js';
import { TabBar } from './components/navigation/TabBar.js';
import { TinyScreenWarning } from './components/TinyScreenWarning.js';
import { useWeatherData } from './hooks/useWeatherData.js';
import { useTerminalSize } from './hooks/useTerminalSize.js';
import { getNextTab, getPreviousTab, getTabByNumber } from './config/tabs.js';
import {
  loadConfig,
  saveConfig,
  addLocation,
  removeLocation,
  configExists,
} from './utils/config.js';
import type { Location } from './types/config.js';

type View = 'dashboard' | 'forecast' | 'search';

const DEFAULT_LOCATIONS: Location[] = [
  { name: 'New York, USA', latitude: 40.7128, longitude: -74.006 },
  { name: 'London, UK', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Tokyo, Japan', latitude: 35.6762, longitude: 139.6503 },
];

function App() {
  const { exit } = useApp();
  const [view, setView] = useState<View>('dashboard');
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState<boolean | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);

  const { breakpoint } = useTerminalSize();
  const currentLocation = locations[currentLocationIndex];

  const { data, loading, error, lastUpdated, refetch } = useWeatherData(
    currentLocation?.latitude,
    currentLocation?.longitude,
    {
      refreshInterval: 5 * 60 * 1000, // 5 minutes
      locationName: currentLocation?.name // Fix "Unknown" issue
    }
  );

  // Load config on mount
  useEffect(() => {
    async function initializeConfig() {
      try {
        const exists = await configExists();
        setIsFirstRun(!exists);

        const config = await loadConfig();
        if (config.locations.length > 0) {
          setLocations(config.locations);
          setCurrentLocationIndex(config.defaultLocationIndex);
        } else {
          setLocations(DEFAULT_LOCATIONS);
        }
        setAnimationsEnabled(config.settings.animationsEnabled);
        setConfigLoaded(true);
      } catch (error) {
        console.error('Failed to load config:', error);
        setLocations(DEFAULT_LOCATIONS);
        setIsFirstRun(false);
        setConfigLoaded(true);
      }
    }
    initializeConfig();
  }, []);

  // Auto-save locations and settings when they change
  useEffect(() => {
    if (!configLoaded) return;

    async function persistConfig() {
      try {
        const config = await loadConfig();
        config.locations = locations;
        config.defaultLocationIndex = currentLocationIndex;
        config.settings.animationsEnabled = animationsEnabled;
        await saveConfig(config);
      } catch (error) {
        console.error('Failed to save config:', error);
      }
    }
    persistConfig();
  }, [locations, currentLocationIndex, animationsEnabled, configLoaded]);

  // Handle keyboard input
  useInput((input, key) => {
    // Help modal toggle (works in all views)
    if (input === '?') {
      setShowHelp((prev) => !prev);
      return;
    }

    // Close help modal with ESC
    if (key.escape && showHelp) {
      setShowHelp(false);
      return;
    }

    // Tab navigation (skip in search view to allow text input)
    if (view !== 'search') {
      // Tab: next view
      if (key.tab && !key.shift) {
        setView(getNextTab(view));
        return;
      }

      // Shift+Tab: previous view
      if (key.tab && key.shift) {
        setView(getPreviousTab(view));
        return;
      }

      // Number shortcuts (1-3) for direct navigation
      if (['1', '2', '3'].includes(input)) {
        const targetView = getTabByNumber(input);
        if (targetView) {
          setView(targetView);
          return;
        }
      }
    }

    // Special handling for search view
    if (view === 'search') {
      if (key.ctrl && input === 'c') {
        exit();
      }
      return;
    }

    // Global navigation (keep legacy shortcuts for backward compatibility)
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
    // Toggle animations
    if (input === 'a') {
      setAnimationsEnabled((prev) => !prev);
    }

    // Location switching with arrow keys
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

  const handleLocationSave = async (location: Location) => {
    try {
      await addLocation(location);
      setLocations((prev) => {
        const exists = prev.some(
          (l) => l.latitude === location.latitude && l.longitude === location.longitude
        );
        return exists ? prev : [...prev, location];
      });
    } catch (error) {
      console.error('Failed to save location:', error);
    }
  };

  const handleLocationDelete = async (latitude: number, longitude: number) => {
    try {
      await removeLocation(latitude, longitude);
      setLocations((prev) => {
        const filtered = prev.filter(
          (l) => !(l.latitude === latitude && l.longitude === longitude)
        );
        if (currentLocationIndex >= filtered.length) {
          setCurrentLocationIndex(Math.max(0, filtered.length - 1));
        }
        return filtered;
      });
    } catch (error) {
      console.error('Failed to delete location:', error);
    }
  };

  const handleOnboardingComplete = async (location: Location | null) => {
    setIsFirstRun(false);

    if (location) {
      // User selected a location
      setLocations([location]);
      setCurrentLocationIndex(0);
      try {
        await addLocation(location);
      } catch (error) {
        console.error('Failed to save location:', error);
      }
    } else {
      // User skipped - use defaults
      setLocations(DEFAULT_LOCATIONS);
      try {
        const config = await loadConfig();
        config.locations = DEFAULT_LOCATIONS;
        await saveConfig(config);
      } catch (error) {
        console.error('Failed to save defaults:', error);
      }
    }

    setView('dashboard');
  };

  // Show onboarding on first run
  if (isFirstRun) {
    return (
      <OnboardingModal
        visible={true}
        onComplete={handleOnboardingComplete}
        breakpoint={breakpoint}
      />
    );
  }

  // Show loading state during config initialization
  if (isFirstRun === null || !currentLocation) {
    return (
      <Box padding={2}>
        <Text dimColor>Loading configuration...</Text>
      </Box>
    );
  }

  // Show warning on tiny screens
  if (breakpoint === 'tiny') {
    return (
      <Box flexDirection="column" width="100%" height="100%">
        <TinyScreenWarning />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" width="100%">
      {/* Tab Navigation Bar */}
      <TabBar currentView={view} onTabChange={setView} breakpoint={breakpoint} />

      {/* Main Content - Dashboard now includes header */}
      <Box flexGrow={1} minHeight={20}>
        {error && view !== 'search' ? (
          <Box padding={2}>
            <Text color="red">Error: {error.message}</Text>
            <Text dimColor> Press 'r' to retry</Text>
          </Box>
        ) : (
          <>
            {view === 'dashboard' && (
              <Dashboard
                data={data}
                loading={loading}
                animationsEnabled={animationsEnabled}
                locationIndex={currentLocationIndex}
                totalLocations={locations.length}
              />
            )}
            {view === 'forecast' && <Forecast data={data} loading={loading} />}
            {view === 'search' && (
              <Search
                onSelect={handleLocationSelect}
                onCancel={() => setView('dashboard')}
                savedLocations={locations}
                onSave={handleLocationSave}
                onDelete={handleLocationDelete}
              />
            )}
          </>
        )}
      </Box>

      {/* Status Bar */}
      <StatusBar view={view} lastUpdated={lastUpdated} loading={loading} breakpoint={breakpoint} />

      {/* Help Modal */}
      <HelpModal
        visible={showHelp}
        onClose={() => setShowHelp(false)}
        currentView={view}
        breakpoint={breakpoint}
      />
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
