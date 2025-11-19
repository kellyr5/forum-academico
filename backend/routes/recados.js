const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Listar todos os recados
router.get('/', (req, res) => {
  db.query('SELECT * FROM mural_recados ORDER BY fixado DESC, criado_em DESC', (err, results) => {
    if (err) {
      console.error('Erro ao buscar recados:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// POST - Criar novo recado
router.post('/', (req, res) => {
  const { titulo, conteudo, usuario_id, tipo_aviso } = req.body;
  
  const sql = 'INSERT INTO mural_recados (titulo, conteudo, usuario_id, tipo_aviso) VALUES (?, ?, ?, ?)';
  
  db.query(sql, [titulo, conteudo, usuario_id, tipo_aviso || 'geral'], (err, result) => {
    if (err) {
      console.error('Erro ao criar recado:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, message: 'Recado criado com sucesso' });
  });
});

// DELETE - Deletar recado
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM mural_recados WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      console.error('Erro ao deletar recado:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Recado deletado com sucesso' });
  });
});

module.exports = router;
