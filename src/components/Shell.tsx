import type { ReactNode } from 'react';
import { Icons } from './Icons';

type Route = 'dashboard' | 'configure' | 'reports' | 'detail' | 'history' | 'settings';

interface SidebarProps {
  route: Route;
  setRoute: (r: Route) => void;
}

export function Sidebar({ route, setRoute }: SidebarProps) {
  const nav: { id: Route; label: string; icon: ReactNode; count?: number }[] = [
    { id: 'dashboard', label: 'Assignments', icon: Icons.grid, count: 6 },
    { id: 'configure', label: 'Configure Review', icon: Icons.sparkle },
    { id: 'reports', label: 'Reports', icon: Icons.report, count: 54 },
    { id: 'history', label: 'Run History', icon: Icons.history },
    { id: 'settings', label: 'Settings', icon: Icons.settings },
  ];

  return (
    <aside className="side">
      <div className="brand">
        <div className="brand__mark">/*</div>
        <div>
          <div className="brand__name">Code Review</div>
        </div>
        <div className="brand__tag">v0.9</div>
      </div>

      <div>
        <div className="side__section-title">Workspace</div>
        <nav className="side__nav">
          {nav.map((item) => (
            <div
              key={item.id}
              className={'side__item' + (route === item.id ? ' is-active' : '')}
              onClick={() => setRoute(item.id)}
            >
              {item.icon}
              <span className="side__label">{item.label}</span>
              {item.count != null && <span className="side__count">{item.count}</span>}
            </div>
          ))}
        </nav>
      </div>

      <div>
        <div className="side__section-title">Cohorts</div>
        <nav className="side__nav">
          <div className="side__item is-active">
            <span className="dot dot--good" />
            <span className="side__label">Spring '26 · Backend</span>
          </div>
          <div className="side__item">
            <span className="dot dot--idle" />
            <span className="side__label">Winter '26 · Frontend</span>
          </div>
          <div className="side__item">
            <span className="dot dot--idle" />
            <span className="side__label">Fall '25 · Alumni</span>
          </div>
        </nav>
      </div>

      <div className="side__foot">
        <div className="avatar">RS</div>
        <div className="side__foot-meta">
          <div className="side__foot-name">Rahul Sen</div>
          <div className="side__foot-org">Mentor · Acme Labs</div>
        </div>
      </div>
    </aside>
  );
}

interface TopbarProps {
  crumbs: string[];
  actions?: ReactNode;
}

export function Topbar({ crumbs, actions }: TopbarProps) {
  return (
    <div className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <span key={i} style={{ display: 'contents' }}>
            {i > 0 && <span className="sep">/</span>}
            {i === crumbs.length - 1 ? <strong>{c}</strong> : <span>{c}</span>}
          </span>
        ))}
      </div>
      <div className="topbar__spacer" />
      <div className="search">
        {Icons.search}
        <input placeholder="Search assignments, interns, findings…" />
        <span className="kbd">⌘K</span>
      </div>
      <div className="topbar__right">{actions}</div>
    </div>
  );
}
