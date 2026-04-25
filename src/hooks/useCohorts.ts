import { useState, useEffect } from 'react';
import { type Cohort, fetchCohorts } from '../api';

export interface CohortProps {
  cohorts: Cohort[];
  loading: boolean;
  error: Error | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCohortCreated: (cohort: Cohort) => void;
  onCohortUpdated: (cohort: Cohort) => void;
}

export type CohortsState = CohortProps & {
  selectedCohort: Cohort | null;
};

const sortCohorts = (list: Cohort[]) =>
  [...list].sort((a, b) => {
    if (!a.startDate && !b.startDate) return 0;
    if (!a.startDate) return 1;
    if (!b.startDate) return -1;
    return b.startDate.localeCompare(a.startDate);
  });

export const useCohorts = (): CohortsState => {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedId, setSelectedId] = useState<string>('');

  const selectedCohort = cohorts.find(c => c.id === selectedId) ?? null;

  useEffect(() => {
    fetchCohorts()
      .then((data) => {
        const sorted = sortCohorts(data);
        setCohorts(sorted);
        setSelectedId(sorted[0]?.id ?? '');
      })
      .catch((err: unknown) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false));
  }, []);

  const onCohortCreated = (cohort: Cohort) => {
    setCohorts(prev => sortCohorts([...prev, cohort]));
    setSelectedId(cohort.id);
  };

  const onCohortUpdated = (cohort: Cohort) => {
    setCohorts(prev => sortCohorts(prev.map(c => c.id === cohort.id ? cohort : c)));
  };

  return {
    cohorts,
    loading,
    error,
    onSelect: setSelectedId,
    selectedId: selectedId || '',
    selectedCohort,
    onCohortCreated,
    onCohortUpdated,
  };
};
