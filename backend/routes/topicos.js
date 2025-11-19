const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Listar todos os tópicos
router.get('/', (req, res) => {
  db.query('SELECT * FROM topicos ORDER BY criado_em DESC', (err, results) => {
    if (err) {
      console.error('Erro ao buscar topicos:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET - Buscar tópico por ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM topicos WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar topico:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Topico não encontrado' });
    }
    res.json(results[0]);
  });
});

// POST - Criar novo tópico
router.post('/', (req, res) => {
  const { titulo, conteudo, disciplina_id, usuario_id, categoria_id } = req.body;
  
  const sql = `INSERT INTO topicos (titulo, conteudo, disciplina_id, usuario_id, categoria_id, status) 
               VALUES (?, ?, ?, ?, ?, 'Aberto')`;
  
  db.query(sql, [titulo, conteudo, disciplina_id, usuario_id, categoria_id], (err, result) => {
    if (err) {
      console.error('Erro ao criar topico:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, message: 'Topico criado com sucesso' });
  });
});

// DELETE - Deletar tópico (com CASCADE manual)
router.delete('/:id', (req, res) => {
  const topicoId = req.params.id;
  
  const deleteQueries = [
    // 1. Deletar votos das respostas do tópico
    `DELETE FROM votos WHERE resposta_id IN (SELECT id FROM respostas WHERE topico_id = ?)`,
    // 2. Deletar respostas do tópico
    `DELETE FROM respostas WHERE topico_id = ?`,
    // 3. Deletar arquivos do tópico
    `DELETE FROM arquivos WHERE topico_id = ?`,
    // 4. Finalmente deletar o tópico
    `DELETE FROM topicos WHERE id = ?`
  ];

  let completed = 0;
  let hasError = false;
  
  deleteQueries.forEach((query, index) => {
    db.query(query, [topicoId], (err, result) => {
      if (err && !hasError) {
        console.error(`Erro ao deletar topico (step ${index + 1}):`, err);
        hasError = true;
        return res.status(500).json({ error: err.message });
      }
      
      completed++;
      
      if (completed === deleteQueries.length && !hasError) {
        res.json({ message: 'Topico deletado com sucesso' });
      }
    });
  });
});

module.exports = router;
