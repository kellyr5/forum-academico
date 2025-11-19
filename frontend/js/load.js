const API = 'http://localhost:3000/api';

function carregarRecados() {
  fetch(API + '/recados').then(r => r.json()).then(data => {
    const elem = document.getElementById('recados-lista');
    if (!elem) return;
    elem.innerHTML = (!data || data.length === 0) ? '<p>Nenhum recado publicado.</p>' : 
      data.map(r => '<div><strong>' + r.titulo + '</strong><p>' + r.conteudo + '</p><button class="btn-delete" onclick="deletarRecado(' + r.id + ')">Remover</button></div>').join('');
  });
}

function carregarUsuarios() {
  fetch(API + '/usuarios').then(r => r.json()).then(data => {
    const elem = document.getElementById('usuarios-lista');
    if (!elem) return;
    elem.innerHTML = (!data || data.length === 0) ? '<p>Nenhum usuário cadastrado.</p>' :
      data.map(u => '<div><strong>' + u.nome_completo + '</strong><p>Email: ' + u.email + ' | Tipo: ' + u.tipo_usuario + '</p><button class="btn-delete" onclick="deletarUsuario(' + u.id + ')">Remover</button></div>').join('');
  });
}

function carregarDisciplinas() {
  fetch(API + '/disciplinas').then(r => r.json()).then(data => {
    const elem = document.getElementById('disciplinas-lista');
    if (!elem) return;
    elem.innerHTML = (!data || data.length === 0) ? '<p>Nenhuma disciplina cadastrada.</p>' :
      data.map(d => '<div><strong>' + d.nome + '</strong><p>Código: ' + d.codigo + '</p><button class="btn-delete" onclick="deletarDisciplina(' + d.id + ')">Remover</button></div>').join('');
  });
}

function carregarTopicos() {
  fetch(API + '/topicos').then(r => r.json()).then(data => {
    const elem = document.getElementById('topicos-lista');
    if (!elem) return;
    elem.innerHTML = (!data || data.length === 0) ? '<p>Nenhum tópico criado.</p>' :
      data.map(t => '<div><strong>' + t.titulo + '</strong><p>' + t.conteudo.substring(0, 150) + '...</p><p style="font-size:12px; color:#999;">Status: ' + t.status + '</p><button class="btn-delete" onclick="deletarTopico(' + t.id + ')">Remover</button></div>').join('');
  });
}

function carregarRespostas() {
  fetch(API + '/respostas').then(r => r.json()).then(data => {
    const elem = document.getElementById('respostas-lista');
    if (!elem) return;
    elem.innerHTML = (!data || data.length === 0) ? '<p>Nenhuma resposta registrada.</p>' :
      data.map(r => '<div><p>' + r.conteudo + '</p><p style="font-size:12px; color:#999;">Tópico #' + r.topico_id + ' | Usuário #' + r.usuario_id + '</p><button class="btn-delete" onclick="deletarResposta(' + r.id + ')">Remover</button></div>').join('');
  });
}

function carregarCategorias() {
  fetch(API + '/categorias').then(r => r.json()).then(data => {
    const elem = document.getElementById('categorias-lista');
    if (!elem) return;
    elem.innerHTML = (!data || data.length === 0) ? '<p>Nenhuma categoria disponível.</p>' :
      data.map(c => '<div><strong>' + c.nome + '</strong><p>' + c.descricao + '</p><button class="btn-delete" onclick="deletarCategoria(' + c.id + ')">Remover</button></div>').join('');
  });
}

function carregarVotos() {
  fetch(API + '/votos').then(r => r.json()).then(data => {
    const elem = document.getElementById('votos-lista');
    if (!elem) return;
    elem.innerHTML = (!data || data.length === 0) ? '<p>Nenhum voto registrado.</p>' :
      data.map(v => '<div><p>Resposta #' + v.resposta_id + ' | Usuário #' + v.usuario_id + ' | Voto: ' + (v.voto > 0 ? 'Positivo' : 'Negativo') + '</p><button class="btn-delete" onclick="deletarVoto(' + v.id + ')">Remover</button></div>').join('');
  });
}
