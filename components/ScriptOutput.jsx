import Loader from './Loader';

const HEADING_PATTERN = /^(hook|main content|ending):\s*$/i;

function renderScriptWithHeadings(script) {
  const lines = String(script || '').split(/\r?\n/);

  return lines.map((line, index) => {
    const trimmed = line.trim();
    const match = trimmed.match(HEADING_PATTERN);

    const node = match ? (
      <strong className="script-heading">{trimmed}</strong>
    ) : (
      line
    );

    return (
      <span key={`line-${index}`}>
        {node}
        {index < lines.length - 1 ? '\n' : null}
      </span>
    );
  });
}

export default function ScriptOutput({ script, isLoading, tone, length }) {
  return (
    <section className="panel">
      <div className="result-header">
        <h2 className="result-title">Generated Script</h2>
        <p className="result-meta">
          {tone} {'\u2022'} {length}
        </p>
      </div>

      {isLoading ? (
        <Loader label="Generating..." />
      ) : script ? (
        <pre className="script">{renderScriptWithHeadings(script)}</pre>
      ) : (
        <p className="placeholder">Your script will appear here after generation.</p>
      )}
    </section>
  );
}
