import { type ReactNode } from 'react';
import { Cohort, type CohortProps } from './Cohort';
import { Icons } from './Icons';

type Route = 'dashboard' | 'configure' | 'reports' | 'detail' | 'history' | 'settings';

const Brand = () => {
  return <div className="brand">
    <div className="brand__mark">/*</div>
    <div>
      <div className="brand__name">Code Review</div>
    </div>
    <div className="brand__tag">v0.9</div>
  </div>
}

type NavRouteItemData = {
  id: Route;
  label: string;
  icon: ReactNode;
  count?: number;
} 

const Workspace = ({ route, setRoute }: SidebarProps) => {
  const nav: NavRouteItemData[] = [
    { id: 'dashboard', label: 'Assignments', icon: Icons.grid, count: 6 },
    { id: 'configure', label: 'Configure Review', icon: Icons.sparkle },
    { id: 'reports', label: 'Reports', icon: Icons.report, count: 54 },
    { id: 'history', label: 'Run History', icon: Icons.history },
    { id: 'settings', label: 'Settings', icon: Icons.settings },
  ];

  return <div>
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
}

const getAvatar = (name: string) => name.split(' ')
  .map(part => part[0].toUpperCase())
  .join('');

const LoggedInUserSideFoot = (props: { name: string }) => {
  return <div className="side__foot">
    <div className="avatar">{getAvatar(props.name)}</div>
    <div className="side__foot-meta">
      <div className="side__foot-name">{props.name}</div>
      <div className="side__foot-org">Mentor · Acme Labs</div>
    </div>
  </div>
}

type SidebarProps = {
  route: Route;
  setRoute: (r: Route) => void;
  cohort: CohortProps;
}

export const Sidebar = ({ route, setRoute, cohort }: SidebarProps) => {
  return (
    <aside className="side">
      <Brand />
      <Workspace route={route} setRoute={setRoute} cohort={cohort}/>
      <Cohort {...cohort} />
      <LoggedInUserSideFoot name={'Ashish Kumar'} />
    </aside>
  );
}

type TopbarProps = {
  crumbs: string[];
  actions?: ReactNode;
}

export const Topbar = ({ crumbs, actions }: TopbarProps) => {
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
