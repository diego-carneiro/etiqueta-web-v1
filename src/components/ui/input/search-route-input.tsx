import { useEffect, useMemo, useRef, useState } from "react";
import api from "@/api/axios";

interface SearchRouteInputProps<T = unknown> {
  label?: string;
  placeholder?: string;
  endpoint?: string;
  queryParam?: string;
  debounceMs?: number;
  minLength?: number;
  className?: string;
  disabled?: boolean;
  fetcher?: (query: string) => Promise<T[]>;
  onResults: (results: T[], query: string) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  onError?: (error: unknown) => void;
}

function normalizeResponseData<T>(responseData: unknown): T[] {
  if (Array.isArray(responseData)) {
    return responseData as T[];
  }

  if (
    responseData &&
    typeof responseData === "object" &&
    "data" in responseData &&
    Array.isArray((responseData as { data?: unknown }).data)
  ) {
    return (responseData as { data: T[] }).data;
  }

  return [];
}

export function SearchRouteInput<T = unknown>({
  label = "Buscar",
  placeholder = "Digite para buscar",
  endpoint,
  queryParam = "search",
  debounceMs = 300,
  minLength = 1,
  className = "w-64",
  disabled = false,
  fetcher,
  onResults,
  onLoadingChange,
  onError,
}: SearchRouteInputProps<T>) {
  const [value, setValue] = useState("");
  const timeoutRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  const canSearch = useMemo(
    () => value.trim().length >= minLength,
    [minLength, value],
  );

  const executeSearch = async (query: string) => {
    const trimmedQuery = query.trim();
    const currentRequestId = ++requestIdRef.current;

    if (trimmedQuery.length < minLength) {
      onResults([], trimmedQuery);
      onLoadingChange?.(false);
      return;
    }

    onLoadingChange?.(true);

    try {
      const results = fetcher
        ? await fetcher(trimmedQuery)
        : normalizeResponseData<T>(
            (
              await api.get(endpoint ?? "", {
                params: {
                  [queryParam]: trimmedQuery,
                },
              })
            ).data,
          );

      if (currentRequestId === requestIdRef.current) {
        onResults(results, trimmedQuery);
      }
    } catch (error) {
      if (currentRequestId === requestIdRef.current) {
        onResults([], trimmedQuery);
        onError?.(error);
      }
    } finally {
      if (currentRequestId === requestIdRef.current) {
        onLoadingChange?.(false);
      }
    }
  };

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      void executeSearch(value);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [debounceMs, value]);

  useEffect(() => {
    if (!fetcher && !endpoint) {
      onError?.(new Error("SearchRouteInput precisa de `endpoint` ou `fetcher`."));
    }
  }, [endpoint, fetcher, onError]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && canSearch) {
            void executeSearch(value);
          }
        }}
        className={`${className} bg-white border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand/40`}
      />
    </div>
  );
}
