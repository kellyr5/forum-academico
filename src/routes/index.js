const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const disciplinaController = require('../controllers/disciplinaController');

router.post('/usuarios', usuarioController.criar);
router.get('/usuarios', usuarioController.consultar);
router.get('/usuarios/:id', usuarioController.buscarPorId);
router.put('/usuarios/:id', usuarioController.editar);
router.delete('/usuarios/:id', usuarioController.excluir);

router.post('/disciplinas', disciplinaController.criar);
router.get('/disciplinas', disciplinaController.consultar);
router.get('/disciplinas/:id', disciplinaController.buscarPorId);
router.put('/disciplinas/:id', disciplinaController.editar);
router.delete('/disciplinas/:id', disciplinaController.excluir);

module.exports = router;
