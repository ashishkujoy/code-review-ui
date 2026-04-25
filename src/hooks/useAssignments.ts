import { useEffect, useState } from "react";
import { fetchAssignments, updateAssignment } from "../api";
import type { Assignment } from "../data";

export type GlobMode = "inc" | "exc";

export type Globs = {
  inc: string[];
  exc: string[];
};

const updateGlob = (
  globs: string[],
  glob: string,
  updateType: GlobUpdateType,
) => {
  if (updateType === "ADD") {
    return [...globs, glob];
  }
  return globs.filter((g) => g !== glob);
};

const updateGlobs = (
  globs: Globs,
  mode: GlobMode,
  glob: string,
  updateType: GlobUpdateType,
) => {
  if (mode === "inc") {
    return { inc: updateGlob(globs.inc, glob, updateType), exc: globs.exc };
  }
  return { exc: updateGlob(globs.exc, glob, updateType), inc: globs.inc };
};

type GlobUpdateType = "ADD" | "REMOVE";

export const useAssignments = (cohortId: number, initialAssignmentId?: string) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment>(
    [][0],
  );

  useEffect(() => {
    if (!loaded && cohortId !== -1) {
      fetchAssignments(cohortId)
        .then((assignments) => {
          setAssignments(assignments);
          const initial = initialAssignmentId
            ? (assignments.find((a) => a.id === initialAssignmentId) ?? assignments[0])
            : assignments[0];
          setSelectedAssignment(initial || null);
        })
        .catch(setError)
        .finally(() => setLoaded(true));
    }
  }, [cohortId, loaded]);

  const updateGlob = (
    mode: GlobMode,
    glob: string,
    updateType: "ADD" | "REMOVE",
  ) => {
    if (!selectedAssignment) return;
    const updatedGlobs = updateGlobs(
      selectedAssignment.globs,
      mode,
      glob,
      updateType,
    );
    updateAssignmentState({ ...selectedAssignment, globs: updatedGlobs });
  };

  const updatePrompt = (prompt: string) => {
    if (!selectedAssignment) return;
    updateAssignmentState({ ...selectedAssignment, prompt });
  };

  const updateModel = (model: string) => {
    if (!selectedAssignment) return;
    updateAssignmentState({ ...selectedAssignment, model });
  };

  const updateAssignmentState = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setAssignments(
      assignments.map((a) => a.id === selectedAssignment.id ? assignment : a),
    );
    updateAssignment(cohortId, assignment);
  };

  return {
    assignments,
    loaded,
    error,
    selectedAssignment,
    updatePrompt,
    updateGlob,
    updateModel,
    setSelectedAssignment,
  };
};
