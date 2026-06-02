export default function Header({ totalBlimps }) {
  return (
    <header className="header">
      <h1 className="header-title">Instalação de Blimps</h1>
      <p className="header-subtitle">Total: {totalBlimps} blimps</p>
    </header>
  );
}
