import { useState } from 'react';
import { ASSIGNMENTS, DEFAULT_PROMPT } from '../data';
import { Icons } from '../components/Icons';
import { Topbar } from '../components/Shell';

interface Props {
  onReports: () => void;
}

export function ScreenConfigure({ onReports }: Props) {
  const [assignment, setAssignment] = useState(ASSIGNMENTS[0]);
  const [openDD, setOpenDD] = useState(false);
  const [includes, setIncludes] = useState(['src/**/*.ts', 'src/**/*.tsx', 'tests/**/*.test.ts']);
  const [excludes, setExcludes] = useState(['**/node_modules/**', 'dist/**', '**/*.min.js']);
  const [newGlob, setNewGlob] = useState('');
  const [globMode, setGlobMode] = useState<'inc' | 'exc'>('inc');
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [model, setModel] = useState('claude-sonnet-4.5');
  const [severity, setSeverity] = useState('strict');
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [queueItems, setQueueItems] = useState<{ name: string; done: boolean }[]>([]);

  const addGlob = () => {
    if (!newGlob.trim()) return;
    if (globMode === 'inc') setIncludes([...includes, newGlob.trim()]);
    else setExcludes([...excludes, newGlob.trim()]);
    setNewGlob('');
  };

  const removeGlob = (mode: 'inc' | 'exc', i: number) => {
    if (mode === 'inc') setIncludes(includes.filter((_, idx) => idx !== i));
    else setExcludes(excludes.filter((_, idx) => idx !== i));
  };

  const applyPreset = (key: string) => {
    const P: Record<string, string> = {
      correctness: 'Focus: correctness, edge cases, failure modes. Flag any code path that can throw uncaught, leak, or silently drop data.',
      security: 'Focus: security. Look for injection, auth bypass, secret leaks, unsafe deserialization, SSRF, XSS, timing attacks.',
      performance: 'Focus: performance. Identify O(n²) where O(n) works, unnecessary allocations, blocking I/O in hot paths.',
      style: 'Focus: readability and style. Naming, function length, comment quality, module boundaries.',
    };
    setPrompt((prev) => prev + '\n\n' + P[key]);
  };

  const runReview = () => {
    if (running) return;
    setRunning(true);
    setProgress(0);
    const names = ['priyaPatel33', 'zaraCohen18', 'kenjiTanaka41', 'noahSilva22', 'meiZhang09', 'lucaRossi14'];
    setQueueItems(names.map((n) => ({ name: n, done: false })));

    const tick = (i: number) => {
      if (i >= names.length) {
        setTimeout(() => setRunning(false), 400);
        return;
      }
      setQueueItems((q) => q.map((it, idx) => (idx === i ? { ...it, done: true } : it)));
      setProgress(Math.round(((i + 1) / names.length) * 100));
      setTimeout(() => tick(i + 1), 600);
    };
    setTimeout(() => tick(0), 500);
  };

  const totalInterns = assignment.submitted;

  return (
    <>
      <Topbar
        crumbs={["Spring '26 · Backend", 'New Review']}
        actions={
          <>
            <button className="btn">Save Draft</button>
            <button className="btn btn--primary" onClick={runReview} disabled={running}>
              {running ? (
                <>
                  <span className="queue-spinner" />
                  Running…
                </>
              ) : (
                <>
                  {Icons.play}Run Review
                </>
              )}
            </button>
          </>
        }
      />

      <div className="page">
        <div className="page-head">
          <div>
            <h1 className="page-title">Configure Review</h1>
            <p className="page-subtitle">
              Pick the assignment, narrow to the files that matter, and describe what a good review looks like. The AI will run against all submitted repos.
            </p>
          </div>
        </div>

        <div className="config-grid">
          <div>
            {/* Assignment dropdown */}
            <div className="field">
              <label className="field__label">Assignment</label>
              <div className="dropdown">
                <button
                  className="input"
                  style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onClick={() => setOpenDD((o) => !o)}
                >
                  <span>
                    <strong style={{ fontWeight: 550 }}>{assignment.name}</strong>
                    <span className="muted" style={{ marginLeft: 10, fontFamily: 'var(--mono)', fontSize: 12 }}>
                      {assignment.repo}
                    </span>
                  </span>
                  {Icons.chevronDown}
                </button>
                {openDD && (
                  <div className="dropdown__menu">
                    {ASSIGNMENTS.map((a) => (
                      <div
                        key={a.id}
                        className={'dropdown__item' + (a.id === assignment.id ? ' is-on' : '')}
                        onClick={() => {
                          setAssignment(a);
                          setOpenDD(false);
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 500 }}>{a.name}</div>
                          <div className="muted" style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>
                            {a.repo}
                          </div>
                        </div>
                        <div className="muted" style={{ fontSize: 11, fontFamily: 'var(--mono)' }}>
                          {a.submitted}/{a.total}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="field__hint">
                Pulled from GitHub Classroom · {assignment.submitted} of {assignment.total} repos have submissions
              </div>
            </div>

            {/* Globs */}
            <div className="field">
              <label className="field__label">Files to review</label>
              <div className="field__hint" style={{ marginBottom: 10 }}>
                Glob patterns. Include rules narrow to files that should be reviewed; exclude rules skip generated or vendor code.
              </div>
              <div className="glob-list">
                {includes.map((g, i) => (
                  <div key={'i' + i} className="glob">
                    <span className="glob__mode glob__mode--inc">INC</span>
                    <span className="glob__pattern">{g}</span>
                    <button className="glob__rm" onClick={() => removeGlob('inc', i)}>
                      {Icons.x}
                    </button>
                  </div>
                ))}
                {excludes.map((g, i) => (
                  <div key={'e' + i} className="glob">
                    <span className="glob__mode glob__mode--exc">EXC</span>
                    <span className="glob__pattern">{g}</span>
                    <button className="glob__rm" onClick={() => removeGlob('exc', i)}>
                      {Icons.x}
                    </button>
                  </div>
                ))}
              </div>
              <div className="glob-add">
                <div className="seg">
                  <button className={globMode === 'inc' ? 'is-on' : ''} onClick={() => setGlobMode('inc')}>
                    Include
                  </button>
                  <button className={globMode === 'exc' ? 'is-on' : ''} onClick={() => setGlobMode('exc')}>
                    Exclude
                  </button>
                </div>
                <input
                  className="input"
                  placeholder="e.g. src/**/*.ts"
                  value={newGlob}
                  onChange={(e) => setNewGlob(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addGlob()}
                />
                <button className="btn" onClick={addGlob}>
                  Add
                </button>
              </div>
            </div>

            {/* Prompt */}
            <div className="field">
              <label className="field__label">Review Prompt</label>
              <div className="field__hint" style={{ marginBottom: 8 }}>
                Instructions for the AI reviewer. Be specific about severity, format, and tone.
              </div>
              <textarea
                className="textarea"
                rows={14}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <div className="preset-row">
                  <span className="muted" style={{ fontSize: 12, alignSelf: 'center', marginRight: 4 }}>
                    Append:
                  </span>
                  <button className="preset" onClick={() => applyPreset('correctness')}>
                    + Correctness
                  </button>
                  <button className="preset" onClick={() => applyPreset('security')}>
                    + Security
                  </button>
                  <button className="preset" onClick={() => applyPreset('performance')}>
                    + Performance
                  </button>
                  <button className="preset" onClick={() => applyPreset('style')}>
                    + Style
                  </button>
                </div>
                <span className="muted mono" style={{ fontSize: 11 }}>
                  {prompt.length} chars · ~{Math.round(prompt.length / 4)} tokens
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="field">
                <label className="field__label">Model</label>
                <select className="select" value={model} onChange={(e) => setModel(e.target.value)}>
                  <option value="claude-sonnet-4.5">Sonnet 4.5 · Balanced</option>
                  <option value="claude-opus-4">Opus 4 · Deepest</option>
                  <option value="claude-haiku-4.5">Haiku 4.5 · Fastest</option>
                </select>
              </div>
              <div className="field">
                <label className="field__label">Severity Threshold</label>
                <select className="select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                  <option value="strict">Strict — flag minors</option>
                  <option value="balanced">Balanced — major+</option>
                  <option value="lenient">Lenient — critical only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Aside */}
          <div>
            <div className="aside-card">
              <h3>Run Summary</h3>
              <div className="summary-row"><span>Repositories</span><span>{totalInterns}</span></div>
              <div className="summary-row"><span>Include rules</span><span>{includes.length}</span></div>
              <div className="summary-row"><span>Exclude rules</span><span>{excludes.length}</span></div>
              <div className="summary-row"><span>Est. files / repo</span><span>~18</span></div>
              <div className="summary-row"><span>Est. duration</span><span>~4 min</span></div>
              <div className="summary-row"><span>Est. cost</span><span>$2.40</span></div>
            </div>

            <div className="aside-card">
              <h3>Progress</h3>
              {!running && progress === 0 && (
                <div className="muted" style={{ fontSize: 13, padding: '8px 0' }}>
                  No active run. Click <strong>Run Review</strong> to start.
                </div>
              )}
              {(running || progress > 0) && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                    <div
                      className="ring"
                      style={{
                        background: `conic-gradient(var(--ink) ${progress}%, var(--bg-3) 0)`,
                      }}
                    >
                      <div className="ring__num">{progress}%</div>
                    </div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.6 }}>
                      <div>
                        <strong>{queueItems.filter((q) => q.done).length}</strong>{' '}
                        <span className="muted">of {totalInterns} reviewed</span>
                      </div>
                      <div className="muted">Using {model}</div>
                    </div>
                  </div>
                  <div>
                    {queueItems.map((q, i) => (
                      <div key={i} className="queue-item">
                        {q.done ? (
                          <span style={{ color: 'var(--good)' }}>{Icons.check}</span>
                        ) : (
                          <span className="queue-spinner" />
                        )}
                        <span className="queue-item__name">{q.name}</span>
                        <span className="muted mono" style={{ fontSize: 11 }}>
                          {q.done ? '1.8s' : '…'}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              {!running && progress === 100 && (
                <button
                  className="btn btn--primary"
                  style={{ width: '100%', marginTop: 12, justifyContent: 'center' }}
                  onClick={onReports}
                >
                  View Reports →
                </button>
              )}
            </div>

            <div className="aside-card">
              <h3>Previous Runs</h3>
              <div className="summary-row"><span>Week 3 · v3</span><span>82.1 avg</span></div>
              <div className="summary-row"><span>Week 3 · v2</span><span>79.4 avg</span></div>
              <div className="summary-row"><span>Week 3 · v1</span><span>71.0 avg</span></div>
              <button className="btn btn--ghost btn--sm" style={{ marginTop: 8, padding: '4px 0' }}>
                Re-run with tweaked prompt →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
