import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Cohort, CohortIntern } from '../api';
import { useConfigureCohort } from '../hooks/useConfigureCohort';
import { Icons } from './Icons';

interface Props {
  cohort: Cohort;
  onClose: () => void;
  onUpdated: (cohort: Cohort) => void;
}

function InternRow({ intern, onEdit, onDelete }: {
  intern: CohortIntern;
  onEdit: (name: string, handle: string) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(intern.name);
  const [handle, setHandle] = useState(intern.githubHandle);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!name.trim() || !handle.trim()) return;
    setBusy(true);
    await onEdit(name.trim(), handle.trim());
    setBusy(false);
    setEditing(false);
  };

  const cancel = () => {
    setName(intern.name);
    setHandle(intern.githubHandle);
    setEditing(false);
  };

  const remove = async () => {
    setBusy(true);
    await onDelete();
    setBusy(false);
  };

  if (editing) {
    return (
      <div className="intern-editor__item intern-editor__item--editing">
        <input
          className="input"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
          autoFocus
        />
        <input
          className="input"
          value={handle}
          onChange={e => setHandle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && save()}
        />
        <button
          type="button"
          className="btn btn--primary"
          onClick={save}
          disabled={busy || !name.trim() || !handle.trim()}
          style={{ flexShrink: 0 }}
        >
          Save
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={cancel}
          disabled={busy}
          style={{ flexShrink: 0 }}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="intern-editor__item">
      <span className="intern-editor__item-name">{intern.name}</span>
      <span className="intern-editor__item-handle">{intern.githubHandle}</span>
      <button
        type="button"
        className="btn btn--ghost btn--icon"
        onClick={() => setEditing(true)}
        disabled={busy}
        aria-label="Edit intern"
      >
        {Icons.edit}
      </button>
      <button
        type="button"
        className="btn btn--ghost btn--icon"
        onClick={remove}
        disabled={busy}
        aria-label="Remove intern"
        style={{ color: 'var(--bad)' }}
      >
        {Icons.x}
      </button>
    </div>
  );
}

function AddInternRow({ onAdd }: { onAdd: (name: string, handle: string) => Promise<void> }) {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [busy, setBusy] = useState(false);

  const add = async () => {
    const n = name.trim();
    const h = handle.trim();
    if (!n || !h) return;
    setBusy(true);
    await onAdd(n, h);
    setBusy(false);
    setName('');
    setHandle('');
  };

  return (
    <div className="intern-editor__add-row">
      <input
        className="input"
        placeholder="Full name"
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && add()}
        disabled={busy}
      />
      <input
        className="input"
        placeholder="@github-handle"
        value={handle}
        onChange={e => setHandle(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && add()}
        disabled={busy}
      />
      <button
        type="button"
        className="btn btn--ghost"
        onClick={add}
        disabled={busy || !name.trim() || !handle.trim()}
        style={{ flexShrink: 0 }}
      >
        {busy ? 'Adding…' : 'Add intern'}
      </button>
    </div>
  );
}

export function ConfigureCohortModal({ cohort, onClose, onUpdated }: Props) {
  const [cohortName, setCohortName] = useState(cohort.name);
  const [githubOrg, setGithubOrg] = useState(cohort.githubOrganization ?? '');
  const { interns, loadingInterns, error, saving, saveCohortDetails, addIntern, editIntern, deleteIntern } = useConfigureCohort(cohort);

  const detailsChanged = cohortName.trim() !== cohort.name || githubOrg.trim() !== (cohort.githubOrganization ?? '');
  const detailsValid = cohortName.trim().length > 0;

  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <div>
            <h2 className="modal__title">Configure Cohort</h2>
            <div className="modal__subtitle">{cohort.name}</div>
          </div>
          <button className="btn btn--ghost btn--icon" onClick={onClose} aria-label="Close">
            {Icons.x}
          </button>
        </div>

        <div className="modal__body">
          <div className="modal__section-label">Details</div>
          <div className="field">
            <label className="field__label" htmlFor="cfg-cohort-name">Cohort name</label>
            <input
              id="cfg-cohort-name"
              className="input"
              value={cohortName}
              onChange={e => setCohortName(e.target.value)}
              autoFocus
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="cfg-cohort-org">GitHub organisation</label>
            <input
              id="cfg-cohort-org"
              className="input"
              placeholder="my-org"
              value={githubOrg}
              onChange={e => setGithubOrg(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <button
              type="button"
              className="btn btn--primary"
              disabled={!detailsValid || !detailsChanged || saving}
              onClick={() => saveCohortDetails(cohortName.trim(), githubOrg.trim(), onUpdated)}
            >
              {saving ? 'Saving…' : 'Save details'}
            </button>
          </div>

          <div className="modal__section-label">Interns</div>
          <div className="intern-editor">
            {loadingInterns ? (
              <div className="intern-editor__empty">Loading…</div>
            ) : interns.length === 0 ? (
              <div className="intern-editor__empty">No interns yet.</div>
            ) : (
              <div className="intern-editor__list">
                {interns.map(intern => (
                  <InternRow
                    key={intern.id}
                    intern={intern}
                    onEdit={(name, handle) => editIntern(intern.id, name, handle)}
                    onDelete={() => deleteIntern(intern.id)}
                  />
                ))}
              </div>
            )}
            <AddInternRow onAdd={addIntern} />
          </div>

          {error && <div className="modal__error" style={{ marginTop: 12 }}>{error}</div>}
        </div>

        <div className="modal__foot">
          <button type="button" className="btn btn--primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
