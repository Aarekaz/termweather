import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useLocationSearch } from '../hooks/useWeatherData.js';

interface Location {
  name: string;
  latitude: number;
  longitude: number;
}

interface SearchProps {
  onSelect: (location: Location) => void;
}

export function Search({ onSelect }: SearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { results, loading, error, search, clear } = useLocationSearch();

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.length >= 2) {
        search(query);
      } else {
        clear();
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, search, clear]);

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(results.length - 1, prev + 1));
    } else if (key.return && results.length > 0) {
      onSelect(results[selectedIndex]);
      setQuery('');
      clear();
    } else if (key.escape) {
      setQuery('');
      clear();
    }
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>Search Location</Text>

      <Box marginTop={1}>
        <Text dimColor>{'> '}</Text>
        <TextInput
          value={query}
          onChange={setQuery}
          placeholder="Enter city name..."
        />
      </Box>

      {loading && (
        <Box marginTop={1}>
          <Text dimColor>Searching...</Text>
        </Box>
      )}

      {error && (
        <Box marginTop={1}>
          <Text color="red">Error: {error.message}</Text>
        </Box>
      )}

      {results.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text dimColor>
            Use arrow keys to select, Enter to confirm, Esc to cancel
          </Text>
          <Box flexDirection="column" marginTop={1}>
            {results.map((loc, index) => (
              <Box key={index}>
                <Text
                  color={index === selectedIndex ? 'cyan' : undefined}
                  bold={index === selectedIndex}
                >
                  {index === selectedIndex ? '> ' : '  '}
                  {loc.name}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {query.length >= 2 && !loading && results.length === 0 && (
        <Box marginTop={1}>
          <Text dimColor>No locations found</Text>
        </Box>
      )}
    </Box>
  );
}
