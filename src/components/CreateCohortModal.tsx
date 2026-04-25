import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Cohort } from '../api';
import { useCreateCohort } from '../hooks/useCreateCohort';
import { Icons } from './Icons';

interface Props {
  onClose: () => void;
  onCreated: (cohort: Cohort) => void;
}

export function CreateCohortModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState('');
  const [githubOrg, setGithubOrg] = useState('');
  const [startDate, setStartDate] = useState('');
  const { submitting, error, submit } = useCreateCohort();

  const valid = name.trim().length > 0 && githubOrg.trim().length > 0 && startDate.length > 0;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!valid || submitting) return;
    await submit(name.trim(), githubOrg.trim(), startDate, onCreated);
  };

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h2 className="modal__title">New Cohort</h2>
          <button className="btn btn--ghost btn--icon" onClick={onClose} aria-label="Close">
            {Icons.x}
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
          <div className="modal__body">
            <div className="field">
              <label className="field__label" htmlFor="cohort-name">Cohort name</label>
              <input
                id="cohort-name"
                className="input"
                placeholder="Spring '27 · Backend"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="cohort-org">GitHub organisation</label>
              <input
                id="cohort-org"
                className="input"
                placeholder="my-org"
                value={githubOrg}
                onChange={(e) => setGithubOrg(e.target.value)}
              />
              <div className="field__hint">The GitHub organisation used for this cohort's repositories.</div>
            </div>
            <div className="field">
              <label className="field__label" htmlFor="cohort-start-date">Start date</label>
              <input
                id="cohort-start-date"
                className="input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>
          {error && <div className="modal__error">{error}</div>}
          <div className="modal__foot">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={!valid || submitting}>
              {submitting ? 'Creating…' : 'Create Cohort'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
