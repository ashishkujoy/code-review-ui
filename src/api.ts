const BASE_URL = import.meta.env.VITE_CODE_REVIEW_SERVER;

export type Cohort = { id: number; name: string };

export async function fetchCohorts(): Promise<Cohort[]> {
  const res = await fetch(`${BASE_URL}/cohorts`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}
