const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
  const sql = 'SELECT id, resposta_id, usuario_id, voto, criado_em FROM votos ORDER BY criado_em DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.get('/resposta/:resposta_id', (req, res) => {
  const sql = 'SELECT SUM(voto) as total FROM votos WHERE resposta_id = ?';
  db.query(sql, [req.params.resposta_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ total: results[0].total || 0 });
  });
});

router.get('/usuario/:usuario_id', (req, res) => {
  const sql = 'SELECT id, resposta_id, voto FROM votos WHERE usuario_id = ?';
  db.query(sql, [req.params.usuario_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

router.post('/', (req, res) => {
  const { resposta_id, usuario_id, voto } = req.body;
  if (!resposta_id || !usuario_id || voto === undefined) 
    return res.status(400).json({ error: 'Campos obrigatorios faltando' });
  
  const sqlCheck = 'SELECT id FROM votos WHERE resposta_id = ? AND usuario_id = ?';
  db.query(sqlCheck, [resposta_id, usuario_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (results.length > 0) {
      const sqlUpdate = 'UPDATE votos SET voto = ? WHERE resposta_id = ? AND usuario_id = ?';
      db.query(sqlUpdate, [voto, resposta_id, usuario_id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Voto atualizado com sucesso' });
      });
    } else {
      const sqlInsert = 'INSERT INTO votos (resposta_id, usuario_id, voto) VALUES (?, ?, ?)';
      db.query(sqlInsert, [resposta_id, usuario_id, voto], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, resposta_id, usuario_id, voto });
      });
    }
  });
});

router.put('/:id', (req, res) => {
  const { voto } = req.body;
  if (voto === undefined) return res.status(400).json({ error: 'Voto obrigatorio' });
  
  const sql = 'UPDATE votos SET voto = ? WHERE id = ?';
  db.query(sql, [voto, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Voto atualizado com sucesso' });
  });
});

router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM votos WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Voto removido com sucesso' });
  });
});

module.exports = router;

router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM votos WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error('Erro ao deletar voto:', err);
      return res.status(500).json({ error: 'Erro ao deletar voto' });
    }
    res.json({ message: 'Voto removido com sucesso' });
  });
});
