import React from 'react';
import { Box } from 'ink';
import type { WeatherData } from '@weather/core';
import { useTerminalSize } from '../../hooks/useTerminalSize.js';
import { UnifiedHeader } from './UnifiedHeader.js';
import { HourlyForecastPanel } from '../panels/HourlyForecastPanel.js';
import { EnhancedBottomSection } from './EnhancedBottomSection.js';

interface StationLayoutProps {
  /** Complete weather data */
  data: WeatherData;
  /** Enable weather animations */
  animationsEnabled?: boolean;
  /** Current location index */
  locationIndex?: number;
  /** Total number of locations */
  totalLocations?: number;
}

/**
 * Horizontal stripe layout for weather station dashboard
 * Streamlined information-dense design with top-to-bottom reading flow
 *
 * Layout Structure:
 * ╔═ UNIFIED HEADER (Location + Metrics) ═╗ (Always visible - double-height)
 * ┏━ HOURLY FORECAST (Enhanced)━━━━━━━━━━┓ (Always visible - star of the show)
 * ┌─ SUN & MOON ─┬─ ATMOSPHERIC ─────────┐ (Hidden on small terminals)
 *
 * Breakpoints:
 * - Small (<80 cols): Unified Header (compact) + Hourly (8hrs)
 * - Medium (80-120): + Enhanced Bottom Section, Hourly (10hrs)
 * - Large (>120): Full dashboard with all sparklines, Hourly (14hrs)
 */
export function StationLayout({
  data,
  animationsEnabled = true,
  locationIndex = 0,
  totalLocations = 1,
}: StationLayoutProps) {
  const { breakpoint } = useTerminalSize();

  // Determine how many hours to show based on terminal size
  const hoursToShow: Record<string, number> = {
    tiny: 6,
    small: 8,
    medium: 10,
    large: 14,
    xlarge: 18,
  };
  const hours = hoursToShow[breakpoint] || 10;

  return (
    <Box flexDirection="column" gap={0} paddingX={1} paddingY={0}>
      {/* Unified Header - NEW (replaces TopStatusBar + QuickMetricsBar) */}
      <UnifiedHeader
        location={data.location.name}
        temperature={data.current.temperature}
        condition={data.current.condition}
        feelsLike={data.current.feelsLike}
        locationIndex={locationIndex}
        totalLocations={totalLocations}
        wind={{
          speed: data.current.windSpeed,
          direction: data.current.windDirection,
        }}
        humidity={data.current.humidity}
        pressure={data.current.pressure}
        pressureTrend={data.current.pressureTrend}
        uvIndex={data.current.uvIndex}
        aqi={data.airQuality?.aqi}
      />

      {/* Hourly Forecast - Enhanced with Feels Like + Wind sparklines */}
      <Box marginTop={0}>
        <HourlyForecastPanel hourly={data.hourly} hours={hours} />
      </Box>

      {/* Enhanced Bottom Section - NEW (replaces BottomSection) */}
      {breakpoint !== 'small' && breakpoint !== 'tiny' && (
        <Box marginTop={0}>
          <EnhancedBottomSection
            sunTimes={data.sunTimes}
            visibility={data.current.visibility}
            aqi={data.airQuality?.aqi}
            cloudCover={data.current.cloudCover}
            temperature={data.current.temperature}
            humidity={data.current.humidity}
            pressure={data.current.pressure}
            pressureTrend={data.current.pressureTrend}
            currentTime={new Date()}
          />
        </Box>
      )}
    </Box>
  );
}
