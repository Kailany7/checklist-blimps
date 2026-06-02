import { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import FilterButtons from '../components/FilterButtons';
import ProgressBar from '../components/ProgressBar';
import ChecklistItem from '../components/ChecklistItem';
import api from '../services/api';
import { jsPDF } from 'jspdf';
import '../App.css';

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todos');
  const [dirty, setDirty] = useState(new Set());

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const { data } = await api.get('/api/checklist');
      setItems(data);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleToggle(id) {
    setItems(prev => prev.map(i =>
      i._id === id ? { ...i, concluido: !i.concluido } : i
    ));
    setDirty(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSave() {
    if (dirty.size === 0) return;
    setSaving(true);
    try {
      const itens = items
        .filter(i => dirty.has(i._id))
        .map(i => ({ _id: i._id, concluido: i.concluido }));
      const { data } = await api.patch('/api/checklist/bulk', { itens });
      setItems(data);
      setDirty(new Set());
    } catch (err) {
      console.error('Erro ao salvar:', err);
    } finally {
      setSaving(false);
    }
  }

  const stats = useMemo(() => {
    const total = items.length;
    const concluidos = items.filter((i) => i.concluido).length;
    const pendentes = total - concluidos;
    const totalBlimps = items.reduce((acc, i) => acc + i.quantidade, 0);
    const percentual = total > 0 ? Math.round((concluidos / total) * 100) : 0;
    return { total, concluidos, pendentes, totalBlimps, percentual };
  }, [items]);

  const grupos = useMemo(() => {
    let filtrados = [...items];

    if (filter === 'pendentes') {
      filtrados = filtrados.filter((i) => !i.concluido);
    } else if (filter === 'concluidos') {
      filtrados = filtrados.filter((i) => i.concluido);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtrados = filtrados.filter((i) =>
        i.local.toLowerCase().includes(q)
      );
    }

    const gruposMap = {};
    filtrados.forEach((item) => {
      if (!gruposMap[item.cidade]) {
        gruposMap[item.cidade] = [];
      }
      gruposMap[item.cidade].push(item);
    });

    return Object.keys(gruposMap)
      .sort()
      .map((cidade) => ({
        cidade,
        locais: gruposMap[cidade].sort((a, b) =>
          a.local.localeCompare(b.local)
        )
      }));
  }, [items, filter, search]);

  function gerarPDF() {
    const doc = new jsPDF();
    const hoje = new Date().toLocaleDateString('pt-BR');

    doc.setFontSize(18);
    doc.text('Checklist de Instalação de Blimps', 14, 20);
    doc.setFontSize(12);
    doc.text(`Data de geração: ${hoje}`, 14, 30);
    doc.text(`Concluído: ${stats.percentual}%`, 14, 38);

    const ordenados = [...items].sort((a, b) => {
      if (a.cidade !== b.cidade) return a.cidade.localeCompare(b.cidade);
      return a.local.localeCompare(b.local);
    });

    let y = 50;
    const pageHeight = doc.internal.pageSize.height;

    ordenados.forEach((item) => {
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      const status = item.concluido ? 'Concluído' : 'Pendente';
      const texto = `${item.cidade} - ${item.local}: ${status}`;
      doc.text(texto, 14, y);
      y += 7;
    });

    doc.save('checklist-blimps.pdf');
  }

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="container">
      <Header totalBlimps={stats.totalBlimps} />

      <ProgressBar
        percentual={stats.percentual}
        concluidos={stats.concluidos}
        pendentes={stats.pendentes}
      />

      <SearchBar value={search} onChange={setSearch} />
      <FilterButtons active={filter} onChange={setFilter} />

      <p className="result-count">
        {grupos.reduce((acc, g) => acc + g.locais.length, 0)} local(is) exibidos
      </p>

      <div className="grupos">
        {grupos.map((grupo) => (
          <div key={grupo.cidade} className="grupo-cidade">
            <h2 className="cidade-titulo">{grupo.cidade}</h2>
            <div className="locais-lista">
              {grupo.locais.map((item) => (
                <ChecklistItem
                  key={item._id}
                  item={item}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {grupos.length === 0 && (
        <p className="empty-msg">Nenhum local encontrado.</p>
      )}

      <div className="actions">
        <button className="btn-save" onClick={handleSave} disabled={dirty.size === 0 || saving}>
          {saving ? 'Salvando...' : `Salvar (${dirty.size})`}
        </button>
        <button className="btn-pdf" onClick={gerarPDF}>
          Gerar PDF
        </button>
      </div>
    </div>
  );
}
