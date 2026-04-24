import { useState, type Dispatch, type SetStateAction } from 'react';
import type { Cohort } from '../api';
import { useAssignments } from '../components/Assignments';
import AssignmentDropdown from '../components/AssignmentSelector';
import { Icons } from '../components/Icons';
import { Topbar } from '../components/Shell';
import { DEFAULT_PROMPT } from '../data';
import {} from "../api";

interface Props {
  onReports: () => void;
  cohort: Cohort;
}

type RunReviewBtnProps = {
  runReview: () => void;
  running: boolean;
}

const RunReviewBtn = ({ runReview, running }: RunReviewBtnProps) => {
  return <button className="btn btn--primary" onClick={runReview} disabled={running}>
    {running ? (
      <>
        <span className="queue-spinner" />
        Running…
      </>
    ) : (
      <>
        {Icons.play}Run Review
      </>
    )}
  </button>
}

const PageHeader = () => {
  return <div className="page-head">
    <div>
      <h1 className="page-title">Configure Review</h1>
      <p className="page-subtitle">
        Pick the assignment, narrow to the files that matter, and describe what a good review looks like. The AI will run against all submitted repos.
      </p>
    </div>
  </div>
}



type GlobProps = {
  includes: string[];
  excludes: string[];
  removeGlob: (mode: GlobMode, index: number) => void;
  addGlob: (mode: GlobMode, glob: string) => void;
}

const GlobRow = ({ type, glob, onClick }: { type: string, glob: string, onClick: () => void }) => {
  return <div className="glob">
    <span className={`glob__mode glob__mode--${type}`}>{type === "inc" ? "INC" : "EXC"}</span>
    <span className="glob__pattern">{glob}</span>
    <button className="glob__rm" onClick={onClick}>
      {Icons.x}
    </button>
  </div>
}

type GlobMode = "inc" | "exc";

type GlobRowProps = {
  includes: string[];
  excludes: string[];
  removeGlob: (m: GlobMode, i: number) => void
}

const GlobList = ({ includes, excludes, removeGlob }: GlobRowProps) => {
  return <div className="glob-list">
    {includes.map((g, i) => (
      <GlobRow key={'i' + i} type="inc" glob={g} onClick={() => removeGlob("inc", i)} />
    ))}
    {excludes.map((g, i) => (
      <GlobRow key={'i' + i} type="exc" glob={g} onClick={() => removeGlob("exc", i)} />
    ))}
  </div>
}

const GlobModes = ({ mode, setMode }: { mode: GlobMode; setMode: (m: GlobMode) => void; }) => {
  return <div className="seg">
    <button className={mode === 'inc' ? 'is-on' : ''} onClick={() => setMode('inc')}>
      Include
    </button>
    <button className={mode === 'exc' ? 'is-on' : ''} onClick={() => setMode('exc')}>
      Exclude
    </button>
  </div>
}

const GlobInput = ({ onSubmit }: { onSubmit: (g: string) => void; }) => {
  const [glob, setGlob] = useState("");

  const handleAddGlob = () => {
    const newGlob = glob.trim();
    if (!newGlob) return;
    onSubmit(newGlob);
    setGlob("");
  }
  return <>
    <input
      className="input"
      placeholder="e.g. src/**/*.ts"
      value={glob}
      onChange={(e) => setGlob(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleAddGlob()}
    />
    <button className="btn" onClick={handleAddGlob}>
      Add
    </button>
  </>
}

const Glob = ({ includes, removeGlob, excludes, addGlob }: GlobProps) => {
  const [globMode, setGlobMode] = useState<GlobMode>("inc");

  return <div className="field">
    <label className="field__label">Files to review</label>
    <div className="field__hint" style={{ marginBottom: 10 }}>
      Glob patterns. Include rules narrow to files that should be reviewed; exclude rules skip generated or vendor code.
    </div>
    <GlobList includes={includes} excludes={excludes} removeGlob={removeGlob} />
    <div className="glob-add">
      <GlobModes mode={globMode} setMode={setGlobMode} />
      <GlobInput onSubmit={(glob: string) => addGlob(globMode, glob)} />
    </div>
  </div>
}

type PromptProps = {
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  model: string;
  setModel: Dispatch<SetStateAction<string>>;
}

const Prompt = ({ prompt, setPrompt, model, setModel }: PromptProps) => {
  return <>
    <div className="field">
      <label className="field__label">Review Prompt</label>
      <div className="field__hint" style={{ marginBottom: 8 }}>
        Instructions for the AI reviewer. Be specific about severity, format, and tone.
      </div>
      <textarea
        className="textarea"
        rows={14}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <div className="field">
        <label className="field__label">Model</label>
        <select className="select" value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="claude-sonnet-4.5">Sonnet 4.5 · Balanced</option>
          <option value="claude-opus-4">Opus 4 · Deepest</option>
          <option value="claude-haiku-4.5">Haiku 4.5 · Fastest</option>
        </select>
      </div>
    </div>
  </>
}

export function ScreenConfigure({ onReports, cohort }: Props) {
  const assignments = useAssignments(cohort.id);
  const [openDD, setOpenDD] = useState(false);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [model, setModel] = useState('claude-sonnet-4.5');
  const [running, setRunning] = useState(false);


  const runReview = () => {
    if (running) return;
    setRunning(true);
    const names = ['priyaPatel33', 'zaraCohen18', 'kenjiTanaka41', 'noahSilva22', 'meiZhang09', 'lucaRossi14'];

    const tick = (i: number) => {
      if (i >= names.length) {
        setTimeout(() => setRunning(false), 400);
        return;
      }
      setTimeout(() => tick(i + 1), 600);
    };
    setTimeout(() => tick(0), 500);
  };

  return (
    <>
      <Topbar
        crumbs={[cohort.name, 'New Review']}
        actions={
          <>
            <button className="btn">Save Draft</button>
            <RunReviewBtn runReview={runReview} running={running} />
          </>
        }
      />

      <div className="page">
        <PageHeader />
        {assignments.loaded && assignments.selectedAssignment && <div className="config-grid">
          <div>
            <AssignmentDropdown
              openDD={openDD}
              setOpenDD={setOpenDD}
              assignments={assignments.assignments}
              assignment={assignments.selectedAssignment}
              setAssignment={assignments.setSelectedAssignment}
            />
            <Glob
              includes={assignments.selectedAssignment.globs.inc}
              excludes={assignments.selectedAssignment.globs.exc}
              removeGlob={(mode, index) =>
                assignments.updateGlob(mode, assignments.selectedAssignment.globs[mode][index], "REMOVE")
              }
              addGlob={(mode, glob) => assignments.updateGlob(mode, glob, "ADD")}
            />
            <Prompt prompt={prompt} setPrompt={setPrompt} model={model} setModel={setModel} />
          </div>
        </div>}
      </div>
    </>
  );
}
