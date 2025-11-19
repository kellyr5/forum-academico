const API = 'http://localhost:3000/api';

function ativarAba(abaId) {
  const sections = document.querySelectorAll('.content-section');
  const links = document.querySelectorAll('.tab-link');
  
  sections.forEach(s => s.classList.remove('active'));
  links.forEach(l => l.classList.remove('active'));
  
  const secao = document.getElementById(abaId);
  const link = document.querySelector('[data-tab="' + abaId + '"]');
  
  if (secao) secao.classList.add('active');
  if (link) link.classList.add('active');
  
  if (abaId === 'arquivos') {
    carregarArquivos();
  }
}

document.querySelectorAll('.tab-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    ativarAba(this.getAttribute('data-tab'));
  });
});

// RECADOS
document.getElementById('form-recado').addEventListener('submit', function(e) {
  e.preventDefault();
  fetch(API + '/recados', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titulo: document.getElementById('recado-titulo').value,
      conteudo: document.getElementById('recado-conteudo').value,
      usuario_id: parseInt(document.getElementById('recado-usuario').value),
      tipo_aviso: document.getElementById('recado-tipo').value
    })
  }).then(r => r.json()).then(() => {
    alert('Recado publicado');
    document.getElementById('form-recado').reset();
    carregarRecados();
  }).catch(e => alert('Erro: ' + e.message));
});

// USUARIOS
document.getElementById('form-usuario').addEventListener('submit', function(e) {
  e.preventDefault();
  fetch(API + '/usuarios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome_completo: document.getElementById('usuario-nome').value,
      email: document.getElementById('usuario-email').value,
      senha_hash: document.getElementById('usuario-senha').value,
      curso_id: parseInt(document.getElementById('usuario-curso').value),
      periodo: parseInt(document.getElementById('usuario-periodo').value),
      tipo_usuario: document.getElementById('usuario-tipo').value
    })
  }).then(r => r.json()).then(() => {
    alert('Usuário cadastrado');
    document.getElementById('form-usuario').reset();
    carregarUsuarios();
  }).catch(e => alert('Erro: ' + e.message));
});

// DISCIPLINAS
document.getElementById('form-disciplina').addEventListener('submit', function(e) {
  e.preventDefault();
  fetch(API + '/disciplinas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nome: document.getElementById('disciplina-nome').value,
      codigo: document.getElementById('disciplina-codigo').value,
      curso_id: parseInt(document.getElementById('disciplina-curso').value),
      professor_id: parseInt(document.getElementById('disciplina-professor').value)
    })
  }).then(r => r.json()).then(() => {
    alert('Disciplina cadastrada');
    document.getElementById('form-disciplina').reset();
    carregarDisciplinas();
  }).catch(e => alert('Erro: ' + e.message));
});

// TOPICOS
document.getElementById('form-topico').addEventListener('submit', function(e) {
  e.preventDefault();
  fetch(API + '/topicos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      titulo: document.getElementById('topico-titulo').value,
      conteudo: document.getElementById('topico-conteudo').value,
      disciplina_id: parseInt(document.getElementById('topico-disciplina').value),
      usuario_id: parseInt(document.getElementById('topico-usuario').value),
      categoria_id: parseInt(document.getElementById('topico-categoria').value)
    })
  }).then(r => r.json()).then(() => {
    alert('Tópico criado');
    document.getElementById('form-topico').reset();
    carregarTopicos();
  }).catch(e => alert('Erro: ' + e.message));
});

// RESPOSTAS
document.getElementById('form-resposta').addEventListener('submit', function(e) {
  e.preventDefault();
  fetch(API + '/respostas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      conteudo: document.getElementById('resposta-conteudo').value,
      topico_id: parseInt(document.getElementById('resposta-topico').value),
      usuario_id: parseInt(document.getElementById('resposta-usuario').value)
    })
  }).then(r => r.json()).then(() => {
    alert('Resposta registrada');
    document.getElementById('form-resposta').reset();
    carregarRespostas();
  }).catch(e => alert('Erro: ' + e.message));
});

