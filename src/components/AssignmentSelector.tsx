import type { Dispatch, SetStateAction } from "react";
import type { Assignment } from "../data";
import { Icons } from "./Icons";

type AssignmentDropdownProps = {
  assignments: Assignment[];
  openDD: boolean;
  setOpenDD: Dispatch<SetStateAction<boolean>>;
  assignment: Assignment;
  setAssignment: Dispatch<SetStateAction<Assignment>>;
}

const AssignmentDropdown = ({ openDD, setOpenDD, assignments, assignment, setAssignment }: AssignmentDropdownProps) => {
  return <div className="field">
    <label className="field__label">Assignment</label>
    <div className="dropdown">
      <button
        className="input"
        style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        onClick={() => setOpenDD((o) => !o)}
      >
        <span>
          <strong style={{ fontWeight: 550 }}>{assignment.name}</strong>
          <span className="muted" style={{ marginLeft: 10, fontFamily: 'var(--mono)', fontSize: 12 }}>
            {assignment.repo}
          </span>
        </span>
        {Icons.chevronDown}
      </button>
      {openDD && (
        <div className="dropdown__menu">
          {assignments.map((a) => (
            <div
              key={a.id}
              className={'dropdown__item' + (a.id === assignment.id ? ' is-on' : '')}
              onClick={() => {
                setAssignment(a);
                setOpenDD(false);
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>{a.name}</div>
                <div className="muted" style={{ fontFamily: 'var(--mono)', fontSize: 11 }}>
                  {a.repo}
                </div>
              </div>
              <div className="muted" style={{ fontSize: 11, fontFamily: 'var(--mono)' }}>
                {a.submitted}/{a.total}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <div className="field__hint">
      Pulled from GitHub Classroom · {assignment.submitted} of {assignment.total} repos have submissions
    </div>
  </div>
}

export default AssignmentDropdown;
