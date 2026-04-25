import { useEffect, useState } from 'react';
import { useAssignments } from '../hooks/useAssignments';
import { Button } from '../components/Button';
import { Icons } from '../components/Icons';

type GlobMode = 'inc' | 'exc';

const GlobRow = ({ type, glob, onClick }: { type: string; glob: string; onClick: () => void }) => (
  <div className="glob">
    <span className={`glob__mode glob__mode--${type}`}>{type === 'inc' ? 'INC' : 'EXC'}</span>
    <span className="glob__pattern">{glob}</span>
    <button type="button" className="glob__rm" onClick={onClick}>{Icons.x}</button>
  </div>
);

const GlobList = ({ includes, excludes, removeGlob }: {
  includes: string[];
  excludes: string[];
  removeGlob: (m: GlobMode, i: number) => void;
}) => (
  <div className="glob-list">
    {includes.map((g, i) => (
      <GlobRow key={'i' + i} type="inc" glob={g} onClick={() => removeGlob('inc', i)} />
    ))}
    {excludes.map((g, i) => (
      <GlobRow key={'e' + i} type="exc" glob={g} onClick={() => removeGlob('exc', i)} />
    ))}
  </div>
);

const GlobModes = ({ mode, setMode }: { mode: GlobMode; setMode: (m: GlobMode) => void }) => (
  <div className="seg">
    <button type="button" className={mode === 'inc' ? 'is-on' : ''} onClick={() => setMode('inc')}>Include</button>
    <button type="button" className={mode === 'exc' ? 'is-on' : ''} onClick={() => setMode('exc')}>Exclude</button>
  </div>
);

const GlobInput = ({ onSubmit }: { onSubmit: (g: string) => void }) => {
  const [glob, setGlob] = useState('');
  const submit = () => {
    const v = glob.trim();
    if (!v) return;
    onSubmit(v);
    setGlob('');
  };
  return (
    <>
      <input
        className="input"
        placeholder="e.g. src/**/*.ts"
        value={glob}
        onChange={(e) => setGlob(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); submit(); } }}
      />
      <button type="button" className="btn" onClick={submit}>Add</button>
    </>
  );
};

export const GlobSection = ({ includes, excludes, removeGlob, addGlob }: {
  includes: string[];
  excludes: string[];
  removeGlob: (m: GlobMode, i: number) => void;
  addGlob: (m: GlobMode, glob: string) => void;
}) => {
  const [globMode, setGlobMode] = useState<GlobMode>('inc');
  return (
    <div className="field">
      <label className="field__label">Files to review</label>
      <div className="field__hint" style={{ marginBottom: 10 }}>
        Glob patterns. Include rules narrow to files that should be reviewed; exclude rules skip generated or vendor code.
      </div>
      <GlobList includes={includes} excludes={excludes} removeGlob={removeGlob} />
      <div className="glob-add">
        <GlobModes mode={globMode} setMode={setGlobMode} />
        <GlobInput onSubmit={(g) => addGlob(globMode, g)} />
      </div>
    </div>
  );
};

const PromptSection = ({ prompt, setPrompt, model, setModel, availableModels }: {
  prompt: string;
  setPrompt: (p: string) => void;
  model: string;
  setModel: (m: string) => void;
  availableModels: string[];
}) => {
  const [draft, setDraft] = useState(prompt);
  const dirty = draft !== prompt;

  useEffect(() => { setDraft(prompt); }, [prompt]);

  return (
    <>
      <div className="field">
        <label className="field__label">Review Prompt</label>
        <div className="field__hint" style={{ marginBottom: 8 }}>
          Instructions for the AI reviewer. Be specific about severity, format, and tone.
        </div>
        <textarea
          className="textarea"
          rows={10}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
          <Button variant="primary" disabled={!dirty} onClick={() => setPrompt(draft)}>
            Save Prompt
          </Button>
        </div>
      </div>
      <div className="field">
        <label className="field__label">Model</label>
        <select className="select" value={model} onChange={(e) => setModel(e.target.value)}>
          {availableModels.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
    </>
  );
};

interface ConfigureModalProps {
  cohortId: number;
  assignmentId: string;
  onClose: () => void;
}

export function ConfigureModal({ cohortId, assignmentId, onClose }: ConfigureModalProps) {
  const assignments = useAssignments(cohortId, assignmentId);
  const [running, setRunning] = useState(false);

  const runReview = () => {
    if (running) return;
    setRunning(true);
    const tick = (i: number) => {
      if (i >= 6) { setTimeout(() => setRunning(false), 400); return; }
      setTimeout(() => tick(i + 1), 600);
    };
    setTimeout(() => tick(0), 500);
  };

  const a = assignments.selectedAssignment;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal__head">
          <div>
            <h2 className="modal__title">Configure Review</h2>
            {a && <div className="modal__subtitle">{a.name}</div>}
          </div>
          <button className="btn btn--ghost btn--icon" onClick={onClose} aria-label="Close">
            {Icons.x}
          </button>
        </div>

        <div className="modal__body">
          {assignments.loaded && a ? (
            <>
              <GlobSection
                includes={a.globs.inc}
                excludes={a.globs.exc}
                removeGlob={(mode, index) =>
                  assignments.updateGlob(mode, a.globs[mode][index], 'REMOVE')
                }
                addGlob={(mode, glob) => assignments.updateGlob(mode, glob, 'ADD')}
              />
              <PromptSection
                prompt={a.prompt}
                setPrompt={assignments.updatePrompt}
                model={a.model}
                setModel={assignments.updateModel}
                availableModels={['claude-sonnet-4-5', 'claude-opus-4', 'claude-haiku-4-5']}
              />
            </>
          ) : (
            <div style={{ padding: '24px 0', color: 'var(--ink-4)', textAlign: 'center' }}>Loading…</div>
          )}
        </div>

        <div className="modal__foot">
          <button className="btn" onClick={onClose}>Close</button>
          <button className="btn btn--primary" onClick={runReview} disabled={running}>
            {running ? <><span className="queue-spinner" />Running…</> : <>{Icons.play}Run Review</>}
          </button>
        </div>
      </div>
    </div>
  );
}
