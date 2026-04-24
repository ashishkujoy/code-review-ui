import { useEffect, useState, type ReactNode } from "react";
import { Icons } from "./Icons"
import type { Assignment } from "../data";
import { fetchAssignments, updateAssignment } from "../api";

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

export type GlobMode = "inc" | "exc";

export type Globs = {
  inc: string[];
  exc: string[];
}

const updateGlob = (globs: string[], glob: string, updateType: GlobUpdateType) => {
  if (updateType === 'ADD') {
    return [...globs, glob];
  }
  return globs.filter(g => g !== glob);
}

const updateGlobs = (globs: Globs, mode: GlobMode, glob: string, updateType: GlobUpdateType) => {
  if (mode === 'inc') {
    return { inc: updateGlob(globs.inc, glob, updateType), exc: globs.exc }
  }
  return { exc: updateGlob(globs.exc, glob, updateType), inc: globs.inc }
}

type GlobUpdateType = 'ADD' | 'REMOVE';

export const useAssignments = (cohortId: number) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment>([][0]);

  useEffect(() => {
    if (!loaded && cohortId !== -1) {
      fetchAssignments(cohortId)
        .then(assignments => {
          setAssignments(assignments);
          setSelectedAssignment(assignments[0] || null);
        })
        .catch(setError)
        .finally(() => setLoaded(true))
    }

  }, [cohortId, loaded]);


  const updateGlob = (mode: GlobMode, glob: string, updateType: 'ADD' | 'REMOVE') => {
    if (!selectedAssignment) return;
    const updatedGlobs = updateGlobs(selectedAssignment.globs, mode, glob, updateType);
    updateAssignmentState({ ...selectedAssignment, globs: updatedGlobs });
  }

  const updatePrompt = (prompt: string) => {
    if (!selectedAssignment) return;
    updateAssignmentState({ ...selectedAssignment, prompt });
  }

  const updateModel = (model: string) => {
    if (!selectedAssignment) return;
    updateAssignmentState({ ...selectedAssignment, model });
  }

  const updateAssignmentState = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setAssignments(assignments.map(a => a.id === selectedAssignment.id ? assignment : a));
    updateAssignment(cohortId, assignment);
  }

  return {
    assignments,
    loaded,
    error,
    selectedAssignment,
    updatePrompt,
    updateGlob,
    updateModel,
    setSelectedAssignment,
  }
}

const Status = (props: { name: string; status: string; repo: string }) => {
  return <div className="card__head">
    <div>
      <div className="card__title">{props.name}</div>
      <div className="card__repo">
        {Icons.git}
        {props.repo}
      </div>
    </div>
    {statusChip(props.status)}
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

const Assignments = (props: { cohortId: number; onOpen: () => void }) => {
  const { assignments } = useAssignments(props.cohortId);
  return <div className="card-grid">
    {assignments.map((a) => (
      <div key={a.id} className="card" onClick={props.onOpen}>
        <Status name={a.name} status={a.status} repo={a.repo} />
        <Progress completedRatio={a.submitted / a.total} />
        <Meta language={a.language} dueDate={a.dueDate} avgScore={a.avgScore} />
      </div>
    ))}
  </div>
}

export default Assignments;