import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useLocationSearch } from '../hooks/useWeatherData.js';
import type { Location } from '../types/config.js';

interface SearchProps {
  onSelect: (location: Location) => void;
  onCancel: () => void;
  savedLocations?: Location[];
  onSave?: (location: Location) => void;
  onDelete?: (latitude: number, longitude: number) => void;
  isEmbedded?: boolean;
}

export function Search({
  onSelect,
  onCancel,
  savedLocations = [],
  onSave,
  onDelete,
  isEmbedded = false,
}: SearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { results, loading, error, search, clear } = useLocationSearch();

  // Combined list of saved locations + search results
  type ListItem =
    | { type: 'saved'; location: Location; index: number }
    | { type: 'search'; location: Location; index: number };

  const allItems: ListItem[] = [
    ...savedLocations.map((loc, i) => ({
      type: 'saved' as const,
      location: loc,
      index: i,
    })),
    ...results.map((loc, i) => ({
      type: 'search' as const,
      location: loc,
      index: i,
    })),
  ];

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
    const maxIndex = allItems.length - 1;

    if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(maxIndex, prev + 1));
    } else if (key.return && allItems.length > 0) {
      const selected = allItems[selectedIndex];
      if (selected) {
        onSelect(selected.location);
        setQuery('');
        clear();
      }
    } else if (key.escape) {
      setQuery('');
      clear();
      onCancel();
    } else if (input === 's' && onSave) {
      // Save location (only for search results)
      const selected = allItems[selectedIndex];
      if (selected && selected.type === 'search') {
        onSave(selected.location);
      }
    } else if (input === 'd' && onDelete) {
      // Delete location (only for saved locations)
      const selected = allItems[selectedIndex];
      if (selected && selected.type === 'saved') {
        onDelete(selected.location.latitude, selected.location.longitude);
        setSelectedIndex(Math.max(0, selectedIndex - 1));
      }
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

      {/* Saved Locations Section */}
      {savedLocations.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="yellow" bold>
            SAVED LOCATIONS ({savedLocations.length})
          </Text>
          <Box flexDirection="column" marginTop={0}>
            {savedLocations.map((loc, i) => {
              const isSelected = selectedIndex === i;
              return (
                <Box key={`saved-${i}`} gap={1}>
                  <Text color={isSelected ? 'cyan' : undefined} bold={isSelected}>
                    {isSelected ? '> ' : '  '}★ {loc.name}
                  </Text>
                  {isSelected && onDelete && (
                    <Text dimColor> [d] delete</Text>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Search Results Section */}
      {results.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="cyan" bold>
            SEARCH RESULTS ({results.length})
          </Text>
          <Box flexDirection="column" marginTop={0}>
            {results.map((loc, i) => {
              const globalIndex = savedLocations.length + i;
              const isSelected = selectedIndex === globalIndex;
              const isSaved = savedLocations.some(
                (s) => s.latitude === loc.latitude && s.longitude === loc.longitude
              );
              return (
                <Box key={`result-${i}`} gap={1}>
                  <Text color={isSelected ? 'cyan' : undefined} bold={isSelected}>
                    {isSelected ? '> ' : '  '}{loc.name}
                  </Text>
                  {isSelected && onSave && !isSaved && (
                    <Text dimColor> [s] save</Text>
                  )}
                  {isSaved && <Text color="green"> ✓ saved</Text>}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {query.length >= 2 && !loading && results.length === 0 && (
        <Box marginTop={1}>
          <Text dimColor>No locations found</Text>
        </Box>
      )}

      {/* Help text */}
      {allItems.length > 0 && (
        <Box marginTop={1}>
          <Text dimColor>
            ↑/↓ navigate · Enter select · Esc cancel
            {onSave && ' · [s] save'}
            {onDelete && ' · [d] delete'}
          </Text>
        </Box>
      )}
    </Box>
  );
}
