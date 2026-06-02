export default function ChecklistItem({ item, onToggle }) {
  return (
    <button
      className={`checklist-item ${item.concluido ? 'done' : ''}`}
      onClick={() => onToggle(item._id)}
    >
      <div className={`checkbox ${item.concluido ? 'checked' : ''}`}>
        {item.concluido && <span className="check-icon">✓</span>}
      </div>
      <div className="item-info">
        <span className="item-local">{item.local}</span>
        <span className="item-qtd">{item.quantidade} blimp{item.quantidade > 1 ? 's' : ''}</span>
      </div>
    </button>
  );
}
