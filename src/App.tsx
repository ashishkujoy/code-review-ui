import { useState, useEffect } from 'react';
import { Sidebar } from './components/Shell';
import { ScreenDashboard } from './screens/Dashboard';
import { ScreenConfigure } from './screens/Configure';
import { ScreenReports } from './screens/Reports';
import { ScreenDetail } from './screens/Detail';
import { Topbar } from './components/Shell';
import { Icons } from './components/Icons';

type Route = 'dashboard' | 'configure' | 'reports' | 'detail' | 'history' | 'settings';
type Theme = 'light' | 'dark';
type Density = 'comfortable' | 'compact';

interface Tweaks {
  theme: Theme;
  density: Density;
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => (localStorage.getItem('cr.route') as Route) || 'dashboard');
  const [tweaks, setTweaks] = useState<Tweaks>({ theme: 'light', density: 'comfortable' });
  const [tweaksOn, setTweaksOn] = useState(false);

  useEffect(() => {
    localStorage.setItem('cr.route', route);
  }, [route]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
    document.documentElement.setAttribute('data-density', tweaks.density);
  }, [tweaks]);

  const applyTweak = <K extends keyof Tweaks>(k: K, v: Tweaks[K]) => {
    setTweaks((prev) => ({ ...prev, [k]: v }));
  };

  return (
    <div className="app">
      <Sidebar route={route} setRoute={setRoute} />
      <main className="main">
        {route === 'dashboard' && (
          <ScreenDashboard onOpen={() => setRoute('reports')} onConfigure={() => setRoute('configure')} />
        )}
        {route === 'configure' && (
          <ScreenConfigure onReports={() => setRoute('reports')} />
        )}
        {route === 'reports' && (
          <ScreenReports onBack={() => setRoute('dashboard')} onDetail={() => setRoute('detail')} />
        )}
        {route === 'detail' && (
          <ScreenDetail onBack={() => setRoute('reports')} />
        )}
        {(route === 'history' || route === 'settings') && (
          <>
            <Topbar crumbs={["Spring '26 · Backend", route]} actions={null} />
            <div className="page">
              <h1 className="page-title">{route === 'history' ? 'Run History' : 'Settings'}</h1>
              <p className="page-subtitle">This screen is not yet implemented.</p>
            </div>
          </>
        )}
      </main>

      {/* Tweaks toggle button */}
      <button
        className="btn btn--sm"
        style={{ position: 'fixed', right: 24, bottom: tweaksOn ? 188 : 24, zIndex: 51, transition: 'bottom 200ms' }}
        onClick={() => setTweaksOn((o) => !o)}
      >
        {Icons.sliders}
      </button>

      {/* Tweaks panel */}
      <div className={'tweaks' + (tweaksOn ? ' is-on' : '')}>
        <h4>
          Tweaks
          <button className="btn btn--ghost btn--sm" onClick={() => setTweaksOn(false)} style={{ padding: 0 }}>
            {Icons.x}
          </button>
        </h4>
        <div className="tweak">
          <span className="tweak__name">Theme</span>
          <div className="tweak__ctl">
            <button className={'tweak__opt' + (tweaks.theme === 'light' ? ' is-on' : '')} onClick={() => applyTweak('theme', 'light')}>
              Light
            </button>
            <button className={'tweak__opt' + (tweaks.theme === 'dark' ? ' is-on' : '')} onClick={() => applyTweak('theme', 'dark')}>
              Dark
            </button>
          </div>
        </div>
        <div className="tweak">
          <span className="tweak__name">Density</span>
          <div className="tweak__ctl">
            <button className={'tweak__opt' + (tweaks.density === 'comfortable' ? ' is-on' : '')} onClick={() => applyTweak('density', 'comfortable')}>
              Comfort
            </button>
            <button className={'tweak__opt' + (tweaks.density === 'compact' ? ' is-on' : '')} onClick={() => applyTweak('density', 'compact')}>
              Compact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