// ARQUIVOS
document.getElementById('form-arquivo').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const fileInput = document.getElementById('arquivo-file');
  const usuarioId = document.getElementById('arquivo-usuario').value;
  const topicoId = document.getElementById('arquivo-topico').value;
  const respostaId = document.getElementById('arquivo-resposta').value;
  
  if (!fileInput.files[0]) {
    alert('Selecione um arquivo');
    return;
  }
  
  const formData = new FormData();
  formData.append('arquivo', fileInput.files[0]);
  formData.append('usuario_id', usuarioId);
  if (topicoId) formData.append('topico_id', topicoId);
  if (respostaId) formData.append('resposta_id', respostaId);
  
  const progressBar = document.getElementById('progress-bar');
  const uploadProgress = document.getElementById('upload-progress');
  uploadProgress.style.display = 'block';
  progressBar.style.width = '50%';
  progressBar.textContent = '50%';
  
  fetch(API + '/arquivos', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => { throw new Error(err.error); });
    }
    return response.json();
  })
  .then(data => {
    progressBar.style.width = '100%';
    progressBar.textContent = '100%';
    
    setTimeout(() => {
      alert('Arquivo enviado com sucesso!');
      document.getElementById('form-arquivo').reset();
      uploadProgress.style.display = 'none';
      progressBar.style.width = '0%';
      progressBar.textContent = '0%';
      carregarArquivos();
    }, 500);
  })
  .catch(error => {
    alert('Erro ao enviar arquivo: ' + error.message);
    uploadProgress.style.display = 'none';
    progressBar.style.width = '0%';
    progressBar.textContent = '0%';
  });
});

// FUNÇÕES DE DELETAR
function deletarRecado(id) {
  if (confirm('Deletar recado?')) {
    fetch(API + '/recados/' + id, { method: 'DELETE' })
      .then(r => r.json())
      .then(() => carregarRecados())
      .catch(e => alert('Erro: ' + e.message));
  }
}

function deletarUsuario(id) {
  if (confirm('Deletar usuário? Isso também deletará todos os dados relacionados.')) {
    fetch(API + '/usuarios/' + id, { method: 'DELETE' })
      .then(r => r.json())
      .then(() => carregarUsuarios())
      .catch(e => alert('Erro: ' + e.message));
  }
}

function deletarDisciplina(id) {
  if (confirm('Deletar disciplina?')) {
    fetch(API + '/disciplinas/' + id, { method: 'DELETE' })
      .then(r => r.json())
      .then(() => carregarDisciplinas())
      .catch(e => alert('Erro: ' + e.message));
  }
}

function deletarTopico(id) {
  if (confirm('Deletar tópico?')) {
    fetch(API + '/topicos/' + id, { method: 'DELETE' })
      .then(r => r.json())
      .then(() => carregarTopicos())
      .catch(e => alert('Erro: ' + e.message));
  }
}

function deletarResposta(id) {
  if (confirm('Deletar resposta?')) {
    fetch(API + '/respostas/' + id, { method: 'DELETE' })
      .then(r => r.json())
      .then(() => carregarRespostas())
      .catch(e => alert('Erro: ' + e.message));
  }
}

function deletarArquivo(id) {
  if (confirm('Tem certeza que deseja deletar este arquivo?')) {
    fetch(API + '/arquivos/' + id, { method: 'DELETE' })
      .then(r => r.json())
      .then(() => {
        alert('Arquivo deletado com sucesso!');
        carregarArquivos();
      })
      .catch(e => alert('Erro ao deletar arquivo: ' + e.message));
  }
}

function votarResposta(respostaId, voto) {
  const usuarioId = 2;
  fetch(API + '/votos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resposta_id: respostaId,
      usuario_id: usuarioId,
      voto: voto
    })
  }).then(r => r.json()).then(() => {
    carregarRespostas();
  }).catch(e => alert('Erro ao votar: ' + e.message));
}

