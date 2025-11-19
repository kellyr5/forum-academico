const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const db = require('../config/database');

// Configurar armazenamento do Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomBytes(16).toString('hex');
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Filtro de tipos de arquivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não permitido. Apenas imagens, PDFs, documentos e ZIP.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// GET - Listar todos os arquivos
router.get('/', (req, res) => {
  const sql = `
    SELECT a.*, u.nome_completo as autor_nome
    FROM arquivos a
    JOIN usuarios u ON a.usuario_id = u.id
    ORDER BY a.criado_em DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erro ao listar arquivos:', err);
      return res.status(500).json({ error: 'Erro ao listar arquivos' });
    }
    res.json(results);
  });
});

// GET - Buscar arquivos por tópico
router.get('/topico/:id', (req, res) => {
  const sql = `
    SELECT a.*, u.nome_completo as autor_nome
    FROM arquivos a
    JOIN usuarios u ON a.usuario_id = u.id
    WHERE a.topico_id = ?
    ORDER BY a.criado_em DESC
  `;
  
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar arquivos do tópico:', err);
      return res.status(500).json({ error: 'Erro ao buscar arquivos' });
    }
    res.json(results);
  });
});

// GET - Buscar arquivos por resposta
router.get('/resposta/:id', (req, res) => {
  const sql = `
    SELECT a.*, u.nome_completo as autor_nome
    FROM arquivos a
    JOIN usuarios u ON a.usuario_id = u.id
    WHERE a.resposta_id = ?
    ORDER BY a.criado_em DESC
  `;
  
  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar arquivos da resposta:', err);
      return res.status(500).json({ error: 'Erro ao buscar arquivos' });
    }
    res.json(results);
  });
});

// POST - Upload de arquivo
router.post('/', upload.single('arquivo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
  }

  const { topico_id, resposta_id, usuario_id } = req.body;

  if (!usuario_id) {
    // Remover arquivo se validação falhar
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'usuario_id é obrigatório' });
  }

  // Calcular hash do arquivo
  const fileBuffer = fs.readFileSync(req.file.path);
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  const sql = `
    INSERT INTO arquivos (
      nome_original, nome_arquivo, tamanho, tipo_mime, 
      hash_arquivo, topico_id, resposta_id, usuario_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    req.file.originalname,
    req.file.filename,
    req.file.size,
    req.file.mimetype,
    hash,
    topico_id || null,
    resposta_id || null,
    usuario_id
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao salvar arquivo no banco:', err);
      // Remover arquivo se falhar ao salvar no banco
      fs.unlinkSync(req.file.path);
      return res.status(500).json({ error: 'Erro ao salvar arquivo' });
    }

    res.status(201).json({
      id: result.insertId,
      nome_original: req.file.originalname,
      nome_arquivo: req.file.filename,
      tamanho: req.file.size,
      tipo_mime: req.file.mimetype,
      url: `/api/arquivos/download/${req.file.filename}`
    });
  });
});

// GET - Download de arquivo
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  
  // Buscar informações do arquivo no banco
  const sql = 'SELECT * FROM arquivos WHERE nome_arquivo = ?';
  
  db.query(sql, [filename], (err, results) => {
    if (err) {
      console.error('Erro ao buscar arquivo:', err);
      return res.status(500).json({ error: 'Erro ao buscar arquivo' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    const arquivo = results[0];
    const filePath = path.join(__dirname, '../uploads', filename);

    // Verificar se arquivo existe fisicamente
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado no servidor' });
    }

    // Definir headers apropriados
    res.setHeader('Content-Type', arquivo.tipo_mime);
    res.setHeader('Content-Disposition', `inline; filename="${arquivo.nome_original}"`);
    res.setHeader('Content-Length', arquivo.tamanho);

    // Enviar arquivo
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
});

// DELETE - Remover arquivo
router.delete('/:id', (req, res) => {
  const id = req.params.id;

  // Buscar informações do arquivo antes de deletar
  const selectSql = 'SELECT nome_arquivo FROM arquivos WHERE id = ?';
  
  db.query(selectSql, [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar arquivo:', err);
      return res.status(500).json({ error: 'Erro ao buscar arquivo' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    const filename = results[0].nome_arquivo;
    const filePath = path.join(__dirname, '../uploads', filename);

    // Deletar do banco de dados
    const deleteSql = 'DELETE FROM arquivos WHERE id = ?';
    
    db.query(deleteSql, [id], (err) => {
      if (err) {
        console.error('Erro ao deletar arquivo do banco:', err);
        return res.status(500).json({ error: 'Erro ao deletar arquivo' });
      }

      // Deletar arquivo físico
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      res.json({ message: 'Arquivo removido com sucesso' });
    });
  });
});

module.exports = router;
