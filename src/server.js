const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', routes);

app.get('/api', (req, res) => {
  res.json({
    message: 'API Fórum Acadêmico - Release 0',
    version: '1.0.0',
    endpoints: {
      usuarios: '/api/usuarios',
      disciplinas: '/api/disciplinas'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`�� API: http://localhost:${PORT}/api`);
  console.log(`🌐 Interface: http://localhost:${PORT}`);
});

module.exports = app;

// Rota para visualizar bugs
app.get('/bugs', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/bugs.html'));
});
