import { useState } from 'react';
import { createCohort, type Cohort } from '../api';

export const useCreateCohort = () => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (name: string, githubOrganization: string, startDate: string, onCreated: (cohort: Cohort) => void) => {
    setSubmitting(true);
    setError(null);
    try {
      const cohort = await createCohort({ name, githubOrganization, startDate });
      onCreated({ ...cohort, name: cohort.name ?? name, startDate: cohort.startDate ?? startDate });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create cohort');
      setSubmitting(false);
    }
  };

  return { submitting, error, submit };
};
