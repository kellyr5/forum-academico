const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Listar todas as respostas
router.get('/', (req, res) => {
  db.query('SELECT * FROM respostas ORDER BY criado_em DESC', (err, results) => {
    if (err) {
      console.error('Erro ao buscar respostas:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET - Buscar respostas por tópico
router.get('/topico/:topico_id', (req, res) => {
  db.query('SELECT * FROM respostas WHERE topico_id = ? ORDER BY criado_em ASC', 
    [req.params.topico_id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar respostas:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// POST - Criar nova resposta
router.post('/', (req, res) => {
  const { conteudo, topico_id, usuario_id } = req.body;
  
  const sql = 'INSERT INTO respostas (conteudo, topico_id, usuario_id) VALUES (?, ?, ?)';
  
  db.query(sql, [conteudo, topico_id, usuario_id], (err, result) => {
    if (err) {
      console.error('Erro ao criar resposta:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, message: 'Resposta criada com sucesso' });
  });
});

// DELETE - Deletar resposta (com CASCADE manual)
router.delete('/:id', (req, res) => {
  const respostaId = req.params.id;
  
  const deleteQueries = [
    // 1. Deletar votos da resposta
    `DELETE FROM votos WHERE resposta_id = ?`,
    // 2. Deletar arquivos da resposta
    `DELETE FROM arquivos WHERE resposta_id = ?`,
    // 3. Finalmente deletar a resposta
    `DELETE FROM respostas WHERE id = ?`
  ];

  let completed = 0;
  let hasError = false;
  
  deleteQueries.forEach((query, index) => {
    db.query(query, [respostaId], (err, result) => {
      if (err && !hasError) {
        console.error(`Erro ao deletar resposta (step ${index + 1}):`, err);
        hasError = true;
        return res.status(500).json({ error: err.message });
      }
      
      completed++;
      
      if (completed === deleteQueries.length && !hasError) {
        res.json({ message: 'Resposta deletada com sucesso' });
      }
    });
  });
});

module.exports = router;
