import { useState, useEffect } from 'react';
import { type Cohort as CohortData, fetchCohorts } from '../api';

export const Cohort = () => {
  const { cohorts, loading, error } = useCohorts();
  const [selectedCohort, setSelectedCohort] = useState<number | null>(null);

  useEffect(() => {
    if (cohorts.length > 0 && selectedCohort === null) {
      setSelectedCohort(cohorts[0].id);
    }
  }, [cohorts, selectedCohort]);

  return (
    <div>
      <div className="side__section-title">Cohorts</div>
      <nav className="side__nav">
        {loading && <div className="side__item">Loading…</div>}
        {error && <div className="side__item" style={{ color: 'var(--danger)' }}>Failed to load</div>}
        {cohorts.map(cohort => (
          <div
            key={cohort.id}
            className={`side__item ${cohort.id === selectedCohort ? 'is-active' : ''}`}
            onClick={() => setSelectedCohort(cohort.id)}
          >
            <span className={`dot ${cohort.id === selectedCohort ? 'dot-good' : 'dot--idle'}`} />
            <span className="side__label">{cohort.name}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

const useCohorts = () => {
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCohorts()
      .then(setCohorts)
      .catch((err: unknown) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false));
  }, []);

  return { cohorts, loading, error };
};

