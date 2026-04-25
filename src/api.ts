import type { Assignment } from "./data";

const BASE_URL = '/api';

export type Cohort = { id: string; name: string; startDate?: string; githubOrganization?: string };

export type CohortIntern = { id: string; name: string; githubHandle: string };

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

export async function updateCohort(cohortId: string, data: { name?: string; githubOrganization?: string }): Promise<Cohort> {
  const res = await fetch(`${BASE_URL}/cohorts/${cohortId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function fetchCohortInterns(cohortId: string): Promise<CohortIntern[]> {
  const res = await fetch(`${BASE_URL}/cohorts/${cohortId}/interns`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function addCohortIntern(cohortId: string, data: { name: string; githubHandle: string }): Promise<CohortIntern> {
  const res = await fetch(`${BASE_URL}/cohorts/${cohortId}/interns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function updateCohortIntern(cohortId: string, internId: string, data: { name?: string; githubHandle?: string }): Promise<CohortIntern> {
  const res = await fetch(`${BASE_URL}/cohorts/${cohortId}/interns/${internId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

export async function removeCohortIntern(cohortId: string, internId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/cohorts/${cohortId}/interns/${internId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
}

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
