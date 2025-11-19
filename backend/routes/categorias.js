const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
  const sql = 'SELECT id, nome, descricao FROM categorias ORDER BY nome';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const sql = 'SELECT id, nome, descricao FROM categorias WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Categoria nao encontrada' });
    res.json(results[0]);
  });
});

router.post('/', (req, res) => {
  const { nome, descricao } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome obrigatorio' });
  
  const sql = 'INSERT INTO categorias (nome, descricao) VALUES (?, ?)';
  db.query(sql, [nome, descricao || null], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, nome, descricao });
  });
});

router.put('/:id', (req, res) => {
  const { nome, descricao } = req.body;
  if (!nome) return res.status(400).json({ error: 'Nome obrigatorio' });
  
  const sql = 'UPDATE categorias SET nome = ?, descricao = ? WHERE id = ?';
  db.query(sql, [nome, descricao || null, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Categoria atualizada com sucesso' });
  });
});

router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM categorias WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Categoria removida com sucesso' });
  });
});

module.exports = router;

router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM categorias WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error('Erro ao deletar categoria:', err);
      return res.status(500).json({ error: 'Erro ao deletar categoria' });
    }
    res.json({ message: 'Categoria removida com sucesso' });
  });
});
