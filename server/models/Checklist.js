const mongoose = require("mongoose");

const ChecklistSchema = new mongoose.Schema({
  cidade: {
    type: String,
    required: true
  },

  local: {
    type: String,
    required: true
  },

  quantidade: {
    type: Number,
    required: true
  },

  concluido: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model(
  "Checklist",
  ChecklistSchema
);