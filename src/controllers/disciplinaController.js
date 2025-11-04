const Disciplina = require('../models/Disciplina');

const disciplinaController = {
  async criar(req, res) {
    try {
      const disciplina = await Disciplina.criar(req.body);
      res.status(201).json({
        success: true,
        message: 'Disciplina cadastrada com sucesso',
        data: disciplina
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async consultar(req, res) {
    try {
      const disciplinas = await Disciplina.consultar(req.query);
      res.status(200).json({
        success: true,
        data: disciplinas,
        total: disciplinas.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  async buscarPorId(req, res) {
    try {
      const disciplina = await Disciplina.buscarPorId(req.params.id);
      if (!disciplina) {
        return res.status(404).json({
          success: false,
          message: 'Disciplina não encontrada'
        });
      }
      res.status(200).json({
        success: true,
        data: disciplina
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  async editar(req, res) {
    try {
      const disciplina = await Disciplina.editar(req.params.id, req.body);
      if (!disciplina) {
        return res.status(404).json({
          success: false,
          message: 'Disciplina não encontrada'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Disciplina atualizada com sucesso',
        data: disciplina
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  async excluir(req, res) {
    try {
      const disciplina = await Disciplina.excluir(req.params.id);
      if (!disciplina) {
        return res.status(404).json({
          success: false,
          message: 'Disciplina não encontrada'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Disciplina excluída com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = disciplinaController;
