import { useEffect, useState } from 'react';

type ApiResource<T> = {
  data: T | null;
  isLoading: boolean;
  error: string;
};

export default function useApiResource<T>(
  load: (signal: AbortSignal) => Promise<T>,
): ApiResource<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    load(controller.signal)
      .then(setData)
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) {
          setError(
            cause instanceof Error
              ? cause.message
              : 'Une erreur est survenue pendant le chargement des contenus.',
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [load]);

  return { data, isLoading, error };
}
