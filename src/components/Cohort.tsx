import { useState, useEffect } from 'react';
import { type Cohort as CohortData, fetchCohorts } from '../api';

export interface CohortProps {
  cohorts: CohortData[];
  loading: boolean;
  error: Error | null;
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export const Cohort = ({ cohorts, loading, error, selectedId, onSelect }: CohortProps) => {
  return (
    <div>
      <div className="side__section-title">Cohorts</div>
      <nav className="side__nav">
        {loading && <div className="side__item">Loading…</div>}
        {error && <div className="side__item" style={{ color: 'var(--danger)' }}>Failed to load</div>}
        {cohorts.map(cohort => (
          <div
            key={cohort.id}
            className={`side__item ${cohort.id === selectedId ? 'is-active' : ''}`}
            onClick={() => onSelect(cohort.id)}
          >
            <span className={`dot ${cohort.id === selectedId ? 'dot-good' : 'dot--idle'}`} />
            <span className="side__label">{cohort.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export type CohortsState = CohortProps & {
  selectedCohort: CohortData | null;
}

export const useCohorts = (): CohortsState => {
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedCohort = selectedId === null ? null : cohorts.find(cohort => cohort.id === selectedId) || null;

  useEffect(() => {
    fetchCohorts()
      .then((cohorts) => {
        setCohorts(cohorts);
        setSelectedId(cohorts[0]?.id || null)
      })
      .catch((err: unknown) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false));
  }, []);

  return {
    cohorts,
    loading,
    error,
    onSelect: setSelectedId,
    selectedId: selectedId || -1, selectedCohort
  };
};

