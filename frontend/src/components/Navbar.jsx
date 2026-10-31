import { Bell, Search, Command } from "lucide-react";

function Navbar({ title, subtitle }) {
    return (
        <header className="top-navbar">
            <div className="navbar-heading">
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>

            <div className="navbar-actions">
                <div className="navbar-search">
                    <Search size={17} />
                    <span>Code quality workspace</span>
                    <kbd>
                        <Command size={11} /> K
                    </kbd>
                </div>

                <button
                    type="button"
                    className="navbar-icon-button"
                    aria-label="Notifications"
                    title="Notifications"
                >
                    <Bell size={19} />
                </button>

                <div className="navbar-avatar" title="CodePulse developer">
                    CP
                </div>
            </div>
        </header>
    );
}

export default Navbar;