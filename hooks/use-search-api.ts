import { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { usePodcastsStore } from '@/stores/podcasts-store';


interface UseSearchApiReturn {
  error: string | null;
  search: (query: string) => void;
  clearResults: () => void;
}

export const useSearchApi = (): UseSearchApiReturn => {
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(debounce(async (query: string) => {
    if (!query.trim()) {
      setError('Please enter a search query');
      return;
    }

    setError(null);

    try {
      usePodcastsStore.setState({ isLoading: true });
      usePodcastsStore.setState({ keyword: query });
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch search results');
      }

      const data = await response.json();
      usePodcastsStore.setState({ podcasts: data.podcasts });
      usePodcastsStore.setState({ episodes: data.episodes })
      window.history.replaceState(null, '', '?q=' + encodeURIComponent(query))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      usePodcastsStore.setState({ isLoading: false });
    }
  }, 2000), []);

  const clearResults = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    search,
    clearResults,
  };
};