// FUNÇÕES DE CARREGAR - SEM EMOJIS
function getTipoAvisoBadge(tipo) {
  const badges = {
    'importante': '<span style="background: #f44336; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">IMPORTANTE</span>',
    'evento': '<span style="background: #2196F3; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">EVENTO</span>',
    'geral': '<span style="background: #4CAF50; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">GERAL</span>',
    'aviso_faculdade': '<span style="background: #FF9800; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">FACULDADE</span>'
  };
  return badges[tipo] || '';
}

function carregarRecados() {
  fetch(API + '/recados').then(r => r.json()).then(data => {
    const elem = document.getElementById('recados-lista');
    if (!elem) return;
    if (!data || data.length === 0) {
      elem.innerHTML = '<p>Nenhum recado.</p>';
    } else {
      elem.innerHTML = data.map(r => '<div><strong>' + r.titulo + '</strong> ' + getTipoAvisoBadge(r.tipo_aviso) + '<p>' + r.conteudo + '</p><button class="btn-delete" onclick="deletarRecado(' + r.id + ')">Deletar</button></div>').join('');
    }
  }).catch(e => console.error(e));
}

function carregarUsuarios() {
  fetch(API + '/usuarios').then(r => r.json()).then(data => {
    const elem = document.getElementById('usuarios-lista');
    if (!elem) return;
    if (!data || data.length === 0) {
      elem.innerHTML = '<p>Nenhum usuário.</p>';
    } else {
      elem.innerHTML = data.map(u => '<div><strong>' + u.nome_completo + '</strong><p>Email: ' + u.email + ' | Tipo: ' + u.tipo_usuario + '</p><button class="btn-delete" onclick="deletarUsuario(' + u.id + ')">Deletar</button></div>').join('');
    }
  }).catch(e => console.error(e));
}

function carregarDisciplinas() {
  fetch(API + '/disciplinas').then(r => r.json()).then(data => {
    const elem = document.getElementById('disciplinas-lista');
    if (!elem) return;
    if (!data || data.length === 0) {
      elem.innerHTML = '<p>Nenhuma disciplina.</p>';
    } else {
      elem.innerHTML = data.map(d => '<div><strong>' + d.nome + '</strong><p>Código: ' + d.codigo + '</p><button class="btn-delete" onclick="deletarDisciplina(' + d.id + ')">Deletar</button></div>').join('');
    }
  }).catch(e => console.error(e));
}

function carregarTopicos() {
  fetch(API + '/topicos').then(r => r.json()).then(data => {
    const elem = document.getElementById('topicos-lista');
    if (!elem) return;
    if (!data || data.length === 0) {
      elem.innerHTML = '<p>Nenhum tópico.</p>';
    } else {
      elem.innerHTML = data.map(t => '<div><strong>' + t.titulo + '</strong><p>' + t.conteudo.substring(0, 100) + '...</p><p style="font-size:12px; color:#666;"><strong>Status:</strong> ' + (t.status || 'Aberto') + '</p><button class="btn-delete" onclick="deletarTopico(' + t.id + ')">Deletar</button></div>').join('');
    }
  }).catch(e => console.error(e));
}

function carregarRespostas() {
  fetch(API + '/respostas').then(r => r.json()).then(data => {
    const elem = document.getElementById('respostas-lista');
    if (!elem) return;
    if (!data || data.length === 0) {
      elem.innerHTML = '<p>Nenhuma resposta.</p>';
    } else {
      elem.innerHTML = data.map(r => 
        '<div>' +
          '<p>' + r.conteudo + '</p>' +
          '<div class="resposta-footer">' +
            '<span class="voto-count">Votos: 0</span>' +
            '<div class="vote-buttons">' +
              '<button class="btn-vote btn-positive" onclick="votarResposta(' + r.id + ', 1)">Positivo</button>' +
            '</div>' +
            '<button class="btn-delete" onclick="deletarResposta(' + r.id + ')">Deletar</button>' +
          '</div>' +
        '</div>'
      ).join('');
    }
  }).catch(e => console.error(e));
}

