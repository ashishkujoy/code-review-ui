import { useEffect, useState } from 'react';
import { useCohorts } from './hooks/useCohorts';
import { Sidebar, Topbar } from './components/Shell';
import { TwicksSection, type Tweaks } from './components/TweaksPanel';
import { ScreenDashboard } from './screens/Dashboard';
import { ScreenDetail } from './screens/Detail';
import { ScreenReports } from './screens/Reports';

type Route = 'dashboard' | 'reports' | 'detail' | 'history' | 'settings';


export default function App() {
  const validRoutes: Route[] = ['dashboard', 'reports', 'detail', 'history', 'settings'];
  const [route, setRoute] = useState<Route>(() => {
    const stored = localStorage.getItem('cr.route') as Route;
    return validRoutes.includes(stored) ? stored : 'dashboard';
  });
  const [tweaks, setTweaks] = useState<Tweaks>({ theme: 'light', density: 'comfortable' });
  const [tweaksOn, setTweaksOn] = useState(false);

  const cohortsState = useCohorts();

  useEffect(() => {
    localStorage.setItem('cr.route', route);
  }, [route]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
    document.documentElement.setAttribute('data-density', tweaks.density);
  }, [tweaks]);

  return (
    <div className="app">
      <Sidebar route={route} setRoute={setRoute} cohort={cohortsState} />
      <main className="main">
        {route === 'dashboard' && (
          <ScreenDashboard
            onOpen={() => setRoute('reports')}
            cohort={cohortsState.selectedCohort || { id: "", name: "loading..." }}
          />
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

      <TwicksSection
        tweaksOn={tweaksOn}
        tweaks={tweaks}
        setTweaksOn={setTweaksOn}
        applyTweak={(k, v) => setTweaks((prev) => ({ ...prev, [k]: v }))}
      />
    </div>
  );
}
