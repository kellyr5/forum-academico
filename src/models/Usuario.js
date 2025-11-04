const pool = require('../config/database');
const bcrypt = require('bcrypt');

class Usuario {
  static async criar(dados) {
    const { nome_completo, email, senha, universidade_id, curso_id, periodo, tipo_usuario } = dados;
    
    if (senha.length < 8) {
      throw new Error('Senha deve ter no mínimo 8 caracteres');
    }
    
    const senha_hash = await bcrypt.hash(senha, 10);
    
    const query = `
      INSERT INTO usuarios (nome_completo, email, senha_hash, universidade_id, curso_id, periodo, tipo_usuario)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, nome_completo, email, universidade_id, curso_id, periodo, tipo_usuario, created_at
    `;
    
    const values = [nome_completo, email, senha_hash, universidade_id, curso_id, periodo, tipo_usuario];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Email já cadastrado no sistema');
      }
      throw error;
    }
  }

  static async consultar(filtros = {}) {
    let query = `
      SELECT u.id, u.nome_completo, u.email, u.tipo_usuario, u.periodo,
             un.nome as universidade, c.nome as curso
      FROM usuarios u
      LEFT JOIN universidades un ON u.universidade_id = un.id
      LEFT JOIN cursos c ON u.curso_id = c.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filtros.nome) {
      query += ` AND u.nome_completo ILIKE $${paramCount}`;
      values.push(`%${filtros.nome}%`);
      paramCount++;
    }

    if (filtros.universidade_id) {
      query += ` AND u.universidade_id = $${paramCount}`;
      values.push(filtros.universidade_id);
      paramCount++;
    }

    if (filtros.tipo_usuario) {
      query += ` AND u.tipo_usuario = $${paramCount}`;
      values.push(filtros.tipo_usuario);
      paramCount++;
    }

    query += ' ORDER BY u.nome_completo';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async editar(id, dados) {
    const { nome_completo, curso_id, periodo, senha } = dados;
    
    let query = 'UPDATE usuarios SET updated_at = CURRENT_TIMESTAMP';
    const values = [];
    let paramCount = 1;

    if (nome_completo) {
      query += `, nome_completo = $${paramCount}`;
      values.push(nome_completo);
      paramCount++;
    }

    if (curso_id) {
      query += `, curso_id = $${paramCount}`;
      values.push(curso_id);
      paramCount++;
    }

    if (periodo) {
      query += `, periodo = $${paramCount}`;
      values.push(periodo);
      paramCount++;
    }

    if (senha) {
      const senha_hash = await bcrypt.hash(senha, 10);
      query += `, senha_hash = $${paramCount}`;
      values.push(senha_hash);
      paramCount++;
    }

    query += ` WHERE id = $${paramCount} RETURNING id, nome_completo, email, curso_id, periodo, updated_at`;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async excluir(id) {
    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async buscarPorId(id) {
    const query = `
      SELECT u.*, un.nome as universidade, c.nome as curso
      FROM usuarios u
      LEFT JOIN universidades un ON u.universidade_id = un.id
      LEFT JOIN cursos c ON u.curso_id = c.id
      WHERE u.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Usuario;