function formatarTamanho(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function getIconeArquivo(tipo) {
  if (tipo.startsWith('image/')) return '[IMG]';
  if (tipo === 'application/pdf') return '[PDF]';
  if (tipo.includes('word')) return '[DOC]';
  if (tipo.includes('excel') || tipo.includes('spreadsheet')) return '[XLS]';
  if (tipo === 'text/plain') return '[TXT]';
  if (tipo === 'application/zip') return '[ZIP]';
  return '[FILE]';
}

function carregarArquivos() {
  fetch(API + '/arquivos')
    .then(r => r.json())
    .then(data => {
      const elem = document.getElementById('arquivos-lista');
      if (!elem) return;
      
      if (!data || data.length === 0) {
        elem.innerHTML = '<p style="text-align: center; color: #666; padding: 40px; font-style: italic;">Nenhum arquivo carregado ainda. Faca upload do primeiro arquivo!</p>';
        return;
      }
      
      elem.innerHTML = data.map(arquivo => {
        const icone = getIconeArquivo(arquivo.tipo_mime);
        const tamanho = formatarTamanho(arquivo.tamanho);
        const data_upload = new Date(arquivo.criado_em).toLocaleString('pt-BR');
        const isImage = arquivo.tipo_mime.startsWith('image/');
        
        return `
          <div class="arquivo-item" data-nome="${arquivo.nome_original.toLowerCase()}">
            <div class="arquivo-info">
              <div class="arquivo-icone">${icone}</div>
              <div class="arquivo-detalhes">
                <strong>${arquivo.nome_original}</strong>
                <p>
                  <span style="color: #666;">${tamanho}</span> | 
                  <span style="color: #666;">${arquivo.autor_nome}</span> | 
                  <span style="color: #666;">${data_upload}</span>
                </p>
                ${arquivo.topico_id ? `<span class="badge badge-topico">Topico #${arquivo.topico_id}</span>` : ''}
                ${arquivo.resposta_id ? `<span class="badge badge-resposta">Resposta #${arquivo.resposta_id}</span>` : ''}
              </div>
            </div>
            ${isImage ? `
              <div class="arquivo-preview">
                <img src="${API}/arquivos/download/${arquivo.nome_arquivo}" 
                     alt="${arquivo.nome_original}"
                     style="max-width: 200px; max-height: 150px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              </div>
            ` : ''}
            <div class="arquivo-acoes">
              <a href="${API}/arquivos/download/${arquivo.nome_arquivo}" 
                 target="_blank" 
                 class="btn-download"
                 title="Baixar/Visualizar">
                Download
              </a>
              <button class="btn-delete" 
                      onclick="deletarArquivo(${arquivo.id})"
                      title="Deletar arquivo">
                Deletar
              </button>
            </div>
          </div>
        `;
      }).join('');
      
      const filtroInput = document.getElementById('filtro-arquivo');
      if (filtroInput) {
        filtroInput.addEventListener('input', function(e) {
          const filtro = e.target.value.toLowerCase();
          const items = document.querySelectorAll('.arquivo-item');
          
          items.forEach(item => {
            const nome = item.getAttribute('data-nome');
            if (nome.includes(filtro)) {
              item.style.display = 'flex';
            } else {
              item.style.display = 'none';
            }
          });
        });
      }
    })
    .catch(e => {
      console.error('Erro ao carregar arquivos:', e);
      const elem = document.getElementById('arquivos-lista');
      if (elem) {
        elem.innerHTML = '<p style="text-align: center; color: #d32f2f; padding: 40px;">Erro ao carregar arquivos. Verifique se o servidor esta rodando.</p>';
      }
    });
}

// INICIALIZAÇÃO
document.addEventListener('DOMContentLoaded', function() {
  carregarRecados();
  carregarUsuarios();
  carregarDisciplinas();
  carregarTopicos();
  carregarRespostas();
  carregarArquivos();
  ativarAba('mural');
});
