import { useState, useEffect } from 'react';
import { type Cohort as CohortData, fetchCohorts } from '../api';
import { CreateCohortModal } from './CreateCohortModal';
import { Icons } from './Icons';

export interface CohortProps {
  cohorts: CohortData[];
  loading: boolean;
  error: Error | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCohortCreated: (cohort: CohortData) => void;
}

export const Cohort = ({ cohorts, loading, error, selectedId, onSelect, onCohortCreated }: CohortProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="side__section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Cohorts</span>
        <button
          className="btn btn--ghost btn--icon"
          style={{ padding: 2 }}
          onClick={() => setShowModal(true)}
          title="New cohort"
        >
          {Icons.plus}
        </button>
      </div>
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
      {showModal && (
        <CreateCohortModal
          onClose={() => setShowModal(false)}
          onCreated={(cohort) => {
            onCohortCreated(cohort);
            setShowModal(false);
          }}
        />
      )}
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
  const [selectedId, setSelectedId] = useState<string>("");

  const selectedCohort = cohorts.find(cohort => cohort.id === selectedId) || null;

  useEffect(() => {
    fetchCohorts()
      .then((cohorts) => {
        const sorted = [...cohorts].sort((a, b) => {
          if (!a.startDate && !b.startDate) return 0;
          if (!a.startDate) return 1;
          if (!b.startDate) return -1;
          return b.startDate.localeCompare(a.startDate);
        });
        setCohorts(sorted);
        setSelectedId(sorted[0]?.id || "");
      })
      .catch((err: unknown) => setError(err instanceof Error ? err : new Error(String(err))))
      .finally(() => setLoading(false));
  }, []);

  const onCohortCreated = (cohort: CohortData) => {
    setCohorts((prev) => {
      const next = [...prev, cohort];
      return next.sort((a, b) => {
        if (!a.startDate && !b.startDate) return 0;
        if (!a.startDate) return 1;
        if (!b.startDate) return -1;
        return b.startDate.localeCompare(a.startDate);
      });
    });
    setSelectedId(cohort.id);
  };

  return {
    cohorts,
    loading,
    error,
    onSelect: setSelectedId,
    selectedId: selectedId || "",
    selectedCohort,
    onCohortCreated,
  };
};
