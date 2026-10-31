import {
    Code2,
    AlertTriangle,
    ShieldCheck,
    Gauge,
    ArrowRight,
    FileCode2,
    SectionIcon,
} from "lucide-react";

import MetricCard from "../components/MetricCard";
import IssueTable from "../components/IssueTable";

function Dashboard({ onNavigate }) {
    const sampleFindings = [
        {
            severity: "warning",
            tool: "Ruff",
            rule: "F401",
            message: "Imported module is never used.",
            line: 8,
        },
        {
            severity: "warning",
            tool: "Radon",
            rule: "Complexity",
            message: "Review the complexity of this function.",
            line: 24,
        },
    ];

    return (
        <div className="dashboard-page">
            <section className="welcome-section">
                <div>
                    <div className="eyebrow">
                        <span className="status-dot" />
                        CODE INTELLIGENCE WORKSPACE
                    </div>

                    <h2>Understand your code. Improve your quality.</h2>

                    <p>
                        Analyze Python source code, discover potential issues, and understand code complexity in one workspace.
                    </p>
                </div>

                <button 
                    type="button"
                    className="primary-button"
                    onClick={() => onNavigate("analyze")}
                >
                    <Code2 size={18} />
                    Analyze Code
                    <ArrowRight size={17} />
                </button>
            </section>

            <section className="metrics-grid">
                <MetricCard
                    title="Files Analyzed"
                    value="0"
                    description="Files analyzed in this session"
                    icon={FileCode2}
                />

                <MetricCard
                    title="Issues Detected"
                    value="-"
                    description="Calculated from analysis results"
                    icon={ShieldCheck}
                />

                <MetricCard
                    title="Complexity"
                    value="-"
                    description="Measured using Radon"
                    icon={Gauge}
                />
            </section>

            <section className="dashboard-content-grid">
                <div className="dashboard-panel recent-panel">
                    <div className="panel-heading">
                        <div>
                            <h3>Recent Findings</h3>
                            <p>Example findings to preview the interface</p>
                        </div>

                        <span className="preview-badge">PREVIEW</span>
                    </div>

                    <IssueTable findings={sampleFindings} />
                </div>

                <div className="dashboard-panel quick-panel">
                    <div className="panel-heading">
                        <div>
                            <h3>Quick Actions</h3>
                            <p>Continue with your workflow</p>
                        </div>
                    </div>

                    <button 
                        type="button"
                        className="quick-action"
                        onClick={() => onNavigate("analyze")}
                    >
                        <div className="quick-action-icon">
                            <Code2 size={20} />
                        </div>

                        <div>
                            <strong>Analyze Python Code</strong>
                            <span>Run static analysis on a code snippet</span>
                        </div>

                        <ArrowRight size={17} />
                    </button>

                    <button
                        type="button"
                        className="quick-action"
                        onClick={() => onNavigate("history")}
                    >
                        <div className="quick-action-icon">
                            <FileCode2 size={20} />
                        </div>

                        <div>
                            <strong>Analysis History</strong>
                            <span>Review your saved analysis results</span>
                        </div>

                        <ArrowRight size={17} />
                    </button>

                    <div className="engine-information">
                        <div className="engine-information-icon">
                            <ShieldCheck size={20} />
                        </div>

                        <div>
                            <strong>Multi-tool analysis</strong>
                            <p>Ruff - Pylint - Radon</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="dashboard-footer">
                <span>CodePulse - Intelligent Code Quality Analyzer</span>
                <span>Python analysis workspace </span>
            </footer>
        </div>
    );
}

export default Dashboard;