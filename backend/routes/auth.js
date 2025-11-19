const express = require('express');
const router = express.Router();
const db = require('../config/database');

// LOGIN
router.post('/login', (req, res) => {
  const { email, senha } = req.body;
  
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha sao obrigatorios' });
  }
  
  const sql = `
    SELECT u.id, u.nome_completo, u.email, u.tipo_usuario, u.curso_id, u.periodo,
           c.nome as curso_nome
    FROM usuarios u
    LEFT JOIN cursos c ON u.curso_id = c.id
    WHERE u.email = ? AND u.senha_hash = ?
  `;
  
  db.query(sql, [email, senha], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }
    
    const usuario = results[0];
    
    // Retornar dados do usuario (sem a senha)
    res.json({
      success: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome_completo,
        email: usuario.email,
        tipo: usuario.tipo_usuario,
        curso: usuario.curso_nome,
        periodo: usuario.periodo
      }
    });
  });
});

// VERIFICAR SESSAO
router.post('/verificar', (req, res) => {
  const { usuario_id } = req.body;
  
  if (!usuario_id) {
    return res.status(401).json({ error: 'Nao autenticado' });
  }
  
  const sql = 'SELECT id, nome_completo, email, tipo_usuario FROM usuarios WHERE id = ?';
  
  db.query(sql, [usuario_id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(401).json({ error: 'Sessao invalida' });
    }
    
    res.json({ success: true, usuario: results[0] });
  });
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logout realizado com sucesso' });
});

module.exports = router;
