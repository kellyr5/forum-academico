const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/database');
const { criarTabelaArquivos } = require('./config/init-arquivos');
const { criarTabelaMural } = require('./config/init-mural');
const { corrigirTabelaUsuarios } = require('./config/fix-usuarios');
const { popularDadosIniciais } = require('./config/seed-data');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Inicializar tabelas e dados
setTimeout(() => {
  criarTabelaArquivos();
  criarTabelaMural();
  corrigirTabelaUsuarios();
  
  // Popular dados após 2 segundos
  setTimeout(() => {
    popularDadosIniciais();
  }, 2000);
}, 1000);

const usuariosRoutes = require('./routes/usuarios');
const disciplinasRoutes = require('./routes/disciplinas');
const topicosRoutes = require('./routes/topicos');
const respostasRoutes = require('./routes/respostas');
const recadosRoutes = require('./routes/recados');
const categoriasRoutes = require('./routes/categorias');
const votosRoutes = require('./routes/votos');
const arquivosRoutes = require('./routes/arquivos');

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/disciplinas', disciplinasRoutes);
app.use('/api/topicos', topicosRoutes);
app.use('/api/respostas', respostasRoutes);
app.use('/api/recados', recadosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/votos', votosRoutes);
app.use('/api/arquivos', arquivosRoutes);
const relatoriosRoutes = require('./routes/relatorios');
app.use('/api/relatorios', relatoriosRoutes);

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
