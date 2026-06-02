const Checklist = require('../models/Checklist');

// Buscar todos os itens
exports.getAll = async (req, res) => {
  try {
    const items = await Checklist.find().sort({
      cidade: 1,
      local: 1
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao buscar checklist'
    });
  }
};

// Atualizar status de um item
exports.update = async (req, res) => {
  try {
    const { concluido } = req.body;

    const item = await Checklist.findByIdAndUpdate(
      req.params.id,
      { concluido },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({
        error: 'Item não encontrado'
      });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao atualizar item'
    });
  }
};

// Resetar checklist
exports.reset = async (req, res) => {
  try {
    await Checklist.updateMany(
      {},
      { concluido: false }
    );

    const items = await Checklist.find().sort({
      cidade: 1,
      local: 1
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao resetar checklist'
    });
  }
};

// Popular banco com os dados iniciais
exports.seed = async (req, res) => {
  try {

    await Checklist.deleteMany({});

    const dados = [
      { cidade: 'Campina Grande', local: 'Açude Novo', quantidade: 3 },
      { cidade: 'Campina Grande', local: 'Avenida Brasília', quantidade: 3 },
      { cidade: 'Campina Grande', local: 'Bar do Cuscuz', quantidade: 3 },
      { cidade: 'Campina Grande', local: 'Bododronomo', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Brazil Atacarejo', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Casa de Cumpadre', quantidade: 2 },
      { cidade: 'Campina Grande', local: 'Entrada da rodoviária', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Entrada de Campina — Bodoncongo', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Entrada e dentro do aeroporto BR', quantidade: 2 },
      { cidade: 'Campina Grande', local: 'Fazenda Santana', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Fazenda Santana — entrada', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Food Parker', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Galante', quantidade: 3 },
      { cidade: 'Campina Grande', local: 'Girador antes Sítio São João', quantidade: 2 },
      { cidade: 'Campina Grande', local: 'Girador depois Sítio São João', quantidade: 2 },
      { cidade: 'Campina Grande', local: 'Girador de Lagoa Seca', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Hotel Garden', quantidade: 2 },
      { cidade: 'Campina Grande', local: 'Hotel do Vale', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Hotel Vilage', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Ideal Conceição', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Ideal Floriano Peixoto', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Jairo da Tapioca', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Manoel da Carne de Sol', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Mix Mateus', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Na entrada da cidade', quantidade: 2 },
      { cidade: 'Campina Grande', local: 'Padaria Salomão', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Picanha 200', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Rede Compras', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Restaurante Bananal', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Seu Severino', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Sítio São João', quantidade: 3 },
      { cidade: 'Campina Grande', local: 'SoulJoão', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Entrada Soul João', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Spazzio', quantidade: 2 },
      { cidade: 'Campina Grande', local: 'Supermercado Bom Que Só 3', quantidade: 1 },
      { cidade: 'Campina Grande', local: 'Terreno São Braz', quantidade: 1 },

      { cidade: 'Bananeiras', local: 'Moendas', quantidade: 2 },
      { cidade: 'Bananeiras', local: 'Pátio do Forró', quantidade: 3 },
      { cidade: 'Bananeiras', local: 'Praça de Bananeiras', quantidade: 2 },
      { cidade: 'Bananeiras', local: 'Subida para o Pátio', quantidade: 3 },
      { cidade: 'Bananeiras', local: 'Supermercado Queiroz', quantidade: 1 },

      { cidade: 'Patos', local: 'Coreto', quantidade: 2 },
      { cidade: 'Patos', local: 'Hotel JK', quantidade: 1 },
      { cidade: 'Patos', local: 'Restaurante Geane', quantidade: 1 },

      { cidade: 'Queimadas', local: 'Queimadas', quantidade: 3 },

      { cidade: 'Lagoa Seca', local: 'Feirão', quantidade: 1 },
      { cidade: 'Lagoa Seca', local: 'Pesque Pague', quantidade: 1 },
      { cidade: 'Lagoa Seca', local: 'Supermercado Tadeu', quantidade: 1 }
    ];

    const itens = dados.map(item => ({
      ...item,
      concluido: false
    }));

    await Checklist.insertMany(itens);

    res.json({
      message: 'Checklist criado com sucesso',
      total: itens.length
    });

  } catch (error) {
    res.status(500).json({
      error: 'Erro ao popular banco'
    });
  }
};