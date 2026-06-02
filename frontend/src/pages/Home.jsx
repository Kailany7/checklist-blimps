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
    const ml = 14;
    let y = 20;
    const pageW = doc.internal.pageSize.width;
    const pageH = doc.internal.pageSize.height;

    function header() {
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Checklist de Instalação de Blimps', ml, y);
      y += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`Gerado em ${hoje}`, ml, y);
      y += 5;
      doc.text(`${stats.concluidos} de ${stats.total} locais concluídos · ${stats.percentual}% · ${stats.totalBlimps} blimps instalados`, ml, y);
      y += 12;
      doc.setTextColor(0);
    }

    function checkPage() {
      if (y > pageH - 25) {
        doc.addPage();
        y = 20;
      }
    }

    header();

    const cidades = [...new Set(items.map(i => i.cidade))].sort();
    cidades.forEach(cidade => {
      checkPage();
      doc.setFillColor(240, 240, 235);
      doc.rect(ml, y - 4, pageW - ml * 2, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(cidade, ml + 2, y);
      y += 9;

      const locais = items
        .filter(i => i.cidade === cidade)
        .sort((a, b) => a.local.localeCompare(b.local));

      locais.forEach(item => {
        checkPage();
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);

        const checkX = ml;
        const checkY = y - 3;
        doc.setDrawColor(item.concluido ? 30 : 180, item.concluido ? 158 : 180, item.concluido ? 117 : 180);
        doc.setLineWidth(0.4);
        doc.rect(checkX, checkY, 4.5, 4.5);
        if (item.concluido) {
          doc.setDrawColor(30, 158, 117);
          doc.setLineWidth(0.8);
          doc.line(checkX + 0.8, checkY + 2.2, checkX + 2, checkY + 3.2);
          doc.line(checkX + 2, checkY + 3.2, checkX + 3.8, checkY + 0.5);
          doc.setTextColor(120);
        } else {
          doc.setTextColor(40);
        }

        doc.text(item.local, ml + 7, y);
        doc.setTextColor(140);
        doc.setFontSize(8);
        doc.text(`${item.quantidade} blimp${item.quantidade > 1 ? 's' : ''}`, pageW - ml - 20, y);
        y += 6.5;
      });
      y += 3;
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
