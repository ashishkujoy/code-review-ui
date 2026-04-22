import type { ReactNode } from 'react';
import { ASSIGNMENTS } from '../data';
import { Icons } from '../components/Icons';
import { Topbar } from '../components/Shell';

function statusChip(s: string): ReactNode {
  if (s === 'reviewing') return <span className="chip chip--accent"><span className="chip__dot" />Reviewing</span>;
  if (s === 'complete') return <span className="chip chip--good"><span className="chip__dot" />Complete</span>;
  if (s === 'draft') return <span className="chip"><span className="chip__dot" />Draft</span>;
  if (s === 'scheduled') return <span className="chip chip--warn"><span className="chip__dot" />Scheduled</span>;
  return <span className="chip">{s}</span>;
}

interface Props {
  onOpen: () => void;
  onConfigure: () => void;
}

export function ScreenDashboard({ onOpen, onConfigure }: Props) {
  return (
    <>
      <Topbar
        crumbs={["Spring '26 · Backend", 'Assignments']}
        actions={
          <>
            <button className="btn">
              {Icons.download}Export
            </button>
            <button className="btn btn--primary" onClick={onConfigure}>
              {Icons.plus}New Review
            </button>
          </>
        }
      />
      <div className="page">
        <div className="page-head">
          <div>
            <h1 className="page-title">Assignments</h1>
            <p className="page-subtitle">
              Configure AI code review for each GitHub Classroom assignment and track submissions across your cohort.
            </p>
          </div>
          <div className="page-head__actions">
            <div className="seg">
              <button className="is-on">Active</button>
              <button>Archive</button>
            </div>
          </div>
        </div>

        <div className="kpis">
          <div className="kpi">
            <div className="kpi__label">Active Assignments</div>
            <div className="kpi__value">4</div>
            <div className="kpi__delta up">+1 this week</div>
          </div>
          <div className="kpi">
            <div className="kpi__label">Submissions (7d)</div>
            <div className="kpi__value">169</div>
            <div className="kpi__delta up">↑ 12% vs prior</div>
          </div>
          <div className="kpi">
            <div className="kpi__label">Avg Review Score</div>
            <div className="kpi__value">79.8</div>
            <div className="kpi__delta down">↓ 2.1 pts</div>
          </div>
          <div className="kpi">
            <div className="kpi__label">Review Minutes Saved</div>
            <div className="kpi__value">142h</div>
            <div className="kpi__delta">estimated this cohort</div>
          </div>
        </div>

        <div className="section-head">
          <h2>All Assignments</h2>
          <span className="muted">{ASSIGNMENTS.length} total</span>
        </div>

        <div className="card-grid">
          {ASSIGNMENTS.map((a) => (
            <div key={a.id} className="card" onClick={onOpen}>
              <div className="card__head">
                <div>
                  <div className="card__title">{a.name}</div>
                  <div className="card__repo">
                    {Icons.git}
                    {a.repo}
                  </div>
                </div>
                {statusChip(a.status)}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div className="bar" style={{ maxWidth: '100%' }}>
                  <div className="bar__fill" style={{ width: `${(a.submitted / a.total) * 100}%` }} />
                </div>
                <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>
                  {a.submitted}/{a.total}
                </span>
              </div>
              <div className="card__meta">
                <div>
                  <div className="card__meta-k">Lang</div>
                  <div className="card__meta-v">{a.language}</div>
                </div>
                <div>
                  <div className="card__meta-k">Due</div>
                  <div className="card__meta-v">{a.dueDate}</div>
                </div>
                <div>
                  <div className="card__meta-k">Avg</div>
                  <div className="card__meta-v">{a.avgScore ?? '—'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
