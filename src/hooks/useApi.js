import { useState, useCallback } from 'react';
import { getErrorMessage } from '../utils/helpers';
import { ERROR_MESSAGES } from '../utils/constants';

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunction(...params);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export const useApiWithCache = (apiFunction, cacheKey) => {
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunction(...params);
      setData(response.data);
      localStorage.setItem(cacheKey, JSON.stringify(response.data));
      return response.data;
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiFunction, cacheKey]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    localStorage.removeItem(cacheKey);
  }, [cacheKey]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

export const useApiWithRetry = (apiFunction, maxRetries = 3) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    let retries = 0;
    setLoading(true);
    setError(null);

    while (retries < maxRetries) {
      try {
        const response = await apiFunction(...params);
        setData(response.data);
        return response.data;
      } catch (err) {
        retries++;
        if (retries === maxRetries) {
          const errorMessage = getErrorMessage(err);
          setError(errorMessage);
          throw new Error(errorMessage);
        }
        // Wait before retrying (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, Math.pow(2, retries) * 1000));
      }
    }
  }, [apiFunction, maxRetries]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}; 