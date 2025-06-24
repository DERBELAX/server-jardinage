// server.js
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur prêt sur http://localhost:${PORT}`);
});


app.use(cors());
app.use(express.json());
const legumesFile = './legumes.json';

app.get('/legumes', (req, res) => {
  if (!fs.existsSync(legumesFile)) return res.status(404).json({ error: "Fichier non trouvé" });
  const legumes = JSON.parse(fs.readFileSync(legumesFile, 'utf-8'));
  res.json(legumes);
});

const stockFile = './stocks.json';
const defaultStocks = [
  { nom: "Tomates", stock: 10 },
  { nom: "Carottes", stock: 10 },
  { nom: "Salades", stock: 3 },
  { nom: "Courgettes", stock: 3 },
  { nom: "Poivrons", stock: 3 },
  { nom: "Radis", stock: 3 },
];


// Lire les stocks depuis le fichier
const readStocks = () => {
  if (!fs.existsSync(stockFile)) {
    fs.writeFileSync(stockFile, JSON.stringify(defaultStocks));
  }
  return JSON.parse(fs.readFileSync(stockFile, 'utf-8'));
};

// Sauver les stocks dans le fichier
const writeStocks = (stocks) => {
  fs.writeFileSync(stockFile, JSON.stringify(stocks));
};

// --- Routes ---
app.get('/stocks', (req, res) => {
  res.json(readStocks());
});

app.post('/stocks', (req, res) => {
  const { nom, delta } = req.body; // delta = +1 ou -1 ou 0
  const stocks = readStocks();
  const updated = stocks.map(p =>
    p.nom === nom ? { ...p, stock: Math.max(0, p.stock + delta) } : p
  );
  writeStocks(updated);
  res.json({ success: true, updated });
});

app.post('/stocks/reset', (req, res) => {
  writeStocks(defaultStocks);
  res.json({ success: true, reset: defaultStocks });
});

app.listen(PORT, () => {
  console.log(`Serveur backend prêt sur http://localhost:${PORT}`);
});
