import { useState } from 'react';
import { createAssignment } from '../api';
import { Icons } from './Icons';

interface Props {
  cohortId: number;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateAssignmentModal({ cohortId, onClose, onCreated }: Props) {
  const [name, setName] = useState('');
  const [githubName, setGithubName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createAssignment(cohortId, { name: name.trim(), githubName: githubName.trim() });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  };

  const valid = name.trim().length > 0 && githubName.trim().length > 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <h2 className="modal__title">New Assignment</h2>
          <button className="btn btn--ghost btn--icon" onClick={onClose} aria-label="Close">
            {Icons.x}
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="field__label" htmlFor="asgn-name">Assignment name</label>
            <input
              id="asgn-name"
              className="input"
              placeholder="Week 6 — Distributed Cache"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="asgn-repo">GitHub repository name</label>
            <input
              id="asgn-repo"
              className="input"
              placeholder="cohort-s26/week-06-cache"
              value={githubName}
              onChange={(e) => setGithubName(e.target.value)}
            />
            <div className="field__hint">The GitHub Classroom repository slug for this assignment.</div>
          </div>
          {error && <div className="modal__error">{error}</div>}
          <div className="modal__foot">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={!valid || submitting}>
              {submitting ? 'Creating…' : 'Create Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
