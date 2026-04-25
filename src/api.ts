import type { Assignment } from "./data";

const BASE_URL = '/api';

export type Cohort = { id: string; name: string; startDate?: string };

export async function fetchCohorts(): Promise<Cohort[]> {
  const res = await fetch(`${BASE_URL}/cohorts`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function createCohort(data: {
  name: string;
  githubOrganization: string;
  startDate: string;
}): Promise<Cohort> {
  const res = await fetch(`${BASE_URL}/cohorts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export const fetchAssignments = async (
  cohortId: string,
): Promise<Assignment[]> => {
  const res = await fetch(`${BASE_URL}/cohorts/${cohortId}/assignments`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
};

export const createAssignment = async (
  cohortId: string,
  data: {
    name: string;
    repo: string;
    prompt?: string;
    model?: string;
    globs?: { inc: string[]; exc: string[] };
  },
): Promise<Assignment> => {
  const res = await fetch(`${BASE_URL}/cohorts/${cohortId}/assignments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
};

export const updateAssignment = async (
  cohortId: string,
  assignment: Assignment,
) => {
  const res = await fetch(`${BASE_URL}/cohorts/${cohortId}/assignments/${assignment.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assignment),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
};
