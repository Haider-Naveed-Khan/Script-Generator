const TONE_OPTIONS = ['Dramatic', 'Neutral', 'Uplifting'];
const LENGTH_OPTIONS = ['1 min', '3 min', '5 min', '10 min'];

export default function ScriptForm({ values, isLoading, error, onChange, onSubmit }) {
  function handleInputChange(event) {
    const { name, value } = event.target;
    onChange((current) => ({
      ...current,
      [name]: value,
    }));
  }

  return (
    <section className="panel">
      <form className="form" onSubmit={onSubmit}>
        <div className="field">
          <label className="label" htmlFor="idea">
            Content idea
          </label>
          <textarea
            id="idea"
            name="idea"
            className="textarea"
            placeholder="Example: The rise and fall of Cleopatra"
            value={values.idea}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid-two">
          <div className="field">
            <label className="label" htmlFor="tone">
              Tone
            </label>
            <select
              id="tone"
              name="tone"
              className="select"
              value={values.tone}
              onChange={handleInputChange}
            >
              {TONE_OPTIONS.map((tone) => (
                <option key={tone} value={tone}>
                  {tone}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label" htmlFor="length">
              Video length
            </label>
            <select
              id="length"
              name="length"
              className="select"
              value={values.length}
              onChange={handleInputChange}
            >
              {LENGTH_OPTIONS.map((length) => (
                <option key={length} value={length}>
                  {length}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error ? <p className="error">{error}</p> : null}

        <button className="button" type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate script'}
        </button>
      </form>
    </section>
  );
}
