import { useState } from 'react';
import { INTERNS, FINDINGS_SAMPLE, DEFAULT_PROMPT } from '../data';
import { Icons } from '../components/Icons';
import { Topbar } from '../components/Shell';

interface Props {
  onBack: () => void;
}

export function ScreenDetail({ onBack }: Props) {
  const cur = INTERNS[2];
  const [tab, setTab] = useState<'findings' | 'summary' | 'files' | 'prompt'>('findings');
  const initials = cur.name.split(' ').map((n) => n[0]).slice(0, 2).join('');

  const score = cur.score;
  const gradeLabel = score >= 80 ? 'B' : score >= 70 ? 'C' : 'D';

  const scoreCats = [
    { k: 'Correctness', v: 82 },
    { k: 'Code Quality', v: 88 },
    { k: 'Testing', v: 71 },
    { k: 'Security', v: 91 },
  ];

  const files = [
    ['src/limiter/bucket.ts', 112, '1 critical · 1 minor', 64],
    ['src/limiter/queue.ts', 58, '1 major', 72],
    ['src/store/redis.ts', 94, '1 major', 78],
    ['src/index.ts', 41, '1 minor', 88],
    ['tests/limiter.test.ts', 187, '1 minor', 84],
    ['src/errors.ts', 22, '—', 95],
  ] as const;

  return (
    <>
      <Topbar
        crumbs={["Spring '26 · Backend", 'Week 4', 'Reports', cur.name]}
        actions={
          <>
            <button className="btn btn--sm" onClick={onBack}>← Back to list</button>
            <button className="btn btn--sm">{Icons.download}Export</button>
            <button className="btn btn--sm btn--primary">{Icons.check}Approve Review</button>
          </>
        }
      />

      <div className="page" style={{ maxWidth: 1100 }}>
        <div className="page-head" style={{ alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
            <div className="avatar" style={{ width: 64, height: 64, fontSize: 22, borderRadius: 12 }}>
              {initials}
            </div>
            <div>
              <div className="detail__id">
                {cur.handle} · PR #{cur.pr} · {cur.commits} commits · submitted {cur.submittedAt}
              </div>
              <h1 className="page-title" style={{ fontSize: 30, margin: '2px 0' }}>{cur.name}</h1>
              <p className="page-subtitle" style={{ fontSize: 13, marginTop: 2 }}>
                Week 4 — Rate-Limited API Client · cohort-s26/week-04-ratelimiter · ts
              </p>
            </div>
          </div>
          <div className="score-block">
            <div className="score-block__score">{score}</div>
            <div>
              <div className="score-block__grade">{gradeLabel}</div>
              <div className="muted" style={{ fontSize: 11.5, marginTop: 6, fontFamily: 'var(--mono)' }}>
                Rank 3 / 54
              </div>
            </div>
          </div>
        </div>

        <div className="scorecats">
          {scoreCats.map((s, i) => (
            <div key={i} className="scorecat">
              <div className="scorecat__k">{s.k}</div>
              <div className="scorecat__v">{s.v}</div>
              <div className={'bar ' + (s.v >= 80 ? 'bar--good' : s.v >= 65 ? 'bar--warn' : 'bar--bad')} style={{ maxWidth: '100%' }}>
                <div className="bar__fill" style={{ width: `${s.v}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="tabs" style={{ marginTop: 24 }}>
          <button className={'tab' + (tab === 'findings' ? ' is-on' : '')} onClick={() => setTab('findings')}>Findings · 7</button>
          <button className={'tab' + (tab === 'summary' ? ' is-on' : '')} onClick={() => setTab('summary')}>Summary</button>
          <button className={'tab' + (tab === 'files' ? ' is-on' : '')} onClick={() => setTab('files')}>Files · 12</button>
          <button className={'tab' + (tab === 'prompt' ? ' is-on' : '')} onClick={() => setTab('prompt')}>Prompt & Run</button>
        </div>

        {tab === 'findings' && (
          <div>
            {FINDINGS_SAMPLE.map((f) => (
              <div key={f.id} className="finding">
                <div className="finding__head">
                  <div>
                    <div className="finding__title">{f.title}</div>
                    <div className="finding__file">{f.file}</div>
                  </div>
                  <span className={'chip ' + (f.severity === 'critical' ? 'chip--bad' : f.severity === 'major' ? 'chip--warn' : '')}>
                    <span className="chip__dot" />{f.severity}
                  </span>
                </div>
                <div className="finding__body">{f.body}</div>
                {f.code && <pre className="code" dangerouslySetInnerHTML={{ __html: f.code }} />}
              </div>
            ))}
          </div>
        )}

        {tab === 'summary' && (
          <div className="finding">
            <div className="finding__body" style={{ fontFamily: 'var(--serif)', fontSize: 16, lineHeight: 1.65 }}>
              Overall a thoughtful submission. The token bucket implementation is close, but a race condition in{' '}
              <span className="mono">refill()</span> breaks the rate guarantee under concurrency — this is the only
              critical issue and it's fixable in a few lines. The code is otherwise well-organized: clear module
              boundaries, reasonable naming, and a public API that would benefit from typed options. Testing is the
              weakest area — coverage is fine but assertions rely on exact timing, which will flake on CI. Recommend
              merging after the race fix and the unbounded queue cap.
            </div>
          </div>
        )}

        {tab === 'files' && (
          <table className="tbl">
            <thead>
              <tr>
                <th>File</th>
                <th>Lines</th>
                <th>Findings</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {files.map(([f, l, fn, s], i) => (
                <tr key={i}>
                  <td className="mono">{f}</td>
                  <td className="mono muted">{l}</td>
                  <td>{fn}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span className="mono">{s}</span>
                      <div className={'bar ' + (s >= 80 ? 'bar--good' : s >= 65 ? 'bar--warn' : 'bar--bad')}>
                        <div className="bar__fill" style={{ width: `${s}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'prompt' && (
          <div className="finding">
            <div className="finding__title" style={{ marginBottom: 8 }}>Prompt used for this run</div>
            <pre className="code" style={{ whiteSpace: 'pre-wrap' }}>{DEFAULT_PROMPT}</pre>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 16 }}>
              <div>
                <div className="muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Model</div>
                <div className="mono">claude-sonnet-4.5</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tokens</div>
                <div className="mono">18,412 in · 2,104 out</div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Duration</div>
                <div className="mono">{cur.time}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
