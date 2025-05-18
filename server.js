// Backend simples para salvar noticias.json
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.static('public'));

app.post('/salvar-noticias', (req, res) => {
  const noticias = req.body;
  const filePath = path.join(__dirname, 'public', 'data', 'noticias.json');
  fs.writeFile(filePath, JSON.stringify(noticias, null, 2), err => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao salvar');
    }
    res.send('Salvo!');
  });
});

app.listen(PORT, () => {
  console.log(`Servidor de admin rodando em http://localhost:${PORT}`);
});
