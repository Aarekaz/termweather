import { useState, useEffect, useCallback } from 'react';
import { WeatherClient, type WeatherData } from '@weather/core';

interface UseWeatherDataOptions {
  refreshInterval?: number; // in milliseconds
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
  const { refreshInterval = 5 * 60 * 1000 } = options; // Default: 5 minutes

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

      setData(weather);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch weather'));
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

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

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const client = new WeatherClient();
      const locations = await client.searchLocation(query);

      setResults(
        locations.map((loc) => ({
          name: `${loc.name}${loc.admin1 ? `, ${loc.admin1}` : ''}, ${loc.country}`,
          latitude: loc.latitude,
          longitude: loc.longitude,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to search'));
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { results, loading, error, search, clear };
}
