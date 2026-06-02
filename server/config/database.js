const mongoose = require("mongoose");
const dns = require("dns");
const Checklist = require("../models/Checklist");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const dados = [
  { cidade: "Campina Grande", local: "Açude Novo", quantidade: 3 },
  { cidade: "Campina Grande", local: "Avenida Brasília", quantidade: 3 },
  { cidade: "Campina Grande", local: "Bar do Cuscuz", quantidade: 3 },
  { cidade: "Campina Grande", local: "Bododronomo", quantidade: 1 },
  { cidade: "Campina Grande", local: "Brazil Atacarejo", quantidade: 1 },
  { cidade: "Campina Grande", local: "Casa de Cumpadre", quantidade: 2 },
  { cidade: "Campina Grande", local: "Entrada da rodoviária", quantidade: 1 },
  { cidade: "Campina Grande", local: "Entrada de Campina — Bodoncongo", quantidade: 1 },
  { cidade: "Campina Grande", local: "Entrada e dentro do aeroporto BR", quantidade: 2 },
  { cidade: "Campina Grande", local: "Fazenda Santana", quantidade: 1 },
  { cidade: "Campina Grande", local: "Fazenda Santana — entrada", quantidade: 1 },
  { cidade: "Campina Grande", local: "Food Parker", quantidade: 1 },
  { cidade: "Campina Grande", local: "Galante", quantidade: 3 },
  { cidade: "Campina Grande", local: "Girador antes Sítio São João", quantidade: 2 },
  { cidade: "Campina Grande", local: "Girador depois Sítio São João", quantidade: 2 },
  { cidade: "Campina Grande", local: "Girador de Lagoa Seca", quantidade: 1 },
  { cidade: "Campina Grande", local: "Hotel Garden", quantidade: 2 },
  { cidade: "Campina Grande", local: "Hotel do Vale", quantidade: 1 },
  { cidade: "Campina Grande", local: "Hotel Vilage", quantidade: 1 },
  { cidade: "Campina Grande", local: "Ideal Conceição", quantidade: 1 },
  { cidade: "Campina Grande", local: "Ideal Floriano Peixoto", quantidade: 1 },
  { cidade: "Campina Grande", local: "Jairo da Tapioca", quantidade: 1 },
  { cidade: "Campina Grande", local: "Manoel da Carne de Sol", quantidade: 1 },
  { cidade: "Campina Grande", local: "Mix Mateus", quantidade: 1 },
  { cidade: "Campina Grande", local: "Na entrada da cidade", quantidade: 2 },
  { cidade: "Campina Grande", local: "Padaria Salomão", quantidade: 1 },
  { cidade: "Campina Grande", local: "Picanha 200", quantidade: 1 },
  { cidade: "Campina Grande", local: "Rede Compras", quantidade: 1 },
  { cidade: "Campina Grande", local: "Restaurante Bananal", quantidade: 1 },
  { cidade: "Campina Grande", local: "Seu Severino", quantidade: 1 },
  { cidade: "Campina Grande", local: "Sítio São João", quantidade: 3 },
  { cidade: "Campina Grande", local: "SoulJoão", quantidade: 1 },
  { cidade: "Campina Grande", local: "Entrada Soul João", quantidade: 1 },
  { cidade: "Campina Grande", local: "Spazzio", quantidade: 2 },
  { cidade: "Campina Grande", local: "Supermercado Bom Que Só 3", quantidade: 1 },
  { cidade: "Campina Grande", local: "Terreno São Braz", quantidade: 1 },
  { cidade: "Bananeiras", local: "Moendas", quantidade: 2 },
  { cidade: "Bananeiras", local: "Pátio do Forró", quantidade: 3 },
  { cidade: "Bananeiras", local: "Praça de Bananeiras", quantidade: 2 },
  { cidade: "Bananeiras", local: "Subida para o Pátio", quantidade: 3 },
  { cidade: "Bananeiras", local: "Supermercado Queiroz", quantidade: 1 },
  { cidade: "Patos", local: "Coreto", quantidade: 2 },
  { cidade: "Patos", local: "Hotel JK", quantidade: 1 },
  { cidade: "Patos", local: "Restaurante Geane", quantidade: 1 },
  { cidade: "Queimadas", local: "Queimadas", quantidade: 3 },
  { cidade: "Lagoa Seca", local: "Feirão", quantidade: 1 },
  { cidade: "Lagoa Seca", local: "Pesque Pague", quantidade: 1 },
  { cidade: "Lagoa Seca", local: "Supermercado Tadeu", quantidade: 1 }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB conectado");
    const count = await Checklist.countDocuments();
    if (count === 0) {
      await Checklist.insertMany(dados.map(d => ({ ...d, concluido: false })));
      console.log(`✅ Seed automático: ${dados.length} locais inseridos`);
    } else {
      console.log(`ℹ️ Banco já possui ${count} registros`);
    }
  } catch (error) {
    console.error("❌ Erro ao conectar MongoDB");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;