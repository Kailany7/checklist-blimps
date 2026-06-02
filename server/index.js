require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const checklistRoutes = require("./routes/checklist");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/checklist", checklistRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Checklist Blimps funcionando" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});