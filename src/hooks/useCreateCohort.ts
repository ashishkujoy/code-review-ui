import { useState } from 'react';
import { createCohort, addCohortIntern, type Cohort } from '../api';

type InternInput = { name: string; githubHandle: string };

export const useCreateCohort = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    name: string,
    githubOrganization: string,
    startDate: string,
    interns: InternInput[],
    onCreated: (cohort: Cohort) => void,
  ) => {
    setSubmitting(true);
    setError(null);
    try {
      const cohort = await createCohort({ name, githubOrganization, startDate });
      const created: Cohort = { ...cohort, name: cohort.name ?? name, startDate: cohort.startDate ?? startDate };
      if (interns.length > 0) {
        await Promise.allSettled(interns.map(i => addCohortIntern(created.id, i)));
      }
      onCreated(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create cohort');
      setSubmitting(false);
    }
  };

  return { submitting, error, submit };
};
