import { AlertCircle, CheckCircle2 } from "lucide-react";

function IssueTable({ findings = [] }) {
    if (findings.length === 0) {
        return (
            <div className="empty-issues">
                <CheckCircle2 size={28} />
                <h3>No issues reported</h3>
                <p>The analysis tools did not report any findings.</p>
            </div>
        );
    }

    return (
        <div className="issue-table-wrapper">
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
                                    <AlertCircle size={13} />
                                    {issue.severity || "info"}
                                </span>
                            </td>

                            <td>{issue.tool || "Unknown"}</td>
                            <td>{issue.rule || issue.type || "-"}</td>
                            <td className="issue-message">{issue.message}</td>
                            <td>{issue.line ?? "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default IssueTable;