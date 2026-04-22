import { useState, useMemo } from 'react';
import { INTERNS, FINDINGS_SAMPLE } from '../data';
import type { Intern } from '../data';
import { Icons } from '../components/Icons';
import { Topbar } from '../components/Shell';

function scoreChip(s: number) {
  if (s >= 80) return <span className="chip chip--good"><span className="chip__dot" />Pass</span>;
  if (s >= 60) return <span className="chip chip--warn"><span className="chip__dot" />Review</span>;
  return <span className="chip chip--bad"><span className="chip__dot" />Flagged</span>;
}

function grade(s: number) {
  if (s >= 90) return 'A';
  if (s >= 80) return 'B';
  if (s >= 70) return 'C';
  if (s >= 60) return 'D';
  return 'F';
}

interface Props {
  onBack: () => void;
  onDetail: () => void;
}

export function ScreenReports({ onDetail }: Props) {
  const [selected, setSelected] = useState(INTERNS[0].id);
  const [sort, setSort] = useState('score');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list: Intern[] = INTERNS;
    if (filter !== 'all') list = list.filter((i) => i.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((i) => i.name.toLowerCase().includes(q) || i.handle.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      if (sort === 'score') return b.score - a.score;
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'issues') return b.critical * 3 + b.major - (a.critical * 3 + a.major);
      return 0;
    });
  }, [sort, filter, search]);

  const cur = INTERNS.find((i) => i.id === selected) || INTERNS[0];

  const bins = useMemo(() => {
    const b = new Array(10).fill(0);
    INTERNS.forEach((i) => {
      b[Math.min(9, Math.floor(i.score / 10))]++;
    });
    return b;
  }, []);
  const maxBin = Math.max(...bins);
  const curBin = Math.min(9, Math.floor(cur.score / 10));

  const scoreCats = [
    { k: 'Correctness', v: Math.max(0, Math.min(100, cur.score - 4)) },
    { k: 'Code Quality', v: Math.max(0, Math.min(100, cur.score + 2)) },
    { k: 'Testing', v: Math.max(0, Math.min(100, cur.score - 12)) },
    { k: 'Security', v: Math.max(0, Math.min(100, cur.score + 6)) },
  ];

  return (
    <>
      <Topbar
        crumbs={["Spring '26 · Backend", 'Week 4 — Rate-Limited API Client', 'Reports']}
        actions={
          <>
            <button className="btn btn--sm">{Icons.download}Export CSV</button>
            <button className="btn btn--sm">{Icons.download}Export PDF</button>
            <button className="btn btn--sm btn--primary">{Icons.sparkle}Re-run</button>
          </>
        }
      />

      {/* Summary strip */}
      <div style={{ padding: '18px 28px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 32 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>Submissions</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 26, letterSpacing: '-0.02em' }}>
            {INTERNS.length}
            <span className="muted" style={{ fontSize: 14, fontFamily: 'var(--sans)', marginLeft: 6 }}>/ 58</span>
          </div>
        </div>
        <div style={{ width: 1, height: 40, background: 'var(--line)' }} />
        <div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>Avg Score</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 26, letterSpacing: '-0.02em' }}>
            {Math.round(INTERNS.reduce((s, i) => s + i.score, 0) / INTERNS.length)}
          </div>
        </div>
        <div style={{ width: 1, height: 40, background: 'var(--line)' }} />
        <div style={{ flex: 1, maxWidth: 420 }}>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>Score Distribution</div>
          <div className="hist">
            {bins.map((v, i) => (
              <div
                key={i}
                className={'hist__bar' + (i === curBin ? ' is-hi' : '')}
                style={{ height: `${(v / maxBin) * 100}%` }}
                title={`${i * 10}–${i * 10 + 9}: ${v}`}
              />
            ))}
          </div>
          <div className="hist__axis">
            <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
          </div>
        </div>
        <div style={{ width: 1, height: 40, background: 'var(--line)' }} />
        <div style={{ display: 'flex', gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>Critical</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 22, letterSpacing: '-0.02em', color: 'var(--bad)' }}>
              {INTERNS.reduce((s, i) => s + i.critical, 0)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>Major</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 22, letterSpacing: '-0.02em', color: 'var(--warn)' }}>
              {INTERNS.reduce((s, i) => s + i.major, 0)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>Minor</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 22, letterSpacing: '-0.02em', color: 'var(--ink-3)' }}>
              {INTERNS.reduce((s, i) => s + i.minor, 0)}
            </div>
          </div>
        </div>
      </div>

      <div className="split">
        {/* Left: intern list */}
        <div className="split__left">
          <div className="split__filters">
            <div className="search" style={{ minWidth: 0 }}>
              {Icons.search}
              <input placeholder="Filter interns…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="filter-row">
              <div className="seg">
                <button className={filter === 'all' ? 'is-on' : ''} onClick={() => setFilter('all')}>All</button>
                <button className={filter === 'passed' ? 'is-on' : ''} onClick={() => setFilter('passed')}>Pass</button>
                <button className={filter === 'review' ? 'is-on' : ''} onClick={() => setFilter('review')}>Review</button>
                <button className={filter === 'flagged' ? 'is-on' : ''} onClick={() => setFilter('flagged')}>Flag</button>
              </div>
              <div style={{ flex: 1 }} />
              <select
                className="select"
                style={{ width: 'auto', padding: '4px 28px 4px 10px', fontSize: 12 }}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="score">Sort: Score</option>
                <option value="name">Sort: Name</option>
                <option value="issues">Sort: Issues</option>
              </select>
            </div>
          </div>

          {filtered.map((i) => {
            const initials = i.name.split(' ').map((n) => n[0]).slice(0, 2).join('');
            return (
              <div
                key={i.id}
                className={'intern-row' + (i.id === selected ? ' is-active' : '')}
                onClick={() => setSelected(i.id)}
              >
                <div className="avatar">{initials}</div>
                <div>
                  <div className="intern__name">{i.name}</div>
                  <div className="intern__handle">{i.handle} · PR #{i.pr}</div>
                </div>
                <div className="intern__right">
                  <div className="intern__score">{i.score}</div>
                  <div className="intern__issues">
                    {i.critical > 0 && <span style={{ color: 'var(--bad)' }}>●{i.critical} </span>}
                    {i.major > 0 && <span style={{ color: 'var(--warn)' }}>●{i.major} </span>}
                    <span>●{i.minor}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: detail */}
        <div className="detail">
          <div className="detail__head">
            <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
              <div className="avatar" style={{ width: 52, height: 52, fontSize: 18, borderRadius: 10 }}>
                {cur.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <div className="detail__id">{cur.handle} · PR #{cur.pr} · submitted {cur.submittedAt}</div>
                <h2 className="detail__name">{cur.name}</h2>
                <div className="detail__sub">
                  {scoreChip(cur.score)} &nbsp;·&nbsp; {cur.commits} commits &nbsp;·&nbsp; review took {cur.time}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <button className="btn btn--sm">View PR ↗</button>
              <button className="btn btn--sm" onClick={onDetail}>Open full report →</button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 24 }}>
            <div className="score-block">
              <div className="score-block__score">{cur.score}</div>
              <div>
                <div className="score-block__grade">{grade(cur.score)}</div>
                <div className="muted" style={{ fontSize: 11.5, marginTop: 6, fontFamily: 'var(--mono)' }}>
                  Rank {INTERNS.findIndex((x) => x.id === cur.id) + 1} / {INTERNS.length}
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

          <div className="section-head">
            <h2>AI Findings · {cur.critical + cur.major + cur.minor}</h2>
            <span className="muted mono" style={{ fontSize: 11 }}>
              <span style={{ color: 'var(--bad)' }}>●{cur.critical} critical</span>&nbsp;
              <span style={{ color: 'var(--warn)' }}>●{cur.major} major</span>&nbsp;
              <span>●{cur.minor} minor</span>
            </span>
          </div>

          {FINDINGS_SAMPLE.slice(0, cur.score < 65 ? 5 : cur.score < 80 ? 3 : 2).map((f, idx) => (
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
              {f.code && idx === 0 && (
                <pre className="code" dangerouslySetInnerHTML={{ __html: f.code }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
