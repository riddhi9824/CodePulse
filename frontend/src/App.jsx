import { useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AnalyzeCode from "./pages/AnalyzeCode";
import AnalysisHistory from "./pages/AnalysisHistory";

import { analyzeCode } from "./services/api";

const pageDetails = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Your code quality overview",
  },
  analyze: {
    title: "Analyze Code",
    subtitle: "Inspect Python code and discover potential issues",
  },
  history: {
    title: "Analysis History",
    subtitle: "Review your previous analysis runs",
  },
};

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [findings, setFindings] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [notification, setNotification] = useState(null);

  const handleAnalyze = async (code) => {
    setLoading(true);
    setNotification(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeCode(code);

      const normalizedFindings =
        result.findings || result.issues || result.results || [];

      setFindings(normalizedFindings);
      setAnalysisResult(result);

      const historyItem = {
        id: `${Date.now()}`,
        fileName: "main.py",
        timestamp: new Date().toISOString(),
        issueCount: normalizedFindings.length,
        result,
      };

      setHistory((previous) => [historyItem, ...previous]);

      setNotification({
        type: "success",
        message: "Code analysis completed successfully.",
      });
    } catch (error) {
      const detail =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.message ||
        "Unknown error";

      setNotification({
        type: "error",
        message: `Analysis failed: ${detail}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const currentPage = pageDetails[activePage];

  return (
    <div className="app-shell">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
      />

      <main className="main-area">
        <Navbar
          title={currentPage.title}
          subtitle={currentPage.subtitle}
        />

        {notification && (
          <div
            className={`notification ${
              notification.type === "error" ? "error" : "success"
            }`}
            role="status"
          >
            {notification.type === "error" ? (
              <AlertCircle size={19} />
            ) : (
              <CheckCircle2 size={19} />
            )}

            <span>{notification.message}</span>

            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setNotification(null)}
            >
              <X size={17} />
            </button>
          </div>
        )}

        {activePage === "dashboard" && (
          <Dashboard onNavigate={setActivePage} />
        )}

        {activePage === "analyze" && (
          <>
            <AnalyzeCode
              onAnalyze={handleAnalyze}
              loading={loading}
            />

            {analysisResult && (
              <section className="dashboard-panel live-results">
                <div className="panel-heading">
                  <div>
                    <h3>Analysis Results</h3>
                    <p>Findings returned by the backend</p>
                  </div>

                  <span className="history-count">
                    {findings.length} findings
                  </span>
                </div>

                <div className="results-summary">
                  <div>
                    <span>Total findings</span>
                    <strong>{findings.length}</strong>
                  </div>

                  {analysisResult.complexity !== undefined && (
                    <div>
                      <span>Complexity</span>
                      <strong>{String(analysisResult.complexity)}</strong>
                    </div>
                  )}

                  {analysisResult.quality_score !== undefined && (
                    <div>
                      <span>Quality score</span>
                      <strong>{String(analysisResult.quality_score)}</strong>
                    </div>
                  )}
                </div>

                <div className="results-table-container">
                  {findings.length > 0 ? (
                    <table className="issue-table">
                      <thead>
                        <tr>
                          <th>Severity</th>
                          <th>Tool</th>
                          <th>Rule</th>
                          <th>Finding</th>
                          <th>Line</th>
                        </tr>
                      </thead>

                      <tbody>
                        {findings.map((issue, index) => (
                          <tr
                            key={`${issue.tool}-${issue.rule || issue.type}-${issue.line}-${index}`}
                          >
                            <td>
                              <span
                                className={`severity-badge ${String(
                                  issue.severity || "info"
                                ).toLowerCase()}`}
                              >
                                {issue.severity || "info"}
                              </span>
                            </td>

                            <td>{issue.tool || "Unknown"}</td>
                            <td>{issue.rule || issue.type || "—"}</td>
                            <td className="issue-message">
                              {issue.message || issue.description || "—"}
                            </td>
                            <td>{issue.line ?? issue.line_number ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="results-empty">
                      <CheckCircle2 size={25} />
                      <p>
                        No findings were returned in the expected format.
                        Check the API response if you expected results.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {notification?.type === "error" && (
              <div className="backend-error-help">
                Check that the FastAPI backend is running and that its
                analysis endpoint matches the frontend configuration.
              </div>
            )}
          </>
        )}

        {activePage === "history" && (
          <AnalysisHistory
            history={history}
            onNavigate={setActivePage}
          />
        )}
      </main>
    </div>
  );
}

export default App;