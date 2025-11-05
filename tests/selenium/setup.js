const pool = require('../../src/config/database');

async function limparBancoDeTestes() {
  try {
    await pool.query("DELETE FROM disciplinas WHERE codigo LIKE 'TST%' OR codigo LIKE 'AUTO%'");
    await pool.query("DELETE FROM usuarios WHERE email LIKE '%selenium%'");
    console.log('✅ Dados de teste removidos do banco');
  } catch (error) {
    console.error('Erro ao limpar banco:', error.message);
  }
}

module.exports = { limparBancoDeTestes };
