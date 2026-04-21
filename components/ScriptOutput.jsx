import Loader from './Loader';

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
        <pre className="script">{script}</pre>
      ) : (
        <p className="placeholder">Your script will appear here after generation.</p>
      )}
    </section>
  );
}
