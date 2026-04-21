'use client';

import { useState } from 'react';
import ScriptForm from '../components/ScriptForm';
import ScriptOutput from '../components/ScriptOutput';

const INITIAL_FORM_VALUES = {
  idea: '',
  tone: 'Neutral',
  length: '3 min',
};

async function requestGeneratedScript(payload) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({ error: 'Invalid response from server' }));

  if (!response.ok) {
    throw new Error(data?.error || 'Failed to generate script');
  }

  return data;
}

export default function HomePage() {
  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [script, setScript] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedIdea = formValues.idea.trim();
    if (!trimmedIdea) {
      setError('Please enter a content idea.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await requestGeneratedScript({
        idea: trimmedIdea,
        tone: formValues.tone,
        length: formValues.length,
      });

      setScript(result?.script || '');
    } catch (requestError) {
      setScript('');
      setError(requestError?.message || 'Could not generate script right now.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page">
      <div className="shell">
        <header className="top">
          <h1 className="brand">Script Generator</h1>
          <p className="subtitle">
            Turn one content idea into a voiceover-ready script shaped by tone and video length.
          </p>
        </header>

        <section className="content">
          <ScriptForm
            values={formValues}
            isLoading={isLoading}
            error={error}
            onChange={setFormValues}
            onSubmit={handleSubmit}
          />

          <ScriptOutput
            script={script}
            isLoading={isLoading}
            tone={formValues.tone}
            length={formValues.length}
          />
        </section>

        <p className="footer">All Rights Reserved to Haider Khan</p>
      </div>
    </main>
  );
}
