import { useState } from 'react';
import type { Cohort as CohortData } from '../api';
import { type CohortProps } from '../hooks/useCohorts';
import { ConfigureCohortModal } from './ConfigureCohortModal';
import { CreateCohortModal } from './CreateCohortModal';
import { Icons } from './Icons';

export const Cohort = ({ cohorts, loading, error, selectedId, onSelect, onCohortCreated, onCohortUpdated }: CohortProps) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [configureTarget, setConfigureTarget] = useState<CohortData | null>(null);

  return (
    <div>
      <div className="side__section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>Cohorts</span>
        <button
          className="btn btn--ghost btn--icon"
          style={{ padding: 2 }}
          onClick={() => setShowCreateModal(true)}
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
            className={`side__item side__item--cohort ${cohort.id === selectedId ? 'is-active' : ''}`}
            onClick={() => onSelect(cohort.id)}
          >
            <span className={`dot ${cohort.id === selectedId ? 'dot-good' : 'dot--idle'}`} />
            <span className="side__label">{cohort.name}</span>
            <button
              className="btn btn--ghost btn--icon side__item-configure"
              onClick={(e) => { e.stopPropagation(); setConfigureTarget(cohort); }}
              title="Configure cohort"
              aria-label="Configure cohort"
            >
              {Icons.settings}
            </button>
          </div>
        ))}
      </nav>

      {showCreateModal && (
        <CreateCohortModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(cohort) => {
            onCohortCreated(cohort);
            setShowCreateModal(false);
          }}
        />
      )}

      {configureTarget && (
        <ConfigureCohortModal
          cohort={configureTarget}
          onClose={() => setConfigureTarget(null)}
          onUpdated={(updated) => {
            onCohortUpdated(updated);
            setConfigureTarget(updated);
          }}
        />
      )}
    </div>
  );
};
