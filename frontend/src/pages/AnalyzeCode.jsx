import { useState } from "react";
import { Code2, Play, RotateCcw, LoaderCircle } from "lucide-react";

function AnalyzeCode({ onAnalyze, loading }) {
    const [code, setCode] = useState(
        'def calculate_total(items):\n  total = 0\n  for item in items:\n   total += item\n  return total\n'
    );

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!code.trim()) {
            return;
        }

        onAnalyze(code);
    };

    return (
        <div className="analyze-page">
            <section className="page-intro">
                <div className="eyebrow">
                    <Code2 size={15} />
                    PYTHON ANALYSIS
                </div>

                <h2>Analyze your code</h2>

                <p>
                    Submit a Python code snippet for static analysis and complexity measurements.
                </p>
            </section>

            <form className="code-editor-panel" onSubmit={handleSubmit}>
                <div className="editor-toolbar">
                    <div className="editor-file-name">
                        <span className="python-file-icon">Py</span>
                        <span>main.py</span>
                        <span className="editor-language-badge">Python</span>
                    </div>

                    <button
                        type="button"
                        className="editor-reset-button"
                        onClick={() => setCode("")}
                        disabled={loading}
                    >
                        <RotateCcw size={15} />
                        Clear
                    </button>
                </div>

                <div className="editor-body">
                    <div className="editor-line-count" aria-hidden="true">
                        {code.split("\n").map((_, index) => (
                            <span key={index}>{index + 1}</span>
                        ))}
                    </div>

                    <textarea
                        className="code-textarea"
                        value={code}
                        onChange={(event) => setCode(event.target.value)}
                        placeholder="Paste your Python code here..."
                        spellCheck="false"
                        aria-label="Python source code"
                        disabled={loading}
                    />
                </div>

                <div className="editor-footer">
                    <span>{code.split("\n").length} lines</span>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading || !code.trim()}
                    >
                        {loading ? (
                            <LoaderCircle className="loading-spinner" size={17} />
                        ) : (
                            <Play size={17} />
                        )}

                        {loading ? "Analyzing..." : "Run Analysis"}
                    </button>
                </div>
            </form>

            <div className="analysis-note">
                <Code2 size={18} />

                <p>
                    <strong>Analysis pipeline</strong>
                    <span>
                        The backend will run Ruff, Pylint, and Radon when configured and available.
                    </span>
                </p>
            </div>
        </div>
    );
}

export default AnalyzeCode;