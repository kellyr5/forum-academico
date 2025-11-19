const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Listar todos os usuários
router.get('/', (req, res) => {
  db.query('SELECT * FROM usuarios ORDER BY criado_em DESC', (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET - Buscar usuário por ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM usuarios WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuário:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(results[0]);
  });
});

// POST - Criar novo usuário
router.post('/', (req, res) => {
  const { nome_completo, email, senha_hash, curso_id, periodo, tipo_usuario } = req.body;
  
  const sql = `INSERT INTO usuarios (nome_completo, email, senha_hash, curso_id, periodo, tipo_usuario) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.query(sql, [nome_completo, email, senha_hash, curso_id, periodo, tipo_usuario], (err, result) => {
    if (err) {
      console.error('Erro ao criar usuário:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, message: 'Usuário criado com sucesso' });
  });
});

// DELETE - Deletar usuário (COM EXECUÇÃO EM SEQUÊNCIA)
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  
  try {
    // Executar em sequência para evitar deadlock
    await query('DELETE FROM votos WHERE usuario_id = ?', [userId]);
    await query('DELETE FROM arquivos WHERE usuario_id = ?', [userId]);
    
    // Deletar respostas (que podem ter votos)
    const respostas = await query('SELECT id FROM respostas WHERE usuario_id = ?', [userId]);
    for (const resposta of respostas) {
      await query('DELETE FROM votos WHERE resposta_id = ?', [resposta.id]);
      await query('DELETE FROM arquivos WHERE resposta_id = ?', [resposta.id]);
    }
    await query('DELETE FROM respostas WHERE usuario_id = ?', [userId]);
    
    // Deletar tópicos (que podem ter respostas)
    const topicos = await query('SELECT id FROM topicos WHERE usuario_id = ?', [userId]);
    for (const topico of topicos) {
      const respostasTopico = await query('SELECT id FROM respostas WHERE topico_id = ?', [topico.id]);
      for (const resp of respostasTopico) {
        await query('DELETE FROM votos WHERE resposta_id = ?', [resp.id]);
        await query('DELETE FROM arquivos WHERE resposta_id = ?', [resp.id]);
      }
      await query('DELETE FROM respostas WHERE topico_id = ?', [topico.id]);
      await query('DELETE FROM arquivos WHERE topico_id = ?', [topico.id]);
    }
    await query('DELETE FROM topicos WHERE usuario_id = ?', [userId]);
    
    await query('DELETE FROM mural_recados WHERE usuario_id = ?', [userId]);
    await query('UPDATE disciplinas SET professor_id = NULL WHERE professor_id = ?', [userId]);
    await query('DELETE FROM usuarios WHERE id = ?', [userId]);
    
    res.json({ message: 'Usuario deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar usuario:', err);
    res.status(500).json({ error: err.message });
  }
});

// Função auxiliar para promisify queries
function query(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

module.exports = router;
