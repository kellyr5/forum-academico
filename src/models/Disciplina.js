const pool = require('../config/database');

class Disciplina {
  static async criar(dados) {
    const { nome, codigo, universidade_id, curso_id, professor_id, periodo_letivo, descricao } = dados;
    
    const query = `
      INSERT INTO disciplinas (nome, codigo, universidade_id, curso_id, professor_id, periodo_letivo, descricao)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [nome, codigo, universidade_id, curso_id, professor_id, periodo_letivo, descricao];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') {
        throw new Error('Código de disciplina já existe nesta universidade');
      }
      throw error;
    }
  }

  static async consultar(filtros = {}) {
    let query = `
      SELECT d.*, 
             u.nome_completo as professor_nome,
             un.nome as universidade,
             c.nome as curso
      FROM disciplinas d
      LEFT JOIN usuarios u ON d.professor_id = u.id
      LEFT JOIN universidades un ON d.universidade_id = un.id
      LEFT JOIN cursos c ON d.curso_id = c.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filtros.nome) {
      query += ` AND d.nome ILIKE $${paramCount}`;
      values.push(`%${filtros.nome}%`);
      paramCount++;
    }

    if (filtros.curso_id) {
      query += ` AND d.curso_id = $${paramCount}`;
      values.push(filtros.curso_id);
      paramCount++;
    }

    if (filtros.professor_id) {
      query += ` AND d.professor_id = $${paramCount}`;
      values.push(filtros.professor_id);
      paramCount++;
    }

    if (filtros.periodo_letivo) {
      query += ` AND d.periodo_letivo = $${paramCount}`;
      values.push(filtros.periodo_letivo);
      paramCount++;
    }

    if (filtros.universidade_id) {
      query += ` AND d.universidade_id = $${paramCount}`;
      values.push(filtros.universidade_id);
      paramCount++;
    }

    query += ' ORDER BY d.nome';

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async editar(id, dados) {
    const { nome, codigo, curso_id, professor_id, periodo_letivo, descricao } = dados;
    
    let query = 'UPDATE disciplinas SET updated_at = CURRENT_TIMESTAMP';
    const values = [];
    let paramCount = 1;

    if (nome) {
      query += `, nome = $${paramCount}`;
      values.push(nome);
      paramCount++;
    }

    if (codigo) {
      query += `, codigo = $${paramCount}`;
      values.push(codigo);
      paramCount++;
    }

    if (curso_id) {
      query += `, curso_id = $${paramCount}`;
      values.push(curso_id);
      paramCount++;
    }

    if (professor_id) {
      query += `, professor_id = $${paramCount}`;
      values.push(professor_id);
      paramCount++;
    }

    if (periodo_letivo) {
      query += `, periodo_letivo = $${paramCount}`;
      values.push(periodo_letivo);
      paramCount++;
    }

    if (descricao !== undefined) {
      query += `, descricao = $${paramCount}`;
      values.push(descricao);
      paramCount++;
    }

    query += ` WHERE id = $${paramCount} RETURNING *`;
    values.push(id);

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async excluir(id) {
    const query = 'DELETE FROM disciplinas WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async buscarPorId(id) {
    const query = `
      SELECT d.*, 
             u.nome_completo as professor_nome,
             un.nome as universidade,
             c.nome as curso
      FROM disciplinas d
      LEFT JOIN usuarios u ON d.professor_id = u.id
      LEFT JOIN universidades un ON d.universidade_id = un.id
      LEFT JOIN cursos c ON d.curso_id = c.id
      WHERE d.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Disciplina;
