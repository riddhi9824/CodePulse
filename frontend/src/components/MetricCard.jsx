import "./MetricCard.css";

function MetricCard({ title, value, description, icon: Icon }) {
    return (
        <div className="metric-card">
            <div className="metric-card-top">
                <span className="metric-card-title">{title}</span>

                {Icon && (
                    <div className="metric-card-icon">
                        <Icon size={20} />
                    </div>
                )}
            </div>

            <div className="metric-card-value">{value}</div>

            {description && (
                <p className="metric-card-description">{description}</p>
            )}
        </div>
    );
}

export default MetricCard;