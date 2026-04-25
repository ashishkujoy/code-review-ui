import { useState, useEffect } from 'react';
import {
  fetchCohortInterns,
  addCohortIntern,
  updateCohortIntern,
  removeCohortIntern,
  updateCohort,
  type CohortIntern,
  type Cohort,
} from '../api';

export const useConfigureCohort = (cohort: Cohort) => {
  const [interns, setInterns] = useState<CohortIntern[]>([]);
  const [loadingInterns, setLoadingInterns] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCohortInterns(cohort.id)
      .then(setInterns)
      .catch(() => setInterns([]))
      .finally(() => setLoadingInterns(false));
  }, [cohort.id]);

  const saveCohortDetails = async (
    name: string,
    githubOrganization: string,
    onUpdated: (c: Cohort) => void,
  ) => {
    setSaving(true);
    setError(null);
    try {
      const updated = await updateCohort(cohort.id, { name, githubOrganization });
      onUpdated({ ...cohort, ...updated, name: updated.name ?? name, githubOrganization: updated.githubOrganization ?? githubOrganization });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const addIntern = async (name: string, githubHandle: string) => {
    setError(null);
    try {
      const intern = await addCohortIntern(cohort.id, { name, githubHandle });
      setInterns(prev => [...prev, intern]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add intern');
    }
  };

  const editIntern = async (internId: string, name: string, githubHandle: string) => {
    setError(null);
    try {
      const updated = await updateCohortIntern(cohort.id, internId, { name, githubHandle });
      setInterns(prev => prev.map(i => i.id === internId ? updated : i));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update intern');
    }
  };

  const deleteIntern = async (internId: string) => {
    setError(null);
    try {
      await removeCohortIntern(cohort.id, internId);
      setInterns(prev => prev.filter(i => i.id !== internId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove intern');
    }
  };

  return { interns, loadingInterns, error, saving, saveCohortDetails, addIntern, editIntern, deleteIntern };
};
