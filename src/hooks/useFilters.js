import { useState, useCallback, useEffect } from 'react';
import { debounce } from '../utils/helpers';
import { FILTER_OPTIONS } from '../utils/constants';

export const useFilters = (initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const removeFilter = useCallback((key) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const updateSort = useCallback((newSortBy, newSortDirection) => {
    setSortBy(newSortBy);
    setSortDirection(newSortDirection);
  }, []);

  const debouncedSetSearchTerm = useCallback(
    debounce((value) => {
      setSearchTerm(value);
    }, 300),
    []
  );

  const handleSearch = useCallback((value) => {
    debouncedSetSearchTerm(value);
  }, [debouncedSetSearchTerm]);

  const getFilteredItems = useCallback((items) => {
    let filtered = [...items];

    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter((item) => {
          switch (key) {
            case 'priority':
              return item.priority === value;
            case 'status':
              return item.completed === (value === 'completed');
            case 'tags':
              return value.every((tag) => item.tags.includes(tag));
            case 'assignedUsers':
              return value.every((userId) =>
                item.assignedUsers.includes(userId)
              );
            default:
              return true;
          }
        });
      }
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'dueDate':
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        case 'createdAt':
        default:
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [filters, sortBy, sortDirection, searchTerm]);

  const getActiveFilters = useCallback(() => {
    return Object.entries(filters).filter(([_, value]) => value);
  }, [filters]);

  const hasActiveFilters = useCallback(() => {
    return Object.values(filters).some((value) => value) || searchTerm;
  }, [filters, searchTerm]);

  return {
    filters,
    sortBy,
    sortDirection,
    searchTerm,
    updateFilter,
    removeFilter,
    clearFilters,
    updateSort,
    handleSearch,
    getFilteredItems,
    getActiveFilters,
    hasActiveFilters,
  };
};

export const useFilterPresets = (initialPresets = []) => {
  const [presets, setPresets] = useState(initialPresets);

  const savePreset = useCallback((name, filters) => {
    setPresets((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        filters,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const deletePreset = useCallback((presetId) => {
    setPresets((prev) => prev.filter((preset) => preset.id !== presetId));
  }, []);

  const updatePreset = useCallback((presetId, updates) => {
    setPresets((prev) =>
      prev.map((preset) =>
        preset.id === presetId ? { ...preset, ...updates } : preset
      )
    );
  }, []);

  return {
    presets,
    savePreset,
    deletePreset,
    updatePreset,
  };
}; 