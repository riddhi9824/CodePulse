import { History, FileCode2, ChevronRight } from "lucide-react";

function AnalysisHistory({ history = [], onNavigate }) {
    return (
        <div className="history-page">
            <section className="page-intro">
                <div className="eyebrow">
                    <History size={15} />
                    ANALYSIS RECORDS
                </div>

                <h2>Analysis History</h2>

                <p>
                    Review previous code analyses performed during this session.
                </p>
            </section>

            <section className="dashboard-panel history-panel">
                <div className="panel-heading">
                    <div>
                        <h3>Recent Analyses</h3>
                        <p>{history.length} analyses recorded in this session</p>
                    </div>

                    <span className="history-count">{history.length}</span>
                </div>

                {history.length === 0 ? (
                    <div className="history-empty">
                        <div className="history-empty-icon">
                            <FileCode2 size={28} />
                        </div>

                        <h3>No analyses yet</h3>

                        <p>
                            Your analysis results will appear here after you submit Python code for analysis.
                        </p>

                        <button 
                            type="button"
                            className="primary-button"
                            onClick={() => onNavigate("analyze")}
                        >
                            Analyze your first file
                            <ChevronRight size={17} />    
                        </button> 
                    </div>
                ) : (
                    <div className="history-list">
                        {history.map((item) => (
                            <article className="history-item" key={item.id}>
                                <div className="history-file-icon">
                                    <FileCode2 size={21} />
                                </div>

                                <div className="history-item-details">
                                    <strong>{item.fileName || "main.py"}</strong>
                                    <span>
                                        {new Date(item.timestamp).toLocaleString()}
                                    </span>
                                </div>

                                <div className="history-item-summary">
                                    <strong>{item.issueCount ?? "-"}</strong>
                                    <span>Findings</span>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default AnalysisHistory;