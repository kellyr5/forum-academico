const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET - Listar todas as disciplinas
router.get('/', (req, res) => {
  db.query('SELECT * FROM disciplinas ORDER BY criado_em DESC', (err, results) => {
    if (err) {
      console.error('Erro ao buscar disciplinas:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET - Buscar disciplina por ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM disciplinas WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar disciplina:', err);
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Disciplina não encontrada' });
    }
    res.json(results[0]);
  });
});

// POST - Criar nova disciplina
router.post('/', (req, res) => {
  const { nome, codigo, curso_id, professor_id } = req.body;
  
  const sql = 'INSERT INTO disciplinas (nome, codigo, curso_id, professor_id) VALUES (?, ?, ?, ?)';
  
  db.query(sql, [nome, codigo, curso_id, professor_id], (err, result) => {
    if (err) {
      console.error('Erro ao criar disciplina:', err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: result.insertId, message: 'Disciplina criada com sucesso' });
  });
});

// DELETE - Deletar disciplina (com CASCADE manual)
router.delete('/:id', (req, res) => {
  const disciplinaId = req.params.id;
  
  // Buscar todos os tópicos da disciplina primeiro
  db.query('SELECT id FROM topicos WHERE disciplina_id = ?', [disciplinaId], (err, topicos) => {
    if (err) {
      console.error('Erro ao buscar topicos:', err);
      return res.status(500).json({ error: err.message });
    }
    
    const topicoIds = topicos.map(t => t.id);
    
    const deleteQueries = [];
    
    // Se houver tópicos, deletar suas dependências primeiro
    if (topicoIds.length > 0) {
      const idsStr = topicoIds.join(',');
      deleteQueries.push(
        // 1. Deletar votos das respostas dos tópicos
        `DELETE FROM votos WHERE resposta_id IN (SELECT id FROM respostas WHERE topico_id IN (${idsStr}))`,
        // 2. Deletar respostas dos tópicos
        `DELETE FROM respostas WHERE topico_id IN (${idsStr})`,
        // 3. Deletar arquivos dos tópicos
        `DELETE FROM arquivos WHERE topico_id IN (${idsStr})`
      );
    }
    
    // 4. Deletar tópicos da disciplina
    deleteQueries.push(`DELETE FROM topicos WHERE disciplina_id = ?`);
    // 5. Finalmente deletar a disciplina
    deleteQueries.push(`DELETE FROM disciplinas WHERE id = ?`);
    
    // Executar queries em sequência
    let queryIndex = 0;
    
    const executeNext = () => {
      if (queryIndex >= deleteQueries.length) {
        return res.json({ message: 'Disciplina deletada com sucesso' });
      }
      
      const query = deleteQueries[queryIndex];
      const params = query.includes('disciplina_id') || query.includes('WHERE id') ? [disciplinaId] : [];
      
      db.query(query, params, (err, result) => {
        if (err) {
          console.error(`Erro ao deletar disciplina (step ${queryIndex + 1}):`, err);
          return res.status(500).json({ error: err.message });
        }
        
        queryIndex++;
        executeNext();
      });
    };
    
    executeNext();
  });
});

module.exports = router;
