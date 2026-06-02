const FILTROS = [
  { key: 'todos', label: 'Todos' },
  { key: 'pendentes', label: 'Pendentes' },
  { key: 'concluidos', label: 'Concluídos' }
];

export default function FilterButtons({ active, onChange }) {
  return (
    <div className="filter-bar">
      {FILTROS.map((f) => (
        <button
          key={f.key}
          className={`filter-btn ${active === f.key ? 'active' : ''}`}
          onClick={() => onChange(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
