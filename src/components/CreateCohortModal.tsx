import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Cohort } from '../api';
import { useCreateCohort } from '../hooks/useCreateCohort';
import { Icons } from './Icons';

interface Props {
  onClose: () => void;
  onCreated: (cohort: Cohort) => void;
}

type InternInput = { name: string; githubHandle: string };

function InternSection({ interns, onAdd, onRemove }: {
  interns: InternInput[];
  onAdd: (intern: InternInput) => void;
  onRemove: (index: number) => void;
}) {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');

  const add = () => {
    const n = name.trim();
    const h = handle.trim();
    if (!n || !h) return;
    onAdd({ name: n, githubHandle: h });
    setName('');
    setHandle('');
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); add(); }
  };

  return (
    <div className="field">
      <label className="field__label">Interns <span style={{ fontWeight: 400, color: 'var(--ink-4)' }}>(optional)</span></label>
      <div className="intern-editor">
        {interns.length > 0 && (
          <div className="intern-editor__list">
            {interns.map((intern, i) => (
              <div key={i} className="intern-editor__item">
                <span className="intern-editor__item-name">{intern.name}</span>
                <span className="intern-editor__item-handle">{intern.githubHandle}</span>
                <button
                  type="button"
                  className="btn btn--ghost btn--icon"
                  onClick={() => onRemove(i)}
                  aria-label="Remove intern"
                >
                  {Icons.x}
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="intern-editor__add-row">
          <input
            className="input"
            placeholder="Full name"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <input
            className="input"
            placeholder="@github-handle"
            value={handle}
            onChange={e => setHandle(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button
            type="button"
            className="btn btn--ghost"
            onClick={add}
            disabled={!name.trim() || !handle.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export function CreateCohortModal({ onClose, onCreated }: Props) {
  const [name, setName] = useState('');
  const [githubOrg, setGithubOrg] = useState('');
  const [startDate, setStartDate] = useState('');
  const [interns, setInterns] = useState<InternInput[]>([]);
  const { submitting, error, submit } = useCreateCohort();

  const valid = name.trim().length > 0 && githubOrg.trim().length > 0 && startDate.length > 0;

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!valid || submitting) return;
    await submit(name.trim(), githubOrg.trim(), startDate, interns, onCreated);
  };

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h2 className="modal__title">New Cohort</h2>
          <button className="btn btn--ghost btn--icon" onClick={onClose} aria-label="Close">
            {Icons.x}
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
          <div className="modal__body">
            <div className="modal__section-label">Details</div>
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
            <div className="modal__section-label" style={{ marginTop: 8 }}>Interns</div>
            <InternSection
              interns={interns}
              onAdd={intern => setInterns(prev => [...prev, intern])}
              onRemove={index => setInterns(prev => prev.filter((_, i) => i !== index))}
            />
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
