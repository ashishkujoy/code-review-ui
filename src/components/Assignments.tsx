import { useState, type ReactNode } from "react";
import { ConfigureModal } from "../screens/Configure";
import { Icons } from "./Icons";
import { useAssignments } from "../hooks/useAssignments";

const statusChip = (s: string): ReactNode => {
  switch (s) {
    case 'reviewing': return <span className="chip chip--accent"></span>
    case 'complete': return <>
      <span className="chip chip--good">
        <span className="chip__dot" />Complete</span>
    </>;
    case 'draft': return <>
      <span className="chip">
        <span className="chip__dot" />Draft</span>
    </>;
    case 'scheduled': return <>
      <span className="chip chip--warn">
        <span className="chip__dot" />Scheduled</span>
    </>;
    default: return <span className="chip">{s}</span>;
  }
}

const Status = (props: { name: string; status: string; repo: string; onGear: (e: React.MouseEvent) => void }) => {
  return <div className="card__head">
    <div>
      <div className="card__title">{props.name}</div>
      <div className="card__repo">
        {Icons.git}
        {props.repo}
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {statusChip(props.status)}
      <button
        className="btn btn--ghost btn--icon card__gear"
        onClick={props.onGear}
        aria-label="Configure review"
        title="Configure review"
      >
        {Icons.settings}
      </button>
    </div>
  </div>
}

const formatNumber = (n: number) => Math.round(n * 100) / 100;

const Progress = (props: { completedRatio: number }) => {
  return <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
    <div className="bar" style={{ maxWidth: '100%' }}>
      <div className="bar__fill" style={{ width: `${formatNumber(props.completedRatio * 100)}%` }} />
    </div>
    <span className="mono" style={{ fontSize: 12, color: 'var(--ink-3)' }}>
      {formatNumber(props.completedRatio)}
    </span>
  </div>
}

const Meta = (props: {
  language: string;
  dueDate: string;
  avgScore: number | null
}) => {
  return <div className="card__meta">
    <div>
      <div className="card__meta-k">Lang</div>
      <div className="card__meta-v">{props.language}</div>
    </div>
    <div>
      <div className="card__meta-k">Due</div>
      <div className="card__meta-v">{props.dueDate}</div>
    </div>
    <div>
      <div className="card__meta-k">Avg</div>
      <div className="card__meta-v">{props.avgScore ?? '—'}</div>
    </div>
  </div>
}

const Assignments = (props: { cohortId: string; onOpen: () => void }) => {
  const { assignments } = useAssignments(props.cohortId);
  const [configuringId, setConfiguringId] = useState<string | null>(null);

  return <>
    <div className="card-grid">
      {assignments.map((a) => (
        <div key={a.id} className="card" onClick={props.onOpen}>
          <Status
            name={a.name}
            status={a.status}
            repo={a.repo}
            onGear={(e) => { e.stopPropagation(); setConfiguringId(a.id); }}
          />
          <Progress completedRatio={a.submitted / a.total} />
          <Meta language={a.language} dueDate={a.dueDate} avgScore={a.avgScore} />
        </div>
      ))}
    </div>
    {configuringId !== null && (
      <ConfigureModal
        cohortId={props.cohortId}
        assignmentId={configuringId}
        onClose={() => setConfiguringId(null)}
      />
    )}
  </>
}

export default Assignments;