import { AVAILABLE_MODELS, useAssignmentForm } from '../hooks/useAssignmentForm';
import { GlobSection } from '../screens/Configure';
import { Icons } from './Icons';

const ModalHeader = ({ onClose }: { onClose: () => void; }) => {
  return <div className="modal__head">
    <h2 className="modal__title">New Assignment</h2>
    <button className="btn btn--ghost btn--icon" onClick={onClose} aria-label="Close">
      {Icons.x}
    </button>
  </div>
}

type StringSetter = (s: string) => void;

const AssignmentNameInput = ({ name, setName }: { name: string; setName: StringSetter }) => {
  return <div className="field">
    <label className="field__label" htmlFor="asgn-name">Assignment name</label>
    <input
      id="asgn-name"
      className="input"
      placeholder="Week 6 — Distributed Cache"
      value={name}
      onChange={(e) => setName(e.target.value)}
      autoFocus
    />
  </div>
}

const RepoNameInput = ({ githubRepo, setGithubRepo }: { githubRepo: string; setGithubRepo: StringSetter }) => {
  return <div className="field">
    <label className="field__label" htmlFor="asgn-repo">GitHub repository name</label>
    <input
      id="asgn-repo"
      className="input"
      placeholder="cohort-s26/week-06-cache"
      value={githubRepo}
      onChange={(e) => setGithubRepo(e.target.value)}
    />
    <div className="field__hint">The GitHub Classroom repository slug for this assignment.</div>
  </div>
}

const Prompt = ({ prompt, setPrompt }: { prompt: string; setPrompt: (p: string) => void; }) => {
  return <div className="field">
    <label className="field__label" htmlFor="asgn-prompt">Review Prompt</label>
    <div className="field__hint" style={{ marginBottom: 8 }}>
      Instructions for the AI reviewer. Be specific about severity, format, and tone.
    </div>
    <textarea
      id="asgn-prompt"
      className="textarea"
      rows={10}
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
    />
  </div>
}

const ModelSelector = ({ model, setModel, availableModels }: { model: string; setModel: (m: string) => void; availableModels: string[] }) => {
  return <div className="field">
    <label className="field__label" htmlFor="asgn-model">Model</label>
    <select
      id="asgn-model"
      className="select"
      value={model}
      onChange={(e) => setModel(e.target.value)}
    >
      {availableModels.map((m) => <option key={m} value={m}>{m}</option>)}
    </select>
  </div>
}

type FooterProps = {
  submitting: boolean;
  valid: boolean;
  onClose: () => void;
}

const ModalFooter = ({ submitting, valid, onClose }: FooterProps) => {
  return <div className="modal__foot">
    <button type="button" className="btn" onClick={onClose}>Cancel</button>
    <button type="submit" className="btn btn--primary" disabled={!valid || submitting}>
      {submitting ? 'Creating…' : 'Create Assignment'}
    </button>
  </div>
}

interface Props {
  cohortId: string;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateAssignmentModal({ cohortId, onClose, onCreated }: Props) {
  const assignmentForm = useAssignmentForm(cohortId);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    assignmentForm.submit(onCreated);
  };

  const valid = assignmentForm.name.trim().length > 0 && assignmentForm.githubName.trim().length > 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>

        <ModalHeader onClose={onClose} />
        <form onSubmit={handleSubmit} style={{ display: 'contents' }}>
          <div className="modal__body">
            <div className="modal__section-label">Basic Info</div>
            <AssignmentNameInput name={assignmentForm.name} setName={assignmentForm.setName} />
            <RepoNameInput githubRepo={assignmentForm.githubName} setGithubRepo={assignmentForm.setGithubName} />
            <div className="modal__section-label" style={{ marginTop: 8 }}>Review Configuration</div>
            <GlobSection
              includes={assignmentForm.globs.inc}
              excludes={assignmentForm.globs.exc}
              addGlob={assignmentForm.addGlob}
              removeGlob={assignmentForm.removeGlob}
            />
            <Prompt prompt={assignmentForm.prompt} setPrompt={assignmentForm.setPrompt} />
            <ModelSelector model={assignmentForm.model} setModel={assignmentForm.setModel} availableModels={AVAILABLE_MODELS} />
          </div>
          {assignmentForm.error && <div className="modal__error">{assignmentForm.error}</div>}
          <ModalFooter submitting={assignmentForm.submitting} valid={valid} onClose={onClose} />
        </form>
      </div>
    </div>
  );
}
