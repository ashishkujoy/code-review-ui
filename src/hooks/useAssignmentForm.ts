import { useState } from "react";
import { DEFAULT_PROMPT } from "../data";
import { createAssignment } from "../api";

export const AVAILABLE_MODELS = [
  "claude-sonnet-4-5",
  "claude-opus-4",
  "claude-haiku-4-5",
];

export const useAssignmentForm = (cohortId: string) => {
  const [name, setName] = useState("");
  const [githubName, setGithubName] = useState("");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [model, setModel] = useState(AVAILABLE_MODELS[0]);
  const [globs, setGlobs] = useState<{ inc: string[]; exc: string[] }>({
    inc: [],
    exc: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addGlob = (mode: "inc" | "exc", glob: string) => {
    setGlobs((prev) => ({ ...prev, [mode]: [...prev[mode], glob] }));
  };

  const removeGlob = (mode: "inc" | "exc", index: number) => {
    setGlobs((prev) => ({
      ...prev,
      [mode]: prev[mode].filter((_, i) => i !== index),
    }));
  };

  const submit = async (onSuccess: () => void) => {
    setSubmitting(true);
    setError(null);
    try {
      await createAssignment(cohortId, {
        name: name.trim(),
        repo: githubName.trim(),
        prompt: prompt,
        model: model,
        globs: globs,
      });
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong",
      );
      setSubmitting(false);
    }
  };

  return {
    name,
    setName,
    githubName,
    setGithubName,
    prompt,
    setPrompt,
    model,
    setModel,
    globs,
    addGlob,
    removeGlob,
    submitting,
    error,
    submit,
  };
};
