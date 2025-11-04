const Usuario = require('../models/Usuario');

const usuarioController = {
  async criar(req, res) {
    try {
      const usuario = await Usuario.criar(req.body);
      res.status(201).json({
        success: true,
        message: 'Usuário cadastrado com sucesso',
        data: usuario
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
      const usuarios = await Usuario.consultar(req.query);
      res.status(200).json({
        success: true,
        data: usuarios,
        total: usuarios.length
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
      const usuario = await Usuario.buscarPorId(req.params.id);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
      res.status(200).json({
        success: true,
        data: usuario
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
      const usuario = await Usuario.editar(req.params.id, req.body);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso',
        data: usuario
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
      const usuario = await Usuario.excluir(req.params.id);
      if (!usuario) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
      res.status(200).json({
        success: true,
        message: 'Usuário excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = usuarioController;
