export default function ProgressBar({ percentual, concluidos, pendentes }) {
  return (
    <div className="progress-section">
      <div className="progress-header">
        <span className="progress-label">{percentual}% concluído</span>
        <span className="progress-count">
          {concluidos} concluídos · {pendentes} pendentes
        </span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percentual}%` }}
        />
      </div>
    </div>
  );
}
