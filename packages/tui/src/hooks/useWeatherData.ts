import { useState, useEffect, useCallback, useRef } from 'react';
import { WeatherClient, type WeatherData } from '@weather/core';

interface UseWeatherDataOptions {
  refreshInterval?: number; // in milliseconds
  locationName?: string; // Optional location name to override "Unknown"
}

interface UseWeatherDataResult {
  data: WeatherData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  lastUpdated: Date | null;
}

export function useWeatherData(
  lat: number | null,
  lon: number | null,
  options: UseWeatherDataOptions = {}
): UseWeatherDataResult {
  const { refreshInterval = 5 * 60 * 1000, locationName } = options; // Default: 5 minutes

  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchWeather = useCallback(async () => {
    if (lat === null || lon === null) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const client = new WeatherClient();
      const weather = await client.getWeather(lat, lon);

      // Override location name if provided (fixes "Unknown" issue)
      if (locationName) {
        weather.location.name = locationName;
      }

      setData(weather);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch weather'));
    } finally {
      setLoading(false);
    }
  }, [lat, lon, locationName]);

  useEffect(() => {
    fetchWeather();

    if (refreshInterval > 0) {
      const interval = setInterval(fetchWeather, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchWeather, refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchWeather,
    lastUpdated,
  };
}

interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

interface UseLocationSearchResult {
  results: Location[];
  loading: boolean;
  error: Error | null;
  search: (query: string) => Promise<void>;
  clear: () => void;
}

export function useLocationSearch(): UseLocationSearchResult {
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const requestId = useRef(0);

  const search = useCallback(async (query: string) => {
    const currentRequest = requestId.current + 1;
    requestId.current = currentRequest;

    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const client = new WeatherClient();
      const locations = await client.searchLocation(query);

      if (requestId.current !== currentRequest) {
        return;
      }

      setResults(
        locations.map((loc) => ({
          name: `${loc.name}${loc.admin1 ? `, ${loc.admin1}` : ''}, ${loc.country}`,
          latitude: loc.latitude,
          longitude: loc.longitude,
        }))
      );
    } catch (err) {
      if (requestId.current !== currentRequest) {
        return;
      }
      setError(err instanceof Error ? err : new Error('Failed to search'));
      setResults([]);
    } finally {
      if (requestId.current === currentRequest) {
        setLoading(false);
      }
    }
  }, []);

  const clear = useCallback(() => {
    requestId.current += 1;
    setResults([]);
    setError(null);
    setLoading(false);
  }, []);

  return { results, loading, error, search, clear };
}
