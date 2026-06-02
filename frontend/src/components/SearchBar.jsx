export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Buscar local..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
