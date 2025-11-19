const db = require('./database');

function popularDadosIniciais() {
  // Verificar se já existem usuários
  db.query('SELECT COUNT(*) as total FROM usuarios', (err, results) => {
    if (err) {
      console.error('Erro ao verificar usuários:', err.message);
      return;
    }

    if (results[0].total > 0) {
      console.log('✓ Dados iniciais já existem');
      return;
    }

    console.log('Populando dados iniciais...');

    // Inserir usuários iniciais
    const usuarios = [
      ['Admin Sistema', 'admin@unifei.edu.br', 'admin123', 1, 1, 'Professor'],
      ['Professor João Silva', 'joao.silva@unifei.edu.br', 'prof123', 1, 1, 'Professor'],
      ['Aluno Maria Santos', 'maria.santos@unifei.edu.br', 'aluno123', 1, 3, 'Aluno']
    ];

    let completed = 0;
    usuarios.forEach(usuario => {
      db.query(
        'INSERT INTO usuarios (nome_completo, email, senha_hash, curso_id, periodo, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?)',
        usuario,
        (err, result) => {
          if (err) {
            console.error('Erro ao inserir usuário:', err.message);
          } else {
            completed++;
            if (completed === usuarios.length) {
              console.log('✓ Usuarios iniciais criados com sucesso');
            }
          }
        }
      );
    });
  });
}

module.exports = { popularDadosIniciais };
