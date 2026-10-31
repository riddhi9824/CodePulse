import { LayoutDashboard, Code2, History, Activity, GitBranch } from "lucide-react";

function Sidebar({ activePage, onNavigate }) {
    const navigation = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "analyze", label: "Analyze Code", icon: Code2 },
        { id: "history", label: "Analysis History", icon: History },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-icon">
                    <Activity size={23} />
                </div>

                <div>
                    <h2>CodePulse</h2>
                    <span>Code Quality Analyzer</span>
                </div>
            </div>

            <div className="sidebar-section-label">WORKSPACE</div>

            <nav className="sidebar-navigation">
                {navigation.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        type="button"
                        className={`sidebar-nav-item ${
                            activePage === id ? "active" : ""
                        }`}
                        onClick={() => onNavigate(id)}
                    >
                        <Icon size={19} />
                        <span>{label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <div className="sidebar-status">
                    <span className="status-dot" />
                    <span>Python Analysis Engine</span>
                </div>

                <a 
                    className="sidebar-github"
                    href="https://github.com/"
                    target="_blank"
                    rel="noreferrer"
                >
                    <GitBranch size={18} />
                    <span>GitHub</span>
                </a>

                <p className="sidebar-version">CodePulse - Development</p>
            </div>
        </aside>
    );
}

export default Sidebar;