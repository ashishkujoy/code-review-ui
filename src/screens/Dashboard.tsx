import { useState } from 'react';
import type { Cohort } from '../api';
import Assignments from '../components/Assignments';
import { CreateAssignmentModal } from '../components/CreateAssignmentModal';
import { Icons } from '../components/Icons';
import { Topbar } from '../components/Shell';
import { ASSIGNMENTS } from '../data';


interface Props {
  cohort: Cohort;
  onOpen: () => void;
}

export function ScreenDashboard({ onOpen, cohort }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = () => {
    setModalOpen(false);
    setRefreshKey((k) => k + 1);
  };

  return (
    <>
      <Topbar
        crumbs={[cohort.name, 'Assignments']}
        actions={
          <>
            <button className="btn">
              {Icons.download}Export
            </button>
            <button className="btn btn--primary" onClick={() => setModalOpen(true)}>
              {Icons.plus}New Assignment
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

        <Assignments key={refreshKey} cohortId={cohort.id} onOpen={onOpen}/>
      </div>

      {modalOpen && (
        <CreateAssignmentModal
          cohortId={cohort.id}
          onClose={() => setModalOpen(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  );
}
